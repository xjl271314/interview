---
title: react hooks核心原理与使用
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# React Hooks

- 2021.08.17

## 前言

在早期的 `React` 工程中，编写的较多的是 `class` 组件，另外官方也提供了一种函数式组件的编写方式，用于编写那些仅接收 `props` 而进行渲染的组件。

但随着业务的复杂度变深，早期的一些纯函数式组件需要进行维护自己的内部 `state`，一种方式是统一交给父组件进行处理回调事件，另一种方式是采用数据管理框架类似 `redux`、`mobx` 这种，还有一种比较普遍的方式就是将原先的函数式组件重新书写为了 `class` 组件。

上面的这几种方式都非常不友好，需要重新组织我们的组件结构，当修改的地方比较多的时候就会非常麻烦，测试起来也非常的不方便。

有没有什么办法能解决长期以来的困扰? 后来 `Hooks` 诞生了。

## 定义

那么什么是 Hooks?

> Hooks 是 React 16.8 版本中新增的特性，它可以让我们在不编写 `class` 的情况下使用 `state` 以及其他的 `React` 特性，它跟我们早期的函数式组件非常的相似，但是其内部可以维护自己的状态，也可以发起网络请求。

## 规则

`Hooks` 使用起来非常方便，但是需要遵循以下的规则：

1. **只在最顶层使用 Hook,不要在循环，条件或嵌套函数中调用 Hook**

   `确保总是在 React 函数的最顶层调用他们。`

   遵守这条规则，我们就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 `React` 能够在多次的 `useState` 和 `useEffect` 调用之间保持 `hook` 状态的正确。

   为什么需要这么做，具体的原因我们等后面源码分析的时候再看。

2. **只在 React 函数中调用 Hook.**

   类似 `useState` 这样的钩子函数只能够在函数式组件中使用，不能用在 `class` 组件内。

## 官方 Hooks

在 `React` 内部提供的 `Hooks` 中，凡是 use 开头的 `React API` 都是 `Hooks`。

我先从官方的 Hook 开始看看如何去使用:

## useState

> `useState` 用于在组件内部维护`state`，`React` 会在重复渲染时保留这个 `state`。

```js
const [state, setState] = useState(initialState);
```

- `initialState` 是我们传入的默认值，一般来说都是一个基本类型的变量，也可以是一个函数，函数的场景一般用于计算得到比较复杂的初始值。

- `useState`的 返回值为一个数组，数组的第一个参数为我们需要使用的 `state`，第二个参数为一个改变 `state` 的函数（功能和 `this.setState`类似，但是不能进行回调操作）。

我们来看看如何使用`useState`改造 `class` 组件。

- class 组件

```jsx
import React from 'react';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

- Hooks 组件

```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default Example;
```

上述例子中，我们定义了一个 `useState` 钩子，之前说到当我们使用 `useState` 定义 `state` 变量的时候，它返回一个有两个值的数组。

- 第一个值是当前的 state。

- 第二个值是更新 state 的函数。

而使用 `[0]` 和 `[1]` 来访问有点令人困惑，因为它们有特定的含义，这就是我们使用`数组解构`的原因。

```js
// 未解构
const myCount = useState(0);
const count = myCount[0];
const setCount = myCount[1];

// 解构
const [count, setCount] = useState(0);
```

### QA：如何使用多个 state?

当我们需要使用多个 `state` 变量的时候我们只需要再次调用 `useState` 钩子函数，并且传入不同的变量名即可。

- class 组件

```jsx
import React from 'react';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      age: 42,
      fruit: 'banana',
      todos: [
        {
          id: 1,
          text: '学习 Hooks',
        },
        {
          id: 2,
          text: '下班打豆豆',
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <h2>
          I'm {this.state.age} years old，I like eat {this.state.fruit}，this is
          my today todo list
        </h2>
        <ul>
          {this.state.todos.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </div>
    );
  }
}
```

- Hooks 组件

```jsx
import React, { useState } from 'react';

export default function Example() {
  // 声明多个 state 变量
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: '学习 Hooks',
    },
    {
      id: 2,
      text: '下班打豆豆',
    },
  ]);

  return (
    <div>
      <h2>
        I'm {age} years old，I like eat {fruit}，this is my today todo list
      </h2>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

上述方式的话，我们去更新 `state` 的时候需要去调用每个 `state` 的更新方法，是不是可以像 `this.setState` 的方式一样去更新呢?

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

export default function Example() {
  // 声明单个state 变量
  const [state, setState] = useState({
    age: 42,
    fruit: 'banana',
    todos: [
      {
        id: 1,
        text: '学习 Hooks',
      },
      {
        id: 2,
        text: '下班打豆豆',
      },
    ],
  });

  // 添加todo
  const addTodo = (todo) => () => {
    setState((prevState) => ({
      ...prevState,
      todos: [
        ...prevState.todos,
        {
          id: prevState.todos.length + 1,
          text: todo,
        },
      ],
    }));
  };

  const { age, fruit, todos } = state;

  return (
    <div>
      <h2>
        I'm {age} years old，I like eat {fruit}，this is my today todo list
      </h2>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
      <Button onClick={addTodo('看电视')}>点击我添加一个 看电视的Todo</Button>
    </div>
  );
}
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '当我们使用单个 `state` 对象维护多个内容的时候，我们需要注意的是如果只去单纯的 `setState` 那么整个对象就会变为新的值，所以我们需要仅修改需要改变的对象。';

export default () => <Info type="warning" txt={txt} />;
```

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

export default function Example() {
  // 声明单个state 变量
  const [state, setState] = useState({
    age: 42,
    fruit: 'banana',
    todos: [
      {
        id: 1,
        text: '学习 Hooks',
      },
      {
        id: 2,
        text: '下班打豆豆',
      },
    ],
  });

  // 添加todo
  const addTodo = (todo) => () => {
    setState((prevState) => ({
      todos: [
        {
          id: prevState.todos.length + 1,
          text: todo,
        },
      ],
    }));
  };

  const { age, fruit, todos } = state;

  return (
    <div>
      <h2>
        I'm {age} years old，I like eat {fruit}，this is my today todo list
      </h2>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
      <Button type="danger" onClick={addTodo('看电视')}>
        点击修改state为看电视的Todo
      </Button>
    </div>
  );
}
```

### QA：如何在 state 变更为最新值后进行一些操作?

我们知道在 `class` 组件中，在调用 `setState` 时第二个参数是一个回调，在回调中我们可以拿到最新的 `state`。那么 `Hooks` 中是否是同样的代码呢?如果不是，要怎么去使用？

- class 组件

```jsx
import React from 'react';
import { Button, Space } from 'antd';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    this.nextCount = this.state.count + 1;
  }

  addCount = () => {
    this.prevCount = this.state.count;
    this.setState(
      {
        count: this.state.count + 1,
      },
      () => {
        this.nextCount = this.state.count + 1;
      },
    );
  };

  render() {
    return (
      <div>
        <ul>
          <li>prevCount: {this.prevCount}</li>
          <li>updatedCount: {this.state.count}</li>
          <li>nextCount: {this.nextCount}</li>
        </ul>
        <Space direction="vertical">
          <Button type="primary" onClick={this.addCount}>
            点击我 Count + 1
          </Button>
          <Button
            type="danger"
            onClick={() => {
              this.forceUpdate();
            }}
          >
            点我强制render
          </Button>
        </Space>
      </div>
    );
  }
}
```

- Hooks 组件

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Space } from 'antd';

export default function App() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(count);
  const nextCount = useRef(count + 1);

  useEffect(() => {
    prevCount.current = count;
    // 这里进行setCount回调处理可以拿到最新的count
    console.log('useEffect', count); // 最新的count
  }, [count]);

  const addCount = () => {
    setCount(count + 1, () => {
      console.log('setCount param 2');
    });
    // 这里count并没有更新还是老的count
    console.log('addCount', count);
    nextCount.current = count + 2;
  };

  const resetCount = () => {
    setCount(0);
    // 如果不去动态修改 prevCount和nextCount 缓存的还是上一个值
  };

  return (
    <div>
      <ul>
        <li>prevCount: {prevCount.current}</li>
        <li>updatedCount: {count}</li>
        <li>nextCount: {nextCount.current}</li>
      </ul>
      <Space>
        <Button type="primary" onClick={addCount}>
          点击我 Count +1
        </Button>

        <Button type="danger" onClick={resetCount}>
          点击我重置Count
        </Button>
      </Space>
    </div>
  );
}
```

因此，在 `Hooks` 组件中 `setState` 只有一个参数，不能接收一个回调，如果要获取到新的状态值，需要通过`useEffect`函数进行获取，如果传入一个回调，在开发模式下就会报错。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt = `\nState updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect();`;

export default () => <Info type="error" txt={txt} />;
```

### QA：如何基于 useState 封装 class 组件的 setState 方法?

