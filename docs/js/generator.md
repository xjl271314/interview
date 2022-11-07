---
title: 生成器(generator)
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# generator 原理?

- 2021.06.08

## 定义

`迭代器(Iterator)`是一种`迭代`的机制，为各种不同的数据结构提供一种统一的访问方式。任何数据结构只要内部有 `Iterator` 接口，就可以完成依次迭代的操作。

`生成器`函数使用 `function*`语法编写，最初调用的时候，`生成器`不执行任何的代码，而是返回一种成为 `Generator` 的迭代器。通过调用生成器的下一个方法消耗值时，`Generator` 函数将执行，直到遇到 `yield` 关键字。

怎么来理解上述的话呢?我们来看个简单的例子进行对比:

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

上面代码我们定义了一个`生成器`函数,可以根据需要多次调用该函数，并且每次都返回一个新的 `Generator`，但每个 `Generator` 只能迭代一次。

## 与普通函数的区别

1. 普通函数采用`function(){}`进行声明，生成器函数采用`function*(){}`进行声明。

2. 普通函数使用 `return` 返回值，生成器函数使用 `yield` 返回值。

3. 普通函数是 `run to completion` 模式，即普通函数开始执行后，会一直执行到该函数所有语句完成，在此期间别的代码语句是不会被执行的。生成器函数是 `run-pause-run` 模式，即生成器函数可以在函数运行中被暂停一次或多次，并且在后面再恢复执行，在暂停期间允许其他代码语句被执行。

## 原理

