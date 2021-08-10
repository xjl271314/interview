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

网上有很多文章称 `setState` 是『异步操作』，所以导致 `setState` 之后并不能获取到最新值，其实这个观点是错误的。

`setState` 是一次`同步操作`，只是每次操作之后并没有立即执行，而是将 `setState` 进行了`缓存`，`mount` 流程结束或事件操作结束，才会拿出所有的 `state` 进行一次计算。如果 `setState` 脱离了 `React` 的生命周期或者 `React` 提供的事件流，`setState` 之后就能立即拿到结果。

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
