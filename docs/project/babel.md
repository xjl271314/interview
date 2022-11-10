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

`Babel` 的三个主要处理步骤分别是：`解析（parse）`，`转换（transform）`，`生成(generate）`。

1. 通过`babylon`将`js`转化成`ast` (抽象语法树)
2. 通过`babel-traverse`对`ast`进行遍历，使用`babel`插件转化成新的`ast`
3. 通过`babel-generator`将`ast`生成新的 js 代码

## 配置和基本使用

```js
.babelrc {
  // 预设: Babel 官方做了一些预设的插件集，称之为 Preset，我们只需要使用对应的 Preset 就可以了
  "presets": [],
   // babel和webpack类似，主要是通过plugin插件进行代码转化的，如果不配置插件，babel会将代码原样返回
  "plugins": []
}

// 配置browserslist
// browserslist 用来控制要兼容浏览器版本，配置的范围越具体，就可以更精确控制Polyfill转化后的体积大小
"browserslist": [
   // 全球超过1%人使用的浏览器
   "> 1%",
   //  所有浏览器兼容到最后两个版本根据CanIUse.com追踪的版本
   "last 2 versions",
   // chrome 版本大于70
   "chrome >= 70"
   // 排除部分版本
   "not ie <= 8"
]
```

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

## 开发一个 babel 插件

**Babel 插件的作用**

Babel 插件担负着编译过程中的核心任务：`转换 AST`

**babel 插件的基本格式**

- 一个函数，参数是`babel`，然后就是返回一个对象，key 是`visitor`，然后里面的对象是一个箭头函数
- 函数有两个参数，`path`表示路径，`state`表示状态.
- `CallExpression`就是我们要访问的节点，`path` 参数表示当前节点的位置，包含的主要是当前节点（node）内容以及父节点（parent）内容

```js
module.exports = function (babel) {
   let t = babel.type
   return {
      visitor: {
        CallExression: (path, state) => {
           do soming
     }}}}
```

最简单的插件示例:

```js
module.exports = function (babel) {
  let t = babel.types;
  return {
    visitor: {
      VariableDeclarator(path, state) {
        // VariableDeclarator 是要找的变量声明
        if (path.node.id.name == 'a') {
          // 方式一：直接修改name
          path.node.id.name = 'b';
          // 方式二：把id是a的ast换成b的ast
          // path.node.id = t.Identifier("b");
        }
      },
    },
  };
};
```

在`.babelrc`中引入`babelPluginAtoB`插件

```js
const babelPluginAtoB = require('./babelPluginAtoB.js');
{
    "plugins": [
        [babelPluginAtoB]
    ]
}
```

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
