---
date: "2025-12-06"
draft: false
title: "Think-on-Graph: Deep and Responsible Reasoning of Large Language Model on Knowledge Graph"
description: "在知识图谱上实现 LLM, KG 的交替推理"
author: MTandHJ
tags:
  - Note
  - LLM
  - Reasoning
  - Empirical
  - ICLR
  - 2024
pinned: false
---


## 预备知识

- (**Reasoning**) LLM 依赖 CoT (Chain-of-Thought) 等 reasoning 方式来实现较为精确的推理. 然而, 凭借 LLM 内蕴的知识, 往往难以避免幻觉问题 (既然 LLM 本身学习到的知识往往是 "过时" 的).

- (**Knowledge Graph (KG)**) 因而, 很多方法试图接触外部知识 (KG or 数据库) 来作为 LLM 的一个补充. 一种常见的方式是:
    1. 由 LLM 判断当前 context 是否足够进行回答;
    2. 倘若不能, 由 LLM 生成一段查询语句, 在 KG or 数据库中进行查询;
    3. 基于数据库查询的结果, LLM 继续进行推理.


## 核心思想

![20251206203115](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251206203115.png)

- (**LLM $\oplus$ KG**) 作者称上面这种方式为 LLM $\oplus$ KG, 即 LLM 和 KG 可以看作是两个独立的组件, 二者存在微弱的联系. 这种方式的问题就是, 由于 LLM 并不知道 KG 的完整内容, 因此难以直接生成非常贴切的查询语句, 导致最后往往不能检索出有效信息.

- (**LLM $\otimes$ KG**) 因此作者提出 Think-on-Graph (本质上这是一种特殊的 Beam Search). 假设我们在图上推理的时候落到 KG 的某个节点(某条边)上, 由此往下会有多个相邻关系(节点), 显然由于计算开销的限制, 我们不能一一尝试, 具体选择哪些方向由 LLM 决定 (对于 LLM $\oplus$ KG, "路径"在看到这些相邻信息前基本上就已经决定了, 因此在需要多跳推理的效果会比较差).

![20251206204310](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251206204310.png)


## 参考文献

<ol class="reference">
  <li>
    Sun J., Xu C., Tang L., Wang S., Lin C.
    Gong Y., Ni L. M., Shum H. and Guo J.
    <u>Think-on-Graph: Deep and Responsible Reasoning of Large Language Model on Knowledge Graph.</u>
    <i>ICLR</i>, 2024.
    <a href="http://arxiv.org/abs/2307.07697" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/IDEA-FinAI/ToG" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

