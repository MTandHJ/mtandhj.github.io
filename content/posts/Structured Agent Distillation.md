---
date: "2025-08-11"
draft: false
title: "Structured Agent Distillation for Large Language Model"
description: "Agent 的 Reasoning & Action 蒸馏"
author: MTandHJ
tags:
  - Note
  - LLM
  - Agent
  - Distillation
  - Empirical
  - 2025
pinned: false
---


## 预备知识

- (**Agent**) Agent 是具备规划和工具使用能力的智能体, LLM 在 reasoning 方面超强的能力赋予了广阔的天空. 然而, 多智能体间的交互行为需要大量的 LLM 推理为代价, 这让本不富裕的家庭雪上加霜.

- (**Distillation**) 因此, 将大模型蒸馏为小模型就显得那么重要了. 一般的蒸馏:
    1. **Knowledge Distillation:** 给定 source tokens $\bm{x}$ 和 target tokens $\bm{y}$, 其优化目标是:

        $$
        \min_{\theta} \:
        \mathbb{E}_{(\bm{x}, \bm{y}) \sim \mathcal{D}_{\text{train}}} \frac{1}{L_y}  \sum_{n=1}^{L_{\bm{y}}} \text{KL}
        \left(
            p_T(\cdot | \bm{y}_{< n}, \bm{x}) 
            \| p_S(\cdot | \bm{y}_{< n}, \bm{x}; \theta)
        \right),
        $$

        这里 $S, T$ 分别表示 student, teacher modelscon's

    2. **Reasoning Distillation.** 通过让学生模仿教师在 CoT (chain-of-thought) 下的输出逻辑来实现:

        $$
        \min_{\theta} \:
        -\mathbb{E}_{\bm{x} \sim \mathcal{D}_{\text{train}}, \bm{y} \sim p_T (\cdot | \bm{x}, \bm{I}_{\text{CoT}})}
        \sum_{n=1}^{L_{\bm{y}}} \log p_S (\bm{y}_n | \bm{x}, \bm{y}_{< n}; \theta).
        $$
    
- 但是 (作者认为) 这种 Token-level 的蒸馏方式, 都不能很好地反映 Agent 分层的交互轨迹 (agent trajectories).

## 核心思想

- 本文的方法很简单, 首先对 Teacher 的 Agent Trajectories 通过一些模板区分得到:

    $$
    \tau = \underbrace{r_1 \ldots r_k}_{\text{reasoning:} \tau^{(r)}} \| \underbrace{a_1 \cdots a_m}_{\text{action:} \tau^{(a)}}.
    $$

- 将 $\tau$ 输入到 LLM 中会得到 $[x_1, x_2, \cdots, x_n]$ 的 embedding, 然后可以得到每个的预测概率 $p(x_t)$. 这里 $x_t$ 有些是属于 reasoning token 对应的, 有些是 action token 对应的, 有些二者都不是 (可能是一些 prompt?). 

- 最终的损失是:
    1. **CoT-Policy Alignment Loss:**

        $$
        \mathcal{L}_{\text{CoT}} = \sum_{t=1}^T \mathbb{I}[r_t \in \tau^{(r)}] \cdot \text{KL} (p_T(x_t) \| p_S (x_t)).
        $$

    2. **Action Consistency Loss:**

        $$
        \mathcal{L}_{\text{Act}} = \sum_{t=1}^T \mathbb{I}[r_t \in \tau^{(a)}] \cdot \text{KL} (p_T(x_t) \| p_S (x_t)).
        $$

- 重加权可以得到:

    $$
    \mathcal{L}_{\text{total}} = \lambda_r \cdot \mathcal{L}_{\text{CoT}} + \lambda_{\alpha} \cdot \mathcal{L}_{\text{Act}}.
    $$

## 参考文献

<ol class="reference">
  <li>
    Liu J., Kong Z., Dong P., Yang C., Li T., Tang H., Yuan G.,
    Niu W., Zhang W., Zhao P., Lin X., Huang D. and Wang Y.
    <u>Structured Agent Distillation for Large Language Model.</u>
    <i>arXiv</i>, 2025.
    <a href="http://arxiv.org/abs/2505.13820" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

