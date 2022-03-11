---
title: 扩展运算符
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# ES6 中的扩展运算符

- 2022.02.15

扩展操作符 `…` 是 ES6 中引入的，将`可迭代对象`展开到其单独的元素中，所谓的`可迭代对象`就是任何能用`for of`循环进行遍历的对象，例如：`数组（数组常用方法）`、`字符串`、`Map`、`Set`、`DOM节点`等。

## 1.拷贝数组对象

项目中常用扩展运算符来拷贝数组，**这里需要特别注意的是在拷贝数组的时候，只有第一层是深拷贝(或者说拷贝一维数组就是深拷贝)**:

- 拷贝数组

  ```js
  const arr1 = [1, 2, 3, 4, 5];

  const arr2 = [...arr1];

  arr2.push(6);

  console.log(arr1); // [1, 2, 3, 4, 5]
  console.log(arr2); // [1, 2, 3, 4, 5, 6]

  const arr3 = [1, 2, 3, [4, 5]];
  const arr4 = [...arr3];

  arr4[3][0] = 6;
  console.log(arr3); // [1, 2, 3, [6, 5]]
  console.log(arr4); // [1, 2, 3, [6, 5]]
  ```

- 拷贝对象

  ```js
  const time = {
    year: 2022,
    month: 2,
    day: {
      value: 15,
    },
  };

  const copyTime = { ...time };

  copyTime.month = '02';
  copyTime.day.value = 16;

  console.log(copyTime); // { year: 2022, month: 02, day: { value: 16 } }
  console.log(time); // { year: 2022, month: 2, day: { value: 16 } }
  ```

## 2.合并操作

- 合并数组

```js
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [6, 7, 8, 9, 10];

const arr = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
```

- 合并对象

合并对象时需要注意的是如果有相关的键，后续的键所对应的值会覆盖之前的键值。

```js
const obj1 = {
  a: 1,
  b: 2,
  c: 3,
};

const obj2 = {
  a: 2,
  d: 4,
  e: 5,
};

const obj = {
  ...obj1,
  ...obj2,
}; // { a: 2, b: 2, c: 3, d: 4, e: 5 }
```

## 3.参数传递

```js
const sum = (num1, num2) => num1 + num2;

console.log(sum(...[1, 2])); // 3
console.log(sum(...[1, 2, 3, 4])); // 10
```

## 4. 数组去重

```js
const arr = [1, 1, 2, 4, 3, 3];
const uniqueArr = [...new Set(arr)]; // [1, 2, 4, 3]
```

## 5. 字符串转字符数组

可以使用扩展运算符将`字符串类型`转化为字符串数组。

```js
const str = 'hello';
const charts = [...str]; // ['h', 'e', 'l', 'l', 'o']
```

## 6. NodeList 转数组

`NodeList 对象`是节点的集合，通常是由属性，如 `Node.childNodes` 和方法，如 `document.querySelectorAll` 返回的。

`NodeList` 类似于数组，但不是数组，没有 `Array` 的所有方法，例如`find`、`map`、`filter` 等，但是可以使用 `forEach()` 来迭代。

```js
const nodeList = document.querySelectorAll('.row');
const nodeArray = [...nodeList];
console.log(nodeList);
console.log(nodeArray);
```

## 7. 解构变量

- 解构数组

  ```js
  const [first, ...rest] = [1, 2, 3, 4, 5];
  console.log(first); // 1
  console.log(...rest); // 2,3,4,5
  ```

- 解构对象

  ```js
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  };

  const { a, ...rest } = obj;
  console.log(a); // 1
  console.log(rest); // {b: 2, c: 3}
  ```

## 8. 打印日志

在打印可迭代对象的时候，需要打印每一项可以使用扩展符，如下：

```js
const users = [1, 2, 3, 4];
console.log(...users); // 1 2 3 4
```
