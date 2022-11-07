---
title: ECMAScript 版本历史
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# ES 版本发展历史

- 2022.06.16

## ES6(ES2015)

### let 和 const

`var`声明的变量没有`块级作用域`，早期模拟块级作用域都是使用`闭包`的形式，而`let`和`const`都是块级作用域，这三个关键字的区别主要如下:

```js
{
  var a = 10;
  let b = 20;
  const c = 30;
}

a; // 10
b; // UncaughtReferenceError: b is not defined
c; // UncaughtReferenceError: c is not defined

let d = 40;
const e = 50;
d = 60;
d; // 60
e = 70; // Uncaught TypeError: Assignment to constant variable
```

| 功能说明       | var | let | const |
| :------------- | :-: | :-: | :---: |
| 变量提升       | ✅  | ❌  |  ❌   |
| 全局变量       | ✅  | ❌  |  ❌   |
| 重复声明       | ✅  | ❌  |  ❌   |
| 重新赋值       | ✅  | ✅  |  ❌   |
| 暂时性死区     | ❌  | ✅  |  ✅   |
| 块级作用域     | ❌  | ✅  |  ✅   |
| 只声明不初始化 | ✅  | ✅  |  ❌   |

#### 引申: let 编译成 ES5 之后是如何保持块级作用域的?

```js
// ES6
const result = [];
(function () {
  for (let i = 0; i < 5; i++) {
    result.push(function () {
      console.log(i);
    });
  }
})();
result.forEach(function (item) {
  item();
}); // => 0,1,2,3,4
```

经过`babel`转义后，这里提供一个[在线转化地址](https://es6console.com/):

```js
'use strict';

var result = [];
(function () {
  var _loop = function _loop(i) {
    result.push(function () {
      console.log(i);
    });
  };

  for (var i = 0; i < 5; i++) {
    _loop(i);
  }
})();

result.forEach(function (item) {
  item();
});
```

`let` 创建作用域的方式，其实就是创建了一个函数，在函数内定义一个同名变量并于外部将这个变量传入其中，以此达到创建作用域的目的。

#### 引申: let 变量无法声明提升是如何实现的?

```js
// es6
console.log(a); // undefined
var a = 1;

console.log(b); // VM233:4 Uncaught ReferenceError: b is not defined
let b = 2;

// es5
('use strict');

console.log(a); // undefined
var a = 1;

console.log(b); // undefined
var b = 2;
```

`babel` 编译后理论上 `b` 的输出值应该和 `a` 一样是一个 `undefined`，但是实际上它并不会编译通过，这个逻辑不是由 `babel` 来控制的，目前看来是`浏览器内部 JS 执行引擎`支持和实现的。

#### 引申: 上述说到的暂时性死区是个什么东西?

块级作用域内存在`let / const`命令，它所声明的`变量`或者`常量`就“绑定”（binding）这个区域，不再受外部的影响。

ES6 明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域，凡是在声明之前就使用这些变量，就会报错。这种特性也被成为`暂时性死区`。

```js
// 编译前
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError: tmp is not defined
  let tmp;
}

// 编译后
('use strict');

var tmp = 123;

if (true) {
  _tmp = 'abc';
  var _tmp = undefined;
}
```

同样，这个特性也是被浏览器内部的 JS 执行引擎支持和实现的，`babel` 无法支持这种特性的编译，只能简单的将 `let` 编译成 `var`。

#### 引申: const 声明变量的规则是怎么样的?

我们已经知道了`const`在声明变量的时候就必须要进行赋值，一但 `const` 变量被定义，后面就不能对其进行修改。

这里还需要注意的一点是:

`const` 实际保证的是常量空间存储的数据不可被改变，而常量对应的值可以被改变。比如说我们定义了一个对象:

```js
const student = {
    name: 'jack',
    age: 24
};

// 我们可以对值进行修改
student.age = 25；
student.gender = 'male';

// 但是我们不可以改变其存储的地址 下面的语法就会报错
student = {
    name: 'jack',
    age: 25,
    gender: 'male',
};
```

### 类(Class)

`ES6` 之前构造类的方式都是与`原型链`相关的，在 `ES6` 出现了`class`关键字用来构造一个类。

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  information() {
    return `my name is ${this.name}, I am ${this.age} years old`;
  }
}
```

早期的代码实现:

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.information = function () {
  return `my name is ${this.name}, I am ${this.age} years old`;
};

var person = new Person('Lucy', 18);
```

#### 引申：ES6 底层 class 实现逻辑

##### 检查声明的 class 类是否通过 new 的方式调用，否则会报错

- \_instanceof:

  ```js
  function _instanceof(left, right) {
    if (
      right != null &&
      typeof Symbol !== 'undefined' &&
      right[Symbol.hasInstance]
    ) {
      return right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  }
  ```

