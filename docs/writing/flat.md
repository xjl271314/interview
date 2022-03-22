---
title: 手写实现Array.flat()
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写 Array.flat()

- 2022.01.28

## 特性总结

- `Array.prototype.flat()` 用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。
- 不传参数时，默认“拉平”一层，可以传入一个整数，表示想要“拉平”的层数。
- 传入 `<=0` 的整数将返回原数组，不“拉平”。
- `Infinity` 关键字作为参数时，无论多少层嵌套，都会转为一维数组。

## 实现思路

实现一个有数组扁平化功能的 `flat` 函数，我们要做的就是在数组中找到是`数组类型`的元素，然后将他们展开。这就是实现数组拍平 `flat` 方法的关键思路。

- 流程:

  - 第一要遍历数组的每一个元素；
  - 第二判断元素是否是数组；
  - 第三将数组的元素展开一层；

- 遍历数组方案：

  - for 循环
  - for...of
  - for...in
  - forEach()
  - entries()
  - keys()
  - values()
  - reduce()
  - map()

- 判断元素是数组方案：

  - instanceof
  - constructor
  - Object.prototype.toString
  - isArray

- 考虑数组空位
  - forEach(), filter(), reduce(), every() 和 some() 都会跳过空位。

## 使用 reduce + Array.concat

> 该解法传入的 depth 小于 1 的情况(小于 1 会当做 Infinity 进行处理)，reduce 会考虑空位。

```js
function flat(arr, depth = 1) {
  if (depth === Infinity) {
    return [].concat(...arr.map((v) => (Array.isArray(v) ? flat(v) : v)));
  }
  if (depth === 1) {
    return arr.reduce((a, v) => a.concat(v), []);
  }
  return arr.reduce(
    (a, v) => a.concat(Array.isArray(v) ? flat(v, depth - 1) : v),
    [],
  );
}
```

## 使用 forEach + Array.concat

> 该解法下默认当做全部展开处理，forEach 会考虑空位。

```js
function flat(arr) {
  let arrResult = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      // 这里可以使用 arguments.callee(item); 或者 arrResult.push(...arguments.callee(item));
      // 但是访问 arguments 是个很昂贵的操作，因为它是个很大的对象，每次递归调用时都需要重新创建。
      // 影响现代浏览器的性能，还会影响闭包。
      arrResult = arrResult.concat(flat(item));
    } else {
      arrResult.push(item);
    }
  });
  return arrResult;
}
```

## 使用栈的思想实现

> 栈是一种 LIFO(last in first out)的数据结构，使用该方法的时候需要自行处理数组空位。

```js
function flat(arr) {
  const result = [];
  // 将数组元素拷贝至栈
  const stack = [...arr];
  // 如果栈不为空，则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop();
    if (Array.isArray(val)) {
      // 如果是数组再次入栈，并且展开一层
      stack.push(...val);
    } else {
      // 这里如果是空位的话，继续continue
      if (val === undefined) {
        continue;
      }
      result.unshift(val);
    }
  }

  return result;
}
```

## 使用 Generator 实现

```js
function* flat(arr, depth = 1) {
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      yield* flat(item, depth - 1);
    } else {
      yield item;
    }
  }
}
// [...flat([1,2,3,'',[4,[5]]], Infinity)] ==> [1, 2, 3, '', 4, 5]
```

## 实现 Array.prototype.flat

```js
Array.prototype.flat = function (depth = 1) {
  // 不满足条件返回原数组
  if (!Number(depth) || Number(depth) < 0) {
    return this;
  }
  let arr = [].concat(this);

  return depth > 0
    ? arr.reduce(
        (pre, cur) => pre.concat(Array.isArray(cur) ? cur.flat(--depth) : cur),
        [],
      )
    : arr.slice();
};
```
