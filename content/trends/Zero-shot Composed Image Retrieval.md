---
draft: false
title: "Zero-shot Composed Image Retrieval"
author: MTandHJ
tags:
  - Trend
  - CIR
  - Zero-shot
---

- Composed Image Retrieval 任务是基于参考图片, 找到符合文本所反映意图和需求的匹配图片. 由于打标 (Image, Text, Target) 往往会消耗大量资源, 所以衍生出更为主流的 Zero-shot Composed Image Retrieval 任务.


<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-03-21",
    "title": "PrediCIR",
    "description": "通过裁剪数据增强更好的训练 Image feature -> Text token space 的 projector",
    "paperUrl": "http://arxiv.org/abs/2503.17109",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703202701.png",
    "importance": "emmm"
  },

  {
    "date": "2024-12-15",
    "title": "OSrCIR",
    "description": "通过多模态大模型实现一阶段的推理, 实现 Training-free Zero-shot CIR",
    "paperUrl": "https://arxiv.org/abs/2412.11077",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703202753.png",
    "importance": "emmm"
  },

  {
    "date": "2024-11-24",
    "title": "IP-CIR",
    "description": "Imagine and Seek: Improving Composed Image Retrieval with an Imagined Proxy",
    "paperUrl": "https://arxiv.org/abs/2411.16752",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703202829.png",
    "importance": "emmm"
  },

  {
    "date": "2024-05-01",
    "title": "Slerp",
    "description": "仅通过 image feature 和 text feature 间的球面线性插值即可取得 SoTA 效果",
    "paperUrl": "https://arxiv.org/abs/2405.00571",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703202854.png",
    "importance": "novel"
  },

  {
    "date": "2024-03-24",
    "title": "KEDs",
    "description": "额外利用 Caption",
    "paperUrl": "https://arxiv.org/abs/2403.16005",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703202945.png",
    "importance": "emmm"
  },

  {
    "date": "2023-12-14",
    "title": "Local Concept Re-ranking",
    "description": "除了通过大模型进行一般的 Training-free 的匹配, 还要求其识别出一些局部实体是否出现在候选图片中",
    "paperUrl": "https://arxiv.org/abs/2312.08924",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703203038.png",
    "importance": "emmm"
  },

  {
    "date": "2023-12-04",
    "title": "LinCIR",
    "description": "发现 Pic2Word 的方式缺乏多样性, 提出 Language-only training for CIR",
    "paperUrl": "https://arxiv.org/abs/2312.01998",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703203113.png",
    "importance": "novel"
  },

  {
    "date": "2023-02-06",
    "title": "Pic2Word",
    "description": "首次图片特征转换为 pseudo word token",
    "paperUrl": "https://arxiv.org/abs/2302.03084",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703203149.png",
    "importance": "seminal"
  },

];
</script>

<script src="/js/timeline.js"></script>