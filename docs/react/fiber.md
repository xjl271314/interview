---
title: Fiber架构
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# Fiber 是什么?

- 2021.08.10

`React` 在 `16` 之后底层渲染的算法已经由原来的 `reconciler(Stack reconciler)`改为了 `Fiber` 算法。`Fiber`（可译为丝）比线程还细的控制粒度，能够将任务分片，划分优先级，同时能够实现类似于操作系统中对线程的抢占式调度，旨在对渲染过程做更精细的调整。

## 起源

为什么需要进行调整还得从 `setState` 说起。所以我们先聊聊 `React 15` 是如何进行一次 `setState` 的。

```js
import React from 'react';

class App extends React.Component {
  state = { val: 0 };
  componentDidMount() {
    // 第一次调用
    this.setState({ val: this.state.val + 1 });
    console.log('first setState', this.state);

    // 第二次调用
    this.setState({ val: this.state.val + 1 });
    console.log('second setState', this.state);

    // 第三次调用
    this.setState({ val: this.state.val + 1 }, () => {
      console.log('in callback', this.state);
    });
  }
  render() {
    return <div> val: {this.state.val} </div>;
  }
}

export default App;
```

我们知道在 `React` 的生命周期内，多次 `setState` 会被合并成一次，这里虽然连续进行了三次 `setState`，`state.val` 的值实际上只重新计算了一次。

每次 `setState` 之后，立即获取 `state` 会发现并没有更新，只有在 `setState` 的回调函数内才能拿到最新的结果，这点通过我们在控制台输出的结果就可以证实。

