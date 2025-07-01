---
date: "2025-06-12"
draft: false
title: "Restructuring Vector Quantization with The Rotation Trick"
description: "一种利用 Rotation Trick 来替代 STE 的方案"
author: MTandHJ
tags:
  - Note
  - Vector Quantization
  - Rotation
  - STE
  - Seminal
  - Empirical
  - ICLR
  - 2025
pinned: false
---


## 预备知识

- 需要对 [VQ-VAE](/posts/vq-vae) 有基本的了解.

## 核心思想


### STE for VQ

- 向量量化是把输入 $\bm{x}$ 映射到 Codebook $\mathcal{C} = \{\bm{c}_1, \bm{c}_2, \ldots, \bm{c}_{|\mathcal{C}|}\}$ 的过程:

    $$
    \bm{x} \in \mathbb{R}^p 
    \overset{\text{Encoder } \phi}{\longrightarrow} \bm{z} \in \mathbb{R}^d
    \overset{\text{VQ } \varphi}{\longrightarrow} \bm{q} = \varphi(\bm{z}) \in \mathcal{C}.
    $$

- 然后 VQ-VAE 中训练 Encoder 以及 Codebook $\mathcal{C}$ 主要是通过重构, 即依赖一个 Decoder $\Phi$:

    $$
    \varphi(\bm{z})
    \overset{\text{Decoder } \Phi}{\longrightarrow} \hat{\bm{x}} = \Phi(\bm{q}),
    $$

    然后通过重构损失去训练:

    $$
    \mathcal{L}_{rec} = \|\hat{\bm{x}} - \bm{x}\|_2^2.
    $$

- 这在 $\varphi$ 是可微函数的时候容易做到, 然后一般情况下, Vector Quantization 的过程是不可微的:

    $$
    \bm{q} = \varphi(\bm{z}) = \text{argmin}_{\bm{c} \in \mathcal{C}}
    \|\bm{c} - \bm{z} \|.
    $$

    显然 $\text{argmin}$ 的操作是不可导的.

- 所以, 为了能够正确回传梯度, 通过采用 straight-through estimator (STE):

    $$
    \bm{q} \leftarrow \bm{z} + \text{sg}[\bm{q} - \bm{z}],
    $$

    这里 $\text{sg}$ 表示阻断梯度的操作, 此时

    $$
    \mathrm{d}\bm{q} = \mathrm{d}\bm{z} + \bm{0}.
    $$

- 除此之外, VQ-VAE 还引入了 commit loss 来促进 $\bm{z}$ 和 $\bm{q}$ 的匹配, 这部分设计和本文的中心思想并无太大关系, 故不再赘诉.


### STE 的问题

![20250612104419](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612104419.png)


- STE 的问题其实非常明显: 对于分配给相同 $\bm{c} \in \mathcal{C}$ 的任意隐向量 $\bm{z}$, 它们都会收到相同的梯度, 即

    $$
    \nabla_{\bm{z}} \mathcal{L}
    = \nabla_{\bm{q}} \mathcal{L},
    \quad \forall \varphi(\bm{z}) = \bm{q}.
    $$

- 如上图所示, 第一列是正常是函数值映射; 第二列是正常的梯度; 第三列则是由 STE 估计出来的梯度. STE 会呈现出明显的区块现象, 对于梯度方向以及大小的感知因而明显变差.


### Rotation Trick


![20250612151216](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612151216.png)

- 不同于 STE 直接 copy $\bm{q}$ 上的梯度, 本文所提出的 Rotation trick 希望:

    $$
    \angle (\bm{z}, \nabla_{\bm{z}} \mathcal{L})
    =\angle (\bm{q}, \nabla_{\bm{q}} \mathcal{L}).
    $$

- 只需要通过如下的技巧即可满足:

    $$
    \tag{1}
    \bm{q} \leftarrow \text{sg} \bigg[\frac{\|\bm{q}\|}{\|\bm{z}\|} R \bigg] \bm{z},
    $$

    这里 $R \in \mathbb{R}^{d \times d}$ 是一个旋转矩阵, 它将 $\bm{z}$ 旋转至原本的 $\bm{q}$ 的方向.