- 最先想到的根据 useEffect 示例:

```js
import { useState, useEffect } from 'react';

const useSetState = (initState = '', callback = (state: any) => void 0) => {
  const [state, setState] = useState(initState);

  useEffect(() => {
    callback(state);
  }, [callback, state]);

  return [state, setState];
};

export default useSetState;
```

<!-- ![请添加图片描述](https://img-blog.csdnimg.cn/48eeb4d53f44423bbcd8fd1ec55471e2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16) -->

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { useSetState } from 'interview';

export default function App() {
  const [count, setCount] = useSetState(0, () => {
    message.info(`newCount: ${count}`);
  });

  const addCount = () => {
    setCount((c) => c + 1);
  };

  return (
    <Space direction="vertical">
      <div>当前 count: {count}</div>
      <Button type="primary" onClick={addCount}>
        点击我 Count +1
      </Button>
    </Space>
  );
}
```

这种方式可以实现当 `state` 变更的时候拿到最新的`state`，但是和 `this.setState` 的调用方式并不一致。

- 换种思路，使用`useRef`结合`useEffect`来实现

```js
import { useState, useRef, useEffect } from 'react';

const useStateCallback = (initState: any = '') => {
  const isUpdate = useRef();
  const [state, setState] = useState(initState);

  const setStateCallback = (state: any, cb: any) => {
    setState((prev: any) => {
      isUpdate.current = cb;
      return typeof state === 'function' ? state(prev) : state;
    });
  };

  useEffect(() => {
    if (isUpdate.current) {
      console.log('isUpdate.current');
      typeof isUpdate.current === 'function' && isUpdate.current();
    }
  });

  return [state, setStateCallback];
};

export default useStateCallback;
```

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { useStateCallback } from 'interview';

export default function App() {
  const [count, setCount] = useStateCallback(0);
  const [state, setState] = useStateCallback({
    name: 'jack',
    age: 24,
  });

  const addCount = () => {
    setCount(
      (c) => c + 1,
      (newCount) => {
        message.success(`最新的count：${newCount}`);
      },
    );
  };

  const changeInfo = () => {
    setState(
      {
        name: 'Lucky',
      },
      (state) => {
        message.success(`修改成功,当前用户信息，${state.name} ${state.age}`);
      },
    );
  };

  return (
    <Space>
      <div>
        <div>当前 count: {count}</div>
        <Button type="primary" onClick={addCount}>
          点击我 Count +1
        </Button>
      </div>
      <div>
        <div>当前 用户昵称: {state.name}</div>
        <div>当前 用户年龄: {state.age}</div>
        <Button onClick={changeInfo}>点击我修改用户昵称为Lucky</Button>
      </div>
    </Space>
  );
}
```

- 使用`Promise`来处理

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { useStatePromise } from 'interview';

export default function App() {
  const [state, setState] = useStatePromise({
    name: 'jack',
    like: 'banana',
    count: 0,
  });

  const changeInfo = () => {
    setState({ like: 'watermelon' }).then((res) => {
      console.log(res);
    });
  };

  const addCount = () => {
    setState((prev) => ({ count: prev.count + 1 })).then((res) => {
      console.log(res);
    });
  };

  return (
    <Space>
      <Space direction="vertical">
        <div>当前 用户昵称: {state.name}</div>
        <div>当前 用户喜欢: {state.like}</div>
        <Button onClick={changeInfo}>点击我修改水果为watermelon</Button>
      </Space>
      <Space direction="vertical">
        <div>当前 count {state.count}</div>
        <Button onClick={addCount}>点击我count+1</Button>
      </Space>
    </Space>
  );
}
```

## useEffect

> 使用 `useEffect`函数可以让我们在函数中执行副作用操作(获取数据、设置订阅，手动更改 DOM)，该钩子可以替代 `class` 中的 `componentDidMount` 生命周期和 `componentDidUpdate`、`componentwillreceiveprops` 生命周期以及`componentWillUnMount`生命周期。

```js
useEffect(() => {
  // fn
}, [dependence]);
```

- `dependence`: 当依赖变更的时候会触发内部的函数

- `fn`: 内部执行的函数

```js
import React, { useEffect } from 'react';

function Example() {
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return null;
}
```

### 模拟 componentDidMount 生命周期

要实现 `componentDidMount` 生命周期非常简单，只需要将`useEffect`的依赖设置为空数组即可。

- class 组件

```jsx
import React from 'react';
import { Button } from 'antd';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      logs: [],
    };
  }

  addLogs = (log) => {
    this.setState((prevState) => ({
      logs: [...prevState.logs, log],
    }));
  };

  componentDidMount() {
    this.addLogs(
      `模拟 componentDidMount 生命周期-------class组件componentDidMount生命周期触发,You clicked ${this.state.count} times`,
    );
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <Button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </Button>
        <ol>
          {this.state.logs?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
    );
  }
}
```

- Hooks 组件

```jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

export default function Example() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLogs = (log) => {
    setLogs([...logs, log]);
  };

  useEffect(() => {
    addLogs(
      `使用useEffect模拟 componentDidMount 生命周期触发,
      You clicked ${count} times`,
    );
  }, []);

  return (
    <div>
      <p>You clicked {count} times</p>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
      <ol>
        {logs.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  );
}
```

### 模拟 componentDidUpdate 生命周期

要实现 `componentDidUpdate` 生命周期也非常简单，不过在仅用`useEffect`实现的情况下初次的`componentDidMount`生命周期也会触发。

- class 组件

```jsx
import React from 'react';
import { Button } from 'antd';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      logs: [],
    };
  }

  componentDidMount() {
    console.log(
      `模拟 componentDidUpdate 生命周期-------class组件componentDidMount生命周期触发,
      You clicked ${this.state.count} times`,
    );
  }

  componentDidUpdate() {
    console.log(
      `使用 useEffect 模拟 componentDidUpdate 生命周期-------class组件componentDidUpdate生命周期触发,
      You clicked ${this.state.count} times`,
    );
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <Button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </Button>
      </div>
    );
  }
}
```

- Hooks 组件

```jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

export default function Example() {
  const [count, setCount] = useState(0);

  // 初次componentDidMount 和每次componentDidUpdate都会触发
  useEffect(() => {
    console.log(
      `使用 useEffect 模拟 componentDidUpdate 生命周期,You clicked ${count} times`,
    );
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
    </div>
  );
}
```

### 模拟 componentWillUnMount 生命周期

在 `class` 组件中，我们可以使用 `componentWillUnMount` 生命周期来清除一些异步请求、定时器等资源。要在`useEffect`中实现的话需要知道其针对副作用的处理方式。

**首先在 React 组件中有两种常见副作用操作:**

1. `不需要清除的。`

   不需要清除的就类似上面的几个示例，这里不再展开。

2. `需要清除的，如定时器、异步请求。`

   例如订阅外部数据源。这种情况下，清除工作是非常重要的，可以防止引起内存泄露！现在让我们来比较一下如何用 `Class` 和 `Hook` 来实现。

- class 组件

```js
import React from 'react';

class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange,
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange,
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline,
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

- Hooks 组件

在`useEffect`中设计了一个 `return` 的操作，如果我们返回了一个函数，那么该函数可以在组件卸载的时候执行，因此来实现`componentWillUnMount`生命周期。

```js
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

### QA：useEffect 假如有多个依赖的情况下是如何去执行的？

我们知道`useEffect`的依赖是一个数组，假如数组中有多个元素，当数组中任意一个元素发生变更的时候，`useEffect`函数都会执行。

```jsx
import React, { useState, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { timestampToTime } from 'interview';

const App = () => {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    message.info(`当前时间：${timestampToTime(time)}， 当前count: ${count}`);
  }, [count, time]);

  const updateTime = () => setTime(Date.now());

  const updateCount = () => setCount((c) => c + 1);

  return (
    <div>
      <p>当前时间:{timestampToTime(time)}</p>
      <p>当前Count: {count}</p>

      <Space>
        <Button onClick={updateTime} type="primary">
          点击我同步本地时间
        </Button>
        <Button onClick={updateCount}>点击count+1</Button>
      </Space>
    </div>
  );
};

