---
title: 立即执行函数（IIFE）
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javaScript 中的立即执行函数表达式（IIFE）?

- 2021.06.04

## 什么是 IIFE?

> 即`定义`和`调用`合为一体。我们创建了一个`匿名的函数`，并立即执行它，由于外部无法引用它内部的变量，因此在执行完后很快就会被释放，关键是这种机制不会污染全局对象。

## IIFE 的构造方式

这两种模式都可以被用来立即调用一个函数表达式，利用函数的执行来创造私有变量:

```js
// 推荐使用这个 括号内的表达式代表函数表达式
(function () {
  /* code */
})();

// 这个也是可以用的
function() {
    /* code */
  }
)();
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '由于`括弧()`和 `JS` 的`&&`，`异或`，`逗号`等操作符是在`函数表达式`和`函数声明`上消除歧义的,所以一旦解析器知道其中一个已经是表达式了，其它的也都默认为表达式了。';

export default () => <Info type="info" txt={txt} />;
```

```js
var i = (function () {
  return 10;
})();

true &&
  (function () {
    /* code */
  })();

0,
  (function () {
    /* code */
  })();
```

如果你不在意返回值，或者不怕难以阅读,你甚至可以在 `function` 前面加`一元操作符号`:

```js
!(function () {
  /* code */
})();
~(function () {
  /* code */
})();
-(function () {
  /* code */
})();
+(function () {
  /* code */
})();
```

还有一个情况，使用 `new` 关键字,也可以用，但不确定执行效率:

```js
new (function () {
  /* code */
})();
new (function () {
  /* code */
})(); // 如果需要传递参数，只需要加上括弧()
```

## IIFE 常见的错误方式

有的人在初学的时候可能会书写出如下的代码:

```js
function(){

}();// VM560:1 Uncaught SyntaxError: Function statements require a function name
```

这样的方法会直接报错,我们来解释下报错的原因。

> 当圆括号放在一个`函数表达式`后面指明了这是一个`被调用的函数`，而圆括号放在一个`声明`后面便意味着完全的和前面的函数声明分开了，此时圆括号只是一个简单的代表`一个括号`(用来控制运算优先的括号)。

```js
// 然而函数声明语法上是无效的，它仍然是一个声明，紧跟着的圆括号是无效的，因为圆括号里需要包含表达式

function foo(){ /* code */ }();// SyntaxError: Unexpected token ')'

// 现在，你把一个表达式放在圆括号里，没有抛出错误...,但是函数也并没有执行，因为：

function foo(){/* code */}(1)

// 它等同于如下，一个函数声明跟着一个完全没有关系的表达式:

function foo(){/* code */}
(1);
```
