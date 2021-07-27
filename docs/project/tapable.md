---
title: webpack插件机制
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# webpack 的插件是什么?

- 2021.07.23

> `webpack` 的本质是一种基于事件流的编程范例,通过集成一系列的插件运行。其中核心对象 `Complier`、`Complation`都是继承于`Tapable`。

## Tapable 定义

那么 `Tapable` 是什么?

> `tapable` 是一个类似于 `Node.js` 的 `EventEmitter` 的库, 主要是控制钩子函数的发布与订阅。

## Hooks 类型

`tapable` 提供的 `hook` 机制比较全面，分为`同步`和`异步`两个大类(异步中又区分`异步并行`和`异步串行`)，而根据事件执行的终止条件的不同，由衍生出 `Bail/Waterfall/Loop` 类型。

```js
const {
  Tapable,
  SyncHook, // 同步钩子
  SyncBailHook, // 同步熔断钩子
  SyncWaterfallHook, // 同步流水钩子
  SyncLoopHook, // 同步循环钩子
  AsyncParallelHook, // 异步并发钩子
  AsyncParallelBailHook, // 异步并发熔断钩子
  AsyncSeriesHook, // 异步串行钩子
  AsyncSeriesBailHook, // 异步串行熔断钩子
  AsyncSeriesWaterfallHook, // 异步串行流水钩子
} = require('tapable');
```

| type            | function                                               |
| :-------------- | :----------------------------------------------------- |
| `Hook`          | 所有钩子的后缀                                         |
| `Waterfall`     | 同步方法,但是他会传值给下一个函数                      |
| `Bail`          | 熔断,当函数有任何返回值,则在当前执行函数停止           |
| `Loop`          | 监听函数返回 true 表示循环,返回 undefined 表示结束循环 |
| `Sync`          | 同步方法                                               |
| `AsyncSeries`   | 异步串行钩子                                           |
| `AsyncParallel` | 异步并行执行钩子                                       |

- ### Basic 类型

基本同步方法。执行每一个，不关心函数的返回值，有 `SyncHook`、`AsyncParallelHook`、`AsyncSeriesHook`。

![Basic 类型](https://img-blog.csdnimg.cn/e53df12548f641469052e1fc9874a2e3.png)

- ### Bail 类型

顺序执行 `Hook`，遇到第一个结果 `result!==undefined` 则返回，不再继续执行。有：`SyncBailHook`、`AsyncSeriseBailHook`, `AsyncParallelBailHook`。

![Bail 类型](https://img-blog.csdnimg.cn/27c4be01a67b45a0a4abd16d56b73570.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- ### Waterfall 类型

类似于 `reduce`，如果前一个 `Hook` 函数的结果 `result !== undefined`，则 `result` 会作为后一个 `Hook` 函数的第一个参数。既然是顺序执行，那么就只有 `Sync` 和 `AsyncSeries` 类中提供这个 `Hook`：`SyncWaterfallHook`，`AsyncSeriesWaterfallHook`。

![Waterfall 类型](https://img-blog.csdnimg.cn/11e5368d650543ad977912280b9389c4.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- ### Loop 类型

不停的循环执行 `Hook`，直到所有函数结果 `result === undefined`。同样的，由于对串行性有依赖，所以只有 `SyncLoopHook` 和 `AsyncSeriseLoopHook` （PS：暂时没看到具体使用 Case）

![Loop 类型](https://img-blog.csdnimg.cn/4741ff427f8b4c3799ef4de49b125f42.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## Tapable 的 使用

### 新建钩子

> `Tapable` 暴露出来的都是`类方法`,我们需要 `new` 一个类方法获得我们需要的钩子。`class` 接收数组参数 `options`,非必传。类方法会根据传参,接收同样数量的参数。

```js
const {
  SyncHook, // 同步钩子
} = require('tapable');

const hook1 = new SyncHook([arg1, arg2, arg3]);
```

### 钩子的绑定与执行

> Tapable 提供了`同步`和`异步`的绑定钩子的方法,并且他们都有绑定事件和执行事件对应的方法。

#### Async

- 绑定: `tapAsync`、`tapPromise`、`tap`
- 执行: `callAsync`、`promise`

#### Sync

- 绑定:`tap`
- 执行:`call`

### 基本用法示例

```js
const { SyncHook } = require('tapable');

// 创建一个同步 Hook，指定参数
const hook = new SyncHook(['arg1', 'arg2']);

// 注册
hook.tap('a', function (arg1, arg2) {
  console.log('a');
});

hook.tap('b', function (arg1, arg2) {
  console.log('b');
});

hook.call(1, 2);
```

### 实际例子演示

我们定义一个 `Car` 方法,在内部 `hook` 上新建钩子。分别是`同步钩子 accelerate`、`brake(accelerate` 接收一个参数)和`异步钩子 calculateRoutes`。

使用钩子对应的绑定和执行方法，`calculateRoutes` 使用 `tapPromise` 可以返回一个 `promise` 对象。

```js
// Car.js
const { SyncHook, AsyncSeriesHook } = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newspeed']),
      brake: new SyncHook(),
      calculateRoutes: new AsyncSeriesHook(['source', 'trget', 'routesList']),
    };
  }
}

const myCar = new Car();

// 绑定同步钩子
myCar.hooks.brake.tap('WarningLampPlugin', () =>
  console.log('WarningLampPlugin'),
);

// 绑定同步钩子 并传参
myCar.hooks.accelerate.tap('LoggerPlugin', (newSpeed) =>
  console.log(`Accelerating to ${newSpeed}`),
);

// 注册promise
myCar.hooks.calculateRoutes.tapPromise(
  'calculateRoutes tapPromise',
  (source, target, routesList, callback) => {
    console.log('source', source);
    return new Promise((resolve, rej) => {
      setTimeout(() => {
        console.log(`tapPromise to ${source} ${target} ${routesList}`);
        resolve();
      }, 1000);
    });
  },
);

myCar.hooks.brake.call();
myCar.hooks.accelerate.call(10);

console.time('cost');

// 执行异步钩子
myCar.hooks.calculateRoutes.promise('Async', 'hook', 'demo').then(
  () => {
    console.timeEmd('cost');
  },
  (err) => {
    console.error(err);
    console.timeEmd('cost');
  },
);
```

## Tapable 源码分析

`Tapable` 基本逻辑是，先通过类实例的 `tap` 方法注册对应 Hook 的处理函数，这里以 sync 同步钩子的主要流程为例:

```js
const { SyncHook } = require('tapable');

const hook = new SyncHook(['arg1', 'arg2']);
```

上述是一个最简单的同步 hook，我们从该句代码， 作为源码分析的入口。

```js
class SyncHook extends Hook {
  // 错误处理，防止调用者调用异步钩子
  tapAsync() {
    throw new Error('tapAsync is not supported on a SyncHook');
  }
  // 错误处理，防止调用者调用promise钩子
  tapPromise() {
    throw new Error('tapPromise is not supported on a SyncHook');
  }
  // 核心实现
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
```

`SyncHook` 类是继承于一个基类 `Hook`，基类 Hook 中的代码:

```js
// 变量的初始化
constructor(args) {
 if (!Array.isArray(args)) args = [];
 this._args = args;
 this.taps = [];
 this.interceptors = [];
 this.call = this._call;
 this.promise = this._promise;
 this.callAsync = this._callAsync;
 this._x = undefined;
}
```
