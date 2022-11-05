---
title: 重排(reflow)和重绘(repaint)
nav:
  title: 性能优化
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# 如何理解重排(reflow)和重绘(repaint)?

- 2021.07.02

说道`重排`和`重绘`先来回顾一下页面生成的过程:

1. `HTML` 被 `HTML 解析器`解析成 `DOM 树`；
2. `CSS` 被 `CSS 解析器`解析成`CSSOM 树`；
3. 结合 `DOM 树`和 `CSSOM 树`，生成一棵`渲染树(Render Tree)`，这一过程称为 `Attachment`；
4. 生成`布局(flow)`，浏览器在屏幕上“画”出渲染树中的所有节点；
5. 将布局`绘制(paint)`在屏幕上，显示出整个页面。

其中第 4 步和第 5 步合起来就是我们通常所说的渲染。

## 渲染

> 浏览器中渲染这个过程，就是把每一个元素对应的盒变成位图。这里的元素包括 HTML 元素和伪元素，一个元素可能对应多个盒（比如 inline 元素，可能会分成多行）。每一个盒对应着一张位图。

在页面的生命周期中，网页生成的时候，至少会渲染一次。在用户访问的过程中，还会不断触发`重排(reflow)`和`重绘(repaint)`，因此减少不必要的重排和重绘是非常有必要的。

## 重排

> 当 DOM 的变化影响了元素的`几何信息(元素的的位置和尺寸大小)`，浏览器需要重新计算元素的几何属性，将其放置在界面中的正确位置，这个过程叫做`重排`。

`重排`也叫`回流`，简单的说就是重新生成布局，重新排列元素。

### 触发重排的场景

- 页面初始渲染，这是开销最大的一次重排
- 添加/删除可见的 `DOM` 元素(例如 js 动态添加插入、CSS 修改元素的 `display: block;`为`display:none;`)
- 改变元素尺寸，比如`边距(margin)`、`填充(padding)`、`边框(border)`、`宽度(width)`和`高度(height)`等
- 改变元素内容，比如文字数量，图片大小等
- 改变元素`字体大小(font-size)`
- 改变浏览器窗口尺寸，比如 `resize` 事件发生时
- 激活 `CSS` 伪类（例如：`:hover`）
- 设置 `style` 属性的值，因为通过设置 `style` 属性改变结点样式的话，每一次设置都会触发一次 `reflow`，推荐使用多个 `class` 的方式
- 查询某些属性或调用某些计算方法：`offsetWidth`、`offsetHeight` 等，除此之外，当我们调用 `getComputedStyle` 方法也会触发重排，原理是一样的，都为求一个`即时性`和`准确性`。

### 重排影响的范围

> 由于浏览器渲染界面是基于流布局模型的，所以触发重排时会对周围 DOM 重新排列，影响的范围有两种：

- `全局范围`：从根节点 html 开始对整个渲染树进行重新布局。

```html
<body>
  <div class="hello">
    <h4>hello</h4>
    <p><strong>Name:</strong>Jack</p>
    <h5>male</h5>
    <ol>
      <li>coding</li>
      <li>loving</li>
    </ol>
  </div>
</body>
```

当 `<p>` 节点上发生 `reflow` 时，`hello` 和 `body` 也会重新渲染，甚至 `<h5>` 和 `<ol>` 都会受到影响。

- `局部范围`：对渲染树的某部分或某一个渲染对象进行重新布局。

比如我们把一个 `DOM` 的宽高之类的`几何信息`定死，然后在 `DOM` 内部触发重排，就只会重新渲染该 `DOM` 内部的元素，而不会影响到外界。

### 常见重排 CSS 属性汇总

