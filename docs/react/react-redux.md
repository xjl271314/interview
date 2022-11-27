---
title: react-redux核心原理
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: react
  path: /react/project
---

# React-Redux

- 2021.08.16

> `react-redux` 是 redux 官方提供的 React 绑定库，用于在 React 应用中快速集成 redux。

## 集成

```js
npm install --save redux react-redux
// yarn add redux react-redux
```

## 核心概念

不同于 redux，react-redux 的核心概念主要就两个:

1. `<Provider store>`

2. `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`

### Provider store

我们在 `redux` 的概念中知道需要提供一个全局的 `store` 给应用使用，且该 store 必须是唯一的，因此单独去使用 redux 的时候我们需要在每个用到 store 的地方都去手动`import`进来，当然我们可以自己通过`Context API`去实现一个全局的上下文，但是这个事情`Provider`已经帮我们做好了。

### connect

我们知道在 redux 工作流中要去获取 state 需要通过调用 `getState API`，要去改变 state 需要通过 `dispatch` 一个 action，在不使用 `connect API` 的情况下我们每次都需要去通过 `store.dispatch` 方法进行触发这样就非常麻烦，而 `connect` 帮助我们将 `store` 中的数据绑定到了 `React` 组件的 `props` 属性上，方便我们直接使用。

简单的流程大致如下:

