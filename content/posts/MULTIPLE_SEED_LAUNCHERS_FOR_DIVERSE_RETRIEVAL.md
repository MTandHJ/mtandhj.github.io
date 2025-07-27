---
date: "2025-07-24"
draft: true
title: "Multiple Seed Launchers for Diverse Retrieval"
description: "通过多个 prompts 以实现多样化的检索"
author: MTandHJ
tags:
  - Trial
  - Recommendation
  - Embedding
  - Diversity
  - 2025
pinned: false
---


## 黑暗源头

- **Approximate Nearest Neighbor (ANN) 的局限性:** 出于效率的角度, 大部分召回模型都采用 ANN 的方式进行检索, 即分别建模出 user embedding $\bm{e}_u$ 和 item embedding $\bm{e}_i$ 然后

    $$
    s_{ui} := \langle \bm{e}_u, \bm{e}_i \rangle,
    $$

    这里 $\langle \cdot, \cdot \rangle$ 可以是 inner product 也可以是 cosine similarity, 亦或是其他.

- 这种方式的好处是可以非常快速的计算一个用户和庞大 item 群的全部 scores, 并从中进行筛选. 然后, 它有一个弊端, 如果 $\|\bm{e}_i - \bm{e}_j \|_2 \approx 0$, 则 $s_{ui} \approx s_{uj}$. 可以这么直观地认为, 对于每个 user embedding $\bm{e}_u$, 其所能检索到的 Top-$K$ 的商品大抵是**一类**的. 这或许也是为什么**多路召回**这么重要的原因.

- 本文的想法是希望通过多个 Seed Launchers 来使得仅凭一个模型就能实现多路召回的目的.

- 以 SASRec 为例, 其 next-item 预测方式为:

    $$
    p(v_{t+1}|v_{t}, v_{t-1}, \ldots, v_1) := \text{Softmax}(\{s_{ui} = \langle f(v_t, v_{t-1}, \ldots, v_1), \bm{e}_i \rangle\}_{i=1}^N).
    $$

- 我们的做法是, 在输入端引入 $M$ 个 Seed Launchers:

    $$
    \bm{l}_1, \cdots, \bm{l}_m,
    $$

    每个代表了一路召回, 因而我们可以得到:

    $$
    \{s_{ui}^{(l)}\}_{i=1}^N, \quad l=1,2,\ldots, m.
    $$

- **Inference:** 本质上这可以理解为一个 ensemble 模型, 目前推理方式暂定为:

    $$
    s_{ui}^* = \max_l s_{ui}^{(l)}.
    $$

## 实验结果

- **数据集:** 主要在 `Amazon2014Beauty_550_LOU` 数据集上进行测试, 其上不同的方法的基本结果如下:

![20250724102024](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250724102024.png)


- **Backbone:** 目前主要在普通的 SASRec 上进行实验, 并且采用 CE Loss 进行训练.

- **Metrics:** 除了最常见的 HR/NDCG@1/5/10, 还测试了下 NDCG@50/100, 因为主观的想法是: 强调 diversity 可能会在更多的检索条件下显现出优势.

### 最简单的 Maximum

![20250724104155](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250724104155.png)

- 在训练阶段, 采取如下的方式进行训练:

    $$
    -\log \frac{\exp(s_{uy}^*)}{\sum_{l} s_{uy}^{(l)} + \sum_{i \not = y} s_{ui}^*}.
    $$

- 目的很简单: 我们希望 target $\bm{e}_y$ 仅与其中一个 launcher 匹配, 且远远超过非 target 的 scores.

- 结果如上图所示:
    1. **增加 #Launchers 似乎是有效的:** 随着 #Launchers 的增加, 整体的效果明显呈现一个先增加后降低的趋势, 因此, 可以认为在这个体系 Multiple Seed Launchers 是有效的.
    2. **显著低于一般的 SASRec:** 然后, 此时的结果依然与最普通的 SASRec 有着明显的差距. 需要指出的是, $m=1$ 不能保证严格退化到普通的 SASRec, 因为每个 launcher 是独立可训练的, 因此一个直观的感觉是不是因为少了 last item embedding 的初始化? 那么如果加上这部分会不会效果就好了呢?
    3. **NDCG@100 的增加幅度并没有显著高于 NDCG@10:** 本来, 我们设想的是, 检索越多这类方法的效果应该越发显著, 但是仅从绝对的差距来说, NDCG@100 并没显示出应有的优势.


