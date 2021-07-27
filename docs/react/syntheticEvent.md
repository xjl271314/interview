---
title: 合成事件(syntheticEvent)
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# React 中的合成事件?

- 2021.07.26

在 `React` 的内部基于`事件冒泡`的机制实现了一套独有的合成事件机制，它是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 `preventDefault()`。

在 `React17` 之前事件的注册是在`document`对象上的，但是在 17 中将事件注册在了 `document` 上，这个做法的目的是为了`渐进升级`，避免多版本的 `React` 共存的场景中事件系统发生冲突。这个 `div` 节点最终要对应一个 `fiber` 节点，`onClick` 则作为它的 `prop`。

## 为何需要合成事件

- 一方面是出于`性能`和`复用性`来考虑。

`React` 作为一套 `View` 层面的 `UI` 框架，通过渲染得到 `vDOM`，再由 `fiber` 算法决定 `DOM` 树哪些结点需要新增、替换或修改，假如直接在 `DOM` 节点插入原生事件监听，则会导致频繁的调用 `addEventListener` 和 `removeEventListener`，造成性能的浪费。

所以 `React` 采用了`事件代理`的方法，对于大部分事件而言都在 `document`(17 之前) 上做监听，然后根据 `Event` 中的 `target` 来判断事件触发的节点。 通过`队列`的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 `callback`。

其次 `React` 合成的 `SyntheticEvent` 采用了`池`的思想，从而达到节约内存，避免频繁的创建和销毁事件对象的目的。这也是如果我们需要异步使用一个 `syntheticEvent`，需要执行 `event.persist()`才能防止事件对象被释放的原因。

最后在 `React` 源码中随处可见 `batch` 做批量更新，基本上凡是可以批量处理的事情（最普遍的 `setState`）`React` 都会将中间过程保存起来，留到最后面才 `flush` 掉。就如浏览器对 `DOM`树进行 `Style`，`Layout`，`Paint` 一样，都不会在操作 `ele.style.color='red';`之后马上执行，只会将这些操作打包起来并最终在需要渲染的时候再做渲染。

而对于复用来说，`React` 看到在不同的浏览器和平台上，用户界面上的事件其实非常相似，例如普通的 `click`，`change` 等等。`React` 希望通过封装一层事件系统，将不同平台的原生事件都封装成 `SyntheticEvent`。这样做的好处主要有以下两点:

