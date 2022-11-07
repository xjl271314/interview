---
title: 行内元素和块级元素
nav:
  title: 前端基础
  path: /base
group:
  title: html、浏览器相关试题
  path: /html/project
---

# 说说 行内元素 和 块级元素 的区别?

- 2021.06.23

## 块级元素

`块级元素`是指单独撑满一行的元素，如 `div`、`ul`、`ol`、`li`、`table`、`form`、`p`、`h1~h6`、`address` 等元素。这些元素的 `display` 值默认是 `block`、`table`、`list-item` 等。

## 行内元素

`内联元素`又叫`行内元素`，指只占据它对应标签的边框所包含的空间的元素，这些元素如果父元素宽度足够则并排在一行显示的，如 `input`、`strong`、`span`、`a`、`em`、`i`、`img`、`td` 等。这些元素的 `display` 值默认是 `inline`、`inline-block`、`inline-table`、`table-cell` 等。

## 区别

### 占位表现区别

- 块级元素会独占一行，其宽度自动填满其父元素宽度。
- 行内元素不会独占一行，相邻的行内元素会排列在同一行里，直到一行排不下，才会换行，其宽度随元素的内容而变化。

### 宽高设置区别

- 块级元素可以设置 `width`, `height` 属性，【注意：块级元素即使设置了宽度，仍然是独占一行的】
- 行内元素设置 `width`, `height` 无效; 【除非将表现改为行内块模式】

### padding 和 margin 的区别

- 块级元素可以设置 `margin` 和 `padding`。
- 行内元素的水平方向的 `padding-left`,`padding-right`,`margin-left`,`margin-right` 都产生边距效果，但是竖直方向的 `margin-top`,`margin-bottom` 都不会产生边距效果。（水平方向有效，竖直方向无效）。

### 包裹性上的区别

代码标准上`块级元素`可以包含`行内元素`和`块级元素`。`行内元素`不能包含`块级元素`。

### 居中表现上的区别

- 块级元素设置居中

```css
/* 块级元素p一定要设置宽度， 才能相当于DIV父容器水平居中 */
div p {
  margin: 0 auto;
  width: 500px;
}

/* DIV父容器设置宽度 */
div {
  width: 500px;
}
/* 块级元素p也可以加个宽度， 以达到相对于DIV父容器的水平居中效果 */
div p {
  margin: 0 auto;
  height: 30px;
  line-height: 30px;
}
```

- 行内元素设置居中

```css
/*DIV内的行内元素均会水平居中*/
div {
  text-align: center;
}
/*DIV内的行内元素均会垂直居中*/
div {
  height: 30px;
  line-height: 30px;
}
```
