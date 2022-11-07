---
title: 输入网址到页面展现发生了什么
nav:
  title: 前端基础
  path: /base
group:
  title: html、浏览器相关试题
  path: /html/project
---

# 说说从输入网址到页面展现的整个过程？

- 2021.06.25

我们先来看下整体的流程图，大致如下所示:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210625093347702.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

从图中可以看出，整个过程需要各个进程之间的配合，所以在开始正式流程之前，我们还是先来快速回顾下浏览器进程、渲染进程和网络进程的主要职责。

- `浏览器进程`主要负责用户交互、子进程管理和文件储存等功能。
- `网络进程`是面向渲染进程和浏览器进程等提供网络下载功能。
- `渲染进程`的主要职责是把从网络下载的 HTML、JavaScript、CSS、图片等资源解析为可以显示和交互的页面。因为渲染进程所有的内容都是通过网络获取的，会存在一些恶意代码利用浏览器漏洞对系统进行攻击，所以运行在渲染进程里面的代码是不被信任的。这也是为什么 Chrome 会让渲染进程运行在安全沙箱里，就是为了保证系统的安全。

回顾了浏览器的进程架构后，我们可以把整体的步骤总结如下:

1. 首先，用户从浏览器进程里输入请求信息；
2. 然后，网络进程发起 URL 请求；
3. 服务器响应 URL 请求之后，浏览器进程就又要开始准备渲染进程了；
4. 渲染进程准备好之后，需要先向渲染进程提交页面数据，我们称之为提交文档阶段；
5. 渲染进程接收完文档信息之后，便开始解析页面和加载子资源，完成页面的渲染。

接下来我们来完整的了解下详细步骤。

## 1. 处理用户输入

当我们在地址栏中输入一个查询关键字时，地址栏会判断输入的关键字是搜索内容，还是请求的 URL。因为本质上搜索栏也是一个输入框。

- 如果是`搜索内容`，地址栏会使用浏览器默认的搜索引擎，来合成新的带搜索关键字的 URL。

- 如果判断输入内容符合 URL 规则，比如输入的是 `baidu.com`，那么地址栏会根据规则，把这段内容加上协议，合成为完整的 URL，如 `https://www.baidu.com`。

