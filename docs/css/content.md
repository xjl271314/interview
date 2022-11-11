---
title: content使用场景
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# CSS 中的 content?

- 2021.11.01

> `content` 属性与 `::before` 及 `::after` 伪元素配合使用，来插入生成内容，可以插入字符串、图片、链接等。

## 在 content 中使用 HTML attr 属性

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      li {
        list-style: none;
        position: relative;
      }

      li::before {
        /* attr函数, 参数就是li标签身上的属性 */
        content: attr(tip);
        position: absolute;
        right: 0;
        opacity: 0;
        color: burlywood;
        transition: opacity 500ms;
      }

      li:hover::before {
        opacity: 1;
      }
    </style>
  </head>
  <body>
    <div class="list">
      <li tip="list-item-1-tip">list-item-1</li>
      <li tip="list-item-2-tip">list-item-2</li>
      <li tip="list-item-3-tip">list-item-3</li>
    </div>
  </body>
</html>
```
