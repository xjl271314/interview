---
title: portal
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: react
  path: /react/project
---

# 说说 React 中的 portal?

- 2021.06.02

> `Portal` 是 `React DoM` 提供的一种将子节点渲染到存在于父组件以外的 `DOM` 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container);
```

第一个参数`（child）`是任何可渲染的 `React` 子元素，例如`一个元素`，`字符串`或 `fragment`。第二个参数`（container）`是一个 `DOM` 元素。

## 应用场景

一个 `portal` 的典型用例是当父组件有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上`跳出`其容器。例如，对话框、悬浮卡以及提示框：

```js
// Component Portal
import { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Portal extends Component {
  static defaultProps = {
    isBody: false,
  };

  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.container = props.container || document.body;
  }

  componentDidMount() {
    this.container.appendChild(this.el);
  }

  componentWillUnmount() {
    this.container.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.props.isBody ? document.body : this.el,
    );
  }
}

// Hook Portal
const Portal = (props) => {
  // 这里也可以使用传入一个ref
  // const ref = useRef({}).current;
  const { parentNode = document.body, children } = props;

  return ReactDOM.createPortal(children, parentNode);
};
```