- \_classCallCheck:

  ```js
  function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  ```

##### 收集公有函数和静态方法，将方法添加到构造函数或构造函数的原型中，并返回构造函数

- \_createClass:

  ```js
  // Constructor是传入构造函数
  // 可选，protoProps 是要添加到原型上的函数数组
  // 可选，staticProps 是要添加到构造函数本身的函数，即静态方法。
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);

    if (staticProps) _defineProperties(Constructor, staticProps);

    return Constructor;
  }
  ```

##### 将方法添加到构造函数或构造函数的原型中的主要逻辑，遍历函数数组，分别声明其描述符

若`enumerable` 没有被定义为`true`，则默认为`false`，设置 `configurable` 为`true`。

以上两个布尔值是为了限制 `Object.keys()` 之类的方法被遍历到。

如果存在 `value`，就为 `descriptor` 添加 `value` 和 `writable` 属性，如果不存在，就直接使用 `get` 和 `set` 属性。

- \_defineProperties:

  ```js
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  ```

##### class 类实现主体代码

```js
var Person =
  /*#__PURE__*/
  (function () {
    function Person(name, age) {
      _classCallCheck(this, Person);

      this.name = name;
      this.age = age;
    }

    _createClass(Person, [
      {
        key: 'information',
        value: function toString() {
          return `my name is ${this.name}, I am ${this.age} years old`;
        },
      },
    ]);

    return Person;
  })();

var p = new Person('Lucy', 18);
```

##### 解析

- 不使用`new`调用时，`this`指向`window`，所以`instance instanceof Constructor`为`false`，抛出异常。

- 通过调用`_createClass`函数，遍历函数数组。`key`为方法名，若有`value`说明是有具体的 `function` 声明，若无 `value` 说明使用了`get` 或 `set` 方法。

- `Person`类是通过声明一个`IIFE`实现的，`IIFE`是`立即执行函数`，创建即执行。可以保证变量的作用域限制在函数内，避免命名冲突。

### 箭头函数(arrow function)

`es6` 之前的函数中`this`的指向都是跟函数运行时的执行环境有关的，使用箭头函数的时候 `this` 指向跟函数定义时的执行环境有关(this 是继承自父执行上下文)。并且箭头函数语法更简洁，没有自己的`this`，`arguments`，`super`等。

```js
// es5
var list = [1, 2, 3, 4, 5, 6, 7];
var newList = list.map(function (item) {
  return item * item;
});
// es6
const list = [1, 2, 3, 4, 5, 6, 7];
const newList = list.map((item) => item * item);

// es5 function
var a = 11;
var obj = {
  a: 22,
  say: function () {
    console.log(this.a);
  },
};
obj.say(); // 22 this指向运行时的obj对象

// 箭头函数
var a = 11;
var obj = {
  a: 22,
  say: () => {
    console.log(this.a);
  },
};
obj.say(); // 11 箭头函数的this指向obj所在的环境

var a = 11;
function test1() {
  this.a = 22;
  let b = function () {
    console.log(this.a);
  };
  b();
}
var x = new test1(); // 11

var a = 11;
function test2() {
  this.a = 22;
  let b = () => {
    console.log(this.a);
  };
  b();
}
var x = new test2(); // 22
```

另外，箭头函数是不可以当构造函数的，也就是不能通过 `new` 操作符进行操作，否则会报错。

因为箭头函数本身没有自己的 `this`，也没有`arguments`对象,因此`call()`、`apply()`、`bind()`这些方法去改变 `this` 指向对箭头函数也是无效的。

### 函数默认参数

在 es6 之前，如果我们需要定义函数的初始参数，需要这么写:

```js
// es5
function config(data) {
  data = data || 'data is empty';
  // 如果参数的布尔值为fasle的时候就有问题  config(0)
}
// es6
const config = (data = 'data is empty') => {};
```

### 模板字符串

在 ES6 之前，拼接字符串的话都需要+号

```js
var name = 'kirs';
var age = 24;
var info = 'my name is' + name + ', I am ' + age + ' years old';

// es6
const name = 'kirs';
const age = 24;
const info = `my name is ${name}, I am ${age} years old`;
```

### 解构赋值

我们通过解构赋值，可以将属性/值从对象/数组中取出，赋值给其他变量

```js
// es5
var a = 10;
var b = 20;
var temp = a;
a = b;
b = temp;

// es6
let a = 10;
let b = ((20)[(a, b)] = [b, a]);
```

### 模块标准化

在 ES6 之前，js 并没有模块化的概念。也只有社区定制的类似 `Commonjs` 和 `AMD` 之类的规则