了解了使用方式后，我们看看`generator`内部是怎么去实现的呢?我们可以将上述代码进行转化[babel 在线转换](https://babeljs.io/repl/#?browsers=&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=GYVwdgxgLglg9mAVAAgLYEMDWBTASusAc2wEkwpsAndKOSgCgGcp1KpkBeZABgBplsYACadkZYDDAwoAT37NsAB1EBGAJTIA3gChkyYHWT0ANtnYxRzVlADcyCwB4BwuxYDUXBYo069emTDYxiIwNrrIAL7aUdoQCMzI6KIYOPhEpORUNHT0KvwqfMgATGph6AB0YNgAHlD0pcgA9I1aAG7oxiDYAFzIechCCD36HYzYURVVtfV2zW0dXb0AzPyDVb3Ao-PakzV1DXOa7Z3DAKyrQxtbE5V7M00tRwvDAOwX6yPGYzdT-7OPx0WyAAnO9hpsvttdtMDgDnr1wEJsBIqkIwb0oJQuhEgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.14.4&externalPlugins=)后看看在 `ES5` 中试如何实现的。

```js
'use strict';

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(makeRangeInterator);

function makeRangeInterator() {
  var start,
    end,
    step,
    i,
    _args = arguments;

  return regeneratorRuntime.wrap(function makeRangeInterator$(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          start = _args.length > 0 && _args[0] !== undefined ? _args[0] : 0;
          end =
            _args.length > 1 && _args[1] !== undefined ? _args[1] : Infinity;
          step = _args.length > 2 && _args[2] !== undefined ? _args[2] : 1;
          i = start;

        case 4:
          if (!(i < end)) {
            _context.next = 10;
            break;
          }

          _context.next = 7;
          return i;

        case 7:
          i += step;
          _context.next = 4;
          break;

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

var a = makeRangeInterator(1, 10, 2);
a.next(); // {value: 1, done: false}

a.next(); // {value: 3, done: false}

a.next(); // {value: 5, done: false}

a.next(); // {value: 7, done: false}

a.next(); // {value: 9, done: false}

a.next(); // {value: undefined, done: true}
```

代码咋一看不长，但如果仔细观察会发现有两个不认识的东西 —— `regeneratorRuntime.mark` 和 `regeneratorRuntime.wrap`，这两者其实是 `regenerator-runtime` 模块里的两个方法，`regenerator-runtime` 模块来自`facebook`的 `regenerator` 模块，完整代码在[runtime.js](https://github.com/facebook/regenerator)。

### regeneratorRuntime.mark()

`regeneratorRuntime.mark(foo)`这个方法在第一行被调用，我们先看一下 `runtime` 里 `mark()`方法的定义

```js
// runtime.js里的定义稍有不同，多了一些判断，以下是编译后的代码
runtime.mark = function (genFun) {
  genFun.__proto__ = GeneratorFunctionPrototype;
  genFun.prototype = Object.create(Gp);
  return genFun;
};
```

这里边 `GeneratorFunctionPrototype` 和 `Gp` 我们都不认识，他们被定义在 `runtime` 里，不过没关系，我们只要知道 `mark()`方法为生成器函数`（foo）`绑定了一系列原型就可以了，这里就简单地过了。

### regeneratorRuntime.wrap()

从上面 `babel` 转化的代码我们能看到，执行 `foo()`，其实就是执行 `wrap()`，那么这个方法起到什么作用呢，他想包装一个什么东西呢，我们先来看看 `wrap` 方法的定义：

```js
// runtime.js里的定义稍有不同，多了一些判断，以下是编译后的代码
function wrap(innerFn, outerFn, self) {
  var generator = Object.create(outerFn.prototype);
  var context = new Context([]);
  generator._invoke = makeInvokeMethod(innerFn, self, context);

  return generator;
}
```

- `wrap` 方法先是创建了一个 `generator`，并继承 `outerFn.prototype`；

- 然后 `new` 了一个 `context` 对象；`makeInvokeMethod` 方法接收 `innerFn(对应 foo$)`、`context` 和 `this`，并把返回值挂到 `generator._invoke` 上；

- 最后 `return` 了 `generator`。其实 `wrap()`相当于是给 `generator` 增加了一个`_invoke` 方法。

这段代码肯定让人产生很多疑问，`outerFn.prototype` 是什么，`Context` 又是什么，`makeInvokeMethod` 又做了哪些操作。下面我们就来一一解答：

#### outerFn.prototype

> `outerFn.prototype` 其实就是 `genFun.prototype`。

#### Context

> `Context` 可以直接理解为这样一个全局对象，用于储存各种状态和上下文。

```js
var ContinueSentinel = {};

var context = {
  done: false,
  method: 'next',
  next: 0,
  prev: 0,
  abrupt: function (type, arg) {
    var record = {};
    record.type = type;
    record.arg = arg;

    return this.complete(record);
  },
  complete: function (record, afterLoc) {
    if (record.type === 'return') {
      this.rval = this.arg = record.arg;
      this.method = 'return';
      this.next = 'end';
    }

    return ContinueSentinel;
  },
  stop: function () {
    this.done = true;
    return this.rval;
  },
};
```

#### makeInvokeMethod

> 它 `return` 了一个 `invoke` 方法，`invoke` 用于判断当前状态和执行下一步，其实就是我们调用的 `next()`。

```js
//以下是编译后的代码
function makeInvokeMethod(innerFn, context) {
  // 将状态置为start
  var state = 'start';

  return function invoke(method, arg) {
    // 已完成
    if (state === 'completed') {
      return { value: undefined, done: true };
    }

    context.method = method;
    context.arg = arg;

    // 执行中
    while (true) {
      state = 'executing';

      var record = {
        type: 'normal',
        arg: innerFn.call(self, context), // 执行下一步,并获取状态(其实就是switch里边return的值)
      };

      if (record.type === 'normal') {
        // 判断是否已经执行完成
        state = context.done ? 'completed' : 'yield';

        // ContinueSentinel其实是一个空对象,record.arg === {}则跳过return进入下一个循环
        // 什么时候record.arg会为空对象呢, 答案是没有后续yield语句或已经return的时候,也就是switch返回了空值的情况(跟着上面的switch走一下就知道了)
        if (record.arg === ContinueSentinel) {
          continue;
        }
        // next()的返回值
        return {
          value: record.arg,
          done: context.done,
        };
      }
    }
  };
}
```

为什么 `generator._invoke` 实际上就是 `gen.next` 呢，因为在 `runtime` 对于 `next()`的定义中，`next()`其实就 `return` 了`_invoke` 方法。

```js
// Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.
function defineIteratorMethods(prototype) {
  ['next', 'throw', 'return'].forEach(function (method) {
    prototype[method] = function (arg) {
      return this._invoke(method, arg);
    };
  });
}

defineIteratorMethods(Gp);
```

### 简化版实现

这个流程下来大多数人还是比较懵逼的状态，由于源码中封装较多一时半会不太好理解，让我们跳出源码，实现一个简单的 Generator，然后再回过头看源码，会得到更清晰的认识:

```js
// 生成器函数根据yield语句将代码分割为switch-case块，后续通过切换_context.prev和_context.next来分别执行各个case
function gen$(_context) {
  while (1) {
    switch ((_context.prev = _context.next)) {
      case 0:
        _context.next = 2;
        return 'result1';

      case 2:
        _context.next = 4;
        return 'result2';

      case 4:
        _context.next = 6;
        return 'result3';

      case 6:
      case 'end':
        return _context.stop();
    }
  }
}

// 低配版context
var context = {
  next: 0,
  prev: 0,
  done: false,
  stop: function stop() {
    this.done = true;
  },
};

// 低配版invoke
let gen = function () {
  return {
    next: function () {
      value = context.done ? undefined : gen$(context);
      done = context.done;
      return {
        value,
        done,
      };
    },
  };
};

// 测试使用
var g = gen();
g.next(); // {value: "result1", done: false}
g.next(); // {value: "result2", done: false}
g.next(); // {value: "result3", done: false}
g.next(); // {value: undefined, done: true}
```

上述代码比之前号理解多了，我们分析一下调用流程：

1. 我们定义的 `function* `生成器函数被转化为以上代码。

2. 转化后的代码分为三大块：

   - `gen$(_context)`由 `yield` 分割生成器函数代码而来
   - `context` 对象用于储存函数执行上下文
   - `invoke()`方法定义 `next()`，用于执行 `gen$(_context)`来跳到下一步

3. 当我们调用 `g.next()`，就相当于调用 `invoke()`方法，执行 `gen$(_context)`，进入 `switch` 语句，`switch` 根据 `context` 的标识，执行对应的 `case` 块，`return` 对应结果。

4. 当生成器函数运行到末尾（没有下一个 `yield` 或已经 `return`），`switch` 匹配不到对应代码块，就会 `return` 空值，这时 `g.next()`返回`{ value: undefined, done: true }`。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '因此我们可以得出，`Generator`实现的核心在于`上下文的保存`，函数并没有真的被挂起，每一次`yield`，其实都执行了一遍传入的生成器函数，只是在这个过程中间用了一个 `context` 对象储存上下文，使得每次执行生成器函数的时候，都可以从上一个执行结果开始执行，看起来就像函数被挂起了一样';

export default () => <Info type="info" txt={txt} />;
```
