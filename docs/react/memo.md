---
title: React.memo 与 useMemo
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: react
  path: /react/project
---

# React.memo 与 useMemo

- 2022.06.23

## React.memo

`React.memo` 是一个**高阶组件**。与纯组件类似，如果输入 `props` 相同则跳过组件渲染，从而提升组件性能。

它会记忆上次某个输入 `props` 的执行输出并提升应用性能。虽然在这些组件中也是浅比较。

我们也可以为这个组件传递自定义`逻辑深度对比（deep comparison）对象`。如果比较函数返回 `false` 则重新渲染组件，否则就不会重新渲染，不过一般不建议这么去做，有的时候深比较的性能比重新渲染还要差。

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

## useMemo

`React.useMemo` 是 `React` 内置 `Hooks` 之一，主要为了解决函数组件在频繁 `render` 时，无差别频繁触发无用的昂贵计算 ，一般会作为性能优化的手段之一。

```js
const App = (props) => {
  const [boolean, setBoolean] = useState(false);
  const [start, setStart] = useState(0);

  // 这是一个非常耗时的计算
  const result = computeExpensiveFunc(start);
};
```

在上面例子中， `computeExpensiveFunc` 是一个非常耗时的计算，但是当我们触发 `setBoolean` 时，组件会重新渲染， `computeExpensiveFunc` 会执行一次。这次执行是毫无意义的，因为 `computeExpensiveFunc` 的结果只与 `start` 有关系。

`React.useMemo` 就是为了解决这个问题诞生的，它可以指定只有当 `start` 变化时，才允许重新计算新的 `result` 。

另外的一个例子，对于无状态组件，数据更新就等于函数上下文的重复执行。那么函数里面的变量，方法就会重新声明。比如如下情况。

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

每次点击 `button` 的时候，都会执行 `Index函数`。`handerClick1` , `handerClick2`, `handerClick3`都会重新声明。为了避免这个情况的发生，我们可以用 `useMemo` 做缓存，我们可以改成如下：

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
