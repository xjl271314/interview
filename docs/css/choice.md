---
title: CSS选择器和权重
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# 描述下 CSS 中的选择器和权重?

- 2021.06.10

## CSS 选择器

CSS 中的选择器很多，总的来说可以归纳成以下几种:

- 通配符选择器
- 元素(标签选择器)
- 类选择器
- ID 选择器
- 属性选择器
- 文档结构选择器
- 伪类选择器

## 通配符选择器

> 这类选择器层级比较低，通常用于书写 `reset.css` 中重置浏览器默认样式使用，或者针对某个类名下所有后续元素进行相同样式设置使用。

```css
* {
  margin: 0;
  padding: 0;
}
```

## 元素(标签)选择器

> 这类选择器层级也比较低,但是高于`*`通配符选择器，一般用于在某个类名下针对某些类别的标签进行样式处理。

```css
p {
  color: red;
}

.parent span {
  color: red;
}
```

## 类选择器

> 这类选择器是我们现有中经常使用到的选择器，需要我们去自定义一个样式名。

```css
.warning {
  color: red;
}
```

## ID 选择器

> `ID选择器`的优先级高于`类选择器`，早期项目中使用较多，现有推荐规范还是使用`类选择器`。

```css
#warning {
  color: red;
}
```

## 属性选择器

> 属性选择器包括的比较多。

这里我们以这段 html 为例:

```HTML5
<ul>
    <li foo>1</li>
    <li foo="abc">2</li>
    <li foo="abc efj">3</li>
    <li foo="abcefj">4</li>
    <li foo="efjabc">5</li>
    <li foo="ab">6</li>
</ul>
```

- ### `[attribute]`

> 选择所有带 foo 属性的元素

```css
[foo] {
  background-color: red;
}
```

