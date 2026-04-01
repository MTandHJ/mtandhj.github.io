---
date: "2025-05-18"
draft: false
title: "Connection Bottleneck in Attention"
author: MTandHJ
tags:
  - Slide
  - Attention
  - Positional Encoding
---

<slide-section>
## Connection Bottleneck in Attention
</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

##  Attention

$$
A_{ij} = \frac{\exp(S_{ij})}{\sum_j \exp(S_{ij})}, \quad
S_{ij} = \textcolor{blue}{\langle \bm{q}_i, \bm{k}_j \rangle} / \sqrt{d}, \\ 
\bm{q} = W_Q\bm{x}, \bm{k} = W_K\bm{x} \in \mathbb{R}^d,
\quad i, j = 0, 1, \ldots, L-1.
$$

- 特殊类型的 Attention 的 Graph 形态:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250518212008.png" size="50%"></slide-img>


Note:
Attention 实际上定义了序列中各个位置的 Connection 强度

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Over-Squashing in Graph Neural Networks


- 广泛的连接导致过于狭窄的信息传递:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250519150035.png" size="90%"></slide-img>

- 感受野随着层数增加**指数**增加 $\rightarrow$ 难以捕获 Long-range 的信息


<slide-ref>
  Alon U., et al. On the Bottleneck of Graph Neural Networks and Its Practical Implications. ICLR, 2021.
</slide-ref>

Note:
需要说明的是, 从这篇文章出发, Causal Attention 的 Bottleneck 并不严重

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Over-Squashing in Graph Neural Networks


- 实验(必须依赖 $\textcolor{blue}{k}$-阶邻居预测标签):

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250519151436.png"></slide-img>

- Attention (GAT) 以及门控 (GGNN) 有助于缓解 over-squashing

Note:
随着层数的增加, 由于 over-squashing 的存在, GNN 越来越难利用到 long-range 的'邻居'信息

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 'Over-Squashing' in Large Language Models

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250519155809.png" size="90%"></slide-img>


- **Over-Squashing:** Early tokens 有更多的影响
  - **Representational Collapse:** 随着序列长度增加, 表示趋近${}^{\tiny [1]}$
  - **Attention Sink:** LLMs 总是倾向于给予 <bos> token 很高的权重${}^{\tiny [2,3]}$

<slide-ref>
  [1] Barbero F., et al. Transformers need glasses! Information over-squashing in language tasks. NeurIPS, 2024.
  [2] Barbero F., et al. Why do LLMs attend to the first token? arXiv, 2025.
  [3] Wu X., et al. On the Emergence of Position Bias in Transformers. arXiv, 2025.
</slide-ref>


Note:
在 GNN 中, over-squashing 指的是膨胀的感受野导致每个邻居的贡献很有限;
而在 LLM 中, over-squashing 指的是 early tokens 会产生更多的影响.
虽然二者可能都会导致类似 representational collpase 的现象, 但是严格来说不能混为一谈.
实际上, LLM 中是否存在所谓的 over-squashing 问题也是个未知数, 因为 Causal Attention 实际上已经是 Graph 领域里一个推荐的方案了.

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## 'Over-Squashing' in Large Language Models


**Theorem B.3** (Representational Collapse)
Let $X = [\bm{x}_0, \ldots, \textcolor{blue}{\bm{x}_{n-1}}] \in \mathbb{R}^{n \times d}$ and $X^* = [\bm{x}_0, \ldots, \textcolor{blue}{\bm{x}_{n-1}, \bm{x}_{n-1}}] \in \mathbb{R}^{(n + 1) \times d}$ be two sequences for a final repeated token $\bm{x}_{n-1}$, with 
1. All token representations bounded <span style="color: gray"> ($S_{i, j}$ is bounded) </span>;
2. Positional encodings decay with distance to 0 <span style="color: gray"> ($S_{n-1, j} \approx S_{n, j}^*$ as $j \rightarrow 0$) </span>.

