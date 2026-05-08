# Slide 字体方案重构 - 技术规划

## 字体方案

| 用途 | 英文 | 中文 | 字重 |
|------|------|------|------|
| 标题 | Source Sans 3 | Source Han Sans SC | 700 (Bold) |
| 正文 | Inter | Source Han Sans SC | 400 (Regular) |

- Source Han Sans SC: SIL OFL 1.1, 可自托管, 子集化后 ~1MB woff2
- Source Sans 3 / Inter: Google Fonts 也可下载 woff2 自托管, 无需 CDN

## 文件结构

```
static/fonts/
├── source-sans-3-bold.woff2       # 标题英文 Bold
├── source-sans-3-regular.woff2    # 正文英文 Regular (Inter 不够时的回退)
├── inter-regular.woff2            # 正文英文
├── inter-medium.woff2             # 正文英文 (列表等)
├── source-han-sans-sc-bold.woff2  # 标题中文 Bold 子集
└── source-han-sans-sc-regular.woff2 # 正文中文 Regular 子集
```

预估总大小: ~4-5MB (CJK 子集约 1MB/字重, 拉丁字体 <200KB/字重)

## 实施步骤

### 1. 下载原始字体文件

- Source Han Sans SC: 从 GitHub releases 下载 OTF (Regular + Bold)
- Source Sans 3: 从 Google Fonts 下载 woff2
- Inter: 从 Google Fonts 下载 woff2

### 2. 子集化 Source Han Sans SC

使用 pyftsubset 将 CJK 字体子集化为 GB2312 + ASCII:

```bash
pip install fonttools brotli
# 生成 GB2312 unicode 列表
python scripts/gen-gb2312-unicodes.py
# 子集化 + 转 woff2
pyftsubset SourceHanSansSC-Regular.otf \
  --unicodes-file=gb2312_unicodes.txt \
  --output-file=static/fonts/source-han-sans-sc-regular.woff2 \
  --flavor=woff2 \
  --layout-features=* --name-IDs=* \
  --glyph-names --legacy-cmap --symbol-cmap
```

### 3. 编写 @font-face 声明

在 `static/css/slides.css` 顶部添加 @font-face 规则, 替换所有 Google Fonts CDN 引用.

### 4. 更新 HTML 模板

- `layouts/slides/single.html`: 移除 Google Fonts `<link>` 标签
- `layouts/slides/single.pdf.html`: 移除 Google Fonts `<link>` 标签, 更新 font-family 声明

### 5. 更新 CSS 字体声明

```css
/* 自托管字体 */
@font-face {
  font-family: "Source Sans 3";
  src: url("/fonts/source-sans-3-bold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-medium.woff2") format("woff2");
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: "Source Han Sans SC";
  src: url("/fonts/source-han-sans-sc-regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Source Han Sans SC";
  src: url("/fonts/source-han-sans-sc-bold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}

/* 标题 */
.reveal .slides section:not(:first-child) h1,
.reveal .slides section:not(:first-child) h2,
.reveal .slides section:not(:first-child) h3 {
  font-family: "Source Sans 3", "Source Han Sans SC", sans-serif;
}

/* 正文 */
.reveal .slides {
  font-family: "Inter", "Source Han Sans SC", sans-serif;
}
```

### 6. 更新 PDF 模板字体声明

```css
.reveal, .reveal .slides {
  font-family: "Inter", "Source Han Sans SC", sans-serif;
}
```

### 7. 验证

- 本地 `hugo server` 预览, 检查字体加载和渲染
- 检查 PDF 生成是否正确使用自托管字体
- 确认无 Google Fonts CDN 请求

## PDF 兼容性

自托管字体后, PDF 生成流程:
1. Hugo 构建 → `docs/fonts/` 包含所有 woff2 文件
2. decktape 加载 `http://localhost:8765/pdf/slides/.../`
3. Chromium 从本地服务器加载 `/fonts/*.woff2` → 无网络延迟
4. `--load-pause 3000ms` 足够 (本地加载 <100ms)

CI 环境的 `fonts-noto-cjk` 仅作为 CSS font-family 链的最终回退.

## 风险点

| 风险 | 缓解措施 |
|------|----------|
| GB2312 子集未覆盖生僻字 | CSS font-family 链回退到系统字体; CI 有 fonts-noto-cjk 兜底 |
| Source Han Sans SC 子集化体积偏大 | 实测 ~1MB/字重 woff2, 可接受; 如需更小可进一步缩减字符集 |
| 字体文件增加 repo 体积 | woff2 总计 ~4-5MB, git LFS 可选但非必须 |