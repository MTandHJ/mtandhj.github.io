---
date: "2025-03-23"
draft: true
title: "Language Representations Can be What Recommenders Need: Findings and Potentials"
description: "Next-token embedding 之于协同过滤"
author: MTandHJ
tags:
  - Note
  - Collaborative Filtering
  - LLM
  - Universal Embedding 
  - Empirical
  - ICLR
  - 2025
pinned: false
---



## 核心思想


![20250323131310](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250323131310.png)


### Linear

- 本文探索 LLM embeddings 的潜力, 方法极为简单:
    1. 将 title 的 embeddings 作为对应 item 的表示 (记为 $\bm{z}_i$), 其过程如下 (注意到, 实际上, 是将 decoder-only 的 next-token embedding 作为 item 的表示, 而不是平均之类的方式):
    ```python
    # model_path = "meta-llama/Meta-Llama-3-8B"
    model_path = "meta-llama/Llama-2-7b-hf"
    # model_path = "meta-llama/Llama-2-13b-hf"

    tokenizer = AutoTokenizer.from_pretrained(model_path, device_map = 'auto')
    model = AutoModelForCausalLM.from_pretrained(model_path, device_map = 'auto')

    tokenizer.padding_side = "left"
    tokenizer.pad_token = tokenizer.eos_token


    item_df = pd.read_csv('raw_data/items_filtered.csv', index_col=0)
    item_df.rename(columns={'title': 'item_name'}, inplace=True)

    batch_size = 64

    for i in tqdm(range(0, len(item_df), batch_size)):
        # print(i)
        item_names = item_df['item_name'][i:i+batch_size]
        # 生成输出
        inputs = tokenizer(item_names.tolist(), return_tensors="pt", padding=True, truncation=True, max_length=128).to(model.device)
        with torch.no_grad():
            output = model(**inputs, output_hidden_states=True)
        seq_embeds = output.hidden_states[-1][:, -1, :].detach().cpu().numpy()
        # break
        if i == 0:
            item_llama_embeds = seq_embeds
        else:
            item_llama_embeds = np.concatenate((item_llama_embeds, seq_embeds), axis=0)
    ```

    2. 然后 user 表示为其所交互过的商品的平均:

        $$
        \bm{z}_u = \frac{1}{|\mathcal{N}_u|} \sum_{i \in \mathcal{N}_u} \bm{z}_i.
        $$

    3. 然后通过共享的 projector 得到:

        $$
        \bm{e}_u = \mathbf{W} \bm{z}_u, \quad 
        \bm{e}_i = \mathbf{W} \bm{z}_i.
        $$
    
    4. score 以 cosine similarity 来计算:

        $$
        s_{ui} = \frac{\bm{e}_u^T \bm{e}_i}{\|\bm{e}_u\| \| \bm{e}_i\|}.
        $$

    5. 通过 InfoNCE 进行训练 (温度参数 $\tau \approx 0.15$), 注意, $\bm{z}$ 是固定的.

- 下面是 linear projector 下的结果:

![20250323132631](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250323132631.png)

- 有一些很有趣的点:
    1. BERT, RoBERTa 等传统的 encoder 模型反而会取得很差的效果, 这个和之前的一些经验是相符的;
    2. 随着 LLM 的能力的增强, 效果也越来越好了, 很容易就能够超过 ID-based 的方法.

### AlphaRec

- AlphaRec 的做法:
    1. linear projector 进行了一点点修改

    $$
    \bm{e} = \mathbf{W}_2 \text{LeakyReLU}
    \big(
        \mathbf{W}_1 \bm{z}
    \big).
    $$

    2. 加上 LightGCN:
    
    $$
    \mathbf{F} = \sum_{l=0}^{L+1} \mathbf{\tilde{A}}^l \mathbf{E},
    $$

    这里 $\mathbf{E}$ 是所有的 $\bm{e}_u, \bm{e}_i$, $\mathbf{\tilde{A}}$ 是对应的 (对称) normalized 邻接矩阵.


![20250323133416](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250323133416.png)

- 如上图所示, AlphaRec 如此简单的方法就能够取得非常惊人的效果 (而且效率很高).


### 其它潜力

- 可以作为初始化而加速和提高传统模型

- 非常强的 zero-shot 能力, 甚至能够媲美传统模型 full-training 的效果

![20250323133753](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250323133753.png)

- intention-aware, 用户可以输入自己的意图, 同样通过 LLM 得到 embedding, 加权平均得到 user 的表示:

    $$
    \bm{\tilde{e}}_u = (1 - \alpha) \bm{e}_u + \alpha \bm{e}_u^{Intention}.
    $$

![20250323133719](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250323133719.png)


## 个人测试

- 参考作者的代码, 自己实现了 [AlphaRec](https://github.com/MTandHJ/RecBoard/tree/master/AlphaRec), 在 Movies 进行了一下测试.

```yaml
# AlphaRec
root: ../../data
dataset: AmazonMovies_Alpha
tasktag: Matching

embedding_dim: 64
num_layers: 2

epochs: 500
batch_size: 4096
optimizer: adam
lr: 5.e-4
weight_decay: 1.e-6

tau: 0.15
num_negs: 256
projector: mlp

monitors: [LOSS, Recall@1, Recall@10, Recall@20, HitRate@10, HitRate@20, NDCG@10, NDCG@20]
which4best: Recall@20
```

```yaml
# LightGCN
root: ../../data
dataset: AmazonMovies_Alpha
tasktag: Matching

embedding_dim: 64
num_layers: 2

epochs: 1000
batch_size: 2048
optimizer: adam
lr: 1.e-3
weight_decay: 1.e-3

monitors: [LOSS, Recall@1, Recall@10, Recall@20, HitRate@10, HitRate@20, NDCG@10, NDCG@20]
which4best: NDCG@20
```


| Method      | R@1    | R@10   | R@20   | HR@10  | HR@20  | N@10   | N@20   |
| ----------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| LightGCN    | 0.0134 | 0.0655 | 0.0995 | 0.3746 | 0.4931 | 0.0784 | 0.0899 |
| AlphaRec    | 0.0193 | 0.0834 | 0.1210 | 0.4404 | 0.5541 | 0.1015 | 0.1135 |
| AlphaRec-TE | 0.0177 | 0.0730 | 0.1069 | 0.4072 | 0.5140 | 0.0916 | 0.1023 |

AlphaRec-TE: Trainble Embeddings


## 参考文献

<ol class="reference">

  <li>
    Sheng L., Zhang A., Zhang Y., Chen Y., Wang X., and Chua T.
    <u>Language Representations Can be What Recommenders Need: Findings and Potentials</u>
    <i>ICLR</i>, 2025.
    <a href="http://arxiv.org/abs/2407.05441" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/LehengTHU/AlphaRec" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <!-- 添加更多文献条目 -->
</ol>