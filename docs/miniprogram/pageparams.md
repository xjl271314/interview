---
title: 页面间数据传递
nav:
  title: 微信小程序
  path: /miniprogram
  order: 0
group:
  title: 微信小程序相关试题
  path: /miniprogram/project
---

# 小程序页面间有哪些传递数据的方法？

- 2021.06.22

## 1. 使用全局变量实现数据传递

> 我们可以在 `app.js` 中定义全局的变量,然后在使用到的页面进行取用。

示例代码:

```js
// app.js
App({
  globalData: {
    name: 'jack',
  },
});

// page.js
const app = getApp();
page({
  onload: function () {
    console.log(app.name); // jack
  },
});
```

当我们去修改 globalData 里面的数据的时候:

```js
// 在page页面
var app = getApp();
app.globalData.userName = 'xxx';

// 在app页面
onLaunch: function () {
    var that = this;
    that.globalData.userName = "xxx";
}
```

### 2. 页面跳转或重定向时，使用 url 带参数传递数据

我们可以在页面跳转的时候在 `url` 上拼接参数,然后在新的页面 `onLoad` 的时候去获取。

示例代码:

```js
// a页面

wx.navigateTo({
    url: 'test?id=1',
})

// test页面
onLoad(option){
    console.log(option.id); // 1
}

```

### 3. 使用组件模板 template 传递参数

当我们书写 template 的时候还可以进行传参。

示例代码:

```xml
<!-- template a 使用 name 属性，作为模板的名字 -->
<template name="personCourseItemTmp">
    <!-- 显示 -->
    <view wx:if="{{mentor_image_uri==null}}">
    <!-- 默认图片地址 -->
        <image class="widget_arrow" src="../../image/img1.jpg" mode="aspectFill"></image>
    </view>
    <view wx:else>
        <image class="widget_arrow" src="{{mentor_image_uri}}" mode="aspectFill"></image>
    </view>

    <view class='info'><span>姓名：</span>{{mentor_name}}</view>
    <view class='info'><span>职位：</span>{{career}}</view>
    <view class='info'><span>公司：</span>{{company_name}}</view>
    <view class='info'><span>地区：</span>{{address}}</view>
    <view class='info'><span>擅长：</span>{{mentor_skills}}</view>
    <navigator>详情</navigator>
    <view class='hr'></view>
</template>

<!-- 引入模块 -->
<import src="../index7/index.wxml" />

<block wx:for="{{message}}" wx:key="id">
  <template  is="personCourseItemTmp" data="{{...item}}"></template>
</block>
```

### 4. 使用缓存传递参数

除了传参的方式我们还可以通过 `storage` 进行数据的存储。

示例代码:

```js
// page a
wx.setStorage({
  key: 'key',
  data: 'value',
});

// page b
wx.getStorage({
  key: 'key',
  success(res) {
    console.log(res.data);
  },
});
```

### 5. 使用数据库传递数据

除了使用缓存我们还可以将数据存入后端的数据库进行访问。
