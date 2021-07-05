---
title: requestAnimationFrame与requestIdleCallback
nav:
  title: 性能优化
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# 如何使用 requestAnimationFrame 与 requestIdleCallback?

- 2021.07.05

## requestAnimationFrame

在 `requestAnimationFrame` 出现之前在 js 中我们基本上都是使用 `setTimeout` 与 `setInterval` 来实现一些循环动画。

```js
function render(){
    ...
}

setInterval(function () {
  render();
}, 1000 / 60);
```

例如，我们每隔 1 帧去做些啥动画。理论上来说能够按照每 16.67ms 进行刷新从而达到预期的效果但是实际上用`setTimeout`、`setInterval`实现的动画在某些低端机型上会出现卡顿、抖动的现象。这种现象的产生主要有 2 个原因:

- `setTimeout`的执行时间并不是确定的。

在 `Javascript` 中， `setTimeout` 任务被放进了`异步队列`中，只有当`主线程`上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，**因此 `setTimeout` 的实际执行时间一般要比其设定的时间晚一些**。

- 刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 `setTimeout` 只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。

而使用`requestAnimationFrame`可以帮助解决这些问题，相比 `setTimeout`、`setInterval` 主要有两点优势:

1. `requestAnimationFrame` 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。

2. 在隐藏或不可见的元素中，`requestAnimationFrame` 将不会进行`重绘`或`回流`，这当然就意味着更少的的 `cpu`，`gpu` 和`内存使用量`。

```js
function render(){
    ...
}

(function animloop() {
  render();
  window.requestAnimationFrame(animloop);
}());
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '<strong style="color:#333;">如何停止`requestAnimationFrame`？</strong>\n\n`requestAnimationFrame`默认会返回一个`id`，`cancelAnimationFrame`只需要传入这个`id`就可以停止了。\n\n另外我们还可以自定义刷新帧率。';

export default () => <Info type="info" txt={txt} />;
```

```js
const fps = 30;
let nowTime = 0;
let lastTime = Date.now();
let requestId = null;
let count = 0;

function render(){
    ...
}

(function animloop() {
  nowTime = Date.now();
  if(nowTime - lastTime) >= fps{
      lastTime = Date.now();
      render();
      count++;
  }
  requestId = window.requestAnimationFrame(animloop);

  if(count >= 5){
      requestId && cancelAnimationFrame(requestId);
  }
}());
```

### 兼容性

`firefox`、`chrome`、`IE10` 以上， `requestAnimationFrame` 的支持很好，但不兼容 IE9 及以下浏览器，但是我们可以用定时器来做一下兼容，以下是兼容代码：

```js
(function () {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback) {
      /*调整时间，让一次动画等待和执行时间在最佳循环时间间隔内完成*/
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();
```

### 场景-大数据渲染

在大数据渲染过程中，比如表格的渲染，如果不进行一些性能策略处理，就会出现 UI 冻结现象，用户体验极差。

有个场景，将后台返回的十万条记录插入到表格中，如果一次性在循环中生成 DOM 元素，会导致页面卡顿 5s 左右。这时候我们就可以用 `requestAnimationFrame` 进行分步渲染，确定最好的时间间隔，使得页面加载过程中很流畅。

```js
var total = 10e4;
var size = 100;
var count = total / size;
var done = 0;
var ul = document.getElementById('list');

function addItems() {
  var li = null;
  var fg = document.createDocumentFragment();

  for (var i = 0; i < size; i++) {
    li = document.createElement('li');
    li.innerText = 'item ' + (done * size + i);
    fg.appendChild(li);
  }

  ul.appendChild(fg);
  done++;

  if (done < count) {
    requestAnimationFrame(addItems);
  }
}

requestAnimationFrame(addItems);
```

### 场景-监测 FPS

