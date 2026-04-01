
## 背景

`layouts/slides/single.html`（网页版）和 `layouts/slides/single.pdf.html`（PDF 版）共享了大量 CSS 和 JS 逻辑，但 PDF 模板将所有代码内联，导致两处代码逐渐漂移，产生了无意义的差异。需要合并去重，减少维护负担。

## 现状分析

### 重复代码（JS）

以下逻辑在 `slides.js` 和 `single.pdf.html` 内联 JS 中各有一份，完全相同：
- `convertCustomTags()` — 自定义标签转换
- `slide-section` → `<section data-markdown>` 转换
- `scheduleRevealLayout()` — 布局刷新
- `renderSlideMath()` + KaTeX delimiters — 数学公式渲染
- Reveal.js 初始化及事件绑定

### 重复代码（CSS）

`slides.css` 和 `single.pdf.html` 内联 `<style>` 结构相同，但样式值存在漂移：
- 标题颜色：`#5F7F8A`（web）vs `#1F4E79`（PDF）
- Marker 颜色：`#4B545C`（web）vs `#1F4E79`（PDF）
- 标题位置：`left: -2.5rem`（web）vs `left: -4rem`（PDF）
- 标题下划线：有（web）vs 无（PDF）
- Reveal margin：`0.1`（web）vs `0.07`（PDF）
- Reveal width：`1100`（web）vs `1050`（PDF）

**结论**：除 PDF 模板中额外引入的 CJK 字体声明外，所有差异均为历史漂移，应以 `single.html` 为准统一。

## 需求

### R1：拆分 `slides.js` 为 core + interactive

- **`slides-core.js`**（共享）：包含自定义标签转换、slide-section 转换、Reveal.js 初始化、`scheduleRevealLayout()`、数学公式渲染等核心逻辑
- **`slides-interactive.js`**（仅网页版）：包含全屏切换、激光笔、评论区 reflow、resize 处理等交互功能
- `single.html` 同时引用两个文件；`single.pdf.html` 仅引用 `slides-core.js`

### R2：PDF 模板引用外部 CSS，消除内联样式

- PDF 模板改用 `<link rel="stylesheet" href="/css/slides.css">` 引用共享样式
- 仅保留 PDF 专属的内联 `<style>` 覆盖：
  - **CJK 字体兼容**：PDF 在 GitHub Actions 的 headless Chrome 中渲染，必须显式声明 CJK 字体回退链（`"Noto Sans CJK SC"`, `"Noto Sans SC"` 等），否则中文将显示为方块。此声明仅 PDF 需要（网页版由浏览器/系统字体兜底），必须保留在 PDF 模板的内联样式中。
  - 独立渲染所需的 reset（`*, html, body` 重置）
  - `.reveal` 容器全屏覆盖（`width: 100%; height: 100%;`）

### R3：统一漂移的样式值

- 所有样式值以 `single.html` / `slides.css` 当前值为准
- 删除 PDF 模板中与 `slides.css` 重复的规则

### R4：确保 PDF 构建流程不受影响

- decktape 通过 http-server 加载 PDF 模板，外部 CSS/JS 引用路径（`/css/slides.css`、`/js/slides-core.js`）需在 `docs/` 目录下可访问
- GitHub Actions 构建流程无需修改