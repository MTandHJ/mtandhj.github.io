---
date: "2025-07-29"
draft: false
title: "Multiple-Gradient Descent Algorithm (MGDA) for Multiobjective Optimization"
description: "从梯度融合角度理解多任务/多目标优化"
author: MTandHJ
tags:
  - Note
  - Multi-Task
  - Multi-Objective
  - Theoretical
  - 2012
pinned: false
---


## 预备知识

- (**Multi-Objective Learning, MOL**) 在现实中, 我们往往有不止一个 (连续可微的) 优化目标 ($T \ll d$)

    $$
    \tag{1}
    f_i: \mathbb{R}^d \rightarrow \mathbb{R},
    i=1,2,\ldots, T.
    $$

    自然, multi-objective learning 就是希望尽可能地让所有的目标都**最小**. 为了方便起见, 引入向量形式:

    $$
    \mathbf{f}: \mathbb{R}^d \rightarrow \mathbb{R}^T, \quad \mathbf{f} = [f_1, f_2, \ldots, f_T].
    $$

- (**Pareto-Optimal**) 显然, 很难有这么理想的情况 $\theta^* \in \mathbb{R}^d$ 恰好是所有目标的 $f_i$ 的最(极)小值点. 因此, 在研究 MOL 的时候, 我们通常追求的是 Pareto-Optimal: $\theta^*$ 是 pareto-optimal 的, 如果**不存在** $\theta \in \mathbb{R}^d$ 满足

    $$
    \tag{2}
    \mathbf{f}(\theta) \preceq \mathbf{f}(\theta^*) \text{ and } \exist i, \: f_i(\theta) < f_i(\theta^*).
    $$

    这里 $\preceq$ 表示 element-wise 的大小比较.

- (**Multiple-Gradient Descent Algorithm, MGDA**) 梯度下降几乎是单目标学习的不二法门了, 我们的目标就是探索在多目标的情况下是否依然有这种算法来帮助我们学习. 核心思想是简单的, 令

    $$
    \tag{3}
    \mathbf{g}_i := \nabla_{\theta} f_i \in \mathbb{R}^d, \quad
    \mathbf{G} := \nabla_{\theta} \mathbf{f} =
    \left [
        \begin{array}{c}
        \mathbf{g}_1^T \\
        \mathbf{g}_2^T \\
        \vdots \\
        \mathbf{g}_T^T \\
        \end{array}
    \right ] \in \mathbb{R}^{T \times d}.
    $$

    我们的目标是找到所有目标的下降方向 $\mathbf{v}$ 使得

    $$
    \tag{4}
    \mathbf{G}\mathbf{v} = [\mathbf{g}_1^T \mathbf{v}, \mathbf{g}_2^T \mathbf{v}, \ldots, \mathbf{g}_T^T \mathbf{v}] \preceq \mathbf{0}.
    $$

    如此一来, 通过选择合适的步长  $\eta$, 能够保证

    $$
    \mathbf{f}(\theta + \eta \mathbf{v}) \preceq \mathbf{f}(\theta).
    $$

    亟待解决的问题是:

    1. **存在性:** 是否对于每个 $\theta \not= \theta^*$ 都存在这样的方向 $\mathbf{v}$ 呢?

    2. **求解方式:** 如果存在 $\mathbf{v}$, 如何求解呢?


## 核心思想

- 让我们定义由 $\{\mathbf{g}_i\}$ 所组成的凸包 (convex hull):

    $$
    \tag{5}
    \mathcal{G} := \{
        \mathbf{g} \in \mathbb{R}^d:
        \mathbf{g} = \sum_{i=1}^T \alpha_i \mathbf{g}_i, \quad \alpha_i \ge 0, \: \sum_{i=1}^T \alpha_i = 1
    \}.
    $$

- 假设 $\bm{w} = \text{argmin}_{\mathbf{g} \in \mathcal{G}} \|\mathbf{g}\|_2$, 此时我们有

    $$
    \mathbf{g}^T \bm{\omega} \ge \|\bm{\omega}\|_2^2, \quad \forall  \mathbf{g} \in \mathcal{G},
    $$

    显然, 这也包括

    $$
    \tag{6}
    \mathbf{g}_i^T \bm{\omega} \ge \|\bm{\omega}\|_2^2 \ge 0, \quad i=1,2,\ldots, T.
    $$