![setState](https://img-blog.csdnimg.cn/67c26cee1b3e41778356b6f1eec010e0.png)

网上有很多文章称 `setState` 是`『异步操作』`，所以导致 `setState` 之后并不能获取到最新值，其实这个观点是错误的。

`setState` 是一次`同步操作`，只是每次操作之后并没有立即执行，而是将 `state` 进行了`缓存`，`mount` 流程结束或事件操作结束，才会拿出所有的 `state` 进行一次计算。如果 `setState` 脱离了 `React` 的生命周期或者 `React` 提供的事件流，`setState` 之后就能立即拿到结果。

```js
import React from 'react';

class App extends React.Component {
  state = { val: 0 };
  componentDidMount() {
    setTimeout(() => {
      // 第一次调用
      this.setState({ val: this.state.val + 1 });
      console.log('first setState', this.state);

      // 第二次调用
      this.setState({ val: this.state.val + 1 });
      console.log('second setState', this.state);
    });
  }
  render() {
    return <div> val: {this.state.val} </div>;
  }
}

export default App;
```

可以看到，`setState` 之后就能立即看到 `state.val` 的值发生了变化。

![setState2](https://img-blog.csdnimg.cn/67dc59d054d14892b9f9d3bc45559feb.png)

## 旧版本 setState 源码分析

`setState` 的主要逻辑都在 `ReactUpdateQueue` 中实现，在调用 `setState` 后，并没有立即修改 `state`，而是将传入的参数放到了组件内部的 `_pendingStateQueue` 中，之后调用 `enqueueUpdate` 来进行更新。

```js
// 对外暴露的 React.Component
function ReactComponent() {
  this.updater = ReactUpdateQueue;
}
// setState 方法挂载到原型链上
ReactComponent.prototype.setState = function (partialState, callback) {
  // 调用 setState 后，会调用内部的 updater.enqueueSetState
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

var ReactUpdateQueue = {
  enqueueSetState(component, partialState) {
    // 在组件的 _pendingStateQueue 上暂存新的 state
    if (!component._pendingStateQueue) {
      component._pendingStateQueue = [];
    }
    var queue = component._pendingStateQueue;
    queue.push(partialState);
    enqueueUpdate(component);
  },
  enqueueCallback: function (component, callback, callerName) {
    // 在组件的 _pendingCallbacks 上暂存 callback
    if (component._pendingCallbacks) {
      component._pendingCallbacks.push(callback);
    } else {
      component._pendingCallbacks = [callback];
    }
    enqueueUpdate(component);
  },
};
```

`enqueueUpdate` 首先会通过 `batchingStrategy.isBatchingUpdates` 判断当前是否在更新流程，如果不在更新流程，会调用 `batchingStrategy.batchedUpdates()` 进行更新。如果在流程中，会将待更新的组件放入 `dirtyComponents` 进行缓存。

```js
var dirtyComponents = [];
function enqueueUpdate(component) {
  if (!batchingStrategy.isBatchingUpdates) {
    // 开始进行批量更新
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 如果在更新流程，则将组件放入脏组件队列，表示组件待更新
  dirtyComponents.push(component);
}
```

`batchingStrategy` 是 `React` 进行批处理的一种策略，该策略的实现基于 `Transaction`，虽然名字和数据库的事务一样，但是做的事情却不一样。

```js
class ReactDefaultBatchingStrategyTransaction extends Transaction {
  constructor() {
    this.reinitializeTransaction();
  }
  getTransactionWrappers() {
    return [
      {
        initialize: () => {},
        close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates),
      },
      {
        initialize: () => {},
        close: () => {
          ReactDefaultBatchingStrategy.isBatchingUpdates = false;
        },
      },
    ];
  }
}

var transaction = new ReactDefaultBatchingStrategyTransaction();

var batchingStrategy = {
  // 判断是否在更新流程中
  isBatchingUpdates: false,
  // 开始进行批量更新
  batchedUpdates: function (callback, component) {
    // 获取之前的更新状态
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
    // 将更新状态修改为 true
    ReactDefaultBatchingStrategy.isBatchingUpdates = true;
    if (alreadyBatchingUpdates) {
      // 如果已经在更新状态中，等待之前的更新结束
      return callback(callback, component);
    } else {
      // 进行更新
      return transaction.perform(callback, null, component);
    }
  },
};
```

`Transaction` 通过 `perform` 方法启动，然后通过扩展的 `getTransactionWrappers` 获取一个数组，该数组内存在多个 `wrapper` 对象，每个对象包含两个属性：`initialize`、`close`。

`perform` 中会先调用所有的 `wrapper.initialize`，然后调用传入的回调，最后调用所有的 `wrapper.close`。

```js
class Transaction {
  reinitializeTransaction() {
    this.transactionWrappers = this.getTransactionWrappers();
  }
  perform(method, scope, ...param) {
    this.initializeAll(0);
    var ret = method.call(scope, ...param);
    this.closeAll(0);
    return ret;
  }
  initializeAll(startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      wrapper.initialize.call(this);
    }
  }
  closeAll(startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      wrapper.close.call(this);
    }
  }
}
```

![Transaction](https://img-blog.csdnimg.cn/fe95e55ebc9b4dbca80b7901ce86a2c5.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

React 源代码的注释中，也形象的展示了这一过程。

```js
/*
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 */
```

我们简化一下代码，再重新看一下 `setState` 的流程。

```js
// 1. 调用 Component.setState
ReactComponent.prototype.setState = function (partialState) {
  this.updater.enqueueSetState(this, partialState);
};

// 2. 调用 ReactUpdateQueue.enqueueSetState，将 state 值放到 _pendingStateQueue 进行缓存
var ReactUpdateQueue = {
  enqueueSetState(component, partialState) {
    var queue =
      component._pendingStateQueue || (component._pendingStateQueue = []);
    queue.push(partialState);
    enqueueUpdate(component);
  },
};

// 3. 判断是否在更新过程中，如果不在就进行更新
var dirtyComponents = [];
function enqueueUpdate(component) {
  // 如果之前没有更新，此时的 isBatchingUpdates 肯定是 false
  if (!batchingStrategy.isBatchingUpdates) {
    // 调用 batchingStrategy.batchedUpdates 进行更新
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  dirtyComponents.push(component);
}

// 4. 进行更新，更新逻辑放入事务中进行处理
var batchingStrategy = {
  isBatchingUpdates: false,
  // 注意：此时的 callback 为 enqueueUpdate
  batchedUpdates: function (callback, component) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
    ReactDefaultBatchingStrategy.isBatchingUpdates = true;
    if (alreadyBatchingUpdates) {
      // 如果已经在更新状态中，重新调用 enqueueUpdate，将 component 放入 dirtyComponents
      return callback(callback, component);
    } else {
      // 进行事务操作
      return transaction.perform(callback, null, component);
    }
  },
};
```

**启动事务可以拆分成三步来看：**

1. 先执行 `wrapper` 的 `initialize`，此时的 `initialize` 都是一些空函数，可以直接跳过；

2. 然后执行 `callback`（也就是 `enqueueUpdate`），执行 `enqueueUpdate` 时，由于已经进入了更新状态，`batchingStrategy.isBatchingUpdates` 被修改成了 `true`，所以最后还是会把 `component` 放入脏组件队列，等待更新；

3. 后面执行的两个 `close` 方法，第一个方法的 `flushBatchedUpdates` 是用来进行组件更新的，第二个方法用来修改更新状态，表示更新已经结束。

```js
getTransactionWrappers () {
  return [
    {
      initialize: () => {},
      close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
    },
    {
      initialize: () => {},
      close: () => {
        ReactDefaultBatchingStrategy.isBatchingUpdates = false;
      }
    }
  ]
}
```

`flushBatchedUpdates` 里面会取出所有的脏组件队列进行 `diff`，最后更新到 DOM。

```js
function flushBatchedUpdates() {
  if (dirtyComponents.length) {
    runBatchedUpdates();
  }
}

function runBatchedUpdates() {
  // 省略了一些去重和排序的操作
  for (var i = 0; i < dirtyComponents.length; i++) {
    var component = dirtyComponents[i];

    // 判断组件是否需要更新，然后进行 diff 操作，最后更新 DOM。
    ReactReconciler.performUpdateIfNecessary(component);
  }
}
```

`performUpdateIfNecessary()` 会调用 `Component.updateComponent()`，在 `updateComponent()` 中，会从 `_pendingStateQueue` 中取出所有的值来更新。

```js
// 获取最新的 state
_processPendingState() {
  var inst = this._instance;
  var queue = this._pendingStateQueue;

  var nextState = { ...inst.state };
  for (var i = 0; i < queue.length; i++) {
    var partial = queue[i];
    Object.assign(
      nextState,
      typeof partial === 'function' ? partial(inst, nextState) : partial
   );
  }
  return nextState;
}
// 更新组件
updateComponent(prevParentElement, nextParentElement) {
  var inst = this._instance;
  var prevProps = prevParentElement.props;
  var nextProps = nextParentElement.props;
  var nextState = this._processPendingState();
  var shouldUpdate =
      !shallowEqual(prevProps, nextProps) ||
      !shallowEqual(inst.state, nextState);

  if (shouldUpdate) {
    // diff 、update DOM
  } else {
    inst.props = nextProps;
    inst.state = nextState;
  }
  // 后续的操作包括判断组件是否需要更新、diff、更新到 DOM
}

```

## 模式对比

回到上文的 Fiber 架构，它是为了实现异步渲染做铺垫。

![特性对比](https://img-blog.csdnimg.cn/060f2f0c8b51425cbd5eae536ad54420.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

其中 `Concurrent` 模式是异步渲染方式，`Legacy` 模式依旧是同步更新的方式，可以认为和旧版本保持一致的兼容模式，而 `Blocking` 模式是一个过渡版本。

![模式对比](https://img-blog.csdnimg.cn/89012807228a46a4a10bd208c3777deb.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`Concurrent` 模式说白就是让组件更新异步化，切分时间片，渲染之前的调度、`diff`、更新都只在指定时间片进行，如果超时就暂停放到下个时间片进行，中途给浏览器一个喘息的时间。

## 替换原因

因此，我们可以很直观的得到采用 Fiber 的原因:

1. 之前的 `reconciler（被称为 Stack reconciler）`采用`自顶向下`的递归 `mount/update`，无法中断（持续占用主线程），这样主线程上的布局、动画等周期性任务以及交互响应就无法立即得到处理，影响体验。

2. 之前的渲染过程中没有优先级可言。

因此，基于浏览器对 `requestIdleCallback` 和 `requestAnimationFrame` 这两个 API 的支持,`React` 团队实现了新的调度策略 -- `Fiber reconcile`。

## requestIdelCallBack

客户端线程执行任务时会以帧的形式划分，大部分设备控制在 30-60 帧是不会影响用户体验的。在两个帧的执行期间，主线程通常会有一小段的空闲时间。`requestIdelCallBack` 可以在这个空闲时间调用 `IdelCallBack` 执行一些任务。

- 低优先级的任务将由 `requestIdelCallBack` 来处理。

- 高优先级的任务，比如动画相关的由 `requestAnimationFrame` 来处理

- `requestIdelCallBack` 可以在多个空闲期调用空闲期回调，执行任务

- `requestIdelCallBack` 方法提供 `deadline` 即任务执行限制时间以切分任务，避免长时间执行，阻塞 `UI` 渲染而导致掉帧。

## Fiber 的含义

Fiber 包含三层含义：

1. 作为架构来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber`节点实现，被称为`Fiber Reconciler`。

2. 作为静态的数据结构来说，每个`Fiber`节点对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的 DOM 节点等信息。

3. 作为动态的工作单元来说，每个`Fiber`节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

## Fiber 的结构

[完整的 Fiber 节点属性含义](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)

虽然属性很多，但我们可以按三层含义将他们分类来看:

```js
function FiberNode(
  tag: WorkTag,
  pedingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

### 作为架构来说

每个 Fiber 节点有个对应的`React element`，多个`Fiber`节点是如何连接形成树呢？靠如下三个属性：

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

举个例子，如下的组件结构：

```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  );
}
```

对应的 Fiber 树结构：

![Fiber树结构](https://react.iamkasong.com/img/fiber.png)

为什么父级指针叫做`return`而不是`parent`或者`father`呢？

因为作为一个工作单元，`return`指节点执行完`completeWork`后会返回的下一个节点。

子`Fiber`节点及其兄弟节点完成工作后会返回其父级节点，所以用`return`指代父级节点。

### 作为静态的数据结构

作为一种静态的数据结构，保存了组件相关的信息：

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

### 作为动态的工作单元

作为动态的工作单元，Fiber 中如下参数保存了本次更新相关的信息:

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

如下两个字段保存调度优先级相关的信息，会在讲解`Scheduler`时介绍。

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

## Fiber 架构的工作原理

### 什么是“双缓存”

当我们用`canvas`绘制动画，每一帧绘制前都会调用`ctx.clearRect`清除上一帧的画面。

如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。

这种在**内存中构建并直接替换的技术叫做双缓存**。

React 使用`双缓存`来完成 Fiber 树的构建与替换——对应着 DOM 树的创建与更新。

### 双缓存 Fiber 树

在 React 中最多会同时存在两棵`Fiber`树。当前屏幕上显示内容对应的`Fiber`树称为`current Fiber`树，正在内存中构建的`Fiber`树称为`workInProgress Fiber`树。

`current Fiber`树中的`Fiber`节点被称为`current fiber`，`workInProgress Fiber`树中的`Fiber`节点被称为`workInProgress fiber`，他们通过`alternate`属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

React 应用的根节点通过使`current`指针在不同`Fiber`树的`rootFiber`间切换来完成`current Fiber`树指向的切换。

即当`workInProgress Fiber`树构建完成交给`Renderer`渲染在页面上后，应用根节点的`current`指针指向`workInProgress Fiber`树，此时`workInProgress Fiber`树就变为`current Fiber`树。

每次状态更新都会产生新的`workInProgress Fiber`树，通过`current`与`workInProgress`的替换，完成 DOM 更新。

### mount 时

考虑如下例子：

```js
function App() {
  const [num, add] = useState(0);
  return <p onClick={() => add(num + 1)}>{num}</p>;
}

ReactDOM.render(<App />, document.getElementById('root'));
```

1. 首次执行`ReactDOM.render`会创建`fiberRootNode`（源码中叫 fiberRoot）和`rootFiber`。其中`fiberRootNode`是整个应用的根节点，`rootFiber`是`<App/>`所在组件树的根节点。

之所以要区分`fiberRootNode`与`rootFiber`，是因为在应用中我们可以多次调用`ReactDOM.render`渲染不同的组件树，他们会拥有不同的`rootFiber`。但是整个应用的根节点只有一个，那就是`fiberRootNode`。

`fiberRootNode`的`current`会指向当前页面上已渲染内容对应 Fiber 树，即`current Fiber`树。

![fiberRootNode](https://react.iamkasong.com/img/rootfiber.png)

```js
fiberRootNode.current = rootFiber;
```

由于是首屏渲染，页面中还没有挂载任何 DOM，所以`fiberRootNode.current`指向的`rootFiber`没有任何子 Fiber 节点（即 current Fiber 树为空）。

2. 接下来进入 render 阶段，根据组件返回的 JSX 在内存中依次创建 Fiber 节点并连接在一起构建 Fiber 树，被称为 workInProgress Fiber 树。（下图中右侧为内存中构建的树，左侧为页面显示的树）

在构建`workInProgress Fiber`树时会尝试复用`current Fiber`树中已有的`Fiber`节点内的属性，在首屏渲染时只有`rootFiber`存在对应的`current fiber`（即`rootFiber.alternate`）。

![rootFiber.alternate](https://react.iamkasong.com/img/workInProgressFiber.png)

3. 图中右侧已构建完的 workInProgress Fiber 树在 commit 阶段渲染到页面。

此时 DOM 更新为右侧树对应的样子。`fiberRootNode`的`current`指针指向`workInProgress Fiber`树使其变为`current Fiber` 树。

![3](https://react.iamkasong.com/img/wipTreeFinish.png)

### update 时

接下来我们点击 p 节点触发状态改变，这会开启一次新的 render 阶段并构建一棵新的`workInProgress Fiber` 树。

![4](https://react.iamkasong.com/img/wipTreeUpdate.png)

和 `mount` 时一样，`workInProgress fiber`的创建可以复用`current Fiber` 树对应的节点数据。

`workInProgress Fiber` 树在`render`阶段完成构建后进入 commit 阶段渲染到页面上。渲染完毕后，`workInProgress Fiber` 树变为`current Fiber` 树。

![5](https://react.iamkasong.com/img/currentTreeUpdate.png)

## React Fiber 的方式

> 把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。

`React Fiber` 把更新过程碎片化，每执行完一段更新过程，就把控制权交还给 `React` 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

## Fiber 调度的两个阶段

`React` 把一次渲染分为两个阶段：`render` 和 `commit`。

### 1. `render/reconciliation` 阶段

此阶段中，`React` 通过 `setState` 或 `React.render` 来执行组件的更新，并确定需要在 UI 中更新的内容。如果是第一次渲染，`React` 会为 `render` 方法返回的每个元素，创建一个新的 `fiber` 节点。在接下来的更新中，将重用和更新现有 `React` 元素的 `fiber` 节点。`render` 阶段的结果是**生成一个部分节点标记了 `side effects` 的 `fiber` 节点树**，`side effects` 描述了在下一个 `commit` 阶段需要完成的工作。

在此阶段，`React` 采用标有 `side effects` 的 `fiber` 树并将其应用于实例。它遍历 `side effects` 列表并执行 `DOM` 更新和用户可见的其他更改。

**这个阶段的任务可以被打断，该阶段里面的所有生命周期函数都可能被执行多次，所以尽量保证状态不变:**

`React` 可以根据可用时间来处理一个或多个 `fiber` 节点，然后停止已完成的工作，并让出调度权来处理某些事件。然后它从它停止的地方继续。但有时候，它可能需要丢弃完成的工作并再次从头。由于在 `render` 阶段执行的工作不会导致任何用户可见的更改（如 DOM 更新），因此这些暂停是不会有问题的。

该阶段主要涉及以下生命周期及方法。

- getDerivedStateFromProps
- shouldComponentUpdate
- render

`reconciliation` 算法始终使用 `renderRoot` 函数从最顶端的 `HostRoot fiber` 节点开始。但是，`React` 会跳过已经处理过的 `fiber` 节点，直到找到未完成工作的节点。例如，如果在组件树中调用 `setState`，则 `React` 将从顶部开始，但会快速跳过父节点，直到它到达调用了 `setState` 方法的组件。

- Main steps of the work loop

所有 `fiber` 节点都在 [work loop](https://github.com/facebook/react/blob/f765f022534958bcf49120bf23bc1aa665e8f651/packages/react-reconciler/src/ReactFiberScheduler.js#L1136) 中处理。这是循环的同步部分的实现

```js
function workLoop(isYieldy) {
  if (!isYieldy) {
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // Flush asynchronous work until the deadline runs out of time.
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}
```

在上面的代码中，`nextUnitOfWork` 从 `workInProgress` 树中保存对 `fiber` 节点(这些节点有部分任务要处理)的引用。

当 `React` 遍历 `Fibers` 树时，它使用此变量来知道是否有任何其他 `fiber` 节点具有未完成的工作。处理当前 `fiber` 后，变量将包含对树中下一个 `fiber` 节点的引用或 `null`。在这种情况下，`React` 退出工作循环并准备提交更改.

有 4 个主要功能用于遍历树并启动或完成工作:

- [performUnitOfWork](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L1056)
- [beginWork](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/react-reconciler/src/ReactFiberBeginWork.js#L1489)
- [completeUnitOfWork](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L879)
- [completeWork](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/react-reconciler/src/ReactFiberCompleteWork.js#L532)

这里适用的树遍历算法是`深度优先搜索(DFS)`，下面的动图展示了这些函数的简化实现。

每个函数都需要一个 `fiber` 节点进行处理，当 `React` 从树上下来时，可以看到当前活动的 `fiber` 节点发生了变化，可以清楚地看到算法如何从一个分支转到另一个分支。它首先完成 `child` 节点的工作，然后转移到 `parent` 身边.

![函数展示](https://img-blog.csdnimg.cn/870e657079634d75a5ba31f6709265a0.gif)

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '注意，垂直连接表示`sibling`，而弯曲的连接表示`child`，例如`b1`没有`child`，而`b2`有一个`childc1`';

export default () => <Info type="warning" txt={txt} />;
```

让我们从前两个函数 `performUnitOfWork` 和 `beginWork` 开始:

```js
function performUnitOfWork(workInProgress) {
  let next = beginWork(workInProgress);
  if (next === null) {
    next = completeUnitOfWork(workInProgress);
  }
  return next;
}

function beginWork(workInProgress) {
  console.log('work performed for ' + workInProgress.name);
  return workInProgress.child;
}
```

`performUnitOfWork` 函数从 `workInProgress` 树接收 `fiber` 节点，并通过调用 `beginWork` 函数启动工作，即通过这个函数启动 `fiber` 需要执行的所有活动。出于演示的目的，我们只需记录 `fiber` 的名称即可表示已完成工作。`beginWork` 函数始终返回要在循环中处理的下一个子节点的指针或 `null`.

如果有下一个子节点，它将被赋值给 `workLoop` 函数中的 `nextUnitOfWork` 变量。但是，如果没有子节点，`React` 知道它到达了分支的末尾，因此它就完成当前节点。一旦节点完成，它将需要为兄弟节点执行工作并在此之后回溯到父节点。这是在 `completeUnitOfWork` 函数中完成的.

```js
function completeUnitOfWork(workInProgress) {
  while (true) {
    let returnFiber = workInProgress.return;
    let siblingFiber = workInProgress.sibling;

    nextUnitOfWork = completeWork(workInProgress);

    if (siblingFiber !== null) {
      // If there is a sibling, return it
      // to perform work for this sibling
      return siblingFiber;
    } else if (returnFiber !== null) {
      // If there's no more work in this returnFiber,
      // continue the loop to complete the parent.
      workInProgress = returnFiber;
      continue;
    } else {
      // We've reached the root.
      return null;
    }
  }
}

function completeWork(workInProgress) {
  console.log('work completed for ' + workInProgress.name);
  return null;
}
```

可以看到函数的重点是一个很大的循环。当 `workInProgress` 节点没有子节点时，`React` 会进入此函数。完成当前 `fiber` 的工作后，它会检查是否有兄弟节点；

如果找到，`React` 退出该函数并返回指向兄弟节点的指针。它将被赋值给 `nextUnitOfWork` 变量，`React` 将从这个兄弟开始执行分支的工作。重要的是要理解，在这一点上，`React` 只完成了前面兄弟姐妹的工作。它尚未完成父节点的工作，只有在完成所有子节点工作后，才能完成父节点和回溯的工作.

从实现中可以看出，`performUnitOfWork` 和 `completeUnitOfWork` 主要用于迭代目的，而主要活动则在 `beginWork` 和 `completeWork` 函数中进行。在后面的部分，我们将了解当 `React` 进入 `beginWork` 和 `completeWork` 函数时，`ClickCounter` 组件和 `span` 节点会发生什么.

### 2. `Commit` 阶段

根据在 `Reconcile` 阶段生成的数组，遍历更新 `DOM`，这个阶段需要一次性执行完。如果是在其他的渲染环境 -- `Native`，硬件，就会更新对应的元素。

**该阶段的任务不可以被打断。**

- componentDidMount
- componentDidUpdate
- compoenntWillunmount

该阶段以 `completeRoot` 函数开始，这是 `React` 更新 `DOM` 并调用 `mutation` 生命周期方法的地方。

当 `React` 进入这个阶段时，它有 `2` 棵树和 `effects list`。

- 第一棵树是 `current tree`, 表示当前在屏幕上呈现的状态，

- 然后是在渲染阶段构建了一个备用树，它在源代码中称为 `finishedWork` 或 `workInProgress`，表示需要在屏幕上反映的状态。此备用树通过子节点和兄弟节点指针来与 `current` 树类似地链接。

- 然后，有一个 `effects list` - 通过 `nextEffect` 指针链接的，`finishedWork` 树中节点的子集。请记住，`effects list` 是 `render` 阶段运行的结果。`render` 阶段的重点是确定需要插入，更新或删除哪些节点，以及哪些组件需要调用其生命周期方法，其最终生成了 `effects list`，也正是在提交阶段迭代的节点集。

出于调试目的，可以通过 `fiber root` 的 `current` 属性访 `current tree`，可以通过 `current tree` 中 `HostFiber` 节点的 `alternate` 属性访问 `finishedWork` 树。

在提交阶段运行的主要功能是[commitRoot](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L523)。它会执行以下操作:

- 在标记了 `Snapshot effect` 的节点上使用 `getSnapshotBeforeUpdate` 生命周期方法
- 在标记了 `Deletion effect` 的节点上调用 `componentWillUnmoun`t 生命周期方法
- 执行所有 `DOM` 插入，更新和删除
- 将 `finishedWork` 树设置为 `current` 树
- 在标记了 `Placement effect` 的节点上调用 `componentDidMount` 生命周期方法
- 在标记了 `Update effect` 的节点上调用 `componentDidUpdate` 生命周期方法

在调用 `pre-mutation` 方法 `getSnapshotBeforeUpdate` 之后，`React` 会在树中提交所有 `side-effects`。

它通过两个部分：

- 第一部分执行所有 DOM（Host）插入，更新，删除和 ref 卸载，然后，React 将 `finishedWork` 树分配给 `FiberRoot`，将 `workInProgress` 树标记为 `current` 树。前面这些都是在 commit 阶段的第一部分完成的，因此在 `componentWillUnmount` 中指向的仍然是前一个树，但在第二部分之前，因此在 `componentDidMount / Update` 中指向的是最新的树。

- 在第二部分中，`React` 调用所有其他生命周期方法和 `ref callback`, 这些方法将会单独执行，因此已经调用了整个树中的所有放置(placement)，更新和删除.

下面这段代码运行上述步骤的函数的要点，其中 `root.current=finishWork` 及以前为第一部分，其之后为第二部分.

```js
function commitRoot(root, finishedWork) {
  commitBeforeMutationLifecycles();
  commitAllHostEffects();
  root.current = finishedWork;
  commitAllLifeCycles();
}
```

这些子函数中的每一个都实现了一个循环，该循环遍历 `effects list` 并检查 `effect` 的类型, 当它找到与函数功能相关的 `effects` 时，就会执行它.

### Pre-mutation lifecycle methods

例如，这是在 `effect tree` 上迭代并检查节点是否具有 `Snapshot effect` 的代码:

```js
function commitBeforeMutationLifecycles() {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;
    if (effectTag & Snapshot) {
      const current = nextEffect.alternate;
      commitBeforeMutationLifeCycles(current, nextEffect);
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

对于类组件，该 `effect` 意味着调用 `getSnapshotBeforeUpdate` 生命周期方法.

### DOM updates

[commitAllHostEffects](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L376) 是 React 执行 DOM 更新的函数。该函数基本上定义了需要为节点完成并执行它的操作类型.

```js
function commitAllHostEffects() {
    switch (primaryEffectTag) {
        case Placement: {
            commitPlacement(nextEffect);
            ...
        }
        case PlacementAndUpdate: {
            commitPlacement(nextEffect);
            commitWork(current, nextEffect);
            ...
        }
        case Update: {
            commitWork(current, nextEffect);
            ...
        }
        case Deletion: {
            commitDeletion(nextEffect);
            ...
        }
    }
}
```

有趣的是，React 调用 `componentWillUnmount` 方法作为 `commitDeletion` 函数中删除过程的一部分.

### Post-mutation lifecycle methods

[commitAllLifecycles](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L465) 是 React 调用所有剩余生命周期方法 `componentDidUpdate` 和 `componentDidMount` 的函数.

## Fiber Render

本章我们会讲解`Fiber`节点是如何被创建并构建`Fiber`树的。

`render`阶段开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用。这取决于本次更新是`同步更新`还是`异步更新`。

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

他们唯一的区别是是否调用`shouldYield`。如果当前浏览器帧没有剩余时间，`shouldYield`会中止循环，直到浏览器有空闲时间后再继续遍历。

- `workInProgress`代表当前已创建的`workInProgress fiber`。

- `performUnitOfWork`方法会创建下一个`Fiber`节点并赋值给`workInProgress`，并将`workInProgress`与已创建的 Fiber 节点连接起来构成 Fiber 树。

我们知道`Fiber Reconciler`是从`Stack Reconciler`重构而来，通过遍历的方式实现可中断的递归，所以`performUnitOfWork`的工作可以分为两部分：`递`和`归`。

### 递

首先从`rootFiber`开始向下`深度优先`遍历。为遍历到的每个 Fiber 节点调用[beginWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3058)方法。

该方法会根据传入的 Fiber 节点创建子 Fiber 节点，并将这两个 Fiber 节点连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

### 归

在“归”阶段会调用[completeWork](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L652)处理 Fiber 节点。

当某个`Fiber`节点执行完`completeWork`，如果其存在兄弟`Fiber`节点（即`fiber.sibling !== null`），会进入其兄弟 Fiber 的“递”阶段。

如果不存在兄弟 Fiber，会进入父级 Fiber 的“归”阶段。

“递”和“归”阶段会交错执行直到“归”到 rootFiber。至此，render 阶段的工作就结束了。

### 例子

```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

对应的 Fiber 树结构：

![Fiber树结构](https://react.iamkasong.com/img/fiber.png)

render 阶段会依次执行：

```js
1. rootFiber beginWork
2. App Fiber beginWork
3. div Fiber beginWork
4. "i am" Fiber beginWork
5. "i am" Fiber completeWork
6. span Fiber beginWork
7. span Fiber completeWork
8. div Fiber completeWork
9. App Fiber completeWork
10. rootFiber completeWork
```

之所以没有 `KaSong` Fiber 的 `beginWork/completeWork`，是因为作为一种性能优化手段，针对只有单一文本子节点的 Fiber，React 会特殊处理。

### beginWork

可以从[源码](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3075)看到`beginWork`的定义。整个方法大概有 500 行代码。

`beginWork`的工作是传入当前 Fiber 节点，创建子 Fiber 节点，我们从传参来看看具体是如何做的。

#### 从传参看方法执行

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...省略函数体
}
```

- current：当前组件对应的 Fiber 节点在上一次更新时的 Fiber 节点，即 workInProgress.alternate
- workInProgress：当前组件对应的 Fiber 节点
- renderLanes：优先级相关，在讲解 Scheduler 时再讲解

除`rootFiber`以外， 组件`mount`时，由于是首次渲染，是不存在当前组件对应的 Fiber 节点在上一次更新时的 Fiber 节点，即 mount 时`current === null`。

组件 update 时，由于之前已经`mount`过，所以`current !== null`。

所以我们可以通过`current === null` ?来区分组件是处于`mount`还是`update`。

基于此原因，`beginWork`的工作可以分为两部分：

- `update`时：如果`current`存在，在满足一定条件时可以复用 current 节点，这样就能克隆`current.child`作为`workInProgress.child`，而不需要新建`workInProgress.child`。

- `mount`时：除`fiberRootNode`以外，`current === null`。会根据`fiber.tag`不同，创建不同类型的子 Fiber 节点

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    // ...省略

    // 复用current
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } else {
    didReceiveUpdate = false;
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    // ...省略
    case LazyComponent:
    // ...省略
    case FunctionComponent:
    // ...省略
    case ClassComponent:
    // ...省略
    case HostRoot:
    // ...省略
    case HostComponent:
    // ...省略
    case HostText:
    // ...省略
    // ...省略其他类型
  }
}
```

update 时，我们可以看到，满足如下情况时`didReceiveUpdate === false`（即可以直接复用前一次更新的子 Fiber，不需要新建子 Fiber）

1. oldProps === newProps && workInProgress.type === current.type，即 props 与 fiber.type 不变

2. !includesSomeLane(renderLanes, updateLanes)，即当前 Fiber 节点优先级不够，会在讲解 Scheduler 时介绍

```js
if (current !== null) {
  const oldProps = current.memoizedProps;
  const newProps = workInProgress.pendingProps;

  if (
    oldProps !== newProps ||
    hasLegacyContextChanged() ||
    (__DEV__ ? workInProgress.type !== current.type : false)
  ) {
    didReceiveUpdate = true;
  } else if (!includesSomeLane(renderLanes, updateLanes)) {
    didReceiveUpdate = false;
    switch (
      workInProgress.tag
      // 省略处理
    ) {
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } else {
    didReceiveUpdate = false;
  }
} else {
  didReceiveUpdate = false;
}
```

mount 时，当不满足优化路径时，我们就进入第二部分，新建子 Fiber。

我们可以看到，根据`fiber.tag`不同，进入不同类型 Fiber 的创建逻辑。

```js
// mount时：根据tag不同，创建不同的Fiber节点
switch (workInProgress.tag) {
  case IndeterminateComponent:
  // ...省略
  case LazyComponent:
  // ...省略
  case FunctionComponent:
  // ...省略
  case ClassComponent:
  // ...省略
  case HostRoot:
  // ...省略
  case HostComponent:
  // ...省略
  case HostText:
  // ...省略
  // ...省略其他类型
}
```

对于我们常见的组件类型，如（FunctionComponent/ClassComponent/HostComponent），最终会进入`reconcileChildren`方法。

- 对于 mount 的组件，他会创建新的子 Fiber 节点

- 对于 update 的组件，他会将当前组件与该组件在上次更新时对应的 Fiber 节点比较（也就是俗称的 Diff 算法），将比较的结果生成新 Fiber 节点

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes,
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

从代码可以看出，和`beginWork`一样，他也是通过`current === null` ?区分 mount 与 update。

不论走哪个逻辑，最终他会生成新的子 Fiber 节点并赋值给`workInProgress.child`，作为本次 `beginWork` 返回值，并作为下次`performUnitOfWork`执行时`workInProgress`的传参。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '值得一提的是，`mountChildFibers`与`reconcileChildFibers`这两个方法的逻辑基本一致。唯一的区别是：`reconcileChildFibers`会为生成的`Fiber`节点带上`effectTag`属性，而`mountChildFibers`不会。';

export default () => <Info type="warning" txt={txt} />;
```

#### effectTag

我们知道，`render`阶段的工作是在内存中进行，当工作结束后会通知 Renderer 需要执行的 DOM 操作。要执行 DOM 操作的具体类型就保存在`fiber.effectTag`中。

[完整的操作](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

```js
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

通过二进制表示 effectTag，可以方便的使用位操作为`fiber.effectTag`赋值多个 effect。

那么，如果要通知 Renderer 将 Fiber 节点对应的 DOM 节点插入页面中，需要满足两个条件：

1. `fiber.stateNode`存在，即 Fiber 节点中保存了对应的 DOM 节点

2. `(fiber.effectTag & Placement) !== 0`，即 Fiber 节点存在 Placement effectTag

我们知道，mount 时，`fiber.stateNode === null`，且在`reconcileChildren`中调用的`mountChildFibers`不会为 Fiber 节点赋值 effectTag。那么首屏渲染如何完成呢？

针对第一个问题，`fiber.stateNode`会在`completeWork`中创建，我们会在下一节介绍。

第二个问题的答案十分巧妙：假设`mountChildFibers`也会赋值 effectTag，那么可以预见 mount 时整棵 Fiber 树所有节点都会有 Placement effectTag。那么 commit 阶段在执行 DOM 操作时每个节点都会执行一次插入操作，这样大量的 DOM 操作是极低效的。

为了解决这个问题，在 mount 时只有`rootFiber`会赋值`Placement effectTag`，在`commit`阶段只会执行一次插入操作。

![beginWork流程图](https://react.iamkasong.com/img/beginWork.png)

### completeWork

类似`beginWork`，`completeWork`也是针对不同`fiber.tag`调用不同的处理逻辑。

```js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      // ...省略
      return null;
    }
    case HostRoot: {
      // ...省略
      updateHostContainer(workInProgress);
      return null;
    }
    case HostComponent: {
      // ...省略
      return null;
    }
  // ...省略
```

我们重点关注页面渲染所必须的`HostComponent`（即原生 DOM 组件对应的 Fiber 节点），其他类型 Fiber 的处理留在具体功能实现时讲解。

#### 处理 HostComponent

同时针对`HostComponent`，判断 update 时我们还需要考虑`workInProgress.stateNode != null` ?（即该 Fiber 节点是否存在对应的 DOM 节点）

```js
case HostComponent: {
  popHostContext(workInProgress);
  const rootContainerInstance = getRootHostContainer();
  const type = workInProgress.type;

  if (current !== null && workInProgress.stateNode != null) {
    // update的情况
    // ...省略
  } else {
    // mount的情况
    // ...省略
  }
  return null;
}
```

#### update 时

当`update`时，`Fiber`节点已经存在对应 DOM 节点，所以不需要生成 DOM 节点。需要做的主要是处理 props，比如：

- onClick、onChange 等回调函数的注册
- 处理 style prop
- 处理 DANGEROUSLY_SET_INNER_HTML prop
- 处理 children prop

我们去掉一些当前不需要关注的功能（比如 ref）。可以看到最主要的逻辑是调用`updateHostComponent`方法。

```js
if (current !== null && workInProgress.stateNode != null) {
  // update的情况
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );
}
```

在`updateHostComponent`内部，被处理完的 props 会被赋值给`workInProgress.updateQueue`，并最终会在 commit 阶段被渲染在页面上。

```js
workInProgress.updateQueue = (updatePayload: any);
```

#### mount 时

mount 时的主要逻辑包括三个：

1. 为 Fiber 节点生成对应的 DOM 节点
2. 将子孙 DOM 节点插入刚生成的 DOM 节点中
3. 与 update 逻辑中的 updateHostComponent 类似的处理 props 的过程

```js
// mount的情况

// ...省略服务端渲染相关逻辑

const currentHostContext = getHostContext();
// 为fiber创建对应DOM节点
const instance = createInstance(
  type,
  newProps,
  rootContainerInstance,
  currentHostContext,
  workInProgress,
);
// 将子孙DOM节点插入刚生成的DOM节点中
appendAllChildren(instance, workInProgress, false, false);
// DOM节点赋值给fiber.stateNode
workInProgress.stateNode = instance;

// 与update逻辑中的updateHostComponent类似的处理props的过程
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
  )
) {
  markUpdate(workInProgress);
}
```

#### effectList

至此 render 阶段的绝大部分工作就完成了。

还有一个问题：作为 DOM 操作的依据，commit 阶段需要找到所有有 effectTag 的 Fiber 节点并依次执行 effectTag 对应操作。难道需要在 commit 阶段再遍历一次 Fiber 树寻找 effectTag !== null 的 Fiber 节点么？

这显然是很低效的。

为了解决这个问题，在`completeWork`的上层函数`completeUnitOfWork`中，每个执行完`completeWork`且存在`effectTag`的 Fiber 节点会被保存在一条被称为`effectList`的单向链表中。

`effectList`中第一个 Fiber 节点保存在`fiber.firstEffect`，最后一个元素保存在`fiber.lastEffect`。

类似`appendAllChildren`，在“归”阶段，所有有`effectTag`的 Fiber 节点都会被追加在`effectList`中，最终形成一条以`rootFiber.firstEffect`为起点的单向链表。

```js
rootFiber.firstEffect -----------> fiber -----------> fiber
```

这样，在 commit 阶段只需要遍历 effectList 就能执行所有 effect 了。

至此，render 阶段全部工作完成。在`performSyncWorkOnRoot`函数中`fiberRootNode`被传递给`commitRoot`方法，开启`commit`阶段工作流程。

![completeWork流程图](https://react.iamkasong.com/img/completeWork.png)

## Fiber commit 阶段

`commitRoot`方法是 commit 阶段工作的起点。`fiberRootNode`会作为传参。

在`rootFiber.firstEffect`上保存了一条需要执行副作用的`Fiber`节点的单向链表`effectList`，这些 Fiber 节点的`updateQueue`中保存了变化的 props。

这些副作用对应的 DOM 操作在`commit`阶段执行。

除此之外，一些生命周期钩子（比如 componentDidXXX）、hook（比如 useEffect）需要在 commit 阶段执行。

commit 阶段的主要工作（即 Renderer 的工作流程）分为三部分：

1. before mutation 阶段（执行 DOM 操作前）

2. mutation 阶段（执行 DOM 操作）

3. layout 阶段（执行 DOM 操作后）

在 before mutation 阶段之前和 layout 阶段之后还有一些额外工作，涉及到比如 useEffect 的触发、优先级相关的重置、ref 的绑定/解绑。

### before mutation 之前

commitRootImpl 方法中直到第一句`if (firstEffect !== null)`之前属于`before mutation`之前。

我们大体看下他做的工作，现在你还不需要理解他们：

```js
do {
  // 触发useEffect回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
  flushPassiveEffects();
} while (rootWithPendingPassiveEffects !== null);

// root指 fiberRootNode
// root.finishedWork指当前应用的rootFiber
const finishedWork = root.finishedWork;

// 凡是变量名带lane的都是优先级相关
const lanes = root.finishedLanes;
if (finishedWork === null) {
  return null;
}
root.finishedWork = null;
root.finishedLanes = NoLanes;

// 重置Scheduler绑定的回调函数
root.callbackNode = null;
root.callbackId = NoLanes;

let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
// 重置优先级相关变量
markRootFinished(root, remainingLanes);

// 清除已完成的discrete updates，例如：用户鼠标点击触发的更新。
if (rootsWithPendingDiscreteUpdates !== null) {
  if (
    !hasDiscreteLanes(remainingLanes) &&
    rootsWithPendingDiscreteUpdates.has(root)
  ) {
    rootsWithPendingDiscreteUpdates.delete(root);
  }
}

// 重置全局变量
if (root === workInProgressRoot) {
  workInProgressRoot = null;
  workInProgress = null;
  workInProgressRootRenderLanes = NoLanes;
} else {
}

// 将effectList赋值给firstEffect
// 由于每个fiber的effectList只包含他的子孙节点
// 所以根节点如果有effectTag则不会被包含进来
// 所以这里将有effectTag的根节点插入到effectList尾部
// 这样才能保证有effect的fiber都在effectList中
let firstEffect;
if (finishedWork.effectTag > PerformedWork) {
  if (finishedWork.lastEffect !== null) {
    finishedWork.lastEffect.nextEffect = finishedWork;
    firstEffect = finishedWork.firstEffect;
  } else {
    firstEffect = finishedWork;
  }
} else {
  // 根节点没有effectTag
  firstEffect = finishedWork.firstEffect;
}
```

可以看到，before mutation 之前主要做一些变量赋值，状态重置的工作。

### layout 之后

接下来让我们简单看下 layout 阶段执行完后的代码

```js
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

// useEffect相关
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
} else {
}

// 性能优化相关
if (remainingLanes !== NoLanes) {
  if (enableSchedulerTracing) {
    // ...
  }
} else {
  // ...
}

// 性能优化相关
if (enableSchedulerTracing) {
  if (!rootDidHavePassiveEffects) {
    // ...
  }
}

// ...检测无限循环的同步任务
if (remainingLanes === SyncLane) {
  // ...
}

// 在离开commitRoot函数前调用，触发一次新的调度，确保任何附加的任务被调度
ensureRootIsScheduled(root, now());

// ...处理未捕获错误及老版本遗留的边界问题

// 执行同步任务，这样同步任务不需要等到下次事件循环再执行
// 比如在 componentDidMount 中执行 setState 创建的更新会在这里被同步执行
// 或useLayoutEffect
flushSyncCallbackQueue();

return null;
```

主要包括三点内容：

1. useEffect 相关的处理。
2. 性能追踪相关。

   源码里有很多和`interaction`相关的变量。他们都和追踪 React 渲染时间、性能相关，在[Profiler API](https://zh-hans.reactjs.org/docs/profiler.html)和[DevTools](https://github.com/facebook/react-devtools/pull/1069)中使用。

3. 在 commit 阶段会触发一些生命周期钩子（如 componentDidXXX）和 hook（如 useLayoutEffect、useEffect）。

   在这些回调方法中可能触发新的更新，新的更新会开启新的 render-commit 流程。

### before mutation 阶段

整个过程就是遍历`effectList`并调用`commitBeforeMutationEffects`函数处理。

```js
// 保存之前的优先级，以同步优先级执行，执行完毕后恢复之前优先级
const previousLanePriority = getCurrentUpdateLanePriority();
setCurrentUpdateLanePriority(SyncLanePriority);

// 将当前上下文标记为CommitContext，作为commit阶段的标志
const prevExecutionContext = executionContext;
executionContext |= CommitContext;

// 处理focus状态
focusedInstanceHandle = prepareForCommit(root.containerInfo);
shouldFireAfterActiveInstanceBlur = false;

// beforeMutation阶段的主函数
commitBeforeMutationEffects(finishedWork);

focusedInstanceHandle = null;
```

#### commitBeforeMutationEffects

```js
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...focus blur相关
    }

    const effectTag = nextEffect.effectTag;

    // 调用getSnapshotBeforeUpdate
    if ((effectTag & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    // 调度useEffect
    if ((effectTag & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalSchedulerPriority, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

整体可以分为三部分：

1. 处理 DOM 节点渲染/删除后的 autoFocus、blur 逻辑。

2. 调用 getSnapshotBeforeUpdate 生命周期钩子。

3. 调度 useEffect。

我们可以看见，`getSnapshotBeforeUpdate`是在 commit 阶段内的 before mutation 阶段调用的，由于 commit 阶段是同步的，所以不会遇到多次调用的问题。

### 调度 useEffect

在这几行代码内，`scheduleCallback`方法由 Scheduler 模块提供，用于以某个优先级异步调度一个回调函数。

```js
// 调度useEffect
if ((effectTag & Passive) !== NoEffect) {
  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalSchedulerPriority, () => {
      // 触发useEffect
      flushPassiveEffects();
      return null;
    });
  }
}
```

在此处，被异步调度的回调函数就是触发`useEffect`的方法`flushPassiveEffects`。

### 如何异步调度

在`flushPassiveEffects`方法内部会从全局变量`rootWithPendingPassiveEffects`获取`effectList`。

`effectList`中保存了需要执行副作用的 Fiber 节点。其中副作用包括

- 插入 DOM 节点（Placement）
- 更新 DOM 节点（Update）
- 删除 DOM 节点（Deletion）

除此外，当一个`FunctionComponent`含有`useEffect`或`useLayoutEffect`，他对应的 Fiber 节点也会被赋值`effectTag`。

在`flushPassiveEffects`方法内部会遍历`rootWithPendingPassiveEffects`（即 effectList）执行`effect`回调函数。

如果在此时直接执行，`rootWithPendingPassiveEffects === null`。

那么`rootWithPendingPassiveEffects`会在何时赋值呢？

在上一节 layout 之后的代码片段中会根据`rootDoesHavePassiveEffects === true`?决定是否赋值`rootWithPendingPassiveEffects`。

```js
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
}
```

所以整个`useEffect`异步调用分为三步：

1. `before mutation`阶段在`scheduleCallback`中调度`flushPassiveEffects`

2. `layout`阶段之后将`effectList`赋值给`rootWithPendingPassiveEffects`

3. `scheduleCallback`触发`flushPassiveEffects`，`flushPassiveEffects`内部遍历`rootWithPendingPassiveEffects`。

### 为什么需要异步调用？

与 `componentDidMount`、`componentDidUpdate` 不同的是，在浏览器完成布局与绘制之后，传给 `useEffect` 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

可见，`useEffect`异步执行的原因主要是防止同步执行时阻塞浏览器渲染。

我们知道了在`before mutation`阶段，会遍历`effectList`，依次执行：

1. 处理 DOM 节点渲染/删除后的 autoFocus、blur 逻辑

2. 调用 getSnapshotBeforeUpdate 生命周期钩子

3. 调度 useEffect

### mutation 阶段

终于到了执行 DOM 操作的`mutation阶段`。

类似`before mutation`阶段，`mutation`阶段也是遍历`effectList`，执行函数。这里执行的是`commitMutationEffects`。

```js
nextEffect = firstEffect;
do {
  try {
    commitMutationEffects(root, renderPriorityLevel);
  } catch (error) {
    invariant(nextEffect !== null, 'Should be working on an effect.');
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);
```

commitMutationEffects:

```js
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 遍历effectList
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 根据 ContentReset effectTag重置文字节点
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    // 更新ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // 根据 effectTag 分别处理
    const primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    switch (primaryEffectTag) {
      // 插入DOM
      case Placement: {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入DOM 并 更新DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);

        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

`commitMutationEffects`会遍历`effectList`，对每个 Fiber 节点执行如下三个操作：

1. 根据 ContentReset effectTag 重置文字节点
2. 更新 ref
3. 根据 effectTag 分别处理，其中 effectTag 包括(Placement | Update | Deletion | Hydrating)

#### Placement effect

当 Fiber 节点含有`Placement effectTag`，意味着该 Fiber 节点对应的 DOM 节点需要插入到页面中，调用的方法为`commitPlacement`。

该方法所做的工作分为三步：

1. 获取父级 DOM 节点。其中 finishedWork 为传入的 Fiber 节点。

   ```js
   const parentFiber = getHostParentFiber(finishedWork);
   // 父级DOM节点
   const parentStateNode = parentFiber.stateNode;
   ```

2. 获取 Fiber 节点的 DOM 兄弟节点

   ```js
   const before = getHostSibling(finishedWork);
   ```

3. 根据 DOM 兄弟节点是否存在决定调用 parentNode.insertBefore 或 parentNode.appendChild 执行 DOM 插入操作。

   ```js
   // parentStateNode是否是rootFiber
   if (isContainer) {
     insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
   } else {
     insertOrAppendPlacementNode(finishedWork, before, parent);
   }
   ```

值得注意的是，`getHostSibling（获取兄弟DOM节点）`的执行很耗时，当在同一个父 Fiber 节点下依次执行多个插入操作，`getHostSibling`算法的复杂度为指数级。

这是由于`Fiber`节点不只包括`HostComponent`，所以 Fiber 树和渲染的 DOM 树节点并不是一一对应的。要从 Fiber 节点找到 DOM 节点很可能跨层级遍历。

考虑如下例子：

```js
function Item() {
  return <li><li>;
}

function App() {
  return (
    <div>
      <Item/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

对应的 Fiber 树和 DOM 树结构为：

```js
// Fiber树
          child      child      child       child
rootFiber -----> App -----> div -----> Item -----> li

// DOM树
#root ---> div ---> li
```

当在 div 的子节点 Item 前插入一个新节点 p，即 App 变为：

```js
function App() {
  return (
    <div>
      <p></p>
      <Item />
    </div>
  );
}
```

对应的 Fiber 树和 DOM 树结构为：

```js
// Fiber树
          child      child      child
rootFiber -----> App -----> div -----> p
                                       | sibling       child
                                       | -------> Item -----> li
// DOM树
#root ---> div ---> p
             |
               ---> li
```

此时 DOM 节点 p 的兄弟节点为 li，而 Fiber 节点 p 对应的兄弟 DOM 节点为：

```js
fiberP.sibling.child;
```

即 fiber p 的兄弟 fiber Item 的子 fiber li

#### Update effect

当 Fiber 节点含有`Update effectTag`，意味着该 Fiber 节点需要更新。调用的方法为`commitWork`，他会根据`Fiber.tag`分别处理。

#### FunctionComponent mutation

当`fiber.tag`为`FunctionComponent`，会调用`commitHookEffectListUnmount`。该方法会遍历`effectList`，执行所有`useLayoutEffect hook`的销毁函数。

所谓“销毁函数”，见如下例子：

```js
useLayoutEffect(() => {
  // ...一些副作用逻辑

  return () => {
    // ...这就是销毁函数
  };
});
```

#### HostComponent mutation

当`fiber.tag`为`HostComponent`，会调用`commitUpdate`。

最终会在`updateDOMProperties`中将 render 阶段 `completeWork` 中为 Fiber 节点赋值的`updateQueue`对应的内容渲染在页面上。

```js
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
    // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
    // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
    // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

#### Deletion effect

当 Fiber 节点含有`Deletion effectTag`，意味着该 Fiber 节点对应的 DOM 节点需要从页面中删除。调用的方法为`commitDeletion`。

该方法会执行如下操作：

1. 递归调用 Fiber 节点及其子孙 Fiber 节点中 fiber.tag 为 ClassComponent 的
   `componentWillUnmount`生命周期钩子，从页面移除 Fiber 节点对应 DOM 节点
2. 解绑 ref
3. 调度 useEffect 的销毁函数

### layout 阶段

该阶段之所以称为 layout，因为该阶段的代码都是在 DOM 渲染完成（mutation 阶段完成）后执行的。

该阶段触发的生命周期钩子和 hook 可以直接访问到已经改变后的 DOM，即该阶段是可以参与 DOM layout 的阶段。

layout 阶段也是遍历 effectList，执行函数，具体执行的函数是`commitLayoutEffects`。

```js
root.current = finishedWork;

nextEffect = firstEffect;
do {
  try {
    commitLayoutEffects(root, lanes);
  } catch (error) {
    invariant(nextEffect !== null, 'Should be working on an effect.');
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);

nextEffect = null;
```

#### commitLayoutEffects

```js
function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 调用生命周期钩子和hook
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate;
      commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes);
    }

    // 赋值ref
    if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

`commitLayoutEffects`一共做了两件事：

1. commitLayoutEffectOnFiber（调用生命周期钩子和 hook 相关操作）

2. commitAttachRef（赋值 ref）

##### commitLayoutEffectOnFiber（调用生命周期钩子和 hook 相关操作）

`commitLayoutEffectOnFiber`方法会根据 fiber.tag 对不同类型的节点分别处理。

- 对于`ClassComponent`，他会通过`current === null`?区分是`mount`还是`update`，调用`componentDidMount`或`componentDidUpdate`。

- 对于`FunctionComponent`及相关类型，他会调用`useLayoutEffect hook`的回调函数，调度`useEffect`的销毁与回调函数.

  相关类型指特殊处理后的 FunctionComponent，比如 ForwardRef、React.memo 包裹的 FunctionComponent

  ```js
  switch (finishedWork.tag) {
    // 以下都是FunctionComponent及相关类型
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      // 执行useLayoutEffect的回调函数
      commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
      // 调度useEffect的销毁函数与回调函数
      schedulePassiveEffects(finishedWork);
      return;
    }
  }
  ```

结合这里我们可以发现，`useLayoutEffect hook`从上一次更新的销毁函数调用到本次更新的回调函数调用是同步执行的。

而`useEffect`则需要先调度，在`Layout`阶段完成后再异步执行。

这就是`useLayoutEffect`与`useEffect`的区别。

- 对于 HostRoot，即 rootFiber，如果赋值了第三个参数回调函数，也会在此时调用。

  ```js
  ReactDOM.render(<App />, document.querySelector('#root'), function () {
    console.log('i am mount~');
  });
  ```

##### commitAttachRef

commitLayoutEffects 会做的第二件事是 commitAttachRef。

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;

    // 获取DOM实例
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    if (typeof ref === 'function') {
      // 如果ref是函数形式，调用回调函数
      ref(instanceToUse);
    } else {
      // 如果ref是ref实例形式，赋值ref.current
      ref.current = instanceToUse;
    }
  }
}
```

代码逻辑很简单：获取 DOM 实例，更新 ref。

##### current Fiber 树切换

至此，整个 layout 阶段就结束了。
