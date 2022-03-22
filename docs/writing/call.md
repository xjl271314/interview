---
title: 手写实现call
nav:
  title: 编程题
  path: /writing
  order: 1
group:
  title: 编程题
  path: /writing/project
---

# 手写实现 call

- 2022.03.15

## 实现

```js
Function.prototype.call = function (context = window) {
  context.fn = this;
  // 第一个参数为this
  const args = [...arguments].slice(1);
  const res = context.fn(...args);

  delete context.fn;

  return res;
};
```

## 使用示例

```js
//用法：f.call(obj,arg1)
function f(a, b) {
  console.log(a + b);
  console.log(this.name);
}

let obj = {
  name: 1,
};

f.call(obj, 1, 2); // 否则this指向window
```
