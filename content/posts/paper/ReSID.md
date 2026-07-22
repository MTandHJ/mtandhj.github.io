---
date: "2026-07-22"
draft: false
title: "Rethinking Generative Recommender Tokenizer: Recsys-Native Encoding and Semantic Quantization Beyond LLMs"
description: "从信息论角度剖析 SID 的设计理念"
author: MTandHJ
tags:
  - Paper
  - Sequential Recommendation
  - Generative
  - Vector Quantization
  - Empirical
  - arXiv
  - 2026
pinned: false
---

## 研究背景

- (**Generative Recommendation**) 生成式推荐的核心是把 item 表示成一串离散 token, 然后把 next-item prediction 改写成 autoregressive generation. 典型路线如 [TIGER](/posts/tiger/), 先用文本或多模态模型得到 item embedding, 再用 [RQ-VAE](/posts/rq-vae/) 或层次聚类得到 semantic ID.

- (**Semantic-centric Pipeline 的错位**) 现有的方法多半直接基于 semantic embeddings 进行处理, 显然忽视了推荐中较为重要的协同信息. 工业界 (如 [OneRec](/posts/onerec/)) 通常会对 encoder 进行初步的推荐任务层面的微调.

- (**Quantization 的另一个错位**) 现有量化方法还会带来 autoregressive decoding 上的不友好. RQ-VAE 更关注 reconstruction error, hierarchical K-Means 虽然有层次结构, 但不同 parent 下的 child index 往往是局部、任意分配的. 这会导致同一层的同一个 code 在不同 prefix 下表达不同含义, 从而增加生成模型逐 token 解码的歧义.

- (**符号说明**)
    - **用户历史:** $H = (i_1, i_2, \ldots, i_{T-1})$, 目标是预测下一个 item $i_T$;
    - **结构化特征:** item $i_t$ 对应 $J$ 个 fields, 记作 $F_t = \{ f_t^{(1)}, f_t^{(2)}, \ldots, f_t^{(J)} \}$;
    - **Semantic ID:** item $i_t$ 的离散编码为 $C_t = (c_1, c_2, \ldots, c_L)$, 其中 $L$ 是 SID 的层数 / 长度;
    - **E-stage:** encoder $E_{\theta}$ 将 item 信息映射为连续表示 $z_t$;
    - **Q-stage:** quantizer $Q$ 将连续表示离散化为 SID, 即 $C_t = Q(z_t)$;
    - **G-stage:** generative recommender $G_{\phi}$ 根据历史 SID 生成目标 SID $C_T$;
    - **GAOQ:** 第 $l$ 层的 parent centroid 记作 $\mu$, child centroid 记作 $\mu_j$, 全局 anchor 记作 $a_k$.



## 核心思想

![20260722113223](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260722113223.png)

### ReSID 的三阶段视角

- ReSID 仍然遵循 E-stage / Q-stage / G-stage:
    1. **E-stage:** 学 item representation;
    2. **Q-stage:** 把 representation 离散成 SID;
    3. **G-stage:** 用 T5-style encoder-decoder 生成目标 item 的 SID.

- 论文的关键判断是: SID supervision 有自指性. 也就是说, tokenizer 生成的 SID 既是中间表示, 又是 generative model 的训练目标. 如果 E/Q 阶段产生的 code 不稳定、不保留协同信息, G-stage 很难在下游自动修正.

### Field-Aware Masked Auto-Encoding

- (**FAMAE**) ReSID 不依赖 LLM embedding, 而是直接使用推荐系统中的 structured feature fields, 例如 item ID、store ID、多级 category ID. 给定用户历史和目标 item 的 fields, FAMAE 随机 mask 目标 item 的部分 fields, 然后要求模型根据历史和剩余 fields 预测被 mask 的 fields:

    $$
    \mathcal{L}_{\text{FAMAE}}(\theta)
    =
    \mathbb{E}_{M \sim \pi}
    \left[
        \sum_{k \in M}
        \alpha_k
        \cdot
        \left(
            - \log q_{\theta,k}(f_T^{(k)} | h_T)
        \right)
    \right].
    $$

- 这个目标的直觉是: item representation 应该首先保留能帮助推荐的 structured information, 而不是先对齐到通用语义空间. 论文从 mutual information 的角度说明, 优化 FAMAE 可以提高 learned representation 和目标 item fields 之间互信息的一个下界.

