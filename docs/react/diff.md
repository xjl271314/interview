---
title: Diff算法
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# 如何理解 Diff 算法?

- 2021.08.11

前文我们知道 `Diff` 算法主要是在`组件更新阶段`去比较虚拟 DOM 的差异性然后进行批量处理更新到真实 DOM 的时候使用到的差异性检出算法。

上文也得出虚拟 DOM 比真实 DOM 快这句话其实是错的，或者说是不严谨的。

正确的说法是：**虚拟 DOM 算法操作真实 DOM，性能高于直接操作真实 DOM**，虚拟 DOM 和虚拟 DOM 算法是两种概念。

> 虚拟 DOM 算法 = 虚拟 DOM + Diff 算法

## 什么是 Diff 算法

假设我们有下面这段代码:

```html
<ul id="list">
  <li class="item">11</li>
  <li class="item">22</li>
  <li class="item">33</li>
</ul>
```

用虚拟 DOM 表示后大致上长这么一个样子:

```js
let oldVDOM = {
  // 旧虚拟DOM
  type: 'ul', // 标签名
  props: {
    // 标签属性
    id: 'list',
  },
  children: [
    // 标签子节点
    {
      type: 'li',
      props: { class: 'item' },
      children: ['11'],
    },
    {
      type: 'li',
      props: { class: 'item' },
      children: ['22'],
    },
    {
      type: 'li',
      props: { class: 'item' },
      children: ['33'],
    },
  ],
};
```

然后我们修改其中一个 `<li>` 标签的内容:

```html
<ul id="list">
  <li class="item">11</li>
  <li class="item">22</li>
  <li class="item">44</li>
</ul>
```

修改后的新的虚拟 DOM 大致长这样:

```js
let newVDOM = {
  // 新虚拟DOM
  type: 'ul', // 标签名
  props: {
    // 标签属性
    id: 'list',
  },
  children: [
    // 标签子节点
    {
      type: 'li',
      props: { class: 'item' },
      children: ['11'],
    },
    {
      type: 'li',
      props: { class: 'item' },
      children: ['22'],
    },
    {
      type: 'li',
      props: { class: 'item' },
      children: ['44'],
    },
  ],
};
```

按照理想的状态，我们希望只去修改最后一个`<li>`标签的内容从而达到最小的改动。所幸的是 `Diff` 算法就是帮助我们对比新老虚拟 `DOM` 从而找出变更的节点。

#### 总结

> `Diff 算法`是一种对比算法。对比两者是旧虚拟 DOM 和新虚拟 DOM，对比出是哪个虚拟节点更改了，找出这个虚拟节点，并只更新这个虚拟节点所对应的真实节点，而不用更新其他数据没发生改变的节点，实现精准地更新真实 DOM，进而提高效率。

- 使用虚拟 DOM 算法的损耗计算：

**总损耗 = 虚拟 DOM 增删改 +（与 Diff 算法效率有关）真实 DOM 差异增删改 +（较少的节点）排版与重绘。**

- 直接操作真实 DOM 的损耗计算：

**总损耗 = 真实 DOM 完全增删改 +（可能较多的节点）排版与重绘。**

## React Diff 算法原理

**说一下 React 的算法查找和比较过程，具体如何比较，用了什么算法？怎么查找？时间复杂度为多少？**

完整的 `Diff` 算法非常复杂，复杂度为 `O(n^3)`，因此在 `React` 中将其进行了简化，只会在`同层级`进行, 不会跨层级比较，采用`广度优先(DFS)`的方式，复杂度为 `O(n)`。

进行比较的时候会按照下面的方式进行:

![Diff流程](https://img-blog.csdnimg.cn/20200303165633276.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

其中当`Key`发生变化就进行`插入`和`删除`，否则移动。

通过上面的三种优化策略比较之后，会生成一个 `patchObj（差异对象）`，然后再根据这个 `patchObj` 去更新 DOM 对象，这里的 `patchObj` 主要分两类：

- 一类是 `nodePatchTypes`，主要有 `CREATE/UPDATE/REMOVE/REPLACE`，对应着节点的创建、更新、删除、替换。

- 一类是 `propsPatchTypes`，主要有 `REMOVE/UPDATE`，对应着节点属性的删除和更新。

到了这里我们比较不同的算法通过三种优化策略，将复杂度优化到了 `O(n)`，然后我们只用生成的差异对象，去做 DOM 的更新，而不是完全去渲染整个 DOM。

另外 React 会进行一个事件的批处理操作，将多次更新合并成一次，这样子能近一步减少重排的次数，提高渲染的效率和用户体验。

## Diff 是如何实现的

我们从 Diff 的入口函数`reconcileChildFibers`出发，该函数会根据`newChild`（即 JSX 对象）类型调用不同的处理函数。

```js
// 根据newChild类型选择不同diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {
  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
      // 调用 reconcileSingleElement 处理
      // // ...省略其他case
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

我们可以从同级的节点数量将 Diff 分为两类：

1. 当 newChild 类型为 object、number、string，代表同级只有一个节点

2. 当 newChild 类型为 Array，同级有多个节点
