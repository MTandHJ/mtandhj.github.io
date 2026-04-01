---
date: "2025-06-19"
draft: false
title: "SEvo"
author: MTandHJ
tags:
  - Slide
  - Graph
  - Optimizer
  - Recommendation
---

<slide-section>
## Graph-enhanced Optimizers for Structure-aware Recommendation Embedding Evolution
</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background

$\textcircled{\small 1}$ Embedding $\xrightarrow{\text{实体 (User, Item) 的向量表示}}$ 现代推荐系统的基础


<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619102807.png" size="55%"></slide-img>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Background

$\textcircled{\small 2}$ 多元信息 $\xrightarrow{\text{交互信息, 类别相似性}}$ 潜在的结构性约束


<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619110409.png" size="90%"></slide-img>

❓Embedding 学习如何高效融入这些结构性先验

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Background

$\textcircled{\small 3}$ 图结构先验 $\underset{\text{超大规模 Embedding table}}{\xrightarrow{\text{训练随机性: 数据采样, dropout}}}$ 😞低效的信息融合

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619112212.png" size="80%"></slide-img>

$\mathbf{E}$: <span style="color:gray">Embedding</span>
&nbsp; &nbsp; &nbsp;
$\mathcal{L}$: <span style="color:gray">Loss</span>
&nbsp; &nbsp; &nbsp;
$\nabla_{\mathbf{E}} \mathcal{L}$: <span style="color:gray">Gradient</span>

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Background

$\textcircled{\small 4}$ 图+序列模型: 过于依赖**特定场景**, 高昂的**训练/推理代价**

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250711202256.png" size="75%"></slide-img>

<u>LightGCN:</u> <span style="color:gray">GNN-only</span>
&nbsp; &nbsp; &nbsp;
<u>SASRec:</u> <span style="color:gray">Transformer-only</span>

<u>SR-GNN/LESSR/MAERec:</u> <span style="color:gray">GNN-based sequence models</span>

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Weighted Adjacency Matrix $\mathbf{A}$

🤔 如何形式化定义图结构先验?

$$
\mathcal{G} = (\mathcal{V}, \mathbf{A} = [w_{ij}]), \quad w_{ij} \textcolor{green}{\uparrow} \longrightarrow \text{两个节点越相似} \textcolor{green}{\uparrow}.
$$


🤔 如何刻画 $\mathbf{X} \in \mathbb{R}^{|\mathcal{V}| \times d}$ 与邻接矩阵 $\mathbf{A} \in \mathbb{R}^{n \times n}$ 所刻画节点相似度的一致性?

$$
\mathcal{J}_{smoothness} (\mathbf{X}; \mathcal{G}) := \sum_{i, j \in \mathcal{V}} w_{ij} 
\left \| 
\frac{\mathbf{x}_i}{d_i} - \frac{\mathbf{x}_j}{d_j}
\right \|.
$$

💡 $\mathcal{J}_{smoothness}\downarrow$ $\longrightarrow$ 越相似的两个节点的表示越接近

<slide-ref>
  Zhou D., et al. Learning With Local and Global Consistency. NeurIPS, 2003.
  Chen S., et al. Signal denoising on graphs via graph filtering. GlobalSIP, 2014.
</slide-ref>

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Structure-aware Embedding Evolution

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619151431.png" size="80%"></slide-img>

$$
\Delta \mathbf{E}_{t-1} \xrightarrow{\textcolor{blue}{\psi}(\cdot)} \psi(\mathbf{E}_{t-1}).
$$


$\textcircled{\small 1}$ <span style="color: blue">**Structure-aware:**</span>
$\small \mathcal{J}_{smoothness} \left (\textcolor{blue}{\psi} (\Delta \mathbf{E}) \right) \le \mathcal{J}_{smoothness} \left (\Delta \mathbf{E} \right)$


$\textcircled{\small 2}$ <span style="color: blue">**Direction-aware:**</span> 
$\small \left\langle \textcolor{blue}{\psi} (\Delta \mathbf{E}), \Delta \mathbf{E} \right\rangle > 0, \quad \forall \Delta \mathbf{E} \not= \bm{0}$

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Smoothness vs. Convergence