![react-redux流程](https://img-blog.csdnimg.cn/4883341d8c9f4f92ac855562a16f9e2e.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

我们来对比下使用 `Provider` 和 `connect` 前后的代码:

- #### 使用前

  - Store.js

  ```js
  import { createStore } from 'redux';

  const reducer = (state = { count: 0 }, action) => {
    switch (action.type) {
      case 'INCREASE':
        return { count: state.count + 1 };
      case 'DECREASE':
        return { count: state.count - 1 };
      default:
        return state;
    }
  };

  const actions = {
    increase: () => ({ type: 'INCREASE' }),
    decrease: () => ({ type: 'DECREASE' }),
  };

  const store = createStore(reducer);

  store.subscribe(() => console.log(store.getState()));

  export default Store;
  ```

  - Todo.js

  ```js
  import React from react;
  import store from './Store';

  export default class Todos extends Component {
      render(){
          return(
              <div onCLick={()=>store.dispatch(actions.increase()) }>test</div>
          )
      }
  }
  ```

- #### 使用后

  ```js
  import React, { Component } from 'react';
  import store from './Store';
  import { connect } from 'react-redux';

  @connect()
  class Todos extends Component {
    render() {
      return <div onCLick={() => this.props.actions.increase()}>test</div>;
    }
  }

  export default Todos;
  ```

## 源码分析

这里展示的源码版本是[V7.2.4](https://github.com/reduxjs/react-redux)，我们从底层来看看这两个 API 干了啥?

```ts
├── components
│   ├── Context.ts
│   ├── Provider.tsx
│   ├── connectAdvanced.tsx
├── connect
│   ├── connect.ts
│   ├── mapDispatchToProps.ts
│   ├── mapStateToProps.ts
│   ├── mergeProps.ts
│   ├── selectorFactory.ts
│   ├── verifySubselectors.ts
│   ├── wrapMapToProps.ts
├── hooks
│   ├── useDispatch.ts
│   ├── useReduxContext.ts
│   ├── useSelector.ts
│   ├── useStore.ts
├── utils
│   ├── Subscription.ts
│   ├── batch.ts
│   ├── bindActionCreators.ts
│   ├── isPlainObject.ts
│   ├── reactBatchedUpdates.native.ts
│   ├── reactBatchedUpdates.ts
│   ├── shallowEqual.ts
│   ├── useIsomorphicLayoutEffect.native.ts
│   ├── useIsomorphicLayoutEffect.ts
│   ├── verifyPlainObject.ts
│   ├── warning.ts
├── alternate-renderers.ts
├── exports.ts
├── index.ts
├── types.ts
```

### Provider

1. `Provider` 首先创建一个 `contextValue` ，里面包含一个创建出来的父级 `Subscription` (我们称之为根级订阅器)和 `redux` 提供的 `store`。

2. 通过 `react` 上下文 `context API` 把 `contextValue` 传递给子孙组件，这样子孙组件都可以通过 props 访问到 Store。

```js
import React, { Context, ReactNode, useMemo } from 'react'
import { ReactReduxContext, ReactReduxContextValue } from './Context'
import { createSubscription } from '../utils/Subscription'
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect'
import type { FixTypeLater } from '../types'
import { Action, AnyAction, Store } from 'redux'

export interface ProviderProps<A extends Action = AnyAction> {
  /**
   * The single Redux store in your application.
   */
  store: Store<FixTypeLater, A>
  /**
   * Optional context to be used internally in react-redux. Use React.createContext() to create a context to be used.
   * If this is used, generate own connect HOC by using connectAdvanced, supplying the same context provided to the
   * Provider. Initial value doesn't matter, as it is overwritten with the internal state of Provider.
   */
  context?: Context<ReactReduxContextValue | null>
  children: ReactNode
}

function Provider({ store, context, children }: ProviderProps) {
  /* 利用useMemo，跟据store变化创建出一个contextValue 包含一个根元素订阅器和当前store  */
  const contextValue = useMemo(() => {
    /* 创建了一个根 Subscription 订阅器 */
    const subscription = createSubscription(store)
    /* subscription 的 notifyNestedSubs 方法 ，赋值给  onStateChange方法 */
    subscription.onStateChange = subscription.notifyNestedSubs
    return {
      store,
      subscription,
    }/*  每当 store 改变创建新的contextValue */
  }, [store]);
  /* 获取更新之前的state值 ，函数组件里面的上下文要优先于组件更新渲染  */
  const previousState = useMemo(() => store.getState(), [store])

  useIsomorphicLayoutEffect(() => {
    const { subscription } = contextValue
    /* 触发trySubscribe方法执行，创建listens */
    subscription.trySubscribe()

    if (previousState !== store.getState()) {
      /* 组件更新渲染之后，如果此时state发生改变，那么立即触发 subscription.notifyNestedSubs 方法  */
      subscription.notifyNestedSubs()
    }
    return () => {
      subscription.tryUnsubscribe()
      subscription.onStateChange = undefined
    }
  }, [contextValue, previousState])

  /* context 存在用根元素传进来的context ，如果不存在 createContext创建一个context  ，这里的ReactReduxContext就是由createContext创建出的context */
  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default Provider;
```

### Subscription

在 `Provider` 源码中出现了 `Subscription` 函数，主要运用到了`notifyNestedSubs`、`trySubscribe`、`tryUnsubscribe`这三个 API，那么这个函数内部的原理是什么呢?

**在整个 `react-redux` 执行过程中 `Subscription` 作用非常重要，他的作用是收集所有被 `connect` 包裹的组件的更新函数 `onstatechange`，然后形成一个 `callback` 链表，再由父级 `Subscription` 统一派发执行更新。**

- batch.ts

  接收一个 callback 并执行。

  ```ts
  function defaultNoopBatch(callback: () => void) {
    callback();
  }

  let batch = defaultNoopBatch;

  // Allow injecting another batching function later
  export const setBatch = (newBatch: typeof defaultNoopBatch) =>
    (batch = newBatch);

  // Supply a getter just to skip dealing with ESM bindings
  export const getBatch = () => batch;
  ```

- Subscription.ts

  ```ts
  import { getBatch } from './batch';

  // encapsulates the subscription logic for connecting a component to the redux store, as
  // well as nesting subscriptions of descendant components, so that we can ensure the
  // ancestor components re-render before descendants

  type VoidFunc = () => void;

  type Listener = {
    callback: VoidFunc;
    next: Listener | null;
    prev: Listener | null;
  };

  // 创建监听收集函数
  function createListenerCollection() {
    const batch = getBatch();
    let first: Listener | null = null;
    let last: Listener | null = null;

    return {
      clear() {
        first = null;
        last = null;
      },

      notify() {
        batch(() => {
          let listener = first;
          while (listener) {
            listener.callback();
            listener = listener.next;
          }
        });
      },

      get() {
        let listeners = [];
        let listener = first;
        while (listener) {
          listeners.push(listener);
          listener = listener.next;
        }
        return listeners;
      },

      subscribe(callback: () => void) {
        let isSubscribed = true;

        let listener: Listener = (last = {
          callback,
          next: null,
          prev: last,
        });

        if (listener.prev) {
          listener.prev.next = listener;
        } else {
          first = listener;
        }

        return function unsubscribe() {
          if (!isSubscribed || first === null) return;
          isSubscribed = false;

          if (listener.next) {
            listener.next.prev = listener.prev;
          } else {
            last = listener.prev;
          }
          if (listener.prev) {
            listener.prev.next = listener.next;
          } else {
            first = listener.next;
          }
        };
      },
    };
  }

  type ListenerCollection = ReturnType<typeof createListenerCollection>;

  export interface Subscription {
    addNestedSub: (listener: VoidFunc) => VoidFunc;
    notifyNestedSubs: VoidFunc;
    handleChangeWrapper: VoidFunc;
    isSubscribed: () => boolean;
    onStateChange?: VoidFunc | null;
    trySubscribe: VoidFunc;
    tryUnsubscribe: VoidFunc;
    getListeners: () => ListenerCollection;
  }

  const nullListeners = {
    notify() {},
    get: () => [],
  } as unknown as ListenerCollection;

  export function createSubscription(store: any, parentSub?: Subscription) {
    let unsubscribe: VoidFunc | undefined;
    let listeners: ListenerCollection = nullListeners;

    function addNestedSub(listener: () => void) {
      trySubscribe();
      return listeners.subscribe(listener);
    }

    function notifyNestedSubs() {
      listeners.notify();
    }

    function handleChangeWrapper() {
      if (subscription.onStateChange) {
        subscription.onStateChange();
      }
    }

    function isSubscribed() {
      return Boolean(unsubscribe);
    }

    function trySubscribe() {
      if (!unsubscribe) {
        unsubscribe = parentSub
          ? parentSub.addNestedSub(handleChangeWrapper)
          : store.subscribe(handleChangeWrapper);

        listeners = createListenerCollection();
      }
    }

    function tryUnsubscribe() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
        listeners.clear();
        listeners = nullListeners;
      }
    }

    const subscription: Subscription = {
      addNestedSub,
      notifyNestedSubs,
      handleChangeWrapper,
      isSubscribed,
      trySubscribe,
      tryUnsubscribe,
      getListeners: () => listeners,
    };

    return subscription;
  }
  ```

#### Subscription 流程分析

1. 首先我们来看 Provider 中传入的方法

   ```ts
   /* 创建了一个根 Subscription 订阅器 */
   const subscription = createSubscription(store);
   ```

   我们在创建`subscription`的时候仅传递了一个参数`store`，并没有传入`parentSub`，因此 `provider` 中的 `Subscription`是不存在 `parentSub`的 。

2. 接着看 trySubscribe 方法

   ```ts
   function trySubscribe() {
     if (!unsubscribe) {
       unsubscribe = parentSub
         ? parentSub.addNestedSub(handleChangeWrapper)
         : store.subscribe(handleChangeWrapper);

       listeners = createListenerCollection();
     }
   }
   ```

   由于没有传入 `parentSub` 参数，因此 `Provider` 中的订阅会触发`store.subscribe(handleChangeWrapper);`，而该`subscribe` 就是 `redux` 的 `subscribe`，此时真正发起了订阅。

3. 创建了订阅之后创建一个监听

   ```ts
   subscription.onStateChange = subscription.notifyNestedSubs;
   ```

   当 state 状态变更的时候，我们实际是触发了 `subscription.notifyNestedSubs`方法。而该方法实际上调用的是`listeners.notify()`。

   ```ts
   function notifyNestedSubs() {
     listeners.notify();
   }
   ```

4. 通过 createListenerCollection 向所有监听者发布通知

   ```ts
   listeners = createListenerCollection();

   listeners.notify = function () {
     batch(() => {
       let listener = first;
       while (listener) {
         listener.callback();
         listener = listener.next;
       }
     });
   };
   ```

   listeners 的作用如下:

   1. 收集订阅： 以链表的形式收集对应的 listeners (每一个 Subscription) 的 handleChangeWrapper 函数。

   2. 派发更新：通过 batch 方法( react-dom 中的 `unstable_batchedUpdates` ) 来进行批量更新。

      ```jsx
      /**
       * inline: true
       */
      import React from 'react';
      import { Info } from 'interview';

      const txt =
        'React 的 `unstable_batchedUpdate() API` 允许将一次事件循环中的所有 React 更新都一起批量处理到一个渲染过程中。';

      export default () => <Info type="info" txt={txt} />;
      ```

#### Subscription 总结 - 发布订阅模式的实现

综上所述，`Subscription` 的作用,首先通过 `trySubscribe` 发起订阅模式，

- 如果存在父级订阅者，就把自己的更新函数 `handleChangeWrapper`，传递给父级订阅者，然后父级由 `addNestedSub` 方法将此时的回调函数（更新函数）添加到当前的 `listeners` 中 。

- 如果没有父级元素(Provider 的情况)，则将此回调函数放在 `store.subscribe` 中，`handleChangeWrapper` 函数中 `onStateChange`，就是 `Provider` 中 `Subscription` 的 `notifyNestedSubs` 方法，而 `notifyNestedSubs` 方法会通知 `listens` 的 `notify` 方法来触发更新。

  ```jsx
  /**
   * inline: true
   */
  import React from 'react';
  import { Info } from 'interview';

  const txt =
    '子代 `Subscription` 会把更新自身 `handleChangeWrapper` 传递给 `parentSub`，来统一通知 `connect` 组件更新。';

  export default () => <Info type="info" txt={txt} />;
  ```

因此实际上 `react-redux` 更新组件也是用了 `store.subscribe` 而且 `store.subscribe` 只用在了 `Provider` 的 `Subscription` 中 (没有 parentsub )。

大致的流程可以总结如下:

![react-redux更新流程图](https://img-blog.csdnimg.cn/bcfdd63b0a6e4a8191b6a4fec3b92050.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### Provider 与 Subscription 总结

通过上面的分析我们可以得到如下的结论:

1. `react-redux` 中的 `provider` 作用 ，通过 react 的 `context` 传递 `subscription` 和 redux 中的 `store` ,并且建立了一个最顶部根 `Subscription` 。

2. `Subscription` 的作用：起到`发布订阅`作用，一方面订阅 `connect` 包裹组件的更新函数，一方面通过 `store.subscribe` 统一派发更新。

3. `Subscription` 如果存在这父级的情况，会把自身的更新函数，传递给父级 `Subscription` 来统一订阅。

### Connect

```js
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```

`connect()` 接收四个参数，它们分别是 `mapStateToProps` ， `mapDispatchToProps`， `mergeProps` 和 `options` 。

1. mapStateToProps

   `mapStateToProps` 这个函数允许我们将 `store` 中的数据作为 `props` 绑定到组件上，当 `state` 改变时触发业务组件 `props` 改变，触发业务组件更新视图。

   - 示例代码:

   ```js
   const mapStateToProps = (state) => ({ todos: state.todos });
   ```

   - 源码部分:

   ```ts
   import {
     MapToProps,
     wrapMapToPropsConstant,
     wrapMapToPropsFunc,
   } from './wrapMapToProps';

   export function whenMapStateToPropsIsFunction(mapStateToProps?: MapToProps) {
     return typeof mapStateToProps === 'function'
       ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
       : undefined;
   }

   export function whenMapStateToPropsIsMissing(mapStateToProps?: MapToProps) {
     return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined;
   }

   export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];
   ```

2. mapDispatchToProps

   `mapDispatchToProps`用于将 `redux` 中的 `dispatch` 方法，映射到，业务组件的 `props` 中。

   - 示例代码:

   ```js
   const mapDispatchToProps = (dispatch) => {
     return {
       increment: () => dispatch({ type: 'INCREMENT' }),
       decrement: () => dispatch({ type: 'DECREMENT' }),
       reset: () => dispatch({ type: 'RESET' }),
     };
   };
   ```

   - 源码部分:

   ```ts
   import { ActionCreatorsMapObject, Dispatch } from 'redux';
   import { FixTypeLater } from '../types';
   import bindActionCreators from '../utils/bindActionCreators';
   import {
     wrapMapToPropsConstant,
     wrapMapToPropsFunc,
   } from './wrapMapToProps';

   export function whenMapDispatchToPropsIsFunction(
     mapDispatchToProps: ActionCreatorsMapObject | FixTypeLater,
   ) {
     return typeof mapDispatchToProps === 'function'
       ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps')
       : undefined;
   }

   export function whenMapDispatchToPropsIsMissing(
     mapDispatchToProps: undefined,
   ) {
     return !mapDispatchToProps
       ? wrapMapToPropsConstant((dispatch: Dispatch) => ({
           dispatch,
         }))
       : undefined;
   }

   export function whenMapDispatchToPropsIsObject(
     mapDispatchToProps: ActionCreatorsMapObject,
   ) {
     return mapDispatchToProps && typeof mapDispatchToProps === 'object'
       ? wrapMapToPropsConstant((dispatch: Dispatch) =>
           bindActionCreators(mapDispatchToProps, dispatch),
         )
       : undefined;
   }

   export default [
     whenMapDispatchToPropsIsFunction,
     whenMapDispatchToPropsIsMissing,
     whenMapDispatchToPropsIsObject,
   ];
   ```

3. mergeProps

   经过 `conncet` 的组件的 props 有 3 个来源：一是由 `mapStateToProps` 将 `state` 映射成的 `props`，二是由 `mapDispatchToProps` 将 `Action creator` 映射成的 `props`，三是组件自身的 `props`。

   因此，`mergeProps`主要用于整个这些 props 并且过滤一些不需要的 props。

   - 示例代码:

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

   - 源码部分:

   ```ts
   import { Dispatch } from 'redux';
   import verifyPlainObject from '../utils/verifyPlainObject';

   type MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps> = (
     stateProps: TStateProps,
     dispatchProps: TDispatchProps,
     ownProps: TOwnProps,
   ) => TMergedProps;

   export function defaultMergeProps<TStateProps, TDispatchProps, TOwnProps>(
     stateProps: TStateProps,
     dispatchProps: TDispatchProps,
     ownProps: TOwnProps,
   ) {
     return { ...ownProps, ...stateProps, ...dispatchProps };
   }

   interface InitMergeOptions {
     displayName: string;
     pure?: boolean;
     areMergedPropsEqual: (a: any, b: any) => boolean;
   }

   export function wrapMergePropsFunc<
     TStateProps,
     TDispatchProps,
     TOwnProps,
     TMergedProps,
   >(
     mergeProps: MergeProps<
       TStateProps,
       TDispatchProps,
       TOwnProps,
       TMergedProps
     >,
   ): (
     dispatch: Dispatch,
     options: InitMergeOptions,
   ) => MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps> {
     return function initMergePropsProxy(
       dispatch,
       { displayName, pure, areMergedPropsEqual },
     ) {
       let hasRunOnce = false;
       let mergedProps: TMergedProps;

       return function mergePropsProxy(
         stateProps: TStateProps,
         dispatchProps: TDispatchProps,
         ownProps: TOwnProps,
       ) {
         const nextMergedProps = mergeProps(
           stateProps,
           dispatchProps,
           ownProps,
         );

         if (hasRunOnce) {
           if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps))
             mergedProps = nextMergedProps;
         } else {
           hasRunOnce = true;
           mergedProps = nextMergedProps;

           if (process.env.NODE_ENV !== 'production')
             verifyPlainObject(mergedProps, displayName, 'mergeProps');
         }

         return mergedProps;
       };
     };
   }

   export function whenMergePropsIsFunction<
     TStateProps,
     TDispatchProps,
     TOwnProps,
     TMergedProps,
   >(
     mergeProps: MergeProps<
       TStateProps,
       TDispatchProps,
       TOwnProps,
       TMergedProps
     >,
   ) {
     return typeof mergeProps === 'function'
       ? wrapMergePropsFunc(mergeProps)
       : undefined;
   }

   export function whenMergePropsIsOmitted<
     TStateProps,
     TDispatchProps,
     TOwnProps,
     TMergedProps,
   >(
     mergeProps?: MergeProps<
       TStateProps,
       TDispatchProps,
       TOwnProps,
       TMergedProps
     >,
   ) {
     return !mergeProps ? () => defaultMergeProps : undefined;
   }

   export default [whenMergePropsIsFunction, whenMergePropsIsOmitted] as const;
   ```

4. options

   options 不怎么常用，主要功能如下:

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

## 源码流程分析

我们从 connect 的入口文件开始，源代码部分比较长包含了一堆定义，[完整代码](https://github.com/reduxjs/react-redux/blob/master/src/connect/connect.ts)，我们关注几个关键的函数:

```ts
export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory,
} = {}) {
  function connect(
    mapStateToProps?: unknown,
    mapDispatchToProps?: unknown,
    mergeProps?: unknown,
    {
      pure = true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    }: ConnectOptions<unknown, unknown, unknown, unknown> = {},
  ): unknown {
    const initMapStateToProps = match(
      mapStateToProps,
      // @ts-ignore
      mapStateToPropsFactories,
      'mapStateToProps',
    );
    const initMapDispatchToProps = match(
      mapDispatchToProps,
      // @ts-ignore
      mapDispatchToPropsFactories,
      'mapDispatchToProps',
    );
    const initMergeProps = match(
      mergeProps,
      // @ts-ignore
      mergePropsFactories,
      'mergeProps',
    );

    return connectHOC(selectorFactory as SelectorFactory<any, any, any, any>, {
      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: (name) => `Connect(${name})`,

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,

      // any extra options args can override defaults of connect or connectAdvanced
      ...extraOptions,
    });
  }

  return connect;
}

/* @public */
const connect = /*#__PURE__*/ createConnect();

export default connect;
```

1. 首先我们导出了一个`connect`方法，该方法是通过`createConnect()`方法创建的，接收 5 个参数，其中我们重点关注`connectHOC`和`selectorFactory`。

   - `connectHOC` 作为整个 `connect` 的高阶组件。

   - `selectorFactory` 做为整合 `connect` 更新过程中的形成新 `props` 的主要函数。默认的模式是 `pure` 模式。

2. 然后执行 `createConnect` 方法，返回真正的 `connect` 函数本身。`connect` 接收几个参数，然后和默认的函数进行整合，包装，代理，最后形成三个真正的初始化函数。

   - `initMapStateToProps`:

   用于形成真正的 `MapStateToProps` 函数，将 store 中 state ,映射到 props。

   - `initMapDispatchToProps`:

   用于形成真正的 `MapDispatchToProps`，将 `dispatch` 和 自定义的 `dispatch` 注入到 `props`。

   - `initMergeProps`:

   用于形成真正的 `mergeProps` 函数，合并业务组件的 `props` , `state` 映射的 `props` , `dispatch` 映射的 `props`。

   **当我们不向 connect 传递第三个参数 mergeProps 的时候，默认的 defaultMergeProps 如下:**

   ```js
   export function defaultMergeProps(stateProps, dispatchProps, ownProps) {
     return { ...ownProps, ...stateProps, ...dispatchProps };
   }
   ```

   这个函数返回了一个新的对象，也就是新的 `props`。而且将 业务组件 `props` , `store` 中的 `state` ,和 `dispatch` 结合到一起，形成一个新对象，作为新的 `props` 传递给了业务组件。

接着我们回看之前提到的 `selectorFactory`，该方法用于形成新的 `props`，[完整代码](https://github.com/reduxjs/react-redux/blob/master/src/connect/selectorFactory.ts)

```ts
import type { Dispatch, Action } from 'redux';
import verifySubselectors from './verifySubselectors';
import type { DefaultRootState, EqualityFn } from '../types';

// 导出一个impureFinalPropsSelector方法
export function impureFinalPropsSelectorFactory<
  TStateProps,
  TOwnProps,
  TDispatchProps,
  TMergedProps,
  State = DefaultRootState,
>(
  mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
  mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
  mergeProps: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
  dispatch: Dispatch,
) {
  return function impureFinalPropsSelector(state: State, ownProps: TOwnProps) {
    return mergeProps(
      // @ts-ignore
      mapStateToProps(state, ownProps),
      // @ts-ignore
      mapDispatchToProps(dispatch, ownProps),
      ownProps,
    );
  };
}

export function pureFinalPropsSelectorFactory<
  TStateProps,
  TOwnProps,
  TDispatchProps,
  TMergedProps,
  State = DefaultRootState,
>(
  mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State> & {
    dependsOnOwnProps: boolean;
  },
  mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps> & {
    dependsOnOwnProps: boolean;
  },
  mergeProps: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
  dispatch: Dispatch,
  {
    areStatesEqual,
    areOwnPropsEqual,
    areStatePropsEqual,
  }: PureSelectorFactoryComparisonOptions<TOwnProps, State>,
) {
  let hasRunAtLeastOnce = false;
  let state: State;
  let ownProps: TOwnProps;
  let stateProps: TStateProps;
  let dispatchProps: TDispatchProps;
  let mergedProps: TMergedProps;

  /* 第一次 直接形成 ownProps  stateProps  dispatchProps 合并  形成新的 props */
  function handleFirstCall(firstState: State, firstOwnProps: TOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    // @ts-ignore
    stateProps = mapStateToProps!(state, ownProps);
    // @ts-ignore
    dispatchProps = mapDispatchToProps!(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  //  props 和 state 都改变  mergeProps
  function handleNewPropsAndNewState() {
    // @ts-ignore
    stateProps = mapStateToProps!(state, ownProps);

    if (mapDispatchToProps!.dependsOnOwnProps)
      // @ts-ignore
      dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  // props 改变  mergeProps
  function handleNewProps() {
    if (mapStateToProps!.dependsOnOwnProps)
      // @ts-ignore
      stateProps = mapStateToProps!(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps)
      // @ts-ignore
      dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  // state 改变 mergeProps
  function handleNewState() {
    const nextStateProps = mapStateToProps(state, ownProps);
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    // @ts-ignore
    stateProps = nextStateProps;

    if (statePropsChanged)
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);

    return mergedProps;
  }

  /*  不是第一次的情况 props 或者 store.state 发生改变的情况。 */
  function handleSubsequentCalls(nextState: State, nextOwnProps: TOwnProps) {
    /* 判断两次 props 是否相等 */
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    /* 判断两次 store.state 是否相等 */
    const stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;

    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(
    nextState: State,
    nextOwnProps: TOwnProps,
  ) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps);
  };
}

export default function finalPropsSelectorFactory<
  TStateProps,
  TOwnProps,
  TDispatchProps,
  TMergedProps,
  State = DefaultRootState,
>(
  dispatch: Dispatch<Action>,
  {
    initMapStateToProps,
    initMapDispatchToProps,
    initMergeProps,
    ...options
  }: SelectorFactoryOptions<
    TStateProps,
    TOwnProps,
    TDispatchProps,
    TMergedProps,
    State
  >,
) {
  const mapStateToProps = initMapStateToProps(dispatch, options);
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  const mergeProps = initMergeProps(dispatch, options);

  if (process.env.NODE_ENV !== 'production') {
    verifySubselectors(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options.displayName,
    );
  }

  const selectorFactory = options.pure
    ? pureFinalPropsSelectorFactory
    : impureFinalPropsSelectorFactory;

  return selectorFactory(
    // @ts-ignore
    mapStateToProps!,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    options,
  );
}
```

我们来看`finalPropsSelectorFactory`这个方法，接收`dispatch`以及`initMapStateToProps`，`initMapDispatchToProps`，`initMergeProps`以及`options`。

默认的方式我们上面提到了是一个`pure`的模式，也就是最终调用了`pureFinalPropsSelectorFactory`这个方法。

`pureFinalPropsSelectorFactory` 这个方法逻辑很清晰，通过闭包的形式返回一个函数 `pureFinalPropsSelector`。`pureFinalPropsSelector` 通过判断是否是第一次初始化组件。

- 如果是第一次，那么直接调用 `mergeProps` 合并 `ownProps`,`stateProps`,`dispatchProps` 形成最终的 `props`。

- 如果不是第一次，那么判断到底是 `props` 还是 `store.state` 发生改变，然后针对那里变化，重新生成对应的 `props`，最终合并到真正的 `props`。

**整个 `selectorFactory` 逻辑就是形成新的 `props` 传递给我们的业务组件。**

现在还剩下开头提到的 `connectHOC`，源码中我们看到 `connect` 最终调用的是 `connectHOC`方法，而该方法的默认传入方法是[connectAdvanced](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.tsx)。

```ts
function connectAdvanced<S, TProps, TOwnProps, TFactoryOptions = {}>(
  // 我们上面说到的方法
  selectorFactory: SelectorFactory<S, TProps, unknown, unknown>,
  // options object:
  {
    // 可能被包装函数（如connect（））重写
    getDisplayName = (name) => `ConnectAdvanced(${name})`,

    // 如果定义了，则传递给包装元素的属性的名称，指示要呈现的调用。用于监视react devtools中不必要的重新渲染。
    methodName = 'connectAdvanced',

    // 确定此HOC是否订阅存储更改
    shouldHandleStateChanges = true,

    // 是否 用 forwarRef 模式包裹组件
    forwardRef = false,

    // Provider 保存的上下文
    context = ReactReduxContext,

    // additional options are passed through to the selectorFactory
    ...connectOptions
  }: ConnectAdvancedOptions & Partial<TFactoryOptions> = {},
) {
  const Context = context;

  type WrappedComponentProps = TOwnProps & ConnectProps;

  const wrapWithConnect: AdvancedComponentDecorator<
    TProps,
    WrappedComponentProps
  > = (WrappedComponent) => {
    if (
      process.env.NODE_ENV !== 'production' &&
      !isValidElementType(WrappedComponent)
    ) {
      throw new Error(
        `You must pass a component to the function returned by ` +
          `${methodName}. Instead received ${stringifyComponent(
            WrappedComponent,
          )}`,
      );
    }

    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const displayName = getDisplayName(wrappedComponentName);

    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      shouldHandleStateChanges,
      displayName,
      wrappedComponentName,
      WrappedComponent,
    };

    const { pure } = connectOptions;

    function createChildSelector(store: Store) {
      return selectorFactory(store.dispatch, selectorFactoryOptions);
    }

    // 判断是否是pure纯组件模式 如果是 将用 useMemo 提升性能
    const usePureOnlyMemo = pure
      ? useMemo
      : (callback: () => void) => callback();

    // 负责更新的容器子组件
    function ConnectFunction<TOwnProps>(props: ConnectProps & TOwnProps) {
      const [propsContext, reactReduxForwardedRef, wrapperProps] =
        useMemo(() => {
          // props 为 业务组件 真正的 props
          const { reactReduxForwardedRef, ...wrapperProps } = props;
          return [props.context, reactReduxForwardedRef, wrapperProps];
        }, [props]);

      const ContextToUse: ReactReduxContextInstance = useMemo(() => {
        // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
        // Memoize the check that determines which context instance we should use.
        return propsContext &&
          propsContext.Consumer &&
          // @ts-ignore
          isContextConsumer(<propsContext.Consumer />)
          ? propsContext
          : Context;
      }, [propsContext, Context]);

      // Retrieve the store and ancestor subscription via context, if available
      const contextValue = useContext(ContextToUse);

      // The store _must_ exist as either a prop or in context.
      // We'll check to see if it _looks_ like a Redux store first.
      // This allows us to pass through a `store` prop that is just a plain value.
      const didStoreComeFromProps =
        Boolean(props.store) &&
        Boolean(props.store!.getState) &&
        Boolean(props.store!.dispatch);
      const didStoreComeFromContext =
        Boolean(contextValue) && Boolean(contextValue!.store);

      if (
        process.env.NODE_ENV !== 'production' &&
        !didStoreComeFromProps &&
        !didStoreComeFromContext
      ) {
        throw new Error(
          `Could not find "store" in the context of ` +
            `"${displayName}". Either wrap the root component in a <Provider>, ` +
            `or pass a custom React context provider to <Provider> and the corresponding ` +
            `React context consumer to ${displayName} in connect options.`,
        );
      }

      // Based on the previous check, one of these must be true
      const store: Store = didStoreComeFromProps
        ? props.store!
        : contextValue!.store;

      const childPropsSelector = useMemo(() => {
        // The child props selector needs the store reference as an input.
        // Re-create this selector whenever the store changes.
        return createChildSelector(store);
      }, [store]);

      const [subscription, notifyNestedSubs] = useMemo(() => {
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY;

        // This Subscription's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.
        const subscription = createSubscription(
          store,
          didStoreComeFromProps ? undefined : contextValue!.subscription,
        );

        // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
        // the middle of the notification loop, where `subscription` will then be null. This can
        // probably be avoided if Subscription's listeners logic is changed to not call listeners
        // that have been unsubscribed in the  middle of the notification loop.
        const notifyNestedSubs =
          subscription.notifyNestedSubs.bind(subscription);

        return [subscription, notifyNestedSubs];
      }, [store, didStoreComeFromProps, contextValue]);

      // Determine what {store, subscription} value should be put into nested context, if necessary,
      // and memoize that value to avoid unnecessary context updates.
      const overriddenContextValue = useMemo(() => {
        if (didStoreComeFromProps) {
          // This component is directly subscribed to a store from props.
          // We don't want descendants reading from this store - pass down whatever
          // the existing context value is from the nearest connected ancestor.
          return contextValue!;
        }

        // Otherwise, put this component's subscription instance into context, so that
        // connected descendants won't update until after this component is done
        return {
          ...contextValue,
          subscription,
        } as ReactReduxContextValue;
      }, [didStoreComeFromProps, contextValue, subscription]);

      // causes a change to the calculated child component props (or we caught an error in mapState)
      // 当redux store更新的时候强制触发wrapper组件进行渲染
      const [[previousStateUpdateResult], forceComponentUpdateDispatch] =
        useReducer(
          storeStateUpdatesReducer,
          // @ts-ignore
          EMPTY_ARRAY as any,
          initStateUpdates,
        );

      // Propagate any mapState/mapDispatch errors upwards
      if (previousStateUpdateResult && previousStateUpdateResult.error) {
        throw previousStateUpdateResult.error;
      }

      // Set up refs to coordinate values between the subscription effect and the render logic
      const lastChildProps = useRef();
      const lastWrapperProps = useRef(wrapperProps);
      const childPropsFromStoreUpdate = useRef();
      const renderIsScheduled = useRef(false);

      const actualChildProps = usePureOnlyMemo(() => {
        // Tricky logic here:
        // - This render may have been triggered by a Redux store update that produced new child props
        // - However, we may have gotten new wrapper props after that
        // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
        // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
        // So, we'll use the child props from store update only if the wrapper props are the same as last time.
        if (
          childPropsFromStoreUpdate.current &&
          wrapperProps === lastWrapperProps.current
        ) {
          return childPropsFromStoreUpdate.current;
        }

        // TODO We're reading the store directly in render() here. Bad idea?
        // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
        // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
        // to determine what the child props should be.
        return childPropsSelector(store.getState(), wrapperProps);
      }, [store, previousStateUpdateResult, wrapperProps]);

      // We need this to execute synchronously every time we re-render. However, React warns
      // about useLayoutEffect in SSR, so we try to detect environment and fall back to
      // just useEffect instead to avoid the warning, since neither will run anyway.
      useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [
        lastWrapperProps,
        lastChildProps,
        renderIsScheduled,
        wrapperProps,
        actualChildProps,
        childPropsFromStoreUpdate,
        notifyNestedSubs,
      ]);

      // Our re-subscribe logic only runs when the store/subscription setup changes
      useIsomorphicLayoutEffectWithArgs(
        subscribeUpdates,
        [
          shouldHandleStateChanges,
          store,
          subscription,
          childPropsSelector,
          lastWrapperProps,
          lastChildProps,
          renderIsScheduled,
          childPropsFromStoreUpdate,
          notifyNestedSubs,
          forceComponentUpdateDispatch,
        ],
        [store, subscription, childPropsSelector],
      );

      // Now that all that's done, we can finally try to actually render the child component.
      // We memoize the elements for the rendered child component as an optimization.
      const renderedWrappedComponent = useMemo(
        () => (
          // @ts-ignore
          <WrappedComponent
            {...actualChildProps}
            ref={reactReduxForwardedRef}
          />
        ),
        [reactReduxForwardedRef, WrappedComponent, actualChildProps],
      );

      // If React sees the exact same element reference as last time, it bails out of re-rendering
      // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.
      const renderedChild = useMemo(() => {
        if (shouldHandleStateChanges) {
          // If this component is subscribed to store updates, we need to pass its own
          // subscription instance down to our descendants. That means rendering the same
          // Context instance, and putting a different value into the context.
          return (
            <ContextToUse.Provider value={overriddenContextValue}>
              {renderedWrappedComponent}
            </ContextToUse.Provider>
          );
        }

        return renderedWrappedComponent;
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);

      return renderedChild;
    }

    // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.
    const _Connect = pure ? React.memo(ConnectFunction) : ConnectFunction;

    type ConnectedWrapperComponent = typeof _Connect & {
      WrappedComponent: typeof WrappedComponent;
    };

    const Connect = _Connect as ConnectedComponent<
      typeof WrappedComponent,
      WrappedComponentProps
    >;
    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = ConnectFunction.displayName = displayName;

    if (forwardRef) {
      const _forwarded = React.forwardRef(function forwardConnectRef(
        props,
        ref,
      ) {
        // @ts-ignore
        return <Connect {...props} reactReduxForwardedRef={ref} />;
      });

      const forwarded = _forwarded as ConnectedWrapperComponent;
      forwarded.displayName = displayName;
      forwarded.WrappedComponent = WrappedComponent;
      return hoistStatics(forwarded, WrappedComponent);
    }

    return hoistStatics(Connect, WrappedComponent);
  };

  return wrapWithConnect;
}
```

`connectAdvanced` 接受配置参数 ， 然后返回真正的 `HOC wrapWithConnect`，`wrapWithConnect` 的做的事大致罗列为以下几点：

1. 声明负责更新的 `ConnectFunction` 无状态组件。和负责合并 `props` 的 `createChildSelector` 方法。

2. 判断是否是 `pure` 纯组件模式，如果是用 `react.memo` 包裹,这样做的好处是，会向 `pureComponent` 一样对 `props` 进行浅比较。

3. 如果 `connect` 有 `forwardRef` 配置项，用 `React.forwardRef` 处理，这样做好处如下。

正常情况下因为我们的 `WrappedComponent` 被 `connect` 包装，所以不能通过 `ref` 访问到业务组件 `WrappedComponent` 的实例。

```js
// 子组件
const mapStateToProp = (store) => ({ userInfo: store.root.userInfo });

@connect(mapStateToProp)
export default class Child extends React.Component {
  render() {
    /* ... */
  }
}

// 父组件
class Father extends React.Compoent{
    child = null
    render(){
        return <Child ref={(cur)=> this.child = cur }  { /* 获取到的不是`Child`本身 */ } />
    }
}
```

我们无法通过 `ref` 访问到 `Child` 组件。所以我们可以通过 `options` 的 `forwardRef` 属性设置为 `true`，这样就可以根本解决问题。

```js
connect(mapStateToProp, mapDispatchToProps, mergeProps, { forwardRef: true })(
  Child,
);
```

最后做的事情就是通过 `hoistStatics` 库 把子组件 `WrappedComponent` 的`静态方法/属性`，继承到父组件 `Connect` 上。

因为在 `高阶组件` 包装业务组件的过程中，如果不对静态属性或是方法加以额外处理，是不会被包装后的组件访问到的，所以需要类似 `hoistStatics` 这样的库，来做处理。

接下来，我们看看 `connect` 的核心方法，负责更新的容器 `ConnectFunction` 到底做了啥，我们将其代码提取出来。

```ts
// 负责更新的容器子组件
function ConnectFunction<TOwnProps>(props: ConnectProps & TOwnProps) {
  // TODO:  第一步 把 context ForwardedRef props 取出来
  const [propsContext, reactReduxForwardedRef, wrapperProps] = useMemo(() => {
    // props 为 业务组件 真正的 props
    const { reactReduxForwardedRef, ...wrapperProps } = props;
    return [props.context, reactReduxForwardedRef, wrapperProps];
  }, [props]);

  const ContextToUse: ReactReduxContextInstance = useMemo(() => {
    // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
    // Memoize the check that determines which context instance we should use.
    return propsContext &&
      propsContext.Consumer &&
      // @ts-ignore
      isContextConsumer(<propsContext.Consumer />)
      ? propsContext
      : Context;
  }, [propsContext, Context]);

  // 获取 context内容 里面含有  redux 中store 和 subscription
  const contextValue = useContext(ContextToUse);

  // TODO: 判断 store 是否来此 props  didStoreComeFromProps ,正常情况下 ，prop 中是不存在 store 所以  didStoreComeFromProps = false
  const didStoreComeFromProps =
    Boolean(props.store) &&
    Boolean(props.store!.getState) &&
    Boolean(props.store!.dispatch);
  const didStoreComeFromContext =
    Boolean(contextValue) && Boolean(contextValue!.store);

  if (
    process.env.NODE_ENV !== 'production' &&
    !didStoreComeFromProps &&
    !didStoreComeFromContext
  ) {
    throw new Error(
      `Could not find "store" in the context of ` +
        `"${displayName}". Either wrap the root component in a <Provider>, ` +
        `or pass a custom React context provider to <Provider> and the corresponding ` +
        `React context consumer to ${displayName} in connect options.`,
    );
  }

  // 获取 redux 中 store
  const store: Store = didStoreComeFromProps
    ? props.store!
    : contextValue!.store;

  // 返回merge函数 用于生成真正传给子组件 props
  const childPropsSelector = useMemo(() => {
    return createChildSelector(store);
  }, [store]);

  // TODO:  第二步  subscription 监听者实例
  const [subscription, notifyNestedSubs] = useMemo(() => {
    if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY;

    // 如果没有订阅更新，那么直接返回。
    const subscription = createSubscription(
      store,
      // 和 上级 `subscription` 建立起关系。 this.parentSub = contextValue.subscription
      didStoreComeFromProps ? undefined : contextValue!.subscription,
    );

    // notifyNestedSubs 触发 noticy 所有子代 listener 监听者 -> 触发batch方法,触发 batchupdate方法 ,批量更新
    const notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);

    return [subscription, notifyNestedSubs];
  }, [store, didStoreComeFromProps, contextValue]);

  // 创建出一个新的contextValue ,把父级的 subscription 换成自己的 subscription
  const overriddenContextValue = useMemo(() => {
    if (didStoreComeFromProps) {
      return contextValue!;
    }

    return {
      ...contextValue,
      subscription,
    } as ReactReduxContextValue;
  }, [didStoreComeFromProps, contextValue, subscription]);

  // We need to force this wrapper component to re-render whenever a Redux store update
  // causes a change to the calculated child component props (or we caught an error in mapState)
  const [[previousStateUpdateResult], forceComponentUpdateDispatch] =
    useReducer(
      storeStateUpdatesReducer,
      // @ts-ignore
      EMPTY_ARRAY as any,
      initStateUpdates,
    );

  // Propagate any mapState/mapDispatch errors upwards
  if (previousStateUpdateResult && previousStateUpdateResult.error) {
    throw previousStateUpdateResult.error;
  }

  // TODO: 第三步
  // 保存上一次 合并过的 props信息（经过 ownprops ,stateProps , dispatchProps 合并过的 ）
  const lastChildProps = useRef();
  // 保存本次上下文执行 业务组件的 props
  const lastWrapperProps = useRef(wrapperProps);
  const childPropsFromStoreUpdate = useRef();
  // 当前组件是否处于渲染阶段
  const renderIsScheduled = useRef(false);

  // actualChildProps 为当前真正处理过后，经过合并的 props
  const actualChildProps = usePureOnlyMemo(() => {
    if (
      childPropsFromStoreUpdate.current &&
      wrapperProps === lastWrapperProps.current
    ) {
      return childPropsFromStoreUpdate.current;
    }

    // 调用 mergeProps 进行合并，返回合并后的最新 porps
    return childPropsSelector(store.getState(), wrapperProps);
  }, [store, previousStateUpdateResult, wrapperProps]);

  // 负责更新缓存变量，方便下一次更新的时候比较
  useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [
    lastWrapperProps,
    lastChildProps,
    renderIsScheduled,
    wrapperProps,
    actualChildProps,
    childPropsFromStoreUpdate,
    notifyNestedSubs,
  ]);

  // Our re-subscribe logic only runs when the store/subscription setup changes
  useIsomorphicLayoutEffectWithArgs(
    subscribeUpdates,
    [
      shouldHandleStateChanges,
      store,
      subscription,
      childPropsSelector,
      lastWrapperProps,
      lastChildProps,
      renderIsScheduled,
      childPropsFromStoreUpdate,
      notifyNestedSubs,
      forceComponentUpdateDispatch,
    ],
    [store, subscription, childPropsSelector],
  );

  // TODO: 第四步：reactReduxForwardedRef 是处理父级元素是否含有 forwardRef 的情况 这里可以忽略
  const renderedWrappedComponent = useMemo(
    () => (
      // @ts-ignore
      <WrappedComponent {...actualChildProps} ref={reactReduxForwardedRef} />
    ),
    [reactReduxForwardedRef, WrappedComponent, actualChildProps],
  );

  // shouldHandleStateChanges 来源 connect是否有第一个参数
  const renderedChild = useMemo(() => {
    if (shouldHandleStateChanges) {
      // ContextToUse 传递 context
      return (
        <ContextToUse.Provider value={overriddenContextValue}>
          {renderedWrappedComponent}
        </ContextToUse.Provider>
      );
    }

    return renderedWrappedComponent;
  }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);

  return renderedChild;
}
```

##### 第一步

通过 `props` 分离出 `reactReduxForwardedRef` , `wrapperProps` 。`reactReduxForwardedRef` 是当开启 `ForwardedRef` 模式下，父级传过来的 `React.forwaedRef`。

然后判断通过常量 `didStoreComeFromProps` 储存当前，`redux.store` 是否来自 `props`, 正常情况下，我们的 `store` 都来自 `provider` ，不会来自 `props`，所以我们可以把 `didStoreComeFromProps = true` 。

接下来我们获取到 `store`，通过 `store` 来判断是否更新真正的合并 `props` 函数 `childPropsSelector`。

###### 第二步 创建 子代 subscription, 层层传递新的 context(很重要)

这一步非常重要，判断通过 `shouldHandleStateChanges` 判断此 `HOC` 是否订阅存储更改，如果已经订阅了更新(此时 `connect` 具有第一个参数)，那么创建一个 `subscription` ,并且和上一层 `provider` 的 `subscription` 建立起关联。

```js
this.parentSub = contextValue.subscription。
```

然后分离出 `subscription` 和 `notifyNestedSubs`(通知当前 `subscription` 的 `listeners` 进行更新的方法。 )。

然后通过 `useMemo` 创建出一个新的 `contextValue` ,把父级的 `subscription` 换成自己的 `subscription`。用于通过 `Provider` 传递新的 `context`。

接下来通过 `useReducer` 制造出真正触发更新的 `forceComponentUpdateDispatch` 函数。也就是整个 `state` 或者是 `props` 改变，触发组件更新的函数。 为什么这么做呢？

一方面希望 `connect` 自己控制自己的更新，并且多个上下级 `connect` 不收到影响。所以一方面通过 `useMemo` 来限制业务组件不必要的更新,另一方面来通过 `forceComponentUpdateDispatch` 来更新 `HOC` 函数，产生 `actualChildProps`,`actualChildProps` 改变 ,`useMemo`执行，触发组件渲染。

##### 第三步：保存信息，执行副作用钩子(最重要的部分到了)

这一步十分重要，首先先通过 `useRef` 缓存几个变量：

- `lastChildProps` -> 保存上一次 合并过的 props 信息（经过 ownprops ,stateProps , dispatchProps 合并过的 ）。

- `lastWrapperProps` -> 保存本次上下文执行 业务组件的 props 。

- `renderIsScheduled` -> 当前组件是否处于渲染阶段。

- `actualChildProps` -> `actualChildProps` 为当前真正处理过后，经过合并的 props, 组件通过 `dep -> actualChildProps`,来判断是否进行更新。

接下来执行两次 `useIsomorphicLayoutEffectWithArgs`，这个方法在 `utils` 文件夹中，内部的源码如下:

```js
import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect;
```

内部自己判断了是执行 `useLayoutEffect` 还是 `useEffect` 。

第一个方式执行了`captureWrapperProps`这个方法，

```js
function captureWrapperProps(
  lastWrapperProps: React.MutableRefObject<unknown>,
  lastChildProps: React.MutableRefObject<unknown>,
  renderIsScheduled: React.MutableRefObject<boolean>,
  wrapperProps: React.MutableRefObject<unknown>,
  actualChildProps: React.MutableRefObject<unknown>,
  childPropsFromStoreUpdate: React.MutableRefObject<unknown>,
  notifyNestedSubs: () => void,
) {
  // We want to capture the wrapper props and child props we used for later comparisons
  lastWrapperProps.current = wrapperProps; // 子props
  lastChildProps.current = actualChildProps; // 经过 megeprops 之后形成的 prop
  renderIsScheduled.current = false; // 当前组件渲染完成

  // If the render was from a store update, clear out that reference and cascade the subscriber update
  if (childPropsFromStoreUpdate.current) {
    childPropsFromStoreUpdate.current = null;
    notifyNestedSubs();
  }
}
```

`captureWrapperProps` 的作用很简单，在一次组件渲染更新后，将上一次 `合并前` 和 `合并后` 的 `props`,保存起来。这么做目的是，能过在两次 `hoc` 执行渲染中，对比 `props stateProps` 是否发生变化。从而确定是否更新 hoc，进一步更新组件。

接下来执行了第二个 Effect `subscribeUpdates`，`subscribeUpdates` 是订阅更新的主要函数，我们一起来看看：

```js
function subscribeUpdates(
  shouldHandleStateChanges: boolean,
  store: Store,
  subscription: Subscription,
  childPropsSelector: (state: unknown, props: unknown) => unknown,
  lastWrapperProps: React.MutableRefObject<unknown>,// 子props
  lastChildProps: React.MutableRefObject<unknown>, // 经过 megeprops 之后形成的 prop
  renderIsScheduled: React.MutableRefObject<boolean>,
  childPropsFromStoreUpdate: React.MutableRefObject<unknown>,
  notifyNestedSubs: () => void,
  forceComponentUpdateDispatch: React.Dispatch<any>
) {
  // If we're not subscribed to the store, nothing to do here
  if (!shouldHandleStateChanges) return

  // 捕获值以检查此组件是否卸载以及何时卸载
  let didUnsubscribe = false
  let lastThrownError: Error | null = null

  // store更新订阅传播到此组件时，运行此回调
  const checkForUpdates = () => {
    if (didUnsubscribe) {
      // Don't run stale listeners.
      // Redux doesn't guarantee unsubscriptions happen until next dispatch.
      return
    }

    const latestStoreState = store.getState()

    let newChildProps, error
    try {
      // Actually run the selector with the most recent store state and wrapper props
      // to determine what the child props should be
      newChildProps = childPropsSelector(
        latestStoreState,
        lastWrapperProps.current
      )
    } catch (e) {
      error = e
      lastThrownError = e as Error | null
    }

    if (!error) {
      lastThrownError = null
    }

    // If the child props haven't changed, nothing to do here - cascade the subscription update
    if (newChildProps === lastChildProps.current) {
      if (!renderIsScheduled.current) {
        notifyNestedSubs()
      }
    } else {
      // Save references to the new child props.  Note that we track the "child props from store update"
      // as a ref instead of a useState/useReducer because we need a way to determine if that value has
      // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
      // forcing another re-render, which we don't want.
      lastChildProps.current = newChildProps
      childPropsFromStoreUpdate.current = newChildProps
      renderIsScheduled.current = true

      // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render
      forceComponentUpdateDispatch({
        type: 'STORE_UPDATED',
        payload: {
          error,
        },
      })
    }
  }

  //开启订阅者 ，当前是被connect 包转的情况 会把 当前的 checkForceUpdate 放在存入 父元素的addNestedSub中。
  subscription.onStateChange = checkForUpdates
  subscription.trySubscribe()
  // 在第一次呈现之后从存储中提取数据，以防存储从我们开始就改变了。
  checkForUpdates()

  // 卸载订阅
  const unsubscribeWrapper = () => {
    didUnsubscribe = true
    subscription.tryUnsubscribe()
    subscription.onStateChange = null

    if (lastThrownError) {
      // It's possible that we caught an error due to a bad mapState function, but the
      // parent re-rendered without this component and we're about to unmount.
      // This shouldn't happen as long as we do top-down subscriptions correctly, but
      // if we ever do those wrong, this throw will surface the error in our tests.
      // In that case, throw the error from here so it doesn't get lost.
      throw lastThrownError
    }
  }

  return unsubscribeWrapper
}
```

1. 首先声明 store 更新订阅传播到此组件时的回调函数 `checkForUpdates` 把它赋值给 `onStateChange`，如果 `store` 中的 `state` 发生改变，那么在组件订阅了 state 内容之后，相关联的 state 改变就会触发当前组件的 `onStateChange`，来合并得到新的 `props`，从而触发组件更新。

2. 然后 `subscription.trySubscribe()`把订阅函数 `onStateChange` 绑定给父级 `subscription`，进行了层层订阅。

3. 最后，为了防止渲染后，`store` 内容已经改变，所以首先执行了一次 `checkForUpdates`。那么 `checkForUpdates` 的作用很明确了，就是检查是否派发当前组件的更新。

到这里我们可以知道，`react-redux` 通过 `subscription` 进行层层订阅。对于一层层的组件结构，整体模型图如下：

![subscription](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd432743cd93439ba901b36126a0b6b0~tplv-k3u1fbpfcp-watermark.awebp)

最后我们来看看 `checkForUpdates`:

```ts
// store更新订阅传播到此组件时，运行此回调
const checkForUpdates = () => {
  if (didUnsubscribe) {
    // Don't run stale listeners.
    // Redux doesn't guarantee unsubscriptions happen until next dispatch.
    return;
  }

  const latestStoreState = store.getState();

  let newChildProps, error;
  try {
    // 得到最新的 props
    newChildProps = childPropsSelector(
      latestStoreState,
      lastWrapperProps.current,
    );
  } catch (e) {
    error = e;
    lastThrownError = e as Error | null;
  }

  if (!error) {
    lastThrownError = null;
  }

  // 如果新的合并的 props没有更改，则此处不做任何操作-层叠订阅更新
  if (newChildProps === lastChildProps.current) {
    if (!renderIsScheduled.current) {
      notifyNestedSubs();
    }
  } else {
    // Save references to the new child props.  Note that we track the "child props from store update"
    // as a ref instead of a useState/useReducer because we need a way to determine if that value has
    // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
    // forcing another re-render, which we don't want.
    lastChildProps.current = newChildProps;
    childPropsFromStoreUpdate.current = newChildProps;
    renderIsScheduled.current = true;

    // 此情况 可能考虑到 代码运行到这里 又发生了 props 更新 所以触发一个 reducer 来促使组件更新。
    forceComponentUpdateDispatch({
      type: 'STORE_UPDATED',
      payload: {
        error,
      },
    });
  }
};
```

`checkForUpdates` 通过调用 `childPropsSelector` 来形成新的 `props`,然后判断之前的 `prop` 和当前新的 `prop` 是否相等。

如果相等，证明没有发生变化,无须更新当前组件，那么通过调用 `notifyNestedSubs` 来通知子代容器组件，检查是否需要更新。如果不相等证明订阅的 `store.state` 发生变化，那么立即执行 `forceComponentUpdateDispatch` 来触发组件的更新。

对于层层订阅的结构，整个更新模型图如下：

![层层订阅的结构](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/481a9a687369421fbdb2665fc3af44d0~tplv-k3u1fbpfcp-watermark.awebp)

#### 总结

接下来我们总结一下整个 `connect` 的流程。我们还是从`订阅`和`更新`两个方向入手。

- 订阅流程

整个订阅的流程是，如果被 `connect` 包裹，并且具有第一个参数。

首先通过 `context` 获取最近的 `subscription`，然后创建一个新的 `subscription`,并且和父级的 `subscription` 建立起关联。

当第一次 `hoc` 容器组件挂在完成后，在 `useEffect` 里，进行订阅，将自己的订阅函数 `checkForUpdates`,作为回调函数，通过 `trySubscribe` 和 `this.parentSub.addNestedSub` ,加入到父级 `subscription` 的 `listeners` 中。由此完成整个订阅流程。

- 更新流程

整个更新流程是，`state` 改变，会触发根订阅器的 `store.subscribe`，然后会触发 `listeners.notify` ,也就是 `checkForUpdates` 函数，然后 `checkForUpdates` 函数首先根据 `mapStoretoprops`，`mergeprops` 等操作，验证该组件是否发起订阅，`props` 是否改变，并更新。

如果发生改变，那么触发 `useReducer` 的 `forceComponentUpdateDispatch` 函数，来更新业务组件。

如果没有发生更新，那么通过调用 `notifyNestedSubs`，来通知当前 `subscription` 的 `listeners` 检查是否更新，然后尽心层层 `checkForUpdates`逐级向下，借此完成整个更新流程。