export default App;
```

### QA：如何使用多个 useEffect 实现关注点分离？

上述代码中我们在一个`useEffect`中去监听了`count`和 `time` 的变化，实际上这两个变化是互不相关的，合理的做法是使用多个`useEffect`拆分逻辑。

```jsx
import React, { useState, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { timestampToTime } from 'interview';

const App = () => {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(Date.now());

  const updateTime = () => setTime(Date.now());

  const updateCount = () => setCount((c) => c + 1);

  useEffect(() => {
    // todo with count变化
  }, [count]);

  useEffect(() => {
    // todo with time变化
  }, [time]);

  return (
    <div>
      <p>当前时间:{timestampToTime(time)}</p>
      <p>当前Count: {count}</p>

      <Space>
        <Button onClick={updateTime} type="primary">
          点击我同步本地时间
        </Button>
        <Button onClick={updateCount}>点击count+1</Button>
      </Space>
    </div>
  );
};

export default App;
```

### QA：如何在 useEffect 中使用异步函数?

在 `useEffect`中我们是不能直接用 `async`、`await` 语法糖的，例如下面的代码是不正确的:

```js
useEffect(async () => {
  /* 请求数据 */
  const res = await getData();
}, []);
```

我们可以在控制台看到以下的错误:

![错误](https://img-blog.csdnimg.cn/fc69dcd7967d42c2ba6ef9324c2fdd0a.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

推荐的正确使用方式主要有 2 种:

- 使用 IIFE 函数

```js
useEffect(() => {
  (async function getDatas() {
    await getData();
  })();
}, []);
```

- 使用单独内部定义后使用(官方推荐)

```js
useEffect(() => {
  const getDatas = async () => {
    const data = await getData();
    setData(data);
  };
  getDatas();
}, []);
```

#### 为什么在组件内部调用 useEffect？

将 `useEffect` 放在组件内部让我们可以在 `effect` 中直接访问 `state` 变量（或其他 props）。我们不需要特殊的 `API` 来读取它 ———— 它已经保存在函数作用域中。`Hook` 使用了 `JavaScript` 的闭包机制，而不用在 `JavaScript` 已经提供了解决方案的情况下，还引入特定的 `React API`。

#### useEffect 会在每次渲染后都执行吗？

是的，默认情况下，`useEffect`在第一次渲染之后和每次更新之后都会执行。我们可能会更容易接受 `effect` 发生在**渲染之后**这种概念，不用再去考虑**挂载**还是**更新**。React 保证了每次运行 `effect` 的同时，DOM 都已经更新完毕。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 `effect` 不会阻塞浏览器更新屏幕，这让我们的应用看起来响应更快。大多数情况下，`effect` 不需要同步地执行。\n\n在个别情况下（例如测量布局），有单独的 `useLayoutEffect Hook` 供我们使用，其 API 与 `useEffect` 相同。';

export default () => <Info type="info" txt={txt} />;
```

### useLayoutEffect

> `useLayoutEffect` 的用法跟 `useEffect` 的用法是完全一样的，都可以执行副作用和清理操作。它们之间唯一的区别就是**执行的时机**。

- `useEffect`不会阻塞浏览器的绘制任务，它在页面更新后才会执行。

- `useLayoutEffect` 跟 `componentDidMount` 和 `componentDidUpdate` 的执行时机一样，会阻塞页面的渲染。如果在里面执行耗时任务的话，页面就会卡顿。

唯一使用`useLayoutEffect`的场景就是需要根据新的 UI 来进行 DOM 操作的场景。`useLayoutEffect` 会保证在页面渲染前执行，也就是说页面渲染出来的是最终的效果。如果使用 `useEffect`，页面很可能因为渲染了 **2** 次而出现抖动。

### useContext

> `useContext` 接收一个 `context` 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。

- 当前的 `context` 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` 属性决定。

- 当组件上层最近的 `<MyContext.Provider>` 更新时，该 `Hook` 会触发重渲染，并使用最新传递给 `MyContext provider` 的 `context value` 值。

- 即使祖先使用 `React.memo` 或 `shouldComponentUpdate`，也会在组件本身使用 `useContext` 时重新渲染。

- `useContext(MyContext)` 相当于 `class` 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`

- `useContext(MyContext)` 只是让我们能够读取 `context` 的值以及订阅 `context` 的变化。我们仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件提供 `context`。

```js
const value = useContext(MyContext);
```

- `MyContext`: 该值必须是 context 对象本身。

  - useContext(MyContext) ✅
  - useContext(MyContext.Consumer) ❌
  - useContext(MyContext.Provider) ❌

#### 标准的 context 方式

```js
import React from 'react';
import ReactDOM from 'react-dom';

// 创建 Context
// 它返回一个具有两个值的对象 { Provider, Consumer }
const NumberContext = React.createContext();

function App() {
  // 使用 Provider 为所有子孙代提供 value 值
  return (
    <NumberContext.Provider value={42}>
      <div>
        <Display />
      </div>
    </NumberContext.Provider>
  );
}

function Display() {
  // 使用 Consumer 从上下文中获取 value
  return (
    <NumberContext.Consumer>
      {(value) => <div>The answer is {value}.</div>}
    </NumberContext.Consumer>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

#### 使用 useContext 简化你的代码

```js
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

// 创建 Context
// 它返回一个具有两个值的对象 { Provider, Consumer }
const NumberContext = React.createContext();

function App() {
  // 使用 Provider 为所有子孙代提供 value 值
  return (
    <NumberContext.Provider value={42}>
      <div>
        <Display />
      </div>
    </NumberContext.Provider>
  );
}

function Display() {
  // 使用 useContext 从上下文中获取 value
  const number = useContext(NumberContext);
  return (
    <div>The answer is {number?.value}.</div>}
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

### useReducer

> `useReducer` 和 `redux` 中 `reducer` 很像，它是`useState`的替代方案。

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

- `reducer`: (state, action) => newState

- `initialArg`: 初始化参数

- `init`: 初始化函数

接收一个形如`(state, action) => newState` 的 `reducer`，并返回当前的 `state` 以及与其配套的 `dispatch` 方法。将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 `state` 将被设置为 `init(initialArg)`。

这么做可以将用于计算 `state` 的逻辑提取到 `reducer` 外部，这也为将来对重置 `state` 的 `action` 做处理提供了便利。

#### 使用示例

```jsx
import React, { useReducer } from 'react';
import { Button, Space } from 'antd';

const initialState = {
  count: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>Count: {state.count}</p>
      <Space>
        <Button onClick={() => dispatch({ type: 'decrement' })}>-</Button>
        <Button onClick={() => dispatch({ type: 'increment' })}>+</Button>
      </Space>
    </>
  );
}

export default Counter;
```

### useCallback

> `useCallback`可以用来处理我们的函数，将函数用其包裹起来可以返回一个 `memoized` 版本，该回调函数仅在某个依赖项改变时才会更新。

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- 仅在依赖的 a、b 发生变化的时候重新生成一个`memoized`版本的函数。

#### 使用场景

我们来看一个没有使用`useCallback`导致的组件重复渲染问题。

```jsx
import React, { useState, useEffect } from 'react';
import { message } from 'antd';

// 子组件
const Child = React.memo((props) => {
  const { name, onClick } = props;

  //   useEffect(() => {
  //     // 实例化 默认基于当前视窗
  //     const io = new IntersectionObserver(() => {
  //       message.warning('子组件渲染');
  //     }, [0.25]);

  //     const element = document.querySelector('#demo-unusecallback-child');
  //     io.observe(element);

  //     return () => {
  //       io.unobserve(element);
  //       io.disconnect();
  //     };
  //   }, []);

  return (
    <div id="demo-unusecallback-child">
      <h1>{name}</h1>
      <button onClick={onClick}>修改count</button>
    </div>
  );
});

const App = () => {
  const [count, setCount] = useState(0);
  const callback = () => {
    setCount((c) => c + 1);
  };

  //   useEffect(() => {
  //     // 实例化 默认基于当前视窗
  //     const io = new IntersectionObserver(() => {
  //       message.success('父组件渲染');
  //     }, [0.25]);

  //     const element = document.querySelector('#demo-unusecallback-parent');
  //     io.observe(element);

  //     return () => {
  //       io.unobserve(element);
  //       io.disconnect();
  //     };
  //   }, []);

  return (
    <div id="demo-unusecallback-parent">
      <p>当前Count: {count}</p>
      <Child name="我是子组件，仅接收父组件的onClick事件" onClick={callback} />
    </div>
  );
};

export default App;
```

上述代码中我们定义了一个父组件和子组件，其中父组件中维护了一个`count`的 `state`，子组件接收了一个父组件传入的`onClick`回调，当我们去点击子组件的时候给父组件的`count`进行累加。

我们操作后发现，每次子组件都会重新渲染，但是实际上子组件并不需要去重新渲染。那么是怎么造成的呢?

回顾一个组件重新重新渲染的原因，一般三种情况：

1. 组件自己的状态改变

2. 父组件重新渲染，导致子组件重新渲染，但是父组件的 props 没有改变

3. 父组件重新渲染，导致子组件重新渲染，但是父组件传递的 props 改变

第一种很明显，子组件内部并无状态，自己没有发生改变。

第二种也很明显，我们使用`React.memo()`包裹了组件。

最终我们发现是由于第三种原因导致的也就是父组件传递的 `props` 发生了改变，其中 `name` 我们定义的是常量，也就是`onClick`事件发生了改变。

**由于函数式组件里每次重新渲染，函数组件都会重头开始重新执行，因此父组件重新 `render` 之后，创建的回调函数发生了改变，导致了子组件的重新渲染。**

##### 使用 useCallback 解决问题

```jsx
import React, { useState, useCallback } from 'react';
import { message } from 'antd';
// 子组件
const Child = React.memo((props) => {
  const { name, onClick } = props;
  message.warning('子组件渲染');

  return (
    <>
      <h1>{name}</h1>
      <button onClick={onClick}>修改count</button>
    </>
  );
});

const App = () => {
  const [count, setCount] = useState(0);
  const callback = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  message.success('父组件渲染');

  return (
    <div>
      <p>当前Count: {count}</p>
      <Child name="我是子组件，仅接收父组件的onClick事件" onClick={callback} />
    </div>
  );
};

export default App;
```

这样我们就可以看到只会在首次渲染的时候提示子组件渲染了，当点击子组件按钮的时候不会触发子组件渲染。

### useMemo

> `useMemo` 会记录上一次执行 `callback` 的返回值，并把它绑定在函数组件对应的 `fiber` 对象上，只要组件不销毁，缓存值就一直存在，但是 `deps` 中如果有一项改变，就会重新执行 `callback` ，返回值作为新的值记录到 `fiber` 对象上。

```js
const cacheSomething = useMemo(callback, deps);
```

- `callback`: 需要换缓存的方法

- `deps`: 依赖的变更项

#### useMemo 使用示例

```jsx
import React, { useState, useMemo } from 'react';
import { Button } from 'antd';

function Time() {
  return <p>{timestampToTime()}</p>;
}

function timestampToTime(timestamp = Date.parse(new Date()), isMs = true) {
  const date = new Date(timestamp * (isMs ? 1 : 1000));

  const formt = (time) => (time < 10 ? '0' + time : time);

  return `${date.getFullYear()}-${formt(
    date.getMonth() + 1,
  )}-${date.getDate()} ${formt(date.getHours())}:${formt(
    date.getMinutes(),
  )}:${formt(date.getSeconds())}`;
}

function Counter() {
  const [count, setCount] = useState(0);

  const memoizedChildComponent = useMemo(
    (count) => {
      return <Time />;
    },
    [count],
  );

  return (
    <div>
      <div>{memoizedChildComponent}</div>
      <h1>{count}</h1>
      <Button onClick={() => setCount(count + 1)}>点我count+1</Button>
    </div>
  );
}

export default Counter;
```

实际上 `useMemo` 的作用不止于此，根据官方文档内介绍：以把一些昂贵的计算逻辑放到 `useMemo` 中，只有当依赖值发生改变的时候才去更新。

```jsx
import React, { useState, useMemo } from 'react';
import { message, Button, Space } from 'antd';

// 计算和的函数，开销较大
function calcNumber(count) {
  let total = 0;
  for (let i = 1; i <= count; i++) {
    total += i;
  }
  return total;
}
export default function MemoHookDemo() {
  const [count, setCount] = useState(100000);
  const [show, setShow] = useState(true);
  const total = useMemo(() => {
    return calcNumber(count);
  }, [count]);

  return (
    <div>
      <h2>计算数字的和: {total}</h2>
      <h2>当前的show: {show.toString()}</h2>
      <Space>
        <Button onClick={(e) => setCount(count + 1)}>+1</Button>
        <Button onClick={(e) => setShow(!show)}>show切换</Button>
      </Space>
    </div>
  );
}
```

#### useCallback 和 useMemo 总结

- `useCallback` 缓存的是函数，`useMemo` 缓存的是函数的返回的结果。

- `useCallback` 主要是来优化子组件的，防止子组件的重复渲染，`useMemo` 可以优化当前组件也可以优化子组件，优化当前组件主要是通过 `memoize` 来将一些复杂的计算逻辑进行缓存。

我们可以将 `useMemo` 的返回值定义为返回一个函数这样就可以变通的实现了 `useCallback`。

```js
useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。
```

### useRef

> `useRef`返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。返回的 `ref` 对象在组件的整个生命周期内保持不变。

```js
const refContainer = useRef(initialValue);
```

#### 使用 useRef 来获取 DOM 元素

通过使用 `useRef` 接收缓存数据的初始值，返回值可以被 `dom` 元素 `ref` 标记，可以获取被标记的元素节点.

- class 组件

在`class`组件中我们可以通过`React.createRef()`来获取组件的`ref`值，但是每次重新渲染组件都会重新创建 `ref`。

```jsx
import React from 'react';
import { Input, message } from 'antd';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      //   this.myRef.current.focus();
    }, 50);
  }

  onFocus = () => {
    message.info('class Input Focus');
  };

  render() {
    return (
      <Input
        ref={this.myRef}
        onFocus={this.onFocus}
        placeholder="请输入搜索内容"
      />
    );
  }
}

export default MyComponent;
```

- Hooks 组件

```jsx
import React, { useEffect, useRef } from 'react';
import { Input } from 'antd';

const App = () => {
  const myRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      //   myRef.current.focus();
    }, 50);
  }, []);

  return <Input ref={myRef} placeholder="请输入搜索内容" />;
};

export default App;
```

#### 使用 useRef 缓存数据

`useRef` 还有一个很重要的作用就是缓存数据。

我们可以通过 `usestate`，`useReducer`来保存当前的数据源的，但是如果它们更新数据源的函数执行必定会带来整个组件从新执行到渲染，如果在函数组件内部声明变量，则下一次更新也会重置，但使用 `useRef` 在创建后就不会再变更了。

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'antd';

function Example() {
  const [count, setCount] = useState(0);

  const numRef = useRef(count);

  useEffect(() => {
    numRef.current = count;
  }, [count]);

  return (
    <div>
      <h2>count上一次的值: {numRef.current}</h2>
      <h2>count这一次的值: {count}</h2>
      <Button type="primary" onClick={(e) => setCount(count + 10)}>
        +10
      </Button>
    </div>
  );
}
export default Example;
```

### useImperativeHandle

> 使用 `useImperativeHandle` 可以让我们在使用 `ref` 时，自定义暴露给父组件的实例值。

不过在大多数情况下，应当避免使用 `ref` 这样的命令式代码，另外 `useImperativeHandle` 应当与 `forwardRef` 一起使用。

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Button, Input, Space } from 'antd';

function Child(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));
  return <Input style={{ width: 200 }} ref={inputRef} placeholder="输入内容" />;
}
Child = forwardRef(Child);

function Parent() {
  const parentRef = useRef();

  const getFocus = () => {
    parentRef.current.focus();
  };

  return (
    <Space>
      <Child ref={parentRef} />
      <Button onClick={getFocus}>获得焦点</Button>
    </Space>
  );
}

export default Parent;
```

## 自定义 Hooks

关于自定义实现的各类 Hooks，这里推荐几个比较好的类库

- [react-use](https://github.com/streamich/react-use) 6.8K+
- [alibab a hooks](https://github.com/alibaba/hooks) 24.6K+

### useDidMount

根据 `useEffect` 可以封装一个 `useDidMount` 钩子函数。

```js
import { useEffect } from 'react';

export const useDidMount = (fn) => {
  useEffect(() => {
    typeof fn === 'function' && fn();
  }, []);
};
```

### useUnMount

根据 `useEffect` 可以封装一个 `useUnMount` 钩子函数。

```js
import { useEffect } from 'react';

export const useUnMount = (fn) => {
  useEffect(
    () => () => {
      typeof fn === 'function' && fn();
    },
    [],
  );
};
```

### useLifecycles

我们还可以根据`useEffect`封装一个 `didMount` 和 `willUnMount` 的生命周期钩子。

```js
import { useEffect } from 'react';

export const useLifecycles = (mount, unmount) => {
  const isFunction = (e) => typeof e === 'function';
  useEffect(() => {
    if (isFunction(mount)) {
      mount();
    }
    return () => {
      if (isFunction(unmount)) {
        unmount();
      }
    };
  }, []);
};

useLifecycles(
  () => console.log('componentDidMount'),
  () => console.log('componentWillUnMount'),
);
```

### useDidUpdate

我们还可以通过`useEffect`和 `useRef`来封装一个`componentDidUpdate`的生命周期钩子。

关键就是忽略第一次 `mount` 的执行时机。

```js
import { useEffect, useRef } from 'react';

export const useDidUpdate = (fn, deps) => {
  const isInitialMount = useRef(false);

  useEffect(
    !isInitialMount.current
      ? () => {
          isInitialMount.current = true;
        }
      : fn,
    deps,
  );
};

useDidUpdate(() => {
  console.log('useDidUpdate');

  return () => {
    // do something on unmount
  };
});
```

### usePrevious

上述我们看到`useRef`可以用来缓存变量，因此针对此功能，我们可以封装一个常用的 Hook 来保存变量更新前的值。

```js
import { useRef, useEffect } from 'react';

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
```

### useTimeout

在指定的毫秒数后返回 true。

```js
import { useEffect, useState } from 'react';

export const useTimeout = (ms: number = 0) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, ms);

    return () => {
      clearTimeout(timer);
    };
  }, [ms]);

  return ready;
};
```

### useTimeoutFn

在指定的毫秒数后执行传入的函数。

```js
import React, { useEffect, useState } from 'react';

const useTimeoutFn = (fn, ms = 0) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      typeof fn === 'function' && fn();
    }, ms);

    return () => {
      clearTimeout(timer);
    };
  }, [ms]);

  return ready;
};
```

## 核心原理

### 引言

在开始讲解 `Hooks` 原理之前我们先来看一个 `class` 与 `Hooks` 的例子:

- class 组件

```jsx
import React, { Component } from 'react';
import { Button } from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      list: [],
    };
  }

  handerClick = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.setState({
          number: this.state.number + 1,
          list: [...this.state.list, this.state.number + 1],
        });
      }, 1000);
    }
  };

  render() {
    return (
      <div>
        <h2>class组件在setTimeout中使用this.setState</h2>
        <ul>
          {this.state.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Button onClick={this.handerClick}>点我展示结果</Button>
      </div>
    );
  }
}

export default App;
```

- Hooks 组件

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [num, setNumber] = useState(0);
  const [list, setList] = useState([]);

  const handerClick = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setNumber(num + 1);
        setList((pl) => [...pl, num]);
      }, 1000);
    }
  };
  return (
    <div>
      <h2>Hooks组件在setTimeout中使用setState</h2>
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Button onClick={handerClick}>点我展示结果</Button>
    </div>
  );
};