| CSS 属性          | 描述                                 |
| :---------------- | :----------------------------------- |
| `box-sizing`      | 修改元素盒模型计算方式               |
| `width`           | 修改元素宽度，元素盒模型属性变更     |
| `height`          | 修改元素高度，元素盒模型属性变更     |
| `min-width`       | 修改元素最小宽度，元素盒模型属性变更 |
| `min-height`      | 修改元素最小高度，元素盒模型属性变更 |
| `padding`         | 修改元素内边距，元素盒模型属性变更   |
| `margin`          | 修改元素外边距，元素盒模型属性变更   |
| `border`          | 修改元素边框属性，元素盒模型属性变更 |
| `border-width`    | 修改元素边框属性，元素盒模型属性变更 |
| `display`         | 修改元素流布局类型                   |
| `position`        | 修改元素定位类型                     |
| `float`           | 修改元素流布局类型                   |
| `clear`           | 修改元素流布局类型                   |
| `top`             | 修改元素定位属性                     |
| `left`            | 修改元素定位属性                     |
| `right`           | 修改元素定位属性                     |
| `bottom`          | 修改元素定位属性                     |
| `overflow`        | 修改元素布局表现                     |
| `align-items`     | 修改元素弹性布局表现                 |
| `align-content`   | 修改元素弹性布局表现                 |
| `align-self`      | 修改元素弹性布局表现                 |
| `justify-content` | 修改元素弹性布局表现                 |
| `justify-self`    | 修改元素弹性布局表现                 |
| `font-size`       | 修改元素表现属性                     |
| `font-family`     | 修改元素表现属性                     |
| `font-style`      | 修改元素表现属性                     |
| `font-weight`     | 修改元素表现属性                     |
| `text-align`      | 修改元素表现属性                     |
| `text-indent`     | 修改元素表现属性                     |
| `text-shadow`     | 修改元素表现属性                     |
| `white-space`     | 修改元素表现属性                     |
| `world-break`     | 修改元素表现属性                     |
| `world-wrap`      | 修改元素表现属性                     |
| `vertical-align`  | 修改元素表现属性                     |

## 重绘

> 当一个元素的外观发生改变，但没有改变布局,重新把元素外观绘制出来的过程，叫做重绘。

### 触发重绘的场景

重绘触发的场景一般都是改变一些颜色表现等，主要都是涉及 CSS 的变动。

### 常见重绘 CSS 属性汇总

| CSS 属性              | 描述                    |
| :-------------------- | :---------------------- |
| `color`               | 修改元素颜色            |
| `border-style`        | 修改元素边框样式        |
| `visibility`          | 修改元素显示隐藏        |
| `background`          | 修改元素背景色          |
| `text-decoration`     | 修改元素文本下划线表现  |
| `background-image`    | 修改元素背景图          |
| `background-position` | 修改元素背景图位置属性  |
| `background-repeat`   | 修改元素背景图重复方式  |
| `background-size`     | 修改元素背景图大小      |
| `outline-color`       | 修改元素轮廓颜色        |
| `outline`             | 修改元素轮廓样式        |
| `outline-style`       | 修改元素轮廓线条样式    |
| `outline-width`       | 修改元素轮廓线条宽度    |
| `border-radius`       | 修改元素圆角属性        |
| `box-shadow`          | 修改元素阴影属性        |
| `transform`           | 修改元素 transform 表现 |

## 总结

> 重排的代价是高昂的，会破坏用户体验，并且让 UI 展示非常迟缓。通过减少重排的负面影响来提高用户体验的最简单方式就是尽可能的减少重排次数，重排范围。

- `重绘`不一定导致`重排`，但`重排`一定会导致`重绘`。

- 尽可能在低层级的 DOM 节点上，而不是像上述全局范围的示例代码一样，如果你要改变 p 的样式，class 就不要加在 div 上，通过父元素去影响子元素不好。

- 不要使用 `table` 布局，可能很小的一个小改动会造成整个 table 的重新布局。那么在不得已使用 table 的场合，可以设置 `table-layout:auto;`或者是 `table-layout:fixed` 这样可以让 table 一行一行的渲染，这种做法也是为了限制 reflow 的影响范围。

- 使用 `absolute` 或 `fixed` 脱离文档流。
