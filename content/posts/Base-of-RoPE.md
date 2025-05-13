---
date: "2025-05-13"
draft: false
title: "Base of RoPE Bounds Context Length"
description: "讨论 RoPE base 对于相似 Tokens 感知能力的影响"
author: MTandHJ
tags:
  - Note
  - LLM
  - Positional Encoding
  - Theoretical
  - NeurIPS
  - 2024
pinned: false
---


## 预备知识

- 需要对 [Rotary Positional Encoding (RoPE)](https://spaces.ac.cn/archives/8265) 有基本的了解.

## 核心思想

- 普通的 Attention 的计算机制为:

    $$
        A_{ij} = q_i^T k_j, \\
        \text{ATTN}(X) = \text{softmax}(A / \sqrt{d}) v,
    $$

    这里 $q, k, v \in \mathbb{R}^d$ 代表是 query, key, value vectors, 而 $A \in \mathbb{R}^{L \times L}$ 是 attention 矩阵, $L$ 是序列长度. $i, j$ 是表示 $i,j$-th 的位置.

### RoPE

- RoPE 是一种可以通过类似绝对位置编码方式实现的相对位置编码, 其本质上是对 $q_i, k_j$ 每两个维度独立施加旋转变换:

    $$
        R_{i, \theta} := \left [
        \begin{array}{ccccccc}
        \cos (i\theta_0) & -\sin (i \theta_0) & 0 & 0 & \cdots & 0 & 0 \\
        \sin (i \theta_0) & \cos (i \theta_0) & 0 & 0 & \cdots & 0 & 0 \\
        0 & 0 & \cos (i\theta_1) & -\sin (i \theta_1) & \cdots & 0 & 0 \\
        0 & 0 & \sin (i \theta_1) & \cos (i \theta_1) & \cdots & 0 & 0 \\
        \vdots & \vdots & \vdots & \vdots & \ddots & \vdots & \vdots \\
        0 & 0 &  0 & 0 & \cdots & \cos (i \theta_{d/2 - 1}) & -\sin (i \theta_{d / 2 - 1}) \\
        0 & 0 &  0 & 0 & \cdots & \sin (i \theta_{d/2 - 1}) & \cos (i \theta_{d / 2 - 1})  \\
        \end{array}
        \right ],
    $$

    这里 $\theta_i = b^{-2i / d}$ 表示基本的旋转单位, $b$ (base) 越大, 旋转的角度越小. 因此, 靠前维度的旋转角度越大, 被认为是高频区域, 靠后的维度旋转角度小, 被认为是低频区域. 然后通过如下方式可以计算注入位置信息后的 Attention:

    $$
    A_{ij} = (R_{i, \theta} q_i)^T (R_{j, \theta} k_i) = q_i^T R_{j-1, \theta} k_j = q_i^T R_{m, \theta} k_j.
    $$

    这里 $m = j - i$ 表示相对距离.

- 目前的 LLM 有这么一个趋势: 如果希望模型具备更长的上下文理解能力, 需要增加 $b$ (即降低旋转角度):

![20250513174554](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250513174554.png)

- 本文对此提出了一个相当有意思的见解:
    - 除了位置之外, 倘若 $q$ 是一个随机 query, $k$ 是另一个随机的 key 向量, 而 $k^* = q + \epsilon$ 是与 $q$ 比较接近的 key 向量, 我们多半希望:

        $$
        \delta_m := \mathbb{E}_{q, k^*} [q^T R_{m, \theta} k^*]
        -\mathbb{E}_{q, k} [q^T R_{m, \theta} k] > 0,
        $$

        即 $q$ 与 $k^*$ 的期望 attention 是大于 $q$ 与 $k$ 的期望 attention 的. 这反映了在加入 RoPE 之后, 是否依旧能够保持 Attention 关注相似 Tokens 的底层机制.

- 作者证明了: 若 $q, k \in \mathbb{R}^d$ 是两个独立同分布的随机向量, 且其标准差为 $\sigma > 0$. $k^* = q + \epsilon$, 其中 $\epsilon$ 是服从均值为 0 的随机分布, 我们有

    $$
    \begin{align*}
    & \frac{1}{2\sigma^2} \bigg(
        \mathbb{E}_{q, k^*} \Big [ q^T R_{m, \theta} k^*\Big]
        -\mathbb{E}_{q, k} \Big [ q^T R_{m, \theta} k\Big]
    \bigg) \\
    =& \frac{1}{2\sigma^2} \bigg(
        \mathbb{E}_{q, k^*} \Big [ q^T R_{m, \theta} (q + \epsilon)\Big]
        -\mathbb{E}_{q, k} \Big [ q^T R_{m, \theta} k\Big]
    \bigg) \\
    =& \frac{1}{2\sigma^2} \bigg(
        \mathbb{E}_{q} \Big [ q^T R_{m, \theta} q\Big]
        -\mathbb{E}_{q, k} \Big [ q^T R_{m, \theta} k\Big]
    \bigg) \\
    =& \frac{1}{2\sigma^2} \bigg(
        \mathbb{E}_{q, k} \Big [ q^T R_{m, \theta} (q - k)\Big]
    \bigg) \\
    =& \frac{1}{2\sigma^2} 
        \mathbb{E}_{q, k} \Big [\text{Tr}\big(q^T R_{m, \theta} (q - k)\big)\Big]
    \\
    =& \frac{1}{2\sigma^2} 
        \mathbb{E}_{q, k} \Big [\text{Tr}\big(R_{m, \theta} (q - k) q^T \big)\Big]
    \\
    =& \frac{1}{2\sigma^2} 
        \text{Tr}\Big(R_{m, \theta} \mathbb{E}_{q, k} \big [ ((q - \mu) - (k - \mu)) (q - \mu)^T \big] 
        + \underbrace{\mathbb{E}_{q, k} \big [ (q - k) \mu^T \big]}_{=0}
        \Big) \\
    =& \frac{1}{2\sigma^2} 
        \text{Tr}\Big(R_{m, \theta} \mathbb{E}_{q, k} \big [ ((q - \mu) - (k - \mu)) (q - \mu)^T \big] 
        \Big) \\
    =& \frac{1}{2\sigma^2} 
        \text{Tr}\Big(R_{m, \theta} 
        \mathbb{E}_{q} \big [ (q - \mu)  (q - \mu)^T \big] 
        + \underbrace{\mathbb{E}_{q, k} \big [ (k - \mu)  (q - \mu)^T \big]}_{=0} 
        \Big) \\
    =& \frac{1}{2\sigma^2} 
        \text{Tr}\Big(R_{m, \theta} 
        \mathbb{E}_{q} \big [ (q - \mu)  (q - \mu)^T \big] 
        \Big) \\
    =& \frac{1}{2} 
        \text{Tr}\Big(R_{m, \theta} 
        I_d
        \Big) \\
    =& \sum_{i=0}^{d / 2 - 1} \cos(m \theta_i).
    \end{align*}
    $$

**注:** 通过上面的证明可以发现, 这个等式比较依赖 $q, k$ 有相近的均值期望 (或者二者的期望差恰好和 $q$ 的期望构成一个接近垂直的情况).

- 因此, 为了保证 $\delta_m > 0, \forall m=0, 1, \ldots, L$ 均成立, 我们需要保证:

    $$
    \sum_{i=0}^{d / 2 - 1} \cos(m \theta_i) > 0, \forall m = 0,1,\ldots, L
    $$

    均成立.

- 为此, 我们只能降低旋转角度 $\theta_i$, 即增大 base $b$. 这个没有显示的表达式, 但是通过计算可以得到如下的参考表格:

![20250513205428](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250513205428.png)


- 虽然这个证明的假设略微有些强, 但是增大 base $b$ 以使得模型能够更容易感知到相似的 tokens 这个是非常非常容易理解的. 毕竟, RoPE 的旋转某种程度上就是一种干扰.


## 参考文献

<ol class="reference">
  <li>
    Men X., Xu M., Wang B.,
    Zhang Q., Lin H., Han X., and Chen W.
    <u>Base of RoPE Bounds Context Length</u>.
    <i>NeurIPS</i>, 2024.
    <a href="http://arxiv.org/abs/2405.14591" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>