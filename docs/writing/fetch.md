---
title: 自定义封装fetch
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 自定义封装 fetch

- 2022.06.01

## 前言

`fetch`是一种 HTTP 数据请求的方式，是`XMLHttpRequest`的一种替代方案。`fetch`不是`ajax`的进一步封装，而是原生 js,直接挂载在`window`对象上。

它的 API 是基于`Promise`设计的，旧版本的浏览器不支持`Promise`，需要使用`polyfill es6-promise`。

## 基础示例

```js
// fetch
fetch(url)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// fetch + async
async function test() {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
}
```

## 注意事项

1. 当接收到一个代表错误的 HTTP 状态码时，从 `fetch()` 返回的 `Promise` 不会被标记为 `reject`， 即使响应的 `HTTP` 状态码是 `404` 或 `500`。相反，它会将 `Promise` 状态标记为 `resolve` （但是会将 `resolve` 的返回值的 `ok` 属性设置为 `false`），**仅当网络故障时或请求被阻止时**，才会标记为 `reject`。

2. `fetch()` 不会接受跨域 `cookies`；也不能使用 `fetch()` 建立起跨域会话。其他网站的 `Set-Cookie` 头部字段将会被无视。

3. `fetch` 不会发送 `cookies`。除非你使用了`credentials` 的初始化选项。（自 2017 年 8 月 25 日以后，默认的 `credentials` 政策变更为 `same-origin`。`Firefox` 也在 `61.0b13` 版本中进行了修改）。

## 语法

> fetch(input, options)

- `input` 定义要获取的资源。这可能是： 一个字符串，包含要获取资源的 URL 或者一个 Request 对象。
- `init` 可选 一个配置项对象，包括所有对请求的设置。可选的参数有：
  - `method`: 请求使用的方法，如 GET、POST。
  - `headers`: 请求的头信息，形式为 Headers 对象或 ByteString。
  - `body`: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。
  - `mode`: 请求的模式，如 cors、 no-cors 或者 same-origin。
  - `credentials`: 请求的 credentials，如 omit、same-origin 或者 include。
  - `cache`: 请求的 cache 模式: default, no-store, reload, no-cache, force-cache, or only-if-cached.

## 基本实现

```js
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登录失效,请重新登录。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求的方式不被允许',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  const { status, statusText } = response;

  if (/^(2|3)\d{2}$/.test(status)) {
    return response;
  }

  const errorText = codeMessages[status] || statusText;
  const error = new Error(errorText);
  error.name = status;
  error.response = response;

  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  if (!url || typeof url !== 'string') {
    throw 'url is required and must be typeof string';
  }

  const defaultOptions = {
    // 携带cookies
    credentials: 'include',
    headers: {},
  };
  const newOptions = { ...defaultOptions, ...options };
  const method = (newOptions.method || 'get').toUpperCase();
  const { body } = newOptions;

  if (method == 'POST' || method === 'GET') {
    if (!(body instanceof FormData)) {
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (method === 'DELETE' || response.status === 204) {
        return response.text();
      }

      return response.json();
    })
    .catch((err) => {
      throw err;
    });
}
```

### `Fetch`请求本身不支持请求超时，如何支持?

`Promise.race`接收一个 `promise` 对象数组为参数，只要有一个 `promise` 对象进入 `Resolved` 或者 `Rejected` 状态的话，就会继续进行后面的处理。

```js
const _fetch = (requestPromise, timeout = 30000) => {
  let timeoutAction = null;
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject('请求超时');
    };
  });
  setTimeout(() => {
    timeoutAction();
  }, timeout);
  return Promise.race([requestPromise, timerPromise]);
};
```

## 封装了请求超时的 fetch

