---
date: "2026-03-25"
draft: false
title: "SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?"
description: "SWE-Bench Pro"
author: MTandHJ
tags:
  - Paper
  - Code
  - AI Software Engineering
  - Benchmark
  - Empirical
  - 2025
pinned: false
---


## 研究背景

- (**AI Software Engineering**) AI Software Engineering 已经从简单的"提需求 -> 代码生成"过渡到了"独自攻克 Repository-level 问题".

- (**Issue & Pull Request**) 提问题并根据问题提交解决方案是 GitHub 最为广泛的场景之一. 其要求贡献者从庞大的仓库中 (庞大体现在文件架构以及代码量) 准确定位针对某个 issue 需要修改的代码块 (这要求模型具有相当的理解和检索能力) 并做出适当修改 (这要求模型具有相当的代码生成能力).

- (**SWE-Bench:**) [SWE-Bench](/posts/swe-bench/) 是一个广泛采用的衡量模型上述能力的 benchmark, 但是在现阶段暴露出了一些问题: 1. 数据泄露, 很多大模型可能已经见过相关语料; 2. 难度较低, 很多样本只需要通过几行代码就可以解决, 过于简单.

## 核心思想

![20260325153258](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260325153258.png)

- (**motivation:**) 如上图所示, SWE-Bench Verified 呈现出来如下的特点: 1. 分布不均, django 等仓库在提供的绝大部分的样例, 这可能导致某些特别擅长此类的模型占据优势; 2. 难度较低, 绝大部分样例仅需通过数行代码即可解决.

- (**SWE-Bench Pro:**) 本文所提出的 SWE-Bench Pro 包含 1865 个由人类验证过的问题:
    1. (**Public**) 731 个在 HuggingFace 中公开的样例;
    2. (**Commercial**) 276 个由于版权问题无法公开的样例, 但是作者团队会持续更新不同模型在其上的表现情况;
    3. (**Held-Out**) 单独摘出来 858 个和 **Public** 来自不同仓库的样例.

![20260325154131](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260325154131.png)

- 上图展示了, SWE-Bench Pro 所需同时修改的 files 数量以及 bug 的类型.

- 和 SWE-Bench 类似, 每条数据具有如下的属性:

| Field                         | Type     | Description                                                                 | Length / Notes                                  |
|------------------------------|----------|-----------------------------------------------------------------------------|--------------------------------------------------|
| repo                         | string   | Repository identifier (one of 11 repository classes)                        | —                                                |
| instance_id                  | string   | Unique identifier for each instance                                         | 65–120 characters                                |
| base_commit                  | string   | Git commit hash of the base version                                         | 40 characters                                    |
| patch                        | string   | The golden code patch / diff                                                | 1.44k – 180k characters                          |
| test_patch                   | string   | Test cases related to the patch                                             | 325 – 322k characters                            |
| problem_statement            | string   | Description of the issue being addressed                                    | 419 – 8.04k characters                           |
| requirements                 | string   | Project requirements or dependencies                                        | 124 – 6.7k characters (nullable)                 |
| interface                    | string   | API or interface specifications                                             | 1 – 12.2k characters (nullable)                  |
| repo_language                | string   | Programming language of the repository (one of 4 language classes)          | —                                                |
| fail_to_pass                 | string   | Test cases that should pass after patch application                         | 10 – 155k characters                             |
| pass_to_pass                 | string   | Test cases that should continue passing                                     | 2 – 532k characters                              |
| issue_specificity            | string   | Specificity of the issue                                                    | 12 – 77 characters                               |
| issue_categories             | string   | Categories or tags for the issue type                                       | —                                                |
| before_repo_set_cmd          | string   | Repo setup command for testing                                              | —                                                |
| selected_test_files_to_run   | string   | Files selected for testing                                                  | —                                                |


**注:** 因为 SWE-Bench Pro 要复杂得多, 因此作者团队提供 `requirements` 和 `interface` 来提供解决不确定性的额外信息.

## 参考文献

<ol class="reference">
  <li>
    Deng X., Da J., Pan E., He Y. Y., Ide C., Garg K., Lauffer N., Park A., Pasari N.,
    Rane C., Sampath K., Krishnan M., Kundurthy S., Hendryx S., Wang Z., Bharadwaj V.,
    Holm J., Aluri R., Zhang B., Liu N., and Kenstler B.
    <u>SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?</u>
    <i>arXiv</i>, 2025.
    <a href="https://arxiv.org/abs/2509.16941" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/scaleapi/SWE-bench_Pro-os" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

