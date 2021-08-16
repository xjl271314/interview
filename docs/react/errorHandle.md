---
title: 异常处理
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# React 异常处理

- 2021.08.11

过去，组件内的 `JavaScript` 错误会导致 `React` 的内部状态被破坏，并且在下一次渲染时产生可能无法追踪的错误。这些错误基本上是由较早的其他代码（非 React 组件代码）错误引起的，但 `React` 并没有提供一种在组件中优雅处理这些错误的方式，也无法从错误中恢复。

因此在 `React16` 之后引入了一个新的生命周期函数`componentDidCatch`，

## 错误边界(Error Boundaries)

错误边界是一种 `React` 组件，这种组件可以捕获发生在其子组件树任何位置的 `JavaScript` 错误，并打印这些错误，同时展示降级 UI，而并不会渲染那些发生崩溃的子组件树。错误边界在`渲染期间(render)`、`生命周期方法`和`整个组件树的构造函数中(constructor)`捕获错误。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '错误边界无法捕获以下场景中产生的错误：\n - 事件处理\n - 异步代码（例如 setTimeout 或 requestAnimationFrame 回调函数）\n - 服务端渲染\n - 它自身抛出来的错误（并非它的子组件）';

export default () => <Info type="warning" txt={txt} />;
```

如果一个 `class` 组件中定义了 `static getDerivedStateFromError()` 或 `componentDidCatch()` 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。

官方推荐我们，当抛出错误后，请使用 `static getDerivedStateFromError()`渲染备用 UI ，使用 `componentDidCatch()` 打印错误信息。

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

然后我们可以将它作为一个常规组件去使用：

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

错误边界的工作方式类似于 `JavaScript` 的 `catch {}`，不同的地方在于错误边界只针对 `React 组件`。只有 `class` 组件才可以成为错误边界组件。大多数情况下, 你只需要声明一次错误边界组件, 并在整个应用中使用它。

## 源码分析

### reconciliation 阶段

函数调用流程如下：

![reconciliation](https://user-images.githubusercontent.com/11912260/44942441-79f3c380-ade3-11e8-859a-83a8847ecb19.png)

这个阶段核心的部分是上图中标出的第三部分，React 组件部分的生命周期函数的调用以及通过 `Diff` 算法计算出所有更新工作都在第三部分进行的，所以异常处理也是在这部分进行的。

### commit 阶段

函数调用流程如下：

![commit阶段](https://user-images.githubusercontent.com/11912260/44942460-e969b300-ade3-11e8-8a4f-1f47d4dac8da.png)

这个阶段主要做的工作拿到 `reconciliation` 阶段产出的所有更新工作，提交这些工作并调用渲染模块`（react-dom）`渲染 UI。完成 UI 渲染之后，会调用剩余的生命周期函数，所以异常处理也会在这部分进行。

**React 异常处理在源码中的入口主要有两处：**

1、`reconciliation` 阶段的 `renderRoot` 函数，对应异常处理方法是 `throwException`

2、`commit` 阶段的 `commitRoot` 函数，对应异常处理方法是 `dispatch`

### throwException

首先看看 `renderRoot` 函数源码中与异常处理相关的部分：

```js
function renderRoot(
  root: FiberRoot,
  isYieldy: boolean,
  isExpired: boolean,
): void {
  ...
  do {
    try {
      workLoop(isYieldy);
    } catch (thrownValue) {
      if (nextUnitOfWork === null) {
        // This is a fatal error.
        didFatal = true;
        onUncaughtError(thrownValue);
      } else {
        ...
        const sourceFiber: Fiber = nextUnitOfWork;
        let returnFiber = sourceFiber.return;
        if (returnFiber === null) {
          // This is the root. The root could capture its own errors. However,
          // we don't know if it errors before or after we pushed the host
          // context. This information is needed to avoid a stack mismatch.
          // Because we're not sure, treat this as a fatal error. We could track
          // which phase it fails in, but doesn't seem worth it. At least
          // for now.
          didFatal = true;
          onUncaughtError(thrownValue);
        } else {
          throwException(
            root,
            returnFiber,
            sourceFiber,
            thrownValue,
            nextRenderExpirationTime,
          );
          nextUnitOfWork = completeUnitOfWork(sourceFiber);
          continue;
        }
      }
    }
    break;
  } while (true);
  ...
}
```

可以看到，这部分就是在 `workLoop` 大循环外套了层 `try...catch...`，在 `catch` 中判断当前错误类型，调用不同的异常处理方法。

有两种异常处理方法：

1、`RootError`，最后是调用 `onUncaughtError` 函数处理

2、`ClassError`，最后是调用 `componentDidCatch` 生命周期函数处理

上面两种方法处理流程基本类似，这里就重点分析 `ClassError` 方法

```js
function throwException(
  root: FiberRoot,
  returnFiber: Fiber,
  sourceFiber: Fiber,
  value: mixed,
  renderExpirationTime: ExpirationTime,
) {
  ...
  // We didn't find a boundary that could handle this type of exception. Start
  // over and traverse parent path again, this time treating the exception
  // as an error.
  renderDidError();
  value = createCapturedValue(value, sourceFiber);
  let workInProgress = returnFiber;
  do {
    switch (workInProgress.tag) {
      case HostRoot: {
        const errorInfo = value;
        workInProgress.effectTag |= ShouldCapture;
        workInProgress.expirationTime = renderExpirationTime;
        const update = createRootErrorUpdate(
          workInProgress,
          errorInfo,
          renderExpirationTime,
        );
        enqueueCapturedUpdate(workInProgress, update);
        return;
      }
      case ClassComponent:
      case ClassComponentLazy:
        // Capture and retry
        const errorInfo = value;
        const ctor = workInProgress.type;
        const instance = workInProgress.stateNode;
        if (
          (workInProgress.effectTag & DidCapture) === NoEffect &&
          ((typeof ctor.getDerivedStateFromCatch === 'function' &&
            enableGetDerivedStateFromCatch) ||
            (instance !== null &&
              typeof instance.componentDidCatch === 'function' &&
              !isAlreadyFailedLegacyErrorBoundary(instance)))
        ) {
          workInProgress.effectTag |= ShouldCapture;
          workInProgress.expirationTime = renderExpirationTime;
          // Schedule the error boundary to re-render using updated state
          const update = createClassErrorUpdate(
            workInProgress,
            errorInfo,
            renderExpirationTime,
          );
          enqueueCapturedUpdate(workInProgress, update);
          return;
        }
        break;
      default:
        break;
    }
    workInProgress = workInProgress.return;
  } while (workInProgress !== null);
}
```

`throwException` 函数分为两部分：

1、遍历当前异常节点的所有父节点，找到对应的错误信息（错误名称、调用栈等），这部分代码在上面中没有展示出来。

2、第二部分就是上面展示出来的部分，可以看到，也是遍历当前异常节点的所有父节点，判断各节点的类型，主要还是上面提到的两种类型。

这里重点讲 `ClassComponent` 类型，判断该节点是否是`异常边界组件`（通过判断是否存在 `componentDidCatch` 生命周期函数等），如果是找到异常边界组件，则调用 `createClassErrorUpdate` 函数新建 `update`，并将此 `update` 放入此节点的`异常更新队列`中，在后续更新中，会更新此队列中的更新工作。

```js
function createClassErrorUpdate(
  fiber: Fiber,
  errorInfo: CapturedValue<mixed>,
  expirationTime: ExpirationTime,
): Update<mixed> {
  const update = createUpdate(expirationTime);
  update.tag = CaptureUpdate;
  ...
  const inst = fiber.stateNode;
  if (inst !== null && typeof inst.componentDidCatch === 'function') {
    update.callback = function callback() {
      if (
        !enableGetDerivedStateFromCatch ||
        getDerivedStateFromCatch !== 'function'
      ) {
        // To preserve the preexisting retry behavior of error boundaries,
        // we keep track of which ones already failed during this batch.
        // This gets reset before we yield back to the browser.
        // TODO: Warn in strict mode if getDerivedStateFromCatch is
        // not defined.
        markLegacyErrorBoundaryAsFailed(this);
      }
      const error = errorInfo.value;
      const stack = errorInfo.stack;
      logError(fiber, errorInfo);
      this.componentDidCatch(error, {
        componentStack: stack !== null ? stack : '',
      });
    };
  }
  return update;
}
```

可以看到，此函数返回一个 `update`，此 `update` 的 `callback` 最终会调用组件的 `componentDidCatch` 生命周期函数。

`update` 的 `callback` 最终会在 `commit` 阶段的 `commitAllLifeCycles` 函数中被调用。

以上就是 `reconciliation` 阶段 的异常捕获到异常处理的流程，可以知道此阶段是在 `workLoop` 大循环外套了层 `try...catch...`，所以 `workLoop` 里所有的异常都能被异常边界组件捕获并处理。

### dispatch

```js
function dispatch(
  sourceFiber: Fiber,
  value: mixed,
  expirationTime: ExpirationTime,
) {
  let fiber = sourceFiber.return;
  while (fiber !== null) {
    switch (fiber.tag) {
      case ClassComponent:
      case ClassComponentLazy:
        const ctor = fiber.type;
        const instance = fiber.stateNode;
        if (
          typeof ctor.getDerivedStateFromCatch === 'function' ||
          (typeof instance.componentDidCatch === 'function' &&
            !isAlreadyFailedLegacyErrorBoundary(instance))
        ) {
          const errorInfo = createCapturedValue(value, sourceFiber);
          const update = createClassErrorUpdate(
            fiber,
            errorInfo,
            expirationTime,
          );
          enqueueUpdate(fiber, update);
          scheduleWork(fiber, expirationTime);
          return;
        }
        break;
      case HostRoot: {
        const errorInfo = createCapturedValue(value, sourceFiber);
        const update = createRootErrorUpdate(fiber, errorInfo, expirationTime);
        enqueueUpdate(fiber, update);
        scheduleWork(fiber, expirationTime);
        return;
      }
    }
    fiber = fiber.return;
  }

  if (sourceFiber.tag === HostRoot) {
    // Error was thrown at the root. There is no parent, so the root
    // itself should capture it.
    const rootFiber = sourceFiber;
    const errorInfo = createCapturedValue(value, rootFiber);
    const update = createRootErrorUpdate(rootFiber, errorInfo, expirationTime);
    enqueueUpdate(rootFiber, update);
    scheduleWork(rootFiber, expirationTime);
  }
}
```

`dispatch` 函数做的事情和上部分的 `throwException` 类似，遍历当前异常节点的所有父节点，找到异常边界组件（有 `componentDidCatch` 生命周期函数的组件），新建 `update`，在 `update.callback` 中调用组件的 `componentDidCatch` 生命周期函数。

后续的部分和 `reconciliation` 阶段 基本一致，这里我们看看 `commit` 阶段都哪些部分调用了 `dispatch` 函数:

```js
function captureCommitPhaseError(fiber: Fiber, error: mixed) {
  return dispatch(fiber, error, Sync);
}
```

调用 `captureCommitPhaseError` 即调用 `dispatch`，而 `captureCommitPhaseError` 主要是在 `commitRoot` 函数中被调用，源码如下：

```js
function commitRoot(root: FiberRoot, finishedWork: Fiber): void {
  ...
  // commit阶段的准备工作
  prepareForCommit(root.containerInfo);

  // Invoke instances of getSnapshotBeforeUpdate before mutation.
  nextEffect = firstEffect;
  startCommitSnapshotEffectsTimer();
  while (nextEffect !== null) {
    let didError = false;
    let error;
    try {
        // 调用 getSnapshotBeforeUpdate 生命周期函数
        commitBeforeMutationLifecycles();
    } catch (e) {
        didError = true;
        error = e;
    }
    if (didError) {
      captureCommitPhaseError(nextEffect, error);
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect;
      }
    }
  }
  stopCommitSnapshotEffectsTimer();

  // Commit all the side-effects within a tree. We'll do this in two passes.
  // The first pass performs all the host insertions, updates, deletions and
  // ref unmounts.
  nextEffect = firstEffect;
  startCommitHostEffectsTimer();
  while (nextEffect !== null) {
    let didError = false;
    let error;
    try {
        // 提交所有更新并调用渲染模块渲染UI
        commitAllHostEffects(root);
    } catch (e) {
        didError = true;
        error = e;
    }
    if (didError) {
      captureCommitPhaseError(nextEffect, error);
      // Clean-up
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect;
      }
    }
  }
  stopCommitHostEffectsTimer();

  // The work-in-progress tree is now the current tree. This must come after
  // the first pass of the commit phase, so that the previous tree is still
  // current during componentWillUnmount, but before the second pass, so that
  // the finished work is current during componentDidMount/Update.
  root.current = finishedWork;

  // In the second pass we'll perform all life-cycles and ref callbacks.
  // Life-cycles happen as a separate pass so that all placements, updates,
  // and deletions in the entire tree have already been invoked.
  // This pass also triggers any renderer-specific initial effects.
  nextEffect = firstEffect;
  startCommitLifeCyclesTimer();
  while (nextEffect !== null) {
    let didError = false;
    let error;
    try {
        // 调用剩余生命周期函数
        commitAllLifeCycles(root, committedExpirationTime);
    } catch (e) {
        didError = true;
        error = e;
    }
    if (didError) {
      captureCommitPhaseError(nextEffect, error);
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect;
      }
    }
  }
  ...
}
```

可以看到，有三处（也是 commit 阶段主要的三部分）通过 `try...catch...`调用了 `captureCommitPhaseError` 函数，即调用了 `dispatch` 函数。

刚刚我们提到，`update` 的 `callback` 会在 `commit` 阶段的 `commitAllLifeCycles` 函数中被调用，我们来看下具体的调用流程：

1、`commitAllLifeCycles` 函数中会调用 `commitLifeCycles` 函数

2、在 `commitLifeCycles` 函数中，对于 `ClassComponent` 和 `HostRoot` 会调用 `commitUpdateQueue` 函数

3、我们来看看 `commitUpdateQueue` 函数源码：

```js
export function commitUpdateQueue<State>(
  finishedWork: Fiber,
  finishedQueue: UpdateQueue<State>,
  instance: any,
  renderExpirationTime: ExpirationTime,
): void {
  ...
  // Commit the effects
  commitUpdateEffects(finishedQueue.firstEffect, instance);
  finishedQueue.firstEffect = finishedQueue.lastEffect = null;

  commitUpdateEffects(finishedQueue.firstCapturedEffect, instance);
  finishedQueue.firstCapturedEffect = finishedQueue.lastCapturedEffect = null;
}

