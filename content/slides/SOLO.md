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

<slide-section>
## Pushing the Limits of Low-Bit Optimizers with a Focus on EMA Dynamics
</slide-section>

<slide-section>

## Background

<slide-highlight>模型飞速膨胀 vs. 吃紧的硬件设备</slide-highlight>

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312203012.png" size="65%"></slide-img>

- 可能的一些解决方案: 
  - MoE, LoRA; ZeRO, FSDP; 
  - Network Quantization; <span style="color: red;">Lightweight Optimizers</span>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background
  
⚙️ Optimizer States (2x model size):

$$
m_{t+1} \leftarrow \beta_1 \cdot m_t + (1 - \beta_1) \cdot g, \\
v_{t+1} \leftarrow \beta_2 \cdot v_t + (1 - \beta_2) \cdot g^2
$$

- Lightweight Optimizers:
  - **重新设计:** Lion, Muon ...
  - **状态共享:** Adafactor, SM3, Adam-Mini ...
  - **降维/稀疏化:** GaLore, MicroAdam
  - **低精度:** 1-bit SGD/Adam, <u>16/8/4-bit Optimizers</u>, Q-GaLore, 8-bit Muon

<slide-highlight>Why Low-Bit Optimizers?</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Why Low-Bit Optimizers?

- **泛化性:** ✅无需额外调参 ✅适用任意场景

- **灵活性:** ✅非环境依赖

- **成功的工程实践:** DeepSeek-v3 训练框架 ($g \overset{\text{BF16}}{\rightarrow} m,v \overset{\text{FP32}}{\rightarrow} \theta$)
  
<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312204230.png"></slide-img>

<slide-ref>
  DeepSeek-AI. DeepSeek-V3 Technical Report, 2024.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Quantization and Dequantization
  
- Quantization:

  $$
  q = Q(x) := \mathop{\text{argmin}} \limits_{k=0}^{2^b - 1} \big|\frac{x}{\textcolor{red}{\Delta}} - \textcolor{red}{y_k} \big|.
  $$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312205652.png"></slide-img>

- Dequantization:

$$
\tilde{x} = Q^{\dagger}(q) := y_{q} \cdot \Delta.
$$

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## <u>S</u>tateful <u>O</u>ptimizers in Ultra-<u>LO</u>w Bits

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617110019.png" size="70%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Challenges in Ultra-Low-Bit Cases

- **表示精度:** 42 亿 (32-bit) vs. 8 (3-bit) vs. 4 (2-bit)

- **量化范围:** 如何将尽可能多的元素一起量化?

- **一阶/二阶动量:**
  - (Signed) 一阶动量 ($m$): 决定参数更新方向 
  - (Unsigned) 一阶动量 ($m$): 决定参数更新步长

<slide-highlight>关键: EMA Dynamics</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Quantization for Unsigned EMA Update

- *Signal Swamping* (<u>large-to-small number addition</u>)

$$
\text{EMA update:  }  \hat{x}_{t+1} \leftarrow \beta \cdot \tilde{x}_t + \underbrace{\textcolor{red}{(1 - \beta) \cdot z_{t + 1}}}_{\text{very small as } \beta \rightarrow 1}.
$$


<div style="text-align: center; margin-top: 50px; margin-bottom: -80px; padding: 0">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722100933.png" alt="Image" style="max-width: 70%; height: auto;margin: 0 auto;">
</div>

<slide-ref>
  Higham N. J. The Accuracy of Floating Point Summation. SIAM Journal on Scientific Computing. 1993.
</slide-ref>

</slide-section>


<!-- --------------------------------------------------------- -->


<slide-section>

## Signal Swamping

💡 总结

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312212039.png"></slide-img>

<slide-highlight>❎Unsigned ❎ $\beta \uparrow$ ❎ $b \downarrow$</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Case Study

<slide-cols>

<slide-col ratio="6">

&nbsp;

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722101123.png" size="90%"></slide-img>

</slide-col>

<slide-col ratio="4">

&nbsp;

