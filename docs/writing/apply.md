---
title: 手写实现apply
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写实现 apply

- 2022.03.15

## 实现

```js
Function.prototype.apply = function (context = window) {
  context.fn = this;
  // 第一个参数为this apply第二个参数为数组
  const args = arguments[1] || [];
  const res = context.fn(...args);

  delete context.fn;

  return res;
};
```

## 使用示例

```js
// 用法：f.apply(obj,arg1)
function f(a, b) {
  console.log(a + b);
  console.log(this.name);
}

let obj = {
  name: 1,
};

f.apply(obj, [1, 2]); // 否则this指向window
```
