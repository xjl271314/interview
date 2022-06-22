---
title: git
nav:
  title: 工程化
  path: /project
  order: 0
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
