---
title: 浏览器缓存
nav:
  title: 前端基础
  path: /base
group:
  title: html、浏览器相关试题
  path: /html/project
---

# 浏览器缓存策略是什么样的?

- 2021.06.24

> 浏览器的缓存机制也就是我们说的 HTTP 缓存机制，其机制是根据 HTTP 报文的缓存标识进行的。

常见的 `HTTP` 缓存只能存储 `GET` 响应，对于其他类型的响应则无能为力。缓存的关键主要包括 `request method` 和目标 `URI`（一般只有 `GET` 请求才会被缓存）。当 Web 请求抵达缓存时，如果本地有`已缓存`的副本，就可以从本地存储设备而不是原始服务器中提取这个文档。

## 缓存过程分析

浏览器与服务器通信的方式为应答模式，即是：浏览器发起 HTTP 请求 – 服务器响应该请求。那么浏览器第一次向服务器发起该请求后拿到请求结果，会根据响应报文中 HTTP 头的缓存标识，决定是否缓存结果，是则将请求结果和缓存标识存入浏览器缓存中，简单的过程如下图：

![浏览器缓存](https://img-blog.csdnimg.cn/20210624162228248.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

由上图我们可以知道：

- 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识。

- 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中。

现在在让我们来看看浏览器中的缓存。

## 浏览器中的缓存

> 浏览器中的缓存主要分为`强缓存`和`协商缓存`。

1. 浏览器进行资源请求时，会判断 `responese header` 是否命中`强缓存`，如果命中，直接从本地读取缓存，不会发送请求到服务器。

2. 如果未命中`强缓存`，会发送请求到服务器，判断`协商缓存`是否命中，如果命中的话，服务器会将请求返回(304),但是不会返回资源，告诉浏览器直接从本地读取缓存。如果不命中，服务器会直接返回资源。

**对于前端浏览器环境来说，缓存读取位置是由先后顺序的，顺序分别是（由上到下寻找，找到即返回；找不到则继续）。**

1. Service Worker
2. Memory Cache
3. Disk Cache
4. 网络请求

### Service Worker

> `Service Worker` 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

- 浏览器优先查找。
- 持久存储。
- 可以更加灵活地控制存储的内容，可以选择缓存哪些文件、定义缓存文件的路由匹配规则等。
- 可以从 Chrome 的 F12 中，`Application` -> `Cache Storage` 查看。

### Memory Cache

> memory cache 是内存中的缓存存储。

- 读取速度快。
- 存储空间较小。
- 存储时间短，当浏览器的 tab 页被关闭，内存资源即被释放。
- 如果明确指定了 `Cache-Control` 为 `no-store`，浏览器则不会使用 `memory-cache`。

### Disk Cache

> Disk Cache 是硬盘中的缓存存储。

- 读取速度慢于 `Memory Cache` ，快于网络请求。
- 存储空间较大。
- 持久存储。
- `Disk Cache` 严格依照 `HTTP` 头信息中的字段来判断资源是否可缓存、是否要认证等。

经常听到的`强缓存`，`协商缓存`，以及 `Cache-Control` 等，归于此类。

### 网络请求

> 如果一个请求的资源文件均未命中上述缓存策略，那么就会发起网络请求。浏览器拿到资源后，会把这个新资源加入缓存。

## Cache-Control

> `HTTP/1.1` 定义的 `Cache-Control` 头用来区分对缓存机制的支持情况， 请求头和响应头都支持这个属性。通过它提供的不同的值来定义缓存策略。需要注意的是，数据变化频率很快的场景并不适合开启 `Cache-Control`。

以下是 `Cache-Control` 常用字段的解释:

| 字段             | 说明                                                                                                                                                                                                       |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| public           | 公共缓存：表示该响应可以被任何中间人（比如中间代理、CDN 等）缓存。                                                                                                                                         |
| private          | 私有缓存：表示该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中。                                                                                                         |
| max-age          | （单位/秒）设置缓存的过期时间，过期需要重新请求，否则就读取本地缓存，并不实际发送请求                                                                                                                      |
| s-maxage         | （单位/秒）覆盖 `max-age`，作用一样，只在代理服务器中生效                                                                                                                                                  |
| max-stale        | （单位/秒）表示即使缓存过期，也使用这个过期缓存                                                                                                                                                            |
| no-store         | 禁止进行缓存                                                                                                                                                                                               |
| no-transform     | 不得对资源进行转换或压缩等操作，`Content-Encoding`、`Content-Range`、`Content-Type` 等 `HTTP` 头不能由代理修改（有时候资源比较大的情况下，代理服务器可能会自行做压缩处理，这个指令就是为了防止这种情况）。 |
| no-cache         | 强制确认缓存：即每次使用本地缓存之前，需要请求服务器，查看缓存是否失效，若未过期（注：实际就是返回 304），则缓存才使用本地缓存副本。                                                                       |
| must-revalidate  | 缓存验证确认：意味着缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用                                                                                                             |
| proxy-revalidate | 与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。                                                                                                                          |

## 缓存类型

### 强缓存

> 强缓存就是向浏览器缓存查找该请求结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程，强制缓存的情况主要有三种(暂不分析协商缓存过程)，如下：

- 不存在该缓存结果和缓存标识，强制缓存失效，则直接向服务器发起请求（跟第一次发起请求一致）：

![强缓存1](https://img-blog.csdnimg.cn/20210624163835670.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70))

- 存在该缓存结果和缓存标识，但该结果已失效，强制缓存失效，则使用协商缓存：

![强缓存2](https://img-blog.csdnimg.cn/20210624163945266.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- 存在该缓存结果和缓存标识，且该结果尚未失效，强制缓存生效，直接返回该结果：

![强缓存3](https://img-blog.csdnimg.cn/20210624164018708.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

强缓存的具体表现为：`respone header`中的 `cache-control`，常见的设置是 `max-age`、 `public`、 `private` 、`no-cache` 、`no-store` 等以及返回头设置 `Expires` 字段。

![示例](https://img-blog.csdnimg.cn/20200211142418838.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

其中:

- `max-age`: 表示缓存的时间是 315360000 秒（10 年）

- `public`: 表示可以被浏览器和代理服务器缓存

- `immutable`: 表示即使用户刷新浏览器也不会去请求服务器

- `from memory cache`: 表示从内存中读取缓存

- `from disk cache`: 表示从磁盘中读取缓存

#### Expires

> `Expires` 是 `HTTP/1.0` 控制网页缓存的字段，其值为服务器返回该请求结果缓存的到期时间，即再次发起该请求时，如果客户端的时间小于 `Expires` 的值时，直接使用缓存结果。

到了 `HTTP/1.1`，`Expire` 已经被 `Cache-Control` 替代，原因在于 `Expires` 控制缓存的原理是使用客户端的时间与服务端返回的时间做对比，那么如果客户端与服务端的时间因为某些原因（例如时区不同；客户端和服务端有一方的时间不准确）发生误差，那么强制缓存则会直接失效，这样的话强制缓存的存在则毫无意义。

#### 强缓存的总结如下

- `cache-control: max-age=xxxx，public`

  客户端和代理服务器都可以缓存该资源；

  客户端在 xxx 秒的有效期内，如果有请求该资源的需求的话就直接读取缓存,`statu code:200` ，如果用户做了刷新操作，就向服务器发起`http`请求。

- `cache-control: max-age=xxxx，private`

  只让客户端可以缓存该资源；代理服务器不缓存

  客户端在 xxx 秒内直接读取缓存,statu code:200

- `cache-control: max-age=xxxx，immutable`

  客户端在 xxx 秒的有效期内，如果有请求该资源的需求的话就直接读取缓存,`statu code:200`，即使用户做了刷新操作，也不向服务器发起 http 请求。

- `cache-control: no-cache`

  跳过设置强缓存，但是不妨碍设置协商缓存；一般如果你做了强缓存，只有在强缓存失效了才走协商缓存的，设置了`no-cache`就不会走强缓存了，每次请求都会询问服务端。

- `cache-control: no-store`

  不缓存，这个会让客户端、服务器都不缓存，也就没有所谓的强缓存、协商缓存了。

### 协商缓存

> 协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，主要是利用 `Last-Modified`、`If-Modified-Since` 和 `Etag`、`If-None-Match` 来实现。主要有以下两种情况：

- 协商缓存生效，返回 304

![协商缓存生效](https://img-blog.csdnimg.cn/20210624165354403.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- 协商缓存失效，返回 200 和请求结果

![协商缓存失效](https://img-blog.csdnimg.cn/20210624165428496.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### Last-Modified、If-Modified-Since

- `Last-Modified`: 顾名思义，就是服务器响应请求时，返回该资源文件在服务器最后被修改的时间。

- `If-Modified-Since`: `If-Modified-Since` 则是客户端再次发起该请求时，携带上次请求返回的 `Last-Modified` 值，通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。

服务器收到该请求，发现请求头含有 `If-Modified-Since` 字段，则会根据 `If-Modified-Since` 的字段值与该资源在服务器的最后被修改时间做对比，若服务器的资源最后被修改时间大于 `If-Modified-Since` 的字段值，则重新返回资源并返回新的 `Last-Modified`，状态码为 `200`；否则则返回 `304`，代表资源无更新，可继续使用缓存文件。

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

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '<strong style="color:#333">有些情况下仅判断最后修改日期来验证资源是否有改动是不够的：</strong>\n\n1. 存在周期性重写某些资源，但资源实际包含的内容并无变化。\n\n2. 被修改的信息并不重要，如注释等。\n\n3. `Last-Modified`无法精确到毫秒，但有些资源更新频率有时会小于一秒。';

export default () => <Info type="warning" txt={txt} />;
```

在这个时候我们就需要请出另一位嘉宾: `ETag`。

#### ETag、If-None-Match

- `ETag`: Etag 是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)。

其实就是通过对资源内容生成一个唯一的签名标记，一旦资源内容改变，那么签名必将改变，服务端就以此签名作为暗号，来标记缓存的有效性。

典型的做法是针对资源内容进行一个 `hash` 计算，类似于 `webpack` 打包线上资源所加的 `hash` 标识,随服务器 `response` 返回。

- `If-None-Match`: `If-None-Match`是客户端再次发起该请求时，携带上次请求返回的唯一标识 `Etag` 值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。

服务器收到该请求后，发现该请求头中含有 `If-None-Match`，则会根据 `If-None-Match` 的字段值与该资源在服务器的 `Etag` 值做对比，一致则返回 `304`，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为 `200`。

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

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '`Etag / If-None-Match`优先级高于`Last-Modified / If-Modified-Since`，同时存在则只有`Etag / If-None-Match`生效。';

export default () => <Info type="warning" txt={txt} />;
```

#### 协商缓存的总结如下

`Last-Modified` 和 `ETag` 只是给服务端提供了一个控制缓存有效期的手段，并没有任何强制缓存的作用，最终决定是否使用缓存、还是使用新的资源文件，还是需要靠服务端指定对应的 `http code` 来决定。

对于保存在服务器上的文件，都有最后修改日期的属性，当使用 `Last-Modified` 可以利用这个有效的属性进行数据缓存验证；或者在数据库存入一个 `updatetime` 字段来标识具体的修改日期，从而判断缓存是否有效。

**协商缓存步骤总结:**

1. 请求资源时，把用户本地该资源的 `etag` 同时带到服务端，服务端和最新资源做对比。
2. 如果资源没更改，返回 `304`，浏览器读取本地缓存。
3. 如果资源有更改，返回 `200`，返回最新的资源。

不推荐使用 `Expires` 首部，它指定的是实际的过期日期而不是秒数。因为很多服务器的时钟都不同步，或者不正确，所以最好还是用剩余秒数，而不是绝对时间来表示过期时间。

`ETag` 解决了 `Last-Modified` 使用时可能出现的资源的时间戳变了但内容没变及如果再一秒钟以内资源变化但 `Last-Modified` 没变的问题，感觉 `ETag` 更加稳妥。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '补充：根据浏览器缓存策略，`Expire` 和`Cache-Control`用回车、后退、F5 刷新会跳过本地缓存，每次都会从服务器中获数据。';

export default () => <Info type="warning" txt={txt} />;
```

## 浏览器缓存总结

`强缓存`优先于`协商缓存`进行，若`强缓存(Expires 和 Cache-Control)`生效则直接使用缓存，若不生效则进行`协商缓存(Last-Modified / If-Modified-Since 和 Etag / If-None-Match)`。

`协商缓存`由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回 `304`，继续使用缓存，主要过程总结如下：

![缓存总结](https://img-blog.csdnimg.cn/20210624171731113.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
