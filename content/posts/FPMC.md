---
date: "2026-04-24"
draft: false
title: "Factorizing personalized Markov chains for next-basket recommendation"
description: "FPMC"
author: MTandHJ
tags:
  - Note
  - Recommendation
  - Sequential
  - Markov
  - Empirical
  - WWW
  - 2010
pinned: false
---

## 研究背景


![20260427100127](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260427100127.png)

- 用户 $u \in \mathcal{U}$ 会不断产生交易记录, 通常具有

  $$
  \mathcal{B}^u = (B_1^u, \ldots B_{t_u - 1}^u),
  $$

  这里 $B \subset \mathcal{I}$ 表示一些商品的集合. 即本文研究的是 next-basket recommendation 的问题, 假设用户一次可能会同时购买多个商品.

- FPMC 试图将 matrix factorization (MF) 的思想引入到序列推荐中, 实现个性化的转移矩阵概率估计.

## 核心思想

- FPMC 希望显式构建一个一阶马尔科夫模型:

  $$
  \tag{1}
  p(B_t^u|B_{t-1}^u).
  $$

  令 $a_{u, l, i} := p(i \in B_t^u| l \in B_{t-1}^u)$, 进一步假设

  $$
  \tag{2}
  p(i \in B_t^u| B_{t-1}^u) := \frac{1}{|B_{t-1}^u|} \sum_{l \in B_{t-1}^u} p(i \in B_t^u| l \in B_{t-1}^u).
  $$

- 相较于一般的马尔科夫模型, FPMC 的特点是对于每个 user 都希望构建一个专门的状态转移矩阵, 从而一定程度上实现个性化. 因此, 其实原则整个数据集存在一个 $|\mathcal{U}| \times |\mathcal{I}| \times |\mathcal{I}|$ 的一个状态转移张量, 作者借用了 Tucker 分解的思想, 得到了和 MF 相似的估计:

  $$
  \tag{3}
  \hat{a}_{u, l, i} = 
  \langle 
    \bm{v}_u^{U \rightarrow I},
    \bm{v}_i^{I \rightarrow U}
  \rangle +
  \langle 
    \bm{v}_i^{I \rightarrow L},
    \bm{v}_l^{L \rightarrow I}
  \rangle +
  \langle 
    \bm{v}_u^{U \rightarrow L},
    \bm{v}_l^{L \rightarrow U}
  \rangle.
  $$

  这里 $\bm{v}_u$ 表示独立的 user embedding, $\bm{v}_i$ 表示目标 item embedding, $\bm{v}_l$ 表示用户最新交互 basket $B_{t-1}^u$ 中的 item embedding.

- 进一步地, 我们可以得到 (3) 的估计:

  $$
  \begin{align}
  \hat{p}(i \in B_t^u| B_{t-1}^u) 
  &= \frac{1}{|B_{t-1}^u|} \sum_{l \in B_{t-1}^u} \hat{a}_{u, l, i} \\
  &= \langle \bm{v}_u^{U \rightarrow I}, \bm{v}_l^{L, I} \rangle + \frac{1}{|B_{t-1}^u|} \sum_{l \in B_{t-1}^u} \left( 
    \langle 
      \bm{v}_u^{U \rightarrow I},
      \bm{v}_i^{I \rightarrow U}
    \rangle +
    \langle 
      \bm{v}_i^{I \rightarrow L},
      \bm{v}_l^{L \rightarrow I}
    \rangle
  \right).
  \end{align}
  $$

  注意到, $\langle \bm{v}_u^{U \rightarrow I}, \bm{v}_l^{L, I} \rangle$  其实对于所有的 item 是共享的, 因此并不会左右最终的排名. 因此, 在实现的时候, user $u$ 对于 item $i$ 的 score 实质上就是:

  $$
    \langle 
      \bm{v}_u^{U \rightarrow I},
      \bm{v}_i^{I \rightarrow U}
    \rangle +
    \langle 
      \bm{v}_i^{I \rightarrow L},
      \bm{v}_l^{L \rightarrow I}
    \rangle.
  $$

  前一项为 MF, 后一项为 MC.

## 附录

### Tucker Decomposition

[[Tucker Decomposition-wiki](https://en.wikipedia.org/wiki/Tucker_decomposition)]

- 对于矩阵 $X \in \mathbb{R}^{I_1 \times I_2}$ 而言, 通过 SVD 分解可以获得:

    $$
    X = USV^T, \quad U \in \mathbb{R}^{I_1 \times J_1}, S \in \mathbb{R}^{J_1 \times J_2}, V \in \mathbb{R}^{I_2 \times J_2}.
    $$

    我们知道 $U/V$ 分别为 $X$ 左/右奇异向量组, $S$ 的非零对角线元素代表的奇异值刻画了不同奇异向量"构成" $X$ 的贡献. SVD 分解为后续矩阵近似和特征降维 (比如 PCA) 提供了有利工具.

- 对于 $N$ 阶张量 $\mathcal{X} \in \mathbb{R}^{I_1 \times I_2 \times \cdots \times I_N}$, 我们希望得到类似的矩阵分解, 即 Tucker 分解:

    $$
    \mathcal{X} = \mathcal{S} \times_1 V_1 \times_2 V_2 \times_3 \cdots \times_N V_N, \quad \mathcal{S} \in \mathbb{R}^{J_1 \times J_2 \times \cdots \times J_N}, V_n \in \mathbb{R}^{I_n \times J_n}.
    $$

    需要说明的是, $\mathcal{S} \times_n V_n$ 表示的是沿着第 $n$ 个维度求和的过程:


    $$
    \left[\mathcal{S} \times_n V_n\right]_{i_1i_2\cdots i_{n-1} \: j \: i_{n+1}\cdots i_N}
    := \sum_{i_n=1}^{I_n} \mathcal{S}_{i_1i_2\cdots i_{n-1} \: i_n \: i_{n+1}\cdots i_N} \cdot [V_n]_{i_nj}.
    $$

    容易证明, SVD 实际上是 $N=2$ 的一个特殊情况:

    $$
    X = USV^T = S \times_1 U \times_2 V = S \times_2 V \times_1 U.
    $$


## 参考文献

<ol class="reference">

  <li>
    Rendle S., Freudenthaler C. and Schmidt-Thieme L.
    <u>Factorizing personalized Markov chains for next-basket recommendation.</u>
    <i>WWW</i>, 2010.
    <a href="https://dl.acm.org/doi/10.1145/1772690.1772773" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>