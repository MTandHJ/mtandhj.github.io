---
date: "2026-06-24"
draft: false
title: "A Rank-One Popularity Component in Dot-Product Recommender Scores"
description: "推荐 Softmax 目标中的 Rank-One Popularity Component"
author: MTandHJ
tags:
  - Paper
  - Recommendation
  - Embedding
  - Representational Collapse
  - Theoretical
  - arXiv
  - 2026
pinned: false
---

## 研究背景

- (**Representational Collapse**) 推荐模型中的 embedding anisotropy 往往被归因于 Transformer encoder 或者负采样训练过程. 例如, 一些工作观察到 item embeddings 的奇异值快速衰减, item 之间 cosine similarity 异常偏高, 少数主方向占据了大部分能量. 这类现象通常被称为 representation degeneration 或 representational collapse.

- (**问题重新定位**) 这篇文章的切入点是: 上述现象不一定首先来自 encoder. 只要推荐模型使用 dot-product softmax decoder, 那么 full-softmax 的 population-optimal score 本身就会包含 item marginal, 即 popularity prior. 这个项和 Transformer 没有直接关系, 而是由条件似然目标和长尾 item 分布共同决定.

- (**符号说明**)
    - **context:** $c \in \mathcal{C}$, 可以理解为用户历史或当前请求上下文;
    - **item:** $i \in \mathcal{V}$;
    - **context embedding:** $h_c \in \mathbb{R}^d$;
    - **item embedding:** $e_i \in \mathbb{R}^d$;
    - **score/logit:** $z_{ci} = h_c^\top e_i$;
    - **item marginal:** $\pi_i = \pi(i)$, 本文把它作为 observed popularity, 不把它解释成纯粹偏差或真实偏好.

## 核心思想

### Softmax 最优解中的 Popularity

- (**Population-optimal logits**) 对于任意 encoder, full-softmax 的 population cross-entropy 在最优时满足:

    $$
    z^*_{ci} = \log \pi(i | c) + a_c.
    $$

    其中 $a_c$ 是对同一个 context 的所有 items 都相同的 row shift. Softmax 对这个常数不敏感, 因此它是 gauge freedom.

- (**PMI 分解**) 进一步利用:

    $$
    \log \pi(i | c) = \text{PMI}(c, i) + \log \pi_i,
    $$

    可以得到:

    $$
    z^*_{ci} = \text{PMI}(c, i) + \log \pi_i + a_c.
    $$

    这个分解很关键: $\text{PMI}(c, i)$ 更像 context-item compatibility, 会随 context 变化; $\log \pi_i$ 是 item popularity, 对所有 context 都相同. 如果模型没有单独的 prior channel, dot product 就必须同时表达 compatibility 和 popularity.

### Rank-One Popularity Component

- (**去掉 gauge**) 将所有 context 和 item 的 score 堆成矩阵 $Z^* \in \mathbb{R}^{m \times n}$. 记 $M_{ci} = \text{PMI}(c, i)$, $f_i = \log \pi_i$, 则:

    $$
    Z^* = M + \mathbf{1}_m f^\top + a \mathbf{1}_n^\top.
    $$

    由于 $a \mathbf{1}_n^\top$ 只是每行的常数偏移, 作者用 item-centering projector $P_n$ 消掉它:

    $$
    \tilde{Z}^* = Z^* P_n = \tilde{M} + \mathbf{1}_m \tilde{f}^\top.
    $$

- (**Rank-One 结构**) 其中 $\mathbf{1}_m \tilde{f}^\top$ 是一个外积, 因此 rank 为 1. 这说明 popularity 不是零散噪声, 而是在 score matrix 中形成了一条所有 context 共享的方向.

- (**谱间隙**) 作者进一步给出一个充分条件:

    $$
    \sigma_1(\tilde{Z}^*) \geq \sqrt{m}\|\tilde{f}\|_2 - \|\tilde{M}\|_2,
    $$

    $$
    \sigma_2(\tilde{Z}^*) \leq \|\tilde{M}\|_2.
    $$

    当 popularity 项足够强, 即:

    $$
    \sqrt{m}\|\tilde{f}\|_2 > 2\|\tilde{M}\|_2,
    $$

    第一奇异值就会和后续奇异值拉开差距. 这给 embedding anisotropy 的经验观察提供了一个 score-level 来源.

