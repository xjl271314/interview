---
title: 常见问题解决汇总
nav:
  title: business
  path: /business
group:
  title: 直播相关试题
  path: /business/live/project
---

# 业务问题汇总

- 2022.09.22

## DOMException: The play() request was interrupted

该错误经常出现在`Chrome`等浏览器控制台中输出的警告 ⚠️ 信息。

**为什么会报出这样的错误呢?**

1. 在代码中使用了 `video.pause()` 阻止了 `video.play()` ;

   ```js
   <video id="video" preload="none" src="https://example.com/file.mp4"></video>

   <script>
   video.play(); // <-- This is asynchronous!
   video.pause();
   </script>
   ```

   假如我们像上面这样去书写代码，在控制台看到的错误信息大致如下：

   ```js
   Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause().
   ```

   由于我们上面给 `video` 的 `preload` 属性设置了 `none`，如果我们不进行手动的`play`，视频是不会开始加载数据的。完整的值如下:

   | 属性 | 描述                     |
   | :--- | :----------------------- |
   | auto | 当页面加载后载入整个视频 |
   | meta | 当页面加载后只载入元数据 |
   | none | 当页面加载后不载入视频   |

   另外从 Chrome 50 开始， 当我们在 `<video>`、`<audio>`标签上去调用 `play` 方法的时候发起的是一个 `Promise`请求，返回了一个单一的异步结果。如果播放成功的话，会返回成功的 Promise 结果并触发`开始播放`事件。如果播放失败的话，会返回失败的 Promise 结果并且附带一个错误信息。

   上述的流程可以归纳为:

   1. 调用`video.play()`开启一个异步的拉取播放文件方法。
   2. 调用`video.pause()`中断了 video 数据的加载。
   3. `video.play()` 返回了`reject`的 Promise。

   由于我们并没有处理该`error`，所以在控制台上报错了。

### 解决方案

我们不能确保调用`play`方法之后就能够正常的播放。我们应该在`then`触发之后进行处理

```js
<video id="video" preload="none" src="https://example.com/file.mp4"></video>

<script>
  // Show loading animation.
  var playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // 开始播放
      // video.pause(); 这里我们可以正确的进行pause操作。
    })
    .catch(error => {
      // 播放暂停
    });
  }
</script>
```
