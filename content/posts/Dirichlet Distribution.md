---
date: "2025-12-27"
draft: false
title: "Dirichlet Distribution"
description: "狄利克雷分布的一些性质"
author: MTandHJ
tags:
  - Math
  - Bayes
pinned: false
---


## 预备知识


||Gamma|Beta|Dirichlet|
|:-:|:-:|:-:|:-:|
||$\text{Ga}(\alpha, \lambda)$|$\text{Be}(\alpha, \beta)$|$\text{Dir}(\bm{\alpha})$|
|domain| $x > 0$ | $x \in [0, 1]$|$x_k \in [0, 1], k \in \{1, 2, \ldots, K\}, \: \sum_{k=1}^K x_k = 1$|
|PDF $f(\cdot)$ |$\frac{x^{\alpha-1} e^{-\lambda x} \lambda^{\alpha}}{\Gamma(\alpha)}$| $\frac{x^{\alpha} (1 - x)^{\beta - 1}}{\text{B}(\alpha, \beta)}$ |$\frac{1}{\text{B}(\bm{\alpha})} \prod_{k=1}^K x_k^{\alpha_k - 1}$|
|$\mu$|$\alpha / \lambda$|$\frac{\alpha}{\alpha + \beta}$|$\mathbb{E}[X_k] = \frac{\alpha_k}{\alpha_0}$, $\alpha_0 = \sum_{k=1}^K \alpha_k$|
|$\sigma^2$|$\alpha / \lambda^2$|$\frac{\alpha \beta}{(\alpha + \beta)^2(\alpha + \beta + 1)}$|$\text{Cov}(X_i, X_j) = \frac{\delta_{ij}\frac{\alpha_i}{\alpha_0} -  \frac{\alpha_i \alpha_j}{\alpha_0^2}}{\alpha_0 + 1}$|


**注:**

$$
\Gamma(\alpha) = \int_0^{\infty} t^{\alpha - 1} e^{-t} \mathrm{d}t, \\
\text{B} (\alpha, \beta) = \frac{\Gamma (\alpha) \Gamma (\beta)}{\Gamma (\alpha + \beta)}, \:
\text{B}(\bm{\alpha}) = \frac{\sum_{k=1}^K \Gamma(\alpha_k)}{\Gamma(\alpha_0)}.
$$

首先容易发现, Dirichlet 分布是 Beta 分布的一个高维拓展.

## 有趣的性质

### 从 Gamma 到 Dirichlet

- Dirichlet 可以看成是 Gamma 分布采样 & 归一化的结合.

- 假设 $X_k \sim \text{Ga}(\alpha_k, 1), k=1,2\ldots, K$ 且独立, 我们有
    1. $S = \sum_{k=1}^K X_k \sim \text{Ga}(\alpha_0 := \sum_{k=1}^K \alpha_k, 1)$;
    2. $\sum_{k=A} X_k / S \sim \text{Be}(\sum_{k \in A} \alpha_k, \alpha_0  - \sum_{k \in A} \alpha_k)$;
    2. $[X_1 / S, \ldots, X_K / S] \sim \text{Dir}(\alpha_1, \ldots, \alpha_K)$.

*proof:*

1. 由于 $X_k$ 独立, 容易发现

    $$
    \begin{align*}
    f(S=s) 
    &\propto \int_{x_1 + x_2 + \cdots x_K = s} \prod_{k=1}^K x_k^{\alpha_k - 1} \cdot e^{- \sum_{k=1}^K x_k} \mathrm{d}\bm{x} \\
    &\propto e^{-s} \int_{x_1 + x_2 + \cdots x_K = s} \prod_{k=1}^K x_k^{\alpha_k - 1} \mathrm{d}\bm{x} \\
    &\propto e^{-s} \int_{m_{K-2} := \sum_{k=1}^{K-2} x_k \le s} \int_{x_{K-1} + x_K = s - m_{K-2}} \prod_{k=1}^K x_k^{\alpha_k - 1} \mathrm{d}\bm{x}.
    \end{align*}
    $$

让我们首先讨论简化的情况:

$$
\begin{align*}
& \int_{x_1 + x_2 = s} x_1^{\alpha_1 - 1} x_2^{\alpha_2 - 1} \mathrm{d}[x_1, x_2] \\
=& \int_{0}^s x_1^{\alpha_1 - 1} (s-x_1)^{\alpha_2 - 1} \mathrm{d}x_1 \\
=& s\int_{0}^s x_1^{\alpha_1 - 1} (s-x_1)^{\alpha_2 - 1} \mathrm{d}\frac{x_1}{s} \\
=& s\int_{0}^1 (sy)^{\alpha_1 - 1} (s-sy)^{\alpha_2 - 1} \mathrm{d}y \\
=& s^{\alpha_1 + \alpha_2 - 1} \underbrace{\int_{0}^1 (y)^{\alpha_1 - 1} (1-y)^{\alpha_2 - 1} \mathrm{d}y}_{\text{kernel of Beta Distribution}} \\
\propto& s^{\alpha_1 + \alpha_2 - 1}.
\end{align*}
$$

因此, 类推可得

$$
f(S = s) \propto s^{\alpha_0 - 1} e^{-s} \sim \text{Ga}(\alpha_0, 1).
$$


