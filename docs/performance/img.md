---
title: 全站图片优化
nav:
  title: 性能优化
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# 全站图片资源优化

- 2022.01.12

## 浏览器图片资源请求 timing

![示例timing](https://img-blog.csdnimg.cn/46286e1368a64f1ca89be021fa2ce003.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

[完整的 timing 解释](https://developer.chrome.com/docs/devtools/network/reference/?utm_source=devtools#timing-explanation)

## 图片常用格式说明

### png

> `便携式网络图形（Portable Network Graphics）`是一种`无损压缩`的位图图形格式 。

其设计目的是试图替代 `GIF` 和 `TIFF` 文件格式，同时增加一些 `GIF` 文件格式所不具备的特性。

- 优点:

  1. 无损压缩

     采用[LZ77 算法](https://cloud.tencent.com/developer/news/279864)的派生算法进行压缩，其结果是获得高的压缩比，不损失数据。它利用特殊的编码方法标记重复出现的数据，因而对图像的颜色没有影响，也不可能产生颜色的损失，这样就可以重复保存而不降低图像质量。

  2. 体积小
  3. 索引彩色模式
  4. 更优化的网络传输显示

     PNG 图像在浏览器上采用流式浏览，即使经过交错处理的图像会在完全下载之前提供浏览者一个基本的图像内容，然后再逐渐清晰起来。它允许连续读出和写入图像数据，这个特性很适合于在通信过程中显示和生成图像。

  5. 支持透明效果
  6. 最高支持 24 位真彩色图像以及 8 位灰度图像
  7. 支持 Alpha 通道的透明/半透明特性
  8. 支持图像亮度的 gamma 校正信息
  9. 最高支持 48 位真彩色图像以及 16 位灰度图像

- 缺点:

  某些软件不兼容。

#### png-8、png-24、png-32

- PNG-32 每个像素的深度为 32bits，其中 RGBA 四个通道各占 8bits。所谓的 RGBA 四个通道，就是红，绿，蓝，透明 这四种色值各自的大小，都用 8bits 来表示（0 ～ 255）。

- PNG-24 的像素深度为 24bits，其中 RGB 三个通道各占 8bits。PNG-24 因为没有 Alpha 通道（透明通道），所以不支持透明图片。

- PNG-8 则作出了一些变动，他将图片中用到的每种颜色都存储在一个长度为 255 的数组中，称之为条色盘，然后每个像素上存储对应颜色在条色盘上的位置。因为颜色上限是 255 种，所以每个像素只需要 8bits 就可以表示对应的颜色信息。这种表示颜色的方式也被称之为索引色。

PNG-8 相比之下确实使用了更少的空间来存储颜色，但是他能表达的颜色种类是有上限的，所以在将 PNG-32 转换成 PNG-8 时会在一些颜色过渡的地方会明显的看到不平滑的渐变。

### jpeg

> JPEG 是 Joint Photographic Experts Group（联合图像专家小组）的缩写，是第一个国际图像压缩标准。

是一种有损压缩格式，能够将图像压缩在很小的储存空间，图像中重复或不重要的资料会被丢失，因此容易造成图像数据的损伤。

- 优点:

  1. 利用可变的压缩比可以控制文件大小。
  2. 支持交错（对于渐近式 JPEG 文件）。

- 缺点:

  1. 有损耗压缩会使原始图片数据质量下降。
  2. JPEG 不适用于所含颜色很少、具有大块颜色相近的区域或亮度差异十分明显的较简单的图片。

### bmp

> BMP 是英文 Bitmap（位图）的简写，它是`Windows操作系统`中的标准图像文件格式，能够被多种`Windows`应用程序所支持。

这种格式的特点是包含的图像信息较丰富，几乎不进行压缩，但由此导致了它与生俱生来的缺点是占用磁盘空间过大。所以，目前`BMP`在单机上比较流行，也无法在 web 程序中使用。

### gif

> GIF 是 Graphics Interchange Format 的简写，它是图形转换格式，采用 LZW 压缩算法进行编码，用于以超文本标志语言（Hypertext Markup Language）方式显示索引彩色图像，在因特网和其他在线服务系统上得到广泛应用。

GIF 是一种最多支持 256 种颜色的 8 位无损图片格式。

GIF 可以被 PC 和 Mactiontosh 等多种平台上被支持，适用于对色彩要求不高同时需要文件体积较小的场景，比如企业 Logo、线框类的图等。

- 优点:

  1. 优秀的压缩算法使其在一定程度上保证图像质量的同时将体积变得很小
  2. 可插入多帧，从而实现动画效果
  3. 可设置透明色以及产生对象浮现与背景之上的效果

- 缺点:

  1. 由于采用了 8 位压缩最多只能处理 256 种颜色(2 的 8 次方)，故不能真彩图像(24 位的图像接近人眼分辨的颜色种类，故称为真彩)

### TIFF

> TIFF 是 Tag Image File Format 的简写，它是标签图像文件格式。

TIFF（Tag Image File Format）图像文件是图形图像处理中常用的格式之一，其图像格式很复杂，但由于它对图像信息的存放灵活多变，可以支持很多色彩系统，而且独立于操作系统，因此得到了广泛应用（拓展性支持 Mac 跟 Windows 系统交叉使用）。

在各种地理信息系统、摄影测量与遥感等应用中，要求图像具有地理编码信息，例如图像所在的坐标系、比例尺、图像上点的坐标、经纬度、长度单位及角度单位等。

### webp

> webp 格式是 2010 年谷歌推出的图片格式，专门用来在 web 中使用,压缩率只有 jpg 的 2/3 或者更低。它像 JPEG 一样对细节丰富的图片信手拈来，像 PNG 一样支持透明，像 GIF 一样可以显示动态图片，集多种图片文件格式的优点于一身。

- 优点:

  1. 无损压缩
  2. 体积小巧，未来发展趋势良好

- 缺点:

  1. 存在一定的兼容性问题

## 图片格式汇总

| 图片类型 | 动画      | 透明度    | 压缩类型      | 浏览器支持情况                       |
| :------- | :-------- | :-------- | :------------ | :----------------------------------- |
| GIF      | 支持 ✅   | 支持 ✅   | 无损压缩      | 所有                                 |
| PNG      | 不支持 ❌ | 支持 ✅   | 无损压缩      | 所有                                 |
| JPEG     | 不支持 ❌ | 不支持 ❌ | 有损压缩      | 所有                                 |
| BMP      | 不支持 ❌ | 支持 ✅   | 不支持压缩 ❌ | 不支持 ❌，仅在 windows 系统内部使用 |
| WEBP     | 支持 ✅   | 支持 ✅   | 无损压缩      | 存在一定兼容性问题                   |

## 图片体积计算

```
图像大小 = 分辨率 * 位深 / 8

分辨率 = 宽*高（如：1024*768，640*480）

位深：如24位，16位，8位

/ 8 计算的是字节数。
```

一幅图像分辨率：1024\*768,24 位，则其大小计算如下：

图片大小 = 1024*768*24/8=2359296byte=2304KB

## webp 技术支持状况

![webp 技术支持状况](https://cdn.weipaitang.com/static/202201059d84f8a0-1cfc-f8a01cfc-5f3d-c6ab09af0c72-W1167H634)

- 使用 canvas 进行检测

  > `HTMLCanvasElement.toDataURL()` 方法返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。

  `toDataURL`方法将图片转化为包含 `dataURI` 的 `DOMString`，通过 `base64` 编码前面的图片类型值是`image/webp`进行判断。

  ```js
  function supportWebp() {
    try {
      return (
        document
          .createElement('canvas')
          .toDataURL('image/webp')
          .indexOf('data:image/webp') == 0
      );
    } catch (err) {
      return false;
    }
  }
  // 'data:image/webp;base64,UklGRrgAAABXRUJQVlA4WAoAAAAQAAAAKwEAlQAAQUxQSBIAAAABBxARERCQJP7/H0X0P+1/QwBWUDgggAAAAHANAJ0BKiwBlgA+bTaZSaQjIqEgKACADYlpbuF2sRtACewD32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99qwAAP7/1gAAAAAAAAAA'
  ```

- 使用 image 去加载 webp 图片

  ```js
  // 'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
  // 'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
  function check_webp_feature(feature, callback) {
    var kTestImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha:
        'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation:
        'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    };
    var img = new Image();
    img.onload = function () {
      var result = img.width > 0 && img.height > 0;
      callback(feature, result);
    };
    img.onerror = function () {
      callback(feature, false);
    };
    img.src = 'data:image/webp;base64,' + kTestImages[feature];
  }
  ```

## 优化方案

- 经常使用到的一些小图标使用雪碧图的方式去合成，根据 position 定位去使用不同的 icon。

  该方式主要优化了图片的资源请求数量所带来的耗时问题(同一域名下并发请求最大 6 个)。

- 图片的懒加载

  通过减少首屏的图片资源加载梳理来优化。

- 使用 iconfont 字体库图标来代替图片图标。
