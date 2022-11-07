---
title: FC、BFC、IFC、FFC、GFC
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# CSS 中的 FC、BFC、IFC、FFC、GFC?

- 2021.06.11

## FC

> `FC` 的全称是：`Formatting Contexts`，是 `W3C CSS2.1` 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

## 常见定位方案

开始介绍 FC 之前我们先来回顾下现有的布局方案:

1. 普通文档流 (normal flow)

> 在普通文档流布局中，元素按照其在 `HTML` 中的先后位置至上而下布局，在这个过程中，`行内元素`水平排列，直到当行被占满然后换行，`块级元素`则会被渲染为完整的一个新行，除非另外指定，否则所有元素默认都是普通流定位，也可以说，普通流中元素的位置由该元素在 HTML 文档中的位置决定。

2. 浮动 (float)布局

> 这个布局早期的项目中使用较多，现在不太推荐使用。在浮动布局中，元素首先按照普通流的位置出现，然后根据浮动的方向尽可能的向左边或右边偏移，其效果与印刷排版中的文本环绕相似。

3. 绝对定位 (absolute positioning)布局

> 在绝对定位布局中，元素会整体脱离普通流，因此绝对定位元素不会对其兄弟元素造成影响，而元素具体的位置由绝对定位的坐标决定。

## BFC

> `Block Formatting Contexts (块级格式化上下文)`，它属于上述定位方案的普通文档流。

具有 `BFC` 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

通俗的讲就是 `BFC` 内部的元素不论怎么去布局都不会影响到外部的布局。

### 创建 BFC 的方式

1. 根元素；
2. 浮动元素 (float 不为 none 的元素)；
3. 绝对定位元素 (元素的 position 为 absolute 或 fixed)；
4. inline-blocks(元素的 display: inline-block)；
5. 表格单元格(元素的 display: table-cell，HTML 表格单元格默认属性)；
6. overflow 的值不为 visible 的元素；
7. 弹性盒 flex boxes (元素的 display: flex 或 inline-flex)；

### BFC 的使用场景

1. BFC 本身不会发生 margin 重叠。

所以我们经常使用 BFC 来解决上下边距重叠的问题，以及解决子元素浮动带来的的高度坍塌和文字环绕问题。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  'BFC包含创建该上下文元素的所有子元素，但不包括创建了新BFC的子元素的内部元素。';

export default () => <Info type="warning" txt={txt} />;
```

## IFC

> `Inline Formatting Contexts (内联格式化上下文)`，`IFC` 的 `line box（线框`）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的 `padding/margin` 影响)。

### IFC 的特性

1. `IFC` 中的 `line box `一般左右都贴紧整个 `IFC`，但是会因为 `float` 元素而扰乱。`float` 元素会位于 `IFC` 与与 `line box` 之间，使得 `line box` 宽度缩短。

2. `IFC` 中是不可能有`块级元素`的，当插入块级元素时（如 p 中插入 div）会产生两个匿名块与 `div` 分隔开，即产生两个 `IFC`，每个 `IFC` 对外表现为块级元素，与 `div` 垂直排列。

### IFC 的使用场景

1. `水平居中`：当一个块要在环境中水平居中时，设置其为 `inline-block` 则会在外层产生 `IFC`，通过 `text-align` 则可以使其水平居中。

2. `垂直居中`：创建一个 `IFC`，用其中一个元素撑开父元素的高度，然后设置其 `vertical-align:middle`，其他行内元素则可以在此父元素下垂直居中。

## FFC

> `Flex Formatting Contexts(自适应格式化上下文)`，`display` 值为 `flex` 或者 `inline-flex` 的元素将会生成自适应容器。

`flex box` 由伸缩容器和伸缩子元素组成。通过设置元素 `display:flex/inline-flex` 可以得到伸缩容器，前者为`块级元素`，后者为`行内元素`。伸缩容器外元素不受影响。

## GFC

> `GridLayout Formatting Contexts(网格布局格式化上下文)`，当一个元素设置为 `display:grid` 的时候，此元素将获得一个独立的渲染区域，可以在网格容器上定义网格行和列，为每一个网格定义位置和空间。

`GFC` 和 `table` 的区别在于 `GridLayout` 会有更加丰富的属性来控制行列，控制对齐以及更为精细的渲染。

`GFC` 将改变传统的布局模式，他将让布局从`一维布局`变成了`二维布局`。简单的说，有了 `GFC` 之后，布局不再局限于单个维度了。这个时候你要实现类似`九宫格`，`拼图之类`的布局效果显得格外的容易。

## FFC 与 BFC 的区别

`FFC` 与 `BFC` 有点儿类似，但仍有以下几点区别：

1. `Flexbox` 不支持 `::first-line` 和 `::first-letter` 这两种伪元素。

2. `vertical-align` 对 `Flexbox` 中的子元素 是没有效果的。

3. `float` 和 `clear` 属性对 `Flexbox` 中的子元素是没有效果的，也不会使子元素脱离文档流(但是对 Flexbox 是有效果的！)。

4. `多栏布局（column-*）` 在 `Flexbox` 中也是失效的，就是说我们不能使用多栏布局在 `Flexbox` 排列其下的子元素。

5. `Flexbox` 下的子元素不会继承父级容器的宽。