![选择所有带 foo 属性的元素](https://img-blog.csdnimg.cn/20210610223536506.png)

- ### `[attribute=value]`

> 选择 `attribute=value` 的所有元素。

```css
[foo='abc'] {
  background-color: red;
}
```

![选择 `attribute=value` 的所有元素。](https://img-blog.csdnimg.cn/20210610223655829.png)

- ### `[attribute~=value]`

> 选择 attribute 属性包含单词 value 的所有元素。

```css
[foo~='abc'] {
  background-color: red;
}
```

![选择 attribute 属性包含单词 value 的所有元素。](https://img-blog.csdnimg.cn/20210610224404736.png)

- ### `[attribute^=value]`

> 选择其 attribute 属性值以 value 开头的所有元素。类似正则的 ^,以什么开始

```css
[foo^='abc'] {
  background-color: red;
}
```

![选择其 attribute 属性值以 value 开头的所有元素。类似正则的 ^,以什么开始](https://img-blog.csdnimg.cn/20210610224514533.png)

- ### `[attribute$=value]`

> 选择其 attribute 属性值以 value 结束的所有元素。类似正则的 $,以什么结束

```css
[foo$='abc'] {
  background-color: red;
}
```

![选择其 attribute 属性值以 value 结束的所有元素。类似正则的 $,以什么结束](https://img-blog.csdnimg.cn/20210610224658225.png)

- ### `[attribute*=value]`

> 选择其 attribute 属性中包含 value 子串的每个元素。

```css
[foo*='abc'] {
  background-color: red;
}
```

![选择其 attribute 属性中包含 value 子串的每个元素。](https://img-blog.csdnimg.cn/20210610224757854.png)

- ### `[attribute|=value]`

> 选择 attribute 属性值以 value 开头的所有元素。

```css
[foo|='abc'] {
  background-color: red;
}
```

![选择 attribute 属性值以 value 开头的所有元素。](https://img-blog.csdnimg.cn/20210610224850617.png)

### 文档结构选择器

我们采用如下的 HTML 代码示例

```html
<ul>
  <li>
    <h1>h1</h1>
    <p>p1</p>
  </li>
  <li>
    <h1>h1</h1>
    <p>p1</p>
  </li>
</ul>
```

![HTML结构](https://img-blog.csdnimg.cn/20210610225133878.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- ### `后代选择器 element element`:

> 选择 父 element 元素内部的所有 子 element 元素。

```css
ul li {
  border: 1px solid red;
}
```

![element element](https://img-blog.csdnimg.cn/20210610225236533.png)

- ### `子选择器 element>element`:

> 选择父元素为 element 元素的所有 element 子元素。仅匹配一层。

```css
ul > li > p {
  border: 1px solid red;
}
```

![子选择器 element>element](https://img-blog.csdnimg.cn/20210610225335241.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- ### `相邻兄弟选择器 element+element`:

> 选择紧接在 element 元素之后的 element 元素。

```html
<div>
  <h1>h1</h1>
  <p>p1</p>
  <p>p2</p>
  <p>p3</p>
</div>
```

```css
h1 + p {
  color: red;
}
```

![相邻兄弟选择器 element+element](https://img-blog.csdnimg.cn/20210610225441524.png)

- ### `一般兄弟选择器 element1~element2`:

> 选择前面有 element1 元素的每个 element2 元素。

```html
<div>
  <h1>h1</h1>
  <p>p1</p>
  <p>p2</p>
  <p>p3</p>
</div>
```

```css
h1 ~ p {
  border: 1px solid red;
}
```

![一般兄弟选择器 element1~element2](https://img-blog.csdnimg.cn/20210610225553793.png)

## 伪类选择器

- ### `:root 文档根元素伪类`

```css
:root {
  background-color: red;
}
```

- ### `:nth-child(n) 孩子选择器`

示例 html:

```html
<div>
  <h1>h1</h1>
  <p>p1</p>
  <p>p2</p>
  <p>p3</p>
</div>
```

```css
div :nth-child(1) {
  color: red;
}
```

![nth-child(n)](https://img-blog.csdnimg.cn/20210610225902438.png)

- ### `:nth-of-type(n) 同类型的第n个元素`

```css
div p:nth-of-type(2) {
  color: red;
}
```

![:nth-of-type(n)](https://img-blog.csdnimg.cn/20210610230024548.png)

- ### `element:first-child`

> 选择属于父元素 element 的第一个子元素。 等同 :nth-child(1)

- ### `element:last-child`

> 选择属于父元素 element 的最后一个子元素。

- ### `element:first-of-type`

> 选择同类型的第一个子元素

- ### `element:last-of-type`

> 选择同类型的最后一个子元素

- ### `element:only-child`

> 选择父元素 element 唯一的子元素

- ### `:empty 没有子元素`

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      p:empty {
        width: 100px;
        height: 20px;
        background: #ff0000;
      }
    </style>
  </head>
  <body>
    <h1>这是标题</h1>
    <p>第一个段落。</p>
    <p></p>
    <p>第三个段落。</p>
    <p>第四个段落。</p>
    <p>第五个段落。</p>
  </body>
</html>
```

生效的是 `<p></p>`,没有子元素。

- ### `:nth-last-child(n) 倒数第n个子元素`

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      div :nth-last-child(1) {
        color: red;
      }
    </style>
  </head>
  <body>
    <div>
      <p>第一个段落。</p>
      <p>第二个段落。</p>
      <p>第三个段落。</p>
      <p>第四个段落。</p>
      <p>第五个段落。</p>
    </div>
  </body>
</html>
```

父元素 div 的倒数第一个元素 p`(第五个段落。)`被选中。

- ### `element:nth-last-of-type(n)`

> 同类型的倒数第 n 个子元素

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      div p:nth-last-of-type(2) {
        color: red;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>h11</h1>
      <p>第一个段落。</p>
      <p>第二个段落。</p>
      <p>第三个段落。</p>
      <h1>h11</h1>
      <p>第四个段落。</p>
      <p>第五个段落。</p>
      <h1>h11</h1>
    </div>
  </body>
</html>
```

`<p>第四个段落。</p>` 处于同类型 p 标签 倒数第 2 个。

```css
div p:nth-last-of-type(2n + 1) {
  color: red;
}
/* 其中2n+1(odd):奇数、2n(even)：偶数 */
```

- ### `element:only-of-type`

> 选择父元素里唯一同类型子元素。

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      div h1:only-of-type {
        color: red;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>h1</h1>
      <p>p1</p>
      <p>p2</p>
      <p>p3</p>
      <h1>h1</h1>
    </div>
    <div>
      <h1>h2</h1>
    </div>
  </body>
</html>
```

`<h1>h2</h1>` 符合，被选中。

- ### `a:link`

> 选择没有被访问过的 a 元素

- ### `a:active`

> 选择正在被点击的 a 元素

- ### `a:hover`

> 选择鼠标正停留在上方的 a 元素

- ### `a:visited`

> 选择已经被访问过的 a 元素

- ### `:focus`

> 选择所有获得焦点的元素。

- ### `:enabled / :disabled`

> 选择每个启用的 input 元素 / 选择每个禁用的 input 元素

- ### `:checked`

> 选择每个被选中的 input 元素。自定义开关可以用这个实现

- ### `:not(selector)`

> 选择非 selector 的元素

## 伪元素选择器

- ### `element::first-line`

> p 元素的第一行背景色发生改变。

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      p:first-line {
        background-color: yellow;
      }
    </style>
  </head>
  <body>
    <h1>WWF's Mission Statement</h1>
    <p>
      To stop the degradation of the planet's natural environment and to build a
      future in which humans live in harmony with nature, by; conserving the
      world's biological diversity, ensuring that the use of renewable natural
      resources is sustainable, and promoting the reduction of pollution and
      wasteful consumption.
    </p>
  </body>
</html>
```

- ### `element::first-letter`

> h1 标签的第一个字符`W`颜色变化。

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      h1:first-letter {
        color: yellow;
      }
    </style>
  </head>

  <body>
    <h1>WWF's Mission Statement</h1>
  </body>
</html>
```

- ### `element::before`

> 在每个 element 元素的内容之前插入内容。我们更多的可能是当作一个 div 来用,插入一些符号或者 icon。

- ### `element::after`

> 在每个 element 元素的内容之后插入内容。我们可能更多的是用来清除浮动或验证表单提示等其它操作。

- ### `::selection`

> 选择被用户选取的元素部分。

## CSS 选择器权重

| 权重  | 选择器                                     |
| ----- | :----------------------------------------- |
| 10000 | !important                                 |
| 1000  | 内联样式 style="..."                       |
| 100   | id 选择器 #app                             |
| 10    | 类、伪类、属性选择器                       |
| 1     | 标签、伪元素选择器 span :after             |
| 0     | 通用选择器(\*)、子选择器(>)、兄弟选择器(+) |

在 css 中，`!important`的权重相当的高，但是由于宽高会被`max-width/min-width`覆盖，所以`!important`会失效。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '简单的归纳就是`!important优先级最高` > `内联样式` > `ID选择器` > `类选择器` > `标签、伪类选择器` > `子选择器、兄弟选择器` > `通用选择器`';

export default () => <Info type="info" txt={txt} />;
```
