---
title: 字节抖音直播团队2面
nav:
  title: 模拟试题
  path: /demos
  order: 0
group:
  title: 技术部分
  path: /demos/technology
---

# 字节抖音直播团队 2 面

- 2022.11.25

## 1.先做个自我介绍把？

好的。

面试官你好，我叫许将龙，今年 28 岁，浙江台州人，计算机相关专业毕业，从事前端相关的工作已经有 6 年。

自工作以来，主要深耕于 PC、H5、公众号、小程序、Hybrid 等方向，业务范围主要囊括了电商、金融、直播、拍卖行等场景。

个人基础知识扎实，擅长以 React 为主的相关技术栈。

之前是担任公司业务线内前端团队的 Leader，负责主站核心业务--直播和拍卖行相关的业务开发、团队资源统筹、项目管理以及成员带教相关的工作。期间也带领团队完成了多次核心业务指标贡献，辅导了 4 位成员的转正和晋升工作。

此外我也是一个擅长总结和归纳的人，除了定期在团队内外组件技术分享外，闲暇的时间我也沉淀了上百篇的技术博客。

最后，我是一个外向、乐观、自律的人，擅长与人沟通，学习能力强，能够快速的融入到团队中来。

## 2. 介绍下什么是 redux？

`redux`是一种`单向数据流`的 `JavaScript 应用状态管理容器`，提供了`可预测`的状态管理。

其中包含了`Store`、`State`、`Action`、`Action Creator`、`Reducer`、`Dispatch`等概念。

其中`Store`是应用的状态容器，整个应用只能有一个`Store`，里面存放了各种`State`，对应着每一个`State`下的`View`。

`State`代表了应用的状态，`Action`是`View`发出的指令，需要通过`Dispatch`触发，用于变更`State`，这个时候可以用`Action Creator`来创建统一风格的指令，发出的指令经过`Reducer`处理后生成一个新的`State`以达到更新试图的目的。

## 3. 为什么要使用 redux，普通的 state 不行么？

在较简单的项目中直接使用 `state` 进行状态管理就可以了，无须使用 `redux`，但是在复杂的项目中，存在着很多无规律的交互以及异步操作。

比如说之前的业务其实仅在直播相关的模块用了`mobx`来进行状态的处理，一些公共的状态和逻辑进行了统一管理。

主要应用`redux`的原因是其提供了这么一种**单向数据流且可追溯的容易状态管理方案**。

## 4. Redux 源码有去了解过么？有哪些常用的 API？

嗯，之前有阅读过，去年又详细的整理了一遍，当时看的版本是`V4.1.1`，看完后也做了一下总结。

主入口主要导出了以下几个常用的 API：

- createStore
- bindActionCreators
- combineReducers
- compose
- applyMiddleware

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

## 5.中间件为什么要嵌套函数？为何不在一层函数中传递三个参数，而要在一层函数中传递一个参数，一共传递三层？

**因为中间件是要多个`首尾相连`的，对 `next` 进行一层层的**加工**，所以 `next` 必须独立一层。**

那么 `Store` 和 `action` 呢？

- `Store` 的话，我们要在中间件顶层放上 `Store`，因为我们要用 `Store` 的 `dispatch` 和 `getState` 两个方法。

- `action` 的话，是因为我们封装了这么多层，其实就是为了作出更高级的 `dispatch` 方法，是 `dispatch`需要接收 `action` 这个参数。

## 6. middlewareAPI 中的 dispatch 为什么要用匿名函数包裹呢？

我们用 `applyMiddleware` 是为了改造 `dispatch` 的，所以 `applyMiddleware` 执行完后，`dispatch` 是变化了的。

而 `middlewareAPI` 是 `applyMiddleware` 执行中分发到各个 `middleware`，所以必须用匿名函数包裹 `dispatch`，这样只要 `dispatch` 更新了，`middlewareAPI` 中的 `dispatch` 应用也会发生变化。

## 7. 在 middleware 里调用 dispatch 跟调用 next 一样吗？

因为我们的 `dispatch` 是用`匿名函数`包裹，所以在中间件里执行 `dispatch` 跟其它地方没有任何差别，而执行 `next` 相当于调用下个中间件。

## 8. 这里提到了 reducer 是一个纯函数什么是纯函数？为什么需要是纯函数？

纯函数是指不会对传入的参数进行修改，在同一条件下的输入返回值都是相同的。

因为 redux 本身是推行提供一种可预测的状态变化流程，如果 reducer 不是纯函数的话，那么经 reducer 处理后，数据的状态可能就会产生多个情况，也就不能进行状态追溯了。

