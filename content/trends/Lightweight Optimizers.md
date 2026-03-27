---
draft: false
title: "Lightweight Optimizers"
author: MTandHJ
tags:
  - Trend
  - Optimizer
  - Lightweight
datafile: "lightweight-optimizers"
---

- Lightweight optimiers 的主要出发点是 Adam(W) 需要 2x model size 的状态存储, 实际使用时会消耗相当多的显存.
- 主流的改进策略是如何存储压缩后的状态, 可以是通过低精度的量化方法, 也可以是通过矩阵的低秩近似. 此外, 也有像 Lion 这样设计之初就更为轻量的方法.
