---
title: Redux核心原理
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# Redux

- 2021.08.12

## 什么是 Redux?

> `Redux` 是 `JavaScript` 应用的状态容器，提供可预测的状态管理。

`Redux` 认为 `Web` 应用是一个状态机，视图与状态是一一对应的，所有的状态，保存在一个对象里面。

![redux状态](https://img-blog.csdnimg.cn/fa88b9a2d7b44e09a6d00179e166b586.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`Store` 是 `Redux` 中的状态容器，它里面存储着所有的状态数据，每个状态都跟一个视图一一对应。

一个 `State` 对应一个 `View`。只要 `State` 相同，`View` 就相同，知道了 `State`，就知道 `View` 是什么样，反之亦然。

比如，当前页面分三种状态：`loading（加载中）`、`success（加载成功）`或者 `error（加载失败）`，那么这三个就分别唯一对应着一种视图。

![Redux的工作流程](https://img-blog.csdnimg.cn/e984fd1b049147109a7dace05c670002.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上图描述的是 `redux` 的工作流程，我们需要知道以下几个核心概念:

- `Store`：保存数据的地方，你可以把它看成一个容器，整个应用只能有一个 Store。

- `State`：Store 对象包含所有数据，如果想得到某个时点的数据，就要对 Store 生成快照，这种时点的数据集合，就叫做 State。

- `Action`：State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。

- `Action Creator`：View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦，所以我们定义一个函数来生成 Action，这个函数就叫 Action Creator。

- `Reducer`：Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

- `dispatch`：是 View 发出 Action 的唯一方法。

因此我们可以得到整个工作流程大致如下:

1. 首先，用户（通过 View）触发 Action，触发方式使用到了 `dispatch` 方法。

2. 然后，Store 自动调用 Reducer，并且传入两个参数：`当前 State 和收到的 Action`，Reducer 会返回新的 State。

3. State 一旦有变化，Store 就会调用监听函数，来更新 View。

至此，一次用户交互流程结束。可以看到，在整个流程中数据都是`单向流动`的，这种方式保证了流程的清晰。

## 为什么用 Redux？

前端复杂性的根本原因是大量无规律的交互和异步操作。

在我们的组件之间存在着大量的通信，有的时候这个通信跨了多个组件，或者多个组件之间共享同一套数据，简单的父子组件之间传值不能满足我们的需求。自然而然的我们需要有一个地方存取和操作这些公共状态。

又或者我们的一些同步操作是改变了某个状态，异步操作也改变了某个状态，随着代码量越来越大，我们要维护的状态也越来越多。

我们很容易就对这些状态何时发生、为什么发生以及怎么发生的失去控制。

**因此我们需要一套完善的机制来帮助我们清晰的掌控数据流向以及不同组件之间的数据共享通信。**

而 Redux 就为我们提供了这样的一种方案。

## Redux 思想追溯

`Redux` 作者在 `Redux.js` 官方文档 [Motivation](https://redux.js.org/understanding/thinking-in-redux/motivation) 一章的最后一段明确提到：

![Motivation](https://img-blog.csdnimg.cn/adf4599a16ab4b6cb066860e2ff0ea8c.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

其中涉及到了 `Flux`、`CQRS` 以及 `Event Sourcing` 等词语，我们来看看这几个概念是什么意思。

## Event Sourcing

> 事件溯源。改思想不是保存对象的最新状态，而是保存对象产生的事件，通过事件追溯得到对象最新状态。

举个例子：我们平常记账有两种方式，直接记录每次账单的结果或者记录每次的收入/支出，那么我们自己计算的话也可以得到结果，`Event Sourcing` 就是后者。

![记账示例](https://img-blog.csdnimg.cn/f08b41d26ca44882aa024591885caf34.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**与传统增删改查关系式存储的区别：**

- 传统的增删是以结果为导向的数据存储，ES 是以过程为导向存储。

- CRUD 是直接对库进行操作。

- ES 是在库里存了一系列事件的集合，不直接对库里记录进行更改。

**优点：**

- 高性能：事件是不可更改的，存储的时候并且只做插入操作，也可以设计成独立、简单的对象。所以存储事件的成本较低且效率较高，扩展起来也非常方便。

- 简化存储：事件用于描述系统内发生的事情，我们可以考虑用事件存储代替复杂的关系存储。

- 溯源：正因为事件是不可更改的，并且记录了所有系统内发生的事情，我们能用它来跟踪问题、重现错误，甚至做备份和还原。

**缺点:**

- 事件丢失：因为 ES 存储都是基于事件的，所以一旦事件丢失就很难保证数据的完整性。

- 修改时必须兼容老结构：指的是因为老的事件不可变，所以当业务变动的时候新的事件必须兼容老结构。

## CQRS

> CQRS 是（Command Query Responsibility Segregation）的缩写,“命令与查询职责分离”–>”读写分离”。

![CQRS](https://img-blog.csdnimg.cn/888a9d9850ea45afa0774ea945bc2bf8.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

整体的思想是把 `Query` 操作和 `Command` 操作分成两块独立的库来维护，当事件库有更新时，再来同步读取数据库。

- Query 端，只是对数据库的简单读操作。

- Command 端，是对事件进行简单的存储，同时通知 Query 端进行数据更新，这个地方就用到了 ES。

**优点：**

- CQ 两端分离，各自独立。

- 技术代码和业务代码完全分离。

**缺点:**

- 强依赖高性能可靠的分布式消息队列。

## Flux

> Flux 是一种架构思想，下面过程中，数据总是“单向流动”，任何相邻的部分都不会发生数据的“双向流动”，这保证了流程的清晰。Flux 的最大特点，就是数据的“单向流动”。

![Flux](https://img-blog.csdnimg.cn/3aba59bb43de4e6cb869984479096e77.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**大致的流程如下：**

1. 用户访问 View。
2. View 发出用户的 Action。
3. Dispatcher 收到 Action，要求 Store 进行相应的更新。
4. Store 更新后，发出一个“change”事件。

## CQRS 与 Flux

- 相同：当数据在 write side 发生更改时，一个更新事件会被推送到 read side，通过绑定事件的回调，read side 得知数据已更新，可以选择是否重新读取数据。

- 差异：在 CQRS 中，write side 和 read side 分属于两个不同的领域模式，各自的逻辑封装和隔离在各自的 Model 中，而在 Flux 里，业务逻辑都统一封装在 Store 中。

## Redux 与 Flux

Redux 是 Flux 思想的一种实现，同时又在其基础上做了改进。Redux 还是秉承了 Flux 单向数据流、Store 是唯一的数据源的思想。

**最大的区别：**

1. Redux 只有一个 Store。

Flux 中允许有多个 Store，但是 Redux 中只允许有一个，相较于 Flux，一个 Store 更加清晰，容易管理。Flux 里面会有多个 Store 存储应用数据，并在 Store 里面执行更新逻辑，当 Store 变化的时候再通知 controller-view 更新自己的数据；Redux 将各个 Store 整合成一个完整的 Store，并且可以根据这个 Store 推导出应用完整的 State。

同时 Redux 中更新的逻辑也不在 Store 中执行而是放在 Reducer 中。单一 Store 带来的好处是，所有数据结果集中化，操作时的便利，只要把它传给最外层组件，那么内层组件就不需要维持 State，全部经父级由 props 往下传即可。子组件变得异常简单。

2. Redux 中没有 Dispatcher 的概念。

Redux 去除了这个 Dispatcher，使用 Store 的 `Store.dispatch()`方法来把 action 传给 Store，由于所有的 action 处理都会经过这个 `Store.dispatch()`方法，Redux 聪明地利用这一点，实现了与 Koa、RubyRack 类似的 Middleware 机制。

Middleware 可以让我们在 dispatch action 后，到达 Store 前这一段拦截并插入代码，可以任意操作 action 和 Store。很容易实现灵活的日志打印、错误收集、API 请求、路由等操作。

**除了以上，Redux 相对 Flux 而言还有以下特性和优点：**

1. 文档清晰，编码统一。

2. 逆天的 DevTools，可以让应用像录像机一样反复录制和重放。

## Redux 源码解析

这里解析的是 `V4.1.1` 的版本[完整的源码地址](https://github.com/reduxjs/redux/blob/master)

![源码截图](https://img-blog.csdnimg.cn/85f546fe4dc9490bb5dad55e49ae3b68.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

主要的文件主要涉及上述几个:

```ts
├── types
│   ├── actions.ts
│   ├── middleware.ts
│   ├── reducers.ts
│   ├── store.ts
├── utils
│   ├── actionTypes.ts
│   ├── formatProdErrorMessage.ts
│   ├── isPlainObject.ts
│   ├── kindOf.ts
│   ├── symbol-observable.ts
│   ├── warning.ts
├── applyMiddleware.ts
├── bindActionCreators.ts
├── combineReducers.ts
├── compose.ts
├── createStore.ts
├── index.ts
```

### index.js

该文件是项目的主入口

```js
// functions
import createStore from './createStore';
import combineReducers from './combineReducers';
import bindActionCreators from './bindActionCreators';
import applyMiddleware from './applyMiddleware';
import compose from './compose';
import warning from './utils/warning';
import __DO_NOT_USE__ActionTypes from './utils/actionTypes';

// types
// store
export {
  CombinedState,
  PreloadedState,
  Dispatch,
  Unsubscribe,
  Observable,
  Observer,
  Store,
  StoreCreator,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
  ExtendState,
} from './types/store';
// reducers
export {
  Reducer,
  ReducerFromReducersMapObject,
  ReducersMapObject,
  StateFromReducersMapObject,
  ActionFromReducer,
  ActionFromReducersMapObject,
} from './types/reducers';
// action creators
export { ActionCreator, ActionCreatorsMapObject } from './types/actions';
// middleware
export { MiddlewareAPI, Middleware } from './types/middleware';
// actions
export { Action, AnyAction } from './types/actions';

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */
function isCrushed() {}

if (
  process.env.NODE_ENV !== 'production' &&
  typeof isCrushed.name === 'string' &&
  isCrushed.name !== 'isCrushed'
) {
  warning(
    'You are currently using minified code outside of NODE_ENV === "production". ' +
      'This means that you are running a slower development build of Redux. ' +
      'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
      'or setting mode to production in webpack (https://webpack.js.org/configuration/mode/) ' +
      'to ensure you have the correct code for your production build.',
  );
}

export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes,
};
```

入口文件主要是导出了各类提供的 API 方法，中间件 API，各类 `types` 以及 `reducers`。

### createStore.js

`Redux` 的主流程是从 `createStore` 方法开始的，首先是创建一个 `Store`。

```js
import $$observable from './utils/symbol-observable'

import {
  Store,
  PreloadedState,
  StoreEnhancer,
  Dispatch,
  Observer,
  ExtendState
} from './types/store'
import { Action } from './types/actions'
import { Reducer } from './types/reducers'
import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'
import { kindOf } from './utils/kindOf'

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param preloadedState The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
export default function createStore<
  S,
  A extends Action,
  Ext = {},
  StateExt = never
>(
  reducer: Reducer<S, A>,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
export default function createStore<
  S,
  A extends Action,
  Ext = {},
  StateExt = never
>(
  reducer: Reducer<S, A>,
  preloadedState?: PreloadedState<S>,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
export default function createStore<
  S,
  A extends Action,
  Ext = {},
  StateExt = never
>(
  reducer: Reducer<S, A>,
  preloadedState?: PreloadedState<S> | StoreEnhancer<Ext, StateExt>,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext {
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.'
    )
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState as StoreEnhancer<Ext, StateExt>
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error(
        `Expected the enhancer to be a function. Instead, received: '${kindOf(
          enhancer
        )}'`
      )
    }

    return enhancer(createStore)(
      reducer,
      preloadedState as PreloadedState<S>
    ) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
  }

  if (typeof reducer !== 'function') {
    throw new Error(
      `Expected the root reducer to be a function. Instead, received: '${kindOf(
        reducer
      )}'`
    )
  }

  let currentReducer = reducer
  let currentState = preloadedState as S
  let currentListeners: (() => void)[] | null = []
  let nextListeners = currentListeners
  let isDispatching = false

  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns The current state tree of your application.
   */
  function getState(): S {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }

    return currentState as S
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param listener A callback to be invoked on every dispatch.
   * @returns A function to remove this change listener.
   */
  function subscribe(listener: () => void) {
    if (typeof listener !== 'function') {
      throw new Error(
        `Expected the listener to be a function. Instead, received: '${kindOf(
          listener
        )}'`
      )
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
          'If you would like to be notified after the store has been updated, subscribe from a ' +
          'component and invoke store.getState() in the callback to access the latest state. ' +
          'See https://redux.js.org/api/store#subscribelistener for more details.'
      )
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. ' +
            'See https://redux.js.org/api/store#subscribelistener for more details.'
        )
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action: A) {
    if (!isPlainObject(action)) {
      throw new Error(
        `Actions must be plain objects. Instead, the actual type was: '${kindOf(
          action
        )}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param nextReducer The reducer for the store to use instead.
   * @returns The same store instance with a new reducer in place.
   */
  function replaceReducer<NewState, NewActions extends A>(
    nextReducer: Reducer<NewState, NewActions>
  ): Store<ExtendState<NewState, StateExt>, NewActions, StateExt, Ext> & Ext {
    if (typeof nextReducer !== 'function') {
      throw new Error(
        `Expected the nextReducer to be a function. Instead, received: '${kindOf(
          nextReducer
        )}`
      )
    }

    // TODO: do this more elegantly
    ;(currentReducer as unknown as Reducer<NewState, NewActions>) = nextReducer

    // This action has a similar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.
    dispatch({ type: ActionTypes.REPLACE } as A)
    // change the type of the store by casting it to the new store
    return store as unknown as Store<
      ExtendState<NewState, StateExt>,
      NewActions,
      StateExt,
      Ext
    > &
      Ext
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    const outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer: unknown) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError(
            `Expected the observer to be an object. Instead, received: '${kindOf(
              observer
            )}'`
          )
        }

        function observeState() {
          const observerAsObserver = observer as Observer<S>
          if (observerAsObserver.next) {
            observerAsObserver.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT } as A)

  const store = {
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  } as unknown as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
  return store
}
```

从上往下看`createStore`方法：

1. 首先，判断了接收的几个参数的类型:

   - reducer 需要接收一个 function
   - preloadedState
   - enhancer

2. 然后定义了一些方法和变量:

   ```js
   let currentReducer = reducer
   let currentState = preloadedState as S
   let currentListeners: (() => void)[] | null = []
   let nextListeners = currentListeners
   let isDispatching = false
   ```

   - `ensureCanMutateNextListeners()`: 用于浅拷贝 currentListeners

   - `getState()`: 用于获取 Store 中存储的 state 数据

   - `subscribe(listener)`: 在 Store 注册一个监听函数，当 dispatch 一个 action 的时候可以触发我们传入的 listener 回调。并且返回了一个`unsubscribe()`方法用于取消订阅，所有的订阅函数统一放一个数组里，只去维护这个数组。

   - `dispatch(action)`: Store 中去修改 state 的唯一途径，任何状态变更都仅能通过 dispatch 函数进行，最终返回一个新的 action。

   - `replaceReducer(NewState, NewActions extends A)`: 替换当前 store 的 reducer 并计算出替换后的 state，常用于应用需要代码分割以及动态载入 reducer 的时候用。

   - `observable()`: 返回一个迷你的 state 变化 Log

3. 然后先`dispatch({ type: ActionTypes.INIT } as A)`，执行默认的 `dispatch` 操作，生成初始的 State 树。

4. 最后返回了定义的几个 API。

   ```js
   const store = {
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
   } as unknown as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
   return store
   ```

至此`createStore`的解读就完成了，整体的 Redux 流程差不多也完成了，下面看一些辅助方法。

### bindActionCreators.js

`bindActionCreators` 是对 disptach 的一种封装，可以直接执行或者通过属性方法的调用，隐式的去调用 dispatch，而不用显示的通过`Store.dispatch()`方法进行调用。

```js
import { Dispatch } from './types/store'
import {
  AnyAction,
  ActionCreator,
  ActionCreatorsMapObject
} from './types/actions'
import { kindOf } from './utils/kindOf'

