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
  [ -f "$html" ] || continue
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
    npx -y decktape reveal \
      "http://localhost:$PORT/pdf/slides/$slug/" \
      "$DOCS_DIR/pdf/slides/$slug.pdf" \
      --load-pause $LOAD_PAUSE
    cp "$DOCS_DIR/pdf/slides/$slug.pdf" "$PDF_CACHE/$slug.pdf"
  done

  kill $SERVER_PID 2>/dev/null || true
  echo "HTTP server stopped."
fi

echo "Done. PDF files:"
ls -la "$DOCS_DIR"/pdf/slides/*.pdf 2>/dev/null || echo "(none)"
