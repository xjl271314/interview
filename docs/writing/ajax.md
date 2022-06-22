---
title: 手写原生ajax
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写原生 ajax

- 2022.05.31

## 前言

Ajax 技术的核心是 `XMLHttpRequest` 对象（简称 XHR），意味着用户可以不必刷新页面也能取得新数据。 也就是说，可以使用 XHR 对象取得新数据，然后再通过 DOM 将新数据插入到页面中。另外，虽然名字中包含 XML 的成分，但 Ajax 通信与数据格式无关；

**Q: 如何创建一个 XHR?**

```js
const xhr = new XMLHttpRequest();
```

### XHR 的用法

在使用 `XHR` 对象时，要调用的第一个方法是 `open()`，它接受 3 个参数：

- 要发送的请求的类型（"get"、"post"等）
- 请求的 URL
- 表示是否异步发送请求的布尔值。

```js
const xhr = new XMLHttpRequest();

xhr.open('get', 'index.php', false);
```

- URL 相对于执行代码的当前页面（当然也可以使用绝对路径）；
- 调用 `open()` 方法并不会真正发送请求，而只是启动一个请求以备发送。

要发送特定的请求，必须像下面这样调用 `send()`方法：

```js
const xhr = new XMLHttpRequest();
xhr.open('open', 'index.txt', false);

xhr.send(null);
```

这里的 `send()` 方法接收一个参数，即要作为请求主体发送的数据。

如果不需要通过请求主体发送数据，则必须传入 `null`，因为这个参数对有些浏览器来说是必需的。调用 `send()`之后，请求就会被分派到服务器。

在收到响应后，响应的数据会自动填充 `XHR` 对象的属性，相关的属性简介如下。

- `responseText`：作为响应主体被返回的文本。
- `responseXML`：如果响应的内容类型是`text/xml`或`application/xml`，这个属性中将保存包含着响应数据的 XML DOM 文档。
- `status`：响应的 HTTP 状态。
- `statusText`：HTTP 状态的说明。

在接收到响应后，第一步是检查 `status` 属性，以确定响应已经成功返回。

一般来说，可以将`HTTP` 状态代码为 `200` 作为成功的标志。此时，`responseText` 属性的内容已经就绪，而且在内容类型正确的情况下，`responseXML` 也应该能够访问了。

此外，状态代码为 `304` 表示请求的资源并没有被修改，可以直接使用浏览器中缓存的版本；当然，也意味着响应是有效的。为确保接收到适当的响应，应该像下面这样检查上述这两种状态代码：

```js
const xhr = new XMLHttpRequest();

xhr.open('get', 'index.txt', false);
xhr.send(null);

if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
  alert(xhr.responseText);
} else {
  alert('Request Fail: ' + xhr.status);
}
```

建议通过检测 `status` 来决定下一步的操作，不要依赖 `statusText`，因为后者在跨浏览器使用时不太可靠。另外，无论内容类型是什么，响应主体的内容都会保存到 `responseText` 属性中；而对于非 `XML` 数据而言，`responseXML` 属性的值将为 `null`。

### 异步 XHR

像前面这样发送同步请求当然没有问题，但多数情况下，我们还是要发送异步请求，才能让 JavaScript 继续执行而不必等待响应。

此时，可以检测 `XHR` 对象的 `readyState` 属性，该属性表示请求/响应过程的当前活动阶段。这个属性可取的值如下:

- 0：未初始化。尚未调用 `open()` 方法。
- 1：启动。已经调用 `open()` 方法，但尚未调用 `send()` 方法。
- 2：发送。已经调用 `send()` 方法，但尚未接收到响应。
- 3：接收。已经接收到部分响应数据。
- 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

只要 `readyState` 属性的值由一个值变成另一个值，都会触发一次 `readystatechange` 事件。可以利用这个事件来检测每次状态变化后 `readyState` 的值。

通常，我们只对 `readyState` 值为 `4` 的阶段感兴趣，因为这时所有数据都已经就绪。

不过，必须在调用 `open()` 之前指定 `onreadystatechange` 事件处理程序才能确保跨浏览器兼容性。

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.statu == 304) {
      alert(xhr.responseText);
    } else {
      alert('Request Fail: ' + xhr.status);
    }
  }
};

