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

这个模型简单易懂，这里最关键的点就是在 `then` 中新创建的 `Promise`，它的状态变为 `fulfilled` 的`节点`是在上一个 `Promise` 的回调执行完毕的时候。

也就是说当一个 `Promise` 的状态被 `fulfilled` 之后，会执行`其回调函数`，而`回调函数`返回的结果会被当作 `value`，返回给下一个 `Promise`(也就是 `then` 中产生的 `Promise`)，同时下一个 `Promise` 的状态也会被改变(执行 `resolve` 或 `reject`)，然后再去执行其`回调`,以此类推下去...`链式调用`的效应就出来了。

我们来用上面实现的方法进行测试一下:

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ test: 1 });
  }, 1000);
})
  .then((data) => {
    console.log('result1', data);
    // dosomething
    return test();
  })
  .then((data) => {
    console.log('result2', data);
  });

function test(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ test: 2 });
    }, 5000);
  });
}
// 基于第一个 Promise 模型，执行后的输出
// result1 { test: 1 }
// result2 Promise {then: ƒ}
```

用上面的 `Promise` 模型，得到的结果显然不是我们想要的。认真看上面的模型，执行 `callback.resolve` 时，传入的参数是 `callback.onFulfilled` 执行完成的返回，显然这个测试例子返回的就是一个 `Promise`，而我们的 `Promise` 模型中的 `resolve` 方法并没有特殊处理。那么我们将 `resolve` 改一下:

```js
function Promise(fn){
    ...
    function resolve(newValue){
        const fn = ()=>{
                if(state !== 'pending') return;

                if(newValue && (typeof newValue === 'object' || typeof newValue === 'function')){
                    const { then } = newValue;
                    if(typeof then === 'function'){
                        // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
                        // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
                        then.call(newValue,resolve);

                        return;
                    }
                }
                state = 'fulfilled';
                value = newValue;
                handelCb();
            }

            setTimeout(fn,0);
        }
        ...
}
```

再测试我们的例子，就得到了正确的结果。

显然，新增的逻辑就是针对 `resolve` 入参为 `Promise` 的时候的处理。我们观察一下 `test` 里面创建的 `Promise`，它是没有调用 `then` 方法的。从上面的分析我们已经知道 `Promise` 的`回调函数`就是通过调用其 `then` 方法注册的，因此 `test` 里面创建的 `Promise` 其回调函数为空。

显然如果没有回调函数，执行 `resolve` 的时候，是没办法`链式`下去的。因此，我们需要主动为其注入`回调函数`。

我们只要把第一个 `then` 中产生的 `Promise` 的 `resolve` 函数的执行，延迟到 `test` 里面的 `Promise` 的状态为 `onFulfilled` 的时候再执行，那么`链式`就可以继续了。所以，当 `resolve` 入参为 `Promise` 的时候，调用其 `then` 方法为其注入回调函数，而注入的是前一个 `Promise` 的 `resolve` 方法，所以要用 `call` 来绑定 `this` 的指向。

## reject

下面我们再来补全 `reject` 的逻辑。只需要在`注册回调`、`状态改变`时加上 `reject` 的逻辑即可。

```js
function Promise(fn) {
  let state = 'pending';
  let value = null;
  const callbacks = [];

  this.then = function (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      handle({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
    });
  };

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }

    const cb =
      state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;
    const next = state === 'fulfilled' ? callback.resolve : callback.reject;

    if (!cb) {
      next(value);
      return;
    }
    const ret = cb(value);
    next(ret);
  }
  function resolve(newValue) {
    const fn = () => {
      if (state !== 'pending') return;

      if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
      ) {
        const { then } = newValue;
        if (typeof then === 'function') {
          // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
          // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
          then.call(newValue, resolve, reject);
          return;
        }
      }
      state = 'fulfilled';
      value = newValue;
      handelCb();
    };

    setTimeout(fn, 0);
  }
  function reject(error) {
    const fn = () => {
      if (state !== 'pending') return;

      if (error && (typeof error === 'object' || typeof error === 'function')) {
        const { then } = error;
        if (typeof then === 'function') {
          then.call(error, resolve, reject);
          return;
        }
      }
      state = 'rejected';
      value = error;
      handelCb();
    };
    setTimeout(fn, 0);
  }
  function handelCb() {
    while (callbacks.length) {
      const fn = callbacks.shift();
      handle(fn);
    }
  }
  fn(resolve, reject);
}
```

## 异常处理

异常通常是指在`执行成功/失败`回调时代码出错产生的错误，对于这类异常，我们使用 `try-catch` 来捕获错误，并将 `Promise` 设为 `rejected` 状态即可。

我们将 `handle` 进行改造:

```js
function handle(callback) {
  if (state === 'pending') {
    callbacks.push(callback);
    return;
  }

  const cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;
  const next = state === 'fulfilled' ? callback.resolve : callback.reject;

  if (!cb) {
    next(value);
    return;
  }
  try {
    const ret = cb(value);
    next(ret);
  } catch (e) {
    callback.reject(e);
  }
}
```

我们实际使用时，常习惯注册 `catch` 方法来处理错误，例如：

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ test: 1 });
  }, 1000);
})
  .then((data) => {
    console.log('result1', data);
    //dosomething
    return test();
  })
  .catch((ex) => {
    console.log('error', ex);
  });
```

