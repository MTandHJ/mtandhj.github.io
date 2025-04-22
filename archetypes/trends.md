---
date: "{{ .Date }}"
draft: true
title: "{{ replace .Name "-" " " | title }}"
author: MTandHJ
tags:
  - Timeline
---

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
// 使用ISO格式的日期（YYYY-MM-DD）进行排序
// 数据会按年份（降序）自动分组和排序
// 重要性分为三级：seminal（开创性）、novel（创新性）、emmm（一般）
window.timelineData = [
  {
    "date": "2023-01-15",   // 日期格式：YYYY-MM-DD
    "title": "开创性论文标题",
    "description": "论文的详细描述，可以包含一句话概括论文的主要贡献或创新点。",
    "paperUrl": "https://arxiv.org/abs/论文链接",
    "importance": "seminal"  // 标记为开创性论文（最高重要级别）
  },
  {
    "date": "2023-03-20",
    "title": "创新性论文标题",
    "description": "论文的详细描述，简要介绍其方法和贡献。",
    "paperUrl": "https://arxiv.org/abs/另一篇论文链接",
    "importance": "novel"    // 标记为创新性论文（中等重要级别）
  },
  {
    "date": "2023-04-10",
    "title": "一般重要论文标题",
    "description": "论文的详细描述，介绍其内容。",
    "paperUrl": "https://arxiv.org/abs/第三篇论文链接",
    "importance": "emmm"     // 标记为一般重要论文（较低重要级别）
  },
  {
    "date": "2022-12-05",
    "title": "普通论文标题",
    "description": "论文的详细描述，简要总结其创新点。",
    "paperUrl": "https://arxiv.org/abs/更早的论文链接"
    // 不添加 importance 字段表示普通论文
  }
];
</script>

<script src="/js/timeline.js"></script> 