---
title: 圣杯布局与双飞翼布局
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# 如何实现圣杯布局和双飞翼布局?

- 2021.06.21

> 圣杯布局和双飞翼布局都是用来实现一个**两侧宽度固定，中间宽度自适应的三栏布局**。

两者虽然在实现方式上略有不同，但都遵循了以下规则:

- 两侧宽度固定，中间宽度自适应;
- 中间部分在 `DOM` 结构上优先，以便先行渲染;
- 允许三列中的任意一列成为最高列;
- 只需要使用一个额外的`<div>`标签。

## 圣杯布局

```jsx
import React from 'react';
import { LayoutGlass } from 'interview';

export default () => <LayoutGlass />;
```

- DOM 结构

```html
<body>
  <div id="header"></div>
  <div id="container">
    <div id="center" class="column"></div>
    <div id="left" class="column"></div>
    <div id="right" class="column"></div>
  </div>
  <div id="footer"></div>
</body>
```

首先定义出整个布局的 `DOM` 结构，主体部分是由 `container` 包裹的 `center`,`left`,`right` 三列，其中 `center` 定义在最前面。

- CSS 代码

```css
.layout-glass {
  min-width: 550px;
  height: 600px;
  background: #f5f5f5;
  margin: 0 auto;
  #header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: cornflowerblue;
    color: #fff;
  }

  #container {
    padding-left: 200px;
    padding-right: 150px;
    overflow: hidden;
  }

  #container .column {
    float: left;
  }

  #center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 400px;
    background: darkgreen;
    color: #fff;
  }

  #left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 400px;
    background: chocolate;
    margin-left: -100%;
    position: relative;
    right: 200px;
    color: #fff;
  }

  #right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 400px;
    margin-right: -150px;
    background: darksalmon;
    color: #fff;
  }

  #footer {
    clear: both;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: crimson;
    color: #fff;
  }
}
```

## 双飞翼布局

> 双飞翼布局的 DOM 结构与圣杯布局的区别是用 `container` 仅包裹住 `center`，另外将`.column` 类从 `center` 移至 `container` 上。

```jsx
import React from 'react';
import { LayoutDouble } from 'interview';

export default () => <LayoutDouble />;
```

- DOM 结构

```html
<body>
  <div id="header"></div>
  <div id="container" class="column">
    <div id="center"></div>
  </div>
  <div id="left" class="column"></div>
  <div id="right" class="column"></div>
  <div id="footer"></div>
</body>
```

- CSS 代码

```css
.layout-double {
  min-width: 500px;
  #container {
    width: 100%;
    height: 400px;
    background: darkgreen;
    color: #fff;
  }

  .column {
    float: left;
  }

  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #header {
    .flex;
    height: 100px;
    background: cornflowerblue;
    color: #fff;
  }

  #center {
    .flex;
    height: 100%;
    margin-left: 200px;
    margin-right: 150px;
    background: darkgreen;
  }

  #left {
    .flex;
    width: 200px;
    height: 400px;
    margin-left: -100%;
    background: chocolate;
    color: #fff;
  }

  #right {
    .flex;
    width: 150px;
    height: 400px;
    margin-left: -150px;
    background: darksalmon;
    color: #fff;
  }

  #footer {
    .flex;
    height: 100px;
    background: crimson;
    clear: both;
    color: #fff;
  }
}
```

## 使用 flex 实现

- DOM 结构

```html
<!-- DOM结构 -->
<div id="container">
  <div id="center"></div>
  <div id="left"></div>
  <div id="right"></div>
</div>
```

- CSS

```css
#container {
  display: flex;
}

#center {
  flex: 1;
}

#left {
  flex: 0 0 200px;
  order: -1;
}

#right {
  flex: 0 0 150px;
}
```