function bindActionCreator<A extends AnyAction = AnyAction>(
  actionCreator: ActionCreator<A>,
  dispatch: Dispatch
) {
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
export default function bindActionCreators<A, C extends ActionCreator<A>>(
  actionCreator: C,
  dispatch: Dispatch
): C

export default function bindActionCreators<
  A extends ActionCreator<any>,
  B extends ActionCreator<any>
>(actionCreator: A, dispatch: Dispatch): B

export default function bindActionCreators<
  A,
  M extends ActionCreatorsMapObject<A>
>(actionCreators: M, dispatch: Dispatch): M
export default function bindActionCreators<
  M extends ActionCreatorsMapObject,
  N extends ActionCreatorsMapObject
>(actionCreators: M, dispatch: Dispatch): N

export default function bindActionCreators(
  actionCreators: ActionCreator<any> | ActionCreatorsMapObject,
  dispatch: Dispatch
) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${kindOf(
        actionCreators
      )}'. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const boundActionCreators: ActionCreatorsMapObject = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```

一般情况下我们都通过在 Store 实例上调用 dispatch 方法去触发一个 action，唯一可能使用到的场景就是把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 Redux store 或 dispatch 传给它。

文字可能不是很好理解，我们直接来看个例子:

```js
import { createStore } from 'redux';

// 默认state
let todoList = [];

// reducer
let todoReducer = function (state = todoList, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.todo];
    case 'delete':
      return state.filter((todo) => todo.id !== action.id);
    default:
      return state;
  }
};

// 创建store
let store = createStore(todoReducer);

// 订阅
function subscribe1Fn() {
  // 输出state
  console.log(store.getState());
}
store.subscribe(subscribe1Fn);
```

上述代码创建了一个 store 并且添加了一个订阅，我们先用常规的方法去调用。

- 常规用法

```js
// 进行一个add操作
store.dispatch({
  type: 'add',
  todo: {
    id: 1,
    txt: 'watch TV',
  },
});

// 进行一个delete操作
store.dispatch({
  type: 'delete',
  id: 1,
});
```

- 采用 bindActionCreators

```js
// action creater
const actionCreaters = {
  add: function (todo) {
    //添加
    return {
      type: 'add',
      todo,
    };
  },
  delete: function (id) {
    return {
      type: 'delete',
      id,
    };
  },
};

// 传入一个方法创建绑定函数
const boundActions = bindActionCreators(actionCreaters, store.dispatch);

// 添加todo
boundActions.add({
  id: 2,
  content: '吃饭饭',
});

boundActions.add({
  id: 3,
  content: '打游戏',
});

// 删除todo
boundActions.delete({
  id: 2,
});

// 传入一个对象创建绑定函数
const boundAdd = bindActionCreators(actionCreaters.add, store.dispatch);

// 新增一个todo

boundAdd({
  id: 4,
  content: '睡觉觉',
});
```

从上面代码分析得出 `bindActionCreators`有两种调用方式，都是对 dispatch 的一种封装。

- bindActionCreators 传入 action creater 和 dispatch 方法，返回一个函数，直接调用就会更新数据，不用显式调用 dispatch。

- bindActionCreators 传入一个对象（属性都是 action creater）和 dispatch 方法，返回一个对象，直接可以调用属性方法，就会更新数据。

### combineReducers.js

该方法主要用于合并`Reducer`，当我们应用比较大的时候 Reducer 按照模块拆分看上去会比较清晰，但是传入 Store 的 Reducer 必须是一个函数，所以需要使用这个方法来进行合并。

```js
import { AnyAction, Action } from './types/actions'
import {
  ActionFromReducersMapObject,
  Reducer,
  ReducersMapObject,
  StateFromReducersMapObject
} from './types/reducers'
import { CombinedState } from './types/store'

import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'
import warning from './utils/warning'
import { kindOf } from './utils/kindOf'

function getUnexpectedStateShapeWarningMessage(
  inputState: object,
  reducers: ReducersMapObject,
  action: Action,
  unexpectedKeyCache: { [key: string]: true }
) {
  const reducerKeys = Object.keys(reducers)
  const argumentName =
    action && action.type === ActionTypes.INIT
      ? 'preloadedState argument passed to createStore'
      : 'previous state received by the reducer'

  if (reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    )
  }

  if (!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "${kindOf(
        inputState
      )}". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    )
  }

  const unexpectedKeys = Object.keys(inputState).filter(
    key => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]
  )

  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true
  })

  if (action && action.type === ActionTypes.REPLACE) return

  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    )
  }
}

function assertReducerShape(reducers: ReducersMapObject) {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    const initialState = reducer(undefined, { type: ActionTypes.INIT })

    if (typeof initialState === 'undefined') {
      throw new Error(
        `The slice reducer for key "${key}" returned undefined during initialization. ` +
          `If the state passed to the reducer is undefined, you must ` +
          `explicitly return the initial state. The initial state may ` +
          `not be undefined. If you don't want to set a value for this reducer, ` +
          `you can use null instead of undefined.`
      )
    }

    if (
      typeof reducer(undefined, {
        type: ActionTypes.PROBE_UNKNOWN_ACTION()
      }) === 'undefined'
    ) {
      throw new Error(
        `The slice reducer for key "${key}" returned undefined when probed with a random type. ` +
          `Don't try to handle '${ActionTypes.INIT}' or other actions in "redux/*" ` +
          `namespace. They are considered private. Instead, you must return the ` +
          `current state for any unknown actions, unless it is undefined, ` +
          `in which case you must return the initial state, regardless of the ` +
          `action type. The initial state may not be undefined, but can be null.`
      )
    }
  })
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @template S Combined state object type.
 *
 * @param reducers An object whose values correspond to different reducer
 *   functions that need to be combined into one. One handy way to obtain it
 *   is to use ES6 `import * as reducers` syntax. The reducers may never
 *   return undefined for any action. Instead, they should return their
 *   initial state if the state passed to them was undefined, and the current
 *   state for any unrecognized action.
 *
 * @returns A reducer function that invokes every reducer inside the passed
 *   object, and builds a state object with the same shape.
 */