Then, for <u>large enough</u> $n \in \mathbb{N}_+$, we have that the representations are under any $\epsilon$:

$$
\|\bm{x}_{n-1}^{(L)} - {\bm{x}_{n}^{*}}^{(L)} \|_1 \le \epsilon.
$$


Note:
证明的关键是保证 Attention 能够尽可能一致, 因而加权和之后的向量表示也一致.
第一个条件主要是保证自己和自己的 score 算出来不会无限大, 否则就一定有区别, 另一个条件主要是保证 Attention 是渐进一致的.

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Copying

<slide-cols>

<!-- left -->
<slide-col ratio="1">

- **First-token** copying:
  - **Input:** '$\textcolor{red}{0}111\ldots 111$'; **Target:** '$0$'


</slide-col>

<!-- right -->
<slide-col ratio="1">

- **Last-token** copying:
  - **Input:** '$111\ldots 111\textcolor{red}{0}$'; **Target:** '$0$'


</slide-col>

</slide-cols>

- 逐步<u>增加 '1' </u> 以增加序列长度:
  - (B) <span style="color: gray"> Hint: It’s not necessarily a 1, check carefully </span>;
  - (C) <span style="color: gray"> '$0111 \ldots 11$' 替换为 '$0111 \ldots 11 \: 0111 \ldots 11 \: \ldots$ </span>

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250511142544.png" size="90%"></slide-img>

Note:
Copying 的例子有趣在于: First-token copying 比起 Last-token copying 反而更容易.
通过 'over-squashing' 解释就是, first-token copying 能够产生更多的影响.

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Counting

<slide-cols>

<!-- left -->
<slide-col ratio="1">

$\textcircled{\small 1}$  **求和:** $1 + \cdots + 1$;

$\textcircled{\small 2}$  **计数:** 统计一串均为 1 的序列中有多少个 1;


</slide-col>

<!-- right -->
<slide-col ratio="1">

$\textcircled{\small 3}$ **计数:** 统计一串 0/1 序列中有多少个 1 (1 出现的概率为 70%);

$\textcircled{\small 4}$ **单词计数:** 统计一串序列中某个词出现的次数.


</slide-col>

</slide-cols>

- 三种策略:
    1. 直接输出结果 (<span style="color: gray">No CoT</span>);
    2. 思维链 (<span style="color: gray">CoT Zero-Shot</span>);
    3. 例子 + 思维链 (<span style="color: gray">CoT Few-Shot</span>).


</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Counting

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250511143754.png" size="80%"></slide-img>

- 难度: $\textcircled{\small 3} < \textcircled{\small 1} \approx \textcircled{\small 4} < \textcircled{\small 2}$

- 策略: No CoT $\approx$ CoT Zero-Shot $>$ CoT Few-Shot

Note: 
这个例子主要是说明'间隔'符号对于 Counting 的帮助.

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Positional Encoding

$$
A_{ij} = \frac{\exp(S_{ij})}{\sum_j \exp(S_{ij})}, \quad
S_{ij} = \textcolor{blue}{\langle \bm{q}_i, \bm{k}_j \rangle} / \sqrt{d}.
$$

- RoPE (Rotary Positional Encoding)

$$
  \langle \bm{q}_i, \bm{k}_j \rangle = (R_{i, \theta} \bm{q}_i)^T (R_{j, \theta} \bm{k}_j) = \bm{q}_i^T R_{j-i} \bm{k}_j, \\
  {}\\
  \tiny
  R_{i, \theta} := \left [
  \begin{array}{ccccccc}
  \cos (i\theta_0) & -\sin (i \theta_0) & 0 & 0 & \cdots & 0 & 0 \\
  \sin (i \theta_0) & \cos (i \theta_0) & 0 & 0 & \cdots & 0 & 0 \\
  0 & 0 & \cos (i\theta_1) & -\sin (i \theta_1) & \cdots & 0 & 0 \\
  0 & 0 & \sin (i \theta_1) & \cos (i \theta_1) & \cdots & 0 & 0 \\
  \vdots & \vdots & \vdots & \vdots & \ddots & \vdots & \vdots \\
  0 & 0 &  0 & 0 & \cdots & \cos (i \theta_{d/2 - 1}) & -\sin (i \theta_{d / 2 - 1}) \\
  0 & 0 &  0 & 0 & \cdots & \sin (i \theta_{d/2 - 1}) & \cos (i \theta_{d / 2 - 1})  \\
  \end{array}
  \right ].
