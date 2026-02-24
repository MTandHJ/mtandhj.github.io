---
date: "2026-02-24"
draft: false
title: "StarCoder"
description: "如何训练代码基模"
author: MTandHJ
tags:
  - Note
  - Code
  - AI Software Engineering
  - Empirical
pinned: false
---


## 预备知识

- (**研究现状**) StarCoder 开发过程中, 已经有很多代码生成的模型被提出了, 尤其是 Copilot 引发了相当大的反响: 一方面，其惊人的效果让人震撼; 另一方面, 大家开始关注模型训练中代码数据的版权问题和个人隐私问题.

## 核心思想

### StarCoder

||操作|
|:-:|:-:|
|编程语言选择| 1. 从 The Stack 的 358 种编程语言中选择 86 种; 2. 筛选出数据量 $\ge$ 500 MB 的编程语言或者该语言是 Top-50 流行的编程语言; 3. 移除 Nix, Puppet 等配置语言; 4. 保留 JSON 和 YAML, 但需要额外限制|
|Visual inspection| 借助社区力量过滤掉疑是纯数据或者 AI 生成的代码后缀|
|XML filter| Stack 根据文件后缀名来判断语言类型, 然而有些后缀 (如 .sld) 实际上存储的大部分都是 XML 数据, 因此 StarCoder 通过检查 "<?xml version=" 头来进行过滤|
|Alpha filter|很多文件中保存的都是纯数据 (如 .mat), 倘若内容中字母字符占比 $\le$ 25% 则认为是纯数据并移除|
|HTML| HTML 中往往有很多的数据, 仅保留那些纯 HTML code 占比 $\ge$ 20% 的|
|YAML| 仅保留 50-5000 字符大小的文件, 避免纯数据文件|
|JSON| 仅保留 50-5000 字符且字母占比 $\ge$ 50% 的文件, 避免引入纯数据|
|Jupyter| 1. 利用 Jupytext 将 notebook 转换为 scripts; 2. 将带有 Python/Markdown 的 notebook 转换为统一的 Markdown Block 和 Code Block|
|Github issues| 1. 移除自动生成的文本; 2. 移除 bots 的评论; 3. 保留参与讨论人数 $\ge$ 2 的; 4. 用 *fasttext* 移除非英语 issues|
|Git commits|1. 移除掉字符 $>$ 100k 的; 2. 按照 50% 的概率采样修改内容 $\le$ 2 行的; 3. 按照 10% 的概率采样修改内容 $\ge$ 200 行的; 4. 移除空的; 5. 对于数据格式的按照 50% 概率进行采样 |
|Deduplication| 利用 MinHashes 移除掉重复的内容|
|Personally Identifiable Information| 为了移除掉涉及隐私的数据, 训练一个 StarEncoder 用于诊断是否存在隐私|

### StarCoder2

- StarCoder2 在 Software Heritage (SH) archive 的基础上构建了 The Stack v2, 并利用很多额外数据用于训练 StarCoder2.

||操作|
|:-:|:-:|
|Pull Requests| 1. 移除由 bots 发起的, 仅包含 bots 评论的, 许可限制严格的, 项目明确不让收集的, 目标分支被更改的, 未被批准的, 缺少差异比较的; 2. 不考虑直接被删除或添加的, 长度超过 1M 字符的, 字母占比少于 25% 的, 16 进制字符占比大于 25% 的,  最大行数大于 100,000 行的, 平均行长大于 100 的, 最大行长大于 1000, 存在非英语文本的文件 ...|
|Kaggle Notebooks| 1. 移除少于 100 字符的; 2. 保留 Kaggle dataset 的 metadata; 3. 添加 `df.info()`|
|Documentation|从各大平台中爬取文档|
|Intermediate Representations|将编译器的中间表示作为代码数据补充|
|LHQ| 增加部分涉及 math 和 coding 的高质量公开数据集|
|其他语言数据集| Stackoverflow, ArXiv, Wikipedia, OpenWebMath|

- 考虑到不同模型能力的差异, StarCoder2 对于小模型 (3B, 7B) 仅提供 17 种编程语言的训练, 对于 15B 的模型提供 619 全部编程语言的训练.

## 参考文献

<ol class="reference">
  <li>
    Li R., et al.
    <u>StarCoder: may the source be with you!</u>
    <i>TMLR</i>, 2023.
    <a href="https://arxiv.org/abs/2305.06161" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/bigcode-project/starcoder" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>

  <li>
    Lozhkov A., et al.
    <u>StarCoder 2 and The Stack v2: The Next Generation</u>
    <i>arXiv</i>, 2024.
    <a href="https://arxiv.org/abs/2402.19173" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/bigcode-project/starcoder2" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>


  <!-- 添加更多文献条目 -->
</ol>