function commitUpdateEffects<State>(
  effect: Update<State> | null,
  instance: any,
): void {
  while (effect !== null) {
    const callback = effect.callback;
    if (callback !== null) {
      effect.callback = null;
      callCallback(callback, instance);
    }
    effect = effect.nextEffect;
  }
}
```

我们可以看到，`commitUpdateQueue` 函数中会调用两次 `commitUpdateEffects` 函数，参数分别是正常 `update` 队列以及存放异常处理 `update` 队列。

而 `commitUpdateEffects` 函数就是遍历所有 `update`，调用其 `callback` 方法。

上文提到，`commitAllLifeCycles`函数中是用于调用剩余生命周期函数，所以异常边界组件的 `componentDidCatch`生命周期函数也是在这个阶段调用。

## 总结

我们现在可以知道，`React` 内部其实也是通过 `try...catch...` 形式是捕获各阶段的异常，但是只在两个阶段的特定几处进行了异常捕获，这也是为什么异常边界只能捕获到子组件在`构造函数`、`render 函数`以及所有生命周期函数中抛出的异常。

细心的小伙伴应该注意到，`throwException` 和 `dispatch` 在遍历节点时，是从异常节点的父节点开始遍历，这也是为什么异常边界组件自身的异常不会捕获并处理。

我们也提到了 `React` 内部将异常分为了两种异常处理方法：`RootError`、`ClassError`，我们只重点分析了 `ClassError` 类型的异常处理函数。

其实 `RootError` 是一样的，区别在于最后调用的处理方法不同，在遍历所有父节点过程中，如果有异常边界组件，则会调用 `ClassError` 类型的异常处理函数，如果没有，一直遍历到根节点，则会调用 `RootError` 类型的异常处理函数。

最后调用的 `onUncaughtError` 方法，此方法做的事情很简单，其实就是将 `hasUnhandledError` 变量赋值为 `true`，将 `unhandledError` 变量赋值为异常对象，此异常对象最终将在 `finishRendering` 函数中被抛出，而 `finishRendering` 函数是在 `performWork` 函数的最后被调用。
