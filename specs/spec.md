# Slide 字体方案重构 (自托管)

## 目标

将 slide 的字体加载从 Google Fonts CDN 切换为自托管方案, 同时重新选择中文/英文标题/正文字体, 使整体风格简洁、正式、舒适.

## 当前状态

### 字体使用现状

| 位置 | 当前字体 | 来源 |
|------|---------|------|
| 标题 (h1/h2/h3) | Source Sans 3 + Noto Sans SC | Google Fonts CDN |
| 正文 | Inter + Noto Sans SC | Google Fonts CDN |
| highlight | 继承正文 | - |
| PDF 模板全局 | Inter + Noto Sans SC | Google Fonts CDN |

### 问题

1. Google Fonts 上 CJK 无衬线字体选择有限 (基本只有 Noto Sans SC), 风格板正
2. 多个字体族通过 CDN 加载, 请求数多, 依赖外部服务
3. 标题与正文使用不同字体族, 增加了加载量和视觉复杂度
4. PDF 生成依赖 CDN 字体在 3s 内加载完成, 稳定性有风险

## 需求

1. **自托管字体**: 字体文件存放于 `static/fonts/`, 通过 `@font-face` 加载, 不依赖外部 CDN
2. **字体选择**: 重新选择英文/中文标题/正文字体, 满足:
   - 简洁正式, 适合学术演示
   - 正文不拥挤, 可读性好
   - 中英文风格协调
3. **子集化**: CJK 字体需子集化, 控制文件体积 (完整 CJK 字体 10MB+)
4. **PDF 兼容**: 自托管字体确保 PDF 生成无需网络请求, 100% 可靠
5. **一致保留**: 之前已确认的样式决策保持不变:
   - 标题颜色: `#1C2430`
   - 标题对齐: 左对齐
   - 无下划线

## 约束

- 字体许可证必须允许自托管 (SIL OFL, Apache 2.0, 或免费商用)
- CJK 子集化后 woff2 文件建议 < 2MB
- 需兼容 Reveal.js 4.5.0 和 decktape (Chromium) PDF 生成
- GitHub Actions CI 环境: ubuntu-latest, 已安装 `fonts-noto-cjk`
- `--load-pause 3000ms`, 自托管字体无网络延迟, 更可靠

## 验收标准

- [ ] 所有字体文件自托管于 `static/fonts/`
- [ ] 无 Google Fonts CDN 请求
- [ ] 英文标题/正文、中文标题/正文字体确定且协调
- [ ] CJK 字体子集化, woff2 体积合理
- [ ] 网页版字体正确加载渲染
- [ ] PDF 版字体正确渲染, 与网页版一致
- [ ] 首页标题样式不受影响

## 已决方案

- **字体架构**: 标题统一 + 正文统一 (2 字体方案)
  - 标题字体: 英文 + 中文共用一个字体族
  - 正文字体: 英文 + 中文共用一个字体族
- **子集化**: 预置 GB2312 常用 6763 字 + ASCII
- **Emoji 回退**: CJK 子集不含 emoji, 回退到系统字体, 不影响显示
- **保底机制**: CSS font-family 链 + CI 环境 fonts-noto-cjk 兜底

## 未决问题

- 标题字体最终选择 (英文 + CJK)
- 正文字体最终选择 (英文 + CJK)