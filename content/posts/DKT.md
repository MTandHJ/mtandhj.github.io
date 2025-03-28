---
date: "2025-03-27"
draft: false
title: "Deep Knowledge Tracing"
description: "DKT, 知识追踪"
author: MTandHJ
tags:
  - Note
  - Knowledge Tracing
  - RNN
  - LSTM
  - Seminal
  - Empirical
  - NeurIPS
  - 2015
pinned: false
---


## 预备知识

- RNN, LSTM: 循环神经网络依赖历史状态和当前信号估计下一时刻的状态, 可用于预测, 回归等.


## 核心思想

![20250327211112](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250327211112.png)

- 知识追踪的目的是根据学生的历史作答情况 $\mathbf{x}_0, \ldots, \mathbf{x}_t = \{q_t, a_t\}$ (其中 $q_t$ 表示 exercise, $a_t$ 表示做对做错的情况), 来估计当前学生的状态 (通过一个向量 $\mathbf{y} \in [0, 1]^{M}$, 第 $i$ 个元素表示该学生当前状态下做对第 $i$ 题的概率).

![20250327212027](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250327212027.png)

- 需要特别注意的是, DKT 设定一个题目对应两个独立表示 (做对, 做错).

- DKT 有很多用处:
    1. 根据 $\mathbf{y}_t$ 我们可以判断学生对不同题目的掌握情况, 据此可以个性化出题;
    2. 判断题目间的关系, 作者给出一种 influence 指标:

        $$
        J_{ij} = \frac{y(j|i)}{\sum_{k} y(j | k)},
        $$

        这里 $y(j|i)$ 表示仅观察到做对题目 $i$ 情况下做对题目 $j$ 的概率. 显然 $J_{ij}$ 越大两个题目越趋同.


## 参考文献

<ol class="reference">
  <li>
    Piech C., Bassen J., Huang J., Ganguli S.,
    Sahami M., Guibas L., Sohl-Dickstein J.
    <u>Deep Knowledge Tracing.</u>
    <i>NeurIPS</i>, 2015.
    <a href="https://proceedings.neurips.cc/paper/2015/file/bac9162b47c56fc8a4d2a519803d51b3-Paper.pdf" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/chrispiech/DeepKnowledgeTracing" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