实际上，错误也好，异常也罢，最终都是通过 `reject` 实现的。也就是说可以通过 `then` 中的`错误回调`来处理。所以我们可以增加这样的一个 `catch` 方法：

```js
function Promise(fn){
    ...
    this.then = function (onFulfilled,onRejected){
        return new Promise((resolve, reject)=>{
            handle({
                onFulfilled,
                onRejected,
                resolve,
                reject
            })
        })
    }
    this.catch = function (onError){
        this.then(null,onError)
    }
    ...
}
```

## `Promise.finally`

实际使用中，我们经常还会使用 `finally` 去处理超时异常等情况。

```js
function Promise(fn){
    ...
    this.catch = function (onError){
        this.then(null,onError)
    }
    this.finally = function (onDone){
        this.then(onDone,onDone)
    }
    ...
}
```

## resolve 方法和 reject 方法

实际应用中，我们可以使用 `Promise.resolve` 和 `Promise.reject` 方法，用于将非 `Promise` 实例包装为 `Promise` 实例。如下例子：

```js
Promise.resolve({ name: 'Jack' });
Promise.reject({ name: 'Jack' });
// 等价于
new Promise((resolve) => resolve({ name: 'Jack' }));
new Promise((resolve, reject) => reject({ name: 'Jack' }));
```

这些情况下，`Promise.resolve` 的入参可能有以下几种情况：

- 无参数 [直接返回一个 resolved 状态的 Promise 对象].
- 普通数据对象 [直接返回一个 resolved 状态的 Promise 对象].
- 一个 Promise 实例 [直接返回当前实例].
- 一个 thenable 对象(thenable 对象指的是具有 then 方法的对象) [转为 `Promise` 对象，并立即执行 `thenable` 对象的 `then` 方法。]

基于以上几点，我们可以实现一个 `Promise.resolve` 方法如下：

```js
function Promise(fn){
    ...
    this.resolve = function (value){
        if (value && value instanceof Promise) {
            return value;
        } else if (value && typeof value === 'object' && typeof value.then === 'function'){
            let then = value.then;
            return new Promise(resolve => {
                then(resolve);
            });
        } else if (value) {
            return new Promise(resolve => resolve(value));
        } else {
            return new Promise(resolve => resolve());
        }
    }
    ...
}
```

`Promise.reject` 与 `Promise.resolve` 类似，区别在于 `Promise.reject` 始终返回一个状态的 `rejected` 的 `Promise` 实例，而 `Promise.resolve` 的参数如果是一个 `Promise` 实例的话，返回的是参数对应的 `Promise` 实例，所以状态不一 定。

因此，`reject` 的实现就简单多了，如下：

```js
function Promise(fn){
    ...
    this.reject = function (value){
        return new Promise(function(resolve, reject) {
            reject(value);
        });
    }
    ...
}
```

## Promise.all