### Copy-and-Go

![20250724203023](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250724203023.png)

- 为了尽可能保证 $m=1$ 的时候能够退化到普通的 SASRec, 我们采取 Seed Launchers 为:

    $$
    \bm{l} \leftarrow \bm{e}_t + \bm{l}.
    $$

- 结果如上图所示:
    1. **$m=1$ 效果恢复了:** 的确如设想的一样, $\bm{l} + \bm{e}_t$ 就可以近似原本的 SASRec 了.
    2. **增加 #Launchers 大体上不利于性能的提升.** 虽然一开始也没有抱有特别大的期待, 但是真出来这个情况还是挺丧气的. 另外一方面, 似乎也可以这么说, 至少对于 `Amazon2014Beauty_550_LOU` 这个数据集来说, last item 太重要了, 增加了一些变化反而让结果更差. 是不是应该尝试一些别的数据集, 比如不太作为序列推荐数据集的 `MovieLens1M`?
    3. **HR/NDCG@1** 居然会有短暂的增加. 居然和之前的预测完全相反了. 是不是可以这么想: 由于普通的 SASRec 过于依赖 last item, 所以基本上预测的都是和 last item 相近的 items. 但是, 总会有一些 target 不符合这种情况, 他可能是由前面的部分交互决定的, 因此 Seed Launchers 的引入一定程度上能够在这部分 case 上取得较好的结果. 可惜的是, 引入 Seed Launchers 又可能会大大增加 target 排在较后头的概率, 因此效果不太好. Ok, 那如果不是简单的相加呢? 会不会既能够使得靠前的商品排的更好, 后面的情况也能得到大大缓解呢?


## 代码