export default function combineReducers<S>(
  reducers: ReducersMapObject<S, any>
): Reducer<CombinedState<S>>
export default function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<CombinedState<S>, A>
export default function combineReducers<M extends ReducersMapObject>(
  reducers: M
): Reducer<
  CombinedState<StateFromReducersMapObject<M>>,
  ActionFromReducersMapObject<M>
>
export default function combineReducers(reducers: ReducersMapObject) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers: ReducersMapObject = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  // This is used to make sure we don't warn about the same
  // keys multiple times.
  let unexpectedKeyCache: { [key: string]: true }
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  let shapeAssertionError: Error
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function combination(
    state: StateFromReducersMapObject<typeof reducers> = {},
    action: AnyAction
  ) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(
        state,
        finalReducers,
        action,
        unexpectedKeyCache
      )
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    let hasChanged = false
    const nextState: StateFromReducersMapObject<typeof reducers> = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const actionType = action && action.type
        throw new Error(
          `When called with an action of type ${
            actionType ? `"${String(actionType)}"` : '(unknown type)'
          }, the slice reducer for key "${key}" returned undefined. ` +
            `To ignore an action, you must explicitly return the previous state. ` +
            `If you want this reducer to hold no value, you can return null instead of undefined.`
        )
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length
    return hasChanged ? nextState : state
  }
}
```

我们先看主函数`combineReducers`:

```js
import { combineReducers } from 'redux';

