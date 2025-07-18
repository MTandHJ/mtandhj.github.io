---
draft: false
title: "Spectral Graph Neural Networks"
author: MTandHJ
tags:
  - Trend
  - GNN
  - Spectral
---

- 谱图神经网络发展已有相当长的时间, 有趣的是, 在传统的图社区中谱图神经网络往较复杂的系数可学习的方向推进, 而在图协同过滤领域, 则是往极简甚至是退化到谱分解的方向前进.

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-05-01",
    "title": "ChebyCF",
    "description": "基于 Chebyshev 多项式, 多项式通过插值得到 (正主是 ChebNetII)",
    "paperUrl": "https://arxiv.org/abs/2505.00552",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703195356.png",
    "importance": "emmm"
  },

  {
    "date": "2024-04-18",
    "title": "ReSN",
    "description": "理论分析了低频与流行度的关系, 探究了训练过程中的变化, 并提出了一种谱正则化工具",
    "paperUrl": "https://arxiv.org/abs/2404.12008",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703195534.png",
    "importance": "novel"
  },

  {
    "date": "2023-12-14",
    "title": "DSF",
    "description": "可学习的 Layer weights (per node)",
    "paperUrl": "https://arxiv.org/abs/2312.09041",
    "imageUrl": "",
    "importance": "emmm"
  },

  {
    "date": "2023-06-06",
    "title": "JGCF",
    "description": "JacobiConv 在协同过滤上的应用, 对于频谱的定量分析比较有意思",
    "paperUrl": "https://arxiv.org/abs/2306.03624",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703195655.png",
    "importance": "novel"
  },

  {
    "date": "2023-02-24",
    "title": "FavardGNN",
    "description": "可学习的最优多项式基",
    "paperUrl": "https://arxiv.org/abs/2302.12432",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703195812.png",
    "importance": "novel"
  },

  {
    "date": "2022-11-17",
    "title": "BSPM",
    "description": "基于谱分解的协同过滤, 蹭了扩散模型的热度",
    "paperUrl": "https://arxiv.org/abs/2211.09324",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703195854.png",
    "importance": "novel"
  },

  {
    "date": "2022-08-26",
    "title": "SVD-GCN",
    "description": "基于谱分解的协同过滤",
    "paperUrl": "https://arxiv.org/abs/2208.12689",
    "imageUrl": "",
    "importance": "emmm"
  },

  {
    "date": "2022-06-10",
    "title": "Understanding convolution on graphs via energies",
    "description": "从 Dirichlet energy 角度理解 GNN 的 smoothing 和 sharpening",
    "paperUrl": "https://arxiv.org/pdf/2206.10991",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200135.png",
    "importance": "novel"
  },

  {
    "date": "2022-05-23",
    "title": "JacobiConv",
    "description": "Jacobi 多项式为基础的 Spectral GNN",
    "paperUrl": "https://arxiv.org/abs/2205.11172",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200241.png",
    "importance": "emmm"
  },

  {
    "date": "2022-04-24",
    "title": "GDE",
    "description": "基于谱分解的协同过滤, 同时强调高频的重要性",
    "paperUrl": "https://arxiv.org/abs/2204.11346",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200314.png",
    "importance": "novel"
  },

  {
    "date": "2022-02-04",
    "title": "ChebyNetII",
    "description": "分析 ChebyNet 的训练问题并改进",
    "paperUrl": "https://arxiv.org/abs/2202.03580",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200449.png",
    "importance": "emmm"
  },

  {
    "date": "2022-01-01",
    "title": "PA-GNN",
    "description": "可学习的 Layer weights (per node)",
    "paperUrl": "https://dynn-icml2022.github.io/spapers/paper_6.pdf",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200516.png",
    "importance": "emmm"
  },

  {
    "date": "2021-10-28",
    "title": "UltraGCN",
    "description": "协同过滤, 强调低频的重要性",
    "paperUrl": "https://arxiv.org/abs/2110.15114",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/%0D%0A%0D%0A.png",
    "importance": "novel"
  },

  {
    "date": "2021-08-07",
    "title": "GF-CF",
    "description": "重燃基于谱分解的协同过滤, 强调低频的重要性",
    "paperUrl": "https://arxiv.org/abs/2108.07567",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200647.png",
    "importance": "seminal"
  },

  {
    "date": "2021-07-05",
    "title": "Elastic GNN",
    "description": "L2 的图正则化推广到 Elastic 正则",
    "paperUrl": "https://arxiv.org/abs/2107.06996",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200743.png",
    "importance": "emmm"
  },

  {
    "date": "2021-01-28",
    "title": "Interpreting and Unifying Graph Neural Networks with An Optimization Framewor",
    "description": "统一的图则化框架",
    "paperUrl": "https://arxiv.org/abs/2101.11859",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200821.png",
    "importance": "novel"
  },

  {
    "date": "2020-10-27",
    "title": "C&S",
    "description": "Label propagation",
    "paperUrl": "https://arxiv.org/abs/2010.13993",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703200910.png",
    "importance": "emmm"
  },

  {
    "date": "2020-10-05",
    "title": "A Unified View on Graph Neural Networks as Graph Signal Denoising",
    "description": "统一的图则化框架",
    "paperUrl": "https://arxiv.org/abs/2010.01777",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703201033.png",
    "importance": "novel"
  },

  {
    "date": "2020-02-06",
    "title": "LightGCN",
    "description": "协同过滤上的图神经网络的简化",
    "paperUrl": "https://arxiv.org/abs/2002.02126",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703201115.png",
    "importance": "seminal"
  },

  {
    "date": "2020-01-14",
    "title": "GPR-GNN",
    "description": "可学习 Layer weights",
    "paperUrl": "https://arxiv.org/abs/2006.07988",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703201151.png",
    "importance": "emmm"
  },

  {
    "date": "2019-02-19",
    "title": "SGC",
    "description": "图神经网络的简化",
    "paperUrl": "https://arxiv.org/abs/1902.07153",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703201220.png",
    "importance": "novel"
  },

  {
    "date": "2018-10-14",
    "title": "APPNP",
    "description": "PageRank for GCN",
    "paperUrl": "https://arxiv.org/abs/1810.05997",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703201248.png",
    "importance": "novel"
  },

  {
    "date": "2016-09-09",
    "title": "GCN",
    "description": "GCN 开山之作",
    "paperUrl": "https://arxiv.org/abs/1609.02907",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703201503.png",
    "importance": "seminal"
  },

  {
    "date": "2016-06-30",
    "title": "ChebyNet",
    "description": "Chebyshev 多项式为基础的 Spectral GNN",
    "paperUrl": "https://arxiv.org/abs/1606.09375",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703201556.png",
    "importance": "seminal"
  },

  {
    "date": "2014-03-05",
    "title": "Signal denoising on graphs via graph filtering",
    "description": "图正则化用于去噪",
    "paperUrl": "https://ieeexplore.ieee.org/document/7032244",
    "imageUrl": "",
    "importance": "emmm"
  },

  {
    "date": "2013-12-21",
    "title": "Locally-connected/Spectral Networks",
    "description": "引入图上卷积的开山之作",
    "paperUrl": "https://arxiv.org/abs/1312.6203",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703202242.png",
    "importance": "seminal"
  },

  {
    "date": "2003-06-01",
    "title": "Learning with Local and Global Consistency",
    "description": "图正则化用于半监督学习",
    "paperUrl": "https://proceedings.neurips.cc/paper_files/paper/2003/file/87682805257e619d49b8e0dfdc14affa-Paper.pdf",
    "imageUrl": "",
    "importance": "seminal"
  },

];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>