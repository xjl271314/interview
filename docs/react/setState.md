---
title: setState
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# React 中 setState 是同步还是异步的?

- 2021.06.03

> 首先 React 中的 setState 是异步的。

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: fasle,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ clicked: true });
  }
  render() {
    if (this.state.clicked) {
      return <h1>Thanks</h1>;
    }
    return <button onClick={this.handleClick}>Click me!</button>;
  }
}
```

首先，当我们点击了按钮之后,React 会使用下一次的状态 `{ clicked: true }` 更新组件，然后更新 `DOM` 匹配返回的 `<h1>Thanks</h1>`元素。

**看起来很直白，但是，是 `React` 做的这些操作还是 `React DOM`？**

更新 `DOM` 听起来像 `React DOM` 负责的。但是我们调用的 `this.setState()` 不是来自 `React DOM`。并且 `React.Component` 这个基类是定义在 `React` 本身的。

所以 在 `React.Component` 中的 `setState` 是怎么更新 `DOM` 的呢？

**我们可能会猜测 `React.Component` 中包含更新 `DOM` 的逻辑。**

但如果真是这样的话，`this.setState()` 是怎么在其它环境中运行的呢？例如，在 `React Native` 中组件同样也继承了 `React.Component`。`RN` 里面也会调用 `this.setState()`，但是 `RN` 运行在 `Android` 和 `iOS` 原生视图中，而不是 `DOM` 中。

#### 因此 `React.Component` 肯定是以`某种方式委托处理状态`更新到特定平台的代码。

实际上，从 `react 0.14` 以后，`react` 有意只暴露定义组件的接口，`React` 的大多数实现都依托于 `renderers`.

`renderer` 则暴露出平台相关的接口，比如 `ReactDOM.render()` 可以使你将 `React` 层级渲染到 `DOM` 节点中。每个 `renderer` 都提供了类似的接口。理想情况下，大多数组件不应该从 `renderer` 中引入认定和东西，这样可以使组件变得 `protable`(即像移动硬盘一样，即插即用)。

#### 核心意思是，`react` 包只让你使用 `react` 功能，而对于怎么实现 `react` 包是不管的。`renderer` 包（比如 `react-dom`，`react-native` 等）提供了 `React Features` 的实现 和平台指定的逻辑。某些代码是共享的（`reconciler`），但这是各个渲染器的实现细节。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '因此在 `React.Component` 中的 `setState()`是如何和正确的渲染器之间沟通的答案就是:\n\n每个渲染器在创建的`class`中设置了一个特别的字段， 这个字段就叫 `updater`。这不是你要设置的，而是`React DOM`， `React Native`等在创建你类的实例时需要做的。';

export default () => <Info type="info" txt={txt} />;
```

```js
// 在 React DOM 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMUpdater; // 设置 updater

// 在 React DOM Server 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMServerUpdater; // 设置 updater

// 在 React Native 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactNativeUpdater; // 设置 updater
```

`React` 内部的 `setState`:

```js
Component.prototype.setState = function (partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  // 使用 'updater'  属性 talk back to 渲染器
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

#### 这就是为什么 `this.setState()`定义在 `React` 包中也能更新 `DOM` 的原因，它读取 `React DOM `设置的 `this.updater` ，然后让 `React DOM` 计划和处理更新。

## Hooks 中的 useState 又是怎么实现的呢？

基类中 `setState()` 的实现一直是一个假象，它除了将`调用转发给当前的渲染器`以外，其实什么也没有做。 `useState` 也 做了一模一样的事情。

不同于使用 `updater` 对象， `useState` 使用 `dispatcher` 对象。当你调用 `React.useState()` | `React.useEffect()` 或者其它内置的钩子时，这些调用都被转发给当前的 `dispatcher` 了。

```js
// 在React 中 (简化版)
const React = {
  // 真实属性被隐藏的更深一些，是否你可以找到它
  __currentDispatcher: null,

  useState(initialState) {
    return React.__currentDispatcher.useState(initialState);
  },

  useEffect(initialState) {
    return React.__currentDispather.useEffect(initialState);
  },
  // ...
};
```

在渲染你的组件前，每个渲染器都会设置这个 `dispatcher`：

```js
// 在 React DOM中
const prevDispatcher = React.__currentDispatcher;
React.__currentDispatcher = ReactDOMDispatcher; // 设置dispatcher
let result;
try {
  result = YourComponent();
} finally {
  // Restore it back 还原
  React.__currentDispatcher = prevDispatcher;
}
```

这也意味着，Hooks 本身并不依赖于 React。如果将来有更多的库想要复用相同的原始 Hooks，理论上，dispatcher 程序可以移植到一个单独的包中，并且作为第一级 API 以一个不太恐怖的名字暴露出去。

## 为什么有时连续两次 setState 只有一次生效？

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '1.直接传递对象的`setstate`会被合并成一次.\n2.使用函数传递`state`不会被合并.';

export default () => <Info type="info" txt={txt} />;
```

