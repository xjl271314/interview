---
title: 手写实现new
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写 new

- 2022.03.15

new 运算符用来创建用户自定义的对象类型的实例或者具有构造函数的内置对象的实例。

- new 会产生一个新对象；
- 新对象需要能够访问到构造函数的属性，所以需要重新指定它的原型；
- 构造函数可能会显式返回；

## 实现

```js
function myNew() {
  let obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  let ret = Constructor.apply(obj, arguments);

  // ret || obj 这里这么写考虑了构造函数显式返回 null 的情况
  return typeof ret === 'object' ? ret || obj : obj;
}
```
