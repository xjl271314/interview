---
title: 跨页面通信
nav:
  title: html
  path: /html
group:
  title: html、浏览器相关试题
  path: /html/project
---

# 前端跨页面通信，你知道哪些方法？

- 2021.06.23

在浏览器中，我们可以同时打开多个 `Tab` 页，每个 `Tab` 页可以粗略理解为一个`独立`的运行环境，即使是全局对象也不会在多个 `Tab` 间共享。然而有些时候，我们希望能在这些`独立`的 `Tab `页面之间同步页面的数据、信息或状态。

就像下面的这个例子：我在列表页点击`收藏`后，对应的详情页按钮会自动更新为`已收藏`状态；类似的，在详情页点击`收藏`后，列表页中按钮也会更新。

![示例](https://user-gold-cdn.xitu.io/2019/4/1/169d767c01990c37?imageslim)

这就是我们所说的`前端跨页面通信`。

## 同源页面间的跨页面通信

浏览器的`同源策略`在下述的一些跨页面通信方法中依然存在限制。因此，我们先来看看，在满足同源策略的情况下，都有哪些技术可以用来实现跨页面通信。

### 1. BroadCast Channel

在前端，我们经常会用 `postMessage` 来实现页面间的通信，但这种方式更像是`点对点`的通信。对于一些需要广播（让所有页面知道）的消息，用 postMessage 不是非常自然。Broadcast Channel 就是用来弥补这个缺陷的。

[BroadCast Channel](https://developer.mozilla.org/zh-CN/docs/Web/API/Broadcast_Channel_API) 可以帮我们创建一个用于广播的通信频道。当所有页面都监听同一频道的消息时，其中某一个页面通过它发送的消息就会被其他所有页面收到。它的 API 和用法都非常简单。

通过创建一个 `BroadcastChannel` 对象，一个客户端就加入了某个指定的频道。只需要向 构造函数 传入一个参数：`频道名称`。如果这是首次连接到该广播频道，相应资源会自动被创建。

> new BroadcastChannel(channelName);

例如，我们来创建一个 `test_channel`:

```js
// 连接到广播频道
const bc = new BroadcastChannel('test_channel');
```

要发送消息时非常简单，只需要调用 `BroadcastChannel` 实例上的 `postMessage` 方法即可。该方法的参数可以是`任意对象`。最简单的例子就是发送 `DOMString` 文本消息：

```js
bc.postMessage('this is a message');
```

当消息被发送之后，所有连接到该频道的 `BroadcastChannel` 对象上都会触发 `message` 事件。

```js
bc.onmessage = function (e) {
  const data = e.data;
  const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
  console.log('[BroadcastChannel] receive message:', text);
};
```

当我们不需要进行监听的时候，可以进行监听的取消。

- 一种方式是取消或者修改相应的'message'事件监听。
- 另一种简单的方式就是使用 `Broadcast Channel` 实例为我们提供的 `close` 方法。

```js
bc.close();
```

两者是有区别的：

- 取消`message`监听只是让页面不对广播消息进行响应，`Broadcast Channel` 仍然存在；

- 而调用 `close` 方法这会切断与 `Broadcast Channel` 的连接，浏览器才能够尝试回收该对象，因为此时浏览器才会知道用户已经不需要使用广播频道了。

在关闭后调用 `postMessage` 会出现如下报错:

![postMessage错误](https://img-blog.csdnimg.cn/20210623145301242.png)

如果之后又再需要广播，则可以重新创建一个相同 `name` 的 `Broadcast Channel`。

兼容性如何？

`Broadcast Channel` 是一个非常好用的多页面消息同步 `API`，然而兼容性却不是很乐观。

![Broadcast Channel兼容性](https://img-blog.csdnimg.cn/20210623145827738.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 2. Service Worker

> [Service Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API) 是一个可以长期运行在后台的 Worker，能够实现与页面的双向通信。多页面共享间的 `Service Worker` 可以共享，将 `Service Worker` 作为消息的处理中心（中央站）即可实现广播效果。

`Service Worker` 也是 `PWA` 中的核心技术之一。

首先，我们需要在页面注册 `Service Worker`：

```js
window.addEventListener('load', () => {
  navigator.serviceWorker.register('../util.sw.js').then(function () {
    console.log('Service Worker 注册成功');
  });
});
```

其中`../util.sw.js`是对应的 `Service Worker` 脚本。`Service Worker` 本身并不自动具备`广播通信`的功能，需要我们添加些代码，将其改造成消息中转站：

```js
/* ../util.sw.js Service Worker 逻辑 */
self.addEventListener('message', function (e) {
  console.log('service worker receive message', e.data);
  e.waitUntil(
    self.clients.matchAll().then(function (clients) {
      if (!clients || clients.length === 0) {
        return;
      }
      clients.forEach(function (client) {
        client.postMessage(e.data);
      });
    }),
  );
});
```

我们在 `Service Worker` 中监听了 `message` 事件，获取页面（从 Service Worker 的角度叫 client）发送的信息。

然后通过 `self.clients.matchAll()`获取当前注册了该 `Service Worker` 的所有页面，通过调用每个 `client`（即页面）的 `postMessage` 方法，向页面发送消息。这样就把从一处（某个 Tab 页面）收到的消息通知给了其他页面。

处理完 `Service Worker`，我们需要在页面监听 `Service Worker` 发送来的消息：

```js
/* 页面逻辑 */
navigator.serviceWorker.addEventListener('message', function (e) {
  const data = e.data;
  const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
  console.log('[Service Worker] receive message:', text);
});
```

最后，当需要`同步消息`时，可以调用 `Service Worker` 的 `postMessage` 方法：

```js
/* 页面逻辑 */
navigator.serviceWorker.controller.postMessage(mydata);
```

### 3. LocalStorage

`LocalStorage` 作为前端最常用的本地存储，大家应该已经非常熟悉了；但 `StorageEvent` 这个与它相关的事件有些同学可能会比较陌生。

当 `LocalStorage` 变化时，会触发 `storage` 事件。利用这个特性，我们可以在发送消息时，把消息写入到某个 `LocalStorage` 中；然后在各个页面内，通过监听 `storage` 事件即可收到通知。

```js
window.addEventListener('storage', function (e) {
  if (e.key === 'ctc-msg') {
    const data = JSON.parse(e.newValue);
    const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
    console.log('[Storage I] receive message:', text);
  }
});
```

在各个页面添加如上的代码，即可监听到 `LocalStorage` 的变化。当某个页面需要发送消息时，只需要使用我们熟悉的 `setItem` 方法即可：

```js
mydata.st = +new Date();
window.localStorage.setItem('ctc-msg', JSON.stringify(mydata));
```

注意，这里有一个细节：我们在 `mydata` 上添加了一个取当前毫秒时间戳的`.st` 属性。这是因为，`storage` 事件只有在值真正改变时才会触发。举个例子：

```js
window.localStorage.setItem('test', '123');
window.localStorage.setItem('test', '123');
```

由于第二次的值`123`与第一次的值相同，所以以上的代码只会在第一次 `setItem` 时触发 `storage` 事件。因此我们通过设置 `st` 来保证每次调用时一定会触发 `storage` 事件。

上面我们看到了三种实现跨页面通信的方式，不论是建立广播频道的 `Broadcast Channel`，还是使用 `Service Worker` 的消息中转站，抑或是些 `tricky` 的 `storage` 事件，其都是`广播模式`：一个页面将消息通知给一个`中央站`，再由`中央站`通知给各个页面。

> 在上面的例子中，这个“中央站”可以是一个 `BroadCast Channel` 实例、一个 `Service Worker` 或是 `LocalStorage`。

下面我们会看到另外两种跨页面通信方式，我把它称为`共享存储+轮询模式`。

### 4. Shared Worker

[Shared Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/SharedWorker) 是 `Worker` 家族的另一个成员。普通的 `Worker` 之间是独立运行、数据互不相通；而多个 `Tab` 注册的 `Shared Worker` 则可以实现数据共享。

`Shared Worker` 在实现跨页面通信时的问题在于，它无法主动通知所有页面，因此，我们会使用`轮询`的方式，来拉取最新的数据。思路如下：

让 `Shared Worker` 支持两种消息。

- 一种是 `post`，`Shared Worker` 收到后会将该数据保存下来；

- 另一种是 `get`，`Shared Worker` 收到该消息后会将保存的数据通过 `postMessage` 传给注册它的页面。也就是让页面通过 `get` 来主动获取（同步）最新消息。

具体实现如下：

首先，我们会在页面中启动一个 `Shared Worker`，启动方式非常简单：

```js
// 构造函数的第二个参数是 Shared Worker 名称，也可以留空
const sharedWorker = new SharedWorker('../util.shared.js', 'ctc');
```

然后，在该 `Shared Worker` 中支持 `get` 与 `post` 形式的消息：

```js
/* ../util.shared.js: Shared Worker 代码 */
let data = null;
self.addEventListener('connect', function (e) {
  const port = e.ports[0];
  port.addEventListener('message', function (event) {
    // get 指令则返回存储的消息数据
    if (event.data.get) {
      data && port.postMessage(data);
    }
    // 非 get 指令则存储该消息数据
    else {
      data = event.data;
    }
  });
  port.start();
});
```

之后，页面定时发送 get 指令的消息给 `Shared Worker`，轮询最新的消息数据，并在页面监听返回信息：

```js
// 定时轮询，发送 get 指令的消息
setInterval(function () {
  sharedWorker.port.postMessage({ get: true });
}, 1000);

// 监听 get 消息的返回数据
sharedWorker.port.addEventListener(
  'message',
  (e) => {
    const data = e.data;
    const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
    console.log('[Shared Worker] receive message:', text);
  },
  false,
);
sharedWorker.port.start();
```

最后，当要跨页面通信时，只需给 `Shared Worker postMessage`即可：

```js
sharedWorker.port.postMessage(mydata);
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '注意，如果使用`addEventListener`来添加 `Shared Worker` 的消息监听，需要显式调用`MessagePort.start`方法，即上文中的`sharedWorker.port.start()；`如果使用`onmessage`绑定监听则不需要。';

export default () => <Info type="warning" txt={txt} />;
```

### 5. IndexedDB

除了可以利用 `Shared Worker` 来共享存储数据，还可以使用其他一些“全局性”（支持跨页面）的存储方案。例如 `IndexedDB` 或 `cookie`。

其思路很简单：与 `Shared Worker` 方案类似，消息发送方将消息存至 `IndexedDB` 中；接收方（例如所有页面）则通过`轮询`去获取最新的信息。在这之前，我们先简单封装几个 `IndexedDB` 的工具方法。

- 打开数据库连接：

```js
function openStore() {
  const storeName = 'ctc_test';
  return new Promise(function (resolve, reject) {
    if (!('indexedDB' in window)) {
      return reject("don't support indexedDB");
    }
    const request = indexedDB.open('CTC_DB', 1);
    request.onerror = reject;
    request.onsuccess = (e) => resolve(e.target.result);
    request.onupgradeneeded = function (e) {
      const db = e.srcElement.result;
      if (e.oldVersion === 0 && !db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'tag' });
        store.createIndex(storeName + 'Index', 'tag', { unique: false });
      }
    };
  });
}
```

- 存储数据:

```js
function saveData(db, data) {
  return new Promise(function (resolve, reject) {
    const STORE_NAME = 'ctc_test';
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ tag: 'ctc_data', data });
    request.onsuccess = () => resolve(db);
    request.onerror = reject;
  });
}
```

- 查询/读取数据:

```js
function query(db) {
  const STORE_NAME = 'ctc_test';
  return new Promise(function (resolve, reject) {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const dbRequest = store.get('ctc_data');
      dbRequest.onsuccess = (e) => resolve(e.target.result);
      dbRequest.onerror = reject;
    } catch (err) {
      reject(err);
    }
  });
}
```

剩下的工作就非常简单了。首先打开数据连接，并初始化数据：

```js
openStore().then((db) => saveData(db, null));
```

对于消息读取，可以在连接与初始化后轮询：

```js
openStore()
  .then((db) => saveData(db, null))
  .then(function (db) {
    setInterval(function () {
      query(db).then(function (res) {
        if (!res || !res.data) {
          return;
        }
        const data = res.data;
        const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
        console.log('[Storage I] receive message:', text);
      });
    }, 1000);
  });
```

最后，要发送消息时，只需向 `IndexedDB` 存储数据即可：

```js
openStore()
  .then((db) => saveData(db, null))
  .then(function (db) {
    // …… 省略上面的轮询代码
    // 触发 saveData 的方法可以放在用户操作的事件监听内
    saveData(db, mydata);
  });
```

### 6. webscoket

除此之外我们还可以借住服务端进行 scoket 双通道通信。

要建立连接非常简单:

```js
let myWebSocket = null;

initWebSocket() {
    const that = this;
    const port = 9999;
    const { hostname } = window.location;
    if (myWebSocket) {
      myWebSocket.close();
    }
    const socket = new WebSocket(`ws://${hostname}:${port}`);
    socket.onopen = function() {
      console.log('WebSocket open'); // 成功连接上Websocket
    };
    socket.onmessage = function(e) {
      console.log('message: ' + e.data); // 打印出服务端返回过来的数据
      return that.handleNotice(JSON.parse(e.data));
    };
    // Call onopen directly if socket is already open
    if (socket.readyState === WebSocket.OPEN) socket.onopen();
    myWebSocket = socket;
}
```

然后我们在对应的服务端进行监听，这里示例是 node.js 版本:

```js
// socket.js
var ws = require('nodejs-websocket');
var wsServer = ws.createServer((connection) => {
  wsServer.sendNewOrderInfo = function () {
    connection.sendText(
      JSON.stringify({
        action: 'fetchNotices',
        msg: '您有一笔新的订单，请及时处理',
      }),
    );
  };
  wsServer.sendNewmessageInfo = function () {
    connection.sendText(
      JSON.stringify({ action: 'fetchNotices', msg: '用户催单了，请及时处理' }),
    );
  };
  connection.on('text', function (result) {
    console.log('发送消息', result);
    connection.sendText('recieve text', result);
  });
  connection.on('connect', function (code) {
    console.log('开启连接', code);
    connection.sendText('connect');
  });
  connection.on('close', function (code) {
    console.log('关闭连接', code);
  });
  connection.on('error', function (code) {
    try {
      connection.close();
    } catch (error) {
      console.log('close异常', error);
    }
    console.log('异常关闭', code);
  });
});

module.exports = wsServer;

// app.js
wsServer.listen(9999);
```

## 非同源页面之间的通信

上面我们介绍了几种前端跨页面通信的方法，但它们大都受到`同源策略`的限制。然而有时候，我们有两个不同域名的产品线，也希望它们下面的所有页面之间能无障碍地通信。那该怎么办呢？

### 1. iframe 方案

要实现该功能，可以使用一个用户不可见的 `iframe` 作为`桥`。

由于 `iframe` 与父页面间可以通过指定 `origin` 来忽略同源限制，因此可以在每个页面中嵌入一个 `iframe` （例如：`http://sample.com/bridge.html`），而这些 `iframe` 由于使用的是一个 `url`，因此属于同源页面，其通信方式可以复用上面第一部分提到的各种方式。

页面与 `iframe` 通信非常简单，首先需要在页面中监听 `iframe` 发来的消息，做相应的业务处理：

```js
/* 业务页面代码 */
window.addEventListener('message', function (e) {
  // …… do something
});
```

然后，当页面要与其他的同源或非同源页面通信时，会先给 iframe 发送消息：

```js
/* 业务页面代码 */
window.frames[0].window.postMessage(mydata, '*');
```

其中为了简便此处将 `postMessage` 的第二个参数设为了`*`，你也可以设为 `iframe` 的 `URL`。

`iframe` 收到消息后，会使用某种跨页面消息通信技术在所有 `iframe `间同步消息，例如下面使用的 `Broadcast Channel：`

```js
/* iframe 内代码 */
const bc = new BroadcastChannel('test');
// 收到来自页面的消息后，在 iframe 间进行广播
window.addEventListener('message', function (e) {
  bc.postMessage(e.data);
});
```

其他 iframe 收到通知后，则会将该消息同步给所属的页面：

```js
/* iframe 内代码 */
// 对于收到的（iframe）广播消息，通知给所属的业务页面
bc.onmessage = function (e) {
  window.parent.postMessage(e.data, '*');
};
```

下图就是使用 `iframe` 作为“桥”的非同源页面间通信模式图。

![iframe通信模式图](https://img-blog.csdnimg.cn/20210623161319779.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