1. 使得不同平台只需要通过加入 `EventEmitter` 以及对应的 `Renderer` 就能使用相同的一个事件系统，`WEB` 平台上加入 `ReactBrowserEventEmitter`，`Native` 上加入 `ReactNativeEventEmitter`。如下图，对于不同平台，`React(16)` 只需要替换掉左边部分，而右边 `EventPluginHub` 部分可以保持复用。![EventEmitter](https://img-blog.csdnimg.cn/20200218115403227.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

2. 而对于不同的浏览器而言，`React` 帮我们统一了事件，做了浏览器的兼容，例如对于 `transitionEnd`,`webkitTransitionEnd`,`MozTransitionEnd` 和 `onTransitionEnd`, `React` 都会集合成 `topAnimationEnd`，所以我们只用处理这一个标准的事件即可。

- 另一方面，由于 `fiber` 机制的特点，生成一个 `fiber` 节点时，它对应的 `dom` 节点有可能还未挂载，`onClick` 这样的事件处理函数作为 `fiber` 节点的 `prop`，也就不能直接被绑定到真实的 `DOM` 节点上。

为此，`React` 提供了一种**顶层注册，事件收集，统一触发**的事件机制。

### 顶层注册

所谓`顶层注册`，其实是在 `root` 元素上绑定一个统一的事件处理函数。表现在 `React` 中就是在我们那个`<div id="root" />`这个元素上进行注册。

### 事件收集

指的是事件触发时（实际上是 root 上的事件处理函数被执行），构造合成事件对象，按照冒泡或捕获的路径去组件中收集真正的事件处理函数。

### 统一触发

发生在收集过程之后，对所收集的事件逐一执行，并共享同一个合成事件对象。

在 `React17` 之后还带来了两个非常重要的特性：

1. 对事件进行归类，可以在事件产生的任务上包含不同的优先级

2. 提供合成事件对象，抹平浏览器的兼容性差异

## 为何需要绑定 this

我们都知道在 `React` 中如果不使用`箭头函数`,我们给每个事件都需要手动的绑定一个 `this`，先来一个例子:

```js
import React from 'react';
import ReactDOM from 'react-dom';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); //绑定this
  }

  handleClick() {
    console.log(this);
  }

  render() {
    const { count } = this.state;
    return <button onClick={this.handleClick}>点我测试</button>;
  }
}

ReactDOM.render(<TestPage />, document.getElementById('root'));
```

上述代码编译后的结果大致是这样:

```js
render() {
    return React.createElement(
      'button',
      { onClick: this.handleClick },
      'Hello'
    );
}
```

在 `ES6 class` 内定义方法时，如果不是`箭头函数`，方法是挂载在 `prototype` 原型对象上的。当我们没有去绑定 `this` 的时候,这时候的 `this` 默认指向的是 `window`,因此访问的时候就是 `undefined` 了。

## 事件系统(<V17)

早期的事件系统，源码部分在`ReactBrowserEventEmitter.js`中，合成系统框架图大致如下所示:

```js
/**
 * React和事件系统概述:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 */
```

- `Top-level delegation` 用于捕获最原始的浏览器事件，它主要由 `ReactEventListener` 负责，`ReactEventListener` 被注入后可以支持插件化的事件源，这一过程发生在`主线程`。

- `React` 对事件进行规范化和重复数据删除，以解决浏览器的怪癖。这可以在工作线程中完成。

- 将这些本地事件（具有关联的顶级类型用来捕获它）转发到 `EventPluginHub`，后者将询问`插件`是否要提取任何合成事件。

- 然后，`EventPluginHub` 将通过为每个事件添加`dispatches`（关心该事件的侦听器和 ID 的序列）来对其进行注释来进行处理。

- 再接着，`EventPluginHub` 会调度分派事件.

### 支持的事件

`React` 通过将事件 `normalize` 以让他们在不同浏览器中拥有一致的属性。

`React` 中的 `click` 事件被命名为 `onClick` 类似的其他事件都以 `on` 开头，事件默认都是在冒泡阶段被触发的。

如需注册捕获阶段的事件处理函数，则应为事件名添加 `Capture`。例如，处理捕获阶段的点击事件请使用 `onClickCapture`，而不是 `onClick`。

## 事件注册(<V17)

在 `React` 中当我们为一个元素绑定事件时，会这样写：

```js
<div
  onClick={() => {
    /*do something*/
  }}
>
  React
</div>
```

`React` 对于大部分事件的绑定都是使用 `trapBubbledEvent` 和 `trapCapturedEvent` 这两个函数来注册的。

![事件注册](https://img-blog.csdnimg.cn/20200218115802914.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

如上图所示，当我们执行了 `render` 或者 `setState` 之后，`React` 的 `Fiber` 调度系统会在最后 `commit` 到 `DOM` 树之前执行 `trapBubbledEvent` 或 `trapCapturedEvent`，通过执行 `addEventListener` 在 `document` 节点上绑定对应的 `dispatch` 作为 `handler` 负责监听类型为 `topLevelType` 的事件。

### dispatchInteractiveEvent 和 dispatchEvent 的区别

`React16` 开始换掉了原本 `Stack Reconciliation` 成了 `Fiber`的架构，希望实现异步渲染。

所以`异步渲染`的情况下假如入我点了两次按钮，那么第二次按钮响应的时候，可能第一次按钮的 `handlerA` 中调用的 `setState` 还未最终被 `commit` 到 `DOM` 树上，这时需要把第一次按钮的结果先给 `flush` 掉并 `commit` 到 `DOM` 树，才能够保持一致性。

这个时候就会用到 `dispatchInteractiveEvent`。

可以理解成 `dispatchInteractiveEvent` 在执行前都会确保之前所有操作都已最终 `commit` 到 `DOM` 树，再开始自己的流程，并最终触发 `dispatchEvent`。

**至此我们已经在 `document` 节点上监听了事件，但是还需要将我们在 `jsx` 中写的 `handler` 存起来对应到相应的节点上。**

在我们每次新建或者更新节点时，`React` 最终会调用 `createInstance` 或者 `commitUpdate` 这两个函数，而这两个函数都会最终调用 `updateFiberProps` 这个函数，将 `props` 也就是我们的 `onClick`，`onChange` 等 `handler` 给挂载到 `DOM` 节点上。

至此，我们我们已经在 `document` 上监听了事件，并且将 `handler` 存在对应 `DOM` 节点。接下来需要看 `React` 怎么监听并处理浏览器的原生事件，最终触发对应的 `handler` 了。

## 事件触发(<V17)

当我们点击一个按钮时，`click` 事件将会最终冒泡至 `document`，并触发我们监听在 `document` 上的 `handler dispatchEvent`，接着触发 `batchedUpdates`。`batchedUpdates` 这个格式的代码在 `React` 的源码里面会频繁的出现，基本上 `React` 将所有能够批量处理的事情都会先收集起来，再一次性处理。

![事件触发1](https://img-blog.csdnimg.cn/2020021812205956.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

默认的 `isBatching` 是 `false` 的，当调用了一次 `batchedUpdates`，`isBatching` 的值将会变成 `true`。

此时如果在接下来的调用中有继续调用 `batchedUpdates` 的话，就会直接执行 `handleTopLevel`，此时的 `setState` 等不会被更新到 `DOM` 上。直到调用栈重新回到第一次调用 `batchedUpdates` 的时候，才会将所有结果一起 `flush` 掉（更新到 DOM 上）。

![事件触发2](https://img-blog.csdnimg.cn/20200218122855794.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

调用栈中的 `BatchedUpdates$1` 是什么？或者浏览器的 `renderer` 和 `Native` 的 `renderer` 是如何挂在到 `React` 的事件系统上的?

其实 `React` 事件系统里面提供了一个函数 `setBatchingImplementation`，用来动态挂载不同平台的 `renderer`，这个也体现了 `React` 事件系统的复用。

![事件触发3](https://img-blog.csdnimg.cn/20200218125958283.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`handleTopLevel` 会调用 `runExtractedEventsInBatch()`，这是 `React` 事件处理最重要的函数。在 `EventEmitter` 里面做的事，其实主要就是这个函数的两步。

1. 第一步是根据原生事件合成合成事件，并且在 `vDOM` 上模拟捕获冒泡，收集所有需要执行的事件回调构成回调数组。

2. 第二步是遍历回调数组，触发回调函数。

![handleTopLevel](https://img-blog.csdnimg.cn/20200218130213836.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

首先调用 `extractEvents`，传入原生事件 `e`，`React` 事件系统根据可能的事件插件合成合成事件 `SyntheticeEvent`。 这里我们可以看到调用了 `EventConstructor.getPooled()`，从`事件池`中去取一个合成事件对象，如果事件池为空，则新创建一个合成事件对象，这体现了 `React` 为了性能实现了池的思想。

![handleTopLevel2](https://img-blog.csdnimg.cn/20200218130347328.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

然后传入 `Propagator`，在 `vDOM` 上模拟捕获和冒泡，并收集所有需要执行的事件回调和对应的结点。`traverseTwoPhase` 模拟了捕获和冒泡的两个阶段，这里实现很巧妙，简单而言就是正向和反向遍历了一下数组。接着对每一个结点，调用 `listenerAtPhase` 取出事件绑定时挂载在结点上的回调函数，把它加入回调数组中。

![handleTopLevel3](https://img-blog.csdnimg.cn/20200218130557346.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

接着遍历所有合成事件。这里可以看到当一个事件处理完的时候，`React` 会调用 `event.isPersistent()`来查看这个合成事件是否需要被持久化，如果不需要就会释放这个合成事件，这也就是为什么当我们需要异步读取操作一个合成事件的时候，需要执行 `event.persist()`，不然 `React` 就是在这里释放掉这个事件。

![handleTopLevel4](https://img-blog.csdnimg.cn/20200218130734844.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

最后这里就是回调函数被真正触发的时候了，取出回调数组 `event._dispatchListeners`，遍历触发回调函数。并通过 `event.isPropagationStopped()`这一步来模拟停止冒泡。这里我们可以看到，`React` 在收集回调数组的时候并不会去管我们是否调用了 `stopPropagation`，而是会在触发的阶段才会去检查是否需要停止冒泡。

至此，一个事件回调函数就被触发了，里面如果执行了 `setState` 等就会等到调用栈弹回到最低部的 `interactiveUpdate` 中的被最终 `flush` 掉，构造 `vDOM`，合好，并最终被 `commit` 到 `DOM` 上。

我们找个例子测试一下:

```js
class App extends React.Component {
  innerClick = e => {
    console.log("A: react inner click.");
    // e.stopPropagation();
  };

  outerClick = () => {
    console.log("B: react outer click.");
  };

  componentDidMount() {
    document.getElementById("outer").addEventListener("click", () => console.log("C: native outer click"));

    window.addEventListener("click", () =>
      console.log("D: native window click")
    );
  }

  render() {
    return (
      <div id="outer" onClick={this.outerClick}>
        <button id="inner" onClick={this.innerClick}>
          BUTTON
        </button>
      </div>
    );
  }
}
/**
 * C: native outer click
 * A: react inner click.
 * B: react outer click.
 * D: native window click
 *
 *
 * 加上stopPropagation
 *
 * C: native outer click
 * A: react inner click.
 *
 * /
```

- 不加 stopPropagation

因为 `React` 事件监听是挂载在 `document` 上的，所以原生系统在`#outer` 上监听的回调 `C` 会最先被输出；

接着原生事件冒泡至 `document` 进入 `React` 事件系统，`React` 事件系统模拟捕获冒泡输出 `A` 和 `B`；

最后 `React` 事件系统执行完毕回到浏览器继续冒泡到 `window`，输出 `D`。

- 加上 stopPropagation

原生系统在`#outer` 上监听的回调 `C` 会最先被执行；

接着原生事件冒泡至 `document` 进入 `React` 事件系统，输出 `A`，在 React 事件处理中`#inner` 调用了 `stopPropagation`，事件被停止冒泡。

例子 2:

```js
export default class Modal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showBox: props.showBox,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickBody, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickBody, false);
  }

  handleClickBody = (e) => {
    document.body.style.overflow = 'visible';
    console.log('click body', e.target);
    this.setState({
      showBox: false,
    });
  };

  handleClickButton = (e) => {
    // React中专属的阻止事件冒泡方法
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.showBox) return;
    document.body.style.overflow = 'hidden';
    console.log('click button');
    this.setState({
      showBox: true,
    });
  };
  clickModal = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    console.log('click modal', e.target);
  };
  render() {
    const { showBox } = this.state;
    return (
      <div>
        <button onClick={this.handleClickButton}>点我显示弹窗</button>
        {showBox && <div className="modal" onClick={this.clickModal} />}
        {this.props.children}
      </div>
    );
  }
}
```

## 事件注册(>V17)

在 `React` 中当我们为一个元素绑定事件时，会这样写：

```js
<div
  onClick={() => {
    /*do something*/
  }}
>
  React
</div>
```

这个 `div` 节点最终要对应一个 `fiber` 节点，`onClick` 则作为它的 `prop`。当这个 `fiber` 节点进入 `render` 阶段的 `complete` 阶段时，名称为 `onClick` 的 `prop` 会被识别为事件进行处理。

```js
function setInitialDOMProperties(
  tag: string,
  domElement: Element,
  rootContainerElement: Element | Document,
  nextProps: Object,
  isCustomComponentTag: boolean,
): void {
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      ...
    } else if (registrationNameDependencies.hasOwnProperty(propKey)) {
        // 如果propKey属于事件类型，则进行事件绑定
        ensureListeningTo(rootContainerElement, propKey, domElement);
      }
    }
  }
}
```

`registrationNameDependencies` 是一个对象，存储了所有 `React` 事件对应的原生 `DOM` 事件的集合，这是识别 `prop` 是否为事件的依据。如果是事件类型的 `prop`，那么将会调用 `ensureListeningTo` 去绑定事件。

接下来的绑定过程可以概括为如下几个关键点：

- 根据 `React` 的事件名称寻找该事件依赖，例如 `onMouseEnter` 事件依赖了 `mouseout` 和 `mouseover` 两个原生事件，`onClick` 只依赖了 `click` 一个原生事件，最终会循环这些依赖，在 `root` 上绑定对应的事件。例如组件中为 `onClick`，那么就会在 `root` 上绑定一个 `click` 事件监听。

- 依据组件中写的事件名识别其属于哪个阶段的事件（冒泡或捕获），例如 `onClickCapture` 这样的 `React` 事件名称就代表是需要事件在`捕获阶段`触发，而 `onClick` 代表事件需要在`冒泡阶段`触发。

- 根据 `React` 事件名，找出对应的原生事件名，例如 `click`，并根据上一步来判断是否需要在捕获阶段触发，调用 `addEventListener`，将事件绑定到 `root` 元素上。

- 若事件需要更新，那么先移除事件监听，再重新绑定，绑定过程重复以上三步。

经过这一系列过程，事件监听器 `listener` 最终被绑定到 `root` 元素上。

```js
  // 根据事件名称，创建不同优先级的事件监听器。
  let listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags,
    listenerPriority,
  );

  // 绑定事件
  if (isCapturePhaseListener) {
    ...
    unsubscribeListener = addEventCaptureListener(
      targetContainer,
      domEventName,
      listener,
    );
  } else {
    ...
    unsubscribeListener = addEventBubbleListener(
      targetContainer,
      domEventName,
      listener,
    );

  }
```

## 事件监听器 listener

在绑定事件的时候，绑定到 `root` 上的事件监听函数是 `listener`，然而这个 `listener` 并不是我们直接在组件里写的事件处理函数。通过上面的代码可知，`listener` 是 `createEventListenerWrapperWithPriority` 的调用结果。

为什么要创建这么一个 `listener`，而不是直接绑定写在组件里的事件处理函数呢？

其实 `createEventListenerWrapperWithPriority` 这个函数名已经说出了答案：依据`优先级`创建一个事件监听包装器。

有两个重点：`优先级`和`事件监听包装器`。这里的`优先级`是指`事件优先级`([事件优先级章节](/react/project/event-priority))

事件优先级是根据事件的交互程度划分的，优先级和事件名的映射关系存在于一个 `Map` 结构中。

`createEventListenerWrapperWithPriority` 会根据事件名或者传入的优先级返回不同级别的事件监听包装器。

总的来说，会有三种事件监听包装器：

- dispatchDiscreteEvent: 处理离散事件。
- dispatchUserBlockingUpdate：处理用户阻塞事件。
- dispatchEvent：处理连续事件。

这些包装器是真正绑定到 `root` 上的事件监听器 `listener`，它们持有各自的优先级，当对应的事件触发时，调用的其实是这个包含优先级的事件监听。

![listener](https://img-blog.csdnimg.cn/d584c601508749ab9873076b26de47be.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 透传事件执行阶段标志

到这里我们先梳理一下，root 上绑定的是这个持有优先级的事件监听，触发它会使组件中真实的事件得以触发。但到目前为止有一点并未包括在内，也就是事件执行阶段的区分。组件中注册事件虽然可以以事件名 + “Capture”后缀的形式区分将来的执行阶段，但这和真正执行事件其实是两回事，所以现在关键在于如何将注册事件时显式声明的执行阶段真正落实到执行事件的行为上。

关于这一点我们可以关注 `createEventListenerWrapperWithPriority` 函数中的其中一个入参：`eventSystemFlags`。

它是事件系统的一个标志，记录事件的各种标记，其中一个标记就是 `IS_CAPTURE_PHASE`，这表明了当前的事件是捕获阶段触发。当事件名含有 `Capture` 后缀时，`eventSystemFlags` 会被赋值为 `IS_CAPTURE_PHASE`。

之后在以优先级创建绑定到 `root` 上的事件监听时，`eventSystemFlags` 会作为它执行时的入参，传递进去。因此，在事件触发的时候就可以知道组件中的事件是以冒泡或是捕获的顺序执行。

```js
function dispatchDiscreteEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent,
) {
  ...
  discreteUpdates(
    dispatchEvent,
    domEventName,
    eventSystemFlags, // 传入事件执行阶段的标志
    container,
    nativeEvent,
  );
}
```

### 小结

1. 事件处理函数不是绑定到组件的元素上的，而是绑定到 `root` 上，这和 `fiber` 树的结构特点有关，即事件处理函数只能作为 `fiber` 的 `prop`。

2. 绑定到 `root` 上的事件监听不是我们在组件里写的事件处理函数，而是一个持有事件优先级，并能传递事件执行阶段标志的监听器。

## 事件触发

事件监听器 `listener` 做了什么?

> 它做的事情可以用一句话概括：负责以不同的优先级权重来触发真正的事件流程，并传递`事件执行阶段标志（eventSystemFlags）`。

比如一个元素绑定了 `onClick` 事件，那么点击它的时候，绑定在 `root` 上的 `listener` 会被触发，会最终使得组件中的事件被执行。

也就是说绑定到 `root` 上的事件监听 `listener` 只是相当于一个传令官，它按照事件的优先级去安排接下来的工作：

**事件对象的合成、将事件处理函数收集到执行路径、 事件执行**，这样在后面的调度过程中，`scheduler` 才能获知当前任务的优先级，然后展开调度。

那么它是如何将优先级传递出去？

利用 `scheduler` 中的 `runWithPriority` 函数，通过调用它，将优先级记录到利用 `scheduler` 中，所以调度器才能在调度的时候知道当前任务的优先级。

`runWithPriority` 的第二个参数，会去安排上面提到的三个工作。

以用户阻塞的优先级级别为例：

```js
function dispatchUserBlockingUpdate(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent,
) {
    ...
    runWithPriority(
      UserBlockingPriority,
      dispatchEvent.bind(
        null,
        domEventName,
        eventSystemFlags,
        container,
        nativeEvent,
      ),
    );
}
```

`dispatchUserBlockingUpdate` 调用 `runWithPriority`，并传入 `UserBlockingPriority` 优先级，这样就可以将 `UserBlockingPriority` 的优先级记录到 `Scheduler` 中，后续 `React` 计算各种优先级都是基于这个 `UserBlockingPriority` 优先级。

除了传递优先级，它做的其它重要的事情就是触发事件对象的合成、将事件处理函数收集到执行路径、 事件执行这三个过程，也就是到了事件的执行阶段。`root` 上的事件监听最终触发的是`dispatchEventsForPlugins`。

这个函数体可看成两部分：事件对象的合成和事件收集 、 事件执行，涵盖了上述三个过程。

```js
function dispatchEventsForPlugins(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  nativeEvent: AnyNativeEvent,
  targetInst: null | Fiber,
  targetContainer: EventTarget,
): void {
  const nativeEventTarget = getEventTarget(nativeEvent);
  const dispatchQueue: DispatchQueue = [];

  // 事件对象的合成，收集事件到执行路径上
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  );

  // 执行收集到的组件中真正的事件
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
```

`dispatchEventsForPlugins` 函数中事件的流转有一个重要的载体：`dispatchQueue`，它承载了本次合成的事件对象和收集到事件执行路径上的事件处理函数。

![dispatchQueue](https://img-blog.csdnimg.cn/d9bce88cbcbe4141939b92c623656b4c.png)

`listeners` 是事件执行路径，`event` 是合成事件对象，收集组件中真正的事件到执行路径，以及事件对象的合成通过 `extractEvents` 实现。

### 事件对象的合成和事件的收集

到这里我们应该清楚，root 上的事件监听被触发会引发事件对象的合成和事件的收集过程，这是为真正的事件触发做准备。

### 合成事件对象

在组件中的事件处理函数中拿到的事件对象并不是原生的事件对象，而是经过 `React` 合成的 `SyntheticEvent` 对象。它解决了不同浏览器之间的兼容性差异。抽象成统一的事件对象，解除开发者的心智负担。

### 事件执行路径

当事件对象合成完毕，会将事件收集到事件执行路径上。什么是事件执行路径呢？

在浏览器的环境中，若父子元素绑定了相同类型的事件，除非手动干预，那么这些事件都会按照冒泡或者捕获的顺序触发。

在 `React` 中也是如此，从`触发事件`的元素开始，依据 `fiber` 树的层级结构向上查找，累加上级元素中所有相同类型的事件，最终形成一个具有所有相同类型事件的数组，这个`数组就是事件执行路径`。通过这个路径，`React` 自己模拟了一套事件捕获与冒泡的机制。

下图是事件对象的包装和收集事件（冒泡的路径为例）的大致过程:

![事件执行路径](https://img-blog.csdnimg.cn/2d61690cf974404baa221eb38ca09543.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

因为不同的事件会有不同的行为和处理机制，所以合成事件对象的构造和收集事件到执行路径需要通过插件实现。

一共有 5 种 Plugin：

- SimpleEventPlugin
- EnterLeaveEventPlugin
- ChangeEventPlugin
- SelectEventPlugin
- BeforeInputEventPlugin

它们的使命完全一样，只是处理的事件类别不同，所以内部会有一些差异。这里以 `SimpleEventPlugin` 为例来讲解这个过程，它处理比较通用的事件类型，比如 `click`、`input`、`keydown` 等。

```js
function extractEvents(
  dispatchQueue: DispatchQueue,
  domEventName: DOMEventName,
  targetInst: null | Fiber,
  nativeEvent: AnyNativeEvent,
  nativeEventTarget: null | EventTarget,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
): void {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  if (reactName === undefined) {
    return;
  }
  let EventInterface;
  switch (domEventName) {
    // 赋值EventInterface（接口）
  }

  // 构造合成事件对象
  const event = new SyntheticEvent(
    reactName,
    null,
    nativeEvent,
    nativeEventTarget,
    EventInterface,
  );

  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;

  if (/*...*/) {
    ...
  } else {
    // scroll事件不冒泡
    const accumulateTargetOnly =
      !inCapturePhase &&
      domEventName === 'scroll';

    // 事件对象分发 & 收集事件
    accumulateSinglePhaseListeners(
      targetInst,
      dispatchQueue,
      event,
      inCapturePhase,
      accumulateTargetOnly,
    );
  }
  return event;
}
```

### 创建合成事件对象

这个统一的事件对象由 `SyntheticEvent` 函数构造而成，它自己遵循 `W3C` 的规范又实现了一遍浏览器的事件对象接口，这样可以抹平差异，而原生的事件对象只不过是它的一个`属性（nativeEvent）`。

```js
// 构造合成事件对象
const event = new SyntheticEvent(
  reactName,
  null,
  nativeEvent,
  nativeEventTarget,
  EventInterface,
);
```

### 收集事件到执行路径

这个过程是将组件中真正的事件处理函数收集到数组中，等待下一步的批量执行。

先看一个例子，目标元素是 `counter`，父级元素是 `counter-parent`。

```js
class EventDemo extends React.Component {
  state = { count: 0 };
  onDemoClick = () => {
    console.log('counter的点击事件被触发了');
    this.setState({
      count: this.state.count + 1,
    });
  };
  onParentClick = () => {
    console.log('父级元素的点击事件被触发了');
  };
  render() {
    const { count } = this.state;
    return (
      <div className={'counter-parent'} onClick={this.onParentClick}>
        <div onClick={this.onDemoClick} className={'counter'}>
          {count}
        </div>
      </div>
    );
  }
}
```

当点击 `counter` 时，父元素上的点击事件也会被触发，相继打印出：

```js
// 'counter的点击事件被触发了'
// '父级元素的点击事件被触发了'
```

实际上这是将事件以冒泡的顺序收集到执行路径之后导致的。收集的过程由 `accumulateSinglePhaseListeners` 完成。

```js
accumulateSinglePhaseListeners(
  targetInst,
  dispatchQueue,
  event,
  inCapturePhase,
  accumulateTargetOnly,
);
```

函数内部最重要的操作无疑是收集事件到执行路径，为了实现这一操作，需要在 `fiber` 树中从触发事件的源 `fiber` 节点开始，向上一直找到 `root`，形成一条完整的冒泡或者捕获的路径。

同时，沿途路过 `fiber` 节点时，根据事件名，从 `props` 中获取我们真正写在组件中的事件处理函数，`push` 到路径中，等待下一步的批量执行。

```js
// 精简过后的代码
export function accumulateSinglePhaseListeners(
  targetFiber: Fiber | null,
  dispatchQueue: DispatchQueue,
  event: ReactSyntheticEvent,
  inCapturePhase: boolean,
  accumulateTargetOnly: boolean,
): void {
  // 根据事件名来识别是冒泡阶段的事件还是捕获阶段的事件
  const bubbled = event._reactName;
  const captured = bubbled !== null ? bubbled + 'Capture' : null;

  // 声明存放事件监听的数组
  const listeners: Array<DispatchListener> = [];

  // 找到目标元素
  let instance = targetFiber;

  // 从目标元素开始一直到root，累加所有的fiber对象和事件监听。
  while (instance !== null) {
    const { stateNode, tag } = instance;

    if (tag === HostComponent && stateNode !== null) {
      const currentTarget = stateNode;

      // 事件捕获
      if (captured !== null && inCapturePhase) {
        // 从fiber中获取事件处理函数
        const captureListener = getListener(instance, captured);
        if (captureListener != null) {
          listeners.push(
            createDispatchListener(instance, captureListener, currentTarget),
          );
        }
      }

      // 事件冒泡
      if (bubbled !== null && !inCapturePhase) {
        // 从fiber中获取事件处理函数
        const bubbleListener = getListener(instance, bubbled);
        if (bubbleListener != null) {
          listeners.push(
            createDispatchListener(instance, bubbleListener, currentTarget),
          );
        }
      }
    }
    instance = instance.return;
  }
  // 收集事件对象
  if (listeners.length !== 0) {
    dispatchQueue.push(createDispatchEntry(event, listeners));
  }
}
```

无论事件是在冒泡阶段执行，还是捕获阶段执行，都以同样的顺序 `push` 到 `dispatchQueue` 的 `listeners` 中，而冒泡或者捕获事件的执行顺序不同是由于清空 `listeners` 数组的顺序不同。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '注意，每次收集只会收集与事件源相同类型的事件，比如子元素绑定了`onClick`，父元素绑定了 `onClick` 和 `onClickCapture`';

export default () => <Info type="warning" txt={txt} />;
```

```js
<div
  className="parent"
  onClick={onClickParent}
  onClickCapture={onClickParentCapture}
>
  父元素
  <div className="child" onClick={onClickChild}>
    子元素
  </div>
</div>
```

那么点击子元素时，收集的将是 `onClickChild` 和 `onClickParent`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/39ef40b1cbec4ce790ad5963ca2e0cf5.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 参与事件执行过程

合成事件对象如何参与到事件执行过程?

上面我们说过，`dispatchQueue` 的结构如下面这样:

```js
[
  {
    event: SyntheticEvent,
    listeners: [ listener1, listener2, ... ]
  }
]
```

`event` 就代表着合成事件对象，可以将它认为是这些 `listeners` 共享的一个事件对象。

当清空 `listeners` 数组执行到每一个事件监听函数时，这个事件监听可以改变 `event` 上的 `currentTarget`，也可以调用它上面的 `stopPropagation` 方法来阻止冒泡。

`event` 作为一个共享资源被这些事件监听消费，消费的行为发生在事件执行时。

## 事件执行

经过事件和事件对象收集的过程，得到了一条完整的事件执行路径，还有一个被共享的事件对象，之后进入到事件执行过程，从头到尾循环该路径，依次调用每一项中的监听函数。

这个过程的重点在于事件冒泡和捕获的模拟，以及合成事件对象的应用，如下是从 `dispatchQueue` 中提取出事件对象和时间执行路径的过程。

```js
export function processDispatchQueue(
  dispatchQueue: DispatchQueue,
  eventSystemFlags: EventSystemFlags,
): void {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    // 从dispatchQueue中取出事件对象和事件监听数组
    const { event, listeners } = dispatchQueue[i];

    // 将事件监听交由processDispatchQueueItemsInOrder去触发，同时传入事件对象供事件监听使用
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
  // 捕获错误
  rethrowCaughtError();
}
```

### 模拟冒泡和捕获

冒泡和捕获的执行顺序是不一样的，但是当初在收集事件的时候，无论是冒泡还是捕获，事件都是直接 push 到路径里的。那么执行顺序的差异是如何体现的呢？

**答案是循环路径的顺序不一样导致了执行顺序有所不同。**

首先回顾一下 `dispatchQueue` 中的 `listeners` 中的事件处理函数排列顺序：触发事件的目标元素的事件处理函数排在第一个，上层组件的事件处理函数依次往后排。

```js
<div onClick={onClickParent}>
  父元素
  <div onClick={onClickChild}>子元素</div>
</div>
// listeners: [onClickChild, onClickParent];
```

从左往右循环的时候，目标元素的事件先触发，父元素事件依次执行，这与冒泡的顺序一样，那捕获的顺序自然是从右往左循环了。

模拟冒泡和捕获执行事件的代码如下：

其中判断事件执行阶段的依据 `inCapturePhase`，它的来源在上面的透传透传事件执行阶段标志的内容里已经提到过。

```js
function processDispatchQueueItemsInOrder(
  event: ReactSyntheticEvent,
  dispatchListeners: Array<DispatchListener>,
  inCapturePhase: boolean,
): void {
  let previousInstance;

  if (inCapturePhase) {
    // 事件捕获倒序循环
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      // 执行事件，传入event对象，和currentTarget
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    // 事件冒泡正序循环
    for (let i = 0; i < dispatchListeners.length; i++) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      // 如果事件对象阻止了冒泡，则return掉循环过程
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  }
}
```

至此，我们写在组件中的事件处理函数就被执行掉了，合成事件对象在这个过程中充当了一个公共角色，每个事件执行时，都会检查合成事件对象，有没有调用阻止冒泡的方法，另外会将当前挂载事件监听的元素作为 `currentTarget` 挂载到事件对象上，最终传入事件处理函数，我们得以获取到这个事件对象。

## 总结

总结一下事件机制的原理：由于 `fiber` 树的特点，一个组件如果含有事件的 `prop`，那么将会在对应 `fiber` 节点的 `commit` 阶段绑定一个事件监听到 `root` 上，这个事件监听是持有优先级的，这将它和优先级机制联系了起来，可以把合成事件机制当作一个协调者，负责去协调`合成事件对象`、`收集事件`、`触发真正的事件处理函数`这三个过程。