export default App;
```

这个结果乍一看有点懵逼，但是仔细一回想确实是这么个逻辑。

之前在[setState](/react/project/set-state)中提到过，由于`this.setState`是在`setTimeout`中去执行的，内部的批量更新条件被破坏，`scheduleUpdateOnFiber` 在 `ensureRootIsScheduled` 调用结束后，会直接调用 `flushSyncCallbackQueue` 方法，这个方法就是用来更新 `state` 并重新进行 `render`。因此每次循环一结束就会调用。

但是在函数式组件中，没有像 `class` 组件维护组件内部的各种状态，每一次函数上下文执行时，所有的变量和常量都是重新声明的。

所以无论`setTimeout`执行多少次，都是在当前的函数上下文执行，此时`num = 0`不会变，之后 `setNumber` 执行，函数组件重新执行之后，`num` 才变化。

因此我们需要一种机制，可以实现在函数式组件中，保存一些状态，执行一些副作用，react Hooks 应运而生。

### useState 是怎么实现的?

我们以 `useState` 为例子，当在项目中引入该函数的时候它的执行路径是怎么样的？

```js
import { useState } from 'react';
```

我们可以发现内部的源码在[/react/src/ReactHooks.js 中](https://github.com/facebook/react/blob/main/packages/react/src/ReactHooks.js)

```js
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```

内部的代码非常简单仅有 2 行，首先定义了一个 `dispatcher`，然后调用了 `dispatcher.useState`，并且传入了初始的 `initialState`。

那么`dispatcher`内部又做了啥?

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  return dispatcher;
}
```