```js
// circle.js
const { PI } = Math;
exports.area = (r) => PI * r ** 2;
exports.circumference = (r) => 2 * PI * r;

// index.js
const circle = require('./circle.js');
console.log(`半径为2的圆面积是${circle.area(2)}`);

// circle.js
const { PI } = Math;
export const area = (r) => PI * r ** 2;
export const circumference = (r) => 2 * PI * r;

// index.js
import { area } from './circle.js';
console.log(`半径为2的圆面积是${area(2)}`);
```

### 扩展操作符(Spread operator)

扩展操作符可以在调用函数/数组构造时，将表达式或者字符串在语法层面展开；还可以在构造字面量对象时，将对象表达式按照 key-value 方式展开。

```js
function sum(x, y, z) {
  return x + y + z;
}
var list = [5, 6, 7];
var total = sum.apply(null, list);

// es6
const sum = (x, y, z) => x + y + z;
const list = [5, 6, 7];
const total = sum(...list);
```

**扩展运算符只能适用于那些布置了迭代器的对象(字符串，数组等)**

```js
const obj = {
  id: 112233,
};
const array = [...obj]; // TypeError: obj is not iterable
```

### 对象简写属性

在 ES6 之后如果对象和属性是相同的名字可以简写。

```js
var cat = 'Tom';
var mouse = 'Jerry';

var obj = {
  cat: cat,
  mouse: mouse,
};

// es6
const cat = 'Tom';
const mouse = 'Jerry';

const obj = {
  cat,
  mouse,
};
```

### Promise

`Promise` 是 ES6 提供的一种异步解决方案，比回调函数更加清晰明了。

`Promise` 总共有 3 种状态:

- 等待中(pending)
- 完成了(resolved)
- 拒绝了(rejected)

**`Promise`一旦从`等待状态`变成了`其他状态`就永远不能改变状态了**

```js
new Promise((resolve, reject) => {
  resolve('success');
  // 无效
  reject('reject');
});
```

<Alert type="info">
当我们在构造Promise的时候，构造函数内部的代码是立即执行的。
</Alert>

```js
new Promise((resolve, reject) => {
  console.log('new promise');
  resolve('success');
});

console.log('finish');
// new promise -> finish
```

`Promise`实现了`链式调用`，也就是说每次调用`then`之后返回的都是一个`Promise`，并且是一个全新的`Promise`，原因是因为状态不可变。如果你在`then`中使用了`return`，那么`return`的值会被`Promise.resolve()`包裹。

```js
Promise.resolve(1)
  .then((res) => {
    console.log(res); // 1
    return 2; // Promise.resolve(2)
  })
  .then((res) => {
    console.log(res); // 2
  });
```

### for...of 语句

`for...of`语句在`可迭代对象(array, Map, Set, String, TypedArray, arguments对象等)`上创建一个迭代循环，调用自定义迭代钩子并为每个不同属性的值执行语句。

```js
const arr = ['a', 'b', 'c'];

for (const element of arr) {
  console.log(element);
  // a b c
}

const map = new Map();
map.set('a', 1);
map.set('b', 2);
map.set('c', 3);

for (const element of map) {
  console.log(element);
  // ['a', 1] ['b', 2] ['c', 3]
}
```

### Symbol

`Symbol`是 `ES6` 出现的一种基本数据类型，`symbol()`函数会返回`symbol类型`的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法暴露全局的 `symbol` 注册，且类似于内建对象类。

每个`Symbol()`返回的`symbol`值都是唯一的。当参数为对象时，将调用对象的 `toString()`方法。

一个 `symbol值` 能作为对象属性的标识符；这是该数据类型仅有的目的。

### 迭代器与生成器

迭代器(Iterator)是一种迭代的机制，为各种不同的数据结构提供一种统一的访问方式。任何数据结构只要内部有 Iterator 接口，就可以完成依次迭代的操作。

一旦创建，迭代器对象可以重复调用`next()`显示地迭代，从而获取该对象每一级的值，直到迭代完，返回`{value: undefined, done:true}`

生成器函数使用`function*`语法编写，**最初调用的时候，生成器不执行任何的代码，而是返回一种成为`Generator`的迭代器**。通过调用生成器的下一个方法消耗值时，`Generator`函数将执行，直到遇到`yield`关键字。

```js
function* makeRangeInterator(start = 0, end = Infinity, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

const a = makeRangeInterator(1, 10, 2);
a.next(); // {value: 1, done: false}
a.next(); // {value: 3, done: false}
a.next(); // {value: 5, done: false}
a.next(); // {value: 7, done: false}
a.next(); // {value: 9, done: false}
a.next(); // {value: undefined, done: true}
```

### Set 与 WeakSet

Set 对象允许你存储任何类型的唯一值，无论是原始值还是对象引用。

可以通过 Set 进行数组去重.

