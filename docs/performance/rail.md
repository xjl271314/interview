---
title: 性能优化指标RAIL
nav:
  title: 性能优化
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# 如何使用 RAIL 去优化性能?

- 2021.06.25

![前图](https://img-blog.csdnimg.cn/20210625193534327.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## RAIL

> `RAIL` 是 `Google` 提出的可以量化的评估前端的页面性能的模型。它是一种以`用户为中心`的性能模型。每个网络应用均具有与其生命周期有关的四个不同方面，且这些方面以不同的方式影响着性能：

主要包含了以下 4 个方面:

- Response
- Animation
- Idle
- Load

![RAIL模型](https://img-blog.csdnimg.cn/20210625194529891.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 用户感知延迟

| 延迟时间   | 用户感知情况                     |
| :--------- | :------------------------------- |
| 0-16ms     | 很流畅，基本无感知               |
| 0-100ms    | 基本流畅，基本无感知             |
| 100-1000ms | 有感知，感觉网站存在加载任务     |
| 1000ms+    | 感知较大，基本开始失去等待的耐心 |
| 10000ms+   | 直接离开页面，拉黑不会访问了     |

## Response

> 事件处理最好在 `50ms` 内完成。

### 目标

处理用户的响应时间不超过 `100ms`，给用户感受是瞬间就完成了。

### 优化方案

- 事件处理函数在 `50ms` 内完成，考虑到 `idle task(requestIdelCallBack可以在多个空闲期调用空闲期回调，执行任务，输入事件的响应则排在其后。)` 的情况，事件会排队，等待时间大概在 `50ms`。该优化适用于 `click`，`toggle`，`starting animations` 等，不适用于 `drag` 和 `scroll`事件。

- 复杂的 js 计算尽可能放在后台，如 `web worker`，避免对用户输入造成阻塞。

- 超过 `50ms` 的响应，一定要提供反馈，比如`倒计时`，`进度百分比`，`Toast轻提示`等。

下图是 `idle task` 对 `input response` 的影响：

![requestIdelCallBack](https://img-blog.csdnimg.cn/2021070111054142.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## Animation

> 建议在 `10ms` 内产生一帧。

### 目标

- 产生每一帧的时间不要超过 `10ms`，为了保证浏览器 `60 帧`，每一帧的时间在 `16ms` 左右，但浏览器需要用 `6ms` 来渲染每一帧。

- 旨在视觉上的平滑。用户对帧率变化感知很敏感。

### 优化方案

- 在一些高压点上，比如动画，不要去挑战 `cpu`，尽可能地少做事，如：取 `offset`，设置 `style` 等操作使用`transform`进行替代，尽可能地保证 `60 帧`的体验。

- 在渲染性能上，针对不同的动画做一些特定优化。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '<strong style="color:#333">动画不只是UI的视觉效果，以下行为都属于：</strong>\n\n1. 视觉动画，如渐隐渐显，`tweens`，`loading`等。\n\n2. 滚动，包含弹性滚动，松开手指后，滚动会持续一段距离。\n\n3. `拖拽，缩放，经常伴随着用户行为。';

export default () => <Info type="info" txt={txt} />;
```

## Idle

> 最大化空闲时间。

### 目标

- 最大化空闲时间，以增大 50ms 内响应用户输入的几率。

### 优化方案

- 用空闲时间来完成一些延后的工作，如先加载页面可见的部分，然后利用空闲时间加载剩余部分，此处可以使用 [requestIdleCallback API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。

- 在空闲时间内执行的任务尽量控制在 `50ms` 以内，如果更长的话，会影响 `input handle` 的 `pending` 时间。

- 如果用户在空闲时间任务进行时进行交互，必须以此为最高优先级，并暂停空闲时间的任务。

## Load

> 传输内容到页面可交互的时间不超过 5 秒。

如果页面加载比较慢，用户的交点可能会离开。加载很快的页面，用户平均停留时间会变长，跳出率会更低，也就有更高的广告查看率、转化率等。

### 目标

- 优化加载速度，可以根据设备、网络等条件。目前，比较好的一个方式是，让你的页面在一个中配的 3G 网络手机上打开时间不超过 5 秒。

- 对于第二次打开，尽量不超过 2 秒。

### 优化方案

- 在手机设备上测试加载性能，选用中配的 3G 网络（400kb/s，400ms RTT），可以使用 [WebPageTest](https://www.webpagetest.org/easy) 来测试。

- 要注意的是，即使用户的网络是 4G，但因为丢包或者网络波动，可能会比预期的更慢。

- 禁用渲染阻塞的资源，延后加载(主要是一些脚本)。

- 可以采用 lazy load，code-splitting 等 其他优化 手段，让第一次加载的资源更少。

## 分析 RAIL 用的工具

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://web.dev/measure/)
- [WebPageTest](https://www.webpagetest.org/easy)
