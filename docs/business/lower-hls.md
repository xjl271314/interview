---
title: 3秒低延时的直播方案
nav:
  title: business
  path: /business
group:
  title: 直播相关试题
  path: /business/live/project
---

# 低延时直播方案

- 2022.03.09

![延时](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/609e8c6461034627b5b221f2147ad73d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

上图中展示了不同直播方案的延迟，可以发现延迟最低的是 `WebRTC`，不过 `WebRTC` 一般不能支持大规模用户同时观看直播。这篇文章将介绍图中的 `Low-Latency HLS` 直播方案，可以看到它是在 3 秒左右延迟的位置。

## HLS

HLS 是苹果公司在 2009 年提出的基于 HTTP 的流媒体传输协议。

在最开始苹果推荐一个 HLS 视频片段时长是 10 秒（现在推荐 6 秒），在倒数第三个视频片段开始播放。

如果按照这个推荐配置，用 HLS 开直播的延迟将在 30 秒往上，也就是上方延迟图中的最高延迟位置。

要想降低延迟，一个非常简单的方法就是直接缩短一个视频片段的时长，比如将一个视频片段缩短成 3 秒，使用这种非常短的视频片段，直播延迟将可以降低到 10 秒左右。

当然 10 秒左右延迟还是挺高的，于是就有人想出了一个社区低延迟方案，它被称为 `LHLS`。再后来苹果推出了官方的低延迟解决方案，它被称为 `LLHLS`。下面将详细介绍这两种方案。

## LHLS

`LHLS` 也被称为 `CL-HLS`，它并不是标准规范，而是社区驱动的 `HLS` 低延迟方案，最早是由 `Periscope` 团队在 2017 年发布一篇博客 [Introducing LHLS Media Streaming](https://medium.com/@periscopecode/introducing-lhls-media-streaming-eb6212948bef) 提出这个概念。

后面由 `hls.js` 与一些流媒体厂商一起合作，规范这一方案 [Low-latency HLS Streaming](https://github.com/video-dev/hlsjs-rfcs/pull/1) 。

### 实现原理

LHLS 是怎么实现低延迟直播的呢？大家可以看下面这张图，其中一个视频片段是 8 秒。

![LHLS](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d605e57ff93f4ef69b2749780a04269a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

在第一段的视频流中，现在一共生成了 3 个视频片段，第 4 个视频片段已生成 3 秒，由于一个视频片段只有完全生成才能被下载。所以我们有下面这几种不同的方法来播放这个播放列表。

1. 最简单的方法当然是从第 1 个分片开始播放，这样延迟是 27 秒(3 \* 8 + 3)。

2. 第二种方案是从最后一个分片(分片 3)开始播放，这样延迟是 11 秒(8 + 3)。

3. 或者我们等待 5 秒，让第 4 个分片生成再播放，这样延迟是 8 秒(3 + 5)。

可以发现上面这 3 个方案延迟都挺高，第三个方案延迟稍微低一点但是起播延迟却太高了。

**`LHLS` 方案是将一个视频片段细分成一个个很小的 `Chunk`，无需等待一整个视频片段生成，每生成一个 `Chunk` 它就会被下载到播放器缓存起来。上图中最后一种方法就是将一个分片分成一个个 1 秒的 `Chunk`，这样我们就得到了 3 秒延迟的直播。**

具体到实际实现中 `LHLS` 是使用 `HTTP/1.1` 的 `Chunked transfer encoding` 功能，播放器会保持与服务器的连接，每当服务器生成一个 `Chunk` 就会直接传递给播放器，直到一个视频片段全部传输完毕才会断开连接。另外 `HTTP` 的这个功能大部分 `CDN` 都支持。

社区方案的一个主要问题是它不好做 `ABR` 自适应码率切换，因为与服务器的连接是长连接，客户端不好估算出当前用户的网络带宽，为了解决这个问题一般会用一个测试文件去测试当前网速。

### 规范详情

社区规范中一共引入两个自定义标签 `EXT-X-PREFETCH` 和 `EXT-X-PREFETCH-DISCONTINUITY`。

`EXT-X-PREFETCH-DISCONTINUITY` 和 `EXT-X-DISCONTINUITY` 功能一样，只不过 `EXT-X-PREFETCH` 上方不能放置 `EXT-X-DISCONTINUITY`，要把它变成 `EXT-X-PREFETCH-DISCONTINUITY`。

该规范完全兼容 HLS 标准规范，对于支持这一规范的播放器可以选择使用它们来低延迟直播，对于不支持播放器会忽略这些标签，变成高延迟直播。

这里是一个普通的 `HLS M3U8`文件例子

```json
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-ALLOW-CACHE:NO
#EXT-X-MEDIA-SEQUENCE:1646785924
#EXT-X-TARGETDURATION:7
#EXTINF:6.001,
1507301814LvMVk8-1646785924.ts
#EXTINF:6.05,
1507301814LvMVk8-1646785925.ts
#EXTINF:6.05,
1507301814LvMVk8-1646785926.ts
#EXTINF:6.001,
1507301814LvMVk8-1646785927.ts
#EXTINF:6.001,
1507301814LvMVk8-1646785928.ts
```

下面是一个 `LHLS M3U8` 文件例子。

```json
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:2
#EXT-X-PROGRAM-DATE-TIME:2018-09-05T20:59:08.531Z
#EXTINF:2.000
https://foo.com/bar/1.ts
#EXT-X-PROGRAM-DATE-TIME:2018-09-05T21:59:10.531Z
#EXTINF:2.000
https://foo.com/bar/5.ts

#EXT-X-PREFETCH:https://foo.com/bar/6.ts
#EXT-X-PREFETCH:https://foo.com/bar/7.ts
```

我们可以发现除了最后两行，这和普通 `M3U8` 文件没有任何区别。一个 `LHLS M3U8` 最少包含**一个并且不超过两个** `EXT-X-PREFETCH` 标签。`EXT-X-PREFETCH` 标签后面跟随着一个 `URL`，它是还没有生成的分片。

支持 `LHLS` 的播放器会直接发送两个 `HTTP` 请求，去请求 `6.ts` 和 `7.ts`，服务器会维持这两个请求，并不断发送 `Chunk`。

如果 `6.ts` 连接还没断开，但是 `7.ts` 连接收到数据了怎么办？这时候播放器就要内部保持这些数据，直到前一个请求完成。

### Twitch 的直播延迟

那么谁在使用 LHLS 低延迟方案呢？上面提到的最早提出这个方案的 `Periscope` 团队，它们后面被 `Twitter` 收购，再然后就被关停了。

不过国外非常出名的直播平台 `Twitch` 正在使用该方案。它并没有按照社区规范来实现，而是加入了一些自定义的东西，比如它把 `EXT-X-PREFETCH` 换成了 `EXT-X-TWITCH-PREFETCH`，而且 `EXT-X-DISCONTINUITY` 可以直接应用在 `EXT-X-TWITCH-PREFETCH` 上。

## LL-HLS

`LL-HLS` 是苹果官方版的低延迟方案，它也被称为 `ALHLS`。在 2019 年 WWDC 上苹果介绍了他们官方的 `HLS` 低延迟解决方案，苹果发布的低延迟方案并没有借鉴社区低延迟方案的成果，而是重新设计了一套低延迟方案。苹果的目标是 1 到 2 秒低延迟，支持大规模用户的直播，并且可以完全向下兼容。

看了苹果的方案后，大家情绪都不稳定了，因为苹果的方案中提到需要 `HTTP2` 的 `push` 功能，但是这个功能大部分的 CDN 都没有实现，并且这个功能和传统方案有很大的差别，实现起来也非常头疼。到最后苹果终于决定将 `HTTP2 push` 功能移出了规范，加入 `EXT-X-PRELOAD-HINT` 标签代替该功能。

`LLHLS` 方案相比 `LHLS` 复杂度大大的提高，`LLHLS` 中一共加入了 5 大修改，分别是:

1. Partial Segment
2. 请求长连接
3. 增量更新
4. 预加载
5. 快速码率切换

另外由于苹果推出了官方 HLS 低延规规范，于是社区立马抛弃了社区规范，`hls.js` 也删除了相关代码，去实现 `LLHLS` 规范。

### Partial Media Segment

LLHLS 将一个视频片段再细分称为小分段，一个视频片段由多个小分段组成。原先需要等待一个视频片段完全被生成才能下载，比如一个片段是 6 秒种，客户端就需要等待 6 秒这个分片被生成才能下载它。

现在服务端将一个片段分成多个小分段，比如一个小分段是 200 毫秒，那么一个视频片段包含 30 个小分段，客户端只需等待 200 毫秒就可以一个个下载这些小分段。

![LLHLS](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47286ed6f92046fbb2c4735b8e79e1c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

可以发现这种方式和社区方案非常相似，社区方案是将一个视频分段分成一个个小 Chunk，通过 `HTTP/1.1` 的 `Chunked transfer encoding` 功能下载到客户端。而 `LLHLS` 是将一个视频片段分成一个个小分段，通过普通 `HTTP` 请求去下载这些小分段。

与小分段相关的标签有 `EXT-X-PART-INF` 和 `EXT-X-PART` 两个标签。

- EXT-X-PART-INF

  `EXT-X-PART-INF` 提供了播放列表中小分段的信息，如果播放列表中存在 `EXT-X-PART` 标签，那么必须提供这个标签。

  这个标签只有一个必传属性 `PART-TARGET`，它的值是浮点数，单位是秒。和 `EXT-X-TARGETDURATION` 标签类型，这个属性表示的是小分段的目标时长。

- EXT-X-PART

  `EXT-X-PART` 标签与 `EXTINF` 相似，它是用来声明一个小分段，它一共有 5 个属性。

  - URI 小分段的资源链接。
  - DURATION 小分段时长。
  - INDEPENDENT 如果小分段中包含关键帧，可以将这个字段设置为 YES。
  - BYTERANGE 如果要使用 HTTP Range 请求，可以使用该属性，它的值与 EXT-X-BYTERANGE 标签一样。
  - GAP 如果这个小分段不可使用，可以将这个属性设置为 YES。

  **需要注意，如果该标签包含了 `GAP=YES` 属性，那么客户端就不应该去请求这个资源，客户端需要自己解决如何跳过这个 gap，苹果播放器的做法是延长上一帧的播放时长。**

  下面是一个完整 LLHLS 播放列表的例子。

  ```json
  #EXTM3U
  #EXT-X-TARGETDURATION:4
  #EXT-X-VERSION:6
  #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=1.0,CAN-SKIP-UNTIL=12.0
  #EXT-X-PART-INF:PART-TARGET=0.33334
  #EXT-X-MEDIA-SEQUENCE:266
  #EXT-X-PROGRAM-DATE-TIME:2019-02-14T02:13:36.106Z
  #EXT-X-MAP:URI="init.mp4"
  #EXTINF:4.00008,
  fileSequence266.mp4
  #EXTINF:4.00008,
  fileSequence267.mp4
  #EXTINF:4.00008,
  fileSequence268.mp4
  #EXTINF:4.00008,
  fileSequence269.mp4
  #EXTINF:4.00008,
  fileSequence270.mp4
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.0.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.1.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.2.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.3.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.4.mp4",INDEPENDENT=YES
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.5.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.6.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.7.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.8.mp4",INDEPENDENT=YES
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.9.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.10.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart271.11.mp4"
  #EXTINF:4.00008,
  fileSequence271.mp4
  #EXT-X-PROGRAM-DATE-TIME:2019-02-14T02:14:00.106Z
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.a.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.b.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.c.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.d.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.e.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.f.mp4",INDEPENDENT=YES
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.g.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.h.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.i.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.j.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.k.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart272.l.mp4"
  #EXTINF:4.00008,
  fileSequence272.mp4
  #EXT-X-PART:DURATION=0.33334,URI="filePart273.0.mp4",INDEPENDENT=YES
  #EXT-X-PART:DURATION=0.33334,URI="filePart273.1.mp4"
  #EXT-X-PART:DURATION=0.33334,URI="filePart273.2.mp4"
  #EXT-X-PRELOAD-HINT:TYPE=PART,URI="filePart273.3.mp4"

  #EXT-X-RENDITION-REPORT:URI="../1M/waitForMSN.php",LAST-MSN=273,LAST-PART=2
  #EXT-X-RENDITION-REPORT:URI="../4M/waitForMSN.php",LAST-MSN=273,LAST-PART=1
  ```

  可以发现 `LLHLS` 播放列表中有非常多的 `Part` 小分段，为了防止生成太多的小分段，服务端将会定期清理老的小分段。

### 条件请求

之前请求 `HLS` 播放列表都是客户端发起一个普通的 `HTTP GET` 请求，然后服务器返回一个 `m3u8` 文件。

现在 `LLHLS` 允许在请求播放列表时添加查询条件。服务器是否支持这些功能，是通过 `EXT-X-SERVER-CONTROL` 标签设置，该标签后面跟着一个属性列表，来指明服务器支持哪些条件查询。

目前 LLHLS 一共支持了 3 个查询参数，分别是 `_HLS_msn` 、 `_HLS_part` 和 `_HLS_skip`。通过它们可以实现不同的功能，具体参数含义将在下方详细介绍。

### 请求长连接

在 HLS 直播中，我们需要频繁的去请求播放列表文件去查看是否有新的视频片段被添加，这样非常的浪费时间和资源。在 LLHLS 中服务器可以保持这个连接不断开，直到客户端需要的片段被生成才完成请求。

![请求长连接](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/125079d9b5074e30beb3f283f6dd391d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

服务器支持这一功能，需要 `EXT-X-SERVER-CONTROL` 标签中的 `CAN-BLOCK-RELOAD` 属性为 `YES`。

```json
#EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES
```

要告诉服务器何时才完成请求，需要用到 `_HLS_msn` 和 `_HLS_part` 两个查询条件。如果只需要服务器在生成下一个视频片段时才完成请求可以发送下面这个请求。

```json
https://llhls.com/playlist.m3u8?_HLS_msn={下一个片段的 Media Sequence Number}
```

`_HLS_msn` 用来控制服务器播放列表包含了指定片段或指定片段之后的片段才返回请求，`_HLS_part` 控制服务器播放列表包含了指定片段的哪个小分段才返回请求，小分段的下标是从 0 开始，比如一个视频片段是 6 秒，一个小分段是 1 秒，那么这个视频片段一共由下标 0 到 5 的小分段组成。

```json
https://llhls.com/playlist.m3u8?_HLS_msn={下一个片段的 Media Sequence Number}&_HLS_part={小分段下标}
```

需要注意 `_HLS_msn` 可以单独使用， `_HLS_part` 必须和 `_HLS_msn` 一起使用，否则服务器将会返回 400 错误。当 `_HLS_msn` 超过最新生成片段太多服务器也会返回 400 错误。

如果播放列表包含 `EXT-X-ENDLIST`，服务器将会忽略 `_HLS_part` 和 `_HLS_msn` 两个参数。

### 播放列表增量更新

在 HLS 直播中，我们每次刷新播放列表都会包含一些我们已经知道的老片段信息。比如第一次请求返回 0、1 和 2 这三个片段信息，第二次刷新返回 1、2 和 3 这新的片段信息，可以发现 1 和 2 我们是知道的，其实无需再包含在播放列表中。

LLHLS 提供了播放列表增量更新功能，我们可以告诉服务器可以跳过哪些片段，不用将它包含在播放列表中，从而减少传输损耗。

要支持增量更新功能，需要 `EXT-X-SERVER-CONTROL` 标签中包含 `CAN-SKIP-UNTIL` 属性。还可以包含必须与 `CAN-SKIP-UNTIL` 一起使用的 `CAN-SKIP-DATERANGES` 属性，它表示是否可以跳过老的 `EXT-X-DATERANGE` 标签。

```json
#EXT-X-SERVER-CONTROL:CAN-SKIP-UNTIL=12.0,CAN-SKIP-DATERANGES=YES
```

`CAN-SKIP-UNTIL` 属性的值是十进制浮点数，单位是秒，这个值至少是目标时长的 6 倍。它表示跳过分段的边界。

要发起一个播放列表增量更新请求，需要包含 `_HLS_skip` 查询参数。

```json
https://llhls.com/playlist.m3u8?_HLS_skip={YES或v2}
```

`_HLS_skip` 的值是 `YES` 或 `v2`。`YES` 表示跳过老的片段。`v2` 表示跳过老的片段和老的 `EXT-X-DATERANGE` 标签（需要服务器返回 `CAN-SKIP-DATERANGES=YES`）。

**需要注意当客户端没有一个完整的播放列表或当前播放列表太久没更新超过一半的可跳过边界时应该使用全量查询而不是增量查询。**

当一个播放列表是增量更新时，播放列表中会包含一个 `EXT-X-SKIP` 标签，这个标签只有两个属性， `SKIPPED-SEGMENTS` 表示跳过视频片段数量和 `RECENTLY-REMOVED-DATERANGES` 表示跳过了哪些 `DATERANGE id`。

下面是一个增量更新的播放列表例子。

```json
#EXTM3U
#EXT-X-TARGETDURATION:4
#EXT-X-VERSION:9
#EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES,PART-HOLD-BACK=1.0,CAN-SKIP-UNTIL=12.0
#EXT-X-PART-INF:PART-TARGET=0.33334
#EXT-X-MEDIA-SEQUENCE:266
#EXT-X-SKIP:SKIPPED-SEGMENTS=3
#EXTINF:4.00008,
fileSequence269.mp4
#EXTINF:4.00008,
fileSequence270.mp4
#EXTINF:4.00008,
fileSequence271.mp4
#EXTINF:4.00008,
fileSequence272.mp4
#EXT-X-PART:DURATION=0.33334,URI="filePart273.0.mp4",INDEPENDENT=YES
#EXT-X-PART:DURATION=0.33334,URI="filePart273.1.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart273.2.mp4"
#EXT-X-PART:DURATION=0.33334,URI="filePart273.3.mp4"
#EXT-X-PRELOAD-HINT:TYPE=PART,URI="filePart273.4.mp4"

#EXT-X-RENDITION-REPORT:URI="../1M/waitForMSN.php",LAST-MSN=273,LAST-PART=3
#EXT-X-RENDITION-REPORT:URI="../4M/waitForMSN.php",LAST-MSN=273,LAST-PART=3
```

可以发现上面这个例子中跳过了 3 个视频片段，跳过的视频片段的 msn 分别是 266、267 和 268。

### 片段预加载

LLHLS 中还有视频片段预加载功能，它表示一个视频片段还没被创建，但是客户端去请求它。这个功能与社区方案的 `EXT-X-PREFETCH` 非常相似。

与该功能相关的标签是 `EXT-X-PRELOAD-HINT`，它后面跟一个属性列表，一共有 4 个属性。

- TYPE 属性有两个值，PART 表示是小分段，MAP 表示是媒体初始部分（与 EXT-X-MAP 相似）。
- URI 资源的 url。
- BYTERANGE-START 如果是一个资源的一部分，这个属性用来指定开始部分。
- BYTERANGE-LENGTH 这个表示资源的字节长度，与 BYTERANGE-START 配合使用。

当客户端碰到这个标签时，可以选择是否直接请求这个资源，服务器会和上面请求长连接中一样维持这个请求，直到整个资源数据可用时才返回资源。当然也有可能直接返回 404。

### 快速码率切换

使用 HLS 的一个优势是可以自适应码率切换，根据当前网速、屏幕大小等信息选择最适合用户的当前环境码率的流。在 LLHLS 中苹果提供了一种可以快速切换码率的功能。

服务器通过 `EXT-X-RENDITION-REPORT` 标签，将主播放列表中与当前流相关的其他码率的流条件到当前 `Media` 类型的播放列表中，这个标签一共有 3 个属性。

- URI 与当前流相关的其他码率流的链接。
- LAST-MSN 这个流中最后一个视频片段的视频编号。
- LAST-PART 这个流中最后一个小分段的下标。

每个视频流的 `LAST-MSN` 和 `LAST-PART` 可能不一样，`EXT-X-RENDITION-REPORT` 标签提供了这些信息，我们就不用去请求那些比较落后的流，这样可以减少很多不必要的请求。

### 直播从哪儿开始播放

客户端面对一个播放列表，应该从哪儿开始播放呢？离主播位置越远延迟就越高，离主播当前位置越近 Buffer 有太少，容易引起播放卡顿。

上面介绍的 `EXT-X-SERVER-CONTROL` 标签可以解决这个问题，这个标签还有两个属性 `HOLD-BACK` 和 `PART-HOLD-BACK`，这两个属性是服务器推荐的直播开始位置。

- `HOLD-BACK` 的值是一个浮点数秒数，代表服务器推荐的离播放列表末尾最小距离，它应该最小是 3 个视频片段目标时长。

- `PART-HOLD-BACK` 的值是一个浮点数秒数，代表服务器推荐的离播放列表末尾最小距离，它最小是 2 倍的 Part 小分段的目标时长。推荐是 Part 目标时长的 3 倍。

当存在 `PART-HOLD-BACK` 属性时，客户端应该忽略 `HOLD-BACK` 属性。如果播放列表包含 `EXT-X-PART-INF` 标签，则必须要有 `PART-HOLD-BACK` 属性。

### 如何获取最新播放列表 CDN Tune-in

CDN 一般会有缓存，那么如何获取最新版本的播放列表呢？苹果给出了一个解决方案。

1. 首先发送一个不包含 `_HLS_msn` 和 `_HLS_part` 查询参数的请求。
2. 记录这次请求的接收时间和 Age 响应头。如果没有 Age 响应头那么这次请求应该就是最新的版本。
3. 设置变量 `goalDuration` 去匹配 Age 响应头，如果 Part 目标时长小于 1 秒则 `goalDuration` 加 1 秒。
4. 如果 Age 响应头大于或等于 `Part` 目标时长，则设置 `currentGoal` 等于 `goalDuration` 加上现在到第一次响应的时间。
5. 利用片段目标时长和 Part 目标时长，去估算服务器应该加了多少片段和小分段到播放列表了。
6. 利用估算出来的值去发送带有 `_HLS_msn` 和 `_HLS_part` 查询条件的请求，就可以获得最新版本的播放列表了。

当然也可以实现自己的算法来获取最新版本的播放列表，比如 `hls.js` 中是这样计算 `currentGoal` 的。

```json
currentGoal = Math.min(cdnAge - partTarget, targetDuration * 1.5)

segments = Math.floor(currentGoal / targetDuration)
parts = Math.round((currentGoal % targetDuration) / partTarget)
```

它在目标时长的 1.5 倍和 Age 响应头与 Part 目标延迟之间差值取最小值，计算出 `currentGoal`。然后通过 `currentGoal` 计算出 `_HLS_msn` 和 `_HLS_part` 两个查询条件的参数。

### 推荐时长设置

苹果推荐的一个视频片段的时长是 6 秒钟，一个 Part 小分段时长推荐设置为 1 秒钟，GOP 推荐设置为 1 到 2 秒。推荐最少在有 3 个 Part 目标时长位置开始播放。
