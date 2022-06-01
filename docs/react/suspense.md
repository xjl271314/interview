---
title: Suspense
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# Suspense 详解

- 2022.04.06

## 前言

早期的`React V16.6`的时候新增了一个`<Suspense>`组件，使用这个组件我们可以自定义实现部分功能的加载`loading`效果，不过这个组件内部的组件需要使用`React.lazy`进行懒加载，这个特性也经常被用于代码分割。

```js
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>;
```

## 原理

`Suspense`作为一个通用的技术，核心原理有两方面：`通信`和`渲染`。

- `通信`是指：`Suspense`与嵌入其内部的组件之间的通信，即`Suspense`如何获取组件的异步状态.

- `渲染`是指：`Suspense`如何控制嵌入其内部的组件的渲染.

### 如何获取组件的异步状态？

通过“隐式”的获取组件异步状态所关联的`promise`。

`Suspense`作为一个框架内置的组件，它有`充分的自由`去获取任何运行时中存在的变量。

如果在`render`中`throw`了一个`promise`，那么`React`就能捕获到这个`promise`，并自动传递给离这个组件最近的那个`Suspense`。

这样，`Suspense`就能获取到组件的异步状态了。

### 如何控制嵌入其内部的组件的渲染？

预渲染嵌入的组件到一个隐藏的 dom 容器中，并在异步状态`resolve`之后把预渲染的组件移动到真实的 dom 容器中。

`Suspense`总会预渲染组件到一个隐藏的容器，之后它会根据所关联的`promise`的状态进行抉择：

1. 如果`promise`处于`pending`状态，那么就会渲染`fallback`组件到真实的`dom`容器中

2. 如果`promise`到达`resolve`状态，那么就会直接把预渲染好的组件移动到真实的 dom 容器中，并清除`fallback`组件.

3. 如果`promise`到达`reject`状态，那么框架会直接抛出`reject`的错误，后面可以被`ErrorBoundary`接收

## 使用示例

### sync 渲染模式下 + Suspense

同步模式下在内部组件渲染之前都会展示一个 loading 的效果，如果加载时间短的话也会显示，体验上不太友好。

```js
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>;

// ReactDOM.render
```

### Concurrent 渲染模式下 + Suspense

使用`Concurrent`模式下可以给`Suspense`增加`maxDuration`字段，在指定时间内返回则不显示 loading。

```js
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense maxDuration={500} fallback={<Spinner />}>
  <ProfilePage />
</Suspense>;

// ReactDOM.createRoot
```

## 在异步渲染下的作用

划分页面中需要并发渲染的部分。
