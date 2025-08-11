---
date: "2025-08-07"
draft: true
title: "On the Markovian Nature of the Next-Item Recommendation Task"
description: "序列推荐任务的马尔科夫性"
author: MTandHJ
tags:
  - Trial
  - Sequential Recommendation
  - 2025
pinned: false
---


## 黑暗源头

- 序列推荐是推荐领域一个相当重要的 Topic, 大家都认为通过序列可以有效抓住用户所谓的**动态兴趣**. 譬如, 最为人所知的 SASRec 是经典的 Next-Item Recommendation:

  $$
  \begin{align}
  \hat{v}_{t+1} = \text{argmax}_{v} \: P(v| v_1, v_2, \ldots, v_t).
  \end{align}
  $$

  其中 $v \in \mathcal{V}$ 表示 Item, $\{v_1, v_2, \ldots, v_t\}$ 表示用户的历史交互序列. 换言之, 在这个 setting 下, 用户仅以交互序列代表.

- 一般来说, SASRec 的输入序列有一个 `maxlen` 的最大序列长度, 理论上来说, 这个值应该是越大越好 (利用到的信息增加了). 然而我最近在多 launchers 的实验中发现, 历史交互序列的 last item $v_t$ 似乎在整个推荐中起到了至关重要的作用. 特此, 我希望探究一下其中的真伪.

## 实验设置

- 我只想探究 `maxlen` 的影响, 但是一般的 SASRec 的实现采用的是并行的预测, 即此时 `maxlen` 不仅决定了 inference 时候所用到的信息, 也决定了训练数据大小. 为了控制变量, 我会将用户序列进行一个切分, 具体的数据集的构造代码如下:

```python
def sure_trainpipe(self, maxlen: int, batch_size: int):
    return self.dataset.train().shuffled_roll_seqs_source(
        minlen=cfg.minlen, maxlen=50, # maxlen: 50 for Beauty; 100 for ML-1M
        keep_at_least_itself=True
    ).lprune_(
        maxlen=maxlen + 1, modified_fields=(self.ISeq,)
    ).seq_train_yielding_pos_(
        start_idx_for_target=-1, end_idx_for_input=-1
    ).add_(
        offset=self.NUM_PADS, modified_fields=(self.ISeq,)
    ).lpad_(
        maxlen, modified_fields=(self.ISeq,),
        padding_value=self.PADDING_VALUE
    ).batch_(batch_size).tensor_()

```

- 比如对于 $[v_1, v_2, v_3, v_4, v_5]$, `maxlen=2` 的情况下, 会切分为

  $$
  \begin{align}
  [v_1] \rightarrow v_2, \\
  [v_1, v_2] \rightarrow v_3, \\
  [v_2, v_3] \rightarrow v_4, \\
  [v_3, v_4] \rightarrow v_5.
  \end{align}
  $$


## 实验结果

### Amazon2014Beauty_550_LOU

- (**唯一用户数量**) 当 `maxlen` 比较小的时候, 显然会有很多 user 的交互序列是一样的, 下图是不同 `maxlen` 下唯一用户的占比:

![20250807133804](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250807133804.png)


- (**性能比较**) 下图是调整 `maxlen` 后的性能比较:

![20250807134137](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250807134137.png)

- (**初步结论**) 至少在 Amazon2014Beauty_550_LOU 这个经典的数据集上, 我们很难认为 SASRec 抓住了所谓的序列信息. 这一点其实在 SASRec 原本中可以窥见一二, 其中所展示的 Attention Map, 几乎都 sink 在倒一 Items.


- (**进一步分析**) `maxlen=1` 是一种非常恐怖的极限状态, 此时 SASRec 的每个 block 相当于:

  $$
  \begin{align}
  \text{(Attention)} \quad &
  \bm{h}_l =
  \text{LN}\left(
    \text{Dropout}\left(
      W_1\bm{e}_l
    \right) + \bm{e}_l
  \right), \\
  \text{(FFN)} \quad &
  \bm{e}_{l + 1} =
  \text{LN}\left(
    \text{Dropout}\left(
      W_3 \sigma(W_2\bm{h}_l)
    \right) + \bm{h}_l
  \right). \\
  \end{align}
  $$

  其中 $\sigma(\cdot)$ 代表某个激活函数. 这 Attention 的存在显得那么多余.

#### SASRec + Zero Block

- 根据上述的猜想, 我首先想着把 Attention 去掉看看, 毕竟这基本上就是就是一个普通的线性层, 发现效果也没掉特别的. 于是一个更加大胆的想法出现了, 会不会压根就不需要复杂的 Attention/FFN?

- 于是乎, 一个最简单的 'SASRec' 模型就得到了:

  $$
  \begin{align}
  s_{ui} = \bm{e}_{v_t}^T \bm{e}_{v_i}, \quad v_i \in \mathcal{V}.
  \end{align}
  $$

|Blocks|HR@1|HR@10|NDCG@10|
|:-:|:-:|:-:|:-:|
|Blocks=4|0.0279|0.0807|0.0508|
|Blocks=3|0.0269|0.0846|0.0522|
|Blocks=2|0.0267|0.0871|0.0532|
|Blocks=1|0.0275|0.0855|0.0530|
|(8)|0.0272|0.0850|0.0526|

#### STAMP

![20250808103422](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250808103422.png)

- STAMP${}^{[1]}$ 是一个非常强调 last Item 的方法: 不仅单独拿出 last Item 用于预测, 在综合长期兴趣的过程中, 也融合 last Item.

- 然而, 即使在如此条件下, STAMP 的其他操作依旧在 Beauty 上依旧是冗余的:

|Blocks|HR@1|HR@10|NDCG@10|
|:-:|:-:|:-:|:-:|
|STAMP|0.0168|0.0564|0.0343|
|only $\bm{h}_t$|0.0270|0.0710|0.0466|
|only $\bm{m}_t$|0.0246|0.0814|0.0496|

- 接下来的问题是, 这个问题是 Beauty 上的个例, 还是 Amazon 数据集上的个例, 还是大部分 Next-Item Recommendation 的共性?


### Amazon2014Beauty_554_LOU

![20250811095855](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250811095855.png)

### Amazon2014Beauty_1000_LOU

![20250808164924](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250808164924.png)


### Amazon2014Tools_554_LOU

![20250811100333](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250811100333.png)


### Amazon2014Toys_554_LOU

![20250811100524](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250811100524.png)


### RetailrocketTransaction_500_LOU

![20250811101004](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250811101004.png)


### 

## 参考文献

<ol class="reference">
  <li>
    Liu Q., Zeng Y., Mokhosi R. and Zhang H.
    <u>STAMP: Short-Term Attention Memory Priority Model for Session-based Recommendation.</u>
    <i>KDD</i>, 2018.
    <a href="https://dl.acm.org/doi/10.1145/3219819.3219950" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/uestcnlp/STAMP" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>