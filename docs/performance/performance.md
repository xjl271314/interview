---
title: Performance工具
nav:
  title: 前端代码复杂度
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# Performance 工具

- 2022.11.09

打开`Chrome浏览器控制台`，选择`Performance`选项，点击左侧`reload`图标。

![示例1](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ad95e570f854f62a5affae73899dfaf~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

`Performance`面板可以记录和分析页面在运行时的所有活动，大致分为以下 4 个区域：

![详细示例](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/733069bb8c6d4d4c90b3df24230b0e92~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

## 各区域功能介绍

### 1.FPS

`FPS(Frames Per Second)`，表示`每秒传输帧数`，是用来分析页面是否卡顿的一个主要性能指标。

如下图所示，`绿色的长条越高，说明FPS越高，用户体验越好`。

如果发现了`一个红色的长条，那么就说明这些帧存在严重问题`，可能会造成页面卡顿。

![FPS](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daa866b933004dafa5c06c2cc915a35d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

### 2.NET

**NET 记录资源的等待、下载、执行时间，每条彩色横杠表示一种资源.**

横杠越长，检索资源所需的时间越长。每个横杠的浅色部分表示等待时间（从请求资源到第一个字节下载完成的时间）

`Network`的颜色说明：

- 白色表示等待的颜色
- 浅黄色表示请求的时间
- 深黄色表示下载的时间

**在这里，我们可以看到所有资源的加载过程，有两个地方重点关注：**

1. 资源等待的时间是否过长（标准 ≤100ms）
2. 资源文件体积是否过大，造成加载很慢（就要考虑如何拆分该资源）

![NET](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4f36cb8f3634b109b4737a48cb61429~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

### 3.火焰图

火焰图（Flame Chart）用来可视化 CPU 堆栈信息记录

![火焰图](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2b5e759df83476f8f8238cbe66be66b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

- `Network`: 表示加载了哪些资源
- `Frames`：表示每幅帧的运行情况
- `Timings`: 记录页面中关键指标的时间
- `Main`:表示主线程（重点，下文会详细介绍）
- `GPU`:表示 GPU 占用情况

### 4.统计汇总

Summary: 表示各指标时间占用统计报表。

- Loading:  加载时间
- Scripting: js 计算时间
- Rendering:  渲染时间
- Painting:  绘制时间
- Other:  其他时间
- Idle:  浏览器闲置时间

![统计汇总](https://img-blog.csdnimg.cn/52049ed565b341d39eb6b9f5be077af8.png)

## 性能瓶颈的突破口

**Main 表示主线程，主要负责**

1. Javascript 的计算与执行
2. CSS 样式计算
3. Layout 布局计算
4. 将页面元素绘制成位图（paint），也就是光栅化（Raster）

展开`Main`,可以发现很多`红色三角（long task）`，这些执行时间超过 `50ms`就属于`长任务`，会造成页面卡顿，严重时会造成页面卡死:

![在这里插入图片描述](https://img-blog.csdnimg.cn/8433a58faa5f49a9ae15392cd7dac2bf.png)

展开其中一个红色三角，`Devtools`在`Summary`面板里展示了更多关于这个事件的信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/525aa55e988c42b188adb52adbb9b71f.png)

如果在 summary 面板里提供了长任务触发的源文件地址，点击该链接，Devtools 可以跳转到需要优化的代码处。
