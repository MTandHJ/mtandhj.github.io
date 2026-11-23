---
date: "2026-09-17"
draft: false
title: "SDQ"
author: MTandHJ
tags:
  - Slide
  - Vector Quantization
  - Recommendation
  - Graph Diffusion
  - Generative
---

<!-- --------------------------------------------------------- -->

<slide-section>
## Structure Diffusion Quantization
</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background: Sequential Recommendation

- **Sequential recommendation** (predicting the next item of interest from a user's interaction history $[v_1, v_2, \ldots, v_L]$):

    $$
    \text{recommendation list} \leftarrow \underset{{v \in \mathcal{V}}}{\text{Top-K}} \quad \mathbb{P}(v| v_1, v_2, \ldots, v_L)
    $$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260917112701.png" size="90%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background: From ID-based to Token-based

- **ID-based sequential recommendation** (e.g., SASRec):
    1. Item ID -> embeddings:

        $$
        [v_1, v_2, \ldots, v_L] \rightarrow [\bm{e}_1, \bm{e}_2, \ldots, \bm{e}_L];
        $$

    2. Use an encoder/decoder to obtain the user representation $\bm{h}$;
    3. Compute similarity scores and rank items: $\bm{h}^{\top} \bm{e}_v, \: v \in \mathcal{V}$.

- **Limitations:** ❌ cold-start items? ❌ LLM-style paradigm?

- **How can LLMs identify items?** <span style="color:red">item_9527</span>? <span style="color:red">text title</span>?

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background: Generative Recommendation

- **Generative recommendation:** 
  1. **Tokenization (ID -> Semantic ID):** $v \xrightarrow{\text{tokenize}} (s_1^v, s_2^v, \ldots, s_K^v)$; 
  2. **Recommendation:** Predict the next item's SID

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261116184100.png" size="80%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background: RQ-KMeans/VAE

- **Residual Quantization ($\bm{r}_1 = \bm{x}_v$):**

  $$
  \bm{r}_{k+1} = \bm{r}_k - \Pi(\bm{r}_k; \mathbf{C}_k), \: \Pi(\bm{r}_k; \mathbf{C}_k) := \underset{\bm{c}_s \in \mathbf{C}_s}{\text{argmin}} \|\bm{r}_k - \bm{c}_s\|
  $$

- **Codebook:**
  - RQ-KMeans: Compute $\mathbf{C}_k$ offline using (balanced) KMeans;
  - RQ-VAE: Train an Encoder-RQ-Decoder architecture with a **reconstruction loss**.

<slide-ref>
$r_k$: residual vector; $\bm{c} \in \mathbf{C}$: a vector (codevector) in the codebook
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Why Residual Quantization?

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920175033.png" size="90%"></slide-img>

- **Natural language** has an inherent hierarchical structure that facilitates its decomposition into subword units.

- RQ is expected to generate SID sequences with a coarse-to-fine hierarchy, which aligns naturally with intuition in recommendation.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Are RQ-Based SIDs Necessarily Coarse-to-Fine?

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261116194234.png" size="80%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Structure Diffusion Quantization (SDQ)

<slide-highlight>
Dirichlet Energy & Graph Diffusion
</slide-highlight>

- 😀 **Hierarchy:**
  - A quantitative metric for measuring hierarchical structure.
  - A generalized residual quantization framework that ensures a coarse-to-fine hierarchy.

- 😀 **Stability:** Greater stability and reproducibility.




</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: Dirichlet Energy

- **Adjacency matrix:** $\mathbf{A} = [w_{ij}] \in \mathbb{R}^{|\mathcal{V}| \times |\mathcal{V}|}$
  - $w_{ij} \uparrow$ indicates a stronger relationship between $v_i$ and $v_j$

- **Laplacian matrix:**

  $$
  \tilde{\mathbf{L}} = \mathbf{I} - \tilde{\mathbf{A}}, \quad \tilde{\mathbf{A}} = \mathbf{D}^{-1/2} \mathbf{A} \mathbf{D}^{-1/2}
  $$

- **Dirichlet energy:** Given a feature matrix $\mathbf{X} \in \mathbb{R}^{|\mathcal{V}| \times d}$

  $$
  \mathcal{E}(\mathbf{X}) := \text{Tr}(\mathbf{X}^{\top} \tilde{\mathbf{L}} \mathbf{X}) 
  =\frac{1}{2} \sum_{i, j \in \mathcal{V}} w_{ij} \left\|
    \frac{\bm{x}_i}{\sqrt{d_i}} - \frac{\bm{x}_j}{\sqrt{d_j}}
  \right\|^2
  $$

<slide-ref>
Giovanni F. D., et al. Understanding Convolution on Graphs via Energies. TMLR, 2023.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: Dirichlet Energy

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261116201427.png" size="75%"></slide-img>

<slide-highlight>
Energy $\uparrow$ $\Rightarrow$ Fine-Grained Information
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: Quantization in Diffusion Space

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260918175529.png" size="75%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: Quantization in Diffusion Space

<slide-highlight>
🤔 Hierarchical Structure 
</slide-highlight>

- **Challenges:**

  1. **Vector space → Diffusion space:** How can we control energy across quantization stages?

  2. **Diffusion space → Vector space:** How can we remove the encoded information from the original space?

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: A Continuous Perspective

- **Graph Diffusion Equation:**

  $$
  \begin{align*}
  \textbf{Forward:} & \:
  \mathbf{X}(t_1) = \Phi_{t_0 \rightarrow t_1}(\mathbf{X}(t_0)) 
  := \mathbf{X}(t_0) - \int_{t_0}^{t_1} \tilde{\mathbf{L}}\mathbf{X}(\tau) \, \mathrm{d}\tau \\
  \textbf{Backward:} & \:
  \mathbf{X}(t_0) = \Phi_{t_1 \rightarrow t_0}(\mathbf{X}(t_1)) 
  := \mathbf{X}(t_1) + \int_{t_0}^{t_1} \tilde{\mathbf{L}}\mathbf{X}(\tau) \, \mathrm{d}\tau
  \end{align*}
  $$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260918181845.png" size="70%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: A Continuous Perspective

- Diffusion ($t_1 \uparrow$) -> Similar items have similar features to encode

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920100054.png" size="70%"></slide-img>

$$
\frac{d \mathcal{E}(\mathbf{X}(t))}{\mathrm{d}t} = -2 \text{Tr}\left(\mathbf{X}^{\top}(t) \tilde{\mathbf{L}}^2 \mathbf{X}(t)\right) = -2 \|\tilde{\mathbf{L}} \mathbf{X}(t)\|_F^2 \le 0
$$

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: A Continuous Perspective

$$
\mathbf{R}_{k+1}
=\mathbf{R}_k -
\Phi_{t_1 \rightarrow t_0}
\circ \Pi \circ
\Phi_{t_0 \rightarrow t_1}
\left(\mathbf{R}_k\right),
\quad
t_0 = 0,\: t_1 = K-k
$$

1. **Forward diffusion:** $k\uparrow$ -> $\mathcal{E}(\Phi_{t_0 \rightarrow t_1} (\mathbf{R}_k))\uparrow$ -> Coarse-to-fine
2. **Vector quantization:** Apply $\Pi(\cdot)$ in diffusion space
3. **Backward recovery:** Map the information encoded in Step 2 back to the original space and update the residual $\mathbf{R}_{k+1}$

- **RQ is a special case of SDQ:**

$$
\mathbf{R}_{k+1}
=\mathbf{R}_k -
\Pi (\mathbf{R}_k), \quad \text{if } \mathbf{A = I}
$$

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: Discrete Approximation

- **Standard numerical schemes:** Euler, RK4, DOPRI5

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920103828.png" size="70%"></slide-img>

- **DOPRI5** has the lowest approximation error but the <span style="color:red">highest latency</span>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ-KMeans & SDQ-VAE

- **SDQ-KMeans:** $\mathbf{X} \xrightarrow{\text{SDQ}} \text{SID}$
- **SDQ-VAE:** $\mathbf{H} \xrightarrow{\text{Encoder}} \mathbf{X} \xrightarrow{\text{SDQ}} \text{SID}/\mathbf{\hat{X}} \xrightarrow{\text{Decoder}} \mathbf{\hat{H}}$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920111736.png" size="80%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ-VAE

- **Training subgraph sampling**
- **Training objective:**

$$
\mathcal{L}_{\text{SDQ}} =
\|\hat{\mathbf{H}} - \mathbf{H} \|_F^2
+\sum_{k=1}^K \|\hat{\mathbf{X}}_k - \text{sg}(\mathbf{X}) \|_F^2
+\beta \sum_{k=1}^K \|\mathbf{X} - \text{sg}(\hat{\mathbf{X}}_k) \|_F^2
$$

<slide-cols>

<slide-col ratio="6">
<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920112824.png" size="80%"></slide-img>
</slide-col>

<slide-col ratio=4>

  <slide-highlight>
  SDQ makes codebook updates more consistent with collaborative structure!
  </slide-highlight>

</slide-col>

</slide-cols>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Overall Comparison

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920113648.png" size="90%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Energy Hierarchy

<slide-highlight>
Clearer Hierarchical Structure
</slide-highlight>

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920114024.png" size="70%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Training Efficiency

<slide-highlight>
✅ Stable ✅ Efficient
</slide-highlight>

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920114310.png" size="90%"></slide-img>

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