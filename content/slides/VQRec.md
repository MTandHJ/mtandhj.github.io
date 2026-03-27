---
date: "2025-07-09"
draft: false
title: "Is Vector Quantization the Future of Recommendation?"
author: MTandHJ
tags:
  - Slide
  - Vector Quantization
---

<slide-section>
## Is Vector Quantization the Future of Recommendation?
</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## VQ-VAE

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250707120708.png" size="100%"></slide-img>

<slide-ref>
  van den Oord A., et al. Neural Discrete Representation Learning. NeurIPS, 2017.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## VQ-VAE

- **向量量化:**

    $$
    \bm{z} \rightarrow \bm{c}_{k^*}, \quad k^* = \text{argmin}_{k: \bm{c}_k \in \mathcal{C}} \|\bm{c}_k - \bm{z} \|.
    $$

- **STE** (straight-through estimator):

    $$
    \bm{q} = \text{STE}(\bm{c}_{k^*}) := \bm{z} + \textcolor{blue}{\text{sg}} \left(\bm{c}_{k^*} - \bm{z} \right) \\
    \text{d}\bm{q} = \text{d}{\bm{z}} + \underbrace{\text{d} \:{\text{sg} \left(\bm{c}_{k^*} - \bm{z} \right)}}_{=0}
    $$

- **Loss:**

    $$
    \mathcal{L} = \underbrace{\| g(\bm{q}) - \bm{x} \|_F^2}_{\mathcal{L}_{recon}} + 
    \underbrace{
        \| \bm{c}_{k^*} - \text{sg} (\bm{z}) \|_F^2 +
        \beta \cdot \| \bm{z} - \text{sg} (\bm{c}_{k^*})\|_F^2.
    }_{\mathcal{L}_{commit}}
    $$

Note:
1. STE 的引入会导致传回 Encoder 的梯度不太准确;
2. Codebook 的学习仅仅依赖于 Commitment Loss.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## VQ-GAN

- 图片 Token 化 + Next-token prediction $p(s_i | s_{< i}, \textcolor{red}{condition})$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250311144000.png" size="100%"></slide-img>

<slide-ref>
  Esser P., et al. Taming Transformers for High-Resolution Image Synthesis. CVPR, 2021.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Why Discrete Representation Learning?

✅ **离散编码**更适合**生成式**XXX

&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $\textcircled{\small 1}$ 更容易作为<u>词表</u>的拓展

&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $\textcircled{\small 2}$ (Rec) 有希望打破<u>最近邻匹配</u>的限制

✅ **可控性:** 类似自然语言的可操控性

&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $\textcircled{\small 1}$ 理解各编码的含义并加以操控

&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $\textcircled{\small 2}$ (Rec) 生成的多样性

✅ **鲁棒性:** 高效的信息压缩带来惊艳的去噪效果

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Challenges

- **Undesirable Gradient Estimator:**

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250707152059.png" size="90%"></slide-img>


- **Codebook Collapse:** Low codebook usage
    1. Codebook 中部分向量过于接近而造成的冗余
    2. Codebook 中部分向量由于训练始终匹配不到 $\bm{z}$ 导致的冗余

Note:
VQ-VAE 广为人知的几个问题

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Solutions

- **Undesirable Gradient Estimator:**
    1. Gumbel-softmax estimator${}^{\text{[1]}}$;
    2. Rotation-trick estimator${}^{\text{[2]}}$

- **Codebook Collapse:**
    1. 对于 codebook 采用 K-means ++ 初始化${}^{\text{[3]}}$;
    2. Fixed Codebook${}^{\text{[4]}}$;
    3. Fixed Codebook + Trainable linear transformation${}^{\text{[5]}}$

