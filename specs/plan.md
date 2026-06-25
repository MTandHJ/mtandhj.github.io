# Plan

## Overview

重写 `content/slides/AI-Tool.md`, 保持标题 `AI 工具入门` 和 `draft: false`。新版 slides 采用客观文档式介绍, 不再使用读论文/写代码案例主线, 不写 prompt 设计建议或工具使用建议。

整体控制在 25-35 页。主线为“机制介绍 + Codex/Claude 界面对照”: 先解释 Agent 工具的通用组成模块, 再展示这些模块在 Codex / Claude 相关界面中的位置。

视觉上采用统一的产品文档风: 浅色背景、清晰 UI 面板、箭头、少量高亮色。图片优先承担概念解释, 每页配一张图和一段简短客观描述。

## Implementation

- 重写 `content/slides/AI-Tool.md`
  - 保留 front matter:
    - `title: "AI 工具入门"`
    - `author: MTandHJ`
    - `draft: false`
    - 相关 tags。
  - 删除当前读论文/写代码案例页和主观建议页。
  - 沿用现有 slides 结构: `<slide-section>`, `<slide-img>`, `<slide-cols>`, `<slide-highlight>` 等。
  - 每页以一张主图为中心, 下方或旁边放 1-3 句客观说明。
  - 不加入独立讲稿备注。
  - 不加入课后练习页。

- 内容结构
  - 标题页。
  - 概览页: Codex / Claude Agent 工具由 LLM、instructions、context、tools、permissions、workspace、history 等模块组成。
  - LLM interaction: user message, prompt stack, context, model output。
  - Prompt hierarchy: system / developer / user / project instructions。
  - Project instructions: `AGENTS.md`, `CLAUDE.md`, repository-level rules。
  - Context: files, selected text, conversation history, memory, retrieved materials。
  - Agent loop: model step, tool call, observation, next step。
  - Tool use: terminal, file edit, browser, search, Git/diff。
  - Permission model: sandbox, approval, blocked action, allowed action。
  - MCP: external tool/data source integration layer。
  - Skill: reusable task instruction package。
  - Modes: planning, editing, reviewing, execution-oriented modes where applicable。
  - Codex interface mapping: prompt area, workspace/files, tool trace, approvals, diff, result summary。
  - Claude / Claude Code interface mapping: chat, project context, tool use, permissions, files, memory/instructions。
  - Comparison pages: shared concepts across Codex / Claude, without subjective recommendation.
  - Closing summary: module map of Agent tools.

- 图像策略
  - 关键概念页使用 `imagegen` 生成位图信息图。
  - Codex / Claude 界面对照页尽量使用真实截图。
  - 如果真实截图不可取得、不可复用或界面信息不适合公开, 使用产品文档风 UI mock 代替。
  - 图内文字以英文短标签为主, 例如 `System`, `User`, `Context`, `Tool Call`, `Observation`, `Approval`, `Diff`。
  - Slide 正文使用中文解释图中元素。
  - 避免图内大段文字, 降低模型生成文字错误的概率。

- 图片资产位置
  - 新图像资产放在 `content/images/slides/ai-tool/`。
  - 命名使用稳定英文 slug, 例如:
    - `prompt-hierarchy.png`
    - `agent-loop.png`
    - `tool-use.png`
    - `mcp-overview.png`
    - `skill-package.png`
    - `codex-interface-map.png`
    - `claude-interface-map.png`
  - 新版 `AI-Tool.md` 只引用新 PNG/JPG 资产或真实截图资产。
  - 删除旧版不再引用的 SVG 资产, 保持目录只包含新版需要的图片。

- 官方概念核对
  - 实现时按 OpenAI / Anthropic 官方文档核对核心概念。
  - Slides 不强制展示来源链接。
  - 只采用稳定概念和通用界面结构, 不把最新功能细节作为教程主线。

## Behavior

- `AI-Tool.md` 作为正式 slides 页面发布, 保持 `draft: false`。
- 听众看到的是客观机制说明, 不是操作建议或案例教程。
- 每页先通过图建立结构印象, 再用简短中文说明解释图中概念。
- 图内标签以英文为主, 便于对应工具界面和官方术语。
- Codex / Claude 页面展示真实截图或接近真实的界面对照图, 用于定位 prompt、context、tools、approval、diff、terminal、browser、Git 等模块。
- 旧的读论文/写代码示例、prompt 设计建议、主观判断句不再出现在新版 slides 中。

## Compatibility

- 不引入 Mermaid。
- 不新增全局 tool-specific CSS 或 JS。
- 继续使用现有 Reveal.js slides 和自定义 slide 标签能力。
- 新图片资源限定在 `content/images/slides/ai-tool/`, 不影响其他 slides。
- 删除旧 SVG 资产时仅删除本次 `AI-Tool.md` 专用且新版不再引用的文件。
- 真实截图如果来自本地界面或官方页面, 应作为静态图片纳入项目资源, 避免运行时依赖外部页面状态。

## Notes

- 本计划不包含验证设计和任务拆解。
- 图像生成阶段应优先生成低文字密度的信息图, 再根据可读性迭代。
- 若真实截图和官方文档界面不一致, 以“概念位置对照”而非“版本精确复刻”为目标。
- 若某个概念无法用清晰图片表达, 应合并到相邻概念页, 避免产生纯文字页。
