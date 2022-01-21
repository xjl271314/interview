---
title: 性能优化
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# React 中的性能优化

- 2021.08.11

## 性能检测

### Performance

我们比较熟悉的性能分析工具应该是 `Performance`，Chrome 浏览器自带该工具，一般已经足够满足分析的需求。

![Performance](https://img-blog.csdnimg.cn/3aafca326d4349da83ea20542a2bee9c.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### React Profiler

`React.Profiler` 是 `React` 提供的，分析组件渲染次数、开始时间及耗时的一个 API，你可以在官网找到它的文档。

当然我们不需要每个组件都去加一个 `React.Profiler` 包裹，在开发环境下，`React` 会默记录每个组件的信息，我们可以通过 `Chrome Profiler Tab` 整体分析。

![React.Profiler](https://img-blog.csdnimg.cn/fbd4cf5c6fca4c6591d41ae6b835cbab.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

想要使用该功能，我们需要安装一个[React 扩展插件](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)该插件需要科学上网。

![Profiler](https://img-blog.csdnimg.cn/df2da64fcbf74ea18335014aba4fe334.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`Profiler` 的用法和 `Performance` 用法差不多，点击开始记录，操作页面，然后停止记录，就会产出相关数据。

## 性能改进

React 项目中，最容易出现的问题是组件太多，每个组件执行 1ms，一百个组件就执行了 100ms，怎么优化？没有任何一个突出的点可以攻克，我们也不可能把一百个组件都优化成 0.01 ms。

```js
class App extend React.Component{
    constructor(props){
    super(props);
    this.state={
      count: 0
    }
  }
  render(){
    return (
      <div>
        <A />
        <B />
        <C />
        <D />
        <Button onClick={()=>{ this.setState({count: 1}) }}>click</Button>
      </div>
    )
  }
}
```

就像上面这个组件一样，当我们点击 `Button` 更新 `state` 时，`A/B/C/D` 四个组件均会执行一次 `render` 计算，这些计算完全是无用的。当我们组件够多时，会逐渐成为性能瓶颈！我们目标是减少不必要的 `render`。

### 使用纯组件或者 shuldComponentUpdate 优化类组件

对于`类组件`第一时间想到的就是 `ShouldComponentUpdate` 这个生命周期，该生命周期通过判断 `props` 及 `state` 是否变化来手动控制是否需要执行 `render`。当然如果使用 `PureComponent`，组件会自动处理 `ShouldComponentUpdate`，除此之外它与普通组件是一样的。

```js
// 父组件
import React, { Component, PureComponent } from 'react';
import Log from './log';
import User from './user';


export default class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "Jack"
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                name:"Jack"
            })
        }, 1000)
    }
    render(){
        console.log('App Render')
        const { name } = this.state
        return(
            <>
                <User name={name} />
                <Log />
            </>
        )
    }
}

// log.js
import React from 'react'

export default class Log extends React.PureComponent{
    render(){
        console.log('log render',new Date().getTime())
        return(
            <p>I am a log </p>
        )
    }
}

// user.js
import React from 'react'

export default class User extends React.Component{

    render(){
        console.log('User render',this.props.name)
        return(
            <p>my name is {this.props.name} </p>
        )
    }
}
/**
 * App Render
 * User render Jack
 * log render 1582542834610
 *
 * App Render
 * User render Jack
 *
 * log组件第二次不会重新渲染
```

- 另外一个示例:

```jsx
import React from 'react';

class Text extends React.PureComponent {
  render() {
    console.log(this.props);
    return <div>hello,wrold</div>;
  }
}

class Index extends React.Component {
  state = {
    data: { a: 1, b: 2 },
  };
  handerClick = () => {
    const { data } = this.state;
    data.a++;
    this.setState({ data });
  };
  render() {
    const { data } = this.state;
    console.log('parent render', data);
    return (
      <div>
        <button onClick={this.handerClick}>点击</button>
        <Text data={data} />
      </div>
    );
  }
}

export default Index;
```

上述代码中虽然 data 变了但是浅比较的时候返回了 false，因此子组件不会重新渲染。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '使用 `PureComponent/ShouldComponentUpdate` 时，需要注意几点：\n\n1. `PureComponent` 会对 `props` 与 `state` 做浅比较，所以一定要保证 `props` 与 `state` 中的数据是 `immutable` 的。\n\n2. 如果你的数据不是 `immutable` 的，或许你可以自己手动通过 `ShouldComponentUpdate` 来进行深比较。当然深比较的性能一般都不好，不到万不得已，最好不要这样搞。';

export default () => <Info type="warning" txt={txt} />;
```

### 使用 React.memo 优化函数式组件

`React.memo` 是一个高阶组件。这里与纯组件类似，如果输入 `props` 相同则跳过组件渲染，从而提升组件性能。

它会记忆上次某个输入 `prop` 的执行输出并提升应用性能。虽然在这些组件中也是`浅比较`。

你还可以为这个组件传递自定义比较逻辑。用户可以用自定义逻辑深度对比（deep comparison）对象。如果比较函数返回 `false` 则重新渲染组件，否则就不会重新渲染。

```js
// app.js
import React from 'react';
import User from './user';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Jack',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        name: 'Jack',
      });
    }, 1000);
  }
  render() {
    console.log('App Render');
    const { name } = this.state;
    return (
      <>
        <User name={name} age={24} designation="2222" />
      </>
    );
  }
}

