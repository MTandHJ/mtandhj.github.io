---
date: "2025-03-16"
draft: false
title: "Recommender Systems with Generative Retrieval"
description: "TIGER, 向量量化生成式检索"
author: MTandHJ
tags:
  - Note
  - Sequential Recommendation
  - Generative
  - Vector Quantization
  - Seminal
  - Empirical
  - NeurIPS
  - 2023
pinned: false
---


## 预备知识

- 请了解 [RQ-VAE](https://www.mtandhj.com/posts/rq-vae/).

## 核心思想

![20250316175829](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316175829.png)

- 目前主流的推荐系统的一个痛点是将 item 表示为一个 embedding, 这就导致对于冷启动的场景并不友好 (既然我们没法再立即获得高效的新来的 item 的表示). 此外, 现阶段的推荐系统大多采用 matching 的架构 (在 item 数量较多的时候可能会慢一些), 本文探索一种生成式的检索方式.

- 本文所提出的 Tiger 依然 RQ-VAE, 对 item 的文本 embedding 首先进行编码, 得到的编码作为 item 的 'ID', 后面的模型只需要在此基础上进行预测即可.

![20250316175859](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316175859.png)

- 如上图所示, 文本的 embedding 经过 RQ-VAE (codebook 不共享) 得到 semantic codes. 比如 codebook 的size 为 8, 则理论上可以表示 $8^K$ 个 items (这里 $K$ 表示残差量化的次数).

- 在第一阶段训练完毕之后, 我们就可以用得到的编码作为每个 item 的 'ID', 然后就可以训练一个模型来进行生成式推荐, 这里文中给了一个例子:

![20250316180725](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316180725.png)

- 对于一个新来的 item, 只需要 -> Tiger 编码 -> 就可以用于预测了.

**注:** 这里省略了避免 ID 碰撞的细节.


## 参考文献

<ol class="reference">
  <li>
    Rajput S., Mehta N., Singh A., Keshavan R., Vu T.,
    Heldt L., Hong L., Tay Y., Tran V. Q., Samost J., Kula M.,
    Chi E. H. and Sathiamoorthy M.
    <u>Recommender Systems with Generative Retrieval.</u>
    <i>NeurIPS</i>, 2023.
    <a href="https://arxiv.org/pdf/2305.05065v3" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/EdoardoBotta/RQ-VAE-Recommender" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

