---
draft: false
title: "Data Simulation"
author: MTandHJ
tags:
  - Trend
  - Simulation
---

- 很多领域既难以采集大量的高质量数据, 又难以找到一个统一高效的无监督路径, 数据仿真是一条可行之路. 数据仿真不同于数据增强, 它并不是在原有数据上的闪转腾挪, 而是认为构造了截然不同的数据源. 显然, 这种方式可能面临严重的分布偏移问题.

- 数据仿真有两条潜在的路径: 1. 传统的基于物理模型的; 2. 基于 LLM 的仿真. 后者往往是一个跨学科 (心理学, 认知科学等) 的具有巨大挑战的问题.

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-10-09",
    "title": "SymTime",
    "description": "时间序列数据生成: 符号表示 & ARMA 统计模型",
    "paperUrl": "http://arxiv.org/abs/2510.08445",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251012164600.png",
    "importance": "emmm"
  },

  {
    "date": "2025-09-23",
    "title": "The Indispensable Role of User Simulation in the Pursuit of AGI",
    "description": "初步说明了用户仿真的重要性和挑战",
    "paperUrl": "http://arxiv.org/abs/2509.19456",
    "imageUrl": "",
    "importance": "emmm"
  },

];
</script>

<script src="/js/timeline.js"></script>