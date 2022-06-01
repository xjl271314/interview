---
title: iframe
nav:
  title: html
  path: /html
group:
  title: html、浏览器相关试题
  path: /html/project
---

# iframe 相关知识

- 2022.04.18

## 定义

`iframe` 是 HTML 内联框架元素，表示嵌套的`browsing context`。它能够将另一个`HTML`页面嵌入到当前页面中。

每个嵌入的`浏览上下文（embedded browsing context）`都有自己的`会话历史记录(session history)`和`DOM树`。包含嵌入内容的浏览上下文称为`父级浏览上下文`。`顶级浏览上下文`（没有父级）通常是由 `Window` 对象表示的浏览器窗口。

## 属性

### allow

用于为 `iframe` 指定`特征策略`.

#### 特征策略

特征策略允许 web 开发者在浏览器中选择启用、禁用和修改确切特征和 API 的行为.比如内容安全策略，但是它控制的是浏览器的特征非安全行为.

有了功能策略，我们可以选择一组“策略”，让浏览器强制执行整个网站使用的特定功能。这些策略限制了站点可以访问哪些 api，或者修改浏览器对某些特性的默认行为。

例如：

- 改变手机和第三方视频自动播放的默认行为.
- 限制网站使用敏感的 api，如摄像头或麦克风.
- 允许 iframes 使用全屏 API.
- 确保图像的大小正确，对于视口来说不会太大.

#### allowlist

allowlist 包含了一些允许的规则:

- `*`：默认情况下顶级浏览器上下文中使用，允许的话在所有的子 iframe 上适用。
- `self`：默认情况下顶级浏览器上下文中使用，允许的话在所有子 iframe 上同源的文档允许。
- `none`：都禁止。
- `src`：只在同 iframe 相关 url 的情况下可使用。

示例:

```HTML
<!-- 不允许全屏 -->
<iframe allow="fullscreen 'none'">

<!-- 禁止全屏和调用支付接口，多个权限用分号隔开 -->
<iframe allow="fullscreen 'none'; payment 'none'">
```

### csp

对嵌入的资源配置内容安全策略。

#### 内容安全策略( CSP )

内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS ) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

#### 设置内容安全策略

比如一个引入的 css 文件，如果我们设置了如下策略，该策略禁止任何资源的加载，除了来自`cdn.example.com`的样式表。

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'cdn.example.com'; " />
    <title>iframe-child</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    ...
  </body>
</html>
```

这个时候如果在浏览器打开页面，打开开发者工具就能看到报错：

```js
Refused to load the stylesheet 'localpath/iframe/style.css' because it violates the following Content Security Policy directive: "style-src 'cdn.example.com'". Note that 'style-src-elem' was not explicitly set, so 'style-src' is used as a fallback.
```

### width

没有设置 width 的情况下默认是 300;

### height

没有设置 `height` 的情况下默认是 150;

```jsx
/**
 */
import React from 'react';
export default () => <iframe src="https://baidu.com" />;
```

### importance

表示 `<iframe>` 的 src 属性指定的资源的加载优先级。允许的值有：

- `auto (default)`：不指定优先级。浏览器根据自身情况决定资源的加载顺序

- `high`：资源的加载优先级较高

- `low`：资源的加载优先级较低

### name

用于定位嵌入的浏览上下文的名称。

该名称可以用作 `<a>` 标签与 `<form>` 标签的 `target` 属性值，也可以用作 `<input>` 标签和 `<button>` 标签的 `formtarget` 属性值，还可以用作 `window.open()` 方法的 `windowName` 参数值。

例如使用 a 标签打开一个 iframe:

```jsx
import React from 'react';
export default () => (
  <>
    <iframe
      name="W3C"
      src="https://www.w3school.com.cn/"
      style={{ width: '100%', height: 300 }}
    />
    <a href="https://juejin.cn" target="W3C">
      打开掘金
    </a>
  </>
);
```

### 脚本

1. 通过 `window.name` 属性可以拿到 `iframe` 的 `name` 信息。

2. 通过 `window.frames` 可以拿到所有的 `iframe` 信息，这是一个`伪数组`，我们可以通过 index 或者是 name 来获取对应的`iframe`。

3. 如果想获取 `iframe` 里的 `window` 或者 `document` ，可以使用 `iframe.contentWindow` || `iframe.contentDocument`。

4. 获取顶级窗口使用 `window.top`。

5. 获取父级窗口使用 `window.parent`。

6. 导航栏的前进和后退使用 `history.forward()` 和 `history.back()`。

7. iframe 之间的通信可以通过`window.postMessage`进行。

## 缺点

1. 页面上的每个`iframe`都需要增加内存和其它计算资源，这是因为每个浏览上下文都拥有完整的文档环境。虽然理论上来说你能够在代码中写出来无限多的`iframe`，但是你最好还是先看看这么做会不会导致某些性能问题。

2. 加载`iframe`会阻塞主页面的`onload`事件。

3. 搜索引擎无法解读这种页面，不利于 `SEO`。
