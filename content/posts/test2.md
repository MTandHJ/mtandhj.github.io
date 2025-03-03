---
date: "2025-02-26"
draft: false
title: "Test2"
author: John Doe
tags:
  - hugo
  - front-matter
pinned: true
---



[TOC]

> [Choi J., Wang Z., Venkataramani S., Chuang P. I., Srinivasan V. and Gopalakrishnan K. PACT: Parameterized clipping activation for quantized neural networks. 2018.](http://arxiv.org/abs/1805.06085)


## 概

本文提出对网络中的激活值进行裁剪以实现更低量化.

## 主要内容

![test](https://img2023.cnblogs.com/blog/1603215/202501/1603215-20250103102259044-846633626.png)

![test](https://ww1.sinaimg.cn/large/null.jpg)
![test](https://n.sinaimg.cn/news/1_img/upload/0680838e/213/w2048h1365/20250227/1c51-0c13ecbb53b1c8fb519101faec8ef47e.jpg)


- 作者的思想很简单, 作者认为正常的 relu 往右是无界的, 这会对量化造成困难. 所以, 作者的做法就是对 relu 右侧进行一个截断:
    $$
    y = PACT(x) = 0.5 (|x| - |x - \alpha| + \alpha)
    =\left \{
        \begin{array}{ll}
            0, & x \in (-\infty, 0), \\
            x, & x \in [0, \alpha), \\
            \alpha, & x \in [\alpha, +\infty).
        \end{array}
    \right .
    $$

- 并且训练的时候通过 STE 进行训练:
    $$
    \frac{\partial y_q}{\partial \alpha}
    =\frac{\partial y_q}{\partial y}
    \frac{\partial y}{\partial \alpha}
    =\left \{
        \begin{array}{ll}
        0, & x \in (-\infty, \alpha), \\
        1, & x \in [\alpha, +\infty].
        \end{array}
    \right.,
    $$
    其中 $y_q = round(y \cdot \frac{2^k - 1}{\alpha}) \cdot \frac{\alpha}{2^k - 1}$.
