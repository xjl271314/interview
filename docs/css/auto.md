---
title: CSS中的auto属性
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# 如何理解 CSS 中的 auto?

- 2021.06.22

## width:auto

- 对于`块级元素`，`width: auto` 的自动撑满一行。

- 对于`内联元素`，`width: auto` 则呈现出包裹性，即由子元素的宽度决定。

```jsx
import React from 'react';
import { WidthAuto } from 'interview';

export default () => <WidthAuto />;
```

- jsx

```js
import React from 'react';

import './index.less';

export default () => {
  return (
    <div className="width-auto-page">
      <div className="block-width-auto">
        我是一个块级div元素，width:auto会撑满整行
      </div>
      <span className="inline-width-auto">
        我是一个内联span元素，width: auto呈现出包裹性，即由子元素的宽度决定。
      </span>
    </div>
  );
};
```

- CSS

```css
.width-auto-page {
  background: #f5f5f5;
  font-size: 18px;
  color: #fff;
  text-align: center;
  .block-width-auto {
    background: darkturquoise;
    width: auto;
    height: 50px;
    line-height: 50px;
  }
  .inline-width-auto {
    background: chocolate;
    width: auto;
    line-height: 50px;
  }
}
```

## height:auto

无论内联元素还是块级元素，`height: auto` 都是呈现`包裹性`，即高度由子级元素撑开。

但是父元素设置 `height: auto` 会导致子元素 `height: 100%`百分比失效。

```jsx
import React from 'react';
import { HeightAuto } from 'interview';

export default () => <HeightAuto />;
```

- jsx

```js
import React from 'react';

import './index.less';

export default () => {
  return (
    <div className="height-auto-page">
      <div className="block-height-auto">
        我是一个块级div元素，height:auto呈现出包裹性，会根据子元素的高度撑开。
      </div>
      <span className="inline-height-auto">
        我是一个内联span元素，height: auto呈现出包裹性，即由子元素的高度决定。
      </span>
      <div className="block-height-auto-children">
        <p>父元素设置height: auto会导致子元素height: 50%百分比失效。</p>
      </div>
      <div className="block-height-normal-children">
        <p>父元素设置height: 100px,子元素height: 50%百分比正常。</p>
      </div>
    </div>
  );
};
```

- CSS

```css
.height-auto-page {
  background: #f5f5f5;
  font-size: 18px;
  color: #fff;
  text-align: center;
  user-select: none;
  .block-height-auto {
    background: rgb(88, 189, 236);
    height: auto;
    margin-bottom: 20px;
  }
  .inline-height-auto {
    background: rgb(96, 219, 14);
    height: auto;
  }
  .block-height-auto-children {
    background: crimson;
    height: auto;
    > p {
      height: 50%;
    }
  }
  .block-height-normal-children {
    background: rgb(104, 42, 218);
    height: 100px;
    > p {
      background: darkkhaki;
      height: 50%;
      line-height: 50px;
    }
  }
}
```

## margin: auto

> `margin:auto;`是具有强烈的计算意味的关键字，用来计算元素对应方向应该获得的剩余间距大小。但是触发 `margin:auto` 计算有一个前提条件，就是 `width` 或 `height` 为 `auto` 时，元素是具有对应方向的自动填充特性的。

- 如果一侧定值，一侧 auto，则 auto 为剩余空间大小。

- 如果两侧均是 auto，则平分剩余空间。

```jsx
import React from 'react';
import { MarginAuto } from 'interview';

export default () => <MarginAuto />;
```
