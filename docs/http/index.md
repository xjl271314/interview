---
title: HTTP、TCP
nav:
  title: http
  path: /http
group:
  title: http相关
  path: /http/project/base
---

# http 相关知识

- 2022.03.17

## 定义

`HTTP(HyperText Transfer Protocal)`超文本传输协议，它通常运行在 TCP 之上，通过浏览器和服务器进行数据交互，进行超文本（文本、图片、视频等）传输的规定。

通过`HTTP`或者`HTTPS`协议请求的资源由`统一资源标识符URL(Uniform Resource Identifiers)`来标识。

## 特点

1. 仅支持(客户端请求服务端)的模式
2. 简单快速、灵活。
3. HTTP 协议是无状态的。为了解决请求的状态认证和交互，引入了`Cookie`、`Session`。
4. HTTP 请求互相独立。
5. HTTP 协议基于 TCP 协议。HTTP 协议目的是规定客户端和服务端数据传输的格式和数据交互行为，并不负责数据传输的细节，底层是基于 TCP 实现的。现在使用的版本(HTTP1.1 之后)是默认持久连接的，也就是多次 HTTP 请求使用一个 TCP 连接。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n`HTTP` 请求和 `TCP` 连接是不一样的，`HTTP` 是在 `TCP` 连接建立的基础上而发起的传输请求，在同一个 `TCP` 连接通道下，可以发送多个 `HTTP` 请求，举个例子的话就是高速公路和车子的关系。';

