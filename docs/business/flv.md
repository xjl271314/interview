---
title: 使用flv.js做直播
nav:
  title: business
  path: /business
group:
  title: 直播相关试题
  path: /business/live/project
---

# flv.js 直播

- 2022.03.09

## 简介

`flv.js`是来自 `Bilibli` 的开源项目。它解析 `FLV文件` 并实时转封装为 `fmp4` ，通过 `Media Source Extensions` 喂给浏览器，使浏览器在不借助 `Flash` 的情况下播放 `FLV` 成为可能。

## 优势

- 由于浏览器对原生 Video 标签采用了硬件加速，性能很好，支持高清。
- 同时支持录播和直播
- 不依赖 Flash
- PC 端主流浏览器可以播放

## 限制

- FLV 里所包含的视频编码必须是`H.264`，音频编码必须是`AAC`或`MP3`， `IE11`和`Edge`浏览器不支持`MP3`音频编码，所以`FLV`里采用的编码最好是`H.264+AAC`，这个让音视频服务兼容不是问题。
- 对于录播，依赖 原生`HTML5 Video`标签 和 [Media Source Extensions API](https://w3c.github.io/media-source/)
- 对于直播，依赖录播所需要的播放技术，同时依赖 `HTTP FLV` 或者 `WebSocket` 中的一种协议来传输 FLV。其中`HTTP FLV`需通过`流式IO`去拉取数据，支持流式 IO 的有[fetch](https://fetch.spec.whatwg.org/)或者 [stream](https://streams.spec.whatwg.org/)
- `flv.min.js` 文件大小 164Kb，gzip 后 35.5Kb，flash 播放器 gzip 后差不多也是这么大。
- 目前测试在微信浏览器、手机 Safari 浏览器等移动端无法播放。

## 示例

```jsx
import React from 'react';
import { FlvPlayer } from 'interview';

export default () => {
  return <FlvPlayer />;
};
```
