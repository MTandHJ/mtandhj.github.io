# Inline Code 渲染修复

## 目标

修复博客中 inline code (`code`) 视觉表现不明显的问题, 使其呈现常见的 Markdown inline code 样式.

## 问题分析

当前 Tailwind Typography 插件对 inline code 的处理:
- 无背景色和内边距, 视觉上与正文区分度低
- `::before`/`::after` 伪元素插入了字面反引号字符, 导致 inline code 看起来和原始 Markdown 源码一样

相关 CSS 位于 `static/css/output.css` 第 816-828 行.

## 范围

- 仅处理 inline `<code>` (非 `<pre><code>` 代码块)
- 同时适配浅色/深色模式

## 验收标准

- inline code 具有浅色背景 + 等宽字体 + 小圆角 (浅色模式)
- inline code 具有深色背景 + 亮色文字 + 小圆角 (深色模式)
- 移除反引号伪元素 (`::before`/`::after` 的 `content: "\`"`)
- 代码块 (`<pre><code>`) 样式不受影响
- 与现有 `code-collapse.css` 和 `chroma.css` 无冲突

## 约束

- 仅修改自定义 CSS 文件 (如 `private.css`), 不修改 Tailwind 生成的 `output.css`
- 不引入新的依赖

## 未决问题

- 具体配色方案 (背景色、文字色、圆角大小) 待技术规划阶段确定