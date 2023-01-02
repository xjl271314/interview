---
title: CSS盒模型
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# 描述下 CSS 中的盒模型?

- 2021.06.10

## 基本概念：标准模型+IE 模型

我们知道在盒模型中主要有 5 个属性: `width`、`heigth`、`padding`、`border`、`margin`。

![CSS盒模型组成](https://img-blog.csdnimg.cn/20210610203851654.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 标准(W3C)模型

在标准模型(W3C)模型下，即`box-sizing: content-box;` 元素的`width = content`, 高度计算相同。

![W3C模型](https://img-blog.csdnimg.cn/20210610205855268.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### IE 模型

在 `IE 盒模型`下，即`box-sizing: border-box;`元素的`width = content + padding + border`,高度计算相同。

![IE模型](https://img-blog.csdnimg.cn/20210610205922349.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## CSS 中的盒模型

我们知道了盒模型的定义之后，我们来看看在 CSS 中是如何去体现的呢?

我们知道在 `CSS3` 中新增了个叫 `box-sizing` 的属性: `content-box | border-box;`分别设置为`标准的盒模型`、`IE 盒模型`。(默认没有配置的情况下走的是 `content-box`)。

假如我们有这样的一个样式:

```css
.content-box {
  width: 100px;
  height: 50px;
  padding: 10px;
  border: 5px solid red;
  margin: 15px;
}
```

![content-box](https://img-blog.csdnimg.cn/2021061021061368.png)

由于我们默认的盒模型配置是`content-box`，所以在审查元素的时候元素的`width`就是`100px`，`height`就是`50px`。如果我们修改为`border-box`，就会变成如下的效果。

```css
.border-box {
  box-sizing: border-box;
  width: 100px;
  height: 50px;
  padding: 10px;
  border: 5px solid red;
  margin: 15px;
}
```

![border-box](https://img-blog.csdnimg.cn/20210610211201396.png)

采用`border-box`之后我们的元素宽度`width=content + 2 padding + 2 border = 70px + 2 10px + 2 5px = 100px`。

## js 获取盒模型对应的宽和高

- dom.style.width/height:

只能取到行内样式的宽和高，`style 标签`中和 `link` 外链的样式取不到。

- dom.currentStyle.width/height:

取到的是最终渲染后的宽和高，只有 IE 支持此属性。

- window.getComputedStyle(dom).width/height:

同上述方法差不多，但是多浏览器支持，IE9 以上支持。

- dom.getBoundingClientRect().width/height:

获取元素渲染后的宽和高，大多浏览器支持。IE9 以上支持，除此外还可以取到相对于视窗的上下左右的距离。

## 外边距重叠

> 当两个垂直外边距相遇时，他们将形成一个外边距，合并后的外边距高度等于两个发生合并的外边距的高度中的较大者。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n只有`普通文档流中块级元素`的垂直外边距才会发生外边距合并，`行内框`、`浮动框`或`绝对定位之间`的外边距不会合并。';

export default () => <Info type="warning" txt={txt} />;
```

![外边距重叠](https://img-blog.csdnimg.cn/20210610212806685.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
