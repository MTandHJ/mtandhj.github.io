---
draft: false
title: "Multimodal Collaborative Filtering"
author: MTandHJ
tags:
  - Trend
  - Collaborative Filtering
  - Multimodal
---

- 推荐系统是一个显然的数据驱动的场景, 且数据的形式日新月异. 为了充分利用现实场景中丰富的文字、图片、音频等多媒体信息, 多模态推荐应运而生.
- 单独讨论**协同过滤** (而非 Multimodal Recommendation) 是因为这个方向的论文更注重模态的融合和去噪, 而在多模态序列推荐中, 往往掺杂更多对于 Encoder 的思考, 也更多是舍弃 ID 的场景.


<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-04-22",
    "title": "LVLM Benchmark",
    "description": "多模态大模型通过 5 种策略增强多模态序列推荐的评测",
    "paperUrl": "https://dl.acm.org/doi/10.1145/3696410.3714764",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703173900.png",
    "importance": "emmm"
  },

  {
    "date": "2025-02-12",
    "title": "Spectrum Shift Correction",
    "description": "指出了交互图掺杂多模态信息后频谱偏移现象并提出解决方法",
    "paperUrl": "https://arxiv.org/pdf/2502.08071",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703173949.png",
    "importance": "novel"
  },

  {
    "date": "2024-12-16",
    "title": "STAIR",
    "description": "指出电商场景下交互行为的非模态驱动性, 以及交互图卷积的模态擦除问题",
    "paperUrl": "https://arxiv.org/abs/2412.11729",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174117.png",
    "importance": "novel"
  },

  {
    "date": "2023-08-07",
    "title": "MGCN",
    "description": "提出后续常用的门控机制用以模态去噪",
    "paperUrl": "https://arxiv.org/abs/2308.03588",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174209.png",
    "importance": "novel"
  },

  {
    "date": "2023-07-18",
    "title": "LightGT",
    "description": "Layer-wise (graph) position encoder + Attention",
    "paperUrl": "https://dl.acm.org/doi/pdf/10.1145/3539618.3591716",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174308.png",
    "importance": "emmm"
  },

  {
    "date": "2023-02-21",
    "title": "MMSSL",
    "description": "相当复杂的对比学习",
    "paperUrl": "https://arxiv.org/abs/2302.10632",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174402.png",
    "importance": "emmm"
  },

  {
    "date": "2022-11-13",
    "title": "FREEDOM",
    "description": "进一步简化 LATTICE + 动态图采样",
    "paperUrl": "https://arxiv.org/abs/2211.06924",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174439.png",
    "importance": "novel"
  },

  {
    "date": "2022-07-13",
    "title": "BM3",
    "description": "'高效'的对比学习",
    "paperUrl": "https://arxiv.org/abs/2207.05969",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174519.png",
    "importance": "emmm"
  },

  {
    "date": "2021-08-17",
    "title": "DualGNN",
    "description": "应用 User 共现图",
    "paperUrl": "https://jhyin12.github.io/Papers/TMM21%20DualGNN%20Dual%20Graph%20Neural%20Network%20for%20Multimedia%20Recommendation.pdf",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174600.png",
    "importance": "emmm"
  },

  {
    "date": "2021-04-19",
    "title": "LATTICE",
    "description": "首次尝试使用多模 kNN 图",
    "paperUrl": "https://arxiv.org/abs/2104.09036",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174720.png",
    "importance": "seminal"
  },

  {
    "date": "2019-01-01",
    "title": "MMGCN",
    "description": "图、文、音三路卷积然后合并",
    "paperUrl": "http://staff.ustc.edu.cn/~hexn/papers/mm19-MMGCN.pdf",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174815.png",
    "importance": "emmm"
  },

  {
    "date": "2015-10-06",
    "title": "VBPR",
    "description": "多模态首次用在协同过滤上, 图像特征拼接ID embedding",
    "paperUrl": "https://arxiv.org/abs/1510.01784",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703174854.png",
    "importance": "seminal"
  },

];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>