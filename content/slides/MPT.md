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

### Markovian Nature of Next-Item Recommendation

- Next-Item Recommendation (for User $u$ given $\{x_i^u\}_{i=1}^t$)

    $$
    \tag{1}
    \mathbb{P}(x_{t+1}| x_{t}^u, x_{t-1}^u, \ldots, x_1^u; \theta).
    $$

- <span style="color: blue">Sequential nature</span> is of 'paramount importance' because of
    - personalized recommendation (user identifier)
    - dynamic user interests (a particularly appealing characteristic)  

🤔 Do existing public datasets inherently exhibit such characteristics? - <span style="color: red">NOT EXACTLY!</span>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markovian Nature of Next-Item Recommendation

- If sequentiality is **prevalent** in public datasets,

    $$
    \mathbb{P}(x_{t+1}| x_{t}^u, \textcolor{red}{\text{Shuffle}(}x_{t-1}^u, \ldots, x_1^u\textcolor{red}{)}; \theta)
    $$

    should give <span style="color: red">wrong</span> probability estimation.

- Otherwise, Markovian nature:

    $$
    \begin{align*}
      & \mathbb{P}(x_{t+1}| x_{t}^u, x_{t-1}^u, \ldots, x_1^u; \theta) \\
      \approx & \mathbb{P}(x_{t+1}| x_{t}^u, \text{Shuffle}(x_{t-1}^u, \ldots, x_1^u); \theta) \\
      = & \mathbb{P}(x_{t+1}| x_{t}, \underbrace{\phi(u)}_{
        \text{provides sequence-unaware personalized information}
      }; \theta) \\
    \end{align*}
    $$

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markovian Nature of Next-Item Recommendation

|  Dataset                               | NDCG@10 |Shuffled |
|---------------------------------|---------|---------|
| Amazon2014Beauty_550_LOU        | 0.0595  | 0.0596  |
| Amazon2014Beauty_554_LOU        | 0.0768  | 0.0767  |
| Amazon2014Tools_550_LOU         | 0.0352  | 0.0353  |
| Amazon2014Toys_550_LOU          | 0.0629  | 0.0628  |
| MovieLens1M_550_LOU             | <span style="color: red">0.1345</span>  | <span style="color: red"> 0.1169 </span> |
| RetailrocketTransaction_500_LOU | 0.0869  | 0.0867  |
| Steam_550_LOU                   | 0.1570  | 0.1564  |
| Yelp2018_10100_LOU              | 0.0252  | 0.0253  |


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markovian Nature: Observations

$\textcircled{\small 1}$  All datasets except MovieLens exhibit a markovian nature.


$\textcircled{\small 2}$  The 'sequentiality' of MovieLens arises from repeated movie categories:

  $$
  \text{Drama, Drama, Animation, Animation, Animation...}
  $$

$\textcircled{\small 3}$  MovieLens datasets are not good datasets for assessing the performance of sequential recommendation${}^{\tiny [1]}$. Most interactions share the same timestamps!

<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">[1] Woolridge D., et al. Sequence or Pseudo-Sequence? An Analysis of Sequential Recommendation Datasets. PERSPECTIVES, 2021.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markovian Nature: Situation

- Barriers to **scaling** models effectively:
  - Transformer may primarily learn to attend to the most recent token.

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250918171752.png" 
  alt="Image" 
  style="max-width: 50%; height: auto;margin: 0 auto;">
</div>

- Leading to **Markov-friendly** designs:
  - Decoder-only $\succ$ Encoder-only
  - Learnable PE $\succ$ Sinusoidal PE/RoPE

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markovian Nature: Problems & Opportunities

😞 The community has overfitted to the Markovian nature!

🤔 If this is a bug, how to alleviate such bias?

😄 If this is the feature, how can we leverage the Markovian nature?

💡 A 'good' sequential recommender is characterized by:  

&emsp; $\textcircled{\small 1}$ the ability to <u>attend to the most recent item</u>;

&emsp; $\textcircled{\small 2}$ the ability to estimate <u>individual preferences</u> from sequence.

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### $x_t \rightarrow x_{t+1}$

- Predict $x_{t+1}$ using the most recent $k$ items

- (**Training**) Split $[x_1, x_2, x_3, x_4, x_5]$ (if $k=2$) into

  $$
  \begin{align*}
  [x_1] \rightarrow x_2, \\
  [x_1, x_2] \rightarrow x_3, \\
  [x_2, x_3] \rightarrow x_4, \\
  [x_3, x_4] \rightarrow x_5.
  \end{align*}
  $$

