---
date: "2025-12-07"
draft: false
title: "Code Graph Model (CGM): A Graph-Integrated Large Language Model for Repository-Level Software Engineering Tasks"
description: "Code Graph & Graph Attention Mask"
author: MTandHJ
tags:
  - Note
  - AI Software Engineering
  - Code Graph
  - Empirical
  - NeurIPS
  - 2025
pinned: false
---


## 预备知识

- (**AI Software Engineering**) 随着大模型 (LLM) 的日益发展进步, 一般的 Function-level Coding Problem (e.g., "Write a python function to find the first repeated character in a given string") 已经完全可以交由 LLM 完成. 然而, 工业生产中的问题要复杂的多, 至少是 Repository-level Coding Problem: 由多个文件构成. 遇到的实际问题往往是需要添加某一个功能, 或者修改某一个 Bug. 这要求 LLM 1) 定位出所需要修改的位置 (File & Lines); 2) 根据整个 Repository (相当长的 Context) 来生成合适的代码.

## 核心思想

![20251207204141](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251207204141.png)

- (**Code Graph**) CGM 采用如下方式构建 Code Graph $G = (V, E)$:
    1. 首先是当前 Repository 按照类似文件系统的方式构建树 (solid edge 表示包含关系);
    2. 利用 dashed edges 表示实体间的 reference dependencies (e.g., class inheritance, function calls, module imports).
    3. 每个节点记录 content, line range 等属性.

- (**Semantic Information**) CGM 利用 CodeT5+ 将对每个节点进行预处理, 得到每个节点的向量表示.

- (**CGM, Code Graph Model**):
    1. Code Graph Model 以 QWen-2.5 72B 为基模, 进行 LoRA 微调.
    2. **输入:** (I) 通过上述方式得到的 (sub) Code Graph 的节点向量表示 (顺序无关), 这些表示需要通过一个 Adaptor (可训练); (II) 图中节点所对应的具体的代码文件 (按照文件结构的拓扑结构排序), 同一文件中的代码按照行号正常排序.
    3. **Graph Attention Mask.** Code Graph 部分不采用传统的 Causal Attention, 按照 Code Graph 的邻接矩阵进行 mask.

![20251207205526](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251207205526.png)

- 因此, CGM 修复一个 Bug 的流程如下:
    1. **Rewriter (Qwen2.5-72B-instruct):** Extractor 确定 ISSUE 的关键元素: 文件名, 函数名等. Inferer 在此基础上进行进一步润色, 添加具体的功能描述.
    2. **Retriever (CGE-Large model):** 在 Rewriter 给定信息的基础上, Retriever 抽出一个合适的 subgraph 用于后续推理.
    3. **Reranker (Qwen2.5-72B-instruct):** 通过上述方式可能选中相当多的代码文件, 这会导致 context 变得相当冗长, reranker 进一步筛选出 Top-K 最相关的.
    4. **Reader (finetuned Qwen2.5-72B):** 将 subgraph 和选中的文件作为输入, CGM 进行代码生成.


## 参考文献

<ol class="reference">
  <li>
    <u>Code Graph Model (CGM): A Graph-Integrated Large Language Model for Repository-Level Software Engineering Tasks.</u>
    <i>NeurIPS</i>, 2025.
    <a href="https://github.com/codefuse-ai/CodeFuse-CGM" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="http://arxiv.org/abs/2505.16901" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