```js
// 如果连续判断 3次 FPS 都小于20，就认为是卡顿。
/*
利用 requestAnimationFrame 在一秒内执行 60 次（在不卡顿的情况下）这一点，
假设页面加载用时 X ms，这期间 requestAnimationFrame 执行了 N 次，
则帧率为1000* N/X，也就是FPS。
*/

/*但不同户客户端差异很大，需要考虑兼容性。
在这里我们定义 fpsCompatibility 表示兼容性方面的处理，在浏览器不支持
requestAnimationFrame 时，利用 setTimeout 来模拟实现。
在 fpsLoop 里面完成 FPS 的计算。
最后通过遍历 fpsList 来判断是否连续三次 fps 小于20。
*/
const fpsCompatibility = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

const fpsConfig = {
  lastTime: performance.now(), // performance 是一个浏览器提供的API

  lastFameTime: performance.now(),

  frame: 0,
};

const fpsList = [];

const fpsLoop = function () {
  const first = performance.now();

  const diff = first - fpsConfig.lastFameTime;

  fpsConfig.lastFameTime = first;

  const fps = Math.round(1000 / diff);

  fpsConfig.frame = fpsConfig.frame + 1;

  if (first > 1000 + fpsConfig.lastTime) {
    const fps = Math.round(
      (fpsConfig.frame * 1000) / (first - fpsConfig.lastTime),
    );

    fpsList.push(fps);

    console.log(`time: ${new Date()} fps is：`, fps);

    fpsConfig.frame = 0;

    fpsConfig.lastTime = first;
  }

  fpsCompatibility(fpsLoop);
};

fpsLoop();

function checkFPS(fpsList, below = 20, last = 3) {
  let count = 0;

  for (let i = 0; i < fpsList.length; i++) {
    if (fpsList[i] && fpsList[i] < below) {
      count++;
    } else {
      count = 0;
    }

    if (count >= last) {
      return true;
    }
  }

  return false;
}

checkFPS(fpsList);
```

## requestIdleCallback

> 当关注用户体验，不希望因为一些不重要的任务（如统计上报）导致用户感觉到卡顿的话，就应该考虑使用 `requestIdleCallback`。因为 `requestIdleCallback` 回调的执行的前提条件是**当前浏览器处于空闲状态**。

React 16 实现了新的`调度策略(Fiber)`, 新的调度策略提到的异步、可中断，其实就是基于浏览器的 `requestIdleCallback` 和 `requestAnimationFrame` 两个 API。

### 语法示例

```js
requestIdelCallback(myNonEssentialWork);

function myNonEssentialWork(deadline) {
  // deadline.timeRemaining()可以获取到当前帧剩余时间
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    doWorkIfNeeded();
  }
  if (tasks.length > 0) {
    requestIdleCallback(myNonEssentialWork);
  }
}
```

`deadline` 的结构如下:

```js
interface Dealine {
  didTimeout: boolean // 表示任务执行是否超过约定时间
  timeRemaining(): DOMHighResTimeStamp // 任务可供执行的剩余时间
}
```