<slide-ref>
  [1] Takida Y., et al. SQ-VAE: Variational Bayes on Discrete Representation with Self-annealed Stochastic Quantization. ICML, 2022.
  [2] Fifty C., et al. Restructuring Vector Quantization with the Rotation Trick. ICLR, 2025.
  [3] Lancucki A., et al. Robust Training of Vector Quantized Bottleneck Models. 2020.
  [4] Mentzer F., et al. Finite Scalar Quantization: VQ-VAE Made Simple. 2023.
  [5] Zhu Y., et al. Addressing Representation Collapse in Vector Quantized Models with One Linear Layer. 2024.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Rotation Trick

- '旋转' $\nabla_{q} \mathcal{L}$ 得到 $\nabla_{z} \mathcal{L}$ 满足

    $$
    \angle (\bm{z}, \nabla_z \mathcal{L}) = \angle(\bm{q}, \nabla_q \mathcal{L}).
    $$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612151216.png"></slide-img>

<slide-ref>
  [2] Fifty C., et al. Restructuring Vector Quantization with the Rotation Trick. ICLR, 2025.
</slide-ref>

Note:
Rotation Trick 希望梯度和向量夹角一致.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Rotation Trick


- 等价于利用 '旋转' 矩阵 $R$:

    $$
    \bm{q} = \text{sg}[\gamma R] \bm{z} + \text{sg}[\bm{c} - rR \bm{z}], \quad \textcolor{red}{R \bm{z} / \|\bm{z}\| = \bm{c} / \|\bm{c}\|}
    $$

- **Householder transformation:** 给定向量 $\bm{v}$ 及过原点的正交平面 $\bm{v}^{\perp} := \{\bm{u}: \bm{u}^T \bm{v} = 0\}$, 向量 $\bm{x}$ 关于 $\bm{v}^{\perp}$ 的**反射**为

    $$
    \underbrace{\Big(I - 2 \frac{\bm{v} \bm{v}^T}{\|\bm{v}\|^2} \Big)}_{\text{Householder matrix } P} \bm{x}
    $$

- **性质:** $\bm{x} = \alpha \bm{v}^{\perp} + \beta \bm{v} \rightarrow P\bm{x} = \alpha \bm{v}^{\perp} \textcolor{red}{-} \beta \bm{v}$

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Reflection

$$
R = \left(I - 2 \frac{\bm{r}\bm{r}^T}{\|\bm{r}\|^2} \right), \quad \bm{r} := \frac{\bm{z}}{\|\bm{z}\|} - \frac{\bm{c}}{\|\bm{c}\|}
$$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612173718.png" size="90%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Rotation

$$
R = \left(I - 2 \frac{\bm{c}\bm{c}^T}{\|\bm{c}\|^2} \right) \left(I - 2 \frac{\bm{r}\bm{r}^T}{\|\bm{r}\|^2} \right), \quad \bm{r} := \frac{\bm{z}}{\|\bm{z}\|} + \frac{\bm{c}}{\|\bm{c}\|}
$$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612173750.png"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## STE vs Rotation vs Reflection


<slide-cols>

- **STE:** $\nabla_{z} \mathcal{L} \equiv \nabla_{q} \mathcal{L}$

- **Rotation:** $\bm{z}$ 基本上与 $\bm{q}$ 的更新"行为"保持一致

- **Reflection:** $\bm{z}$ 基本上与 $\bm{q}$ 的更新"行为"可能非常不一致

<slide-col ratio="4">

</slide-col>

<slide-col ratio="6">

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612175428.png" size="120%"></slide-img>

</slide-col>

</slide-cols>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Rotation Trick

🌟 Rotation trick:

$$
\mathbf{q} = \text{sg}\Big[ \frac{\|\bm{c}\|}{\|\bm{z}\|} R \Big] \bm{z} \textcolor{red}{+ 0}
$$

🌟 内积不变性 (❓$\textcolor{red}{+0}$):

$$
\langle \nabla_{z} \mathcal{L}, \bm{z} \rangle
=\langle \frac{\|\bm{c}\|}{\|\bm{z}\|} R^T \nabla_q \mathcal{L}, \bm{z} \rangle
=\langle \nabla_q \mathcal{L}, \frac{\|\bm{c}\|}{\|\bm{z}\|} R \bm{z} \rangle
=\langle \nabla_q \mathcal{L}, \bm{q} \rangle
$$


