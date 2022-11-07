---
title: 如何设计一套埋点监控体系
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 如何设计一套埋点监控体系?

- 2022.07.01

## 埋点监控的范围

因为业务需要的不同，大部分公司都会自己开发一套埋点监控系统，但基本上都会涵盖这三类功能：

### 1.用户行为监控

负责统计 PV（页面访问次数）、UV（页面访问人数）以及用户的点击操作等行为。

这类统计是用的最多的，有了这些数据才能量化我们的工作成果。

### 2.页面性能监控

开发和测试人员固然在上线之前会对这些数据做评估，但用户的环境和我们不一样，也许是 3G 网，也许是很老的机型，我们需要知道在实际使用场景中的性能数据，比如`页面加载时间`、`白屏时间`等。

### 3.错误报警监控

获取错误数据，及时处理才能避免大量用户受到影响。除了全局捕获到的错误信息，还有在代码内部被 catch 住的错误告警，这些都需要被收集到。

## SDK 的设计

在开始设计之前，先看一下 SDK 怎么使用:

```js
import StatisticSDK from 'StatisticSDK';
// 全局初始化一次
window.insSDK = new StatisticSDK('businessId');


<button onClick={()=>{
  window.insSDK.event('click','confirm');
  ...// 其他业务代码
}}>确认</button>
```

首先把 SDK 实例挂载到全局，之后在业务代码中调用，这里的新建实例时需要传入一个 id，因为这个埋点监控系统往往是给多个业务去使用的，通过 id 去区分不同的数据来源。

```js
class StatisticSDK {
  constructor(productID) {
    this.productID = productID;
  }
}
```

### 数据发送

数据发送是一个最基础的 api，后面的功能都要基于此进行。通常这种前后端分离的场景会使用 AJAX 的方式发送数据，但是这里使用图片的 src 属性。原因有两点：

1. 没有跨域的限制，像 srcipt 标签、img 标签都可以直接发送跨域的 GET 请求，不用做特殊处理；
2. 兼容性好，一些静态页面可能禁用了脚本，这时 script 标签就不能使用了；

但要注意，这个图片不是用来展示的，我们的目的是去「传递数据」，只是借助 img 标签的的 src 属性，在其 url 后面拼接上参数，服务端收到再去解析。