实际使用中我们还会经常用到 `promise.all` 方法，等待所有 `promise` 完成之后进行后续的逻辑。我们来看看它是怎么实现的。

该方法入参是一个 `Promise` 的`实例数组`，然后注册一个 `then` 方法，然后是数组中的 `Promise` 实例的状态都转为 `fulfilled` 之后则执行 `then` 方法。这里主要就是一个`计数逻辑`，每当一个 `Promise` 的状态变为 `fulfilled` 之后就保存该实例返回的数据，然后将`计数减一`，当计数器变为 `0` 时，代表数组中所有 `Promise` 实例都执行完毕。

```js
function Promise(fn){
    ...
    this.all = function (arr){
        var args = Array.prototype.slice.call(arr);
        return new Promise(function(resolve, reject) {
            if(args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
                try {
                    if(val && (typeof val === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if(typeof then === 'function') {
                            then.call(val, function(val) {
                                res(i, val);
                            }, reject);
                            return;
                        }
                    }
                    args[i] = val;
                    if(--remaining === 0) {
                        resolve(args);
                    }
                } catch(ex) {
                    reject(ex);
                }
            }
            for(var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    }
    ...
}
```

## Promise.race

有了 `Promise.all` 的理解，`Promise.race` 理解起来就更容易了。它的入参也是一个 `Promise` 实例数组，然后其 `then` 注册的回调方法是数组中的某一个 `Promise` 的状态变为 `fulfilled` 的时候就执行。

因为 `Promise` 的状态只能改变一次，那么我们只需要把 `Promise.race` 中产生的 `Promise` 对象的 `resolve` 方法，注入到数组中的每一个 `Promise` 实例中的回调函数中即可。

```js
function Promise(fn){
    ...
    this.race = function(values) {
        return new Promise(function(resolve, reject) {
            for(var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    }
    ...
}
```

## Promise.allSettled

> `Promise.allSettled` 是在 `ES11` 中出现的语法，用于解决使用 `Promise.all` 的时候,如果其中某个任务出现`异常(reject)`，所有任务都会挂掉，`Promise` 直接进入 `reject` 状态。

试想一下当我们在一个页面中并发请求 3 块区域的数据的时候，如果其中一个接口挂了，这将导致页面的数据全都无法渲染出来，这是我们无法接受的。

```js
Promise.all([
  Promise.reject({
    code: 500,
    msg: '服务异常',
  }),
  Promise.resolve({
    code: 200,
    list: [],
  }),
  Promise.resolve({
    code: 200,
    list: [],
  }),
])
  .then((res) => {
    // 如果其中一个任务是 reject，则不会执行到这个回调。
    doSomething(res);
  })
  .catch((error) => {
    // 本例中会执行到这个回调
    // error: {code: 500, msg: "服务异常"}
  });
```

我们想要的是在`执行并发任务`中，无论一个任务`正常`或者`异常`，都会返回对应的的状态（`fulfilled` 或者 `rejected`）与结果（`业务 value` 或者 `拒因 reason`）。在 `then` 里面通过 `filter` 来过滤出想要的业务逻辑结果，这就能最大限度的保障业务当前状态的可访问性，而 `Promise.allSettled` 就是解决这问题的。

```js
Promise.allSettled([
    Promise.reject({code: 500, msg:'服务异常'}),
    Promise.resolve({ code: 200, list: []}),
    Promise.resolve({code: 200, list: []})])
]).then((res) => {
    /*
        0: {status: "rejected", reason: {…}}
        1: {status: "fulfilled", value: {…}}
        2: {status: "fulfilled", value: {…}}
    */
    // 其他业务过滤掉 rejected 状态，尽可能多的保证页面区域数据渲染
    RenderContent(res.filter((el) => {
        return el.status !== 'rejected';
    }));
});
```

## Promise.any

> `Promise.any` 是在 `ES12` 中提出的方法，和 `Promise.race` 类似——只要给定的迭代中的一个 `promise` 成功，就采用第一个 `promise` 的值作为它的返回值，但与 `Promise.race` 的不同之处在于——`它会等到所有 promise 都失败之后，才返回失败的值`。

