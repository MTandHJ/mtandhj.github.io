# Plan: Posts 目录拆分与模板规范化

## 技术方案

### 1. Hugo permalinks 配置

**方案**: 在 `hugo.toml` 中添加 permalinks 规则.

```toml
[permalinks]
  posts = "/posts/:contentbasename/"
  slides = "/slides/:contentbasename/"
```

**原理**: Hugo 的 `:contentbasename` 取文件名 (不含扩展名), 与文件所在子目录无关. 配置后, `content/posts/paper/VQ-VAE.md` 和 `content/posts/trial/Simba.md` 的 URL 分别为 `/posts/VQ-VAE/` 和 `/posts/Simba/`, 与拆分前一致.

**风险点**:
- Hugo 0.159.1 支持 `:contentbasename` (0.123.0+ 引入), 无兼容性问题
- `slides` 已有 permalinks 配置, 合并即可

**验证**: 移动文件前后, `hugo` 构建输出的 URL 列表应完全一致.

### 2. 文件迁移

**操作**: 将 105 篇文章从 `content/posts/` 移至对应子目录.

| 目标目录 | 文件数 | 来源 |
|---|---|---|
| `content/posts/paper/` | 94 | 首个 tag 为 `Note` (排除 TODO.md) |
| `content/posts/trial/` | 5 | 首个 tag 为 `Trial` |
| `content/posts/tutorial/` | 7 | 首个 tag 为 `Doc` 或 `Math` |
| `content/posts/life/` | 2 | 首个 tag 为 `Life`, 以及 TODO.md |

**步骤**:
1. 创建 4 个子目录
2. 用脚本批量 `git mv` 文件到目标目录 (保留 git 历史)
3. 不移动 `_index.md`, 保留在 `content/posts/` 根目录

**注意**: 文件名含空格 (如 `On the Markovian Nature....md`), 脚本需正确处理.

### 3. Front matter tag 更新

**操作**: 批量修改每篇文章的首个 tag.

| 原首个 tag | 新首个 tag | 影响文件 |
|---|---|---|
| `Note` | `Paper` | 94 篇 (排除 TODO.md) |
| `Note` (TODO.md) | `Life` | 1 篇 (TODO.md 首个 tag 改为 Life) |
| `Doc` | `Tutorial` | 3 篇 (ECNU, Envs, Git) |
| `Math` | `Tutorial` | 4 篇 (Dirichlet Distribution, Laplace Transform, Sinkhorn Distance) |

**实现**: 用脚本批量替换 front matter 中 tags 列表的首个元素.

**风险点**:
- 仅替换首个 tag, 不影响后续 tag (如 `Note` 出现在非首位时不替换)
- `TODO.md` 的首个 tag 是 `Note`, 需替换为 `Life` (归入 Life 类别, 保留其 `layout: todo`, `datafile: "todo"`, `pinned: true` 等特殊 front matter)

### 4. 模板文件创建

在每个子目录下创建 `_template.md`:

| 文件 | 内容 |
|---|---|
| `content/posts/paper/_template.md` | Paper 模板 (含 front matter 骨架 + 段落标题) |
| `content/posts/trial/_template.md` | Trial 模板 |
| `content/posts/tutorial/_template.md` | Tutorial 模板 |

Hugo 默认忽略 `_` 开头的文件, 这些模板不会被渲染为页面.

### 5. 搜索与索引兼容性

当前 `hugo.toml` 配置了 `postSections = ["posts", "slides"]`, 拆分后 `posts` section 下的子目录仍属于 `posts` section, 无需修改.

Pagefind 搜索索引基于构建产物, URL 不变则搜索不受影响.

## 执行步骤

1. **创建子目录**: `content/posts/paper/`, `content/posts/trial/`, `content/posts/tutorial/`, `content/posts/life/`
2. **配置 permalinks**: 修改 `hugo.toml`, 添加 `posts = "/posts/:contentbasename/"`
3. **迁移文件**: 用 `git mv` 批量移动文章到对应子目录
4. **更新 tag**: 批量替换 front matter 中首个 tag (Note→Paper, Doc/Math→Tutorial)
5. **创建模板**: 写入 3 个 `_template.md` 文件
6. **构建验证**: `hugo` 构建, 检查无报错, 抽查 URL 一致性
7. **Git 提交**: 单次提交, 包含所有变更

## 风险与回退

| 风险 | 影响 | 缓解 |
|---|---|---|
| 文件名含空格导致脚本出错 | 迁移失败 | 脚本中正确引号处理 |
| permalinks 规则未生效 | URL 变化, 404 | 构建后比对 URL 列表 |
| 搜索索引异常 | 搜索结果缺失 | Pagefind 基于 HTML 产物, URL 不变则无影响 |
| 回退 | 需要撤销 | `git revert` 即可, 所有操作通过 git mv 保留历史 |