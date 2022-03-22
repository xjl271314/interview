---
title: 手写实现Array.map()
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写数组的 map 方法

- 2022.03.15

数组的 `map()` 方法会返回一个新的数组，这个新数组中的每个元素对应原数组中的对应位置元素调用一次提供的函数后的返回值。

```js
const a = [1, 2, 3, 4];
const b = a.map((x) => x * 2);
console.log(b); // [2, 4, 6, 8]
```

## 定义

```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array
}[, thisArg])
```

函数参数说明:

- callback:
  生成新数组元素的函数，包含三个参数：
  - currentValue 数组中正在处理的当前元素。
  - index 可选 数组中当前元素的下标索引
  - array 可选 原数组
- thisArg 可选 执行函数时的 this

## 实现

### for 循环实现

```js
Array.prototype.map = function (fn, context = []) {
  let result = [];
  let arr = this;
  for (let i = 0; i < arr.length; i++) {
    const currentValue = arr[i];
    // this currentValue index arr
    result.push(fn.call(context, currentValue, i, arr));
  }

  console.log('for');

  return result;
};
```

### 使用 Array.reduce 实现

```js
Array.prototype.map = function (fn, context = []) {
  let result = [];
  this.reduce(function (pre, cur, index, arr) {
    result.push(fn.call(context, cur, index, arr));
  }, []);

  console.log('Array.reduce');
  return result;
};
```

## 使用示例

```js
var arr = [2, 3, 1, 5];

arr.map(function (item, index, arr) {
  return item * 2;
});
```
