---
date: "2025-03-03"
draft: false
title: "Git"
description: "Git 的基本操作"
author: MTandHJ
tags:
  - Doc
  - Trick
  - Git
pinned: true
---

> [廖雪峰Git教程](https://www.liaoxuefeng.com/wiki/896043488029600)

## 初始化



1. 在你想要git的文件夹内 git bash here

2. 接着注册

   ```
   git config --global user.name "XXXXXX"
   git config --global user.email "XXX@+++.com"
   ```

3. 配置别名

   ```
   git config --global alias.last 'log -1'
   git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
   ```

4. 上面的步骤是第一次使用git, 若不是可省略

5. 将所在目录变成git可以管理的仓库

   ```
   git init
   ```

6. 在所在目录添加 .gitignore 文件, 一般可以直接在[这儿](https://github.com/github/gitignore)选择所需要的就行, 特殊情况可以自己再加点定制

   ```
   git add .gitignore
   git commit -m "add .gitignore"
   ```



## 远程仓库



1. 创建ssh key

   ```
   ssh-keygen -t rsa -C "xxx@+++.com"
   ```

   然后在主目录下找到.ssh目录里面的id_rsa.pub (公钥), 并复制文件里的内容.

2. 在GitHub的settings里面找到ssh keys (SSH and GPG keys)部分添加new ssh key

3. 在GitHub上新建repo, 并复制其ssh

4. 执行

   ```
   git remote add origin ssh
   ```

5. 将本地的内容推送到远程库上

   ```
   git push -u origin master
   ```



## 分支管理



1. 创建分支

   ```
   git branch dev
   ```

   或者(下面都是创建并移动至)

   ```
   git switch -c dev
   ```

   或者

   ```
   git checkout -b dev
   ```

2. 通过

   ```
   git branch
   ```

   查看当前的分支情况

3. 通过

   ```
   git switch master
   ```

   切换至master主分支

4. 合并分支

   ```
   git merge dev
   ```

5. 删除分支

   ```
   git branch -d dev
   ```



## 多人协作



联系之前远程仓库的内容, 通过

```
git remote
git remote -v
```

来查看当前的远程仓库的信息.



1. 推送

   ```
   git push origin master
   git push origin dev
   ```

   

### 拷贝clone



这部分算是第二步, 模拟另外一个地方从头开始工作的情形.



1. 在某个目录下抓取

   ```
   git clone ssh
   ```

2. 查看分支

   ```
   git branch
   ```

   此时只有 master

3. 获得dev分支

   ```
   git checkout -b dev origin/dev
   ```

4. 然后在dev上进行操作, 并提交修改





### 解决冲突

这个即为第三步



1. 首先如果直接提交本地的修改会出错, 因为版本不一致, 需要先抓取最新的提交

   ```
   git pull
   ```

   但是此时也不行, 因为当前有俩个分支, 所以需要声名抓的是哪一个

   ```
   git branch --set-upstream-to=origin/<branch> dev
   ```

   我们这里就是

   ```
   git branch --set-upstream-to=origin/dev dev
   ```

   如果是在master上进行操作:

   ```
   git branch --set-upstream-to=origin/master master
   ```

   然后再

   ```
   git pull
   ```

2. 解决冲突, 会在文件中出现change, 得选择是否接受change

3. 提交修改

   ```
   git push origin dev
   ```

   



## 标签



1. 给某个commit打上标签

   ```
   git tag v1.0
   ```

   此时给最新的commit打上标签, 也可以

   ```
   git tag v1.0 ef2a5d7
   ```

   更具体的

   ```
   git tag -a v1.0 -m "version 1.0" ef2a5d7
   ```

2. 通过

   ```
   git show v1.0
   ```

   来查看对应的标签信息

3. 删除标签

   ```
   git tag -d 
   ```



另外:

- 推送某个标签到远程

  ```
  git push origin v1.0
  ```

- 一次性推送全部尚未推送到远程的本地标签

  ```
  git push origin -tags
  ```

- 删除远程标签

  首先删除本地标签

  ```
  git tag -d v1.0
  ```

  然后从远程删除

  ```
  git push origin :refs/tags/v1.0
  ```

  



## 版本回退



### git reset
```
git reset --hard HEAD^
```


回退到上一版本, HEAD^^就是上上一版本, HEAD~100就是往上100个版本.

```
git reset --hard GPL
```

GPL就是库的那一堆16位

```
git reset HEAD filename
```

把暂存区的修改撤销, 重新放回工作区, 或者用

```
git restore --staged filename
```



### git revert
类似于reset, 只是在"回退“版本的时候, 前面的版本信息不会丢失, 即

​	A -> B -> C

现在想要回到B, reset后为

​	A -> B

revert后为

​	A -> B -> C -> B