![deadline结构](https://img-blog.csdnimg.cn/20210705203026605.png)

该图中的两个帧，在每一帧内部，`TASK` 和 `redering` 只花费了一部分时间，并没有占据整个帧，那么这个时候，如图中 `idle period` 的部分就是空闲时间，而每一帧中的空闲时间，根据该帧中处理事情的多少，复杂度等，消耗不等，所以空闲时间也不等。

而对于每一个 `deadline.timeRemaining()`的返回值，就是如图中，`Idle Callback` 到所在帧结尾的时间（ms 级）。

### 与 requestAnimationFrame 的区别

- `requestAnimationFrame` 的回调会在每一帧确定执行，属于`高优先级任务`。
- 而 `requestIdleCallback` 的回调则不一定，属于`低优先级任务`。

我们所看到的网页，都是浏览器一帧一帧绘制出来的，通常认为 `FPS` 为 60 的时候是比较流畅的，而 `FPS` 为个位数的时候就属于用户可以感知到的卡顿了，那么在一帧里面浏览器都要做哪些事情呢，如下所示：

![一帧](https://img-blog.csdnimg.cn/20210705203725389.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

图中一帧包含了`用户的交互`、`js 的执行`、以及 `requestAnimationFrame 的调用`，`布局计算`以及`页面的重绘`等工作。

假如某一帧里面要执行的任务不多，在不到 `16ms（1000/60)`的时间内就完成了上述任务的话，那么这一帧就会有一定的空闲时间，这段时间就恰好可以用来执行 `requestIdleCallback` 的回调，也就是上述图中提到的。

当程序栈为空页面无需更新的时候，浏览器其实处于空闲状态，这时候留给 `requestIdleCallback` 执行的时间就可以适当拉长，最长可达到 `50ms`。

#### 为啥最长是 `50ms` 呢?

为了以防出现不可预测的任务（用户输入）来临时无法及时响应可能会引起用户感知到的延迟。

但由于 `requestIdleCallback` 利用的是帧的空闲时间，所以就有可能出现浏览器一直处于繁忙状态，导致回调一直无法执行，这其实也并不是我们期望的结果（如上报丢失），那么这种情况我们就需要在调用 `requestIdleCallback` 的时候传入第二个配置参数 `timeout` 了？

```js
requestIdleCallback(myNonEssentialWork, { timeout: 2000 });

function myNonEssentialWork(deadline) {
  // 当回调函数是由于超时才得以执行的话，deadline.didTimeout为true
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    tasks.length > 0
  ) {
    doWorkIfNeeded();
  }
  if (tasks.length > 0) {
    requestIdleCallback(myNonEssentialWork);
  }
}
```

如果是因为 `timeout` 回调才得以执行的话，其实用户就有可能会感觉到卡顿了，因为一帧的执行时间必然已经超过 16ms 了。

### 场景-React Fiber

上文提到在 `React Fiber` 中其实是基于`requestIdleCallback`实现的，我们先来看看之前的 `Stack` 算法。

在 `React16` 之前的版本比对更新 `VirtualDOM` 的过程是采用`循环加递归`实现的。

这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，知道整棵 `Virtual DOM树`比对更新完成之后主线程才能被释放，主线程才能执行其他任务。

这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿，非常的影响用户体验。

**核心问题归纳起来就是： 递归无法中断，执行重任务耗时长。JavaScript 又是单线程，无法同时执行其他任务，导致任务延迟页面卡顿，用户体验差。**

在 `React16` 当中官方对 `React` 代码进行了大量的重写，其中 `Fiber` 就是很重要的一部分。

#### Fiber 解决方案

1. 利用浏览器空闲时间执行任务，拒绝长时间占用主线程

使用 `requestIdleCallback` 利用浏览器空闲时间，`virtual DOM` 的比对不会占用主线程，如果有高优先级的任务要执行就会暂时中止 `Virtual DOM` 比对的过程，先去执行`高优先级`的任务，高优先级任务执行完成之后，继续执行 `Virtual DOM` 比对的任务，这样的话就不会出现页面卡顿的现象了。

2. 放弃递归只采用循环，因为循环可以被中断

由于递归需要一层一层进入，一层一层退出，这个过程不能间断，如果要实现 `Virtual DOM` 比对任务可以被终止，就必须放弃`递归`，采用`循环`来完成 `Virtual DOM` 比对的过程，因为循环是可以终止的。只要将循环的终止时的条件保存下来，下一次任务再次开启的时候，循环就可以在前一次循环终止的时刻继续往后执行。

3. 任务拆分, 将任务拆分成一个个小任务

拆分成一个个小任务，任务的单元就比较小，这样的话即使任务没有执行完就被终止了，重新执行任务的代价就会小很多，所以我们要做任务的拆分，将一个个大的任务拆分成一个个小任务执行。是怎么进行拆分的呢？以前我们将整个一个 `Virtual DOM` 的比对看成一个任务，现在我们将**树中每一个节点的比对**看成一个任务，这样一个大的任务就拆分成一个个小任务了。
