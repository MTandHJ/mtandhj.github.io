---
date: "2026-03-04"
draft: false
title: "REINFORCE Algorithm"
description: "著名的 REINFORCE 算法"
author: MTandHJ
tags:
  - Note
  - Reinforcement Learning
  - Seminal
  - 1992
pinned: false
---


## 预备知识

- $s \in \mathcal{S}$, state;
- $a \in \mathcal{A}$, action;
- $p(s'|s, a)$ 在状态 $s$ 和动作 $a$ 下的状态转移概率;
- $\pi(a|s)$ 给定状态 $s$ 产生动作 $a$ 的概率;
- $r \in \mathbb{R}$, reward;
- $\rho_0$, 初始状态 $s_0$ 的分布;

## 核心思想

- 在轨迹 $\tau = (s_0, a_0, s_1, a_1, \ldots)$ 下, 强化学习的优化目标是

    $$
        \max_{\theta} \, \mathbb{E}_{\tau \sim P|\theta} \left[
            r(\tau)
        \right].
    $$

    现在的问题是, 如何通过梯度方法优化参数化的决策模型 $\pi_{\theta}$, 关键是如何通过上述式子计算梯度.

- (**REINFORCE Algorithm**) 让我们一步一步计算梯度:
    1. 展开:

        $$
        \begin{align*}
        \nabla_{\theta} \mathbb{E}_{\tau \sim P|\theta} [r(\tau)] 
        & = \nabla_{\theta} \int_{\tau} P(\tau; \theta) r(\tau)
        =  \int_{\tau} r(\tau) \cdot \nabla_{\theta} P(\tau; \theta).
        \end{align*}
        $$

    2. 应用技巧 $\nabla f = f \nabla \log f$:
        $$
        \begin{align*}
        \int_{\tau} r(\tau) \cdot \nabla_{\theta} P(\tau; \theta)
        =\int_{\tau} r(\tau) \cdot P(\tau; \theta) \log P(\tau; \theta)
        =\mathbb{E}_{\tau \sim P|\theta}
        \left[r(\tau) \cdot \log P(\tau; \theta) \right ]
        \end{align*}.
        $$

    3. 计算 $\nabla_{\theta} \log P(\tau; \theta)$:

        $$
        \begin{align*}
        \nabla_{\theta} \log P(\tau; \theta)
        &= \nabla_{\theta} \log \Big\{
            \rho_0 \cdot \prod_{t=0} p(s_{t+1}|s_t, a_t) \pi_{\theta}(a_t|s_t)
        \Big \} \\
        &= \nabla_{\theta} \left(\log \rho_0 + \sum_{t=0} 
        \log p(s_{t+1}|s_t, a_t) + 
        \sum_{t=0} \log \pi_{\theta}(a_t|s_t)
        \right) \\
        &=\sum_{t=0} \nabla_{\theta} \log \pi_{\theta}(a_t|s_t).
        \end{align*}
        $$

    4. 结合:

        $$
            \nabla_{\theta} \mathbb{E}_{\tau \sim P|\theta} [r(\tau)] 
            = \nabla_{\theta} \mathbb{E}_{\tau \sim P|\theta}\left [
                r(\tau) \cdot \sum_{t=0} \log \pi_{\theta} (a_t | s_t)
            \right ].
        $$

        因此, 优化原先的目标函数, 等价于更为方便地直接优化

        $$
        \max_{\theta} \, \mathbb{E}_{\tau \sim P|\theta}\left [
                r(\tau) \cdot \sum_{t=0} \log \pi_{\theta} (a_t | s_t)
            \right ].
        $$


## 参考文献

<ol class="reference">
  <li>
    Williams Ronald J.
    <u>Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning.</u>
    <i>Machine Learning</i>, 1992.
    <a href="https://link.springer.com/article/10.1007/BF00992696" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

