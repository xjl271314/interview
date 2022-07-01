---
title: options请求
nav:
  title: http
  path: /http
group:
  title: http相关
  path: /http/project/base
---

# http 请求中的 options 请求

- 2022.06.23

## 常用的 HTTP 8 大请求

- get：参数在 url 上，请求本来长度没有限制，但是浏览器地址栏长度有限制，不安全
- post：参数 url 上不可见，长度不受限制
- put：上传最新内容到指定位置
- delete：删除请求的 url 所表示的资源
- head：不返回相应主体，主要用于客户端查看服务器性能
- options：与 head 类似，是客户端用于查看服务器的性能 。JavaScript 的 XMLHttpRequest 对象进行 CORS 跨域资源共享时，就是使用 OPTIONS 方法发送嗅探请求，以判断是否有对指定资源的访问权限
- connect：http1.1 预留的，将连接方式改为管道方式，通常用于 SSL 加密服务器的链接与 HTTP 非加密的代理服务器之间的通信
- trace：请求服务器`回显收到的请求信息`主要用于 HTTP 请求的测试或诊断
- patch：出现的较晚，用于更新局部的资源，不存在时，会创建一个新的(http1.1 之后使用的较多的)

## 什么是预请求(options 请求)?

`预请求`就是发起那些`复杂请求(例如put、delete等)`时会先发送一个`OPTIONS方法`进行请求的嗅探，以判断是否有对指定资源的访问权限。

在跨域的请求中，浏览器发出请求后，在控制台可以查询到两次请求，第一次的请求参数是`options`，以检测实际请求是否可以被服务器接受。

## 为什么需要进行预请求?

w3c 规范要求，对`复杂请求`，浏览器必须先使用`options`发起一个预检请求，从而获知服务器是否允许该跨域请求，服务器确认以后才能发起实际的`HTTP`请求，否则停止第二次正式请求。

## 什么时候会触发预请求?

当我们发送一个`跨域的复杂请求`的时候会发送预请求。

### 简单请求

- 请求方法为：`GET` 、`POST` 、 `HEAD`
- 请求头：`Accept`、`Accept-Language`、`Content-Language`、`Content-Type`
  - 其中 `Content-Type` 限定为 ：`text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded`

### 复杂请求

- 请求方法：除简单请求的方法外的方法即：`PUT` 、`DELETE`、`CONNECT`、`OPTIONS`、`TRACE`、`PATCH`
- 请求中的 `Content-Type` 的值不属于下列之一：
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain
- 人为设置了请求头中的其他字段，也就是不属于下列之一：
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type
  - DPR
  - Downlink
  - Save-Data
  - Viewport-Width
  - Width

## 预请求中请求头和响应头中的关键字段

预检请求不会返回具体的响应内容，仅返回响应头。

### 请求头

- Access-Control-Request-Method
- Access-Control-Request-Headers
- Origin
- Referer
- User-Agent

| Request Header                   | 描述                               |
| :------------------------------- | :--------------------------------- |
| `Access-Control-Request-Method`  | 告诉服务器真实请求所用的请求方式   |
| `Access-Control-Request-Headers` | 告诉服务器真实请求所携带的首部字段 |

### 响应头

| Response Header                    | 描述                                                                             |
| :--------------------------------- | :------------------------------------------------------------------------------- |
| `Access-Control-Allow-Methods`     | 返回了服务端允许的请求，包含 GET/HEAD/PUT/PATCH/POST/DELETE                      |
| `Access-Control-Allow-Credentials` | 允许跨域携带 cookie（跨域请求要携带 cookie 必须设置为 true）                     |
| `Access-Control-Allow-Origin`      | 允许跨域请求的域名，这个可以在服务端配置一些信任的域名白名单                     |
| `Access-Control-Request-Headers`   | 客户端请求所携带的自定义首部字段，如果需要预检通过必须返回请求中所提供的所有字段 |

## 如何优化预请求?

当我们不优化预请求的时候每次复杂请求都会去请求 2 次，造成不必要的资源浪费。

针对上述触发预请求的场景可以得到如下的优化解决方案。

1. 对于某些跨域请求采用 `JSONP` 的方式进行请求，从而绕过预请求。

2. 服务端设置对应的 `Access-Control-Max-Age`字段，在第一次请求时进行预检后续请求不进行预检。该字段返回的值是秒数。
