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

<div class="slide-highlight">
模型飞速膨胀 vs. 吃紧的硬件设备
</div>

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312203012.png" alt="Image" style="max-width: 65%; height: auto; margin: 0 auto;">
</div>

- 可能的一些解决方案: 
  - MoE, LoRA; ZeRO, FSDP; 
  - Network Quantization; <span style="color: red;">Lightweight Optimizers</span>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Background
  
⚙️ Optimizer States (2x model size):

  $$
  m_{t+1} \leftarrow \beta_1 \cdot m_t + (1 - \beta_1) \cdot g, \\
  v_{t+1} \leftarrow \beta_2 \cdot v_t + (1 - \beta_2) \cdot g^2.
  $$

- Lightweight Optimizers:
  - **重新设计:** Lion, Muon ...
  - **状态共享:** Adafactor, SM3, Adam-Mini ...
  - **降维/稀疏化:** GaLore, MicroAdam
  - **低精度:** 1-bit SGD/Adam, <u>16/8/4-bit Optimizers</u>, Q-GaLore, 8-bit Muon

<div class="slide-highlight">
Why Low-Bit Optimizers?
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Why Low-Bit Optimizers?

- **泛化性:** ✅无需额外调参 ✅适用任意场景

- **灵活性:** ✅非环境依赖

- **成功的工程实践:** DeepSeek-v3 训练框架 ($g \overset{\text{BF16}}{\rightarrow} m,v \overset{\text{FP32}}{\rightarrow} \theta$)
  
<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312204230.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">DeepSeek-AI. DeepSeek-V3 Technical Report, 2024.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Quantization and Dequantization
  
- Quantization:

  $$
  q = Q(x) := \mathop{\text{argmin}} \limits_{k=0}^{2^b - 1} \big|\frac{x}{\textcolor{red}{\Delta}} - \textcolor{red}{y_k} \big|.
  $$

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312205652.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

- Dequantization:

  $$
  \tilde{x} = Q^{\dagger}(q) := y_{q} \cdot \Delta.
  $$
</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### <u>S</u>tateful <u>O</u>ptimizers in Ultra-<u>LO</u>w Bits

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617110019.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Challenges in Ultra-Low-Bit Cases

- **表示精度:** 42 亿 (32-bit) vs. 8 (3-bit) vs. 4 (2-bit)

- **量化范围:** 如何将尽可能多的元素一起量化?

- **一阶/二阶动量:**
  - (Signed) 一阶动量 ($m$): 决定参数更新方向 
  - (Unsigned) 二阶动量 ($v$): 决定参数更新步长

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Challenges in Ultra-Low-Bit Cases

- **表示精度:** 42 亿 (32-bit) vs. 8 (3-bit) vs. 4 (2-bit)

- **量化范围:** 如何将尽可能多的元素一起量化?

- **一阶/二阶动量:**
  - (Signed) 一阶动量 ($m$): 决定参数更新方向 
  - (Unsigned) 一阶动量 ($m$): 决定参数更新步长

<div class='slide-highlight'>
关键: EMA Dynamics
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Quantization for Unsigned EMA Update

- *Signal Swamping* (<u>large-to-small number addition</u>)

$$
\text{EMA update:  }  \hat{x}_{t+1} \leftarrow \beta \cdot \tilde{x}_t + \underbrace{\textcolor{red}{(1 - \beta) \cdot z_{t + 1}}}_{\text{very small as } \beta \rightarrow 1}.
$$


<div style="text-align: center; margin-top: 50px; margin-bottom: -80px; padding: 0">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722100933.png" alt="Image" style="max-width: 70%; height: auto;margin: 0 auto;">
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

💡 总结

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312212039.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

<div class='slide-highlight'>

❎Unsigned ❎ $\beta \uparrow$ ❎ $b \downarrow$

</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Case Study

<div class="slide-cols">

<div class="slide-col-6">

&nbsp;

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722101123.png" alt="Image" style="max-width: 90%; height: auto;margin: 0 auto;">
</div>

</div>

<div class="slide-col-4">

&nbsp;

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

&nbsp;

- 随机信号:
  - $X \in \mathbb{R}^{1000}$
  - $Z \sim \mathcal{U}[0, 1]$

- Relaxed 条件:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: red;">*X*</span> &nbsp; Fixed $\Delta$

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: red;">*X*</span> &nbsp; $z \le \Delta$


- 理论收敛至: $0.5$

</div>


<div class="slide-col-6">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250908140511.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</div>

</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Solution (1/2): Stochastic Rounding

- 假设 $y_{k-1} \le x / \Delta \le y_k$:

  $$
  Q_{sr}(x) :=
  \left \{
      \begin{array}{ll}
          k-1 & w.p. \quad \frac{y_k - x / \Delta}{ y_k - y_{k-1}}, \\
          k & w.p. \quad \frac{x / \Delta - y_{k-1}}{ y_k - y_{k-1}}.
      \end{array}
  \right .
  $$

- High variance:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722101414.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### (Solution 2/2) Logarithmic Quantization


<div class='slide-highlight'>
$1 \overset{\text{more levels}}{\Longrightarrow} 0$
</div>

- 3-bit quantization levels (Linear vs. Dynamic Exponent vs. Ours):

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251210214923.png" alt="Image" style="max-width: 100%; height: auto;margin: 0 auto;">
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

✅ Easy to implement

✅ State decay alignment

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250313115306.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>


<section data-markdown>
<textarea data-template>

### Quantization for Signed EMA Update

😄&nbsp; <span style="color: gray">No Signal Swamping</span>

😞&nbsp; **额外的符号表示 (1 bit)**

😞&nbsp; **直接决定更新方向 (误差敏感)**

💡 总结:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250314115701.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Quantization Errors $\Rightarrow$ Gradient Variance

<div class="slide-cols">

<div class="slide-col-6">

&nbsp;

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722101739.png" alt="Image" style="max-width: 95%; height: auto;margin: 0 auto;">
</div>
</div>

<div class="slide-col-4">

&nbsp;

$\rightarrow$ <span style="color: red">Bits $\downarrow$</span> or <span style="color: red">$\beta \uparrow$ </span>

$\rightarrow$ Quantization errors <span style="color: red">$\uparrow$</span>

$\rightarrow$ gradient variance <span style="color: red"> $\uparrow$ </span>

$\rightarrow$ <span style="color: red"> worse </span> convergence

</div>

</div>

<div class='slide-highlight'>
不稳定性难以在量化算法层面避免!
</div>

<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">Li H., et al. Convergence of Adam under Relaxed Assumptions. NeurIPS, 2023.</p>
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
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617111401.png" alt="Image" style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

😒 **传统方法:** $\underset{\text{Training from scratch}}{\xrightarrow{\text{Ultra-Low-Bit}}}$ degeneration/collapse 

😊 **SOLO:** Robust to bits/tasks/models

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Experiments (Giant Models)

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617112643.png" alt="Image" style="max-width: 95%; height: auto;margin: 0 auto;">
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

- Lower-bit SOLO needs a smaller $\beta$

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250407200935.png" alt="Image" style="max-width: 95%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### State Changes

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617112843.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Generalizability of SOLO

-  AdaBelief

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617113113.png" alt="Image" style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

- Larger-scale models:

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617113029.png" alt="Image" style="max-width: 100%; height: auto;margin: 0 auto;">
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