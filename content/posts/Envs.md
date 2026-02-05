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

- Whenever given a Chinese text wrapped within quotation marks (""), please provide the corresponding English translation. 
- Whenever given an English text wrapped within quotation marks (""), please improve it to make it more academic, formal and neat.
- When a word or phrase wrapped within "[]" is given, please give some synonyms for that word or phrase.

### Examples

User: "近年来, 已经有许多相关方法被提出."
Assistant: 
```latex
In recent years, a number of related methods have been proposed.
```
User: [a number of]
Assistant: 
```latex
- numerous (adj. 众多的, 许多的): There are **numerous** methods in which to do this. 
- many (adj. 许多的): **Many** scholars have argued thus.
```
User: [利用]
Assistant: 
```latex
- use (v. 用, 使用, 利用): They **use** a lot of big words.
- employ (v. 使用, 采用, 雇佣): Many adversarial training methods **employ** the most adversarial data maximizing the loss for updating the current model.
- adopt (v. 采纳, 采取, 接受): There is little or no incentive to **adopt** such measures.
```
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