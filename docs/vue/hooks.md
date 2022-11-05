---
title: 为什么vue和react都选择了Hooks
nav:
  title: Vue
  path: /vue
  order: 0
group:
  title: vue2
  path: /vue/2.0
---

# 为什么 vue 和 react 都选择了 Hooks?

- 2022.11.01

1. 更好的状态复用

   对于 vue2 来说，使用的是 mixin 进行混入，会造成方法与属性的难以追溯。 随着项目的复杂，文件的增多，经常会出现不知道某个变量在哪里引入的，几个文件间来回翻找， 同时还会出现同名变量，相互覆盖的情况……

2. 更好的代码组织

   vue2 的属性是放到 data 中，方法定义在 methods 中，修改某一块的业务逻辑时， 经常会出现代码间来回跳转的情况，增加开发人员的心智负担。

   使用 Hooks 后，可以将相同的业务逻辑放到一起，高效而清晰地组织代码。

   ![hooks](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5824a603651b4bf9bf8689436e29f2b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

3. 告别 this

   this 有多种绑定方式，存在显示绑定、隐式绑定、默认绑定等多种玩法，里边的坑不是一般的多。

   vue3 的 setup 函数中不能使用 this，不能用挺好，直接避免使用 this 可能会造成错误的。
