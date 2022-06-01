---
title: 执行环境与作用域
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 执行环境与作用域

- 2021.06.04

## 执行环境

`执行环境（execution context）`是 `JavaScript` 中最为重要的一个概念。

`执行环境`定义了变量或函数有权访问的其他数据，决定了它们各自的行为。每个执行环境都有一个与之关联的`变量对象（variable object）`，环境中定义的所有`变量`和`函数`都保存在这个对象中。虽然我们编写的代码无法访问这个对象，但解析器在处理数据时会在后台使用它。

### 全局执行环境

这是默认或者说是最基础的执行上下文，一个程序中只会存在一个`全局上下文`，它在整个 `javascript` 脚本的生命周期内都会存在于执行堆栈的最底部不会被栈弹出销毁。`全局上下文`会生成一个`全局对象`（以浏览器环境为例，这个全局对象是 window），并且将 `this` 值绑定到这个全局对象上。

### 函数执行环境

每当一个函数被调用时，都会创建一个新的函数执行上下文（不管这个函数是不是被重复调用的）。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

### Eval 函数执行上下文

执行在 eval 函数内部的代码也会有它属于自己的执行上下文。

## 执行上下文

> 当 `JavaScript` 代码执行`一段可执行代码(executable code)`时，会创建对应的`执行上下文(execution context)`。

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

变量对象构建的过程中会触发变量和函数的声明提升。

函数内部代码执行时，会先访问本地的变量对象去尝试获取变量，找不到的话就会攀爬作用域链层层寻找，找到目标变量则返回，找不到则 `undefined`。

```js
// 示例代码
var name = 'Jack';
function func() {
  console.log(name); // 访问全局作用域
}

function func2() {
  var name = '啊哈哈';
  console.log(name); // 访问函数内部作用域
}

func(); // Jack
func2(); // 啊哈哈
```

## 作用域链

> 当代码在一个环境中执行时，会创建变量对象的一个`作用域链（scope chain）`。当查找变量的时候，会先从`当前上下文`的变量对象中查找，如果没有找到，就会从`父级(词法层面上的父级)执行上下文`的变量对象中查找，一直找到`全局上下文`的变量对象，也就是`全局对象`。这样由`多个执行上下文`的`变量对象`构成的`链表`就叫做`作用域链`。

- 作用域链的用途，是保证对执行环境有权访问的所有变量和函数的有序访问。

- 作用域链的前端，始终都是当前执行的代码所在环境的变量对象。

让我们以一个函数的`创建`和`激活`两个阶段来讲解`作用域链`是如何创建和变化的。

### 函数创建

我们知道**函数的作用域在函数定义的时候就决定了。**

这是因为`函数`有一个内部属性 `[[scope]]`，当`函数`创建的时候，就会保存所有`父变量对象`到其中，你可以理解 `[[scope]]` 就是所有`父变量对象`的`层级链`，但是注意：`[[scope]]` 并不代表完整的作用域链！

举个例子：

```js
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的`[[scope]]`为：

```
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

### 函数激活

当函数激活时，进入函数上下文，创建 `VO/AO` 后，就会将`活动对象`添加到`作用链`的前端。

这时候`执行上下文`的`作用域链`，我们命名为 `Scope`：

```
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

### 实际例子

以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程:

```js
var scope = 'global scope';
function checkscope() {
  var scope2 = 'local scope';
  return scope2;
}
checkscope();
```

#### 执行过程如下：

1. `checkscope` 函数被创建，保存作用域链到 内部属性`[[scope]]`.

```
checkscope.[[scope]] = [
    globalContext.VO
];
```

2. 执行 `checkscope` 函数，创建 `checkscope` 函数执行上下文，`checkscope` 函数执行上下文被压入执行上下文栈.

```
ECStack = [
    checkscopeContext,
    globalContext
];
```

3. `checkscope` 函数并不立刻执行，开始做准备工作，第一步：`复制函数[[scope]]属性创建作用域链`.

```
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4. 第二步：用 `arguments` 创建活动对象，随后初始化活动对象(AO)，加入形参、函数声明、变量声明.

```
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```

