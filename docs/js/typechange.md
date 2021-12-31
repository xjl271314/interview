---
title: 数据类型、数值转化、比较运算
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javascript 中的变量

- 2021.09.29

## 基本数据类型

在 `javascript` 主要有以下几种基本数据类型:

1. `undefined`
2. `null`
3. `number`
4. `string`
5. `boolean`
6. `symbol`(ES6 中加入的变量类型)
7. `bigInt`(ES10 中加入的变量类型)

## 复杂数据类型

除了基本类型外有一个复杂数据类型:

1. `object`

## 为什么区分原始类型和引用类型

- 不可变性

  原始类型，在`ECMAScript`标准中，它们被定义为`primitive values`，即原始值，代表值本身是不可被改变的。

  以**字符串**为例，我们在调用操作字符串的方法时，没有任何方法是可以直接改变字符串的：

  ```js
  var str = 'Hello';
  str.slice(1); // ello
  str.substr(1); // ello
  str.trim(1); // Hello
  str.toLowerCase(1); // hello
  str[0] = 1;
  console.log(str); // Hello
  ```

  在上面的代码中我们对 str 调用了几个方法，这些方法都在原字符串的基础上产生了一个新字符串，而非直接去改变 str。

  而当我们通过运算符去处理的时候:

  ```js
  str += ' world';
  console.log(str); // Hello world
  ```

  这个时候 str 的值发生了改变，实际上它是因为：**在栈中开辟了一个新的空间用于存储`Hello world`,并将 str 指向了这个空间。**

## 变量的存储方式

在我们将一个值赋给变量时，解析器必须确定这个值是`基本类型值`还是`引用类型值`。

上述说道的基本类型值是**按值进行访问的**，可以操作保存在内存中的实际的值。

### 原始值与引用值

因此我们可以根据引用的方式将变量归类为`原始值`和`引用值`。

他们两者的区别就在于存储的位置与访问的方式不同。

- `原始类型的值`是存储在栈中的简单数据。
- `引用类型的值`是保存在**堆内存**中的对象。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '我们需要注意在`JavaScript`中不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。\n\n当我们复制保存着对象的某个变量的时候，实际上操作的是`对象的引用值`。但是当我们为对象添加属性的时候，操作的是实际的对象。';

export default () => <Info type="warning" txt={txt} />;
```

### 存储方式

在内存中的存储方式有两种:

1. 栈内存

2. 堆内存

#### 栈内存

- 存储的值大小固定
- 空间较小
- 可以直接操作其保存的变量，运行效率高
- 由系统自动分配存储空间

`JavaScript`中的`原始类型的值`被直接存储在`栈`中，在变量定义时，栈就为其分配好了内存空间。

#### 堆内存

- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

相对于原始数据类型，我们习惯把对象称为引用类型，引用类型的值实际存储在`堆内存`中，它在栈中只存储了一个固定长度的地址，这个地址指向堆内存中的值。

```js
const str = 'Hello World'; // string
const obj1 = { id: 1, title: 'Hello World' }; // object
const obj2 = () => console.log('obj2'); // object
const obj3 = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // array
```

![变量存储](https://img-blog.csdnimg.cn/20210225152221299.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 复制基本类型

当我们知道了变量的类型以及不同变量的存储方式，我们来看看基本类型的变量如何进行处理。

当我们从一个变量向另一个变量复制基本类型的值，会在变量对象上创建一个新值，然后把该值复制到为新变量分配的位置上。

```js
var num1 = 5;
var num2 = num1;

num1 = 10;
num2 = ?;
```

我们定义了一个`num1`赋值为 5，然后使用 `num1` 来初始化 `num2`，`num2` 的值也被赋值了 5。

但是实际上`num2`中的 5 与 `num1` 中的 5 是完全独立的，该值只是 `num1` 中 5 的一个副本。

**这两个变量可以参与任何操作而不会相互影响。**

然后我们将 `num1`的值修改为 10，此时 `num2`的值仍然是 5。

![基础变量赋值](https://img-blog.csdnimg.cn/cfbf399e0c4d4e3693ba00e854f455a6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

## 复制引用类型

当我们从一个变量向另一个变量复制引用类型的值时，同样也会将存储在变量对象中的值复制一份放到为新变量分配的空间中。

**不同的是，这个值的副本实际上是一个指针，而这个指针指向存储在堆中的一个对象。复制操作结束后，两个变量实际上将引用同一个对象。**

因此，改变其中一个变量，就会影响另一个变量，如下面的例子所示：

```js
var obj1 = new Object();
var obj2 = obj1;
obj1.name = 'Nicholas';

