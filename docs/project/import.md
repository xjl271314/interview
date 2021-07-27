---
title: webpack 如何实现按需加载？
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# webpack 如何实现按需加载？

- 2021.06.01

> `webpack` 的按需加载是通过 `import()`或者 `require.ensure()`来实现的,有些读者可能对于 `require.ensure` 比较熟悉,所以我们先看看 `require.ensure`的执行过程。

```js
// index.js
setTimeout(function () {
  require.ensure([], function () {
    let d = require('./module2');
  });
}, 1000);

// module2.js
module.exports = {
  name: 'Jack',
};
```

执行 `require.ensure(dependencies,callback,errorCallback,chunkName)` 实际上会返回一个 `promise` , 里面的实现逻辑是,先判断 `dependencies` 是否已经被加载过:

- 如果加载过则取缓存值的 `promise`。

- 如果没有被加载过 则生成一个 `promise` 并将 `promise` 里面的 `resolve`,`reject` 和 `promise 本身` 存入一个`数组`,然后缓存起来.

接着生成一个 `script` 标签,填充完信息之后添加到 `HTML` 文件上,其中的 `script` 的 `src` 属性 就是我们按需加载的文件`(module2)`,`webpack` 会对这个 `script` 标签监听 `error` 和 `load` 时间,从而做相应的处理。

`webpack` 打包过程中会给 `module2` 添加一些代码,主要就是主动触发。

`window["webpackJsonp"].push`这个函数,这个函数会传递两个参数 `文件ID` 和 `文件内容对象`,其中 文件标示如果没有配置的话,会按载入序号自动增长,文件内容对象实际上就是上文说的 `require.ensure` 第一个参数 `dependencies` 的文件内容,或者是 `callback`,`errorCallback` 里面需要加载的文件,以 `key(文件路径)` --- `value(文件内容)`的形式出现.

里面执行的事情其实就是执行上面创建的 `promise` 的 `resolve` 函数,让 `require.ensure` 里面的 `callback` 执行,之后的执行情况就跟我上面`require` 和 `import` 一样了。

## 异步加载 import 原理和同步 import 原理：

- ### 同步 import 最终转化成`__webpack_require__`函数

`__webpack_require__`: 这个函数接收一个 `moduleId`，对应于立即执行函数传入参数的 `key` 值。

若一个模块之前已经加载过，直接返回这个模块的导出值；若这个模块还没加载过，就执行这个模块，将它缓存到 `installedModules` 相应的 `moduleId` 为 `key` 的位置上，然后返回模块的导出值。所以在 `webpack` 打包代码中，`import` 一个模块多次，这个模块只会被执行一次。

还有一个地方就是，在 `webpack` 打包模块中，默认 `import` 和 `require `是一样的，最终都是转化成`__webpack_require__`。

- ### 异步 import 最终转化成`__webpack_require__.e` 方法

根据传入的 `chunkId`，去加载这个 `chunkId` 对应的异步 `chunk` 文件，它返回一个 `promise`。

`promise` 执行 `then` 的时候就会执行我们`__webpack_require__`函数，`__webpack_require__.e` 函数中做的事情就是根据我们 `installedChunks` 来判断 `chunk` 的加载状态，如果 `chunk` 正在继续等待.

如果 `chunk` 还没加载就会通过 `jsonp` 的形式新建 `script` 标签，去加载我们 `chunk`，加载完成之后执行 `webpackJsonpCallback` 这个函数，这函数中会执行 `chunk` 状态标记为 `0`，将我们对`__webpack_require__.e` 中产生的相应的 `chunk` 加载 `promise` 进行 `resolve`，接下里就执行`__webpack_require__`，在 `promise` 的回调中再调用`__webpack_require__.bind(null, "./src/asyncCommon1.js")` 就能拿到对应的模块。