---
*proof:*

既然 $\mathbf{g}, \bm{w} \in \mathcal{G}$, 则 $\forall \epsilon \in [0, 1]$ 有

$$
(1 - \epsilon) \bm{\omega} + \epsilon \mathbf{g} \in \mathcal{G}.
$$

因此, 我们有

$$
\left((1 - \epsilon) \bm{\omega} + \epsilon \mathbf{g} \right)^T
\left((1 - \epsilon) \bm{\omega} + \epsilon \mathbf{g} \right) \ge \|\bm{w}\|^2 \\
\Rightarrow \epsilon \bm{\omega}^T (\mathbf{g}- \bm{\omega}) + \epsilon^2 (\mathbf{g} - \bm{w})^T(\mathbf{g} - \bm{w}) \ge 0, \quad \forall \epsilon \in [0, 1].
$$

因此, $\bm{\omega}^T (\mathbf{g} - \bm{\omega}) \ge 0$, 这意味着

$$
\mathbf{g}^T \bm{\omega} \ge \|\bm{\omega}\|^2.
$$

---

- (**存在性**) 如此一来, 我们只需取

    $$
    \tag{7}
    \mathbf{v} \leftarrow -\bm{\omega},
    $$

    就找到了符合 (4) 要求的下降方向.


- (**Frank-Wolfe**) 在介绍如何求解 $\bm{\omega}$ 之前, 让我们先简单了解一下 Frank-Wolfe 算法, 其目标是求解问题:

    $$
    \tag{8}
    \begin{align*}
    \min_{\mathbf{x} \in \mathbb{R}^d} \quad & f(\mathbf{x}) \\
    \text{s.t.} \quad & \mathbf{A} \mathbf{x} \le \mathbf{b}, \quad \mathbf{M} \mathbf{x} = \mathbf{m}.
    \end{align*}
    $$

- 其分解为如下步骤:

    1. 每一步求解一阶近似 (通常该问题是容易求解的):

        $$
        \tag{9}
        \begin{align*}
        \min_{\mathbf{x}_t \in \mathbb{R}^d} \quad & f(\mathbf{x}_{t - 1}) + \nabla^T f(\mathbf{x}_{t-1}) (\mathbf{x}_t - \mathbf{x}_{t-1}) \Leftrightarrow \nabla^T f(\mathbf{x}_{t-1}) \mathbf{x}_t\\
        \text{s.t.} \quad & \mathbf{A} \mathbf{x}_t \le \mathbf{b}, \quad \mathbf{M} \mathbf{x}_t = \mathbf{m}.
        \end{align*}
        $$

        计算得到该问题的精确解 $\mathbf{\hat{x}}_t$, 由此得到一个可行的下降方向 $\mathbf{v}_t = \mathbf{\hat{x}}_t - \mathbf{x}_{t-1}$.
    
    2. 计算最速下降步长 $\eta$:

        $$
        \tag{10}
        \eta_t = \text{argmin}_{\eta \in [0, 1]} f(\mathbf{x}_{t-1} + \eta \cdot \mathbf{v}_t).
        $$
    
    3. 更新:

        $$
        \tag{11}
        \mathbf{x}_t \leftarrow \mathbf{x}_{t-1} + \eta_t \mathbf{v}_t = (1 - \eta_t) \mathbf{x}_{t-1} + \eta \mathbf{\hat{x}}_{t-1}.
        $$


- 求解 $\bm{\omega}$ 的过程实际上就是求解如下的问题 ($\bm{\omega} = \mathbf{G}^T \bm{\alpha}^*$):

    $$
    \tag{12}
    \begin{align*}
    \min_{\bm{\alpha}} \quad & \bm{\alpha}^T \mathbf{G} \mathbf{G}^T \bm{\alpha} \\
    \text{s.t.} \quad & -\bm{\alpha} \preceq \mathbf{0}, \: \mathbf{1}^T \bm{\alpha} = 1.
    \end{align*}
    $$

