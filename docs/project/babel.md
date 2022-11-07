---
title: Babel
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Babel 原理理解?

- 2021.07.19

> Babel 的三个主要处理步骤分别是：`解析（parse）`，`转换（transform）`，`生成(generate）`。

## Babel 的解析

解析步骤接收代码并输出 `AST`。这个步骤分为两个阶段：`词法分析（Lexical Analysis）`和 `语法分析（Syntactic Analysis）`。

- `词法分析`：将代码(字符串)分割为 `token` 流，即语法单元成的数组。

- `语法分析`：分析 `token` 流(上面生成的数组)并生成 `AST` 转换。

## Babel 的转化

转换步骤接收 `AST` 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。

## Babel 的生成

代码生成步骤把最终（经过一系列转换之后）的 `AST` 转换成`字符串形式的代码`，同时还会创建`源码映射（source maps）`。

代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。 使用第三方库模拟 babel 实现:

## 示例代码

```js
import ajax from 'axios';
```

经过`@babel/parser`转化后的 `AST`:

```json
{
  "type": "ImportDeclaration",
  "start": 0,
  "end": 24,
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 24
    }
  },
  "specifiers": [
    {
      "type": "ImportDefaultSpecifier",
      "start": 7,
      "end": 11,
      "loc": {
        "start": {
          "line": 1,
          "column": 7
        },
        "end": {
          "line": 1,
          "column": 11
        }
      },
      "local": {
        "type": "Identifier",
        "start": 7,
        "end": 11,
        "loc": {
          "start": {
            "line": 1,
            "column": 7
          },
          "end": {
            "line": 1,
            "column": 11
          },
          "identifierName": "ajax"
        },
        "name": "ajax"
      }
    }
  ],
  "importKind": "value",
  "source": {
    "type": "StringLiteral",
    "start": 17,
    "end": 24,
    "loc": {
      "start": {
        "line": 1,
        "column": 17
      },
      "end": {
        "line": 1,
        "column": 24
      }
    },
    "extra": {
      "rawValue": "axios",
      "raw": "'axios'"
    },
    "value": "axios"
  }
}
```

### ImportDeclaration

> 这个和 AST 里面的声明一致，代表是一个`import`的声明。

- VariableDeclaration：var x = 'init'

- FunctionDeclaration：function func(){}

- ExportNamedDeclaration：export function exp(){}

- IfStatement：if(1>0){}

- WhileStatement：while(true){}

- ForStatement：for(;;){}

### specifiers

`specifiers` 节点会有一个列表来保存 `specifier`。

- 如果左边只声明了一个变量，那么会给一个 `ImportDefaultSpecifier`。

- 如果左边是多个声明，就会是一个 `ImportSpecifier` 列表。

```js
import { a, b, c } from 'x';
```

### source

`source` 包含一个字符串节点 `StringLiteral`，对应了引用资源所在位置。示例中就是 `axios`。

## Babel Stages

- `stage-0`: 它包含 `stage-1`, `stage-2` 以及 `stage-3` 的所有功能，同时还另外支持如下两个功能插件：

  1. `transform-do-expressions`(方便 jsx 写 `if/else` 表达式)，
  2. `transform-function-bind`(`::` 这个操作符来方便快速切换上下文)，其中示例如下:
     - `obj::func` 等价于 `func.bind(obj)`;
     - `obj::func(val)` 等价于`func.call(obj, val)`;
     - `::obj.func(val)`等价于`func.call(obj, val)`)。

- `stage-1`: 除了包含 `stage-2` 和 `stage-3` 还增加了 `transform-export-extensions`(作为 export 方法的扩展)。

- `stage-2`: 除了包含 `stage-3` 内容，还包含 `syntax-trailing-function-commas`(为了增强代码的可读性和可修改性，尾逗号函数”功能)，`transform-object-rest-spread`(ES6 对对象解构赋值的扩展)。

- `stage-3`: `transform-async-to-generator`(支持 ES7 中的`async`和`await`),`transform-exponentiation-operator`(通过`**`这个符号来进行幂操作，想当于`Math.pow(a,b)`)。