`resolveDispatcher` 的代码也很简单仅返回了`ReactCurrentDispatcher.current`。**但是这个方法非常重要，所有的 Hook 内部都是使用它去调用的**

`ReactCurrentDispatcher` 内部做了啥?

```js
const ReactCurrentDispatcher = {
  current: null,
};
```

我们看到 `ReactCurrentDispatcher.current` 初始化的时候为 `null`，然后就没任何下文了。

因此我们到这一步可以得到:

```
useState(initialState) ————>  dispatcher.useState(initialState) ————> ReactCurrentDispatcher.current.useState(initialState) ————> ReactCurrentDispatcher.current默认为null。
```

但是 `ReactCurrentDispatcher.current` 何时赋值还暂不明确。

### Fiber 调度的开始

要清楚`ReactCurrentDispatcher.current`赋值的情况，我们还得先从函数式组件的执行开始说起。

我们知道在书写 `class` 组件和 `hooks` 组件的时候，`react` 内部会去区分是哪一类组件，不同类型会对应不同的 `tag`。

因为 `class` 组件和`函数式`组件的执行方式是不一样，所以需要进行区分。

在 class 中 React 是这样去判断:

```js
Component.prototype.isReactComponent = {};
```

在 `Hooks` 组件中执行是从 [ReactFiberBeginWork.js](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.new.js) 开始的。

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...其余代码省略

  workInProgress.lanes = NoLanes;

  // 进行组件类型的判断
  switch (workInProgress.tag) {
    // 不确定组件
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type,
        renderLanes,
      );
    }
    // 懒加载组件
    case LazyComponent: {
      const elementType = workInProgress.elementType;
      return mountLazyComponent(
        current,
        workInProgress,
        elementType,
        renderLanes,
      );
    }
    // 函数式组件
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes,
      );
    }
    // 类组件
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes,
      );
    }
    // ...其余代码省略
  }
  invariant(
    false,
    'Unknown unit of work tag (%s). This error is likely caused by a bug in ' +
      'React. Please file an issue.',
    workInProgress.tag,
  );
}
```

第一次加载的时候，`beginWork` 函数中会根据 `workInProgress.tag` 类型进行判断是哪种组件，在确认组件类型前会先走`IndeterminateComponent`这个 `case`，最终调用 `mountIndeterminateComponent` 这个方法。

[mountIndeterminateComponent](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1559)

```js
import { disableLegacyContext } from 'shared/ReactFeatureFlags';

