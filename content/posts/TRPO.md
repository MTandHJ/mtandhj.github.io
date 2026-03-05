---
date: "2026-03-04"
draft: false
title: "Trust Region Policy Optimization"
description: "PPO 的前身"
author: MTandHJ
tags:
  - Note
  - Reinforcement Learning
  - Theoretical
  - ICML
  - 2015
pinned: false
---


## 预备知识

- $s \in \mathcal{S}$, state;
- $a \in \mathcal{A}$, action;
- $p(s'|s, a)$ 在状态 $s$ 和动作 $a$ 下的状态转移概率;
- $\pi(a|s)$ 给定状态 $s$ 产生动作 $a$ 的概率;
- $r \in \mathbb{R}$, reward;
- $\rho_0$, 初始状态 $s_0$ 的分布;
- $\gamma \in (0, 1)$ reward 的折扣率
- state-action value function:

    $$
    Q_{\pi}(s_t, a_t) =
    \mathbb{E}_{s_{t+1}, a_{t+1}, \ldots} \left [
        \sum_{l=0}^{\infty} \gamma^l r(s_{t+l})
    \right ].
    $$

- the value function:

    $$
    V_{\pi}(s_t) = \mathbb{E}_{a_t, s_{t+1}, \ldots} \left [
        \sum_{l=0}^{\infty} \gamma^l r(s_{t+l})
    \right].
    $$

- the advantage function:

    $$
    A_{\pi} (s, a) = Q_{\pi}(s, a) - V_{\pi}(s).
    $$

## 核心思想

- 强化学习的优化目标为

    $$
    \max_{\pi} \, 
    \eta(\pi) = \mathbb{E}_{s_0, a_0, \ldots} \left[
        \sum_{t=0}^{\infty} \gamma^t r(s_t).
    \right ], \\
    s_0 \sim \rho(s_0), a_t \sim \pi(a_t | s_t), s_{t+1} \sim p(s_{t+1}| s_t, a_t).
    $$

- 该问题可以通过 [REINFORCE](/posts/reinforce/) 利用梯度方法进行求解, 然而这种方式方差过大, 在实际中的稳定性和收敛性不太好. 本文所提出的 TRPO 希望能够优化 $\eta(\pi)$ 更加鲁棒的下界来获取更稳定的更新.

- 作者的出发点是分析策略 $\pi \rightarrow \tilde{\pi}$ 后二者的联系:

    $$
    \eta(\tilde{\pi}) 
    = \eta(\pi)
    +\mathbb{E}_{s_0, a_0, \ldots \sim \tilde{\pi}} \left[
        \sum_{t=0}
        \gamma^t A_{\pi}(s_t, a_t)
    \right].
    $$

---

*proof:*

首先, 我们有

$$
Q_{\pi}(s_t, a_t) = \mathbb{E}_{s_{t+1}}
\left [
    r(s_{t+1}) + \gamma V_{\pi}(s_{t+1})
\right],
$$

这能直接推出

$$
A_{\pi}(s, a) = 
\mathbb{E}_{s' \sim p(s' | s, a)}
\left [
    r(s) + \gamma V_{\pi}(s') - V_{\pi}(s)
\right ],
$$

需要注意的是, 这里 $s_{t+1}$ 的采样与策略 $\pi$ 无关. 因此 (约定 $\tau = (s_0, a_0, \ldots)$),

$$
\begin{align*}
    &\mathbb{E}_{\tau| \tilde{\pi}}
    \left [
        \sum_{t=0} \gamma^t A_{\pi}(s_t, a_t)
    \right] \\
    =&\mathbb{E}_{\tau| \tilde{\pi}}
    \left [
        \sum_{t=0} \gamma^t(
            r(s_t) + \gamma V_{\pi}(s_{t+1}) - V_{\pi}(s_t)
        )
    \right] & \leftarrow s_{t+1}\text{ 采样与策略无关, 期望可以合并}\\
    =& \mathbb{E}_{\tau|\tilde{\pi}}
    \left [
        -V_{\pi}(s_0) + \sum_{t=0} \gamma^t r(s_t)
    \right] & \leftarrow \text{ Telescoping Sum} \\
    =&-\mathbb{E}_{s_0} [V_{\pi}(s_0)] + \mathbb{E}_{\tau| \tilde{\pi}} \left [\sum_{t=0} \gamma^t r(s_t) \right] \\
    =& -\eta(\pi) + \eta (\tilde{\pi}).
\end{align*}
$$

---

- 进一步定义折扣访问频率 (discounted visitation frequencies):

    $$
    \rho_{\pi}(s) = \rho_0(s_0 = s) + \gamma p(s_1 = s) + \gamma^2 p(s_2 = s) + \cdots.
    $$

**注:** $\sum_{s} \rho_{\pi}(s) = \frac{1}{1 - \gamma}$, 因此 $\tilde{\rho}_{\pi} = (1 - \gamma)\rho_{\pi}$ 可以看成是 $s \in \mathcal{S}$ 上的一种边际分布.

- 借助此工具可以进一步改善 $\pi, \tilde{\pi}$ 间的关系:

    $$
    \begin{align*}
    \eta(\tilde{\pi})
    &= \eta (\pi) +
    \sum_{t=0} \sum_s p(s_t=s|\tilde{\pi}) \sum_{a} \tilde{\pi}(a|s) \gamma^t A_{\pi} (s, a) \\
    &= \eta (\pi) +
    \sum_s \sum_{t=0} \gamma^t p(s_t=s|\tilde{\pi}) \sum_{a} \tilde{\pi}(a|s) A_{\pi} (s, a) \\
    &= \eta(\pi) + \sum_s \rho_{\tilde{\pi}}(s) \sum_{a} \tilde{\pi}(a|s) A_{\pi} (s, a).
    \end{align*}
    $$

- 因此, 倘若 $\tilde{\pi}$ 能够在每个状态上都有

    $$
    \sum_a \tilde{\pi}(a|s) A_{\pi}(s, a) > 0,
    $$

    则 $\tilde{\pi}$ 相较于 $\pi$ 就一定有收益.

- 作者发现上述目标在实际中处理有点复杂, 选择用 $\rho_{\pi}$ 进行替换, 得到新的目标函数:

    $$
    L_{\pi}(\tilde{\pi}) = \eta (\pi)
    +\sum_s \rho_{\textcolor{blue}{\pi}}(s) \sum_{a} \tilde{\pi}(a|s) A_{\pi} (s, a).
    $$

    作者进一步证明:

    $$
    \eta(\tilde{\pi}) \ge 
    \underbrace{L_{\pi}(\tilde{\pi}) - \kappa \cdot \max_s \, \text{KL}(\pi(\cdot | s) \| \tilde{\pi}(\cdot | s))}_{M(\tilde{\pi}| \pi)}.
    $$

    因此, 倘若能够最大化右式则能够直接优化 $\eta(\tilde{\pi})$ 的一个下界.

- 特别地, 在 $\pi_i$ 的基础上, 通过如下方式得到 $\pi_{i+1}$:

    $$
    \pi_{i+1} = \text{argmax}_{\pi} M(\pi | \pi_i),
    $$

    则有

    $$
    \eta(\pi_{i + 1}) \ge M(\pi_{i+1}|\pi_i), \, \eta(\pi_i) = M(\pi_{i}|\pi_i)  \\
    \Rightarrow 
    \eta (\pi_{i+1}) - \eta (\pi_{i})
    \ge M(\pi_{i+1}|\pi_i) - M(\pi_{i}|\pi_i).
    $$

    换言之, 通过最大化 $M$ 得到的策略更新若有收益则一定能够在本来目标上获得收益.

- (**具体的优化目标**) 首先, KL 的最大化约束通过平均来放松:

    $$
    \mathbb{E}_{s \sim \rho} \text{KL}(
        \pi(\cdot|s) \| \tilde{\pi}(\cdot | s)
    ).
    $$

    其次, 对于 $L_{\pi}(\tilde{\pi})$ 可以通过 importance sampling 来重写为

    $$
    \begin{align*}
    L_{\pi}(\tilde{\pi}) 
    &\Leftrightarrow \sum_s \rho_{\pi}(s) \sum_a \tilde{\pi}(a|s) A_{\pi}(s, a) \\
    &\Leftrightarrow \sum_s (1 - \gamma)\rho_{\pi}(s)  \sum_a \tilde{\pi}(a|s) A_{\pi}(s, a) \\
    &= \mathbb{E}_{s \sim \rho_{\pi}'}  \sum_a \tilde{\pi}(a|s) A_{\pi}(s, a) & \leftarrow \rho' = (1 - \gamma)\rho\\
    &= \mathbb{E}_{s \sim \rho_{\pi}'}  \mathbb{E}_{a \sim q} \left[
        \frac{\tilde{\pi}(a|s)}{q(a|s)} A_{\pi}(s, a)
    \right] & \leftarrow \text{importance sampling}.
    \end{align*}
    $$

    当取 $q = \pi_{old}$, $\tilde{\pi}$ 重写为 $\pi_{new}$ 的时候, 就有最终的优化目标 (max)

    $$
    \mathbb{E}_{s \sim \rho_{\pi}', a \sim \pi_{old}} \left[
        \frac{\pi_{new}(a|s)}{\pi_{old}(a|s)} A_{old}(s, a)
    \right ]
    -\beta\cdot \mathbb{E}_{s \sim \rho} \text{KL}(
        \pi_{old}(\cdot | s) \| \pi_{new}(\cdot|s)
    ).
    $$

    其中

    $$
    \frac{\pi_{new}(a|s)}{\pi_{old}(a|s)} A_{\pi_{old}} (s, a)
    $$

    在后续 PPO, GRPO 常常出现.

## 参考文献

<ol class="reference">
  <li>
    Schulman J., Levine S., Moritz P., Jordan M. and Abbeel P.
    <u>Trust Region Policy Optimization.</u>
    <i>ICML</i>, 2015.
    <a href="http://arxiv.org/abs/1502.05477" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

