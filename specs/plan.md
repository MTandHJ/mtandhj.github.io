# Inline Code 渲染修复 - 技术规划

## 方案

在 `private.css` 中添加覆盖规则, 利用 CSS 优先级覆盖 Tailwind Typography 的 inline code 样式.

### 修改文件

`static/css/private.css`

### 具体规则

1. **移除反引号伪元素** — 将 `::before`/`::after` 的 `content` 重置为 `none`
2. **添加背景色 + 内边距 + 圆角** — 浅色/深色模式分别处理
3. **排除 `<pre><code>`** — 用 `:not(pre code)` 选择器确保代码块不受影响

### 配色方案

参考 GitHub 的 inline code 风格, 与博客现有 `code-collapse.css` 中代码块背景色 (`#f8f8f8` / `#1a1a1a`) 协调:

| 属性 | 浅色模式 | 深色模式 |
|------|----------|----------|
| 背景色 | `#eff1f3` | `#2d333b` |
| 文字色 | `#1f2328` | `#adbac7` |
| 圆角 | `6px` | `6px` |
| 内边距 | `0.2em 0.4em` | `0.2em 0.4em` |

### CSS 实现

```css
/* Inline code style */
.prose code:not(pre code) {
    background-color: #eff1f3;
    color: #1f2328;
    border-radius: 6px;
    padding: 0.2em 0.4em;
    font-weight: 400;
}

.prose code:not(pre code)::before,
.prose code:not(pre code)::after {
    content: none;
}

.dark .prose code:not(pre code) {
    background-color: #2d333b;
    color: #adbac7;
}
```

### 优先级分析

- `private.css` 在 `output.css` 之后加载 (header.html 中顺序), 同优先级下后者覆盖前者
- `.prose code:not(pre code)` 与 `.prose :where(code)` 同为单类选择器, 但 `:not(pre code)` 不降权, 且 `private.css` 加载更晚, 可覆盖
- `font-weight: 400` 覆盖 Typography 默认的 `600`, 避免加粗与背景叠加造成视觉过重
- `code-collapse.css` 中 `.prose pre code { color: inherit !important }` 不受影响, 因为 `:not(pre code)` 排除了 pre 内的 code

### 不修改的文件

- `output.css` — Tailwind 生成文件, 不手动修改
- `code-collapse.css` — 仅处理 pre/code 块, 无冲突
- `chroma.css` — 仅处理语法高亮, 无冲突

## 验证方式

1. 启动 Hugo 本地服务器 (`hugo server`)
2. 检查包含 inline code 的文章页面:
   - 浅色模式: inline code 有浅灰背景, 深色文字, 圆角, 无反引号
   - 深色模式: inline code 有深色背景, 浅色文字, 圆角, 无反引号
3. 确认代码块 (`<pre><code>`) 样式未受影响
4. 确认标题/链接中的 inline code 也正常显示