---
title: getBoundingClientRect
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# getBoundingClientRect

- 2021.12.28

> getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。

它的返回值是一个 `DOMRect` 对象，这个对象是由该元素的 `getClientRects()` 方法返回的一组矩形的集合(该元素的 CSS 边框大小)。

返回的结果是包含完整元素的最小矩形，并且拥有 `left`, `top`, `right`, `bottom`, `x`, `y`, `width` 和 `height` 这几个只读属性，且单位都是`px`。

除了 `width` 和 `height` 以外的属性是相对于视图窗口的左上角来计算的。

这里计算的 `width` 和 `height` 属性都是包含了 `padding` 以及 `border` 在内。

## API

```js
const rect = object.getBoundingClientRect();
```

## 使用示例

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { Button, Space } from 'antd';

export default () => {
  const target = useRef();
  const [boundInfo, setBoundInfo] = useState();

  const getBoundingClientRectInfo = () => {
    if (target.current) {
      const infos = target.current.getBoundingClientRect();

      setBoundInfo(JSON.stringify(infos));
    }
  };

  useEffect(() => {
    getBoundingClientRectInfo();
  }, [target]);

  return (
    <Space direction="vertical">
      <Button
        type="primary"
        ref={target}
        style={{
          width: 200,
          height: 100,
          background: 'green',
          padding: 20,
          margin: '20px auto',
          border: 'solid 1px red',
        }}
      >
        点击获取信息
      </Button>
      <p
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: boundInfo }}
      />
    </Space>
  );
};
```

## 兼容情况

![兼容情况](https://img-blog.csdnimg.cn/e11e2fb1c3604f2ba5ddec35bc31fdc1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)
