
## 实现方案

### 步骤

1. **修改 Reveal.js margin 参数**
   - 文件：`static/js/slides.js` 第 69 行
   - 将 `margin: 0.1` 改为 `margin: 0.04`

2. **验证标题偏移是否裁切**
   - 文件：`static/css/slides.css` 第 102 行
   - 当前标题 `left: -4rem`，margin 缩小后内容区域变宽，标题向左突出的空间减少
   - 如果产生裁切，需相应减小 `left` 的负值

### 风险点

- margin 缩小后，标题的 `left: -4rem` 可能超出 slide 可视区域，需要本地验证。
