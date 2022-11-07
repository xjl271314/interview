---
title: Vue与React的差异
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: vue2
  path: /vue/2.0
---

# Vue 与 React 的差异

- 2022.11.01

1. 设计理念不同

   - react 整体上是`函数式编程`思想，组件使用 jsx 语法，all in js，将 html 与 css 全都融入 javaScript 中，jsx 语法相对来说更加灵活。
   - vue 的整体思想，是拥抱经典的`html(结构)+css(表现)+js(行为)`的形式，使用 template 模板，并提供指令供开发者使用，如 v-if、v-show、v-for 等，开发时有结构、表现、行为分离的感觉

2. 数据是否可变

   - vue 的思想是响应式的，通过`Object.defineproperty`或`proxy`代理实现数据监听，每一个属性添加一个`dep`对象（用来存储对应的 watcher），当属性变化的时候，通知对应的 watcher 发生改变。
   - react 推崇的是数据不可变，react 使用的是浅比较，如果对象和数据的引用地址没有变，react 认为该对象没有变化，所以 react 变化时一般都是新创建一个对象。

3. 更新渲染方式不同

   - 当组件的状态发生变化时，vue 是响应式，通过对应的 watcher 自动找到对应的组件重新渲染
   - react 需要更新组件时，会重新走渲染的流程，通过从根节点开始遍历，dom diff 找到需要变更的节点，更新任务还是很大，需要使用到 Fiber，将大任务分割为多个小任务，可以中断和恢复，不阻塞主进程执行高优先级的任务

4. 各自的优势不同

   - vue 的优势包括：框架内部封装的多，更容易上手，简单的语法及项目创建， 更快的渲染速度和更小的体积
   - react 的优势包括： react 更灵活，更接近原生的 js、可操控性强，对于能力强的人，更容易造出更个性化的项目