console.log(obj2.name); //"Nicholas"
```

首先，变量 `obj1` 保存了一个对象的新实例。然后，这个值被复制到了 `obj2` 中；

换句话说，`obj1` 和 `obj2` 都指向同一个对象。这样，当为 `obj1` 添加 `name` 属性后，可以通过 `obj2` 来访问这个属性， 因为这两个变量引用的都是同一个对象。

![引用类型变量](https://img-blog.csdnimg.cn/20200205220827456.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 变量类型检测

- 基础类型变量

如果想检验变量是否是`基础类型`的话，推荐的方式是 `typeof` 操作符。

```js
const a = undefined;
const b = null;
const c = 1234;
const d = '112233';
const e = false;
const f = Symbol('1111');
const g = BigInt(10e20);

[a, b, c, d, e, f, g].map((item) => console.log(typeof item));
// undefined object number string boolean symbol bigint
```

- 引用类型变量

针对引用类型变量，推荐使用 `instanceof` 来判断。

```js
const fn = () => {};
const obj = {};

fn instanceof Function; // true
fn instanceof Object; // true
obj instanceof Function; // false
obj instanceof Object; // true
```

- 通用检测方式

通过原型链上的 `toString` 方法我们可以拿到所有变量的类型检测结果。

```js
const Types = {
    getType(data){
        // [object Object] 截取后面的类型
        return Object.prototype.toString.call(data).slice(8, -1);
    }
    isArray(data) {
        return this.getType(data) === 'Array';
    },
    isObject(data) {
        return this.getType(data) === 'Object';
    },
    isFunction(data) {
        return this.getType(data) === 'Function';
    },
    isString(data) {
        return this.getType(data) === 'String';
    },
    isNumber(data) {
        return this.getType(data) === 'Number';
    },
    isUndefined(data) {
        return this.getType(data) === 'Undefined';
    },
    isNull(data) {
        return this.getType(data) === 'Null';
    },
    isEmpty(data){
        if(this.isString(data)){
            return !data;
        }
        if(this.isObject(data)){
            return JSON.stringify(data) === '{}';
        }
        if(this.isArray(data)){
            return !!data.length;
        }
        return false;
    },
}
```

## 变量之间比较

当我们在对两个变量进行比较时，不同类型的变量的表现是不同的：

- `基础变量类型`是存储在`栈`中,两者的比较只会去比较两者的**类型和值**是否一致，如果一致就返回了 `true`。

  另外`相等判断`判断的是**值是否相等**，`全等判断`是判断**类型和值**是否相等。

```js
const name1 = 'Jack';
const name2 = 'Jack';

console.log(name1 === name2); // true

const val1 = '5';
const val2 = 5;

console.log(val1 == val2); // true
console.log(val1 === val2); // false

const obj1 = {
  name: 'Jack',
};
const obj2 = {
  name: 'Jack',
};
console.log(obj1 === obj2); // false
```

- 对于引用类型 `obj1`、`obj2` 我们知道他们在栈中存储了一个指向堆中数据的指针，两个数据的值虽然是一样的，但是在栈中存储的指针的地址是不一致的，所以两者并不相等。

### React 中的 Component 与 PureComponent

这里穿插下 `React` 中的知识，我们知道 `PureComponent` 与 `Component` 的区别就在于帮我们在`shouldComponentUpdate`生命周期中做了一层浅比较。

而该浅比较比较的是 `props` 和 `state` 是否有变更，也就是说浅比较的是一个`引用类型`的变量，我们来看看内部的[源码](https://github.com/facebook/react/blob/main/packages/shared/shallowEqual.js)是怎么去实现的。

```js
/**
 * 通过遍历对象上的键执行相等性，并在任何键具有参数之间不严格相等的值时返回false。 当所有键的值严格相等时返回true。
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule shallowEqual
 * @typechecks
 * @flow
 */