2. 容易发现,

    $$
    \begin{align*}
    f(\sum_{k \in A} X_k / S = c) 
    &\propto \int_{s=0}^{+\infty} \int_{\sum_{k \in A} x_k = cs} \int_{\sum_{k \not \in A} x_k = s - cs} \prod_{k=1}^K x_k^{\alpha_k - 1} \cdot e^{-\sum_{k=1}^Kx_k} \mathrm{d} \bm{x} \\
    &\propto \int_{s=0}^{+\infty} (s - cs)^{\sum_{k \not \in A} \alpha_k - 1} e^{-(s - cs)} \int_{\sum_{k \in A} x_k = cs} \prod_{k \in A} x_k^{\alpha_k - 1} \cdot e^{-\sum_{k \in A} x_k} \mathrm{d} \bm{x}_A \mathrm{d}s \\
    &\propto \int_{s=0}^{+\infty} (s - cs)^{\sum_{k \not \in A} \alpha_k - 1} e^{-(s - cs)} cs^{\sum_{k \in A} \alpha_k - 1} e^{-cs}  \mathrm{d}s \\
    &\propto \int_{s=0}^{+\infty} (s - cs)^{\sum_{k \not \in A} \alpha_k - 1} cs^{\sum_{k \in A} \alpha_k - 1} e^{-s}  \mathrm{d}s \\
    &\propto c^{\sum_{k \in A} \alpha_k - 1} (1 - c)^{\sum_{k \not \in A}\alpha_k - 1} \int_{s=0}^{+\infty} s^{\alpha_0 - 1}  e^{-s}  \mathrm{d}s \\
    &\propto c^{\sum_{k \in A} \alpha_k - 1} (1 - c)^{\sum_{k \not \in A}\alpha_k - 1}.
    \end{align*}
    $$

3. 容易证明,

    $$
    \begin{align*}
    & f(X_1/S = \tilde{x}_1, \ldots, X_K / s = \tilde{x}_K) \\
    \propto& \int_{s=0}^{\infty} \prod (s \cdot \tilde{x}_k)^{\alpha_k - 1} \cdot e^{- s \sum_{k=1}^K \tilde{x}_k} \mathrm{d} s \\
    =& \int_{s=0}^{\infty} \prod (s \cdot \tilde{x}_k)^{\alpha_k - 1} \cdot e^{- s \cdot 1} \mathrm{d} s \\
    =& \prod_{k=1}^K \tilde{x}_k^{\alpha_k - 1} \int_{s=0}^{\infty} s^{\sum_{k=1}^K \alpha_k - K} \cdot e^{- s} \mathrm{d} s \\
    \propto& \prod_{k=1}^K  \tilde{x}_k^{\alpha_k - 1}.
    \end{align*}
    $$


### Dirichlet Prior


- Dirichlet 分布和 categorical or multinomial 分布共轭: 给定

    $$
    \begin{array}{lll}
    \bm{\alpha} &= (\alpha_1, \ldots, \alpha_K) &= \text{concentration hyperparameter} \\
    \bm{p|\alpha} &= (p_1, \ldots, p_K) & \sim \text{Dir}(\bm{\alpha})  \\
    \mathbb{X}|\bm{p} &= (x_1, \ldots, x_N) & \sim \text{Cat}(N, \bm{p}),
    \end{array}
    $$

    我们有如下后验分布成立:

    $$
    \begin{array}{lll}
    \bm{c} &= (c_1, \ldots, c_K) & = \text{number of occurrences of category } k \\
    \bm{p} | \mathbb{X} &\sim \text{Dir}(K, \bm{c + \alpha}) &= \text{Dir} (K, c_1 + \alpha_1, \ldots, c_K + \alpha_K).
    \end{array}
    $$

*proof:*

$$
\begin{align*}
\bm{f}(\bm{p}|\mathbb{X})
&\propto f(\mathbb{X}|\bm{p}) f(\bm{p}) \\
&\propto \prod_{n=1}^N \prod_{k=1}^K (p_k^{\mathbb{I}[x_n = k]} \cdot p_k^{\alpha_k - 1}) \\
&\propto \prod_{k=1}^K \prod_{n=1}^N (p_k^{\mathbb{I}[x_n = k]} \cdot p_k^{\alpha_k - 1}) \\
&\propto \prod_{k=1}^K (p_k^{c_k} \cdot p_k^{\alpha_k - 1})
\propto \prod_{k=1}^K p_k^{\alpha_k + c_k - 1}.
\end{align*}
$$


- 因此, 倘若我们假设多项式分布的先验是一个狄利克雷分布, 则对应的:
    - **Bayes Estimator (后验均值):**

        $$
        \hat{p}_k = \frac{\alpha_k + c_k}{\sum_{k=1}^K (\alpha_k + c_k)}.
        $$

    - **Maximum Posterior Probability:**

        $$
        \hat{p}_k = \frac{\alpha_k + c_k - 1}{\sum_{k=1}^K (\alpha_k + c_k) - K}.
        $$


## 参考文献

<ol class="reference">
  <li>
    Tokdar S. T.
    <u>STA 941: Bayesian Nonparametrics.</u>
    <a href="https://www2.stat.duke.edu/~st118/sta941/dirichlet.pdf" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <li>
    Wikipedia.
    <u>Dirichlet distribution.</u>
    <a href="https://www2.stat.duke.edu/~st118/sta941/dirichlet.pdf" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>


  <!-- 添加更多文献条目 -->
</ol>