```js
const arr = [1, 1, 2, 3, 4, 5, 6, 4];
const newArr = [...new Set(arr)]; // 1,2,3,4,5,6
```

`WeakSet`结构与 `Set` 结构类似，但是有如下两点区别:

1. WeakSet 对象只能存放对象引用，不能存放值，而`Set`结构都可以.
2. WeakSet 对象中存储的对象值都是被弱引用的，如果没有其他的变量或属性引用这个对象值，则这个对象值会被当成垃圾回收掉。正因为这样，WeakSet 对象是无法被枚举的，没有办法拿到它所包含的所有元素。

```js
var ws = new WeakSet();
var obj = {};
var foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(obj); // true
ws.has(foo); // false
ws.delete(window);
ws.has(window); // false

wx.clear(); // 清空整个WeakSet对象
```

### Map 与 WeakMap

`Map对象`保存的是`建/值对`的集合，任何值(对象或者原始值)都可以作为一个键或者一个值。

```js
var myMap = new Map();
myMap.set(NaN, 'not a number');

myMap.get(NaN); // not a number

var otherNaN = Number('foo');
myMap.get(otherNaN); // not a number
```

`WeakMap对象`是一组键/值对的集合，其中的键是弱引用的。其`键必须是对象`，而值是可以任意的。

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

### Proxy 与 Reflect

`Proxy`对象用于定义基本操作的自定义行为(如属性查找，赋值，枚举，函数调用等)。

`Reflect`是一个内置的对象，它提供拦截`javascript`操作的方法。这些方法与`Proxy`的方法相同。`Reflect`不是一个函数对象，因此它是不可构造的。`Proxy`与`Reflect`是非常完美的配合。

```js
const observe = (data, callback) => {
  return new Proxy(data, {
    get(target, key) {
      return Reflect.get(target, key);
    },
    set(target, key, value, proxy) {
      callback(key, value);
      target[key] = value;
      return Reflect.set(target, key, value, proxy);
    },
  });
};
const FooBar = {
  open: false,
};
const FooBarObserver = observe(FooBar, (property, value) => {
  property === 'open' && value
    ? console.log('FooBar is open')
    : console.log('FooBar is closed');
});

console.log(FooBarObserver.open); // false
FooBarObserver.open = true; // true
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '如果对象带有 `configurable:false` 或者 `writable: false` 属性，则代理失效。';

export default () => <Info type="warning" txt={txt} />;
```

### Math 对象的扩展

- `Number.parseInt()` 返回转化值的整数部分
- `Number.parseFloat()` 返回转换值的浮点数部分
- `Number.isFinite()` 是否为有限数值
- `Number.isNaN()` 是否为 NaN
- `Number.isinteger()` 是否为整数
- `Math.trunc()` 返回数值整数部分
- `Math.sign()` 返回数值类型(正数 1、负数-1、零 0)
- `Math.imul(x,y)` 返回两个数值相乘

### Array 对象的扩展

- `Array.from()` 转化具有`Iterator`接口的数据结构为真正的数组，返回新数组

  ```js
  Array.from('foo'); // ["f", "o", "o"]
  ```

- `Array.of()` 转化一组值为真正的数组，返回新数组

  ```js
  Array.of(7); // [7]
  Array.of(1, 2, 3); // [1, 2, 3]
  ```

- `Array.copyWithin(target, start, end)` 把指定位置的成员复制到其他位置，返回原数组

  ```js
  const arr1 = [1, 2, 3, 4, 5];
  arr1.copyWithin(0, 3, 4);
  //  [4, 2, 3, 4, 5]
  ```

- `Array.find()` 返回第一个符合条件的成员

  ```js
  const arr = [5, 12, 18, 130];
  arr.find((item) => item > 10); // 12
  ```

- `Array.findIndex()` 返回第一个符合条件的成员的索引值

  ```js
  const arr = [5, 12, 18, 130];
  arr.findIndex((item) => item > 10); // 1
  ```

- `Array.fill(value, start, end)` 根据指定的值填充整个数组

  ```js
  const arr = [1, 2, 3, 4];
  arr.fill(1); // [1, 1, 1, 1]
  ```

- `Array.keys()` 返回以索引值为遍历器的对象

  ```js
  const arr = [1, 2, 3, 4];
  const iterator = arr.keys();

  for (const key of iterator) {
    console.log(key); // 0 1 2 3
  }
  ```

- `Array.values()` 返回以属性值为遍历器的对象

  ```js
  const arr = [1, 2, 3, 4];
  const iterator = arr.values();

  for (const key of iterator) {
    console.log(key); // 1 2 3 4
  }
  ```

- `Array.entries()` 返回以索引值和属性值为遍历器的对象

  ```js
  const arr = [1, 2, 3, 4];
  const iterator = arr.entries();

  console.log(iterator.next().value); // [0: 1]
  console.log(iterator.next().value); // [1: 2]
  ```