- 此时, 对于梯度, 我们有:

    $$
    \nabla_{\bm{z}} \mathcal{L} = \frac{\|\bm{q}\|}{\|\bm{z}\|} R^T \nabla_{\bm{q}} \mathcal{L}.
    $$

    即 $\nabla_{\bm{z}} \mathcal{L}$ 是在 $\nabla_{\bm{q}} \mathcal{L}$ 逆向旋转 $\angle (\bm{z}, \bm{q})$ 角度得到的 (旋转矩阵满足 $R^T R = I$). 如上右图所示, 很容易想象 $\theta_z = \theta_q$. 稍稍严格一点, 我们有:

    $$
    \tag{2}
    \langle \bm{z}, \nabla_{\bm{z}} \mathcal{L} \rangle
    =\langle \bm{z}, \frac{\|\bm{q}\|}{\|\bm{z}\|} R^T \nabla_{\bm{q}} \mathcal{L} \rangle
    =\langle \frac{\|\bm{q}\|}{\|\bm{z}\|} R \bm{z}, \nabla_{\bm{q}} \mathcal{L} \rangle
    =\langle \bm{q}, \nabla_{\bm{q}} \mathcal{L} \rangle.
    $$


#### 旋转矩阵 $R$ 的构造

- 在二维平面上, 构造 $R$ 似乎是容易的, 在高维空间, 需要利用到 [Householder transformation](https://en.wikipedia.org/wiki/Householder_transformation): 给定一个向量 $\bm{v}$, 它对应的与 $\bm{v}$ 正交平面 (过原点) 记为 $\bm{v}^{\perp}$. 对于任意的向量 $\bm{u}$, 它关于 $\bm{v}^{\perp}$ 的**反射**为:

    $$
    \underbrace{(I - 2\frac{\bm{v}\bm{v}^T}{\|\bm{v}\|^2})}_{:= P} \bm{u},
    $$

    其中 $P$ 为 Householder matrix.

- 注意, 假设 $\bm{u} = \bm{u}_1 + \bm{u}_2$, 其中 $\bm{u}_1 \in \bm{v}^{\perp}, \bm{u}_2 \perp \bm{v}^{\perp}$, 即为一个正交分解. 则它关于 $\bm{v}^{\perp}$ 的反射定义为:

    $$
    \bm{u}' = \bm{u}_1 - \bm{u}_2.
    $$

    此时, 我们容易证明:

    $$
    \begin{array}{ll}
    &(I - 2 \frac{\bm{v}\bm{v}^T}{\|\bm{v}\|^2}) \bm{u}
    =(I - 2 \frac{\bm{v}\bm{v}^T}{\|\bm{v}\|^2}) (\bm{u}_1 + \bm{u}_2) \\
    =&(\bm{u}_1 + \bm{u}_2) - 2 \frac{\bm{v}^T \bm{u}_2}{\|v\|} \frac{\bm{v}}{\|v\|}
    =\bm{u}_1 + \bm{u}_2 - 2 \|\bm{u}_2\| \frac{\bm{v}}{\|v\|} \\
    =&\bm{u}_1 + \bm{u}_2 - 2 \bm{u}_2
    = \bm{u}_1 - \bm{u}_2.
    \end{array}
    $$

- 两个向量 $\bm{a} \rightarrow \bm{b}$ 的旋转匹配可以通过两次反射得到:

![20250612173750](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612173750.png)

- 如上图所示:
    1. 定义 $\bm{c} = \frac{1}{2} (\frac{\bm{a}}{\|\bm{a}\|} + \frac{\bm{b}}{\|b\|})$;
    2. 将 $\bm{a}$ 根据 $\bm{c}$ 进行反射变换:

        $$
        \bm{a}' = \Big(I - 2\frac{\bm{c}\bm{c}^T}{\|\bm{c}\|^2} \Big) \bm{a}.
        $$

        不难发现, 此时 $\bm{a}'$ 和 $\bm{b}$ 已经关于 $\bm{b}^{\perp}$ 对称 (忽略长度的不一致) 了;
    3. 将 $\bm{a}'$ 根据 $\bm{b}$ 进行反射变换:
        $$
        \bm{a}'' = \Big(I - 2\frac{\bm{b}\bm{b}^T}{\|\bm{b}\|^2} \Big) \bm{a}'.
        $$

- 总结就是, 将 $\bm{z}$ 旋转至 $\bm{q}$ 方向上只需要通过旋转矩阵

    $$
    \tag{3}
    R := \Big(I - 2 \frac{\bm{q}\bm{q}^T}{\|\bm{q}\|^2}\Big)
    \Big(I - 2 \frac{\bm{r}\bm{r}^T}{\|\bm{r}\|^2}\Big), \quad \bm{r} := \frac{\bm{q}}{\|\bm{q}\|} + \frac{\bm{z}}{\|\bm{z}\|}.
    $$

### Reflection Trick


![20250612173718](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612173718.png)

- 如上图所示, 想要满足 $\angle (\bm{z}, \nabla_{\bm{z}} \mathcal{L}) = \angle( \bm{q}, \nabla_{\bm{q}} \mathcal{L})$, 旋转矩阵并非唯一的路径, 实际上细心的读者容易发现, 我们压根不需要进行两次 reflection. 只需要以 $\bm{c}$ (所代表的) 对称轴进行反射就可以直接实现 $\bm{a}, \bm{b}$ 的对齐. 这个对称轴实际上是

    $$
    \bm{c}' = \frac{\bm{a}}{\|\bm{a}\|} - \frac{\bm{b}}{\|\bm{b}\|}
    $$

    所对应的平面 ${\bm{c}'}^{\perp}$. 因此, $\bm{z} \rightarrow \bm{p}$ 只需要:

    $$
    \tag{4}
    R = \Big(I - 2 \frac{\bm{r} \bm{r}^T}{\|\bm{r}\|^2}\Big), \quad \bm{r} := \frac{\bm{z}}{\|\bm{z}\|} - \frac{\bm{q}}{\|\bm{q}\|}.
    $$

### STE vs. Rotation vs. Reflection

![20250612175428](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612175428.png)


- 如上图所示:
    1. STE 就只是无脑的 copy;
    2. Rotation 给人的感觉是 $\bm{z}$ (就是图中的 $\bm{e}$) 的更新"旋转"方向和 $\bm{q}$ 一致;
    3. Reflection 的特点方向和梯度方向更新有关. 当 $\nabla_q \mathcal{L}$ 方向是使得 $\bm{q}$ 远离 (靠近) $\bm{z}$ 的时候, 由 reflection 所得到的 $\nabla_{\bm{z}} \mathcal{L}$ 的方向也是促使 $\bm{z}$ 远离 (靠近) $\bm{q}$ 的.

- 作者只是在附录中文字说了 Reflection 会导致更差的结果, 但是并没有给出具体的结果.


### Scaling Term $\|\bm{q}\| / \|\bm{z}\|$

- 实际上如下的变换都能满足我们想要的夹角一致性:

    $$
    \bm{q} \leftarrow \text{sg}[\gamma R] \bm{z} + \text{sg}[\bm{q} - \gamma R \bm{z}].
    $$

    所得梯度关系为:

    $$
    \nabla_{\bm{z}} \mathcal{L} = \gamma R^T \nabla_{\bm{q}} \mathcal{L}.
    $$

    所以为什么需要恰好令 $r=\|\bm{q}\| / \|\bm{z}\|$. 作者讨论了一些极端情况, 认为这种 scaling 更具鲁棒性. 我个人感觉主要性质 (2), 它保证了内积的一致性, 那么沿着此方向更新, 产生的效果是一致的.



## 参考文献

<ol class="reference">
  <li>
    <u>Restructuring Vector Quantization with The Rotation Trick.</u>
    <i>ICLR</i>, 2025.
    <a href="https://arxiv.org/abs/2410.06424" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/cfifty/rotation_trick" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