function mountIndeterminateComponent(
  _current,
  workInProgress,
  Component,
  renderLanes,
) {
  if (_current !== null) {
    // An indeterminate component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null;
    // Since this is conceptually a new fiber, schedule a Placement effect
    workInProgress.flags |= Placement;
  }

  const props = workInProgress.pendingProps;
  let context;
  if (!disableLegacyContext) {
    const unmaskedContext = getUnmaskedContext(
      workInProgress,
      Component,
      false,
    );
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  prepareToReadContext(workInProgress, renderLanes);
  // 定义渲染出来的APP组件
  let value;

  if (enableSchedulingProfiler) {
    markComponentRenderStarted(workInProgress);
  }
  /**
   * 返回渲染生成的App组件
   * @param 'current Fiber'
   * @param 'workInProgress Fiber'
   * @param '函数组件本身'
   * @param 'props'
   * @param '上下文'
   * @param '渲染 ExpirationTime'
   */
  value = renderWithHooks(
    null,
    workInProgress,
    Component,
    props,
    context,
    renderLanes,
  );

  if (enableSchedulingProfiler) {
    markComponentRenderStopped();
  }
  // ...省略其他代码
  workInProgress.tag = FunctionComponent;
  reconcileChildren(null, workInProgress, value, renderLanes);

  return workInProgress.child;
}
```

### renderWithHooks 执行函数

我们渲染出来的组件是通过`renderWithHooks`这个方法返回的，当没有初始化的时候传入是`null`，更新一次后会把当前的`workInProgress`树赋值给 `current` 树。

[renderWithHooks](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js#L351)

```js
export function renderWithHooks(
  current,
  workInProgress,
  Component,
  props,
  secondArg,
  nextRenderLanes,
) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber = workInProgress;

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  // 设置 workInProgress 优先级为 NoLanes(最高优先级)
  workInProgress.lanes = NoLanes;

  // 终于看到了ReactCurrentDispatcher.current赋值的地方
  ReactCurrentDispatcher.current =
    current === null || current.memoizedState === null
      ? HooksDispatcherOnMount
      : HooksDispatcherOnUpdate;

  // 真正执行组件
  let children = Component(props, secondArg);

  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    // ....这里的逻辑我们先放一放
  }

  // 修改dispatcher为ContextOnlyDispatcher
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  const didRenderTooFewHooks =
    currentHook !== null && currentHook.next !== null;

  renderLanes = NoLanes;
  currentlyRenderingFiber = null;

  currentHook = null;
  workInProgressHook = null;

  didScheduleRenderPhaseUpdate = false;

  if (enableLazyContextPropagation) {
    if (current !== null) {
      if (!checkIfWorkInProgressReceivedUpdate()) {
        const currentDependencies = current.dependencies;
        if (
          currentDependencies !== null &&
          checkIfContextChanged(currentDependencies)
        ) {
          markWorkInProgressReceivedUpdate();
        }
      }
    }
  }
  return children;
}
```

上述代码中涉及了几个概念:

- `current fiber 树`:当完成一次渲染之后，会产生一个 `current` 树,`current` 会在 `commit` 阶段替换成真实的 DOM 树。

- `workInProgress fiber树`:即将调和渲染的 `fiber` 树。在一次新的组件更新过程中，会从 `current` 复制一份作为 `workInProgress`,更新完毕后，将当前的 `workInProgress` 树赋值给 `current` 树。

- `workInProgress.memoizedState`: 在 `class` 组件中，memoizedState 存放 state 信息，在 function 组件中，memoizedState 在一次调和渲染过程中，以链表的形式存放 hooks 信息。

- `currentHook` : 可以理解为 `current`树上的指向的当前调度的 hooks 节点。

- `workInProgressHook` : 可以理解 `workInProgress` 树上指向的当前调度的 hooks 节点。

了解了这些概念之后我们来看看 `renderWithHooks`做了些什么事情。

1. 首先先置空即将调和渲染的 `workInProgress` 树的 `memoizedState` 和 `updateQueue`。

   为什么这么做，因为在接下来的函数组件执行过程中，要把新的 `hooks` 信息挂载到这两个属性上，然后在组件 `commit` 阶段，将 `workInProgress` 树替换成 `current` 树，替换真实的 DOM 元素节点，并在 `current` 树保存 `hooks` 信息。

2. 然后根据当前函数组件是否是第一次渲染，赋予 `ReactCurrentDispatcher.current` 不同的 `hooks`，终于看到了 `ReactCurrentDispatcher`进行赋值的地方。

   这里会进行是 `mount` 阶段还是 `update` 阶段进行赋值判断。**判断的依据就是 current 树上是否存在 memoizedState(hooks 保存的信息)，如果不存在的话，证明组件是第一次渲染。**

   - 如果是 `mount` 阶段，`ReactCurrentDispatcher.current = HooksDispatcherOnMount`；[HooksDispatcherOnMount](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js#L2090)

     ```js
     const HooksDispatcherOnMount: Dispatcher = {
       readContext,

       useCallback: mountCallback,
       useContext: readContext,
       useEffect: mountEffect,
       useImperativeHandle: mountImperativeHandle,
       useLayoutEffect: mountLayoutEffect,
       useMemo: mountMemo,
       useReducer: mountReducer,
       useRef: mountRef,
       useState: mountState,
       useDebugValue: mountDebugValue,
       useDeferredValue: mountDeferredValue,
       useTransition: mountTransition,
       useMutableSource: mountMutableSource,
       useOpaqueIdentifier: mountOpaqueIdentifier,

       unstable_isNewReconciler: enableNewReconciler,
     };
     ```

   - 如果是 `update` 阶段，`ReactCurrentDispatcher.current = HooksDispatcherOnUpdate`；

     ```js
     const HooksDispatcherOnUpdate: Dispatcher = {
       readContext,

       useCallback: updateCallback,
       useContext: readContext,
       useEffect: updateEffect,
       useImperativeHandle: updateImperativeHandle,
       useLayoutEffect: updateLayoutEffect,
       useMemo: updateMemo,
       useReducer: updateReducer,
       useRef: updateRef,
       useState: updateState,
       useDebugValue: updateDebugValue,
       useDeferredValue: updateDeferredValue,
       useTransition: updateTransition,
       useMutableSource: updateMutableSource,
       useOpaqueIdentifier: updateOpaqueIdentifier,

       unstable_isNewReconciler: enableNewReconciler,
     };
     ```

3. 接下来，调用 `Component(props, secondArg);`执行我们的函数组件，我们的函数组件在这里真正的被执行了，然后，我们写的 `hooks` 被依次执行，把 `hooks` 信息依次保存到 `workInProgress` 树上。`Hooks`是怎么去保存的后面会讲到。

4. 然后，将 [ContextOnlyDispatcher](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js#L2065) 赋值给 `ReactCurrentDispatcher.current`。

   ```js
   export const ContextOnlyDispatcher: Dispatcher = {
     readContext,

     useCallback: throwInvalidHookError,
     useContext: throwInvalidHookError,
     useEffect: throwInvalidHookError,
     useImperativeHandle: throwInvalidHookError,
     useLayoutEffect: throwInvalidHookError,
     useMemo: throwInvalidHookError,
     useReducer: throwInvalidHookError,
     useRef: throwInvalidHookError,
     useState: throwInvalidHookError,
     useDebugValue: throwInvalidHookError,
     useDeferredValue: throwInvalidHookError,
     useTransition: throwInvalidHookError,
     useMutableSource: throwInvalidHookError,
     useOpaqueIdentifier: throwInvalidHookError,

     unstable_isNewReconciler: enableNewReconciler,
   };

   function throwInvalidHookError() {
     invariant(
       false,
       'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
         ' one of the following reasons:\n' +
         '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
         '2. You might be breaking the Rules of Hooks\n' +
         '3. You might have more than one copy of React in the same app\n' +
         'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.',
     );
   }

   function invariant(condition, format, a, b, c, d, e, f) {
     throw new Error(
       'Internal React error: invariant() is meant to be replaced at compile ' +
         'time. There is no runtime version.',
     );
   }
   ```

原来如此，`react hooks` 就是通过这种函数组件执行赋值不同的 `hooks` 对象方式，判断`hooks` 执行是否在函数组件内部，捕获并抛出异常的。

### HooksDispatcherOnMount 和 HooksDispatcherOnUpdate

`renderWithHooks`中我们提到了 `ReactCurrentDispatcher` 在 `mount` 和 `update` 阶段会采用不用的 hook。这里用流程图来描述下整个过程。

![renderWithHooks执行流程](https://img-blog.csdnimg.cn/41f79eba7e7a44c0ad9e3a354689abef.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## Hooks 初始化流程

我们从上面知道了`dispatcher`的逻辑，但是 Hooks 初始化后的具体流程还不是很清晰，我们以负责组件更新的 `useState`，负责执行副作用 `useEffect`，负责保存数据的 `useRef`，负责缓存优化的 `useMemo` 这几个 `Hooks` 为例看看是如何进行初始化的。

我们直接来看一个例子:

```jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Button, Space } from 'antd';

const App = () => {
  const [number, setNumber] = useState(0);
  const DivDemo = useMemo(() => <div> hello , i am useMemo </div>, []);
  const curRef = useRef(null);
  useEffect(() => {
    console.log('当前ref值', curRef.current);
  }, []);

  return (
    <div ref={curRef}>
      <Space direction="vertical">
        <p>hello,world {number}</p>
        {DivDemo}
        <Button onClick={() => setNumber(number + 1)}>number++</Button>
      </Space>
    </div>
  );
};

export default App;
```

### mountWorkInProgressHook

在组件初始化的时候,每一次 `hooks` 执行，如 `useState()`，`useRef()`都会调用 [mountWorkInProgressHook](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js#L597)。

```js
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    /**
     * useState中 保存 state信息
     * useEffect 中 保存着 effect 对象
     * useMemo 中 保存的是缓存的值和deps
     * useRef中保存的是ref 对象
     **/
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

`mountWorkInProgressHook` 这个函数做的事情很简单，首先每次执行一个 `hooks` 函数，都产生一个 `hook` 对象，里面保存了当前 `hook` 信息，然后将每个 `hooks` 以链表形式串联起来，并赋值给 `workInProgress` 的 `memoizedState`。

**这就是函数组件用 `memoizedState` 存放 `hooks` 链表的由来**。

hook 对象说明

| 参数          | 描述                                                                                                                                   |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| memoizedState | `useState` 中 保存 state 信息、`useEffect` 中 保存着 effect 对象、`useMemo` 中 保存的是缓存的值和 deps、`useRef` 中保存的是 ref 对象。 |
| baseQueue     | `usestate` 和 `useReducer` 中 保存最新的更新队列。                                                                                     |
| baseState     | `usestate` 和 `useReducer` 中,一次更新中 ，产生的最新 state 值。                                                                       |
| queue         | 保存待更新队列 `pendingQueue` ，更新函数 `dispatch` 等信息。                                                                           |
| next          | 指向下一个 `hooks` 对象。                                                                                                              |

那么当我们函数组件执行之后，四个 `hooks` 和 `workInProgress` 将是如图的关系。

