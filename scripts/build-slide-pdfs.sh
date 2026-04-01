#!/usr/bin/env bash
set -euo pipefail

DOCS_DIR="docs"
CACHE_DIR=".slide-cache"
HASH_FILE="$CACHE_DIR/hashes.json"
PDF_CACHE="$CACHE_DIR/pdf"
PORT=8765
LOAD_PAUSE=3000

# 影响所有 slide PDF 输出的共享文件
SHARED_FILES=(
  "layouts/slides/single.pdf.html"
  "static/css/slides.css"
  "static/js/slides-core.js"
  "hugo.toml"
)

# 确保缓存目录存在
mkdir -p "$PDF_CACHE"
[ -f "$HASH_FILE" ] || echo '{}' > "$HASH_FILE"

# 计算共享文件哈希（任一变更触发全部重建）
SHARED_HASH=$(cat "${SHARED_FILES[@]}" 2>/dev/null | sha256sum | cut -d' ' -f1)
echo "[shared hash] $SHARED_HASH"

# 根据 slug 查找对应的 content/slides/*.md 源文件
# Hugo slugify 规则：文件名去扩展名 → 小写 → 空格转连字符
find_source_file() {
  local target_slug="$1"
  for f in content/slides/*.md; do
    [ -f "$f" ] || continue
    local fname
    fname=$(basename "$f" .md)
    # 跳过 _index.md 和 _template.md
    [[ "$fname" == _* ]] && continue
    local fslug
    fslug=$(echo "$fname" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    if [ "$fslug" = "$target_slug" ]; then
      echo "$f"
      return 0
    fi
  done
  return 1
}

# 收集需要重建的 slides
needs_build=()
for html in "$DOCS_DIR"/pdf/slides/*/index.html; do
  [ -f "$html" ] || continue
  slug=$(basename "$(dirname "$html")")

  # 查找源文件并计算哈希
  src_file=$(find_source_file "$slug") || true
  if [ -z "$src_file" ]; then
    echo "[rebuild] $slug (source file not found, forcing rebuild)"
    needs_build+=("$slug")
    continue
  fi

  # 组合哈希：共享文件哈希 + 源文件哈希
  src_hash=$(sha256sum "$src_file" | cut -d' ' -f1)
  new_hash=$(echo "${SHARED_HASH}${src_hash}" | sha256sum | cut -d' ' -f1)
  old_hash=$(jq -r ".\"$slug\" // \"\"" "$HASH_FILE")

  if [ "$new_hash" = "$old_hash" ] && [ -f "$PDF_CACHE/$slug.pdf" ]; then
    echo "[cache hit] $slug"
    cp "$PDF_CACHE/$slug.pdf" "$DOCS_DIR/slides/$slug.pdf"
  else
    echo "[rebuild] $slug"
    needs_build+=("$slug")
  fi

  # 更新 hash
  tmp=$(mktemp)
  jq --arg k "$slug" --arg v "$new_hash" '.[$k] = $v' "$HASH_FILE" > "$tmp" && mv "$tmp" "$HASH_FILE"
done

# 如果有需要重建的 slides，启动 HTTP server 并运行 Decktape
if [ ${#needs_build[@]} -gt 0 ]; then
  echo "Starting HTTP server on port $PORT ..."
  npx -y http-server "$DOCS_DIR" -p $PORT --silent &
  SERVER_PID=$!
  sleep 2

  for slug in "${needs_build[@]}"; do
    echo "[decktape] $slug ..."
    npx -y decktape \
      --chrome-arg=--no-sandbox \
      --chrome-arg=--disable-dev-shm-usage \
      --load-pause $LOAD_PAUSE \
      reveal \
      "http://localhost:$PORT/pdf/slides/$slug/" \
      "$DOCS_DIR/slides/$slug.pdf"
    cp "$DOCS_DIR/slides/$slug.pdf" "$PDF_CACHE/$slug.pdf"
  done

  kill $SERVER_PID 2>/dev/null || true
  echo "HTTP server stopped."
fi

echo "Done. PDF files:"
ls -la "$DOCS_DIR"/slides/*.pdf 2>/dev/null || echo "(none)"
