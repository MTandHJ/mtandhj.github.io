---
date: "2026-09-03"
draft: false
title: "SEQUOIA: Scalable and Robust Speculative Decoding"
description: "用动态规划优化 token tree, 以无放回采样提高验证鲁棒性"
author: MTandHJ
tags:
  - Paper
  - LLM
  - Autoregressive
  - Optimization
  - Empirical
  - NeurIPS
  - 2024
pinned: false
---

## 研究背景

- (**投机解码的收益来源**) 在小 batch 的自回归推理中, 每生成一个 token 都需要访问大量模型参数, 推理往往受内存带宽限制. [Speculative Decoding](/posts/speculative-decoding/) 利用小模型提前生成候选, 再用大模型一次并行验证, 将一次权重访问的成本分摊到多个输出 token 上. CPU-GPU offloading 的数据搬运成本更高, 因而更有动力增加每轮有效产出.

- (**从多序列到 token tree**) [SpecTr](/posts/spectr/) 将单条候选序列扩展为多条候选序列. 更一般地, 候选可以组织成一棵 [token tree](/posts/specinfer/): 每条根到节点的路径代表一个可能的后续前缀. 增加兄弟节点是在同一位置预备更多选择, 增加深度则是在当前选择成功后继续向前生成.

- (**核心问题**) 候选预算增加, 不代表有效产出同比增加. 固定的链或满分叉树可能将预算分配到很少被访问的位置. SEQUOIA 首先通过动态规划优化**候选树的形状**, 在给定预算下提高每轮有效产出; 其次使用**无放回采样**, 减少重复候选带来的浪费.

- (**符号说明**)

  - $\mathcal{T}$: 候选树; $n$: 包含根节点的节点总数; $F(\mathcal{T})$: 一轮验证的期望生成 token 数.
  - $\alpha_j$: 在父节点已被接受的条件下, 最终接受其第 $j$ 个 child 的概率.
  - $p(x)$: draft distribution; $q(x)$: target distribution. 沿用 SpecTr 笔记的记号, 因而用 $\alpha_j$ 代替 SEQUOIA 原论文的分支接受概率 $p_j$, 避免混淆.

## 核心思想

![20260907181639](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260907181639.png)

SEQUOIA 首先解决 **给定节点预算, 如何构建期望产出最高的 token tree**. 关键是将树形优劣转化为可计算的节点收益, 再通过动态规划分配子树预算. 在此基础上, 无放回采样进一步减少重复候选, 提高验证的鲁棒性.

### 为什么需要优化树形?

- (**计算框架不变**) SEQUOIA 沿用 SpecInfer 的树状并行验证框架: 将树展开, 通过 tree attention mask 隔离不同分支, 一次 target forward 计算各前缀下的条件分布. 每轮最终只沿一条被接受的路径输出, 其他分支的计算则成为备用开销. 因而需要优化的是**哪些位置值得分配候选节点**, 而不是重新设计树的并行计算方式.

- (**宽度与深度的权衡**) 增加兄弟节点, 提供当前候选失败后的补救机会; 增加后代节点, 提供当前候选成功后继续生成的机会. 单链缺少补救分支, 满分叉树又会迅速耗尽节点预算, 难以延伸到足够深的位置. 因此, 更高效的树应根据各分支被接受的概率, 分配不同的宽度和深度.

- (**优化目标**) 固定总节点数 $n$, 用 $F(\mathcal{T})$ 表示一轮验证的期望生成 token 数, 则目标为

  $$
  \tag{1}
  \mathcal{T}^*
  \in
  \arg\max_{\mathcal{T}:\,|\mathcal{T}|=n}F(\mathcal{T}).
  $$

  这里的收益是最终输出的 token 数, 而不是提出或验证的候选数. 下一步就是将 $F$ 写成可以比较不同树形的表达式.

### 用节点访问概率定义树的收益

- (**Positional acceptance 假设**) 假设 $\alpha_j$ 只取决于 child 的位置 $j$, 而不依赖具体前缀与 token 内容. 它表示在父节点已被接受的条件下, **最终选择第 $j$ 个 child** 的概率, 已经包含前 $j-1$ 个兄弟候选均被拒绝的影响. 因此, 它不是单独检查第 $j$ 个候选时的条件接受率, 且有 $\sum_{j=1}^b\alpha_j\le1$. 这些概率由代表性数据上的验证结果估计, 不是直接取模型 softmax 中的 token 概率.

