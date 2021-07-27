---
title: webpack、grunt、gulp
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# webpack 与 grunt、gulp 之间有啥不同？

- 2021.06.01

## 相同之处:

首先，三者都是前端构建工具，`grunt` 和 `gulp` 在早期比较流行，现在 `webpack` 相对来说比较主流，不过一些轻量化的任务还是会用 `gulp` 来处理，比如单独打包 `CSS` 文件等。

## 不同之处:

### 1.构建流程上的不同

- `grunt` 和 `gulp` 是基于`任务和流（Task、Stream）`的。类似 `jQuery`，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个 `web` 的构建流程。`gulp` 强调的是自动化、模块化不高，集成度不高需要些很多配置。

- `webpack` 是基于入口的。`webpack` 会自动地递归解析入口所需要加载的所有资源文件，然后用不同的 `Loader` 来处理不同的文件，用 `Plugin` 来扩展 `webpack` 功能。

### 2.构建思路的不同

- `gulp` 和 `grunt` 需要开发者将整个前端构建过程拆分成多个`Task`，并合理控制所有`Task`的调用关系。

- `webpack`需要开发者找到入口，并需要清楚对于不同的资源应该使用什么`Loader`做何种解析和加工。

### 3.知识背景的不同

- `gulp` 更像后端开发者的思路，需要对于整个流程了如指掌 `webpack` 更倾向于前端开发者的思路。

- `webpack` 缺点: 版本之间变化较大，配置比较复杂，黑魔法多，插件种类多，学习成本较大。