- When $k=1$, the transformer estimates the **transition probability** over the entire dataset.

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### $x_t \rightarrow x_{t+1}$


<div class="slide-cols">

<div class="slide-col-6">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250807134137.png" 
  alt="Image" 
  style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</div>

<div class="slide-col-4">

- Amazon2014Beauty_550_LOU

- ($k$ = 1) More than 60% of users employ the same $x_t$ to predict $x_{t+1}$.

</div>

</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### STAMP

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250808103422.png" 
  alt="Image" 
  style="max-width: 50%; height: auto;margin: 0 auto;">
</div>

|Blocks|HR@1|HR@10|NDCG@10|
|:-:|:-:|:-:|:-:|
|STAMP|0.0168|0.0564|0.0343|
|only $\bm{h}_t$|0.0270|0.0710|0.0466|
|only $\bm{m}_t$|0.0246|0.0814|0.0496|

<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0; font-size: 0.9em">Liu Q., et al. STAMP: Short-Term Attention Memory Priority Model for Session-based Recommendation. KDD, 2018.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markov Chain Estimation

- Given an arbitrary **random** Markov chain  

  $$
  \underbrace{x_1, x_2, \ldots}_{\text{context}}, x_t, \quad x_i \in \{s_k\}_{k=1}^K,
  $$  

  a transformer model $f([x_1, x_2, \ldots, x_t])$ can accurately predict $x_{t+1}$ in agreement with the true transition probability.  


😄 Markovian Pre-trained Transformer (MPT) has acquired:

&emsp; ✅the ability to <u>attend to the most recent token</u>;

&emsp; ✅ the ability to estimate <u>chain-wise transition probability</u>.


<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">[1] Lepage S., et al. Markov Chain Estimation with In-Context Learning. arXiv, 2025.</p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markov Chain Estimation


<div class="slide-cols">


<div class="slide-col-6">

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250813151043.png" 
  alt="Image" 
  style="max-width: 80%; height: auto;margin: 0 auto;">
</div>

</div>

<div class="slide-col-4">

- **Model loss**: 模型预测 Loss
- **Oracle loss**: 最优预测 Loss
- $N$: 训练所采样的转移概率矩阵数目

- 充分训练的 Transformer 呈现稀疏的 attention map

</div>

</div>


<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">[1] Lepage S., et al. Markov Chain Estimation with In-Context Learning. arXiv, 2025.</p>
</div>

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### MPT for Next-Item Recommendation

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250920164936.png" 
  alt="Image" 
  style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Markov Chains $\uparrow$

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250923103513.png" 
  alt="Image" 
  style="max-width: 60%; height: auto;margin: 0 auto;">
</div>

$\approx 10^9$ tokens for optimal performance

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### MPT for Next-Item Recommendation

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250923102401.png" 
  alt="Image" 
  style="max-width: 70%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Zero-Shot

<div class="slide-img">
  <img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250924142541.png" 
  alt="Image" 
  style="max-width: 70%; height: auto;margin: 0 auto;">
</div>

- Last Item Prediction (NDCG@10): 0.0423

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### SASRec vs MPT vs UniSRec

| Dataset                   | SASRec+ | MPT    | UniSRec |
| ------------------------- | ------- | ------ | ------- |
| Amazon2014Beauty_550_LOU  | 0.0595  | 0.0614 | 0.0561  |
| Amazon2014Beauty_1000_LOU | 0.0327  | 0.0413 | 0.0394  |
| Amazon2014Toys_550_LOU    | 0.0629  | 0.0647 | 0.0632  |
| Amazon2014Tools_550_LOU   | 0.0352  | 0.0387 | 0.0308  |
| Yelp2018_10100_LOU        | 0.0252  | 0.0179 |         |
| Steam_550_LOU             | 0.0802  | 0.0686 | 0.0103  |

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

### Summary

- Most recommendation datasets exhibit a **Markovian nature**.

- If this is the feature, sequential recommenders should be able to  
  - infer **individual preferences** from the sequence, and
  - place particular emphasis on the **most recent item**.

- The **Markovian Pre-trained Transformer (MPT)** might become the recommendation **foundation** model?
  - scaling law?

- Semantic IDs?

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