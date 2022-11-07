---
title: nextTick原理
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: vue2
  path: /vue/2.0
---

# nextTick 原理

- 2022.11.01

**nextTick 为什么要优先使用微任务实现？**

`vue nextTick`的源码实现，异步优先级判断，总结就是`Promise > MutationObserver > setImmediate > setTimeout`

优先使用`Promise`，因为根据 `event loop` 与浏览器更新渲染时机，`宏任务 → 微任务 → 渲染更新`，使用`微任务`，本次`event loop`轮询就可以获取到`更新的dom`。

如果使用`宏任务`，要到下一次`event loop中`，才能获取到更新的 dom。

```js
// 定义nextTick的回调队列
let callbacks = [];

// 批量执行nextTick的回调队列
function flushCallbacks() {
  callbacks.forEach((cb) => cb());
  callbacks = [];
  pending = false;
}

//定义异步方法，优先使用微任务实现
let timerFunc;

// 优先使用promise 微任务
if (Promise) {
  timerFunc = function () {
    return Promise.resolve().then(flushCallbacks);
  };
  // 如不支持promise，再使用MutationObserver 微任务
} else if (MutationObserver) {
  timerFunc = function () {
    const textNode = document.createTextNode('1');
    const observer = new MutationObserver(() => {
      flushCallbacks();
      observer.disconnect();
    });
    const observe = observer.observe(textNode, { characterData: true });
    textNode.textContent = '2';
  };
  // 微任务不支持，再使用宏任务实现
} else if (setImmediate) {
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = function () {
    setTimeout(flushCallbacks);
  };
}

// 定义nextTick方法
export function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
```
