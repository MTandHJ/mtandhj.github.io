---
date: "2025-05-07"
draft: false
title: "Q-GaLore: Quantized GaLore with INT4 Projection and Layer-Adaptive Low-Rank Gradients"
description: "Q-GaLore, 对 GaLore 进一步施加低精度量化"
author: MTandHJ
tags:
  - Note
  - Lightweight
  - Low-Precision
  - Optimizer
  - SVD
  - Empirical
  - arXiv
  - 2024
pinned: false
---


## 预备知识

- 请先对 [GaLore](www.mtandhj.com/posts/galore) 有所了解.

## 核心思想

![20250507105629](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507105629.png)

- Q-GaLore 的出发点主要是觉得 GaLore 的 SVD 分解部分会造成明显的 training latency, 因而希望对它进行改进:
    1. **Adaptive lazy update:** GaLore 每间隔 $T$ 次权重更新就会更新一次投影矩阵. 作者认为快速收敛的和缓慢收敛的不应当以相同的频率更新. 因此, 作者设定, 当前后间隔为 $K$ 的投影矩阵的 cosine 相似度大于一定的阈值 (e.g., 40%) 就延长更新间隔为 $T \rightarrow 2T$.
    2. **Quantization on projection matrices:** 作者发现投影矩阵的冗余程度相当之高, 如下图所示, 实际上我们只需要存储 4-bit 的投影矩阵即可. 此外, 低精度量化作者建议用 stochastic rounding 而不是 round-to-nearest.
![20250507110331](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507110331.png)

- 下图是 Q-GaLore 的流程:

![20250507110521](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507110521.png)

## 参考文献

<ol class="reference">
  <li>
    Zhang Z., Jaiswal A., Yin L., Zhao J., Tian Y., and Wang Z.
    <u>Q-GaLore: Quantized GaLore with INT4 Projection and Layer-Adaptive Low-Rank Gradients</u>.
    <i>arXiv</i>, 2024.
    <a href="https://arxiv.org/abs/2407.08296" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/VITA-Group/Q-GaLore" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