export default () => <Info type="warning" txt={txt} />;
```

## 发展史

### 时间线

- 1991 年发布了 HTTP 0.9 版
- 1996 年发布 1.0 版
- 1997 年发布了 1.1 版
- 2015 年发布了 2.0 版
- 2018 年发布的 3.0 版，继续优化 HTTP/2，激进地使用 UDP 取代 TCP 协议，目前，HTTP/3 在 2019 年 9 月 26 日 被 Chrome，Firefox，和 Cloudflare 支持。

### HTTP 0.9

十分简单，仅支持`GET`请求，不支持设置请求头。

### HTTP 1.0

扩展了 `HTTP 0.9` 主要增加了几个变化：

1. 在请求中加入了 HTTP 版本号，如：GET /baidu/index.html HTTP/1.0
2. HTTP 开始有 header 了，不管是 request 还是 response 都有 header 了。
3. 增加了 HTTP Status Code 标识相关的状态码。
4. 丰富了 Content-Type 可以传输其它的文件了。
5. 可通过开启 `Connection： keep-alive` 来指定使用 TCP 长连接

#### 缺点

每一次 `HTTP` 请求都会创建一个 `TCP` 连接，而且是串行请求，在请求发送完成，服务器响应以后，这个 TCP 连接就自动断开了。

### HTTP 1.1

`HTTP/1.1` 主要解决了`HTTP 1.0`的网络性能的问题，以及增加了一些新的东西：

- 可以设置 `Connection： keep-alive` 来让 HTTP 重用 TCP 链接，重用 TCP 链接可以省了每次请求都要在广域网上进行的 TCP 的三次握手的巨大开销。这是所谓的“HTTP 长链接” 或是 “请求响应式的 HTTP 持久链接”。
- 支持 `pipeline` 网络传输，只要第一个请求发出去了，不必等其回来，就可以发第二个请求出去，可以减少整体的响应时间。
- 支持 `Chunked Responses` ，也就是说，在 `Response` 的时候，不必说明 `Content-Length` 这样，客户端就不能断连接，直到收到服务端的 EOF 标识。这种技术又叫 “服务端 Push 模型”，或是 “服务端 Push 式的 HTTP 持久链接”。
- 增加了 `cache control` 机制。
- 协议头注增加了 `Language`, `Encoding`, `Type` 等头，让客户端可以跟服务器端进行更多的协商。
- 正式加入了一个很重要的头—— HOST 这样的话，服务器就知道你要请求哪个网站了。因为可以有多个域名解析到同一个 IP 上，要区分用户是请求的哪个域名，就需要在 HTTP 的协议中加入域名的信息，而不是被 DNS 转换过的 IP 信息。
- 正式加入了 OPTIONS 方法，其主要用于 `CORS – Cross Origin Resource Sharing` 应用。

### HTTP 2.0

虽然`HTTP/1.1` 可以重用 TCP 链接，但是请求还是一个一个串行发的，需要保证其顺序。而且大多数请求都是资源类的请求，这些东西占了整个 HTTP 请求中最多的传输数据量。理论上如果能并行请求的话就能够增加性能。

另外，`HTTP1.1` 使用的还是`文本的形式`传输数据，借助耗 CPU 的 zip 压缩的方式减少网络带宽，但是耗了前端和后端的 CPU，数据传输成本较大。

`HTTP 2.0`可以说借鉴了`Google`的实验性`SPDY`协议，主要做了如下的优化:

1. 传输的数据格式由文本改成了`二进制帧`。
2. 所有数据以`帧`的方式进行传输，因此同一个连接中发送的多个请求不再需要按照顺序进行返回处理，可以达到并行的数据传输，移除了`HTTP/1.1`中的串行请求。
3. 压缩头信息进行传输数据量的优化。`HTTP1.x` 的请求头带有大量信息，而且每次都要重复发送，`HTTP2.0` 使用 `encoder` 来减少需要传输的请求头大小，通讯双方各自缓存一份 `header fields` 表，既避免了重复的传输，又减小了传输信息的大小。其中使用的是`HPACK`算法。
4. 新增了 `server push（服务端推送）` 的概念，服务端可以主动发起一些数据推送。比如，服务端在接收到浏览器发来的 HTML 请求的同时，可以主动推送相关的资源文件（js/css）给客户端，并行发送，提高网页的传输和渲染效率。
5. 采用了`信道(多路)复用`，使 TCP 连接支持并发请求，即多个请求可同时在一个连接上并行执行。
6. 需要在`HTTPS`的基础上使用。

#### 二进制分帧

就是将一条连接上所有传输的信息，分割为更小的消息和帧(消息则是由一个或者多个帧组成的)，并对他们采用二进制格式编码。首部信息放在 Headers 帧中，而主体信息被封装在 Data 帧中。而且在每个帧的首部都有一个标识位。

#### 为什么 HTTP 2.0 可以对所有的内容进行二进制转换？

因为二进制分帧层是在`应用层`和`传输层`之间的中间层，所有的信息都会从中经过，进而可以转换。

#### 为什么要用二进制？

首先就是效率会更高，计算机最喜欢处理二进制数了。除此之外就是可以根据帧头部的八个位来定义额外的帧。除了数据帧和头部帧，实际上还有`PING帧`、`SETTING帧`、`优先级帧`等等，为之后的多路复用打上坚实的基础。

另外还可以在一个连接上实现**双向数据流以及乱序发送**。因为在，每一个帧上都有一个标记位。浏览器和服务端双方可以前期乱序接收消息和帧。接收完毕按照标记位的排列来拼接成一整条信息。所以，浏览器并行发送的请求，服务器可以并行返回，而不需要按照顺序返回。

#### 多路复用与长链接有什么区别?

- 多路复用用的是一条 tcp 连接，请求可以并行发送，而无需等待前面的响应返回。
- 长链接是保持 tcp 的连接不中断，可以一直发送 http 请求，但是是串行的模式，一问一答，如果前一个请求的响应没有被接收，那么第二个请求不会发送，就会造成阻塞。

#### 多路复用与 Pipelining 的区别?

- Pipelining 也可以发送并发请求，但是返回响应的顺序则必须是发送时候的顺序。
- 多路复用的话可以进行乱序的发送。

#### 服务端推送可以跨源吗?

不可以，服务端推送还是需要遵循同一个源的前提。

#### 服务端推送有什么弊端?

如果服务端推送的内容，浏览器有缓存的话，就会浪费带宽。

**避免的方法就是在服务端配置，只对第一次请求实现服务器的推送。**

#### HTTP2.0 与 SPDY 的区别？

- HTTP2.0 支持明文 HTTP 传输，而 SPDY 强制使用 HTTPS。
- HTTP2.0 消息头压缩算法采用[HPACK](http://http2.github.io/http2-spec/compression.html),SPDY 采用[DEFLATE](http://zh.wikipedia.org/wiki/DEFLATE)。

#### nginx 下的 HTTP2 升级配置

参考[地址](https://www.nginx.com/blog/nginx-1-9-5/)

### HTTP 3.0

- 使用 UDP 代替 TCP 作为底层协议，解决队头阻塞问题。
- 基于 Google 的 QUIC 协议进行传输控制，解决丢包重传等问题。
- 自定义传输控制 ID
- 自定义的拥塞控制，基于 QUIC 使用 CUBIC、BBR 算法。
- 基于 QUIC 实现前向安全和前向纠错。

HTTP 2.0 主要的问题是：若干个`HTTP`的请求在复用一个 TCP 的连接，底层的 TCP 协议是不知道上层有多少个 HTTP 的请求的。所以，一旦发生丢包，造成的问题就是所有的 HTTP 请求都必需等待这个丢了的包被重传回来，哪怕丢的那个包不是我这个 HTTP 请求的。

这个问题也叫做`HOL Blocking(Head-of-Line Blocking)`，这也是一个比较经典的流量调度的问题。这个问题最早主要发生在交换机上。

![HOL Blocking](https://img-blog.csdnimg.cn/278e9180a73644febc545f36b5307e67.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_13,color_FFFFFF,t_70,g_se,x_16)

图中，左边的是输入队列，其中的 1，2，3，4 表示四个队列，四个队列中的 1，2，3，4 要去的右边的 output 的端口号。

此时，第一个队列和第三个队列都要写右边的第四个端口，然后，一个时刻只能处理一个包，所以，一个队列只能在那等另一个队列写完后。

然后，其此时的 3 号或 1 号端口是空闲的，而队列中的要去 1 和 3 号端号的数据，被第四号端口给 block 住了。这就是所谓的 HOL blocking 问题。

#### HTTP 2.0 下的阻塞

![HOL blocking](https://img-blog.csdnimg.cn/f127fd5e6a75461eb18418ccb1e912b4.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

`http2.0`的`多路复用`正好解决了`http`层的队头阻塞，但是 tcp 的队头阻塞依然存在。因为当数据包超时确认或者丢失，会等待重传，因此会阻塞当前窗口向右滑动，造成阻塞。

**因此 `HTTP 3.0` 抛弃了 `TCP` 采用 `UDP` 作为最底层的协议。**

#### QUIC(Quick UDP Internet Connections)

这是 `Google` 家的一个 UDP 协议标准，HTTP 3.0 主要基于的就是这个标准。

而`QUIC(TCP +TLS +HTTP/2)`是基于 udp 的，创新点在于 QUIC 依靠一个严格的单调递增的 packet 序列，一个数据包里面还会有 `streamID` 和 `streamoffset` 偏移量，即使中途发生丢包或者超时确认，后面的数据包不会等待，等到接收完之后根据 `ID` 和 `offset`即可完成重新拼装，从而避免了这种问题。

#### 自定义传输控制 ID

- tcp 里面的四元组，一条 tcp 的唯一性标识，是由源 IP，源端口，目的 IP,目的端口，四元组标识。源 IP，源端口一般比较稳定，但是目的 IP,目的端口会由于网络元素等原因发生改变，一旦改变，那么此条 tcp 连接就会断开。

- QUIC 基于 UDP 协议，所以一条 UDP 协议不再由四元组标识，而是以客户端随机产生的一个 64 位数字作为 ID 标识。只要 ID 不变，那么这条 UDP 就会存在，维持连接，上层业务逻辑就感受不到变化。

#### 自定义的拥塞控制

tcp 的拥塞控制简单来说就是，拥塞窗口前期会指数增加，直到到达一个阈值，然后就开始线性增加，直到出现超时事件，窗口大小到达最大值 MAX。

之后窗口调整为初始值，开始同样的增长，阈值减小为 MAX/2。

但是超时不一定是因为拥塞，也可能是因为丢包，那怎么办呢？

如果从最初开始增加，那么显然会比较慢，等到发送方连续收到 3 个接收方发出的丢包 ACK，直接让窗口大小等于阈值，再线性增长。这也有一个响亮的名字，`快速恢复算法`。

#### 前向安全和前向纠错

QUIC 中每发送一组数据之后，就对这组数据进行`异或运算`（效率高），并将结果也发送出去，那么接收方就有两份数据版本，可以对初始数据进行纠错和校验。以此保证了可靠性。

## TCP/IP 协议族

`TCP/IP 协议（传输控制协议/互联网协议）`不是简单的一个协议，而是一组特别的协议，包括：`TCP`，`IP`，`UDP`，`ARP`等，这些被称为`子协议`。

在这些协议中，最重要、最著名的就是 `TCP` 和 `IP`。因此我们习惯将整个协议族称为 `TCP/IP`。

### IP

- IP 协议使互联网成为一个允许连接不同类型的计算机和不同操作系统的网络。
- IP 地址是 IP 协议提供的一种统一的地址格式，它为互联网上的每一个网络和每一台主机分配一个逻辑地址，相当于这台机器的暂用名，别的机器可以通过这个名字找到它，进而能互相建立起连接进行通信和交流。

### TCP 协议

- TCP 协议是面向连接的全双工协议，因此不管是客户端还是服务端都能在 TCP 连接通道下向对端接收和发送数据。
- TCP 相比于 UDP 的优势在于它的传输稳定性，在数据传输之前必须经过三次握手建立连接；在数据传输过程中必须保证数据有序完整地传到对端。
- TCP 相比于 UDP 的劣势在于它的复杂度，连接建立、断开都是比较大的性能开销，而且数据传输过程中一旦卡住，则必须等前面的数据发送完毕以后，后续数据才能继续传输。
- 另外每台服务器可提供支持的 TCP 连接数量是有限的，所以这也使得 TCP 连接变成了稀缺资源，经不起浪费。

## TCP 连接机制

在客户端发送正式的 HTTP 请求之前，需要先创建一个 TCP 连接，在创建的 `TCP Connect` 通道下，所有的 HTTP 请求和响应才能正常的发送和接受。

**在不同的 HTTP 协议版本里，这个 TCP 连接通道的创建和持续机制也有所不同。**

- 在 `HTTP1.0` 中，每一次 `HTTP` 请求都会创建一个 `TCP` 连接，在请求发送完成，服务器响应以后，这个 TCP 连接就自动断开了。

- 在 `HTTP1.1` 中，可以通过手动设置 `Connection： keep-alive` 请求头来建立 TCP 的持久连接，多个 `HTTP` 请求可以共用一个 TCP 连接。但是 TCP 连接存在线头阻塞，即若干个请求排队等待发送，一旦有某请求超时等，后续请求只能被阻塞。

- 在 `HTTP2.0` 中，采用了`信道复用`，使 `TCP` 连接支持并发请求，即多个请求可同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其它连接的正常执行吗，这样一来，大部分请求可以使用一个 TCP 连接，而不用创建新的 TCP 连接通道，既节省了三次握手的开销，又节约了服务端维护 TCP 端口的成本。

![TCP复用](https://img-blog.csdnimg.cn/20210428212623157.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

图上可以看到有不同的 `Connection ID`，这就代表着本次请求实际上是开启了一个新的 TCP 连接，如果请求的 `Connection ID` 都是相同的，代表着多个 `HTTP` 请求复用了同一个 `TCP` 连接。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n`Chrome` 浏览器所能够支持的最大并发 TCP 连接数是 6 个，并且在 `HTTP 2.0` 以下的 HTTP 版本中，请求是阻塞的。也就是说，一旦六个连接开满，前面的请求未完成，那么后续请求就会被阻塞，直到前面的请求返回，后续才能继续发送。';

export default () => <Info type="warning" txt={txt} />;
```

