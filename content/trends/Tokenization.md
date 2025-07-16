---
draft: false
title: "Tokenization is the Language of AI."
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
    "date": "2024-04-22",
    "title": "SpaceByte: Towards Deleting Tokenization from Large Language Modeling",
    "description": "在 MegaByte 的基础上引入 Spacelike Bytes 以更合理地划分 patch",
    "paperUrl": "/posts/spacebyte/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250715140334.png",
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