---
draft: false
title: "Tokenization is the Language of AI"
author: MTandHJ
tags:
  - Trend
  - Tokenization
  - Vector Quantization
---

- 如果说表示学习是 AI 感知这个世界的介质, Tokenization 则是 AI 与人类沟通的工具.

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-07-15",
    "title": "H-Net",
    "description": "符号序列的自动切分, 实现自适应的子词划分",
    "paperUrl": "/posts/h-net/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250716104935.png",
    "importance": "novel"
  },

  {
    "date": "2025-02-02",
    "title": "A Survey of Quantized Graph Representation Learning",
    "description": "Survey, 向量量化在图上的研究",
    "paperUrl": "https://arxiv.org/abs/2502.00681",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250717115818.png",
    "importance": "emmm"
  },

  {
    "date": "2024-12-14",
    "title": "SoftVQ-VAE",
    "description": "Softmax 版 Vector Quantization, 主要追求更高的压缩比",
    "paperUrl": "/posts/softvq-vae/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250716141244.png",
    "importance": "emmm"
  },

  {
    "date": "2024-11-04",
    "title": "SimVQ",
    "description": "坐标变换替代可学习 Codebook, 避免 Collapse",
    "paperUrl": "/posts/simvq/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250615103519.png",
    "importance": "emmm"
  },

  {
    "date": "2024-10-08",
    "title": "Rotation Trick",
    "description": "提出 Rotation Trick 替代 VQ-VAE 中的 STE",
    "paperUrl": "/posts/rotation-trick-for-vector-quantization/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250612175428.png",
    "importance": "novel"
  },

  {
    "date": "2024-04-22",
    "title": "SpaceByte: Towards Deleting Tokenization from Large Language Modeling",
    "description": "在 MegaByte 的基础上引入 Spacelike Bytes 以更合理地划分 patch",
    "paperUrl": "/posts/spacebyte/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250715140334.png",
    "importance": "emmm"
  },

  {
    "date": "2023-09-27",
    "title": "FSQ",
    "description": "采用传统 Element-wise Rounding 的方式实现向量量化, Codebook 为超矩体的顶点",
    "paperUrl": "/posts/fsq/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250312145029.png",
    "importance": "emmm"
  },

  {
    "date": "2023-05-12",
    "title": "MEGABYTE: Predicting Million-byte Sequences with Multiscale Transformers",
    "description": "多尺度 Transformer, 去 Subword Tokenizer 的开创性工作",
    "paperUrl": "/posts/megabyte/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250715133503.png",
    "importance": "seminal"
  },

  {
    "date": "2022-03-03",
    "title": "RQ-VAE",
    "description": "残差向量量化",
    "paperUrl": "/posts/rq-vae",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250316155423.png",
    "importance": "novel"
  },

  {
    "date": "2020-12-17",
    "title": "VQGAN",
    "description": "向量量化 + 自回归式图片生成",
    "paperUrl": "/posts/vqgan/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250311144000.png",
    "importance": "novel"
  },

  {
    "date": "2018-04-29",
    "title": "SentencePiece",
    "description": "谷歌开源的子词工具包",
    "paperUrl": "https://github.com/google/sentencepiece",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250715144701.png",
    "importance": "novel"
  },

  {
    "date": "2018-04-29",
    "title": "Unigram",
    "description": "采样而非确定性的编码方式",
    "paperUrl": "https://arxiv.org/abs/1804.10959",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250715144339.png",
    "importance": "novel"
  },

  {
    "date": "2017-11-02",
    "title": "VQ-VAE",
    "description": "向量量化的开山之作",
    "paperUrl": "/posts/vq-vae/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250310215306.png",
    "importance": "seminal"
  },

  {
    "date": "1994-01-01",
    "title": "Byte-Pair Encoding",
    "description": "经典的 BPE tokenization",
    "paperUrl": "https://en.wikipedia.org/wiki/Byte-pair_encoding",
    "imageUrl": "",
    "importance": "seminal"
  },

];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>