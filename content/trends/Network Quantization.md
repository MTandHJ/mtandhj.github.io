---
draft: false
title: "Network Quantization"
author: MTandHJ
tags:
  - Trend
  - Quantization
  - Low-Precision
---


- 网络量化主要分为三个主流方向:
    - **FQT:** Fully Quantized Quantization, 在训练时将权重, 梯度, 激活值以低精度表示.
    - **QAT:** Quantization-Aware Training, 通过一些训练, 使得推理量化更容易
    - **PTQ:** Post-Training Quantization, 推理量化, 无需反复训练

<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-05-02",
    "title": "Low-Precision Training of Large Language Models: Methods, Challenges, and Opportunities",
    "description": "Survey, 调研了一系列低精度训练方法",
    "paperUrl": "https://arxiv.org/abs/2505.01043",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703175040.png",
    "importance": "novel"
  },

  {
    "date": "2023-06-21",
    "title": "Training Transformers with 4-bit Integers",
    "description": "4-bit FQT, 针对 transformers 4-bit 量化提出了一系列解决方法",
    "paperUrl": "https://arxiv.org/pdf/2306.11987",
    "imageUrl": "",
    "importance": "novel"
  },

  {
    "date": "2023-06-01",
    "title": "AWQ",
    "description": "4-bit PTQ, 通过 Weight, Activation 的互补 Scaling 解决激活值的异常值",
    "paperUrl": "https://arxiv.org/abs/2306.00978",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703175234.png",
    "importance": "seminal"
  },

  {
    "date": "2021-12-19",
    "title": "LUQ",
    "description": "4-bit QAT, 通过 Logarithmic Unbiased Quantization 来更好地适应对数形状的梯度分布",
    "paperUrl": "https://arxiv.org/abs/2112.10769",
    "imageUrl": "",
    "importance": "emmm"
  },

  {
    "date": "2021-01-25",
    "title": "CPT",
    "description": "Cyclic Precision Training, 类似 CosineAnnealingWarmRestarts 的 Precision 循环机制",
    "paperUrl": "/posts/cpt/",
    "imageUrl": "",
    "importance": "novel"
  },

  {
    "date": "2020-06-01",
    "title": "Ultra-Low Precision 4-bit Training of Deep Neural Networks",
    "description": "4-bit FQT, 提出一种特殊的 FP4 format 以及 Grad Scale 机制来实现 4-bit 量化",
    "paperUrl": "https://proceedings.neurips.cc/paper_files/paper/2020/file/13b919438259814cd5be8cb45877d577-Paper.pdf",
    "imageUrl": "",
    "importance": "emmm"
  },

  {
    "date": "2019-04-26",
    "title": "SWALP",
    "description": "FQT, 通过 Stochastic Weight Averaging 稳定低精度训练",
    "paperUrl": "/posts/swalp",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250506174807.png",
    "importance": "emmm"
  },

  {
    "date": "2019-01-23",
    "title": "Backprop with Approximate Activations for Memory-efficient Network Training",
    "description": "针对使用 BatchNorm, ReLU 特殊的反向传播机制",
    "paperUrl": "https://arxiv.org/abs/1901.07988",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703175435.png",
    "importance": "emmm"
  },

  {
    "date": "2019-01-01",
    "title": "HAWQ",
    "description": "QAT, 通过首特征值确定 block 所需的 bitwidth, 并通过 multi-state fine-tuning 恢复精度",
    "paperUrl": "https://ieeexplore.ieee.org/document/9009512/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703175546.png",
    "importance": "emmm"
  },

  {
    "date": "2018-12-19",
    "title": "Training Deep Neural Networks with 8-bit Floating Point Numbers",
    "description": "8-bit FQT, 特殊的 FP8 格式 + Chunk-based accumulation + stochastic rounding",
    "paperUrl": "https://arxiv.org/abs/1812.08011",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703175653.png",
    "importance": "novel"
  },

  {
    "date": "2018-05-25",
    "title": "Range Batch Normalization",
    "description": "8-bit FQT, 改进低精度训练中 BN 的数值不稳定的问题",
    "paperUrl": "https://arxiv.org/abs/1805.11046",
    "imageUrl": "",
    "importance": "novel"
  },

  {
    "date": "2017-10-10",
    "title": "Mixed Precision Training",
    "description": "FQT, FP16 混合精度训练的开山之作",
    "paperUrl": "https://arxiv.org/abs/1710.03740",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703175742.png",
    "importance": "seminal"
  },

  {
    "date": "2017-02-10",
    "title": "INQ",
    "description": "QAT, 一步一步地量化网络",
    "paperUrl": "https://arxiv.org/abs/1702.03044",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703175813.png",
    "importance": "emmm"
  },

  {
    "date": "2015-02-09",
    "title": "Deep Learning with Limited Numerical Precision",
    "description": "深度学习中初步尝试低精度训练, 提出了很多 tricks",
    "paperUrl": "https://arxiv.org/abs/1502.02551",
    "imageUrl": "",
    "importance": "emmm"
  },

];
</script>

<!-- 使用defer属性延迟执行脚本，不阻塞页面渲染 -->
<script src="/js/timeline.js" defer></script>