5. 第三步：将活动对象压入 `checkscope` 作用域链顶端.

```
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    },
    Scope: [AO, [[Scope]]]
}
```

6. 准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: 'local scope'
    },
    Scope: [AO, [[Scope]]]
}
```

7. 查找到 `scope2` 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出.

```
ECStack = [
    globalContext
];
```

## 延长作用域链

> 虽然执行环境的类型总共只有两种——`全局`和`局部（函数）`，但我们还是有其他办法来延长作用域链。

我们可以在`作用域链`的前端临时增加一个`变量对象`，该变量对象会在代码执行后被移除。

- `try-catch` 语句的 `catch` 块；
- `with` 语句。

## 创建作用域

在 `javascript` 中，我们有几种创建 / 改变作用域的手段：

1. 定义函数，创建函数作用（推荐）：

```js
function foo() {
  // 创建了一个 foo 的函数作用域
}
```

2. 使用 `let` 和 `const` 创建块级作用域（推荐）：

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}

console.log(i); // ReferenceError
```

3. `try catch` 创建作用域（不推荐）,`err` 仅存在于 `catch` 子句中：

```js
try {
  undefined(); // 强制产生异常
} catch (err) {
  console.log(err); // TypeError: undefined is not a function
}

console.log(err); // ReferenceError: `err` not found
```

4. 使用 `eval` “欺骗” 词法作用域（不推荐）：

```js
function foo(str, a) {
  eval(str);
  console.log(a, b);
}

var b = 2;

foo('var b = 3;', 1); // 1 3
```

5. 使用 `with` 欺骗词法作用域（不推荐）：

```js
function foo(obj) {
  with (obj) {
    a = 2;
  }
}

var o1 = {
  a: 3,
};

var o2 = {
  b: 3,
};

foo(o1);
console.log(o1.a); // 2

foo(o2);
console.log(o2.a); // undefined
console.log(a); // 2 -- 全局作用域被泄漏了！
```

## 作用域的应用场景

> 作用域的一个常见运用场景之一，就是 `模块化`。

由于 `javascript` 并未原生支持`模块化`导致了很多令人口吐芬芳的问题，比如`全局作用域污染`和`变量名冲突`，代码结构臃肿且复用性不高。在正式的模块化方案出台之前，开发者为了解决这类问题，想到了使用`函数作用域`来创建模块的方案。

```js
function module1() {
  var a = 1;
  console.log(a);
}

function module2() {
  var a = 2;
  console.log(a);
}

module1(); // => 1
module2(); // => 2
```

上面的代码中，构建了 `module1` 和 `module2` 两个代表模块的函数，两个函数内分别定义了一个同名变量 `a` ，由于`函数作用域`的`隔离性质`，这两个变量被保存在不同的作用域中（不嵌套）。

JS 引擎在执行这两个函数时会去不同的作用域中读取，并且外部作用域无法访问到函数内部的 a 变量。这样一来就巧妙地解决了 `全局作用域污染` 和 `变量名冲突` 的问题；并且，由于`函数`的包裹写法，这种方式看起来封装性好多了。

然而上面的函数声明式写法，看起来还是有些冗余，更重要的是，`module1` 和 `module2` 的函数名本身就已经对全局作用域造成了污染。我们来继续改写：

```js
// module1.js
(function () {
  var a = 1;
  console.log(a);
})();

// module2.js
(function () {
  var a = 2;
  console.log(a);
})();
```

将函数声明改写成`立即调用函数表达式（Immediately Invoked Function Expression 简写 IIFE）`，封装性更好，代码也更简洁，解决了`模块名污染全局作用域`的问题。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n`函数声明`和`函数表达式`，最简单的区分方法，就是看是不是 `function` 关键字开头：是 `function` 开头的就是`函数声明`，否则就是`函数表达式`。';

export default () => <Info type="info" txt={txt} />;
```

上面的代码采用了 `IIFE` 的写法，已经进化很多了，我们可以再把它强化一下，强化成`后浪版`，赋予它`判断外部环境`的权利——选择的权力。

```js
(function (global) {
  if (global...) {
    // is browser
  } else if (global...) {
    // is nodejs
  }
})(window);
```
