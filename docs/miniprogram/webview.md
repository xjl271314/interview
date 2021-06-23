---
title: webview
nav:
  title: 微信小程序
  path: /miniprogram
  order: 0
group:
  title: 微信小程序相关试题
  path: /miniprogram/project
---

# 小程序中使用 webview 的技巧？

- 2021.06.22

## webview 和小程序之间如何跳转?

### 小程序跳转 webview

由于 `web-view` 也是小程序的一个组件,一个小程序页面中仅存在一个 `webview`，不同的 `webview` 页面之间是通过 `src` 来进行区分的，如需跳转不同的 `webview` 只需设置不同的 `src` 即可。

因此我们可以通过 `wx.navigateTo`、`wx.redirectTo`，带上 `url` 参数,`query` 参数就像正常 `url` 的参数一样跟着后面，然后在 `web-view` 的页面的 `Page` 实例里面通过 `onLoad` 的方法的参数来获取 `url` 的值，设置给 `web-view` 的 `src` 属性为该值即可。

### webview 跳小程序

在 `web-view`网页中我们可使用 `JSSDK 1.3.2` 提供的接口返回小程序页面,需要在对应的 web 页面中通过 script 引入该脚本。

然后我们可以使用下列跳转方式:

- `wx.miniProgram.navigateTo`
- `wx.miniProgram.navigateBack`
- `wx.miniProgram.switchTab`
- `wx.miniProgram.reLaunch`
- `wx.miniProgram.redirectTo`

其中跳转的参数都和小程序本身的参数一致。

JSSDK 还提供了以下的功能:

- `wx.miniProgram.postMessage`
- `wx.miniProgram.getEnv`

示例代码:

```js
// <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>

// javascript
wx.miniProgram.navigateTo({ url: '/path/to/page' });
wx.miniProgram.postMessage({ data: 'foo' });
wx.miniProgram.postMessage({ data: { foo: 'bar' } });
wx.miniProgram.getEnv(function (res) {
  console.log(res.miniprogram);
});
```

## 如何判断当前是否在小程序环境内?

1. 在 H5 页面内通过`window.__wxjs_environment`变量进行判断,建议在 `WeixinJSBridgeReady` 回调中使用，

```js
// web-view下的页面内
function ready() {
  console.log(window.__wxjs_environment === 'miniprogram'); // true
}
if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
  document.addEventListener('WeixinJSBridgeReady', ready, false);
} else {
  ready();
}
```

2. 使用`JSSDK 1.3.2`提供的`getEnv`接口。

```js
wx.miniProgram.getEnv(function (res) {
  console.log(res.miniprogram); // true
});
```

3. 从微信 7.0.0 开始，可以通过判断 `userAgent` 中包含 `miniProgram` 字样来判断小程序 `web-view` 环境。

```js
const userAgent = window.navigator.userAgent;

if (/miniprogram/i.test(userAgent)) {
  console.log('miniprogram');
}
```

## 使用 webview 的时候有什么注意事项?

1. `webview` 的业务域名需要在小程序管理后台设置。
2. 打开的页面必须为`https`服务。
3. 网页内 `iframe` 的域名也需要配置到域名白名单。
4. 开发者工具上，可以在 `web-view` 组件上通过`右键 - 调试`，打开 `web-view` 组件的调试。
5. 每个页面只能有一个 `web-view`，`web-view` 会自动铺满整个页面，并覆盖其他组件。无法在半屏弹窗中使用`web-view`进行开发，仅支持原生的方式。
6. `web-view` 网页与小程序之间不支持除 `JSSDK` 提供的接口之外的通信。
7. 在 `iOS` 中，若存在`JSSDK`接口调用无响应的情况，可在 `web-view` 的 `src` 后面加个`#wechat_redirect`解决。
8. 避免在链接中带有中文字符，在 `iOS` 中会有打开白屏的问题，建议加一下 `encodeURIComponent`。
9. `web-view`不支持小程序支付能力，如需使用支付相关的功能需要使用公众号相关支付。
10. `webview` 中的 `html` 的 `title` 会自动放到小程序的头部作为标题。
11. `web-view` 组件基础库版本从 `1.6.4` 开始支持，在小程序插件中不能使用。

## H5 和小程序之间如何通信?

### 小程序向 H5 通信

目前仅支持在小程序跳 H5 页面的时候在地址上拼接参数的方式,在 H5 页面通过解析参数进行通信。

### H5 向小程序通信

我们需要在小程序侧注册事件监听函数 `bindmessage`，该方法会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。`e.detail = { data }`，`data` 是多次 `postMessage` 的参数组成的数组。

然后我们需要在 H5 页面中通过 `wx.miniProgram.postMessage({ data: data })`向小程序发送通知。

示例代码(H5 页面在微信小程序中自定义分享):

```js
// H5侧发送消息
function doMiniProgram(callback) {
  try {
    //小程序环境设置分享
    var ua = window.navigator.userAgent.toLowerCase();
    //判断是否是微信环境
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      //微信环境
      wx.miniProgram.getEnv(function (res) {
        if (res.miniprogram) {
          callback();
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function setMiniProgramShare(shareTitle, imageUrl, shareUrl) {
  try {
    doMiniProgram(function () {
      wx.miniProgram.postMessage({
        data: { title: shareTitle, path: shareUrl, imageUrl: imageUrl },
      });
    });
  } catch (ex) {
    console.log(ex);
  }
}

// 小程序侧接收
Page({
  data: { shareData: {} },
  onShareAppMessage(options) {
    return this.shareData;
  },
  message(e) {
    var that = this;
    console.log(e);
    that.shareData = e.detail.data[0];
  },
});
```