- 一定<span style="color: red">条件</span>下:
  - Linear 下全部不更新
  - DE 下部分更新

- 实际上 $\beta \ge 0.9$ 为<span style="color: red">相当常见的 setting</span>

</slide-col>

</slide-cols>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Case Study

<slide-cols>

<slide-col ratio="4">

&nbsp;

- 随机信号:
  - $X \in \mathbb{R}^{1000}$
  - $Z \sim \mathcal{U}[0, 1]$

- Relaxed 条件:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: red;">*X*</span> &nbsp; Fixed $\Delta$

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: red;">*X*</span> &nbsp; $z \le \Delta$


- 理论收敛至: $0.5$

</slide-col>


<slide-col ratio="6">

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250908140511.png" size="70%"></slide-img>

</slide-col>

</slide-cols>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Solution (1/2): Stochastic Rounding

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

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722101414.png"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## (Solution 2/2) Logarithmic Quantization


<slide-highlight>$1 \overset{\text{more levels}}{\Longrightarrow} 0$</slide-highlight>

- 3-bit quantization levels (Linear vs. Dynamic Exponent vs. Ours):

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251210214923.png" size="100%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Logarithmic Quantization

- 2-bit quantization illustration

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250313113535.png"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Logarithmic Quantization

✅ Easy to implement

✅ State decay alignment

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250313115306.png"></slide-img>

</slide-section>


<slide-section>

## Quantization for Signed EMA Update

😄&nbsp; <span style="color: gray">No Signal Swamping</span>

😞&nbsp; **额外的符号表示 (1 bit)**

😞&nbsp; **直接决定更新方向 (误差敏感)**

💡 总结:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250314115701.png"></slide-img>


</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Quantization Errors $\Rightarrow$ Gradient Variance

<slide-cols>

<slide-col ratio="6">

&nbsp;

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250722101739.png" size="80%"></slide-img>

</slide-col>

<slide-col ratio="4">

&nbsp;

$\rightarrow$ <span style="color: red">Bits $\downarrow$</span> or <span style="color: red">$\beta \uparrow$ </span>

$\rightarrow$ Quantization errors <span style="color: red">$\uparrow$</span>

$\rightarrow$ gradient variance <span style="color: red"> $\uparrow$ </span>

$\rightarrow$ <span style="color: red"> worse </span> convergence

</slide-col>

</slide-cols>

<slide-highlight>不稳定性难以在量化算法层面避免!</slide-highlight>

<slide-ref>
  Li H., et al. Convergence of Adam under Relaxed Assumptions. NeurIPS, 2023.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Momentum Adjustment

- **方差控制:** 选择 $\beta'$ 满足:

$$
  \underbrace{\frac{\textcolor{gray}{\beta'}}{1 - \textcolor{gray}{\beta'}} r_{\text{median}}(b')}_{\textcolor{gray}{\text{undetermined}}}
  \le \underbrace{\frac{\beta}{1 - \beta} r_{\text{median}}(b)}_{\textcolor{green}{\text{valid setup}}}.
$$

- **查表:** (<u>灰色区域代表了经验可行的参数推荐</u>)

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250314121510.png" size="95%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Experiments

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617111401.png" size="90%"></slide-img>

😒 **传统方法:** $\underset{\text{Training from scratch}}{\xrightarrow{\text{Ultra-Low-Bit}}}$ degeneration/collapse 

😊 **SOLO:** Robust to bits/tasks/models

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Experiments (Giant Models)

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617112643.png" size="80%"></slide-img>

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Loss

- 损失正常收敛

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250319170139.png" size="95%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Quantile $x_p$

- 基本上 $p \in [0.05, 0.3]$ 都有不错的性能

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250319170604.png" size="55%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Beta, Block size

- Lower-bit SOLO needs a smaller $\beta$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250407200935.png" size="95%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## State Changes

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617112843.png" size="70%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Generalizability of SOLO

-  AdaBelief

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617113113.png"></slide-img>

- Larger-scale models:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250617113029.png" size="100%"></slide-img>

</slide-section>

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