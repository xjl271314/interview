---
title: computed 与 watch
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: vue2
  path: /vue/2.0
---

# computed 与 watch

- 2022.04.19

## computed

1. 支持缓存，适用于一些重复使用数据或复杂费时的运算。我们可以把它放入`computed`中进行计算，然后会在`computed`中缓存起来，当依赖的值不发生变化，对其取值时计算属性方法不会重复执行。
2. computed 有缓存的功能，通过 dirty 控制。

3. 如果我们需要的数据依赖于其他的数据的话, 我们可以把该数据设计到`computed`中。

4. 但是不支持`异步`，当`computed`内有异步操作时无效，无法监听数据的变化。

## watch

1. watch 它是一个对 data 的数据监听回调, 当依赖的 data 的数据变化时, 会执行回调。在回调中会传入`newVal`和`oldVal`两个参数。

2. 支持监听`普通数据类型`和`引用数据类型`（如果需要监听对象属性变化，需要搭配`deep:true`使用），也只是监听对象某个属性的变化。

3. 不支持缓存，当数据变化时，会触发`watch`中的内容。
