---
date: "2025-05-07"
draft: false
title: "MICROADAM: Accurate Adaptive Optimization with Low Space Overhead and Provable Convergence"
description: "MicroAdam, 通过梯度稀疏化以及 error compensation 实现轻量的优化器"
author: MTandHJ
tags:
  - Note
  - Lightweight
  - Low-Precision
  - Error Compensation
  - Quantization
  - Optimizer
  - Theoretical
  - NeurIPS
  - 2024
pinned: false
---


## 预备知识

- 需要了解 [Error Compensation](https://www.mtandhj.com/posts/1-bit-adam/) 的机制.

## 核心思想

- 为了降低 Adam 沉重的状态缓存, 本文提出 MicroAdam 用以实现 '轻量化', 从技术角度来说, 个人感觉更偏向于 Adafactor, GaLore 这类压缩方法, 而不是 8-bit Adam 这类方法, 虽然 MicroAdam 也用到了量化.

![20250507173052](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20250507173052.png)

- 结合上述算法, 这里总结下重要的步骤:
    1. 计算梯度 $g_t$;
    2. 通过 Error Compensation, 得到矫正后的梯度

        $$
        a_t \leftarrow g_t + Q^{-1}(e_t, \delta_t, \Delta_t),
        $$

        这里 $Q^{-1}$ 就是一个简单的反量化过程, 即累积误差 $e_t$ 不像 [here](https://www.mtandhj.com/posts/1-bit-adam/) 是 full-precision 的, 是采用低精度保存的 (不然就没法起到降低优化器状态占用空间的目的了);

    3. 根据绝对值, 选出 $a_t$ 中 Top-$k$ 的值 ($\mathcal{V}_t$) 以及所对应的 index ($\mathcal{I}_t$), 通常筛选出 top-1\%;

    4. 此时用 $T_k(|a_t|)$ 替代 $a_t$ 势必产生误差, 这部分误差融入累积误差之中, 用于下一次校准:

        $$
        \delta_{t+1}, \Delta_{t+1} \leftarrow \min (a_t), \max(a_t), \\
        e_{t+1} \leftarrow Q(a_t, \delta_{t+1}, \Delta_{t+1}),
        $$

        特别地, $\delta, \Delta$ 是用于量化的一些 offset, scale factors (通常每层一组);

    5. 接下来, 我们要利用 $\mathcal{I}_t, \mathcal{V}_t$ 进行训练, 注意, MicroAdam 不像 Adam 一样要完全保存 moments $m_t, v_t$, 每一步的 moments 是通过之前保存的 $m \in \mathbb{Z}_+$ (请注意区分这个 $m$ 和 moment, 这是作者用了同一符号表示) 个稀疏梯度

        $$
        \mathcal{G} = [
            \mathcal{G}_1 = (\mathcal{I}_{t-m + 1}, \mathcal{V}_{t-m+1}, \ldots, \mathcal{G}_m = (\mathcal{I}_{t}, \mathcal{V}_t))
        ] \in \mathbb{R}^{m \times k},
        $$

        这个 sliding window 上重新估计 $m_t, v_t$.

    6. 通过每次重新估计出来的 moments, 进行参数更新即可.

- 看下来, 感觉是相当复杂的算法, 同时需要一些特殊的工程优化.


## 参考文献

<ol class="reference">
  <li>
    Modoranu I., Safaryan M., Malinovsky G., Kurtic E.,
    Robert T., Richtarik P., Alistarh D.
    <u>MICROADAM: Accurate Adaptive Optimization with Low Space Overhead and Provable Convergence</u>.
    <i>NeurIPS</i>, 2024.
    <a href="https://arxiv.org/abs/2405.15593" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://github.com/IST-DASLab/MicroAdam" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>