xhr.open('get', 'index.php', true);
xhr.send(null);
```

### 取消 XHR

另外，在接收到响应之前还可以调用 `abort()` 方法来取消异步请求：

```js
xhr.abort();
```

调用这个方法后，`XHR` 对象会停止触发事件，而且也不再允许访问任何与响应有关的对象属性。

### 设置 HTTP 头部信息

每个 `HTTP` 请求和响应都会带有相应的头部信息，`XHR` 对象也提供了操作这两种头部（即`请求头`和`响应头`）信息的方法。

默认情况下，在发送 `XHR` 请求的同时，还会发送下列头部信息。

- `Accept`：浏览器能够处理的内容类型。
- `Accept-Charset`：浏览器能够显示的字符集。
- `Accept-Encoding`：浏览器能够处理的压缩编码。
- `Accept-Language`：浏览器当前设置的语言。
- `Connection`：浏览器与服务器之间连接的类型。
- `Cookie`：当前页面设置的任何 `Cookie`。
- `Host`：发出请求的页面所在的域 。
- `Referer`：发出请求的页面的 `URI`。注意，`HTTP` 规范将这个头部字段拼写错了，而为保证与规范一致，也只能将错就错了。（这个英文单词的正确拼法应该是 `referrer`。）
- `User-Agent`：浏览器的用户代理字符串。

使用 `setRequestHeader()` 方法可以设置自定义的请求头部信息。

这个方法接受两个参数：`头部字段的名称`和`头部字段的值`。

**要成功发送请求头部信息，必须在调用 `open()` 方法之后且调用 `send()` 方法之前调用 `setRequestHeader()`，如下面的例子所示:**。

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText);
    } else {
      alert('Request Fail: ' + xhr.status);
    }
  }
};
xhr.open('get', 'index.php', true);
xhr.setRequestHeader({
  token: 112233,
});
xhr.send(null);
```

调用 `XHR` 对象的 `getResponseHeader()` 方法并传入头部字段名称，可以取得相应的响应头部信息。而调用 `getAllResponseHeaders()` 方法则可以取得一个包含所有头部信息的长字符串。来看下面的例子。

```js
var myHeader = xhr.getResponseHeader('MyHeader');
var allHeaders = xhr.getAllResponseHeaders();
```

在服务器端，也可以利用头部信息向浏览器发送额外的、结构化的数据。在没有自定义信息的情况下，`getAllResponseHeaders()` 方法通常会返回如下所示的多行文本内容：

```json
Date: Sun, 14 Nov 2004 18:04:03 GMT
Server: Apache/1.3.29 (Unix)
Vary: Accept
X-Powered-By: PHP/4.3.8
Connection: close
Content-Type: text/html; charset=iso-8859-1
```

这种格式化的输出可以方便我们检查响应中所有头部字段的名称，而不必一个一个地检查某个字段是否存在。

### XHR 使用 GET 请求

`GET` 是最常见的请求类型，最常用于向服务器查询某些信息。`GET`请求的参数需要追加到 `URL` 的末尾，以便将信息发送给服务器。对 `XHR` 而言，位于传入 `open()` 方法的 `URL` 末尾的查询字符串必须经过正确的编码才行。

查询字符串中每个参数的名称和值都必须使用 `encodeURIComponent()` 进行编码，然后才能放到 `URL` 的末尾；而且所有名-值对 儿都必须由和号 `&` 分隔，如下面的例子所示。

```js
xhr.open('get', 'example.php?name1=value1&name2=value2', true);
```

下面这个函数可以辅助向现有 `URL` 的末尾添加查询字符串参数：

```js
function addURLParam(url, name, value) {
  url += url.indexOf('?') == -1 ? '?' : '&';
  url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
  return url;
}
```

下面是使用这个函数来构建请求 URL 的示例。

```js
var url = 'example.php';

//添加参数
url = addURLParam(url, 'name', 'Nicholas');
url = addURLParam(url, 'book', 'Professional JavaScript');

//初始化请求
xhr.open('get', url, false);
```

在这里使用 `addURLParam()` 函数可以确保查询字符串的格式良好，并可靠地用于 `XHR` 对象。

### XHR 使用 POST 请求

`POST` 请求把数据作为请求的主体提交，请求的主体可以包含非常多的数据，而且格式不限。在 `open()` 方法第一个参数的位置传入 `post` ，就可以初始化一个 `POST` 请求，如下面的例子所示。

