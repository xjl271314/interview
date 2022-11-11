---
title: 经典问答
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# CSS 常见经典问答

- 2022.03.29

## 1.CSS 怎么画一个大小为父元素宽度一半的正方形？

使用`padding-bottom`来实现。

```jsx
import React from 'react';

const styles = {
  outer: {
    width: '200px',
    height: '200px',
    background: 'red',
  },
  inner: {
    width: '50%',
    paddingBottom: '50%',
    background: 'blue',
  },
};

export default () => {
  return (
    <div style={styles.outer}>
      <div style={styles.inner} />
    </div>
  );
};
```