```js
const myFetch = (url) =>
  setTimeout(() => fetch(url), Math.floor(Math.random() * 3000));
const promises = [
  myFetch('/endpoint-1'),
  myFetch('/endpoint-2'),
  myFetch('/endpoint-3'),
];
// 使用 .then .catch
Promise.any(promises) // 任何一个 promise 成功。
  .then(console.log) // 比如 ‘3’
  .catch(console.error); // 所有的 promise 都失败了
// 使用 async-await
try {
  const first = await Promise.any(promises); // 任何一个 promise 成功返回。
  console.log(first);
} catch (error) {
  // 所有的 promise 都失败了
  console.log(error);
}
```

## 总结

`Promise` 源码不过几百行，我们可以从`执行结果`出发，分析每一步的执行过程，然后思考其作用即可。其中最关键的点就是要理解 `then` 函数是负责注册回调的，真正的执行是在 `Promise` 的状态被改变之后。而当 `resolve` 的入参是一个 `Promise` 时，要想`链式`调用起来，就必须调用其 `then 方法(then.call)`,将上一个 `Promise` 的 `resolve` 方法注入其回调数组中。

虽然 `then` 普遍认为是`微任务`。但是`浏览器`没办法模拟`微任务`，目前要么用 `setImmediate` ，这个也是`宏任务`，且不兼容的情况下还是用 `setTimeout` 打底的。还有，`promise` 的 `polyfill (es6-promise)` 里用的也是 `setTimeout`。因此这里就直接用 `setTimeout`,以`宏任务`来代替`微任务`了。

```js
// 完整 promise代码
function Promise(fn) {
  let state = 'pending';
  let value = null;
  const callbacks = [];

  this.then = function (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      handle({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
    });
  };

  this.catch = function (onError) {
    return this.then(null, onError);
  };

  this.finally = function (onDone) {
    this.then(onDone, onError);
  };

  this.resolve = function (value) {
    if (value && value instanceof Promise) {
      return value;
    }
    if (
      value &&
      typeof value === 'object' &&
      typeof value.then === 'function'
    ) {
      const { then } = value;
      return new Promise((resolve) => {
        then(resolve);
      });
    }
    if (value) {
      return new Promise((resolve) => resolve(value));
    }
    return new Promise((resolve) => resolve());
  };

  this.reject = function (value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  };

  this.all = function (arr) {
    const args = Array.prototype.slice.call(arr);
    return new Promise((resolve, reject) => {
      if (args.length === 0) return resolve([]);
      let remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            const { then } = val;
            if (typeof then === 'function') {
              then.call(
                val,
                (val) => {
                  res(i, val);
                },
                reject,
              );
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }
      for (let i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  this.race = function (values) {
    return new Promise((resolve, reject) => {
      for (let i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }

    const cb =
      state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;
    const next = state === 'fulfilled' ? callback.resolve : callback.reject;

    if (!cb) {
      next(value);
      return;
    }
    let ret;
    try {
      ret = cb(value);
    } catch (e) {
      callback.reject(e);
    }
    callback.resolve(ret);
  }

  function resolve(newValue) {
    const fn = () => {
      if (state !== 'pending') return;

      if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
      ) {
        const { then } = newValue;
        if (typeof then === 'function') {
          // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
          // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
          then.call(newValue, resolve, reject);
          return;
        }
      }
      state = 'fulfilled';
      value = newValue;
      handelCb();
    };

    setTimeout(fn, 0);
  }
  function reject(error) {
    const fn = () => {
      if (state !== 'pending') return;

      if (error && (typeof error === 'object' || typeof error === 'function')) {
        const { then } = error;
        if (typeof then === 'function') {
          then.call(error, resolve, reject);
          return;
        }
      }
      state = 'rejected';
      value = error;
      handelCb();
    };
    setTimeout(fn, 0);
  }
  function handelCb() {
    while (callbacks.length) {
      const fn = callbacks.shift();
      handle(fn);
    }
  }
  try {
    fn(resolve, reject);
  } catch (ex) {
    reject(ex);
  }
}
```