```js
xhr.open('post', 'example.php', true);
```

发送 POST 请求的第二步就是向 `send()` 方法中传入某些数据。由于 `XHR` 最初的设计主要是为了处理 `XML`，因此可以在此传入 `XML DOM` 文档，传入的文档经序列化之后将作为请求主体被提交到服务器。当然，也可以在此传入任何想发送到服务器的字符串。

### FormData

现代 Web 应用中频繁使用的一项功能就是表单数据的序列化，`XMLHttpRequest 2` 级为此定义了 `FormData` 类型。`FormData` 为序列化表单以及创建与表单格式相同的数据（用于通过 XHR 传输）提供了便利。下面的代码创建了一个 `FormData` 对象，并向其中添加了一些数据。

```js
var data = new FormData();
data.append('name', 'Nicholas');
```

`append()`方法接收两个参数：键和值，分别对应表单字段的名字和字段中包含的值。可以像这样添加任意多个键值对。而通过向 `FormData` 构造函数中传入表单元素，也可以用表单元素的数据预先向其中填入键值对儿：

```js
var data = new FormData(document.forms[0]);
```

创建了 `FormData` 的实例后，可以将它直接传给 `XHR` 的 `send()` 方法，如下所示：

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText);
    } else {
      alert('Request Fail: ' + xhr.status);
    }
  }
};
xhr.open('post', 'example.php', true);
xhr.setRequestHeader('token', '112233');
var form = document.getElementById('user-info');
xhr.send(new FormData(form));
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n使用 `FormData` 的方便之处体现在不必明确地在 `XHR` 对象上设置请求头部。`XHR` 对象能够识别传入的数据类型是 `FormData` 的实例，并配置适当的头部信息。';

export default () => <Info title="提示" txt={txt} />;
```

### 超时设定

`IE8`为 `XHR` 对象添加了一个 `timeout` 属性，表示请求在等待响应多少毫秒之后就终止。在给 `timeout` 设置一个数值后，如果在规定的时间内浏览器还没有接收到响应，那么就会触发 `timeout` 事件，进而会调用 `ontimeout` 事件处理程序。这项功能后来也被收入了 `XMLHttpRequest 2` 级规范中。

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    try {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        alert(xhr.responseText);
      } else {
        alert('Request was unsuccessful: ' + xhr.status);
      }
    } catch (ex) {
      // 假设由 ontimeout 事件处理程序处理
    }
  }
};
xhr.open('get', 'timeout.php', true);
xhr.timeout = 1000; // 将超时设置为 1 秒钟
xhr.ontimeout = function () {
  alert('Request Timeout.');
};
xhr.send(null);
```

### overrideMimeType()方法

`Firefox` 最早引入了 `overrideMimeType()` 方法，用于重写 `XHR` 响应的 `MIME` 类型。这个方法后来也被纳入了 `XMLHttpRequest 2` 级规范。

因为返回响应的 `MIME` 类型决定了 `XHR` 对象如何处理它，所以提供一种方法能够重写服务器返回的 `MIME` 类型是很有用的。

比如，服务器返回的 `MIME` 类型是 `text/plain`，但数据中实际包含的是 `XML`。根据 `MIME` 类型，即使数据是 `XML`，`responseXML` 属性中仍然是 `null` 。通过调用 `overrideMimeType()` 方法，可以保证把响应当作 `XML` 而非纯文本来处理。

```js
var xhr = new XMLHttpRequest();

xhr.open('get', 'index.php', true);
xhr.overrideMimeType('text/xml');

xhr.send(null);
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n这个例子强迫 XHR 对象将响应当作 XML 而非纯文本来处理。调用 `overrideMimeType()`c必须在 `send()`方法之前，才能保证重写响应的 `MIME` 类型。';

export default () => <Info type="warning" txt={txt} />;
```

### 进度事件

`Progress Events` 定义了与客户端服务器通信有关的事件。这些事件最早其实只针对 `XHR` 操作，但目前也被其它 API 借鉴。有以下 6 个进度事件。

- `loadstart`：在接收到相应数据的第一个字节时触发。
- `progress`：在接收相应期间持续不断触发。
- `error`：在请求发生错误时触发。
- `abort`：在因为调用 abort()方法而终止链接时触发。
- `load`：在接收到完整的相应数据时触发。
- `loadend`：在通信完成或者触发 error、abort 或 load 事件后触发。

