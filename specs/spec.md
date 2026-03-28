
## 需求背景

经过不懈的努力, 我们几乎重构了整个代码, 但是很有可能会有很多 1. 冗余代码的残留; 2. 还有很多功能设计不够简洁. 让我们来讨论如何进一步让整个项目更加 clean.

---

## 清理范围

共 4 大类 18 项, 全部纳入本次清理.

---

### 一、代码重复 (5 项)

#### 1. timeline.js 与 todo.js 悬浮提示逻辑合并

- **现状:** `timeline.js` (117 行, ES5) 和 `todo.js` (94 行, ES6) 的悬浮提示逻辑 ~75% 重复 (事件监听、定位计算、图片预加载、淡入淡出).
- **目标:** 合并为 `timelines.js`, 通过参数化选择器区分 timeline/todo, 保证功能和样式不变.
- **约束:** 若合并后无法保证完全一致的行为和样式, 则退回为各自保留文件 + 提取公共 utils.

#### 2. timeline.css 与 todo.css 样式合并

- **现状:** `timeline.css` (289 行) 和 `todo.css` (471 行) 样式 ~70% 重复 (年份标记、tooltip、暗色模式、响应式断点).
- **目标:** 合并为 `timelines.css`, 共享基础样式, todo 特有样式 (状态指示器、当前时间动画等) 作为扩展.
- **约束:** 同上, 保证功能样式不变.

#### 3. 文章卡片模板提取

- **现状:** 文章卡片 (封面图 + 日期 + 标题 + 摘要) 在 `list.html`、`terms.html`、`home-pinned.html` 中重复 3 次.
- **目标:** 提取为 `layouts/partials/post-card.html`, 三处统一调用.

#### 4. KaTeX 定界符配置去重

- **现状:** KaTeX 定界符配置在 `math.html` 和 `slides/single.pdf.html` 中重复.
- **目标:** 统一为一处定义, `slides/single.pdf.html` 复用 `math.html` 的配置或提取为公共 partial.

#### 5. Pagefind filter meta 提取

- **现状:** `<meta data-pagefind-filter="type:xxx">` 和 tags filter 在 `single.html`、`slides/single.html`、`todo.html`、`trends/single.html` 共 4 处重复.
- **目标:** 提取为 `layouts/partials/pagefind-meta.html`, 接收 type 参数.

---

### 二、代码风格 & 质量 (4 项)

#### 6. search.js 完整重构为 ES6 class

- **现状:** `search.js` (536 行) 使用 ES5 语法, 7 个全局变量, 18+ 松散函数.
- **目标:** 完整重构为 `SearchManager` class, 消除全局变量, 使用 const/let、箭头函数、模板字符串等现代语法.

#### 7. timeline.js ES5 → ES6 语法升级

- **现状:** `timeline.js` 使用 ES5 语法 (`var`, `function`), 与项目其余 JS 风格不一致.
- **目标:** 统一为 ES6 语法. (若执行第 1 项合并, 则在合并时一并完成.)

#### 8. 清理 console.log 调试语句

- **现状:** `main.js` 第 14 行残留 `console.log(sunIcon)`.
- **目标:** 删除.

#### 9. 修复 timeline.js XSS 风险

- **现状:** `timeline.js` 中 `innerHTML` 直接拼接 `imageUrl` 未转义; `todo.js` 已正确转义.
- **目标:** 统一使用转义处理. (若执行第 1 项合并, 则在合并时一并修复.)

---

### 三、冗余 / 无用代码 (5 项)

#### 10. CI 移除 Dart Sass 安装

- **现状:** `.github/workflows/hugo.yaml` 安装 Dart Sass, 但项目中无 SCSS/SASS 文件.
- **目标:** 移除 Dart Sass 安装步骤, 节省 ~30s 构建时间.

#### 11. 确认并保留 Tailwind typography 插件

- **现状:** `@tailwindcss/typography` 插件已在 `single.html`、`todo.html`、`trends/single.html`、`header.html` 中使用 `prose` 类.
- **结论:** ✅ 插件必要, 不属于冗余. 本项无需操作.

#### 12. 尝试用 Hugo 内置 TOC 替换自定义 toc.html

- **现状:** `toc.html` (99 行) 自定义实现复杂的目录生成逻辑, Hugo 内置 `.TableOfContents` 可能已满足需求.
- **目标:** 尝试替换为 Hugo 内置 TOC. 如效果等价则替换, 否则仅简化现有实现.

#### 13. slides.js 激光笔功能拆分

- **现状:** `slides.js` (462 行) 中激光笔功能占 290 行 (63%), 仅在演示者模式下使用.
- **目标:** 拆分为 `slides-laser.js`, 仅在需要时加载.

#### 14. .gitignore 修正与补全

- **现状:**
  - `sepcs/` 疑似拼写错误 (应为 `specs/`).
  - 缺少 `.slide-cache`、`.hugo_build.lock`、`.DS_Store` 等.
- **目标:** 修正拼写, 补全常见忽略规则.

---

### 四、硬编码 → 配置化 (4 项)

统一策略: 将硬编码值提取到 `hugo.toml` 的 `[params]` 中, 模板通过 `.Site.Params` 引用.

#### 15. 评论系统 URL 配置化

- **现状:** `comment.html` 中 `serverURL: 'https://comment.mtandhj.com'` 硬编码.
- **目标:** 提取为 `[params.comment]` 配置.

#### 16. Slide PDF 样式配置化

- **现状:** `slides/single.pdf.html` 中 113 行内联样式, 6+ 颜色值硬编码 (`#1F4E79`, `#A10F2B` 等).
- **目标:** 关键颜色提取为 CSS 变量或 `[params.slides]` 配置; 内联样式提取为独立 CSS 文件.

#### 17. 搜索 UI 字符串配置化

- **现状:** `search.js` 中 placeholder、mode label 等中文字符串硬编码.
- **目标:** 提取为 `[params.search]` 配置, 通过 Hugo data 注入 JS.

#### 18. 日期格式字符串统一

- **现状:** `"January 2, 2006"` 和 `"2006-01-02T15:04:05Z07:00"` 散落在多个模板文件中.
- **目标:** 提取为 `[params.dateFormat]` 配置, 各模板统一引用.
