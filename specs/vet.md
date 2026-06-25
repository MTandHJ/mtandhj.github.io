# Vet

## Target

- Stage: refine
- Files reviewed:
  - `specs/spec.md`
  - `specs/plan.md`

## Verdict

- Status: Revise
- Return to: align

## Findings

- `plan.md` 的整体结构清楚, 已说明如何实现 `AI 工具入门` slides、如何按 front matter 条件加载 Mermaid、如何处理截图占位和 PicGo 替换流程。
- `plan.md` 没有滑向 task list 或 validation design, 阶段边界基本符合 refine 要求。
- `spec.md` 和 `plan.md` 在受众定位上不一致:
  - `spec.md` 多处写明面向数学专业师弟师妹或数学专业学生。
  - `spec.md` 的 Acceptance Criteria 仍要求 slides 明确面向数学专业、AI/Vibe Coding 新手。
  - `plan.md` 根据 refine 阶段确认, 已改为面向 AI 背景较弱的科研/编程新手, 并明确不局限在数学专业。
- `spec.md` 的 Open Questions 已被后续 refine 决策部分解决, 但仍保留为开放问题:
  - slides 的正式标题已确定为 `AI 工具入门`。
  - 讲稿备注已确定为不加入。
  - 课后练习已确定为不加入。

## Required Fixes

- 回到 align 更新 `spec.md` 的受众表述, 将“数学专业学生/师弟师妹”调整为“AI 背景较弱的科研/编程新手”或等价表述, 避免和 `plan.md` 冲突。
- 同步更新 `spec.md` 的 Acceptance Criteria, 不再要求 slides 必须明确面向数学专业。
- 清理 `spec.md` 中已解决的 Open Questions, 或将其改为无。

## Suggestions

- 后续进入 task 阶段时, 明确初版 slides 允许保留截图占位块, 但占位块需要说明截图类型、用途和替换位置。
- Mermaid 条件加载方案可以保留; 它对旧 slides 和普通页面的兼容性说明已经充分。
- `plan.md` 在修正 `spec.md` 后可继续沿用, 暂未发现需要回到 refine 的阻塞问题。
