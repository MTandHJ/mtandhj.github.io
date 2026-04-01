
## 背景

该项目使用 GitHub Actions 在每次 push 到 master 时自动构建 Hugo 站点并部署到 GitHub Pages。其中包含一个 slide PDF 生成流程：通过 decktape 将 Reveal.js slide 转为 PDF。为降低构建时间，已实现基于哈希的缓存机制来跳过未变更的 slide。

## 问题

每次提交都会对所有 slide PDF 全量重新生成（日志中全部显示 `[rebuild]`），即使没有对 slide 内容、CSS 等做任何改变。缓存机制未能生效。

## 根因分析

### 根因 1：GitHub Actions Cache 不会更新已有缓存

- **文件**: `.github/workflows/hugo.yaml:68`
- cache key 为静态值 `slide-pdf-${{ runner.os }}`
- `actions/cache@v4` 在精确命中（exact key match）时**不会**在 job 结束后重新保存缓存
- 导致 `hashes.json` 永远停留在首次创建时的状态，后续运行更新的哈希值无法持久化

### 根因 2：哈希对象是 Hugo 构建产物而非源文件

- **文件**: `scripts/build-slide-pdfs.sh:20`
- 当前对 `docs/pdf/slides/*/index.html`（Hugo 输出的 HTML）做 sha256sum
- Hugo 每次构建的 HTML 可能因内部处理差异而变化，即使源文件未变，hash 也可能不同
- 叠加根因 1，导致每次运行都用首次保存的旧 hash 与当前构建产物比较 → 全部 mismatch → 全部重建

## 需求

### R1：修复 Cache Key 使缓存可更新

- 使用动态 cache key（如包含 commit SHA），配合 `restore-keys` 前缀匹配实现缓存回退
- 确保每次运行更新后的 `hashes.json` 和 PDF 缓存能被正确保存

### R2：改用源文件哈希替代构建产物哈希

- 对每个 slide，hash 其对应的源文件 `content/slides/<slug>.md`（而非 Hugo 输出的 HTML）
- 对共享文件（影响所有 slide PDF 输出的文件）计算统一哈希，任一共享文件变更则触发所有 slide 重建
- 共享文件清单：
  - `layouts/slides/single.pdf.html` — PDF 专用模板（含内联 CSS 和 JS）
  - `static/css/slides.css` — slide 样式
  - `hugo.toml` — Hugo 配置（影响输出格式、permalinks 等）

### R3：保持现有行为不变

- slide 发生变更时仍正常触发 decktape 重新生成 PDF
- 缓存命中时仍从 `.slide-cache/pdf/` 复制到 `docs/slides/`
- 脚本输出日志格式不变（`[cache hit]` / `[rebuild]`）