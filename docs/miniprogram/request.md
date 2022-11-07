---
title: wx.request
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: 微信小程序
  path: /miniprogram/project
---

# wx.request 相关

- 2022.01.25

## 基础

> wx.request(Object object)

### 参数说明

| 属性             | 类型                        | 默认值 | 必填 | 说明                                                                                              | 最低版本 |
| :--------------- | :-------------------------- | :----: | :--- | :------------------------------------------------------------------------------------------------ | :------: |
| url              | `string`                    |   -    | 是   | 开发者服务器接口地址(需要在小程序后台配置对应合法域名)                                            |    -     |
| data             | `string/object/ArrayBuffer` |   -    | 否   | 请求的参数                                                                                        |
| header           | `Object`                    |   -    | 否   | 设置请求的 header，header 中不能设置 Referer。 `content-type` 默认为 `application/json`           |
| timeout          | `number`                    |   -    | 否   | 超时时间，单位为毫秒                                                                              |  2.10.0  |
| method           | `string`                    |  GET   | 否   | HTTP 请求方法                                                                                     |
| dataType         | `string`                    |  json  | 否   | 返回的数据格式                                                                                    |    -     |
| responseType     | `string`                    |  text  | 否   | 响应的数据类型                                                                                    |  1.7.0   |
| enableHttp2      | boolean                     | false  | 否   | 开启 http2                                                                                        |  2.10.4  |
| enableQuic       | boolean                     | false  | 否   | 开启 quic                                                                                         |  2.10.4  |
| enableCache      | boolean                     | false  | 否   | 开启 cache                                                                                        |  2.10.4  |
| enableHttpDNS    | boolean                     | false  | 否   | 是否开启 HttpDNS 服务。如开启，需要同时填入 httpDNSServiceId 。 HttpDNS 用法详见 移动解析 HttpDNS |  2.19.1  |
| httpDNSServiceId | boolean                     |   -    | 否   | HttpDNS 服务商 Id。 HttpDNS 用法详见 移动解析 HttpDNS                                             |  2.19.1  |
| enableChunked    | boolean                     | false  | 否   | 开启 transfer-encoding chunked。                                                                  |  2.20.2  |
| success          | function                    |   -    | 否   | 接口调用成功的回调函数                                                                            |
| fail             | function                    |   -    | 否   | 接口调用失败的回调函数                                                                            |
| complete         | function                    |   -    | 否   | 接口调用结束的回调函数（调用成功、失败都会执行）                                                  |

目前 `2.10.4` 版本用户占比 `0.15%`。

### method 字段

| 合法值  | 说明              |
| :------ | :---------------- |
| OPTIONS | HTTP 请求 OPTIONS |
| OPTIONS | HTTP 请求 OPTIONS |
| GET     | HTTP 请求 GET     |
| HEAD    | HTTP 请求 HEAD    |
| POST    | HTTP 请求 POST    |
| PUT     | HTTP 请求 PUT     |
| DELETE  | HTTP 请求 DELETE  |
| TRACE   | HTTP 请求 TRACE   |
| CONNECT | HTTP 请求 CONNECT |

### dataType 字段

| 合法值 | 说明                                                                   |
| :----- | :--------------------------------------------------------------------- |
| json   | 返回的数据为 JSON，返回后会对返回的数据进行一次 `JSON.parse(res.data)` |
| 其他   | 不对返回的内容进行 `JSON.parse`                                        |

### responseType 字段

| 合法值      | 说明                     |
| :---------- | :----------------------- |
| text        | 响应的数据为文本         |
| arraybuffer | 响应的数据为 ArrayBuffer |

### object.success 字段

| 属性       | 类型                        | 说明                                         | 最低版本 |
| :--------- | :-------------------------- | :------------------------------------------- | :------: |
| data       | `string/Object/Arraybuffer` | 开发者服务器返回的数据                       |    -     |
| statusCode | `number`                    | 开发者服务器返回的 HTTP 状态码               |    -     |
| header     | `Object`                    | 开发者服务器返回的 HTTP Response Header      |  1.2.0   |
| cookies    | `Array.<string>`            | 开发者服务器返回的 cookies，格式为字符串数组 |  2.10.0  |
| profile    | `Object`                    | 网络请求过程中一些调试信息，查看详细说明     |  2.10.4  |

### 支持情况

- 不支持以 `Promise` 的形式调用，需要开发者自行封装。
- 小程序插件：支持，需要小程序基础库版本不低于 `1.9.6`。
- 微信 Windows 版：支持。
- 微信 Mac 版：支持。

### 示例代码

```js
wx.request({
  url: 'example.php', //仅为示例，并非真实的接口地址
  data: {
    x: '',
    y: '',
  },
  header: {
    'content-type': 'application/json', // 默认值
  },
  success(res) {
    console.log(res.data);
  },
});
```

## 常见问题

### Q:小程序里面的发起网络请求是走的什么协议?

A: `HTTPS`，小程序正式请求仅支持 `HTTPS`，开发模式下可在开发者工具侧选择(不校验合法域名、web-view 业务域名、TLS 版本及 HTTPS 证书)

### Q:小程序中的 wx.request 最多支持多少个并发请求？

A: 早期限制了 5 个，后来修改成了 10 个，超过的部分会丢掉，再后来做了处理，超过不会丢掉，现有采用`2.10.4`基础库版本测试，并发请求 20 个接口的话，基本是 6 个为一组(不一定刚好，有内部自己的策略)，后续请求会跟在前序请求完成后发出。

### Q: 小程序中的请求失败 302 状态码如何处理?

A: 目前官方侧还是没有给出解决方案。