![workInProgress流程](https://img-blog.csdnimg.cn/585c5ed810a54321a26f0078de1d3183.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_Q1NETiBAeGpsMjcxMzE0,size_28,color_FFFFFF,t_70,g_se,x_16)

知道每个 `hooks` 关系(链表)之后，我们就不难理解为什么不能条件语句中声明 `hooks`了。

假设我们将上述 `demo` 其中的一个 `useRef` 放入条件语句中:

```js
....
let curRef  = null;

if(isFisrt){
  curRef = useRef(null);
}
```

![条件中的hooks](https://img-blog.csdnimg.cn/6432b8607c444456a35882abea5ceb5e.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_Q1NETiBAeGpsMjcxMzE0,size_33,color_FFFFFF,t_70,g_se,x_16)

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '<strong>\n因为一旦在条件语句中声明 `hooks`，在下一次函数组件更新，`hooks` 链表结构，将会被破坏，`current` 树的 `memoizedState` 缓存 `hooks` 信息，和当前 `workInProgress` 不一致，如果涉及到读取 `state` 等操作，就会发生异常。<strong>';

export default () => <Info type="info" txt={txt} />;
```

### useState -> mountState

在组件 `mount` 阶段 `useState` 会调用 `mountState`。

```js
function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    // 如果 useState 第一个参数为函数，执行函数得到state
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes, // 优先级最高
    dispatch: null,
    lastRenderedReducer: basicStateReducer, // 用于得到最新的 state ,
    lastRenderedState: (initialState: any), // 最后一次得到的 state
  });
  const dispatch = (queue.dispatch = dispatchAction.bind(
    // 负责更新的函数
    null,
    currentlyRenderingFiber,
    queue,
  ));

  return [hook.memoizedState, dispatch];
}
```

`mountState`中将初始化传入的`initialState`传入给了 `mountWorkInProgressHook()`产生的 `hook` 对象中的 `memoizedState` 和 `baseState` 属性，然后创建一个 `queue` 对象，里面保存了负责更新的信息。

最终我们返回了一个数组`[hook.memoizedState, dispatch]`，其中第一个参数就是缓存起来的 `state`，第二个参数是一个 `dispatch`，内部调用了`dispatchAction`。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '这里我们看到`useState`中涉及到了`useReducer`的功能，因为实际上 `useState` 就是有默认 `reducer` 参数的 `useReducer`。';

export default () => <Info type="info" txt={txt} />;
```

那么`dispatchAction`内部做了什么?

```js
function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
)
```

我们拿示例代码中的`useState`来看:

```js
const [number, setNumber] = useState(0);
```

其中 `dispatchAction` 就是 `setNumber` , `dispatchAction` 第一个参数和第二个参数，已经被`bind` 给改成 `currentlyRenderingFiber` 和 `queue`,我们传入的参数是第三个参数`action`。

#### dispatchAction 无状态组件更新机制

```js
function dispatchAction(fiber: Fiber, queue: UpdateQueue<S, A>, action: A) {
  // 开发环境提示警告，不能像setState一样传入回调函数。
  if (__DEV__) {
    if (typeof arguments[3] === 'function') {
      console.error(
        "State updates from the useState() and useReducer() Hooks don't support the " +
          'second callback argument. To execute a side effect after ' +
          'rendering, declare it in the component body with useEffect().',
      );
    }
  }

  const eventTime = requestEventTime();
  const lane = requestUpdateLane(fiber);

  // 创建一个update
  const update = {
    lane,
    action,
    eagerReducer: null,
    eagerState: null,
    next: (null: any),
  };

  const alternate = fiber.alternate;
  // 如果是render阶段执行的更新didScheduleRenderPhaseUpdate=true
  if (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    didScheduleRenderPhaseUpdateDuringThisPass =
      didScheduleRenderPhaseUpdate = true;
    const pending = queue.pending;
    if (pending === null) {
      // 如果是第一次更新
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }
    queue.pending = update;
  } else {
    if (isInterleavedUpdate(fiber, lane)) {
      const interleaved = queue.interleaved;
      if (interleaved === null) {
        // 如果是第一次更新
        update.next = update;
        pushInterleavedQueue(queue);
      } else {
        update.next = interleaved.next;
        interleaved.next = update;
      }
      queue.interleaved = update;
    } else {
      const pending = queue.pending;
      if (pending === null) {
        // 如果是第一次更新
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      queue.pending = update;
    }
    // 如果fiber不存在优先级并且当前alternate不存在或者没有优先级，那就不需要更新了
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;

        try {
          const currentState = queue.lastRenderedState;
          const eagerState = lastRenderedReducer(currentState, action);

          update.eagerReducer = lastRenderedReducer;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {
            return;
          }
        } catch (error) {}
      }
    }
    const root = scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (isTransitionLane(lane) && root !== null) {
      let queueLanes = queue.lanes;

      queueLanes = intersectLanes(queueLanes, root.pendingLanes);

      const newQueueLanes = mergeLanes(queueLanes, lane);
      queue.lanes = newQueueLanes;

      markRootEntangled(root, newQueueLanes);
    }
  }

  if (enableSchedulingProfiler) {
    markStateUpdateScheduled(fiber, lane);
  }
}
```

无论是类组件调用 `setState`,还是函数组件的 `dispatchAction` ，都会产生一个 `update` 对象，里面记录了此次更新的信息，然后将此 `update` 放入待更新的 `pending` 队列中。

`dispatchAction` 第二步就是判断当前函数组件的 `fiber` 对象是否处于渲染阶段，如果处于渲染阶段，那么不需要我们在更新当前函数组件，只需要更新一下当前 `update` 的 `expirationTime` 即可。

如果当前 `fiber` 没有处于更新阶段。那么通过调用 `lastRenderedReducer` 获取最新的 `state`和上一次的 `currentState`进行浅比较。

如果相等，那么就退出，这就证实了为什么 `useState`，两次值相等的时候，组件不渲染的原因了，这个机制和 `Component` 模式下的 `setState` 有一定的区别。

### useEffect -> mountEffect

上述讲到了无状态组件中 `fiber` 对象 `memoizedState` 保存当前的 `hooks` 形成的链表。

那么 `updateQueue` 保存了什么信息呢?当我们调用 `useEffect` 的时候，在组件第一次渲染的时候会调用 `mountEffect` 方法，这个方法到底做了些什么？

```js
function mountEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  return mountEffectImpl(
    PassiveEffect | PassiveStaticEffect,
    HookPassive,
    create,
    deps,
  );
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps): void {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps,
  );
}
```

每个 `hooks` 初始化都会创建一个 `hook` 对象，然后将 `hook` 的 `memoizedState` 保存当前 `effect hook` 信息。

**这里有两个`memoizedState`大家不要搞混了:**

- `workInProgress / current` 树上的 `memoizedState` 保存的是当前函数组件每个 `hooks` 形成的链表。

- 每个 `hooks` 上的 `memoizedState` 保存了当前 `hooks` 信息，不同种类的 `hooks` 的 `memoizedState` 内容不同。

上述的方法最后执行了一个 `pushEffect`，我们一起看看 `pushEffect` 做了些什么？

```js
function pushEffect(tag, create, destroy, deps) {
  const effect: Effect = {
    tag,
    create,
    destroy,
    deps,
    next: (null: any),
  };
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue;
  // 如果是第一个 useEffect
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    // 存在多个effect
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}
```

上述代码首先创建一个了 `effect` ，判断组件如果第一次渲染，那么创建 `componentUpdateQueue` ，就是 `workInProgress` 的 `updateQueue`，然后将 `effect` 放入 `updateQueue` 中。

假设我们有这样一段代码:

```js
useEffect(() => {
  console.log(1);
}, [props.a]);

useEffect(() => {
  console.log(2);
}, []);

useEffect(() => {
  console.log(3);
}, []);
```

最后 `workInProgress.updateQueue` 会以这样的形式保存：