```js
class StatisticSDK {
  constructor(productID) {
    this.productID = productID;
  }
  send(baseURL, query = {}) {
    query.productID = this.productID;
    let queryStr = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`;
  }
}
```

img 标签的优点是不需要将其 append 到文档，只需设置 src 属性便能成功发起请求。

通常请求的这个 url 会是一张`1X1px`的`GIF`图片，网上的文章对于这里为什么返回图片的是一张 GIF 都是含糊带过，这里查阅了一些资料并测试了：

1. 同样大小，不同格式的的图片中 GIF 大小是最小的，所以选择返回一张 GIF，这样对性能的损耗更小；
2. 如果返回 204，会走到 img 的 onerror 事件，并抛出一个全局错误；如果返回 200 和一个空对象会有一个 CORB 的告警；
3. 有一些埋点需要真实的加到页面上，比如垃圾邮件的发送者会添加这样一个隐藏标志来验证邮件是否被打开，如果返回 204 或者是 200 空对象会导致一个明显图片占位符

### 更优雅的 web beacon

这种打点标记的方式被称`web beacon（网络信标）`。除了 gif 图片，从 2014 年开始，浏览器逐渐实现专门的 API，来更优雅的完成这件事：[`Navigator.sendBeacon`](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon)。

```js
Navigator.sendBeacon(url, data);
```

- url 参数表明 data 将要被发送到的网络地址。
- data 可选 将要发送的 ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData 或 URLSearchParams 类型的数据。

相较于图片的 src，这种方式的更有优势：

1. 不会和主要业务代码抢占资源，而是在浏览器空闲时去做发送；
2. 并且在页面卸载时也能保证请求成功发送，不阻塞页面刷新和跳转；

现在的埋点监控工具通常会优先使用`sendBeacon`，但由于浏览器兼容性，还是需要用图片的 src 兜底。

### 用户行为监控

上面实现了数据发送的 api，现在可以基于它去实现用户行为监控的 api。

```js
class StatisticSDK {
  constructor(productID) {
    this.productID = productID;
  }
  // 数据发送
  send(baseURL, query = {}) {
    query.productID = this.productID;
    let queryStr = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`;
  }
  // 自定义事件
  event(key, val = {}) {
    let eventURL = 'http://demo/';
    this.send(eventURL, { event: key, ...val });
  }
  // pv曝光
  pv() {
    this.event('pv');
  }
}
```

用户行为包括自定义事件和 pv 曝光，也可以把 pv 曝光看作是一种特殊的自定义行为事件。

### 页面性能监控

页面的性能数据可以通过`performance.timing`这个 API 获取到，获取的数据是单位为毫秒的时间戳。

![performance.timing](https://img-blog.csdnimg.cn/13d1eb1c211347e1b0cbf2e91f92755f.png)

- 页面首次渲染时间：FP(firstPaint)=domLoading-navigationStart
- DOM 加载完成：DCL(DOMContentEventLoad)=domContentLoadedEventEnd-navigationStart
- 图片、样式等外链资源加载完成：L(Load)=loadEventEnd-navigationStart

上面的数值可以跟`performance`面板里的结果对应。

回到 SDK，我们只需要实现一个上传所有性能数据的 api 就可以了：

```js
class StatisticSDK {
  constructor(productID) {
    this.productID = productID;
    // 初始化自动调用性能上报
    this.initPerformance();
  }
  // 数据发送
  send(baseURL, query = {}) {
    query.productID = this.productID;
    let queryStr = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`;
  }
  // 性能上报
  initPerformance() {
    let performanceURL = 'http://performance/';
    this.send(performanceURL, performance.timing);
  }
}
```

并且，在构造函数里自动调用，因为性能数据是必须要上传的，就不需要用户每次都手动调用了。

### 错误告警监控

错误报警监控分为 `JS原生错误` 和 `React` 的组件错误的处理。

#### JS 原生错误

除了 try catch 中捕获住的错误，我们还需要上报没有被捕获住的错误——通过 error 事件和 unhandledrejection 事件去监听。

- error

error 事件是用来监听 DOM 操作错误`DOMException`和`JS错误`告警的，具体来说，JS 错误分为下面 8 类：

1. InternalError: 内部错误，比如如递归爆栈;
2. RangeError: 范围错误，比如 new Array(-1);
3. EvalError: 使用 eval()时错误;
4. ReferenceError: 引用错误，比如使用未定义变量;
5. SyntaxError: 语法错误，比如 var a = ;
6. TypeError: 类型错误，比如[1,2].split('.');
7. URIError: 给  encodeURI 或  decodeURl()传递的参数无效，比如 decodeURI('%2')
8. Error: 上面 7 种错误的基类，通常是开发者抛出

也就是说，代码运行时发生的上述 8 类错误，都可以被检测到。

- unhandledrejection

Promise 内部抛出的错误是无法被 error 捕获到的，这时需要用`unhandledrejection`事件。

```js
class StatisticSDK {
  constructor(productID) {
    this.productID = productID;
    // 初始化错误监控
    this.initError();
  }
  // 数据发送
  send(baseURL, query = {}) {
    query.productID = this.productID;
    let queryStr = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`;
  }
  // 自定义错误上报
  error(err, etraInfo = {}) {
    const errorURL = 'http://error/';
    const { message, stack } = err;
    this.send(errorURL, { message, stack, ...etraInfo });
  }
  // 初始化错误监控
  initError() {
    window.addEventListener('error', (event) => {
      this.error(error);
    });
    window.addEventListener('unhandledrejection', (event) => {
      this.error(new Error(event.reason), { type: 'unhandledrejection' });
    });
  }
}
```

和初始化性能监控一样，初始化错误监控也是一定要做的，所以需要在构造函数中调用。后续开发人员只用在业务代码的 try catch 中调用 error 方法即可。

### React 组件库的错误

React 中使用这两个生命周期进行错误边界处理`getDerivedStateFromError`和`componentDidCatch`。

```js
// 定义错误边界
class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, errorInfo) {
    // 调用我们实现的SDK实例
    insSDK.error(error, errorInfo)
  }
  render() {
    if (this.state.error) {
      return <h2>Something went wrong.</h2>
    }
    return this.props.children
  }
}
...
<ErrorBoundary>
  <BuggyCounter />
</ErrorBoundary>
```

回到 SDK 的整合上，在生产环境下，被错误边界包裹的组件，如果内部抛出错误，全局的 error 事件是无法监听到的，因为这个错误边界本身就相当于一个 try catch。所以需要在错误边界这个组件内部去做上报处理。也就是上面代码中的 componentDidCatch 生命周期。

### Vue 的错误边界

vue 也有一个类似的生命周期来做这件事，不再赘述：`errorCaptured`

```js
Vue.component('ErrorBoundary', {
  data: () => ({ error: null }),
  errorCaptured (err, vm, info) {
    this.error = `${err.stack}\n\nfound in ${info} of component`
    // 调用我们的SDK，上报错误信息
    insSDK.error(err,info)
    return false
  },
  render (h) {
    if (this.error) {
      return h('pre', { style: { color: 'red' }}, this.error)
    }
    return this.$slots.default[0]
  }
})
...
<error-boundary>
  <buggy-counter />
</error-boundary>
```
