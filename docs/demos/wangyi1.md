---
title: 网易模拟面试题前端部分
nav:
  title: 模拟试题
  path: /demos
  order: 0
group:
  title: 技术部分
  path: /demos/technology
---

# 网易模拟面试题前端部分

- 2022.11.16

## 1. 介绍下什么是 redux？

`redux`是一种`单向数据流`的 `JavaScript 应用状态管理容器`，提供了`可预测`的状态管理。

其中包含了`Store`、`State`、`Action`、`Action Creator`、`Reducer`、`Dispatch`等概念。

其中`Store`是应用的状态容器，整个应用只能有一个`Store`，里面存放了各种`State`，对应着每一个`State`下的`View`。

`State`代表了应用的状态，`Action`是`View`发出的指令，需要通过`Dispatch`触发，用于变更`State`，这个时候可以用`Action Creator`来创建统一风格的指令，发出的指令经过`Reducer`处理后生成一个新的`State`以达到更新试图的目的。

## 2. 为什么要使用 redux，普通的 state 不行么？

在较简单的项目中直接使用 `state` 进行状态管理就可以了，无须使用 `redux`，但是在复杂的项目中，存在着很多无规律的交互以及异步操作。

比如说某个业务场景涉及到了 3 4 个组件，且存在父子组件的嵌套逻辑，这个时候使用单一的 state 进行管理就需要处理很多跨组件通信传值的问题，当然我们也可以使用内部的 Context 等方案，但是也存在一些数据流向不明确，排查问题困难的隐患。

而恰好，`redux`就提供了这么一种`单向数据流且可追溯的容易状态管理方案`。

## 3. Redux 源码有去了解过么？有哪些常用的 API？

嗯，之前有阅读过，去年又详细的整理了一遍，当时看的版本是`V4.1.1`，看完后也做了一下总结。

主入口主要导出了以下几个常用的 API：

### createStore

`redux`的流程是从`createStore`开始的，首先是创建一个全局的`store`。

```ts
export default function createStore(reducer, [preloadedState], [enhancer]) {
    ...
    reducer是一个函数，用于处理当前的action并返回一个新的状态树。
    preloadedState是一个可选参数，表示应用的初始化状态。
    enhancer是一个可选参数，可以接受一个applyMiddleware()方法用于中间件的处理。
}
```

流程大致是判断了入参的类型，定义了一些变量和方法，进行状态初始化，返回`dispatch`等常用 API。

- `ensureCanMutateNextListeners()`: 用于浅拷贝 `currentListeners`。
- `getState()`: 用于获取 `Store` 中存储的 `state` 数据。
- `subscribe(listener)`: 在 `Store` 注册一个监听函数，当 `dispatch` 一个 `action` 的时候可以触发我们传入的 `listener` 回调。并且返回了一个`unsubscribe()`方法用于取消订阅，所有的订阅函数统一放一个数组里，只去维护这个数组。
- `dispatch(action)`: `Store` 中去修改 `state` 的唯一途径，任何状态变更都仅能通过 `dispatch` 函数进行，最终返回一个新的 `action`。
- `replaceReducer(NewState, NewActions extends A)`: 替换当前 `store` 的 `reducer` 并计算出替换后的 `state`，常用于应用需要代码分割以及动态载入 `reducer` 的时候用。
- `observable()`: 返回一个迷你的 `state` 变化 `Log`。

### bindActionCreators.js

`bindActionCreators` 是对 `disptach` 的一种封装，可以直接执行或者通过属性方法的调用，隐式的去调用 `dispatch`，而不用显示的通过`Store.dispatch()`方法进行调用。

大多数的使用场景都是为了对某一功能进行包装。

```ts
export default function bindActionCreators(
    actionCreators: ActionCreator<any> | ActionCreatorsMapObject,
    dispatch: Dispatch
){
    ...
}
```

- `actionCreators`:可以用一个完整的 action 对象，也可以使用实际的类型。
- `dispatch`就是`store.dispatch()`。

### combineReducers.js

该方法主要用于合并`Reducer`，当我们应用比较大的时候 `Reducer` 按照模块拆分看上去会比较清晰，但是传入 `Store` 的 `Reducer` 必须是一个函数，所以需要使用这个方法来进行合并。

```ts
export default function combineReducers(reducers: ReducersMapObject) {
    ...
}
```

- `combineReducers` 的参数是一个对象(其他各种需要合并的 reducers)。
- `combineReducers` 执行结果返回的依旧是一个 `reducer`，不过聚合了所有传入的 `reducers`。
- 通过 `combineReducers` 返回的 `reducer` 创建的 `store`, 再派发某个 `action` 的时候，实际上每个内在的 `reducer` 都会执行。
- `createStrore` 使用合成的 `reducer` 创建的 `store`， 他再派发 `action` 返回的是总的大的 state(聚合了所有 reducer 内部的 state)

### compose.js

`compose`方法用于将传入的参数进行执行，将执行后的结果传入下一个函数，直到所有函数执行完毕。

```ts
export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args)),
  );
}
```

### applyMiddleware.js

`applyMiddleware` 用于`中间件功能`的添加，可以在我们的 `action` 经 `reducer` 执行时执行一些其他的操作。

