---
title: Memory工具
nav:
  title: 前端代码复杂度
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# Memory 工具

- 2022.11.09

Memory 工具，通过`内存快照`的方式，分析当前页面的内存使用情况。

## 使用流程

1. 打开 chrome 浏览器控制台，选择 Memory 工具
2. 点击左侧 start 按钮，刷新页面，开始录制的 JS 堆动态分配时间线，会生成页面加载过程内存变化的柱状统计图（蓝色表示未回收，灰色表示已回收）

![使用流程](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aab5505602aa45498105fed8b8b20806~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

## 关键项

- Constructor：对象的类名；
- Distance：对象到根的引用层级；
- Objects Count：对象的数量；
- Shallow Size： 对象本身占用的内存，不包括引用的对象所占内存；
- Retained Size： 对象所占总内存，包含引用的其他对象所占内存；
- Retainers：对象的引用层级关系

**通过一段测试代码来了解 Memory 工具各关键性的关系**

```js
// 测试代码
class Jane {}
class Tom {
  constructor() {
    this.jane = new Jane();
  }
}
Array(1000000)
  .fill('')
  .map(() => new Tom());
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a05c8093ada4d19a71a78c225b7e013~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

**`shallow size` 和 `retained size`的区别，以用红框里的 `Tom` 和 `Jane` 更直观的展示**:

`Tom` 的 `shallow` 占了 32M，`retained` 占用了 56M，这是因为 `retained` 包括了引用的指针对应的内存大小，即 `tom.jane` 所占用的内存。

所以 `Tom` 的 `retained` 总和比 `shallow`多出来的 24M，正好跟 Jane 占用的 24M 相同。

`retained size` 可以理解为当回收掉该对象时可以释放的内存大小，在内存调优中具有重要参考意义。

## 内存分析的关键点

找到内存最高的节点，分析这些时刻执行了哪些代码，发生了什么操作，尽可能去优化它们。

1. 从柱状图中找到最高的点，重点分析该时间内造成内存变大的原因
2. 按照`Retainers size（总内存大小）`排序，点击展开内存最高的哪一项，点击展开构造函数，可以看到所有构造函数相关的对象实例。
3. 选中构造函数，底部会显示对应源码文件，点击源码文件，可以跳转到具体的代码，这样我们就知道是哪里的代码造成内存过大。
4. 结合具体的代码逻辑，来判断这块内存变大的原因，重点是如何去优化它们，降低内存的使用大小。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f4655f8d064457ba2624c9806d7a094~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

点击`keyghost.js`可以跳转到具体的源码

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/080b6071cd4946729a3bc68c22a588e8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

## 内存泄露的情况

1. 意外的全局变量， 挂载到 window 上全局变量
2. 遗忘的定时器，定时器没有清除
3. 闭包不当的使用

## 内存分析总结

1. 利用 Memory 工具，了解页面整体的内存使用情况
2. 通过 JS 堆动态分配时间线，找到内存最高的时刻
3. 按照 Retainers size（总内存大小）排序，点击展开内存最高的前几项，分析由于哪个函数操作导致了内存过大，甚至是内存泄露
4. 结合具体的代码，去解决或优化内存变大的情况