```js
componentDidMount() {
    this.setState({ index: this.state.index + 1 }, () => {
      console.log(this.state.index);
    })
    this.setState({ index: this.state.index + 1 }, () => {
      console.log(this.state.index);
    })
}
// 1 1

componentDidMount() {
    this.setState((preState) => ({ index: preState.index + 1 }), () => {
      console.log(this.state.index);
    })
    this.setState(preState => ({ index: preState.index + 1 }), () => {
      console.log(this.state.index);
    })
}
// 2 2
```

## componentDidMount 调用 setstate 会发生什么?

这里是官方文档的描述:

> 在 `componentDidMount()`中，你 可以立即调用 `setState()`。它将会触发一次额外的渲染，但是它将在浏览器`刷新屏幕之前`发生。这保证了在此情况下即使 `render()`将会调用两次，用户也不会看到中间状态。谨慎使用这一模式，因为它常导致性能问题。在大多数情况下，你可以在 `constructor()`中使用赋值初始状态来代替。然而，有些情况下必须这样，比如像模态框和工具提示框。这时，你需要先测量这些 `DOM` 节点，才能渲染依赖尺寸或者位置的某些东西。

- 我们不推荐直接在 `componentDidMount` 直接调用 `setState`，由上面的分析：`componentDidMount` 本身处于一次更新中，我们又调用了一次 `setState`，就会在未来再进行一次 `render`，造成不必要的性能浪费，大多数情况可以设置初始值来搞定。

- 当然在 `componentDidMount` 我们可以调用`接口`，在接口的回调中去修改 `state`，这是正确的做法。

- 当 `state` 初始值依赖 `dom` 属性时，在 `componentDidMount` 中 `setState` 是无法避免的。

## 结合生命周期,哪些生命周期里面可以去 setState?

| 生命周期                            | 是否可以`setState` | 描述                                                                                                                                                                |
| :---------------------------------- | :----------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `constructor()`                     |         ❌         | 构造函数中请使用 `this.state = {...}`进行初始化赋值。                                                                                                               |
| `static getDerivedStateFromProps()` |         ❌         | 静态方法没有`this`对象,此处需要按照语法返回新的`state对象`。                                                                                                        |
| `render()`                          |         ❌         | `render()`中禁止使用`this.setState`否则会引起循环,内存溢出。                                                                                                        |
| `componentDidMount()`               |         ✅         | 此生命周期中不推荐直接调用`this.setState`这会造成重复`render`,但是当需要获取 `DOM` 信息后再去更改`state`的属性时又不得不放在这里执行。                              |
| `shouldComponentUpdate()`           |         ❌         | 此生命周期只做返回是否更新的判断。                                                                                                                                  |
| `getSnapshotBeforeUpdate()`         |         ❌         | 此生命周期只在`componentDidUpdate()`前进行数据修改。                                                                                                                |
| `componentDidUpdate()`              |         ✅         | 此生命周期中可以正常使用,但需要注意添加更新条件,不然会导致死循环。                                                                                                  |
| `componentWillUnmount()`            |         ❌         | 此生命周期不应调用`setState()`，因为该组件将永远不会重新渲染，组件实例卸载后，将永远不会再挂载它。 <br/><br/>如果在该生命周期进行调用,经常会导致内存溢出的警告 ⚠️。 |
| `componentDidCatch()`               |         ✅         | 此生命周期可以在捕获到错误后进行`state`存储。                                                                                                                       |
| `static getDerivedStateFromError()` |         ❌         | 此生命周期在收到错误后执行,也需要返回新的`state`对象。                                                                                                              |
