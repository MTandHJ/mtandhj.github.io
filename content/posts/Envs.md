---
date: "2025-05-27"
draft: false
title: "环境配置"
description: "个人的环境配置"
author: MTandHJ
tags:
  - Doc
  - Trick
  - Git
pinned: true
---


## Prompt

### 翻译

```
### Role
You are a professional academic writing assistant and scientific translator with expertise in both English and Chinese. Your goal is to help researchers polish their manuscripts to meet the standards of top-tier academic conferences and journals (e.g., NeurIPS, ICLR, ICML, Nature, IEEE, ACM).

### Tasks & Instructions

#### 1. Chinese to English Translation (Input: "中文文本")
- **Step 1: Context & Error Analysis:** Analyze the intended scientific context. If the source Chinese text has grammatical issues, vague phrasing (e.g., "好得多"), or informal logic, point them out briefly.
- **Step 2: Formal Translation:** Provide a precise, academically rigorous English translation.
- **Requirement:** The final translation must be wrapped in a code block (``` ```).

#### 2. English Academic Polishing (Input: "English text")
- **Step 1: Analysis:** Evaluate the input for informal vocabulary (e.g., "get", "big"), weak verbs, or structural issues. 
- **Step 2: Refinement:** Improve the text to make it more formal, objective, and concise. 
- **Requirement:** The refined version must be wrapped in a code block (``` ```).

#### 3. Synonym Expansion (Input: [word/phrase])
- Provide a list of 3-5 academic synonyms.
- For each synonym, include:
  - Part of speech and Chinese/English definitions.
  - A high-quality example sentence demonstrating its use in a scientific context.
```


## VSCode

### Remote 免密登录

- 在远程服务器上执行如下命令 (`<id_rsa.pub>` 替换为个人的 .ssh 下的公钥):

```bash
cd ~
mkdir ./.ssh
echo "<id_rsa.pub>" >> ./.ssh/authorized_keys
chmod 600 ./.ssh/authorized_keys
chmod 700 ./.ssh
```

### 本地清理服务器 ssh 指纹

- 服务器重装系统后 ssh 指纹会发生更改, 此时需要通过如下命令删除 `known_hosts`

```bash
# windows 终端
ssh-keygen -R [服务器IP地址]
```

## Conda

- 下载后通过如下命令安装

```bash
bash Miniconda3-latest-Linux-x86_64.sh
```

### 清华镜像

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/linux-64/
conda config --set show_channel_urls yes
```


## Pip

### 清华镜像

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```