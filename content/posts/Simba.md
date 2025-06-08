---
date: "2025-05-08"
draft: true
title: "Simba: 符号梯度的可行性"
description: "在 Lion 优化器之上的一些探索"
author: MTandHJ
tags:
  - Trial
  - Optimizer
  - Low-Bit
  - 2025
pinned: false
---


## 黑暗源头

- Lion 是一类颇为有趣的利用符号梯度的方法, 算法之简洁令人向往:

    $$
    \begin{align*}
    \text{(Gradient)} \quad & g_t \leftarrow \nabla_{\theta} f(\theta_{t-1}); \\
    \text{(Weight update)} \quad & c_t \leftarrow \beta_1 m_{t-1} + (1 - \beta_1) g_t, \\
    & \theta_t \leftarrow \theta_{t-1} - \eta_t (\text{sign}(c_t) + \lambda \theta_{t-1}); \\
    \text{(EMA update)} \quad &
    m_t \leftarrow \beta_2 m_{t-1} + (1 - \beta_2) g_t.
    \end{align*}
    $$

**注:** Lion 建议 $\beta_1 = 0.9, \beta_2 = 0.99$.

- 特别之处在于, Lion 并非用传统的梯度的 1st momemt 去更新, 而是其符号 $\text{sign}(c_t)$. 这意味着, 在不考虑 weight decay 的前提下, 不同参数的更新量是相同的.

