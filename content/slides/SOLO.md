---
date: "2025-03-19"
draft: false
title: "SOLO"
author: MTandHJ
tags:
  - Slide
  - Optimizer
  - Low-Bit
  - EMA
---

<!-- --------------------------------------------------------- -->

<section data-markdown>
## Pushing the Limits of Low-Bit Optimizers with a Focus on EMA Dynamics
</section>

<section data-markdown>
<textarea data-template>

### Background

- 模型大小飞速增加 vs. 硬件价格居高不下

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312203012.png" alt="Image" style="max-width: 65%; height: auto; margin: 0 auto;">
</div>

- 解决方案: 
  - MoE, LoRA; ZeRO, FSDP; 
  - Network Quantization; <span style="color: red;">Lightweight Optimizers</span>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Background
  
- Optimizer States (2x model size):

  $$
  m_{t+1} \leftarrow \beta_1 \cdot m_t + (1 - \beta_1) \cdot g, \\
  v_{t+1} \leftarrow \beta_2 \cdot v_t + (1 - \beta_2) \cdot g^2.
  $$

- DeepSeek-v3 训练框架: $g \overset{\text{BF16}}{\rightarrow} m, v \overset{\text{FP32}}{\rightarrow} \theta$

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312204230.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Quantization and Dequantization
  
- Quantization:

  $$
  q = Q(x) := \mathop{\text{argmin}} \limits_{k=0}^{2^b - 1} \big|\frac{x}{\textcolor{red}{\Delta}} - \textcolor{red}{\iota_k} \big|.
  $$

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312205652.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

- Dequantization:

  $$
  \tilde{x} = Q^{\dagger}(q) := \iota_{q} \cdot \Delta.
  $$
</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### <u>S</u>tateful <u>O</u>ptimizers in Ultra <u>LO</u>w Bits

- Low-Bitwidth EMA update:

$$
\begin{array}{rl}
  \text{Dequantization:  }  & \tilde{x}_t = Q^{\dagger}(q_t) = \iota_{q_t} \cdot \Delta_t, \\
  \text{EMA update:  } & \hat{x}_{t+1} \leftarrow \beta \cdot \tilde{x}_t + (1 - \beta) \cdot z_{t + 1}, \\
  \text{Quantization:  } & q_{t+1} = Q(\hat{x}_{t+1}).
\end{array}
$$


<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Dettmers T., et al. 8-bit Optimizers via Block-wise Quantization. ICLR, 2022.</p>
    <p style="margin: 2px 0;">Li B., et al. Memory Efficient Optimizers with 4-bit States. NeurIPS, 2023.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Quantization for Unsigned EMA Update

- *Signal Swamping* (<u>large-to-small number addition</u>)

$$
\text{EMA update:  }  \hat{x}_{t+1} \leftarrow \beta \cdot \tilde{x}_t + \underbrace{\textcolor{red}{(1 - \beta) \cdot z_{t + 1}}}_{\text{very small for } \beta \rightarrow 1}.
$$


<div style="text-align: center; margin-top: 50px; margin-bottom: -80px; padding: 0">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312211840.png" alt="Image" style="max-width: 70%; height: auto;margin: 0 auto;">
</div>


<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">Higham N. J. The Accuracy of Floating Point Summation. SIAM Journal on Scientific Computing. 1993.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------------------- -->


<section data-markdown>
<textarea data-template>

### Signal Swamping

- 总结

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312212039.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Case Study

<div class="slide-cols">

<div class="slide-col-6">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312212821.png" alt="Image" style="max-width: 90%; height: auto;margin: 0 auto;">
</div>

</div>

<div class="slide-col-4">

- 一定<span style="color: red">条件</span>下:
  - Linear 下全部不更新
  - DE 下部分更新

- 实际上 $\beta \ge 0.9$ 为<span style="color: red">相当常见的 setting</span>

</div>

</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Case Study

<div class="slide-cols">

<div class="slide-col-4">

- $X \in \mathbb{R}^{1000}$
- $Z \sim \mathcal{U}[0, 1]$

<span style="color: red;">*X*</span> &nbsp; Fixed $\Delta$

<span style="color: red;">*X*</span> &nbsp; $z \le \Delta$


- 理论收敛至: 0.5

</div>


<div class="slide-col-6">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312213810.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</div>

</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Stochastic Rounding

- 假设 $\iota_{k-1} \le x / \Delta \le \iota_k$:

  $$
  Q_{sr}(x) :=
  \left \{
      \begin{array}{ll}
          k-1 & w.p. \quad \frac{\iota_k - x / \Delta}{ \iota_k - \iota_{k-1}}, \\
          k & w.p. \quad \frac{x / \Delta - \iota_{k-1}}{ \iota_k - \iota_{k-1}}.
      \end{array}
  \right .
  $$

- High variance:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250313112908.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Logarithmic Quantization

$$
\begin{array}{ll}
Q(x) 
&=\text{Clip}(\lfloor \log_{\alpha} \frac{x}{\Delta} + \xi \rceil; 0, 2^b - 1) \\
&\approx \mathop{\text{argmin}} \limits_{k=0}^{2^b - 1} \big|\frac{x}{\Delta} \cdot \alpha^\xi - \iota_k \big|,
\end{array}
$$

- 3-bit quantization anchors:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250313113440.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Logarithmic Quantization

- 2-bit quantization illustration

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250313113535.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Logarithmic Quantization

- Easy to implement

- State Decay Alignment

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250313115306.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>


<section data-markdown>
<textarea data-template>

### Quantization for Signed EMA Update

**X** &nbsp; <span style="color: gray">Singal Swamping</span>

**✓** &nbsp; **Sign representation**

**✓** &nbsp; **Descent direction**

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250314115701.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Theoretical Analysis

<div class="slide-cols">

<div class="slide-col-6">
<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250314115959.png" alt="Image" style="max-width: 95%; height: auto;margin: 0 auto;">
</div>
</div>

<div class="slide-col-4">

$\rightarrow$ <span style="color: red">Bits $\downarrow$</span> or <span style="color: red">$\beta \uparrow$ </span>

$\rightarrow$ Quantization errors <span style="color: red">$\uparrow$</span>

$\rightarrow$ gradient variance <span style="color: red"> $\uparrow$ </span>

$\rightarrow$ <span style="color: red"> bad </span> convergence

</div>

</div>


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Momentum Adjustment

- **方差控制:** 选择 $\beta'$ 满足:

$$
  \underbrace{\frac{\textcolor{gray}{\beta'}}{1 - \textcolor{gray}{\beta'}} r_{\text{median}}(b')}_{\textcolor{gray}{\text{undetermined}}}
  \le \underbrace{\frac{\beta}{1 - \beta} r_{\text{median}}(b)}_{\textcolor{green}{\text{valid setup}}}.
$$

- **查表:** (<u>灰色区域代表了经验可行的参数推荐</u>)

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250314121510.png" alt="Image" style="max-width: 95%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Experiments

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250417145811.png" alt="Image" style="max-width: 85%; height: auto;margin: 0 auto;">
</div>


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Loss

- 损失正常收敛

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250319170139.png" alt="Image" style="max-width: 95%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Quantile $x_p$

- 基本上 $p \in [0.05, 0.3]$ 都有不错的性能

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250319170604.png" alt="Image" style="max-width: 55%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Beta, Block size

- 损失正常收敛

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250407200935.png" alt="Image" style="max-width: 95%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 2nd State Distribution

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250407201114.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### AdaBelief

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250407202155.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section>


<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40%;
  font-size: 10rem;
">
  Thanks!
</div>

</section>

<!-- --------------------------------------------------------- -->