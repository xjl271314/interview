---
title: Node模块机制与require原理
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: Node相关
  path: /project/node
---

# Node 模块机制

- 2022.11.02

## 模块机制简介

- Node 应用由模块组成，采用 CJS/ESM 模块规范来组织。
- 每个文件就是模块，有自己的作用域。
- 每个文件里面定义的变量、函数、类都是私有的，对其他文件不可见。
- 在 Node 中，模块的加载是运行时同步加载的。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了。

## 模块加载机制

在`Node`中引入模块，需要经历如下四个步骤:

1. 路径分析
2. 文件定位
3. 编译执行
4. 加入内存

### 1.路径分析

`Node.js`中模块可以通过文件路径或名字获取模块的引用。模块的引用会映射到一个`js`文件路径。 在`Node`中模块分为两类：

- 一是 Node 提供的模块，称为`核心模块（内置模块）`，内置模块公开了一些常用的 API 给开发者，并且它们在 Node 进程开始的时候就预加载了。
- 另一类是用户编写的模块，称为`文件模块`。如通过 NPM 安装的第三方模块（third-party modules）或本地模块（local modules），每个模块都会暴露一个公开的 API。以便开发者可以导入。如:

  ```js
  const module1 = require('module1_name');
  const { method2 } = require('module2_name');
  ```

执行后，Node 内部会载入内置模块或通过 NPM 安装的模块。

`require`函数会返回一个对象，该对象公开的 API 可能是`函数`、`对象`或者`属性`如函数、数组甚至任意类型的 JS 对象。

**模块加载速度:**

- `核心模块`是 Node 源码在编译过程中编译进了二进制执行文件。在 Node 启动时这些模块就被加载进内存中，所以核心模块引入时省去了`文件定位`和`编译执行`两个步骤，并且在路径分析中优先判断，因此核心模块的加载速度是最快的。

- `文件模块`则是在运行时动态加载，速度比`核心模块`慢。

#### 模块的载入及缓存机制：

1. 载入内置模块（A Core Module）
2. 载入文件模块（A File Module）
3. 载入文件目录模块（A Folder Module）
4. 载入 node_modules 里的模块
5. 自动缓存已载入模块

##### 载入内置模块

Node 的内置模块被编译为二进制形式，引用时直接使用名字而非文件路径。**当第三方的模块和内置模块同名时，内置模块将覆盖第三方同名模块**。因此命名时需要注意不要和内置模块同名。

```js
const path = require('path');
```

##### 载入文件模块

可以使用`绝对路径`或者`相对路径`载入文件模块。

```js
// 绝对路径
const moment = require('moment');

// 相对路径 等同于 const request  = require('./request.js');
const request = require('./request');
```

这里可以省略`.js`后缀，因为默认会先搜索`.js`结尾的文件。

##### 载入文件目录模块

可以直接`require`一个目录，假设有一个目录名为`utils`，如:

```js
const utils = require('./utils');
```

此时，Node 将搜索整个 `utils` 目录，Node 会假设 `utils` 为一个包并试图找到包定义文件 `package.json`。如果`utils` 目录里没有包含 `package.json` 文件，Node 会假设默认主文件为 `index.js` ，即会加载 `index.js`。如果 `index.js` 也不存在，那么加载将失败。

##### 载入 node_modules 里的模块

如果模块名不是路径，也不是内置模块，Node 将试图去当前目录的`node_modules`文件夹里搜索。如果当前目录的`node_modules`里没有找到，Node 会从父目录的`node_modules`里搜索，这样递归下去直到`根目录`。

##### 自动缓存已载入模块

对于已加载的模块 Node 会缓存下来，而不必每次都重新搜索。

### 2.文件定位

1. 文件扩展名分析

调用 `require()` 方法时若参数没有文件扩展名，Node 会按`.js`、`.json`、`.node`的顺序补足扩展名，依次尝试。