![中间件](https://img-blog.csdnimg.cn/090fb7edb13e43758f395d3fb63e8a91.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```ts
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  return (createStore: StoreEnhancerStoreCreator) =>
    <S, A extends AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>
    ) => {
      const store = createStore(reducer, preloadedState)
      let dispatch: Dispatch = () => {
        throw new Error(
          'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.'
        )
      }

      const middlewareAPI: MiddlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
```

我们先根据初始的状态值创建了一个`store`，然后定义了一个`middlewareAPI`，接收 2 个参数 `getState` 和 `dispatch`。

然后定义了一个`chain`对传入的中间件进行遍历，执行内部的方法，最后使用 `compose` 方法进行组合返回一个新的 `dispatch` 方法。

相当于传入了这么一段代码:

```js
applyMiddleware(…middlewares)(createStore)(reducer,preloadedState)
```

最终返回了一个正常的 `Store` 和一个被变更过的 `dispatch` 方法，实现了对 `Store` 的增强。

## 4.中间件为什么要嵌套函数？为何不在一层函数中传递三个参数，而要在一层函数中传递一个参数，一共传递三层？

**因为中间件是要多个`首尾相连`的，对 `next` 进行一层层的**加工**，所以 `next` 必须独立一层。**

那么 `Store` 和 `action` 呢？

- `Store` 的话，我们要在中间件顶层放上 `Store`，因为我们要用 `Store` 的 `dispatch` 和 `getState` 两个方法。

- `action` 的话，是因为我们封装了这么多层，其实就是为了作出更高级的 `dispatch` 方法，是 `dispatch`需要接收 `action` 这个参数。

## 5. middlewareAPI 中的 dispatch 为什么要用匿名函数包裹呢？

我们用 `applyMiddleware` 是为了改造 `dispatch` 的，所以 `applyMiddleware` 执行完后，`dispatch` 是变化了的。

而 `middlewareAPI` 是 `applyMiddleware` 执行中分发到各个 `middleware`，所以必须用匿名函数包裹 `dispatch`，这样只要 `dispatch` 更新了，`middlewareAPI` 中的 `dispatch` 应用也会发生变化。

## 6. 在 middleware 里调用 dispatch 跟调用 next 一样吗？

因为我们的 `dispatch` 是用`匿名函数`包裹，所以在中间件里执行 `dispatch` 跟其它地方没有任何差别，而执行 `next` 相当于调用下个中间件。

## 7. 了解 immutable.js 么？为什么要使用 immutable.js？有没有在项目里面配合使用？

> [immutable.js](https://github.com/immutable-js/immutable-js)是一种不可变数据，一旦被创建之后就不可被修改。我们对 `Immutable` 对象的任何`修改或添加删除操作`都会返回一个新的 `Immutable` 对象。

其内部采用了一种 `Persistent Data Structure(持久化数据结构)`，也就是数据改变时(增删改)要保证旧数据同时可用且不变。

为了避免深拷贝把所有节点都复制一遍带来的性能损耗，`Immutable.js` 使用了 `Structural Sharing(结构共享)`， 即如果对象树节点发生变化，只修改这个节点和受它影响的父节点，其他节点共享。

之前的项目中有使用过，比如说在收货地址物流信息模块，**主要是为了解决层级嵌套较深情况下深拷贝所带来的性能问题**。

主要通过使用 `state.merge` 或者 `state.set` 来实现。

## 8. 使用 immutable.js 有什么注意事项?

### 交互操作困难

JavaScript 没有提供不可变的数据结构。因此，要保证 `immutable.js` 其不可变，我们的数据就必须封装在 `immutable.js` 对象（例如：`Map` 或 `List` 等）中。一旦使用这种方式包裹数据，这些数据就很难与其他普通的 `JavaScript` 对象进行交互操作。

例如，我们将不再能够通过标准 `JavaScript` 中的点语法或中括号引用对象的属性。相反，我们必须通过 `immutable.js` 提供的 `get()` 或 `getIn()` 方法来引用它们，这些方法使用了一种笨拙的语法，通过一个字符串字符串数组访问属性，每个字符串代表一个属性的 `key`。

例如:

```js
// 之前的代码
const a = myObj.prop1.prop2.prop3;

// 使用之后的代码

const a = myImmutableMap.getIn(['prop1', 'prop2', 'prop3']);
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n虽然`immutable.js` 对象确实包含 `toJS()` 方法，该方法会返回普通 `JavaScript` 数据结构形式的对象，但这种方法非常慢，广泛使用将会失去 `immutable.js` 提供的性能优势。';

export default () => <Info type="warning" txt={txt} />;
```

### 没有解构或展开运算符(Spread Operators)

由于我们必须通过 `immutable.js` 本身的 `get()` 和 `getIn()` 方法来访问数据，所以不能再使用 `JavaScript` 的`解构运算符`（或者提案中的 Object 扩展运算符），这使得我们的代码更加冗余。

### 不适用于经常改变的小数值

`immutable.js` 最适用于数据集合，越大越好。当我们的数据包含大量小而简单的 `JavaScript` 对象时，速度会很慢，每个对象都包含几个基本数据类型的 `key`。

### 难以调试

`immutable.js` 对象，如 `Map`，`List` 等可能很难调试，因为检查这样的对象会看到整个嵌套层级结构，这些层级我们并不关心，我们真正关心的是实际数据被封装了几层。

## 9. redux 与 react-redux 有是什么区别？

`react-redux` 是 `redux` 官方提供的 `React` 绑定库，用于在 `React` 应用中快速集成 `redux`。

## 10.react-redux 核心概念有哪些？

主要是 3 个核心内容：

- `<Provider store>`：帮助我们在需要使用 store 的地方进行了自动注册，不需要每个文件再去导入 store。
- `Subscription`：收集所有被 `connect` 包裹的组件的更新函数 `onstatechange`，然后形成一个 `callback` 链表，再由父级 `Subscription` 统一派发执行更新。
- `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`：帮助我们将 store 中的数据绑定到了 React 组件的 props 属性上，方便我们直接使用。

## 11. connect 中的参数有哪些能详细讲一下么？

- `mapStateToProps`：这个函数允许我们将 store 中的数据作为 props 绑定到组件上，当 state 改变时触发业务组件 props 改变，触发业务组件更新视图。
- `mapDispatchToProps`：用于将 redux 中的 dispatch 方法，映射到，业务组件的 props 中。
- `mergeProps`：经过 conncet 的组件的 props 有 3 个来源：一是由 mapStateToProps 将 state 映射成的 props，二是由 mapDispatchToProps 将 Action creator 映射成的 props，三是组件自身的 props。因此，mergeProps 主要用于整合这些 props 并且过滤一些不需要的 props。
  ```js
  /*
   * stateProps , state 映射到 props 中的内容
   * dispatchProps， dispatch 映射到 props 中的内容。
   * ownProps 组件本身的 props
   */
  const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
      ...ownProps,
      ...stateProps,
      incrementNum: dispatchProps.incrementNum, // 只输出incrementNum
    };
  };
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Sample);
  ```
- options 不怎么常用，主要功能如下:

  ```js
  {
      context?: Object,   // 自定义上下文
      pure?: boolean, // 默认为 true , 当为 true 的时候 ，除了 mapStateToProps 和 props ,其他输入或者state 改变，均不会更新组件。
      areStatesEqual?: Function, // 当pure true , 比较引进store 中state值 是否和之前相等。 (next: Object, prev: Object) => boolean
      areOwnPropsEqual?: Function, // 当pure true , 比较 props 值, 是否和之前相等。 (next: Object, prev: Object) => boolean
      areStatePropsEqual?: Function, // 当pure true , 比较 mapStateToProps 后的值 是否和之前相等。  (next: Object, prev: Object) => boolean
      areMergedPropsEqual?: Function, // 当 pure 为 true 时， 比较 经过 mergeProps 合并后的值 ， 是否与之前等  (next: Object, prev: Object) => boolean
      forwardRef?: boolean, // 当为true 时候,可以通过ref 获取被connect包裹的组件实例。
  }
  ```

我们总结一下整个 `connect` 的流程。我们还是从`订阅`和`更新`两个方向入手。

- 订阅流程

整个订阅的流程是，如果被 `connect` 包裹，并且具有第一个参数。

首先通过 `context` 获取最近的 `subscription`，然后创建一个新的 `subscription`,并且和父级的 `subscription` 建立起关联。

当第一次 `hoc` 容器组件挂在完成后，在 `useEffect` 里，进行订阅，将自己的订阅函数 `checkForUpdates`,作为回调函数，通过 `trySubscribe` 和 `this.parentSub.addNestedSub` ,加入到父级 `subscription` 的 `listeners` 中。由此完成整个订阅流程。

- 更新流程

整个更新流程是，`state` 改变，会触发根订阅器的 `store.subscribe`，然后会触发 `listeners.notify` ,也就是 `checkForUpdates` 函数，然后 `checkForUpdates` 函数首先根据 `mapStoretoprops`，`mergeprops` 等操作，验证该组件是否发起订阅，`props` 是否改变，并更新。

如果发生改变，那么触发 `useReducer` 的 `forceComponentUpdateDispatch` 函数，来更新业务组件。

如果没有发生更新，那么通过调用 `notifyNestedSubs`，来通知当前 `subscription` 的 `listeners` 检查是否更新，然后尽心层层 `checkForUpdates`逐级向下，借此完成整个更新流程。

## 12.有没有做过大文件上传和断点续传？

之前有做个相应的 demo，真实业务中没有去做过。

原理上主要是使用`Blob.prototype.slice`对文件进行切片，然后可以基于抽样的方式计算出对应的文件 Hash，Hash 的计算可以使用`webWorker`或者是`requestIdleCallback`，然后将每个切片通过 HTTP 并发请求的方式进行上传，后端侧维护已经上传的切片 Hash，当断网的时候进行重传时检测已经上传的文件，从而实现断点续传。

## 13. 表单可以跨域吗？为什么？

可以。表单提交本身是不携带 cookie 的，也就不会触发浏览器的同源策略。

## 14. promise、async 有什么区别？

`async`本身只是`promise`的一个语法糖，可以帮助我们用类似同步的方式去处理异步。

其中`await`的结果就是`promise`的`then`，内部的`try...catch...`对应`Promise`内的`catch`。

## 15. 搜索请求如何进行优化。

可以使用`防抖`进行优化，在一段时间内的输入仅触发一次，从而减少 API 的请求。

## 16. 那么能手写实现下防抖么？

```js
// 非立即执行版 触发事件后函数不会立即执行，而是在 n 秒后执行
// 如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
function debounce(fn, delay) {
  let timer = null;

  return function () {
    let context = thiss;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// 立即执行版 触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果
function debounce(fn, delay) {
  let timer = null;

  return function () {
    let context = thiss;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    let callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    callNow && func.apply(context, args);
  };
}
```

## 17. 如何处理 url 中的中文？

推荐使用 `encodeURIComponent()` 进行编码，在需要使用的地方再进行 `decodeURIComponent()`解码。

## 18. 如何实现一个通用的 url 参数提取工具函数？

主要有以下的 3 种方式，一种是使用正则，一种是使用字符串相关的方法，另外是使用`URLSearchParams`API。

```js
// 正则
function urlParamsToJson(url = window.location.href) {
  /**
   * match返回字符串中匹配结果的数组,匹配不到返回null
   * [^?=&]+ 匹配除了?=&之外的字符 仅匹配一次
   * Array.reduce(callBack(prev,cur,index,array), initialValue)
   * Array.slice(start,[end]) 返回start-end的元素
   */
  const params = url.match(/([^?=&]+)=([^&]*)/g);
  if (params) {
    return params.reduce(
      (a, v) => (
        (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
      ),
      {},
    );
  }
  return {};
}

// split
function urlParamsToJson(url = window.location.href) {
  const params = {};
  const search = url.substr(1);

  search.split('&').forEach((item) => {
    const [key, value] = item.split('=');
    params[key] = value;
  });

  return params;
}

// URLSearchParams
function getUrlParam(key, url = window.location.href) {
  const search = url.substr(1);
  const params = new URLSearchParams(search);

  return params.get(key);
}
```

## 19. 观察者模式和发布订阅模式的区别在哪里，手写实现一个发布订阅模式？

`观察者模式`和`发布订阅`模式最大的区别在于，`观察者模式`仅有`目标对象`和`观察者`两个部分组成，而`发布订阅模式`在两者之前还存在着一个`事件订阅系统`，每次都是向该系统进行订阅和取消订阅。

### 观察者模式

![观察者模式](https://img-blog.csdnimg.cn/51750702839b49bcb07494a54986b213.png)

### 发布订阅模式

![发布订阅模式](https://img-blog.csdnimg.cn/31f737091d2e41f893149d09ce7eea9f.png)

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, callBack) {
    if (!this.events[type]) {
      this.events[type] = [callBack];
    } else {
      this.events[type].push(callBack);
    }
  }

  off(type, callBack) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter((item) => item !== callBack);
  }

  once(type, callBack) {
    function fn() {
      callBack();
      this.off(type, fn);
    }
    this.on(type, fn);
  }

  clear() {
    this.events = {};
  }

  emit(type, ...rest) {
    this.events[type] &&
      this.events[type].forEach((fn) => fn.apply(this, rest));
  }
}

// 使用如下
const event = new EventEmitter();

const handle = (...rest) => {
  console.log(rest);
};

event.on('click', handle);

event.emit('click', 1, 2, 3, 4);

event.off('click', handle);

event.emit('click', 1, 2);

event.once('dbClick', () => {
  console.log(123456);
});
event.emit('dbClick');
event.emit('dbClick');
```

## 20. apply 与 call 是为了处理什么？能手实现么？

`call` 和 `apply` 两个方法都是用来改变函数运行时`this`指向问题。

`call` 方法接收新的 `this`，以及一一罗列出来的各个参数，`apply` 方法接收新的 `this`，以及一个参数数组(或者是 arguments 对象)。

```js
Function.prototype.call = function (context = window) {
  context.fn = this;
  const args = [...arguments].slice(1);
  const res = context.fn(...args);

  delete context.fn;

  return res;
};

Function.prototype.apply = function (context = window) {
  context.fn = this;
  const args = arguments[1] || [];
  const res = context.fn(...args);

  delete context.fn;

  return res;
};
```

## 21. 能说一说 js 中的 Event Loop 么？

首先，我们知道 js 是一门单线程的语言，为什么是单线程在于其主要用于处理网页中的交互逻辑，如果被设计成一门多线程的语言，那么就要处理各种互斥的逻辑。

这里的单线程指的是单个脚本只能在一个线程上运行，而不是说 JavaScript 引擎只有一个线程。

但是`单线程`的语言也存在着一个问题，在处理任务的时候是一个接一个排队处理的，假设有一个耗时巨大的任务需要执行，这个时候浏览器就会一直被这个任务占用资源，其他的操作就得不到响应了，也就造成了假死的现象。

所以需要一套额外的任务执行机制来处理这种场景。

因此，也诞生了 `Event Loop`。

另外，我们知道当一段 js 代码被执行的时候，会生成一个当前环境下的执行上下文(包括了执行环境、作用域)，用于存放当前环境中的变量，当这个上下文生成后会被推入到`执行栈`。一旦完成执行，这个上下文就会被弹出，里面的相关变量也会被销毁，等待下一次 `gc` 后删除。

这个执行栈我们可以理解为`主线程任务的同步执行环境`。

在同步的执行环境外，还存在着一个`Task任务队列`用于管理各种异步场景(比如说接口请求等)。

所有的异步操作都会被塞到这个任务队列中，当这些异步任务执行完成后会通过事件回调的方式通知主线程，这也是`Event Loop`名字的来源。

而`Event Loop`刚好是处于这两者之间，它会以一个固定的时间间隔来轮询，每当主线程空闲的时候，就会去任务队列中查找是否有异步任务，如果有的话就将其塞入主线程去执行，执行完成后弹出上下文环境。

当主线程再次空闲的时候，继续这个操作，直到所有任务执行完成。

这个时候就解决了事件的交互机制，但是这个时候的交互还存在问题，事件并没有区分优先级，只是按照到来的先后顺序去执行，因此需要一套`插队机制来保证高优先级的任务先执行`。

因此我们将异步任务又进行了划分，划分成了`宏任务`和`微任务`两大块。

至此一个完整的`Event Loop`就形成了。

总结来说，可以说 `Event Loop` 是通过设计 `Loop机制` 和 `异步任务队列`来解决主线程执行阻塞问题，并且设计了一套 `Micro Task`插队机制的事件交互机制。

**同一次事件循环中，`微任务`永远在`宏任务`之前执行。**

## 22. 那么都有哪些宏任务和微任务呢？

- 宏任务
  - 整体代码的 script 标签
  - setTimeout
  - setInterval
  - requestAnimationFrame(执行时机晚于 setTimeout)
  - requestIdleCallback(执行时机晚于 setTimeout)
  - UI 的渲染
  - I/O(按钮点击、文件上传等)
  - postMessage
  - MessageChannel
- 微任务
  - MutaionObserver
  - IntersectionObserver
  - Promise.then()

## 23. 你有去了解过 node.js 下的 Event Loop 么？和浏览器端的有什么区别?

首先 `Node.js` 也是单线程的，对比浏览器多了 2 个任务类型。

1. setImmediate(宏任务)
2. process.nextTick(微任务)

`setImmediate` 设计在 `poll` 阶段完成时执行，即 `check` 阶段；

`process.nextTick`独立于 `Event Loop` 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 `nextTick` 队列，就会清空队列中的所有回调函数，并且优先于其他 `microtask` 执行。

## 24. Node 的事件循环机制是怎么样的？

```js
┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

node 事件循环机制分为 6 个阶段，它们会按照顺序反复运行：

每个阶段都有一个要执行的回调 FIFO 队列。 尽管每个阶段都有其自己的特殊方式，但是通常，当事件循环进入给定阶段时，它将执行该阶段特定的任何操作，然后在该阶段的队列中执行回调，直到队列耗尽或执行回调的最大数量为止。 当队列已为空或达到回调限制时，事件循环将移至下一个阶段，依此类推。

从上图中，大致看出 node 中的事件循环的顺序：

外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段（按照该顺序反复运行）…

- `timers 阶段`：这个阶段执行 timer（setTimeout、setInterval）的回调。
- `I/O callbacks 阶段`：处理一些上一轮循环中的少数未执行的 I/O 回调。
- `idle, prepare 阶段`：仅 node 内部使用。
- `poll 阶段`：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里。
- `check 阶段`：执行 setImmediate() 的回调。
- `close callbacks 阶段`：执行 socket 的 close 事件回调。

## 25. 下面这段代码的执行结果是什么？

```js
const p1 = new Promise((resolve, reject) => {
  console.log('promise1');
  resolve();
})
  .then(() => {
    console.log('then11');
    new Promise((resolve, reject) => {
      console.log('promise2');
      resolve();
    })
      .then(() => {
        console.log('then21');
      })
      .then(() => {
        console.log('then23');
      });
  })
  .then(() => {
    console.log('then12');
  });

const p2 = new Promise((resolve, reject) => {
  console.log('promise3');
  resolve();
}).then(() => {
  console.log('then31');
});
// promise1 --> promise3 --> then11 --> promise2 --> then31 --> then21 --> then12 --> then23

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

/**
 * 1. script start // 同步任务
 * 2. async1 start // async1函数中的同步任务
 * 3. async2       // async1函数中遇到await先立即执行
 * 4. promise1     // 遇到promise 执行同步任务
 * 5. script end   // 执行外层同步任务
 * 6. async1 end   // 执行微任务中先注册的
 * 7. promise2     // 执行promise中的then 优先级大于setTimeout
 * 8. setTimeout   // 执行setTimeout函数
 * /
```

## 26. javascript 中的原型链是什么？

`JavaScript` 中没有类的概念，主要通过`原型链`来实现`伪继承`。

当我们创建一个对象的时候会生成一个`__proto__`属性，这个内置的 `__proto__` 是一个指向原型对象的`指针`，它会在创建一个新的引用类型对象时（显示或者隐式）自动创建，并挂载到新实例上。

当我们尝试访问实例对象上的某一属性或者方法时，如果实例对象上有该属性或者方法时，就返回实例属性或者方法。

如果没有，就去 `__proto__` 指向的原型对象上查找对应的属性或者方法。这就是为什么我们尝试访问空对象的 `toString` 和 `valueOf` 等方法依旧能访问到的原因，`JavaScript` 正式以这种方式为基础来实现继承的。

**原型对象正是在构造函数被声明时一同创建的。构造函数被申明时，原型对象也一同完成创建，然后挂载到构造函数的 `prototype` 属性上**

原型对象被创建时，会自动生成一个 `constructor` 属性，指向创建它的构造函数。这样它俩的关系就被紧密地关联起来了。

![原型](https://img-blog.csdnimg.cn/20210507150826444.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 27. 什么是原型污染？怎么去解决原型污染？

原型污染是指：攻击者通过某种手段修改 JavaScript 对象的原型。

比如我们把 `Object.prototype.toString` 改成这样：

```js
Object.prototype.toString = function () {
  alert('Hello World');
};
let obj = {};
obj.toString();
```

解决原理污染主要有以下的几个方式：

1. 使用 `Object.create(null)`， 方法创建一个原型为 `null` 的新对象。
2. 使用 `Object.freeze(obj)` 冻结指定对象，使之不能被修改属性，成为不可扩展对象。
3. 建立 `JSON schema` ，在解析用户输入内容时，通过 `JSON schema` 过滤敏感键名。
4. 规避不安全的递归性合并。类似`lodash`的解决方案，完善了合并操作的安全性，对敏感键名跳过处理。

## 28. 什么是闭包？

> 闭包是指一个绑定了执行环境的函数。(或者说是函数内部定义的函数，被返回了出去并在外部调用。)

创建闭包的常见方式，就是在一个函数内部创建另一个函数。

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz(); // 这就形成了一个闭包
```

我们可以简单剖析一下上面代码的运行流程：

1. 编译阶段，变量和函数被声明，作用域即被确定。
2. 运行函数 `foo()`，此时会创建一个 `foo` 函数的执行上下文，执行上下文内部存储了 `foo` 中声明的所有变量函数信息。
3. 函数 `foo` 运行完毕，将内部函数 `bar` 的引用赋值给外部的变量 `baz` ，此时 `baz` 指针指向的还是 `bar` ，因此哪怕它位于 `foo` 作用域之外，它还是能够获取到 `foo` 的内部变量。
4. `baz` 在外部被执行，`baz` 的内部可执行代码 `console.log` 向作用域请求获取 `a` 变量，本地作用域没有找到，继续请求父级作用域，找到了 `foo` 中的 `a` 变量，返回给 `console.log`，打印出 `2`。

## 29.闭包的应用场景都有哪些？

**闭包的应用，大多数是在需要维护内部变量的场景下**。

### 单例模式

> 单例模式是一种常见的设计模式，它保证了一个类只有一个实例。实现方法一般是先判断实例是否存在，如果存在就直接返回，否则就创建了再返回。单例模式的好处就是避免了重复实例化带来的内存开销。

```js
// 单例模式
function Singleton() {
  this.data = 'singleton';
}

Singleton.getInstance = (function () {
  var instance;

  return function () {
    if (instance) {
      return instance;
    } else {
      instance = new Singleton();
      return instance;
    }
  };
})();

var sa = Singleton.getInstance();
var sb = Singleton.getInstance();
console.log(sa === sb); // true
console.log(sa.data); // 'singleton'
```

### 模拟私有属性

在 ES13 之前 js 没有私有属性的写法，我们一般都是通过闭包来模拟，在 ES13 之后我们可以使用#来书写内部的私有变量。

```js
// 模拟私有属性
function getGeneratorFunc() {
  var _name = 'John';
  var _age = 22;

  return function () {
    return {
      getName: function () {
        return _name;
      },
      getAge: function () {
        return _age;
      },
    };
  };
}

var obj = getGeneratorFunc()();
obj.getName(); // John
obj.getAge(); // 22
obj._age; // undefined
```

### 柯里化

> 柯里化（currying），是把接收多个参数的函数变换成接收一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```js
Function.prototype.bind = function (context = window) {
  if (typeof this !== 'function') throw new Error('Error');
  let selfFunc = this;
  let args = [...arguments].slice(1);

  return function F() {
    // 因为返回了一个函数，可以 new F()，所以需要判断
    if (this instanceof F) {
      return new selfFunc(...args, arguments);
    } else {
      // bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以需要将两边的参数拼接起来
      return selfFunc.apply(context, args.concat(arguments));
    }
  };
};
```

## 30.闭包的使用存在什么问题呢？

主要可能存在的问题是`内存泄漏以及降低了代码的可读性`。

## 31.什么是内存泄漏？有哪些可能存在内存泄漏的场景？如何去避免内存泄漏？

> `内存泄漏`指由于疏忽或错误造成程序未能释放已经不再使用的内存，从而造成了内存的浪费。

### 内存泄漏的场景

1. 无意的全局变量声明

早期代码使用 var 声明居多，在不书写 var 关键字的时候，变量会生成到全局环境中，造成无意识的泄漏。

2. 被遗忘的计时器和未被销毁的音视频资源。

3. 被遗忘的 DOM 事件监听或者是匿名的事件监听函数。

4. 被遗忘的 ES6 Set 成员

5. 被遗忘的 ES6 Map 键名

### 避免内存泄漏的手段

1. 使用严格模式，避免不经意间的全局变量泄露

```js
'use strict';

function foo() {
  b = 2;
}

foo(); // ReferenceError: b is not defined
```

2.关注 DOM 生命周期，在销毁阶段记得解绑相关事件：

```js
const wrapDOM = document.getElementById('wrap');
wrapDOM.onclick = function (e) {
  console.log(e);
};

// some codes ...

// remove wrapDOM
wrapDOM.onclick = null;
wrapDOM.parentNode.removeChild(wrapDOM);
```

3.避免过度使用闭包

4. 使用 WeakSet、WeakMap 等方式。

## 32.除了上述的场景还有其他途径可以去排查内存泄漏的问题么？

有的，主要是通过像`Chrome`自身提供的`Performance`插件来检查是否存在内存泄漏。

打开 Chrome 浏览器控制台，选择`Performance`选项，点击左侧`reload`图标。

![Performance](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ad95e570f854f62a5affae73899dfaf~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

`Performance`面板可以记录和分析页面在运行时的所有活动。

我们可以选择左下角的`JS Heap`选项，下面展现出来的一条蓝线，就是代表了这段记录过程中，JS 堆内存信息的变化情况。

如果这条蓝线一直成上升趋势，就有可能存在内存泄漏的风险。具体的内存泄漏点的排查这时候就需要使用到开发者工具的 `Memory` 选项了。

![Memory](https://img-blog.csdnimg.cn/20210507140313678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![Memory2](https://img-blog.csdnimg.cn/20210507140336990.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

当生成了第一个快照的时候，开发者工具窗口已经显示了很详细的内存占用情况。

**字段说明:**

|      字段       | 描述                                                           |
| :-------------: | :------------------------------------------------------------- |
|  `Constructor`  | 占用内存的资源类型                                             |
|   `Distance`    | 当前对象到根的引用层级距离                                     |
| `Shallow Size`  | 对象所占内存（不包含内部引用的其它对象所占的内存）(单位：字节) |
| `Retained Size` | 对象所占总内存（包含内部引用的其它对象所占的内存）(单位：字节) |

将每项展开可以查看更详细的数据信息。

我们再次切回网页，继续操作几次，然后再次生成一个快照。

![memory3](https://img-blog.csdnimg.cn/20210507140701423.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory4](https://img-blog.csdnimg.cn/20210507140719316.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory5](https://img-blog.csdnimg.cn/20210507140739301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

这边需要特别注意这个 `#Delta` ，如果是正值，就代表新生成的内存多，释放的内存少。其中的闭包项，如果是正值，就说明存在内存泄漏。

![memory6](https://img-blog.csdnimg.cn/20210507140819194.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

下面我们到代码里找一个内存泄漏的问题：

![memory7](https://img-blog.csdnimg.cn/20210507141448924.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory8](https://img-blog.csdnimg.cn/20210507141509447.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 33. JavaScript 是如何运行的？

JS 代码->解析成 AST (期间伴随词法分析、语法分析)->生成字节码（V8）->生成机器码（编译器）

## 34. JavaScript 中的数组和函数在内存中是如何存储的？

- 数组，主要是以**连续内存形式存储的 FixedArray、以哈希表形式存储的 HashTable**。
- 函数属于引用数据类型，存储在堆中，在栈内存中只是存了一个地址来表示对堆内存中的引用。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

## 35. ES6 Modules 相对于 CommonJS 的优势是什么？

- `CommonJS`和`ES6 Module`都可以对引入的对象进行赋值，即对对象内部属性的值进行改变；
- `CommonJS` 模块输出的是一个`值的拷贝`，ES6 模块输出的是`值的引用`。即`ES6 Module`只存只读，不能改变其值，具体点就是`指针指向不能变`；
- `CommonJS` 模块是`运行时加载`，ES6 模块是`编译时输出接口`。
- `CommonJS` 模块的`require()`是`同步加载`模块，ES6 模块的`import`命令是`异步加载`，有一个独立的模块依赖的解析阶段。
- `import` 的接口是 `read-only（只读状态）`，不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部指针指向。
- `CommonJS` 可以重新赋值（改变指针指向），但是对 `ES6 Module` 赋值会编译报错。

## 36. JavaScript 中的 const 数组可以进行 push 操作吗？为什么？

可以，也可以进行`splice()`操作。

`const` 声明创建一个值的只读引用，声明的`基础类型`是不能修改的，只是变量标识符不能重新分配。

例如，在引用内容是对象的情况下，这意味着可以改变对象的内容（例如，其参数）。

## 37. JavaScript 有哪些数据类型？

主要是分为`基础类型`和`引用类型`2 大块。

### 基础类型

- String
- Number
- Boolean
- Symbol
- BigInt
- undefined
- null

### 引用类型

- Object
- Array
- Function

## 38. Object.defineProperty 和 ES6 的 Proxy 有什么区别？

### Proxy

- 监听的是整个对象而不是属性。
- 可以监听数组的变化。
- 内部提供了多种拦截方法，类似 ownKeys、deleteProperty、has 等。
- 返回的是一个新的对象，我们可以只操作新的对象达到目的，而 `Object.defineProperty` 只能遍历对象属性直接修改。
- 是新一代的厂商支持标准。

### Object.defineProperty

- 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历，性能较差。
- 兼容性较好。
- 不能够监听数组，无法监控到数组下标的变化，导致通过数组下标添加元素，无法实时响应。
- 不能对 es6 新产生的 `Map`、`Set` 这些数据结构做出监听。
- 不能监听新增和删除操作，通过 `Vue.set()` 和 `Vue.delete` 来实现响应式的。

## 39. TypeScript 中同名的 interface 或者同名的 interface 和 class 可以合并吗？

同名`interface`接口会自动合并，`interface`同名的`class`也会自动聚合。 但`type`不能自动聚合，因为`type`声明不能重名。

## 40. 谈谈你对 SourceMap 的理解？

`sourceMap`就是一个信息文件，里面储存着打包前的位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。有了它，出错的时候，浏览器控制台将直接显示原始代码出错的位置，而不是转换后的代码，点击出错信息将直接跳转到原始代码位置。方便定位和解决问题。

一般在项目中都是生产环境的打包会同步开启而在开发环境下会关闭。

## 41. React 为什么要用合成事件？

**一方面是出于`性能`和`复用性`来考虑。**

`React` 作为一套 `View` 层面的 `UI` 框架，通过渲染得到 `vDOM`，再由 `fiber` 算法决定 `DOM` 树哪些结点需要新增、替换或修改，假如直接在 `DOM` 节点插入原生事件监听，则会导致频繁的调用 `addEventListener` 和 `removeEventListener`，造成性能的浪费。

所以 `React` 采用了`事件代理`的方法，对于大部分事件而言都在 `document`(17 之前) 上做监听，然后根据 `Event` 中的 `target` 来判断事件触发的节点。 通过`队列`的形式，从触发的组件向父组件回溯，然后调用他们 `JSX` 中定义的 `callback`。

其次 `React` 合成的 `SyntheticEvent` 采用了`池`的思想，从而达到节约内存，避免频繁的创建和销毁事件对象的目的。这也是如果我们需要异步使用一个 `syntheticEvent`，需要执行 `event.persist()`才能防止事件对象被释放的原因。

最后在 `React` 源码中随处可见 `batch` 做批量更新，基本上凡是可以批量处理的事情（最普遍的 `setState`）`React` 都会将中间过程保存起来，留到最后面才 `flush` 掉。就如浏览器对 `DOM`树进行 `Style`，`Layout`，`Paint` 一样，都不会在操作 `ele.style.color='red';`之后马上执行，只会将这些操作打包起来并最终在需要渲染的时候再做渲染。

而对于复用来说，`React` 看到在不同的浏览器和平台上，用户界面上的事件其实非常相似，例如普通的 `click`，`change` 等等。`React` 希望通过封装一层事件系统，将不同平台的原生事件都封装成 `SyntheticEvent`。这样做的好处主要有以下两点:

1. 使得不同平台只需要通过加入 `EventEmitter` 以及对应的 `Renderer` 就能使用相同的一个事件系统，`WEB` 平台上加入 `ReactBrowserEventEmitter`，`Native` 上加入 `ReactNativeEventEmitter`。如下图，对于不同平台，`React(16)` 只需要替换掉左边部分，而右边 `EventPluginHub` 部分可以保持复用。![EventEmitter](https://img-blog.csdnimg.cn/20200218115403227.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

2. 而对于不同的浏览器而言，`React` 帮我们统一了事件，做了浏览器的兼容，例如对于 `transitionEnd`,`webkitTransitionEnd`,`MozTransitionEnd` 和 `onTransitionEnd`, `React` 都会集合成 `topAnimationEnd`，所以我们只用处理这一个标准的事件即可。

- 另一方面，由于 `fiber` 机制的特点，生成一个 `fiber` 节点时，它对应的 `dom` 节点有可能还未挂载，`onClick` 这样的事件处理函数作为 `fiber` 节点的 `prop`，也就不能直接被绑定到真实的 `DOM` 节点上。

为此，`React` 提供了一种**顶层注册，事件收集，统一触发**的事件机制。

## 42. 什么是顶层注册，事件搜集和统一触发？

### 顶层注册

所谓`顶层注册`，其实是在 `root` 元素上绑定一个统一的事件处理函数。表现在 `React` 中就是在我们那个`<div id="root" />`这个元素上进行注册。

### 事件收集

指的是事件触发时（**实际上是 root 上的事件处理函数被执行**），构造`合成事件对象`，按照冒泡或捕获的路径去组件中收集真正的事件处理函数。

### 统一触发

发生在收集过程之后，对所收集的事件逐一执行，并共享同一个合成事件对象。

在 `React17` 之后还带来了两个非常重要的特性：

1. 对事件进行归类，可以在事件产生的任务上包含不同的优先级

2. 提供合成事件对象，抹平浏览器的兼容性差异

## 43. 为什么 17 之前每个页面都需要 import React from 'react';?

`JSX`在编译时会被`Babel`编译为`React.createElement`方法。

如果不显示声明的话，在运行时该模块内就会报未定义变量 `React` 的错误。

而在 `React17`之后，新的 jsx 编译会从`react/jsx-runtime`包中引入，不需要在每个页面再手动去`import`。

```js
// React 17 之前
import React from 'react';

function App() {
  return <div>app</div>;
}

// 编译后
React.createElement('div', {});

// React 17 之后
import { jsx as _jsx } from 'react/jsx-runtime';

function App() {
  return _jsx('div', { children: 'app' });
}
```

## 44. 装箱和拆箱是什么?

- 装箱转换：把`基本类型`转换为对应的`包装类型`。
- 拆箱操作：把`引用类型`转换为`基本类型`。

### 自动装箱和拆箱

`原始类型`是不能扩展属性和方法，那么我们是如何使用`原始类型`调用方法的呢？

**每当我们操作一个基础类型时，后台就会自动创建一个包装类型的对象，从而让我们能够调用一些方法和属性，例如下面的代码**：

```js
const name = 'Linda';
const name2 = name.substring(2);
```

上述代码的执行过程:

1. 创建一个 `String` 的包装类型实例.
2. 在实例上调用 `substring` 方法.
3. 销毁实例.

也就是说，我们使用`基本类型调用方法`，就会自动进行 `装箱` 和 `拆箱` 操作，相同的，我们使用 `Number` 和 `Boolean` 类型时，也会发生这个过程。

## 45. valueOf 和 toString 有什区别?

- 引用类型转换为 `Number` 类型，先调用 `valueOf`，再调用 `toString`。
- 引用类型转换为 `String` 类型，先调用 `toString`，再调用 `valueOf`。

若 `valueOf` 和 `toString` 都不存在，或者没有返回基本类型，则抛出 `TypeError` 异常。

## 46. 如何实现 a == 1 && a == 2 && a == 3?

- a 为对象（object），重写 valueOf / toString 方法
- a 为数组（array），重写 join 方法
- a 为代理（proxy），构造 get 捕获器

```js
// 场景1
let a = {
  i: 1,
  valueOf() {
    return this.i++;
  },
};

let a = {
  i: 1,
  toString() {
    return this.i++;
  },
};

var value = 1;
Object.defineProperty(window, 'a', {
  get() {
    return this.value++;
  },
});

// 场景2
let a = [1, 2, 3];
a.toString = a.shift;

let a = {
  value: [1, 2, 3],
  valueOf: function () {
    return this.value.shift();
  },
};

// 场景3
let a = new Proxy(
  { v: 1 },
  {
    get(target, property, receiver) {
      // 隐式转换会调用 Symbol.toPrimitive，这是一个函数
      if (property === Symbol.toPrimitive) {
        // 函数属性，所以要返回一个函数，会被自动执行
        return () => target.v++;
      }
    },
  },
);
```

## 47. ES6 有哪些常用的特性？

- let 和 const
- 类 class 和 extends
- 箭头函数
- 函数默认参数
- 模板字符串
- 解构赋值
- ES 模块标准化
- 扩展操作符
- Promise
- Set 与 WeakSet
- Proxy 与 Reflect

### ES7

- Array.prototype.includes()
- 幂运算符\*\*

### ES8

- async 与 await
- Object.values()
- Object.entries()
- padStart()、padEnd()

### ES9

- for await...of
- 正则表达式反向(lookbehind)断言
- 对象扩展操作符
- Promise.prototype.finally()

### ES10

- Array.prototype.flat()
- String.prototype.trimStart() / trimLeft() / trimEnd() / trimRight()
- Object.fromEntries()把键值对列表转换为一个对象
- String.prototype.matchAll
- BigInt
- globalThis

### ES11

- Promise.allSettled 解决了 Promise.all 的时候，如果其中某个任务出现异常(reject)，所有任务都会挂掉，Promise 直接进入 reject 状态。
- 可选链语法
- 空值合并运算符

### ES12

- String.prototype.replaceAll
- Promise.any
- WeakRef
- 数字分隔符

### ES13

- 类的公共属性、私有属性、静态属性
- 顶级的 await
- Array.at()
- error.cause

## 48. let 编译成 ES5 之后是如何保持块级作用域的?

主要使用了闭包。

```js
// ES6
const result = [];
(function () {
  for (let i = 0; i < 5; i++) {
    result.push(function () {
      console.log(i);
    });
  }
})();
result.forEach(function (item) {
  item();
}); // => 0,1,2,3,4

// 编译后
('use strict');

var result = [];
(function () {
  var _loop = function _loop(i) {
    result.push(function () {
      console.log(i);
    });
  };

  for (var i = 0; i < 5; i++) {
    _loop(i);
  }
})();

result.forEach(function (item) {
  item();
});
```

## 49. 如何去实现自定义的模板字符串？

主要是通过正则去匹配对应的变量以及调用 eval 函数去将实际的变量赋值。

## 50. 扩展操作符有是什么缺陷？

只能应用于部署了`Interator`迭代器的对象(字符串、数组)。

## 51. 这里说到了 Promise，都有哪些状态？

总共有 3 种状态，分别是:

- Pending
- FullFiled
- Rejected

一但 `Promise` 被 `resolve` 或 `reject`，不能再迁移至其他任何状态（即状态 immutable）。

```js
new Promise((resolve, reject) => {
  resolve('success');
  // 无效
  reject('reject');
});
```

## 52.常用的 Promise 都有哪些方法？

- Promise.then
- Promise.all
- Promise.allSettled
- Promise.any
- Promise.finally
- Promise.resolve
- Promise.reject
- Promise.race

## 52. 能手写实现一个 Promise 么？

```js
class _Promise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.callbacks = [];

    // 初始化构造函数
    executor(this.resolve, this.reject);
  }

  resolve = (value) => {
    // 只转化pending状态
    if (this.status == 'pending') {
      this.status = 'fulfilled';
      this.value = value;
      this.callbacks.forEach((fn) => {
        fn && fn(value);
      });
    }
  };

  reject = (value) => {
    // 只转化pending状态
    if (this.status == 'pending') {
      this.status = 'rejected';
      this.value = value;
      this.callbacks.forEach((fn) => {
        fn && fn(value);
      });
   }

  // PromiseA+ 接收2个参数onFulfilled, onRejected
  then = (onFulfilled, onRejected) => {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    onRejected = typeof onRejected === 'function' ? onRejected : null;

    // 返回新的promise以实现链式调用
    const newPromise = (() => {
      return new _Promise((resolve, reject) => {
        const handle = () => {
          if (this.status === 'fulfilled') {
            // promiseA+规范使用setTimeout来模拟微任务 MDN上还有个queueMicrotask
            setTimeout(() => {
              const x = onFulfilled && onFulfilled(this.value);
              this.resolvePromise(newPromise, x, resolve, reject);
            }, 0);
          }

          if (this.status === 'rejected') {
            setTimeout(() => {
              if (onRejected) {
                const x = onRejected(this.value);
                this.resolvePromise(newPromise, x, resolve, reject);
              } else {
                reject(this.value);
              }
            }, 0);
          }
        };

        if (this.status === 'pending') {
          this.callbacks.push(handle);

          return;
        }

        handle();
      });
    })();

    return newPromise;
  };

  catch = (err) => {
    return this.then(null, err);
  };

  resolvePromise = (newPromise, x, resolve, reject) => {
    if (newPromise === x) {
      return this.reject(new TypeError('返回值不能为同一个Promise对象'));
    }
    // 如果返回值也是一个promise
    if (x instanceof _Promise) {
      x.then(resolve, reject);
    }
    // 如果 x 是对象或者函数执行 if 里面的逻辑
    if ((x && typeof x === 'object') || typeof x === 'function') {
      const { then } = x;
      if (typeof then === 'function') {
        let called = false;
        // 递归取对象里面的value
        then.call(
          x,
          (next) => {
            if (called) return;

            called = true;
            this.resolvePromise(newPromise, next, resolve, reject);
          },
          (err) => {
            if (called) return;

            called = true;
            reject(err);
          },
        );
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  };

  // 实现静态resolve方法
  static resolve = (value) => {
    if (value instanceof _Promise) {
      return value;
    }

    return new _Promise((resolve) => {
      resolve(value);
    });
  };

  // 实现静态reject方法
  static reject = (reason) => {
    return new _Promise((resolve, reject) => {
      reject(reason);
    });
  };

  // 实现finally
  // 不管是resolve还是reject最终都会执行finally的代码
  finally = (fn) => {
    return this.then(
      (value) => {
        return _Promise.resolve(fn()).then(() => value);
      },
      (err) => {
        return _Promise.resolve(fn()).then(() => {
          throw err;
        });
      },
    );
  };

  // 实现all方法
  // 等待所有方法执行完成后resolve
  static all = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const res = [];
    const len = arr.length;
    let count = 0;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          arr[i].then((value) => {
            res[i] = value;
            count++;
            if (count == len) {
              resolve(res);
            }
          }, reject);
        } else {
          count++;
          res[i] = arr[i];
          if (count === len) resolve(res);
        }
      }
    });
  };

  // 实现race
  // 当给定的promise中某一个完成后即resolve
  static race = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const len = arr.length;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          arr[i].then(resolve, reject);
        } else {
          resolve(arr[i]);
        }
      }
    });
  };

  // 实现allSellted方法
  // ES11出现，解决使用 Promise.all 的时候，如果其中某个任务出现异常(reject)，所有任务都会挂掉，Promise 直接进入 reject 状态。
  static allSellted = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const res = [];
    const len = arr.length;
    let count = 0;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          const process = (index, status, value) => {
            res[index] = { status, value };
            count++;
            if (count == len) {
              resolve(res);
            }
          };
          arr[i].then(
            (value) => {
              process(i, 'fullfilled', value);
            },
            (reason) => {
              process(i, 'rejected', reason);
            },
          );
        } else {
          count++;
          res[i] = {
            status: 'fulfilled',
            value: arr[i],
          };
          if (count === len) resolve(res);
        }
      }
    });
  };

  // 实现any
  // ES12中出现，类似Promise.race，只要给定的迭代中的任何一个 promise 成功，就采用第一个 promise 的值作为它的返回值，但与 Promise.race 的不同之处在于——它会等到所有 promise 都失败之后，才返回失败的值。
  static any = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const len = arr.length;
    let errorCount = 0;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          arr[i].then(resolve, (err) => {
            errorCount++;
            if (errorCount === len) {
              reject('AggregateError: All promises were rejected');
            }
          });
        } else {
          resolve(arr[i]);
        }
      }
    });
  };
}
}
```

## 53. this 是什么？箭头函数中的 this 和普通函数的有什么区别?

js 代码执行的时候会生成一个执行上下文和对应的 this，this 指向的是代码在执行时的上下文环境。

### this 指向

- 普通函数中的 this 跟运行时的环境有关。
- 箭头函数中的 this 在声明的时候就已经确定了 this 的指向。

### 构造函数和参数

- 箭头函数没有自己的 this，也没有`arguments对象`，因此`call()`、`apply()`、`bind()`这些去改变 `this` 指向的方法对箭头函数也是无效的。
- 箭头函数也不能当做构造函数使用。

## 54. js 中的 new 操作符是干什么用的？如何自定义实现一个 new 操作符?

**new 运算符用于创建一个用户定义的对象类型的实例或具有构造函数的内置对象。**

通过 new 操作符实例化出来的对象可以访问到父类中的属性和方法。

### 执行过程

1. 首先创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

### 自定义实现

```js
function myNew() {
  const obj = Object.create(null);
  // Array.prototype.call(arguments)
  const Constructor = [].shift().call(arguments);

  obj.__proto__ = Constructor.prototype;

  const ret = Constructor.apply(obj, arguments);

  return typeof ret === 'object' ? ret : obj;
}
```

## 55.怎么理解 js 中的执行环境和作用域?

### 执行环境

`执行环境`定义了变量或函数有权访问的其他数据，决定了它们各自的行为。

每个执行环境都有一个与之关联的`变量对象（variable object）`，环境中定义的所有`变量`和`函数`都保存在这个对象中。虽然我们编写的代码无法访问这个对象，但解析器在处理数据时会在后台使用它。

- 全局执行环境

一个程序中只会存在一个全局上下文，它在整个 `javascript` 脚本的生命周期内都会存在于执行堆栈的最底部不会被栈弹出销毁。全局上下文会生成一个全局对象（以浏览器环境为例，这个全局对象是 window），并且将 `this` 值绑定到这个全局对象上。

- 函数执行环境

每当一个函数被调用时，都会创建一个新的函数执行上下文（不管这个函数是不是被重复调用的）。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

- Eval 函数执行上下文

执行在 eval 函数内部的代码也会有它属于自己的执行上下文。

### 执行上下文

当 JavaScript 代码执行一段`可执行代码(executable code)`时，会创建对应的`执行上下文(execution context)`。

对于每个执行上下文，都有三个重要属性：

1. 变量对象(Variable Object，VO)
2. 作用域链(Scope chain)
3. this

变量对象构建的过程中会触发变量和函数的声明提升。

函数内部代码执行时，会先访问本地的变量对象去尝试获取变量，找不到的话就会攀爬作用域链层层寻找，找到目标变量则返回，找不到则 `undefined`。

### 作用域链

作用域链是由`多个执行上下文`的`变量对象`构成的`链表`。

作用域链的用途，是保证对执行环境有权访问的所有变量和函数的有序访问。

## 56. 作用域链是如何创建和更新的?

### 函数的创建

函数的作用域在函数定义的时候就决定了。

是因为函数有一个内部属性 `[[scope]]`，当函数创建的时候，就会保存所有父变量对象到其中，我们可以理解 `[[scope]]` 就是所有父变量对象的层级链，**但是注意：`[[scope]]` 并不代表完整的作用域链！**

举个例子：

```js
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的`[[scope]]`为：

```js
foo[[scope]] = [globalContext.VO];

bar[[scope]] = [
  // Activive Object
  fooContext.AO,
  globalContext.VO,
];
```

### 函数激活

当函数激活时，进入函数上下文，创建 `VO/AO` 后，就会将活动对象添加到作用链的前端。

这时候执行上下文的作用域链，我们命名为 Scope：

```js
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

## 57.如何创建和延长作用域链呢？

### 延长作用域链

我们可以在作用域链的前端临时增加一个变量对象，该变量对象会在代码执行后被移除。

1. try-catch 语句的 catch 块；
2. with 语句。

### 创建作用域链

1. 定义函数，创建函数作用（推荐）：
2. 使用 let 和 const 创建块级作用域（推荐）：
3. try catch 创建作用域（不推荐），err 仅存在于 catch 子句中：
4. 使用 eval “欺骗” 词法作用域（不推荐）：
5. 使用 with 欺骗词法作用域（不推荐）：

## 58. js 如何判断一个变量的类型以及如何判断一个对象是另一个对象的实例?

- 判断基本类型的情况下我们可以使用 `typeof` 来判断。
- 而使用 `typeof` 判断引用类型的时候返回的都是 `object`
- 我们使用 `instanceof` 判断一个对象是否是另外一个对象的实例
- 可以使用`Object.prototype.toString.call()`来判断完整的类型

## 59. typeof 的底层原理是如何实现的?

js 在底层存储变量的时候，会在`变量的机器码的低位 1-3 位`存储其类型信息:

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

但是对于 `undefined` 和 `null` 来说，这两个值的信息存储是有点特殊的。

- null：所有机器码均为 0.
- undefined：用 −2^30 整数来表示.

所以，`typeof` 在判断 `null` 的时候就出现问题了，由于 `null` 的所有机器码均为 0，因此直接被当做了对象来看待。

## 60. 如何自定义实现一个 instanceof 呢?

通过原型链来查找的。

```js
function instanceOf(target, original) {
  // 获取取右表达式的 prototype 值
  let originalProto = original.prototype;
  // 获取左边表达式的__proto__
  let objProto = target.__proto__;

  while (true) {
    if (objProto == null) {
      return false;
    }
    if (objProto == originalProto) {
      return true;
    }

    objProto = objProto.__proto__;
  }
}
```

## 61. js 的垃圾回收机制是怎么样的?

JavaScript 具有自动垃圾收集机制，也就是说，执行环境会负责管理代码执行过程中使用的内存。

找出那些不再继续使用的变量，然后释放其占用的内存。为此，垃圾收集器会按照固定的时间间隔(或代码执行中预定的收集时间)，周期性地执行这一操作。

**JavaScript 中最常用的垃圾收集方式是`标记清除`。**

### 标记清除

当变量进入环境(例如，在函数中声明一个变量)时，就将这个变量标记为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到它们。而当变量离开环境时，则将其标记为“离开环境”。

## 62. 垃圾回收机制是谁去回收的？有没有详细了解过内部的回收机制？

大多数的情况下，我们的代码都是跑在 V8 引擎上的，所以由 V8 引擎去回收。

### 垃圾回收策略

主要是基于分代式垃圾回收机制，其根据对象的存活时间将内存分为两个生代：`新生代`和`老生代`，然后对不同的分代采用不同的垃圾回收算法。

- `新生代(new_space)`：大多数的对象开始都会被分配在这里，这个区域相对较小但是垃圾回收特别频繁，该区域被分为两半，一半用来分配内存，另一半用于在垃圾回收时将需要保留的对象复制过来。
- `老生代(old_space)`：新生代中的对象在存活一段时间后就会被转移到老生代内存区，相对于新生代该内存区域的垃圾回收频率较低。老生代又分为老生代指针区和老生代数据区，前者包含大多数可能存在指向其他对象的指针的对象，后者只保存原始数据对象，这些对象没有指向其他对象的指针。
- `大对象区(large_object_space)`：存放体积超越其他区域大小的对象，每个对象都会有自己的内存，垃圾回收不会移动大对象区。
- `代码区(code_space)`：代码对象，会被分配在这里，唯一拥有执行权限的内存区域。
- `map区(map_space)`：存放 Cell 和 Map，每个区域都是存放相同大小的元素，结构简单。

## 63. 如何异步去加载 script 脚本?

我们可以在 `script标签` 中使用 `async` 和 `deffer` 属性进行脚本的异步加载，也可以在使用到的时候进行动态的脚本插入操作。

- 当使用 `async(异步) 模式` 去加载的时候，脚本会和页面的元素同时进行加载，加载的方式是开启了新的线程进行加载。
  - 下载的时候可以进行页面的其他操作，下载完成后就会停止解析并执行，但是并不能保证执行的顺序。
  - 脚本的加载可能在 `DOMContentLoaded` 事件之前执行，也可能在 `DOMContentLoaded` 事件之后执行，这取决于 DOM 内容的多少。
- 当使用 `defef(异步) 模式` 去加载的时候，设置了 `defer` 的 `script` 标签，则会按照顺序执行所有的 script，且脚本会在文档渲染完毕后，`DOMContentLoaded事件`调用前执行。

## 64. 前端的路由实现都有哪些方式？

主要有 `Hash模式` 和 `History` 模式两种。

## 65. 两者分别是什么？有什么区别？

它们的区别最明显的就是 `hash` 会在浏览器地址后面增加`#号`，而 `history` 可以自定义地址。

### hash

在使用 hash 模式的时候还需要注意以下几个点:

1. `hash`也称为`散列值`或者`锚点`，本身是用来做页面跳转定位的。如 `http://localhost/index.html#abc`，这里的`#abc`就是 `hash`；

2. `hash` 值是不会随请求发送到服务器端的，所以改变 `hash`，不会重新加载页面；

3. 监听 `window` 的 `hashchange` 事件，当散列值改变时，可以通过 `location.hash` 来获取和设置 `hash`值；

4. `location.hash` 值的变化会直接反应到浏览器地址栏；

```js
class Router {
  constructor() {
    this.routers = []; // 存放我们的路由配置
  }

  add(route, callback) {
    this.routers.push({
      path: route,
      render: callback,
    });
  }

  listen(callback) {
    window.onhashchange = this.hashChange(callback);
    this.hashChange(callback)(); // 首次进入页面的时候不会触发hashchange，因此单独调用一下
  }

  hashChange(callback) {
    let self = this;
    return function () {
      let hash = location.hash;

      for (let i = 0; i < self.routers.length; i++) {
        let route = self.routers[i];
        if (hash === route.path) {
          callback(route.render());
          return;
        }
      }
    };
  }
}

let router = new Router();

router.add('#index', () => {
  return '<h1>这是首页内容</h1>';
});

router.add('#news', () => {
  return '<h1>这是新闻内容</h1>';
});

router.add('#user', () => {
  return '<h1>这是个人中心内容</h1>';
});

router.listen((renderHtml) => {
  let app = document.getElementById('app');
  app.innerHTML = renderHtml;
});
```

### history

`history` 模式基于 `window.history` 对象的方法，它表示当前窗口的浏览历史。当发生改变时，只会改变页面的路径，不会刷新页面。

`History` 对象保存了当前窗口访问过的所有页面网址。通过 `history.length` 可以得出当前窗口一共访问过几个网址。

浏览器工具栏的前进和后退按钮，其实就是对 `History` 对象进行操作。

- 属性

  History 对象主要有两个属性。

  1. History.length：当前窗口访问过的网址数量（包括当前网页）
  2. History.state：History 堆栈最上层的状态值

  ```js
  // 当前窗口访问过多少个网页
  history.length; // 1

  // History 对象的当前状态
  // 通常是 undefined，即未设置
  history.state; // undefined
  ```

- 方法

  History 对象主要有以下几个方法:

  1. History.back()
  2. History.forward()
  3. History.go()

  这三个方法都是用来控制页面在历史记录间跳转。

- History.back()

  回退到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效果。

- History.forward()

  前进到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效果。

- History.go()

  接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为 0，相当于刷新当前页面。

  ```js
  history.back();
  history.forward();
  history.go(1); //相当于history.forward()
  history.go(-1); //相当于history.back()
  history.go(0); // 刷新当前页面
  ```

在 `HTML5` 中，`window.history` 对象得到了扩展，新增的 `API` 包括：

- history.pushState(data[,title][,url]);

- history.replaceState(data[,title][,url]);

- history.state;

- window.onpopstate;

### history.pushState(data[,title][,url])

向历史记录中追加一条记录。`pushState()` 方法不会触发页面刷新，只是导致 `History` 对象发生变化，地址栏会有变化。

该方法接受三个参数，依次为：

- `data`：是一个对象，通过 `pushState` 方法可以将该对象内容传递到新页面中。如果不需要这个对象，此处可以填 `null`。

- `title`：指标题，几乎没有浏览器支持该参数，传一个空字符串比较安全。

- `url`：新的网址，必须与当前页面处在同一个域。不指定的话则为当前的路径，如果设置了一个跨域网址，则会报错。

```js
var data = { foo: 'bar' };
history.pushState(data, '', '2.html');
console.log(history.state); // {foo: "bar"}
```

### history.replaceState()

替换当前页在历史记录中的信息，用法与 `pushState()` 方法一样。

```js
history.pushState({ page: 1 }, '', '?page=1');
// URL 显示为 http://example.com/example.html?page=1

history.pushState({ page: 2 }, '', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({ page: 3 }, '', '?page=3');
// URL 显示为 http://example.com/example.html?page=3

history.back();
// URL 显示为 http://example.com/example.html?page=1

history.back();
// URL 显示为 http://example.com/example.html

history.go(2);
// URL 显示为 http://example.com/example.html?page=3
```

### history.state

我们可以通过该属性，得到当前页的 `state` 信息。

### window.onpopstate 事件

每当 `history` 对象出现变化时，就会触发 `popstate` 事件。

- 仅仅调用 `pushState()` 方法或 `replaceState()` 方法 ，并不会触发该事件;
- 只有当用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用 `history.back()`、`history.forward()`、`history.go()`方法时才会触发。
- 另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。
- 页面第一次加载的时候，浏览器不会触发 `popstate` 事件。

在使用的时候，监听函数中可传入一个 `event` 对象，`event.state` 即为通过 `pushState()` 或 `replaceState()` 方法传入的 `data` 参数:

```js
window.addEventListener('popstate', function (e) {
  // e.state 相当于 history.state
  console.log('state: ' + JSON.stringify(e.state));
  console.log(history.state);
});
```

`history` 模式原理可以这样理解，首先我们要改造我们的超链接，给每个超链接增加 `onclick` 方法，阻止默认的超链接跳转，改用 `history.pushState` 或 `history.replaceState` 来更改浏览器中的 `url`，并修改页面内容。

由于通过 `history` 的 `api` 调整，并不会向后端发起请求，所以也就达到了前端路由的目的。

如果用户使用浏览器的前进后退按钮，则会触发 `window.onpopstate` 事件，监听页面根据路由地址修改页面内容。

```js
class Router {
  constructor() {
    this.routers = [];
    this.renderCallback = null;
  }

  add(route, callback) {
    this.routers.push({
      path: route,
      render: callback,
    });
  }

  pushState(path, data = {}) {
    window.history.pushState(data, '', path);
    this.renderHtml(path);
  }

  listen(callback) {
    this.renderCallback = callback;
    this.changeA();
    window.onpopstate = () => this.renderHtml(this.getCurrentPath());
    this.renderHtml(this.getCurrentPath());
  }

  changeA() {
    document.addEventListener('click', (e) => {
      if (e.target.nodeName === 'A') {
        e.preventDefault();
        let path = e.target.getAttribute('href');
        this.pushState(path);
      }
    });
  }

  getCurrentPath() {
    return location.pathname;
  }

  renderHtml(path) {
    for (let i = 0; i < this.routers.length; i++) {
      let route = this.routers[i];
      if (path === route.path) {
        this.renderCallback(route.render());
        return;
      }
    }
  }
}

let router = new Router();

router.add('/index', () => {
  return '<h1>这是首页内容</h1>';
});

router.add('/news', () => {
  return '<h1>这是新闻内容</h1>';
});

router.add('/user', () => {
  return '<h1>这是个人中心内容</h1>';
});

router.listen((renderHtml) => {
  let app = document.getElementById('app');
  app.innerHTML = renderHtml;
});
```

### 两者之间的区别

1. hash 模式不够优雅，链接上会带#，history 模式较优雅。
2. pushState 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改#后面的部分，故只可设置与当前同文档的 URL。
3. pushState 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发记录添加到栈中。
4. pushState 通过 stateObject 可以添加任意类型的数据到记录中；而 hash 只可添加短字符串。
5. pushState 可额外设置 title 属性供后续使用。
6. hash 兼容 IE8 以上，history 兼容 IE10 以上。
7. history 模式需要后端配合将所有访问都指向 index.html，否则用户刷新页面，会导致 404 错误。

## 66. React 用的是哪种类型的路由模式?有哪些常用的组件？

React 用的是 History 模式。

### Router

`Router`的作用是把 `history location` 等路由信息 传递下去。

### Switch

匹配正确的唯一的路由，根据 router 更新流，来渲染当前组件。

### Route

组件页面承载容器。

### Redirect

重定向组件， 如果路由未匹配上，会重定向对应的路由。

## 67. 如何去实现自定义的路由懒加载功能？

如果我们没有用 `umi` 等框架，需要手动配置路由的时候，也许路由会这样配置。

```js
<Switch>
  <Route path={'/index'} component={Index}></Route>
  <Route path={'/list'} component={List}></Route>
  <Route path={'/detail'} component={Detail}></Route>
  <Redirect from="/*" to="/index" />
</Switch>
```

或者用 list 保存路由信息，方便在进行路由拦截，或者配置路由菜单等。

```js
const router = [
  {
    path: '/index',
    component: Index,
  },
  {
    path: '/list',
    component: List,
  },
  {
    path: '/detail',
    component: Detail,
  },
];
```

这种路由框架在访问的时候都会一次性去加载大量的路由，对页面的初始化非常不友好，会延长页面初始化时间，所以我们想用 `asyncRouter` 来按需加载页面路由。

**例如这里基于 `import` 函数实现路由懒加载，因为 `import` 执行会返回一个 `Promise` 作为异步加载的手段。我们可以利用这点来实现 `react 异步加载路由`。**

```js
// 所有待加载的路由
const routerObserveQueue = [];

export const RouterHooks = {
  // 路由加载前
  beforeRouterComponentLoad: function (callback) {
    routerObserveQueue.push({
      type: 'before',
      callback,
    });
  },
  // 路由加载后
  afterRouterComponentLoad: function (callback) {
    routerObserveQueue.push({
      type: 'after',
      callback,
    });
  },
};

// 懒加载路由HOC
export default function AsyncRouter(loadRouter) {
  return class Content extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Component: null,
      };
      // 触发每个路由加载前的钩子函数
      this.dispatchRouterQueue('before');
    }

    dispatchRouterQueue = (type) => {
      const { history } = this.props;
      routerObserveQueue.forEach((item) => {
        if (item.type === type) item.callback(history);
      });
    };

    componentDidMount() {
      if (this.state.Component) return;

      loadRouter()
        .then((module) => module.default)
        .then((Component) =>
          this.setState({ Component }, () => {
            // 触发每个路由加载之后钩子函数
            this.dispatchRouterQueue('after');
          }),
        );
    }

    render() {
      const { Component } = this.state;

      return Component ? <Component {...this.props} /> : null;
    }
  };
}
```

这里的 `asyncRouter` 是一个高级组件，通过将 `()=>import()` 作为加载函数传进来，然后当外部 `Route` 加载当前组件的时候，在`componentDidMount`生命周期函数，加载真实的组件，并渲染组件。

我们还可以写针对路由懒加载状态定制属于自己的路由监听器 `beforeRouterComponentLoad` 和 `afterRouterComponentDidLoaded`。

```js
import AsyncRouter, { RouterHooks } from './asyncRouter.js';

const { beforeRouterComponentLoad } = RouterHooks;
const Index = AsyncRouter(() => import('../src/page/home/index'));
const List = AsyncRouter(() => import('../src/page/list'));
const Detail = AsyncRouter(() => import('../src/page/detail'));

const index = () => {
  useEffect(() => {
    /* 增加监听函数 */
    beforeRouterComponentLoad((history) => {
      console.log('当前激活的路由是', history.location.pathname);
    });
  }, []);

  return (
    <div>
      <div>
        <Router>
          <Meuns />
          <Switch>
            <Route path={'/index'} component={Index}></Route>
            <Route path={'/list'} component={List}></Route>
            <Route path={'/detail'} component={Detail}></Route>
            <Redirect from="/*" to="/index" />
          </Switch>
        </Router>
      </div>
    </div>
  );
};
```

## 68. 为什么团队要选择使用 React？在使用的过程中有没有碰到一些坑？

一个方面是历史代码的原因，二是相对来说我觉得 React 更加具有创造力，且 JSX 的这种写法写起来很舒服。

### 碰到的坑

1. 我们项目使用的版本是 16.8.x 相关的版本，由于一些历史包袱的原因，在维护一些老的页面代码的时候，也就存在了几种不同的处理方式，比如 UNSAFE_componentWillReceiveProps(nextProps) 、UNSAFE_componentWillMount()等 API 以及新版本的 static getDerivedStateFromProps(nextProps, prevState)等，存在着一些业务不统一的问题，后续的方案呢也是内部推从用 Hooks 的方式去代替。

2. 内部也存在着掌握程度不一的现象，对于某些成员比较喜欢使用内联函数，对性能优化这块掌握程度不是特别好，存在着部分多次渲染的性能浪费。

3. 有一些问题在于没有在恰当的生命周期去销毁一些资源。

4. 另外呢主要是组件划分的问题，如何去恰当的组织目录结构和划分组件和功能。

## 69. Hooks 有去了解过么？使用 Hooks 的过程中碰到了哪些问题？

我个人比较喜欢在项目中使用 Hooks 组件，因为这更符合 React 函数式编程的思想。

在内部推崇使用 Hooks 之后也出现了如下的一些问题。

1. 不知道如何在父组件如何调用 Hooks 内部的方法。
   ```js
   useImperativeHandle(ref, () => ({
     focus: () => {
       inputRef.current.focus();
     },
   }));
   ```
2. 变量、Effect、方法等组织顺序比较混乱。

   统一按照变量、方法、effect 的顺序。

3. 对 Hook 的掌握程度欠佳，不能合理的使用 Hook 去优化项目，比如没有使用多个 `useEffect` 实现关注点分离，没有恰当的使用防抖、节流函数。

   **这是因为函数式组件每次渲染结束后，内部的变量都会被释放，重新渲染时所有的变量都会被重新初始化，产生的结果就是每一次都注册和执行了 setTimeout 函数。**

   要想要得到正确的结果，必须以某种方式存储那些会被删除的变量和方法的引用。这里就可以使用`useCallback` 和 `useRef`来实现。

   ```js
   export function useDebounce(fn, delay, dep = []) {
     const { current } = useRef({ fn, timer: null });
     useEffect(() => {
       current.fn = fn;
     }, [fn]);

     return useCallback(function f(...args) {
       if (current.timer) {
         clearTimeout(current.timer);
       }
       current.timer = setTimeout(() => {
         current.fn.call(this, ...args);
       }, delay);
     }, dep);
   }
   ```

## 70. webpack 的动态 import 实现的原理是什么?

主要是 `Promise + JsonP`。

首先`import()`其实是个语法糖，他的本质是`promise`，执行后返回一个`Promise对象`，我们可以在`.then()`里面拿到真正引用的模块。

其次经过 webpack 打包的文件会在`window`下生成一个`webpackJsonp`数组，入口文件会执行`__webpack_require__(index.js)`来引用相对应的文件，入口文件内部会执行`__webpack_require__.e(0)`来拉取异步代码，而我们动态 import 的代码实际上是通过动态创建`script`脚本(类似于 JSONP)的方式被添加到`webpackJsonp`这个数组中在真正使用的地方去`resolve`出来的。

**简单的来说就是通过`动态创建script脚本`并在需要使用的地方执行`Promise`中`.then()`来实现的。**

## 71. typeScript 中的数字枚举的实现原理?

简单的来说是通过`闭包中反向映射`来实现的。

```ts
enum Direction {
  Up = 10,
  Down,
  Left,
  Right,
}

