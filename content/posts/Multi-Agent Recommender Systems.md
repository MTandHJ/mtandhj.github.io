---
date: "2025-12-29"
draft: true
title: "The Future is Agentic: Definitions, Perspectives, and Open Challenges of Multi-Agent Recommender Systems"
description: "Multi-Agent 推荐系统的形式化介绍: 定义; 区别; 应用; 挑战"
author: MTandHJ
tags:
  - Trial
  - Recommendation
  - Agent
  - LLM
  - Simulation
  - 2025
pinned: false
---

## 预备知识

- (**推荐范式的转变**) 由于 LLM 的发展, 推荐的范式可能迎来新的契机: 从传统的被动的预测逻辑到主动的交互式推荐. 之前, 由于'智能'的落后, 我们往往只能凭借用户的交互历史猜测用户的偏好, 现在, 由于 LLM 已经具备了和人流畅交流的能力, 我们完全可以通过多步交互 (类似对话式推荐) 来真正了解用户的所需所求, 以实现更为精准的推荐.

- (**Multi-Agent Recommendation**) 上述的交互过程依赖多智能体的交互能力, 工具调用能力, 这相当于每一次推荐背后都有一个团队进行一系列过程: 某智能体会询问用户一些问题; 根据问题其他智能体会检索出一些候选商品; 可能还存在某个智能体会检验候选商品的合法性; 最后某个智能体进行精排; 根据用户反馈重复一些行为. 个人认为, 相较于传统的推荐逻辑, 多智能体推荐的存在并不是替代传统的推荐算法, 而是扮演一个大脑的角色. 以往的推荐流是固定的, rule-based, 多智能体可以根据实际情况搭建特定的流程以实现更高效的推荐.

- (**例子**) 这里先给出一个可以贯穿全文的例子, 方便后面的理解和比较:
    - [**User**] 我需要一台移动办公电脑, 有什么推荐吗?
    - [**Agent**] 你常用的平台, Mac or Windows?
    - [**User**] Mac
    - [**Agent**] MacBook Pro Max, MacBook Pro, MacBook Air ...
    - [**User**] MacBook Air 的续航, 此外比较下近几年 Air 的区别
    - ...

## Agentic Recommender Systems

### 定义

- (**LLM Agent**) LLM Agent 是指由一个或者多个 LLMs 支撑决策和行动的智能系统:

    $$
    A_{\text{LLM}} = \left(
        \mathcal{M}, \mathcal{I}, \mathcal{O}, \mathcal{F}, \Omega
    \right),
    $$

    - $\mathcal{M}$ 表示用于理解和推理的模型 (e.g., 电子商务场景中由 LLM 支持的客服机器人);
    - $\mathcal{I}$ 表示 Agent 的输入空间 (e.g., 用户的请求以及一些 context);
    - $\mathcal{O}$ 表示 Agent 的输出空间 (e.g., 客服机器人的反馈, 工具的调用指令, 具体的推荐列表);
    - $\mathcal{F}$ 表示一系列 Agent 能够调用的工具 (e.g., functions, tools, APIs);
    - $\Omega$ 表示一些辅助决策的状态 (e.g., 用户的兴趣偏好等记忆信息).

- Agent 的每一次行为实际上:
    - 收到根据当前的输入 $i_t \in \mathcal{I}$;
    - 检索相关的信息 $\omega \subset \Omega$;
    - 产生输出 $o_t = f_{\mathcal{M}, \mathcal{F}} (i_t, \omega)$.

- (**Multi-Agent System (MAS)**) 多智能体系统定义为

    $$
    \text{MAS} = \left( \mathcal{A}, \mathcal{E}, \Pi \right),
    $$

    - $\mathcal{A} = \{A_1, \ldots, A_n\}$ 是 Agent 的集合 (可以是 LLM-Agent, 或者其他的模块, 比如一些规则系统)
    - $\mathcal{E}$ 是共享的提供认知和资源的环境 (可以是一些验证式的 APIs, 用户交互, 以及一些仿真环境);
    - $\Pi = (\mathbf{C}, \Gamma)$ 是交互协议: (I) $\mathbf{C} \in \{0, 1\}^{n \times n}$ 定义了信息交互的方向, 当 $\mathbf{C}_{ij} = 1$ 意味着类型 $\gamma \in \Gamma$ 的数据可以由 Agent $A_i$ 传递给 Agent $A_j$. $\mathbf{C}$ 可以是预设的, 也可以通过某些方式 (比如由某个 Agent 决定) 自动调节. (II) $\Gamma$ 是允许的数据形式的集合, 它的存在约束了每个 Agent 方便处理和分析的数据形式, 避免一些无谓的 Bug.

