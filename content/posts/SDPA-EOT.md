---
date: "2025-07-29"
draft: false
title: "Scaled-Dot-Product Attention as One-Sided Entropic Optimal Transport"
description: "从最优传输的角度理解和统一 Attention 机理"
author: MTandHJ
tags:
  - Note
  - Attention
  - Sinkhorn Distance
  - Optimal Transportation
  - Theory
  - 2025
pinned: false
---


## 预备知识

- (**Scaled-Dot-Product-Attention (SDPA)**) 给定 query vector $\bm{q} \in \mathbb{R}^{d}$, $m$ 个 key vectors $\{\bm{k}_j\}_{j=1}^m \subset \mathbb{R}^{d}$, 以及一个 scaling factor $\tau > 0$, SDPA weight vector $\bm{\alpha} \in \mathbb{R}^{m}$ 定义为

    $$
    \begin{align}
    \alpha_j := \frac{
        \exp( \langle \bm{q}, \bm{k}_j \rangle / \tau)
    }{\sum_{l=1}^m \exp(\langle \bm{q}, \bm{k}_l \rangle / \tau)}, \quad j=1,2, \ldots, m.
    \end{align}
    $$

- (**概率单纯形**): $\Delta^{n-1} := \{\bm{p} \in \mathbb{R}^n: p_j \ge 0, \forall j \text{ and } \sum_{j=1}^n p_j = 1\}$.

- (**Optimal Transport Problem**) 在给定 source $\bm{a} \in \Delta^{n-1}$ 和 target $\bm{b} \in \Delta^{m-1}$, 以及 Cost Matrix $\bm{C} \in \mathbb{R}_+^{n \times m}$, 寻求一个 source $\rightarrow$ target 的分配方案 $\bm{P} \in \mathbb{R}_+^{n \times m}$, 满足 $\bm{P} \in U(\bm{a}, \bm{b}) := \{\bm{P} \in \mathbb{R}_+^{n \times m}: \sum_{j=1}^m P_{ij} = a_i, \sum_{i=1}^n P_{ij} = b_j\}$. Optimal Transport Problem 就是求解如下的问题以期最优的分配方案:

    $$
    \begin{align}
    \text{OT}(\bm{a}, \bm{b}) := \min_{\bm{P}} \langle \bm{P}, \bm{C}\rangle_F = \min_{\bm{P}} \sum_{i=1}^n \sum_{j=1}^m C_{ij}P_{ij}.
    \end{align}
    $$

- (**Entropic Optimal Transport (EOT)**) (2) 的解在边界上取得, 通常不太好求解, 所以通常我们会引入一些强凸项来保证可求解性以及唯一性, 通常引入 [Sinkhorn Distance](/posts/sinkhorn-distance) 得到 EOT:

    $$
    \begin{align}
    \text{OT}_{\epsilon} (\bm{a}, \bm{b}) := \min_{\bm{P}} \sum_{i, j} C_{ij} P_{ij} - \epsilon H(\bm{P}),
    \end{align}
    $$

    这里 $H(\bm{P}) = -\sum_{ij} P_{ij} \log P_{ij}$ 代表信息熵. 注意 $-H(\bm{P})$ 是强凸的, 因此问题 (3) 也是强凸的 ($\epsilon > 0$), 有唯一解. 当 $\epsilon \rightarrow 0$, EOT 退化为 OT, 当 $\epsilon \rightarrow \infty$, $\bm{P}^* = \bm{a}\bm{b}^T$ 为最平凡的结果.


## 核心思想

### Attention & One-sided EOT

- (**One-sided Entropic Optimal Transport Problem**) 当只有一个 source, 即 $n = 1$ 的时候, (3) 可以进一步简化为

    $$
    \begin{align}
    J(\bm{p}) := \min_{\bm{p}} \sum_{j} C_{j} p_{j} - \epsilon H(\bm{p}), \quad \bm{p} \in \Delta^{m-1}.
    \end{align}
    $$

- (**Attention solves an One-sided EOT**) 倘若 $C_j = -\langle \bm{q}, \bm{k}_j \rangle, \epsilon = \tau$, 我们有

    $$
    \begin{align}
    \bm{p}^* = \min_{\bm{p} \in \Delta^{m-1}} J(\bm{p}) = \bm{\alpha}.
    \end{align}
    $$

---

*proof:*

