---
title: 版本变更
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# 重大版本变更日志

- 2021.08.12

完整[官方文档地址](https://github.com/facebook/react/blob/main/CHANGELOG.md)

## 16.0.0

2017.11.26

- New JS Environment Requirements

  - React 16 depends on the collection types `Map` and `Set`, as well as [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). If you support older browsers and devices which may not yet provide these natively (e.g. `<IE11`), you may want to include a polyfill.

- New Features

  - Components can now return `arrays` and `strings` from render.

  - Improved error handling with introduction of `error boundaries`. Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.

  - First-class support for declaratively rendering a subtree into another DOM node with `ReactDOM.createPortal()`.

  - Streaming mode for server side rendering is enabled with `ReactDOMServer.renderToNodeStream()` and `ReactDOMServer.renderToStaticNodeStream()`. (@aickin in [#10425](https://github.com/facebook/react/pull/10425), [#10044](https://github.com/facebook/react/pull/10044), [#10039](https://github.com/facebook/react/pull/10039), [#10024](https://github.com/facebook/react/pull/10024), [#9264](https://github.com/facebook/react/pull/9264), and others.)

  - [React DOM now allows passing non-standard attributes](https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html). (@nhunzaker in [#10385](https://github.com/facebook/react/pull/10385), [#10564](https://github.com/facebook/react/pull/10564), [#10495](https://github.com/facebook/react/pull/10495) and others)

- Breaking Changes

  - `ReactDOM.render()` and `ReactDOM.unstable_renderIntoContainer()` now return `null` if called from inside a lifecycle method.
  - To work around this, you can either use the new portal API or refs.
  - Minor changes to setState behavior:

  - Calling `setState` with null no longer triggers an update. This allows you to decide in an updater function if you want to re-render.

  - Calling `setState` directly in render always causes an update. This was not previously the case. Regardless, you should not be calling setState from render.

  - `setState` callback (second argument) now fires immediately after `componentDidMount` / `componentDidUpdate`instead of after all components have rendered.

  - When replacing `<A />` with `<B />`, `B.componentWillMount` now always happens before `A.componentWillUnmount`. Previously, `A.componentWillUnmount` could fire first in some cases.

  - Previously, changing the `ref` to a component would always detach the ref before that component's render is called. Now, we change the ref later, when applying the changes to the DOM.

  - `componentDidUpdate` lifecycle no longer receives prevContext param. (@bvaughn in #8631)

  - Shallow renderer no longer calls `componentDidUpdate()` because DOM refs are not available. This also makes it consistent with `componentDidMount()` (which does not get called in previous versions either).

## 16.2.0

2017.11.28

- React

  - Add `Fragment` as named export to React. (@clemmy in [#10783](https://github.com/facebook/react/pull/10783))

## 16.3.0

2018.03.19

- React

  - Add a new officially supported context API.(@acdlite in [#11818](https://github.com/facebook/react/pull/11818))

  - Add a new `React.createRef()` API as an ergonomic alternative to callback refs. (@trueadm in [#12162](https://github.com/facebook/react/pull/12162))

  - Add a new `React.forwardRef()` API to let components forward their refs to a child. (@bvaughn in [#12346](https://github.com/facebook/react/pull/12346))

  - Improve the error message when calling `setState()` on an unmounted component. (@sophiebits in [#12347](https://github.com/facebook/react/pull/12347))

- React DOM

  - Add a new `getDerivedStateFromProps()` lifecycle and `UNSAFE_ aliases` for the legacy lifecycles. (@bvaughn in [#12028](https://github.com/facebook/react/pull/12028))

  - Add a new `getSnapshotBeforeUpdate()` lifecycle. (@bvaughn in [#12404](https://github.com/facebook/react/pull/12404))

  - Add a new `<React.StrictMode>` wrapper to help prepare apps for async rendering. (@bvaughn in [#12083](https://github.com/facebook/react/pull/12083))

  - Add support for onLoad and onError events on the `<link>` tag. (@roderickhsiao in [#11825](https://github.com/facebook/react/pull/11825))

  - Fix minor DOM input bugs in IE and Safari. (@nhunzaker in [#11534](https://github.com/facebook/react/pull/11534))

  - Fix refs to class components not getting cleaned up when the attribute is removed. (@bvaughn in [#12178](https://github.com/facebook/react/pull/12178))

  - Deprecate `ReactDOM.unstable_createPortal()` in favor of `ReactDOM.createPortal()`. (@prometheansacrifice in [#11747](https://github.com/facebook/react/pull/11747))

## 16.5.0

2018.09.05

- React

  - Add a warning if `React.forwardRef` render function doesn't take exactly two arguments (@bvaughn in [#13168](https://github.com/facebook/react/pull/13168))

  - Improve the error message when passing an element to `createElement` by mistake (@DCtheTall in [#13131](https://github.com/facebook/react/pull/13131))

## 16.6.0

2018.10.23

- React

  - Add `React.memo()` as an alternative to PureComponent for functions. (@acdlite in [#13748](https://github.com/facebook/react/pull/13748))

  - Add `React.lazy()` for code splitting components. (@acdlite in [#13885](https://github.com/facebook/react/pull/13885))

  - `React.StrictMode` now warns about legacy context API. (@bvaughn in [#13760](https://github.com/facebook/react/pull/13760))

  - `React.StrictMode` now warns about findDOMNode. (@sebmarkbage in [#13841](https://github.com/facebook/react/pull/13841))

- React DOM

  - Add `getDerivedStateFromError` lifecycle method for catching errors in a future asynchronous server-side renderer. (@bvaughn in [#13746](https://github.com/facebook/react/pull/13746))

- React DOM Server

  - Add support for `React.memo()`. (@alexmckenley in [#13855](https://github.com/facebook/react/pull/13855))

  - Add support for `contextType`. (@alexmckenley and @sebmarkbage in [#13889](https://github.com/facebook/react/pull/13889))

## 16.8.0

2019.02.06

- React

  - Add [Hooks](https://reactjs.org/docs/hooks-intro.html) — a way to use state and other React features without writing a class. (@acdlite et al. in [#13968](https://github.com/facebook/react/pull/13968))

  - Improve the `useReducer` Hook lazy initialization API. (@acdlite in [#14723](https://github.com/facebook/react/pull/14723))

- React DOM

  - Bail out of rendering on identical values for `useState` and `useReducer` Hooks. (@acdlite in [#14569](https://github.com/facebook/react/pull/14569))

  - Use `Object.is` algorithm for comparing `useState` and `useReducer` values. (@Jessidhia in [#14752](https://github.com/facebook/react/pull/14752))

  - Don’t compare the first argument passed to `useEffect/useMemo/useCallback` Hooks. (@acdlite in [#14594](https://github.com/facebook/react/pull/14594))

  - Support synchronous thenables passed to `React.lazy()`. (@gaearon in [#14626](https://github.com/facebook/react/pull/14626))

  - Render components with Hooks twice in Strict Mode (DEV-only) to match class behavior. (@gaearon in [#14654](https://github.com/facebook/react/pull/14654))

  - Warn about mismatching Hook order in development. (@threepointone in #14585 and @acdlite in [#14591](https://github.com/facebook/react/pull/14591))

  - `Effect clean-up functions` must return either `undefined` or a `function`. All other values, including `null`, are not allowed. @acdlite in [#14119](https://github.com/facebook/react/pull/14119)

- React Test Renderer and Test Utils

  - Support Hooks in the shallow renderer. (@trueadm in [#14567](https://github.com/facebook/react/pull/14567))

  - Fix wrong state in `shouldComponentUpdate` in the presence of `getDerivedStateFromProps` for Shallow Renderer. (@chenesan in [#14613](https://github.com/facebook/react/pull/14613))

  - Add `ReactTestRenderer.act()` and `ReactTestUtils.act()` for batching updates so that tests more closely match real behavior. (@threepointone in [#14744](https://github.com/facebook/react/pull/14744))

## 16.8.2

2019.02.14

- React DOM

- Fix `ReactDOM.render` being ignored inside `useEffect`. (@gaearon in [#14799](https://github.com/facebook/react/pull/14799))

- Fix a crash when unmounting empty portals. (@gaearon in [#14820](https://github.com/facebook/react/pull/14820))

- Fix `useImperativeHandle` to work correctly when no deps are specified. (@gaearon in [#14801](https://github.com/facebook/react/pull/14801))

- Fix `crossOrigin` attribute to work in SVG image elements. (@aweary in [#14832](https://github.com/facebook/react/pull/14832))

## 16.9.0

2019.08.08

- React

  - Add `<React.Profiler>` API for gathering performance measurements programmatically. (@bvaughn in [#15172](https://github.com/facebook/react/pull/15172))

  - Remove `unstable_ConcurrentMode` in favor of `unstable_createRoot`. (@acdlite in [#15532](https://github.com/facebook/react/pull/15532))

- React DOM

  - Deprecate old names for the `UNSAFE_*` lifecycle methods. (@bvaughn in [#15186](https://github.com/facebook/react/pull/15186) and @threepointone in [#16103](https://github.com/facebook/react/pull/16103))

  - Deprecate `javascript:` URLs as a common attack surface. (@sebmarkbage in [#15047](https://github.com/facebook/react/pull/15047))

  - Deprecate uncommon "module pattern" (factory) components. (@sebmarkbage in [#15145](https://github.com/facebook/react/pull/15145))

  - **Add support for the `disablePictureInPicture` attribute on `<video>`. (@eek in [#15334](https://github.com/facebook/react/pull/15334))**

  - Add support for editing `useState` state from DevTools. (@bvaughn in [#14906](https://github.com/facebook/react/pull/14906))

  - Warn when `setState` is called from `useEffect`, creating a loop. (@gaearon in [#15180](https://github.com/facebook/react/pull/15180))

  - Fix a memory leak. (@paulshen in [#16115](https://github.com/facebook/react/pull/16115))

  - Fix hiding Suspense fallback nodes when there is an `!important` style. (@acdlite in [#15861](https://github.com/facebook/react/pull/15861) and [#15882](https://github.com/facebook/react/pull/15882))

- ESLint Plugin: React Hooks

  - `Report Hook` calls at the top level as a violation. (gaearon in [#16455](https://github.com/facebook/react/pull/16455))

## 16.13.0

2020.02.26

- React

  - Warn when a string ref is used in a manner that's not amenable to a future codemod (@lunaruan in [#17864](https://github.com/facebook/react/pull/17864))

  - Deprecate `React.createFactory()` (@trueadm in [#17878](https://github.com/facebook/react/pull/17878))

- React DOM

  - Warn when changes in style may cause an unexpected collision (@sophiebits in [#14181](https://github.com/facebook/react/pull/14181), [#18002](https://github.com/facebook/react/pull/18002))

  - Warn when a `function component` is updated during another component's render phase (@acdlite in [#17099](https://github.com/facebook/react/pull/17099))

  - Deprecate `unstable_createPortal` (@trueadm in [#17880](https://github.com/facebook/react/pull/17880))

  - Call `shouldComponentUpdate` twice when developing in `StrictMode` (@bvaughn in [#17942](https://github.com/facebook/react/pull/17942))

  - Add version property to `ReactDOM` (@ealush in [#15780](https://github.com/facebook/react/pull/15780))

  - Don't call `toString()` of `dangerouslySetInnerHTML` (@sebmarkbage in [#17773](https://github.com/facebook/react/pull/17773))

  - Show component stacks in more warnings (@gaearon in [#17922](https://github.com/facebook/react/pull/17922), [#17586](https://github.com/facebook/react/pull/17586))

- Concurrent Mode (Experimental)

  - Warn for problematic usages of `ReactDOM.createRoot()` (@trueadm in [#17937](https://github.com/facebook/react/pull/17937))

  - Remove `ReactDOM.createRoot()` callback params and added warnings on usage (@bvaughn in [#17916](https://github.com/facebook/react/pull/17916))

  - Adjust `SuspenseList` CPU bound heuristic (@sebmarkbage in [#17455](https://github.com/facebook/react/pull/17455))

  - Fix isPending only being true when transitioning from inside an input event (@acdlite in [#17382](https://github.com/facebook/react/pull/17382))

  - Fix `React.memo` components dropping updates when interrupted by a higher priority update (@acdlite in [#18091](https://github.com/facebook/react/pull/18091))

## 16.14.0

2020.10.14

- React

  - Add support for the new JSX transform. (@lunaruan in [#18299](https://github.com/facebook/react/pull/18299))

    - jsx code:

    ```js
    import React from 'react';

    function App() {
      return <h1>Hello World</h1>;
    }
    ```

    - old code

    ```js
    import React from 'react';

    function App() {
      return React.createElement('h1', null, 'Hello world');
    }
    ```

    - new jsx transform

    ```js
    // Inserted by a compiler (don't import it yourself!)
    import { jsx as _jsx } from 'react/jsx-runtime';

    function App() {
      return _jsx('h1', { children: 'Hello world' });
    }
    ```

## 17.0.0

2020.10.20

[Learn more about React 17 and how to update to it on the official React blog.](https://reactjs.org/blog/2020/10/20/react-v17.html)

- React

  - Add `react/jsx-runtime` and `react/jsx-dev-runtime` for the new JSX transform. (@lunaruan in [#18299](https://github.com/facebook/react/pull/18299))

  - Build component stacks from native error frames. (@sebmarkbage in [#18561](https://github.com/facebook/react/pull/18561))

  - Allow to specify `displayName` on context for improved stacks. (@eps1lon in [#18224](https://github.com/facebook/react/pull/18224))

  - Prevent `use strict` from leaking in the UMD bundles. (@koba04 in [#19614](https://github.com/facebook/react/pull/19614))

- React DOM

  - Delegate events to `roots` instead of `document`. (@trueadm in [#18195](https://github.com/facebook/react/pull/18195) and others)

  - Clean up all effects before running any next effects. (@bvaughn in [#17947](https://github.com/facebook/react/pull/17947))

  - Run `useEffect` cleanup functions asynchronously. (@bvaughn in [#17925](https://github.com/facebook/react/pull/17925))

  - Use browser `focusin` and `focusout` for `onFocus` and `onBlur`. (@trueadm in [#19186](https://github.com/facebook/react/pull/19186))

  - Make all Capture events use the browser capture phase. (@trueadm in [#19221](https://github.com/facebook/react/pull/19221))

  - Don't emulate bubbling of the `onScroll` event. (@gaearon in [#19464](https://github.com/facebook/react/pull/19464))

  - Throw if `forwardRef` or memo component returns `undefined`. (@gaearon in [#19550](https://github.com/facebook/react/pull/19550))
