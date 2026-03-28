
## 实现方案：项目代码清理

### 核心约束

> **现有功能必须保持一致。** 每个阶段完成后需通过 `hugo server` 人工验证, 确认页面渲染、交互行为、搜索、评论、暗色模式、Slide 演示等功能无回归.

---

### 阶段划分

按风险从低到高, 将 17 项任务分为 5 个阶段:

```
阶段 0 (零风险)     → 杂项清理: .gitignore、console.log、CI Dart Sass
阶段 1 (低风险)     → 模板去重: post-card partial、pagefind-meta partial、KaTeX 去重
阶段 2 (中风险)     → CSS/JS 合并: timeline+todo 合并、slides 激光笔拆分
阶段 3 (中高风险)   → 重构: search.js ES6 class、TOC 替换
阶段 4 (低风险)     → 配置化: 硬编码值提取到 hugo.toml [params]
```

每个阶段内部的任务互相独立, 可并行实施; 阶段之间建议顺序执行, 降低排查问题的难度.

---

### 阶段 0: 杂项清理 (零风险)

#### 0-1. .gitignore 修正与补全 (spec #14)

**操作:**
- 修正 `sepcs/` → `specs/`
- 补充: `.slide-cache/`, `.hugo_build.lock`, `.DS_Store`, `Thumbs.db`

**验证:** `git status` 确认无意外文件变动.

#### 0-2. 清理 console.log (spec #8)

**操作:** 删除 `static/js/main.js` 第 14 行 `console.log(sunIcon)`.

**验证:** 浏览器控制台无多余输出.

#### 0-3. CI 移除 Dart Sass (spec #10)

**操作:** 删除 `.github/workflows/hugo.yaml` 中 `Install Dart Sass` 步骤.

**验证:** CI 构建通过 (可在下次推送时验证).

---

### 阶段 1: 模板去重 (低风险)

#### 1-1. 提取 post-card.html partial (spec #3)

**现状分析:**

三处文章卡片模板结构:
- `list.html` (lines 13-29): 完整卡片, 含封面图、日期、标题、tags、摘要
- `terms.html` (lines 36-54): 结构相似, 外层多了 `data-tags` 属性
- `home-pinned.html` (lines 4-14): 简化版, 无 tags 和摘要

**方案:**
1. 新建 `layouts/partials/post-card.html`, 以 `list.html` 的卡片为基础模板
2. 通过传参控制可选部分:
   - `showTags` (bool): 是否显示标签, 默认 true
   - `showSummary` (bool): 是否显示摘要, 默认 true
   - `extraAttrs` (string): 额外 HTML 属性 (供 terms.html 传入 `data-tags`)
3. 三处调用改为 `{{ partial "post-card.html" (dict "Page" . "showTags" true ...) }}`

**验证:** 对比 `/posts/`、`/tags/`、首页三个页面的渲染结果, 确认 HTML 结构与原版一致.

#### 1-2. 提取 pagefind-meta.html partial (spec #5)

**现状分析:**

4 处重复的 pagefind filter meta 标签:
- `_default/single.html`: `type:post` + tags
- `slides/single.html`: `type:slide` + tags
- `posts/todo.html`: `type:post` + tags
- `trends/single.html`: `type:post` + tags

**方案:**
1. 新建 `layouts/partials/pagefind-meta.html`, 接收 `type` 参数
2. 模板内容:
   ```html
   <meta data-pagefind-filter="type:{{ .type }}">
   {{ range .page.Params.tags }}
   <meta data-pagefind-filter="tag:{{ . }}">
   {{ end }}
   ```
3. 各处调用: `{{ partial "pagefind-meta.html" (dict "type" "post" "page" .) }}`

**验证:** Pagefind 搜索结果中 type/tag filter 行为不变.

#### 1-3. KaTeX 定界符配置去重 (spec #4)

**现状分析:**
- `math.html` (lines 15-19): KaTeX auto-render delimiters 配置
- `slides/single.pdf.html` (lines 204-211): 相同的 delimiters 配置