```python


from typing import Dict, Tuple, Union

import torch
import torch.nn as nn
import torch.nn.functional as F
import freerec

freerec.declare(version='1.0.1')

cfg = freerec.parser.Parser()
cfg.add_argument("--maxlen", type=int, default=50)
cfg.add_argument("--num-negs", type=int, default=300)
cfg.add_argument("--num-heads", type=int, default=1)
cfg.add_argument("--num-blocks", type=int, default=2)
cfg.add_argument("--num-launchers", type=int, default=10)
cfg.add_argument("--embedding-dim", type=int, default=64)
cfg.add_argument("--dropout-rate", type=float, default=0.2)

cfg.set_defaults(
    description="SASRec-PR",
    root="../../data",
    dataset='Amazon2014Beauty_550_LOU',
    epochs=200,
    batch_size=256,
    optimizer='adam',
    lr=1e-3,
    weight_decay=0.,
    seed=1,
)
cfg.compile()


class PointWiseFeedForward(nn.Module):

    def __init__(self, hidden_size: int, dropout_rate: int):
        super(PointWiseFeedForward, self).__init__()

        self.conv1 = nn.Conv1d(hidden_size, hidden_size, kernel_size=1)
        self.dropout1 = nn.Dropout(p=dropout_rate)
        self.relu = nn.ReLU()
        self.conv2 = nn.Conv1d(hidden_size, hidden_size, kernel_size=1)
        self.dropout2 = nn.Dropout(p=dropout_rate)

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        # inputs: (B, S, D)
        outputs = self.dropout2(self.conv2(self.relu(
            self.dropout1(self.conv1(inputs.transpose(-1, -2)))
        ))) # -> (B, D, S)
        outputs = outputs.transpose(-1, -2) # -> (B, S, D)
        outputs += inputs
        return outputs


class SASRec(freerec.models.SeqRecArch):

    def __init__(
        self, dataset: freerec.data.datasets.RecDataSet,
        maxlen: int = 50, embedding_dim: int = 64, 
        dropout_rate: float = 0.2, num_blocks: int = 1, num_heads: int = 2,
    ) -> None:
        super().__init__(dataset)

        self.embedding_dim = embedding_dim
        self.num_blocks = num_blocks
        self.num_launchers = cfg.num_launchers

        self.Item.add_module(
            'embeddings', nn.Embedding(
                num_embeddings=self.Item.count + self.NUM_PADS,
                embedding_dim=embedding_dim,
                padding_idx=self.PADDING_VALUE
            )
        )

        self.launchers = nn.parameter.Parameter(
            torch.randn((self.num_launchers, embedding_dim)) * 0.02,
            requires_grad=True
        )

        self.Position = nn.Embedding(maxlen + self.num_launchers, embedding_dim)
        self.embdDropout = nn.Dropout(p=dropout_rate)
        self.register_buffer(
            "positions",
            torch.tensor(range(0, maxlen + self.num_launchers), dtype=torch.long).unsqueeze(0)
        )

        self.attnLNs = nn.ModuleList() # to be Q for self-attention
        self.attnLayers = nn.ModuleList()
        self.fwdLNs = nn.ModuleList()
        self.fwdLayers = nn.ModuleList()

        self.lastLN = nn.LayerNorm(embedding_dim, eps=1e-8)

        for _ in range(num_blocks):
            self.attnLNs.append(nn.LayerNorm(
                embedding_dim, eps=1e-8
            ))

            self.attnLayers.append(
                nn.MultiheadAttention(
                    embed_dim=embedding_dim,
                    num_heads=num_heads,
                    dropout=dropout_rate,
                    batch_first=True # !!!
                )
            )

            self.fwdLNs.append(nn.LayerNorm(
                embedding_dim, eps=1e-8
            ))

            self.fwdLayers.append(PointWiseFeedForward(
                embedding_dim, dropout_rate
            ))

        # False True  True ...
        # False False True ...
        # False False False ...
        # ....
        # True indices that the corresponding position is not allowed to attend !
        self.register_buffer(
            'attnMask',
            torch.ones((maxlen + self.num_launchers, maxlen + self.num_launchers), dtype=torch.bool).triu(diagonal=1)
        )
        self.attnMask[-self.num_launchers:, -self.num_launchers:].fill_(False)

        self.criterion = freerec.criterions.CrossEntropy4Logits(reduction='mean')

        self.reset_parameters()

    def reset_parameters(self):
        """Initializes the module parameters."""
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.xavier_normal_(m.weight)
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0.)
            elif isinstance(m, nn.Embedding):
                nn.init.xavier_normal_(m.weight)
            elif isinstance(m, (nn.BatchNorm1d, nn.BatchNorm2d)):
                nn.init.constant_(m.weight, 1.)
                nn.init.constant_(m.bias, 0.)

        nn.init.xavier_normal_(self.launchers)

    def sure_trainpipe(self, maxlen: int, batch_size: int):
        return self.dataset.train().shuffled_roll_seqs_source(
            minlen=2, maxlen=maxlen, keep_at_least_itself=True
        ).seq_train_yielding_pos_(
            start_idx_for_target=-1, end_idx_for_input=-1
        ).add_(
            offset=self.NUM_PADS, modified_fields=(self.ISeq,)
        ).lpad_(
            maxlen, modified_fields=(self.ISeq,),
            padding_value=self.PADDING_VALUE
        ).batch_(batch_size).tensor_()

    def mark_position(self, seqs: torch.Tensor):
        positions = self.Position(self.positions) # (1, maxlen, D)
        return seqs + positions

    def after_one_block(self, seqs: torch.Tensor, padding_mask: torch.Tensor, l: int):
        # inputs: (B, S, D)
        Q = self.attnLNs[l](seqs)
        seqs = self.attnLayers[l](
            Q, seqs, seqs, 
            attn_mask=self.attnMask,
            need_weights=False
        )[0] + seqs

        seqs = self.fwdLNs[l](seqs)
        seqs = self.fwdLayers[l](seqs)

        return seqs.masked_fill(padding_mask, 0.)
    
    def encode(
        self, data: Dict[freerec.data.fields.Field, torch.Tensor]
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        seqs = data[self.ISeq]
        B, S = seqs.shape
        padding_mask = (seqs == self.PADDING_VALUE).unsqueeze(-1)
        seqs = self.Item.embeddings(seqs) # (B, S) -> (B, S, D)
        seqs = torch.cat(
            (
                seqs,
                self.launchers.unsqueeze(0).repeat(B, 1, 1)
            ),
            dim=1
        ) # (B, S + K, D)
        seqs *= self.embedding_dim ** 0.5
        seqs = self.embdDropout(self.mark_position(seqs))

        padding_mask = torch.cat(
            (
                padding_mask,
                torch.zeros((B, self.num_launchers, 1), dtype=torch.bool, device=self.device)
            ),
            dim=1
        ) # (B, S + K, 1)

        seqs = seqs.masked_fill(padding_mask, 0.)

        for l in range(self.num_blocks):
            seqs = self.after_one_block(seqs, padding_mask, l)
        
        userEmbds = self.lastLN(seqs) # (B, S, D)

        return userEmbds, self.Item.embeddings.weight[self.NUM_PADS:]

    def fit(
        self, data: Dict[freerec.data.fields.Field, torch.Tensor]
    ) -> Union[torch.Tensor, Tuple[torch.Tensor]]:
        userEmbds, itemEmbds = self.encode(data)
        userEmbds = userEmbds[:, -self.num_launchers:, :] # (B, K, D)
        posEmbds = itemEmbds[data[self.IPos]] # (B, 1, D)
        negEmbds = itemEmbds

        negLogits = torch.einsum("BKD,ND->BKN", userEmbds, negEmbds).max(dim=1)[0]
        posLogits = userEmbds.mul(posEmbds).sum(dim=-1) # (B, K)
        indices = posLogits.argmax(dim=-1, keepdim=True)
        userEmbds = torch.gather(
            userEmbds, dim=1, 
            index=indices.unsqueeze(-1).repeat((1, 1, userEmbds.size(-1)))
        ).squeeze(1) # (B, D)

        logits = torch.cat((posLogits, negLogits), dim=-1)
        labels = indices.squeeze(-1)
        rec_loss = self.criterion(logits, labels)

        return rec_loss, indices

    def recommend_from_full(
        self, data: Dict[freerec.data.fields.Field, torch.Tensor]
    ) -> torch.Tensor:
        userEmbds, itemEmbds = self.encode(data)
        userEmbds = userEmbds[:, -self.num_launchers:, :] # (B, K, D)
        logits = torch.einsum("BKD,ND->BKN", userEmbds, itemEmbds)
        return logits.max(dim=1)[0]


class CoachForSASRec(freerec.launcher.Coach):

    def set_other(self):
        self.register_metric(
            "ENT",
            func=lambda x: x,
            fmt=".6f",
            best_caster=max
        )

    def train_per_epoch(self, epoch: int):
        indices: torch.Tensor
        freqs = 0.
        for data in self.dataloader:
            data = self.dict_to_device(data)
            loss, indices = self.model(data)

            classes = F.one_hot(indices, num_classes=cfg.num_launchers)
            freqs = freqs + torch.sum(classes, dim=0).cpu()

            self.optimizer.zero_grad()
            loss.backward()
            self.optimizer.step()
           
            self.monitor(
                loss.item(), 
                n=len(data[self.User]), reduction="mean", 
                mode='train', pool=['LOSS']
            )
        
        freqs = freqs / freqs.sum()
        entropy = (-freqs * freqs.log()).sum()

        self.monitor(
            entropy.item(), 
            n=1, reduction="mean", 
            mode='train', pool=['ENT']
        )

def main():

    dataset: freerec.data.datasets.RecDataSet
    try:
        dataset = getattr(freerec.data.datasets, cfg.dataset)(root=cfg.root)
    except AttributeError:
        dataset = freerec.data.datasets.RecDataSet(cfg.root, cfg.dataset, tasktag=cfg.tasktag)

    model = SASRec(
        dataset, maxlen=cfg.maxlen, 
        embedding_dim=cfg.embedding_dim, dropout_rate=cfg.dropout_rate,
        num_blocks=cfg.num_blocks, num_heads=cfg.num_heads,
    )

    # datapipe
    trainpipe = model.sure_trainpipe(cfg.maxlen, cfg.batch_size)
    validpipe = model.sure_validpipe(cfg.maxlen, ranking=cfg.ranking)
    testpipe = model.sure_testpipe(cfg.maxlen, ranking=cfg.ranking)

    coach = CoachForSASRec(
        dataset=dataset,
        trainpipe=trainpipe,
        validpipe=validpipe,
        testpipe=testpipe,
        model=model,
        cfg=cfg
    )
    coach.fit()


if __name__ == "__main__":
    main()
```