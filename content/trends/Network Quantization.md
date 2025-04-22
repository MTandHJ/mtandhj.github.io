---
date: "2025-04-22"
draft: false
title: "Network Quantization"
author: MTandHJ
tags:
  - Trend
  - Quantization
  - Low-bit
---


- **QAT:** Quantization-Aware Training
- **PTQ:** Post-Training Quantization

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2023-06-01",
    "title": "AWQ",
    "description": "4-bit PTQ, Weight, Activation 互补 Scaling",
    "paperUrl": "https://arxiv.org/abs/2306.00978",
    "importance": "seminal"
  },

  {
    "date": "2021-12-19",
    "title": "LUQ",
    "description": "4-bit QAT, Logarithmic Unbiased Quantization 应对对数形状的梯度分布",
    "paperUrl": "https://arxiv.org/abs/2112.10769",
    "importance": "emmm"
  },

  {
    "date": "2017-02-10",
    "title": "INQ",
    "description": "QAT, Incremental Network Quantization 逐步量化网络",
    "paperUrl": "https://arxiv.org/abs/1702.03044",
    "importance": "emmm"
  },

];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>