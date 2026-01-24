---
draft: false
title: "Lightweight Optimizers"
author: MTandHJ
tags:
  - Trend
  - Optimizer
  - Lightweight
---

- Lightweight optimiers 的主要出发点是 Adam(W) 需要 2x model size 的状态存储, 实际使用时会消耗相当多的显存.
- 主流的改进策略是如何存储压缩后的状态, 可以是通过低精度的量化方法, 也可以是通过矩阵的低秩近似. 此外, 也有像 Lion 这样设计之初就更为轻量的方法.

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-09-27",
    "title": "8-bit Muon",
    "description": "轻量化的 Muon 优化器: Lienar or Dynamic quantization",
    "paperUrl": "http://arxiv.org/abs/2509.23106",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251010114521.png",
    "importance": "emmm"
  },

  {
    "date": "2024-12-27",
    "title": "Deepseek-v3",
    "description": "在大规模训练中采用了 BF16 的优化器",
    "paperUrl": "https://arxiv.org/abs/2412.19437",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703163736.png",
    "importance": "seminal"
  },

  {
    "date": "2024-12-15",
    "title": "GoLore",
    "description": "分析在小批次下 GaLore 对梯度的错误估计, 建议采用随机投影矩阵",
    "paperUrl": "http://arxiv.org/abs/2410.11289",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260124154419.png",
    "importance": "emmm"
  },

  {
    "date": "2024-07-11",
    "title": "Q-GaLore",
    "description": "对 GaLore 进一步施加低精度量化",
    "paperUrl": "/posts/q-galore/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507105629.png",
    "importance": "emmm"
  },

  {
    "date": "2024-06-24",
    "title": "Adam-Mini",
    "description": "发现 block-wise adaptive learning rate 的优势",
    "paperUrl": "https://arxiv.org/abs/2406.16793",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703163935.png",
    "importance": "novel"
  },

  {
    "date": "2024-05-24",
    "title": "MicroAdam",
    "description": "通过梯度稀疏化以及 error compensation 实现轻量的优化器",
    "paperUrl": "/posts/microadam/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507173052.png",
    "importance": "emmm"
  },

  {
    "date": "2024-04-03",
    "title": "BAdam",
    "description": "Block corrdinate descent 来节约显存开销",
    "paperUrl": "https://arxiv.org/abs/2404.02827",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703164123.png",
    "importance": "emmm"
  },

  {
    "date": "2024-03-06",
    "title": "GaLore",
    "description": "Low-rank state, 理论上等价于 LoRA",
    "paperUrl": "/posts/galore/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507104959.png",
    "importance": "novel"
  },

  {
    "date": "2023-09-04",
    "title": "4-bit Optimizer",
    "description": "Dynamic Exponent/Linear+",
    "paperUrl": "https://arxiv.org/abs/2309.01507",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703164238.png",
    "importance": "novel"
  },

  {
    "date": "2023-07-05",
    "title": "CAME",
    "description": "在 Adafactor 基础上引入置信度调节机制",
    "paperUrl": "http://arxiv.org/abs/2307.02047",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260124153244.png",
    "importance": "seminal"
  },

  {
    "date": "2023-02-13",
    "title": "Lion",
    "description": "符号梯度更新",
    "paperUrl": "https://arxiv.org/abs/2302.06675",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703164446.png",
    "importance": "seminal"
  },

  {
    "date": "2021-10-06",
    "title": "8-bit Optimizer",
    "description": "Block-wise Dynamic Exponent quantization",
    "paperUrl": "https://arxiv.org/abs/2110.02861",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703164519.png",
    "importance": "seminal"
  },

  {
    "date": "2021-02-04",
    "title": "1-bit Adam",
    "description": "本质上是 Adam 预训练 + 1-bit SGD",
    "paperUrl": "/posts/1-bit-adam/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507172614.png",
    "importance": "emmm"
  },

  {
    "date": "2019-05-23",
    "title": "BAGM",
    "description": "Blockwise Adaptive Learning Rate with Momentum",
    "paperUrl": "http://arxiv.org/abs/1905.09899",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260124153727.png",
    "importance": "emmm"
  },

  {
    "date": "2019-01-30",
    "title": "SM3",
    "description": "同一集合的状态共享 (集合可以是行和列的形式) ",
    "paperUrl": "https://arxiv.org/abs/1901.11150",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703164642.png",
    "importance": "novel"
  },

  {
    "date": "2018-04-11",
    "title": "Adafactor",
    "description": "row-wise, col-wise 的二阶状态, 以及一些自适应的改进",
    "paperUrl": "https://arxiv.org/abs/1804.04235",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703164731.png",
    "importance": "seminal"
  },

  {
    "date": "2014-01-01",
    "title": "1-bit SGD",
    "description": "将误差补偿用于梯度的 allreduce, 减小通信代价",
    "paperUrl": "/posts/1-bit-adam/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507172614.png",
    "importance": "seminal"
  },

];
</script>

<script src="/js/timeline.js"></script>