const reducer = combineReducers(reducers: ReducersMapObject);

```

其中传入的参数需要是`ReducersMapObject`类型的 reducer。

1. 首先由于我们传入的是一个对象，内部用 `reducerKeys` 存储了对象的 key 组成的数组。

   ```js
   // 存储reducers组成的key数组
   const reducerKeys = Object.keys(reducers);
   ```

2. 然后我们定义了一个最终需要返回的 reducer 对象.

   ```ts
   // 定义最终返回的reducer
   const finalReducers: ReducersMapObject = {};
   ```

3. 接下来遍历所有 reducer 进行拷贝存储

   ```ts
   for (let i = 0; i < reducerKeys.length; i++) {
     const key = reducerKeys[i];

     // 开发环境下输出警告⚠️
     if (process.env.NODE_ENV !== 'production') {
       if (typeof reducers[key] === 'undefined') {
         warning(`No reducer provided for key "${key}"`);
       }
     }

     if (typeof reducers[key] === 'function') {
       finalReducers[key] = reducers[key];
     }
   }
   const finalReducerKeys = Object.keys(finalReducers);
   ```

4. 这段用于处理针对同一个 key 不会进行多次的 warning

   ```ts
   // This is used to make sure we don't warn about the same
   // keys multiple times.
   let unexpectedKeyCache: { [key: string]: true };
   if (process.env.NODE_ENV !== 'production') {
     unexpectedKeyCache = {};
   }

   let shapeAssertionError: Error;
   try {
     // 进行reducer类型断言，不匹配的话会输出警告 了解
     assertReducerShape(finalReducers);
   } catch (e) {
     shapeAssertionError = e;
   }
   ```

5. 接下来返回了一个叫做`combination(state, action)`的方法

   ```ts
   return function combination(
     state: StateFromReducersMapObject<typeof reducers> = {},
     action: AnyAction,
   ) {
     // 如果有错误直接报错
     if (shapeAssertionError) {
       throw shapeAssertionError;
     }

     // 开发环境的时候输出警告
     if (process.env.NODE_ENV !== 'production') {
       const warningMessage = getUnexpectedStateShapeWarningMessage(
         state,
         finalReducers,
         action,
         unexpectedKeyCache,
       );
       if (warningMessage) {
         warning(warningMessage);
       }
     }

     // 主流程代码
     let hasChanged = false;
     const nextState: StateFromReducersMapObject<typeof reducers> = {};
     for (let i = 0; i < finalReducerKeys.length; i++) {
       const key = finalReducerKeys[i];
       const reducer = finalReducers[key];
       const previousStateForKey = state[key];
       const nextStateForKey = reducer(previousStateForKey, action);
       if (typeof nextStateForKey === 'undefined') {
         const actionType = action && action.type;
         throw new Error(
           `When called with an action of type ${
             actionType ? `"${String(actionType)}"` : '(unknown type)'
           }, the slice reducer for key "${key}" returned undefined. ` +
             `To ignore an action, you must explicitly return the previous state. ` +
             `If you want this reducer to hold no value, you can return null instead of undefined.`,
         );
       }
       nextState[key] = nextStateForKey;
       hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
     }
     hasChanged =
       hasChanged || finalReducerKeys.length !== Object.keys(state).length;
     return hasChanged ? nextState : state;
   };
   ```

因此我们可以得到以下的结论:

1. combineReducers 的参数是一个对象(其他各种需要合并的 reducers)。

2. combineReducers 执行结果返回的依旧是一个 reducer，不过聚合了所有传入的 reducers。

3. 通过 combineReducers 返回的 reducer 创建的 store, 再派发某个 action 的时候，实际上每个内在的 reducer 都会执行。

4. createStrore 使用合成的 reducer 创建的 store， 他再派发 action 返回的是总的大的 state(聚合了所有 reducer 内部的 state)。

### compose.js

`compose`方法用于将传入的参数进行执行，将执行后的结果传入下一个函数，直到所有函数执行完毕。

```ts
type Func<T extends any[], R> = (...a: T) => R;

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @param funcs The functions to compose.
 * @returns A function obtained by composing the argument functions from right
 *   to left. For example, `compose(f, g, h)` is identical to doing
 *   `(...args) => f(g(h(...args)))`.
 */