// js
(function (Direction) {
  Direction[(Direction['Up'] = 10)] = 'Up';
  Direction[(Direction['Down'] = 11)] = 'Down';
  Direction[(Direction['Left'] = 12)] = 'Left';
  Direction[(Direction['Right'] = 13)] = 'Right';
})(Direction || (Direction = {}));
```

1. 首先将 `key` 和 `value` 值进行对应 => `Direction["Up"] = 10`;
2. 接着将上一步的值作为`key`，将枚举中设定的 `key` 作为 `value => Direction[Direction["Up"] = 10] = "Up"`;

## 72. 什么是 DOM?

DOM 是 `Document Object Model`（文档对象模型）的缩写。

提供了对 HTML 文档结构化的表述。在`渲染引擎`中，DOM 有三个层面的作用:

1. 从页面的视角来看，DOM 是生成页面的基础数据结构。
2. 从 JavaScript 脚本视角来看，DOM 提供给 JavaScript 脚本操作的接口，通过这套接口，JavaScript 可以对 DOM 结构进行访问，从而改变文档的结构、样式和内容。
3. 从安全视角来看，DOM 是一道安全防护线，一些不安全的内容在 DOM 解析阶段就被拒之门外了。

**简言之，DOM 是表述 HTML 的内部数据结构，它会将 Web 页面和 JavaScript 脚本连接起来，并过滤一些不安全的内容。**

## 73. 什么是虚拟 DOM？

虚拟 DOM 是对真实 DOM 的一种抽象的 Javascript 对象，保留着一些构建真实 DOM 的映射等，没有真实的 DOM 复杂。

## 74. 为什么需要虚拟 DOM?

Vitrual DOM 的优势在于 React 的 Diff 算法 和 批处理策略，React 在页面更新之前，提前计算好了如何进行更新和渲染 DOM。

实际上，这个计算过程我们在直接操作 DOM 时，也是可以自己判断和实现的，但是一定会耗费非常多的精力和时间，而且往往我们自己做的是不如 React 好的。所以，在这个过程中 React 帮助我们提升了性能。

所以，更合适的说法是 Vitrual DOM 帮助我们提高了开发效率，在重复渲染时它帮助我们计算如何更高效的更新，而不是它比 DOM 操作更快。

## 75. 虚拟 DOM 对象有哪些属性值？

至少包含三个值：`标签名（tag）`，`属性（props）`，`子元素对象（children）`。

## 76. 说一说浏览器缓存?

浏览器的缓存机制也就是我们说的 HTTP 缓存机制，其机制是根据 HTTP 报文的缓存标识进行的。

浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识。

浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中。

### 强缓存和协商缓存

浏览器中的缓存主要分为`强缓存`和`协商缓存`。

1. 浏览器进行资源请求时，会判断 `responese header` 是否命中强缓存，如果命中，直接从本地读取缓存，不会发送请求到服务器。

2. 如果未命中强缓存，会发送请求到服务器，判断`协商缓存`是否命中，如果命中的话，服务器会将请求返回(304)，但是不会返回资源，告诉浏览器直接从本地读取缓存。如果不命中，服务器会直接返回资源。

**对于前端浏览器环境来说，缓存读取位置是由先后顺序的，顺序分别是（由上到下寻找，找到即返回；找不到则继续）。**

1. Service Worker

   `Service Worker` 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

   - 浏览器优先查找。
   - 持久存储。
   - 可以更加灵活地控制存储的内容，可以选择缓存哪些文件、定义缓存文件的路由匹配规则等。
   - 可以从 Chrome 的 F12 中，`Application` -> `Cache Storage` 查看。

2. Memory Cache

   `memory cache` 是内存中的缓存存储。

   - 读取速度快。
   - 存储空间较小。
   - 存储时间短，当浏览器的 tab 页被关闭，内存资源即被释放。
   - 如果明确指定了 `Cache-Control` 为 `no-store`，浏览器则不会使用 `memory-cache`。

3. Disk Cache

   `Disk Cache` 是硬盘中的缓存存储。

   - 读取速度慢于 `Memory Cache` ，快于网络请求。
   - 存储空间较大。
   - 持久存储。
   - `Disk Cache` 严格依照 `HTTP` 头信息中的字段来判断资源是否可缓存、是否要认证等。

   经常听到的`强缓存`，`协商缓存`，以及 `Cache-Control` 等，归于此类。

4. 网络请求

   如果一个请求的资源文件均未命中上述缓存策略，那么就会发起网络请求。浏览器拿到资源后，会把这个新资源加入缓存。

## 77. Cache-Control 有哪些类型?

`HTTP/1.1` 定义的 `Cache-Control` 头用来区分对缓存机制的支持情况， 请求头和响应头都支持这个属性。通过它提供的不同的值来定义缓存策略。需要注意的是，数据变化频率很快的场景并不适合开启 `Cache-Control`。

以下是 `Cache-Control` 常用字段的解释:

| 字段             | 说明                                                                                                                                                                                                       |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| public           | 公共缓存：表示该响应可以被任何中间人（比如中间代理、CDN 等）缓存。                                                                                                                                         |
| private          | 私有缓存：表示该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中。                                                                                                         |
| max-age          | （单位/秒）设置缓存的过期时间，过期需要重新请求，否则就读取本地缓存，并不实际发送请求                                                                                                                      |
| s-maxage         | （单位/秒）覆盖 `max-age`，作用一样，只在代理服务器中生效                                                                                                                                                  |
| max-stale        | （单位/秒）表示即使缓存过期，也使用这个过期缓存                                                                                                                                                            |
| no-store         | 禁止进行缓存                                                                                                                                                                                               |
| no-transform     | 不得对资源进行转换或压缩等操作，`Content-Encoding`、`Content-Range`、`Content-Type` 等 `HTTP` 头不能由代理修改（有时候资源比较大的情况下，代理服务器可能会自行做压缩处理，这个指令就是为了防止这种情况）。 |
| no-cache         | 强制确认缓存：即每次使用本地缓存之前，需要请求服务器，查看缓存是否失效，若未过期（注：实际就是返回 304），则缓存才使用本地缓存副本。                                                                       |
| must-revalidate  | 缓存验证确认：意味着缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用                                                                                                             |
| proxy-revalidate | 与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。                                                                                                                          |

**总结**

`强缓存`优先于`协商缓存`进行，若 `强缓存(Expires 和 Cache-Control)` 生效则直接使用缓存，若不生效则进行`协商缓存(Last-Modified / If-Modified-Since 和 Etag / If-None-Match)`。

`协商缓存`由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回 `304`，继续使用缓存，主要过程总结如下：

![缓存总结](https://img-blog.csdnimg.cn/20210624171731113.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 78.说说从输入网址到页面展现的整个过程？

整体的流程图，大致如下所示:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210625093347702.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

整体的步骤总结如下:

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

## 79. 你在你的项目中做过哪些性能优化?

主要从以下几个角度来描述:

### 缓存

1. 通过 localStorage、sessionStorage、indexedDB 等缓存具体一定时效性的数据。

   比如，针对日榜，周榜等更新数据频率固定的列表数据可以考虑放入到本地存储中。

2. 浏览器自身通过内存缓存(Memory Cache)

   一些图片资源等可以走这个缓存。

3. Cache API

   例如使用 Service Worker 拦截请求。

   ```js
   // sw.js
   self.addEventListener('fetch', function (e) {
     // 如果有cache则直接返回，否则通过fetch请求
     e.respondWith(
       caches
         .match(e.request)
         .then(function (cache) {
           return cache || fetch(e.request);
         })
         .catch(function (err) {
           console.log(err);
           return fetch(e.request);
         }),
     );
   });
   ```

4. 走 HTTP 缓存

5. Push Cache

   Push Cache 其实是 HTTP/2 的 Push 功能所带来的。

### 请求

1. 避免多余的重定向。

   该使用 301 的场景就用 301，需要 302 的就用 302。

2. DNS 的预解析

   比如我们要加载另外一个网站下的 CSS 样式表就可以通过 dns-prefetch 去预解析 IP。

   ```html
   <link rel="dns-prefetch" href="//yourwebsite.com" />
   ```

3. 使用 Preconnect 预先建立连接

   建立连接不仅需要 DNS 查询，还需要进行 TCP 协议握手，有些还会有 TLS/SSL 协议，这些都会导致连接的耗时。

   使用 Preconnect 可以帮助我们告诉浏览器：“我有一些资源会用到某个源（origin），你可以帮我预先建立连接。”

   大致流程如下:

   - 首先，解析 Preconnect 的 url；
   - 其次，根据当前 link 元素中的属性进行 cors 的设置；
   - 然后，默认先将 credential 设为 true，如果 cors 为 Anonymous 并且存在跨域，则将 credential 置为 false；
   - 最后，进行连接。

   ```html
   <link rel="preconnect" href="//sample.com" />
   <!-- 设置cors -->
   <link rel="preconnect" href="//sample.com" crossorigin />
   ```

4. 使用 CDN

   对于静态资源，我们可以考虑通过 CDN 来降低时延。

   对于使用 CDN 的资源，DNS 解析会将 CDN 资源的域名解析到 CDN 服务的负载均衡器上，负载均衡器可以通过请求的信息获取用户对应的地理区域，从而通过负载均衡算法，在背后的诸多服务器中，综合选择一台地理位置近、负载低的机器来提供服务。例如为北京联通用户解析北京的服务器 IP。这样，用户在之后访问 CDN 资源时都是访问北京服务器，距离近，速度快。

5. BFF 聚合

   BFF 非常合适做的一件事就是后端服务的聚合。

   如果你有一个两个接口服务：第一个服务是先获取产品信息，再根据产品信息中的上架时间通过第二个服务获取该时间后的产品列表。

   这个业务逻辑如果放在前端（浏览器）处理将会串行发送两个请求。假设每个请求 200ms，那么就需要等待 400ms。

   如果引入 NodeJS，这一层可以放在 NodeJS 中实现。NodeJS 部署的位置一般离其他后端服务“更近”，例如同一个局域网。这类服务间的请求耗时显然更低，可能只需要 200(浏览器) + 30(NodeJS) \* 2 = 260ms。

   此外，如果一个业务需要在前端并发三、四个请求来获取完整数据，那么放在 NodeJS 的 BFF 层也是一个不错的选择。

### 页面解析与处理

1. CSS 放置于 head 中，js 放置于 body 之后。

   根据标准规范，在 JavaScript 中可以访问 DOM。因此当遇到 JavaScript 后会阻塞 DOM 的解析。于此同时，为避免 CSS 与 JavaScript 之间的竞态，CSSOM 的构建会阻塞 JavaScript 的脚本执行。

   **总结来说就是: JavaScript 会阻塞 DOM 构建，而 CSSOM 的构建又会阻塞 JavaScript 的执行。**

   这就是为什么在优化的最佳实践中，我们基本都推荐把 `CSS` 样式表放在 `<head>` 之中（即页面的头部），把 `JavaScript` 脚本放在 `<body>` 的最后（即页面的尾部）。

2. 使用 defer 和 async

   某些不影响主流程的脚本可以使用 defer 和 async 进行异步加载。

3. 页面文档压缩

   例如使用 uglify 压缩 HTML 内容，使用 gzip 对文本进行压缩。

### javascript 优化

1. 代码拆分（code split）与按需加载

   - code split 一般是配合打包工具去做，比如 webpack。

     在日常使用时，最常见的方式就是通过 `dynamic import` 来告诉 `webpack` 去做代码拆分。`webpack` 编译时会进行语法分析，之后遇到 `dynamic import` 就会认为这个模块是需要动态加载的。相应的，其子资源也会被如此处理（除非被其他非动态模块也引用了）。

     在 webpack 中使用代码拆分最常见的一个场景是基于路由的代码拆分。目前很多前端应用都在使用 SPA（单页面应用）形式，或者 SPA 与 MPA（多页面应用）的结合体，这就会涉及到前端路由。而页面间的业务差异也让基于路由的代码拆分成为一个最佳实践。

   - 按需加载一般是某些场景下去动态加载一些脚本等资源。

     ```js
     document.getElementById('btn').addEventListener('click', (e) => {
       // 在这里加载 chat 组件相关资源 chat.js
       const script = document.createElement('script');
       script.src = '/static/js/chat.js';
       document.getElementsByTagName('head')[0].appendChild(script);
     });
     ```

2. 代码压缩

   JavaScript 代码压缩比较常见的做法就是使用 `UglifyJS` 做源码级别的压缩。它会通过将变量替换为短命名、去掉多余的换行符等方式，在尽量不改变源码逻辑的情况下，做到代码体积的压缩。

   在 webpack 的 `production` 模式下是默认开启的；

3. 相应数据进行 gzip

   一般服务器都会内置相应模块来进行 gzip 处理，不需要我们单独编写压缩算法模块。例如在 Nginx 中就包含了 `ngx_http_gzip_module` 模块，通过简单的配置就可以开启。

4. Tree Shaking

   通过打包工具内部将模块中未使用到的代码进行删除。

5. 优化 polyfill 的使用

   例如使用 `Differential Serving` 的技术，通过浏览器原生模块化 API 来尽量避免加载无用 `polyfill`。

   ```js
   <script type="module" src="main.mjs"></script>
   <script nomodule src="legacy.js"></script>
   ```

   这样，在能够处理 module 属性的浏览器（具有很多新特性）上就只需加载 main.mjs（不包含 polyfill），而在老式浏览器下，则会加载 legacy.js（包含 polyfill）。

6. 通过 webpack-bundle-analyzer 分析报体积减少不必要的代码。

7. 避免 Long Task

8. 将基础库代码打包合并

   比如 webpack 中常用的将 React、Redux 这些基础库单独打包出一个文件。

### CSS 优化

1. 关键 CSS

   例如使用骨架屏来生成一个不包含实际功能的静态页面，将必要的脚本、样式、甚至图片（base64）资源都内联到其中，当用户访问时直接先返回该页面，就可以很快让用户看到页面结果，之后在异步渐进加载预渲染，就会让用户感觉“很快”。

2. CSS 的按需加载

3. 合并 CSS 文件

4. 慎用 @import

   使用`@import` 语法来加载外部的样式文件把请求变得串行化。

5. 压缩 CSS

   例如使用 clean-css 进行压缩。

6. 简化选择器

   - 不使用过长的后代(指各类)选择器
   - 不使用过长的层级嵌套(一般不超过 5 级)
   - 可以使用 BEM 的方式来命名选择器

7. 合理使用布局方式

   例如能用 flex 实现就不去考虑 float、postion 定位等方式。

### 图片优化

1. 合理进行图片资源的压缩

   - 使用前通过压缩工具进行压缩
   - 使用时通过 CDN 服务商提供的压缩 API 进行压缩
   - 使用 webp 等方式进行压缩
   - 使用 SVG 替代某些矢量图
   - 使用 video 代替某些 gif
   - 使用渐进式 JPEG

2. 使用 CDN 进行加速

3. 某些场景选择雪碧图

4. 使用 font 库代替某些图标

5. 图片的懒加载

   - 特别是长列表的商品图片懒加载。
   - 通过 CSS 的 background-url 进行懒加载，在使用到的时候去请求图片。

### 运行时优化

1. 避免强制同步布局

   首先你需要知道的是，显示器有一个自己的刷新频率，例如每秒 60 次（60 FPS）。这就意味着，每过 16.6ms，浏览器就会将截止上次刷新后的元素变动应用到屏幕上。

   ![渲染管线](https://alienzhou.com/projects/fe-performance-journey/assets/img/pipeline.dc48e4bd.jpg)

   在渲染管线中，有一步叫做 Layout，也就是布局。它会计算元素的大小、位置信息，而且一处的改动几乎会影响到整个文档页面。所以 Layout 的消耗是非常巨大的。

   比如下面这段代码:

   ```js
   var $ele = document.getElementById('main');
   var height = $ele.offsetHeight;
   ```

   上述代码获取了元素的 offsetHeight 值，浏览器此时会使用上一次渲染后的缓存值进行返回，所以浏览器消耗并不大。

   而有一些 JavaScript 操作会导致浏览器需要提前执行布局操作，这种操作就被称为`强制同步布局`。我们把上面的代码改成如下所示：

   ```js
   var $ele = document.getElementById('main');
   $ele.classList.remove('large');
   var height = $ele.offsetHeight;
   ```

   由于我们在修改元素的 className 后又立刻获取了它的高度，为了保证高度值正确，浏览器会立即进行布局，然而我们的本意可能并非如此 —— 也许 large 并不会影响高度，也许我们只是想获取上一帧的结果……

   针对这种目的，下面的写法会更合适，同时可以避免强制同步布局。

   ```js
   var $ele = document.getElementById('main');
   var height = $ele.offsetHeight;
   $ele.classList.remove('large');
   ```

   从这个例子可以看到，我们很可能一不小心就触发了强制同步布局。除了上例中的 offsetHeight，还有许多会触发[强制同步布局](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)的属性。而 [CSS Triggers](https://csstriggers.com/) 这个网站在 Layout 之外，列出了各个浏览器中会触发 Paint 和 Composite 的 CSS 属性。

2. 尝试使用 RAF 避免强制同步布局

   将某些操作放在`requestAnimationFrame`中。

3. 批量化操作

   比如 React 内部的 setState 就是一个批量 batch 的过程。

4. 使用 Virtual List 来优化长列表

5. 使用 requestIdleCallback 来对不重要的长任务进行分解

6. 善用 Composite

   元素布局可能会影响到整个页面，那么自然我们就会想，是否能尽可能减少影响的范围呢？在某些情况下是可以的。例如下面这两个元素：

   ```html
   .main { height: 200px; width: 200px; background: black; } .fixed { position:
   fixed; top: 20px; left: 20px; transform: translateZ(0); width: 100px; height:
   100px; background: red; }

   <div class="main"></div>
   <div class="fixed"></div>
   ```

   浏览器会将其处理为两个渲染层，其中 .fixed 元素由于设置了 3D transform，所以会从普通的渲染层提升至合成层，拥有独立的 GraphicsLayers。当合成层更新时，浏览器会将布局调整限制在该层中，做到尽可能小的布局变动。

   总得来说，合成层在性能优化上的优点在于：

   1. 合成层的位图，会交由 GPU 合成，比 CPU 处理要快；
   2. 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层；
   3. 对于 transform 和 opacity 效果，不会触发 layout 和 paint。

7. 采用 throttle 和 debounce 对事件进行优化

### 预加载技术

1. 使用 Prefetch 进行资源的预获取
2. 使用 Prerender 进行预获取与执行
3. 使用 Preload 进行预获取并将结果放置于内存中
4. 基于 `new Image`的图片预加载
5. 基于 `preload` 对视频进行预加载

## 80.React 为什么要换成 Fiber 的架构?

`React Fiber` 中其实是基于`requestIdleCallback`实现的，我们先来看看之前的 `Stack` 算法。

在 `React16` 之前的版本比对更新 `VirtualDOM` 的过程是采用`循环加递归`实现的。

这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，知道整棵 `Virtual DOM`树比对更新完成之后主线程才能被释放，`主线程`才能执行其他任务。

这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿，非常的影响用户体验。

**核心问题归纳起来就是： 递归无法中断，执行重任务耗时长。JavaScript 又是单线程，无法同时执行其他任务，导致任务延迟页面卡顿，用户体验差。**

## 81. Fiber 是如何解决的？

- **1. 利用浏览器空闲时间执行任务，拒绝长时间占用主线程**

  使用 `requestIdleCallback` 利用浏览器空闲时间，`virtual DOM` 的比对不会占用主线程，如果有高优先级的任务要执行就会暂时中止 `Virtual DOM` 比对的过程，先去执行`高优先级`的任务，`高优先级`任务执行完成之后，继续执行 `Virtual DOM` 比对的任务，这样的话就不会出现页面卡顿的现象了。

- **2. 放弃递归只采用循环，因为循环可以被中断**

  由于`递归`需要一层一层进入，一层一层退出，这个过程不能间断，如果要实现 `Virtual DOM` 比对任务可以被终止，就必须放弃`递归`，采用`循环`来完成 `Virtual DOM` 比对的过程，因为`循环`是可以终止的。只要将循环的终止时的条件保存下来，下一次任务再次开启的时候，循环就可以在前一次循环终止的时刻继续往后执行。

- **3. 任务拆分, 将任务拆分成一个个小任务**

  拆分成一个个小任务，任务的单元就比较小，这样的话即使任务没有执行完就被终止了，重新执行任务的代价就会小很多，所以我们要做任务的拆分，将一个个大的任务拆分成一个个小任务执行。是怎么进行拆分的呢？以前我们将整个一个 `Virtual DOM` 的比对看成一个任务，现在我们将树中每一个节点的比对看成一个任务，这样一个大的任务就拆分成一个个小任务了。

## 82. 一个帧 frame 里面包含了那些阶段?

![frame帧](https://img-blog.csdnimg.cn/20210705203725389.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

每一帧包含了以下的一些内容:

1. 用户的交互
   1. blocking input events 阻塞渲染的事件(touch、wheel)
   2. non-blocking input events 非阻塞渲染的事件(click、keypress)
2. js 脚本的执行时间

3. 每一帧的事件

   1. window.resize
   2. scroll
   3. mediaquery changed
   4. animation events

4. rAF

   1. requestAnimationFrame-callbacks
   2. IntersectionObserver-callbacks

5. Layout 布局

   1. ReClac Styles
   2. Update Layout
   3. ResizeObserver-callbacks

6. 绘制生成位图
   1. Compositing Update
   2. Paint Invalidation
   3. Record

假如某一帧里面要执行的任务不多，在不到 `16ms（1000/60)`的时间内就完成了上述任务的话，那么这一帧就会有一定的空闲时间，这段时间就恰好可以用来执行 `requestIdleCallback` 的回调。

## 83. AST 是什么，有去了解过么?

AST（Abstract Syntax Tree)，是源代码的抽象语法结构的树状表现形式。树上的每个节点都表示源代码中的一种结构。之所以说语法是「抽象」的，是因为这里的语法并不会表示出真实语法中出现的每个细节。

| 类型名称            | 中文译名      | 描述                                                  |
| :------------------ | :------------ | ----------------------------------------------------- |
| Program             | 程序主体      | 整段代码的主体                                        |
| ImportDeclaration   | 引入声明      | 声明引入，比如 import                                 |
| VariableDeclaration | 变量声明      | 声明变量，比如 let const var                          |
| FunctionDeclaration | 函数声明      | 声明函数，比如 function                               |
| ExpressionStatement | 表达式语句    | 通常为调用一个函数，比如 console.log(1)               |
| BlockStatement      | 块语句        | 包裹在 {} 内的语句，比如 if (true) { console.log(1) } |
| BreakStatement      | 中断语句      | 通常指 break                                          |
| ContinueStatement   | 持续语句      | 通常指 continue                                       |
| ReturnStatement     | 返回语句      | 通常指 return                                         |
| SwitchStatement     | Switch 语句   | 通常指 switch                                         |
| IfStatement         | If 控制流语句 | 通常指 if (true) {} else {}                           |
| Identifier          | 标识符        | 标识，比如声明变量语句中 const a = 1 中的 a           |
| ArrayExpression     | 数组表达式    | 通常指一个数组，比如 [1, 2, 3]                        |
| StringLiteral       | 字符型字面量  | 通常指字符串类型的字面量，比如 const a = '1' 中的 '1' |
| NumericLiteral      | 数字型字面量  | 通常指数字类型的字面量，比如 const a = 1 中的 1       |

## 84. Babel 的解析过程是什么?

Babel 的三个主要处理步骤分别是：解析（parse）----> 转换（transform） -----> 生成(generate）。

- 通过 babylon 将 js 转化成 ast (抽象语法树)
- 通过 babel-traverse 对 ast 进行遍历，使用 babel 插件转化成新的 ast
- 通过 babel-generator 将 ast 生成新的 js 代码

## 85. 解析是通过什么去解析的?解析的具体流程是什么?解析后的产物是什么?

利用`@babel/parser`将代码解析成 AST。

这个步骤分为两个阶段：`词法分析（Lexical Analysis）`和 `语法分析（Syntactic Analysis）`。

- 词法分析：将代码(字符串)分割为 `token` 流，即语法单元成的数组。
- 语法分析：分析 `token` 流(上面生成的数组)并生成 `AST` 转换。

转换步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。

最终（经过一系列转换之后）的 AST 转换成`字符串形式`的代码，同时还会创建`源码映射（source maps）`。

代码生成其实很简单：`深度优先`遍历整个 AST，然后构建可以表示转换后代码的字符串。

## 86. webpack 的构建流程是什么样的?

1. 将命令行参数与 `webpack配置文件(webpack.config.js)`· 合并、解析得到参数对象 `Options`，用于激活`webpack`的加载项和插件。

2. 进行`webpack`的初始化:

   1. 将参数对象 `Options` 传给 `webpack` 执行得到 `compiler` 对象。
   2. `WebpackOptionsApply`首先会初始化几个基础插件，然后把`options`中对应的选项进行`require`。
   3. 初始化`compiler`的上下文。`loader`和`file`的输入输出环境。

3. 执行`compiler`对象的`run()`方法开始编译

   1. 该方法是编译的入口。
   2. `compiler`具体分成了 2 个对象：
      1. `Compiler`：存放输入输出相关配置信息和编译器`Parse`对象。
      2. `Watching`：监听文件变化的一些处理方法。

4. 触发`compile()`方法

   1. 执行`run`方法会触发`compile`方法，从而开始构建`options`中的模块。
   2. 生成`Compilation`对象。
      1. 该对象负责组织整个编译过程，包含了每个构建环节对应的方法。
      2. 对象内部保留了对`compile`对象的引用，并且存放了所有的`modules`、`chunks`、生成的`assets`以及最终用来生成 js 的`template`。
      3. 需要注意的是每次执行`run`方法都会生成一个新的`Compilation`对象。

5. 触发 `Compiler` 的 `make` 方法分析入口文件

   1. 调用 `compilation` 的 `addEntry` 递归遍历所有的入口文件。
   2. 调用 `compilation` 的 `buildModule` 方法创建主模块对象。

6. 生成入口文件 AST(抽象语法树)，通过 AST 分析和递归加载依赖模块。

   1. 解析入口 js 文件(也就是在`webpack.config.js`中定义的`entry`字段)，通过对应的工厂方法创建模块，保存到`compliation对象`上(这里使用单例模式保证同样的模块只有一个实例)。
   2. 对 `module` 进行 `build`。包括调用 `loader` 处理源文件使用`acorn`生成 AST 并且遍历 AST，遇到`require`等依赖时，创建依赖`Dependency`加入依赖数组。
   3. `module` 已经 `build` 完毕，此时开始处理依赖的 `module`。
   4. 异步的对 `module` 进行 `build`，如果依赖中仍有依赖，则循环处理其依赖。

7. 所有模块分析完成后，执行 `compilation` 的 `seal` 方法对每个 `chunk` 进行整理、优化、封装。

   1. 通过调用`seal`方法进行封装，逐次对每个 module 和 chunk 进行整理生成编译后的源码合并、拆分，每个 chunk 对应一个入口文件。
   2. 开始处理最后生成的 js。

8. 进行 emit 提交

   1. 所有的`module`、`chunk`仍然保存的是通过一个个`require()`聚合起来的代码，需要通过`Template`产生最后带有`__webpack__require()`格式的代码。
   2. 这里有两个`Template`
      1. `MainTemplate`：处理入口文件的 module
      2. `ChunkTemplate`：处理那些非首屏需要异步加载的 module
   3. 这个阶段插件有最后的机会修改`assets`.

9. after emit 提交

   1. 这里完成了输出，生成了不同的`dependencyTemplates`，如`Commonjs`、`AMD`...
   2. 生成好的 js 会保存在`compliation.assets`中。

10. 最后执行 `Compiler` 的 `emitAssets` 方法把生成的文件输出到 `output` 的目录中。

![完整大图](https://img-blog.csdnimg.cn/968e6be3a07541d9822e8f8148ee8bc2.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 87. compiler 与 compilation 是什么？有什么区别?

- compiler

  - `Compiler` 对象包含了当前运行 `Webpack` 的完整配置，这个对象在启动 `Webpack` 时被实例化，包含了 `entry`、`output`、`loaders`、`plugins` 等配置。

  - `Compiler类`继承了 `Tapable`，使用 `Tapable` 实现了事件发布订阅处理的插件架构，当在 `webpack` 环境中应用一个插件时，插件将收到此 `compiler` 对象的引用。可以使用 `compiler` 来访问 `webpack` 的主环境。

  compier 重要的事件钩子

  | 事件钩子      | 触发时机                                            | 参数        | 类型              |
  | :------------ | :-------------------------------------------------- | :---------- | :---------------- |
  | entry-option  | 初始化 option                                       | -           | SyncBailHook      |
  | run           | 开始编译                                            | compiler    | AsyncSeriesHook   |
  | compile       | 真正开始的编译，在创建 compilation 对象之前         | compilation | SyncHook          |
  | compilation   | 生成好了 compilation 对象，可以操作这个对象啦       | compilation | SyncHook          |
  | make          | 从 entry 开始递归分析依赖，准备对每个模块进行 build | compilation | AsyncParallelHook |
  | after-compile | 编译 build 过程结束                                 | compilation | AsyncSeriesHook   |
  | emit          | 在将内存中 assets 内容写到磁盘文件夹之前            | compilation | AsyncSeriesHook   |
  | after-emit    | 在将内存中 assets 内容写到磁盘文件夹之后            | compilation | AsyncSeriesHook   |
  | done          | 完成所有的编译过程                                  | stats       | AsyncSeriesHook   |
  | failed        | 编译失败的时候                                      | error       | SyncHook          |

- compilation

  - `compilation` 对象代表了一次资源版本构建，当执行`compiler.run` 后首先会触发 `compile`，这一步会构建出 `compilation` 对象，`compilation` 的职责就是构建`模块`和 `Chunk`，并利用插件优化构建过程。

  - 当运行 `webpack` 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 `compilation`，从而生成一组新的编译资源。

  - 一个 `compilation` 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。`compilation` 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

## 88.webpack 的插件机制是什么?

`webpack` 的本质是一种基于事件流的编程范例，通过集成一系列的插件运行。其中核心对象 `Complier`、`Complation`都是继承于`Tapable`。

`Tapable` 是一个类似于`nodejs` 的`EventEmitter` 的库，主要是控制钩子函数的发布与订阅。当然，`tapable`提供的`hook`机制比较全面，分为`同步`和`异步`两个大类(异步中又区分`异步并行`和`异步串行`)，而根据事件执行的终止条件的不同，由衍生出 `Bail/Waterfall/Loop` 类型。

```js
const {
  Tapable,
  SyncHook, // 同步钩子
  SyncBailHook, // 同步熔断钩子 当函数有任何返回值,则在当前执行函数停止
  SyncWaterfallHook, // 同步流水钩子
  SyncLoopHook, // 同步循环钩子
  AsyncParallelHook, // 异步并发钩子
  AsyncParallelBailHook, // 异步并发熔断钩子 当函数有任何返回值,则在当前执行函数停止
  AsyncSeriesHook, // 异步串行钩子
  AsyncSeriesBailHook, // 异步串行熔断钩子 当函数有任何返回值,则在当前执行函数停止
  AsyncSeriesWaterfallHook, // 异步串行流水钩子
} = require('tapable');
```

## 89.Tapable 的钩子绑定是如何执行的?

- Async
  - 绑定: tapAsync、tapPromise、tap
  - 执行: callAsync、promise
- Sync
  - 绑定:tap
  - 执行:call

## 90. Loader 是什么?

`loader` 的本质就是一个函数，将那些 `webpack` 不能直接理解的 `JavaScript` 文件、`CSS 文件`等转化成 `webpack`可以识别的文件。

`Loader` 在 `module.rules` 中配置，作为模块的解析规则，类型为`数组`。每一项都是一个 `Object`，内部包含了 `test(类型文件)`、`loader`、`options` (参数)等属性。

### Loader 有哪两个属性?

1. `test 属性`：用于标识出应该被对应的 loader 进行转换的某个或某些文件，其书写格式是一个正则表达式。

2. `use 属性`：表示对应匹配出的文件需要使用的 loader，其中 loader 是一个数组，使用的顺序为从右往左。

### 常见的 loader 都有哪些?

- `file-loader`：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)。
- `url-loader`：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (用于处理图片和字体)。
- `source-map-loader`：加载额外的 Source Map 文件，以方便断点调试。
- `image-loader`：加载并且压缩图片文件。
- `babel-loader`：把 ES6 代码 转换成 ES5。
- `postcss-loader`：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀。
- `sass-loader`：将 SCSS/SASS 代码转换成 CSS。
- `less-loader`：将 Less 代码转换成 CSS。
- `css-loader`：加载 CSS，支持模块化、压缩、文件导入等特性。
- `style-loader`：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
- `eslint-loader`：通过 ESLint 检查 JavaScript 代码。
- `cache-loader`: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里。
- `thread-loader`:可以配置 webpack 进行多进程的打包 js 和 css。

### 有没有写过 Loader 或者说如何去编写一个 Loader?

`loader` 就是一个 `node` 模块，在 `webpack` 的定义中，`loader` 导出一个函数，`loader` 会在转换源模块（resource）的时候调用该函数。在这个函数内部，我们可以通过传入 `this` 上下文给 `Loader API` 来使用它们。

```js
module.exports = function(source) {
  // webpack中默认是开启loader缓存的(可以使用this.cacheable关掉缓存)。
  if (this.cacheable) {
    this.cacheable();
  }

  let backUp = source
  // 比如source进行replace
  ...

  return backUp;
}
```

## 91. 什么是 Plugin？

`Plugin`是插件，基于事件流框架 `Tapable`，插件可以扩展 `Webpack` 的功能，在 `Webpack` 运行的生命周期中会广播出许多事件，`Plugin` 可以监听这些事件，在合适的时机通过 `Webpack` 提供的 `API` 改变输出结果。

`Plugin` 在 `plugins` 中单独配置，类型为`数组`，每一项是一个 `Plugin` 的实例，需要手动通过`new Plugin(options)`进行，参数都通过构造函数传入。

### 常见的 plugin 有哪些?

- `clean-webpack-plugin`: 常用于打包正式环境报之前进行目录清理。
- `speed-measure-webpack-plugin`: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)。
- `mini-css-extract-plugin`: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代 extract-text-webpack-plugin)。
- `terser-webpack-plugin`：用于替代`uglifyjs-webpack-plugin`(uglifyjs 不支持 es6 语法)支持压缩 ES6 (Webpack4)，可配置多进程进行压缩。
- `webpack-parallel-uglify-plugin`: 多进程执行代码压缩，提升构建速度。
- `webpack-bundle-analyzer`：可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)。
- `html-webpack-externals-plugin`：将不怎么需要更新的第三方库脱离 webpack 打包，不被打入 bundle 中，从而减少打包时间，但又不影响运用第三方库的方式，例如 `import` 方式等。
- `DllPlugin`：用于分包处理,用于在单独的 webpack 配置中创建一个 `dll-only-bundle`。 此插件会生成一个名为 `manifest.json` 的文件，这个文件是用于让 `DllReferencePlugin` 能够映射到相应的依赖上。
- `DllReferencePlugin`：此插件配置在 webpack 的主配置文件中，此插件会把 `dll-only-bundles` 引用到需要的预编译的依赖中。

### 如何去编写一个 plugin？

plugin 的本质是一个类。这个类必须实现的方法就是 `apply`。所以，一个基础的 `plugin` 如下：

```js
class MyPlugin {
  // 插件的名称
  apply(complier) {
    // 必须实现的apply方法
    compiler.hooks.done.tap('My Plugin', (stats) => {
      // 触发的hooks
      // do something
    });
  }
}

