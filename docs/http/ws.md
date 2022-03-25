---
title: WebSocket
nav:
  title: http
  path: /http
group:
  title: http相关
  path: /http/project/base
---

# WebSocket

- 2022.03.22

## 前言

随着 Web 的发展，用户对于 Web 的实时推送要求也越来越高，在 `WebSocket` 出现之前，大多数情况下是通过客户端发起轮询来拿到服务端实时更新的数据，因为 `HTTP1.x` 协议有一个缺陷就是通信只能由客户端发起，服务端没法主动给客户端推送。

这种方式在对实时性要求比较高的场景下，比如即时通讯、即时报价等，显然会十分低效，体验也不好。

为了解决这个问题，便出现了 `WebSocket` 协议，实现了客户端和服务端双向通信的能力。

## 短轮询

短轮询的实现思路就是浏览器端每隔几秒钟向服务器端发送 HTTP 请求，服务端在收到请求后，不论是否有数据更新，都直接进行响应。

在服务端响应完成，就会关闭这个 TCP 连接，代码实现也最简单，就是利用 XHR ， 通过 setInterval 定时向后端发送请求，以获取最新的数据。

```js
setInterval(function () {
  fetch(url).then((res) => {
    // success code
  });
}, 1000);
```

- 优点：实现简单
- 缺点：会造成数据在一小段时间内不同步和大量无效的请求，安全性差、浪费资源。

## 长轮询

客户端发送请求后服务器端不会立即返回数据，服务器端会阻塞请求连接不会立即断开，直到服务器端有数据更新或者是连接超时才返回，客户端才再次发出请求新建连接、如此反复从而获取最新数据。

```js
function async() {
  fetch(url)
    .then((res) => {
      async();
      // success code
    })
    .catch(() => {
      // 超时
      async();
    });
}
```

- 优点：比 Polling 做了优化，有较好的时效性。
- 缺点：保持连接挂起会消耗资源，服务器没有返回有效数据，程序超时。

## 什么是 WebSocket?

WebSocket 协议在 2008 年诞生，2011 年成为国际标准。现在最新版本浏览器都已经支持了。

它是 Web 浏览器和服务器之间的一种全双工通信协议，其中协议由 IETF 定为标准，API 由 W3C 定为标准。

一旦建立连接，之后的全部数据通信都通过这个连接进行。通信过程中，可互相发送 JSON、XML、HTML 或图片等任意格式的数据。

## WS 与 HTTP 协议区别

### 相同点

- 都是基于 TCP 的应用层协议；
- 都使用 Request/Response 模型进行连接的建立；
- 在连接的建立过程中对错误的处理方式相同，在这个阶段 WS 可能返回和 HTTP 相同的返回码；
- 都可以在网络中传输数据。

### 不同点

- WS 使用 HTTP 来建立连接，但是定义了一系列新的 header 域，这些域在 HTTP 中并不会使用；
- WS 的连接不能通过中间人来转发，它必须是一个直接连接；
- WS 连接建立之后，通信双方都可以在任何时刻向另一方发送数据；
- WS 连接建立之后，数据的传输使用帧来传递，不再需要 Request 消息；
- WS 的数据帧有序。