- 让我们再来细细地看看 Lion, 看看其不同部分究竟扮演了什么角色:
    1. EMA update, 这个其实和 Adam 中的 1st moment 并没有什么本质的区别, 就是保存一定滑动窗口下的梯度的平均;

    2. $c_t$ 虽然形似另一个 EMA update, 但是本质上只是做一个选择:

        $$
        \tag{1}
        \text{sign}(c_t) = 
        \left \{
            \begin{array}{ll}
            \text{sign}(m_{t-1}) & \text{if } \beta_1 |m_{t-1}| > (1 - \beta_1) |g_t|, \\
            \text{sign}(g_{t}) & \text{if } \beta_1 |m_{t-1}| < (1 - \beta_1) |g_t|.
            \end{array}
        \right .
        $$

- 也就是说 Lion 每一次更新, 实际上做的事情就是判断应该选择之前的 `global` 的'梯度方向', 还是当下 `local` 的'方向'. 而 Adam, 实际上是一种坚守 `global` 的优化器.

- 假设 $w = 1 / (1 - \beta_2)$, 实际上 $m_t$ 相当于:

    $$
    \tag{2}
    m_t \approx \frac{1}{w} \sum_{i=0}^{w - 1} g_{t - i}.
    $$

    即在一个滑动窗口大小为 $w$ 上梯度的平均.

- 所以, 本质上是判断:

    $$
    \tag{3}
    |\frac{1}{w} \sum_{i=0}^{w - 1} g_{t - 1 - i}| \overset{?}{>} \frac{(1 - \beta_1)}{ \beta_1}  |g_t| \overset{\beta_1 = 0.9}{=} \frac{1}{9} |g_t|.
    $$

- 我产生了一个离谱的想法:

    $$
    \tag{4}
    |\frac{1}{w} \sum_{i=0}^{w - 1} \text{sign}(g_{t - 1 - i})| \overset{?}{>} \frac{(1 - \beta_1)}{ \beta_1}  \text{sign}(|g_t|) \overset{\beta_1 = 0.9}{=} \frac{1}{9}
    $$

    会有什么效果. 如果可行, 会有如下的优势:
    1. 更低的显存占用, 既然我们只需要统计正负梯度的在一个滑动窗口内的出现次数即可;
    2. 对梯度非常强的鲁棒性: 此时, 我们不需要回传精确的梯度, 仅需用某种近似算法, 确保梯度的符号是正确的即可!


## 实验结果

- 特别的, Simba 维护 $s \in \{-w, -w + 1, \ldots, 0, \ldots, w - 1, w\}$ 来统计 $w$-size 的窗口下的符号的频率, 对应于 $\beta_2 = 0.99$ 差不多是 $w = 100$.

- 此外, 引入 threshold $\gamma$, 通过如下的条件来判断确定最终的更新方向:

  $$
  \tag{5}
  \text{sign}(c_t) = 
  \left \{
      \begin{array}{ll}
      \text{sign}(s_{t-1}) & \text{if } \frac{1}{w}|s_{t-1}| > \gamma, \\
      \text{sign}(g_{t}) & \text{otherwise}.
      \end{array}
  \right .
  $$

||HR@10|NDCG@10|Loss $\downarrow$|
|:--:|:-:|:-:|:-:|
|SASRec (Lion)| 0.0690 | 0.0381 |0.145131|
|SASRec (Sign Gradient)| 0.0420 | 0.0213 | 0.665475|
|SASRec (Simba)| 0.0195 | 0.0094 |0.872968|

- 效果只能说是一言难尽. 回顾一下, Simba 和 Lion 主要差在两个点:
  1. $\frac{1}{w} \sum_{i=0}^{w-1} \text{sign}(g_{t-1-i})$ 是 $\frac{1}{w} \sum_{i=0}^{w-1} g_{t-1-i}$ 的一个近似;
  2. (5) 显然和 (1) 在选择上也有较大的差距.

- **第一点:** 在原本代码的基础上, 我们将 $\text{sign}(s_{t-1})$ 替换为 $\text{sign}(m_{t-1})$, 但是符号选择部分依然采用 (5):

||HR@10|NDCG@10|Loss $\downarrow$|
|:--:|:-:|:-:|:-:|
|SASRec (Simba + $m_{t-1}$)| 0.0693  | 0.0378 | 0.145657 |


- **第二点:** 在原本代码的基础上, 我们将 `local`, `global` 的选择部分替换为 (1) 得到如下的结果:

||HR@10|NDCG@10|Loss $\downarrow$|
|:--:|:-:|:-:|:-:|
|SASRec (Simba + (1))| 0.0296 | 0.0152 | 0.578699 |


- 显然, 对于 Lion 最重要的依然是对于一个**窗口内梯度累积的估计**, 实际上, 在 SASRec 上我发现完全依赖 'global' 也是没有太大的影响:

||HR@10|NDCG@10|Loss $\downarrow$|
|:--:|:-:|:-:|:-:|
|SASRec (Simba + ($c_t = m_{t-1}$))| 0.0667 | 0.0358 | 0.142691 |




## 代码

```python

import torch
from torch.optim.optimizer import Optimizer

class Simba(Optimizer):

  def __init__(
        self, 
        params, 
        lr=1e-4, 
        window_size: int = 128,
        threshold: float = 0.1,
        weight_decay=0.0
  ):
    """Initialize the hyperparameters.

    Args:
      params (iterable): iterable of parameters to optimize or dicts defining
        parameter groups
      lr (float, optional): learning rate (default: 1e-4)
      window_size (int): the size of sliding window
      threshold (float): the threshold determining using the accumulated sign gradient or the current sign gradient
      weight_decay (float, optional): weight decay coefficient (default: 0)
    """

    if not 0.0 <= lr:
      raise ValueError('Invalid learning rate: {}'.format(lr))
    defaults = dict(lr=lr, window_size=window_size, threshold=threshold, weight_decay=weight_decay)
    super().__init__(params, defaults)

  @torch.no_grad()
  def step(self, closure=None):
    """Performs a single optimization step.

    Args:
      closure (callable, optional): A closure that reevaluates the model
        and returns the loss.

    Returns:
      the loss.
    """
    loss = None
    if closure is not None:
      with torch.enable_grad():
        loss = closure()

    for group in self.param_groups:
      for p in group['params']:
        if p.grad is None:
          continue

        # Perform stepweight decay
        p.data.mul_(1 - group['lr'] * group['weight_decay'])

        grad = p.grad
        state = self.state[p]
        # State initialization
        if len(state) == 0:
          # Exponential moving average of gradient values
          state['sign_counts'] = torch.zeros_like(p, dtype=torch.int16)

        sign_counts = state['sign_counts']
        window_size, threshold = group['window_size'], group['threshold']
        threshold = int(window_size * threshold)
        # Weight update
        update = torch.where(
            sign_counts.abs() > threshold,
            sign_counts.sign(),
            grad.sign()
        )

        p.add_(update, alpha=-group['lr'])

        # Decay the momentum running average coefficient
        sign_counts.add_(grad.sign().to(torch.int16)).clamp_(-window_size, window_size)
    return loss
```



## 参考文献

<ol class="reference">

  <li>
    Chen X., Liang C., Huang D., Real E., Wang K., Liu Y., Pham H., Dong X., Luong T., Hsieh C., Liu Y., and Le Q. V.
    <u>Symbolic Discovery of Optimization Algorithms</u>.
    <i>NeurIPS</i>, 2024.
    <a href="http://arxiv.org/abs/2302.06675" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/google/automl/blob/master/lion/lion_pytorch.py" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>