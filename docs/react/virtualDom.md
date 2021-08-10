---
title: 虚拟DOM(virtual DOM)
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# React 中的虚拟 DOM?

- 2021.08.10

在 `React` 之前的 `Jquery` 时代，使用过的人都知道其实现重新渲染采用最简单粗暴的办法————就是重新构建 `DOM` 替换旧 `DOM`,这样的方式很简单但是问题也很明显:

- 性能消耗高(需要频繁的去生成节点上下文、重排、重绘)
- 无法保存状态(聚焦,滚动等)

## Virtual DOM

为了解决上述的问题，随着技术的发展后期出现了虚拟 DOM 这么一项技术。

`虚拟 DOM` 实际也是操作 `DOM` 树进行渲染更新,但是它只是针对修改部分进行局部渲染,将影响降到最低,虽然实现方式各有不同,但是大体步骤如下:

1. 用 `Javascript` 对象结构描述 `DOM` 树结构,然后用它来构建真正的 `DOM` 树插入文档。
2. 当状态发生改变之后,重新构造新的 `Javascript` 对象结构和旧的作对比得出差异。
3. 针对差异之处进行重新构建更新视图。

## React 中的虚拟 DOM

在 `React` 中，`虚拟 DOM` 是 `React` 中实现的对真实 `DOM` 的一种抽象的 `Javascript` 对象。`虚拟 DOM` 中只保留着一些构建真实 `DOM` 的`映射`等,没有真实的 `DOM` 复杂，真实 `DOM` 上存在着几百个属性与方法。这也是`虚拟 DOM` 快的一个原因。

![React 中的虚拟 DOM](https://img-blog.csdnimg.cn/20210531165515490.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

在原生的 `JavaScript` 程序中，我们直接对 `DOM` 进行创建和更改，而 `DOM` 元素通过我们监听的事件和我们的应用程序进行通讯。

而在 `React` 中首先会将我们的 `JSX` 代码转换成一个 `JavaScript` 对象，然后这个 `JavaScript` 对象再转换成真实 `DOM`。这个 `JavaScript 对象`就是所谓的`虚拟 DOM`。

比如我们常见的这段代码：

```html
<div class="container">
  <span>Hello World</span>
  <ul>
    <li>111</li>
    <li>222</li>
    <li>
      <span>哈哈</span>
      333
    </li>
  </ul>
</div>
```

在 `React` 可能存储为这样的 JS 代码：

```js
const VitrualDom = {
  type: 'div',
  props: { class: 'container' },
  children: [
    {
      type: 'span',
      children: 'Hello World',
    },
    {
      type: 'ul',
      children: [
        { type: 'li', children: '111' },
        { type: 'li', children: '222' },
        {
          type: 'li',
          children: [
            {
              type: 'span',
              children: '哈哈',
            },
            '333',
          ],
        },
      ],
    },
  ],
};
```

当我们需要创建或更新元素时，`React` 首先会让这个 `Vitrual DOM` 对象进行创建和更改，然后再将 `Vitrual DOM` 对象渲染成真实 `DOM`；

当我们需要对 `DOM` 进行事件监听时，首先对 `Vitrual DOM` 进行事件监听，`Vitrual DOM` 会代理原生的 `DOM` 事件从而做出响应。

## 为什么需要虚拟 DOM?

有的人可能说 `Vitrual DOM` 是可以提升性能的，但是他的侧重点可能并不是他理解的这样。当我们直接去操作 `DOM` 更新的时候是比较消耗性能的，但是在 `React` 中虽然存的是`虚拟 DOM`，但是最终还是要去更新真实 `DOM` 的。

如果针对`首次渲染`来说，`React` 中需要花费的时间更长，它要去计算，消耗更多的内存。

**`Vitrual DOM` 的优势在于 `React` 的 `Diff 算法` 和 `批处理策略`，`React` 在页面更新之前，提前计算好了如何进行更新和渲染 DOM。**

实际上，这个计算过程我们在直接操作 `DOM` 时，也是可以自己判断和实现的，但是一定会耗费非常多的精力和时间，而且往往我们自己做的是不如 `React` 好的。所以，在这个过程中 `React` 帮助我们提升了性能。

所以，更合适的说法是 `Vitrual DOM` 帮助我们提高了开发效率，在重复渲染时它帮助我们计算如何更高效的更新，而不是它比 `DOM` 操作更快。

### 总结

1. 前端优化中一个常用的秘诀就是尽可能减少 DOM 操作。一个是因为 DOM 结构比较深/长,频繁的变更 DOM 会造成浏览器不断的重排或者重绘。采用虚拟 DOM 的话，在变更中采用异步的方式,patch 中尽可能一次性的将差异更新到真实的 DOM 中，保证 DOM 更新的性能。

2. 手动更新 DOM 的话无法保证性能，而且如果在多人合作的项目中，代码 review 不严格的话可能产生性能较低的代码。

3. 采用虚拟 DOM 的话可以实现更好的跨平台，比如 SSR(Node 中并没有 DOM)，借助 Virtual DOM 可以实现,因为 Virtual DOM 本身是 JavaScript 对象.

## 虚拟 DOM 的生成？

根据定义我们知道思想是接收一些参数，返回一个 `DOM` 的抽象对象。

```js
function vNode(type, key, data, children, text, ele) {
  const element = {
    _type: VNODE.TYPE,
    type,
    key,
    data,
    children,
    text,
    ele,
  };
  return element;
}
```

我们来看一下在 `render` 中编写完成 `jsx` 后是如何被渲染成`虚拟 DOM` 的。

```js
import React, { Component } from 'react';

class App extends Component {
  render() {
    return <div className="container">Hello World</div>;
  }
}

// render源码
function render(element, container, callback) {
  if (!isValidContainer(container)) {
    {
      throw Error('Target container is not a DOM element.');
    }
  }

  {
    var isModernRoot =
      isContainerMarkedAsRoot(container) &&
      container._reactRootContainer === undefined;

    if (isModernRoot) {
      error(
        'You are calling ReactDOM.render() on a container that was previously ' +
          'passed to ReactDOM.createRoot(). This is not supported. ' +
          'Did you mean to call root.render(element)?',
      );
    }
  }

  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}

function legacyRenderSubtreeIntoContainer(
  parentComponent,
  children,
  container,
  forceHydrate,
  callback,
) {
  {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
  } // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.

  var root = container._reactRootContainer;
  var fiberRoot;

  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.

    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var _originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);

        _originalCallback.call(instance);
      };
    } // Update

    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}
```

- 首先，我们在 `render` 函数中书写的代码会被 `Babel` 进行编译，转化为 `React.createElement`语法。

```js
return React.createElement('div', { className: 'container' }, 'Hello World');
```

- 接下来由`React.createElement`在组件装载及组件更新时使用`Diff`算法进行差异化计算，计算完成后找出需要更新的 DOM，然后挂载真实的 DOM。

```js
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */

function createElement(type, config, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.

  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props

  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */

var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```

- 由于该函数只在 `render` 函数中调用，所以在 `React 装载`和`更新`的过程中才会有`虚拟 DOM`的生成；至于挂载到真实 `DOM` 自然而然是 `ReactDOM.render` 函数啦。