module.exports = MyPlugin;

// 插件的使用

plugins: [new MyPlugin()];
```

## 92.什么是 yarn，yarn 解决了什么问题?

`yarn` 是在 2016 年发布的，那时 `npm` 还处于 `V3` 时期，那时候还没有 `package-lock.json` 文件，就像上面我们提到的：不稳定性、安装速度慢等缺点经常会受到广大开发者吐槽。此时，`yarn` 诞生。

解决的问题:

- 确定性：通过 `yarn.lock` 等机制,即使是不同的安装顺序,相同的依赖关系在任何的环境和容器中,都可以以相同的方式安装。
- 采用模块扁平化的安装模式：采用的是 `npm v3` 的扁平结构来管理依赖。
- 网络性能更好: `yarn`采用了请求排队的理念，类似于并发池连接，能够更好的利用网络资源;同时也引入了一种安装失败的重试机制。
- 采用缓存机制,实现了离线模式。

## 93. 为什么 react 推行函数式组件？

1. 函数组件不需要声明类，可以避免大量的譬如 extends 或者 constructor 这样的代码
2. 函数组件不需要处理 this 指向的问题
3. 函数组件更贴近于函数式编程，更加贴近 react 的原则。使用函数式编程，灵活度更高，更好的代码复用
4. 随着 Hooks 功能的强大，更推动了函数式组件 + Hooks 这对组合的发展

## 94. 服务端渲染都有哪几种方式?

1. SSR (Server Side Rendering)， 即服务端渲染

   服务端直接实时同构渲染当前用户访问的页面，返回的 HTML 包含页面具体内容，提高用户的体验.

   - 适用于：页面动态内容，SEO 的诉求、要求首屏时间快的场景.

   - 缺点：SSR 需要较高的服务器运维成本、切换页面时较慢，每次切换页面都需要服务端新生成页面.

2. SSG (Static Site Generation)，是指在应用编译构建时预先渲染页面，并生成静态的 HTML.

   把生成的 HTML 静态资源部署到服务器后，浏览器不仅首次能请求到带页面内容的 HTML ，而且不需要服务器实时渲染和响应，大大节约了服务器运维成本和资源.

   - 适用于：页面内容由后端获取，但变化不频繁，满足 SEO 的诉求、要求首屏时间快的场景，SSG 打包好的是静态页面，和普通页面部署一样。

3. ISR (Incremental Static Regeneration)，创建需要增量静态再生的页面

   创建具有动态路由的页面（增量静态再生），允许在应用运行时再重新生成每个页面 HTML，而不需要重新构建整个应用，这样即使有海量页面（比如博客、商品介绍页等场景），也能使用上 SSG 的特性。

   在 Nextjs 中，使用 ISR 需要`getStaticPaths` 和 `getStaticProps` 同时配合使用。

## 95. Mobx 和 Redux 有什么区别？

### 设计思想

| 框架  | 思想                                                                                                                                                                     |
| :---- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redux | `函数式编程`，如`reducer`就是一个`纯函数（pure function）`，接受输入，然后输出结果，除此之外不会有任何影响，也包括不会影响接收的参数；对于相同的输入总是输出相同的结果。 |
| Mobx  | `面向对象编程（OOP）`和 `响应式编程（Reactive Programming）`，将 js 对象包装成`可观察对象`，一旦数据发生变化，就会自动更新。                                             |

### Store 管理方式

| 框架  | 思想                                                              |
| :---- | :---------------------------------------------------------------- |
| Redux | `Redux`中我们习惯于将所有共享的应用数据集中在一个大的`Store`中。  |
| Mobx  | 在`Mbox`则通常按模块将应用状态划分，在多个独立的 `store` 中管理。 |

### 数据类型差异

| 框架  | 思想                                                                              |
| :---- | :-------------------------------------------------------------------------------- |
| Redux | `Redux`中默认以`JavaScript原生对象`形式存储数据，需要手动追踪所有状态对象的变更。 |
| Mobx  | 在`Mbox`中使用特有的`可观察对象(Observal Object)`，当数据发生变更时自动触发更新。 |

### 数据可变性差异

| 框架  | 思想                                                                                                                                                 |
| :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redux | `Redux`中对象通常是`不可变的(Immutable)`，我们不能直接操作状态对象，而总是在原来状态对象基础上返回一个新的状态对象，这样就能很方便的返回应用上一状态 |
| Mobx  | 在`Mbox`中推荐使用`Action`进行对应的数据更新操作，但是也允许在非严格模式下直接使用新值去更新状态对象                                                 |

### 使用方式差异

| 框架  | 使用方式                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :---- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redux | 使用 `Redux` 和 `React` 应用连接时，需要使用 `react-redux` 提供的 `Provider` 和 `connect`。<li style="text-indent:2em;padding: 0.25em 0;">`Provider`:负责将 `Store` 注入 `React` 应用。</li> <li style="text-indent:2em;padding: 0.25em 0;">`connect`:负责将 `store`、`state` 注入容器组件，并选择特定状态作为容器组件`props`传递。</li>                                                                                                                    |
| Mobx  | 使用 `Mobx` 和 `React`应用连接时，需要使用 `mobx-react` 提供的 `Provider` 和 `inject` 以及 `observer`API。<li style="text-indent:2em;padding: 0.25em 0;">`Provider`:负责将 `Stores` 注入 `React` 应用。</li> <li style="text-indent:2em;padding: 0.25em 0;">使用 `inject` 将特定 `store` 注入某组件，`store` 可以传递状态或 `action`；然后使用`observer` 保证组件能响应 `store`中的可观察对象（observable）变更，即 `store` 更新，组件视图响应式更新。</li> |

### 优劣势对比

| 框架  | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redux | <li>数据流流动单一比较清晰，任何 `dispatch` 都会导致广播，需要依据对象引用是否变化来控制更新粒度。</li><li>方便利用时间回溯的特征，可以增强业务的可预测性与错误定位能力(通过中间件可以记录前后的数据差异)。</li><li>时间回溯代价很高，因为每次都要更新引用，除非增加代码复杂度，或使用 `immutable`。</li><li>引入中间件，其实主要为了解决异步带来的副作用，业务逻辑或多或少参杂着 `magic`。但是灵活利用中间件，可以通过约定完成许多复杂的工作。</li> |
| Mobx  | <li>数据流流动不自然，只有用到的数据才会引发绑定，局部精确更新，但免去了粒度控制烦恼。</li><li>自始至终一份引用，没有时间回溯能力，不需要 `immutable`，也没有复制对象的额外开销。</li> <li>由于没有 `magic`，所以没有中间件机制，没法通过 `magic` 加快工作效率（这里 `magic` 是指 `action` 分发到 `reducer` 的过程）。</li><li>完美支持 `typescript`。</li>                                                                                          |

## 96. 微前端

微前端的本质是分治的处理前端应用以及应用间的关系，那么更进一步，落地一个微前端框架，就会涉及到三点核心要素：

- 子应用的加载；
- 应用间运行时隔离；
- 路由劫持；

对于 qiankun 来说，路由劫持是在 `single-spa` 上去做的，而 `qiankun` 给我们提供的能力，主要便是`子应用的加载`和`沙箱隔离`。

`qiankun` 是 `single-spa` 的一层封装，而 `qiankun` 中，真正去加载解析子应用的逻辑是在 `import-html-entry` 这个包中实现的。