</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Residual Quantization (RQ-VAE)


😞 $\text{Size}\textcolor{red}{\downarrow} \longrightarrow$ 表达能力$\textcolor{red}{\downarrow}$ &nbsp; **vs** &nbsp; $\text{Size}\textcolor{green}{\uparrow} \longrightarrow$ Collapse$\textcolor{red}{\uparrow}$

- **RQ-VAE:**

    $$
    \bm{z} 
    \overset{\phi}{\rightarrow} \textcolor{red}{\bm{c}_{k_1}}
    \overset{\bm{z} - \bm{c}_{k_1}}{\longrightarrow} \bm{r}_1
    \overset{\phi}{\rightarrow} \textcolor{red}{\bm{c}_{k_2}}
    \overset{\bm{r}_1 - \bm{c}_{k_2}}{\longrightarrow} \bm{r}_2
    \rightarrow \cdots
    $$

- **连续近似:**

    $$
    \bm{q} = \bm{z} + \text{sg}\Big(\sum_{i=1}^{N} \bm{c}_{k_i} - \bm{z} \Big)
    $$


- **离散编码:** $(k_1, k_2, \ldots, k_N)$

<slide-ref>
  Lee D., et al. Autoregressive Image Generation using Residual Quantization. CVPR, 2022.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Fixed Codebook

- **固定** Codebook 为 (size: $|\mathcal{C}| = (2 \lfloor L / 2 \rfloor + 1)^d$):

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
    \bm{q} =  
    \textcolor{red}{\text{round}} \big(
        \textcolor{blue}{\tanh} (\bm{z})
    \big).
    $$

<slide-ref>
  Mentzer F., et al. Finite Scalar Quantization: VQ-VAE Made Simple. 2023.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SimVQ

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250615103519.png" size="100%"></slide-img>

😞 Codebook 每个批次仅少量向量得到训练.

😄 SimVQ 固定 Codebook 仅训练一个 Linear Transformation $W$:

$$
\mathcal{C} \longrightarrow \{W \bm{c}_1, W \bm{c}_2, \ldots, W \bm{c}_K\}
$$

<slide-ref>
  [5] Zhu Y., et al. Addressing Representation Collapse in Vector Quantized Models with One Linear Layer. 2024.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->


<slide-section>

## TIGER


- **传统推荐 (matching):**

    $$
    \bm{e}_u^T \bm{e}_v, \quad v \in \mathcal{V}.
    $$

- **生成式推荐:**

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316175859.png"></slide-img>


<slide-ref>
  Rajput S., et al. Recommender Systems with Generative Retrieval. NeurIPS, 2023.
</slide-ref>

</slide-section>



<!-- --------------------------------------------------------- -->

<slide-section>

## TIGER


- **生成式推荐 (T5-based):**

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316180725.png" size="100%"></slide-img>

- **Beam Search** $\overset{?}{\gg}$ **Approximate Nearest Neighbor**

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Beam Search❓

<slide-cols>

<!-- left -->
<slide-col ratio="6">

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250707105044.png" size="100%"></slide-img>

</slide-col>

<!-- right -->
<slide-col ratio="4">

- Amazon2014Beauty_1000_LOU

- #Users: 12,595 #Items: 75,253

- **Encoder:** All-MiniLM-L12-V2

- **Attributes:** (title, categories, brand)

- #Blocks$\textcolor{green}{\uparrow}$ $\longrightarrow$ #Invalids $\textcolor{green}{\downarrow}$

</slide-col>

</slide-cols>

<slide-ref>
  Zheng B., et al. Adapting Large Language Models by Integrating Collaborative Semantics for Recommendation. ICDE, 2024.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Cold-Start Item Recommendation❓


- Cold-start items 可直接编码, 但

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250327143851.png"></slide-img>

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250327145319.png" size="65%"></slide-img>



