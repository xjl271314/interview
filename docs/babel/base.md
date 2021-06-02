---
title: Babel
nav:
  title: babel
  path: /babel
  order: 1
group:
  title: babel相关试题
  path: /babel/project
---

# Babel 原理理解?

- 2021.06.01

> Babel 的三个主要处理步骤分别是：`解析（parse）`，`转换（transform）`，`生成(generate）`。

## 解析:

解析步骤接收代码并输出 `AST`。这个步骤分为两个阶段：`词法分析（Lexical Analysis）`和 `语法分析（Syntactic Analysis）`。

- `词法分析`：将代码(字符串)分割为 `token` 流，即语法单元成的数组。

- `语法分析`：分析 `token` 流(上面生成的数组)并生成 `AST` 转换。

## 转化:

转换步骤接收 `AST` 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。

## 生成:

代码生成步骤把最终（经过一系列转换之后）的 `AST` 转换成`字符串形式的代码`，同时还会创建`源码映射（source maps）`。

代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。 使用第三方库模拟 babel 实现:

## 关于 babel 中的 stage?

- `stage-0`: 它包含 `stage-1`, `stage-2` 以及 `stage-3` 的所有功能，同时还另外支持如下两个功能插件：

  1. `transform-do-expressions`(方便 jsx 写 `if/else` 表达式)，
  2. `transform-function-bind`(`::` 这个操作符来方便快速切换上下文)，其中示例如下:
     - `obj::func` 等价于 `func.bind(obj)`;
     - `obj::func(val)` 等价于`func.call(obj, val)`;
     - `::obj.func(val)`等价于`func.call(obj, val)`)。

- `stage-1`: 除了包含 `stage-2` 和 `stage-3` 还增加了 `transform-export-extensions`(作为 export 方法的扩展)。

- `stage-2`: 除了包含 `stage-3` 内容，还包含 `syntax-trailing-function-commas`(为了增强代码的可读性和可修改性，尾逗号函数”功能)，`transform-object-rest-spread`(ES6 对对象解构赋值的扩展)。

- `stage-3`: `transform-async-to-generator`(支持 ES7 中的`async`和`await`),`transform-exponentiation-operator`(通过`**`这个符号来进行幂操作，想当于`Math.pow(a,b)`)。
