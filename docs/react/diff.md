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

前文我们知道 `Diff` 算法主要是在组件更新阶段去比较虚拟 DOM 的差异性然后进行批量处理更新到真实 DOM 的时候使用到的差异性检出算法。

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
  tagName: 'ul', // 标签名
  props: {
    // 标签属性
    id: 'list',
  },
  children: [
    // 标签子节点
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['11'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['22'],
    },
    {
      tagName: 'li',
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
  tagName: 'ul', // 标签名
  props: {
    // 标签属性
    id: 'list',
  },
  children: [
    // 标签子节点
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['11'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['22'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['44'],
    },
  ],
};
```

按照理想的状态，我们希望只去修改最后一个`<li>`标签的内容从而达到最小的改动。所幸的是 `Diff` 算法就是帮助我们对比新老虚拟 `DOM` 从而找出变更的节点。

### 总结

> `Diff 算法`是一种对比算法。对比两者是旧虚拟 DOM 和新虚拟 DOM，对比出是哪个虚拟节点更改了，找出这个虚拟节点，并只更新这个虚拟节点所对应的真实节点，而不用更新其他数据没发生改变的节点，实现精准地更新真实 DOM，进而提高效率。

- 使用虚拟 DOM 算法的损耗计算：

**总损耗 = 虚拟 DOM 增删改 +（与 Diff 算法效率有关）真实 DOM 差异增删改 +（较少的节点）排版与重绘。**

- 直接操作真实 DOM 的损耗计算：

**总损耗 = 真实 DOM 完全增删改 +（可能较多的节点）排版与重绘。**

## Diff 算法原理

完整的 `Diff` 算法非常复杂，复杂度为 `O(n^3)`，因此在 React 中将其进行了简化，只会在同层级进行, 不会跨层级比较，采用`广度优先(DFS)`的方式，复杂度为 `O(n)`。

进行比较的时候会按照下面的方式进行:

![Diff流程](https://img-blog.csdnimg.cn/20200303165633276.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
