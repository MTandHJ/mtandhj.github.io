# Tasks

## TODO

- [x] 1. 审计当前实现状态
  - Depends on: 无
  - Validate: 确认 `AI-Tool.md`, `content/images/slides/ai-tool/`, 旧 SVG 资产和旧任务记录的当前状态

- [x] 2. 官方概念核对
  - Depends on: 1
  - Validate: 核对 OpenAI / Anthropic 官方说明, 形成稳定概念清单, 不把最新功能细节作为主线

- [x] 3. 设计 25-35 页客观页级大纲
  - Depends on: 2
  - Validate: 覆盖 LLM interaction, prompt hierarchy, context, agent loop, tools, MCP, Skill, modes, sandbox/approval, diff/Git/terminal/browser, Codex/Claude interface mapping

- [x] 4. 设计图片资产清单和 imagegen prompt 清单
  - Depends on: 3
  - Validate: 每页对应一张主图; 关键概念页为 imagegen 位图; Codex/Claude 对照页标记真实截图或 UI mock

- [x] 5. 准备 Codex / Claude 界面对照截图
  - Depends on: 4
  - Validate: 真实截图可用则保存为本地资产; 不可用页面明确转为产品文档风 UI mock

- [x] 6. 生成关键概念位图信息图
  - Depends on: 4
  - Validate: 图片保存到 `content/images/slides/ai-tool/`; 图内为英文短标签; 低文字密度; 风格统一

- [x] 7. 清理旧 AI-Tool 专用 SVG 资产
  - Depends on: 6
  - Validate: 删除新版不再引用的旧 SVG; 目录只保留新版需要的 PNG/JPG/截图资产

- [x] 8. 重写 `content/slides/AI-Tool.md`
  - Depends on: 3, 5, 6, 7
  - Validate: 25-35 页; 标题 `AI 工具入门`; `draft: false`; 每页一图 + 简短客观说明

- [x] 9. 内容客观性清理
  - Depends on: 8
  - Validate: 移除读论文/写代码案例主线; 移除 prompt 设计建议、工具使用建议、主观经验判断

- [x] 10. 引用和资产路径检查
  - Depends on: 8, 9
  - Validate: `AI-Tool.md` 只引用存在的新图片资产; 无 Mermaid; 无旧 SVG 引用; 无坏路径

- [x] 11. 构建检查
  - Depends on: 10
  - Validate: `hugo` 构建通过

- [x] 12. 本地浏览器预览检查
  - Depends on: 11
  - Validate: `hugo server` 页面可打开; 图片全部加载; 桌面和移动宽度无明显溢出或重叠

- [x] 13. 更新任务状态和记录结果
  - Depends on: 11, 12
  - Validate: `specs/task.md` 勾选完成项, Notes 记录实际命令和结果

## Blockers

- 真实 Codex / Claude 截图可能需要用户本地登录状态或手动提供。

## Notes

- `specs/validation.md` 属于上一项 life 时间轴任务, 本次不作为验证依据。
- 新版 `AI-Tool.md` 为 26 页, 每页 1 张 PNG 图和简短说明。
- Codex / Claude 界面对照使用产品文档风 UI mock, 不冒充真实截图。
- 已删除旧版 AI-Tool 专用 SVG 资产, 新版无 `.svg` 和 Mermaid 引用。
- `hugo` 构建通过。
- 本地浏览器预览检查通过: 26 个 slide section, 26 张图片, 0 个坏图, 桌面和移动端均无横向溢出, 每页内容无底部溢出。