- (**节点分数**) 对节点 $v$, 记根到 $v$ 路径上的 child index 列表为 $\mathrm{Path}(v)$, 则在该假设下,

  $$
  \tag{2}
  f(v)=\prod_{j\in\mathrm{Path}(v)}\alpha_j,
  \qquad f(\mathrm{root})=1.
  $$

  例如, 根的第 $2$ 个 child 的第 $3$ 个 child, 分数为 $\alpha_2\alpha_3$. 每深入一层, 都要乘上继续沿该分支前进的概率. 因而 $f(v)$ 表示该候选最终被接受的概率, 也就是为它分配一个节点带来的期望 token 收益.

- (**整棵树的期望产出**) 每个被接受的非根节点贡献一个 draft token, 每轮还会生成一个残差或叶节点后的额外 token. 对各节点的贡献取期望并求和, 得到

  $$
  \tag{3}
  F(\mathcal{T})
  =
  1+\sum_{v\ne\mathrm{root}}f(v)
  =
  \sum_{v\in\mathcal{T}}f(v).
  $$

  这里沿用论文的计数方式, 树大小包含根节点. 根代表已有前缀, 其分数 $1$ 用于计入每轮必有的那个额外输出 token, 不表示将已有前缀重复输出.

- (**直观例子**) 假设 $\alpha_1=0.6,\alpha_2=0.25$. 同样使用 $3$ 个节点, 即根加两个候选, 形成一条链的收益为 $1+0.6+0.6^2=1.96$, 根下放两个兄弟节点的收益为 $1+0.6+0.25=1.85$. 此时延伸第一分支更有价值. 若 $\alpha_2$ 提高到 $0.4$, 则第二种树的收益变为 $2.0$, 应优先增加宽度. **树形由接受概率决定, 不能固定地认为越深或越宽越好.**

### Dynamic Programming: 分配子树预算

- (**状态定义**) 令 $T(n,b)$ 表示节点总数为 $n$, 根恰有 $b$ 个 children 的树所能取得的最大 $F$. 限制每个节点最多有 $B$ 个 children, 并记

  $$
  G(n)=\max_{0\le b\le B}T(n,b).
  $$

  基础状态为 $T(1,0)=1$, 不合法状态设为 $-\infty$. $T$ 用于逐个增加根分支, $G$ 则表示不限定根分支数时的最优收益.

- (**拆分子树**) 将第 $b$ 个 child 及其后代单独划为一棵大小为 $m$ 的子树, 原问题分成两部分:

  1. 剩余树有 $n-m$ 个节点, 根有 $b-1$ 个 children, 最优收益为 $T(n-m,b-1)$.
  2. 新增子树有 $m$ 个节点, 内部最优收益为 $G(m)$. 但只有进入第 $b$ 个分支时才能获得这份收益, 因而对整棵树的贡献为 $\alpha_bG(m)$.

  枚举分给新增子树的节点数 $m$, 就得到递推:

  $$
  \tag{4}
  T(n,b)
  =
  \max_{1\le m\le n-1}
  \left[
  T(n-m,b-1)+\alpha_bG(m)
  \right].
  $$

- (**为什么可以独立优化子树?**) 在 positional acceptance 假设下, 进入子树的概率只是一个外部乘数 $\alpha_b$, 子树内部仍使用相同的接受向量. 因此, 给定 $m$ 后, 可以直接复用已经求出的 $G(m)$. 按节点数从小到大填表, 保存每个状态的最优划分, 最后回溯即可重建整棵树.

- (**深度约束与离线构建**) 树越深, draft 的串行生成成本通常越高. DP 可以增加深度状态, 在给定节点数和最大深度下寻找最优树; 也可以使用 $\alpha_{\ell,j}$ 描述不同深度的接受率, 对接 EAGLE 等 self-speculation 方法. 树形离线确定, 推理时只需按该结构生成候选并验证. 这里的最优性相对于给定 acceptance profile 和约束成立, 不代表任意上下文下都能获得最高实际加速比.

![20260907181816](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260907181816.png)

### 辅助改进: 无放回采样

- (**动机**) 树形决定节点预算放在哪里, 采样规则决定这些位置是否被重复候选占用. SEQUOIA 在 SpecInfer 的逐次残差验证上加入无放回采样: 同一父节点下, 每采样一个 token 就将其概率置零并重新归一化, 再生成下一个兄弟候选. 候选列表可以提前生成, 验证时按采样顺序检查, 不需要逐个等待 target forward.

- (**验证规则**) 令初始候选分布 $D_1=p$, 目标残差 $R_1=q$. 对第 $i$ 个候选 $s_i$, 以 $\min(1,R_i(s_i)/D_i(s_i))$ 的概率接受. 若拒绝, 更新

  $$
  R_{i+1}=\operatorname{norm}([R_i-D_i]_+),
  \qquad
  D_{i+1}=\operatorname{norm}\left(D_i\cdot\mathbb{I}(x\ne s_i)\right).
  $$

  目标残差使用本次的旧分布 $D_i$ 更新, 候选侧则删除 $s_i$. 若 draft 的非零支持耗尽, 改用尚未提出的 token 上的均匀分布; 若全部候选均被拒绝, 最后从 residual 采样. 接受与残差补齐仍保持最终输出分布为 $q$, 不再重复展开单候选证明.

