# Tasks

## TODO

- [x] 1. 确认实现前状态
  - Depends on: 无
  - Validate: 查看 `git status`, 确认已有改动范围; 读取当前 `todo.html`, `TODO.md`, `todo.json`, `Car.md`

- [x] 2. 配置 Hugo `.Lastmod` 能力
  - Depends on: 1
  - Validate: `hugo.toml` 包含 GitInfo 配置, permalink 规则保持不变

- [x] 3. 迁移 `data/posts/todo.json` 三条记录为 life Markdown
  - Depends on: 1
  - Validate: 三个英文 slug Markdown 位于 `content/posts/life/`, `draft: false`, `pinned: false`, 包含原 title/date/description

- [x] 4. 更新 `content/posts/life/TODO.md`
  - Depends on: 3
  - Validate: 保留 `layout: todo`, `pinned: true`; 删除 `datafile: todo`

- [x] 5. 改造 `layouts/posts/todo.html` 数据源和渲染逻辑
  - Depends on: 2, 3, 4
  - Validate: 数据来自 life Markdown; 排除 `TODO.md` 和 draft; 按 `.Lastmod` 降序; 标题链接使用 `.RelPermalink`

- [x] 6. 实现正文首图提取到 hover 预览
  - Depends on: 5
  - Validate: 有正文首图的条目输出 `data-image-url`; 无首图的条目不输出

- [x] 7. 清理 TODO 旧语义样式和输出
  - Depends on: 5
  - Validate: 页面不再输出状态、重要性、延期相关 class 或标签; 时间轴主体风格保持紧凑

- [x] 8. 删除 `data/posts/todo.json`
  - Depends on: 5
  - Validate: 删除后 Hugo 构建不依赖该文件

- [x] 9. 执行自动化构建与 HTML 检查
  - Depends on: 2-8
  - Validate: Hugo 构建通过; TODO 页面包含迁移条目和 `Car.md`; 不包含入口页条目、draft 条目和旧 TODO 状态输出

- [x] 10. 执行浏览器手动验证
  - Depends on: 9
  - Validate: 桌面/移动 TODO 页面无重叠; hover 图片可见; 条目链接可进入对应文章; trends 页面不受影响

- [x] 11. 更新任务状态和记录验证结果
  - Depends on: 9, 10
  - Validate: `specs/task.md` 勾选完成项, Notes 记录实际验证命令和结果

## Blockers

- 正文首图提取是否支持 HTML `<img>` 尚未最终确认; 默认先支持 Markdown 图片, HTML `<img>` 作为可选增强。
- 自动化验证若需要临时测试 Markdown, 需确保验证结束后删除临时文件。

## Notes

- 不重新设计需求、技术方案或验证标准。
- 实现过程中若发现 `.Lastmod` / GitInfo 行为与计划冲突, 返回 `$refine`。
- 实现过程中若发现验证无法证明首图提取或排序行为, 返回 `$eval`。
- 实际验证命令:
  - `hugo`
  - `hugo --destination /private/tmp/hugo-life-validate-20260624`
  - `hugo --destination /private/tmp/hugo-life-validate-20260624b`
  - `hugo server --bind 127.0.0.1 --port 1313 --disableFastRender`
- 自动化 HTML 检查结果:
  - TODO 页面包含 `博士毕业`, `蚂蚁实习`, `毕业论文`, `汽车选购指北`。
  - TODO 页面链接包含 `/posts/phd-graduation/`, `/posts/ant-internship/`, `/posts/dissertation/`, `/posts/car/`。
  - TODO 页面不包含 `todo-status`, `seminal-todo`, `novel-todo`, `emmm-todo`, `overdue`。
  - `Car.md` 正文首图被提取为 `data-image-url`。
  - 临时 `lastmod` 测试条目按 `2026-12-31` 排序并生成首图预览数据。
  - 临时无 `lastmod` 测试条目按 `date: 2026-04-30` 回退展示。
  - 临时 `draft: true` 测试条目未出现在 TODO 页面。
  - trends 页面仍有 31 个 `.paper-link`, 31 个 `.paper-link[data-image-url]`, 且无 `.todo-link`。
- 浏览器检查结果:
  - 桌面 TODO 页面布局正常, 4 个条目, 无旧状态 class。
  - 移动宽度 390px 下无水平溢出。
  - 点击 `博士毕业` 和 `汽车选购指北` 条目可进入对应文章页。
  - 当前浏览器自动化的 CUA mouse move 未触发 `mouseenter`, 因此没有直接截图到 hover 可见状态; 页面端已确认 tooltip 节点创建、`data-image-url` 输出和图片资源加载成功。