- 比如就单单给用户推荐电脑这个场景, 可以设计这样一个 MAS:

    $$
    \mathcal{A} = \{A_{\text{rec}}, A_{\text{eval}}\}, \\
    \mathcal{E} = (\text{UserProfileDB, ProductCatalogue, BusinessRulesKB}), \\
    \Pi = (\mathbf{C}, \Gamma),
    \mathbf{C} =
    \left[
        \begin{array}{cc}
        0 & 1 \\
        1 & 0
        \end{array}
    \right],
    \Gamma = \{
        \text{candidate\_list}, \text{compliance\_report}
    \}.
    $$

    $A_{\text{rec}}$ 可以根据 UserProfileDB 和 ProductCatalogue 产生一个 candidate_list, 传递给 $A_{\text{eval}}$ 判断是否符合 BusinessRulesKB 中的商业条例.

- (**Memory Update Function**) 令 $\Omega_t$ 表示第 $t$ 步所维持的 long-term memory state, 以及 $\mathcal{C}_t \in \mathcal{X}$ 为当前收集到的原始的 context 信息 (e.g., 用户最新的言论, Agent 的反馈等). Memory Update Function 定义为

    $$
    \mathcal{U}: (\mathcal{C}_t, \Omega_t) \longrightarrow \Omega_{t+1},
    $$

    通常可以分解为两步:
    1. (**信息压缩**) $\mathcal{R}: \mathcal{C}_t \rightarrow \tilde{\mathcal{C}}_t$, $\tilde{\mathcal{C}}_t$ 是代表更加精炼的信息 (对于文字可能是一个总结, 对于 Embedding 等, 可能是其他压缩算法);
    2. (**信息合并**) $\Omega_{t+1} = \Omega_t \diamond \tilde{\mathcal{C}}_t$, 通过某个 domain-specific merge rule 将新的信息融入到总体的 memory 中.

- Memory 是智能体的核心部件, 它提供了一些动态的上下文信息帮助做出更加准确的决策. Memory 通常分为:
    1. **Working (short-term) memory:** 当前请求下的一些临时记忆 (比如最近的用户的需求, 一些商品的信息);
    2. **Episodic (long-term) memory:** 过去发生的一些特定事件, 比如用户买了一个 iPhone, 过了一周问 Agent 推荐一下适合上次买的手机的手机壳, 这部分记忆就能起作用;
    3. **Semantic (long-term) memory:** 一些用户的长期兴趣和一些常识信息, 比如用户对 Apple 情有独钟;
    4. **Procedural (long-term) memory:** 一些必要的 skills, routines, scripts. 比如, 用户可能会要求 Agent 凑单以满足优惠条件, Agent 通过记忆这项技能方便后续类似的交互.

- 比如用户需要长续航的办公电脑, shopping Agent 通过分析发现 M-系列的电脑续航普遍比较好, 于是总结:

    $$
    \tilde{\mathcal{C}}_t = \{处理器: \text{Apple M}\}.
    $$

    因此, 更新 Agent's long term episodic slot:

    $$
    \Omega_{t+1}^{\text{EPI}} = \Omega_t^{\text{EPI}} \cup \{处理器: \text{Apple M}\}.
    $$

### 和 CoT, RAG 等的区别

- 总而言之, MAS 能够像人一样视情况进行适当的多轮交互以达到最终目标.

![20251229214316](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251229214316.png)


## Memory

### Storage and Retrieval

- (**Memory Item**) Memory 的存储形式为 memory item $(k, v, \varsigma)$:
    1. $k \in \mathbb{R}^{d_k}$: key, 方便检索;
    2. $v \in \mathbb{R}^{d_v}$: value, 一些语义内容 (文本, 或者 dense vector);
    3. $\varsigma = (t, \ell, u)$, $t$ 表示 timestamp, $\ell \in \{\text{EPI, SEM, PROC}\}$ 表示记忆的类型 (分别为, episodic, semantic, procedural), $u$ 表示更新的次数.

