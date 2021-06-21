---
title: flex布局
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# CSS 中的 flex 布局?

- 2021.06.11

> `Flexible Box` 模型，通常被称为 `flexbox`，是一种`一维`的布局模型。它给 `flexbox` 的子元素之间提供了强大的空间分布和对齐能力。

## flexbox 的两根轴线

使用 `flex` 布局时，涉及两根轴线 — `主轴和交叉轴`。主轴由 `flex-direction` 定义，另一根轴垂直于它。

## 设置 flex 布局

> 对容器设置 `display:flex` 或者 `display:inline-flex` 可以使其成为 `flex` 容器。

```html
<div class="wrap">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

```css
.wrap {
  display: flex;
}
```

![flex](https://img-blog.csdnimg.cn/20210611151703951.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## flex-direction

> 主轴由 `flex-direction` 定义，可以取 4 个值：

- row
- row-reverse
- column
- column-reverse

`flex-direction`的默认值是`row`。

![flex-direction](https://img-blog.csdnimg.cn/20210611151121977.png)

设置为 `column` 或者 `column-reverse` 时，主轴会沿着上下方向延伸 — 也就是 `block` 排列的方向。

![flex-direction:column](https://img-blog.csdnimg.cn/20210611151334853.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**`flex-direction` 示例集合:**

![flex demo](https://img-blog.csdnimg.cn/20210611151751729.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## flex-wrap

> 控制 Flex 项目是否换行，默认值是 `nowrap`，不换行

![flex-wrap](https://img-blog.csdnimg.cn/20210611152454379.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## flex-flow

> `flex-direction` 和 `flex-wrap` 两个属性的组合属性。

```css
.wrap {
  flex-flow：row wrap|| row nowrap || column wrap || column nowrap 等等
}
```

## justify-content

> Flex 项目在整个 `Main-Axis（主轴）`上的对齐方式(父容器 X 轴)，默认是 `flex-start`，起始端对齐。

- `flex-start`: 起始端对齐
- `flex-end`: 末尾段对齐
- `center`: 居中对齐
- `space-between`: 首尾两端均匀分布
- `space-around`: 均匀分布（首尾两端的子容器到父容器的距离是子容器间距的一半）

![justify-content](https://img-blog.csdnimg.cn/20210611153651764.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## align-items

> Flex 项目在 `Cross-Axis 对齐方式(父容器 Y 轴)`，默认是 `flex-start`，起始端对齐。

- `flex-start`: 起始端对齐
- `flex-end`: 末尾段对齐
- `center`: 居中对齐
- `baseline`: 基线对齐（默认是指首行文字）
- `stretch`: 子容器沿 Y 轴方向的尺寸拉伸至与父容器一致

![align-items](https://img-blog.csdnimg.cn/20210611154958573.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## align-content

> 该属性只针对子容器多行排列时，设置行与行之间的对齐方式，对单行无效。

- `flex-start`: 起始端对齐
- `flex-end`: 末尾段对齐
- `center`: 居中对齐
- `space-between`: 等间距均匀分布
- `space-around`: 等边距均匀分布
- `stretch`: 拉伸对齐

![align-content](https://img-blog.csdnimg.cn/20210611163243845.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## order

> 改变子容器的排列顺序，覆盖 HTML 代码中的顺序，默认值为 0，可以为负值，数值越小排列越靠前。

![order](https://img-blog.csdnimg.cn/20210611163444697.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```css
.wrap {
  display: flex;
  div {
    order: 1 //数字
;
  }
}
```

## flex-basis

> 在不伸缩的情况下子容器的原始尺寸。主轴为横向时代表宽度，主轴为纵向时代表高度。

```css
.wrap {
  display:flex;
  /* 主轴为横向时代表宽度 */
  flex-direction：row;
  div{
    flex-basis:120px;// 数字
    height:80px;
  }
  /* 或者 */

  /* 主轴为纵向时代表高度 */
  flex-direction：column;
  div{
     flex-basis:120px; // 数字
     width:80px;
  }
}
```

## flex-grow

> 父容器剩余空间按 1:2 的比例分配给子容器。

```css
.wrap {
  display: flex;
  .div1 {
    flex-grow: 1;
  }
  .div2 {
    flex-grow: 2;
  }
}
```

![flex-grow](https://img-blog.csdnimg.cn/20210611163714300.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## flex-shrink

> 子容器超出的部分按 1:2 的比例从子容器中减去

```css
.wrap {
  display: flex;
  width: 100px;
  .div1,
  .div2 {
    flex-basis: 200px;
    // 设置基础宽度，且超出父容器宽度
  }
  .div1 {
    flex-shrink: 1;
  }
  .div2 {
    flex-shrink: 2;
  }
}
```

![flex-shrink](https://img-blog.csdnimg.cn/20210611163920963.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## align-self

> 每个子容器可以单独定义沿交叉(父容器 Y)轴的排列的方式，此属性与父容器 align-items 属性完全一致，如果两者同时设置则以子容器的 align-self 属性为准。

![align-self](https://img-blog.csdnimg.cn/20210611164007580.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
