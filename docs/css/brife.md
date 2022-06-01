---
title: 经典问答
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# CSS 常见经典问答

- 2022.03.29

## 1.CSS 怎么画一个大小为父元素宽度一半的正方形？

使用`padding-bottom`来实现。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        width: 400px;
        height: 600px;
        background: red;
      }

      .inner {
        width: 50%;
        padding-bottom: 50%;
        background: blue;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```
