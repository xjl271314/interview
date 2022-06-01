---
title: Symbol
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# Symbol 指南

- 2022.04.01

## 定义

`Symbol`是 `ES6` 出现的一种基本数据类型，`symbol()`函数会返回`symbol`类型的值，该类型具有`静态属性`和`静态方法`。它的静态属性会暴露几个内建的成员对象；它的静态方法暴露全局的 `symbol` 注册，且类似于内建对象类。

每个`Symbol()`返回的`symbol`值都是唯一的。当参数为`对象`时，将调用对象的 `toString()`方法。

```js
const s1 = Symbol('foo');
const s2 = Symbol('foo');

s1 == s2; // false 每个`Symbol()`返回的`symbol`值都是唯一的

const obj = {};
const s3 = Symbol(obj); // Symbol([object Object]) Obj.toString([object Object])
```

## 输出

当我们去 `console.log(Symbol)` 的时候，实际上我们调用的是 `Symbol.toString()`。

## 返回类型

由于是新增的基本类型，因此 `ES6`也拓展了`typeof`关键字，当我们去检查一个`symbol`的时候回返回`symbol`类型。

同时 基本类型是不能使用`new`关键字去创建。

```js
const symbol1 = Symbol();

console.log(typeof symbol1); // "symbol"

const symbol2 = new Symbol(); // Uncaught TypeError: Symbol is not a constructor
```

## 如何创建相等的 Symbol？

当我们需要创建一个相等(共享)的`symbol`值的时候，我们需要借助`symbol.for(key)`函数。

`Symbol.for(key)`使用给定的 `key` 搜索现有的 `symbol`，如果找到则返回该 `symbol`。否则将使用给定的 `key` 在全局 `symbol` 注册表中创建一个新的 `symbol`。

```js
const symbol1 = Symbol.for('foo');
const symbol2 = Symbol.for('foo');

console.log(symbol1 === symbol2); //  true
```

## 取值

当我们使用 `symbol.for(key)` 创建时，我们可以通过 `Symbol.keyFor(el)`来获取到对应的值，而当我们使用 `symbol(key)` 去创建时，尝试获取的话会返回 `undefined`。

```js
const symbol1 = Symbol.for('foo');
const symbol2 = Symbol('foo');

Symbol.keyFor(symbol1); // "foo"
Symbol.keyFor(symbol2); // undefined
```

## 使用场景

### 模拟对象的私有属性

当使用 `Symbol` 作为对象的 key 时，可以保证对象不会出现重名属性，调用`for...in`不能将其枚举出来，另外调用 `Object.getOwnPropertyNames`、`Object.keys()`也不能获取 `Symbol` 属性。

如果需要获取对象中的 `Symbol` 属性，需要使用 `ES6` 新增的 `Object.getOwnPropertySymbols()` 方法。

```js
var obj = {
  name: 'Lucy',
  [Symbol('name')]: 'jack',
};
Object.getOwnPropertyNames(obj); // ["name"]
Object.keys(obj); // ["name"]
for (let i in obj) {
  console.log(i); // name
}
Object.getOwnPropertySymbols(obj); // [Symbol(name)]
```

### 作为对象唯一的 value

这个场景和上述作为 key 同理。

### React 中检验组件合法性

在`React`的`ReactElement`对象中，有一个`$$typeof`属性，它是一个 `Symbol` 类型的变量：

```js
const REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;
```

`ReactElement.isValidElement`函数用来判断一个 `React` 组件是否是有效的，下面是它的具体实现。

```js
ReactElement.isValidElement = function (object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
};
```

`React`渲染时会把没有`$$typeof`标识，以及规则校验不通过的组件过滤掉。

如果你的服务器有一个漏洞，允许用户存储任意 `JSON` 对象， 而客户端代码需要一个字符串，这可能会成为一个问题：

```js
// JSON
let expectedTextButGotJSON = {
  type: 'div',
  props: {
    dangerouslySetInnerHTML: {
      __html: '/* put your exploit here */',
    },
  },
};
let message = { text: expectedTextButGotJSON };
<p>{message.text}</p>;
```

而`JSON`中不能存储`Symbol`类型的变量，这就是`防止XSS`的一种手段。

### 防止属性污染

在某些情况下，我们可能要为对象添加一个属性，此时就有可能造成属性覆盖，用 `Symbol` 作为对象属性可以保证永远不会出现同名属性。

例如我们模拟实现一个 call 方法:

```js
Function.prototype.call = function (context) {
  if (typeof this !== 'function') {
    return undefined; // 用于防止 Function.prototype.call() 直接调用
  }
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  const args = [...arguments].slice(1);
  const result = context[fn](...args);
  delete context[fn];

  return result;
};
```

## Symbol 的扩展

`ES6`在原型链上定义了与 `Symbol` 相关的属性来暴露更多的语言内部逻辑。`well-known Symbol` 为标准对象定义了一些以前只在语言内部可见的功能。

### Symbol.hasInstance

`Symbol.hasInstance` 是一个可以改变 `instanceof` 操作符默认行为的 `symbol`，通常我们会这样使用 `instanceof` 。

```js
obj instanceof type;
```

那么 `JavaScript` 就会执行 `Symbol.hasIntance` 方法，像下面这样:

```js
type[Symbol.hasInstance](obj);
```

它会调用 `type` 的 `Symbol.hasInstance` 静态方法，将`obj`作为参数:

```js
class stack {}
console.log([] instanceof Stack); // false
```