- (**长尾分布**) 如果 item marginal 近似 Zipfian:

    $$
    \pi_i = \frac{i^{-\zeta}}{H_{n,\zeta}},
    $$

    那么 centered log-popularity 的范数满足:

    $$
    \|\tilde{f}\|_2 = \Theta(\zeta \sqrt{n}).
    $$

    因此长尾越明显, 即 $\zeta$ 越大, popularity direction 的能量越强.

### Prior Separation

- (**建议的建模方式**) 作者的实践建议是把 popularity 从 dot product 中拆出来, 使 score 写成:

    $$
    r_{ci} = h_c^\top e_i + \beta \log \pi_i.
    $$

    其中 $h_c^\top e_i$ 尽量表示 compatibility, $\log \pi_i$ 表示 observed popularity, $\beta$ 是 serving 阶段可调的 prior coefficient.

- (**为什么有用**) 这不是简单地删除 popularity. Popularity 里混合了曝光、可用性、重复行为和真实 aggregate preference, 完全去掉可能损害 likelihood 或业务指标. Prior separation 的意义是让 popularity contribution 显式可控, 而不是让它隐式消耗 dot-product embedding 的容量.

## 关键洞察

- (**Synthetic Study**) 合成实验中, 当数据生成过程加入 $\alpha \log \pi_i$ 后, standard softmax 会迅速学出和 popularity 对齐的主方向. 当 $\alpha = 1$ 时, item PC1 与 $\log \pi_i$ 的相关性达到 $0.992$, 而 prior-adjusted softmax 只有 $0.086$. 当 $\alpha = 2$ 时, standard softmax 的 $R_1(E)$ 达到 $0.645$, effective rank 降到 $3.87$; prior-adjusted softmax 仍保持 $R_1(E) = 0.216$, effective rank 为 $7.85$.

- (**Alibaba/Tianchi Study**) 在 Alibaba/Tianchi 日志上, prior separation 将 context-shared popularity-aligned score energy 降低了 $98.6\%$, broader popularity-direction energy 降低了 $96.0\%$. 置换检验显示这种下降特异地对应 empirical popularity direction, 不是任意方向都能得到同样效果.

- (**评估指标要分开看**) 作者建议不要只报告整体 Recall/NDCG. 需要同时看 head/middle/tail Recall、catalog coverage、novelty、$R_1(E)$、effective rank、mean pairwise cosine、PC1 与 $\log \pi_i$ 的相关性, 以及 score-level popularity projection. 否则整体指标很容易掩盖 head-tail exposure 的变化.

## 继往开来

- 点积的分解比较有意思, 对于理解流行度等偏差的影响会比较有帮助.

## 附录

### Anisotropy 指标

- 文章使用两个谱指标描述 item embedding matrix $E$ 的各向异性. 设奇异值为 $s_1 \geq \cdots \geq s_d \geq 0$, leading-direction energy ratio 定义为:

    $$
    R_1(E) = \frac{s_1^2}{\sum_{k=1}^d s_k^2}.
    $$

    它表示第一主方向解释了多少总能量. 如果能量高度集中在一个方向, $R_1(E)$ 会接近 1.

- Effective rank 先把平方奇异值归一化为能量分布:

    $$
    \rho_k = \frac{s_k^2}{\sum_j s_j^2},
    $$

    再计算:

    $$
    \text{erank}(E)
    =
    \exp \left(
    - \sum_{k=1}^d \rho_k \log \rho_k
    \right).
    $$

    它可以理解为“能量等效分布在多少个方向上”. $R_1(E)$ 越大、$\text{erank}(E)$ 越小, 表示 embedding 越 anisotropic.

## 参考文献

<ol class="reference">
  <li>
    Cheng Y.
    <u>A Rank-One Popularity Component in Dot-Product Recommender Scores: Population Theory and Prior-Separation Evidence.</u>
    <i>arXiv</i>, 2026.
    <a href="https://arxiv.org/pdf/2606.21275.pdf" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
  </li>
</ol>
