---
title: 生命周期
nav:
  title: 微信小程序
  path: /miniprogram
  order: 0
group:
  title: 微信小程序相关试题
  path: /miniprogram/project
---

# 说说小程序都有哪些生命周期?

- 2021.06.22

## 应用的生命周期

`App()` 必须在 `app.js` 中调用，必须调用且只能调用一次，`app.js` 中定义了一些应用的生命周期函数:

- `onLaunch(Object object)`: 初始化小程序时触发，全局只触发一次。
- `onShow(Object object)`: 小程序初始化完成或用户从后台切换到前台显示时触发。
- `onHide`: 用户从前台切换到后台隐藏时触发。
- `onError(String error)`: 小程序发生脚本错误，或者 `api` 调用失败时，会触发 `onError` 并带上错误信息。
- `onPageNotFound(Object object)`: 小程序要打开的页面不存在时触发。也可以使用 `wx.onPageNotFound` 绑定监听。
- `onUnhandledRejection(Object object)`: 小程序有未处理的 `Promise` 拒绝时触发。也可以使用 `wx.onUnhandledRejection` 绑定监听。
- `onThemeChange(Object object)`: 系统切换主题时触发。也可以使用 `wx.onThemeChange` 绑定监听。

示例代码:

```js
App({
  onLaunch(options) {
    // Do something initial when launch.
  },
  onShow(options) {
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg);
  },
  onPageNotFound(res) {
    wx.redirectTo({
      url: 'pages/...',
    }); // 如果是 tabbar 页面，请使用 wx.switchTab
  },
  globalData: 'I am global data',
});
```

## 页面生命周期

在微信小程序的 js 文件中定义了如下的生命周期函数:

- `onLoad`：首次进入页面加载时触发，可以在 `onLoad` 的参数中获取打开当前页面路径中的参数。
- `onReady`：监听页面初次渲染完成。
- `onShow`：监听加载完成后、后台切到前台或重新进入页面时触发。
- `onHide`：监听从前台切到后台或进入其他页面触发。
- `onUnload`：监听页面卸载时触发。
- `onPullDownRefresh`：监听页面监听用户下拉动作。
- `onReachBottom`：监听页面上拉触底事件的处理函数。
- `onShareAppMessage`：监听页面用户点击右上角分享。
- `onPageScroll`：监听页面滚动时执行。
- `onResize`：监听页面尺寸变化时执行。
- `onTabItemTap(item)`: 监听点击 tab 时执行。

示例代码:

```js
Page({
    data: {

    },
    onLoad: function (options) {

    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },
    onPageScroll: function () {

    },
    onResize: function () {

    },
    onTabItemTap: function (item) {
        console.log(item.index)
        console.log(item.pagePath)
        console.log(item.text)
    },
```

## 应用与页面生命周期触发顺序

### 首次进入小程序会先触发应用生命周期中 onLaunch 方法和 onShow 方法，其次触发页面生命周期中 onLoad、onShow 和 onReady 方法。

1. `app onLaunch`
2. `app onShow`
3. `page onLoad`
4. `page onShow`
5. `page onReady`

### 前台切换到后台时，先触发页面生命周期中 onHide 方法，再触发应用生命周期的 onHide 方法。

1. `page onHide`
2. `app onHide`

### 后台切换到前台时，先触发应用生命周期中 onShow 方法，再触发页面生命周期的 onShow 方法。

1. `app onShow`
2. `page onShow`

## 完整生命周期交互流程

![完整生命周期交互流程](https://res.wx.qq.com/wxdoc/dist/assets/img/page-lifecycle.2e646c86.png)
