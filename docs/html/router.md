---
title: hash模式和 history模式
nav:
  title: 前端基础
  path: /base
group:
  title: html、浏览器相关试题
  path: /html/project
---

# 前端路由的两种模式 hash 模式和 history 模式有什么区别？

- 2021.06.23

目前`单页应用（SPA）`越来越成为前端主流，单页应用一大特点就是使用前端路由，由前端来直接控制路由跳转逻辑，而不再由后端人员控制，这给了前端更多的自由。

**其中路由需要实现三个功能：**

1. 当浏览器地址变化时，切换页面；
2. 点击浏览器【后退】、【前进】按钮，网页内容跟随变化；
3. 刷新浏览器，网页加载当前路由对应内容；

在单页面 web 网页中, 单纯的浏览器地址改变, 网页不会重载，如单纯的 `hash` 网址改变网页不会变化，因此我们的路由主要是通过`监听事件`，并利用 js 实现动态改变网页内容。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '目前前端路由主要有两种实现方式：`hash 模式`和 `history` 模式。\n\n它们的区别最明显的就是 `hash` 会在浏览器地址后面增加`#号`，而 `history` 可以自定义地址。';

export default () => <Info type="info" txt={txt} />;
```

## hash 模式

`hash 模式`我们应该不陌生，比如在用`超链接`制作锚点跳转的时候，就会发现，`url` 后面跟了`#id`，`hash 值`就是 `url` 中从`#`号开始到结束的部分。

在使用 `hash 模式`的时候还需要注意以下几个点:

1. `hash`也称为`散列值`或者`锚点`，本身是用来做页面跳转定位的。如 `http://localhost/index.html#abc`，这里的`#abc` 就是 `hash`；

2. `Hash 值`是不会随请求发送到服务器端的，所以改变 hash，不会重新加载页面；

3. 监听 `window` 的 `hashchange` 事件，当散列值改变时，可以通过 `location.hash` 来获取和设置 `hash`值；

4. `location.hash` 值的变化会直接反应到浏览器地址栏；

因此我们可以进行如下的设计:

```js
class Router {
  constructor() {
    this.routers = []; // 存放我们的路由配置
  }

  add(route, callback) {
    this.routers.push({
      path: route,
      render: callback,
    });
  }

  listen(callback) {
    window.onhashchange = this.hashChange(callback);
    this.hashChange(callback)(); // 首次进入页面的时候不会触发hashchange，因此单独调用一下
  }

  hashChange(callback) {
    let self = this;
    return function () {
      let hash = location.hash;
      console.log(hash);
      for (let i = 0; i < self.routers.length; i++) {
        let route = self.routers[i];
        if (hash === route.path) {
          callback(route.render());
          return;
        }
      }
    };
  }
}

let router = new Router();

router.add('#index', () => {
  return '<h1>这是首页内容</h1>';
});

router.add('#news', () => {
  return '<h1>这是新闻内容</h1>';
});

router.add('#user', () => {
  return '<h1>这是个人中心内容</h1>';
});

router.listen((renderHtml) => {
  let app = document.getElementById('app');
  app.innerHTML = renderHtml;
});
```

我们实现了一个 `Router` 类，通过 `add` 方法添加路由配置，第一个参数为路由路径，第二个参数为 `render 函数`，返回要插入页面的 `html`；通过 `listen` 方法，监听 `hash` 变化，并将每个路由返回的 `html`，插入到 `app` 中。

这样我们就实现了一个简单的 hash 路由。

## history 模式

`history` 模式基于 `window.history` 对象的方法，它表示当前窗口的浏览历史。当发生改变时，只会改变页面的路径，不会刷新页面。

`History` 对象保存了当前窗口访问过的所有页面网址。通过 `history.length` 可以得出当前窗口一共访问过几个网址。

由于安全原因，浏览器不允许脚本读取这些地址，但是允许在地址之间导航。

浏览器工具栏的`前进`和`后退`按钮，其实就是对 `History` 对象进行操作。

### 属性

History 对象主要有两个属性。

1. `History.length`：当前窗口访问过的网址数量（包括当前网页）

2. `History.state`：History 堆栈最上层的状态值

```js
// 当前窗口访问过多少个网页
history.length; // 1

// History 对象的当前状态
// 通常是 undefined，即未设置
history.state; // undefined
```

### 方法

History 对象主要有以下几个方法:

- History.back()
- History.forward()
- History.go()

这三个方法都是用来控制页面在历史记录间跳转。

### History.back()

> 回退到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效果。

### History.forward()

> 前进到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效果。

### History.go()

> 接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为 0，相当于刷新当前页面。

```js
history.back();
history.forward();
history.go(1); //相当于history.forward()
history.go(-1); //相当于history.back()
history.go(0); // 刷新当前页面
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n注意，移动到以前访问过的页面时，页面通常是从浏览器缓存之中加载，而不是重新要求服务器发送新的网页。';

export default () => <Info type="warning" txt={txt} />;
```

在 HTML5 中，`window.history` 对象得到了扩展，新增的 API 包括：

- history.pushState(data[,title][,url]);

- history.replaceState(data[,title][,url]);

- history.state;

- window.onpopstate;

### history.pushState(data[,title][,url])

> 向历史记录中追加一条记录。`pushState()`方法不会触发页面刷新，只是导致 `History` 对象发生变化，地址栏会有变化。

