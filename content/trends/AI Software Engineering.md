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
    "date": "2025-06-12",
    "title": "SWE-Factory",
    "description": "自动化 Repository-level 实例采集框架",
    "paperUrl": "https://arxiv.org/abs/2506.10954",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260227191906.png",
    "importance": "emmm"
  },

  {
    "date": "2025-05-26",
    "title": "SWE-Rebench",
    "description": "自动化 Repository-level 实例采集框架",
    "paperUrl": "https://arxiv.org/abs/2505.20411",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260228102730.png",
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
    "date": "2025-04-30",
    "title": "SWE-Smith",
    "description": "自动化 Repository-level 实例任务生成",
    "paperUrl": "/posts/swe-smith/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260227155336.png",
    "importance": "novel"
  },

  {
    "date": "2024-12-30",
    "title": "SWE-Gym",
    "description": "提供更丰富的 Repository-level 任务并验证训练 verifier models 的潜力",
    "paperUrl": "https://arxiv.org/abs/2412.21139",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260227105300.png",
    "importance": "emmm"
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
    "date": "2024-06-17",
    "title": "DeepSeek-Coder-V2",
    "description": "开源之光: 在 DeepSeek-V2 中间节点接续训练",
    "paperUrl": "https://arxiv.org/abs/2406.11931",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260225152510.png",
    "importance": "emmm"
  },

  {
    "date": "2024-05-06",
    "title": "SWE-Agent",
    "description": "定制化 Agent-Compute-Interface",
    "paperUrl": "/posts/swe-agent/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226180303.png",
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
    "date": "2024-01-25",
    "title": "DeepSeek-Coder",
    "description": "从零开始训练 Code 基模: NTP & FIM",
    "paperUrl": "https://arxiv.org/abs/2401.14196",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260225152228.png",
    "importance": "emmm"
  },

  {
    "date": "2023-10-10",
    "title": "SWE-Bench",
    "description": "Repository-level Benchmark",
    "paperUrl": "/posts/swe-bench/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226140844.png",
    "importance": "seminal"
  },

  {
    "date": "2023-05-13",
    "title": "CodeT5+",
    "description": "在 CodeT5 的基础上引入更丰富的训练任务, 并强调任务感知的推理路径",
    "paperUrl": "/posts/codet5/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260225185306.png",
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

  {
    "date": "2021-09-02",
    "title": "CodeT5",
    "description": "Encoder-Decoder 的 Code 基模: Masked Span Prediction (MSP)",
    "paperUrl": "/posts/codet5/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260225192436.png",
    "importance": "novel"
  },

];
</script>

<script src="/js/timeline.js"></script>