/*eslint-disable no-self-compare */

'use strict';

const hasOwnProperty = Object.prototype.hasOwnProperty;

function is(x: any, y: any): boolean {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

export default shallowEqual;
```

## 值传递和引用传递

我们通过一个例子先来看看这个定义:

```js
let name = 'Lucy';
const changeName = (name) => {
  name = 'Jack';
};

changeName(name);
console.log(name); // Lucy
```

上述代码的执行 `name` 仍然是 `Lucy`，说明**函数参数传递的是变量的值，即值传递**，改变这个局部变量不会对外部变量产生影响。

再来看另外一个例子:

```js
let obj = {
  name: 'Lucy',
};

function changeValue(obj) {
  obj.name = 'Jack';
}

changeValue(obj);
console.log(obj.name); // Jack
```

上述代码的执行结果 `name` 变成了 `Jack`。**但是，是不是参数是引用类型就是引用传递呢？**

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt = '\n实际上在 `ECMAScript` 中所有的函数的参数都是`按值传递`的。';

export default () => <Info type="warning" txt={txt} />;
```

当函数参数是`引用类型`时，我们同样将参数复制了一个副本到局部变量，只不过复制的这个副本是指向堆内存中的地址而已。

我们在函数内部对对象的属性进行操作，实际上和外部变量指向堆内存中的值相同，但是这并不代表着引用传递，下面我们再看一个例子：

```js
let obj = {};
function changeValue(obj) {
  obj.name = 'Lucy';
  obj = { name: 'Jack' };
}

changeValue(obj);
console.log(obj.name); // Lucy
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n因此可见，函数参数传递的并不是变量的引用，而是`变量拷贝的副本`，当变量是`原始类型`时，这个副本就是值本身，当变量是`引用类型`时，这个副本是指向堆内存的地址。';

export default () => <Info txt={txt} />;
```

## 包装类型

为了便于操作基本类型值，ECMAScript 还提供了几个特殊的引用类型，他们是基本类型的包装类型：

- Boolean
- Number
- String

包装类型和原始类型的区别：

```js
true === new Boolean(true); // false
123 === new Number(123); // false
'123' === new String('123'); // false
console.log(typeof new String('123')); // object
console.log(typeof '123'); // string
```

## 引用类型与基本类型生命周期

- 使用 `new` 操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中。
- 自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。

怎么理解上面的话呢?我们直接来看个例子:

```js
var s1 = 'some text';
s1.color = 'red';

alert(s1.color); //undefined
```

1. 我们先定义了一个字符串类型的`s1`。
2. 然后给 s1 添加了一个 `color` 属性。
3. 接着访问 `s1` 的 `color` 属性发现是一个 `undefiend`。

问题的原因在于第二行创建的 `String` 对象在执行第三行代码时已经被销毁了。第三行代码又创建自己的 `String` 对象，而该对象没有 `color` 属性。

## null、underfined、void 0

在 `Javascript` 中变量只声明不赋值的话默认就是 `undefined`。

`undefined` 表示未定义,它的类型只有一个就是 `undefined`。

`undefined` 值是派生自 `null` 值的，因此`ECMA-262`规定对它们的相等性测试要返回 `true`。

**对于尚未声明过的变量，只能使用 `typeof` 操作符检测其数据类型(对未经声明的变量调用`delete`不会导致错误，但这样做没什么实际意义，在严格模式下确实会导致错误)。**

```js
null == undefined; // true
null === undefined; // false

var a;
typeof a; // undefined

function func() {
  console.log(1111);
}

const fn = func();
console.log(fn); // 没有返回值的函数 返回的值也是undefined
```

**如前所述，无论在什么情况下都没有必要把一个变量的值显式地设置为`undefined`，可是同样的规则对 `null` 却不适用。**

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n<strong style="color: #333;">换句话说，只要意在保存对象的变量还没有真正保存对象，就应该明确地让该变量保存 `null` 值</strong>。\n这样做不仅可以体现 `null` 作为空对象指针的惯例，而且也有助于进一步区分 `null` 和 `undefined`。';

export default () => <Info txt={txt} />;
```

```js
let a; // a用来保存一个基本数据类型 undefined 。
let obj = null; // obj 表示我们可能要存储一个对象 推荐使用 null 进行赋值。
```

## void 0 与 undefined

在 `Javascript` 中 `undefined` 是一个变量而并非是一个`关键字`，所以可能存在无意中被篡改的问题,在这种情况下我们可以使用`void 0` 来代替 `undefined`的值。

```js
function getYear() {
  return 2020;
}

console.log(getYear());
// Output: 2020

console.log(void getYear());
// Output: undefined

// Useful use case
button.onclick = () => void getYear();
```

## 数值转换运算

### 装箱和拆箱

- `装箱转换`：把基本类型转换为对应的包装类型。
- `拆箱操作`：把引用类型转换为基本类型。

#### 基本类型的使用

**`原始类型`不能扩展属性和方法，那么我们是如何使用原始类型调用方法的呢？**

每当我们操作一个基础类型时，后台就会自动创建一个包装类型的对象，从而让我们能够调用一些方法和属性，例如下面的代码：

```js
const name = 'Linda';
const name2 = name.substring(2);
```

上述代码的执行过程:

1. 创建一个 `String` 的包装类型实例.
2. 在实例上调用 `substring` 方法.
3. 销毁实例.

也就是说，我们使用基本类型调用方法，就会自动进行 `装箱` 和 `拆箱` 操作，相同的，我们使用 `Number` 和 `Boolean` 类型时，也会发生这个过程。

#### 引用类型的使用

从`引用类型`到 `基本类型` 转换(拆箱)的过程中，会遵循 `ECMAScript` 规范规定的 `toPrimitive` 原则，一般会调用引用类型的 `valueOf` 和`toString` 方法，我们也可以直接重写 `toPeimitive` 方法。

**这个特性非常的重要，一般转换成不同类型的值遵循的原则不同，例如：**

- 引用类型转换为 `Number` 类型，先调用 `valueOf`，再调用 `toString`。
- 引用类型转换为 `String` 类型，先调用 `toString`，再调用 `valueOf`。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n若 `valueOf` 和 `toString` 都不存在，或者没有返回基本类型，则抛出 `TypeError` 异常。';

export default () => <Info type="warning" txt={txt} />;
```

```js
const obj = {
  valueOf: () => {
    console.log('valueOf');
    return 123;
  },
  toString: () => {
    console.log('toString');
    return 'Linda';
  },
};

console.log(obj - 1); // valueOf 122
console.log(`Hello ${obj}`); // toString  Hello Linda

const obj2 = {
  [Symbol.toPrimitive]: () => {
    console.log('toPrimitive');
    return 123;
  },
};
console.log(obj2 - 1); // valueOf   122

const obj3 = {
  valueOf: () => {
    console.log('valueOf');
    return {};
  },
  toString: () => {
    console.log('toString');
    return {};
  },
};
console.log(obj3 - 1);
// 先执行 valueOf
// 再执行 toString
// 两者都不行 报TypeError
```

除了程序中的自动拆箱和自动装箱，我们还可以手动进行拆箱和装箱操作。我们可以直接调用包装类型的 `valueOf`或 `toString`，实现拆箱操作。

```js
const num = new Number('123');
console.log(typeof num.valueOf()); // number
console.log(typeof num.toString()); // string
```

## 数值类型的转换

### Number()函数

`Number()`函数的转换规则如下:

- 如果是 `Boolean` 值 `true` 和 `false` 将分别被转换为 1 和 0。

  ```js
  const a = true,
    b = false;

  Number(a); // 1
  Number(b); // 0
  ```

- 如果是数值，只是简单的传入和返回。

  ```js
  const a = 1,
    b = 0;

  Number(a); // 1
  Number(b); // 0
  ```

- 如果是 `null` 值，返回 0。

  ```js
  const a = null;

  Number(a); // 0
  ```

- 如果是 `undefined`，返回 NaN。

  ```js
  const a = undefined;

  Number(a); // NaN
  ```

- 如果是字符串，遵循下列规则：

  - 如果字符串中只包含数字，则将其转换为`十进制数值`，即"1"会变成 1，"123"会变成 123，而"011"会变成 11（注意：前导的零被忽略了）；

    ```js
    const a = '1';
    const b = '123';
    const c = '011';

    Number(a); // 1
    Number(b); // 123
    Number(c); // 11
    ```

  - 如果字符串中包含有效的浮点格式，如"1.1"，则将其转换为对应的浮点数值（同样，也会忽略前导零）；

    ```js
    const a = '1.1';
    const b = '0.11';

    Number(a); // 1.1
    Number(b); // 0.11
    ```

  - 如果字符串中包含有效的十六进制格式，例如"0xf"，则将其转换为相同大小的十进制整数值；

    ```js
    const a = '0xf';

    Number(a); // 15
    ```

  - 如果字符串是空的（不包含任何字符），则将其转换为 0；

    ```js
    const a = '';

    Number(a); // 0
    ```

  - 如果字符串中包含除上述格式之外的字符，则将其转换为 `NaN`。

  - 如果是对象，则调用对象的 `valueOf()` 方法，然后依照前面的规则转换返回的值。如果转换的结果是 `NaN`，则调用对象的 `toString()` 方法，然后再次依照前面的规则转换返回的字符串值。

### parseInt()函数

`parseInt()` 函数在转换字符串时，更多的是看其是否符合数值模式。

**它会忽略字符串前面的空格，直至找到第一个非空格字符。如果第一个字符不是数字字符或者负号，`parseInt()` 就会返回 `NaN`，也就是说，用 `parseInt()` 转换空字符串会返回 `NaN`。**

```js
parseInt(''); //NaN
Number(''); //0
```

**如果第一个字符是数字字符，`parseInt()` 会继续解析第二个字符，直到解析完所有后续字符或者遇到了一个非数字字符。**

```js
var num1 = parseInt('1234blue'); // 1234
var num2 = parseInt(''); // NaN
var num4 = parseInt(22.5); // 22
var num3 = parseInt('0xA'); // 10（十六进制数）
var num5 = parseInt('070'); // 56（八进制数）
var num6 = parseInt('70'); // 70（十进制数）
```

实际上 `parseInt(ele, format)`函数接收 2 个参数，第二个参数是进行转化时使用的基数(即多少进制)，默认的情况下使用的是 10 进制。

例如如果知道要解析的值是十六进制格式的字符串，那么指定基数 16 作为第二个参数，可以保证得到正确的结果:

```js
var num = parseInt('0xAF', 16); // 175
```

### parseFloat()函数

与 `parseInt()` 函数类似，`parseFloat()` 也是从第一个字符开始解析每个字符。而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止。

**也就是说，字符串中的第一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略。**

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n由于 `parseFloat()` 只解析十进制值，因此它没有用第二个参数指定基数的用法。\n\n<strong style="color:#333;">最后还要注意一点：如果字符串包含的是一个可解析为整数的数（没有小数点，或者小数点后都是零），`parseFloat()` 会返回整数。</strong>';

export default () => <Info type="warning" txt={txt} />;
```

```js
var num1 = parseFloat('1234blue'); // 1234 （整数）
var num2 = parseFloat('0xA'); // 0 在parseInt中的返回值是10
var num3 = parseFloat('22.5'); // 22.5
var num4 = parseFloat('22.34.5'); // 22.34
var num5 = parseFloat('0908.5'); // 908.5
var num6 = parseFloat('3.125e7'); // 31250000
```

## 运算符比较法则

### + 运算符的转换规则

`+ 操作符`在 `js` 中比较特殊，执行 `+操作符` 时：

- 当一侧为 `String` 类型，被识别为`字符串拼接`，并会优先将另一侧转换为字符串类型。

- 当一侧为 `Number` 类型，另一侧为 `原始类型`，则将`原始类型`转换为 `Number` 类型。

- 当一侧为 `Number` 类型，另一侧为 `引用类型`，将 `引用类型` 和 `Number` 类型转换成`字符串`后拼接。

```js
123 + '123'; // '123123' （规则1）
'011' + 100; // '011100' （规则1）
123 + null; // 123      （规则2）
123 + undefined; // NaN （规则2）
123 + Symbol(0); // Uncaught TypeError: Cannot convert a Symbol value to a number  （规则2）
123 + BigInt(0); // Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions （规则2）
123 + {}; // 123[object Object]  （规则3）

const a = () => {};
123 + a; // '123() => {}'   （规则3）
123 + a(); // NaN 由于a()返回了undefined     （规则2）
```

### - 运算符的转换规则

`- 操作符`在 `js` 中比较特殊，执行 `-操作符` 时：

- 如果执行减法运算的两个操作数中有`字符串类型`，且其中的`字符串`可以转化为`数字`，则会将其转化为`数字`之后再进行运算。

- 如果其中有`字符串`且不能转化为`数字`，则计算结果为 `NaN`。

```js
'10' - 5; // 5      （规则1）
'10' - '3'; // 7    （规则1）
's' - 3; // NaN     （规则2）
'10' - 'a'; // NaN  （规则2）

const a = {
  valueOf: () => 11,
  toString: () => '1',
};

10 - a; // -1 走了a的valueOf方式   （规则1）

const b = {
  valueOf: () => null,
  toString: () => 0,
};

10 - b; // 10 走了 b 的 valueOf 方式 Number(null) 转化为 0   （规则1）

const c = {
  valueOf: () => new Promise((res) => {}),
  toString: () => '0xa',
};

10 - c; // 0 走了 c 的 toString 方式 Number(0xa) 转化为 10   （规则1）

const d = {};

10 - d; // NaN 由于toPrimitive返回值都不是Number类型（规则2）
```

## >、< 比较运算符的规则

`>、< 操作符`在 `js` 中比较特殊，执行 `>、< 操作符` 时：

1. 如果两个变量都是 `Number类型` 的话，就按照值大小进行比较。

2. 如果其中一个变量是 `Number类型` ，另一个变量是 `String类型`的话，会将`String类型`的变量尝试转化为`Number类型`后进行比较。

3. 如果两个变量都是 `String类型` 的话，会通过`逐位(从左往右)进行ASCII码大小的比较`，如果前面位的`ASCII码`值较大则不进行后续比较直接返回`true`。

4. 如果一个变量是 `Object类型`，另外一个是 `Number类型`的话，会尝试根据`toPrimitive`法则将对象的 `valueOf` 返回值与 `Number类型` 的值进行比较。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n为什么说是尝试对象的 `valueOf` 方法呢?\n\n因为 `typeof null` 返回值也是 `object` 但是 `null` 不具备 `valueOf` 方法';

export default () => <Info type="warning" txt={txt} />;
```

5. 如果一个变量是 `Object类型`，另外一个是 `String类型` 的话，会尝试根据`toPrimitive`法则先将对象的 `valueOf` 返回值与`Number(String类型)`的值进行比较，这时候就是两个 `Number类型` 数字大小的比较，如果对象没有 valueOf 方法的话会再次尝试使用 `toString()`方法进行比较，这个时候就是两个 `String类型` 的值比较 `ASCII码`大小。

6. 如果一个变量是 `Array类型`，另外一个是 `Number类型` 的话，这时候的比较又比较有意思了，不论 `Number` 大小返回都是`false` 。

7. 如果一个变量是 `Array类型`，另外一个是 `String类型` 的话，这时候的比较又很有意思了，实际上走的还是规则 3 的`ASCII码`大小比较。

8. 如果一个变量是 `null`，另一个是 `Number类型`的话，走的实际是规则 1，将 `null` 转化为 `Number(null)` 即 0 之后与
   `Number类型` 的值进行比较。

9. 如果一个变量是 `null`，另一个是 `String类型` 的话，走的实际是规则 2，将 `null` 转化为 `Number(null)` 即 0 之后与 `Number(String类型)` 的值进行大小比较。

10. 如果一个变量是 `null`，另一个不是 `Number类型` 或者 `String类型` 的话统一返回值都是 `null < 该类型的值--> false`，`null > 该类型的值--> false`.

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n这里我们不考虑 `null` 与 `undefiend`，`null` 与 `NaN` 这几种场景';

export default () => <Info type="warning" txt={txt} />;
```

11. 如果其中一个变量是`undefined`那么返回值都是 `false`。

```js
1 > 2; // false （规则1）
20 < 100; // true  （规则1）

10 > '10000'; // false            （规则2）
20 > 'a'; // false  'a'转化成NaN   （规则2）
20 < 'a'; // false  'a'转化成NaN   （规则2）

'10' > '100'; // false (规则3)
'20' > '100'; // true 因为2的 ASCII码值大于1 所以直接返回true 后面不进行比较。

const obj = {};
obj > 0; // false
obj < 0; // false 因为toPrimitive之后没有返回值 实际上是 undefined 与 0 比较 (规则4、规则11)

const obj2 = {
  valueOf: () => 1,
  toString: () => undefined,
};
obj2 > 0; // true 因为toPrimitive之后 valueOf 1 > 0 (规则4)

const obj3 = {
  toString: () => '1',
};
obj3 > 0; // true 因为toPrimitive之后 toString '1'进行Number('1')计算后 与 0 进行比较(规则2、规则4)

const obj4 = {
  valueOf: () => null,
  toString: () => undefined,
};

obj4 > -1; // true 因为toPrimitive之后 Number(null) > -1 (规则4、规则8)

const obj5 = {
  toString: () => 'null',
};
obj5 > -1; // false 因为toPrimitive之后 toString 'null' 进行Number('null')计算后得到 NaN 与 -1 进行比较(规则2、规则4)

const obj6 = {};
obj6 > '1'; // true 因为toPrimitive之后 toString返回 '[object Object]'(其实是对象原型上的类型'[object Object]'.charCodeAt() --> 91) 然后与 '1'('1'.charCodeAt() --> 49)进行ASCII码大小的比较  (规则5)

const obj7 = {
  valueOf: () => null,
  toString: () => undefined,
};
obj7 > '-1'; // true 因为toPrimitive之后 Number(null) > '-1' 转化为两个Number进行比较 (规则4、规则8)

const obj8 = {
  toString: () => '258',
};
obj8 > '1000000'; // true 因为toPrimitive之后 toString方法后 '258'(50) 与 '1000000'(49) 比较 （规则3、规则5)

const arr1 = [];
arr1 > 0;
arr1 < 0;

const arr2 = [1, 2, 3];
arr2 > 1; // false (规则6)
arr2 < 1; // false (规则6)

const arr3 = ['1', '2', '3'];
arr3 > 0; // false (规则6)
arr3 < 100; // false (规则6)

arr2 > '0'; // true 实际上是'1,2,3' 与 '0' 比较 (规则3、规则7)
arr2 < '3'; // true 实际上是'1,2,3' 与 '3' 比较 (规则3、规则7)

null > -1; // true 实际上是 0 > -1 (规则8)

null > '-1'; // true 实际上是 0 > '-1' 然后走 0 > -1 (规则2、规则9)

null > NaN; // false       (规则10)
null > undefined; // false (规则10、规则11)
undefined > null; // false (规则10、规则11)
```

## == 相等运算符规则

在进行相等比较运算的时候，不同的数据类型比较遵循以下几条原则:

1. `布尔值`比较运算前会被转换成`数值`，`true` 转化为 1，`false` 转化为 0；

2. `描述数字的字符串`与`数字`进行比较前会被转化成数字。

3. `对象`和`字符串`进行比较前，会将对象转换成字符串`'[object object]'`。

4. `null` 值和 `undefined` 值进行相等比较，结果返回为 `true`。

5. `NaN` 与 `NaN` 比较返回都是 `false`。

```js
true == 1; // true   (规则1)
2 == true; // false  (规则1)
false == 0; // true  (规则1)
!1 == true; // false (规则1)

'11' == 1; // false  (规则2)

const obj = {};
obj == '[object object]'; // true (规则3)

null == undefined; // true (规则4)

NaN == NaN; // false (规则5)
```

## === 全等运算符规则

全等运算符除了满足相等运算的条件上还需要加上`类型`相同的判断。

```js
1 === '1'; // false 值相等，类型不等

undefiend === null; // false 全等判断不通过
```

## && 逻辑与运算符规则

逻辑与运算符进行运算时只有两个操作数都为 `true` 的时候返回结果才是 `true`，否则返回 `false`。不过运算后的最终结果不一定是`布尔值`。

在逻辑与运算的时候遵循以下几条原则:

1. 在两个对象间进行运算时，结果将返回第二个对象。

2. 在进行运算的两个数中，如果一个操作数为 `null`，则结果为 `null`。

3. 在进行运算的两个数中，如果一个操作数为 `NaN`，则结果为 `NaN`。

4. 在进行运算的两个数中，如果一个操作数为 `undefined`，则结果为 `undefined`。

5. 在进行运算的两个数中，如果一个操作数为 `Number` 类型，另一个为字符串 会返回 `Number` 的值。

```js
const obj = { name: "jack" };
{} && obj; // { name: "jack" }; (规则1)

const obj2 = { name: "lucy"};
obj && obj2; // { name: "lucy" }; (规则1)

null && true;  // null  (规则2)
null && 1;    // null   (规则2)

NaN && true; // NaN     (规则3)

undefined && false; // undefined  (规则4)
undefined && true; //  undefined  (规则4)

0 && ''; // 0
0 && <JsxElement />; // 0 这里需要注意，如果后端返回字段是0 这时候UI上会显示一个0
```

## || 逻辑或运算符规则

逻辑或运算符只要满足运算中的数值某一个为 `true` 即可返回 `true`，否则返回 `false`。

- 基础变量类型的或运算满足转化为 `Number > 0` 或者 `非空字符串`即返回 true，其余会返回 false。

- 应用类型的变量遵循下面规则：
  - 当对象为第 1 个操作数时，结果为对象本身。
  - 当对象为第 2 个操作数时，如果第 1 个操作数为 false，则结果为对象本身，如果第 1 个操作数为 ture，则结果为 true。

```js
const obj = {};

obj || false; // {}
true || obj; // true
{} || obj; // {}
```

## ! 逻辑非运算符规则

逻辑非运算符会将输入的值进行 `Boolean` 的转化，遵循以下的规则：

1. 如果操作数是对象，则返回 `false`。

2. 如果操作数为 `0`，则返回 `true`。

3. 如果操作数为`非 0 数字`，则返回 `false`。

4. 如果操作数是 `null`，则返回 `true`。

5. 如果操作数是 `NaN`，则返回 `true`。

6. 如果操作数是 `undefined`，则返回 `true`。

```js
const obj = {};

!obj; // false      (规则1)
!0; // true         (规则2)
!1; // false        (规则3)
!null; // true      (规则4)
!NaN; // true       (规则5)
!undefined; // true (规则6)
```

## 数值比较运算规则

### NaN

`NaN` 和其他任何类型比较永远返回 `false`(包括和他自己)。

```js
NaN == NaN; // false
```

### Boolean

`Boolean`和其他任何类型比较，`Boolean` 首先被转换为 `Number` 类型。

```js
true == 1; // true
true == '2'; // false
true == ['1']; // true
true == ['2']; // false
```

这也是为什么 `undefined`、`null` 和 `布尔值` 比较返回 `false` 的原因，因为 `false` 首先被转换成 `0`。

```js
undefined == false; // false
null == false; // false
```

### String 和 Number

`String` 和 `Number` 比较，先将 `String` 转换为 `Number` 类型。

```js
123 == '123'; // true
'' == 0; // true
```

### null 和 undefined

`null == undefined` 比较结果是 `true`，除此之外，`null`、`undefined` 和其他任何结果的比较值都为 `false`。

```js
null == undefined; // true
null == ''; // false
null == 0; // false
null == false; // false
undefined == ''; // false
undefined == 0; // false
undefined == false; // false
```

### 原始类型和引用类型

当`原始类型`和`引用类型`做比较时，对象类型会依照 `toPrimitive` 规则转换为`原始类型`:

```js
'[object Object]' == {}; // true
'1,2,3' == [1, 2, 3]; // true
```

这里有一个常见的面试题:

```js
[] == ![]; // true
```

!的优先级高于==，![]首先会被转换为 false，然后根据上面第三点，false 转换成 Number 类型 0，左侧[]转换为 0，两侧比较相等。

同理:

```js
([null] == false[undefined]) == // true
```

#### 使用场景

**如何让：a == 1 && a == 2 && a == 3?**

```js
// 解法1
const a = {
  value: [3, 2, 1],
  valueOf: function () {
    return this.value.pop();
  },
};

// 解法2
const a = {
  i: 1,
  toString: function () {
    return a.i++;
  },
};

// 解法3
let val = 0;

Object.defineProperty(window, 'a', {
  get: function () {
    return ++val;
  },
});
```