![处理用户输入](https://img-blog.csdnimg.cn/20210220154445862.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 2. 开始导航

回车按下后，`UI thread` 将关键词搜索对应的 `URL` 或输入的 `URL` 交给`网络线程 Network thread`(它们的通信是通过 IPC 进行的)，此时 `UI 线程`使 `Tab` 前的图标展示为`加载中`状态，然后`网络进程`进行一系列诸如 `DNS` 寻址，建立 `TLS` 连接等操作进行资源请求，如果收到服务器的 `301` 重定向响应，它就会告知 `UI 线程`进行重定向然后它会再次发起一个新的网络请求。

![开始导航](https://img-blog.csdnimg.cn/20210220154554845.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**我们把这个阶段做的事情详细展开:**

首先，网络进程会查找本地缓存是否缓存了该资源。如果有缓存资源，那么直接返回资源给浏览器进程；如果在缓存中没有查找到资源，那么直接进入网络请求流程。(这里的流程就涉及到之前的`浏览器强缓存`和`协商缓存`)。

请求前的第一步是要进行 `DNS` 解析，以获取请求域名的服务器 `IP` 地址。如果请求协议是 `HTTPS`，那么还需要建立 `TLS` 连接。

接下来就是利用 `IP 地址`和服务器建立 `TCP 连接`。连接建立之后，浏览器端会构建`请求行`、`请求头`等信息，并把和该域名相关的 `Cookie` 等数据附加到请求头中，然后向服务器发送构建的请求信息。

## 3. 处理响应结果

服务器接收到请求信息后，会根据请求信息生成响应数据（包括`响应行`、`响应头`和`响应体`等信息），并发给`网络进程`。等`网络进程`接收了`响应行`和`响应头`之后，就开始解析响应头的内容了。

在接收到服务器返回的响应头后，网络进程开始解析响应头，如果发现返回的状态码是 `301` 或者 `302`，那么说明服务器需要浏览器重定向到其他 URL。这时网络进程会从响应头的 `Location` 字段里面读取重定向的地址，然后再发起新的 `HTTP` 或者 `HTTPS` 请求，一切又重头开始了。

在处理了跳转信息之后，我们继续导航流程的分析。URL 请求的数据类型，有时候是一个下载类型，有时候是正常的 HTML 页面，那么浏览器是如何区分它们呢？

答案是 `Content-Type`。`Content-Type` 是 `HTTP` 头中一个非常重要的字段， 它告诉浏览器服务器返回的响应体数据是什么类型，然后浏览器会根据 `Content-Type` 的值来决定如何显示响应体的内容。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '需要注意的是，如果服务器配置`Content-Type`不正确，比如将`text/html`类型配置成`application/octet-stream`类型，那么浏览器可能会曲解文件内容，比如会将一个本来是用来展示的页面，变成了一个下载文件。\n\n所以，不同`Content-Type`的后续处理流程也截然不同。如果`Content-Type`字段的值被浏览器判断为下载类型，那么该请求会被提交给浏览器的`下载管理器`，同时该URL请求的导航流程就此结束。但如果是`HTML`，那么浏览器则会继续进行导航流程。';

export default () => <Info type="warning" txt={txt} />;
```

与此同时，浏览器会进行 `Safe Browsing 安全检查`，如果域名或者请求内容匹配到已知的恶意站点，`network thread`会展示一个警告页。除此之外，网络线程还会做 `CORB（Cross Origin Read Blocking）`检查来确定那些敏感的跨站数据不会被发送至渲染进程。

## 4.准备渲染进程

各种检查完毕以后，`network thread` 确信浏览器可以导航到请求网页，`network thread` 会通知 `UI thread` 数据已经准备好，`UI thread` 会查找到一个 `renderer process(渲染进程)` 进行网页的渲染。

![准备渲染进程](https://img-blog.csdnimg.cn/20210220154928579.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

Chrome 的页面渲染是运行在渲染进程中的，默认情况下，Chrome 会为每个页面分配一个渲染进程，也就是说，每打开一个新页面就会配套创建一个新的渲染进程。但是，也有一些例外，在某些情况下，浏览器会让多个页面直接运行在同一个渲染进程中。

这里其实涉及到了`浏览器的进程模式`，这里在简要提及一下:

### 浏览器的进程模式

为了节省内存，`Chrome` 提供了四种`进程模式（Process Models）`，不同的进程模式会对 tab 进程做不同的处理。

- `Process-per-site-instance (default)`: 同一个 site-instance 使用一个进程
- `Process-per-site`: 同一个 site 使用一个进程
- `Process-per-tab`: 每个 tab 使用一个进程
- `Single process`: 所有 tab 共用一个进程

其中`site` 指的是相同的 `registered domain name`(如：`google.com` ，`bbc.co.uk`)和 `scheme` (如：`https://`)。比如 `a.baidu.com` 和 `b.baidu.com` 就可以理解为同一个 `site`（注意这里要和 `Same-origin policy` 区分开来，同源策略还涉及到子域名和端口）。

`site-instance` 指的是一组 `connected pages from the same site`，这里 `connected` 的定义是 `can obtain references to each other in script code` 怎么理解这段话呢？

满足下面两种情况并且打开的新页面和旧页面属于上面定义的同一个 `site`，就属于同一个 `site-instance`.

- 用户通过`<a target="_blank">`这种方式点击打开的新页面

- JS 代码打开的新页面（比如 window.open)

理解了概念之后，下面解释四个进程模式:

- 首先是 `Single process`，顾名思义，`单进程模式`，所有 tab 都会使用同一个进程。

- 接下来是 `Process-per-tab` ，也是顾名思义，每打开一个 tab，会新建一个进程。

- 而对于 `Process-per-site`，当你打开 `a.baidu.com` 页面，在打开 `b.baidu.com` 的页面，这两个页面的 `tab` 使用的是共一个进程，因为这两个页面的 `site` 相同，而如此一来，如果其中一个 tab 崩溃了，而另一个 tab 也会崩溃。

- `Process-per-site-instance` 是最重要的，因为这个是 `Chrome` 默认使用的模式，也就是几乎所有的用户都在用的模式。当你打开一个 tab 访问 `a.baidu.com` ，然后再打开一个 tab 访问 b.baidu.com，这两个 tab 会使用两个进程。而如果你在 `a.baidu.com` 中，通过 JS 代码打开了 `b.baidu.com` 页面，这两个 tab 会使用同一个进程。

那么为什么浏览器使用 `Process-per-site-instance` 作为默认的进程模式呢？

> `Process-per-site-instance` 兼容了性能与易用性，是一个比较中庸通用的模式。

1. 相较于 `Process-per-tab`，能够少开很多进程，就意味着更少的内存占用。

2. 相较于 `Process-per-site`，能够更好的隔离相同域名下毫无关联的 tab，更加安全。

因此我们也知道了为啥 Chrome 打开页面的时候有时候会共用同一个进程了。

继续回到之前，渲染进程准备好之后，还不能立即进入文档解析状态，因为此时的文档数据还在网络进程中，并没有提交给渲染进程，所以下一步就进入了提交文档阶段。

## 5. 提交文档阶段

首先要明确一点，这里的`文档`是指 `URL 请求的响应体数据`。

到了这一步，数据和渲染进程都准备好了，`Browser Process` 会向 `Renderer Process` 发送 `IPC` 消息来确认导航，此时，浏览器进程将准备好的数据发送给渲染进程，渲染进程接收到数据之后，又发送 IPC 消息给浏览器进程，告诉浏览器进程导航已经提交了，页面开始加载。

![提交文档阶段](https://img-blog.csdnimg.cn/20210220155437671.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

浏览器进程在收到`确认提交`的消息后，会更新浏览器界面状态，包括了`安全状态（地址前面的小锁）`、`地址栏的 URL`、`前进后退的历史状态(访问历史列表（history tab）)`，并更新 Web 页面。我们可以通过前进后退来切换该页面。

例如:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210625155157718.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

这也就解释了为什么在浏览器的地址栏里面输入了一个地址后，之前的页面没有立马消失，而是要加载一会儿才会更新页面。

到这里，一个完整的导航流程就“走”完了，这之后就要进入渲染阶段了。

## 6. 正式渲染阶段

当导航提交完成后，`渲染进程`开始加载资源及渲染页面，当页面渲染完成后（页面及内部的 `iframe` 都触发了 `onload` 事件），会向浏览器进程发送 `IPC` 消息，告知浏览器进程，这个时候 `UI thread` 会停止展示 `tab` 中的加载中图标。

至此，一个完整的页面就生成了。这里我们没有详细展开渲染进程中的阶段，接下来阐述渲染阶段完成的事情。

> 渲染进程负责 tab 内的所有事情，核心目的就是将 `HTML/CSS/JS` 代码，转化为用户可进行交互的 `web` 页面。那么渲染进程是如何工作的呢？

渲染进程中，主要包含下面线程：

- 一个主线程（main thread）
- 多个工作线程（work thread）
- 一个合成器线程（compositor thread）
- 多个光栅化线程（raster thread）

![渲染进程](https://img-blog.csdnimg.cn/20210220155645253.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 6.1 构建 DOM

渲染进程接受到导航的确认信息后，开始接受来自浏览器进程的数据，这个时候，主线程会解析数据转化为 `DOM（Document Object Model）`对象。

DOM 是我们通过 `JavaScript` 与网页进行交互的数据结构及 API。

整个构建 DOM 的详细过程可以参考[DOM 章节](/html/project/dom)。

### 6.2 子资源加载

在构建 `DOM` 的过程中，会解析到`图片`、`CSS`、`JavaScript` 脚本等资源，这些资源是需要从网络或者缓存中获取的，主线程在构建 `DOM` 过程中如果遇到了这些资源，逐一发起请求去获取，而为了提升效率，浏览器也会运行`预加载扫描（preload scanner）`程序。

如果 `HTML` 中存在 `img`、`link` 等标签，`预加载扫描程序`会把这些请求传递给 `Browser Process` 的 `network thread` 进行资源下载。

![资源子加载](https://img-blog.csdnimg.cn/20210220155906139.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 6.3 JavaScript 的下载与执行

构建 DOM 过程中，如果遇到`<script>`标签，渲染引擎会停止对 `HTML` 的解析，而去加载执行 `JS` 代码，原因在于 JS 代码可能会改变 DOM 的结构（比如执行 `document.write()`等 API）。

不过开发者其实也有多种方式来告知浏览器应对如何应对某个资源，比如说如果在`<script>`标签上添加了 `async` 或 `defer`等属性，浏览器会异步的加载和执行 JS 代码，而不会阻塞渲染。

### 6.4 样式计算 - Style calculation

DOM 树只是我们页面的结构，我们要知道页面长什么样子，我们还需要知道 DOM 的每一个节点的样式。主线程在解析页面时，遇到`<style>`标签或者`<link>`标签的 `CSS 资源`，会加载 CSS 代码，根据 CSS 代码确定每个 DOM 节点的`计算样式（computed style）`。

计算样式是主线程根据 `CSS 样式选择器（CSS selectors）`计算出的每个 DOM 元素应该具备的具体样式，**需要注意的是即使你的页面没有设置任何自定义的样式，浏览器也会提供其默认的样式**。

![样式计算](https://img-blog.csdnimg.cn/20210220160131114.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 6.5 布局 - Layout

DOM 树和计算样式完成后，我们还需要知道每一个节点在页面上的位置，`布局（Layout）`其实就是找到所有元素的几何关系的过程。

主线程会遍历 DOM 及相关元素的计算样式，构建出包含每个元素的页面坐标信息及盒子模型大小的布局树`（Render Tree）`，遍历过程中，会跳过隐藏的元素`（display: none）`，另外，伪元素虽然在 DOM 上不可见，但是在布局树上是可见的。

![布局 - Layout](https://img-blog.csdnimg.cn/20210220160248599.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 6.6 绘制 - Paint

布局 `layout` 之后，我们知道了不同元素的结构，样式，几何关系，我们要绘制出一个页面，我们要需要知道每个元素的绘制先后顺序，在绘制阶段，主线程会遍历`布局树（layout tree）`，生成一系列的`绘画记录（paint records）`。绘画记录可以看做是记录各元素绘制先后顺序的笔记。

![绘制 - Paint](https://img-blog.csdnimg.cn/20210220160354879.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 6.7 合成 - Compositing

文档结构、元素的样式、元素的几何关系、绘画顺序，这些信息我们都有了，这个时候如果要绘制一个页面，我们需要做的是把这些信息转化为显示器中的像素，这个转化的过程，叫做`光栅化（rasterizing）`。

那我们要绘制一个页面，最简单的做法是只光栅化`视口内（viewport）`的网页内容，如果用户进行了页面滚动，就移动`光栅帧（rastered frame）`并且光栅化更多的内容以补上页面缺失的部分，大致是这么一个流程：

![光栅化第一版](https://img-blog.csdnimg.cn/20210220160620984.gif)

`Chrome 第一个版本`就是采用这种简单的绘制方式，这一方式唯一的缺点就是每当页面滚动，光栅线程都需要对新移进视图的内容进行光栅化，这是一定的性能损耗，为了优化这种情况，`Chrome` 采取一种更加复杂的叫做`合成（compositing）`的做法。

那么，什么是合成？

`合成`是一种将页面分成若干层，然后分别对它们进行光栅化，最后在一个单独的线程 - `合成线程（compositor thread）`里面合并成一个页面的技术。

当用户滚动页面时，由于页面各个层都已经被光栅化了，浏览器需要做的只是合成一个新的帧来展示滚动后的效果罢了。页面的动画效果实现也是类似，将页面上的层进行移动并构建出一个新的帧即可。

![合成](https://img-blog.csdnimg.cn/20210220161152479.gif)

为了实现合成技术，我们需要对元素进行分层，确定哪些元素需要放置在哪一层，主线程需要遍历渲染树来创建一棵`层次树（Layer Tree）`，对于添加了 `will-change CSS 属性`的元素，会被看做单独的一层，没有 `will-change CSS 属性`的元素，浏览器会根据情况决定是否要把该元素放在单独的层。

![合成技术](https://img-blog.csdnimg.cn/2021022016140757.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

我们可能会想要给页面上所有的元素一个单独的层，然而当页面的层超过一定的数量后，层的合成操作要比在每个帧中光栅化页面的一小部分还要慢，因此衡量渲染性能是十分重要的一件事情。

一旦 `Layer Tress` 被创建，渲染顺序被确定，主线程会把这些信息通知给`合成器线程`，`合成器线程`开始对层次数的每一层进行`光栅化`。

有的层的可以达到整个页面的大小，所以合成线程需要将它们切分为一块又一块的`小图块（tiles）`，之后将这些小图块分别进行发送给一系列`光栅线程（raster threads）`进行`光栅化`，结束后`光栅线程`会将每个图块的光栅结果存在 `GPU Process` 的内存中。

![通知光栅化](https://img-blog.csdnimg.cn/20210220161510873.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '为了优化显示体验，`合成线程`可以给不同的光栅线程赋予不同的优先级，将那些在视口中的或者视口附近的层先被光栅化。';

export default () => <Info type="info" txt={txt} />;
```

当图层上面的图块都被`栅格化`后，`合成线程`会收集图块上面叫做`绘画四边形（draw quads）`的信息来构建一个`合成帧（compositor frame）`。

- `绘画四边形`：包含图块在内存的位置以及图层合成后图块在页面的位置之类的信息。
- `合成帧`：代表页面一个帧的内容的绘制四边形集合。

以上所有步骤完成后，合成线程就会通过 `IPC` 向`浏览器进程（browser process）`提交（commit）一个`渲染帧`。这个时候可能有另外一个`合成帧`被浏览器进程的`UI 线程（UI thread）`提交以改变浏览器的 UI。

这些合成帧都会被发送给 `GPU` 从而展示在屏幕上。如果合成线程收到页面滚动的事件，合成线程会构建另外一个合成帧发送给 `GPU` 来更新页面。

![发送合成帧](https://img-blog.csdnimg.cn/20210220161636121.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

合成的好处在于这个过程没有涉及到主线程，所以合成线程不需要等待样式的计算以及 `JavaScript` 完成执行。这就是为什么合成器相关的动画最流畅，如果某个动画涉及到`布局`或者`绘制`的调整，就会涉及到主线程的重新计算，自然会慢很多。

### 6.8 进行事件的处理

当页面渲染完毕以后，TAB 内已经显示出了可交互的 WEB 页面，用户可以进行移动鼠标、点击页面等操作了，而当这些事件发生时候，浏览器是如何处理这些事件的呢？

以`点击事件（click event）`为例，让鼠标点击页面时候，首先接受到事件信息的是 `Browser Process`，但是 `Browser Process` 只知道事件发生的类型和发生的位置，具体怎么对这个点击事件进行处理，还是由 `Tab` 内的 `Renderer Process` 进行的。

`Browser Process` 接受到事件后，随后便把事件的信息传递给了渲染进程，渲染进程会找到根据事件发生的坐标，找到`目标对象（target）`，并且运行这个目标对象的点击事件绑定的`监听函数（listener）`。

![进行事件的处理](https://img-blog.csdnimg.cn/20210220161856473.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 6.9 渲染进程中合成器线程接收事件

前面我们说到，`合成器线程`可以独立于`主线程`之外通过已`光栅化`的层创建组合帧，例如`页面滚动`，如果没有对页面滚动绑定相关的事件，`合成器线程`可以独立于主线程创建组合帧，如果页面绑定了页面滚动事件，合成器线程会等待主线程进行事件处理后才会创建组合帧。那么，`合成器线程`是如何判断出这个事件是否需要路由给`主线程处理`的呢？

由于执行 `JS` 是`主线程`的工作，当页面合成时，`合成器线程`会标记页面中绑定有事件处理器的区域为`非快速滚动区域(non-fast scrollable region)`，如果事件发生在这些存在标注的区域，合成器线程会把事件信息发送给主线程，等待主线程进行事件处理，如果事件不是发生在这些区域，合成器线程则会直接合成新的帧而不用等到主线程的响应。

![合成器线程接收事件](https://img-blog.csdnimg.cn/20210220162022137.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '而对于非快速滚动区域的标记，开发者需要注意全局事件的绑定，比如我们使用事件委托，将目标元素的事件交给根元素 body 进行处理，代码如下：';

export default () => <Info type="warning" txt={txt} />;
```

```js
document.body.addEventListener('touchstart', (event) => {
  if (event.target === area) {
    event.preventDefault();
  }
});
```

在开发者角度看，这一段代码没什么问题，但是从浏览器角度看，这一段代码给 `body` 元素绑定了事件监听器，也就意味着整个页面都被编辑为一个`非快速滚动区域`，这会使得即使你的页面的某些区域没有绑定任何事件，每次用户触发事件时，合成器线程也需要和主线程通信并等待反馈，流畅的合成器独立处理合成帧的模式就失效了。

![示例代码问题](https://img-blog.csdnimg.cn/20210220162125475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

其实这种情况也很好处理，只需要在事件监听时传递 `passtive` 参数为 `true`，`passtive` 会告诉浏览器你既要绑定事件，又要让`合成器线程`直接跳过主线程的事件处理直接合成创建组合帧。

```js
document.body.addEventListener(
  'touchstart',
  (event) => {
    if (event.target === area) {
      event.preventDefault();
    }
  },
  { passive: true },
);
```

### 6.10 查找事件的目标对象（event target）

当`合成器线程`接收到事件信息，判定到事件发生不在非快速滚动区域后，合成器线程会向`主线程`发送这个时间信息，主线程获取到事件信息的第一件事就是通过`命中测试（hit test）`去找到事件的目标对象。

具体的`命中测试流程`是遍历在绘制阶段生成的`绘画记录（paint records）`来找到包含了事件发生坐标上的元素对象。

![查找事件的目标对象](https://img-blog.csdnimg.cn/2021022016230866.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### 浏览器对事件的优化

一般我们屏幕的帧率是每秒 `60` 帧，也就是 `60fps`，但是某些事件触发的频率超过了这个数值，比如 `wheel`，`mousewheel`，`mousemove`，`pointermove`，`touchmove`，这些连续性的事件一般每秒会触发 `60~120` 次，假如每一次触发事件都将事件发送到主线程处理，由于屏幕的刷新速率相对来说较低，这样使得主线程会触发过量的命中测试以及 JS 代码，使得性能有了没必要是损耗。

![浏览器对事件的优化1](https://img-blog.csdnimg.cn/20210220162359479.png)

出于优化的目的，浏览器会合并这些连续的事件，延迟到下一帧渲染是执行，也就是 `requestAnimationFrame` 之前。

![浏览器对事件的优化2](https://img-blog.csdnimg.cn/20210220162437417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

而对于非连续性的事件，如 `keydown`，`keyup`，`mousedown`，`mouseup`，`touchstart`，`touchend` 等，会直接派发给主线程去执行。

## 总结

浏览器的多进程架构，根据不同的功能划分了不同的进程，进程内根据不同的使命划分了不同的线程。

1. 用户输入 url 并回车
2. 浏览器进程检查 url，组装协议，构成完整的 url
3. 浏览器进程通过进程间通信（IPC）把 url 请求发送给网络进程
4. 网络进程接收到 url 请求后检查本地缓存是否缓存了该请求资源，如果有则将该资源返回给浏览器进程
   - **如果没有，网络进程向 web 服务器发起 http 请求（网络请求），请求流程如下：**
     - 进行 DNS 解析，获取服务器 ip 地址，端口
     - 利用 ip 地址和服务器建立 tcp 连接
     - 构建请求头信息
     - 发送请求头信息
     - 服务器响应后，网络进程接收响应头和响应信息，并解析响应内容
   - **网络进程解析响应流程：**
     - 检查状态码，如果是 301/302，则需要重定向，从 Location 自动中读取地址，重新进行第 4 步 ，如果是 200，则继续处理请求。
     - 200 响应处理：检查响应类型 Content-Type，如果是字节流类型，则将该请求提交给下载管理器，该导航流程结束，不再进行后续的渲染，如果是 html 则通知浏览器进程准备渲染进程准备进行渲染。
   - **准备渲染进程：**
     - 浏览器进程检查当前 url 是否和之前打开的渲染进程根域名是否相同，如果相同，则复用原来的进程，如果不同，则开启新的渲染进程
   - **传输数据、更新状态：**
     - 渲染进程准备好后，浏览器向渲染进程发起“提交文档”的消息，渲染进程接收到消息和网络进程建立传输数据的“管道”
     - 渲染进程接收完数据后，向浏览器发送“确认提交”
     - 浏览器进程接收到确认消息后更新浏览器界面状态：安全、地址栏 url、前进后退的历史状态、更新 web 页面
5. 构建 DOM 树
6. 子资源加载
7. JavaScript 的下载与执行
8. 样式计算 - Style calculation
9. 布局 - Layout
10. 绘制 - Paint
11. 合成 - Compositing
12. 注册事件处理
