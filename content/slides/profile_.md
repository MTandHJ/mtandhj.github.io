---
date: "2025-07-10"
draft: false
title: "关于我"
author: MTandHJ
tags:
  - Slide
  - Profile
---

<section>
<h1> 字节面试 </h1>

<div>
<p style="text-align: right"> 徐聪 </p>
<p style="text-align: right"> 华东师范大学 </p>
</div>

</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 教育背景



- 2022.09| 华东师范大学 $\circ$ 计算机科学与技术学院 
- 2026.06| 计算机应用技术 $\circ$ 机器学习 $\circ$ <u>推荐系统/优化方法</u>

<p style="margin-top: 2em !important"></p>

- 2019.09| 烟台大学 $\circ$ 数学与信息科学学院 
- 2022.06| 计算数学 $\circ$ 计算机视觉 $\circ$ <u>模型对抗鲁棒性</u>
- 山东省研究生优秀成果奖 $\circ$ 国家奖学金 $\circ$ 山东省优秀学位论文

<p style="margin-top: 2em !important"></p>

- 2015.09| 烟台大学 $\circ$ 数学与信息科学学院 
- 2019.06| 统计学 $\circ$ 多元统计分析 $\circ$ <u>稀疏主成分分析</u>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 科研经历
  

&nbsp;

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250622150238.png" 
    alt="Image" 
    style="max-width: 100%; height: auto;margin: 0 auto;"
  >
</div>


<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Goodfellow I. J., et al. Explaining and Harnessing Adversarial Examples. ICLR, 2015.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 科研经历
  

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250622150730.png"
    alt="Image" 
    style="max-width: 90%; height: auto;margin: 0 auto;"
  >
</div>


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图优化器: Background

$\textcircled{\small 1}$ Embedding $\xrightarrow{\text{实体 (User, Item) 的向量表示}}$ 现代推荐系统的基础


<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619102807.png" 
  alt="Image" 
  style="max-width: 60%; height: auto;margin: 0 auto;">
</div>

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. Graph-enhanced Optimizers for Structure-aware Recommendation Embedding Evolution. NeurIPS, 2024.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图优化器: Background

$\textcircled{\small 2}$ 多元信息 $\xrightarrow{\text{交互信息, 类别相似性}}$ 潜在的结构性约束


<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619110409.png" 
  alt="Image" 
  style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

❓Embedding 学习如何高效融入这些结构性先验


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图优化器: SEvo

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250622152012.png" 
  alt="Image" 
  style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

🤔 平滑性 vs. 收敛性 

🤔 如何应用到现代优化器之中

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图优化器: SEvo

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250622170316.png" 
  alt="Image" 
  style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 低精度优化器: Background

↗️ 模型大小飞速增加 vs. 硬件价格居高不下

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312203012.png" alt="Image" style="max-width: 65%; height: auto; margin: 0 auto;">
</div>

- 解决方案: 
  - MoE, LoRA; ZeRO, FSDP; 
  - Network Quantization; <span style="color: red;">Lightweight Optimizers</span>

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. Pushing the Limits of Low-Bit Optimizers: A Focus on EMA Dynamics. 2025.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 低精度优化器: Background
  
⚙️ Optimizer States (2x model size):

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

### 低精度优化器: SOLO

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250622153303.png" 
    alt="Image" 
    style="max-width: 90%; height: auto;margin: 0 auto;"
  >
</div>

❓超低精度下: <span style="color: red">signal swamping</span> & <span style="color: red">high gradient variance</span>

✅ 定制的对数量化 & 改良的动量系数: 50GB $\xrightarrow{\text{LLaMA-7B}}$ 5GB


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### FreeRec

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/freerec/master/docs/src/flow.png" 
    alt="Image" 
    style="max-width: 100%; height: auto;margin: 0 auto;"
  >
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### FreeRec

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/freerec/master/docs/src/pipeline.png" 
    alt="Image" 
    style="max-width: 100%; height: auto;margin: 0 auto;"
  >
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