![workInProgress.updateQueue](https://img-blog.csdnimg.cn/f5cb29c2694e491cba407b18edbd140a.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

#### effectList

`effect list` 可以理解为是一个存储 `effectTag` 副作用列表容器。它是由 `fiber` 节点和指针 `nextEffect` 构成的单链表结构，这其中还包括第一个节点 `firstEffect`和最后一个节点 `lastEffect`。

`React` 采用**深度优先搜索**算法，在 `render` 阶段遍历 `fiber` 树时，把每一个有副作用的 `fiber` 筛选出来，最后构建生成一个只带副作用的 `effect list` 链表。

在 `commit` 阶段，`React` 拿到 `effect list` 数据后，通过遍历 `effect list`，并根据每一个 `effect` 节点的 `effectTag` 类型，执行每个`effect`从而对相应的 `DOM` 树执行更改。

### useMemo -> mountMemo

```js
function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

`useMemo` 的逻辑非常简单，初始化 `useMemo`，就是创建一个 `hook`，然后执行 `useMemo` 的第一个参数，得到需要缓存的值，然后将值和 `deps` 记录下来，赋值给当前 `hook` 的 `memoizedState`。

### useRef -> mountRef

```js
function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  const ref = { current: initialValue };
  hook.memoizedState = ref;
  return ref;
}
```

`mountRef` 初始化很简单, 创建一个 `ref` 对象， 对象的 `current` 属性来保存初始化的值，最后用 `memoizedState` 保存 `ref`，完成整个操作。

### 初始化总结

总的来说 React Hooks 在初始化 Hook 的阶段大致做了如下事情：

1. 每个 `hooks` 依次执行，产生一个 `hook` 对象，并形成链表结构绑定在 `workInProgress` 的 `memoizedState` 属性上，`hooks` 中的状态绑定在当前 `hooks` 对象的 `memoizedState` 属性上。

2. 对于 `effect` 副作用钩子，会绑定在 `workInProgress.updateQueue` 上，等到 `commit` 阶段，`DOM` 树构建完成，再执行每个 `effect` 副作用钩子。

## Hooks 更新阶段

上面讲解了在初始化阶段 `Hooks` 所做的事情，在更新阶段的时候，上一次的 `workInProgress` 树已经赋值给了 `current` 树。

存放 `Hooks` 信息的 `memoizedState`，也已经存在 `current` 树上，`react` 对于 `Hooks` 的处理逻辑和 `fiber` 树逻辑类似。

对于一次函数组件更新，当再次执行 `hooks` 函数的时候，比如 `useState(0)` ，首先要从 `current` 的 `hooks` 中找到与当前 `workInProgressHook`对应的 `currentHooks`，然后复制一份 `currentHooks` 给 `workInProgressHook`，接下来 `hooks` 函数执行的时候，把最新的状态更新到 `workInProgressHook`，保证 `hooks` 状态不丢失。

所以函数组件每次更新，每一次 `hooks` 函数执行，都需要有一个函数去做上面的操作，这个函数就是 `updateWorkInProgressHook`。

### updateWorkInProgressHook

```js
function updateWorkInProgressHook(): Hook {
  let nextCurrentHook;
  // 如果是第一个hooks
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    // 不是第一个hooks，那么指向下一个 hooks
    nextCurrentHook = currentHook.next;
  }

  let nextWorkInProgressHook;
  // 第一次执行hooks
  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // 这个情况说明 renderWithHooks 执行过程发生多次函数组件的执行 ，我们暂时先不考虑
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;

    currentHook = nextCurrentHook;
  } else {
    // Clone from the current hook.
    invariant(
      nextCurrentHook !== null,
      'Rendered more hooks than during the previous render.',
    );
    currentHook = nextCurrentHook;
    // 创建一个新的hook
    const newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null,
    };
    // 如果是列表中第一个hooks
    if (workInProgressHook === null) {
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
      // 更新 hook
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}
```

1. 首先如果是第一次执行 `hooks` 函数，那么从 `current` 树上取出 `memoizedState` ，也就是旧的 `hooks`。

2. 然后声明变量 `nextWorkInProgressHook`，这里应该值得注意正常情况下，一次 `renderWithHooks` 执行，`workInProgress` 上的 `memoizedState` 会被置空，`hooks` 函数顺序执行，`nextWorkInProgressHook` 应该一直为 `null`。

   那么什么情况下 `nextWorkInProgressHook` 不为 `null`，也就是当一次 `renderWithHooks` 执行过程中，执行了多次函数组件，也就是在 `renderWithHooks` 中这段逻辑。

   ```js
   if (workInProgress.expirationTime === renderExpirationTime) {
     // ....这里的逻辑我们先放一放
   }
   ```

   这里面的逻辑，实际就是判定，如果当前函数组件执行后，当前函数组件的还是处于渲染优先级，说明函数组件又有了新的更新任务，那么循坏执行函数组件。这就造成了上述的，`nextWorkInProgressHook` 不为 `null` 的情况。

3. 最后复制 `current` 的 `hooks`，把它赋值给 `workInProgressHook`，用于更新新的一轮 `hooks` 状态。

### updateState

```js
function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

function updateReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  invariant(
    queue !== null,
    'Should have a queue. This is likely a bug in React. Please file an issue.',
  );

  queue.lastRenderedReducer = reducer;

  const current: Hook = currentHook;
  let baseQueue = current.baseQueue;
  const pendingQueue = queue.pending;
  // 将未被处理的pendingQueue合并到baseQueue中
  if (pendingQueue !== null) {
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  if (baseQueue !== null) {
    const first = baseQueue.next;
    let newState = current.baseState;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    do {
      const updateLane = update.lane;
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        const clone = {
          lane: updateLane,
          action: update.action,
          eagerReducer: update.eagerReducer,
          eagerState: update.eagerState,
          next: null,
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        markSkippedUpdateLanes(updateLane);
      } else {
        // 这个更新拥有充足的优先级
        if (newBaseQueueLast !== null) {
          const clone = {
            lane: NoLane,
            action: update.action,
            eagerReducer: update.eagerReducer,
            eagerState: update.eagerState,
            next: null,
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        if (update.eagerReducer === reducer) {
          newState = update.eagerState;
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }

  const lastInterleaved = queue.interleaved;
  if (lastInterleaved !== null) {
    let interleaved = lastInterleaved;
    do {
      const interleavedLane = interleaved.lane;
      currentlyRenderingFiber.lanes = mergeLanes(
        currentlyRenderingFiber.lanes,
        interleavedLane,
      );
      markSkippedUpdateLanes(interleavedLane);
      interleaved = ((interleaved: any).next: Update<S, A>);
    } while (interleaved !== lastInterleaved);
  } else if (baseQueue === null) {
    queue.lanes = NoLanes;
  }

  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}
```

上述代码看起来比较复杂，首先将上一次更新的 `pending queue` 合并到了 `basequeue`。为什么这么做呢，我们来看一个例子:

```jsx
import React, { useState } from 'react';
import { Button, Space } from 'antd';

function App() {
  const [count, setCount] = useState(0);
  const handerClick = () => {
    setCount((state) => state + 1);
    setCount((state) => state + 1);
    setCount((state) => state + 1);
  };
  console.log(count);

  return (
    <Space>
      <div>当前Count：{count}</div>
      <Button onClick={() => handerClick()}>点击</Button>
    </Space>
  );
}

export default App;
```

我们调用了三次 `setCount` ，产生的 `update` 会暂且放入 `pending queue`，在下一次函数组件执行时候，三次 `update` 被合并到 `baseQueue`。结构如下图：

![请添加图片描述](https://img-blog.csdnimg.cn/8455000e60974d59be9c82378f157698.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

然后把当前 `useState` 或是 `useReduer` 对应的 `hooks` 上的 `baseState` 和 `baseQueue` 更新到最新的状态。会循环 `baseQueue` 的 `update`，复制一份 `update`，对于有足够优先级的 `update`（上述三个 `setNumber` 产生的 `update` 都具有足够的优先级），我们要获取最新的 `state` 状态。，会一次执行 `useState` 上的每一个 `action`，得到最新的 `state`。

![baseQueue更新流程](https://img-blog.csdnimg.cn/abc7508fdf584c6595c4f8aa3f58503d.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

#### QA：这里是不是执行最后一个 action 不就可以了嘛?

`useState` 逻辑和 `useReducer` 差不多。如果第一个参数是一个函数，会引用上一次 `update` 产生的 `state`, 所以需要循环调用，每一个 `update` 的 `reducer`，如果 `setCount(2)`是这种情况，那么只用更新值，如果是 `setCount(state=>state+1)`，那么传入上一次的 `state` 得到最新 `state`。

#### QA：什么情况下会有优先级不足的情况?

这种情况，一般会发生在，当我们调用 `setCount` 时候，调用 `scheduleUpdateOnFiber` 渲染当前组件时，又产生了一次新的更新，所以把最终执行 `reducer` 更新 `state` 任务交给下一次更新。

### updateEffect

```js
function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  currentlyRenderingFiber.flags |= fiberFlags;

  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps,
  );
}
```

`useEffect` 做的事很简单，判断两次 `deps`是否相等。

- 如果相等说明此次更新不需要执行，则直接调用 `pushEffect`，这里 `effect` 的标签`hookFlags`。

- 如果不相等，那么更新 `effect` ，并且赋值给 `hook.memoizedState`，这里标签是 `HookHasEffect | hookFlags`，然后在 `commit` 阶段，`react` 会通过标签来判断，是否执行当前的 `effect` 函数。

### updateMemo

```js
function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

`useMemo` 函数，做的事情实际很简单，就是判断两次 `deps` 是否相等。

- 如果不想等，证明依赖项发生改变，那么执行 `useMemo` 的第一个函数，得到新的值，然后重新赋值给 `hook`.`memoizedState`。

- 如果相等，证明没有依赖项改变，那么直接获取缓存的值。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '这里需要注意的`nextCreate()`执行，如果里面引用了 `usestate` 等信息，变量会被引用，无法被垃圾回收机制回收（闭包原理)，那么访问的属性有可能不是最新的值，\n\n所以需要把引用的值，添加到依赖项 `dep` 数组中。每一次 `dep` 改变，重新执行，就不会出现问题了。';

export default () => <Info type="warning" txt={txt} />;
```

### updateRef

```js
function updateRef(initialValue) {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```

函数组件更新 `useRef` 做的事情很简单，就是返回了缓存下来的值，也就是无论函数组件怎么执行，执行多少次，`hook.memoizedState` 内存中都指向了一个对象，所以解释了 `useEffect`,`useMemo` 中，为什么 `useRef` 不需要依赖注入，就能访问到最新的改变值。
