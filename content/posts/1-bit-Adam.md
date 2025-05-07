---
date: "2025-05-07"
draft: false
title: "1-bit Adam: Communication Efficient Large-Scale Training with Adam's Convergence Speed"
description: "Adam 预训练的 1-bit SGD 优化方法"
author: MTandHJ
tags:
  - Note
  - Low-Precision
  - Quantization
  - Error Compensation
  - Optimizer
  - Theoretical
  - ICML
  - 2021
pinned: false
---


## 预备知识

- 对优化流程有基本的了解.

## 核心思想

- 首先, 我们讲实现 1-bit SGD 的可能性.

- **vanilla SGD:**

    $$
    \bm{x}_{t+1} = \bm{x}_t - \gamma \bm{g}_t = \bm{x}_0 - \gamma \sum_{s=0}^t \bm{g}_s.
    $$

- **SGD** 带压缩的梯度:

    $$
    \bm{x}_{t+1} = \bm{x}_t - \gamma C_{\omega} [\bm{g}_t] 
    = \bm{x}_t -  \gamma (\bm{g}_t - \bm{\delta}_t) 
    = \bm{x}_0 -  \gamma \sum_{s=0}^t \bm{g}_s +
    \underbrace{\gamma \sum_{s=0}^t \bm{\delta}_s}_{\text{history compression error}}.
    $$

    这里 $C_w = \frac{1}{N} \sum_{n=1}^N Q^{-1} \circ Q(g; n)$, $N$ 表示总的节点数, $Q, Q^{-1}$ 分别表示量化与反量化操作.

- 显然如果不进行任何处理, 累积的误差是非常惊人的. 幸而, 之前的工作提出了一种**误差补偿** (error compensation) 机制:

    $$
    \begin{align*}
        \bm{x}_{t+1}
        &= \bm{x}_t - \gamma C_{\omega} [\bm{g}_t + \bm{\delta}_{t-1}]
        = \bm{x}_t - \gamma (\bm{g}_t - \underbrace{\bm{\delta}_t + \bm{\delta}_{t-1}}_{\text{error cancellation}}) \\
        &= \bm{x}_0 - \gamma \sum_{s=0}^t \bm{g}_s + \gamma \sum_{s=0}^t (\bm{\delta}_s - \bm{\delta}_{s-1}) \\
        &= \bm{x}_0 - \gamma \sum_{s=0}^t \bm{g}_s + \gamma \bm{\delta}_t.
    \end{align*}
    $$

    因此误差不会累积.

- 这里需要说明一下具体的流程:
    1. 每个 node 计算得到梯度 $\bm{g}_t$, 以及上一次量化的误差 $\bm{\delta}_{t-1}$, 传递如下信号:

        $$
        Q(\bm{g}_t + \bm{\delta}_{t-1}).
        $$

    2. 计算当前的误差累积:

        $$
        \bm{\delta}_{t} = \bm{g}_t - Q^{-1} \circ Q(\bm{g}_t + \bm{\delta}_{t-1}).
        $$

- 因此, 1bit-SGD 是没法降低显存在占用的, 因为我们要维护额外的 $\bm{\delta}_t$, 它的作用主要是降低平均梯度时所带来的通信代价.

- 然而, 上面的推导依赖对梯度的线性累积, 如果是 Adam 这种非线性的优化器, 误差补偿也没法阻止误差的累积. 因此, 本文所提出的 1-bit Adam 的流程如下:
    1. 在一开始, 采用正常的 Adam 进行更新, 得到二阶动量的一个估计 (因为作者发现, Adam 的二阶动量在训练一段时间后趋于稳定);
    2. 固定二阶动量, 并开始量化梯度, 转而采用 1-bit SGD 的格式更新.

![20250507172614](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507172614.png)

- 所以本质上, 1-bit Adam 还是一个 1-bit SGD 方法, 相当于设置了一个更合理的学习率? 实际上, 作者的二阶动量会逐步区域稳定的这个假设也是不合理的, 至少我做实验的经常会观察的逐步增加的二阶动量.

## 参考文献

<ol class="reference">
  <li>
    Seide F., Fu H., Droppo J., Li G., and Yu D.
    <u>1-Bit Stochastic Gradient Descent and Its Application to Data-Parallel Distributed Training of Speech DNNs</u>.
    <i></i>, 2014.
    <a href="https://www.isca-archive.org/interspeech_2014/seide14_interspeech.html" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <li>
    Tang H., Gan S., Awan A. A., Rajbhandari S., Lian X., Liu J., Zhang C., and He Y.
    <u>1-bit Adam: Communication efficient large-scale training with adam's convergence speed</u>.
    <i>ICML</i>, 2021.
    <a href="http://arxiv.org/abs/2102.02888" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/microsoft/DeepSpeed" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

