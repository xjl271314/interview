---
title: Node事件循环机制
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: Node相关
  path: /project/node
---

# Node 事件循环机制

- 2022.11.02

## Node 事件循环机制与浏览器的区别

**主要区别：浏览器中的微任务是在每个相应的宏任务中执行的，而 nodejs 中的微任务是在不同阶段之间执行的。**

node 事件循环机制分为 6 个阶段，它们会按照顺序反复运行：

每个阶段都有一个要执行的回调 FIFO 队列。 尽管每个阶段都有其自己的特殊方式，但是通常，当事件循环进入给定阶段时，它将执行该阶段特定的任何操作，然后在该阶段的队列中执行回调，直到队列耗尽或执行回调的最大数量为止。 当队列已为空或达到回调限制时，事件循环将移至下一个阶段，依此类推。

```js
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

从上图中，大致看出 node 中的事件循环的顺序：

外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段（按照该顺序反复运行）…

- timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
- I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
- idle, prepare 阶段：仅 node 内部使用
- poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
- check 阶段：执行 setImmediate() 的回调
- close callbacks 阶段：执行 socket 的 close 事件回调

我们详细介绍`timers`、`poll`、`check`这 3 个阶段，因为日常开发中的绝大部分异步任务都是在这 3 个阶段处理的。

## timers

`timers` 阶段会执行 `setTimeout` 和 `setInterval` 回调，并且是由 `poll` 阶段控制的。

同样，在 `Node` 中定时器指定的时间也不是准确时间，只能是尽快执行。

## poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情：

1. 回到 timer 阶段执行回调
2. 执行 I/O 回调

并且在进入该阶段时如果没有设定了 `timer` 的话，会发生以下两件事情：

1. 如果 `poll` 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
2. 如果 `poll` 队列为空时，会有两件事发生：
   1. 如果有 `setImmediate` 回调需要执行，`poll` 阶段会停止并且进入到 `check` 阶段执行回调
   2. 如果没有 `setImmediate` 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去。

当然设定了 `timer` 的话且 `poll` 队列为空，则会判断是否有 `timer` 超时，如果有的话会回到 `timer` 阶段执行回调。

## check 阶段

`setImmediate()`的回调会被加入 `chec`k 队列中，从 `event loop` 的阶段图可以知道，`check` 阶段的执行顺序在 `poll` 阶段之后。

```js
console.log('start');
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function () {
    console.log('promise1');
  });
}, 0);
setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(function () {
    console.log('promise2');
  });
}, 0);
Promise.resolve().then(function () {
  console.log('promise3');
});
console.log('end');
// start=>end=>promise3=>timer1=>timer2=>promise1=>promise2
```

- 一开始执行栈的同步任务（这属于宏任务）执行完毕后（依次打印出 start end，并将 2 个 timer 依次放入 timer 队列）,会先去执行微任务（这点跟浏览器端的一样），所以打印出 promise3

- 然后进入 timers 阶段，执行 timer1 的回调函数，打印 timer1，并将 promise.then 回调放入 microtask 队列，同样的步骤执行 timer2，打印 timer2；这点跟浏览器端相差比较大，timers 阶段有几个 `setTimeout/setInterval` 都会依次执行，并不像浏览器端，每执行一个宏任务后就去执行一个微任务。

## setTimeout 和 setImmediate 区别

二者非常相似，区别主要在于调用时机不同。

- setImmediate 设计在 poll 阶段完成时执行，即 check 阶段；
- setTimeout 设计在 poll 阶段为空闲时，且设定时间到达后执行，但它在 timer 阶段执行。

```js
setTimeout(function timeout() {
  console.log('timeout');
}, 0);

setImmediate(function immediate() {
  console.log('immediate');
});
```

- 对于以上代码来说，`setTimeout` 可能执行在前，也可能执行在后。

- 首先 `setTimeout(fn, 0) === setTimeout(fn, 1)`，这是由源码决定的
  进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 `timer` 阶段就会直接执行 `setTimeout` 回调。

- 如果准备时间花费小于 1ms，那么就是 `setImmediate` 回调先执行了

**但当二者在`异步 i/o callback` 内部调用时，总是先执行 `setImmediate`，再执行 `setTimeout`**

```js
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
// immediate
// timeout
```

在上述代码中，`setImmediate` 永远先执行。因为两个代码写在 IO 回调中，IO 回调是在 poll 阶段执行，当回调执行完毕后队列为空，发现存在 `setImmediate` 回调，所以就直接跳转到 check 阶段去执行回调了。

## process.nextTick

这个函数其实是独立于 `Event Loop` 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 `nextTick` 队列，就会清空队列中的所有回调函数，并且优先于其他 `microtask` 执行。

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function () {
    console.log('promise1');
  });
}, 0);
process.nextTick(() => {
  console.log('nextTick');
  process.nextTick(() => {
    console.log('nextTick');
    process.nextTick(() => {
      console.log('nextTick');
      process.nextTick(() => {
        console.log('nextTick');
      });
    });
  });
});
// nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1
```
