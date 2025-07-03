---
date: "2025-06-28"
draft: false
title: "Sinkhorn Distance and Sinkhorn-Knopp Algorithm"
description: "关于利用 Sinkhorn 距离求解离散最优传输问题的记录"
author: MTandHJ
tags:
  - Math
  - Sinkhorn Distance
  - Optimal Transportation
pinned: false
---


## Optimal Transportation

- 最优传输问题: 从货源地 $\mathcal{X} = \{x_i\}_{i=1}^m$ 往目的地 $\mathcal{Y} = \{y_j\}_{j=1}^n$ 运送货物. 其中每个货源地 $i$ 有 $x_i$ 批货物, 每个发货地 $j$ 需要 $y_j$ 批货物. 如目的地所需货物总和恰好为货源地货物总和 (即, $\sum_{i=1}^m x_i = \sum_{j=1}^n y_j$), 且从 $i$ 发往 $j$ 的运输成本为 $w_{ij}$, 则如何设计从 $i$ 发往 $j$ 的运输量 $p_{ij}$ 使得总共的运输成本最小.

- 上述问题可以形式化为:

    $$
    \tag{1}
    \begin{align*}
    \min_{P \in U(x, y)}  \quad & \mathcal{C}(P) = \text{Tr}(PW^T)= \sum_{i=1}^m \sum_{j=1}^n w_{ij} p_{ij}.
    \end{align*}
    $$

    这里 $U(x, y) := \{P: \sum_{j=1}^n p_{ij} = x_i, \sum_{i=1}^m p_{ij} = y_j, p_{ij} \ge 0\}$ 为可行域.

- **简化:** 容易发现, 我们可以假设 $\sum_{i=1}^m x_i = \sum_{j=1}^n y_j = 1$. 实际上, 若 $\sum_{i=1}^m x_i = \sum_{j=1}^n y_j = \theta$, 我们仅需令 $\tilde{P} = P / \theta$, 此时求解 $\tilde{P}$ 相当于:

    $$
    \begin{align*}
    \min_{\tilde{P}} \quad & \sum_{i=1}^m \sum_{j=1}^n w_{ij} \tilde{p}_{ij}, \\
    \text{s.t.} \quad & \sum_{j=1}^n \tilde{p}_{ij} = x_i / \theta, i=1,2,\ldots, m, \\
    \quad & \sum_{i=1}^m \tilde{p}_{ij} = y_j / \theta, j=1,2,\ldots, n .\\
    \end{align*}
    $$

    此时, $\sum_{i=1}^m x_i / \theta = \sum_{j=1}^n y_j / \theta = 1$. 因此不是一般性, 可以假设 $\sum_{i=1}^m x_i = \sum_{j=1}^n y_j = 1$. 容易发现, 此时 $P$ 实际上描述了一个离散概率矩阵, 其中

    $$
    p_{ij} = \mathbb{P}\left( i \rightarrow j \right).
    $$