$$

- $\theta_i = b^{-2i / d}$ 表示基本的旋转单位, $b$<span style="color: gray">ase</span> 越大, 旋转的角度越小. 


Note: 
位置编码有可能可以缓解 Connection Bottleneck

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## Positional Encoding

<slide-img src="https://picx.zhimg.com/v2-595b69a2e3d6da57a7016f741d4bb8e1_r.webp?source=172ae18b&consumer=ZHI_MENG" size="70%"></slide-img>

- **位置编码**: 维度靠前 $\rightarrow$ 高频区域; 维度靠后 $\rightarrow$ 低频区域

<slide-ref>
  绝密伏击. 十分钟读懂旋转编码(RoPE). 知乎, 2023.
</slide-ref>

Note: 
注意, 这里的高低频针对的是位置编码而不是输入信号 (query or key)

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Positional Encoding

- RoPE 的距离衰减:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250512203336.png" size="80%"></slide-img>

- **Left:** RoPE 下的 Attention 的<span style="color: blue">某个上界</span>随着 $|j - i|$ 增加而衰减

- **Right:** 高斯噪声下, 真实的 Attention 并无衰减现象

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Positional Encoding

- 个人的测试:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250512210829.png" size="90%"></slide-img>

- 即使 relative distance 增加到 100,000 依然没有距离衰减的现象

Note: 
横坐标是相对距离

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## RoPE 的高频

- **猜想:** 过大的旋转角度会导致对应维度所得结果趋于噪声

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250512211237.png" size="65%"></slide-img>


<slide-cols>

<!-- left -->
<slide-col ratio="1">

$$
\underset{\text{Freq}\downarrow \quad \text{Norm} \uparrow}{\xrightarrow{\|\bm{q}_{0:1}\|, \|\bm{q}_{2:3}\|, \cdots, \|\bm{q}_{d-1:d}\|}}
$$

</slide-col>

<!-- right -->
<slide-col ratio="1">

- **Exception**: **First** and **Last** Layers

</slide-col>

</slide-cols>


<slide-ref>
  Barbero F., et al. Round and Round We Go! What makes Rotary Positional Encodings useful? ICLR, 2025.
</slide-ref>

Note: 
这是一个隐式的例子: 作者将维度两两分组, 假设模长越大越偏向于语义信息.
在绝大部分 layers 中高频部分仅被分配了较小的模长, 例外是初始的和最后的一些层.

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## RoPE 的高频

- **猜想:** 高频有利于特殊 Attention 形态的构建

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250512211548.png"></slide-img>

$\textcircled{\small 1}$ **Last Layers:** <span style="color: blue">Diagonal</span> attention $\textcircled{\small 2}$ **First Layers:** <span style="color: blue">Previous-token</span> attention



<slide-ref>
  Barbero F., et al. Why do LLMs attend to the first token? arXiv, 2025.
</slide-ref>


Note: 
最开始的层倾向于 previous-token attention, 而最后的几层则倾向于 diagonal attention.
Previous-token attention, 即 attention sink 现象在下面的文献有所讨论.

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## RoPE 的高频

<span style="font-size: 3rem;">❓</span> 不施加位置编码, 是否依然能形成特殊的 Attention 形态

- 结论:
  1. 在不施加任何位置编码的前提下: 对于重复的序列, 必<span style="color: red">不存在</span> 'Diagnoal' 或 'Previous-token' 类型 Attention
  2. 在施加 RoPE 前提下: 对于<span style="color: red">任意</span>序列, 模型总能通过学习<span style="color: blue">特定模长</span>来形成 'Diagnoal' 或 'Previous-token' 类型 Attention