- 比如, 买电脑的例子:

    $$
    k = \text{embedding}(\text{"处理器"}), v = \text{"Apple M"}, \varsigma = (t=17:45, \ell=\text{EPI}, u=1).
    $$

- (**Symbolic Memory Item**) 相较于普通的 Memory Item, Symbolic Memory Item 的 value 为 $(s, r, o) \in \mathcal{E}^3$, 为知识图谱的一个三元组: subject-relation-object.


- (**Relevance Scoring**) 为了检索 memory, 给定一个 query $\tau \in \mathcal{T}$, 我们计算 query 和 memory $m \in \Omega$ 的相关性:

    $$
    S: \mathcal{T} \times (\mathcal{X} \times \tilde{\mathcal{X}} \times \mathbb{R}^3) \longrightarrow \mathbb{R}_{\ge 0}.
    $$

    然后根据 scores 选择 Top-K:

    $$
    \hat{C} = \text{Top-K}_{m \in \Omega} S(\tau, m).
    $$

- 比如, 为了给用户推荐电脑, 我们会检索出用户偏好的品牌, 所需的处理器, 可接受的区间等 memory 信息.

- (**可存储的类型**)
    1. **Raw Text Logs:** 直接存储最新的 Tokens;
    2. **Summarisation:** 存储利用 LLM 总结后的文本;
    3. **Embedding and Vector Databases:** 利用向量数据库进行存储;
    4. **Knowledge Graphs/Structured Stores:** 存储为知识图谱的方式, 支持更加精确的推理检索. 这里用到 Symbolic Memory Item;
    5. **Parametric Memory Updates:** 和上面的都不同, 我们可以微调 LLM, 让其直接记住 memory.

![20251230131153](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251230131153.png)


## 应用

### 交互式推荐

- **Agent set:** $\mathcal{A} = \{A_{\text{chat}}, A_{\text{epi}}, A_{\text{nli}}, A_{\text{SAC}}, A_{\text{col\_check}}, A_{\text{rank}}\}$,
    - $A_{\text{chat}}$: 负责和用户交流的 agent;
    - $A_{\text{epi}}$: 负责检索 episodic memory 的 agent;
    - $A_{\text{nli}}$: 负责检验检索的 episodes 的相关性;
    - $A_{\text{SAC}}$: 一些专门的 agent, 比如调用一些函数来检查当前的电脑的处理器是否是 Apple M 系列;
    - $A_{\text{col\_check}}$: 检查一个推荐候选集合的性质;
    - $A_{\text{rank}}$: 排序 agent.

- **交互环境:**

    $$
    \mathcal{E} = (
        \text{ProductCatalogue, UserProfileDB, VectorDB, LayoutTool}
    ).
    $$

- **通信协议:**

![20251230132350](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251230132350.png)

### 用户模拟以及推荐评估

- **Agent set:** $\mathcal{A} = \{A_{\text{rec}}, A_{\text{user}}, A_{\text{note}}, A_{\text{eval}}, A_{\text{summ}}, A_{\text{report}}\}$,
    - $A_{\text{rec}}$: 继承了推荐器的 LLM Agent;
    - $A_{\text{user}}$: 一个 user simulator 反馈比如 Click/NOT Click 等信息;
    - $A_{\text{eval}}$: 记录模拟的输入和结果, 并整合为 long-term memory 存储起来;
    - $A_{\text{summ}}$: 过几轮总结压缩信息;
    - $A_{\text{report}}$: 分析统计结果, 汇总为 PDF/CSV 文件.

- **交互环境:** 

    $$
    \mathcal{E} = (\text{ProductDB, PreferenceSampler, LogStore}).
    $$

- **通信协议:**

![20251230133215](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251230133215.png)

### 多模态推荐

![20251230133318](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251230133318.png)

### 可解释推荐

![20251230133342](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251230133342.png)

## 参考文献

<ol class="reference">
  <li>
    Maragheh R. Y. and Deldjoo Y.
    <u>The Future is Agentic: Definitions, Perspectives, and Open Challenges of Multi-Agent Recommender Systems.</u>
    <i>TORS</i>, 2025.
    <a href="http://arxiv.org/abs/2507.02097" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>