- 理想的 $\psi$ 应当是平滑性和收敛性的平衡:

$$
\psi^* \left(
  \Delta \mathbf{E}; \beta
\right)
  = \underset{\Delta}{\text{argmin}} \: (1 - \beta) \| \Delta - \Delta \mathbf{E}\| + \beta \mathcal{J}_{smoothness}(\Delta).  
$$

- 直觉上,

$$
\text{Smoothness} \xleftarrow{\beta \rightarrow 1} \psi^*(\Delta \mathbf{E})
\xrightarrow{\beta \rightarrow 0} \text{Convergence}
$$

- 闭式解: $\psi^*(\Delta \mathbf{E}; \beta) = (1 - \beta) \left(\mathbf{I} - \beta \mathbf{\tilde{A}}\right)^{-1} \Delta \mathbf{E}$
  - 😞矩阵逆难以精确求解


</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## 近似解


$\textcircled{\small 1}$ **$L$-layer iterative approximation:**

$$
\hat{\psi}_{iter} (\Delta \mathbf{E}) := \hat{\psi}_L (\Delta \mathbf{E}), \:
\hat{\psi}_l (\Delta \mathbf{E}) = \beta \mathbf{\tilde{A}} \hat{\psi}_{l-1} (\Delta \mathbf{E}) + (1 - \beta) \Delta \mathbf{E}.
$$

$\textcircled{\small 2}$ **$L$-layer Neumann series approximation:**

$$
\hat{\psi}_{nsa} (\Delta \mathbf{E}) := (1 - \beta) \sum_{l=1}^L \beta^l \mathbf{\tilde{A}}^l \Delta \mathbf{E}.
$$

<slide-ref>
  Klicpera J., et al. Predict Then Propagate: Graph Neural Networks Meet Personalized Pagerank. ICLR, 2019.
  Huang Q., et al. Combining Label Propagation and Simple Models Out-performs Graph Neural Networks. ICLR, 2021.
</slide-ref>

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 近似解的缺陷

$\textcircled{\small 1}$ $\psi_{iter}$ 的受限平滑性:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619161557.png" size="80%"></slide-img>


$\textcircled{\small 2}$ $\psi_{nsa}$ 的次优收敛性:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619161810.png" size="80%"></slide-img>

😄 **SEvo:**

$$
\hat{\psi} (\Delta \mathbf{E}; \beta) = \frac{1 - \beta}{\textcolor{orange}{1 - \beta^{L+1}}} \sum_{l=0}^L \beta^l \mathbf{\tilde{A}}\Delta \mathbf{E}.
$$

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## SGD + SEvo

- SEvo 可以直接应用在其它优化器所衍生的更新量

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619163020.png" size="90%"></slide-img>


</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Adam + SEvo


<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619163150.png" size="90%"></slide-img>


</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## AdamW + SEvo

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619163339.png" size="85%"></slide-img>


</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Overall Comparisons

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619164021.png" size="85%"></slide-img>

✅ **Accuracy:** 平均 10+\% 的提升

✅ **Efficiency:** 略微训练消耗 & **零**推理成本增加

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Empirical Analysis

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619164506.png" size="85%"></slide-img>

✅ **收敛性:** $\textcolor{orange}{1 / (1 - \beta^{L+1})}$ 加快收敛 &nbsp; &nbsp; ✅ **平滑性:** $\beta \rightarrow 1$ 愈加平滑

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Ablation Study

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619164907.png" size="90%"></slide-img>

✅ **泛化性:** 适用于 SGD/Adam/AdamW

✅ **Theorem 1:** 简单的迭代近似仅在较小的 $\beta$ 可行

✅ **AdamW correction:** 稀疏梯度矫正的必要性

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 类别一致先验

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619165639.png" size="90%"></slide-img>

✅ **类别一致性:** 类别一致的表示更加接近

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## 教师模型先验

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250619165855.png" size="100%"></slide-img>

✅ **知识迁移性:** SEvo 本身就有较强的知识蒸馏能力

✅ **泛化性:** SEvo 可以和其它知识蒸馏方法结合


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