**方案:**
1. 新建 `layouts/partials/katex-delimiters.html`, 仅输出 delimiters JSON 数组
2. `math.html` 和 `slides/single.pdf.html` 均引用该 partial
3. 注意: `slides/single.pdf.html` 是内联 `<script>`, 需确保 partial 输出的 JSON 能直接嵌入

**验证:** 博文页和 Slide PDF 中的数学公式渲染正常 (检查 `$...$`、`$$...$$`、`\(...\)`、`\[...\]` 四种定界符).

---

### 阶段 2: CSS/JS 合并 (中风险)

#### 2-1. timeline.js + todo.js 合并 (spec #1, #7, #9)

**现状分析:**

两个文件的核心逻辑:
1. 查找带 `data-image-url` 的链接元素
2. 创建 tooltip 容器, 预加载图片
3. 鼠标事件: mouseenter 显示 / mousemove 定位 / mouseleave 隐藏
4. 定位逻辑: 视口边界检测、图片缩放

**差异点:**
| 项目 | timeline.js | todo.js |
|------|------------|---------|
| 选择器 | `.paper-link[data-image-url]` | `.todo-link[data-image-url]` |
| 语法 | ES5 (var, function) | ES6 (const, arrow) |
| XSS 防护 | 无转义 | `.replace(/"/g, '&quot;')` |
| 隐藏延时 | 无 (直接隐藏) | 无 (直接隐藏) |

**方案:**
1. 新建 `static/js/timelines.js`, 统一为 ES6 语法
2. 核心函数 `initTooltip(selector)`, 接收选择器参数
3. 页面调用: `initTooltip('.paper-link[data-image-url]')` / `initTooltip('.todo-link[data-image-url]')`
4. 统一使用转义处理修复 XSS 风险
5. 删除原 `timeline.js` 和 `todo.js`
6. 更新引用这两个文件的模板 (`trends/single.html`, `posts/todo.html`)

**回退策略:** 若合并后视觉/交互有差异, 恢复为独立文件, 仅提取公共工具函数.

**验证:** 分别访问 trends 和 todo 页面, 测试悬浮提示的显示、定位、图片加载, 确认与合并前一致.

#### 2-2. timeline.css + todo.css 合并 (spec #2)

**现状分析:**

共享部分 (~200 行):
- 年份标记样式 (`.year-section`, `.year-marker`, `.year-point`, `.year-label`)
- 时间线布局 (`.timeline-left`, `.timeline-center`, `.timeline-right`)
- Tooltip 样式 (`.timeline-tooltip`, `.show`)
- 暗色模式基础 + 响应式断点 (700px, 500px)

todo 特有部分 (~270 行):
- 时间区段 (`.time-section`, `.time-marker`, `.time-label`, `.time-point`)
- 当前时间动画 (`.current-time-marker` pulse)
- 状态指示器 (`.todo-status.pending/completed/overdue`)
- 重要性样式 (`.seminal-todo`, `.novel-todo`, `.emmm-todo`)

**方案:**
1. 新建 `static/css/timelines.css`
2. 前半部分: 共享基础样式
3. 后半部分: todo 特有扩展 (用注释块分隔)
4. 保持所有类名不变, 确保零 HTML 改动
5. 删除原 `timeline.css` 和 `todo.css`
6. 更新引用的模板

**验证:** 分别访问 trends 和 todo 页面, 逐项对比: 年份标记、时间线、卡片、tooltip、暗色模式、移动端响应式.

#### 2-3. slides.js 激光笔拆分 (spec #13)

**现状分析:**

`slides.js` 边界清晰:
- 核心部分 (lines 1-127): 自定义标签转换、Reveal.js 初始化、数学渲染、布局调度
- 激光笔部分 (lines 129-462): DOM 查询、状态管理、localStorage 同步、鼠标/键盘事件

