---
title: Map、WeakMap、Set、WeakSet
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 简单描述下 Map、WeakMap、Set、WeakSet 之间的区别?

- 2021.06.02

## Map:

> Map 对象保存的是`键/值对`的集合，任何值(对象或者原始值)都可以作为一个键或者一个值。

```js
var myMap = new Map();
myMap.set(NaN, 'not a number');

myMap.get(NaN); // not a number

var otherNaN = Number('foo');
myMap.get(otherNaN); // not a number
```

## WeakMap:

> WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值是可以任意的。

```js
var wm1 = new WeakMap(),
    wm2 = new WeakMap(),
    wm3 = new WeakMap(),

var o1 = {},
    o2 = function(){},
    o3 = window;

wm1.set(o1, 37);
wm1.set(o2, "aa");
wm2.set(o1, o2);
wm2.set(o3, undefined);
wm2.set(wm1, wm2);
wm1.get(o2) // aa
wm2.get(o2) // undefined
wm2.get(o3) // undefined

wm1.has(o2) // true
wm2.has(o2) // false
wm2.has(o3) // true

wm3.set(o1, 37);
wm3.get(o1) // 37
wm3.clear()
wm3.get(o1) // undefined,w3为空

wm1.has(o1) // true
wm1.delete(o1)
wm1.has(o1) // false
```

## Set:

> `Set`出现于`ES6`。`Set` 本身是一个构造函数，用来生成 `Set` 数据结构。

```js
new Set([iterable]);
```

`Set` 函数可以接受一个数组（或者具有 `iterable` 接口的其他数据结构）作为参数，用来初始化。

举个例子，我们可以通过`Set`进行数组去重.

```js
const arr = [1, 1, 2, 3, 4, 5, 6, 4];
const newArr = [...new Set(arr)]; // 1,2,3,4,5,6
```

`Set` 对象允许你存储`任何类型`的值，无论是`原始值`或者是`对象引用`。它类似于数组，但是成员的值都是唯一的，没有重复的值。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '向 `Set` 加入值的时候，不会发生类型转换，所以 5 和 "5" 是两个不同的值。`Set` 内部判断两个值是否不同，使用的算法叫做`Same-value-zero equality`，它类似于`精确相等运算符（===）`，主要的区别是 `NaN` 等于自身，而精确相等运算符认为` NaN`不等于自身。';

export default () => <Info type="warning" txt={txt} />;
```

```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set; // Set {NaN}

let set1 = new Set();
set1.add(5);
set1.add('5');
console.log([...set1]); // [5, "5"]
```

### Set 实例属性

- constructor： 构造函数

- size：元素数量

```js
let set = new Set([1, 2, 3, 2, 1]);

console.log(set.length); // undefined
console.log(set.size); // 3
```

### Set 实例方法

```js
const set = new Set([1, 2, 3, 4]);
// 类似数组的push 向set里面添加新的元素。 返回最新的set元素。
set.add(5);

// 类似数组中删除元素,存在即删除集合中value, 删除成功返回true，否则返回false。
set.delete(3);

// 判断集合中是否存在某个元素。存在的话返回true，不存在返回false。
set.has(2);

// 清空整个集合
set.clear();
```

### 补充: Set 结构如何转化为数组？

```js
const set = new Set([1, 2, 3, 2]);

const arr = [...set];

const arr2 = Array.from(set);
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt = '`Set` 可默认遍历，默认迭代器生成函数是 `values()` 方法。';

export default () => <Info type="info" txt={txt} />;
```

```js
Set.prototype[Symbol.iterator] === Set.prototype.values; // true
```

所以， `Set` 可以使用 `map`、`filter` 方法。

```js
let set = new Set([1, 2, 3]);
set = new Set([...set].map((item) => item * 2));
console.log([...set]); // [2, 4, 6]

set = new Set([...set].filter((item) => item >= 4));
console.log([...set]); //[4, 6]
```

## WeakSet:

> WeakSet 结构与 Set 结构类似，但是有如下两点区别:

1. `WeakSet` 对象只能存放对象引用，不能存放值，而 `Set 结构`都可以.

2. `WeakSet` 对象中存储的对象值都是被弱引用的，如果没有其他的变量或属性引用这个对象值，则这个对象值会被当成垃圾回收掉。正因为这样，`WeakSet` 对象是无法被枚举的（ES6 规定 WeakSet 不可遍历），没有办法拿到它所包含的所有元素。

```js
var ws = new WeakSet();
var obj = {};
var foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo); // false 对象foo没有被添加

ws.delete(window);
ws.has(window); // false

wx.clear(); // 清空整个WeakSet对象
```

## 区别:

- `Set` 和 `Map` 主要的应用场景在于 `数据重组` 和 `数据储存`。

- `Set` 是一种叫做`集合`的数据结构，`Map` 是一种叫做`字典`的数据结构。

- 集合 是以 `[value, value]`的形式储存元素，字典 是以 `[key, value]` 的形式储存
