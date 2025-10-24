---
draft: false
title: "Pre-training and Fine-tuning for Recommendation"
author: MTandHJ
tags:
  - Trend
  - Recommendation
  - Pre-training
  - Fine-tuning
---

- Pre-training and Fine-tuning 是在总多领域中屡试不爽的成功范式, 然而推荐系统中确缺乏这类成功的案例.


<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-07-01",
    "title": "IDP",
    "description": "通过 ID Matcher 实现 Zero-Shot 的跨域推荐",
    "paperUrl": "https://dl.acm.org/doi/10.1145/3735128",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251021205049.png",
    "importance": "novel"
  },

  {
    "date": "2025-06-04",
    "title": "GPSD",
    "description": "发现生成式预训练能够有效防止判别式模型的过拟合问题",
    "paperUrl": "http://arxiv.org/abs/2506.03699",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251023141124.png",
    "importance": "emmm"
  },

  {
    "date": "2023-05-23",
    "title": "Recformer",
    "description": "利用 MLM 和 Item 对比损失训练了一个 Encoder (user text sequence/item text -> hidden representation)",
    "paperUrl": "http://arxiv.org/abs/2305.13731",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251024160024.png",
    "importance": "emmm"
  },

  {
    "date": "2023-03-24",
    "title": "MoRec",
    "description": "实验详细探讨了 ID- vs. Modality-based 的现阶段差距",
    "paperUrl": "https://arxiv.org/abs/2303.13835",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194846.png",
    "importance": "novel"
  },

  {
    "date": "2022-06-13",
    "title": "UniSRec",
    "description": "仅基于文本实现的多场景可迁移序列推荐模型, 引入了 MoE-enhanced Adaptor 以及相应的 Parameter-Efficient Fine-tuning",
    "paperUrl": "https://arxiv.org/abs/2206.05941",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194956.png",
    "importance": "seminal"
  },

  {
    "date": "2021-05-18",
    "title": "ZESRec",
    "description": "Zero-Shot 预训练推荐模型",
    "paperUrl": "http://arxiv.org/abs/2105.08318",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251024153703.png",
    "importance": "emmm"
  },

  {
    "date": "2021-01-18",
    "title": "Knowledge Transfer via Pre-training for Recommendation: A Review and Prospect",
    "description": "一个介绍推荐系统 pre-training 的综述, 受时间的局限性, 所谓的 pre-training 并不严谨",
    "paperUrl": "",
    "imageUrl": "",
    "importance": "emmm"
  },

  {
    "date": "2020-06-09",
    "title": "PeterRec",
    "description": "自回归预训练 & 模型嫁接迁移 (为了降低微调参数量, 有点 LoRA 的味道)",
    "paperUrl": "http://arxiv.org/abs/2001.04253",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251015165841.png",
    "importance": "emmm"
  },

];
</script>

<script src="/js/timeline.js"></script>