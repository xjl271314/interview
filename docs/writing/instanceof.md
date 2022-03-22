---
title: 手写instanceof
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写 instanceof

- 2022.03.15

## 简介

instanceof 作用:

> 判断一个实例是否是其父类或者祖先类型的实例。

`instanceof` 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 `prototype`，查找失败，返回 `false`。

## 实现

```js
function _instanceof (target, origin) {
    while(target) {
        if(target.__proto__ === origin.prototype) {
            return true;
        }

        target = = target.__proto__;
    }

    return false;
}


```
