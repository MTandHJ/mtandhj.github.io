# Validation

## Scope

验证 life 时间轴改造是否满足 `spec.md` 和 `plan.md`: 数据源改为 `content/posts/life/*.md`, `TODO.md` 保持入口页, JSON 记录迁移为 Markdown, 时间排序使用 `.Lastmod`, 条目链接和首图 hover 行为正确, 且不影响 trends 和普通文章页面。

## Acceptance Checks

- 新增 `draft: false` 的 life Markdown 后, TODO 时间轴包含该条目。
- 修改 life Markdown 的 `lastmod` 后, 时间轴顺序和年月分组随之变化。
- 未设置 `lastmod` 的 life Markdown 使用 `date` 参与排序。
- `TODO.md` 不出现在自己的时间轴条目中。
- `Car.md` 出现在时间轴中, 标题链接到对应文章页。
- 原 `data/posts/todo.json` 三条记录已迁移为 `content/posts/life/` 根目录 Markdown, 且 `pinned: false`。
- `TODO.md` 保持 `pinned: true`。
- `data/posts/todo.json` 被删除, 且构建不再依赖它。
- 时间轴条目标题使用 `.RelPermalink`, 当前链接形态符合 `/posts/<contentbasename>/`。
- 正文首图可被提取为 hover 预览图; 无首图时不生成图片预览。
- 不再显示旧 TODO 的状态、重要性、延期等元素。

## Test Cases

- 运行 Hugo 构建, 确认无模板错误、无缺失数据错误。
- 检查构建后的 TODO 页面 HTML:
  - 包含迁移后的三条 Markdown 标题。
  - 包含 `Car.md` 标题。
  - 不包含入口页 `TODO` 作为时间轴条目。
  - 不包含 `todo-status`, `seminal-todo`, `novel-todo`, `emmm-todo`, `overdue` 等旧语义输出。
  - 条目链接 href 指向 `/posts/<contentbasename>/`。
- 创建临时测试 life Markdown:
  - `draft: false`, 有 `lastmod`, 有正文首图。
  - 构建后确认它出现在时间轴, 排序按 `lastmod`, 链接正确, `data-image-url` 存在。
- 创建临时测试 life Markdown:
  - `draft: false`, 无 `lastmod`, 有 `date`。
  - 构建后确认它出现在时间轴, 时间回退到 `date`。
- 创建临时测试 life Markdown:
  - `draft: true`。
  - 构建后确认它不出现在时间轴。
- 检查 `trends` 页面构建输出仍然存在并包含原趋势时间轴内容。

## Edge Cases

- life Markdown 缺少 `description`: 条目仍可渲染, 描述为空或不显示。
- life Markdown 没有正文图片: 条目不应生成 `data-image-url`, hover 不应报错。
- 正文首图使用 Markdown 图片语法: 能提取图片地址。
- 正文首图使用 HTML `<img>`: 如果计划支持, 需要确认能提取; 如果不支持, 应记录为限制。
- 多篇文章同月或同日: 应正确归入同一个年月分组。
- 多篇文章 `lastmod` 相同: 顺序不要求稳定, 但页面不应丢条目。
- 移动端无 hover: 图片预览不可用但标题链接可点击。

## Failure Cases

- 删除 `data/posts/todo.json` 后 Hugo 构建失败, 说明模板仍有 JSON 依赖。
- `TODO.md` 出现在时间轴中, 说明过滤入口页失败。
- draft 页面出现在时间轴中, 说明过滤草稿失败。
- 链接硬编码错误或与 permalink 不一致, 说明没有正确使用 `.RelPermalink`。
- 修改 `lastmod` 后排序不变, 说明排序字段不符合计划。
- 正文首图生成了错误 URL, hover 图片加载失败。
- `trends` 页面异常, 说明改动影响了非目标范围。

## Manual Checks

- 本地启动 Hugo 预览, 打开 TODO 页面查看时间轴视觉是否仍保持当前紧凑风格。
- 鼠标悬浮在有首图的条目标题上, 确认图片预览位置、尺寸和遮挡情况可接受。
- 点击 `Car.md` 和迁移条目标题, 确认进入对应文章页面。
- 在桌面和移动宽度下查看 TODO 页面, 确认文本不重叠, 移动端无 hover 时仍可正常阅读和点击。
- 打开普通文章页面, 确认单页展示不受首图提取逻辑影响。
- 打开 trends 页面, 确认原图片 hover 和时间轴视觉不受影响。

## Open Questions

- 正文首图提取是否需要同时支持 Markdown 图片和 HTML `<img>`? 推荐支持 Markdown 图片, HTML `<img>` 可作为非必须增强。
- 自动化检查是否允许在实现阶段创建临时测试 Markdown 并在验证后删除?