export default function compose(): <R>(a: R) => R;

export default function compose<F extends Function>(f: F): F;

/* two functions */
export default function compose<A, T extends any[], R>(
  f1: (a: A) => R,
  f2: Func<T, A>,
): Func<T, R>;

/* three functions */
export default function compose<A, B, T extends any[], R>(
  f1: (b: B) => R,
  f2: (a: A) => B,
  f3: Func<T, A>,
): Func<T, R>;

/* four functions */
export default function compose<A, B, C, T extends any[], R>(
  f1: (c: C) => R,
  f2: (b: B) => C,
  f3: (a: A) => B,
  f4: Func<T, A>,
): Func<T, R>;

/* rest */
export default function compose<R>(
  f1: (a: any) => R,
  ...funcs: Function[]
): (...args: any[]) => R;

export default function compose<R>(...funcs: Function[]): (...args: any[]) => R;

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

其中涉及到了 2 个基本知识，稍微回顾一下:

1. rest 参数

   形式为 `...rest`,用于获取函数的多余参数 ，该变量将多余的参数放入数组中,　**只能是参数的最后一个**。

2. 扩展运算符

   `扩展运算符（spread）`是三个点`（...）`。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

   ```js
   var fun1 = (...args) => console.log(...args);
   fun1('Hello', 'World');
   // 结果输出 Hello, World
   ```