## UDP 协议

- UDP 协议是面向无连接的，不需要在传输数据前先建立连接，想发就发想传就传。
- UDP 做的工作只是报文搬运，不负责有序且不丢失地传递到对端，因此容易出现丢包的情况。
- UDP 不仅支持一对一的传输方式，还支持一对多、多对多、多对一的方式，也就是说 UPD 提供了`单播`、`多播`、`广播`的功能。
- UDP 相比于 TCP 的优势在于它的轻量、高效和灵活，在一些对于实时性应用要求较高的场景下需要使用到 UDP，比如直播、视频会议、LOL 等实时对战游戏。
- UDP 相比于 TCP 的劣势在于它的不可靠性和不稳定性。

## HTTP 工作过程

一次 HTTP 操作称为一个事务，其工作整个过程如下：

### 1.地址解析

以客户端浏览器请求这个页面：`localhost.com:8080/index.htm` 为例。

从中分解出`协议名`、`主机名`、`端口`、`对象路径`等部分，对于我们的这个地址，解析得到的结果如下：

```js
协议名：http
主机名：localhost.com
端口：8080
对象路径：/index.htm
```

在这一步，需要`域名系统DNS`解析域名 `localhost.com`，得到主机的 IP 地址。

### 2.封装 HTTP 请求数据包

把以上部分结合本机自己的信息，封装成一个 HTTP 请求数据包。

### 3.封装成 TCP 包，建立 TCP 连接（TCP 的三次握手）

在`HTTP`工作开始之前，浏览器首先要通过网络与服务器建立连接，该连接是通过`TCP`来完成的，与 IP 协议共同构建 Internet，即著名的`TCP/IP协议族`。