## ES7(ES2016)

### Array.prototype.includes()

用来判断一个数组是否包含一个指定的值。根据情况，如果包含则返回`true`，否则返回`false`。

```js
const arr = [1, 2, 3, NaN];
arr.includes(1); // true
arr.includes(4); // false
arr.includes(NaN); // true
```

**在`includes`方法里可以内数组中判断出是否存在`NaN`值，而`indexOf`无法正确判断出来。**

### 幂运算符\*\*

`幂运算符**`具有与 `Math.pow()` 一样的功能。

```js
console.log(2 ** 10); // 1024
console.log(Math.pow(2, 10)); // 1024
```

## ES8(ES2017)

### async 与 await

`async`与`await`能够解决`promise`嵌套过多带来的问题，可以简化代码，让异步代码看起来像同步代码:

```js
// promise
fetch('coffee.jpg')
  .then((res) => res.blob())
  .then((myBlob) => {
    let objectURL = URL.createObjectURL(myBlob);
    let image = document.createElement('img');
    image.src = objectURL;
    document.body.appendChild(image);
  })
  .catch((err) => {
    console.log('error: ' + err.message);
  });
// async和await

async function myFetch() {
  let response = await fetch('coffee.jpg');
  let myBlob = await response.blob();

  let objectURL = URL.createObjectURL(myBlob);
  let image = document.createElement('img');
  image.src = objectURL;
  document.body.appendChild(image);
}

myFetch();
```

### Object.values()

返回一个给定对象自身的所有可枚举属性值的数组，值的顺序与使用`for...in`循环的顺序相同 ( 区别在于 `for-in` 循环枚举原型链中的属性 )。

```js
const object1 = {
  a: 'somestring',
  b: 42,
  c: false,
};
console.log(Object.values(object1)); // ["somestring", 42, false]
```

### Object.entries()

返回一个给定对象自身可枚举属性的键值对数组。

```js
const object1 = {
  a: 'somestring',
  b: 42,
};

for (let [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// "a: somestring"
// "b: 42"
```

### padStart()

用另一个字符串填充当前字符串(重复，如果需要的话)，以便产生的字符串达到给定的长度。填充从当前字符串的开始(左侧)应用的。

```js
const str1 = '5';
// 用0来填充直到字符串长度达到2
console.log(str1.padStart(2, '0')); // "05"

const fullNumber = '2034399002125581';
const last4Digits = fullNumber.slice(-4);
const maskedNumber = last4Digits.padStart(fullNumber.length, '*');
console.log(maskedNumber); // "************5581"
```

### padEnd()

用一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充。

```js
const str1 = 'Breaded Mushrooms';
console.log(str1.padEnd(25, '.')); // "Breaded Mushrooms........"
const str2 = '200';
console.log(str2.padEnd(5)); // "200  "
```

### Object.getOwnPropertyDescriptors()

用来获取一个对象的所有自身属性的描述符。

```js
const object1 = {
  property1: 42,
};

const descriptors1 = Object.getOwnPropertyDescriptors(object1);

console.log(descriptors1.property1.writable); // true

console.log(descriptors1.property1.value); // 42

// 浅拷贝一个对象
Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj),
);

// 创建子类
function superclass() {}
superclass.prototype = {
  // 在这里定义方法和属性
};
function subclass() {}
subclass.prototype = Object.create(
  superclass.prototype,
  Object.getOwnPropertyDescriptors({
    // 在这里定义方法和属性
  }),
);
```

## ES9(ES2018)

### for await...of

`for await...of` 语句会在异步或者同步可迭代对象上创建一个迭代循环，包括 `String`，`Array`，`Array-like` 对象（比如 arguments 或者 NodeList)，`TypedArray`，`Map`， `Set`和自定义的异步或者同步可迭代对象。其会调用自定义迭代钩子，并为每个不同属性的值执行语句。

```js
async function* asyncGenerator() {
  var i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async function () {
  for await (num of asyncGenerator()) {
    console.log(num);
  }
})();
// 0
// 1
// 2
```

### 正则表达式反向(lookbehind)断言

在 ES9 之前，JavaScript 正则表达式，只支持正向断言。正向断言的意思是：当前位置后面的字符串应该满足断言，但是并不捕获。例子如下：

```js
'fishHeadfishTail'.match(/fish(?=Head)/g); // ["fish"]
```

### 正则表达式 Unicode 转义

### 正则表达式 s/dotAll 模式

### 正则表达式命名捕获组

### 对象扩展操作符

`ES6` 中添加了数组的扩展操作符，让我们在操作数组时更加简便，美中不足的是并不支持对象扩展操作符，但是在 `ES9` 开始，这一功能也得到了支持，例如：

