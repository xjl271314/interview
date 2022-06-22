---
title: 经典问答
nav:
  title: html
  path: /html
group:
  title: 经典简答
  path: /html/quick
---

- 2022.03.29

# 常见问题

## 1.针对移动浏览器端开发页面，不期望用户放大屏幕，且要求“视口（viewport）”宽度等于屏幕宽度，视口高度等于设备高度，如何设置？

```html
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maxumun-scale=1, user-scale=no"></meta>
```

- 如果把移动设备上浏览器的可视区域设为`viewport`的话，某些网站就会因为`viewport`太窄而显示错乱，所以这些浏览器就决定默认情况下把`viewport`设为一个较宽的值，比如`980px`，这样的话即使是那些为桌面设计的网站也能在移动浏览器上正常显示了。`ppk`把这个浏览器默认的`viewport`叫做`layoutviewport`。

- `layoutviewport`的宽度是大于浏览器可视区域的宽度的，所以我们还需要一个`viewport`来代表浏览器可视区域的大小，`ppk`把这个`viewport`叫做`visualviewport`。

- `idealviewport`是最适合移动设备的`viewport`，`idealviewport`的宽度等于`移动设备的屏幕宽度`，只要在`css`中把某一元素的宽度设为`idealviewport`的宽度（单位用 px），那么这个元素的宽度就是设备屏幕的宽度了，也就是宽度为 100%的效果。`idealviewport`的意义在于，无论在何种分辨率的屏幕下，那些针对`idealviewport`而设计的网站，不需要用户手动缩放，也不需要出现横向滚动条，都可以完美的呈现给用户。

## 2.请描述一下 cookies，sessionStorage 和 localStorage 的区别？

| 特性           | Cookie                                                                                                                                                                                               | localStorage                                                                            | sessionStorage                                                                        |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| 定义           | Cookie 是存储在客户端的小型文本文件，可以包含若干键值对，每个键值对可以设置过期时间（默认过期时间为关闭浏览器时）。                                                                                  | HTML5 提供的在客户端存储数据的新方法，没有时间限制的数据存储。                          | HTML5 提供的在客户端存储数据的新方法，针对一个 session 的数据存储。                   |
| 数据的生命周期 | 一般由服务器生成，可设置失效时间。如果在浏览器端生成 Cookie，默认是关闭浏览器后失效。                                                                                                                | 除非被清除，否则永久保存。                                                              | 仅在当前会话下有效，关闭页面或浏览器后被清除。                                        |
| 存放数据大小   | 4K 左右                                                                                                                                                                                              | 一般为 5MB                                                                              | 同 localStorage                                                                       |
| 与服务器通信   | 每次都会携带在 HTTP 头中，如果使用 cookie 保存过多数据会带来性能问题。                                                                                                                               | 仅在客户端（即浏览器）中保存，不参与和服务器的通信                                      | 同 localStorage                                                                       |
| 作用域         | js 是无法读取和修改 httponly cookies，当然也不能设置 cookie 为 httponly，这只能通过服务器端去设置。主要是为了提供一个安全措施来帮助阻止通过 JavaScript 发起的跨站脚本攻击 (XSS) 窃取 cookie 的行为。 | 只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份 localStorage 数据。 | sessionStorage 比 localStorage 更严苛一点，除了协议、主机名、端口外，还要求同一窗口。 |
| 使用场景       | http 请求，用户登录。                                                                                                                                                                                | 离线存储（历史记录）                                                                    | 用户登录授权的验证                                                                    |

## 3. !DOCTYPE html 作用

`<!DOCTYPE>` 声明必须是 `HTML` 文档的第一行，位于 `<html>` 标签之前。

`HTML`版本有很多种，这个声明告诉浏览器采用 `HTML5` 标准网页声明来解析`html`文件。

## 4. 浏览器的严格模式和混杂模式？

- `严格模式`下排版和 js 运作模式是以该浏览器支持的最高标准运行。

- `混杂模式`下浏览器向后兼容，模拟老浏览器，防止浏览器无法兼容页面。

## 5. 有哪些查找元素的方式?

