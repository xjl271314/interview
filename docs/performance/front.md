---
title: 前端性能优化
nav:
  title: 性能优化
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# 如何优化前端性能?

- 2021.07.01

## 减少 HTTP 网络资源请求次数

浏览器并发线程数有限，所以针对部分资源我们可以进行合并请求或者减少请求的方式，具体涉及以下方案:

### **图片资源采用`懒加载`的方式，仅在出现在视窗的时候(具体出现时间可以自己根据业务需要进行调整)进行加载，并且资源请求`通过 CDN 服务器加速`，针对某些特定的场景`设定图片所需的质量`。**

质量这块基本 CDN 服务商都有提供，尽量不使用原图，常见的质量包含 `640`、`320`、`240`、`128`、`64`、`32` 等。

### **合并脚本文件。**

事实上当我们去请求一个 10KB 的 script 文件和去请求 10 个 1KB 的 script 在耗时上还是请求 10 个文件长，主要耗时在于传输这一块。因此一些公共的方法可以尽量写在同一个文件中。

### **CSS、Javascript 文件压缩**

请求的 CSS、Javascript 都可以经过压缩后进行传输。

### **使用 CSS Sprites 或者 iconfont 替代使用纯图标**

`CSS Sprites`技术可以合并大量图标，采用 `background-position` 的方式进行定位，采用 `iconfont` 的方式可以减少 `HTTP` 的请求，而且图标可以自定义颜色和大小等信息，缺点就是现有的图标可能不适合业务，需要设计师进行上传。

### **网页加载，数据请求采用 `GZIP` 进行压缩**

后端服务器容器对数据 `GZIP` 压缩之后在传输到客户端，浏览器拿到数据后根据 `ContentEncoding：gzip` 进行解压，这样虽然稍微占用了一些服务器和客户端的 `CPU`，但是换来的是更高的带宽利用率。对于纯文本来讲，压缩率相当可观的。

### **客户端缓存、浏览器缓存、使用 `Servers Worker` 进行缓存**

- 客户端缓存指针对某些变动少的数据缓存在本地。

- 浏览器缓存主要包含了`强缓存`和`协商缓存`。这两个缓存主要涉及和后端的协商，当然现在大部分业务中可能都关闭了强缓存。

- `Servers Worker`它是一个运行在浏览器后台进程里的一段 JS，它可以做许多事情，比如拦截客户端的请求、向客户端发送消息、向服务器发起请求等等，其中最重要的作用之一就是离线资源缓存。

`Service Worker` 拥有对缓存流程丰富灵活的控制能力，当页面请求到 `Service Worker` 时，`Service Worker` 同时请求`缓存`和`网络`，把缓存的内容直接给用户，而后覆盖缓存。

![Service Worker](https://img-blog.csdnimg.cn/20210701204230827.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

这里我们需要注意的是需要`HTTPS`才可以使用 `ServiceWorker`。

## 合理优化代码

### **针对部分 `DOM` 可以实现采用 `Fragement` 标签对一些节点就行整合，替代使用 `div` 标签进行聚合，另外书写的时候考虑合理的 `DOM` 结构。**

`Fragement` 在生成 `DOM` 的时候不会生成额外的节点，可以减少 DOM 节点的数量从而加速解析。

### **针对频繁变更的元素样式采用指定多个 `className` 的方式进行变更，尽量减少 `style` 内联样式的操作。**

我们都知道默认情况下内联 `style` 的样式层级比较高，外部样式层级较低。一些频繁变动的场景可能会考虑直接修改 `style` 的方式进行，不是不可以，但是尽量减少这种操作有助于性能，针对不同的场景我们可以多定义几种样式，切换样式名即可。

### **尽量减少不必要的 CSS Expression(CSS 表达式)计算**

```CSS
  .myDiv {
      position: absolute;
      width: 100px;
      height: 100px;
      left: expression(document.body.offsetWidth - 110 + "px");
      top: expression(document.body.offsetHeight - 110 + "px");
      background: red;
  }
```

比如我们的这段代码，表达式的计算频率比我们想象的还要频繁，不仅仅是在页面显示和缩放时，就是在页面滚动、乃至移动鼠标时都会要重新计算一次。这样就会造成不必要的性能浪费。

### **减少@import 的使用**

在 `CSS` 中使用`@import` 语法会等待加载的 `CSS` 完成导入之后才去加载本页的 `CSS`，阻塞加载，正确的方式是使用 `link`，因为 `link` 是异步加载的。

### **使用 div 来代替 table**

`table` 会影响页面呈现的速度，只有 `table` 里的内容全部加载完才会显示。

### **减少项目中闭包的使用**

项目中闭包使用多了，难免有时对变量释放等细节处理不到位，持续占用资源引起使用卡顿。

### **项目代码组件化，提高组件复用性能力**

合理的组织页面结构，将公共业务提炼为组件，提高组件的复用能力。

### **减少项目中 iframe 的使用**

`iframe` 会阻塞 `onload` 事件，建议在 `DOM` `onload` 事件后设置 `iframe` 的 `src`，或者 `JS` 创建 `iframe` 节点。

## 升级你的服务能力

### **后端、运维配合升级 HTTP2**

`HTTP2` 针对 `HTTP1.x` 做了很大的升级，有效提升传输速率。

### **升级服务器配置**

针对计算复杂型的业务合理考虑升级服务器内核和 CPU，提升计算能力。

### **减少项目中与服务器交互的 cookie 信息**

`cookie` 在每次请求的时候都会带到请求体中与服务器进行信息交换，过多的 `cookie` 会造成传输上的消耗，需要合理的优化。

### **对样式文件进行资源预加载**

link 文件可以进行预加载，具体的方式主要是下面三种：

- `preload`————页面加载的过程中，在浏览器开始主体渲染之前加载。

```html
<!-- 对sty1e.cs5和 index.js进行pre1oad预加载 -->
<link rel="preload" href="style.css" as="style" />
<link rel="preload" href="index.js" as="script" />
```

- `prefetch`————页面加载完成后，利用空闲时间提前加载。

```html
<!--对资源进行 prefetch预加载-->
<link rel="prefetch" href="next.css" />
<link rel="prefetch" href="next.js" />
```

- `dns-prefetch`————页面加载完成后，利用空闲时间提前加载。

```html
<link rel="dns-prefetch" href="//example.com" />
```

## 优化你的用户体验

### **合理的使用 Toast、Loading 来减缓用户等待的焦虑**

Toast、Loading 适用于处理部分资源请求的过程给与用户提示。

### **使用骨架屏来占位加载你的列表**

页面布局类似的情况下推荐使用骨架屏进行占位加载，能给用户一个页面大致结构的提示。