- 最优传输问题本质上是一个线性规划问题, 而线性规划问题的最优点总能在边界取到:
    1. 若 $P^*$ 是一最优点且不在边界之上, 则存在 $\epsilon > 0$ 使得 $P' = P^* - \epsilon W$ 满足约束条件.
    2. 则根据定义我们有

        $$
        \tag{2}
        \mathcal{C}(P^*) \le \mathcal{C}(P') = \mathcal{C}(P^*) - \epsilon \text{Tr}(WW^T) \le \mathcal{C}^*.
        $$
    3. 矛盾不发生当且仅当 $W \equiv 0$, 此时所有可行点皆为最优点, 自然也包括边界点.
    4. 否则矛盾发生, 证明此时最优点必然在边界点取到.

- 因此, 如果要严格求解优化传输问题是相对比较麻烦的, 这要求我们遍历边界点 ($\partial U$).

## Sinkhorn Distance

- Sinkhorn 距离实际上是在线性规划的多边形可行域 $U(x, y)$ 中构造了一个凸包从而更加容易求解.

- 定义

    $$
    \tag{3}
    U_{\alpha} (x, y) :=
    U(x, y) \cap \{P: \mathbf{KL}(P\|xy^T) \le \alpha\}.
    $$

    $xy^T$ 实际上代表了一种按照'量'相对均匀的分配方式, 换言之, 我们对 $P$ 加了一些额外的约束, 要求其不能走向极端.

- 注意到

    $$
    \begin{align*}
    \mathbf{KL}(P\|xy^T)
    &= \sum_{ij} p_{ij} \log \frac{p_{ij}}{x_i y_j} \\
    &= \sum_{ij} \left[p_{ij} \log p_{ij} - p_{ij}\log{x_i y_j} \right]\\
    &= -\mathcal{H}(P) - \sum_{ij} p_{ij} \log{x_i y_j} \\
    &= -\mathcal{H}(P) - \sum_{ij} p_{ij} \log x_i  - \sum_{ij} p_{ij} \log y_j \\
    &= -\mathcal{H}(P) - \sum_{i} x_{ij} \log x_i  - \sum_{j} y_j \log y_j \\
    &= -\mathcal{H}(P) + \mathcal{H}(x) + \mathcal{H}(y).
    \end{align*}
    $$

- 因此, 在 $\textbf{KL}(P\|xy^T) \le \alpha$ 实际上等价于

    $$
    \tag{4}
    -\mathcal{H}(P) \le \underbrace{\alpha - \mathcal{H}(x) - \mathcal{H}(y)}_{= \alpha'},
    $$

    既然 $\mathcal{H}(x), \mathcal{H}(y)$ 是固定的.

- 出于符号简单考虑, 不妨假设

    $$
    \tag{5}
    U_{\alpha} (x, y) :=
    U(x, y) \cap \{P: -\mathcal{H}(P) \le \alpha\}.
    $$

- **Sinkhorn Distances:**

    $$
    \tag{6}
    d_{W, \alpha} := \min_{P \in U_{\alpha}(x, y)} \text{Tr}(PW^T).
    $$

- 容易证明, 当 $\alpha \rightarrow +\infty$ 的时候, $d_{W,\alpha}$ 趋近于最优传输距离.


## Sinkhorn-Knopp Algorithm

- 我们可以通过将 (6) 的硬约束转换成软约束 (注意, $\lambda 是人为给定的$) 来帮助求解

    $$
    \tag{7}
    \begin{align*}
    \min_{P} \quad & \sum_{ij} w_{ij} p_{ij} + \frac{1}{\lambda} \sum_{ij} p_{ij} \log p_{ij} \\
    \text{s.t.} \quad & \sum_{j} p_{ij} = x_i, i=1,2,\ldots, m, \\
    \quad & \sum_{i} p_{ij} = y_j, i=1,2,\ldots, n. \\
    \end{align*}
    $$

    注意, 对于 $\alpha$ 我们总能找到一个合适的 $\lambda$ 所导出的解是相同的, 但是这个对应关系不是那么容易发现, 通过需要通过二分法来查找. 但是, $\alpha \downarrow \longrightarrow \mathcal{H}(P) \uparrow \longrightarrow \lambda \downarrow$, 关系是一致的. 既然我们只是求一个近似解, 通过 $\alpha$ 或者 $\lambda$ 注入先验并没有本质的区别.

- 接下来我们通过拉格朗日乘子来求解 (7):

    $$
    \tag{8}
    \min_{P, \mu, \nu} \quad
    \sum_{ij} w_{ij} p_{ij}  + \frac{1}{\lambda} \sum_{ij} p_{ij} \log p_{ij} + \sum_{i} \mu_i (\sum_{j}p_{ij} - x_i) + \sum_{j} \nu_j (\sum_{i} p_{ij} - y_j).
    $$

- 所对应的 KKT 条件为:

    $$
    \tag{9}
    p_{ij}^{\lambda} = e^{-\frac{1}{2} - \lambda \mu_i} e^{-\lambda w_{ij}} e^{-\frac{1}{2} - \lambda \nu_j}, \\
    \sum_{j}p_{ij} = x_i, \quad
    \sum_{i}p_{ij} = y_j.
    $$
 
- **Sinkhorn-Knopp Algorithm:**
    1. 初始化: $p_{ij} = e^{-\lambda w_{ij}}$.
    2. 重复如下操作直至收敛:
        $$
        r_{i} \leftarrow x_i / \sum_{j} p_{ij}, \\
        p_{ij} \leftarrow p_{ij} / r_i, \\
        c_{j} \leftarrow y_j / \sum_{i} p_{ij}, \\
        p_{ij} \leftarrow p_{ij} / c_j.
        $$



## 参考文献

<ol class="reference">
  <li>
    Cutural M.
    <u>Sinkhorn Distances: Lightspeed Computation of Optimal Transportation Distances.</u>
    <a href="http://arxiv.org/abs/1306.0895" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <li>
    小白一枚.
    <u>Skinkhorn 距离简单易懂！</u>
    <a href="https://zhuanlan.zhihu.com/p/527799934" style="color: #007acc; font-weight: bold; text-decoration: none;">[Link]</a>
  </li>


  <li>
    马东什么
    <u>sinkhorn距离和Sinkhorn-Knopp算法.</u>
    <a href="https://zhuanlan.zhihu.com/p/10971105566" style="color: #007acc; font-weight: bold; text-decoration: none;">[Link]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>