---
title: script脚本
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# script 脚本执行顺序

- 2022.04.01

## 脚本模式

### 正常模式

这种情况下 JS 会阻塞浏览器，浏览器必须等待 `index.js` 加载和执行完毕才能去做其它事情，这样就会造成空白页的出现。

```html
<html>
  <head>
    <script src="./index.js"></script>
  </head>
  <body>
    <p>我是文本，但是我的等script加载完成后才能渲染</p>
  </body>
</html>
```

正常模式下，一般还会将脚本放置在 body 标签之后，这样的好处是不会阻塞 DOM 的加载，且在脚本中可以直接去访问 DOM。

```html
<html>
  <head> </head>
  <body>
    <p>我是文本，我可以先加载</p>
  </body>
  <script src="./index.js"></script>
</html>
```

### async(异步) 模式

当在脚本中使用 `async` 关键字的时候，这两个脚本会和页面的元素**同时进行加载，加载的方式是开启了新的线程进行加载**。

**下载的时候可以进行页面的其他操作，下载完成后就会停止解析并执行，但是并不能保证执行的顺序**。

脚本的加载可能在 `DOMContentLoaded` 事件之前执行，也可能在 `DOMContentLoaded` 事件之后执行，这取决于 DOM 内容的多少。

```html
<html>
  <head>
    <script async src="https://url/1.js"></script>
    <script async src="https://url/2.js"></script>
  </head>
  <body>
    <p>我是文本，我不受脚本加载影响</p>
  </body>
</html>
```

比如上面脚本 1 中延迟 1s 加载，脚本 2 中延迟 2s 加载，执行结果是:

```js
DOMContentLoaded-- > script1-- > script2;
```

### defef(异步) 模式

这种方式和 `async` 的模式差不多，也会异步的下载该文件并且不会影响到后续 DOM 的渲染。

他们的区别在于如果有多个设置了`defer`的`script`标签，则会按照`顺序`执行所有的`script`，且脚本会在文档渲染完毕后，`DOMContentLoaded`事件调用前执行。

```html
<html>
  <head>
    <script defer src="https://url/1.js"></script>
    <script defer src="https://url/2.js"></script>
  </head>
  <body>
    <p>我是文本，我不受脚本加载影响</p>
  </body>
</html>
```

比如上面脚本 1 中延迟 1s 加载，脚本 2 中延迟 2s 加载，执行结果是:

```js
script1-- > script2-- > DOMContentLoaded;
```