export default Index;

// user.js
function CustomisedComponent(props) {
  return (
    <div>
      <b>User name: {props.name}</b>
      <b>User age: {props.age}</b>
      <b>User designation: {props.designation}</b>
    </div>
  );
}

export const memoComponent = React.memo(CustomisedComponent);

/**
 * App Render
 * CustomisedComponent
 *
 * App Render
 * 如果不加memo会再次触发
 */

// 我们也可以自定义比较深度
function userComparator(previosProps, nextProps) {
  if (
    previosProps.user.name == nextProps.user.name ||
    previosProps.user.age == nextProps.user.age ||
    previosProps.user.designation == nextProps.user.designation
  ) {
    return false;
  }
  return true;
}
export const memoComponent = React.memo(CustomisedComponent, userComparator);
```

### 善用 React.useMemo

`React.useMemo` 是 React 内置 `Hooks` 之一，主要为了解决函数组件在频繁 render 时，无差别频繁触发无用的昂贵计算 ，一般会作为性能优化的手段之一。

```js
const App = (props) => {
  const [boolean, setBoolean] = useState(false);
  const [start, setStart] = useState(0);

  // 这是一个非常耗时的计算
  const result = computeExpensiveFunc(start);
};
```

在上面例子中， `computeExpensiveFunc` 是一个非常耗时的计算，但是当我们触发 `setBoolean` 时，组件会重新渲染， `computeExpensiveFunc` 会执行一次。这次执行是毫无意义的，因为 `computeExpensiveFunc` 的结果只与 start 有关系。

`React.useMemo` 就是为了解决这个问题诞生的，它可以指定只有当 start 变化时，才允许重新计算新的 result 。

另外的一个例子,对于无状态组件，数据更新就等于函数上下文的重复执行。那么函数里面的变量，方法就会重新声明。比如如下情况。

```js
function Index() {
  const [number, setNumber] = useState(0);
  const handerClick1 = () => {
    /* 一些操作 */
  };
  const handerClick2 = () => {
    /* 一些操作 */
  };
  const handerClick3 = () => {
    /* 一些操作 */
  };
  return (
    <div>
      <a onClick={handerClick1}>点我有惊喜1</a>
      <a onClick={handerClick2}>点我有惊喜2</a>
      <a onClick={handerClick3}>点我有惊喜3</a>
      <button onClick={() => setNumber(number + 1)}> 点击 {number} </button>
    </div>
  );
}
```

每次点击 `button` 的时候,都会执行 `Index函数`。`handerClick1` , `handerClick2`, `handerClick3`都会重新声明。为了避免这个情况的发生，我们可以用 `useMemo` 做缓存，我们可以改成如下：

```js
function Index() {
  const [number, setNumber] = useState(0);
  const [handerClick1, handerClick2, handerClick3] = useMemo(() => {
    const fn1 = () => {
      /* 一些操作 */
    };
    const fn2 = () => {
      /* 一些操作 */
    };
    const fn3 = () => {
      /* 一些操作 */
    };
    return [fn1, fn2, fn3];
  }, []); /* 只有当数据里面的依赖项，发生改变的时候，才会重新声明函数。 */
  return (
    <div>
      <a onClick={handerClick1}>点我有惊喜1</a>
      <a onClick={handerClick2}>点我有惊喜2</a>
      <a onClick={handerClick3}>点我有惊喜3</a>
      <button onClick={() => setNumber(number + 1)}> 点击 {number} </button>
    </div>
  );
}
```

### 合理使用 React.useCallback

在函数组件中，`React.useCallback` 也是性能优化的手段之一。

```js
const OtherComponent = React.memo(()=>{
    ...
});