- 总而言之, 位置编码赋予了模型关注<u>特定区域</u>的能力, 有可能缓解 connection bottleneck

</slide-section>

<!-- --------------------------------------------------------- -->

<slide-section>

## RoPE 的低频

<span style="font-size: 3rem;">❓</span> $\theta_i = b^{-2i / d} \xrightarrow{\textcolor{blue}{b \uparrow}} \text{long-context ability} \uparrow$

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250513174554.png" size="90%"></slide-img>

<span style="color: gray">1. Long-term decay of upper bound of attention score</span>

2. Long-term Decay of the Ability to Attend More to **Similar Tokens** than Random Tokens


<slide-ref>
  Men X., et al. Base of RoPE Bounds Context Length. NeurIPS, 2024.
</slide-ref>

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## RoPE 的低频


- $\bm{q}, \bm{k}$ 独立同分布, $\mathbb{E}[\bm{\epsilon}] = 0$.

- 希望 $\bm{q}, \bm{q} + \bm{\epsilon}$ 的 attention 严格大于 $\bm{q}, \bm{k}$ 的需要满足:

$$
\small
\begin{align*}
& \frac{1}{2\sigma^2} \bigg(
    \mathbb{E}_{\bm{q}, \bm{\epsilon}} \Big [ \textcolor{blue}{\bm{q}}^T R_{m, \theta} (\bm{q} + \textcolor{blue}{\bm{\epsilon}})\Big]
    -\mathbb{E}_{\bm{q}, \bm{k}} \Big [ \bm{q}^T R_{m, \theta} \textcolor{red}{\bm{k}}\Big]
\bigg) \\
=& \sum_{i=0}^{d / 2 - 1} \cos(m \theta_i) > 0, \quad \forall m = 0,1,2,\ldots, L-1.
\end{align*}
$$

- 理论上 base $b$ 的 lower bound:

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250513205428.png" size="100%"></slide-img>


</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Connection Bottleneck

<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250520165318.png" size="100%"></slide-img>


</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Counting (314 '1')


||Length| '1...' | '1,1...' | '1,1,1,1,1;1,...' |
|--|:--:|:--:|:--:|:--:|
|Mistral Medium| 32k| 500  | 500 | 500 |
|Deepseek-R1| 64K| 264 | $\textcircled{\small 1}$ | 299 |
|GPT-4o|128k| 300 | 300 | 340 |
|Llama3.3-70b| 130K | 'The string 1111...' | 150 | '...The string is 1,1,1,1,1;1,...' |
|o4-mini|200k| 232 | 270 | 319 |

<p style="font-size:1rem">$\textcircled{\small 1}$ Given that, and since the sequence is uniform, the count is the number of '1's, which is the total numbers in the sequence.  Given that, and since counting manually is not feasible, the answer is that all numbers are '1's, hence the count is equal to the number of numbers in the sequence. But since the exact count isn't provided, perhaps the answer is to recognize that every number is '1'.</p>

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## Counting


<slide-img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250521161421.png" size="70%"></slide-img>

**Case I:** "y,x,y,y,x,y,y,x,y,x,y,y,y,y,x,y,y,y,x"

**Case II:** "yxyyxyyxyxyyyyxyyyx" (ACC = 0.16%)

- '间隔符' 用处很大, base $b$ 似乎没有明显的规律.

</slide-section>


<!-- --------------------------------------------------------- -->

<slide-section>

## 💡 Connection Bottleneck

- 更好的位置编码? <span style="color: red">No!</span>

![20250521163302](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250521163302.png)

- 物理层面的 Attention?

<slide-ref>
  Ye T., et al. Differential Transformer. ICLR, 2025.
</slide-ref>

Note:
个人认为, 纯粹的位置编码是应付不了需要极端注意力的情况的. 我们需要物理层面的干预, 来帮助 LLM 减少无关信息.

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