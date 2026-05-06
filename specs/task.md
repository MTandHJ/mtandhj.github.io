# 任务清单: Posts 目录拆分与模板规范化

| # | 任务 | 状态 |
|---|------|------|
| 1 | 修改 `hugo.toml`, 添加 permalinks 规则 | DONE |
| 2 | 创建 4 个子目录: paper, trial, tutorial, life | DONE |
| 3 | git mv 迁移文件到对应子目录 | DONE |
| 4 | 批量替换 front matter 首个 tag (Note→Paper, Doc/Math→Tutorial, TODO.md→Life) | DONE |
| 5 | 创建 3 个 `_template.md` 模板文件 + 配置 ignoreFiles | DONE |
| 6 | 验证: Hugo 构建 + URL 一致性 + 目录结构 + tag 正确性 + 内容完整性 | DONE |
| 7 | Paper: 批量替换 `## 预备知识` → `## 研究背景` (91 篇) | DONE |
| 8 | Trial: 逐篇调整标题 (黑暗源头→诡异源头, 实验结果→灵光一现, 结论→继往开来, 预备知识→诡异源头) | DONE |