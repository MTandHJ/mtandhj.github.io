---
date: "2025-03-16"
draft: false
title: "SWE-Bench: Can Language Models Resolve Real-World GitHub Issues?"
description: "SWE-Bench"
author: MTandHJ
tags:
  - Note
  - Code
  - AI Software Engineering
  - Benchmark
  - Empirical
  - ICLR
  - 2024
pinned: false
---


## 预备知识

- (**AI Software Engineering**) AI Software Engineering 已经从简单的"提需求 -> 代码生成"过渡到了"独自攻克 Repository-level 问题".

- (**Issue & Pull Request**) 提问题并根据问题提交解决方案是 GitHub 最为广泛的场景之一. 其要求贡献者从庞大的仓库中 (庞大体现在文件架构以及代码量) 准确定位针对某个 issue 需要修改的代码块 (这要求模型具有相当的理解和检索能力) 并做出适当修改 (这要求模型具有相当的代码生成能力).

![20260226121607](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226121607.png)

## 核心思想

### SWE-Bench 的构建

![20260226121736](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226121736.png)

- (**Repo selection and data scraping**) 从 12 个流行的开源 Python 库中爬取 90,000 PRs. 数据结构如下:
    1. <u>repo, base_commit, version</u>: 通过仓库名 'repo' 以及 commit ID 'base_commit' 可以定位具体的代码, 通过 'version' 可以进一步确认所需的安装环境 (SWE-Bench 假设只有 version 发生变更安装环境才有可能发生变更);
    2. <u>problem_statement</u>: 和 PR 相关的 issues 的描述的拼接;
    3. <u>patch</u>: PR 中的解决方案, 即 Gold Patch, 即 Ground Truth;
    4. <u>test_patch</u> 和该 PR 相关的测试用例, 通过应用该 test_patch 可以测试相关 solution 能够实现 issues/PR 所关心的功能.

![20260226135645](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226135645.png)

![20260226140844](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226140844.png)

- (**Attribute-based filtering**) 仅保留 'issue_numbers' 和 'test_patch' 非空的 PRs. 前者保证该实例存在明确的问题需求作为 context 提供给模型, 后者提供了明确的测试案例以方便后续对不同的 solution 进行实际的评估.

- (**Execution-based filtering**) 可用的实例应当通过如下的验证步骤:
    1. 根据 'version' 所对应的安装环境创建 conda 环境;
    2. 根据 'repo' 和 'base_commit' 定位到具体的代码;
    3. 应用 'test_patch' 至代码中;
    4. 运行测试脚本, 生成日志 $log_{pre}$;
    5. 应用 'patch' 至代码中;
    6. 运行测试脚本, 生成日志 $log_{post}$;
    7. 如果 'patch' 是 Gold Patch, 则 $log_{pre}$ 中部分 fail 的测试用例 (尤其是 'test_patch' 所对应的用例) 在 $log_{post}$ 中为 pass. 即 PR 实现了 fail to pass 的过程.

- 经过上述的过滤, 90,000 PRs 最后只剩下约 2,294 个任务实例, 构成了 SWE-Bench.

![20260226142140](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226142140.png)

#### SWE-Bench-Lite

- 由于 SWE-Bench 中每个实例的评估都需要配置环境, 跑测试用例, 因此相当耗时. 为了快速评估, 作者团队给出了一个轻量的版本: SWE-Bench-Lite, 包含 300 个测试用例.


### 基础实验

![20260226142529](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226142529.png)

![20260226144449](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226144449.png)

- (**步骤**):
    1. 类似上图左侧将 issues 以及对应代码块形成输入;
    2. 要求模型根据输入生成 patch, 如右侧所示;
    3. 将生成的 patch 按照类似上述的验证过程进行验证, 成功通过所有测试案例则得 1 分, 任何应用不成功或者案例不通过的得 0 分. 最后将通过率作为评测指标.

#### 代码块检索方式

- 由于完全的仓库的代码量过于庞大, 需要根据问题描述进行初步检索. 本文探究两种方式:
    1. **BM25 retrieval:** BM25 根据词频计算 query 和文档的相关性;
    2. **Oracle retrieval:** Oracle retrieval 直接根据 Gold Patch 定位所需修改的代码块, 在此背景下考验的是模型的代码生成能力.

![20260226143625](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226143625.png)

- (**定位准确性更为重要**) 当放宽上下文长度限制是, 可以通过 BM25 检索出更多可能的代码块, 然而如上表所示, 虽然召回率随着上下文长度不断增加, 实际的通过率反而是在下降的, 这很大可能是信息过于冗杂.

- Claude 2 在 Oracle retrieval 下能够解决 5.9%, 这说明了准确检索的重要性.


#### 生成特性

![20260226144151](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226144151.png)

- 目前的 LLM 在生成 patch 上倾向于采取 '简化' 的方式生成, 如上表所示, 生成的行数显著小于实际的. 一方面, 作者认为这可能和 LLM 的微调方式有关; 另一方面, 实际的 PR 往往不仅解决某个 issue, 还会考虑一些 future issues 从而导致代码量相对较多.

## 参考文献

<ol class="reference">
  <li>
    Jimenez C. E., Yang J., Wettig A.,
    Yao S., Pei K., Press O., Narasimhan K.
    <u>SWE-bench: Can Language Models Resolve Real-World GitHub Issues?</u>
    <i>ICLR</i>, 2024.
    <a href="http://arxiv.org/abs/2310.06770" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://www.swebench.com/" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

