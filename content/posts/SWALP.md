---
date: "2025-05-06"
draft: false
title: "SWALP: Stochastic Weight Averaging in Low-Precision Training"
description: "SWALP, 通过 SWA 稳定低精度训练"
author: MTandHJ
tags:
  - Note
  - Low-Precision
  - FQT
  - SWA
  - Empirical
  - ICML
  - 2019
pinned: false
---


## 预备知识

- 对 Fully Quantized Quantization (FQT) 有个基本的了解.

## 核心思想

- Low-precision training 能够加速模型训练 (且往往消耗更少的显存), 因为是相当重要的研究课题. 但是, 被人诟病的是它的不稳定性以及所导致的性能下降.

- 上述的一个很大问题可能是低精度下收敛的振荡导致的 (因为实际上有了更多的噪声), 作者建议通过 SWA (Stocastic Weight Averaging [2]) 来稳定.

![20250506174256](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250506174256.png)

- 如上图所示, 权重 $w$ 由于低精度的原因在最优点附近振荡, 这个时候通过 SWA 可以使得平均后的结果更为接近最优点, 其算法如下:

![20250506174807](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250506174807.png)

## 参考文献

<ol class="reference">
  <li>
    Yang G., Zhang T., Kirichenko P., Bai J.,
    Wilson A. G., and Sa De C.
    <u>SWALP: Stochastic Weight Averaging in Low-Precision Training</u>.
    <i>ICML</i>, 2019.
    <a href="https://arxiv.org/abs/1904.11943" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/stevenygd/SWALP" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <li>
    Izmailov P., Podoprikhin D., Garipov T.,
    Vetrov D., and Wilson A. G.
    <u>Averaging Weights Leads to Wider Optima and Better Generalization</u>.
    <i>arXiv</i>, 2018.
    <a href="https://arxiv.org/abs/1803.05407" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/timgaripov/swa" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>

