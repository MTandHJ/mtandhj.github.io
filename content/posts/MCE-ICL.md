---
date: "2025-08-13"
draft: false
title: "Markov Chain Estimation with In-Context Learning"
description: "探究利用 Transformer 估计马氏链的可泛化能力"
author: MTandHJ
tags:
  - Note
  - Markov Chain
  - In-Context Learning
  - Empirical
  - 2025
pinned: false
---

## 预备知识

- (**Markov Chain**) 对于序列 $\mathcal{X} = [x_1, x_2, \ldots, x_T] \subset \mathcal{S} = \{s_k\}_{k=1}^K$, 我们称其为马尔可夫链, 若:

    $$
    \mathbb{P}(x_{t+1}|x_1, \ldots, x_t) = \mathbb{P}(x_{t+1}|x_t), \forall t.
    $$

    即下一状态的发生仅和当前状态有关.

- (**转移概率矩阵**) 马氏链可以通过状态空间 $\mathcal{S}$ 及其之上的定义的转移概率矩阵决定:

    $$
    P = [P_{ij} = \mathbb{P}(s_j| s_i)]_{i=1, j=1}^{i=K, j=K}.
    $$

- (**In-Context Learning**) Transformer 已经被证明其无与伦比的序列建模能力. 此外, 它的 In-Context Learning 能力也令人印象深刻, 即我们可以加入一些 Context (一些例子) 来暗示 Transformer 应该以什么方式做什么任务.

## 核心思想

- 本文想要进一步观察 Transformer 在这方面的能力. 以马氏链为例, 假设 Transformer 已经在一些马氏链上通过 Next-Token Loss 进行了训练, 那么是否 Transformer 可能预测那些不曾见过的马氏链的转移概率呢? 这相当于 Transformer 在推理过程中, 就完成了一个马氏链的在线估计任务.

- (**训练数据**) 我们有 $N$ 类马氏链采样自:

    $$
    P_i \sim \text{Dir}(\alpha),
    $$

    这里 $\text{Dir}(\cdot)$ 表示 Dirichlet 分布. 然后训练集定义为:

    $$
    \mathcal{A}_N = \{\mathcal{X} \sim P_{i \text{ mod } N}\}_{1 \le i \le n}.
    $$

- **(评估)**:
    1. **Loss:** 用交叉熵损失评估:

        $$
        \tag{1}
        L(\theta) = \frac{1}{T} \sum_{i=1}^T l (f_{\theta}(\{x_1, \ldots, x_i\}), x_{i+1}).
        $$
    
    2. **Oracle:** 直接用真实的 $P$ 计算:

        $$
        \tag{2}
        L(\theta) = \frac{1}{T} \sum_{i=1}^T l (P_{ij}, x_{i+1}).
        $$
  
    
    2. **Estimated:** 通过 $\{x_1, \ldots, x_T\}$ 可以直接估计转移概率:

        $$
        \hat{P}_{ij}
        = \frac{c_{ij} + \alpha}{N_i + K \alpha}.
        $$

        这里 $c_{ij}$ 是 $s_i \rightarrow s_j$ 的出现次数, 而 $N_i$ 是 $s_i$ 的出现次数. 由此, 我们可以得到就估计的交叉熵 loss:

        $$
        \tag{3}
        L(\theta) = \frac{1}{M} \sum_{i=T - M}^M l (\hat{P}_{ij}, x_{i+1}).
        $$

- 比较 (1) (2) (3) 的差别, 可以判断 Transformer 在转移概率的估计上是否准确.


- (**Embedding**) 我们当然可以像一般的 Transformer 那样采取 learnable 的 Embeddings, 但是这种方式就不能推广到更多的状态情况了. 因此, 本文研究了一种动态的 Embedding 策略:

    $$
    X_i = E_{x_i}', \\
    E' = \text{QR}(E), \\ 
    E \in \mathbb{R}^{K \times d} \sim \mathcal{N}(0, I).
    $$

    即从正态分布中随机采样, 然后正交化得到对应的 Embedding. 如此依赖可以很方便地进行推广.


### 实验结果

![20250813151043](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250813151043.png)

- 上图展示了随着马氏链的数量 $N$ 和 Embedding Size $d$ 的增加, 结果的变化情况. Top Panel 的颜色深浅表示的是 (1) - (2) 的大小, 颜色越深表示差异越小, 即对于转移概率估计的越准确. 结论显然是, 想要有足够的泛化能力, 需要充分的数据和表达能力.

![20250813151810](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250813151810.png)

- 此外, 我们可以观察随着状态数目 $k$ 增加或者减少, 结果的变化情况. 可以发现, learnable embeddings, 一方面不能推广到更多的状态上, 另一方面, 在更少的状态数目上的泛化性也很一般. 而采用正交的 Embedding 则效果就好很多. 对于先验 $\alpha$ 类似.


## 个人测试

### Loss 的变化曲线

![20250818104245](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250818104245.png)

- 按照作者的建议的配置, 跑了 1000 epochs (每个 epoch 有 10000 条序列). 基本上, 已经能够到达 Empirical Loss 估计相同的结果了. 换言之, Transformer 在得到充分的数据训练之后, 的的确确展现出了 Markov Chain Estimator 的泛化能力.

### Max_NUM_States

- 训练采用固定的 $K=30$ States, 测试的时候采用从 $30\sim \text{Max\_NUM\_States}$ 中均匀采样:

![20250818141509](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250818141509.png)

- 虽然整体来说, 随着 States 数量的增加, 差距是越发明显的, 但是其实还好, 完全可以接受的感觉.

- 此外, 我发现即使在训练过程就增加 Max_NUM_States, 其效果反而比不上只在 `Max_NUM_States=30` 上的训练泛化性好.

![20250829103612](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250829103612.png)

- 如上图所示, 每三个一组, 分别是 `Max_NUM_States=20,30,50,100`, 可以发现, 训练的时候加入更多的 States 的场景, 其实并没有增加其在对应 Case 上的提升.

![20250829103953](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250829103953.png)

- 如上图所示, 曲线从上到下对应 `max_num_states` 逐步降低, 容易发现, 下面几个基本上有那么两三次的突然下降, 对于 `max_num_states=100` 的情况, 直到训练结束也没有, 这可能是效果较差的原因.


### minlen

- 训练采用固定的序列长度 $1000$, 测试的时候, 从 $\text{minlen} \sim 1000$ 中随机采样.

![20250818153308](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250818153308.png)

- 显然, 当 minlen 降低的时候, 估计的效果是越来越差的, 而且差距还是比较明显的. 不清楚这个根源是不是由于训练的时候固定采样序列长度为 1000 了 (但是, 其实 Next-Token 的预测方式其实也涉及到了短序列的信息). 这一块需要进一步调研, 否则想要用在短序列中还是有些难度.

### alpha

- 训练的时候固定 $\alpha=0.1$, 测试不同 $\alpha$ 下的情况.

![20250818170948](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250818170948.png)

- 结果挺好, 很稳定.

## 参考文献

<ol class="reference">
  <li>
    Lepage S., Mary J. and Picard D.
    <u>Markov Chain Estimation with In-Context Learning.</u>
    <i>arXiv</i>, 2025.
    <a href="https://arxiv.org/pdf/2508.03934" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>