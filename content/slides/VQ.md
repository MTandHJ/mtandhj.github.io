---
date: "2025-03-21"
draft: false
title: "Vector Quantization"
author: MTandHJ
tags:
  - Slide
  - Vector Quantization
---

<section data-markdown>
## Vector Quantization
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Background

- **表征学习**一直是深度学习的重点

<div class="slide-img">
  <img src="https://miro.medium.com/v2/resize:fit:4416/format:webp/1*bvMhd_xpVxfJYoKXYp5hug.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>


</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Background

- Encoder $\phi: X \rightarrow \bm{z} \in \textcolor{red}{\mathbb{R}^{d}}$ (连续空间)

- 向量量化: $X \rightarrow \bm{c} \in \mathcal{C} = \{\bm{c}_k\}_{k=1}^K$ (离散空间)

<span style="color: blue">✓</span> 离散化表示更符合人类语言和符号特性, 或许更利于生成任务 

<span style="color: blue">✓</span> 更强的可解释性和控制性

<span style="color: blue">✓</span> 更好的可检索性


</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### VAE

1. Encoder $\phi$: 它将输入 $X \in \mathbb{R}^{H \times W \times 3}$ 映射到一个分布:

    $$
    \bm{z} \sim q(\bm{z}|X; \phi).
    $$

    e.g., 高斯分布: $\phi(\bm{x}) \rightarrow (\bm{\mu}, \Sigma) \rightarrow \mathcal{N}(\bm{\mu}, \Sigma)$.
2. Decoder $\Phi$: 它将隐变量 $\bm{z}$ 映射回 (通常来说) $X$ 的空间:

    $$
    p(X|\bm{z}; \Phi);
    $$

3. 还有一个先验分布 $p(\bm{z})$ 用于辅助训练.

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">van den Oord A., et al., Neural Discrete Representation Learning. NeurIPS, 2017.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### VAE

- 训练目标:

    $$
    \begin{align*}
    -\log p(X) 
    \le \underbrace{\mathbf{KL}(q_{\phi}\| p(\bm{z})) +
    \mathbb{E}_{\bm{z} \sim q_{\phi}} -\log p(X|\bm{z}; \Phi)}_{\text{negative ELBO}}.
    \end{align*}
    $$

- 最小化 KL 散度促进 $q_{\phi}$ 的散度

- $-\log p(X|\bm{z}; \Phi)$ 在高斯分布的假设下退化为重构损失:

    $$
    \mathcal{L}_{rec} = \| \Phi(\bm{z}) - X\|_2^2
    $$

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### VQ-VAE

- VQ-VAE $\bm{z}$ 通过可训练的 Codebook 来解决实现离散化:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250310215306.png" alt="Image" style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

- $X \in \mathbb{R}^{H \times W \times 3} \overset{\phi}{\rightarrow} Z \in \mathbb{R}^{H' \times W' \times d} \overset{\varphi}{\rightarrow} \hat{Z} \in \mathcal{C}^{H' \times W' \times d} \rightarrow$

- $\varphi(\bm{z}) = \text{argmin}_{\bm{c} \in \mathcal{C}} \|\bm{c} - \bm{z}\|$.

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### VQ-VAE

- $Z \rightarrow \hat{Z}$ 是离散的, 无法传递梯度. 

- **STE** (straight-through estimator):

    $$
    \tilde{Z} \leftarrow Z + \text{sg}\big((\hat{Z} - Z)\big), \\
    \mathrm{d}\tilde{Z} = \mathrm{d} Z + 0.
    $$

- 训练目标:

    $$
    \mathcal{L} = \mathcal{L}_{rec} + 
    \underbrace{
        \| \text{sg} (Z) - \hat{Z}\|_2^2 +
        \beta \cdot \| Z - \text{sg} (\hat{Z})\|_2^2.
    }_{\mathcal{L}_{commit}}
    $$

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### VQ-GAN

- 图片 Token 化 + Next-token prediction $p(s_i | s_{< i}, \textcolor{red}{condition})$

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250311144000.png" alt="Image" style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Esser P., et al. Taming Transformers for High-Resolution Image Synthesis. CVPR, 2021.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Codebook Collapse

- 离散化操作终究是带来了训练困难:
    1. Codebook 中部分向量过于接近而造成的冗余
    2. Codebook 中部分向量由于训练始终匹配不到 $Z$ 导致的冗余

- 一些方案:
    1. 对于 codebook 采用 K-means ++ 初始化 [1];
    2. 对于训练不充分的向量重新初始化 [2];
    3. 用 Gumbel-softmax 替代 STE [3]

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">[1] Lancucki A., et al. Robust Training of Vector Quantized Bottleneck Models. 2020.</p>
    <p style="margin: 2px 0;">[2] Dhariwai P., et al. Jukebox: A Generative Model for Music. 2020.</p>
    <p style="margin: 2px 0;">[3] Takida Y., et al. SQ-VAE: Variational Bayes on Discrete Representation with Self-annealed Stochastic Quantization. ICML, 2022.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Residual Quantization (RQ-VAE)

- Collapse 问题通常是当 codebook size 增大的时候发生
- 减小 size $\rightarrow$ 更差的表达能力 **vs.** 增大 size $\rightarrow$ Collpase
- RQ-VAE:

    $$
    Z 
    \overset{\varphi}{\rightarrow} \textcolor{red}{\hat{Z}_1}
    \overset{Z - \hat{Z}_1}{\rightarrow} R_1
    \overset{\varphi}{\rightarrow} \textcolor{red}{\hat{Z}_2}
    \overset{R_1 - \hat{Z}_2}{\rightarrow} R_2
    \rightarrow \cdots
    $$

- $\hat{Z} = \sum_{n}^N \hat{Z}_n$, 离散化表示 $(k_1, k_2, \ldots, k_N)$

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Lee D., et al. Autoregressive Image Generation using Residual Quantization. CVPR, 2022.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### TIGER


- 传统推荐 (matching):

    $$
    \bm{e}_u^T \bm{e}_v, \quad v \in \mathcal{V}.
    $$

- 检索式推荐:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316175859.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>


<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Rajput S., et al. Recommender Systems with Generative Retrieval. NeurIPS, 2023.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### TIGER


- 检索式推荐:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316180725.png" alt="Image" style="max-width: 100%; height: auto;margin: 0 auto;">
</div>


</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Fixed Codebook

- 固定 Codebook 为 (size: $|\mathcal{C}| = (2 \lfloor L / 2 \rfloor + 1)^d$):

    $$
    \mathcal{C} = \{-\lfloor L / 2 \rfloor, -\lfloor L / 2 \rfloor + 1, \ldots, 0, \ldots \lfloor L / 2 \rfloor - 1, \lfloor L / 2 \rfloor\}^{d}.
    $$

- 比如 $L = 3, d=3$:

    $$
    \mathcal{C} = \{
        (-1, -1, -1),
        (-1, -1, 0),
        \ldots,
        (1, 1, 1)
    \}.
    $$

- 量化:

    $$
    \bm{\hat{z}} = \varphi \big(\tanh(\bm{z}) \big) = 
    \textcolor{red}{\text{round}} \big(
        \textcolor{blue}{\tanh} (\bm{z})
    \big).
    $$

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Mentzer F., et al. Finite Scalar Quantization: VQ-VAE Made Simple. 2023.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 总结

- 向量量化提供了一种 token 化的方式

- Codebook 的设定和学习仍存在问题

</textarea>
</section>

