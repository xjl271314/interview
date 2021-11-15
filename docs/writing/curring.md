---
title: 实现add(1)(2)(3)
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 实现 add(1)(2)(3)

- 2021.10.14

这里其实涉及到了`柯里化`的知识。

> `柯里化（currying）`指的是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回一个新的函数进行处理，直到处理完所有的参数。

## 最简版

```js
const add = (x) => (y) => (z) => x + y + z;
```

## 极简版

这种方式能快速的实现，但是假如传入的是如下的结构，我们就需要去书写多个方法。

```js
add(1, 2, 3);
add(1, 2)(3);
add(1)(2, 3);
```

**主要思路是判断当前传入函数的参数个数 (args.length) 是否大于等于原函数所需参数个数 (fn.length)**

- 如果是，则执行当前函数；
- 如果否，则返回一个函数。

```js
const curry = (fn, ...args) =>
  // 函数的参数个数可以直接通过函数的.length属性来访问
  args.length >= fn.length // 这个判断很关键！！！
    ? // 传入的参数大于等于原始函数fn的参数个数，则直接执行该函数
      fn(...args)
    : /**
       * 传入的参数小于原始函数fn的参数个数时
       * 则继续对当前函数进行柯里化，返回一个接受所有参数（当前参数和剩余参数） 的函数
       */
      (..._args) => curry(fn, ...args, ..._args);

function add1(x, y, z) {
  return x + y + z;
}

const add = curry(add1);
console.log(add(1, 2, 3));
console.log(add(1)(2)(3));
console.log(add(1, 2)(3));
console.log(add(1)(2, 3));
```
