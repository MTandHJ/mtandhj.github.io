# Spec: Posts 目录拆分与模板规范化

## 目标

1. 将 `content/posts/` 下的内容按类型拆分到子目录, 便于本地管理;
2. 拆分后网页端仍统一通过 `/posts/xxx` 访问;
3. 为 Paper / Trial / Tutorial 三种类型定义 markdown 内容模板.

## 范围

### 目录拆分

现有 `content/posts/` 下 105 篇文章, 按第一个 tag 分为 5 类, 合并为 4 个子目录:

| 原类型 (首个 tag) | 新目录 | 新首个 tag | 数量 |
|---|---|---|---|
| Note | `content/posts/paper/` | Paper | 94 |
| Trial | `content/posts/trial/` | Trial | 5 |
| Doc, Math | `content/posts/tutorial/` | Tutorial | 7 |
| Life, TODO.md | `content/posts/life/` | Life | 2 |

涉及的文章列表:

- **Paper**: 所有首个 tag 为 `Note` 的文章 (排除 TODO.md), 共 94 篇
- **Trial**: `IS_EVERY_ITEM_WORTH_AN_EMBEDDING.md`, `Multi-Agent Recommender Systems.md`, `MULTIPLE_SEED_LAUNCHERS_FOR_DIVERSE_RETRIEVAL.md`, `On the Markovian Nature....md`, `Simba.md`
- **Tutorial**: `ECNU.md`, `Envs.md`, `Git.md`, `TreeSitter.md`, `Dirichlet Distribution.md`, `Laplace Transform.md`, `Sinkhorn Distance.md`
- **Life**: `Car.md`, `TODO.md`

### URL 保持

在 `hugo.toml` 中配置 permalinks 规则, 使所有子目录内容仍通过 `/posts/:contentbasename/` 访问:

```toml
[permalinks]
  posts = "/posts/:contentbasename/"
  slides = "/slides/:contentbasename/"
```

这样无论文件在 `content/posts/paper/` 还是 `content/posts/trial/`, URL 均为 `/posts/VQ-VAE/`.

### Front matter 变更

每篇文章的首个 tag 需更新:
- `Note` → `Paper` (TODO.md 除外, 其首个 tag 改为 `Life`)
- `Doc` / `Math` → `Tutorial`
- `Trial` / `Life` 保持不变
- `TODO.md`: 首个 tag 从 `Note` 改为 `Life`, 保留其 `layout: todo`, `datafile: "todo"`, `pinned: true` 等特殊 front matter

### 内容模板

#### Paper 模板

适用于论文阅读笔记.

```markdown
---
date: "YYYY-MM-DD"
draft: false
title: "Paper Title"
description: "一句话概括"
author: MTandHJ
tags:
  - Paper
  - <topic1>
  - <topic2>
  - Empirical | Theoretical | Seminal
  - <venue>
  - <year>
pinned: false
---

## 研究背景

<!-- 问题背景, 为什么重要, 解决什么问题 -->

## 核心思想

<!-- 核心方法/架构/公式 -->

## 关键洞察

<!-- 关键实验结果或主要结论 -->

## 继往开来

<!-- 表达一些个人的看法 -->

## 附录

<!-- 补充推导, 预备知识等 (可选) -->

## 参考文献

<ol class="reference">
  <li>
    Author(s)
    <u>Title.</u>
    <i>Venue</i>, Year.
    <a href="URL" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="URL" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
</ol>
```

**说明:**
- `研究背景` 和 `核心思想` 为必填段落
- `关键洞察` 为可选段落 (Empirical 类论文应有实验结果; Theoretical 类可为主要定理/结论)
- `继往开来` 为可选段落 (写一些论文潜在的影响和个人的观点)
- `附录` 为可选段落, 用于放置补充信息, 补充推导等
- `参考文献` 为必填段落
- 现有文章中 `预备知识` 段落应迁入 `研究背景`
- 现有文章中 `核心思想` 不变

#### Trial 模板

适用于实验性/探索性内容, 方案可能多版迭代.

```markdown
---
date: "YYYY-MM-DD"
draft: false
title: "Experiment Title"
description: "一句话概括"
author: MTandHJ
tags:
  - Trial
  - <topic1>
  - <topic2>
  - <year>
pinned: false
---

## 诡异源头

<!-- 实验动机/问题陈述 -->

## 拨云见日

<!-- 总体思路或假设 -->

## 灵光一现: <简要描述>

<!-- 方案设计与实验结果 -->

## 灵光二现: <简要描述>

<!-- 方案设计与实验结果 -->

<!-- ... 可继续添加更多尝试 -->

## 继往开来

<!-- 结论, TODO, 后续方向 -->
```

**说明:**
- `诡异源头` 和 `拨云见日` 为必填段落
- `灵光 N 现` 为可重复段落, 每次尝试可包含方案设计, 代码, 实验结果和发现
- `继往开来` 为必填段落


#### Tutorial 模板

适用于读书心得, 文档记录, 工具指南, 数学推导等.

```markdown
---
date: "YYYY-MM-DD"
draft: false
title: "Tutorial Title"
description: "一句话概括"
author: MTandHJ
tags:
  - Tutorial
  - <topic1>
  - <topic2>
pinned: false
---

<!-- 自由分段, 按内容自然组织 -->

## 参考文献

<ol class="reference">
  <li>
    ...
  </li>
</ol>
```

**说明:**
- 正文部分自由分段, 不强制结构
- `参考文献` 为可选段落 (有引用时添加)

### 模板文件

在每个子目录下放置 `_template.md`, 供新建文章时复制使用:

| 路径 | 用途 |
|---|---|
| `content/posts/paper/_template.md` | Paper 模板 |
| `content/posts/trial/_template.md` | Trial 模板 |
| `content/posts/tutorial/_template.md` | Tutorial 模板 |

`_template.md` 以 `_` 开头, Hugo 默认会忽略以下划线开头的文件, 不会将其渲染为页面.

## 约束

1. URL 兼容性: 拆分后所有文章的访问路径保持 `/posts/:contentbasename/` 不变, 不产生 404
2. 现有文章迁移: 仅移动文件位置和更新首个 tag, 不强制修改正文结构; 新文章遵循模板
3. `_index.md` 保留在 `content/posts/` 根目录
4. Hugo 版本需支持 `:contentbasename` permalink token

## 验收标准

1. `hugo` 构建成功, 无报错
2. 所有文章 URL 仍为 `/posts/:contentbasename/`, 与拆分前一致
3. 各子目录下文章的首个 tag 已更新 (Note→Paper, Doc/Math→Tutorial)
4. Paper / Trial / Tutorial 三种模板文件已创建
5. 现有文章可正常渲染, 内容无丢失

## 未决问题

1. 是否需要为 Paper 的 `附录` 段落设置更细致的规范 (如区分预备知识和补充推导)?
2. Trial 中代码较长时 (如现有 IS_EVERY_ITEM_WORTH_AN_EMBEDDING.md), 是否应将代码移至外部仓库链接而非内嵌?
3. Life 类型是否需要模板? (目前仅 1 篇, 暂不定义)

## 文档检查规范

后续对文章的修改需进行以下检查:

1. **正确性**: 内容, 公式, 代码, 链接等无错误
2. **一致性**: 术语, 命名, 格式前后一致
3. **标点符号**: 使用英文标点
4. **风格**: 简练直白
5. **缩进**: 使用 tab 符, 不使用空格