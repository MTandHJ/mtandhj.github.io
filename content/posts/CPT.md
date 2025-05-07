---
date: "2025-05-07"
draft: false
title: "CPT: Efficient Deep Neural Network Training via Cyclic Precision"
description: "CPT, 类似 CosineAnnealingWarmRestarts 的 Precision 循环机制"
author: MTandHJ
tags:
  - Note
  - Low-Precision
  - Quantization
  - Generalization
  - Empirical
  - ICLR
  - 2021
pinned: false
---


## 预备知识

- Cosine learning rate schedule 是一种常用的技巧被用在深度学习之中.

## 核心思想

- 很以往的 low-precision 方法不同, 本文试图证明, 通过渐进式地增加训练精度, 可以增强模型的泛化能力 (低精度训练所造成的 noise 反而有利于增强泛化性), 因此提出了 Cyclic Precision Training (CPT).

- CPT 模仿 Cosine learing rate, 其约束训练精度为:

    $$
    B_t^n = \lceil B_{min}^n + \frac{1}{2}
    (B_{max}^n - B_{min}^n)
    (1 - \cos (
        \frac{t\% T_n}{T_n} \pi
    ))
    \rfloor.
    $$

- 下图验证了通过 CPT 训练可以使得模型收敛到一个更宽阔的 loss landscape, 因而具有更好的泛化性.

![20250507152244](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507152244.png)

## 参考文献

<ol class="reference">
  <li>
    Fu Y., Guo H., Yang X., Ding Y., and Lin Y.
    <u>CPT: Efficient Deep Neural Network Training via Cyclic Precision</u>.
    <i>ICLR</i>, 2021.
    <a href="http://arxiv.org/abs/2101.09868" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/RICE-EIC/CPT" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>