- `document.getElementById('id')`: 如果页面中多个元素的 ID 值相同，只返回文档中第一次出现的元素。
- `document.getElementsByTagName('a')`:返回文档中所有`<a>`元素。
- `document.getElementsByName('aa')`:返回文档中所有 name 为 aa 的元素。
- `document.getElementsByClassName`: 返回文档中指定 className 的元素。
- `document.anchors`:返回文档中所有带`name`特性的`<a>`元素。
- `document.forms`:返回文档中所有的`<form>`元素。
- `document.images`:返回文档中所有的`<img>`元素。
- `document.links`:返回文档中所有带 href 特性的`<a>`元素
- `document.querySelector($1)`: 返回指定类名(.className)、id(#id)等第一次匹配到的元素。
- `document.querySelectorAll($1)`: 返回指定`类名(.className)`、`id(#id)`等匹配到的全部元素。
- `document.getRootNode()`: 返回 document。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n我们需要注意，`getElementById`、`getElementsByName`、`getElementsByTagName`、`getElementsByClassName`，这几个 API 的性能高于 `querySelector`。\n\n而 `getElementsByName`、`getElementsByTagName`、`getElementsByClassName` 获取的集合并非数组，而是一个能够动态更新的`集合`。\n\n浏览器内部是有高速的索引机制，来动态更新这样的集合的。但是,尽管 `querySelector` 系列的 `API` 非常强大，我们还是应该尽量使用 `getElement` 系列的 API。';

export default () => <Info type="warning" txt={txt} />;
```

## 6. 有哪些取得元素特性的方法?

- `getAttribute()`:如果给定名称的特性不存在，`getAttribute()`返回 `null`。根据 HTML5 规范，自定义特性应该加上 `data-`前缀以便验证。
- `setAttribute(key,value)`:通过这个方法设置的特性名会被统一转换为小写形式。
- `removeAttribute(attr)`:移除元素的某个属性。

## 7.如何动态创建脚本和样式?

```js
// 加载外部脚本
function loadScript(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);
}

// 加载外部脚本代码
function loadScriptString(code) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  try {
    script.appendChild(document.createTextNode(code));
  } catch (ex) {
    script.text = code;
  }
  document.body.appendChild(script);
}
// 加载外部样式表
function loadStyles(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}
// 加载外部样式表代码
function loadStyleString(css) {
  var style = document.createElement('style');
  style.type = 'text/css';
  try {
    style.appendChild(document.createTextNode(css));
  } catch (ex) {
    style.styleSheet.cssText = css;
  }
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
}
```

## 8. DOM API 中如何给指定元素添加、删除、查询样式名

HTML5 新增了一种操作类名的方式，可以让操作更简单也更安全，那就是为所有元素添加`classList`属性。

这个`classList`属性是新集合类型`DOMTokenList` 的实例。与其他 DOM 集合类似，`DOMTokenList` 有一个表示自己包含多少元素的 `length` 属性，而要取得每个元素可以使用`item()`方法，也可以使用方括号语法。此外，这个新类型还定义如下方法。

1. `add(className)` 向元素添加指定类名。

2. `contains(className)` 检测元素是否含有指定类名。

3. `remove(className)` 删除元素中的指定类名。

4. `toggle(className)` 如果元素中存在指定类名则删除，否则添加。

## 9. 元素的 clientWidth 和 offsetWidth 的区别?

```js
offsetWidth = clientWidth + borderWidth;

clientWidth = contentWidth + paddingWidth;
```

## 10. CurrentTarget 与 target 的关系 ?

- `CurrentTarget`: 表示事件处理程序当前正在处理事件的那个元素。
- `target`: 表示触发事件的目标元素。

在事件处理程序内部，对象 `this` 始终等于 `currentTarget` 的值，而 `target` 则只包含事件的实际目标。

如果直接将事件处理程序指定给了目标元素(DOM 0 级)，则 `this`、`currentTarget` 和 `target` 包含相同的值。

```js
var btn = document.getElementById('myBtn');
btn.onclick = function (event) {
  alert(event.currentTarget === this); // true
  alert(event.target === this); // true
};
```

## 11.浏览器如何判断是否支持 webp 格式图片？

1. 宽高判断法。通过创建 image 对象，将其 src 属性设置为 webp 格式的图片，然后在`onload`事件中获取图片的宽高，如果能够获取，则说明浏览器支持 webp 格式图片。如果不能获取或者触发了`onerror`函数，那么就说明浏览器不支持`webp`格式的图片。

2. canvas 判断方法。我们可以动态的创建一个 canvas 对象，通过 canvas 的 toDataURL 将设置为 webp 格式，然后判断 返回值中是否含有 image/webp 字段，如果包含则说明支持 WebP，反之则不支持
