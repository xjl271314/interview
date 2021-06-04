---
title: 闭包
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 说一说闭包吧?

- 2021.06.02

> 闭包是指一个绑定了执行环境的函数。(或者说是函数内部定义的函数，被返回了出去并在外部调用。)

创建闭包的常见方式，就是在一个函数内部创建另一个函数。

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz(); // 这就形成了一个闭包
```

我们可以简单剖析一下上面代码的运行流程：

1. 编译阶段，变量和函数被声明，作用域即被确定。
2. 运行函数 `foo()`，此时会创建一个 `foo` 函数的执行上下文，执行上下文内部存储了 `foo` 中声明的所有变量函数信息。
3. 函数 `foo` 运行完毕，将内部函数 `bar` 的引用赋值给外部的变量 `baz` ，此时 `baz` 指针指向的还是 `bar` ，因此哪怕它位于 `foo` 作用域之外，它还是能够获取到 `foo` 的内部变量。
4. `baz` 在外部被执行，`baz` 的内部可执行代码 `console.log` 向作用域请求获取 `a` 变量，本地作用域没有找到，继续请求父级作用域，找到了 `foo` 中的 `a` 变量，返回给 `console.log`，打印出 `2`。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '闭包的执行看起来像是开发者使用的一个小小的`作弊手段` ——绕过了`作用域`的监管机制，从外部也能获取到内部作用域的信息。闭包的这一特性极大地丰富了开发人员的编码方式，也提供了很多有效的运用场景。';

export default () => <Info type="info" txt={txt} />;
```

## 闭包的应用场景

闭包的应用，大多数是在需要维护内部变量的场景下。

### 单例模式

> 单例模式是一种常见的设计模式，它保证了一个类只有一个实例。实现方法一般是先判断实例是否存在，如果存在就直接返回，否则就创建了再返回。单例模式的好处就是避免了重复实例化带来的内存开销：

```js
// 单例模式
function Singleton() {
  this.data = 'singleton';
}

Singleton.getInstance = (function () {
  var instance;

  return function () {
    if (instance) {
      return instance;
    } else {
      instance = new Singleton();
      return instance;
    }
  };
})();

var sa = Singleton.getInstance();
var sb = Singleton.getInstance();
console.log(sa === sb); // true
console.log(sa.data); // 'singleton'
```

### 模拟私有属性

> `javascript` 没有 `java` 中那种 `public`、 `private` 的访问权限控制，对象中的所用方法和属性均可以访问，这就造成了安全隐患，内部的属性任何开发者都可以随意修改。虽然语言层面不支持私有属性的创建，但是我们可以用`闭包`的手段来模拟出`私有属性`：

```js
// 模拟私有属性
function getGeneratorFunc() {
  var _name = 'John';
  var _age = 22;

  return function () {
    return {
      getName: function () {
        return _name;
      },
      getAge: function () {
        return _age;
      },
    };
  };
}

var obj = getGeneratorFunc()();
obj.getName(); // John
obj.getAge(); // 22
obj._age; // undefined
```

### 柯里化

> `柯里化（currying）`，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```js
Function.prototype.bind = function (context = window) {
  if (typeof this !== 'function') throw new Error('Error');
  let selfFunc = this;
  let args = [...arguments].slice(1);

  return function F() {
    // 因为返回了一个函数，可以 new F()，所以需要判断
    if (this instanceof F) {
      return new selfFunc(...args, arguments);
    } else {
      // bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以需要将两边的参数拼接起来
      return selfFunc.apply(context, args.concat(arguments));
    }
  };
};
```

柯里化的优势之一就是 参数的复用，它可以在传入参数的基础上生成另一个全新的函数，来看下面这个类型判断函数：

```js
function typeOf(value) {
  return function (obj) {
    const map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object',
    };
    return map[Object.prototype.toString.call(obj)] === value;
  };
}

var isNumber = typeOf('number');
var isFunction = typeOf('function');
var isRegExp = typeOf('regExp');

isNumber(0); // => true
isFunction(function () {}); // true
isRegExp({}); // => false
```

通过向 `typeOf` 里传入不同的类型字符串参数，就可以生成对应的类型判断函数，作为语法糖在业务代码里重复使用。

## 闭包的问题

### 内存泄露

> 我们将由于闭包使用过度而导致的内存占用无法释放的情况称之为：内存泄露。

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz(); // 这就形成了一个闭包
```

乍一看，好像没什么问题，然而，它却有可能导致 `内存泄露`。

我们知道，`javascript` 内部的垃圾回收机制用的是`引用计数收集`：即当内存中的一个变量被引用一次，计数就加一。垃圾回收机制会以固定的时间轮询这些变量，将计数为 `0` 的变量标记为`失效变量`并将之清除从而释放内存。

上述代码中，理论上来说， `foo` 函数作用域隔绝了外部环境，所有变量引用都在函数内部完成，`foo` 运行完成以后，内部的变量就应该被销毁，内存被回收。

然而`闭包`导致了全局作用域始终存在一个 `baz` 的变量在引用着 `foo` 内部的 `bar` 函数，这就意味着 `foo` 内部定义的 `bar` 函数引用数始终为 `1`，垃圾运行机制就无法把它销毁。更糟糕的是，`bar` 有可能还要使用到父作用域 `foo` 中的变量信息，那它们自然也不能被销毁... 。`JS 引擎`无法判断你什么时候还会调用闭包函数，只能一直让这些数据占用着内存。

## 内存泄露的解决方案

### 1. 使用严格模式，避免不经意间的全局变量泄露

```js
'use strict';

function foo() {
  b = 2;
}

foo(); // ReferenceError: b is not defined
```

### 2. 关注 DOM 生命周期，在销毁阶段记得解绑相关事件：

```js
const wrapDOM = document.getElementById('wrap');
wrapDOM.onclick = function (e) {
  console.log(e);
};

// some codes ...

// remove wrapDOM
wrapDOM.onclick = null;
wrapDOM.parentNode.removeChild(wrapDOM);
```

或者可以使用事件委托的手段统一处理事件，减少由于事件绑定带来的额外内存开销：

```js
document.body.onclick = function (e) {
  if (isWrapDOM) {
    // ...
  } else {
    // ...
  }
};
```

### 3. 避免过度使用闭包
