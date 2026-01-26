---
draft: false
title: "Zeroth-order Optimization"
author: MTandHJ
tags:
  - Trend
  - Zeroth-Order
  - Optimization
---

- 零阶优化进通过前向传播估计有效的更新方向, 极大避免了梯度下降所导致的巨大显存和计算开销. 当然, 如何保证可靠的收敛性依然是棘手的问题.


<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2023-05-27",
    "title": "MeZO",
    "description": "微调阶段的零阶优化以及低秩收敛理论",
    "paperUrl": "/posts/mezo/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260125165102.png",
    "importance": "novel"
  },

];
</script>

<script src="/js/timeline.js"></script>