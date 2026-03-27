
## 需求

在 CI 构建流程中，自动将 Reveal.js slides 转换为 PDF 文件，使用户可通过 `/pdf/slides/xxx.pdf` 直接获取 PDF。

### 背景

- Hugo 的 `pdf` output format 已为每个 slide 生成 `/pdf/slides/xxx/index.html`（完整的 Reveal.js 页面）
- 现有 slides：SEvo, DAR_5_5, MPT, I, SOLO, Attention Connection Bottleneck, VQRec（共 7 个）
- `single.pdf.html` 模板保留，作为 Decktape 的渲染源，同时也可作为在线预览
- Slides 中数学公式较多，Decktape 渲染时需要充足的等待时间让 KaTeX 完成渲染

### 方案

1. **生成时机：** GitHub Actions CI 自动生成（在 `hugo build` 之后、`pagefind` 之前）
2. **工具：** [Decktape](https://github.com/astefanutti/decktape)（Headless Chrome 驱动的 slide → PDF 转换工具）
3. **访问路径：** `/pdf/slides/xxx.pdf`（如 `/pdf/slides/mpt.pdf`），文件名使用 slide 的 URL slug（小写）
4. **HTML 预览保留：** `/pdf/slides/xxx/` 继续提供 Reveal.js 在线预览
5. **构建策略：** 增量构建 — 利用 GitHub Actions Cache 缓存 PDF 及内容 hash，仅重建有变化的 slides

### CI 流程

```
hugo build
  ↓
恢复 slide PDF 缓存（.slide-cache/）
  ↓
计算每个 docs/pdf/slides/*/index.html 的 sha256 hash
  ↓
对比缓存中的旧 hash：
  - hash 未变 → 从缓存复制旧 PDF
  - hash 变化 / 无缓存 → 启动 HTTP server，Decktape 生成新 PDF
  ↓
更新缓存（hash + PDF 文件）
  ↓
npx pagefind --site docs
  ↓
Upload artifact & Deploy
```

### 缓存结构

```
.slide-cache/
  hashes.json        # { "mpt": "abc123...", "sevo": "def456..." }
  pdf/
    mpt.pdf
    sevo.pdf
    ...
```

### 约束与注意事项

- Decktape 需要 Chromium，CI 中通过 `npx decktape` 使用（自带 Puppeteer/Chromium）
- 需要 `--load-pause` 参数（≥3000ms）等待 KaTeX 数学公式渲染完成
- 模板/CSS 变更会改变 Hugo 输出的 HTML → hash 变化 → 自动触发重建
- 新增 slide 无旧 hash → 自动走 Decktape 生成
- 删除 slide → 缓存中多余的旧 PDF 不会被复制到 `docs/`，自然淘汰
- 首次构建或缓存未命中时，等同全量构建
