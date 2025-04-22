---
date: "2025-04-21"
draft: false
title: "Scaling Laws for Online Advertisement Retrieval"
description: "快手, 广告场景下的 Scaling Laws"
author: MTandHJ
tags:
  - Note
  - Advertisement
  - Retrieval
  - Scaling Law
  - Empirical
  - 2024
pinned: false
---


## 预备知识

- 请先了解 [NLP 中的 Scaling Law](https://arxiv.org/abs/2001.08361).

## 核心思想


- 作者团队希望验证一下在广告场景下是否也有类似于 NLP 中的 scaling law, 即探究是否随着广告预测模型地**增大**, 是否能够**有规律**地提升一些**线上指标**. (因为关注的是实际的线上指标, 这也衍生出了一些独特的问题, 这里就不讲了).

![20250421171053](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250421171053.png)

- 注意到, 实际的推荐系统通常是包含多个阶段, 每个阶段可能还包含不同指标导向的模型, 因此相当复杂. 为了探究 scaling law, 作者团队主要针对 Pre-ranking 阶段探究一个排序模型 (MLPs):
    1. **特征:** 同时包括 sparse 和 dense features, 对于 dense features 应用 [log1p transformation](https://openreview.net/pdf?id=Ut1vF_q_vC).
    2. **模型:** 5-layer 的 MLPs, 每一层包括一个 batch normalization, linear mapping 和 PReLU. 通过 He initialization 初始化权重.

![20250421171806](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250421171806.png)

- 如上图所示, FLOPs 和作者设定的指标 R/R* 随着 MLPs 变大所产生的变化情况, 可以通过 Broken Neural Scaling Law (BNSL) 的公式很好的拟合.


## 参考文献

<ol class="reference">
  <li>
    Wang Y., Yang Z., Zhang Z., Wang Z., Yang J.,
    Wen S., Jiang P., and Gai K.
    <u>Scaling Laws for Online Advertisement Retrieval.</u>
    <i>arXiv</i>, 2024.
    <a href="http://arxiv.org/abs/2411.13322" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