共享依赖:
- `revealElement`: 两部分都需要
- `scheduleRevealLayout()`: 核心定义, 激光笔调用
- `isInPresenterView()` / `isInPresentationView()` / `isInMainView()`: 激光笔定义和使用

**方案:**
1. 核心部分保留在 `slides.js`
2. 新建 `static/js/slides-laser.js`
3. 激光笔模块导出 `initLaserPointer(config)` 函数, 接收:
   ```js
   {
     revealElement,
     scheduleRevealLayout,  // callback
   }
   ```
4. `isInPresenterView()` 等视图检测函数移入激光笔模块 (仅激光笔使用)
5. 在 `slides/single.html` 模板中按顺序加载两个脚本, `slides.js` 向全局暴露 `scheduleRevealLayout`
6. `slides/single.pdf.html` 仅加载核心 `slides.js`, 不加载激光笔

**验证:**
- Slide 页面: 基本翻页、数学渲染、评论区正常
- 全屏模式: 激光笔 Alt+O 开关、红点跟踪鼠标、退出全屏自动清理
- 演示者/演示视图之间: localStorage 同步正常

---

### 阶段 3: 重构 (中高风险)

#### 3-1. search.js 重构为 ES6 class (spec #6)

**现状分析:**

公共接口 (外部调用):
- `showSearchInput()`: 切换搜索 UI (由 nav click 和 Ctrl+K 触发)
- `fillTag(tag)`: 编程式添加标签 (由 terms.html 调用)

全局状态:
- `pagefind`, `searchVisible`, `firstRun`, `resultsAvailable`
- `tagFilters`, `activeMode`, `selectedTags`, `searchGeneration`

关键模式:
- `searchGeneration` 计数器防止异步竞态
- Pagefind 懒加载 (首次打开时 import)
- 字符串拼接 onclick → 需改为事件委托

**方案:**

1. 新建 `SearchManager` class, 所有状态收敛为实例属性:
   ```js
   class SearchManager {
     constructor() {
       this.pagefind = null;
       this.visible = false;
       this.firstRun = true;
       this.resultsAvailable = false;
       this.tagFilters = null;
       this.activeMode = null;
       this.selectedTags = [];
       this.generation = 0;
     }
   }
   ```

2. 所有函数收敛为 class 方法, 按职责分组:
   - **UI 控制:** `show()`, `close()`, `renderChips()`, `showResults()`, `hideResults()`
   - **模式管理:** `enterMode()`, `exitMode()`, `addChip()`, `removeChip()`
   - **搜索分发:** `search()`, `searchByTag()`, `searchByType()`, `searchGlobal()`
   - **渲染:** `renderResults()`, `renderCoTagBar()`, `renderAllTags()`
   - **工具:** `escapeHtml()`, `matchesWordPrefix()`

3. 事件绑定改为 `addEventListener` + 事件委托, 消除 inline onclick
4. 保留 `searchGeneration` 竞态防护模式
5. 保留 Pagefind 懒加载模式
6. 实例化并暴露全局接口:
   ```js
   const searchManager = new SearchManager();
   // 兼容外部调用
   window.showSearchInput = () => searchManager.show();
   window.fillTag = (tag) => searchManager.fillTag(tag);
   ```

**验证 (逐项):**
- Ctrl+K / 点击打开搜索框
- ESC / 点击外部关闭
- 输入 `tag ` 进入标签模式, badge 显示
- 标签模式: 选择 chip、删除 chip、backspace 退出
- 输入 `post ` / `slide ` 进入对应模式
- 全局搜索: 输入关键词, 结果正确
- 方向键导航结果
- `/tags` 页面点击标签调用 `fillTag()` 正常

#### 3-2. 尝试用 Hugo 内置 TOC 替换 toc.html (spec #12)

**现状分析:**

`toc.html` (99 行) 手动解析 `<h1>`-`<h6>` 标签构建嵌套列表, 逻辑复杂. Hugo 内置 `.TableOfContents` 直接输出 `<nav id="TableOfContents"><ul><li>...</li></ul></nav>`.

