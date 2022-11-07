---
title: react-router核心原理
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: react
  path: /react/project
---

# react-router

- 2022.01.18

## SPA

> SPA 是(single-page Application)单页面应用模式的缩写。

在`SPA模式`下第一次进入页面时会请求一个`html`文件，加载相应的`js`和`css`资源，当我们切换到其他页面的时候，此时路径也相应变化，内容发生了改变但是并没有请求新的`html`文件。

### 单页面实现核心原理

通过 js 去监听 url 的变化，从而去加载不同的页面。

实现的主要方式有 `history模式` 和 `hash模式`。

- history 模式

  - 改变路由

    > history.pushState

    ```js
    history.pushState(state, title, path);
    ```

    - `state`：一个与指定网址相关的状态对象， `popstate` 事件触发时，该对象会传入回调函数。如果不需要可填 `null`。
    - `title`：新页面的标题，但是所有浏览器目前都忽略这个值，可填 `null`。
    - `path`：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个地址。

    > history.replaceState

    ```js
    history.replaceState(state, title, path);
    ```

    参数和 `pushState` 一样，这个方法会修改当前的 `history` 对象记录， `history.length` 的长度不会改变。

  - 监听路由

    ```js
    window.addEventListener('popstate', function (e) {
      /* 监听改变 */
    });
    ```

    同一个文档的 `history` 对象出现变化时，就会触发 `popstate` 事件。 `history.pushState` 可以使浏览器地址改变，但是无需刷新页面。

    ```jsx
    /**
     * inline: true
     */
    import React from 'react';
    import { Info } from 'interview';

    const txt =
      '\n使用 `history.pushState()` 或者 `history.replaceState()` 不会触发 `popstate` 事件。 \n\n`popstate` 事件只会在浏览器某些行为下触发, 比如`点击后退`、`前进按钮`或者调用 `history.back()`、`history.forward()`、`history.go()`方法。';

    export default () => <Info type="warning" txt={txt} />;
    ```

- hash 模式

  - 改变路由

    通过 `window.location.hash` 属性获取和设置 `hash` 值。

  - 监听路由

    ```js
    window.addEventListener('hashchange', function (e) {
      /* 监听改变 */
    });
    ```

## react-router-dom、react-router、history

- `history`可以理解为 `react-router` 的核心，也是整个路由原理的核心，里面集成了`popState`，`history.pushState`等底层路由实现的原理方法。

- `react-router`可以理解为是 `react-router-dom` 的核心，里面封装了`Router`，`Route`，`Switch`等核心组件,实现了从路由的改变到组件的更新的核心功能,在我们的项目中只要一次性引入 `react-router-dom` 就可以了。

- `react-router-dom`，在`react-router`的核心基础上，添加了用于跳转的`Link`组件，和`histoy`模式下的`BrowserRouter`和`hash`模式下的`HashRouter`组件等。所谓`BrowserRouter`和`HashRouter`，也只不过用了`history`库中`createBrowserHistory`和`createHashHistory`方法。

早期的示例代码:

```js
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';

import Detail from './detail';
import List from './list';
import Index from './home';

const menusList = [
  {
    name: '首页',
    path: '/index',
  },
  {
    name: '列表',
    path: '/list',
  },
  {
    name: '详情',
    path: '/detail',
  },
];
const index = () => {
  return (
    <div>
      <div>
        <Router>
          <div>
            {menusList.map((router) => (
              <Link key={router.path} to={router.path}>
                <span className="routerLink">{router.name}</span>
              </Link>
            ))}
          </div>
          <Switch>
            <Route path={'/index'} component={Index}></Route>
            <Route path={'/list'} component={List}></Route>
            <Route path={'/detail'} component={Detail}></Route>
            {/*  路由不匹配，重定向到/index  */}
            <Redirect from="/*" to="/index" />
          </Switch>
        </Router>
      </div>
    </div>
  );
};
```

## createBrowserHistory