```ts
function compose(...funcs: Function[]) {
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

该方法十分简单，如果传入的参数为长度为 0 的直接返回，如果传入的长度为 1，返回第 0 个元素，否则调用 `Array.reduce` 方法进行迭代。

最关键的一行代码就是:

```js
funcs.reduce(
  (a, b) =>
    (...args: any) =>
      a(b(...args)),
);
```

我们来看看该方式的一个示例加深理解:

```js
const fn1 = (val) => 'fn1-' + val;
const fn2 = (val) => 'fn2-' + val;
const fn3 = (val) => 'fn3-' + val;

// fn1-fn2-fn3-测试
compose(fn1, fn2, fn3)('测试:');
```

我们来看下执行流程:

1. 首先 func3 初始化的值为 `funcs = [fn1,fn2,fn3];`

2. reduce 执行第一次时，a = fn1，b = fn2，`a(b(...args)) = fn1(fn2(...args))`;

3. reduce 执行第二次时，a = fn1(fn2(...args))， b = fn3，`a(b(...args)) = fn1(fn2(fn3(...args)))`;

4. 最后如果传入再多的函数执行也是按照此流程执行。

### applyMiddleware.js

`applyMiddleware` 用于中间件功能的添加，可以在我们的 action 经 reducer 执行时执行一些其他的操作。

```ts
import compose from './compose';
import { Middleware, MiddlewareAPI } from './types/middleware';
import { AnyAction } from './types/actions';
import {
  StoreEnhancer,
  Dispatch,
  PreloadedState,
  StoreEnhancerStoreCreator,
} from './types/store';
import { Reducer } from './types/reducers';

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param middlewares The middleware chain to be applied.
 * @returns A store enhancer applying the middleware.
 *
 * @template Ext Dispatch signature added by a middleware.
 * @template S The type of the state supported by a middleware.
 */
