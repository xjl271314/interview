---
title: this指向问题
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 箭头函数中的 this 和普通函数中 this 的有啥区别?

- 2021.06.02

> `ES6` 之前的函数中 `this` 的指向都是跟`函数运行时的执行环境`有关的，使用`箭头函数`的时候 `this` 指向跟`函数定义时的执行环境`有关(`this` 是继承自父执行上下文)。并且箭头函数语法更简洁，没有自己的 `this`，`arguments`，`super` 等。

```js
// es5
var list = [1, 2, 3, 4, 5, 6, 7];
var newList = list.map(function (item) {
  return item * item;
});

// es6
const list = [1, 2, 3, 4, 5, 6, 7];
const newList = list.map((item) => item * item);

// es5 function
var a = 11;
var obj = {
  a: 22,
  say: function () {
    console.log(this.a);
  },
};
obj.say(); // 22 this指向运行时的obj对象

// 箭头函数
var a = 11;
var obj = {
  a: 22,
  say: () => {
    console.log(this.a);
  },
};
obj.say(); // 11 箭头函数的this指向obj所在的环境

// 再来看看另外一题
var a = 11;
function test1() {
  this.a = 22;
  let b = function () {
    console.log(this.a);
  };
  b();
}
var x = new test1(); // 11 运行时this指向window

var a = 11;
function test2() {
  this.a = 22;
  let b = () => {
    console.log(this.a);
  };
  b();
}
var x = new test2(); // 22
```

## 总结

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '简单来说就是,箭头函数的`this`指向定义时的上下文环境(继承自父执行上下文),普通函数的`this`指向运行的上下文环境。\n\n另外,箭头函数是不可以当构造函数的,也就是不能通过new操作符进行操作,否则会报错。\n\n因为箭头函数本身没有自己的`this`,也没有`arguments`对象,因此`call()`、`apply()`、`bind()`这些方法去改变`this`指向的方法对箭头函数也是无效的。';

export default () => <Info type="info" txt={txt} />;
```