每个请求从触发 `Loadstart` 事件开始，接下来是一或多个 `progress` 事件，然后触发 `error`、`abort`或 `load` 事件中的一个，最后以触发 `loadend` 事件结束。

#### load 事件

`Firefox` 在实现 `XHR` 对象的某个版本时，曾致力于简化异步交互模型。最终，`Firefox` 实现中引入了 load 事件，用以替代 `readystatechange` 事件。

响应接收完毕后将触发 `load` 事件，因此也就没有必要去检查 `readyState` 属性了。而 `onload` 事件处理程序会接收到一个 `event` 对象，其 `target` 属性就指向 `XHR` 对象实例，因而可以访问到 `XHR` 对象的所有方法和属性。

然而，并非所有浏览器都为这个事件实现了适当的事件对象。结果，开发人员还是要像下面这样被迫使用 XHR 对象变量。

```js
var xhr = createXHR();
xhr.onload = function () {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(xhr.responseText);
  } else {
    alert('Request was unsuccessful: ' + xhr.status);
  }
};
xhr.open('get', 'altevents.php', true);
xhr.send(null);
```

只要浏览器接收到服务器的响应，不管其状态如何，都会触发 load 事件。而这意味着你必须要检查 status 属性，才能确定数据是否真的已经可用了。

Firefox、Opera、Chrome 和 Safari 都支持 load 事件。

#### progress 事件

`Mozilla` 对 XHR 的另一个革新是添加了 `progress` 事件，这个事件会在浏览器接收新数据期间周期性地触发。

而 `onprogress` 事件处理程序会接收到一个 `event` 对象，其 `target` 属性是 `XHR` 对象，但包含着三个额外的属性：`lengthComputable`、`position` 和 `totalSize`。

- `lengthComputable`:表示进度信息是否可用的布尔值，
- `position`: 表示已经接收的字节数，
- `totalSize`: 表示根据 `Content-Length` 响应头部确定的预期字节数。

有了这些信息，我们就可以为用户创建一个进度指示器了。下面展示了为用户创建进度指示器的一个示例:

```js
var xhr = new XMLHttpRequest();
xhr.onload = function (event) {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(xhr.responseText);
  } else {
    alert('Request was unsuccessful: ' + xhr.status);
  }
};
xhr.onprogress = function (event) {
  var divStatus = document.getElementById('status');
  if (event.lengthComputable) {
    divStatus.innerHTML =
      'Received ' + event.position + ' of ' + event.totalSize + ' bytes';
  }
};
xhr.open('get', 'altevents.php', true);
xhr.send(null);
```

在前面的例子中，每次触发 `progress` 事件，都会以新的状态信息更新 `HTML` 元素的内容。如果响应头部中包含`Content-Length` 字段，那么也可以利用此信息来计算从响应中已经接收到的数据的百分比。

### 跨源资源共享

通过 `XHR` 实现 `Ajax` 通信的一个主要限制，来源于`跨域安全策略`。

默认情况下，XHR 对象只能访问与包含它的页面位于同一个域中的资源。这种安全策略可以预防某些恶意行为。但是，实现合理的跨域请求对开发某些浏览器应用程序也是至关重要的。

`CORS（Cross-Origin Resource Sharing，跨源资源共享）`定义了在必须访问跨源资源时，浏览器与服务器应该如何沟通。

### 带凭据的请求

默认情况下，跨源请求不提供凭据（`cookie`、`HTTP` 认证及客户端 `SSL` 证书等 ）。

通过将 `withCredentials` 属性设置为 `true`，可以指定某个请求应该发送凭据。如果服务器接受带凭据的请求，会用下面的 `HTTP` 头部来响应。

```js
Access-Control-Allow-Credentials: true
```

如果发送的是带凭据的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给`JavaScript`（于是，`responseText` 中将是空字符串，`status` 的值为 `0`，而且会调用 `onerror()`事件处理程序）。

## 自定义封装 ajax

