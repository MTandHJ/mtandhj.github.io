# Plan

## Overview

将 `layouts/posts/todo.html` 从 JSON 数据驱动改为 Hugo 页面集合驱动。`content/posts/life/TODO.md` 继续作为入口页, 模板自动读取 `content/posts/life/` 根目录下的 life Markdown, 排除入口页自身和 draft 内容, 按 `.Lastmod` 降序展示时间轴。

页面继续保留当前 TODO 时间轴结构和紧凑条目密度, 但移除旧 TODO 数据模型中的状态、重要性、延期等展示语义。条目标题保留超链接, 指向对应 Markdown 生成的文章页面。

## Implementation

- 更新 `hugo.toml`
  - 开启 Hugo Git 信息能力, 让 `.Lastmod` 可以使用 GitInfo。
  - 保持现有 permalink 规则不变。

- 更新 `layouts/posts/todo.html`
  - 移除 `datafile` / `hugo.Data.posts` 读取逻辑。
  - 从 `content/posts/life/` 根目录对应的页面集合读取 life Markdown。
  - 过滤规则:
    - 只包含 `content/posts/life/` 根目录下的 Markdown。
    - 排除当前入口页 `TODO.md`。
    - 排除 draft 页面。
  - 排序规则:
    - 按 `.Lastmod` 降序。
    - `.Lastmod` 允许使用 Hugo GitInfo; front matter `lastmod` 可显式覆盖。
    - 没有有效 `lastmod` 时使用 Hugo 默认回退, 最终可回到 `.Date`。
  - 条目字段:
    - title: `.Title`
    - description: `.Description`
    - url: `.RelPermalink`
    - time: `.Lastmod`
    - image preview: 从正文首图提取。
  - 条目标题必须保留超链接, 使用 Hugo `.RelPermalink` 生成, 当前 permalink 效果为 `/posts/<contentbasename>/`。
  - 移除 TODO 状态、重要性、延期和旧 `imageUrl` 字段逻辑。

- 更新 `static/js/timelines.js`
  - 保留现有悬浮图片能力。
  - TODO 时间轴继续通过 `data-image-url` 驱动悬浮预览。
  - 图片 URL 由模板从正文首图提取后写入 `data-image-url`。

- 更新 `static/css/timelines.css`
  - 保留当前 TODO 时间轴主体风格。
  - 清理或停止使用状态、重要性、延期相关样式。
  - 保持紧凑条目布局: 标题、描述。

- 更新 `content/posts/life/TODO.md`
  - 保持 `layout: todo`。
  - 保持 `pinned: true`。
  - 删除不再需要的 `datafile: todo`。

- 迁移 `data/posts/todo.json`
  - 将三条 JSON 记录迁移为 `content/posts/life/` 根目录下的独立 Markdown。
  - 文件名使用英文 slug。
  - front matter 使用中文标题、原日期、原描述、`draft: false`, `pinned: false`, Life tag。
  - 正文可先放置原 description, 后续可继续扩写。

- 删除 `data/posts/todo.json`
  - 避免后续误维护双数据源。

## Behavior

- 新增 `content/posts/life/*.md` 后, 只要 `draft: false`, 就会自动进入 TODO 时间轴。
- 修改 front matter `lastmod` 后, 时间轴顺序和显示时间随之变化。
- 不设置 `lastmod` 时, Hugo `.Lastmod` 会按配置和默认规则回退, 最终可使用 `date`。
- `TODO.md` 只作为入口页, 不展示为时间轴条目。
- 时间轴条目展示标题和描述; 时间只体现在年月分组上。
- 时间轴条目标题链接到对应文章页面。
- 如果正文存在首图, 标题 hover 时显示图片预览; 没有首图时不显示预览。

## Compatibility

- `trends` 时间轴继续使用现有 JSON 数据, 不受影响。
- 普通 post 单页模板不需要改变。
- `data/posts/todo.json` 删除后, 只有旧 `todo.html` 的 JSON 读取逻辑会被替换, 不影响其他数据文件。
- GitInfo 参与 `.Lastmod` 时, 本地和部署环境需要 Git 历史可用; front matter `lastmod` 仍可显式覆盖。
- 使用 `.RelPermalink` 生成链接, 后续 permalink 规则变化时模板无需硬编码调整。
- 悬浮图片依赖 hover 交互; 移动端没有 hover 时只显示文本条目, 不影响访问文章链接。

## Notes

- 时间轴排序和年月分组使用同一个 `.Lastmod` 值。
- 正文首图提取只用于时间轴预览, 不改变文章单页展示。
- 后续如果需要区分“事件发生时间”和“更新时间”, 可以再增加展示策略, 但当前计划以更新时间时间轴为准。