- 首先简化问题 (4):

    $$
    \begin{align}
    \min_{\bm{p}} \quad & \sum_{j} C_{j} p_{j} + \tau \sum_j p_j \log p_j, \\
    \text{s.t.} \quad & \sum_{j} p_j = 1, \quad p_j \ge 0, \forall j.
    \end{align}
    $$

- 通过拉格朗日乘子法可以得到:

    $$
    \begin{align}
    \mathcal{L}(\bm{p}, \lambda, \bm{\mu}) = \sum_{j} C_{j} p_{j} + \tau \sum_j p_j \log p_j + \lambda (\sum_j p_j - 1) + \sum_j \mu_j p_j. \\
    \end{align}
    $$

- KKT 条件为:

    $$
    \begin{align}
    C_j + \tau (1 + \log p_j) + \lambda + \mu_j = 0, \\
    \sum_{j} p_j = 1, \quad \mu_j p_j = 0, \forall j.
    \end{align}
    $$

- 我们有

    $$
    \begin{align}
    p_j = e^{- \frac{C_j + \tau + \lambda + \mu_j}{\tau}}.
    \end{align}
    $$

- 显然 $p_j > 0 \Rightarrow \mu_j = 0, \: \forall j$, 因此

    $$
    \begin{align}
    p_j^* = \frac{
        \exp(- \frac{C_j + \tau + \lambda}{\tau})
    }{
        \sum_l \exp(- \frac{C_l + \tau + \lambda}{\tau})
    }
    = \frac{
        \exp(- \frac{C_j}{\tau})
    }{
        \sum_l \exp(- \frac{C_l}{\tau})
    }
    = \frac{
        \exp(\frac{\langle \bm{q}, \bm{k}_j \rangle}{\tau})
    }{
        \sum_l \exp(\frac{\langle \bm{q}, \bm{k}_l \rangle}{\tau})
    } = \alpha_j.
    \end{align}
    $$

---

- (5) 告诉我们计算 Attention 的过程实际上是求解一个最优传输问题, $\tau$ 则表达了和最普通的权重 $\alpha_j = \frac{1}{m}$ 的差距. 之前, $\tau$ 通常取 $\sqrt{d}$ 来保证在 $\bm{q, k}$ 均服从标准正太分布是, score $\langle \bm{q}, \bm{k} \rangle / \sqrt{d}$  方差为 1. (5) 则是带来了一个崭新的理解. 增大 $\tau$ 起到的作用无非是防止 $\bm{p}^*$ 出现极化现象.


### Attention Framework

- (**Generalized Variational Problem**) 我们可以将 (4) 进行一个扩展

    $$
    \begin{align}
    J(\bm{p}) := -\sum_{j} C_j p_j + \Omega (\bm{p}),
    \end{align}
    $$

    这里 $\Omega$ 关于 $\bm{p}$ 是强凸的.

- 基于 (13) 我们可以得到一系列的 Attention 的变种:

|Mechanism|$\Omega (\bm{p})$| $\bm{p}^*$||
|:-:|:-:|:-:|:-:|
|Softmax| $-\tau H(\bm{p})$| $p_j = \frac{\exp(\langle \bm{q}, \bm{k}_j \rangle / \tau)}{\sum_l \exp(\langle \bm{q}, \bm{k}_l \rangle / \tau)}$ | 最常见的 Attention|
|Sparsemax| $\frac{1}{2} \sum_{j} p_j^2$| $p_j = (\langle \bm{q}, \bm{k}_j \rangle - \tau)_+$ | 稀疏 Attention, $\tau$ 使得 $\sum_j p_j = 1$|
|PriorSoftmax| $\tau\text{KL}(\bm{p} \| \bm{\pi}) = \sum_{j=1}^m p_j \log \frac{p_j}{\pi_j}$ | $p_j= \frac{\pi_j \exp(\langle \bm{q}, \bm{k}_j \rangle / \tau)}{\sum_l \pi_l \exp(\langle \bm{q}, \bm{k}_l \rangle / \tau)} $ | $\pi$ 为人为给定的先验 |

### Backward

- 作者还讨论了 SDPA 反向传播的其他性质, 说明它的一些优势, 这里不多赘述了.

## 参考文献

<ol class="reference">
  <li>
    <u>Scaled-Dot-Product Attention as One-Sided Entropic Optimal Transport.</u>
    <i>arXiv</i>, 2025.
    <a href="http://arxiv.org/abs/2508.08369" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>