在尝试过程中，需要调用`fs模块`阻塞式地判断文件是否存在。因为 Node 的执行是单线程的，这是一个会引起性能问题的地方。如果是`.node`或者 `.json` 文件可以加上扩展名加快一点速度。另一个诀窍是：`同步配合缓存`。

2. 目录分析和包

`require()`分析文件扩展名后，可能没有查到对应文件，而是找到了一个目录，此时 Node 会将目录当作一个包来处理。

首先， Node 在当前目录下查找`package.json`，通过`JSON.parse()`解析出包描述对象，从中取出`main`属性指定的文件名进行定位。若`main`属性指定文件名错误，或者没有`package.json`文件，Node 会将`index`当作默认文件名。

简而言之，如果 `require` 绝对路径的文件，查找时不会去遍历每一个 `node_modules` 目录，其速度最快。其余流程如下：

1. 从 module path 数组中取出第一个目录作为查找基准。
2. 直接从目录中查找该文件，如果存在，则结束查找。如果不存在，则进行下一条查找。
3. 尝试添加`.js`、`.json`、`.node`后缀后查找，如果存在文件，则结束查找。如果不存在，则进行下一条。
4. 尝试将`require`的参数作为一个包来进行查找，读取目录下的`package.json`文件，取得`main`参数指定的文件。
5. 尝试查找该文件，如果存在，则结束查找。如果不存在，则进行第 3 条查找。
6. 如果继续失败，则取出 module path 数组中的下一个目录作为基准查找，循环第 1 至 5 个步骤。
7. 如果继续失败，循环第 1 至 6 个步骤，直到 module path 中的最后一个值。
8. 如果仍然失败，则抛出异常。

整个查找过程十分类似原型链的查找和作用域的查找。所幸 Node.js 对路径查找实现了`缓存机制`，否则由于每次判断路径都是同步阻塞式进行，会导致严重的性能消耗。

一旦加载成功就以模块的路径进行缓存.

![查找](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/25/16f38d1d79c552e0~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

## 3. 模块编译

每个模块文件模块都是一个对象，它的定义如下:

```js
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }
  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```

对于不同扩展名，其载入方法也有所不同：

- `.js`通过 fs 模块同步读取文件后编译执行。
- `.node`这是 C/C++编写的扩展文件，通过`dlopen()`方法加载最后编译生成的文件
- `.json`同过 fs 模块同步读取文件后，用`JSON.pares()`解析返回结果

其他当作`.js`.

每一个编译成功的模块都会将其文件路径作为索引缓存在`Module._cache`对象上。

#### json 文件的编译

`.json`文件调用的方法如下:其实就是调用`JSON.parse`

```js
//Native extension for .json
Module._extensions['.json'] = function (module, filename) {
  var content = NativeModule.require('fs').readFileSync(filename, 'utf-8');
  try {
    module.exports = JSON.parse(stripBOM(content));
  } catch (err) {
    err.message = filename + '：' + err.message;
    throw err;
  }
};
```

`Module._extensions`会被赋值给`require()`的`extensions`属性，所以可以用:`console.log(require.extensions);`输出系统中已有的扩展加载方式。 当然也可以自己增加一些特殊的加载:

```js
require.extensions['.txt'] = function(){
//code
};。
```

但是官方不鼓励通过这种方式自定义扩展名加载，而是期望先将其他语言或文件编译成 JavaScript 文件后再加载，这样的好处在于不将烦琐的编译加载等过程引入 Node 的执行过程。

#### js 模块的编译

在编译的过程中，Node 对获取的`javascript`文件内容进行了头尾包装，将文件内容包装在一个`function`中：

```js
(function (exports, require, module, __filename, __dirname) {
  var math = require('math');
  exports.area = function (radius) {
    return Math.PI * radius * radius;
  };
});
```

包装之后的代码会通过 vm 原生模块的`runInThisContext()`方法执行（具有明确上下文，不污染全局），返回一个具体的`function`对象，最后传参执行，执行后返回`module.exports`.
