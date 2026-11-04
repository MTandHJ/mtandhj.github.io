---
draft: false
title: "AI for Education"
author: MTandHJ
tags:
  - Trend
  - Knowledge Tracing
  - Education
datafile: "ai-for-education"
---

![20261104153311](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20261104153311.png)

- 智能教育旨在利用 AI 实时追踪学生学习状态, 诊断出知识掌握的薄弱环节, 个性化地设计学习计划并给予有效反馈, 从而衍生出诸如知识追踪 (Knowledge Tracing), 认知诊断 (Cognitive Diagnosis) 等子课题. LLM 的快速发展进一步让人看到它作为个性化教学系统的潜力, 逐步成为新的研究热点.

- 一般来说, 智能教育尤其是知识追踪的问题限定在学生的作答 $(q, \{c\}, r, t)$:
  - $q$: question;
  - $\{c\}$: 问题 $q$ 所对应的知识点;
  - $r \in \{0, 1\}$: 该学生在该题上的作答正确与否;
  - $t$: timestamp.

  通过学生的连续作答序列, 我们希望定位学生对于各知识点的掌握情况变化, 并据此设计进一步的学习计划 (比如推荐更合适的习题).