<slide-ref>
  Yang L., et al. Unifying Generative and Dense Retrieval for Sequential Recommendation. 2024.
  Yang Y., et al. Sparse Meets Dense: Unified Generative Recommendations with Cascaded Sparse-Dense Representations. 2025.
</slide-ref>

Note: 
虽然应用 VQ 可以很好地支持冷启动d的商品 (可以相当方便地进行编码), 但是 LIGER 发现, 利用 VQ 训练的非常容易过拟合到出现过的组合中去, 反而冷启动的效果特别差.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## RQ-VAE vs (Hierarchical/Residual) KMeans❓


- RQ-VAE 相较于 (Hierarchical/Residual) KMeans 的优势?

||HR@1|HR@5|HR@10|NDCG@5|NDCG@10|
|:-:|:-:|:-:|:-:|:-:|:-:|
|Random|0.0025|0.0080|0.0114|0.0052|0.0063|
|KMeans|0.0038|**0.0154**|**0.0246**|**0.0096**|**0.0126**|
|STE|0.0023|0.0111|0.0188|0.0067|0.0091|
|Rotation|**0.0041**|0.0122|0.0195|0.0083|0.0106|
|SimVQ|0.0029|0.0092|0.0164|0.0060|0.0083|


<slide-ref>
  Wang Y., et al. EAGER: Two-Stream Generative Recommender with Behavior-Semantic Collaboration. 2024.
  OneRec Team. OneRec Technical Report. 2025.
</slide-ref>


Note: 
参数还没有细调.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Semantic Features + Collaborative Signals❓


- 微调 Encoder:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250624153117.png" size="100%"></slide-img>


<slide-ref>
  Luo X., et al. OneRec Team. OneRec Technical Report. 2024.
  OneRec Team. OneRec Technical Report. 2025.
</slide-ref>


Note: 
1. 通过 miniCPM-V-8B 将多模态信息整合为 $\mathbf{M} \in \mathbb{R}^{N_M \times d_t}$ 大小的 token vectors (per item).
2. 通过 QFormer 进一步融合得到 $\mathbf{\tilde{M}} \in \mathbb{R}^{N_{\tilde{M}} \times d_t}$, 通常 $N_{\tilde{M}} = 4$ (而 $N_M = 1280$).
3. 通过 item-item 间的**相似度**构建高质量的 item-pair dataset $\mathcal{D}_{pair}$, 然后通过 item-item 间的对比学习来促使 item features 融合进这部分信息.
4. 此外, 额外引入 Caption loss, 即通过 LLaMA3 来预测 Caption, 保证 features 不会丢失内容信息.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 总结

- Vector Quantization: 一种优雅的 Tokenizer

- **优势:**
    - (Encoder-Decoder) 统一的离散表示
    - (Rec) 具有一定的可解释性
    - (Rec) 似乎能激发推荐场景的 Scaling 能力

- **不足:**
    - (Encoder-Decoder) Undesirable gradient estimator
    - (Encoder-Decoder) Codebook collapse
    - (Rec) 似乎不太擅长冷启场景 (如何修正 Beam search)
    - (Rec) RQ-VAE 似乎没有必要

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Decoder-Encoder-XXX Vector Quantization

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250709165402.png" size="100%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Decoder-Encoder-XXX Vector Quantization

- 实验结果:

||HR@1|HR@5|HR@10|NDCG@5|NDCG@10|
|:-:|:-:|:-:|:-:|:-:|:-:|
|Random|0.0025|0.0080|0.0114|0.0052|0.0063|
|KMeans|0.0038|**0.0154**|**0.0246**|**0.0096**|**0.0126**|
|Rotation|**0.0041**|0.0122|0.0195|0.0083|0.0106|
|DEX-VQ|0.0033|0.0126|0.0216|0.0079|0.0107|


</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40%;
  font-size: 10rem;
">
  Thanks!
</div>

</slide-section>

