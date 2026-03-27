
## 实现方案

### 任务 1：创建增量 PDF 构建脚本

**新建文件：** `scripts/build-slide-pdfs.sh`

**职责：** 增量地将 Reveal.js slides 转换为 PDF 文件。

**逻辑：**

```bash
#!/usr/bin/env bash
set -euo pipefail

DOCS_DIR="docs"
CACHE_DIR=".slide-cache"
HASH_FILE="$CACHE_DIR/hashes.json"
PDF_CACHE="$CACHE_DIR/pdf"
PORT=8765
LOAD_PAUSE=3000

# 确保缓存目录存在
mkdir -p "$PDF_CACHE"
[ -f "$HASH_FILE" ] || echo '{}' > "$HASH_FILE"

# 收集需要重建的 slides
needs_build=()
for html in "$DOCS_DIR"/pdf/slides/*/index.html; do
  slug=$(basename "$(dirname "$html")")
  new_hash=$(sha256sum "$html" | cut -d' ' -f1)
  old_hash=$(jq -r ".\"$slug\" // \"\"" "$HASH_FILE")

  if [ "$new_hash" = "$old_hash" ] && [ -f "$PDF_CACHE/$slug.pdf" ]; then
    echo "[cache hit] $slug"
    cp "$PDF_CACHE/$slug.pdf" "$DOCS_DIR/pdf/slides/$slug.pdf"
  else
    echo "[rebuild] $slug"
    needs_build+=("$slug")
  fi

  # 更新 hash（无论是否重建）
  tmp=$(mktemp)
  jq --arg k "$slug" --arg v "$new_hash" '.[$k] = $v' "$HASH_FILE" > "$tmp" && mv "$tmp" "$HASH_FILE"
done

# 如果有需要重建的 slides，启动 HTTP server 并运行 Decktape
if [ ${#needs_build[@]} -gt 0 ]; then
  npx -y http-server "$DOCS_DIR" -p $PORT --silent &
  SERVER_PID=$!
  sleep 2  # 等待 server 启动

  for slug in "${needs_build[@]}"; do
    echo "[decktape] $slug ..."
    npx -y decktape reveal \
      "http://localhost:$PORT/pdf/slides/$slug/" \
      "$DOCS_DIR/pdf/slides/$slug.pdf" \
      --load-pause $LOAD_PAUSE
    cp "$DOCS_DIR/pdf/slides/$slug.pdf" "$PDF_CACHE/$slug.pdf"
  done

  kill $SERVER_PID 2>/dev/null || true
fi

echo "Done. PDF files:"
ls -la "$DOCS_DIR"/pdf/slides/*.pdf 2>/dev/null || echo "(none)"
```

### 任务 2：修改 GitHub Actions workflow

**文件：** `.github/workflows/hugo.yaml`

**改动：** 在 `Build with Hugo` 和 `Build search index` 之间，插入缓存恢复和 PDF 构建步骤。

```yaml
      # --- 新增：在 Hugo build 之后 ---

      - name: Restore slide PDF cache
        uses: actions/cache@v4
        with:
          path: .slide-cache
          key: slide-pdf-${{ runner.os }}

      - name: Build slide PDFs
        run: bash scripts/build-slide-pdfs.sh

      # --- 已有：pagefind ---
      - name: Build search index
        run: npx -y pagefind --site docs
```

### 涉及文件

| 操作 | 文件 |
|------|------|
| 新建 | `scripts/build-slide-pdfs.sh` |
| 修改 | `.github/workflows/hugo.yaml` |
