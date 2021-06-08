---
title: bind
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javaScript 中的 bind 方法?

- 2021.06.07

## 定义

> `bind()` 方法会创建一个新函数。当这个新函数被调用时，`bind()` 的第一个参数将作为它运行时的 `this`，之后的一序列参数将会在传递的实参前传入作为它的参数。

由此我们可以首先得出 `bind` 函数的两个特点：

1. 返回一个函数.
2. 可以传入参数.

## 返回函数的模拟实现

```js
var foo = {
  value: 1,
};

function bar() {
  console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo);

bindFoo(); // 1
```

这里我们呈现了`bind`改变`this`的应用场景,接下来我们来实现第一版:

```js
// 第一版
Function.prototype.myBind = function (context) {
  var self = this;
  return function () {
    return self.apply(context);
  };
};
```

之所以 `return self.apply(context)`，是考虑到绑定函数可能是有返回值的，依然是上述的例子：

```js
var foo = {
  value: 1,
};

function bar() {
  return this.value;
}

var bindFoo = bar.myBind(foo);

console.log(bindFoo()); // 1
```

传参的模拟实现.上述我们只实现了`this`的改变，接下来我们来看看参数如何传递，再次之前先看一个例子

```js
var foo = {
  value: 1,
};

function bar(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);
}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```

函数需要传 `name` 和 `age` 两个参数，竟然还可以在 `bind` 的时候，只传一个 `name`，在执行返回的函数的时候，再传另一个参数 `age`!

这可咋办？不急，我们用 `arguments` 进行处理：

```js
// 第二版
Function.prototype.myBind = function (context) {
  var self = this;
  // 获取bind函数从第二个参数到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1);

  return function () {
    // 这个时候的arguments是指bind返回的函数传入的参数
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs));
  };
};
```

## 构造函数效果的模拟实现

上述代码我们已经可以使用`myBind`函数进行绑定了，但是我们知道函数都是可以被实例化的，上述代码目前还不支持。

当 `bind` 返回的函数作为`构造函数`的时候，`bind` 时指定的 `this` 值会失效，但传入的参数依然生效。我们还是来看个例子:

```js
var value = 2;

var foo = {
  value: 1,
};

function bar(name, age) {
  this.habit = 'shopping';
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '尽管在全局和 `foo` 中都声明了 `value` 值，最后依然返回了 `undefind`，说明绑定的 `this` 失效了，如果大家了解 `new` 的模拟实现，就会知道这个时候的 `this` 已经指向了 `obj`。';

export default () => <Info type="warning" txt={txt} />;
```

所以我们可以通过修改返回的函数的`原型`来实现，让我们写一下：

```js
// 第三版
Function.prototype.myBind = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
    // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
    // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
    return self.apply(
      this instanceof fBound ? this : context,
      args.concat(bindArgs),
    );
  };
  // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
  fBound.prototype = this.prototype;
  return fBound;
};
```

## 构造函数效果的优化实现

但是在这个写法中，我们直接将 `fBound.prototype = this.prototype`，我们直接修改 `fBound.prototype` 的时候，也会直接修改绑定函数的 `prototype`。这个时候，我们可以通过一个`空函数`来进行中转：

```js
// 第四版
Function.prototype.myBind = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs),
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

到此为止，大的问题都已经解决,那如果 bind 绑定的不是一个函数呢? 我们该如何处理,让我们再为代码添加规范性校验:

```js
// 第五版
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError(this + ' must be a function');
  }
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs),
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```