const App = (props)=>{
  const [boolan, setBoolean] = useState(false);
  const [value, setValue] = useState(0);

  const onChange = (v)=>{
      axios.post(`/api?v=${v}&state=${state}`)
  }

  return (
    <div>
        {/* OtherComponent 是一个非常昂贵的组件 */}
        <OtherComponent onChange={onChange}/>
    </div>
  )
}
```

在上面的例子中， `OtherComponent` 是一个非常昂贵的组件，我们要避免无用的 `render`。虽然 `OtherComponent` 已经用 `React.memo` 包裹起来了，但在父组件每次触发 `setBoolean` 时， `OtherComponent` 仍会频繁 `render`。

因为父级组件 `onChange` 函数在每一次 `render` 时，都是新生成的，导致子组件浅比较失效。通过 `React.useCallback`，我们可以让 `onChange` 只有在 `state` 变化时，才重新生成。

```js
const onChange = React.useCallback(
  (v) => {
    axios.post(`/api?v=${v}&state=${state}`);
  },
  [state],
);
```

通过 `useCallback` 包裹后， `boolean` 的变化不会触发 `OtherComponent` ，只有 `state` 变化时，才会触发，可以避免很多无用的 `OtherComponent` 执行。

但是仔细想想， `state` 变化其实也是没有必要触发 `OtherComponent` 的，我们只要保证 `onChange`一定能访问到最新的 `state` ，就可以避免 `state` 变化时，触发 `OtherComponent` 的 `render`。

```js
const onChange = usePersistFn((v) => {
  axios.post(`/api?v=${v}&state=${state}`);
});
```

上面的例子，我们使用了 Umi Hooks 的 [usePersistFn](https://hooks.umijs.org/zh-CN/hooks/advanced/use-persist-fn)，它可以保证函数地址永远不会变化，无论何时， `onChange` 地址都不会变化，也就是无论何时， `OtherComponent` 都不会重新 `render` 了。

### 谨慎使用 Context

`Context` 是跨组件传值的一种方案，但我们需要知道，我们无法阻止 Context 触发的 render。

不像 props 和 state，React 提供了 API 进行浅比较，避免无用的 render，Context 完全没有任何方案可以避免无用的渲染。

有几点关于 `Context` 的建议：

1. `Context` 只放置必要的，关键的，被大多数组件所共享的状态。
2. 对非常昂贵的组件，建议在父级获取 `Context` 数据，通过 `props` 传递进来。

### 小心使用 Redux

Redux 中的一些细节，稍不注意，就会触发无用的 `render`，或者其它的坑。

例如下方的依赖代码:

```js
const App = (props)=>{
  return (
    <div>
        {props.project.id}
    </div>
  )
}
export default connect((state)=>{
  layout: state.layout,
  project: state.project,
  user: state.user
})(App);
```

在上面的例子中，App 组件显示声明依赖了 `redux` 的 `layout` 、 `project` 、 `user` 数据，在这三个数据变化时，都会触发 App 重新 render。

但是 App 只需要监听 `project.id` 的变化，所以精细化依赖可以避免无效的 render，是一种有效的优化手段。

```js
const App = (props)=>{
  return (
    <div>
        {props.projectId}
    </div>
  )
}
export default connect((state)=>{
  projectId: state.project.id,
})(App);

```

### 合理 懒加载组件

导入多个文件合并到一个文件中的过程叫打包，使应用不必导入大量外部文件。

所有主要组件和外部依赖项都合并为一个文件，通过网络传送出去以启动并运行 Web 应用。

这样可以节省大量网络调用，但这个文件会变得很大，消耗大量网络带宽。应用需要等待这个文件的加载和执行，所以传输延迟会带来严重的影响。

为了解决这个问题，我们可以引入`代码拆分`的概念:

```js
// 我们可以按需懒惰加载这些拆分出来的组件，增强应用的整体性能。
import React, { lazy, Suspense } from 'react';

export default class CallingLazyComponents extends React.Component {
  render() {
    var ComponentToLazyLoad = null;

    if (this.props.name == 'Mayank') {
      ComponentToLazyLoad = lazy(() => import('./mayankComponent'));
    } else if (this.props.name == 'Anshul') {
      ComponentToLazyLoad = lazy(() => import('./anshulComponent'));
    }
    return (
      <div>
        <h1>This is the Base User: {this.state.name}</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ComponentToLazyLoad />
        </Suspense>
      </div>
    );
  }
}
```

改方式可以:

1. 使主包体积变小，消耗的网络传输时间更少。
2. 动态单独加载的包比较小，可以迅速加载完成。

### 使用 React Fragments 避免额外标记

推荐使用 `Fragments` 减少了包含的额外标记数量，这些标记只是为了满足在 `React` 组件中具有公共父级的要求。

因为使用 `Fragments` 片段不会向组件引入任何额外标记，但它仍然为两个相邻标记提供父级，因此满足在组件顶级具有单个父级的条件。

```js
import React, { Component, Fragement } from 'react';

