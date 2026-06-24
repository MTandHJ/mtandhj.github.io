# Spec

## Goal

将 `life` 内容的时间轴展示从手动维护 `data/posts/todo.json` 改为自动整理 `content/posts/life/` 下的 Markdown 文件, 让新增或更新 life Markdown 后可以自动反映到时间轴中。

## Scope

- 继续使用 `content/posts/life/TODO.md` 作为 life 时间轴入口页。
- 时间轴数据来源改为 `content/posts/life/` 下的 Markdown 文件。
- `data/posts/todo.json` 中现有三条记录迁移为独立 Markdown。
- 迁移出来的三条记录放在 `content/posts/life/` 根目录。
- 迁移后的三条记录设置为 `pinned: false`。
- `TODO.md` 保持 `pinned: true`。
- 时间轴条目展示文章标题和描述, 并链接到对应文章页面; 具体时间只展示到时间轴的年月分组。
- 时间排序使用 `lastmod` 优先, 没有 `lastmod` 时回退到 `date`。
- 时间轴只纳入 `draft: false` 的 life Markdown。
- `TODO.md` 作为入口页, 不作为普通时间轴条目展示。
- 不保留原 TODO 的 `status`, `importance`, `imageUrl` 展示能力。

## Non-goals

- 不调整 `trends` 时间轴的数据来源。
- 不重构整站文章系统。
- 不引入额外构建依赖。
- 不保留 JSON 与 Markdown 的双数据源维护。
- 不在本阶段确定具体模板实现细节、验证方案或任务拆解。

## User Scenarios

- 我在 `content/posts/life/` 下新建一个 `draft: false` 的 Markdown, 它会自动出现在 life 时间轴中。
- 我修改某篇 life Markdown 的 `lastmod`, 它在时间轴中的顺序会随之变化。
- 如果某篇 life Markdown 没有 `lastmod`, 时间轴使用它的 `date` 排序。
- 读者可以从 life 时间轴点击进入对应的完整 Markdown 页面。
- 我不再需要为了 life 时间轴额外维护 `data/posts/todo.json`。

## Inputs / Outputs

输入:

- `content/posts/life/` 下的 Markdown 文件。
- Markdown front matter 中的 `title`, `date`, `lastmod`, `description`, `draft` 等元信息。

输出:

- life 时间轴页面。
- 每个时间轴条目链接到对应文章页面。
- 原 `data/posts/todo.json` 中的三条记录对应为 Markdown 内容。

## Constraints

- 继续使用 Hugo 静态站点能力。
- 尽量复用当前时间轴视觉风格。
- 数据维护以 Markdown front matter 为主。
- `TODO.md` 保持入口页身份。
- 不要求作者同时维护 Markdown 和 JSON 两份数据。

## Acceptance Criteria

- 新增一个 `draft: false` 且带必要 front matter 的 life Markdown 后, life 时间轴自动包含该条目。
- 修改某个 life Markdown 的 `lastmod` 后, 时间轴排序按新 `lastmod` 更新。
- 未设置 `lastmod` 的 life Markdown 使用 `date` 参与排序。
- `TODO.md` 不出现在自己的时间轴条目中。
- 已有 `Car.md` 能作为 life 时间轴条目展示并链接到文章页。
- `data/posts/todo.json` 中现有三条记录被迁移为独立 Markdown。
- 迁移后的三条记录位于 `content/posts/life/` 根目录, 且 `pinned: false`。
- `TODO.md` 保持 `pinned: true`。
- 不再需要编辑 `data/posts/todo.json` 来维护 life 时间轴。

## Assumptions

- life Markdown 至少应包含 `title`, `date`, `draft`。
- `description` 用于时间轴摘要; 若缺失, 可以为空。
- `lastmod` 主要通过 front matter 手动维护。
- 迁移后的 TODO 记录可以作为普通 life Markdown, 内容可先使用原 JSON 的标题和描述。

## Open Questions

- 无。
