---
title: Lighthouse工具
nav:
  title: 前端代码复杂度
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# Lighthouse 工具

- 2022.11.08

`Lighthouse`是`Chrome`自带的性能分析工具，它能够生成一个有关页面性能的报告。

通过报告我们可以知道需要采取哪些措施，来改进应用的性能和体验。

并且`Lighthouse`可以对页面多方面的效果指标进行评测，并给出最佳实践的建议，以帮助开发者改进网站的质量。

## 页面分析报告

这里以`juejin.cn`网站为例，打开`Chrome`浏览器控制台，选择`Lighthouse`选项，点击`Generate report`。

![juejin.cn](https://img-blog.csdnimg.cn/120ca60c3778412fab38b21a2566f4bb.png)

这里重点关注`Performance`性能评分。

性能评分的分值区间是 0 到 100，如果出现 0 分，通常是在运行 `Lighthouse` 时发生了错误，满分 100 分代表了网站已经达到了 98 分位值的数据，而 50 分则对应 75 分位值的数据。

## 页面优化建议

`Lighthouse`会针对当前网站，给出一些`Opportunities`优化建议。

**`Opportunities`指的是优化机会，它提供了详细的建议和文档，来解释低分的原因，帮助我们具体进行实现和改进**:

![Opportunities](https://img-blog.csdnimg.cn/c0061d095e4f463cb2d13cbc57c25011.png)

- Reduce unused JavaScript

  ![Opportunity1](https://img-blog.csdnimg.cn/0acfdfed16e34e5489e7f8ce8b3b4fbe.png)

  **减少未使用的 js 脚本，推迟 js 脚本的加载，仅在需要使用的时候去加载。**

  React 提示，如果不是采用服务端渲染的模式，可以使用`React.lazy()`拆分包。否则的话可以使用第三方组件进行拆包(比如[loadable-components](https://loadable-components.com/docs/getting-started/))

### Opportunities 建议列表

| 问题                               | 建议                                                      |
| :--------------------------------- | :-------------------------------------------------------- |
| `Remove unused JavaScript`         | 去掉无用 js 代码                                          |
| `Preload key requests`             | 首页资源 preload 预加载                                   |
| `Remove unused CSS`                | 去掉无用 css 代码                                         |
| `Serve images in next-gen formats` | 推荐使用新的图片格式，比如 webp 相对 png jpg 格式体积更小 |
| `Efficiently encode images`        | 比如压缩图片大小                                          |
| `Preconnect to required origins`   | 使用 preconnect or dns-prefetch DNS 预解析                |

## 诊断问题列表

`Diagnostics` 指的是现在存在的问题，为进一步改善性能的验证和调整给出了指导。

![Diagnostics](https://img-blog.csdnimg.cn/67a8d3dcaa364066a2e1573d0cc85ffd.png)

### Diagnostics 建议列表

| 问题                                                            | 建议                                                               |
| :-------------------------------------------------------------- | :----------------------------------------------------------------- |
| `A long cache lifetime can speed up repeat visits to your page` | 这些资源需要提供长的缓存期，现发现图片都是用的协商缓存，显然不合理 |
| `Image elements do not have explicit width and height`          | 给图片设置具体的宽高，减少 cls 的值                                |
| `Avoid enormous network payloads`                               | 资源太大增加网络负载                                               |
| `Minimize main-thread work`                                     | 最小化主线程 这里会执行解析 Html、样式计算、布局、绘制、合成等动作 |
| `Reduce JavaScript execution time`                              | 减少非必要 js 资源的加载，减少必要 js 资源的大小                   |
| `Avoid large layout shifts`                                     | 避免大的布局变化，从中可以看到影响布局变化最大的元素               |

## Performance 各指标得分

`Performance`列出了`FCP`、`SP`、`LCP`、`TTI`、`TBI`、`CLS` 六个指标的用时和得分情况。

![Performance](https://img-blog.csdnimg.cn/31e94d0f5de14234a7314b4f8f99f05b.png)

## Web-vitals 官方标准

| 指标                            | 描述                                                     | 标准            |
| :------------------------------ | :------------------------------------------------------- | :-------------- |
| `FCP(First Contentful Paint)`   | 首次内容绘制时间                                         | 标准 ≤1s        |
| `LCP(Largest Contentful Paint)` | 最大内容绘制时间                                         | 标准 ≤2s        |
| `FID(first input delay)`        | 首次输入延迟，标准是用户触发后，到浏览器响应时间         | 标准 ≤100ms     |
| `CLS(Cumulative Layout Shift)`  | 累积布局偏移                                             | 标准 ≤0.1       |
| `TTFB(Time to First Byte)`      | 页面发出请求，到接收第一个字节所花费的毫秒数(首字节时间) | 标准<= 100 毫秒 |