```js
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// 克隆后的对象: { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// 合并后的对象: { foo: "baz", x: 42, y: 13 }
```

### Promise.prototype.finally()

`finally()`方法会返回一个`Promise`，当`promise`的状态变更，不管是变成`rejected`或者`fulfilled`，最终都会执行`finally()`的回调。

```js
fetch(url)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    console.log('结束');
  });
```

## ES10(ES2019)

### Array.prototype.flat() / flatMap()

- `flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

- `flatMap()`与 `map()` 方法和深度为 1 的 `flat()` 几乎相同.，不过它会首先使用映射函数映射每个元素，然后将结果压缩成一个新数组，这样效率会更高。

```js
var arr1 = [1, 2, 3, 4];

arr1.map((x) => [x * 2]); // [[2], [4], [6], [8]]

arr1.flatMap((x) => [x * 2]); // [2, 4, 6, 8]

// 深度为1
arr1.flatMap((x) => [[x * 2]]); // [[2], [4], [6], [8]]
```

`flatMap()`可以代替`reduce()` 与 `concat()`，例子如下：

```js
var arr = [1, 2, 3, 4];
arr.flatMap((x) => [x, x * 2]); // [1, 2, 2, 4, 3, 6, 4, 8]
// 等价于
arr.reduce((acc, x) => acc.concat([x, x * 2]), []); // [1, 2, 2, 4, 3, 6, 4, 8]
```

但这是非常低效的，在每次迭代中，它创建一个必须被垃圾收集的新临时数组，并且它将元素从当前的累加器数组复制到一个新的数组中，而不是将新的元素添加到现有的数组中。

### String.prototype.trimStart() / trimLeft() / trimEnd() / trimRight()

在 ES5 中，我们可以通过`trim()`来去掉字符首尾的空格，但是却无法只去掉单边的，但是在 ES10 之后，我们可以实现这个功能。

```js
const Str = '   Hello world!  ';
console.log(Str); // '   Hello world!  '
console.log(Str.trimStart()); // 'Hello world!  '
console.log(Str.trimLeft()); // 'Hello world!  '
console.log(Str.trimEnd()); // '   Hello world!'
console.log(Str.trimRight()); // '   Hello world!'
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n不过这里有一点要注意的是，`trimStart()`跟 `trimEnd()` 才是标准方法，`trimLeft()` 跟`trimRight()`只是别名。';

export default () => <Info type="warning" txt={txt} />;
```

### Object.fromEntries()

把键值对列表转换为一个对象，它是`Object.entries()`的反函数。

```js
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42],
]);

const obj = Object.fromEntries(entries);

console.log(obj); // Object { foo: "bar", baz: 42 }
```

### String.prototype.matchAll

`matchAll()` 方法返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。并且返回一个不可重启的迭代器。例子如下：

```js
var regexp = /t(e)(st(\d?))/g
var str = 'test1test2'

str.match(regexp) // ['test1', 'test2']
str.matchAll(regexp) // RegExpStringIterator {}
[...str.matchAll(regexp)] // [['test1', 'e', 'st1', '1', index: 0, input: 'test1test2', length: 4], ['test2', 'e', 'st2', '2', index: 5, input: 'test1test2', length: 4]]
```

### BigInt

`BigInt` 是一种内置对象，它提供了一种方法来表示大于 `2^53 - 1` 的整数。这原本是 `Javascript` 中可以用 `Number` 表示的最大数字。

`BigInt` 可以表示任意大的整数。可以用在一个整数字面量后面加 `n` 的方式定义一个 `BigInt` ，如：`10n`，或者调用函数 `BigInt()`。 在以往的版本中，我们有以下的弊端：

```js
// 大于2的53次方的整数，无法保持精度
2 ** 53 === 2 ** 53 + 1;

// 超过2的1024次方的数值，无法表示
2 ** 1024; // Infinity
```

`BigInt` 和 `Number`不是严格相等的，但是宽松相等的。

### globalThis

`globalThis`属性包含类似于全局对象 `this`值。所以在全局环境下，我们有：

```js
globalThis === this; // true
```

## ES11(ES2020)

### Promise.allSettled

在之前使用`Promise.all`的时候，如果其中某个任务出现异常(reject)，所有任务都会挂掉，`Promise`直接进入 `reject` 状态。

当我们在一个页面中并发请求 3 块区域的数据的时候，如果其中一个接口挂了，这将导致页面的数据全都无法渲染出来，这是我们无法接受的。

```js
Promise.all([
  Promise.reject({
    code: 500,
    msg: '服务异常',
  }),
  Promise.resolve({
    code: 200,
    list: [],
  }),
  Promise.resolve({
    code: 200,
    list: [],
  }),
])
  .then((res) => {
    // 如果其中一个任务是 reject，则不会执行到这个回调。
    doSomething(res);
  })
  .catch((error) => {
    // 本例中会执行到这个回调
    // error: {code: 500, msg: "服务异常"}
  });
