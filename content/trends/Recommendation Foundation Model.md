---
draft: false
title: "Recommendation Foundation Model"
author: MTandHJ
tags:
  - Trend
  - Recommendation
  - Foundation
  - Multimodal
  - Sequential
  - Graph
---

- 个人认为通用的推荐模型的前景似乎变得开阔了, Item 可以用多模态特征表示, User 可以用序列表示, 由此或许真的可能通向推荐自己的基座模型. 
- 需要声明的是, 下面的文章仅仅是我个人认为可能对这条路有帮助的, 毕竟这是一条尚未明朗的崎岖小路.


<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-02-26",
    "title": "OneRec",
    "description": "端到端生成式推荐在快手团队的尝试, 主要用于视频流推荐, 其中的 Fixed 向量量化颇有意思",
    "paperUrl": "/posts/onerec/",
    "importance": "emmm"
  },

  {
    "date": "2024-07-07",
    "title": "AlphaRec",
    "description": "论证了 LLM 有着不逊色 BERT 类模型的编码能力, 同时扩展了用户意图嵌入等方向",
    "paperUrl": "/posts/alpharec/",
    "importance": "novel"
  },

  {
    "date": "2024-02-27",
    "title": "HSTU",
    "description": "针对 transformers Attention 的改进很吸引人, 而且似乎已经被工业界验证了",
    "paperUrl": "https://arxiv.org/abs/2402.17152",
    "importance": "novel"
  },

  {
    "date": "2023-05-08",
    "title": "Tiger",
    "description": "向量量化用于生成式推荐",
    "paperUrl": "https://arxiv.org/abs/2305.05065",
    "importance": "seminal"
  },

  {
    "date": "2023-03-24",
    "title": "MoRec",
    "description": "实验详细探讨了 ID- vs. Modality-based 的现阶段差距",
    "paperUrl": "https://arxiv.org/abs/2303.13835",
    "importance": "novel"
  },

  {
    "date": "2022-06-13",
    "title": "UniSRec",
    "description": "仅基于文本实现的多场景可迁移序列推荐模型, 引入了 MoE-enhanced Adaptor 以及相应的 Parameter-Efficient Fine-tuning",
    "paperUrl": "http://arxiv.org/abs/2503.17109",
    "importance": "seminal"
  },

];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>