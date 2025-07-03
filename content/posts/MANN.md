---
date: "2025-03-30"
draft: false
title: "Meta-Learning with Memory-Augmented Neural Networks"
description: "MANN, 外置记忆模块"
author: MTandHJ
tags:
  - Note
  - Memory
  - Seminal
  - Empirical
  - ICML
  - 2016
pinned: false
---


## 预备知识

- $\mathbf{x}_t \in \mathbb{R}^d$, 输入;
- $\mathbf{k}_t \in \mathbb{R}^d$, 根据输入得到的用于更新的向量;
- $\mathbf{M}_t \in \mathbb{R}^{N \times d}$, memory matrix;

## 核心思想

- 我们希望维护一个 memory matrix $\mathbf{M}_t$ 以保存**最新最有用**的信息 (least recently used access (LRUA)).

- **Read:** 负责从 $\mathbf{M}_t$ 中读取信息, 给定 key $\mathbf{k}_t$, 通过 cosine similarity 来计算两两相似度:

    $$
    K(\mathbf{k}_t, \mathbf{M}_t(i)) =
    \frac{
        \mathbf{k}_t \cdot \mathbf{M}_t (i)
    }{
        \|\mathbf{k}_t\|  \| \mathbf{M}_t (i) \|
    }, \quad \forall i.
    $$

    这里 $\mathbf{M}_t(i)$ 表示矩阵的第 $i$ 行. 接着, 通过重加权计算所读取的向量:

    $$
    \mathbf{r}_t \leftarrow \sum_i w_t^r (i) \mathbf{M}_t (i), \\
    w_t^r (i) \leftarrow
    \frac{
        \exp (K (\mathbf{k}_t, \mathbf{M}_t (i)))
    }{
        \sum_{j} \exp (K (\mathbf{k}_t, \mathbf{M}_t (j)))
    }.
    $$

    记 $w (i)$ 所构成的向量为 $\mathbf{w}$.

- **Write:** 负责更新 $\mathbf{M}_t$, 既然我们希望维护最新最有用的信息, 那么: 1. 对于那些经常不被 **Read** 的行, 应当更多地更新替换; 2. 对于**刚刚**被 **Read** 的, 应当予以更新以保证它的最新性.

- 于是作者设计了这么一个机制:

    $$
    \mathbf{M}_t (i) \leftarrow \mathbf{M}_{t-1}(i) + w_t^w (i) \mathbf{k}_t, \\
    \mathbf{w}_t^w \leftarrow \sigma (\alpha) \mathbf{w}_{t-1}^r + (1 - \sigma (\alpha)) \mathbf{w}_{t-1}^{lu}, \\
    w_t^{lu} (i) = 
    \left \{
        \begin{array}{ll}
        0 & \text{if } w_t^u (i) > m(\mathbf{w}_t^u, n), \\
        1 & \text{if } w_t^u (i) \le m(\mathbf{w}_t^u, n),
        \end{array}
    \right . \\
    \mathbf{w}_t^u \leftarrow \gamma \mathbf{w}_{t-1}^u + \mathbf{w}_t^r + \mathbf{w}_t^w.
    $$

    这里, $\alpha$ 是一个可学习的 sigmoid gate parameter, $m(\mathbf{v}, n)$ 返回的是 $\mathbf{v}$ 中 $n$-th 最小的元素. 即 $w_t^{lu}$ 指示了当前 memory matrix 中哪些是 least-used (lu) 的. 最后写入的权重由 $\mathbf{w}_t^w$ 决定, 它是当前 **Read** 的权重以及 **least-used** 权重的加权. 即 $\mathbf{M}_t (i)$ 的更新程度比较大, 当且仅当它在这一轮中被**充分**读取了, 或它在过去**许多轮**都没有被**充分读取**.

## 参考文献

<ol class="reference">
  <li>
    Santoro A., Bartunov S., Botvinick M., Wierstra D., and Lillicrap T.
    <u>Meta-Learning with Memory-Augmented Neural Networks.</u>
    <i>ICML</i>, 2016.
    <a href="https://proceedings.mlr.press/v48/santoro16.pdf" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/ywatanabex/ntm-meta-learning" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

