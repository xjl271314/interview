---
title: apply 和 call
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 说说 call 和 apply 吧?

- 2021.06.02

> 每个函数都包含两个非继承而来的方法:`apply()`和 `call()`。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 `this` 对象的值。

使用 `call()`（或 `apply()`）来扩充作用域的最大好处，就是对象不需要与方法有任何耦合关系。

## apply

> `apply()`方法接收两个参数:一个是在其中运行函数的作用域，另一个是参数数组。第二个参数可以是 `Array` 的实例，也可以是 `arguments` 对象。例如:

```js
function sum(num1, num2) {
  return num1 + num2;
}

function callSum1(num1, num2) {
  return sum.apply(this, arguments);
}

function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2]);
}

alert(callSum1(10, 10)); // 20
alert(callSum2(10, 10)); // 20
```

## call

> `call()`方法与 `apply()`方法的作用相同，它们的区别仅在于接收参数的方式不同。对于 `call()`方法而言，第一个参数是 `this` 值没有变化，变化的是传递给函数的参数必须逐个列举出来。

```js
function sum(num1, num2) {
  return num1 + num2;
}

function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}

alert(callSum(10, 10)); // 20
```
