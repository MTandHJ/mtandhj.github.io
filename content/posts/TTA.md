---
date: "2025-05-09"
draft: false
title: "Data Augmentation as Free Lunch: Exploring the Test-Time Augmentation for Sequential Recommendation"
description: "TTA, Test-Time Augmentation"
author: MTandHJ
tags:
  - Note
  - Sequential Recommendation
  - Data Augmentation
  - Empirical
  - SIGIR
  - 2025
pinned: false
---


## 预备知识

- $\mathcal{U}$, user set;
- $\mathcal{V}$, item set;
- $s_{u} = [v_1, \ldots, v_j, \ldots, v_{|s_u|}]$, 用户 $u$ 的交互序列;
- 在序列推荐中有如下常见的数据增强:
    1. **Crop:** 从 $s_u$ 中截取一段连续的子序列;
    2. **Reorder:** 将 $s_u$ 中某一段子序列打乱;
    3. **Sliding Windows:** 将序列 $s_u$ 通过滑动窗口得到长度为 $T$ 的多个子序列;
    4. **Mask:** 随机序列 $s_u$ 中的部分 item mask 掉 (一般是替换为某个 mask token);
    5. **Substitute:** 将 $s_u$ 中的部分 items 替换为相似的 item (相似一般是根据向量表示相似度度量);
    6. **Insert:** 在 $s_u$ 中添加部分 items.

![20250509110438](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250509110438.png)

## 核心思想

- Test-Time Augmentation (TTA) 是希望在测试阶段中将数据增强应用于 $s_u$, 从而得到 $m$ 个相似的序列 $\tilde{s}_i, i=1,2, \ldots, m$, 然后最后的 score 是这些序列的 score 的平均:

    $$
    AverageAgg (\sum_{i=1}^m Model (\tilde{s}_i)).
    $$

![20250509110419](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250509110419.png)

- 作者发现, 不同的数据增强, 最为有效的是 `Mask` 和 `Substitute`:

![20250509110510](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250509110510.png)

- 一个问题是, 为什么这两个相对来说比较简单的策略会比其它数据增强更有效呢? 作者假设是因为这两个方法很好地平衡了原本用户的行为模式和多样化. 通过下表可以发现, 数据增强前后相似度改变差异过大 (如 Crop) 或者过小 (如 Reorder) 均不能带来性能上的提升.

![20250509110717](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250509110717.png)


- 据此, 作者还提出了 TNoise 数据增强, 直接在序列的 item embedding 上添加微量的均匀噪声.

## 参考文献

<ol class="reference">
  <li>
    Dang Y., Liu Y., Yang E., Huang M.,
    Guo G., Zhao J., and Wang X.
    <u>Data Augmentation as Free Lunch: Exploring the Test-Time Augmentation for Sequential Recommendation</u>.
    <i>SIGIR</i>, 2025.
    <a href="https://arxiv.org/abs/2504.04843" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/KingGugu/TTA4SR" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

