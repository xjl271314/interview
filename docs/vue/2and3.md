---
title: Vue2与Vue3的区别
nav:
  title: Vue
  path: /vue
  order: 0
group:
  title: vue2
  path: /vue/2.0
---

# Vue2 与 Vue3 的区别

- 2022.11.01

- vue3 性能比 Vue2.x 快 1.2~2 倍
- 使用 `proxy` 取代 `Object.defineproperty`，解决了`vue2`中新增属性监听不到的问题，同时`proxy`也支持数组，不需要像`vue2`那样对数组的方法做拦截处理
- diff 方法优化
  - vue3 新增了静态标记（patchflag），虚拟节点对比时，就只会对比这些带有静态标记的节点
- 静态提升
  - vue3 对于不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用即可。vue2 无论元素是否参与更新，每次都会重新创建然后再渲染。
- 事件侦听器缓存
  - 默认情况下 onClick 会被视为动态绑定，所以每次都会追踪它的变化，但是因为是同一个函数，所以不用追踪变化，直接缓存起来复用即可。
- 按需引入，通过 treeSharking 体积比 vue2.x 更小。
- 组合 API（类似 react hooks），可以将 data 与对应的逻辑写到一起，更容易理解。
- 提供了很灵活的 api 比如 toRef、shallowRef 等等，可以灵活控制数据变化是否需要更新 ui 渲染。
- 更好的 Ts 支持。
