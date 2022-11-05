---
title: Web Worker
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Web Worker

- 2022.10.28

在 HTML5 的新规范中，实现了 `Web Worker` 来引入 `js` 的 `多线程` 技术.

我们知道 `JavaScript` 一直是属于单线程环境，我们无法同时运行两个 JavaScript 脚本；

而使用`Web Worker`可以让我们在页面主运行的 js 线程中，加载运行另外单独的一个或者多个 js 线程。

> Web Worker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。此外，他们可以使用 XMLHttpRequest 执行 I/O (尽管 responseXML 和通道属性总是为空)。一旦创建， 一个 worker 可以将消息发送到创建它的 JavaScript 代码, 通过将消息发布到该代码指定的事件处理程序。

## 使用场景

### 1.处理大量计算，避免页面造成假死

浏览器有 GUI 渲染线程与 JS 引擎线程，这两个线程是互斥的关系。

当 js 有大量计算时，会造成 UI 阻塞，出现界面卡顿、掉帧等情况，严重时会出现页面卡死的情况，俗称假死

### 2.提高 Canvas 运行速度

web worker 除了单纯进行计算外，还可以结合离屏 canvas 进行绘图，提升绘图的渲染性能和使用体验。

## 使用示例

1. 安装 worker-loader

   ```js
   npm install worker-loader
   ```

2. 编写 worker.js

   ```js
   onmessage = function (e) {
     // onmessage获取传入的初始值
     let sum = e.data;
     for (let i = 0; i < 200000; i++) {
       for (let i = 0; i < 10000; i++) {
         sum += Math.random();
       }
     }
     // 将计算的结果传递出去
     postMessage(sum);
   };
   ```

3. 引入 worker.js

   ```js
   import Worker from './worker';
   ```

4. 业务中

   ```js
   let worker = new Worker();
   // 线程之间通过postMessage进行通信
   worker.postMessage(0);
   // 监听message事件
   worker.addEventListener('message', (e) => {
     // 关闭线程
     worker.terminate();
     // 获取计算结束的时间
     let end = performance.now();
     // 得到总的计算时间
     let durationTime = end - start;
     console.log('计算结果:', e.data);
     console.log(`代码执行了 ${durationTime} 毫秒`);
   });
   ```

### 终止 worker

```js
worker.terminate();
```

### 监听 worker 的出错

```js
// 监听 error 事件
worker.addEventListener('error', function (e) {
  console.log('MAIN: ', 'ERROR', e);
  console.log(
    'MAIN: ',
    'ERROR',
    'filename:' +
      e.filename +
      '---message:' +
      e.message +
      '---lineno:' +
      e.lineno,
  );
});

// 或者可以使用 onMessage 来监听事件：
worker.onerror = function () {
  console.log('MAIN: ', 'ERROR', e);
};
```

## Worker 的环境与作用域

在 Worker 线程的运行环境中没有 window 全局对象，也无法访问 DOM 对象，所以一般来说他只能来执行纯 JavaScript 的计算操作。

但是，他还是可以获取到部分浏览器提供的 API 的：

- `setTimeout()， clearTimeout()， setInterval()， clearInterval()`：有了设计个函数，就可以在 Worker 线程中执行定时操作了；
- `XMLHttpRequest` 对象：意味着我们可以在 Worker 线程中执行 **ajax** 请求；
- `navigator` 对象：可以获取到 ppName，appVersion，platform，userAgent 等信息；
- `location` 对象（只读）：可以获取到有关当前 URL 的信息；

## Worker 中加载外部脚本

可以通过 Worker 环境中的全局函数 `importScripts()` 加载外部 js 脚本到当前 Worker 脚本中，它接收多个参数，参数都为加载脚本的链接字符串，比如：

```js
importScripts('worker2.js', 'worker3.js');
```
