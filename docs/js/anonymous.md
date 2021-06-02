---
title: 具名函数与匿名函数
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 匿名函数和具名函数有啥区别?

- 2021.06.02

## 匿名函数

> 顾名思义就是没有名字的函数。

大致上长这样:

```js
// 函数声明
function hello(type) {
  return 'hello world';
}

// 函数表达式
hello();
```

上面的函数表达式中的创建，实际上是创建一`个匿名函数`，并将`匿名函数`赋值给变量 `hello`,调用 `hello` 来进行函数的调用，调用的方式就是在变量 `hello` 后面加上一对括号`()`。

这是一种常见的匿名函数调用方式,我们再来看看另外一种调用方式:

```js
(function (x, y) {
  return x + y;
})(2, 3); // 5

new Function('x', 'y', 'return x+y')(2, 3); // 5
```

上述的例子中运用到了一个知识点,在 javascript 中，是没有块级作用域这种说法的，以上代码的这种方式就是模仿了块级作用域(通常成为私有作用域)，语法如下所示：

```js
(function () {
  //这里是块级作用域
})();
```

上述代码定义并立即调用了一个匿名函数。经函数声明包含在一对圆括号中，表示它实际上是一个函数表达式。而紧随其后的另一对圆括号会立即调用这个函数。然而要注意一点:

```js
function(){

}();
```

上面的代码是错误的，因为 `javascript` 将 `function` 关键字当作一个函数声明的开始，而函数声明后面不能加圆括号，如果你不显示告诉编译器，它会默认生成一个缺少名字的 `function`，并且抛出一个语法错误，因为 `function` 声明需要一个名字。

有趣的是，即便你为上面那个错误的代码加上一个名字，他也会提示语法错误，只不过和上面的原因不一样。提示为：`Uncaught SyntaxError: Unexpected token (`。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '在一个表达式后面加上`括号()`，该表达式会立即执行，但是在一个语句后面加上`括号()`，是完全不一样的意思，只是`分组操作符`。';

export default () => <Info type="warning" txt={txt} />;
```

```js
function test(){
   alert('测试是否弹窗')
}()
// SyntaxError: Unexpected token )
// 报错因为分组操作符需要包含表达式

function test(){
    alert('测试是否弹窗')
}(1)
// (1) => 等价于 1
// 相当于test方法后面个跟了一个无关系的表达式子:(1)
```

所以上面代码要是想要得到想要的弹窗提示，就必须要实现赋值，如:

```js
// a= 这个片段告诉了编译器这个是一个函数表达式，而不是函数的声明。因为函数表达式后面可以跟圆括号。
var a = (function () {
  alert('测试是否弹窗');
})();
// 弹窗提示成功
```

因此下面两段代码是等价的:

```js
var aa = (function (x) {
  alert(x);
})(5)(
  //弹窗显示：5

  function (x) {
    alert(x);
  },
)(5); //弹窗显示：5
```
