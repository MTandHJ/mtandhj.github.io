---
date: "2025-09-18"
draft: true
title: "MPT"
author: MTandHJ
tags:
  - Slide
  - Markov
  - Recommendation
  - Foundation
  - Dataset
---

<!-- --------------------------------------------------------- -->

<section data-markdown>
## Markovian Pre-trained Transformer for Next-Item Recommendation
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Background: Pre-training & Fine-tuning

- **Pre-training & Fine-tuning:** 多个领域的致胜法宝
  - (CV) ResNet, SimCLR, MAE, ViT ...
  - (NLP) BERT, GPT ...

- Pre-training & Fine-tuning for Next-Item Recommendation:
  - (美好愿景) 😄 quick deployment; 😄 better generalizability
  - (研究现状) 😞 效果远远逊色于 domain-specific 模型


<div class="slide-highlight">
🤔什么阻碍了"推荐知识"的迁移?
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Background: Pre-training & Fine-tuning

- **Next-Item Recommendation:**

  $$
  [v_1, v_2, \ldots, v_t] \rightarrow v_{t+1}
  $$

- 推荐数据的异构性 (heterogeneity):
  1. diverse user behaviors
  2. non-negligible domain gaps

<div class="slide-highlight">
🤔什么样的"推荐知识"是可迁移的?
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## RQI: Transferable Capabilities

<div class="slide-highlight">
学好 XXX 有什么用, 生活里又用不到!
</div>

- **Computer Vision:**
  1. (图像分类) 特征提取、模式识别 ...
  2. (图像生成) 数据分布建模 ...

- **Natural Language Processing:** 
  1. (传统语料) 语义理解、语法保持
  2. (数学/代码) 逻辑推理

<div class="slide-highlight">
可迁移的是能力!
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Transferable Capabilities for Recommendation

- 推荐需要何种能力? 长短兴趣建模?

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217112626.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">
  GRU4Rec: RNN; SASRec: Transformer; HSTU: Attention + Time-based positional encoding
  </p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Transferable Capabilities for Recommendation

$$
  \begin{array}{rl}
  \textcircled{\small 1} \text{ Chronologically ordered:} & \mathbb{P}\left(v_{t+1}\,|\,v_t, v_{t-1}, \ldots, v_1; \Theta \right), \\
  \textcircled{\small 2} \text{ Partially shuffled:} & \mathbb{P}\left(v_{t+1}\,|\, v_t, \{v_1, v_2, \ldots \}; \Theta \right), \\
  \textcircled{\small 3} \text{ Completely shuffled:} & \mathbb{P}\left(v_{t+1}\,|\,\{v_1, v_2, \ldots, v_t\}; \Theta \right)
  \end{array}
$$

- $\textcircled{\small 1} \approx \textcircled{\small 2}$: 先进的序列推荐模型并没有依赖序列性做出更加复杂的推理 (即使 HSTU 引入了 Timestamps 信息)

- $\textcircled{\small 1}/\textcircled{\small 2} \gtrapprox \textcircled{\small 3}$: Latest interaction 至关重要

- 上述结论与数据集预处理方式、优化目标、模型表达能力无关

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Markovian Nature of Next-Item Prediction

- 当前先进的序列推荐模型的推理逻辑:
  1. 依赖整体序列推断 "general user preferences"
  2. 格外强调用户最新的交互

$$
  \mathbb{P}\left(
    v_{t+1}\,|\,v_{t}, v_{t-1}, \ldots, v_1; \Theta
  \right)
  \approx \mathbb{P}(
    v_{t+1}\,|\,v_{t}, \underbrace{\{v_1,  v_2, \ldots\}}_{\text{non-sequential}}; \Theta
  ).
$$

<div class="slide-highlight">
💡当前序列推荐模型不约而同地以符合马尔科夫性的方式进行推理！
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Short-term & Long-term Interests

- **一一对应:**

|马尔科夫性|推荐理论|
|:-:|:-:|
|User Identifiction|Long-term Interest$^{[1]}$|
|Last-Item Attention|Short-term Interest$^{[2]}$|

- **稍有不同:** Long-term interest 的建模并非宣称的那样复杂

<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">
  [1] Xie X., et al. Contrastive Learning for Sequential Recommendation. ICDE, 2022.
  </p>
  <p style="margin: 2px 0;">
  [2] Liu Q., et al.  STAMP: Short-term Attention/Memory Priority Model for Session-based Recommendation. KDD, 2018.
  </p>
</div>


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## RQII: Data for Markovian Reasoner

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217120440.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Next-State Prediction

- 如何仅凭**上下文**推断马氏链下一时刻状态?

  $$
  s_1, s_2, \ldots, s_t \rightarrow s_{t+1}, \quad
  s_{n} \in \mathcal{S}, \: \forall n=1,2,\ldots, t+1
  $$

**Step1:** 根据 $[s_1, s_2, \ldots, s_t]$ 估计转移概率矩阵

**Step2:** 确定当前时刻的状态 $s_t$

**Step3:** 选取 $s_t \rightarrow ?$ 最大概率的状态作为预测

- 擅长 Next-State Prediction 的模型, 需具备:
  1. 自适应的序列总结能力;
  2. 特别注意当前状态的机制

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Markovian Pre-trained Transformer (MPT)

- **Next-State Prediction Task:**

$$
  \mathcal{L}_{\text{NSP}} = 
  \underset{\mathbf{P} \sim \text{Dir}(\bm{\alpha})}{\mathbb{E}} 
  \underset{\{s_t\}_{t=2}^T \sim \mathbf{P}|s_1}{\mathbb{E}}
  -\sum_{t=1}^{T-1} \log \mathbb{P}(s_{t+1}\,|\,s_{t}, \ldots, s_{1}; \Theta)
$$

<div class="slide-highlight">
100% 人造数据用于预训练！
</div>

<div class="slide-highlight">
✅ Controllable ✅ Unlimited
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markovian Pre-training & Recommendation Fine-tuning

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217143749.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Experiments

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217145634.png" 
alt="Image" 
style="max-width: 90%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Empirical Analysis: NDCG@10 vs. #Tokens

<div class="slide-cols">

<div class="slide-col-4">

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217150737.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</div>

<div class="slide-col-6">

- $\mathcal{L}_{\text{NSP}}$ 随着 tokens 增加逐渐下降, 且有多次骤降

- 在学习了 $10^{10}$ (约 10B) 左右 tokens 后, 大部分场景下都呈现饱和

- 不同场景下的最优训练 #Tokens 存在差异

</div>

</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Empirical Analysis: Attention Map

<div class="slide-cols">

<div class="slide-col-4">

- MPT 更关注自身

- Qwen-2.5 的 Attention Map 基本上没有区分度


</div>

<div class="slide-col-6">

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217151521.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</div>

</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Sensitivity Analysis: $|\mathcal{S}|$

- Number of states $|\mathcal{S}|$

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217152317.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Sensitivity Analysis: $\alpha$

- $\alpha$ of Dirichlet distribution

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217152637.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## Summary

- **可迁移的推荐能力:** 序列无关的偏好推断 & 特别关注最新交互

- **Next-State Prediction:** ✅ Controllable ✅ Unlimited

- **Markovian Pre-trained Transformer (MPT):** ✅ 高效 ✅ 易迁移

<div class="slide-highlight">
下一个时代: Data Simulation
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