![WS建立过程](https://img-blog.csdnimg.cn/c4ec0e2f950a47268311bb7704811d40.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

![WS建立过程](https://img-blog.csdnimg.cn/03b0a27d644a4c1d8dee43fce7bab17a.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

## 通信示例

- 前端代码示例:

```js
let ws = new WebSocket('ws://localhost:9000');
```

- 请求头示例:

```js
GET /chat HTTP/1.1
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: no-cache
Connection: Upgrade // 表示该连接要升级协议
Cookie: csrfToken=DPb4RhmGQfPCZnYzUCCOOade; JSESSIONID=67376239124B4355F75F1FC87C059F8D;
Host: localhost:9000
Origin: http://localhost:9000
Pragma: no-cache
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
Sec-WebSocket-Key: 5fTJ1LTuh3RKjSJxydyifQ==  // 与响应头 Sec-WebSocket-Accept 相对应
Sec-WebSocket-Version: 13 // 表示 websocket 协议的版本
Upgrade: websocket // 表示要升级到 websocket 协议
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36
```

- 响应头示例:

```js
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Sec-WebSocket-Accept: ZUip34t+bCjhkvxxwhmdEOyx9hE=
Upgrade: websocket
```

![示例](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/20/16e88fa8f23df259~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

status code 是 `101 Switching Protocols` ， 表示该连接已经从 HTTP 协议转换为 WebSocket 通信协议。 转换成功之后，该连接并没有中断，而是建立了一个全双工通信，后续发送和接收消息都会走这个连接通道。

## Sec-WebSocket-Key/Accept

请求头中有个 `Sec-WebSocket-Key` 字段，和相应头中的 `Sec-WebSocket-Accept` 是配套对应的。

### 作用

1. 提供了基本的防护，比如恶意的连接或者无效的连接，避免服务端收到非法的 websocket 连接（比如 http 客户端不小心请求连接 websocket 服务，此时服务端可以直接拒绝连接）。

2. 确保服务端理解 websocket 连接。因为 ws 握手阶段采用的是 http 协议，因此可能 ws 连接是被一个 http 服务器处理并返回的，此时客户端可以通过 Sec-WebSocket-Key 来确保服务端认识 ws 协议。

3. 在浏览器里发起 ajax 请求，设置 header 时，Sec-WebSocket-Key 以及其他相关的 header 是被禁止的。这样可以避免客户端发送 ajax 请求时，意外请求协议升级（websocket upgrade）。

4. 可以防止反向代理（不理解 ws 协议）返回错误的数据。比如反向代理前后收到两次 ws 连接的升级请求，反向代理把第一次请求的返回给 cache 住，然后第二次请求到来时直接把 cache 住的请求给返回（无意义的返回）。

5. Sec-WebSocket-Key 主要目的并不是确保数据的安全性，因为 Sec-WebSocket-Key、Sec-WebSocket-Accept 的转换计算公式是公开的，而且非常简单，最主要的作用是预防一些常见的意外情况（非故意的）。

### 概念

`Sec-WebSocket-Key` 是客户端随机生成的一个 `base64` 编码，服务器会使用这个编码，并根据一个固定的算法：

```js
GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'; //  一个固定的字符串
accept = base64(sha1(key + GUID)); // key 就是 Sec-WebSocket-Key 值，accept 就是 Sec-WebSocket-Accept 值
```

其中 GUID 字符串是 [RFC6455](https://datatracker.ietf.org/doc/html/rfc6455) 官方定义的一个固定字符串，不得修改。

客户端拿到服务端响应的 `Sec-WebSocket-Accept` 后，会拿自己之前生成的 `Sec-WebSocket-Key` 用相同算法算一次，如果匹配，则握手成功。然后判断 HTTP Response 状态码是否为 101（切换协议），如果是，则建立连接，大功告成。

## websocket 断线重连

心跳保活就是客户端定时的给服务端发送消息，证明客户端是在线的， 如果超过一定的时间没有发送则就是离线了。

### 如何判断在线离线？

当客户端第一次发送请求至服务端时会携带唯一标识、以及时间戳，服务端到 db 或者缓存去查询改请求的唯一标识，如果不存在就存入 db 或者缓存中。

第二次客户端定时再次发送请求依旧携带唯一标识、以及时间戳，服务端到 db 或者缓存去查询改请求的唯一标识，如果存在就把上次的时间戳拿取出来，使用当前时间戳减去上次的时间。

得出的毫秒秒数判断是否大于指定的时间，若小于的话就是在线，否则就是离线；

### 如何解决断线问题？

在使用 nginx 做代理转发的场景下有 2 种方案:

1. 修改 nginx 配置信息
2. 使用 websocket 发送心跳包

断线的原因：

1. websocket 超时没有消息自动断开连接，应对措施：

   这时候我们就需要知道服务端设置的超时时长是多少，在小于超时时间内发送心跳包，有 2 种方案:

   1. 一种是客户端主动发送上行心跳包，
   2. 另一种方案是服务端主动发送下行心跳包。

   心跳检测步骤：

   1. 客户端每隔一个时间间隔发生一个探测包给服务器
   2. 客户端发包时启动一个超时定时器
   3. 服务器端接收到检测包，应该回应一个包
   4. 如果客户机收到服务器的应答包，则说明服务器正常，删除超时定时器
   5. 如果客户端的超时定时器超时，依然没有收到应答包，则说明服务器挂了

   ```js
   // 前端解决方案：心跳检测
   var heartCheck = {
     timeout: 30000, // 30秒发一次心跳
     timeoutObj: null,
     serverTimeoutObj: null,
     reset: function () {
       clearTimeout(this.timeoutObj);
       clearTimeout(this.serverTimeoutObj);
       return this;
     },
     start: function () {
       var self = this;
       this.timeoutObj = setTimeout(function () {
         //这里发送一个心跳，后端收到后，返回一个心跳消息，
         //onmessage拿到返回的心跳就说明连接正常
         ws.send('ping');
         console.log('ping!');
         // 如果超过一定时间还没重置，说明后端主动断开了
         self.serverTimeoutObj = setTimeout(function () {
           ws.close(); // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
         }, self.timeout);
       }, this.timeout);
     },
   };
   ```

2. websocket 异常包括服务端出现中断，交互切屏等等客户端异常中断等等

   当若服务端宕机了，客户端怎么做、服务端再次上线时怎么做？

   客户端则需要断开连接，通过 onclose 关闭连接，服务端再次上线时则需要清除之前存的数据，若不清除 则会造成只要请求到服务端的都会被视为离线。

   针对这种异常的中断解决方案就是`处理重连`。

## 升级到 HTTPS

在 `http` 中使用 `websocket` 需要配置对应的端口，在 `https` 中使用略有不同。

1. 如果网站使用 HTTPS，WebSocket 必须要使用 wss 协议；

2. 使用 wss 协议的连接请求必须只能写域名，而非 IP+端口；

3. 建议在 URL 域名后面为 websocket 定义一个路径，本例中是/wss/；

- 前端代码:

  ```js
  const socket = new WebSocket('wss://www.xxx.cn/wss/');
  ```

- Nginx 配置:

  ```nginx
  # 前提是要配置好HTTPS,然后只需要在HTTPS配置的server内加一个location即可

  # websockets
  location /wss/ {
    proxy_pass http://xxx.xx.xx.xx:9999;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
  }
  ```

### 注意事项

1. `location /wss/ {...}`这里要格外注意！

   html 中的 url 是 `wss://www.xxx.cn/wss/`，所以 `Nginx` 配置中一定要是 `/wss/`

2. `proxy_pass`对应的最好是公网 IP 加端口号，我试过 `localhost，127.0.0.1`，域名都会失败

3. `proxy_http_version 1.1` 版本号必须是 `1.1`，这条配置必需。
