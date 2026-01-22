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