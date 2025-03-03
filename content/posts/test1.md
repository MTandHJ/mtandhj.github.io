---
date: "2025-02-26"
draft: false
title: "Test1"
author: John Doe
tags:
  - hugo
  - front-matter
pinned: true
---



> [Navon A., Achituve I., Maron H., Chechik G. and Fetaya E. Auxiliary learning by implicit differentiation. ICLR, 2021.](http://arxiv.org/abs/2007.02693)


## 概

通过 implicit differentiation 优化一些敏感的参数.

$$
1 + 2f(x)
\phi \ell_{main}
$$


![20250303210913](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250303210913.png)

## AuxiLearn

- 在实际的训练中, 我们常常会通过一些额外的任务来帮助更好的训练.
    $$
    \ell_{main}, \bm{x}
    $$

其中 $\phi_k \ge 0$ 是第 $k$ 个额外任务 $\ell_k$ 的系数.

- 比较常见的做法是通过 grid search 来选择合适 $\phi_k$. 当额外任务的数量有效的时候尚可, 但是始终缺乏扩展性. 一种理想的方式通过某种可学习的方式设定.
    $$
    w_{t+1} \leftarrow  \arg \min_{W} \mathcal{L}_T(W; \phi_t) \phi_{t+1}
    $$

- 但是很显然, 如果利用梯度下降学习 $\phi_k$ 并通过 clip 保证 $\phi_k \ge 0$, 一定会导致 $\phi_k \equiv 0$ 这一平凡解.

### 问题设定

- 现在让我们来设定一个更加一般的问题:
    $$
    \ell_{main}(W; \mathcal{D}_{train})
    $$

其中 $W \in \mathbb{R}^n$ 是模型中的基本参数, $\phi \in \mathbb{R}^m$ 是一些其它的超参数, 然后 $D_{train}, D_{aux}$ 表示训练集和额外的集合 (比如验证集).

- 不考虑 mini-batch, 合理的训练流程应该是:


如此重复. 就能够避免 $\phi$ 的平凡解.

- 当然, 如果每一次都严格按照两阶段计算, 计算量是相当庞大的 (比 grid search 也是不遑多让). 本文所提出来的 AuxiLearn 的改进就是提出了一种近似方法. 它的理论基础是 [Implicit Function Theorem (IFT)](https://www.cnblogs.com/MTandHJ/p/13528744.html).

- 为了能够通过梯度下降的方式更新 $\phi$, 我们首先需要推导出它的梯度:
    $$
    \nabla_{\phi} \mathcal{L}_A = \underbrace{\nabla_W \mathcal{L}_A}_{1 \times n} \cdot \underbrace{\nabla_{\phi} W^*}_{n \times m}.
    $$
    显然, 其中 $\nabla_W \mathcal{L}_A$ 是好计算的, 问题在于 $\nabla_{\phi} W^*$ 的估计.

- 为了推导 $\nabla_{\phi} W^*$, 我们需要用到 IFT. IFT 告诉我们, 对于一个连续可微映射 $F(x, y): \mathbb{R}^{m} \times \mathbb{R}^n \rightarrow \mathbb{R}^n$. 在一定条件下, 如果存在 $p \in \mathbb{R}^m, q \in \mathbb{R}^n$ 使得
    $$
    F(p, q) = 0,
    $$
    则存在一个映射 $\Phi: \mathbb{R}^m \rightarrow \mathbb{R}^n$ 使得
    $$
    F(x, \Phi(x)) = 0
    $$
    在某个集合上均成立.

- 现在, 让我们来推导. 首先 $W^*$ 是 $\mathcal{L}_T$ 的最优点, 当
    $$
    \nabla_W \mathcal{L}_T(W^*, \phi) = 0,
    $$
    令 $F$ 为 $\nabla_W \mathcal{L}_T$, $x$ 为 $\phi$, $y$ 为 $W$, 套用 IFT, 可知, 存在 $W^*(\phi)$ 使得
    $$
    \nabla_W \mathcal{L}_T(W^*(\phi), \phi) = 0,
    $$
    在包含 $\phi$ 的某个子集上都成立. 于是, 我们有
    $$
    \nabla_{\phi} \nabla_W \mathcal{L}_T(W^*(\phi), \phi) = 0 \\
    \Rightarrow
    \nabla_W^2 \mathcal{L}_T \cdot \nabla_{\phi} W^* + \nabla_{\phi} \nabla_W \mathcal{L}_T = 0 \\
    \Rightarrow
    \nabla_{\phi} W^* = - (\nabla_W^2 \mathcal{L}_T)^{-1} \cdot  \nabla_{\phi} \nabla_W \mathcal{L}_T.
    $$

- 因此, $\phi$ 处的梯度为:
    $$
    \nabla_{\phi} \mathcal{L}_A = -\underbrace{\nabla_W \mathcal{L}_A}_{1 \times n} \cdot \underbrace{(\nabla_W^2 \mathcal{L}_T)^{-1}}_{n \times n}) \cdot  \underbrace{\nabla_{\phi} \nabla_W \mathcal{L}_T}_{n \times m}.
    $$

- 现在的问题是, 怎么估计 $(\nabla_W^2 \mathcal{L}_T)^{-1}$, 作者采用 Neumann series. Neumann series 告诉我们:
    $$
    (I - X)^{-1} = \sum_{t} X^t \Rightarrow X^{-1} = (I - (I - X))^{-1} = \sum_{t} (I - X)^t.
    $$
    于是便得到了本文 AuxiLearn 算法 (算法 2 其实就是 Neumann series 的前 $J$ 项):

![](https://img2023.cnblogs.com/blog/1603215/202410/1603215-20241011195313992-684854813.png)


## 理解两阶段的训练

- 让我们通过一个最简单的例子来理解:
    $$
    \mathcal{L}_T(W, \phi) = \ell_{main}(W; \mathcal{D}_{train}) + \phi \cdot \ell_{aux}(W; \mathcal{D}_{train}).
    $$

- 容易发现:
    $$
    \begin{array}{ll}
    \frac{d \mathcal{L}_A}{d \phi}
    &= -\nabla_W \mathcal{L}_A \cdot (\nabla_W^2 \mathcal{L}_T)^{-1} \cdot  \nabla_{\phi} \nabla_W \mathcal{L}_T \\
    &= -\nabla_W \mathcal{L}_A \cdot (\nabla_W^2 \mathcal{L}_T)^{-1} \cdot  \nabla_{\phi} (\nabla_W \mathcal{\ell}_{main}(\mathcal{D}_{train}) + \phi \nabla_W \ell_{aux}) \\
    &= -\nabla_W \mathcal{L}_A \cdot (\nabla_W^2 \mathcal{L}_T)^{-1} \cdot  \nabla_W^T \mathcal{\ell}_{aux}(\mathcal{D}_{train}) \\
    &= -\nabla_W \mathcal{L}_{main}(\mathcal{D}_{aux}) \cdot (\nabla_W^2 \mathcal{L}_T)^{-1} \cdot  \nabla_W^T \mathcal{\ell}_{aux}(\mathcal{D}_{train}). \\
    \end{array}
    $$

- 可以发现, $\phi$ 逐渐增大的前提是:
    $$
    \nabla_W \mathcal{L}_{main}(\mathcal{D}_{aux}) \cdot (\nabla_W^2 \mathcal{L}_T)^{-1} \cdot  \nabla_W^T \mathcal{\ell}_{aux}(\mathcal{D}_{train}) > 0,
    $$
    即当主任务在 aux 集合上的更新方向和辅任务在训练集上在 $\nabla_W^2 \mathcal{L}_T^{-1}$ 意义上方向一致.

## 代码

[[official-code](https://github.com/AvivNavon/AuxiLearn)]