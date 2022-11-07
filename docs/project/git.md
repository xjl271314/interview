---
title: git
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# git 的使用

- 2022.06.22

## 为什么要给项目打 tag(使用 git tag)?

打`tag`的作用，就是给项目的开发节点。打上`tag`的同时，写上附带信息，可以方便项目日后维护过程中的回溯和复查。清晰的标签记录，有助于大家了解当前`tag`下项目的迭代的情况。

## 如何给项目打 tag?

```python
# 列出所有tag
$ git tag

# 新建一个tag在当前commit
$ git tag [tag]

# 新建一个tag在指定commit
$ git tag [tag] [commit]

# 删除本地tag
$ git tag -d [tag]

# 删除远程tag
$ git push origin :refs/tags/[tagName]

# 查看tag信息
$ git show [tag]

# 提交指定tag
$ git push [remote] [tag]

# 提交所有tag
$ git push [remote] --tags

# 新建一个分支，指向某个tag
$ git checkout -b [branch] [tag]
```

## tag 的版本如何控制?

规范遵循`Major.Minor.Patch`，也就是`Major` 是主版本号、`Minor`是次版本号、而 `Patch` 为修订号。每个元素必须以数值来递增。

先行版本号:

范例：`1.0.0-alpha`、`1.0.0-alpha.1`，被标上先行版本号则表示这个版本并非稳定，先行版的优先级低于相关联的标准版本，也就是`1.0.0-alpha` < `1.0.0`。

## 常用 git 命令清单

### branch 分支管理

| 描述                                                                                   | 对应命令                                                                    |
| :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| 列出所有本地分支                                                                       | git branch                                                                  |
| 列出所有远程分支                                                                       | git branch -r                                                               |
| 列出所有本地分支和远程分支                                                             | git branch -a                                                               |
| 新建一个分支，但依然停留在当前分支                                                     | git branch [branchName]                                                     |
| 新建一个分支，并切换到该分支                                                           | git checkout -b [branchName]                                                |
| 新建一个分支，指向指定 commit                                                          | git branch [branchName] [commitId]                                          |
| 新建一个分支，与指定的远程分支建立追踪关系                                             | git branch --track [branchName] [remoteBranchName]                          |
| 切换到指定分支，并更新工作区                                                           | git checkout [branchName]                                                   |
| 切换到上一个分支                                                                       | git branch -                                                                |
| 在现有分支与指定的远程分支之间建立追踪关系                                             | git branch --set-upstream [branchName] [remoteBranchName]                   |
| 克隆远程分支到本地分支                                                                 | git checkout -b [localBranchName] [remoteBranchName]                        |
| 将指定分支合并到当前分支                                                               | git checkout [currentBranchName] <br/> git merge [targetBranchName]         |
| 将指定分支合并到当前分支并将指定分支上的所有 commit 合并成一个                         | git checkout [currentBranchName] <br/>git merge [targetBranchName] --squash |
| 修改上次提交的 commit 信息为最新的 commit 信息(只是修改 commitId 并不会删除修改的内容) | git commit --amend                                                          |
| 删除本地分支                                                                           | git branch -D [branchName]                                                  |
| 删除远程服务器的分支                                                                   | git push origin -D [branchName]                                             |

### rebase 命令

| 描述 | 对应命令 |
| :--- | -------- |

- 同步远程分支

```js
git pull --rebase origin [branchName] = git fetch + git rebase

// 假设当前分支dev, commit 为 a b c d e
// 假设master分支, commit 为 a b f g h
git pull --rebase origin master
// 当前分支dev commit 变为 a b c d e f g h
```

- rebase 远程分支

```js
// 假设当前分支dev, commit 为 a b c d e
// 假设master分支, commit 为 a b f g h

git rebase origin/master
// 当前分支dev commit 变为 a b f g h c d e
```

### stash 命令

| 描述                                                 | 对应命令                      |
| :--------------------------------------------------- | :---------------------------- |
| 暂存当前修改                                         | git stash                     |
| 以指定的名称暂存当前修改                             | git stash save [msg]          |
| 恢复到工作区和缓冲区并移除 stashId                   | git stash pop                 |
| 查看当前的缓存区列表                                 | git stash list                |
| 恢复指定存储代码到当前工作区和缓冲区，会保留 stashId | git stash apply [stashname]   |
| 显示最新的存储文件的改动                             | git stash show -p             |
| 显示指定存储的文件的改动                             | git stash show -p [stashname] |
