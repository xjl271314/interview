---
title: 手写实现vue3的proxy
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写实现 vue3 的 proxy

```js
function observe(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      let result = Reflect.get(target, key);
      // 递归获取对象多层嵌套的情况，如pro.info.type（递归监听，保证每一层返回都是proxy对象）
      return isObject(result);
    },
    set(target, key, value, receiver) {
      if (key !== 'length') {
        // 解决对数组修改，重复更新视图的问题
        console.log('更新视图');
      }
      return Reflect.set(target, key, value, receiver);
    },
  });
}

function isObject(target) {
  if (typeof target === 'object' && target !== null) {
    return observe(target);
  } else {
    return target;
  }
}
let target = { name: '测试', info: { type: '1' } };
let pro = observe(target);
pro.info.type = 2; // 更新视图
```
