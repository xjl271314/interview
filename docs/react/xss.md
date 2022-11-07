---
title: 防止XSS攻击
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: react
  path: /react/project
---

# React 中如何防止 XSS 攻击?

- 2022.04.01

## XSS 攻击是什么?

`XSS(Cross-site Scripting, 跨站脚本攻击)`，是一种代码注入攻击。

避免与 `CSS` 重名，所以简写成 `XSS` 了。

原理就是通过发布文章、发布评论等方式，将一段恶意的 JS 代码输入进去。然后别人再看这篇文章、评论时，之前注入的这段恶意 JS 代码就执行了。JS 代码一旦执行就跟网页原有的 JS 有同样的权限，可以获取 `cookie` 等。

## XSS 攻击类型

### 反射型 XSS

- XSS 脚本来自当前 HTTP 请求
- 当服务器在 HTTP 请求中接收数据并将该数据拼接在 HTML 中返回时，例子：

```js
// 某网站具有搜索功能，该功能通过 URL 参数接收用户提供的搜索词：
https://xxx.com/search?query=123
// 服务器在对此 URL 的响应中回显提供的搜索词：
<p>您搜索的是: 123</p>
// 如果服务器不对数据进行转义等处理，则攻击者可以构造如下链接进行攻击：
https://xxx.com/search?query=<img src="empty.png" onerror ="alert('xss')">
// 该 URL 将导致以下响应，并运行 alert('xss')：
<p>您搜索的是: <img src="empty.png" onerror ="alert('xss')"></p>
// 如果有用户请求攻击者的 URL ，则攻击者提供的脚本将在用户的浏览器中执行。
```

### 存储型 XSS

- XSS 脚本来自服务器数据库中
- 攻击者将恶意代码提交到目标网站的数据库中，普通用户访问网站时服务器将恶意代码返回，浏览器默认执行，例子：

```js
// 某个评论页，能查看用户评论。
// 攻击者将恶意代码当做评论提交，服务器没对数据进行转义等处理
// 评论输入：
<textarea>
  <img src="empty.png" onerror ="alert('xss')">
</textarea>
// 则攻击者提供的脚本将在所有访问该评论页的用户浏览器执行
```

### DOM 型 XSS

该漏洞存在于客户端代码，与服务器无关。

- 类似反射型，区别在于 DOM 型 XSS 并不会和后台进行交互，前端直接将 URL 中的数据不做处理并动态插入到 HTML 中，是纯粹的前端安全问题，要做防御也只能在客户端上进行防御。

## React 中防止 XSS

无论使用哪种攻击方式，其本质就是将恶意代码注入到应用中，浏览器去默认执行。

React 官方中提到了 `React DOM` 在渲染所有输入内容之前，默认会进行`转义`。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。所有的内容在渲染之前都被转换成了`字符串`，因此恶意代码无法成功注入，从而有效地防止了 `XSS` 攻击。我们具体看下：

```js
for (index = match.index; index < str.length; index++) {
  switch (str.charCodeAt(index)) {
    case 34: // "
      escape = '&quot;';
      break;
    case 38: // &
      escape = '&amp;';
      break;
    case 39: // '
      escape = '&#x27;';
      break;
    case 60: // <
      escape = '&lt;';
      break;
    case 62: // >
      escape = '&gt;';
      break;
    default:
      continue;
  }
}
```

这段代码是 React 在渲染到浏览器前进行的转义，可以看到对浏览器有特殊含义的字符都被转义了，恶意代码在渲染到 HTML 前都被转成了字符串，如下：

```js
// 一段恶意代码
<img src="empty.png" onerror ="alert('xss')">
// 转义后输出到 html 中
&lt;img src=&quot;empty.png&quot; onerror =&quot;alert(&#x27;xss&#x27;)&quot;&gt;
```

这样就有效的防止了 XSS 攻击。
