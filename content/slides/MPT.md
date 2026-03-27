---
date: "2026-01-12"
draft: false
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

<slide-section>
## Markovian Pre-trained Transformer for Next-Item Recommendation
</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background: Pre-training & Fine-tuning

- **Pre-training & Fine-tuning:** 多个领域的致胜法宝
  - (CV) ResNet, SimCLR, MAE, ViT ...
  - (NLP) BERT, GPT ...
  - (CV & NLP) CLIP, BLIP, SigLIP ...

- Pre-training & Fine-tuning for Next-Item Recommendation:
  - (美好愿景) 😄 quick deployment; 😄 better generalizability
  - (研究现状) 😞 效果远远逊色于 domain-specific 模型


<slide-highlight>
🤔什么阻碍了"推荐知识"的迁移?
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background: Pre-training & Fine-tuning

- **Next-Item Recommendation:**

  $$
  [v_1, v_2, \ldots, v_t] \rightarrow v_{t+1}
  $$

- 推荐数据的异构性 (heterogeneity):
  1. diverse user behaviors
  2. non-negligible domain gaps

<slide-highlight>
🤔什么样的"推荐知识"是可迁移的?
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## RQI: Transferable Capabilities

<slide-highlight>
学好 XXX 有什么用, 生活里又用不到!
</slide-highlight>

- **Computer Vision:**
  1. (图像分类) 特征提取、模式识别 ...
  2. (图像生成) 数据分布建模 ...

- **Natural Language Processing:** 
  1. (传统语料) 语义理解、语法保持
  2. (数学/代码) 逻辑推理

<slide-highlight>
可迁移的是能力!
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Transferable Capabilities for Recommendation

- 推荐需要何种能力? 长短兴趣建模?

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260112202832.png" size="100%"></slide-img>

<slide-ref>
  GRU4Rec: RNN; SASRec: Transformer; HSTU: Attention + Time-based positional encoding
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

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

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

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

<slide-highlight>
💡当前序列推荐模型不约而同地以符合马尔科夫性的方式进行推理！
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Short-term & Long-term Interests

- **一一对应:**

|马尔科夫性|推荐理论|
|:-:|:-:|
|User Identifiction|Long-term Interest$^{[1]}$|
|Last-Item Attention|Short-term Interest$^{[2]}$|

- **稍有不同:** Long-term interest 的建模并非宣称的那样复杂

<slide-ref>
  [1] Xie X., et al. Contrastive Learning for Sequential Recommendation. ICDE, 2022.
  [2] Liu Q., et al.  STAMP: Short-term Attention/Memory Priority Model for Session-based Recommendation. KDD, 2018.
</slide-ref>


</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## RQII: Data for Markovian Reasoner

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217120440.png" size="100%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

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
  2. 特别着重当前状态的机制

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Markovian Pre-trained Transformer (MPT)

- **Next-State Prediction Task:**

$$
  \mathcal{L}_{\text{NSP}}(\Theta) = 
  \underset{\mathbf{P} \sim \text{Dir}(\bm{\alpha})}{\mathbb{E}} 
  \underset{\{s_t\}_{t=2}^T \sim \mathbf{P}|s_1}{\mathbb{E}}
  -\sum_{t=1}^{T-1} \log \mathbb{P}(s_{t+1}\,|\,s_{t}, \ldots, s_{1}; \Theta)
$$

<slide-highlight>
100% 人造数据用于预训练！
</slide-highlight>

<slide-highlight>
✅ Controllable ✅ Unlimited
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

### Markovian Pre-training & Recommendation Fine-tuning

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217143749.png" size="100%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Experiments

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260112203428.png" size="100%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Data Scaling: NDCG@10 vs. #Tokens

<slide-cols>

<slide-col ratio="4">

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260112203808.png" size="100%"></slide-img>

</slide-col>

<slide-col ratio="6">

- $\mathcal{L}_{\text{NSP}}$ 随着 tokens 增加逐渐下降, 且有多次骤降

- 在学习了 $10^{10}$ (约 10B) 左右 tokens 后, 大部分场景下都呈现饱和

- 不同场景下的最优训练 #Tokens 存在差异

- 存在理论上限 Bayes estimator

</slide-col>
</slide-cols>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Comparison of Inference Mechanisms

<slide-cols>

<slide-col ratio="4">

- MPT 和 Qwen-2.5 的 Backbone 均未经过推荐训练

- MPT 会更关注自身

- Qwen-2.5 的 Attention Map 基本上没有区分度

- MPT 甚至会产生和 SASRec+ 类似的模式

</slide-col>

<slide-col ratio="6">
<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260112204030.png" size="100%"></slide-img>
</slide-col>

</slide-cols>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Sensitivity Analysis: $|\mathcal{S}|$

- Number of states $|\mathcal{S}|$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217152317.png" size="100%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Sensitivity Analysis: $\alpha$

- $\alpha$ of Dirichlet distribution

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251217152637.png" size="100%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Summary

- **可迁移的推荐能力:** 序列无关的偏好推断 & 特别关注最新交互

- **Next-State Prediction:** ✅ Controllable ✅ Unlimited

- **Markovian Pre-trained Transformer (MPT):** ✅ 高效 ✅ 易迁移

<slide-highlight>
下一个时代: Data Simulation?
</slide-highlight>

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