`[]` 数组不是`Stack`类所创建的实例，所以返回`false`。

假设要使`[]` 数组是`Stack`类所创建的实例，返回`true`，我们可以重写`Symbol.hasInstance`的方法:

```js
class Stack {
  static [Symbol.hasInstance](obj) {
    return Array.isArray(obj);
  }
}
console.log([] instanceof Stack); //  true
```

### Symbol.iterator

`Symbol.iterator` 指定函数是否会返回对象的迭代器。

**具有 `Symbol.iterator` 属性的对象称为可迭代对象**。

ES6 提供了`for...of`循环，它可以用在可迭代对象上，`Array`、`Set`、`Map`和`string`都是可迭代对象。

```js
const numbers = [1, 2, 3];
for (let num of numbers) {
  console.log(num); // 1 2 3
}
```

在背后，`JavaScript引擎`首先调用 `numbers` 数组的 `Symbol.iterator` 方法来获取`迭代器对象`，然后它调用 `iterator.next()` 方法并将`迭代器对象`的`value`属性复制到`num`变量中，`3`次迭代后，对象的`done` 属性为`true`，循环退出。

我们可以通过 `Symbol.iterator` 来获取数组的迭代器对象。

```js
const iterator = numbers[Symbol.iterator]();

console.log(iterator.next()); // Object {value: 1, done: false}
console.log(iterator.next()); // Object {value: 2, done: false}
console.log(iterator.next()); // Object {value: 3, done: false}
console.log(iterator.next()); // Object {value: undefined, done: true}
```

默认情况下，一个自己定义的集合是不可以迭代的，但是我们可以用 `Symbol.iterator` 使其可迭代:

```js
class List {
  constructor() {
    this.elements = [];
  }

  add(element) {
    this.elements.push(element);
    return this;
  }

  *[Symbol.iterator]() {
    for (let element of this.elements) {
      yield element;
    }
  }
}

let chars = new List();
chars.add('A').add('B').add('C');

// 使用Symbol.iterator实现了迭代
for (let c of chars) {
  console.log(c); // A B C
}
```

### Symbol.isConcatSpreadable

我们可以使用`concat()`方法来合并数据和元素:

```js
let odd = [1, 3],
  even = [2, 4];
let all = odd.concat(even);

console.log(all); // [1, 3, 2, 4]

let extras = all.concat(5);
console.log(extras); // [1, 3, 2, 4, 5];
```

在上面的例子中，我们将一个数组传给`concat()`方法时，`concat()`方法会将数组拓展为单个元素。但是，它会以不同的方式去对待单个原始参数，在 ES6 之前，我们无法更改此行为。

```js
let list = {
  0: 'JavaScript',
  1: 'Symbol',
  length: 2,
};
let message = ['Learning'].concat(list);
console.log(message); // ["Learning", {0: "JavaScript", 1: "Symbol"}]
```

将`list`对象合并到 `['Learning']` 数组中，但`list`对象中的各个元素并没有被合并到数组中。

要在`concat()`时将`list`对象中的元素单独添加到数组中的，我们需要将`Symbol.isConcatSpreadable`属性添加到`list`对象中，像下面这样:

```js
let list = {
  0: 'JavaScript',
  1: 'Symbol',
  length: 2,
  [Symbol.isConcatSpreadable]: true,
};
let message = ['Learning'].concat(list);
console.log(message); // ["Learning", "JavaScript", "Symbol"]
```

如果将`Symbol.isConcatSpreadable`设置为`false`，`concat()`就会将 list 整个对象合并到数组中。

**这里需要注意的是对象的 `length` 属性必须存在，试验下如果 length 不存在无法拷贝**。

### Symbol.toPrimitive

`Symbol.toPrimitive` 方法决定了当一个对象被转换成原始值时的行为。

`JavaScript引擎`在每个类型值的原型上定义了`Symbol.toPrimitive`方法。

`Symbol.toPrimitive`方法接受一个`hint`参数，该参数会是下面三个值:

- string
- number
- default

`hint`参数用来指定返回值的类型。`hint`参数由`JavaScript引擎`根据使用对象的上下文进行填充。

```js
function Money(amount, currency) {
  this.amount = amount;
  this.currency = currency;
}

Money.prototype[Symbol.toPrimitive] = function (hint) {
  var result;
  switch (hint) {
    case 'string':
      result = this.amount + this.currency;
      break;
    case 'number':
      result = this.amount;
      break;
    case 'default':
      result = this.amount + this.currency;
      break;
  }
  return result;
};

var price = new Money(10000, '人民币');

console.log('我有 ' + price); // Price is 799USD
console.log(+price + 1); // 800
console.log(String(price)); // 799USD
```

### 其他

- `Symbol.match(regex)`：一个在调用 `String.prototype.match()` 方法时调用的方法，用于比较字符串。

- `Symbol.replace(regex, replacement)`：一个在调用 `String.prototype.replace()`0- 方法时调用的方法，用于替换字符串的子串。

- `Symbol.search(regex)`：一个在调用 `String.prototype.search()` 方法时调用的方法，用于在字符串中定位子串。

- `Symbol.species(regex)`：用于创建派生对象的构造函数。

- `Symbol.split`：一个在调用 `String.prototype.split()` 方法时调用的方法，用于分割字符串。

- `Symbol.toStringTag`：一个在调用 `String.prototype.toString()` 方法时使用的字符串，用于创建对象描述。

- `Symbol.unscopables`：一个定义了一些不可被 with 语句引用的对象属性名称的对象集合。
