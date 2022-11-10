---
title: 性能监控
nav:
  title: 前端代码复杂度
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# 性能监控

- 2022.11.09

项目发布生产后，用户使用时的性能如何，页面整体的打开速度是多少、白屏时间多少，FP、FCP、LCP、FID、CLS 等指标，要设置多大的阀值呢，才能满足 TP50、TP90、TP99 的要求呢？

**TP 指标: 总次数 \* 指标数 = 对应 TP 指标的值。**

设置每个指标的阀值，比如 FP 指标，设置阀值为 1s，要求 Tp95，即 95%的 FP 指标，要在 1s 以下，剩余 5%的指标超过 1s

TP50 相对较低，TP90 则比较高，TP99，TP999 则对性能要求很高。

这里就需要性能监控，采集到用户的页面数据。

## 性能指标的计算

常用的两种方式：

### 1.通过 web-vitals 官方库进行计算

```js
import { onLCP, onFID, onCLS } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);
```

### 2.通过`performance api`进行计算

打开任意网页，在控制台中输入 `performance` 回车，可以看到一系列的参数

![performance](https://img-blog.csdnimg.cn/3bdab6f6119044198c46c37e9797dd81.png)

我们重点关注下 `performance.timing`，这里记录了页面的各个关键时间点：

| 时间                         | 作用                                                                                                                             |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------- |
| `navigationStart`            | （可以理解为该页面的起始时间）同一个浏览器上下文的上一个文档卸载结束时的时间戳，如果没有上一个文档，这个值会和 `fetchStart` 相同 |
| `unloadEventStart`           | `unload` 事件抛出时的时间戳,如果没有上一个文档，这个值会是 0                                                                     |
| `unloadEventEnd`             | `unload` 事件处理完成的时间戳,如果没有上一个文档，这个值会是 0                                                                   |
| `redirectStart`              | 第一个 HTTP 重定向开始时的时间戳，没有重定向或者重定向中的不同源，这个值会是 0                                                   |
| `redirectEnd`                | 最后一个 HTTP 重定向开始时的时间戳，没有重定向或者重定向中的不同源，这个值会是 0                                                 |
| `fetchStart`                 | 浏览器准备好使用 HTTP 请求来获取文档的时间戳。发送在检查缓存之前                                                                 |
| `domainLookupStart`          | 域名查询开始的时间戳，如果使用了持续连接或者缓存，则与 `fetchStart` 一致                                                         |
| `domainLookupEnd`            | 域名查询结束的时间戳，如果使用了持续连接或者缓存，则与 `fetchStart` 一致                                                         |
| `connectStart`               | HTTP 请求开始向服务器发送时的时间戳，如果使用了持续连接，则与 `fetchStart` 一致                                                  |
| `connectEnd`                 | 浏览器与服务器之间连接建立（所有握手和认证过程全部结束）的时间戳，如果使用了持续连接，则与 `fetchStart` 一致                     |
| `secureConnectionStart`      | 浏览器与服务器开始安全连接握手时的时间戳，如果当前网页不需要安全连接，这个值会是 0                                               |
| `requestStart`               | 浏览器向服务器发出 HTTP 请求的时间戳                                                                                             | `responseStart` | 浏览器从服务器收到（或从本地缓存读取）第一个字节时的时间戳 |
| `responseEnd`                | 浏览器从服务器收到（或从本地缓存读取）最后一个字节时（如果在此之前 HTTP 连接已经关闭，则返回关闭时）的时间戳                     |
| `domLoading`                 | 当前网页 DOM 结构开始解析时的时间戳                                                                                              |
| `domInteractive`             | 当前网页 DOM 结构解析完成，开始加载内嵌资源时的时间戳                                                                            |
| `domContentLoadedEventStart` | 需要被执行的脚本已经被解析的时间戳                                                                                               |
| `domContentLoadedEventEnd`   | 需要立即执行的脚本已经被执行的时间戳                                                                                             |
| `domComplete`                | 当前文档解析完成的时间戳                                                                                                         |
| `loadEventStart`             | load 事件被发送时的时间戳，如果这个事件还未被发送，它的值将会是 0                                                                |
| `loadEventEnd`               | load 事件结束时的时间戳，如果这个事件还未被发送，它的值将会是 0                                                                  |

## 白屏时间 FP

白屏时间 FP（First Paint）指的是从用户输入 url 的时刻开始计算，一直到页面有内容展示出来的时间节点，标准 ≤2s

**这个过程包括 dns 查询、建立 tcp 连接、发送 http 请求、返回 html 文档、html 文档解析**

```js
const entryHandler = (list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-paint') {
      observer.disconnect();
    }
    // 其中startTime 就是白屏时间
    let FP = entry.startTime;
  }
};
const observer = new PerformanceObserver(entryHandler);
// buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事件触发时机晚也没关系。
observer.observe({ type: 'paint', buffered: true });
```

## 首次内容绘制时间 FCP

FCP(First Contentful Paint) 表示页面任一部分渲染完成的时间，标准 ≤2s

```js
// 计算方式：
const entryHandler = (list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-contentful-paint') {
      observer.disconnect();
    }
    // 计算首次内容绘制时间
    let FCP = entry.startTime;
  }
};
const observer = new PerformanceObserver(entryHandler);
observer.observe({ type: 'paint', buffered: true });
```

## 最大内容绘制时间 LCP

LCP(Largest Contentful Paint)表示最大内容绘制时间，标准 ≤2.5 秒

```js
// 计算方式：
const entryHandler = (list) => {
  if (observer) {
    observer.disconnect();
  }
  for (const entry of list.getEntries()) {
    // 最大内容绘制时间
    let LCP = entry.startTime;
  }
};
const observer = new PerformanceObserver(entryHandler);
observer.observe({ type: 'largest-contentful-paint', buffered: true });
```

## 累积布局偏移值 CLS

CLS(Cumulative Layout Shift) 表示累积布局偏移，标准 ≤0.1

```js
// cls为累积布局偏移值
let cls = 0;
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
    }
  }
}).observe({ type: 'layout-shift', buffered: true });
```

## 首字节时间 TTFB

平常所说的 TTFB，默认指导航请求的 TTFB

导航请求：在浏览器切换页面时创建，从导航开始到该请求返回 HTML

```js
window.onload = function () {
  // 首字节时间
  let TTFB = responseStart - navigationStart;
};
```

## 首次输入延迟 FID

FID（first input delay）首次输入延迟，标准是用户触发后，浏览器的响应时间， 标准 ≤100ms

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // 计算首次输入延迟时间
    const FID = entry.processingStart - entry.startTime;
  }
}).observe({ type: 'first-input', buffered: true });
```

**FID 推荐使用 web-vitals 库，因为官方兼容了很多场景**

## 首屏加载时间

首屏加载时间和首页加载时间不一样，首屏指的是用户看到屏幕内页面渲染完成的时间。

比如首页很长需要好几屏展示，这种情况下屏幕以外的元素不考虑在内。

**计算首屏加载时间流程**

1. 利用 `MutationObserver` 监听 `document`对象，每当 dom 变化时触发该事件
2. 判断监听的`dom`是否在首屏内，如果在首屏内，将该`dom`放到指定的数组中，记录下当前 dom 变化的时间点
3. 在`MutationObserver`的`callback`函数中，通过`防抖函数`，监听`document.readyState`状态的变化
4. 当`document.readyState === 'complete'`，停止定时器和 取消对`document`的监听
5. 遍历存放`dom`的数组，找出最后变化节点的时间，用该时间点减去`performance.timing.navigationStart` 得出首屏的加载时间

```js
// firstScreenPaint为首屏加载时间的变量
let firstScreenPaint = 0;
// 页面是否渲染完成
let isOnLoaded = false;
let timer;
let observer;