```js
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登录失效,请重新登录。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求的方式不被允许',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  const { status, statusText } = response;

  if (/^(2|3)\d{2}$/.test(status)) {
    return response;
  }

  const errorText = codeMessages[status] || statusText;
  const error = new Error(errorText);
  error.name = status;
  error.response = response;

  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function fetchRequest(url, options) {
  if (!url || typeof url !== 'string') {
    throw 'url is required and must be typeof string';
  }
  const controller = new AbortController();
  const { signal } = controller;

  const defaultOptions = {
    // 携带cookies
    credentials: 'include',
    headers: {},
    signal,
  };
  const newOptions = { ...defaultOptions, ...options };
  const method = (newOptions.method || 'get').toUpperCase();
  const { body } = newOptions;

  if (method === 'POST' || method === 'GET') {
    if (!(body instanceof FormData)) {
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
      };
    }
  }

  const _fetch = () =>
    fetch(url, newOptions)
      .then(checkStatus)
      .then((response) => {
        if (method === 'DELETE' || response.status === 204) {
          return response.text();
        }

        return response.json();
      })
      .catch((err) => {
        throw err;
      });

  // 如果添加了请求超时时间
  if (newOptions.timeout > 0) {
    let timeoutAction = null;
    const timerPromise = new Promise((resolve, reject) => {
      timeoutAction = () => {
        reject({
          code: 504,
          msg: `${url} 请求超时`,
        });
      };
    });

    setTimeout(() => {
      controller.abort();
      timeoutAction();
    }, newOptions.timeout);

    return Promise.race([_fetch(), timerPromise]);
  }

  return _fetch();
}
```

## 带拦截器的 fetch

类似于 `axios`的拦截器，我们可以在请求发送前和返回响应数据之前对数据进行修改，类似下面的语法:

```js

// 添加一个请求拦截器
fetch.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  });

// 添加一个响应拦截器
fetch.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
```

完整的代码实现如下:

```js
// request.js
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登录失效,请重新登录。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求的方式不被允许',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  const { status, statusText } = response;

  if (/^(2|3)\d{2}$/.test(status)) {
    return response;
  }

  const errorText = codeMessages[status] || statusText;
  const error = new Error(errorText);
  error.name = status;
  error.response = response;

  throw error;
}

// 申明拦截器
const interceptors_req = [];
const interceptors_res = [];

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function fetchRequest(url, options) {
  if (!url || typeof url !== 'string') {
    throw 'url is required and must be typeof string';
  }
  const controller = new AbortController();
  const { signal } = controller;

  const defaultOptions = {
    // 携带cookies
    credentials: 'include',
    headers: {},
    signal,
  };

  let newOptions = { ...defaultOptions, ...options };
  const method = (newOptions.method || 'get').toUpperCase();
  const { body } = newOptions;

  if (method === 'POST' || method === 'GET') {
    if (!(body instanceof FormData)) {
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        ...newOptions.headers,
        Accept: 'application/json',
      };
    }
  }

  // 注册请求拦截器
  interceptors_req.forEach((interceptors) => {
    newOptions = interceptors(newOptions);
  });

  const _fetch = () =>
    fetch(url, newOptions)
      .then(checkStatus)
      .then((response) => {
        // 响应拦截
        interceptors_res.forEach((interceptors) => {
          response = interceptors(response);
        });

        if (method === 'DELETE' || response.status === 204) {
          return response.text();
        }
        return response.json();
      })
      .catch((err) => {
        throw err;
      });

  // 如果添加了请求超时时间
  if (newOptions.timeout > 0) {
    let timeoutAction = null;
    const timerPromise = new Promise((resolve, reject) => {
      timeoutAction = () => {
        reject({
          code: 504,
          msg: `${url} 请求超时`,
        });
      };
    });

    setTimeout(() => {
      controller.abort();
      timeoutAction();
    }, newOptions.timeout);

    return Promise.race([_fetch(), timerPromise]);
  }

  return _fetch();
}

// 注册外部拦截器
fetchRequest.interceptors = {
  request: {
    use: (fn) => {
      interceptors_req.push(fn);

      return fn;
    },
    eject: (data) => {
      const index = interceptors_req.indexOf(data);
      if (index !== -1) {
        interceptors_req.splice(index, 1);
      }
    },
  },
  response: {
    use: (fn) => {
      interceptors_res.push(fn);

      return fn;
    },
    eject: (data) => {
      const index = interceptors_res.indexOf(data);
      if (index !== -1) {
        interceptors_res.splice(index, 1);
      }
    },
  },
};

// 请求示例
fetchRequest2.interceptors.request.use((option) => {
  if (option.method === 'post') {
    option.data = {
      ...(option.data || {}),
      type: 'request',
    };
  }

  return option;
});

fetchRequest2.interceptors.response.use((res) => {
  console.log(res);

  return res;
});

fetchRequest('http://localhost:3001/api/test/post', {
  method: 'post',
  body: {
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