```js
// 用于给get请求添加参数
function addURLParam(url, name, value) {
  url += url.indexOf('?') == -1 ? '?' : '&';
  url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  return url;
}

export function request(config) {
  const options = {
    url: '',
    method: 'get',
    params: {},
    withCredentials: true,
    async: true,
    timeout: 1000, // 1s超时
    onTimeout: null, // 请求超时
    success: null, // 请求成功
    error: null, // 请求失败
    onError: null, // 请求网络错误的监听
    headers: {},
    ...config,
  };

  let {
    url,
    method,
    params,
    withCredentials,
    async,
    timeout,
    onTimeout,
    headers,
    ...rest
  } = options;

  return new Promise((res, rej) => {
    method = method.toLowerCase();
    const xhr = new XMLHttpRequest();
    const len = Object.keys(params).length;
    let data = null;

    // 判断是get还是post请求
    if (method === 'get') {
      if (len > 0) {
        Object.keys(params).forEach((key) => {
          url = addURLParam(url, key, params[key]);
        });
      }
    } else if (method === 'post') {
      data = '';
      Object.keys(params).forEach((key, index) => {
        data += `${key}=${params[key]}&`;
      });
      data = data.slice(0, -1);
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        try {
          if (/^(2|3)\d{2}$/.test(xhr.status)) {
            res(JSON.parse(xhr.responseText));
            typeof success === 'function' &&
              success(JSON.parse(xhr.responseText));
          }
        } catch (ex) {
          rej(ex);
          typeof error === 'function' && error(ex);
        }
      }
    };
    xhr.open(method, url, async);
    // headers
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    method === 'post' &&
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.timeout = timeout;
    xhr.ontimeout =
      typeof onTimeout === 'function'
        ? onTimeout()
        : () => {
            rej({
              code: 504,
              msg: `${url}请求超时`,
            });
          };
    xhr.onerror =
      typeof onError === 'function'
        ? onError()
        : () => {
            rej({
              code: 504,
              msg: '请求发生异常',
            });
          };
    xhr.send(data);

    return xhr;
  });
}

// demo
const p1 = request({
  url: 'http://localhost:3001/api/test/get',
  params: {
    a: 1,
    b: 'aa',
  },
})
  .then((res) => {
    console.log('resolve', res);
  })
  .catch((err) => {
    throw err;
    console.log('err', err);
  });

const p2 = request({
  url: 'http://localhost:3001/api/test/post',
  method: 'post',
  params: {
    a: 'bb',
    b: 'aa',
  },
})
  .then((res) => {
    console.log('resolve', res);
  })
  .catch((err) => {
    throw err;
    console.log('err', err);
  });
```

## 实现 JSONP 的 ajax

```js
export function jsonpRequest(config = {}) {
  function formateData(data) {
    const arr = [];
    for (const key in data) {
      // 避免有&,=,?字符，对这些字符进行序列化
      arr.push(`${encodeURIComponent(key)}=${data[key]}`);
    }
    return arr.join('&');
  }

  const {
    url = '',
    data = {},
    jsonp = 'callback',
    success = null,
    error = null,
    timeout = 0,
  } = config;

  if (url === '') {
    throw 'url must required!';
  }

  // 核心思想是通过script标签进行加载
  const head = document.querySelector('head');
  const script = document.createElement('script');

  data.callback = jsonp;

  const params = formateData(data);

  script.src = `${url}?${params}`;

  window[jsonp] = function (jsonData) {
    // 请求移除scipt标签
    head.removeChild(script);
    clearTimeout(script.timer);
    window[jsonp] = null;
    typeof success === 'function' && success(jsonData);
  };

  // 请求超时的处理函数
  if (timeout) {
    script.timer = setTimeout(() => {
      // 请求超时对window下的[callbackName]函数进行清除，由于有可能下次callbackName发生改变了
      window[jsonp] = null;
      // 移除script元素，无论请求成不成功
      head.removeChild(script);
      // 这里不需要清除定时器了，clearTimeout(script.timer); 因为定时器调用之后就被清除了

      // 调用失败回调
      typeof error === 'function' &&
        error({
          code: 504,
          msg: `${url}请求超时`,
        });
    }, timeout);
  }

  head.appendChild(script);
}

// demo
jsonpRequest({
  url: 'http://localhost:3001/api/test/jsonp',
  jsonp: 'jsonp',
  data: {
    name: 'jack',
    time: Date.now(),
  },
  success(res) {
    console.log('jsonp success:', res);
  },
  error(err) {
    console.log(err);
  },
});
```
