---
draft: false
title: "Speculative Decoding"
author: MTandHJ
tags:
  - Trend
  - Speculative Decoding
  - Autoregressive
  - Generative
datafile: "spectral-gnn"
---

- 生成式模型由于其 "推理, 思考" 的潜在能力, 逐步成为各个领域的标准答案. 然而, 生成式模型往往依赖较大的模型参数, 推理的复杂度水涨船高. 投机/推测解码 (Speculative Decoding) 通过小模型推理, 大模型验证的思路能够很大程度上降低推理成本, 在技术上和应用上都颇为有趣.

