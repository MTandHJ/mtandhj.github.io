---
date: "2025-05-07"
draft: false
title: "GaLore: Memory-Efficient LLM Training by Gradient Low-Rank Projection"
description: "GaLore, 低秩空间中的梯度投影以及权重更新"
author: MTandHJ
tags:
  - Note
  - Lightweight
  - Low-Precision
  - Optimizer
  - SVD
  - Theoretical
  - ICML
  - 2024
pinned: false
---


## 预备知识

- $W \in \mathbb{R}^{m \times n}$, 可训练模型权重
- $\varphi$, 损失函数
- $G = -\nabla_W \varphi (W) \in \mathbb{R}^{m \times n}$, 梯度
- 一般的梯度下降为:

    $$
    W_{t} = W_{t-1} - \eta \tilde{G}_t.
    $$

- 对于 Adam, $\tilde{G}_t$ 通过一些缓存的信息来构造:

    $$
    M_t = \beta_1 M_{t-1} + (1 - \beta_1) G_t, \\
    V_t = \beta_2 V_{t-1} + (1 - \beta_2) G_t^2, \\
    \tilde{G}_t = \rho_t (G_t) = M_t / \sqrt{V_t + \epsilon}.
    $$

    因此, Adam 需要动态维护一阶动量 $M_t$ 以及二阶动量 $V_t$, 这需要 2x 模型大小的显存.

## 核心思想

![20250507104959](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507104959.png)


- 作者通过理论分析发现, $G_t$ 随着梯度更新会逐渐趋于低秩, 本文建议一种 gradient low-rank projection (GaLore) 的方式更新:

    $$
    W_{t+1} = W_t - \eta  \tilde{G}_t, \quad \tilde{G}_t = P_t \:\rho_t (P_t^T G_t Q_t) \: Q_t^T,
    $$

    其中 $P_t \in \mathbb{R}^{m \times r}, Q_t \in \mathbb{R}^{n \times r}, r \ll m, n$.

- 即 梯度转移到低秩空间 $\longrightarrow$ 在低秩空间中完成 $\rho_t$ $\longrightarrow$ 恢复到原空间. 于是在整个训练过程中, 我们只需要缓存这些投影矩阵即可. 如下是 Adam 的一个例子 (只用了一半的投影):

![20250507105029](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507105029.png)

- 收敛性是容易理解的, 每一步更新都相当于 (理论上应该和使用 LoRA 是等价的, 如果 $P, Q$ 是固定的):

    $$
    \varphi_t(\hat{W}_t), \quad \hat{W}_t = \text{stop-gradient}(W_t) + P \tilde{W}_t Q^T, \quad \tilde{W}_t \in \mathbb{R}^{r \times r}.
    $$

- 则

    $$
    \nabla_{\tilde{W}_t} \varphi_t  = P^T G_t Q,
    $$

    此时便有:

    $$
    \hat{W}_{t+1} = \hat{W}_t + P \Delta \tilde{W} Q^T = \hat{W}_t - \eta P \:  \rho_t (P^T G_t Q) Q^T.
    $$


## 参考文献

<ol class="reference">
  <li>
    Zhao J., Zhang Z., Chen B., Wang Z., Anandkumar A., and Tian Y.
    <u>GaLore: Memory-Efficient LLM Training by Gradient Low-Rank Projection</u>.
    <i>ICML</i>, 2024.
    <a href="http://arxiv.org/abs/2403.03507" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/jiaweizzhao/GaLore" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