HTTP 是比 TCP 更高层次的应用层协议，根据规则，只有低层协议建立之后才能，才能进行高层协议的连接，因此，首先要建立 TCP 连接，一般 TCP 连接的端口号是 80。这里是 8080 端口。

### 4.客户机发送请求命令

一旦端对端成功建立起了 TCP 连接，下一步就要开始发送正式的 HTTP 请求了，请求方式的格式为：`统一资源标识符（URL）`、`协议版本号`，后边是`MIME信息`包括`请求修饰符`、`客户机信息`等内容。

### 5.服务器响应

服务器接到请求后，给予相应的响应信息，其格式为一个状态行，包括信息的协议版本号、一个成功或错误的代码，后边是 MIME 信息包括服务器信息、实体信息和可能的内容。

实体消息是服务器向浏览器发送头信息后，它会发送一个空白行来表示头信息的发送到此为结束，接着，它就以`Content-Type`应答头信息所描述的格式发送用户所请求的实际数据。

### 6.服务器关闭 TCP 连接

一般情况下，一旦 Web 服务器向浏览器发送了请求数据，它就要关闭 TCP 连接，然后如果浏览器或者服务器在其头信息加入了这行代码:

```js
Connection: keep - alive;
```

TCP 连接在发送后将仍然保持打开状态，于是，浏览器可以继续通过相同的连接发送请求。保持连接节省了为每个请求建立新连接所需的时间，还节约了网络带宽。

## TCP 三次握手

