---
title: 高阶组件(HOC)
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# 高阶组件(HOC)是什么?

- 2021.08.11

> `高阶组件（HOC）`是 `React` 中用于复用组件逻辑的一种高级技巧。`HOC` 自身不是 `React API` 的一部分，它是一种基于 `React` 的组合特性而形成的设计模式。

在 `React` 组件的构建过程中，常常有这样的场景，有一类功能需要被不同的组件公用，此时，就涉及抽象的话题，在不同设计理念下，有许多的抽象方法,但我们已经意识到 `mixins` 会产生更多麻烦,因此产生了高阶组件的解决方案。

这种模式通常使用函数来实现，基本上是一个类工厂，它的函数签名可以用类似 `haskell` 的伪代码表示

```js
hocFactory:: W: React.Component => E: React.Component
```

其中 `W (WrappedComponent)` 指被包裹的 `React.Component`，`E (EnhancedComponent)` 指返回类型为 `React.Component` 的新的 `HOC`。

## 高阶组件的使用方式

### 1. 属性代理

> 该模式下，`HOC` 对传给 `WrappedComponent W` 的 `porps` 进行操作，常用于增强原始组件。

- 操作 props 返回增强后的 props

```js
import React,{ Component } from 'react';

const MyContainer = (WrappedComponent) =>
    constructor(props){
        super(props)
        this.newProps = {
            'name':'hoc'
        }
    }
    return class extends Component {
        render(){
            return <WrappedComponent {...this.props} {...this.newProps}/>
        }
    }
```

- 通过 Refs 访问到组件实例

```js
function refsHOC(WrappedComponent) {
  return class RefsHOC extends React.Component {
    proc(wrappedComponentInstance) {
      wrappedComponentInstance.method();
    }

    render() {
      const props = Object.assign({}, this.props, {
        ref: this.proc.bind(this),
      });
      return <WrappedComponent {...props} />;
    }
  };
}
```

`Ref` 的回调函数会在 `WrappedComponent` 渲染时执行，我们就可以得到 `WrappedComponent` 的引用。这可以用来`读取/添加`实例的 `props` ，调用实例的方法。

- 抽象 state

常见的例子是实现非受控组件到受控组件的转变。

```js
function stateHOC(WrappedComponent){
    return class extends React.Component{
        constructor(props){
            super(props)
            this.state = {
                name:''
            }
        }
        this.onChange = this.onChange.bind(this);

        onChange=(event)=>{
            this.setState({
                name:event.target.value
            })
        }

        render(){
            const newProps = {
                name:{
                    value:this.state.name,
                    onChange:this.onChange
                }
            }

            return <WrappedComponent {...this.props} {...newProps} />
        }
    }
}
```

我们可以这样用：

```js
@stateHOC
class Example extends React.Component {
  render() {
    return <input name="name" {...this.props.name} />;
  }
}
```

- 用其他元素包裹 WrappedComponent

为了封装样式、布局或别的目的，我们可以用其它组件和元素包裹 `WrappedComponent`。基本方法是使用`父组件实现`，但通过 `HOC` 我们可以更加灵活。

```js
function styleHOC(WrappedComponent) {
  return class App extends React.Component {
    render() {
      return (
        <div style={{ display: 'block' }}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
}
```

### 2. 反向继承

> 该方式比`属性代理`更加侵入组件，能够进行渲染劫持。

最简单的反向继承方式如下:

```js
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      return super.render();
    }
  };
}
```

反向继承 允许 `HOC` 通过 `this` 访问到 `WrappedComponent`，意味着它可以访问到 `state`、`props`、组件生命周期方法和 `render` 方法。

#### 渲染劫持

之所以被称为渲染劫持是因为 `HOC` 控制着 `WrappedComponent` 的渲染输出，可以用它做各种各样的事。

通过`渲染劫持`我们可以：

1. 在由 `render` 输出的任何 `React` 元素中读取、添加、编辑、删除 `props`
2. 读取和修改由 `render` 输出的 `React` 元素树
3. 有条件地渲染元素树
4. 把样式包裹进元素树（就像在 Props Proxy 中的那样）

- 条件渲染

比如当 `this.props.isShow` 为 `true` 时，这个 `HOC` 会完全渲染 `WrappedComponent` 的渲染结果，否则啥也不展示。

```js
function isShowHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      if (this.props.isShow) {
        return super.render();
      } else {
        return null;
      }
    }
  };
}
```

- 修改由 render 方法输出的 React 组件树。

```js
function renderHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      const elementsTree = super.render();
      let newProps = {};
      if (elementsTree && elementsTree.type === 'input') {
        newProps = { value: 'may the force be with you' };
      }
      const props = Object.assign({}, elementsTree.props, newProps);
      const newElementsTree = React.cloneElement(
        elementsTree,
        props,
        elementsTree.props.children,
      );
      return newElementsTree;
    }
  };
}
```

在这个例子中，如果 `WrappedComponent` 的输出在最顶层有一个 `input`，那么就把它的 `value` 设为 **may the force be with you**。

我们还可以在这里做各种各样的事，比如遍历整个元素树，然后修改元素树中任何元素的 `props`。这也正是样式处理库 `Radium` 所用的方法。

- 操作 state

通过反向继承的方式也可以读取、编辑和删除 `WrappedComponent` 实例的 `state`，但是不推荐这样去使用，这样会搞乱 `WrappedComponent` 的 `state`，导致后期可能发生一些意想不到的结果。

例如，通过访问 `WrappedComponent` 的 `props` 和 `state` 来做调试。

```js
export function debugerHOC(WrappedComponent) {
  return class II extends WrappedComponent {
    render() {
      return (
        <div>
          <h2>HOC Debugger Component</h2>
          <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
          <p>State</p>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
          {super.render()}
        </div>
      );
    }
  };
}
```

这里 `HOC` 用其他元素包裹着 `WrappedComponent`，还输出了 `WrappedComponent` 实例的 `props` 和 `state`。
