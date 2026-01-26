---
date: "2026-01-25"
draft: false
title: "Fine-Tuning Language Models with Just Forward Passes"
description: "零阶优化 & 收敛理论"
author: MTandHJ
tags:
  - Note
  - Optimization
  - Zeroth-Order
  - LLM
  - Theoretical
  - 2023
pinned: false
---

## 预备知识

- (**庞大的优化显存开销**) 传统的基于梯度下降的优化方法, 一方面需要梯度回传, 另一方面 Adam 等主流优化器因为需要维护一阶矩二阶矩估计, 因此在计算复杂度上尤其是显存占用上需求极大.

## 核心思想

![20260125165102](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260125165102.png)

- (**随机扰动**) 假设我们需要关于参数 $\theta$ 优化目标 $\mathcal{L}(\theta)$, 可以通过如下非梯度下降的方式实现:

    $$
    \theta_{t+1} \leftarrow
    \left \{
    \begin{array}{ll}
    \theta_t + \delta & \text{if } \mathcal{L}(\theta_t + \delta) < \mathcal{L}(\theta_t), \\
    \theta_t - \delta & \text{otherwise} .
    \end{array}
    \right .
    $$

    上述方式能够"收敛"的前提是 $\|\delta\|$ 足够小, 从而能够保证:
    
    $$
    \mathcal{L}(\theta_t + \delta) < \mathcal{L}(\theta)
    \text{ or } \mathcal{L}(\theta_t - \delta) \ge \mathcal{L}(\theta).
    $$

- (**一阶近似**) 上述方式有希望 work 的原因的核心原因是:

    $$
    \mathcal{L}(\theta + \delta) \approx \mathcal{L}(\theta) + \delta^T \nabla_{\theta} \mathcal{L}, \\
    \mathcal{L}(\theta - \delta) \approx \mathcal{L}(\theta) - \delta^T \nabla_{\theta} \mathcal{L}.
    $$

    且随着 $\|\delta\|$ 收缩, 近似效果越好. 因而, 只要每次的更新量不太大, 我们能够保证每一次更新目标函数 $\mathcal{L}$ 是递减的. 关键在于, 这个过程只需要前向推理即刻, 而不需要反向传播.

- (**Simultaneous Perturbation Stochastic Approximation, SPSA**) 一阶梯度的近似方法有很多种, 本文 MeZO 建议 SPSA:

    $$
    \hat{\nabla} \mathcal{L}(\theta) = 
    \frac{\mathcal{L}(\theta + \epsilon \bm{z}) - \mathcal{L}(\theta - \epsilon \bm{z})}{2\epsilon} \bm{z} \approx \frac{2 (\epsilon \bm{z})^T \nabla \mathcal{L}}{2 \epsilon} \bm{z} =  (\bm{z} \bm{z}^T) \cdot \nabla \mathcal{L}, \: \bm{z} \sim \mathcal{N}(0, \bm{I}_d).
    $$

    因此, 通过 SPSA 需要通过**两次**前向传播来估计"一阶梯度". 然后通过如下方式即可更新参数:

    $$
    \theta_{t+1} \leftarrow \theta_t - \eta_t \cdot \hat{\nabla}\mathcal{L}(\theta).
    $$

    注意到, MeZO 这里引入了 $\epsilon, \eta_t$ (通常来说, $\epsilon \gg \eta$), 前者是为了控制估计梯度的是变化量的大小, 后者是控制实际的学习步长. Algorithm 1 给出是 inplace 计算的版本.

- (**n-SPSA**) 当然, 我们可以进行多次 SPSA 然后取平均得到更加鲁棒的估计:

    $$
    \hat{\nabla} \mathcal{L}(\theta) = \frac{1}{n} \sum_{i=1}^n
    \frac{\mathcal{L}(\theta + \epsilon \bm{z}_i) - \mathcal{L}(\theta - \epsilon \bm{z}_i)}{2\epsilon} \bm{z}_i.
    $$

    对应算法如下所示:

![20260125171920](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260125171920.png)


## 关于学习率 $\eta$

- (**Descent Lemma**)  倘若 $\mathcal{L}(\theta)$ 是 $\ell-$smooth 的, 令

    $$
    g(\theta; \mathcal{B}) := \nabla_{\theta} \mathcal{L}(\theta; \mathcal{B}),
    $$

    在 mini-batch 数据 $\mathcal{B}$ 上的梯度, 且 $\mathbb{E}[g(\theta; \mathcal{B})] = \nabla \mathcal{L}(\theta)$, 则有

    $$
    \mathbb{E}[\mathcal{L}(\theta_{t+1})| \theta_t]  - \mathcal{L}(\theta_t)
    \le - \eta \|\nabla \mathcal{L}(\theta_t) \|^2 + \frac{1}{2} \eta^2 \ell \cdot \mathbb{E}[
        \| \bm{g}(\theta, \mathcal{B})\|^2
    ].
    $$

- (**Gradient Norm of MeZO**) 类似的, 我们有

    $$
    \mathbb{E} \left[
        \|\hat{\nabla}\mathcal{L}(\theta; \mathcal{B}) \|^2
    \right]
    \overset{\epsilon \rightarrow 0}{=} \frac{d + n - 1}{n} \mathbb{E}\left[ 
        \|\nabla\mathcal{L}(\theta; \mathcal{B}) \|^2
    \right],
    $$

    这里 $d$ 是模型参数的维度, $n$ 是 $n$-SPSA 的数量.

*proof:*

$$
\begin{align*}
    \mathbb{E} \left[
        \|\hat{\nabla}\mathcal{L}(\theta; \mathcal{B}) \|^2
    \right]
    &\overset{\epsilon \rightarrow 0}{=}
    \frac{1}{B^2n^2} \sum_{x_1, x_2 \in \mathcal{B}} \sum_{i, j=1}^n
    \mathbb{E}\left[
        (\bm{z}_i \bm{z}_i^T g_1)^T (\bm{z}_j \bm{z}_j^T g_2)
    \right] \\
    &=
    \frac{1}{B^2n^2} \sum_{x_1, x_2 \in \mathcal{B}} 
    \sum_{i, j=1}^n
    \text{Tr}\left(
    \mathbb{E}\left[
        \bm{z}_i \bm{z}_i^T \bm{z}_j \bm{z}_j^T 
    \right] \mathbb{E}\left[ g_2 g_1^T \right] \right) \\
    &=
    \frac{1}{B^2n^2} 
    \text{Tr}\left(
    \sum_{x_1, x_2 \in \mathcal{B}} 
    \left (n (n-1) \bm{I}_d +
    \sum_{i = j}
    \mathbb{E}\left[
        \bm{z} \bm{z}^T \bm{z} \bm{z}^T 
    \right] \right ) \mathbb{E}\left[ g_2 g_1^T \right]
    \right )
    \\
    &=
    \frac{1}{B^2n^2} 
    \text{Tr}\left(
    \sum_{x_1, x_2 \in \mathcal{B}} 
    \left (n (n-1) \bm{I}_d +
    n
    \mathbb{E}\left[
        \bm{z} \bm{z}^T \bm{z} \bm{z}^T 
    \right] \right ) \mathbb{E}\left[ g_2 g_1^T \right]
    \right )
    \\
    &=
    \frac{1}{B^2n} 
    \text{Tr}\left(
    \sum_{x_1, x_2 \in \mathcal{B}} 
    \left ((n-1) \bm{I}_d +
    \mathbb{E}\left[
        \bm{z} \bm{z}^T \bm{z} \bm{z}^T 
    \right] \right ) \mathbb{E}\left[ g_2 g_1^T \right]
    \right )
    \\
    &=
    \frac{1}{B^2n} 
    \text{Tr}\left(
    \sum_{x_1, x_2 \in \mathcal{B}} 
    \left ((n-1) \bm{I}_d +
    (d + 2) \bm{I}_d
    \right ) \mathbb{E}\left[ g_2 g_1^T \right]
    \right )
    \\
    &=
    \frac{d + n + 1}{B^2n} 
    \sum_{x_1, x_2 \in \mathcal{B}} 
    \mathbb{E}\left[ g_1^Tg_2  \right]
    \\
\end{align*}
$$



类似的, 我们有

$$
\begin{align*}
    \mathbb{E}\left[ 
        \|\nabla\mathcal{L}(\theta; \mathcal{B}) \|^2
    \right]
    &= \frac{1}{B^2} \sum_{x_1, x_2 \in \mathcal{B}} \mathbb{E}[g_1^Tg_2]
\end{align*}
$$

**注:** 这里证明出来的 scale factor 实际上是 $\frac{d+n+1}{n}$, 和文中的结果不同, 我检查了这里的证明似乎没有什么问题, 如果有人发现纰漏, 请随时指出.

- 根据上述结果, 为了保证收敛性, 似乎要求 $\eta_{\text{ZO}} = \mathcal{O}(\frac{1}{d}) \eta _{\text{SGD}}$, 这在规模比较大的情况下, 是会导致非常非常小的学习步长的.

- 但是, 作者实际上并没发现在大语言模型中微调时需要什么用非常非常小的学习率, 因此, 作者进一步研究. 发现, 如果当整体参数的 Hessian 矩阵满足低秩 $\gamma$ 的情况下 (训练充分的模型通常都具有这种性质), 学习率的 scale 仅仅需要 $1 / \gamma$, 与参数量无直接联系 (具体证明请回看原文).

- 因此, 这也是 MeZO 强调仅仅在微调阶段使用零阶优化的原因.


## 参考文献

<ol class="reference">

  <li>
    Malladi S., Gao T., Nichani E., Damian A., Lee J. D., Chen D. and Arora S.
    <u>Fine-Tuning Language Models with Just Forward Passes.</u>
    <i>NeurIPS</i>, 2023.
    <a href="http://arxiv.org/abs/2305.17333" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/princeton-nlp/MeZO" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>