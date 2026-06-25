# Spec

## Goal

重写 `content/slides/AI-Tool.md`, 保持标题为 `AI 工具入门`, 做成一份客观介绍 Codex / Claude 这类 Agent 工具的 slides。内容应像文档说明一样解释这些工具的组成模块、交互关系和在界面中的体现, 而不是讲使用建议、经验方法或案例教程。

## Scope

- 从零重写 `content/slides/AI-Tool.md`。
- 保持 slides 标题为 `AI 工具入门`。
- 保持 slides 为 `draft: false`。
- 页数目标为 25-35 页。
- 面向已经知道 LLM、ChatGPT、prompt、token、context 等基本概念的听众。
- 以“机制 + Codex/Claude 界面对照”为主线。
- 客观介绍 Codex / Claude 这类 Agent 工具中的核心概念:
  - LLM 交互结构。
  - prompt 层级, 包括 system / developer / user / project instructions。
  - context, memory, files, conversation history。
  - Agent loop。
  - tool use。
  - MCP。
  - Skill。
  - mode, planning, execution。
  - sandbox, approval, permission。
  - terminal, browser, diff, Git 等工具结果在界面中的位置。
- 每页围绕一个核心概念或界面对照点展开。
- 每页应包含一张图和一段简短客观描述。
- 图像优先使用模型生成的位图信息图或界面示意图, 不以 SVG 为默认方案。
- 图中可以直接包含中文或英文文字标签。
- 内容写作时应参考 OpenAI / Anthropic 官方文档核对概念准确性, 但 slides 不需要强制显式列出来源。

## Non-goals

- 不做完整 LLM 原理课程。
- 不做 prompt engineering 教程。
- 不讲“应该怎么设计 prompt”。
- 不讲“应该怎么使用 AI 工具更高效”。
- 不以读论文、写代码或其他任务案例作为主线。
- 不加入主观看法、经验判断或协作建议。
- 不做 Codex 和 Claude 的详尽产品手册。
- 不追求覆盖所有最新功能或发布动态。
- 不使用 Mermaid 作为图示方案。
- 不加入独立讲稿备注。
- 不加入课后练习页。
- 不在本阶段确定具体实现方案、验证方案或任务拆解。

## User Scenarios

- 作为已有 LLM/ChatGPT 基本使用经验的听众, 我希望知道 Codex / Claude 这类 Agent 工具由哪些模块组成。
- 作为第一次接触 Codex/Claude 的听众, 我希望能在图中看到 prompt、context、tools、agent loop 等概念分别对应到界面的什么位置。
- 作为分享听众, 我希望每页都通过图先建立直观印象, 再阅读简短说明。
- 作为教程作者, 我希望 slides 保持客观文档风格, 不把内容写成操作建议或工作流经验。
- 作为后续维护者, 我希望图片资源可以替换为 PicGo 外链或更新后的生成图, 但不改变 slides 的核心结构。

## Inputs / Outputs

输入:

- 当前 `content/slides/AI-Tool.md` 文件。
- 仓库现有 `content/slides` Markdown slides 格式和组件约定。
- OpenAI / Anthropic 官方文档中关于 Codex / Claude / Claude Code / Agent 工具的公开概念说明。
- 需要生成的位图信息图或界面示意图。

输出:

- 一份重写后的 `content/slides/AI-Tool.md` Markdown slides。
- slides 标题为 `AI 工具入门`。
- slides front matter 保持 `draft: false`。
- slides 页数为 25-35 页。
- slides 以客观机制介绍和 Codex/Claude 界面对照为主线。
- 每页包含一张图和一段简短描述。
- 配套生成的本地图像资产, 用于支撑 slides 展示。

## Constraints

- 语言以中文为主, 可保留必要英文术语。
- 内容必须客观, 避免“应该”“最好”“建议”“更稳定”等主观或指导性表达。
- 不使用读论文/写代码等案例主线。
- 不使用 Mermaid。
- 不默认使用 SVG; 优先使用模型生成的位图信息图或界面示意图。
- 图片应清楚表达概念结构或界面对照关系。
- 图片中的文字允许直接由模型生成, 但应尽量保持短标签、低文字密度。
- 每页文字说明应简短, 只解释图片中呈现的客观概念。
- 不依赖最新功能细节来构成教程主线。
- 新 slides 应遵循当前 `content/slides` 中已有的 Markdown slide 结构。

## Acceptance Criteria

- `content/slides/AI-Tool.md` 被重写为 25-35 页。
- slides 标题为 `AI 工具入门`。
- slides 使用 `draft: false`。
- slides 不再包含读论文/写代码案例主线。
- slides 不再包含 prompt 设计建议、工具使用建议或主观经验判断。
- slides 覆盖 LLM 交互、prompt 层级、context、Agent loop、tool use、MCP、Skill、mode、sandbox/approval、diff/Git/terminal/browser 等核心概念。
- 每个核心概念都能在图片中找到对应结构或界面位置。
- 每页都有图和简短客观描述。
- 图像以模型生成的位图信息图或界面示意图为主。
- slides 中包含 Codex/Claude 界面对照内容。
- 内容写作已按官方文档核对核心概念, 但 slides 不强制显示来源。
- slides 不使用 Mermaid。
- slides 不包含独立讲稿备注或课后练习页。

## Assumptions

- 受众知道 LLM/ChatGPT/prompt/token/context 等基础概念, 不需要从零解释。
- 初版图片可以使用模型生成的位图信息图或界面示意图, 后续可由作者替换为 PicGo 外链。
- 对 Codex / Claude 的界面对照可以使用抽象化界面示意图, 不要求完全复刻真实产品 UI。
- 官方文档核对放在后续实现阶段完成, 本 spec 只定义内容边界和接受标准。

## Open Questions

- 无。
