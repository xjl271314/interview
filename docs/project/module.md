---
title: 前端模块化
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 说说 JS 中的模块化机制?

- 2021.07.06

## 模块化的理解

### 什么是模块?

> 模块化是将一个复杂的程序依据一定的规则(规范)封装成几个块(文件), 并进行组合在一起，块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信。

### 模块化的好处？

- 避免命名冲突(减少命名空间污染)
- 更好的分离, 按需加载
- 更高复用性
- 高可维护性

## 模块化的标准

### Common.js

- `CommonJS` 主要运行于服务器端，该规范指出，一个单独的文件就是一个模块。

其中 `Node.js` 为主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。

在 Node 应用中每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

**在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。**

#### 特点

- `CommonJS` 采用`同步加载模块`，而加载的文件资源大多数在本地服务器，所以执行速度或时间没问题。但是在浏览器端，限于网络原因，更合理的方案是使用`异步加载`。

- 所有代码都运行在模块作用域，不会污染全局作用域。

- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。

- 模块加载的顺序，按照其在代码中出现的顺序。

#### 基本语法

- 暴露模块

```js
module.exports = value;

exports.xxx = value;
```

- 引入模块

```js
// 如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径
require(xxx);
```

#### CommonJS 暴露的模块到底是什么?

`CommonJS` 规范规定，每个模块内部，`module` 变量代表`当前模块`。这个变量是一个`对象`，它的 `exports 属性`（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 `module.exports` 属性。

```js
// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

上面代码通过 `module.exports` 输出变量 `x` 和函数 `addX`。

```js
var example = require('./example.js'); //如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
console.log(example.x); // 5
console.log(example.addX(1)); // 6
```

`require` 命令用于加载模块文件。`require` 命令的基本功能是，读入并执行一个 `JavaScript` 文件，然后返回该模块的 `exports` 对象。**如果没有发现指定模块，会报错。**

### ES6 Module

- `ES Module` 是 `JavaScript` 官方的标准化模块系统,因为它是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用(因为浏览器默认加载不能省略`.js`)。

- `ES Module`同时兼容在 `node` 环境下运行。

- `ES Module`模块的导入导出，通过 `import` 和 `export` 来确定。

- `ES Module`可以和 `Commonjs` 模块混合使用。

#### 基本语法

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
  return a + b;
};
export { basicNum, add };

/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
  ele.textContent = add(99 + basicNum);
}
```

#### 两者之间的区别

- `CommonJS` 模块输出的是一个`值的拷贝`，`ES6` 模块输出的是`值的引用`。

**我们重点看一下这个区别，`CommonJS` 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件 `lib.js` 的例子。**

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量 `counter` 和改写这个变量的内部方法 `incCounter`。然后，在 `main.js` 里面加载这个模块。

```js
// main.js
// main.js
var mod = require('./lib');

console.log(mod.counter); // 3

mod.incCounter();

console.log(mod.counter); // 3
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '上面代码说明，`lib.js` 模块加载以后，它的内部变化就影响不到输出的 `mod.counter` 了。这是因为 `mod.counter` 是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。';

export default () => <Info type="info" txt={txt} />;
```

```js
// 修改后的lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter;
  },
  incCounter: incCounter,
};
```

上面代码中，输出的 `counter` 属性实际上是一个取值器函数。现在再执行 `main.js`，就可以正确读取内部变量 `counter` 的变动了。

```js
$ node main.js
3
4
```

- 而 `ES6` 模块的运行机制与 `CommonJS` 不一样。`JS 引擎`对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个`只读引用`。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

换句话说，`ES6`  的 `import` 有点像  `Unix`  系统的符号连接，原始值变了，`import` 加载的值也会跟着变。

因此，`ES6`  模块是`动态引用`，并且不会缓存值，模块里面的变量绑定其所在的模块。

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```
