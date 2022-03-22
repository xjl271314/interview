---
title: 手写实现Array.reduce()
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写实现 Array.reduce()

- 2022.03.15

`reduce()` 方法对数组中的每个元素执行一个由您提供的`reducer函数(升序执行)`，将其结果汇总为单个返回值。

```js
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (previousValue, currentValue) => previousValue + currentValue,
  initialValue,
);

console.log(sumWithInitial); // 10
```

## 定义

```js
arr.reduce(callback(previousValue, currentValue[, index[, array]])[, initialValue]);
```

函数参数说明:

- callback:
  对每个元素调用的方法，包含四个参数：
  - previousValue 上一次调用回调函数时的返回值，或者初始值
  - currentValue 当前正在处理的数组元素
  - index 可选 当前正在处理的数组元素下标
  - array 可选 调用 reduce()方法的数组
- initialValue 可选 作为第一次调用回调函数时传给 previousValue 的初始值。

## 实现

```js
Array.prototype.reduce = function (fn, initialValue) {
  let arr = this;
  let sum = initialValue === undefined ? arr[0] : initialValue;
  let index = initialValue === undefined ? 1 : 0;
  for (let i = index; i < arr.length; i++) {
    sum = fn(sum, arr[i], i, arr);
  }

  return sum;
};
```
