---
title: var关键字与变量生命周期
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# var 关键字与变量生命周期

- 2022.05.05

## 局部变量特性

**用`var操作符`定义的变量将成为定义该变量的作用域中的局部变量**。

也就是说，如果在函数中使用`var`定义一个变量，那么这个变量在函数退出后就会被销毁。

```js
function test() {
  var message = 'hi'; // 局部变量 在函数执行完成后就销毁了
}
test();
alert(message); // VM152:5 Uncaught ReferenceError: message is not defined
```

变量 `message` 是在函数中使用 `var` 定义的。当函数被调用时，就会创建该变量并为其赋值。而在此之后，这个变量又会立即被销毁，因此例子中的下一行代码就会导致错误。

不过，可以像下面这样省略 `var操作符`，从而创建一个`全局变量`：

```js
function test() {
  message = 'hi'; // 全局变量
}
test();
alert(message); // "hi"
```

## 变量提升特性

在 `ECMAScript` 中有一个奇怪的语法规则： `变量提升`。如果你使用了一个从未声明的变量，程序运行就会抛出错误。但是代码中如果使用 `var` 对其进行过声明，无论在声明前使用，还是在声明后使用，都不会报异常。

```js
// 变量提升
console.log(name); // undefined

var name = 'Jack';
console.log(name); // Jack
```

如果你直接对一个未声明的变量进行赋值，就相当于在全局作用域声明了这样的一个变量，会造成无意的变量泄露。

```js
// 变量泄露
function func() {
  age = 24;
}

func();

console.log(age); // 24
```
