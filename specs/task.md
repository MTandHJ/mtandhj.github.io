
## 任务清单：合并 Slide 模板 CSS/JS 去重

| # | 任务 | 状态 |
|---|------|------|
| 1 | 创建 `slides-core.js`：从 `slides.js` 提取核心逻辑 | DONE |
| 2 | 创建 `slides-interactive.js`：从 `slides.js` 提取交互功能 | DONE |
| 3 | 删除 `slides.js`，更新 `single.html` 引用为两个新文件 | DONE |
| 4 | 重写 `single.pdf.html`：引用外部 CSS/JS，保留 CJK 字体声明 | DONE |
| 5 | 更新 `build-slide-pdfs.sh` 共享文件列表：加入 `slides-core.js` | DONE |
