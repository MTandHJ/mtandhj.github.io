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
    "date": "2025-11-10",
    "title": "Can LLM Annotations Replace User Clicks for Learning to Rank?",
    "description": "探究 LLM 标注检索网页相关性的可行性, 并发现所得数据与正常数据为分属不同频段的信号",
    "paperUrl": "",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251112150550.png",
    "importance": "emmm"
  },

  {
    "date": "2025-10-09",
    "title": "SymTime",
    "description": "时间序列数据生成: 符号表示 & ARMA 统计模型",
    "paperUrl": "http://arxiv.org/abs/2510.08445",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251012164600.png",
    "importance": "emmm"
  },

  {
    "date": "2025-09-12",
    "title": "RecoWorld",
    "description": "Meta 的推荐仿真环境构建指南 (User Simulator & Agentic RecSys)",
    "paperUrl": "http://arxiv.org/abs/2509.10397",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251030143006.png",
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

  {
    "date": "2025-07-02",
    "title": "The Future is Agentic: Definitions, Perspectives, and Open Challenges of Multi-Agent Recommender Systems",
    "description": "Multi-Agent 推荐系统的形式化介绍: 定义; 区别; 应用; 挑战",
    "paperUrl": "/posts/multi-agent-recommender-systems/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251230134038.png",
    "importance": "novel"
  },

  {
    "date": "2023-06-05",
    "title": "RecAgent",
    "description": "基于认知科学实现推荐用户仿真, 并以此探究信息茧房、从众心理等现象",
    "paperUrl": "/posts/recagent",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251230172332.png",
    "importance": "novel"
  },

  {
    "date": "2022-06-22",
    "title": "Synthetic Data-Based Simulators for Recommender Systems: A Survey",
    "description": "调研了不同推荐仿真平台设计的目标和范围",
    "paperUrl": "http://arxiv.org/abs/2206.11338",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260102164145.png",
    "importance": "emmm"
  },

  {
    "date": "2021-09-14",
    "title": "Simulations in Recommender Systems: An industry perspective",
    "description": "比较现有推荐仿真平台的优劣并总结了三条仿真需要遵循的准则",
    "paperUrl": "http://arxiv.org/abs/2109.06723",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260104144643.png",
    "importance": "emmm"
  },

  {
    "date": "2019-09-26",
    "title": "RecSim",
    "description": "Google 提出的基于 RL 的推荐仿真平台",
    "paperUrl": "http://arxiv.org/abs/1909.04847",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260102151244.png",
    "importance": "emmm"
  },

  {
    "date": "2018-05-25",
    "title": "Virtual-Taobao",
    "description": "阿里提出的基于 RL 和 GAN 的推荐仿真平台",
    "paperUrl": "http://arxiv.org/abs/1805.10000",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260102151533.png",
    "importance": "emmm"
  },

];
</script>

<script src="/js/timeline.js"></script>