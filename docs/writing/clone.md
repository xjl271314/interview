---
title: 浅拷贝与深拷贝
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 浅拷贝与深拷贝

- 2021.10.12

在 `Javascript` 中 `基本类型` 赋值并不会影响原有对象，而`引用数据类型`是存储在内存的`堆`中。

`浅拷贝`引用类型的时候只是拷贝了另一个对象的内存地址，所以在修改时会同时修改另一个对象，而`深拷贝`会开辟新的内存地址，所以不会影响另一个对象。

## 基本数据类型的深拷贝

```js
let a = 1;
let b = a;

b = 2;

console.log(a, b); // a:1, b:2 因为基本类型拷贝只是将其值进行了赋值，并不会影响原对象
```

## 一维数组和一维对象的深拷贝

一维数组的赋值是会影响原有数组内容，而一维数组的拷贝不会。

```js
const arr1 = [1, 2, 3];
const arr2 = arr1;
// Array.slice(),Array.concat()都能实现一维数组的深拷贝
const arr3 = arr1.slice(0);

arr2[1] = 4;
// arr1:[1,4,3] arr2:[1,4,3]
arr3[1] = 5;
// arr1:[1,4,3] arr2:[1,4,3] arr3:[1,5,3]

const obj1 = {
  name: 'xm',
  age: 24,
};

const obj2 = Object.assign({}, obj1);
obj2.name = 'dm';

/**
 * obj1 = {
 *  'name':'xm',
 *  'age':24
 * }
 *
 * obj2 = {
 *  'name':'dm',
 *  'age':24
 * }
 * Object.assign()可以实现一维对象的深拷贝
 */

const fobj1 = {
  id: 1,
  name: {
    firstName: 'Bruce',
    lastName: 'Li',
  },
};

const fobj2 = Object.assign({}, fobj1);

fobj2.id = 2;

/**
 * fobj1 = {
 *   'id':1,
 *   'name':{
 *       'firstName':'Bruce',
 *       'lastName':'Li'
 *   }
 * }
 *
 * fobj2 = {
 *   'id':2,
 *   'name':{
 *       'firstName':'Bruce',
 *       'lastName':'Li'
 *   }
 * }
 */

fobj2['name']['lastName'] = 'Hu';

/**
 * fobj1 = {
 *   'id':1,
 *   'name':{
 *       'firstName':'Bruce',
 *       'lastName':'Hu'
 *   }
 * }
 *
 * fobj2 = {
 *   'id':2,
 *   'name':{
 *       'firstName':'Bruce',
 *       'lastName':'Hu'
 *   }
 * }
 * Object.assign() 如果对象内部仍然存在对象的话 不能进行深拷贝
 */
```

## 乞丐版实现

最简单的乞丐版实现方式是采用 JSON 序列化的方式。

```js
function deepClone(obj){
    let newObj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return obj;
    }
    if(window.JSON){
        newObj = JSON.parse(JSON.stringify(obj);
    }
    return newObj;
}
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n`JSON.parse(JSON.stringify(obj))`方法在序列化过程中，`undefined`、`function`、`symbol`等值在序列化过程中会被忽略(出现在非数组对象的属性中时)或者被转换成 `null`(出现在数组中)。\n\n虽然使用 `JSON` 相关方法的`深拷贝`不能解决这些问题，但是也可以适用绝大部分90%的场景。';

export default () => <Info type="warning" txt={txt} />;
```

```js
let obj1 = {
  x: [1, undefined, Symbol('3310')],
  y: undefined,
  z: function () {
    console.log(111);
  },
  a: Symbol('11111'),
};

const obj2 = JSON.parse(JSON.stringify(obj1));

// obj2: { x: [1, null, null] }
```

## 基础版实现

- 如果是`浅拷贝`的话，我们可以很容易写出下面的代码：

```js
// 创建一个新的对象，遍历需要克隆的对象，将需要克隆对象的属性依次添加到新对象上，返回。
function shallowClone(obj) {
  let newObj = {};
  for (let key in obj) {
    newObj[key] = obj[key];
  }
  return newObj;
}
```

