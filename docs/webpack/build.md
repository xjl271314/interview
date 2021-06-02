---
title: webpack打包流程
nav:
  title: webpack
  path: /webpack
  order: 0
group:
  title: webpack相关试题
  path: /webpack/project
---

# 简单描述下 Webpack 构建流程?

- 2021.06.01

`Webpack` 的运行流程是一个`串行`的过程，从启动到结束会依次执行以下流程：

1. 将命令行参数与 `webpack 配置文件` 合并、解析得到`参数对象 Options`。

2. 将参数对象 `Options` 传给 `webpack` 执行得到 `Compiler` 对象。初始化后 (compiler 对象中)：包含挂在我们的插件执行 执行 `complie.hooks.done.tap('MYPLUGIN name",()=>{});`

3. 执行 `Compiler` 的 `run`方法开始编译。每次执行 `run` 编译都会生成一个 `Compilation` 对象。

4. 触发 `Compiler` 的 `make`方法分析入口文件，调用 `compilation` 的 `addEntry` 递归遍历所有的入口文件。 调用 `compilation` 的 `buildModule` 方法创建主模块对象。

5. 生成入口文件 `AST(抽象语法树)`，通过 `AST` 分析和递归加载依赖模块。

6. 所有模块分析完成后，执行 `compilation` 的 `seal` 方法对每个 `chunk` 进行整理、优化、封装。

7. 最后执行 `Compiler` 的 `emitAssets` 方法把生成的文件输出到 `output` 的目录中。

**其中`compiler`和`Compilation`如下:**

- `compiler`: `Compiler` 对象包含了当前运行 `Webpack` 的配置，包括 `entry`、`output`、`loaders` 等配置，这个对象在启动 `Webpack` 时被实例化，`Compiler` 代表了整个 `Webpack `从`启动`到`关闭`的生命周期，`Compiler` 类继承了 `Tapable`，使用 `Tapabl`e 实现了`事件发布订阅处理`的插件架构。

- `Compilation` 的职责就是构建`模块`和 `Chunk`，并利用插件优化构建过程 对象代表了一次资源版本构建。当运行 `webpack` 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 `compilation`，从而生成一组新的`编译资源`。`Compilation` 只是代表了一次新的编译，只要文件有改动，`compilation` 就会被重新创建。