该方法接受三个参数，依次为：

- `data`：是一个对象，通过 `pushState` 方法可以将该对象内容传递到新页面中。如果不需要这个对象，此处可以填 null。

- `title`：指标题，几乎没有浏览器支持该参数，传一个空字符串比较安全。

- `url`：新的网址，必须与当前页面处在同一个域。不指定的话则为当前的路径，如果设置了一个跨域网址，则会报错。

```js
var data = { foo: 'bar' };
history.pushState(data, '', '2.html');
console.log(history.state); // {foo: "bar"}
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n注意：如果 `pushState` 的 `URL` 参数设置了一个新的锚点值（即 hash），并不会触发 `hashchange` 事件。反过来，如果 `URL` 的锚点值变了，则会在 `History` 对象创建一条浏览记录。\n\n如果 `pushState()` 方法设置了一个`跨域网址`，则会报错。';

export default () => <Info type="warning" txt={txt} />;
```

```js
// 报错
// 当前网址为 http://a.com
history.pushState(null, '', 'https://b.com');
```

### History.replaceState()

> 替换当前页在历史记录中的信息,用法与 `pushState()` 方法一样。

```js
history.pushState({ page: 1 }, '', '?page=1');
// URL 显示为 http://example.com/example.html?page=1

history.pushState({ page: 2 }, '', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({ page: 3 }, '', '?page=3');
// URL 显示为 http://example.com/example.html?page=3

history.back();
// URL 显示为 http://example.com/example.html?page=1

history.back();
// URL 显示为 http://example.com/example.html

history.go(2);
// URL 显示为 http://example.com/example.html?page=3
```

### history.state

> 我们可以通过该属性，得到当前页的 state 信息。

### window.onpopstate 事件

> 每当 history 对象出现变化时，就会触发 popstate 事件。

- 仅仅调用 `pushState()`方法或 `replaceState()`方法 ，并不会触发该事件;

- 只有当用户点击浏览器倒退按钮和前进按钮，或者使用 `JavaScript` 调用 `history.back()`、`history.forward()`、`history.go()`方法时才会触发。

- 另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

- 页面第一次加载的时候，浏览器不会触发 `popstate` 事件。

在使用的时候,监听函数中可传入一个 `event` 对象，`event.state` 即为通过 `pushState()`或 `replaceState()`方法传入的 data 参数

```js
window.addEventListener('popstate', function (e) {
  //e.state 相当于 history.state
  console.log('state: ' + JSON.stringify(e.state));
  console.log(history.state);
});
```

`history` 模式原理可以这样理解，首先我们要改造我们的超链接，给每个超链接增加 `onclick` 方法，阻止默认的超链接跳转，改用 `history.pushState` 或 `history.replaceState` 来更改浏览器中的 `url`，并修改页面内容。由于通过 `history` 的 `api` 调整，并不会向后端发起请求，所以也就达到了前端路由的目的。

如果用户使用浏览器的前进后退按钮，则会触发 `window.onpopstate` 事件，监听页面根据路由地址修改页面内容。

因此我们得到了下述的实现方式:

```js
class Router {
  constructor() {
    this.routers = [];
    this.renderCallback = null;
  }

  add(route, callback) {
    this.routers.push({
      path: route,
      render: callback,
    });
  }

  pushState(path, data = {}) {
    window.history.pushState(data, '', path);
    this.renderHtml(path);
  }

  listen(callback) {
    this.renderCallback = callback;
    this.changeA();
    window.onpopstate = () => this.renderHtml(this.getCurrentPath());
    this.renderHtml(this.getCurrentPath());
  }

  changeA() {
    document.addEventListener('click', (e) => {
      if (e.target.nodeName === 'A') {
        e.preventDefault();
        let path = e.target.getAttribute('href');
        this.pushState(path);
      }
    });
  }

  getCurrentPath() {
    return location.pathname;
  }

  renderHtml(path) {
    for (let i = 0; i < this.routers.length; i++) {
      let route = this.routers[i];
      if (path === route.path) {
        this.renderCallback(route.render());
        return;
      }
    }
  }
}

let router = new Router();

router.add('/index', () => {
  return '<h1>这是首页内容</h1>';
});

router.add('/news', () => {
  return '<h1>这是新闻内容</h1>';
});

router.add('/user', () => {
  return '<h1>这是个人中心内容</h1>';
});

router.listen((renderHtml) => {
  let app = document.getElementById('app');
  app.innerHTML = renderHtml;
});
```

## 两者之间的区别

- `hash` 模式不够优雅，链接上会带#，`history` 模式较优雅。

- `pushState` 设置的新 `URL` 可以是与当前 `URL` 同源的任意 `URL`；而 `hash` 只可修改#后面的部分，故只可设置与当前同文档的 URL。

- `pushState` 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 `hash` 设置的新值必须与原来不一样才会触发记录添加到栈中。

- `pushState` 通过 `stateObject` 可以添加任意类型的数据到记录中；而 hash 只可添加短字符串。

- `pushState` 可额外设置 `title` 属性供后续使用。

- `hash` 兼容 IE8 以上，`history` 兼容 IE10 以上。

- `history` 模式需要后端配合将所有访问都指向 `index.html`，否则用户刷新页面，会导致 `404` 错误。
