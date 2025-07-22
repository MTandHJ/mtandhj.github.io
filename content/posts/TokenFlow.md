---
date: "2025-07-20"
draft: false
title: "TokenFlow: Unified Image Tokenizer for Multimodal Understanding and Generation"
description: "兼顾 Low-level 的 Pixel 信息和 High-level 的 Semantic 信息"
author: MTandHJ
tags:
  - Note
  - MLLM
  - Vector Quantization
  - Empirical
  - CVPR
  - 2025
pinned: false
---


## 预备知识

- 请务必了解 [VQGAN](/posts/vqgan/).

## 核心思想



- 本文试图将 Image 编码为离散 Token 以方便以直接通过 LLM 实现 Image 的理解和生成任务.

- 作者将研究重心放在 Vector Quantization 之上, 认为之前的方法通常只采用一个单独的 Vector Quantization, 这会导致对应的编码要么过于偏向语义 Embedding 要么过于偏向 pixel-to-pixel 这种强调 low-level 特征的.

![20250720142111](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250720142111.png)

- 因此, TokenFlow 希望设计一个 dual-encoder 来实现二者的兼容:
    1. 如上图所示, TokenFlow 具备两个分支: Semantic/Pixel.
    2. 但是二者并非完全独立, 中间有一个 shared mapping. 需要注意的是, 这里指得不是共享的 Codebook. 对于, Semantic/Pixel 各自有其 CodeBook $\mathbf{Z}_{sem} = \{z_{sem, i}\}_{i=1}^K, \mathbf{Z}_{pix} = \{z_{pix, i}\}_{i=1}^K$. 然后量化的过程是耦合的:

        $$
        d_{sem, i} = \|\hat{z}_{sem} - z_{sem, i}\|, \quad i=1,2,\ldots, K, \\
        d_{pix, i} = \|\hat{z}_{pix} - z_{pix, i}\|, \quad i=1,2,\ldots, K, \\
        i^* = \text{argmin}_{i} (d_{sem, i} + w_{dis} \cdot d_{pix, i}).
        $$
    
- 实际上就是通过一个额外的权重来调节两部分的重要性. 如果 $w_{dis} = 1$, 实际上就可以看出是 shared codebook (而且作者给的代码中就是就是设定的 $w_{dis} = 1$).

- 最后, Semantic 和 Pixel 两个分支的训练目标略有不同. Semantic 采用的分支就是用重构损失训练, 而 Pixel 部分的分支采用 VQGAN 的方式训练, 最后再加上 [VQ-VAE](/posts/vq-vqe/) 中所建议的 commit loss.


## 参考文献

<ol class="reference">
  <li>
    Qu L., Zhang H., Liu Y., Wang X., Jiang Y., Gao Y., Ye H., Du D. K., Yuan Z. and Wu X.
    <u>TokenFlow: Unified Image Tokenizer for Multimodal Understanding and Generation.</u>
    <i>CVPR</i>, 2025.
    <a href="https://arxiv.org/abs/2412.03069" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/ByteFlow-AI/TokenFlow" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