// 定时器循环监听dom的变化，当document.readyState === 'complete'时，停止监听
function checkDOMChange(callback) {
  cancelAnimationFrame(timer);
  timer = requestAnimationFrame(() => {
    if (document.readyState === 'complete') {
      isOnLoaded = true;
    }
    if (isOnLoaded) {
      // 取消监听
      observer && observer.disconnect();

      // document.readyState === 'complete'时，计算首屏渲染时间
      firstScreenPaint = getRenderTime();
      entries = null;

      // 执行用户传入的callback函数
      callback && callback(firstScreenPaint);
    } else {
      checkDOMChange();
    }
  });
}
function getRenderTime() {
  let startTime = 0;
  entries.forEach((entry) => {
    if (entry.startTime > startTime) {
      startTime = entry.startTime;
    }
  });
  // performance.timing.navigationStart 页面的起始时间
  return startTime - performance.timing.navigationStart;
}
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
// dom 对象是否在屏幕内
function isInScreen(dom) {
  const rectInfo = dom.getBoundingClientRect();
  if (rectInfo.left < viewportWidth && rectInfo.top < viewportHeight) {
    return true;
  }
  return false;
}
let entries = [];

// 外部通过callback 拿到首屏加载时间
export default function observeFirstScreenPaint(callback) {
  const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK'];
  observer = new window.MutationObserver((mutationList) => {
    checkDOMChange(callback);
    const entry = { children: [] };
    for (const mutation of mutationList) {
      if (mutation.addedNodes.length && isInScreen(mutation.target)) {
        for (const node of mutation.addedNodes) {
          // 忽略掉以上标签的变化
          if (
            node.nodeType === 1 &&
            !ignoreDOMList.includes(node.tagName) &&
            isInScreen(node)
          ) {
            entry.children.push(node);
          }
        }
      }
    }

    if (entry.children.length) {
      entries.push(entry);
      entry.startTime = new Date().getTime();
    }
  });
  observer.observe(document, {
    childList: true, // 监听添加或删除子节点
    subtree: true, // 监听整个子树
    characterData: true, // 监听元素的文本是否变化
    attributes: true, // 监听元素的属性是否变化
  });
}
```

**外部引入使用**

```js
import observeFirstScreenPaint from './performance';