- (**作用**) 一个 token 被拒绝后, 必有 $R_{i+1}(s_i)=0$, 再次提出它只会被继续拒绝. 无放回采样消除了这种浪费, 尤其有助于低温度下 draft 错误地集中于少数 token 的情况. 它改善接受率, 而前面的 DP 负责将这些接受机会组织成高收益的树形.

## 关键洞察

- (**可扩展性的理论保证**) 在 positional acceptance 假设下, 若拒绝全部 $k$ 个 children 的概率满足 $r_k\le k^{-\eta}$, 其中 $\eta > 0$, 论文 Theorem 3.6 给出

  $$
  G(n)\in\Omega\left(\frac{\eta\log n}{\log\log n}\right).
  $$

  这是附带假设的渐近**下界**, 不是精确的对数增长率, 更不是 wall-clock speedup 的无界增长保证. 它说明, 在允许树宽与树深随预算调整的抽象模型中, 最优树的有效产出不会像某些固定结构那样过早饱和.

- (**树形与验证的贡献被分开检验**) Figure 4 左图固定使用 SEQUOIA 验证, 仅改变树形: 在 Llama2-13B / JackFram-Llama-68M、CNN DailyMail、temperature $0.6$ 下, $512$ 节点的 SEQUOIA tree 比 $16$ 条独立链每轮最多多生成约 $33\%$ 的 token. 右图固定树形, 改变验证算法: 在 Llama2-7B / 同一 draft、CNN DailyMail 上, SEQUOIA 相对 SpecInfer 和 top-k sampling 的加速优势最高分别为 $1.65\times$ 和 $1.27\times$. 这些数字不能相乘来推算端到端收益.

- (**评测设置**) 论文每个实验使用 $200$ 个样本估计 acceptance vector, 再使用另外 $200$ 个样本评测, offloading 评测为 $50$ 个样本. 除 MT Bench 外, prompt 和生成长度均设为 $128$ tokens. 主要数据集为 C4、OpenWebText、CNN DailyMail 和 MT Bench.

- (**端到端结果**) 两个代表性结果如下, 均为论文特定配置下的测量值:

| 场景 | Target / Draft | 数据与温度 | 树配置 $(n,d)$ | 每 token 延迟 | 相对普通解码 | 相对表中 SpecInfer |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| A100 on-device | Llama2-7B / JF68M | C4, $T=0$ | $(128,10)$ | $6.0$ ms | $4.04\times$ | $1.17\times$ |
| L40 offloading | Llama3-70B-Instruct / Llama3-8B-Instruct | MT Bench, $T=0$ | $(768,18)$ | $0.60$ s | $9.5\times$ | $1.36\times$ |

  第一行普通解码基线为 Hugging Face 的 $24.2$ ms/token, 第二行为 DeepSpeed-Zero-Inference 的 $5.7$ s/token. SpecInfer 对照树分别为 $5\times8$ 和 $16\times48$ 的独立链. 因此, $4.04\times$ 和 $9.5\times$ 不是相对已有投机解码方法的加速倍数.

- (**实现与成本同样重要**) 论文实现还使用 CUDA Graphs 减少 kernel launch 开销, 并用 exponential-sort 加速无放回采样. 端到端结果包含这些工程选择, 不能全部归因于树形或某一个接受概率公式.

## 继往开来

- SEQUOIA 最值得关注的是将 token tree 的设计转化为可求解的预算分配问题: **先用节点访问概率衡量收益, 再通过 DP 决定各分支的宽度与深度**. 无放回采样则减少重复候选, 为树形优化提供更好的接受率.

- 实际限制在于 acceptance profile 依赖 draft/target 配对、温度、数据域与上下文. 离线 DP 可以精确优化这个简化模型, 但 profile 变化后, 原树未必仍然合适. 本文结果主要体现单请求延迟收益; 在 continuous batching 或高吞吐服务中, 还需要重新评估额外节点带来的算力与 KV cache 成本.

## 参考文献

<ol class="reference">
  <li>
    Chen Z., May A., Svirschevski R., Huang Y., Ryabinin M., Jia Z. and Chen B.
    <u>SEQUOIA: Scalable and Robust Speculative Decoding.</u>
    <i>Advances in Neural Information Processing Systems</i>, 2024.
    <a href="https://github.com/Infini-AI-Lab/Sequoia" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
</ol>
