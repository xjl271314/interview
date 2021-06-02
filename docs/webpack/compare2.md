---
title: Common.js VS ES6 Module
nav:
  title: webpack
  path: /webpack
  order: 0
group:
  title: webpack相关试题
  path: /webpack/project
---

# Common.js 与 ES6 Module 的区别?

- 2021.06.01

## Common.js:

- `CommonJS` 主要运行于服务器端，该规范指出，一个单独的文件就是一个模块。

其中 `Node.js` 为主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。

- `CommonJS` 采用`同步加载模块`，而加载的文件资源大多数在本地服务器，所以执行速度或时间没问题。但是在浏览器端，限于网络原因，更合理的方案是使用`异步加载`。

## ES6 Module:

- `ES Module` 是 `JavaScript` 官方的标准化模块系统,因为它是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用(因为浏览器默认加载不能省略`.js`)。

- `ES Module`同时兼容在 `node` 环境下运行。

- `ES Module`模块的导入导出，通过 `import` 和 `export` 来确定。

- `ES Module`可以和 `Commonjs` 模块混合使用。

## 两者之间的区别:

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