```

我们想要的是在执行并发任务中，无论一个任务正常或者异常，都会返回对应的的状态（`fulfilled` 或者 `rejected`）与结果（业务`value` 或者 拒因 `reason`）。在 `then` 里面通过 `filter` 来过滤出想要的业务逻辑结果，这就能最大限度的保障业务当前状态的可访问性，而 `Promise.allSettled` 就是解决这问题的。

```js
Promise.allSettled([
    Promise.reject({code: 500, msg:'服务异常'}),
    Promise.resolve({ code: 200, list: []}),
    Promise.resolve({code: 200, list: []})])
]).then((res) => {
    /*
        0: {status: "rejected", reason: {…}}
        1: {status: "fulfilled", value: {…}}
        2: {status: "fulfilled", value: {…}}
    */
    // 其他业务过滤掉 rejected 状态，尽可能多的保证页面区域数据渲染
    RenderContent(res.filter((el) => {
        return el.status !== 'rejected';
    }));
});
```

### 可选链（Optional chaining）

可选链可让我们在查询具有多层级的对象时，不再需要进行冗余的各种前置校验。

```js
// 假设有一个user对象
const name = props && props.user && props.user.info && props.user.info.name;

// 使用可选链
const name = props?.user?.info?.name;
```

可选链中的 `?` 表示如果问号左边表达式有值, 就会继续查询问号后面的字段。

项目中需要支持的话 需要配置`babel`转换:

```js
npm install @babel/plugin-proposal-optional-chaining --dev
```

### 空值合并运算符（Nullish coalescing Operator）

当我们查询某个属性时，经常会遇到，如果没有该属性就会设置一个默认的值:

```js
const level = (user.data && user.data.level) || '暂无等级';
```

如果说用户的等级本身就是 0 级的话，在上述的情况下就会被转化为"暂无等级"。

```js
// 使用空值合并
const level = `${user?.data?.level}级` ?? '暂无等级';
```

## ES12(ES2021)

S2021 并没有像 ES2015 那样提出很多新特性，但却合并了一些有用的特性。

以下是 ES2021 的新特性概览：

- String.prototype.replaceAll
- Promise.any
- WeakRef
- 逻辑赋值运算符
- 数字分隔符

### String.prototype.replaceAll

在 ES2021 之前，要替换掉一个字符串中的所有指定字符，我们可以这么做：

```js
const fruits = '🍎+🍐+🍓+';
const fruitsWithBanana = fruits.replace(/\+/g, '🍌');
console.log(fruitsWithBanana); //🍎🍌🍐🍌🍓🍌
```

ES2021 则提出了`replaceAll`方法，并将其挂载在 `String` 的原型上，可以这么用：

```js
const fruits = '🍎+🍐+🍓+';
const fruitsWithBanana = fruits.replaceAll('+', '🍌');
console.log(fruitsWithBanana); //🍎🍌🍐🍌🍓🍌
```

### Promise.any

`Promise.any`方法和`Promise.race`类似——只要给定的迭代中的一个 `promise` 成功，就采用第一个 `promise` 的值作为它的返回值，但与`Promise.race`的不同之处在于——它会等到所有 `promise` 都失败之后，才返回失败的值：

```js
const myFetch = (url) =>
  setTimeout(() => fetch(url), Math.floor(Math.random() * 3000));
const promises = [
  myFetch('/endpoint-1'),
  myFetch('/endpoint-2'),
  myFetch('/endpoint-3'),
];
// 使用 .then .catch
Promise.any(promises) // 任何一个 promise 成功。
  .then(console.log) // 比如 ‘3’
  .catch(console.error); // 所有的 promise 都失败了