// 通过回调函数，拿到首屏加载时间
observeFirstScreenPaint((data) => {
  console.log(data, '首屏加载时间');
});
```

## DOM 渲染时间和 window.onload 时间

DOM 的渲染的时间和`window.onload`执行的时间不是一回事。

- DOM 渲染的时间

```js
DOM渲染的时间 = performance.timing.domComplete - performance.timing.domLoading;
```

`window.onload`要晚于 DOM 的渲染，`window.onload`是页面中所有的资源都加载后才执行（包括图片的加载）。

- window.onload 的时间

```js
window.onload的时间 = performance.timing.loadEventEnd;
```

## 计算资源的缓存命中率

**缓存命中率：从缓存中得到数据的请求数与所有请求数的比率**

理想状态是缓存命中率越高越好，缓存命中率越高说明网站的缓存策略越有效，用户打开页面的速度也会相应提高。

**如何判断该资源是否命中缓存？**

1. 通过`performance.getEntries()`找到所有资源的信息
2. 在这些资源对象中有一个`transferSize` 字段，它表示获取资源的大小，包括响应头字段和响应数据的大小。
3. 如果这个值为 0，说明是从缓存中直接读取的（强制缓存）
4. 如果这个值不为 0，但是`encodedBodySize` 字段为 0，说明它走的是`协商缓存`（encodedBodySize 表示请求响应数据 body 的大小）

```js
function isCache(entry) {
  // 直接从缓存读取或 304
  return (
    entry.transferSize === 0 ||
    (entry.transferSize !== 0 && entry.encodedBodySize === 0)
  );
}
```

**将所有命中缓存的数据 / 总数据 就能得出缓存命中率**

## 性能数据上报

### 上报方式

一般使用`图片打点`的方式，通过动态创建`img`标签的方式，`new`出像素为 1x1 px 的`gif Image`（gif 体积最小）对象就能发起请求，可以跨域、不需要等待服务器返回数据。

### 上报时机

可以利用`requestIdleCallback`，浏览器空闲的时候上报，好处是：不阻塞其他流程的进行。

如果浏览器不支持该`requestIdleCallback`，就使用`setTimeout`上报。

```js
// 优先使用requestIdleCallback
if (window.requestIdleCallback) {
  window.requestIdleCallback(
    () => {
      // 获取浏览器的剩余空闲时间
      console.log(deadline.timeRemaining());
      report(data); // 上报数据
    },
    // timeout设置为1000，如果在1000ms内没有执行该后调，在下次空闲时间时，callback会强制执行
    { timeout: 1000 },
  );
} else {
  setTimeout(() => {
    report(data); // 上报数据
  });
}
```
