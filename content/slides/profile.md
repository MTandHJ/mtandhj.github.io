---
date: "2025-03-17"
draft: false
title: "个人介绍"
author: MTandHJ
tags:
  - Slide
  - Profile
---

<section>
<h1> 个人介绍 </h1>

<div>
<p style="text-align: right"> 徐聪 </p>
<p style="text-align: right"> 华东师范大学 </p>
</div>

</section>

<section data-markdown>
<textarea data-template>

### 教育背景


- 2015.09| 烟台大学 $\circ$ 数学与信息科学学院 
- 2019.06| 统计学 $\circ$ 多元统计分析 $\circ$ <u>稀疏主成分分析</u>

<p style="margin-top: 2em !important"></p>

- 2019.09| 烟台大学 $\circ$ 数学与信息科学学院 
- 2022.06| 计算数学 $\circ$ 计算机视觉 $\circ$ <u>模型对抗鲁棒性</u>
- 山东省研究生优秀成果奖 $\circ$ 国家奖学金 $\circ$ 山东省优秀学位论文

<p style="margin-top: 2em !important"></p>

- 2022.09| 华东师范大学 $\circ$ 计算机科学与技术学院 
- 2026.06| 计算机应用技术 $\circ$ 机器学习 $\circ$ <u>推荐系统/优化方法</u>

</textarea>
</section>


<section data-markdown>
<textarea data-template>

### 科研成果
  
<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317113550.png" alt="Image" style="max-width: 110%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>


<section data-markdown>
<textarea data-template>

### 推荐系统 (背景)
  
- 任务目标: 挖掘<u>用户</u>**潜在**的**兴趣偏好**、推荐**高概率**被点击的<u>商品</u>

- 阶段区分: 
    - **粗排**: 粗筛百万级别的商品
    - 精排: 结合丰富特征、对粗筛得到的商品进行精排

- 数据类型:
    - 交互数据 $\overset{\text{二部图}}{\longrightarrow}$  协同过滤 $\rightarrow$ MF、GNN
    - 序列数据 $\overset{\text{时序信息}}{\longrightarrow}$ 序列推荐 $\rightarrow$ RNN、Transformer
    - 媒体数据 $\overset{\text{图片、文本}}{\longrightarrow}$ 多模态推荐 $\rightarrow$ GNN、Attention、Gate

</textarea>
</section>


<section data-markdown>
<textarea data-template>

### 研究路线

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317143247.png" alt="Image" style="max-width: 70%; height: auto;margin: 0 auto;">
</div>

  
</textarea>
</section>


<section data-markdown>
<textarea data-template>

### 图协同过滤: StableGCN

<div class="slide-cols">

<div class="slide-col-half">

- 图神经网络在协同过滤中:
    - **N**eighborhood **A**ggregation (NA) (**√**)
    - **F**eature **T**ransformation (FT) (**X**)


</div>

<div class="slide-col-half">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317150356.png" alt="Image" style="max-width: 90%; height: auto;margin: 0 auto;">
</div>


</div>

</div>

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. StableGCN: Decoupling and Reconciling Information Propagation for Collaborative Filtering. TKDE, 2023.</p>
</div>


</textarea>
</section>

<!-- --------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图协同过滤: StableGCN

<div class="slide-cols">

<div class="slide-col-half">

- 图神经网络在协同过滤中:
    - **N**eighborhood **A**ggregation (NA) (**√**)
    - **F**eature **T**ransformation (FT) (**X**)

- FT 导致"振荡平滑性"

- StableGCN:
    1. Decoupled GCN
    2. Feature Extraction
    3. Feature Denoising
    4. Progressive Training 

</div>

<div class="slide-col-half">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317151547.png" alt="Image" style="max-width: 110%; height: auto;margin: 0 auto;">
</div>

<p>&nbsp;</p>

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317151742.png" alt="Image" style="max-width: 110%; height: auto;margin: 0 auto;">
</div>


</div>

</div>

<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. StableGCN: Decoupling and Reconciling Information Propagation for Collaborative Filtering. TKDE, 2023.</p>
</div>


</textarea>
</section>

<!-- --------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图+序列: SEvo

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317152831.png" alt="Image" style="max-width: 90%; height: auto;margin: 0 auto;">
</div>

- 序列模型 $\overset{\text{+结构化的图}}{\longrightarrow}$ 特质化、缺乏通用性的模型 $\rightarrow$ SEvo


<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. Graph-enhanced Optimizers for Structure-aware Recommendation Embedding Evolution. NeurIPS, 2024.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图+序列: SEvo

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317155009.png" alt="Image" style="max-width: 73%; height: auto;margin: 0 auto;">
</div>

- 序列模型 $\overset{\text{+结构化的图}}{\longrightarrow}$ 特质化、缺乏通用性的模型 $\rightarrow$ SEvo
- **Challenge:** 收敛速度、 如何应用于不同的优化器


<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. Graph-enhanced Optimizers for Structure-aware Recommendation Embedding Evolution. NeurIPS, 2024.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图+多模态: STAIR

<div class="slide-cols">

<div class="slide-col-half">

- 多模态协同过滤:
    - 往往非模态驱动!
    - **融合问题:** 多模态 + 交互数据


</div>

<div class="slide-col-half">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317155427.png" alt="Image" style="max-width: 90%; height: auto;margin: 0 auto;">
</div>


</div>

</div>


<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. STAIR: Manipulating Collaborative and Multimodal Information for E-Commerce Recommendation. AAAI, 2025.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### 图+多模态: STAIR

<div class="slide-cols">

<div class="slide-col-half">

- 多模态协同过滤:
    - 往往非模态驱动!
    - **融合问题:** 多模态 + 交互数据

- STAIR:
    - **Challenge I:** Modality erasure
        - Forward Stepwise Convolution (FSC)
    - **Challenge II:** Modality forgetting
        - Backward Stepwise Convolution (BSC)


</div>

<div class="slide-col-half">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317155427.png" alt="Image" style="max-width: 90%; height: auto;margin: 0 auto;">
</div>

<p style="margin-top: 1.5em !important"></p>

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250317155710.png" alt="Image" style="max-width: 90%; height: auto;margin: 0 auto;">
</div>


</div>

</div>


<div class="slide-ref">
    <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
    <p style="margin: 2px 0;">Xu C., et al. STAIR: Manipulating Collaborative and Multimodal Information for E-Commerce Recommendation. AAAI, 2025.</p>
</div>

</textarea>
</section>