- 一个细节值得注意: 用于 SID quantization 的不是上下文化后的 $h_T$, 而是目标 item 的 field-level embedding $e_T$. 因为 $h_T$ 混入了用户历史, 更适合预测; 但 SID 应该是 item 自身的稳定标识, 不应该随用户上下文变化.

### Globally Aligned Orthogonal Quantization

![20260722113307](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260722113307.png)

- (**GAOQ**) Q-stage 的目标不是单纯压缩 embedding, 而是生成对 autoregressive decoding 更友好的 SID. ReSID 用层次化 balanced K-Means 控制每一层 code 的容量, 同时用 global alignment 减少不同 prefix 下 code 含义不一致的问题.

- GAOQ 在每个非根层大致做三步:
    1. 在每个 parent cluster 下**独立执行** balanced K-Means, 得到 child clusters;
    2. 将 child centroid 减去 parent centroid, 得到相对方向;
    3. 把这些方向和一组**全局共享的近似正交** anchors 做 Hungarian matching, 让同一层的 index 在不同 parent 下尽量对应相似方向.

- 这样做的结果是, SID 中的 token 不只是局部编号, 而更接近一种 prefix-invariant 的方向标记. 对生成模型来说, 这会降低逐层生成时的不确定性.

**注:** 作者列出的算法容易产生误解, orthonormal anchors 是 level-wise 的. 由于 GAOQ 是对于每个 parent code 下的 items 单独进行 kmeans 的, 因此难以保证不同 parent code 下新生成的序是匹配的 (此 1 非彼 1). 因此, GAOQ 对每个 level 生成 global orthonormal anchors (纯随机生成), 从而不同的 kmeans 通过匈牙利算法 (Hungarian matching) 来生成一致的序.

## 继往开来

- 其实协同信息的注入是老生常谈的问题, 本人觉得 ReSID 从信息论的角度去看到 SID 和其它变量的关系有可取之处. 另外 GAOQ 的 Hungarian matching 是挺有趣的点.

## 附录

### 匈牙利匹配算法

- (**线性分配问题**) 匈牙利匹配算法 (Hungarian algorithm) 用来求解一类一对一分配问题. 给定一个权重矩阵 $\mathbf{W} \in \mathbb{R}^{n \times n}$, 其中 $W_{j,k}$ 表示把第 $j$ 个对象分配给第 $k$ 个对象的收益, 我们希望找到一个排列 $\pi$:

    $$
    \max_{\pi}
    \sum_{j=1}^{n} W_{j,\pi(j)}.
    $$

    约束是每个 $j$ 只能匹配一个 $\pi(j)$, 每个 $k$ 也最多被使用一次. 如果矩阵不是方阵, 通常可以通过 padding dummy rows / columns 转成方阵, 或直接使用 rectangular assignment 的实现.

- (**在 GAOQ 中的作用**) 对于某个 parent cluster, GAOQ 先做 balanced K-Means 得到 $b_l$ 个 child clusters, 然后计算它们相对 parent centroid 的方向:

    $$
    \bar{\mu}_j = \mu_j - \mu.
    $$

    接着, 将这些相对方向和当前 level 的全局 anchors $\{a_k\}_{k=1}^{g_l}$ 计算 cosine similarity:

    $$
    W_{j,k} = \cos(\bar{\mu}_j, a_k).
    $$

    匈牙利匹配用于寻找一个 injective assignment $m(j)$:

    $$
    \max_{m}
    \sum_{j=1}^{b_l} W_{j,m(j)},
    \quad
    m(j_1) \neq m(j_2), \text{ if } j_1 \neq j_2.
    $$

- (**为什么需要它**) 如果直接使用 hierarchical K-Means, 每个 parent 下的 child index 是局部编号, 不同 parent 下的 `1` 未必有相同含义. GAOQ 用全局 anchors 作为共同参照系, 再用匈牙利匹配把每个 parent 内部的 child clusters 对齐到这些 anchors. 这样同一 level 的 code index 更接近共享语义方向, 从而减少 prefix-dependent ambiguity.

## 参考文献

<ol class="reference">
  <li>
    Liang Y., Zhang Z., Zhu Y., Zhang K., Guo Z., Zhou W., Yang Z., Wu K., Ni Y., Zeng A., Fu C., Wang J. and Xia J.
    <u>Rethinking Generative Recommender Tokenizer: Recsys-Native Encoding and Semantic Quantization Beyond LLMs.</u>
    <i>arXiv</i>, 2026.
    <a href="https://arxiv.org/pdf/2602.02338.pdf" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/FuCongResearchSquad/ReSID" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
</ol>
