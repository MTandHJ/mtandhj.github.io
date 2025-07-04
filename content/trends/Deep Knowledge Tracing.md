---
draft: false
title: "Deep Knowledge Tracing"
author: MTandHJ
tags:
  - Trend
  - Knowledge Tracing
  - Education
---

- 知识追踪是智能教育中的一个重要课题: 根据学生的历史作答序列, 追踪学生的**知识掌握状态**, 判断习题的答对答错.

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2021-03-08",
    "title": "HawkesKT",
    "description": "借鉴 Hawkes Process 思想建模知识掌握的交叉影响和衰减",
    "paperUrl": "/posts/hawkeskt/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250704132814.png",
    "importance": "emmm"
  },

  {
    "date": "2020-02-14",
    "title": "SAINT",
    "description": "Encoder-decoder transformer 在 DKT 上的应用, 设计颇为奇怪",
    "paperUrl": "https://arxiv.org/abs/2002.07033",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703162056.png",
    "importance": "emmm"
  },

  {
    "date": "2019-10-29",
    "title": "SKVMN",
    "description": "DKVMN 的基础上用 LSTM 处理子系列",
    "paperUrl": "https://arxiv.org/abs/1910.13197",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703162220.png",
    "importance": "emmm"
  },

  {
    "date": "2019-07-16",
    "title": "SAKT",
    "description": "将 decoder-only transformer 应用于 DKT 上, 并提出习题/作答的 cross attention",
    "paperUrl": "/posts/sakt",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250401140515.png",
    "importance": "novel"
  },

  {
    "date": "2016-11-24",
    "title": "DKVMN",
    "description": "改进记忆网络 MANN 来实现对习题的概念和学生的掌握情况的一个动态建模",
    "paperUrl": "/posts/dkvmn",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250330174039.png",
    "importance": "novel"
  },

  {
    "date": "2015-06-19",
    "title": "DKT",
    "description": "将 RNN/LSTM 模型应用于 KT",
    "paperUrl": "/posts/dkt",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250327212027.png",
    "importance": "seminal"
  },

];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>