![TCP三次握手](https://img-blog.csdnimg.cn/20210412214709527.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

1. 浏览器发送 `SYN` 报文，并将发送序号 `Seq` 置为`X`。
2. 服务器收到后，发送 `SYN + Ack` 报文，并将发送序号 `Seq` 置为 `Y`，并发送确认序号 `Ack` 为 `X + 1`。
3. 浏览器收到后，发送 `Ack` 报文，并将发送序号置为 `Z`，确认序号 `Ack` 置为 `Y + 1`。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n1.`ACK` 用于确认，表示通知对方，我已经收到你发来的信息了。\n2.`FIN` 用于结束，表示告知对方，我这边已经结束，数据全部发送完毕，没有后续输出，请求终止连接。\n3.`SYN` 用于同步和建立连接，表示告知对方，我这边请求同步建立连接。';

export default () => <Info title="关于 ACK、FIN、SYN 状态码的含义" txt={txt} />;
```

1. `第一次握手`：由客户端向服务端发送连接请求 SYN 报文，该报文段中包含自身的数据通讯初始序号，请求发送后，客户端便进入 `SYN-SENT` 状态。

2. `第二次握手`：服务端收到连接请求报文段后，如果同意连接，则会发送一个包含了 `ACK` 和 `SYN` 报文信息的应答，该应答中也会包含自身的数据通讯初始序号（在断开连接的“四次挥手”时，`ACK` 和 `SYN` 这两个报文是作为两次应答，独立开来发送的，因此会有四次挥手），服务端发送完成后便进入 `SYN-RECEIVED` 状态。

3. `第三次握手`：当客户端收到连接同意的应答后，还要向服务端发送一个确认报文。客户端发完这个报文段后便进入 `ESTABLISHED` 状态，服务端收到这个应答后也进入 `ESTABLISHED` 状态，此时连接建立成功。

### 明明两次握手就能确定的连接，为什么需要三次握手？

因为由于很多不可控制的因素，例如网络原因，可能会造成第一次请求隔了很久才到达服务端，这个时候客户端已经等待响应等了很久，之前发起的请求已超时，已经被客户端废弃掉不再继续守着监听了。

然而服务端过了很久，收到了废弃的延迟请求，发起回应的同时又开启了一个新的 TCP 连接端口，在那里呆等客户端。

而服务端能维护的 TCP 连接是有限的，这种闲置的无用链接会造成服务端的资源浪费。

因此在服务端发送了 `SYN` 和 `ACK` 响应后，需要收到客户端接的再次确认，双方连接才能正式建立起来。

**三次握手就是为了规避这种由于网络延迟而导致服务器额外开销的问题。**

## TCP 四次挥手

![TCP四次挥手](https://img-blog.csdnimg.cn/2021041221485659.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

和建立 TCP 连接类似，断开 TCP 连接也同样需要客户端于服务端的双向交流，因为整个断开动作需要双端共发送 4 个数据包才能完成，所以简称为“四次挥手”。

1. `第一次挥手`：客户端认为自己这边的数据已经全部发送完毕了，于是发送一个 `FIN` 用来关闭客户端到服务端的数据传输，发送完成以后，客户端进入 `FIN_WAIT_1` 状态。

2. `第二次挥手`：服务端收到客户端发送回来的 `FIN` 以后，会告诉应用层要释放 `TCP` 链接，并且发送一个 `ACK` 给客户端，表明已经收到客户端的释放请求了，不会再接受客户端发来的数据，自此，服务端进入 `CLOSE_WAIT` 的状态。

3. `第三次挥手`：服务端如果此时还有未发送完的数据可以继续发送，发送完毕后，服务端也会发送一个释放连接的 FIN 请求用来关闭服务端到客户端的数据传送，然后服务端进入 `LAST_ACK` 状态。

4. `第四次挥手`：客户端接收到服务端的 `FIN` 请求后，发送最后一个 `ACK` 给服务端，接着进入 `TIME_WAIT_2` 状态，该状态会持续 `2MSL`（最大段生存期，指报文段在网络中生存的时间，超时会被抛弃） 时间，若该时间段内没有服务端的重发请求的话，客户端就进入 `CLOSED` 状态.服务端在收到应答消息后，也会进入 `CLOSED` 状态，至此完成四次挥手的过程，双方正式断开连接。

### 为什么建立连接有三次握手，而断开连接却有四次？

这是因为在建立连接过程中，服务端在收到客户但建立连接请求的 `SYN` 报文后，会把 `ACK` 和 `SYN` 放在一个报文里发送给客户端。

而关闭连接时，服务端收到客户端的 `FIN` 报文，只是表示客户端不再发送数据了，但是还能接收数据，而且这会儿服务端可能还有数据没有发送完，不能马上发送 `FIN` 报文，只能先发送 `ACK` 报文，先响应客户端，在确认自己这边所有数据发送完毕以后，才会发送 `FIN`。 所以，在断开连接时，服务器的 `ACK` 和 `FIN` 一般都会单独发送，这就导致了断开连接比请求连接多了一次发送操作。

## HTTP 常用请求方法

| 请求方式  | 描述                                                                                                            |
| :-------- | :-------------------------------------------------------------------------------------------------------------- |
| `GET`     | 获取 URL 指定的资源。                                                                                           |
| `POST`    | 一般用于传输实体信息。                                                                                          |
| `PUT`     | 一般用于上传文件。                                                                                              |
| `DELETE`  | 删除文件。                                                                                                      |
| `HEAD`    | 获取报文首部，与 GET 相比，不返回报文主体部分。                                                                 |
| `OPTIONS` | 用于预检请求中，询问请求 URI 资源支持的方法。                                                                   |
| `TRACE`   | 追踪请求的路径。                                                                                                |
| `CONNECT` | 要求在与代理服务器通信时建立隧道，使用隧道进行 TCP 通信。主要使用 SSL 和 TLS 将数据加密后通过网络隧道进行传输。 |

## URL 统一资源定位符

使用`HTTP`协议访问资源是通过`URL（Uniform Resource Locator）统一资源定位符`来实现的，其格式如下：

```js
scheme://host:port/path?query

scheme: 表示协议，如http, https, ftp等；
host: 表示所访问资源所在的主机名：如：www.baidu.com;
port: 表示端口号，默认为80；
path: 表示所访问的资源在目标主机上的储存路径；
query: 表示查询条件；

例如： http://www.baidu.com/search?words=Baidu
```

## HTTP 报文

`HTTP1.0` 的报文有两种类型：`请求` 和 `响应`。其报文格式分别为：

- 请求报文

  - 请求方法 URL HTTP/版本号
  - 请求首部字段(可选)
  - 空行
  - body(只对 POST 请求有效)

    示例：

    ```js

    GET http://m.baidu.com/ HTTP/1.1
    Host m.baidu.com
    Connection Keep-Alive
    ...// 其他header
    key=iOS
    ```

- 响应报文

  - HTTP/版本号 返回码 返回码描述
  - 应答首部字段(可选)
  - 空行
  - body

    示例：

    ```js
    HTTP/1.1 200 OK
    Content-Type text/html;charset=UTF-8
    ...// 其他header

    <html>...
    ```

`HTTP`首部字段由字段名和字段值组成，中间以`:`分隔，如`Content-Type: text/html` 其中，同一个字段名可对应多个字段值。

HTTP 的报文字段分为 5 种：

1. 请求报文字段
2. 应答报文字段
3. 实体首部字段
4. 通用报文字段
5. 其他报文字段

### 1.请求报文字段

- `Accept`：客户端能够处理的媒体类型。如 `text/html` , 表示客户端让服务器返回 `html` 类型的数据，如果没有，返回 text 类型的也可以。媒体类型的格式一般为：`type/subType`, 表示优先请求 `subType` 类型的数据，如果没有，返回 `type` 类型数据也可以。

  常见的媒体类型：

  - 文本文件：text/html, text/plain, text/css, application/xml, application/json;
  - 图片文件：iamge/jpeg, image/gif, image/png;
  - 视频文件：video/mpeg
  - 应用程序使用的二进制文件：application/octet-stream, application/zip

  ```jsx
  /**
   * inline: true
   */
  import React from 'react';
  import { Info } from 'interview';

  const txt =
    '\n`Accept字段`可设置多个字段值，这样服务器依次进行匹配，并返回最先匹配到的媒体类型，当然，也可通过 `q` 参数来设置 媒体类型的权重，权重越高，优先级越高。`q` 的取值为`[0, 1]`, 可取小数点后 `3` 位，默认为 `1.0`。例如： `Accept: text/html, application/xml; q=0.9, */*`';

  export default () => <Info txt={txt} />;
  ```

- `Accept-Charset`: 表示客户端支持的字符集。例如：`Accept-Charset: GB2312, ISO-8859-1;`

- `Accept-Encoding`： 表示客户端支持的内容编码格式。如：`Accept-Encoding：gzip;`

  常用的内容编码：

  - `gzip`: 由文件压缩程序 gzip 生成的编码格式；
  - `compress`: 由 Unix 文件压缩程序 compress 生成的编码格式；
  - `deflate`: 组合使用 zlib 和 deflate 压缩算法生成的编码格式；
  - `identity`：默认的编码格式，不执行压缩。

- `Accept-Language`：表示客户端支持的语言。如：`Accept-Language: zh-cn, en;`

- `Authorization`：表示客户端的认证信息。客户端在访问需要认证时，服务器会返回 `401`，随后客户端将认证信息加在`Authorization`字段中发送到服务器后，如果认证成功，则返回 `200`.

- `Host`: 表示访问资源所在的主机名，即 URL 中的域名部分。如：`m.baidu.com`.

- `If-Match`: `If-Match`的值与所请求资源的`ETag`值（实体标记，与资源相关联。资源变化，实体标记跟着变化）一致时，服务器才处理此请求。

- `If-Modified-Since`: 用于确认客户端拥有的本地资源的时效性。 如果客户端请求的资源在`If-Modified-Since`指定的时间后发生了改变，则服务器处理该请求。如：`If-Modified-Since:Thu 09 Jul 2018 00:00:00`, 表示如果客户端请求的资源在 `2018 年 1 月 9 号 0 点`之后发生了变化，则服务器处理改请求。通过该字段我们可解决以下问题：有一个包含大量数据的接口，且实时性较高，我们在刷新时就可使用该字段，从而避免多余的流量消耗。

- `If-None-Match`: `If-Match`的值与所请求资源的`ETag`值不一致时服务器才处理此请求。

- `If-Range`： `If-Range`的值（ETag 值或时间）与所访问资源的 `ETag` 值或时间相一致时，服务器处理此请求，并返回 `Range` 字段中设置的指定范围的数据。如果不一致，则返回所有内容。`If-Range`其实算是`If-Match`的升级版，因为它的值不匹配时，依然能够返回数据，而`If-Match`不匹配时，请求不会被处理，需要数据时需再次进行请求。

- `If-Unmodified-Since`：与`If-Modified-Since`相反，表示请求的资源在指定的时间之后未发生变化时，才处理请求，否则返回 `412`。

- `Max-Forwards`：表示请求可经过的服务器的最大数目，请求每被转发一次，`Max-Forwards`减 1，当`Max-Forwards`为 0 时，所在的服务器将不再转发，而是直接做出应答。通过此字段可定位通信问题，比如之前支付宝光纤被挖断，就可通过设置 `Max-Forwards` 来定位大概的位置。

- `Proxy-Authorization`：当客户端接收到来自代理服务器的认证质询时，客户端会将认证信息添加到`Proxy-Authorization`来完成认证。与`Authorization`类似，只不过`Authorization`是发生在客户端与服务端之间。

- `Range`：获取部分资源，例如：`Range: bytes=500-1000` 表示获取指定资源的第 500 到 1000 字节之间的内容，如果服务器能够正确处理，则返回 206 作为应答，表示返回了部分数据，如果不能处理这种范围请求，则以 200 作为应答，返回完整的数据。

- `Referer`：告知服务器请求是从哪个页面发起的。例如在百度首页中搜索某个关键字，结果页面的请求头部就会有这个字段，其值为`https://www.baidu.com/`。通过这个字段可统计广告的点击情况。

- `User-Agent`：将发起请求的浏览器和代理名称等信息发送给服务端，例如：`User-Agent: Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36(KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36`

### 2. 应答报文字段

- `Age`：服务端告知客户端，源服务器（而不是缓存服务器）在多久之前创建了响应。单位为秒。

- `ETag`： 实体资源的标识，可用来请求指定的资源。

- `Location`：请求的资源所在的新位置。

- `Proxy-Authenticate`：将代理服务器需要的认证信息发送给客户端。

- `Retry-After`：服务端告知客户端多久之后再重试，一般与 `503` 和 `3xx` 重定向类型的应答一起使用。

- `Server`：告知服务端当前使用的 HTTP 服务器应用程序的相关信息。

- `WWW-Authenticate`：告知客户端适用于所访问资源的认证方案，如`Basic`或`Digest`。401 的响应中肯定带有`WWW-Authenticate`字段。

### 3. 实体首部字段

- `Allow`：通知客户端，服务器所支持的请求方法。但服务器收到不支持的请求方法时，会以 `405（Method Not Allowed）`作为响应。

- `Content-Encoding`：告知客户端，服务器对资源的内容编码。

- `Content-Language`：告知客户端，资源所使用的自然语言。

- `Content-Length`：告知客户端资源的长度。

- `Content-Location`：告知客户端资源所在的位置。

- `Content-Type`：告知客户端资源的媒体类型，取值同请求首部字段中的 `Accept`。

- `Expires`：告知客户端资源的失效日期。可用于对缓存的处理。

- `Last-Modified`：告知客户端资源最后一次修改的时间。

### 4. 通用报文字段

即可在 `HTTP请求` 中使用，也可在 `HTTP应答` 中使用的报文字段。

- `Cache-Control`：控制缓存行为；

- `Connection`：管理持久连接，设置其值为`Keep-Alive`可实现长连接。

- `Date`：创建 HTTP 报文的日期和时间。

- `Transfer-Encoding`：规定了传输报文主题时使用的传输编码，如`Transfer-Encoding: chunked`。

- `Via`：追踪客户端和服务端之间的报文的传输路径，还可避免会环的发生，所以在经过代理时必须添加此字段。

- `Warning`：`Http/1.1`的报文字段，从`Http/1.0`的`AfterRetry`演变而来，用来告知用户一些与缓存相关的警告信息。

### 5. 其他报文字段

这些字段不是 HTTP 协议中定义的，但被广泛应用于 HTTP 请求中。

- `Cookie`：属于请求型报文字段，在请求时添加`Cookie`，以实现 HTTP 的状态记录。

- `Set-Cookie`：属于应答型报文字段。服务器给客户端传递`Cookie`信息时，就是通过此字段实现的。

  - NAME=VALUE：赋予 Cookie 的名称和值；
  - expires=DATE: Cookie 的有效期；
  - path=PATH: 将服务器上的目录作为 Cookie 的使用对象，若不指定，则默认为文档所在的文件目录；
  - domin=域名：作为 Cookies 适用对象的域名，若不指定，则默认为创建 Cookie 的服务器域名；
  - Secure: 仅在 HTTPS 安全通信是才会发送 Cookie；
  - HttpOnly: 使 Cookie 不能被 JS 脚本访问；

  使用示例：

  Set-Cookie:BDSVRBFE=Go; max-age=10; domain=m.baidu.com; path=/

## HTTP 缓存

常见的 HTTP 缓存只能存储 `GET` 响应，对于其他类型的响应则无能为力。缓存的关键主要包括 `request method`和目标 URI。当 Web 请求抵达缓存时，如果本地有"已缓存"的副本，就可以从本地存储设备而不是原始服务器中提取这个文档。

### 缓存的流程

![缓存流程](https://img-blog.csdnimg.cn/20200211145959398.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 缓存的优点

1. 减少了冗余的数据传输，节省了网络费用。

2. 缓解了网络瓶颈的问题，不需要更多的带宽就能够更快的加载页面。

3. 降低了对原始服务器的要求，服务器可以更快的响应，避免过载的出现。

4. 降低了距离延迟，因为从更远的地方加载会更加慢一点。

### 缓存的缺点

1. 缓存中的数据可能和服务器中的数据不一致。

2. 更加消耗内存。

### 浏览器中的缓存

浏览器中的缓存主要分为 `强缓存` 和 `协商缓存`。

1. 浏览器进行资源请求时，会判断 `responese header` 是否命中强缓存，如果命中，直接从本地读取缓存，不会发送请求到服务器。

2. 如果未命中强缓存，会发送请求到服务器，判断`协商缓存`是否命中，如果命中的话，服务器会将请求返回(304),但是不会返回资源，告诉浏览器直接从本地读取缓存。如果不命中，服务器会直接返回资源。

### 缓存访问顺序

对于前端浏览器环境来说，缓存读取位置是由先后顺序的，顺序分别是**由上到下寻找，找到即返回；找不到则继续**。

1. Service Worker
2. Memory Cache
3. Disk Cache
4. 网络请求

#### Service Worker

`Service Worker` 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

- 浏览器优先查找。
- 持久存储。
- 可以更加灵活地控制存储的内容，可以选择缓存哪些文件、定义缓存文件的路由匹配规则等。
- 可以从 `Chrome` 的 `F12` 中，`Application -> Cache Storage` 查看。

#### Memory Cache

- `memory cache` 是内存中的缓存存储。
- 读取速度快。
- 存储空间较小。
- 存储时间短，当浏览器的 tab 页被关闭，内存资源即被释放。
- 如果明确指定了 `Cache-Control` 为 `no-store`，浏览器则不会使用 `memory-cache`。

#### Disk Cache

- Disk Cache 是硬盘中的缓存存储。
- 读取速度慢于 Memory Cache ，快于网络请求。
- 存储空间较大。
- 持久存储。
- Disk Cache 严格依照 HTTP 头信息中的字段来判断资源是否可缓存、是否要认证等。
- 经常听到的强缓存，协商缓存，以及 `Cache-Control` 等，归于此类。

#### 网络请求

如果一个请求的资源文件均未命中上述缓存策略，那么就会发起网络请求。浏览器拿到资源后，会把这个新资源加入缓存。

### Cache-Control

`HTTP/1.1` 定义的 `Cache-Control` 头用来区分对缓存机制的支持情况， 请求头和响应头都支持这个属性。通过它提供的不同的值来定义缓存策略。需要注意的是，数据变化频率很快的场景并不适合开启 `Cache-Control`。

以下是 `Cache-Control` 常用字段的解释:

|       字段       | 说明                                                                                                                                                                                               |
| :--------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      public      | 公共缓存：表示该响应可以被任何中间人（比如中间代理、CDN 等）缓存。                                                                                                                                 |
|     private      | 私有缓存：表示该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中。                                                                                                 |
|     max-age      | （单位/秒）设置缓存的过期时间，过期需要重新请求，否则就读取本地缓存，并不实际发送请求                                                                                                              |
|     s-maxage     | （单位/秒）覆盖 max-age，作用一样，只在代理服务器中生效                                                                                                                                            |
|    max-stale     | （单位/秒）表示即使缓存过期，也使用这个过期缓存                                                                                                                                                    |
|     no-store     | 禁止进行缓存                                                                                                                                                                                       |
|   no-transform   | 不得对资源进行转换或压缩等操作，Content-Encoding、Content-Range、Content-Type 等 HTTP 头不能由代理修改（有时候资源比较大的情况下，代理服务器可能会自行做压缩处理，这个指令就是为了防止这种情况）。 |
|     no-cache     | 强制确认缓存：即每次使用本地缓存之前，需要请求服务器，查看缓存是否失效，若未过期（注：实际就是返回 304），则缓存才使用本地缓存副本。                                                               |
| must-revalidate  | 缓存验证确认：意味着缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用                                                                                                     |
| proxy-revalidate | 与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。                                                                                                                  |

### 强缓存

其实强是强制的意思。当浏览器去请求某个文件的时候，服务端就在`respone header`里面对该文件做了缓存配置。缓存的时间、缓存类型都由服务端控制。

常见的设置是`max-age`、 `public`、 `private` 、`no-cache` 、`no-store`等以及返回头设置`Expires`字段。

![强缓存示例](https://img-blog.csdnimg.cn/20200211142418838.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- max-age 表示缓存的时间是 315360000 秒（10 年）
- public 表示可以被浏览器和代理服务器缓存
- immutable 表示即使用户刷新浏览器也不会去请求服务器
- from memory cache 表示从内存中读取缓存
- from disk cache 表示从磁盘中读取缓存

`Expires`是一个 GMT 时间格式字符串，浏览器第一次请求的时候，服务器会在返回头部加上 `Expires`，下次请求的时候如果在这个时间之前那么命中缓存。

```js
app.get('/', (req, res) => {
  const cssContent = path.join(__dirname, './html/index.html');
  fs.readFile(cssContent, function (err, data) {
    res.setHeader('Expires', new Date(Date().now() + 2592000000).toUTCString());
    res.end(data);
  });
});
```

#### 强缓存总结

1. `cache-control: max-age=xxxx，public`

客户端和代理服务器都可以缓存该资源；

客户端在 xxx 秒的有效期内，如果有请求该资源的需求的话就直接读取缓存，`statu code:200` ，如果用户做了刷新操作，就向服务器发起 http 请求。

2. `cache-control: max-age=xxxx，private`

只让客户端可以缓存该资源；代理服务器不缓存。

客户端在 xxx 秒内直接读取缓存，`statu code:200`。

3. `cache-control: max-age=xxxx，immutable`

客户端在 xxx 秒的有效期内，如果有请求该资源的需求的话就直接读取缓存，`statu code:200`，即使用户做了刷新操作，也不向服务器发起 `http` 请求。

4. `cache-control: no-cache`

跳过设置强缓存，但是不妨碍设置协商缓存；一般如果你做了强缓存，只有在强缓存失效了才走协商缓存的，设置了 no-cache 就不会走强缓存了，每次请求都会询问服务端。

5. `cache-control: no-store`

不缓存，这个会让客户端、服务器都不缓存，也就没有所谓的强缓存、协商缓存了。

### 协商缓存

上面说到的强缓存就是给资源设置个过期时间，客户端每次请求资源时都会看是否过期；只有在过期才会去询问服务器。所以，强缓存就是为了给客户端自给自足用的。

而当某天，客户端请求该资源时发现其过期了，这时就会去请求服务器了，而这时候去请求服务器的这过程就可以设置协商缓存。这时候，协商缓存就是需要客户端和服务器两端进行交互的。

**协议缓存主要是利用`Last-Modified`、`If-Modified-Since`和 `Etag`、`If-None-Match`来实现。**

#### Last-Modified

顾名思义，就是资源的最新一次修改时间。当客户端访问服务端的资源，服务端会将这个 `Last-Modified` 值返回给客户端，客户端收到之后，下次发送请求就会将服务端返回回来的 `Last-Modified` 值装在 `If-Modified-Since` 或者 `If-Unmodified-Since` 里，发送给服务端进行缓存校验。

这样服务器就可以通过读取 `If-Modified-Since （较常用）`或 `If-UnModified-Since` 的值，和本地的 `Last-Modified` 值做对比校验。如果校验发现这两个值是一样的，就代表本次请求的资源文件没有被修改过，那么服务器就会告诉浏览器，资源有效，可以继续使用，否则就需要使用最新的资源。

- `Last-Modified`: 表示为实体头部部分，`response`返回，表示为资源的最后更新时间,精确到秒。
- `If-Modified-Since`: 通过比较两次的时间判断，资源在请求期间是否有修改，假如没有修改，则命中协商缓存，浏览器从缓存中读取资源，如果没有命中，资源有过修改，返回新的`Last-Modified`和服务器资源。

```js
app.get('/', (req, res) => {
  const cssContent = path.join(__dirname, './html/index.html');
  fs.stat(cssContent, (err, start) => {
    if (req.headers['if-modified-since'] === start.mtime.toUTCString()) {
      res.writeHead(304, 'Not Modified');
      res.end();
    } else {
      fs.readFile(cssContent, function (err, data) {
        let lastModified = start.mtime.toUTCString();
        res.setHeader('Last-Modified', lastModified);
        res.writeHead(200, 'OK');
        res.end(data);
      });
    }
  });
});
```

### ETag

有些情况下仅判断最后修改日期来验证资源是否有改动是不够的：

1. 存在周期性重写某些资源，但资源实际包含的内容并无变化；
2. 被修改的信息并不重要，如注释等；
3. Last-Modified 无法精确到毫秒，但有些资源更新频率有时会小于一秒。

这个时候我们就需要请出另一位嘉宾: `ETag`。

`Etag` 的作用本质上和 `Last-Modified` 差别不大。相比于 `Last-Modified` 使用最后修改日期来比较资源是否失效的缓存校验策略，`ETag` 则是通过`数据签名`来做一个更加严格的缓存验证。

所谓`数据签名`，其实就是通过对资源内容进行一个唯一的签名标记，一旦资源内容改变，那么签名必将改变，服务端就以此签名作为暗号，来标记缓存的有效性。典型的做法是针对资源内容进行一个 `hash` 计算，类似于 `webpack`打包线上资源所加的 `hash` 标识，随服务器`response`返回。

和 `Last-Modified` 对应 `If-Modified-Since` 相同，`ETag` 也会对应 `If-Match` 或者 `If-None-Match（If-None-Match 比较常用）`，如果前后的签名相同，则不需要返回新的资源内容。

- `If-None-Match`: 服务器比较请求头中的`If-None-Match`和当前资源中的`etag`是否一致，来判断资源是否修改过，如果没有修改，则命中缓存，浏览器从缓存中读取资源，如果修改过，服务器会返回新的`etag`，并返回资源；

```js
app.get('/home', (req, res) => {
  const cssContent = path.join(__dirname, './html/index.html');
  fs.stat(cssContent, (err, start) => {
    let etag = md5(cssContent);
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, 'Not Modified');
      res.end();
    } else {
      fs.readFile(cssContent, function (err, data) {
        res.setHeader('Etag', etag);
        res.writeHead(200, 'OK');
        res.end(data);
      });
    }
  });
});
```

`Last-Modified` 和 `ETag` 只是给服务端提供了一个控制缓存有效期的手段，并没有任何强制缓存的作用，最终决定是否使用缓存、还是使用新的资源文件，还是需要靠服务端指定对应的 `http code` 来决定。

对于保存在服务器上的文件，都有最后修改日期的属性，当使用 `Last-Modified` 可以利用这个有效的属性进行数据缓存验证；或者在数据库存入一个 `updatetime` 字段来标识具体的修改日期，从而判断缓存是否有效。

#### 协商缓存步骤总结:

1. 请求资源时，把用户本地该资源的 etag 同时带到服务端，服务端和最新资源做对比。
2. 如果资源没更改，返回 304，浏览器读取本地缓存。
3. 如果资源有更改，返回 200，返回最新的资源。

不推荐使用 `Expires` 首部，它指定的是实际的过期日期而不是秒数。

`HTTP`设计者后来认为，由于很多服务器的时钟都不同步，或者不正确，所以最好还是用剩余秒数，而不是绝对时间来表示过期时间。

`ETag`解决了`Last-Modified`使用时可能出现的资源的时间戳变了但内容没变及如果再一秒钟以内资源变化但`Last-Modified`没变的问题，感觉 `ETag` 更加稳妥。

补充：根据浏览器缓存策略，`Expire`和`Cache-Control`用回车、后退、`F5` 刷新会跳过本地缓存，每次都会从服务器中获数据。
