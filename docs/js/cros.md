---
title: CROS跨域处理
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# CROS 跨域处理

- 2022.05.31

`CROS(跨域资源共享)`是一种基于 HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其它`origin`（域，协议和端口），这样浏览器可以访问加载这些资源。

`origin`是`cors`的重要标识，只要是**非同源或者 POST 请求**都会带上`Origin`字段，接口返回后服务器也可以将`Access-Control-Allow-Origin`设置为请求的`Origin`，解决`cors`如何指定多个域名的问题。

## cors 请求划分

cors 将请求分为`简单请求`和`非简单请求`。

### 简单请求

- 只支持`HEAD`，`get`、`post`请求方式；
- 没有自定义的请求头；
- `Content-Type`：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`；

对于简单请求，浏览器直接发出`CORS`请求。具体来说，就是在头信息之中，增加一个`Origin`字段。如果浏览器发现这个接口回应的头信息没有包含`Access-Control-Allow-Origin`字段的话就会报`跨域错误`。

### 非简单请求

非简单请求，会在正式通信之前，增加一次`HTTP查询请求`，称为`预检请求（options）`，用来判断当前网页所在的域名是否在服务器的许可名单之中。

如果在许可名单中，就会发正式请求；如果不在，就会报跨越错误。

例如：`fetch` 的 `post` 请求会发送 `OPTIONS`。在预检中，浏览器发送的头中标示有 HTTP 方法和真实请求中会用到的头。

注：新版 chrome 浏览器看不到 OPTIONS 预检请求，可以网上查找对应的查看方法。

## 同源策略

**同一协议，同一域名，同一端口号。当其中一个不满足时，我们的请求即会发生跨域问题。**

## 解决方案

### jsonp

我们的`script标签`的`src`还是`img`标签的`src`，或者说`link`标签的`href`他们都没有被`同源策略`所限制，比如我们有可能使用一个网络上的图片，就可以请求得到。

`jsonp`就是使用通源策略这一“漏洞”，实现的跨域请求（这也是`jsonp跨域只能用get请求`的原因所在）。

```js
<button id="btn">点击</button>
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script>
    $('#btn').click(function(){
		var frame = document.createElement('script');
		frame.src = 'http://localhost:3000/article-list?name=leo&age=30&callback=func';
		$('body').append(frame);
	});

	function func(res){
		alert(res.message+res.name+'你已经'+res.age+'岁了');
	}
  </script>
```

服务端代码:

```js
router.get('/article-list', (req, res) => {
  console.log(req.query, '123');
  let data = {
    message: 'success!',
    name: req.query.name,
    age: req.query.age,
  };
  data = JSON.stringify(data);
  res.end('func(' + data + ')');
});
```

### document.domain

这种方式常用于`iframe`通信，用在主域名相同子域名不同的跨域访问中。

`http://a.frame.com` 和 `http://b.frame.com` 他们的主域名都是 `frame.com` 。

这两个域名中的文件可以用这种方式进行访问，通过在两个域中具体的文件中设置`document.domain="frame.com"`就可达到跨域访问的目的。

### window.name

`window`的 `name属性` 有个特征：在一个窗口(window)的生命周期内，窗口载入的所有的页面都是共享一个`window.name`的，每个页面对 `window.name` 都有读写的权限，`window.name` 是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。

### window.postMessage

`window.postMessages`是 `HTML5` 中实现跨域访问的一种新方式，可以使用它来向其它的`window`对象发送消息，无论这个`window`对象是属于同源或不同源。

该方式的使用还是十分简单的，给要发送数据的页面中的`window`对象调用一个`postMessage(message,targetOrigin)`方法即可。

- `message`为要发送的消息，类型只能为`字符串`；
- `targetOrigin`用来限定接收消息的那个`window`对象所在的域，如果不想限定域，直接使用通配符 '\*' 。

再让接收数据页面的`window`对象监听自身的`message`事件来获取传过来的消息，消息内容储存在该事件对象的`data`属性中。

### CORS(Cross-Origin Resource Sharing)

通过服务端配置`Access-Control-Allow-Origin`来实现。

### 代理服务器

配置`nginx`等代理服务器。
