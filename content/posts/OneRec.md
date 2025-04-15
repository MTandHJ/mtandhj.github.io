---
date: "2025-04-15"
draft: false
title: "OneRec: Unifying Retrieve and Rank with Generative Recommender and Preference Alignment"
description: "OneRec, 端到端的推荐模型"
author: MTandHJ
tags:
  - Note
  - Multimodal Recommendation
  - End-to-End
  - Generative
  - Vector Quantization
  - Empirical
  - 2025
pinned: false
---


## 预备知识

- 请了解 [QARM](https://www.mtandhj.com/posts/qarm/).
- $\mathcal{H}_u = \{v_1^h, v_2^h, \ldots, v_n^h\}$, user historical behavior sequence, 在快手的场景下, $v$ 表示一个视频.
- $\mathcal{S} = \{v_1, v_2, \ldots, v_m\}$, 推荐的一串视频流.
- session watch time (**swt**), view probability (**vtr**), follow probability (**wtr**), like probability (**ltr**).

## 核心思想

![20250415142401](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250415142401.png)

- 我们知道, 在工业界推荐系统有着一套复杂的流程: 粗排-精排. 这一套流程被广泛应用有着不同的原因:
    1. 庞大的商品数量: 由于精排通常是 pair-wise 的比较 (因为需要利用交叉特征), 所以必须通过一步步粗排来减少候选商品的数量以保证有限的开销;
    2. 多样化的推荐策略: 在工业场景中, 推荐的目标远非"精度", 实际上还要考虑比如多样性等指标以保证用户的留存以及各种品类的商品具有最低限度的曝光度, 此外, 还需要考虑比如广告的因素.

- 然而, 由于生成式推荐的发展, 第一个问题其实已经可以迎刃而解了, 这促使我们探索端到端推荐的可能性.


![20250415143509](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250415143509.png)

- OneRec 的基本流程如下:

    1. 对每个 video $v_i$, 通过 [QARM](https://www.mtandhj.com/posts/qarm/) 中的操作得到其所对应的多模态 embedding $\bm{e} \in \mathbb{R}^d$;

    2. $\mathbf{e}_i$ 通过类似 [QARM](https://www.mtandhj.com/posts/qarm/) 的 fixed RQ-VAE 进行残差量化, 得到其离散化表示

        $$
        (s_i^1, s_i^2, \ldots, s_i^L).
        $$

    3. OneRec 的主体结构为 Encoder-Decoder:
        - Encoder 以 $\mathcal{H}_u$ 为输入得到 user 的编码, 其作为 Decoder (full visible cross-attention) 的 Key/Value;
        - Decoder 负责生成视频流推荐, 注意与一般的 next-token/item 推荐不同, OneRec 的目标是生成一个 session 的视频, 它的特殊之处主要体现在后面会讲到的训练过程.

### Balanced K-means Clustering

- 与 [QARM](https://www.mtandhj.com/posts/qarm/) 的 codebook 的确定方式的不同之处在于, 本文还强调每个类别的均分性.


### Next-Token Prediction

- OneRec 的训练目标和一般的有不同之处, 首先, 需要在用户的交互记录中选择 **high-quality sessions** (文中并未提及是要同时满足还是满足任一即可, 我感觉后者会比较合理):
    1. 该 session 内用户所观看的视频数 $\ge 5$;
    2. 该 session 内用户累积观看时长 $\ge$ 某个阈值;
    3. 该用户对该 session 内的视频发生了如点赞, 收藏, 分享等行为.

- 于是, Decoder 的输入为:

    $$
    \mathcal{\bar{S}} = \{
        \bm{s}_{\text{[BOS]}}, \mathbf{s}_1^1, \mathbf{s}_1^2, \cdots, \mathbf{s}_1^L,
        \bm{s}_{\text{[BOS]}}, \mathbf{s}_2^1, \mathbf{s}_2^2, \cdots, \mathbf{s}_2^L,
        \cdots,
        \bm{s}_{\text{[BOS]}}, \mathbf{s}_m^1, \mathbf{s}_m^2, \cdots, \mathbf{s}_m^L
    \},
    $$

    其中 $\mathbf{s}_{\text{[BOS]}}$ 为不同视频的分隔符.

- 于是, OneRec 的主要损失为:

    $$
    \mathcal{L}_{\text{NTP}}
    = - \sum_{i=1}^m \sum_{j=1}^L
    \log P(\mathbf{s}_i^{j+1}| [
        \bm{s}_{\text{[BOS]}}, \mathbf{s}_1^1, \mathbf{s}_1^2, \cdots, \mathbf{s}_1^L,
        \cdots,
        \bm{s}_{\text{[BOS]}}, \mathbf{s}_i^1, \cdots, \mathbf{s}_i^j
    ]; \Theta).
    $$

### Iterative Preference Alignment with RM

- 特别地, 本文还采用 Direct Preference Optimization (DPO) 来进行偏好对齐. 由于推荐场景数据反馈的稀疏性, OneRec 借助一个 reward model (RM) 首先拟合反馈, 然后再用于提升 OneRec.

- 对于 RM, 我们首先得到 user 的 target-aware 的表示 $\bm{h}_f \in \mathbb{R}^{m \times d}$ 序列, 然后分别计算不同的指标:

    $$
    \hat{r}^{swt} = \text{Tower}^{swt}(\text{Sum}(\mathbf{h}_f)), \\
    \hat{r}^{vtr} = \text{Tower}^{vtr}(\text{Sum}(\mathbf{h}_f)), \\
    \hat{r}^{wtr} = \text{Tower}^{wtr}(\text{Sum}(\mathbf{h}_f)), \\
    \hat{r}^{ltr} = \text{Tower}^{ltr}(\text{Sum}(\mathbf{h}_f)),
    $$

    其中 $\text{Tower}(\cdot) = \text{Sigmoid}(\text{MLP}(\cdot))$. 然后通过 BCE 进行训练:

    $$
    \mathcal{L}_{\text{RM}} = 
    -\sum_{xtr \in \{swt, vtr, wtr, ltr\}}
    \big(
        y^{xtr} \log (\hat{r}^{xtr})
        + (1 - y^{xtr}) \log (1 - \hat{r}^{xtr})
    \big).
    $$

- 接下来通过 RM 来迭代地提升 OneRec:

![20250415150417](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250415150417.png)


## 参考文献

<ol class="reference">
  <li>
    Deng J., Wang S., Cai K.,
    Ren L., Hu Q., Ding W.,
    Luo Q., and Zhou G.
    <u>OneRec: Unifying Retrieve and Rank with Generative Recommender and Preference Alignment.</u>
    <i>arXiv</i>, 2025.
    <a href="https://arxiv.org/abs/2502.18965" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

