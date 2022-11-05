---
title: 水平居中与垂直居中
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# CSS 中的居中

- 2022.03.08

## 水平居中

### 单行居中，多行左对齐

```jsx
import React from 'react';
import { CSSHorizonCenter1 } from 'interview';

export default () => <CSSHorizonCenter1 />;
```

- CSS 代码:

  ```css
  .ul {
    overflow: hidden;
    li {
      /* 这些都不重要 */
      list-style: none;
      width: 16em;
      border: 1px dashed gray;
      /* 重点 */
      text-align: center;
    }
    /* 重点 */
    p {
      display: inline-block;
      text-align: left;
    }
  }
  ```

## 垂直居中

### absolute + margin

该方案下`父元素`与`当前元素`的高度都已知，利用 `margin: auto` 进行居中。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
  },
  child: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'orange',
    width: '100px',
    height: '50px',
    margin: 'auto',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### absolute + 负 margin

利用绝对定位百分比 `50%` 来实现，然后再用负的 `margin-top` 和 `margin-left` 来进行简单的位移。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
  },
  child: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    background: 'orange',
    width: '100px',
    height: '50px',
    margin: '-25px 0 0 -50px',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### absolute + calc

使用 CSS3 的一个 `calc` 计算函数来计算`top`、`left`值。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
  },
  child: {
    position: 'absolute',
    top: 'calc(50% - 25px)',
    left: 'calc(50% - 50px)',
    background: 'orange',
    width: '100px',
    height: '50px',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### absolute + transform

`transform` 的 `translate` 属性值如果是一个百分比，那么这个百分比将是基于`自身的宽高`计算出来的。针对未知元素宽高的场景使用该方式较合理。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
  },
  child: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    background: 'orange',
    width: '100px',
    height: '50px',
    transform: 'translate(-50%, -50%)',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### line-height + vertical-align

1. 把当前元素设置为`行内元素`，然后通过设置父元素的 `text-align: center;` 实现水平居中；
2. 同时通过设置当前元素的 `vertical-align: middle;` 来实现垂直居中；
3. 最后设置当前元素的 `line-height: initial;` 来避免继承父元素的`line-height`。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
    'line-height': '100px',
    'text-align': 'center',
  },
  child: {
    display: 'inline-block',
    'vertical-align': 'middle',
    'line-height': 'initial',
    background: 'orange',
    width: '100px',
    height: '50px',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### 使用 table 表格功能

通过最经典的 `table` 元素来进行水平垂直居中，不过代码看起来会很冗余，不推荐使用；

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
    'text-align': 'center',
  },
  child: {
    display: 'inline-block',
    background: 'orange',
    width: '100px',
    height: '50px',
  },
};
export default () => {
  return (
    <table>
      <tbody>
        <tr>
          <td style={styles.parent}>
            父元素
            <div style={styles.child}>我是子元素</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
```

### css-table 表格样式

如果一定要使用 `table` 的特性，但是不想写 `table` 元素的话，那么可以使用`css-table`。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
    display: 'table-cell',
    'text-align': 'center',
    'vertical-align': 'middle',
  },
  child: {
    display: 'inline-block',
    background: 'orange',
    width: '100px',
    height: '50px',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### 使用 flex 布局

移动端一维布局推荐使用`flex`布局。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
  },
  child: {
    display: 'inline-block',
    background: 'orange',
    width: '100px',
    height: '50px',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### flex + margin: auto

我们可以在 `flex-item` 上采用 `margin: auto`来减少父元素的代码。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
    display: 'flex',
    // 'justify-content': 'center',
    // 'align-items': 'center',
  },
  child: {
    display: 'inline-block',
    background: 'orange',
    width: '100px',
    height: '50px',
    margin: 'auto',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      父元素
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### 使用 grid 布局

`grid`布局常用于二维布局，比`flex`更加灵活，创造性更强，但也存在兼容性较差的问题。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
    display: 'grid',
    'justify-content': 'center',
    'align-items': 'center',
  },
  child: {
    background: 'orange',
    width: '100px',
    height: '50px',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

### 使用 grid + justify-self + align-self

同`flex`，我们可以在`grid-item`上进行调整优化。

```jsx
import React from 'react';
import { Space } from 'antd';

const styles = {
  parent: {
    position: 'relative',
    background: 'green',
    width: '200px',
    height: '100px',
    display: 'grid',
  },
  child: {
    background: 'orange',
    width: '100px',
    height: '50px',
    'justify-self': 'center',
    'align-self': 'center',
  },
};
export default () => {
  return (
    <div style={styles.parent}>
      <div style={styles.child}>我是子元素</div>
    </div>
  );
};
```

但是在使用 `grid` 布局的时候我们发现父元素的文案被删掉了，原因在于如果有同级子元素的话，默认会纵向往下排列从而影响垂直居中。
