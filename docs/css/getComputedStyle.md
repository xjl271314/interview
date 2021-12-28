---
title: getComputedStyle
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# getComputedStyle

- 2021.12.28

> DOM2 Style 在 `document.defaultView` 上增加了 `getComputedStyle()`方法，该方法返回一个 `CSSStyleDeclaration` 对象（与 style 属性的类型一样），包含元素的计算样式。

## API

```js
document.defaultView.getComputedStyle(element[,pseudo-element])
// or
window.getComputedStyle(element[,pseudo-element])
```

## 使用示例

```jsx
import React, { useRef, useState, useCallback } from 'react';
import { Button, Space } from 'antd';

export default () => {
  const [computedStyles, setComputedStyles] = useState('');
  const [elementStyles, setElementStyles] = useState('');

  const computedRef = useRef();
  const elementRef = useRef();

  const getComputedStyles = useCallback(() => {
    if (computedStyles) {
      setComputedStyles('');

      return;
    }

    const target = computedRef.current;
    let txt = '';

    if (target) {
      const styles =
        window.getComputedStyle(target, null) ||
        document.defaultView.getComputedStyle(target, null) ||
        {};

      // console.log(styles, typeof styles)
      for (let key in styles) {
        if (typeof key == 'string' && isNaN(Number(key)) && styles[key]) {
          txt += `\t<span style="color: gray">${key}</span>: <span style="color: #c31432">${styles[key]}</span>,\n`;
        }
      }
    }
    setComputedStyles(`{\n${txt}}`);
  }, [computedRef, computedStyles]);

  // element.styles
  const getElementStyles = useCallback(() => {
    if (elementStyles) {
      setElementStyles('');

      return;
    }

    const target = elementRef.current;
    let txt = '';

    if (target) {
      const styles = target.style;

      console.log('styles', styles);

      for (let key in styles) {
        if (typeof key == 'string' && isNaN(Number(key)) && styles[key]) {
          txt += `\t<span style="color: gray">${key}</span>: <span style="color: #4e6ef2">${styles[key]}</span>,\n`;
        }
      }
    }
    setElementStyles(`{\n${txt}}`);
  }, [elementRef, elementStyles]);

  return (
    <>
      <Space>
        <Button
          ref={computedRef}
          type="primary"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 200,
            height: 50,
          }}
          onClick={getComputedStyles}
        >
          点击测试getComputedStyle()
        </Button>

        <Button
          ref={elementRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 200,
            height: 50,
          }}
          onClick={getElementStyles}
        >
          点击测试element.style
        </Button>
      </Space>

      <div style={{ marginTop: 20 }}>
        <code style={{ color: '#666' }}>
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          width: 200, height: 50;
        </code>
      </div>

      <div style={{ display: 'flex' }}>
        {computedStyles && (
          <p
            style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}
            dangerouslySetInnerHTML={{ __html: computedStyles }}
          />
        )}
        {elementStyles && (
          <p
            style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}
            dangerouslySetInnerHTML={{ __html: elementStyles }}
          />
        )}
      </div>
    </>
  );
};
```

## getComputedStyle() 与 element.style 的区别

1. `element.style` 读取的只是元素的`内联样式`，即写在元素的 `style` 属性上的样式；而 `getComputedStyle` 读取的样式是`最终样式`，包括了内联样式、嵌入样式和外部样式。

2. `element.style` 既支持读也支持写，我们通过 `element.style` 即可改写元素的样式。而 `getComputedStyle` 仅支持读并不支持写入。我们可以通过使用 `getComputedStyle` 读取样式，通过 `element.style` 修改样式。

## 兼容情况

![兼容情况](https://img-blog.csdnimg.cn/46c3feccc3a2451ea624edd0ec05fa13.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)
