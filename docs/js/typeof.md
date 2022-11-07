---
title: typeof 与 instanceof
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# typeof 和 instanceof 的原理是什么?

- 2021.06.04

这两个东西，平时中基本都会用，而且使用场景也比较常见，常用于判断变量的类型或者变量是否是某个对象的实例。

## typeof

> `typeof` 常用于判断`基础类型`的变量，针对引用类型的变量，它的返回值都是`object`。

```js
const a = '1';
const b = 2;
const c = {};
const d = true;
const e = function () {};
const f = undefined;
const g = Symbol('111');

// string number object boolean function undefined symbol
[a, b, c, d, e, f, g].forEach((item) => console.log(typeof item));

const aa = {};
const bb = [];
const cc = new String('');

// object object object
[aa, bb, cc].forEach((item) => console.log(typeof item));
```

知道了如何使用,那么在`javascript`中 `typeof` 底层的原理是怎么实现的呢?

我们可以先想一个很有意思的问题，`js` 在底层是怎么`存储数据`的类型信息呢？或者说，一个 `js` 的变量，在它的底层实现中，它的类型信息是怎么实现的呢？

其实，`js` 在底层存储变量的时候，会在`变量`的`机器码`的`低位 1-3 位存储其类型信息`:

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

但是对于 `undefined` 和 `null` 来说，这两个值的信息存储是有点特殊的。

- null：所有机器码均为 0.
- undefined：用 −2^30 整数来表示.

所以，`typeof` 在判断 `null` 的时候就出现问题了，由于 `null` 的所有机器码均为 `0`，因此直接被当做了`对象`来看待。

## instanceof

> `instanceof` 常用于判断某个对象是具体哪类属性，或用于判断该对象是否是某个对象的实例。

上面的代码我们用`instanceof`来进行判断

```js
const aa = {};
const bb = [];
const cc = new String('');

// true true true
aa instanceof Object;
bb instanceof Array;
cc instanceof String;
```

说完了`typeof`的实现原理,那么对于`instanceof`它的内部逻辑又是怎么样的呢?

根据 `ECMAScript` 语言规范，我梳理了一下大概的思路，然后整理了一段代码如下:

```js
function new_instance_of(leftVaule, rightVaule) {
  // 获取取右表达式的 prototype 值
  let rightProto = rightVaule.prototype;

  // 获取左表达式的__proto__值;
  leftVaule = leftVaule.__proto__;

  while (true) {
    if (leftVaule === null) {
      return false;
    }
    if (leftVaule === rightProto) {
      return true;
    }
    leftVaule = leftVaule.__proto__;
  }
}
```

其实 `instanceof` 主要的实现原理就是只要右边变量的 `prototype` 在左边变量的`原型链上`即可。

因此，`instanceof` 在查找的过程中会遍历左边变量的`原型链`，直到找到右边变量的 `prototype`，如果查找失败，则会返回 `false`，告诉我们左边变量并非是右边变量的实例。
