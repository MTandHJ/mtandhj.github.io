---
date: "2025-04-22"
draft: false
title: "Lightweight Optimizers"
author: MTandHJ
tags:
  - Trend
  - Optimizer
  - Lightweight
---

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2024-12-27",
    "title": "Deepseek-v3",
    "description": "在大规模训练中采用了 BF16 的优化器",
    "paperUrl": "https://arxiv.org/abs/2412.19437",
    "importance": "seminal"
  },

  {
    "date": "2024-06-24",
    "title": "Adam-Mini",
    "description": "发现 block-wise adaptive learning rate 的优势",
    "paperUrl": "https://arxiv.org/abs/2406.16793",
    "importance": "novel"
  },

  {
    "date": "2024-04-03",
    "title": "BAdam",
    "description": "Block corrdinate descent 来节约显存开销",
    "paperUrl": "https://arxiv.org/abs/2404.02827",
    "importance": "emmm"
  },

  {
    "date": "2024-03-06",
    "title": "GaLore",
    "description": "Low-rank state, 理论上等价于 LoRA",
    "paperUrl": "https://arxiv.org/abs/2403.03507",
    "importance": "novel"
  },

  {
    "date": "2023-09-04",
    "title": "4-bit Optimizer",
    "description": "Dynamic Exponent/Linear+",
    "paperUrl": "https://arxiv.org/abs/2309.01507",
    "importance": "novel"
  },

  {
    "date": "2023-02-13",
    "title": "Lion",
    "description": "符号梯度更新",
    "paperUrl": "https://arxiv.org/abs/2309.01507",
    "importance": "seminal"
  },

  {
    "date": "2021-10-06",
    "title": "8-bit Optimizer",
    "description": "Block-wise Dynamic Exponent quantization",
    "paperUrl": "https://arxiv.org/abs/2110.02861",
    "importance": "seminal"
  },

  {
    "date": "2021-02-04",
    "title": "1-bit Adam",
    "description": "本质上是 Adam 预训练 + 1-bit SGD",
    "paperUrl": "https://arxiv.org/abs/2102.02888",
    "importance": "emmm"
  },

  {
    "date": "2019-01-30",
    "title": "SM3",
    "description": "同一集合的状态共享 (集合可以是行和列的形式) ",
    "paperUrl": "https://arxiv.org/abs/1901.11150",
    "importance": "novel"
  },

  {
    "date": "2018-04-11",
    "title": "Adafactor",
    "description": "row-wise, col-wise 的二阶状态, 以及一些自适应的改进",
    "paperUrl": "https://arxiv.org/abs/1804.04235",
    "importance": "seminal"
  },

  {
    "date": "2014-01-01",
    "title": "1-bit SGD",
    "description": "将误差补偿用于梯度的 allreduce, 减小通信代价",
    "paperUrl": "row-wise, col-wise 的二阶状态",
    "importance": "seminal"
  },


];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>