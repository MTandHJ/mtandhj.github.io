---
draft: false
title: "Recommendation Foundation Model"
author: MTandHJ
tags:
  - Trend
  - Recommendation
  - Foundation
  - Multimodal
  - Sequential
  - Graph
---

- 通用推荐模型的前景似乎变得开阔了, Item 可以用多模态特征抽象, User 则天然可以用序列和某些静态特征表示, 由此或许真的可能通向推荐自己的基座模型. 


<!-- 使用更高效的CSS加载方式 -->
<link rel="stylesheet" href="/css/timeline.css">

<div id="timeline">
  <!-- 时间线将由 JavaScript 自动生成 -->
</div>

<script>
// 时间线数据
window.timelineData = [

  {
    "date": "2025-09-22",
    "title": "OnePiece",
    "description": "Shoppe 的 retrieval & ranking 混合 (bi-directional) Transformer: 丰富的 Context 以及渐进式的多步推理",
    "paperUrl": "http://arxiv.org/abs/2509.18091",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250924203824.png",
    "importance": "novel"
  },

  }
    "date": "2025-09-08",
    "title": "UniSearch",
    "description": "快手的端到端生成式检索模型: Progressive Contrastive Learning & SimVQ",
    "paperUrl": "/posts/unisearch/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250910121256.png",
    "importance": "emmm"
  },

  {
    "date": "2025-09-04",
    "title": "OneSearch",
    "description": "快手的生成式检索模型, 在向量量化前引入协同和语义融合",
    "paperUrl": "http://arxiv.org/abs/2509.03236",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250905144845.png",
    "importance": "emmm"
  },

  {
    "date": "2025-09-03",
    "title": "RecBase: Generative Foundation Model Pretraining for Zero-Shot Recommendation",
    "description": "华为在多个开源数据集上训练的生成式推荐模型, 利用课程学习训练 Tokenizer",
    "paperUrl": "http://arxiv.org/abs/2509.03131",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250905151002.png",
    "importance": "emmm"
  },

  {
    "date": "2025-08-29",
    "title": "RECBENCH-MD",
    "description": "基座模型通用推荐能力 Benchmark: 19 基座模型 & 10 场景 & 15 数据集",
    "paperUrl": "http://arxiv.org/abs/2508.21354",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250902131304.png",
    "importance": "emmm"
  },

  {
    "date": "2025-08-28",
    "title": "OneRecv2",
    "description": "提出 Lazy Decoder 以提高效率 & 用户反馈作为强化学习信号",
    "paperUrl": "http://arxiv.org/abs/2508.20900",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250902113832.png",
    "importance": "emmm"
  },

  {
    "date": "2025-08-28",
    "title": "PSRQ",
    "description": "Progressive Semantic Residual Quantization: 残差与残差补的量化",
    "paperUrl": "/posts/psrq/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250901114718.png",
    "importance": "emmm"
  },

  {
    "date": "2025-08-15",
    "title": "DQ-VAE",
    "description": "在 SVD 分解张成的子空间中分别进行向量量化",
    "paperUrl": "/posts/dqrec/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250819115929.png",
    "importance": "emmm"
  },

  {
    "date": "2025-08-14",
    "title": "DAS",
    "description": "协同对齐 & 量化: One-Stage Contrastive Alignment",
    "paperUrl": "http://arxiv.org/abs/2508.10584",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250817173717.png",
    "importance": "emmm"
  },

  {
    "date": "2025-08-13",
    "title": "SPARC",
    "description": "双塔模型 & End-to-End joint learning CodeBook",
    "paperUrl": "http://arxiv.org/abs/2508.09090",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250814110606.png",
    "importance": "emmm"
  },

  {
    "date": "2025-08-06",
    "title": "HiD-VAE",
    "description": "借助 LLM 打标的 Tag 来限制 RQ-VAE 量化过程, 得到解释性更强的 Semantic IDs",
    "paperUrl": "http://arxiv.org/abs/2508.04618",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250808155357.png",
    "importance": "emmm"
  },

  {
    "date": "2025-07-29",
    "title": "GRID",
    "description": "Snap 提出的一个生成式推荐的训练框架, 并分析比较了一些常用的 Tricks",
    "paperUrl": "/posts/grid/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250803135947.png",
    "importance": "novel"
  },

  {
    "date": "2025-06-13",
    "title": "RecFound",
    "description": "华为提出的 Recommendation Foundation Model 的设想: 通过多样的 Embedding/Generative + Task-specific MoE + Adaptive Sampling 来增强 LLM",
    "paperUrl": "https://arxiv.org/abs/2506.11999",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703193553.png",
    "importance": "emmm"
  },

  {
    "date": "2025-05-24",
    "title": "MTGR",
    "description": "美团将 HSTU 应用到 ranking 阶段的尝试: Group Normalization 对齐不同语义空间的操作有点意思",
    "paperUrl": "https://arxiv.org/abs/2505.18654",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703193650.png",
    "importance": "emmm"
  },

  {
    "date": "2025-04-23",
    "title": "UniGRF",
    "description": "用 Next-item 统一 Retrieval and Ranking, 强调 ranking 对于 retrieval 阶段的辅助",
    "paperUrl": "https://arxiv.org/abs/2504.16454",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703193745.png",
    "importance": "emmm"
  },

  {
    "date": "2025-03-15",
    "title": "CCFRec",
    "description": "通过 Q-Former 将 semantic IDs 转换为 textual IDs, 旨在实现协同/文本特征的高效融合",
    "paperUrl": "/posts/ccfrec/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250727103615.png",
    "importance": "novel"
  },

  {
    "date": "2025-03-04",
    "title": "COBRA",
    "description": "百度提出了一种通过离散编码衍生到稠密表示的框架, 二者结合可以获得更好的效果",
    "paperUrl": "/posts/cobra/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250630162957.png",
    "importance": "novel"
  },

  {
    "date": "2025-02-26",
    "title": "OneRec",
    "description": "端到端生成式推荐在快手团队的尝试, 主要用于视频流推荐, 特征处理 + 离散编码 + reward",
    "paperUrl": "/posts/onerec/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250415143509.png",
    "importance": "novel"
  },

  {
    "date": "2025-02-23",
    "title": "Unified Semantic and ID Representation Learning",
    "description": "Unified Semantic and ID Representation Learning",
    "paperUrl": "/posts/unified-semantic-id/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250808113842.png",
    "importance": "emmm"
  },

  {
    "date": "2025-02-13",
    "title": "PrefEval",
    "description": "一个衡量 LLM 是否具备 Preference Following 的 Benchmark",
    "paperUrl": "https://arxiv.org/abs/2502.09597",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194123.png",
    "importance": "emmm"
  },

  {
    "date": "2025-02-12",
    "title": "MoLoRec",
    "description": "LLM-based, Domain-general + Domain-specific LoRAs",
    "paperUrl": "https://arxiv.org/pdf/2502.08271",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194240.png",
    "importance": "emmm"
  },

  {
    "date": "2024-11-27",
    "title": "LIGER",
    "description": "发现了生成式推荐容易过拟合到见过的 Code 组合, 导致在 Cold-start 商品上表现反而极差",
    "paperUrl": "/posts/liger/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250327143851.png",
    "importance": "novel"
  },

  {
    "date": "2024-07-07",
    "title": "AlphaRec",
    "description": "论证了 LLM 有着不逊色 BERT 类模型的编码能力, 同时扩展了用户意图嵌入等方向",
    "paperUrl": "/posts/alpharec/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250323131310.png",
    "importance": "novel"
  },

  {
    "date": "2024-06-24",
    "title": "EAGER",
    "description": "Behavior & Semantic + 分层 K-means 离散编码 + 对比学习",
    "paperUrl": "https://arxiv.org/abs/2406.14017",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194455.png",
    "importance": "emmm"
  },

  {
    "date": "2024-03-27",
    "title": "IDGenRec",
    "description": "利用语言模型'精炼'出文本 ID, 用于 Base Recommender 的 Diverse Beam Search 生成",
    "paperUrl": "https://arxiv.org/abs/2403.19021",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194615.png",
    "importance": "emmm"
  },

  {
    "date": "2024-02-27",
    "title": "HSTU",
    "description": "通过 Action 统一 retrieval 和 ranking. 针对 transformers Attention 的改进很吸引人, 而且似乎已经被工业界验证了",
    "paperUrl": "https://arxiv.org/abs/2402.17152",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194644.png",
    "importance": "seminal"
  },

  {
    "date": "2023-11-15",
    "title": "LC-Rec",
    "description": "LLM + RQ-VAE + 非常丰富的多任务训练",
    "paperUrl": "/posts/lc-rec/",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250628191520.png",
    "importance": "novel"
  },

  {
    "date": "2023-05-08",
    "title": "Tiger",
    "description": "向量量化用于生成式推荐",
    "paperUrl": "https://arxiv.org/abs/2305.05065",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194801.png",
    "importance": "seminal"
  },

  {
    "date": "2023-03-24",
    "title": "MoRec",
    "description": "实验详细探讨了 ID- vs. Modality-based 的现阶段差距",
    "paperUrl": "https://arxiv.org/abs/2303.13835",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194846.png",
    "importance": "novel"
  },

  {
    "date": "2022-06-13",
    "title": "UniSRec",
    "description": "仅基于文本实现的多场景可迁移序列推荐模型, 引入了 MoE-enhanced Adaptor 以及相应的 Parameter-Efficient Fine-tuning",
    "paperUrl": "https://arxiv.org/abs/2206.05941",
    "imageUrl": "https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250703194956.png",
    "importance": "seminal"
  },

];
</script>

<script src="/js/timeline.js"></script>
