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

## Sequential Recommendation

- **序列推荐** (根据某个用户的交互历史 $[v_1, v_2, \ldots, v_L]$ 进行预测下一个可能感兴趣的商品):

    $$
    \text{推荐(召回)列表} \leftarrow \underset{{v \in \mathcal{V}}}{\text{Top-K}} \quad \mathbb{P}(v| v_1, v_2, \ldots, v_L)
    $$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260917112701.png" size="90%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Sequential Recommendation

- 序列推荐标准流程 (代表作: GRU4Rec -> SASRec -> HSTU):
    1. 用户 ID 序列通过 embedding layer 转换为向量:

        $$
        [v_1, v_2, \ldots, v_L] \rightarrow [\bm{e}_1, \bm{e}_2, \ldots, \bm{e}_L];
        $$

    2. Encoder/Decoder 得到 user 表征 $\bm{h}$;
    3. 计算相似度并排序 $\bm{h}^{\top} \bm{e}_v, \: v \in \mathcal{V}$.

- **缺陷:** ❌ 如何处理新的商品? ❌ 如何适配 LLM (范式)?

- **LLM (范式) 如何理解商品?** <span style="color:red">item_9527</span>? <span style="color:red">文字描述</span>?

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Generative Recommendation

- 生成式推荐: 1. $v \xrightarrow{\text{tokenize}} (s_1^v, s_2^v, \ldots, s_K^v)$; 2. Recommendation

<!-- $$
\mathbb{P}(v|v_1, v_2, \ldots, v_L) = \prod_{k=1}^K \mathbb{P}(s_k^v| s_1^{v_1}, s_2^{v_1}, \ldots, s_K^{v_L}, s_1^{v}, s_2^v, \ldots, s_{k-1}^v)
$$ -->

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261115154110.png" size="80%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Tokenization: Vector Quantization

<slide-highlight>
如何形成 Semantic ID?
</slide-highlight>

- **标准流程:** 文本描述 $\xrightarrow{\text{encode}}$ embedding $\xrightarrow{\text{vector quantization}}$ SID

- **Residual Quantization ($\bm{r}_1 = \bm{x}_v$):**

  $$
  \bm{r}_{k+1} = \bm{r}_k - \Pi(\bm{r}_k; \mathbf{C}_k), \: \Pi(\bm{r}_k; \mathbf{C}_k) := \underset{\bm{c}_s \in \mathbf{C}_s}{\text{argmin}} \|\bm{r}_k - \bm{c}_s\|
  $$

- **码本 Codebook:**
  - RQ-KMeans: 通过 (balanced) KMeans 一次计算得到 $\mathbf{C}_k$;
  - RQ-VAE: 通过 Encoder-RQ-Decoder 的方式利用**重构损失**训练.

<slide-ref>
$r_k$: 残差向量; $\bm{c} \in \mathbf{C}$: 码本 (Codebook) 中的某个向量 (codevector)
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Tokenization: Vector Quantization

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261115202033.png" size="80%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Tokenization

- 如何表示一个"词": [a-z] 为基础单元, 每个 token 难以学到真正含义

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920175033.png" size="90%"></slide-img>

<slide-highlight>
🤔 SID 的层次性?
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Structure Diffusion Quantization: 层次性和稳定性

- **Motivation:** 
  - RQ 缺少层次性保证, 仅贪心地编码残差信息
  - RQ-VAE 训练不稳定
  - 如何引入一些结构先验 (协同信息)

<slide-highlight>
😀 SID: 由粗到细地编码信息
</slide-highlight>

<slide-highlight>
如何形式化定义层次性?
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: Dirichlet energy

- **Adjacency matrix:** $\mathbf{A} = [w_{ij}] \in \mathbb{R}^{|\mathcal{V}| \times |\mathcal{V}|}$
  - $w_{ij} \uparrow$ 表示 $v_i, v_j$ 更为紧密的关系

- **Laplacian matrix:**

  $$
  \tilde{\mathbf{L}} = \mathbf{I} - \tilde{\mathbf{A}}, \quad \tilde{\mathbf{A}} = \mathbf{D}^{-1/2} \mathbf{A} \mathbf{D}^{-1/2}
  $$

- **Dirichlet energy:** 给定特征矩阵 $\mathbf{X} \in \mathbb{R}^{|\mathcal{V}| \times d}$

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

## SDQ: Dirichlet energy

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260918122123.png" size="75%"></slide-img>

<slide-highlight>
能量 $\uparrow$ $\Rightarrow$ 特征平滑性 $\downarrow$ $\Rightarrow$ 细粒度信息
</slide-highlight>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: 在扩散空间中量化

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260918175529.png" size="75%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: 在扩散空间中量化

<slide-highlight>
✅ 层次性 ✅ 隐式注入图先验 ❓ 稳定性
</slide-highlight>

- **面临的挑战:**

  1. **向量空间 -> 扩散空间:** 如何为不同量化阶段分配不同 (有渐进性) 的能量?

  2. **扩散空间 -> 向量空间:** 如何在向量空间中正确剔除扩散空间中所编码的信息?

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: 连续视角

- **图扩散方程 (Graph Diffusion Equation):**

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

## SDQ: 连续视角

- 扩散 ($t_1 \uparrow$) -> 图特征趋于平滑 -> 相似 items 具有相近待编码特征

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920100054.png" size="70%"></slide-img>

$$
\frac{d \mathcal{E}(\mathbf{X}(t))}{\mathrm{d}t} = -2 \text{Tr}\left(\mathbf{X}^{\top}(t) \tilde{\mathbf{L}}^2 \mathbf{X}(t)\right) = -2 \|\tilde{\mathbf{L}} \mathbf{X}(t)\|_F^2 \le 0
$$

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: 连续视角

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

1. **前向扩散:** $k$ 越小 -> $\Phi_{t_0 \rightarrow t_1} (\mathbf{R}_k)$ 的能量越低 -> 由粗到细
2. **向量量化:** $\Pi(\cdot)$ 在扩散空间中实施
3. **反向恢复:** 恢复出 Step 2 中已编码的信息, 并更新残差 $\mathbf{R}_{k+1}$

- **RQ 是 SDQ 的特例:** 若无结构先验, $\mathbf{A} = \mathbf{I}$, $\Phi(\cdot)$ 退化为恒等映射:

$$
\mathbf{R}_{k+1}
=\mathbf{R}_k -
\Pi (\mathbf{R}_k)
$$

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SDQ: 离散近似

- **常规离散格式:** Euler、RK4、DOPRI5

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920103828.png" size="70%"></slide-img>

- **DOPRI5** 近似误差最小但时延最大

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

- **训练子图采样:** 采用交互序列 -> 依据交互序列采样子图
- **训练目标:**

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
  SDQ 令 Codebook 更新更加协同一致!
  </slide-highlight>

</slide-col>

</slide-cols>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 综合比较

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920113648.png" size="90%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 能量层次性

<slide-highlight>
SDQ 更具层次性
</slide-highlight>

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260920114024.png" size="70%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 训练高效

<slide-highlight>
✅稳定 ✅高效
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