// 使用 async-await
try {
  const first = await Promise.any(promises); // 任何一个 promise 成功返回。
  console.log(first);
} catch (error) {
  // 所有的 promise 都失败了
  console.log(error);
}
```

### WeakRef

WeakRef 提案主要包含两个新功能：

- 可以通过`WeakRef`类来给某个对象创建一个弱引用
- 可以通过`FinalizationRegistry`类，在某个对象被垃圾回收之后，执行一些自定义方法

上述两个新功能可以同时使用，也可以单独使用，取决于你的需求。一个 `WeakRef` 对象包含一个对于某个对象的弱引用，被称为目标或引用。

通过弱引用一个对象，可以让该对象在没有其它引用的情况下被垃圾回收机制回收。`WeakRef` 主要用来缓存和映射一些大型对象，当你希望某个对象在不被其它地方引用的情况下及时地被垃圾回收，那么你就可以使用它。

```js
function toogle(element) {
  const weakElement = new WeakRef(element);
  let intervalId = null;

  function toggle() {
    const el = weakElement.deref();
    if (!el) {
      return clearInterval(intervalId);
    }
    const decoration = weakElement.style.textDecoration;
    const style = decoration === 'none' ? 'underline' : 'none';
    decoration = style;
  }
  intervalId = setInterval(toggle, 1000);
}
const element = document.getElementById('link');
toogle(element);
setTimeout(() => element.remove(), 10000);
```

`FinalizationRegistry`接收一个注册器回调函数，可以利用该注册器为指定对象注册一个事件监听器，当这个对象被垃圾回收之后，会触发监听的事件，具体步骤如下。首先，创建一个注册器：

```js
const registry = new FinalizationRegistry((heldValue) => {
  // ....
});
```

接着注册一个指定对象，同时也可以给注册器回调传递一些参数：

```js
registry.register(theObject, 'some value');
```

### 逻辑赋值运算符

逻辑赋值运算符结合了逻辑运算符和赋值表达式。逻辑赋值运算符有两种：

- 或等于（||=）
- 且等于（&&=）

```js
// 或等于
|   a   |   b   | a ||= b | a (运算后) |
| true  | true  |   true  |        true         |
| true  | false |   true  |        true         |
| false | true  |   true  |        true         |
| false | false |   false |        false        |
a ||= b
// 等同于:
a || (a = b);

// 且等于
|   a   |   b   | a &&= b | a (运算后) |
| true  | true  |   true  |        true         |
| true  | false |   false |        false        |
| false | true  |   false |        false        |
| false | false |   false |        false        |
a &&= b
// 等同于:
a && (a = b);
```

### 数字分隔符

通过这个功能，我们利用 “（\_，U+005F）” 分隔符来将数字分组，提高数字的可读性：

```js
1_000_000_000; // 十亿
101_475_938.38; // 亿万

const amount = 12345_00; // 12,345
const amount = 123_4500; // 123.45 (保留 4 位小数)
const amount = 1_234_500; // 1,234,500

0.000_001; // 百万分之一
1e10_000; // 10^10000

const binary_literals = 0b1010_0001_1000_0101;
const hex_literals = 0xa0_b0_c0;
const bigInt_literals = 1_000_000_000_000n;
const octal_literal = 0o1234_5670;
```

## ES13(ES2022)

### 类的丰富

- 公共属性可以通过实例公共字段创建

  ```js
  // 之前
  class App = {
      constructor(){
          this.name = 'app';
          this.version = '1.0.0';
      }
  }

  // 现在
  class App = {
      // 实例公共字段
      name = 'app';
      version = '1.0.0';
  }
  ```

- 私有属性

  私有字段在类主体之外是不可访问的。

  之所以要引入#而不是使用 private 关键字，是因为 JavaScript 是一门动态语言，没有类型声明，使用独立的符号似乎是唯一的比较方便的可靠的方法，能够比较准确的区分一个属性是否为私有属性。另外 Ruby 语言是用 @ 表示私有属性，JS 中没有使用这个符号而是使用了 #， 因为 @ 已经留给了装饰器(Decorator)。

  ```js
  class App = {
      #author = 'aa';

      #getName(){
          return #author;
      }
  }
  ```

- 静态属性

  可以使用 static 声明静态属性。

  ```js
  class App = {
      static version = '1.0.0';
  }
  ```

### 顶级 await

之前使用 `async/await` 进行配合，不能在 `async` 外使用 `await` 在某些场景下我们往往会这么去使用。

```js
(async()=>{
    await(...);
})();
```

现在可以在任何地方使用 `await` 而不受 `async` 的限制。

```js
await fn(...);
```

### Array.at()

使用 `Array.at(index)` 可以快速的帮我们找到指定位置所对应的值，支持负数(从后往前)查找。

```js
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(arr.at(-2)); // 9 => 等价于 arr[arr.length - 2]
console.log(arr.at(8)); // 9
```

### Object.hasOwn()

这是检查 obj 对象自身属性 propKey 的一种安全方法。它类似于`Object.prototype.hasOwnProperty`但它支持所有对象类型。

```js
const proto = {
  protoProp: 'protoProp',
};

const obj = {
  __proto__: proto,
  objProp: 'objProp',
};

console.log('protoProp' in obj); // output - true.
console.log(Object.hasOwn(obj, 'protoProp')); // output - false
console.log(Object.hasOwn(proto, 'protoProp')); // output - true.
```

### error.cause

通过分析错误及其子类可以让我们指定错误背后的原因。

```js

function request(res) {
    try {
        // ···
    } catch (error) {
        throw new Error(
          `request error`,
          {cause: error}
        );
    }
```
