
## 任务清单：项目代码清理

> 核心约束: 现有功能必须保持一致. 每项完成后需人工验证.

| # | 阶段 | 任务 | 状态 |
|---|------|------|------|
| 0-1 | 0 杂项 | .gitignore 修正与补全 | DONE |
| 0-2 | 0 杂项 | 清理 main.js console.log | DONE |
| 0-3 | 0 杂项 | CI 移除 Dart Sass 安装 | DONE |
| 1-1 | 1 模板 | 提取 post-card.html partial | DONE |
| 1-2 | 1 模板 | 提取 pagefind-meta.html partial | DONE |
| 1-3 | 1 模板 | KaTeX 定界符配置去重 | N/A (两处上下文转义规则不同, 无法安全共享) |
| 2-1 | 2 合并 | timeline.js + todo.js → timelines.js | DONE |
| 2-2 | 2 合并 | timeline.css + todo.css → timelines.css | DONE |
| 2-3 | 2 合并 | slides.js 激光笔拆分为 slides-laser.js | N/A (拆分后全屏功能异常, 回退保持原文件) |
| 3-1 | 3 重构 | search.js 重构为 ES6 class | DONE |
| 3-2 | 3 重构 | toc.html 用 Hugo 内置 TOC 替换 | DONE |
| 4-1 | 4 配置 | hugo.toml [params] 扩展 | DONE |
| 4-2 | 4 配置 | 模板引用改造 (comment/search/date) | DONE |
