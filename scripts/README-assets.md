# 本站静态依赖

Hugo 直接复制已经生成的 `static/` 文件, 日常发布无需联网下载字体或重新分片.

## 固定版本依赖

`vendor_sources.json` 记录 npm 包的版本、下载地址、完整性校验值及保留文件.
`static/vendor/` 保存浏览器使用的文件及许可证, `checksums.json` 记录文件 SHA-256.

```sh
python scripts/vendor_assets.py
```

脚本验证 npm 归档的完整性, 恢复固定版本资源, 并生成本站 Rubik CSS.
更新依赖时需同步修改版本记录和页面引用, 然后重新验证页面.

## 中文字体固定分片

原始思源黑体保存在 `assets/fonts/`, 不随 Hugo 发布到网站.
`font_subsets.json` 固定字符分组和原字体 SHA-256, 不依赖文章内容.
分组参考 Noto Sans SC v40 的 Unicode 分区, 与原字体字符集求交;
其余字符按固定 Unicode 区间补齐, 每片最多 256 个字符.

```sh
python -m pip install -r scripts/requirements-assets.txt
python scripts/build_font_subsets.py
```

输出包含 Regular/Bold 两个字重, 每个字重 127 片, 完整保留原字体的 7,544 个 Unicode 映射.
浏览器通过 `static/css/han-sc-v1.css` 中的 `unicode-range` 按需下载分片.
分片保留字形和 OpenType 排版数据, 不要求新文章触发重新生成.
为遵守原字体保留名称条款, 派生字体内部名称及 CSS 别名使用 `Blog Han Sans SC`.
原作者声明及 SIL OFL 许可证保存在 `assets/fonts/LICENSE.txt` 和 `static/fonts/LICENSE.txt`.

分片总大小可能大于原文件, 因为每片包含必要的字体结构和排版数据;
收益来自页面只加载需要的部分. 大量汉字可能命中较多分片.
更换原字体或分组规则时, 请升级 `han-sc-v1` 路径版本, 同步修改生成脚本和模板.

## 页面行为

- Rubik、Inter、Source Sans 3、中文分片字体均由本站提供.
- Reveal.js 及插件、KaTeX 及字体、Waline 客户端及默认表情、highlight.js、Mermaid 均由本站提供.
- KaTeX 在所有详情页加载, 无公式的文章也保留; 首页、列表页和 404 不加载.
- Slides 的 PDF HTML 使用相同的本站依赖和中文分片. PDF 缓存会跟随依赖清单变化失效.
- 图片、评论接口、头像、用户点击的外部链接及评论 GIF 搜索仍使用原来的服务.
- Python 核心、标准库及当前教程需要的 tree-sitter / tree-sitter-python 包由本站提供,
  仍然只在点击 Run 后加载. 其余扩展包保留原来的按需 CDN 下载能力.
  `vendor_sources.json` 的 `local_packages` 可增加本站提供的包, 其依赖会自动递归包含.
  生成的 Pyodide lockfile 仅改写非本站包的下载地址, 保留上游版本和 SHA-256 校验值.

## 验证

构建到临时目录, 用浏览器阻断外部脚本、CSS 和字体请求, 检查首页、文章、Slides、
Slides PDF HTML、Mermaid 文章和可运行代码文章. 评论接口可使用只读模拟响应.
Slides 应满足 `Reveal.isReady()` 为 true, 且没有残留 `.reveal textarea`.
公式应产生 `.katex` 元素, Mermaid 应产生 SVG; 不应有资源 404 或脚本异常.