export default class NestedRoutingComponent extends Component {
  render() {
    return (
      <>
        <h1>This is the Header Component</h1>
        <h2>Welcome To Demo Page</h2>
      </>
    );
    // 或者
    return (
      <Fragement>
        <h1>This is the Header Component</h1>
        <h2>Welcome To Demo Page</h2>
      </Fragement>
    );
  }
}
```

上面的代码没有额外的标记，因此节省了渲染器渲染额外元素的工作量，之前的常用做法可能是使用`<div>`包裹元素。

### 绑定事件尽量不要使用箭头函数

当我们使用`内联函数`处理事件时，每次调用 `render` 函数时都会创建一个新的函数实例。

因为当 `React` 进行`虚拟 DOM diff` 时，它每次都会找到一个新的函数实例，因此在`渲染阶段`它会绑定新函数并将旧实例扔给垃圾回收，这样就导致了额外做垃圾回收和绑定到 DOM 的新函数的工作，带来了不必要的性能浪费。

```js
import React from 'react';

export default class InlineFunctionComponent extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input
          type="button"
          onClick={(e) => {
            this.setState({ inputValue: e.target.value });
          }}
          value="Click For Inline Function"
        />
      </div>
    );
  }
}
```

上面的函数创建了`内联函数(即函数体直接书写在render函数中)`。每次调用 `render` 函数时都会创建一个函数的新实例，`render` 函数会将该函数的新实例绑定到该按钮，如果是在子组件上绑定的，那么子组件每次都会更新。

推荐的方式如下:

```js
import React from 'react';

export default class InlineFunctionComponent extends React.Component {
  setNewStateData = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input
          type="button"
          onClick={this.setNewStateData}
          value="Click For Inline Function"
        />
      </div>
    );
  }
}
```

当然我们也可以将函数绑定移入到`构造函数`中:

```js
import React from 'react';

export default class DelayedBinding extends React.Component {
  constructor() {
    this.state = {
      name: 'Mayank',
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    alert('Button Clicked: ' + this.state.name);
  }

  render() {
    return (
      <input type="button" value="Click" onClick={this.handleButtonClick} />
    );
  }
}
```

### 尽量避免使用内联样式属性

在 `React` 中使用内联样式时浏览器需要花费更多时间来处理脚本和渲染，因为它必须映射传递给实际 CSS 属性的所有样式规则。

```js
import React from 'react';

export default class InlineStyledComponents extends React.Component {
  render() {
    return (
      <>
        <b style={{ backgroundColor: 'blue' }}>Welcome to Sample Page</b>
      </>
    );
  }
}
```

样式 `backgroundColor` 需要转换为等效的 `CSS` 样式属性，然后才应用样式。这样就需要额外的脚本处理和 JS 执行工作，更好的办法是将 CSS 文件导入组件。

### 使用唯一键迭代，避免使用 index 作为 key

当我们需要渲染项目列表时应该为项目添加一个键。键为元素提供了稳定的标识。一个键应该对应列表中的唯一一个元素。键可以用来识别已更改、添加或删除的项目。

这里不推荐使用`index`索引作为 `key`，因为在 React 进行 diff 的时候首先会比较新旧虚拟 DOM 的 `key` 是否相同，如果不相同的话直接进行替换了。如果 key 相同的情况下会继续比较他们的内容，不同的部分生成新的真实 DOM 进行替换。

都使用`index`作为 key 的话就浪费了不必要的比较性能，另外使用`index`也不太符合 React 的思想规范。

### 合适的业务使用服务端渲染

> 服务端渲染是指第一个组件显示的内容是从服务器本身发送的，而不是在浏览器级别操作。之后的页面直接从客户端加载。

服务端渲染可以减少初始页面加载延迟，我们可以让网页从服务端加载初始页面，而不是在客户端上渲染，这样对 SEO 非常有利。

这样我们就能把初始内容放在服务端渲染，客户端只按需加载部分页面。

- 性能：初始页面内容和数据是从服务器本身加载的，因此我们不需要添加加载器和下拉列表，而是等待初始页面加载完毕后再加载初始组件。

- SEO 优化：爬虫在应用初始加载时查找页面内容。在客户端渲染时初始 Web 页面不包含所需的组件，这些组件需要等 React 脚本等文件加载完毕后才渲染出来。
