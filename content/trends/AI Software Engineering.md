---
draft: false
title: "AI Software Engineering"
author: MTandHJ
tags:
  - Trend
  - AI Software Engineering
---

- AI Software Engineering 是深度学习 (LLM 为主) 的一个重要的应用场景. 区别于一般的 Function-level 的代码生成, AI Software Engineering 旨在实现 LLM 在 Repository-level 甚至更为复杂问题上的工程实践. 其核心难点在于: 长上下文理解, 逻辑保持与代码风格统一等.

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-12-27",
    "title": "GraphLocator",
    "description": "如何根据 issue 准确定位相关代码: Code Graph -> Causal Issue Graph",
    "paperUrl": "/posts/graphlocator/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260225115311.png",
    "importance": "emmm"
  },

  {
    "date": "2025-05-22",
    "title": "Code Graph Model (CGM)",
    "description": "Code Graph & Graph Attention Mask",
    "paperUrl": "/posts/cgm/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251207205526.png",
    "importance": "novel"
  },

  {
    "date": "2024-10-03",
    "title": "RepoGraph",
    "description": "通过 Repository-level 的 Code Graph 实现更为高效的工程代码生成",
    "paperUrl": "/posts/repograph/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251207160053.png",
    "importance": "novel"
  },

  {
    "date": "2024-02-29",
    "title": "StarCoder2",
    "description": "构建 The Stack v2 并提出更广泛的数据选择和训练",
    "paperUrl": "/posts/starcoder/",
    "imageUrl": "",
    "importance": "emmm"
  },

  {
    "date": "2023-05-09",
    "title": "StarCoder",
    "description": "在 The Stack 基础上筛选高质量数据、过滤隐私敏感数据",
    "paperUrl": "/posts/starcoder/",
    "imageUrl": "",
    "importance": "emmm"
  },

];
</script>

<script src="/js/timeline.js"></script>