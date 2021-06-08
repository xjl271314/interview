---
title: promise
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javaScript 中的 promise?

- 2021.06.07

## 诞生

> `Promise` 是 `ES6` 提供的一种`异步解决方案`，比回调函数更加清晰明了。

`Promise` 必须为以下三种状态之一:

- 等待态（Pending
- 执行态（Fulfilled）
- 拒绝态（Rejected）

一旦 `Promise` 被 `resolve` 或 `reject`，不能再迁移至其他任何状态（即`状态 immutable`）。

```js
new Promise((resolve, reject) => {
  resolve('success');
  // 无效
  reject('reject');
});
```

## 基本过程

> `Promise` 的执行过程大致如下:

1. 初始化 `Promise 状态`，进入（pending）.
2. 立即执行 `Promise` 中传入的 `fn` 函数，将 `Promise` 内部 `resolve`、`reject` 函数作为参数传递给 `fn` ，按事件机制时机处理.
3. 执行 `then(..)` 注册回调处理数组（`then` 方法可被同一个 `promise` 调用多次）
4. `Promise`里的关键是要保证，`then`方法传入的参数 `onFulfilled` 和 `onRejected`，必须在`then`方法被调用的那一轮事件循环之后的新执行栈中执行。

这里有一点需要注意，当我们在构造 `Promise` 的时候,`构造函数`内部的代码是立即执行的。

```js
new Promise((resolve, reject) => {
  console.log('new promise');
  resolve('success');
});
console.log('finish');
// new promise -> finish -> success
```

## 链式调用

> 我们知道`Promise` 实现了`链式调用`，也就是说每次调用 `then` 之后返回的都是一个 `Promise`，并且是一个全新的 `Promise`，原因是因为`状态不可变`。如果在 `then` 中使用了 `return`，那么 `return` 的值会被 `Promise.resolve()`包裹。

```js
Promise.resolve(1)
  .then((res) => {
    console.log(res); // 1
    return 2; // Promise.resolve(2)
  })
  .then((res) => {
    console.log(res); // 2
  });
```

基于这些特点，我们首先来看看基于[promiseA+](https://promisesaplus.com/)规范来实现只含 `resolve` 方法的 `Promise` 模型:

```js
function Promise(fn) {
  let state = 'pending';
  let value = null;
  const callbacks = [];

  this.then = function (onFulfilled) {
    return new Promise((resolve, reject) => {
      handle({
        // 桥梁，将新 Promise 的 resolve 方法，放到前一个 promise 的回调对象中
        onFulfilled,
        resolve,
      });
    });
  };

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }

    if (state === 'fulfilled') {
      if (!callback.onFulfilled) {
        callback.resolve(value);
        return;
      }
      const ret = callback.onFulfilled(value); // 处理回调
      callback.resolve(ret); // 处理下一个 promise 的resolve
    }
  }
  function resolve(newValue) {
    const fn = () => {
      if (state !== 'pending') return;

      state = 'fulfilled';
      value = newValue;
      handelCb();
    };

    setTimeout(fn, 0); // 基于 PromiseA+ 规范
  }

  function handelCb() {
    while (callbacks.length) {
      const fulfiledFn = callbacks.shift();
      handle(fulfiledFn);
    }
  }

  fn(resolve);
}
```
