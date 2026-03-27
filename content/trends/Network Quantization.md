---
draft: false
title: "Network Quantization"
author: MTandHJ
tags:
  - Trend
  - Quantization
  - Low-Precision
datafile: "network-quantization"
---

- 网络量化主要分为三个主流方向:
    - **FQT:** Fully Quantized Quantization, 在训练时将权重, 梯度, 激活值以低精度表示.
    - **QAT:** Quantization-Aware Training, 通过一些训练, 使得推理量化更容易
    - **PTQ:** Post-Training Quantization, 推理量化, 无需反复训练