`Browser`模式下路由的运行 ，一切都从 `createBrowserHistory` 开始。(这里以[4.x](https://github.com/remix-run/history/blob/v4/modules/createBrowserHistory.js)为例)

```js
const PopStateEvent = 'popstate';
const HashChangeEvent = 'hashchange';

function createBrowserHistory(props = {}) {
  /* 全局history  */
  const globalHistory = window.history;
  /* 处理路由转换，记录了listens信息。 */
  const transitionManager = createTransitionManager();
  /* 改变location对象，通知组件更新 */
  function setState(nextState) {
    Object.assign(history, nextState);
    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }
  /* 处理当path改变后，处理popstate变化的回调函数 */
  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }
  let forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      const action = 'POP';

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        (ok) => {
          if (ok) {
            setState({ action, location });
          } else {
            revertPop(location);
          }
        },
      );
    }
  }
  /* history.push方法，改变路由，通过全局对象history.pushState改变url, 通知router触发更新，替换组件 */
  function push(path, state) {
    warning(
      !(
        typeof path === 'object' &&
        path.state !== undefined &&
        state !== undefined
      ),
      'You should avoid providing a 2nd state argument to push when the 1st ' +
        'argument is a location-like object that already has state; it is ignored',
    );
    // 首先生成一个最新的 location 对象，然后通过 window.history.pushState 方法改变浏览器当前路由(即当前的path),
    // 最后通过 setState 方法通知 React-Router 更新，并传递当前的 location 对象.
    // 由于这次 url 变化的，是 history.pushState 产生的，并不会触发 popState 方法，所以需要手动 setState，触发组件更新。
    const action = 'PUSH';
    const location = createLocation(path, state, createKey(), history.location);

    transitionManager.confirmTransitionTo(
      location,
      action,
      getUserConfirmation,
      (ok) => {
        if (!ok) return;

        const href = createHref(location);
        const { key, state } = location;

        if (canUseHistory) {
          if (forceRefresh) {
            window.location.href = href;
          } else {
            globalHistory.pushState({ key, state }, null, href);
            const prevIndex = allKeys.indexOf(history.location.key);
            const nextKeys = allKeys.slice(0, prevIndex + 1);

            nextKeys.push(location.key);
            allKeys = nextKeys;

            setState({ action, location });
          }
        } else {
          warning(
            state === undefined,
            'Browser history cannot push state in browsers that do not support HTML5 history',
          );

          window.location.href = href;
        }
      },
    );
  }
  /* 底层应用事件监听器，监听popstate事件 */
  function listen(listener) {
    const unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return () => {
      checkDOMListeners(-1);
      unlisten();
    };
  }
  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);

      if (needsHashChangeListener)
        window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);

      if (needsHashChangeListener)
        window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  return {
    push,
    listen,
    /* .... */
  };
}
```

## createHashHistory

这里展示的也是[4.x](https://github.com/remix-run/history/blob/v4/modules/createHashHistory.js)

```js
// 监听哈希路由变化
const HashChangeEvent = 'hashchange';
const checkDOMListeners = (delta) => {
  listenerCount += delta;
  if (listenerCount === 1) {
    addEventListener(window, HashChangeEvent, handleHashChange);
  } else if (listenerCount === 0) {
    removeEventListener(window, HashChangeEvent, handleHashChange);
  }
};

// 改变哈希路由
function pushHashPath(path) {
  window.location.hash = path;
}

function replaceHashPath(path) {
  window.location.replace(stripHash(window.location.href) + '#' + path);
}
```

## 核心路由组件

### Router

`Router`的作用是把 `history location` 等路由信息 传递下去。

```js
/* Router 作用是把 history location 等路由信息 传递下去  */
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
  }
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location,
    };
    //记录pending位置
    //如果存在任何<Redirect>，则在构造函数中进行更改
    //在初始渲染时。如果有，它们将在
    //在子组件身上激活，我们可能会
    //在安装<Router>之前获取一个新位置。
    this._isMounted = false;
    this._pendingLocation = null;
    /* 此时的history，是history创建的history对象 */
    if (!props.staticContext) {
      /* 这里判断 componentDidMount 和 history.listen 执行顺序 然后把 location复制 ，防止组件重新渲染 */
      this.unlisten = props.history.listen((location) => {
        /* 创建监听者 */
        if (this._isMounted) {
          this.setState({ location });
        } else {
          this._pendingLocation = location;
        }
      });
    }
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._pendingLocation) {
      this.setState({ location: this._pendingLocation });
    }
  }
  componentWillUnmount() {
    /* 解除监听 */
    if (this.unlisten) this.unlisten();
  }
  render() {
    return (
      /*  这里可以理解 react.createContext 创建一个 context上下文 ，保存router基本信息。children */
      <RouterContext.Provider
        children={this.props.children || null}
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext,
        }}
      />
    );
  }
}
```

初始化绑定`listen`, 路由变化,通知改变`location`改变组件。 react 的 history 路由状态是保存在`React.Content`上下文之间, 状态更新。

**一个项目应该有一个根 Router ， 来产生切换路由组件之前的更新作用。 如果存在多个 Router 会造成，会造成切换路由，页面不更新的情况。**

### Switch

匹配正确的唯一的路由，根据 router 更新流，来渲染当前组件。

```js
/* switch组件 */
class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {/* 含有 history location 对象的 context */}
        {(context) => {
          invariant(context, 'You should not use <Switch> outside a <Router>');
          const location = this.props.location || context.location;
          let element, match;
          //我们使用React.Children.forEach而不是React.Children.toArray（）.find（）
          //这里是因为toArray向所有子元素添加了键，我们不希望
          //为呈现相同的两个<Route>s触发卸载/重新装载
          //组件位于不同的URL。
          //这里只需然第一个 含有 match === null 的组件
          React.Children.forEach(this.props.children, (child) => {
            if (match == null && React.isValidElement(child)) {
              element = child;
              // 子组件 也就是 获取 Route中的 path 或者 rediect 的 from
              const path = child.props.path || child.props.from;
              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          });
          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}
```

找到与当前 path,匹配的组件进行渲染。 通过 `pathname` 和组件的 `pathname` 进行匹配。找到符合 path 的 router 组件。

```js
function matchPath(pathname, options = {}) {
  if (typeof options === 'string' || Array.isArray(options)) {
    options = { path: options };
  }

  const { path, exact = false, strict = false, sensitive = false } = options;

  const paths = [].concat(path);

  return paths.reduce((matched, path) => {
    if (!path && path !== '') return null;
    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    });
    const match = regexp.exec(pathname);
    /* 匹配不成功，返回null */
    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {}),
    };
  }, null);
}
```

### Route

组件页面承载容器。

```js
/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          /* router / route 会给予警告警告 */
          invariant(context, 'You should not use <Route> outside a <Router>');
          // computedMatch 为 经过 swich处理后的 path
          const location = this.props.location || context.location;
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
            ? matchPath(location.pathname, this.props)
            : context.match;
          const props = { ...context, location, match };
          let { children, component, render } = this.props;

          if (Array.isArray(children) && children.length === 0) {
            children = null;
          }

          return (
            <RouterContext.Provider value={props}>
              {props.match
                ? children
                  ? typeof children === 'function'
                    ? __DEV__
                      ? evalChildrenDev(children, props, this.props.path)
                      : children(props)
                    : children
                  : component
                  ? React.createElement(component, props)
                  : render
                  ? render(props)
                  : null
                : typeof children === 'function'
                ? __DEV__
                  ? evalChildrenDev(children, props, this.props.path)
                  : children(props)
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```

匹配 path,渲染组件。作为路由组件的容器,可以根据将实际的组件渲染出来。

通过 `RouterContext.Consume` 取出当前上一级的 location,match 等信息。作为 prop 传递给页面组件。使得我们可以在页面组件中的 props 中获取 location ,match 等信息。

### Redirect

重定向组件， 如果路由未匹配上，会重定向对应的路由。

```js
function Redirect({ computedMatch, to, push = false }) {
  return (
    <RouterContext.Consumer>
      {(context) => {
        const { history, staticContext } = context;
        /* method就是路由跳转方法。 */
        const method = push ? history.push : history.replace;
        /* 找到符合match的location ，格式化location */
        const location = createLocation(
          computedMatch
            ? typeof to === 'string'
              ? generatePath(to, computedMatch.params)
              : {
                  ...to,
                  pathname: generatePath(to.pathname, computedMatch.params),
                }
            : to,
        );
        /* 初始化的时候进行路由跳转，当初始化的时候，mounted执行push方法，当组件更新的时候，如果location不相等。同样会执行history方法重定向 */
        return (
          <Lifecycle
            onMount={() => {
              method(location);
            }}
            onUpdate={(self, prevProps) => {
              const prevLocation = createLocation(prevProps.to);
              if (
                !locationsAreEqual(prevLocation, {
                  ...location,
                  key: prevLocation.key,
                })
              ) {
                method(location);
              }
            }}
            to={to}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}
```

初始化的时候进行路由跳转，当初始化的时候，mounted 执行 push 方法，当组件更新的时候，如果 location 不相等。同样会执行 history 方法重定向。

## 总结

- history 提供了核心 api，如监听路由，更改路由的方法，已经保存路由状态 state。

- react-router 提供路由渲染组件，路由唯一性匹配组件，重定向组件等功能组件。

### 流程分析

- **当地址栏改变 url，组件的更新渲染都经历了什么？**

以 history 模式做参考，当 url 改变，首先触发 histoy，调用事件监听 popstate 事件， 触发回调函数 handlePopState，触发 history 下面的 setstate 方法，产生新的 location 对象，然后通知 Router 组件更新 location 并通过 context 上下文传递，switch 通过传递的更新流，匹配出符合的 Route 组件渲染，最后由 Route 组件取出 context 内容，传递给渲染页面，渲染更新。

- **当我们调用`history.push`方法，切换路由，组件的更新渲染又都经历了什么呢？**

我们还是拿 `history` 模式作为参考，当我们调用 `history.push` 方法，通过 `history.pushState` 来改变当前 url，接下来触发 `history` 下面的 `setState` 方法，接下来的步骤就和上面一模一样了。

## 自定义实现路由懒加载

如果我们没有用 `umi` 等框架，需要手动配置路由的时候，也许路由会这样配置。

```js
<Switch>
  <Route path={'/index'} component={Index}></Route>
  <Route path={'/list'} component={List}></Route>
  <Route path={'/detail'} component={Detail}></Route>
  <Redirect from="/*" to="/index" />
</Switch>
```

或者用 `list` 保存路由信息，方便在进行路由拦截，或者配置路由菜单等。

```js
const router = [
  {
    path: '/index',
    component: Index,
  },
  {
    path: '/list',
    component: List,
  },
  {
    path: '/detail',
    component: Detail,
  },
];
```

这种路由框架在访问的时候都会一次性去加载大量的路由，对页面的初始化非常不友好，会延长页面初始化时间，所以我们想用 `asyncRouter` 来按需加载页面路由。

例如这里基于 `import` 函数实现路由懒加载，因为 `import` 执行会返回一个 `Promise` 作为异步加载的手段。我们可以利用这点来实现 `react` 异步加载路由。

```js
// 所有待加载的路由
const routerObserveQueue = [];

export const RouterHooks = {
  // 路由加载前
  beforeRouterComponentLoad: function (callback) {
    routerObserveQueue.push({
      type: 'before',
      callback,
    });
  },
  // 路由加载后
  afterRouterComponentLoad: function (callback) {
    routerObserveQueue.push({
      type: 'after',
      callback,
    });
  },
};

// 懒加载路由HOC
export default function AsyncRouter(loadRouter) {
  return class Content extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Component: null,
      };
      // 触发每个路由加载前的钩子函数
      this.dispatchRouterQueue('before');
    }

    dispatchRouterQueue = () => {
      const { history } = this.props;
      routerObserveQueue.forEach((item) => {
        if (item.type === type) item.callback(history);
      });
    };

    componentDidMount() {
      if (this.state.Component) return;

      loadRouter()
        .then((module) => module.default)
        .then((Component) =>
          this.setState({ Component }, () => {
            // 触发每个路由加载之后钩子函数
            this.dispatchRouterQueue('after');
          }),
        );
    }

    render() {
      const { Component } = this.state;

      return Component ? <Component {...this.props} /> : null;
    }
  };
}
```

这里的 `asyncRouter` 是一个高级组件，通过将 `()=>import()` 作为加载函数传进来，然后当外部 `Route` 加载当前组件的时候，在`componentDidMount`生命周期函数，加载真实的组件，并渲染组件。

我们还可以写针对路由懒加载状态定制属于自己的路由监听器 `beforeRouterComponentLoad` 和 `afterRouterComponentDidLoaded`。

```js
import AsyncRouter, { RouterHooks } from './asyncRouter.js';

const { beforeRouterComponentLoad } = RouterHooks;
const Index = AsyncRouter(() => import('../src/page/home/index'));
const List = AsyncRouter(() => import('../src/page/list'));
const Detail = AsyncRouter(() => import('../src/page/detail'));

const index = () => {
  useEffect(() => {
    /* 增加监听函数 */
    beforeRouterComponentLoad((history) => {
      console.log('当前激活的路由是', history.location.pathname);
    });
  }, []);

  return (
    <div>
      <div>
        <Router>
          <Meuns />
          <Switch>
            <Route path={'/index'} component={Index}></Route>
            <Route path={'/list'} component={List}></Route>
            <Route path={'/detail'} component={Detail}></Route>
            <Redirect from="/*" to="/index" />
          </Switch>
        </Router>
      </div>
    </div>
  );
};
```