- 其一阶近似问题为:

    $$
    \tag{13}
    \begin{align*}
    \min_{\bm{\alpha}_t} \quad & \bm{\alpha}_{t-1}^T \mathbf{G} \mathbf{G}^T \bm{\alpha}_t \\
    \text{s.t.} \quad & -\bm{\alpha}_t \preceq \mathbf{0}, \: \mathbf{1}^T \bm{\alpha}_t = 1.
    \end{align*}
    $$

    其解为 $\bm{\hat{\alpha}}_t = \mathbf{e}_{k^*} = [\underbrace{0, 0, \ldots, 0}_{k^*-1}, 1, 0 ,0 ,\ldots, 0]^T, \quad k^* = \text{argmin}_k [\mathbf{G}\mathbf{G}^T \bm{\alpha}_{t-1}]_k$.

- 最速下降步长为:

    $$
    \tag{14}
    \eta_t = \text{argmin}_{\eta \in [0, 1]}
    \left[
        (1 - \eta) \bm{\alpha}_{t-1} + \eta \bm{\hat{\alpha}}_t
    \right]^T
    \mathbf{G}
    \mathbf{G}^T
    \left[
        (1 - \eta) \bm{\alpha}_{t-1} + \eta \bm{\hat{\alpha}}_t
    \right]
    $$

    该问题有闭式解${}^{[3]}$, 为

    $$
    \tag{15}
    \eta_t = \max \left(
        \min \left(
            \frac{
                (\bm{\alpha}_{t-1} - \bm{\hat{\alpha}_t})^T \mathbf{GG}^T \bm{\alpha}_{t-1}
            }{
                \|\mathbf{G}^T (\bm{\alpha}_{t-1} - \bm{\hat{\alpha}_t})\|_2^2
            },
            1
        \right),
        0
    \right).
    $$

- (**均衡下降性质**)  倘若 $\bm{\omega}$ 满足 $\alpha_i > 0 \: \forall i$, 即 $\bm{\omega}$ 是 $\mathcal{G}$ 一内点, 此时有

    $$
    \tag{16}
    \mathbf{g}_i^T \bm{\omega} = \|\bm{\omega}\|_2^2, \quad \forall i=1,2,\ldots, T.
    $$

    即此时此刻最终的下降方向 $\mathbf{v} = -\bm{\omega}$ 在各个目标上的分量是一致的.

---

*proof:*

$\omega$ 作为内点, 保证了 LICQ 条件的成立 (此时仅等式约束被激活), 因而可以直接分析 (12) 的 KKT 条件我们有:

$$
\mathbf{g}_i^T \bm{\omega} - \lambda_i \alpha_i + \mu = 0, \\
\lambda_i \alpha_i = 0, 
\: \mu \cdot \mathbf{1}^T \bm{\alpha} = 0, \\
\lambda_i \ge 0, \\
i=1,2,\ldots, T.
$$

因此:

$$
\mathbf{g}_i^T \bm{\omega} = -\mu,
$$

又

$$
\bm{\omega}^T
\bm{\omega} = \sum_{i=1}^T \alpha_i \mathbf{g}_i^T\bm{\omega} = -\mu.
$$

因此, (16) 成立.

---


- 从我个人角度来说, 我不确定每个目标以相同的方式下降是不是好的先验. 特别是在普遍用 momentum-based optimizers 的当下. [1] 中主要讨论了另外的融合方式, 通过引入 $\|\mathbf{v}\|_2^2$ 等约束来保证求解 optimal 方向的凸性.

## 参考文献

<ol class="reference">
  <li>
    Fliege J. and Svaiter B.  F.
    <u>Steepest Descent Methods for Multicriteria Optimization.</u>
    <i>Math Meth Oper Res</i>, 2000.
    <a href="https://link.springer.com/article/10.1007/s001860000043" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <li>
    Desideri J.
    <u>Multiple-Gradient Descent Algorithm (MGDA) for Multiobjective Optimization.</u>
    <i>C. R. Acad. Sci. Paris, Ser. I</i>, 2012.
    <a href="https://www.sciencedirect.com/science/article/pii/S1631073X12000738" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <li>
    Sener O. and Koltun V.
    <u>Multi-Task Learning as Multi-Objective Optimization.</u>
    <i>NeurIPS</i>, 2018.
    <a href="https://proceedings.neurips.cc/paper/2018/file/432aca3a1e345e339f35a30c8f65edce-Paper.pdf?msclkid=43184066ce9e11ec9e7b8bbe1281bf80" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/isl-org/MultiObjectiveOptimization" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>