## 9. 了解 immutable.js 么？有没有在项目里面配合使用？

> [immutable.js](https://github.com/immutable-js/immutable-js)是一种不可变数据，一旦被创建之后就不可被修改。我们对 `Immutable` 对象的任何`修改或添加删除操作`都会返回一个新的 `Immutable` 对象。

其内部采用了一种 `Persistent Data Structure(持久化数据结构)`，也就是数据改变时(增删改)要保证旧数据同时可用且不变。

为了避免深拷贝把所有节点都复制一遍带来的性能损耗，`Immutable.js` 使用了 `Structural Sharing(结构共享)`， 即如果对象树节点发生变化，只修改这个节点和受它影响的父节点，其他节点共享。

之前的项目中有使用过，比如说在收货地址物流信息模块，**主要是为了解决层级嵌套较深情况下深拷贝所带来的性能问题**。

主要通过使用 `state.merge` 或者 `state.set` 来实现。

## 10. 使用 immutable.js 有什么注意事项?

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

## 11. redux 与 react-redux 有什么区别？

`react-redux` 是 `redux` 官方提供的 `React` 绑定库，用于在 `React` 应用中快速集成 `redux`。

## 12. react-redux 核心概念有哪些？

主要是 3 个核心内容：

- `<Provider store>`：帮助我们在需要使用 store 的地方进行了自动注册，不需要每个文件再去导入 store。
- `Subscription`：收集所有被 `connect` 包裹的组件的更新函数 `onstatechange`，然后形成一个 `callback` 链表，再由父级 `Subscription` 统一派发执行更新。
- `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`：帮助我们将 store 中的数据绑定到了 React 组件的 props 属性上，方便我们直接使用。

## 13. connect 中的参数有哪些能详细讲一下么？

- `mapStateToProps`：这个函数允许我们将 `store` 中的数据作为 `props` 绑定到组件上，当 `state` 改变时触发业务组件 `props` 改变，触发业务组件更新视图。
- `mapDispatchToProps`：用于将 `redux` 中的 `dispatch` 方法映射到业务组件的 `props` 中。
- `mergeProps`：经过 `conncet` 的组件的 `props` 有 3 个来源：

  - 一是由 `mapStateToProps` 将 `state` 映射成的 `props`
  - 二是由 `mapDispatchToProps` 将 `Action creator` 映射成的 `props`
  - 三是组件自身的 `props`。

  因此，`mergeProps`主要用于整合这些 `props` 并且过滤一些不需要的 `props`。

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

- options 不怎么常用，主要功能如下：

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

  首先通过 `context` 获取最近的 `subscription`，然后创建一个新的 `subscription`，并且和父级的 `subscription` 建立起关联。

  当第一次 `hoc` 容器组件挂在完成后，在 `useEffect` 里进行订阅，将自己的订阅函数 `checkForUpdates`作为回调函数，通过 `trySubscribe` 和 `this.parentSub.addNestedSub`加入到父级 `subscription` 的 `listeners` 中。由此完成整个订阅流程。

- 更新流程

  整个更新流程是`state` 改变，会触发根订阅器的 `store.subscribe`，然后会触发 `listeners.notify` 也就是 `checkForUpdates` 函数，然后 `checkForUpdates` 函数首先根据 `mapStoretoprops`，`mergeprops` 等操作，验证该组件是否发起订阅，`props` 是否改变，并更新。

  如果发生改变，那么触发 `useReducer` 的 `forceComponentUpdateDispatch` 函数，来更新业务组件。

  如果没有发生更新，那么通过调用 `notifyNestedSubs`，来通知当前 `subscription` 的 `listeners` 检查是否更新，然后尽心层层 `checkForUpdates`逐级向下，借此完成整个更新流程。

## 14. 观察者模式和发布订阅模式的区别在哪里，手写实现一个发布订阅模式？

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

  on(type, callback) {
    if (!this.events[type]) {
      this.events[type] = [callback];
    } else {
      this.events[type].push(callback);
    }
  }

  off(type, callback) {
    if (!this.events[type]) {
      return;
    }
    this.events[type] = this.events[type].filter((item) => item !== callBack);
  }

  once(type, callback) {
    function fn() {
      callback();
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
```

## 15. ES6 Modules 相对于 CommonJS 的优势是什么？

- `CommonJS` 模块输出的是一个`值的拷贝`，ES6 模块输出的是`值的引用`。即`ES6 Module`只存只读，不能改变其值，具体点就是`指针指向不能变`；
- `CommonJS` 模块是`运行时加载`，ES6 模块是`编译时输出接口`。
- `CommonJS` 模块的`require()`是`同步加载`模块，ES6 模块的`import`命令是`异步加载`，有一个独立的模块依赖的解析阶段。
- `import` 的接口是 `read-only（只读状态）`，不能修改其变量值，`CommonJS` 可以重新赋值（改变指针指向）。

## 16. 这里你说了熟练 ES6+的语法，工作中都用到过哪些呢？

主要都用过一下的一些方法：

- let、const
- 类 class 和 extends
- 箭头函数
- 函数默认参数
- 模板字符串
- 解构赋值
- ES 模块标准化
- 扩展操作符
- Promise
- Array.prototype.includes()
- async 与 await
- Object.keys()、Object.values()
- padStart()、padEnd()
- Array.prototype.flat()
- 可选链语法
- 空值合并运算符
- replaceAll

## 17. 为什么要用箭头函数呢？

主要是为了更加明确 this 的指向。

- 普通函数中的 this 跟运行时的环境有关。
- 箭头函数中的 this 在声明的时候就已经确定了 this 的指向。

## 18. webpack 的打包流程能说一说么？

1. 将命令行参数与 `webpack配置文件(webpack.config.js)` 合并、解析得到参数对象 `Options`，用于激活`webpack`的加载项和插件。

2. 进行`webpack`的初始化:

   1. 将参数对象 `Options` 传给 `webpack` 执行得到 `compiler` 对象。
   2. `WebpackOptionsApply`首先会初始化几个基础插件，然后把`options`中对应的选项进行`require`。
   3. 初始化`compiler`的上下文。`loader`和`file`的输入输出环境。

3. 执行`compiler`对象的`run()`方法开始编译

   1. 该方法是编译的入口。
   2. `compiler`具体分成了 2 个对象：
      1. Compiler：存放输入输出相关配置信息和编译器`Parse`对象。
      2. Watching：监听文件变化的一些处理方法。

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
   2. 对 module 进行 build。包括调用 loader 处理源文件使用`acorn`生成 AST 并且遍历 AST，遇到`require`等依赖时，创建依赖`Dependency`加入依赖数组。
   3. module 已经 build 完毕，此时开始处理依赖的 module。
   4. 异步的对 module 进行 build，如果依赖中仍有依赖，则循环处理其依赖。

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

## 19. compiler 与 compilation 是什么？有什么区别?

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

## 20. 什么是 AST？

AST（Abstract Syntax Tree)，是源代码的抽象语法结构的树状表现形式。树上的每个节点都表示源代码中的一种结构。之所以说语法是「抽象」的，是因为这里的语法并不会表示出真实语法中出现的每个细节。

比如说我们一个 js 函数，经过 js 引擎编译之后就会生成对应的 ast，存在一些 type：FunctionDeclaration，body 啊，params 之类的。

## 21. 为什么会去了解 AST 呢？

一个原因是当初学 js 引擎相关的一些知识和去了解 Babel 编译原理的时候看到了这个概念。

另外呢 后期在项目中也存在了一些实际的业务场景。

比如说我们 App 侧做了一个适老化的大字版，某些 H5 场景呢又需要屏蔽，这时候就会用到对某些业务的 CSS 上的 font-size 采用等比的缩放。

## 22. React 中的 Diff 算法是怎么样的？

​ 传统 diff 算法 ​​​  通过`循环递归对节点`进行依次对比，效率低下，算法复杂度达到  ​​`O(n^3)​​​`，其中 n 是树中节点的总数。

这意味着如果要展示 1000 个节点，就要依次执行上十亿次的比较。这个开销实在是太过高昂。

因此，React 通过制定大胆的策略，将 O(n^3) 复杂度的问题转换成 O(n) 复杂度的问题。

主要是基于以下三个策略：

1. Web 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
3. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分（节点移动会导致 diff 开销较大，通过 key 进行优化）。

基于以上三个前提策略，React 分别对 `tree diff`、`component diff` 以及 `element diff` 进行算法优化:

### tree diff

对树进行分层比较，两棵树只会对同一层次的节点进行比较。

当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

### component diff

React 是基于组件构建应用的，对于组件间的比较所采取的策略也是简洁高效。

- 如果是同一类型的组件，按照原策略继续比较 virtual DOM tree。(可以通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff)
- 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。

### element diff

当节点处于同一层级时，React diff 提供了以下的节点操作，分别为：

- INSERT_MARKUP（插入）
- MOVE_EXISTING（移动）
- TEXT_CONTENT（文本内容）直接替换文本 不会 diff
- REMOVE_NODE（删除）

## React 中的 Diff 为什么要深度优先？不能广度优先呢？

因为广度优先遍历可能会导致组件的生命周期时序错乱。

## TCP 和 UDP 有什么区别？

1. TCP 是面向连接的，UDP 是无协议的连接。
2. TCP 提供可靠的服务。也就是说，通过 TCP 连接传送的数据，无差错，不丢失，不重复，且按序到达;UDP 尽最大努力交付，即不保证可靠交付
3. UDP 具有较好的实时性，工作效率比 TCP 高，适用于对高速传输和实时性有较高的通信或广播通信。
4. 每一条 TCP 连接只能是点到点的;UDP 支持一对一，一对多，多对一和多对多的交互通信
5. TCP 对系统资源要求较多，UDP 对系统资源要求较少。

## Vue 和 React 的区别到底是什么？

### 设计理念

- Vue 的核心思想是尽可能的降低前端开发的门槛，是一个灵活易用的渐进式双向绑定的 MVVM 框架。
- React 的核心思想是声明式渲染和组件化、单向数据流，React 既不属于 MVC 也不属于 MVVM 架构。

### 组件写法上

- Vue 的组件写法是通过 template 的单文件组件格式。
- React 的组件写法是 JSX+inline style，也就是吧 HTML 和 CSS 全部写进 JavaScript 中。

### Diff 算法不同

- vue 对比节点，如果节点元素类型相同，但是 className 不同，认为是不同类型的元素，会进行删除重建，但是 react 则会认为是同类型的节点，只会修改节点属性。

- vue 的列表比对采用的是首尾指针法，而 react 采用的是从左到右依次比对的方式，当一个集合只是把最后一个节点移动到了第一个，react 会把前面的节点依次移动，而 vue 只会把最后一个节点移动到最后一个，从这点上来说 vue 的对比方式更加高效。

### 响应式原理不同

- React 主要是通过 setState()方法来更新状态，状态更新之后，组件也会重新渲染。
- vue 会遍历 data 数据对象，使用 Object.definedProperty()将每个属性都转换为 getter 和 setter，每个 Vue 组件实例都有一个对应的 watcher 实例，在组件初次渲染的时候会记录组件用到了那些数据，当数据发生改变的时候，会触发 setter 方法，并通知所有依赖这个数据的 watcher 实例调用 update 方法去触发组件的 compile 渲染方法，进行渲染数据。

## 团队成员有什么问题？

遇到自己解决不了的事情可以先思考一下，查阅一些资料。如果发现自己真的解决不了的时候一定要及时的反馈并需求帮助，不能一声不响。

之前做 520 活动的时候，部分需求交给组员来实现的。

## 如果一个员工不符合你的预期，你会怎么去处理?

作为一个 leader，首先要思考的是为什么这个员工不符合你的预期。

是在某一块方面的能力有问题呢？还是说其态度有问题。

如果是单纯能力有问题的话，可以进行沟通，安排带教，给予一定的时间让他去适应，并布置相关的教学目标。

从简单的模块开始逐步让其适应起来。

如果是态度的问题，就得优先解决。

是因为对分配的任务不满，还是对这块业务的合作伙伴不满。

业务不满的话，调整业务试试看。

如果是态度问题，除了走调岗外，长期的不改变的话，只能是解雇。

## 遇到排查线上问题

流量分发的场景。

消息订阅模块加日志，排查消息是否正常发送出去，接收方是否接受到。

生命周期是否正常的监听和卸载。

言传身教。

引导员工表达自己的想法。

注意表达的方式，比说说做 cr 的时候，某个功能点可能有更好的实现办法，不应该说你这个怎么怎么不会，而是换种方式，比如这里你看看这样去修改是不是更加完美？

一定要把员工推向前台，放手去做一些事情，而不是事事亲力亲为，这样自己会累死。

天塌下来我扛着。

## BOSS 需求你该如何应对？

按照项目的紧急程度和业务优先级进行排序。

流程规范化，必须走需求邮件，部分业务拆分，按照紧急需求内的紧急程度再拆分。

对一些项目 say no。

每个月底后开下个月的项目情况。

及时反馈，比如测试环境的问题，及时反馈给运维组，避免因为环境问题导致测试流程的问题。

## 如何提升团队工作效率

1. 善于总结，对于出现过的问题一定要进行总结，避免再次犯错。
2. 从流程上优化开发体系

## HTTPS

## 手写实现 apply 与 call

```js
function apply(context = window) {
  context.fn = this;
  const args = arguments[1] || [];
  const res = context.fn(...args);

  delete context.fn;

  return res;
}

function call(context = window) {
  context.fn = this;
  const args = [...arguments].slice(1);
  const res = context.fn(...args);

  delete context.fn;

  return res;
}
```

## 手写实现深拷贝

```

```