当前 toc.html 已有内置 TOC 的 fallback 逻辑 (line 15-16 检查 `.Param "UseHugoToc"`).

**方案:**
1. 先在 `hugo.toml` 中配置 TOC 参数:
   ```toml
   [markup.tableOfContents]
     startLevel = 2
     endLevel = 4
     ordered = false
   ```
2. 简化 `toc.html`: 使用 Hugo 内置 `.TableOfContents`, 保留外层 `<details>` 折叠容器和样式
3. 删除手动 header 解析逻辑 (~80 行)
4. 对比前后 TOC 输出差异

**回退策略:** 如果内置 TOC 的输出结构与现有样式不兼容, 仅简化现有实现而不替换.

**验证:** 选取 3-5 篇有多级标题的博文, 对比 TOC 结构、展开/折叠、跳转链接.

---

### 阶段 4: 配置化 (低风险)

#### 4-1. hugo.toml [params] 扩展

在 `hugo.toml` 中添加:

```toml
[params.comment]
  serverURL = "https://comment.mtandhj.com"
  reaction = false

[params.search]
  defaultPlaceholder = "搜索... (tag / post / slide + 空格)"
  tagPlaceholder = "输入标签名..."
  postPlaceholder = "搜索博文..."
  slidePlaceholder = "搜索 Slides..."
  noResults = "无结果"
  maxResults = 15

[params.slides]
  headingColor = "#1F4E79"
  highlightColor = "#A10F2B"
  refColor = "#A6A6A6"
  fontFamily = "Source Sans Pro, Noto Sans CJK SC, Noto Sans SC, sans-serif"

[params.dateFormat]
  display = "January 2, 2006"
  machine = "2006-01-02T15:04:05Z07:00"
```

#### 4-2. 模板引用改造 (spec #15, #16, #17, #18)

| 文件 | 改动 |
|------|------|
| `comment.html` | `serverURL` → `.Site.Params.comment.serverURL` |
| `slides/single.pdf.html` | 颜色硬编码 → `.Site.Params.slides.*`; 内联样式提取为 `static/css/slides-pdf.css` |
| `search.js` | 硬编码字符串 → Hugo 在 `search.html` 模板中注入 `<script>` 变量, search.js 读取 |
| 各模板日期格式 | `"January 2, 2006"` → `.Site.Params.dateFormat.display` |

**search.js 字符串注入方式:**
在 `search.html` 中通过 `<script>` 注入配置, search.js (ES6 class) 构造函数读取:
```html
<script>
  window.__searchConfig = {
    defaultPlaceholder: {{ .Site.Params.search.defaultPlaceholder }},
    ...
  };
</script>
```

**验证:** 各页面功能不变; 修改 hugo.toml 中的值后, 对应页面正确反映新值.

---

### 执行顺序总览

```
阶段 0 ─── 0-1, 0-2, 0-3 (并行) ──→ 验证
  ↓
阶段 1 ─── 1-1, 1-2, 1-3 (并行) ──→ 验证
  ↓
阶段 2 ─── 2-1+2-2 (配套), 2-3   ──→ 验证
  ↓
阶段 3 ─── 3-1, 3-2 (并行)       ──→ 验证
  ↓
阶段 4 ─── 4-1, 4-2 (顺序)       ──→ 最终验证
```

### 风险控制

1. **每阶段完成后 `hugo server` 验证**, 确认无功能回归再进入下一阶段
2. **每阶段独立提交**, 方便问题溯源和回滚
3. **阶段 2 (合并) 采用"先创建新文件, 后删除旧文件"策略**, 便于并行对比
4. **阶段 3-1 (search.js 重构) 是最高风险项**, 需逐一验证所有搜索交互场景
5. **阶段 3-2 (TOC 替换) 设有回退策略**, 如不兼容则仅简化不替换