- 如果是`深拷贝`的话，我们需要考虑对象内部的深度，因此我们可以用`递归`来解决问题，稍微改写上面的代码：

  - 如果对象内部属性是`原始类型`，那么直接返回；
  - 如果对象内部属性是`引用类型`，需要创建一个新的对象，遍历需要克隆的对象，将需要克隆对象的属性执行深拷贝后依次添加到新对象上；
  - 如果有更深层次的对象可以继续递归直到属性为`原始类型`。

```js
function deepClone(target) {
  if (typeof target === 'object') {
    let newObj = target.constructor === Array ? [] : {};
    for (let key in target) {
      newObj[key] = deepClone(target[key]);
    }

    return newObj;
  } else {
    return target;
  }
}
```

## 考虑循环引用

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n上述代码可以解决常用的`95%`场景，但是在`对象循环引用自身`的时候还是会报错。我们来看下面这个测试用例:';

export default () => <Info type="warning" txt={txt} />;
```

```js
const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child',
  },
  field4: [2, 4, 8],
};

const obj = deepClone(target);
obj.field2 = 2;

console.log(obj.field2); // 2
console.log(target.field2); // undefined

// 进行循环赋值
target.field5 = target;

const obj2 = deepClone(target);
```

![循环引用](https://img-blog.csdnimg.cn/20724d207396478d86ef17bbcd9b6cae.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

由于上面的对象存在`循环引用`的情况，即对象的属性间接或直接的引用了自身的情况，递归进入死循环导致栈内存溢出了。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n为了解决循环引用问题，我们可以额外开辟一个存储空间，来存储`当前对象`和`拷贝对象`的对应关系，当需要拷贝`当前对象`时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。';

export default () => <Info type="info" txt={txt} />;
```

这个存储空间，需要可以存储 `key-value` 形式的数据，且`key`可以是一个`引用类型`，我们可以选择 `Map` 这种数据结构：

1. 检查 `Map` 中有无克隆过的对象；

   - 有：直接返回；
   - 没有：将当前对象作为 key，克隆对象作为 value 进行存储；

2. 继续克隆；

```js
function deepClone(target, map = new Map()) {
  if (typeof target === 'object') {
    let cloneTarget = target.constructor === Array ? [] : {};
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

// 继续使用上述的例子
const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child',
  },
  field4: [2, 4, 8],
};

// 进行循环赋值
target.field5 = target;

const obj2 = deepClone(target);

console.log(obj2);
```

![改版](https://img-blog.csdnimg.cn/1f25c846e9d943c5aa27b973dd4d248b.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

修改后执行成功,此时 `obj2` 中的 `target` 变为了一个 `Circular`类型，即`循环应用`的意思。

## 使用 WeakMap

上述代码中我们使用 `Map` 来存储 `循环引用` 的对象，实际上我们只需要在拷贝的时候判断使用到，我们可以将 `Map` 改成 `WeakMap` 以节约内存空间。

```js
function deepClone(target, map = new WeakMap()) {
  if (typeof target === 'object') {
    let cloneTarget = target.constructor === Array ? [] : {};
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

因为当我们创建一个对象时：`const obj = {}`，就默认创建了一个 `强引用` 的对象，我们只有手动将`obj = null`，它才会被`垃圾回收机制`进行回收，如果是`弱引用对象`，`垃圾回收机制`会自动帮我们回收。

```js
let obj = { name: 'Linda' };
const target = new Map();
target.set(obj, 'Hello I am Linda');
obj = null;
```

虽然我们手动将 `obj` 进行释放，但是 `target` 依然对 `obj` 存在`强引用关系`，所以这部分内存依然无法被释放。

如果是 `WeakMap` 的话，`target` 和 `obj` 存在的就是`弱引用关系`，当下一次垃圾回收机制执行时，这块内存就会被释放掉。

设想一下，如果我们要拷贝的对象非常庞大时，使用 `Map` 会对内存造成非常大的额外消耗，而且我们需要手动清除 `Map` 的属性才能释放这块内存，而 `WeakMap` 会帮我们巧妙化解这个问题。

## loadsh 实现源码

```js
function deepClone(obj) {
  var copy;

  if (null == obj || 'object' != typeof obj) return obj;

  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Function) {
    copy = function () {
      return obj.apply(this, arguments);
    };
    return copy;
  }

  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
    }
    return copy;
  }

  throw new Error(
    "Unable to copy obj as type isn't supported " + obj.constructor.name,
  );
}
```
