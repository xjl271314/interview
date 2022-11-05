---
title: React中的key
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# React 中的 key

- 2021.12.29

## 引言

在我们实际开发中经常会在控制台看到这么一个警告:

![key描述](https://img-blog.csdnimg.cn/20210309194203833.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

哦~我们遍历生成子组件的时候忘记给子组件加身份了,通常为了方便我们可能都会使用`index`索引作为组件的`key`值。但是这样不是一个好的解决方案。

因此抛出了疑问三连:

1. 为什么 react 组件中经常有一个 key 的概念？
2. 为什么不推荐使用 index 作为 key?
3. 选择怎么样的 key 才是比较合适的?

## 为什么要使用 key?

react 官方文档中是这样描述 key 的：

> key 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。

在 React 中会首先根据 key 值进行比较来确认是如何去更新 DOM,当然我们不传 key 也是可以的,默认会根据 index 索引去比较,但是这样会大大降低效率以及产生其他问题。

我们来看下面这个例子:

```html
<!-- 变更前 -->
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<!-- 变更后 -->
<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

当我们不传入`key`时,默认使用了`index`作为索引,我们在`ul`的最后插入了一个新的`li`。

根据`Diff`算法，React 会先匹配两个 `<li>first</li>` 对应的树，然后匹配第二个元素 `<li>second</li>` 对应的树，最后插入第三个元素的 `<li>third</li>` 树。此时仅在最后插入一个节点。

试想一下,假如我们是在首位插入了一个新的`<li>`。

```html
<!-- 变更前 -->
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<!-- 变更后 -->
<ul>
  <li>third</li>
  <li>first</li>
  <li>second</li>
</ul>
```

当我们是在首部插入的时候，按照 `diff` 算法,React 会进行 3 次比较,然后会重新渲染第二个、第三个 li,造成性能的浪费。

## 为什么不推荐使用 index 作为 key?

还是上面的例子,假如我们使用 index 作为索引,我们的代码会变为:

```html
<!-- 变更前 -->
<ul>
  <li key="0">first</li>
  <li key="1">second</li>
</ul>

<!-- 变更后 -->
<ul>
  <li key="0">third</li>
  <li key="1">first</li>
  <li key="2">second</li>
</ul>
```

我们可以很直观的看到元素的内容没有改变但是 key 的索引发生了变化,React 还是发生了 3 个 li 的重新渲染。

## 如何正确的选择 key?

- **纯展示组件**

纯展示组件单纯的用于展示，不会发生其他变更，使用 index 或者其他任何不相同的值作为 key 是没有任何问题的，因为不会发生 diff，就不会用到 key。

- **推荐使用 index 的情况**

我们要实现分页渲染一个列表，每次点击翻页会重新渲染：

```html
第一页
<ul>
  <li key="0">张三</li>
  <li key="1">李四</li>
  <li key="2">王五</li>
</ul>
第二页
<ul>
  <li key="3">张三三</li>
  <li key="4">李四四</li>
  <li key="5">王五五</li>
</ul>
```

翻页后，三条记录的 key 和组件都发生了改变，因此三个子组件都会被卸载然后重新渲染。

下面我们使用 index:

```html
第一页
<ul>
  <li key="0">张三</li>
  <li key="1">李四</li>
  <li key="2">王五</li>
</ul>
第二页
<ul>
  <li key="0">张三三</li>
  <li key="1">李四四</li>
  <li key="2">王五五</li>
</ul>
```

当我们翻页后，key 不变，子组件值发生改变，组件并不会被卸载，只发生更新。

- **其他场景**

`key`就像我们的身份证 id 一样是一个唯一的编码,这里的 key 不推荐使用`math.random`等随机数进行生成。如果数据源不满足我们这样的需求，我们可以在渲染之前为数据源手动添加唯一 id，而不是在渲染时添加。