export default function applyMiddleware(): StoreEnhancer;
export default function applyMiddleware<Ext1, S>(
  middleware1: Middleware<Ext1, S, any>,
): StoreEnhancer<{ dispatch: Ext1 }>;
export default function applyMiddleware<Ext1, Ext2, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
): StoreEnhancer<{ dispatch: Ext1 & Ext2 }>;
export default function applyMiddleware<Ext1, Ext2, Ext3, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>,
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 }>;
export default function applyMiddleware<Ext1, Ext2, Ext3, Ext4, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>,
  middleware4: Middleware<Ext4, S, any>,
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 & Ext4 }>;
export default function applyMiddleware<Ext1, Ext2, Ext3, Ext4, Ext5, S>(
  middleware1: Middleware<Ext1, S, any>,
  middleware2: Middleware<Ext2, S, any>,
  middleware3: Middleware<Ext3, S, any>,
  middleware4: Middleware<Ext4, S, any>,
  middleware5: Middleware<Ext5, S, any>,
): StoreEnhancer<{ dispatch: Ext1 & Ext2 & Ext3 & Ext4 & Ext5 }>;
export default function applyMiddleware<Ext, S = any>(
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: Ext }>;
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  return (createStore: StoreEnhancerStoreCreator) =>
    <S, A extends AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>,
    ) => {
      const store = createStore(reducer, preloadedState);
      let dispatch: Dispatch = () => {
        throw new Error(
          'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.',
        );
      };

      const middlewareAPI: MiddlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args),
      };
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      dispatch = compose<typeof dispatch>(...chain)(store.dispatch);

      return {
        ...store,
        dispatch,
      };
    };
}
```

我们用一张图来理解下中间件所处的位置:

![中间件](https://img-blog.csdnimg.cn/090fb7edb13e43758f395d3fb63e8a91.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- 中间件是通过 next 来进入下一个中间件的，执行完毕后，会调用最原始的 store.disptach，reducer 执行完毕后，该次操作并没有完毕， 还会依次返回到中间件。

- 任何一个中间件不 next ，其后面的中间件都不会执行，（不等于 return next(action)，return next(action)一般情况都是返回原始的 action, 只要你调用了 next(action)就行），redux-thunk 就是这么干的（检查到 action 是函数的时候，没有执行 next()）

回归关键部分源码:

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

然后定义了一个`chain`对传入的中间件进行遍历，执行内部的方法，最后使用 compose 方法进行组合返回一个新的 dispatch 方法。

相当于传入了这么一段代码:

```js
applyMiddleware(…middlewares)(createStore)(reducer,preloadedState)
```

最终返回了一个正常的 Store 和一个被变更过的 dispatch 方法，实现了对 Store 的增强。

至此相关核心的概念已经全部剖析完毕。

## 常用问题 QA

### 中间件为什么要嵌套函数？为何不在一层函数中传递三个参数，而要在一层函数中传递一个参数，一共传递三层？

因为中间件是要多个首尾相连的，对 next 进行一层层的“加工”，所以 next 必须独立一层。那么 Store 和 action 呢？

- `Store` 的话，我们要在中间件顶层放上 Store，因为我们要用 Store 的 dispatch 和 getState 两个方法。

- `action` 的话，是因为我们封装了这么多层，其实就是为了作出更高级的 dispatch 方法，是 dispatch，就得接受 action 这个参数。

### middlewareAPI 中的 dispatch 为什么要用匿名函数包裹呢？

我们用 `applyMiddleware` 是为了改造 dispatch 的，所以 applyMiddleware 执行完后，dispatch 是变化了的。而 middlewareAPI 是 applyMiddleware 执行中分发到各个 middleware，所以必须用匿名函数包裹 dispatch，这样只要 dispatch 更新了，middlewareAPI 中的 dispatch 应用也会发生变化。

### 在 middleware 里调用 dispatch 跟调用 next 一样吗？

因为我们的 dispatch 是用匿名函数包裹，所以在中间件里执行 dispatch 跟其它地方没有任何差别，而执行 next 相当于调用下个中间件。

### 为什么说 Redux 与 immutable.js 配合使用效果更好?

**首先我们得知道什么是 immutable?**

> [immutable.js](https://github.com/immutable-js/immutable-js)是一种不可变数据，一旦被创建之后就不可被修改。我们对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。

其内部采用了一种 `Persistent Data Structure(持久化数据结构)`，也就是数据改变时(增删改)要保证旧数据同时可用且不变。

为了避免深拷贝把所有节点都复制一遍带来的性能损耗，`Immutable.js` 使用了 `Structural Sharing(结构共享)`， 即如果对象树节点发生变化，只修改这个节点和受它影响的父节点，其他节点共享。

**那么为什么需要使用 immutable.js 呢?**

- 首先回到 redux 中，我们知道 reducer 被定义为纯函数，当我们去执行 reducer 的时候，需要去返回一个新的 state 而不是修改原有的 state。

- 其次，思考下假如我们的 state 代码内部嵌套层级非常的深

  ```js
  ...
  this.state = {
      obj: {
          a: {
              child: {
                  arr: [1, 2, 3],
                  obj: {
                      key: 1,
                      txt: 'a'
                  }
              }
          }
      }
  }
  ```

  当我们需要去修改 `a` 下 `child` 的 `obj` 的值时就非常麻烦。

  ```js
  this.setState({
      obj:{
          a: {
              child: {
                  arr: arr: [1, 2, 3],
                  obj: {
                      key: 1,
                      txt: 'aa'
                  }
              }
          }
      }
  })
  ```

  这里还是只有一个嵌套较深，如果再来几个就异常臃肿。有人可能会采用下面的方式进行修改:

  ```js
  // 赋值this.state 直接回报警告
  this.state.a.child.obj.text = 'aa';
  this.setState(this.state);

  // 采用引用赋值 本质上是一样的
  const myState = this.state;
  myState.state.a.child.obj.text = 'aa';
  this.setState(myState);
  ```

  上述两种方式都是错误 ❌ 示例，为了解决问题，我们只能使用`深度拷贝`，但是`深拷贝`就非常耗费性能，因为这时候使用`immutable`就可以帮助我们解决问题。

### 如何在 redux 中使用 immutable.js？

1.  安装

    ```js
    npm i redux react-redux immutable --save
    // yarn add redux react-redux immutable
    ```

2.  使用

    - store.js

    在 `store.js` 中与原先使用并无差异，已 `redux-thunk` 为例:

    ```js
    import { createStore, compose, applyMiddleware } from 'redux';
    import ReduxThunk from 'redux-thunk';
    import reducer from './reducer';

    const enhancer = compose(applyMiddleware(ReduxThunk));
    const store = createStore(reducer, enhancer);

    export default store;
    ```

    - reducer/index.js

    ```js
    // import { combineReducers } from 'redux';
    import { combineReducers } from 'redux-immutable';
    import headerReducer from './reducer/header';
    import homeReducer from './reducer/home';

    // 直接把 combineReducers 下面的所有属性都变成了 immutable
    export default combineReducers({
      header: headerReducer,
      home: homeReducer,
    });
    ```

    - reducer/header.js

    ```js
    import { fromJS } from 'immutable';
    import * as constants from './constants';

    const defaultState = fromJS({
      focused: false,
      list: [],
      page: 1,
      totalPage: 1,
    });

    export default (state = defaultState, action) => {
      switch (action.type) {
        case constants.HEADER_INPUT_FOCUS:
          // immutable 对象的 set 方法，会结合之前 immutable 对象的值和设置的值，返回一个全新的对象
          return state.set('focused', true);
        case constants.HEADER_INPUT_BLUR:
          return state.set('focused', false);
        case constants.CHANGE_LIST:
          return state.merge({
            list: action.data,
            totalPage: action.totalPage,
          });
        // merge 的写法等价于下面的这行代码
        // return state.set('list', action.data).set('totalPage', action.totalPage)
        case constants.CHANGE_PAGE:
          return state.set('page', action.page);
        default:
          return state;
      }
    };
    ```

    - reducer/home.js

    ```js
    import React from 'react';
    import { connect } from 'react-redux';

    @connect((state) => ({
      List: state.get('home').get('List'),
    }))
    export default class Home extends React.Component {
      render() {
        return (
          <div>
            {this.props.List.map((item) => {
              return (
                <div key={item.get('id')}>
                  <img src={item.get('imgUrl')} />
                  {item.get('title')}
                </div>
              );
            })}
          </div>
        );
      }
    }
    ```

    - 入口文件 index.js

    ```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { Provider } from 'react-redux';

    import Home from './pages/home';
    import store from './store';
    import Header from './pages/header';

    class App extends React.Component {
      render() {
        return (
          <Provider store={store}>
            <Header />
            <Home />
          </Provider>
        );
      }
    }

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root'),
    );
    ```

### 使用 immutable.js 有什么注意事项?

虽然`immutable.js`提供的功能非常强大，但是在使用的时候还是需要谨慎。主要需要注意以下几点:

- #### 交互操作困难

JavaScript 没有提供不可变的数据结构。因此，要保证 `immutable.js` 其不可变，我们的数据就必须封装在 `immutable.js` 对象（例如：`Map` 或 `List` 等）中。一旦使用这种方式包裹数据，这些数据就很难与其他普通的 `JavaScript` 对象进行交互操作。

例如，我们将不再能够通过标准 JavaScript 中的点语法或中括号引用对象的属性。相反，我们必须通过 `immutable.js` 提供的 `get()` 或 `getIn()` 方法来引用它们，这些方法使用了一种笨拙的语法，通过一个字符串字符串数组访问属性，每个字符串代表一个属性的 `key`。

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
  '虽然`immutable.js` 对象确实包含 `toJS()` 方法，该方法会返回普通 `JavaScript` 数据结构形式的对象，但这种方法非常慢，广泛使用将会失去 `immutable.js` 提供的性能优势。';

export default () => <Info type="warning" txt={txt} />;
```

- #### 没有解构或展开运算符(Spread Operators)

由于我们必须通过 `immutable.js` 本身的 `get()` 和 `getIn()` 方法来访问数据，所以不能再使用 `JavaScript` 的`解构运算符`（或者提案中的 Object 扩展运算符），这使得我们的代码更加冗余。

- #### 不适用于经常改变的小数值

`immutable.js` 最适用于数据集合，越大越好。当我们的数据包含大量小而简单的 `JavaScript` 对象时，速度会很慢，每个对象都包含几个基本数据类型的 `key`。

- #### 难以调试

`immutable.js` 对象，如 `Map`，`List` 等可能很难调试，因为检查这样的对象会看到整个嵌套层级结构，这些层级我们并不关心，我们真正关心的是实际数据被封装了几层。
