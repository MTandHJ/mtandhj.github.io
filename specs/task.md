
## 任务清单：修复 Slide PDF 缓存机制

| # | 任务 | 状态 |
|---|------|------|
| 1 | 修复 `hugo.yaml` cache key：改为动态 key + restore-keys 前缀匹配 | DONE |
| 2 | 重写 `build-slide-pdfs.sh`：改用源文件哈希（共享文件 + per-slide md） | DONE |
