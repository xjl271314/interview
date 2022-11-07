---
title: 变量提升
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javascript 中的变量提升?

- 2021.06.04

> 在 `ECMAScript` 中有一个奇怪的语法规则： `变量提升`。如果你使用了一个从未声明的变量，程序运行就会抛出错误。但是代码中如果使用 `var` 对其进行过声明,无论在声明前使用，还是在声明后使用，都不会报异常。

```js
// 变量提升
console.log(name); // undefined

var name = 'Jack';
console.log(name); // Jack
```

如果你直接对一个未声明的变量进行赋值，就相当于在`全局作用域`声明了这样的一个变量，会造成`无意的变量泄露`。

```js
// 变量泄露
function func() {
  age = 24;
}

func();

console.log(age); // 24
```

造成这种现象的原因是: `JavaScript 解释器`在对代码进行扫描的时候，会将`全局作用域`中声明的`变量`和`函数`先定义为`全局符号`，运行到具体声明处才进行赋值。

```js
// 变量提升
console.log(name); // undefined

if (false) {
  var name = 'Jack';
}

for (var i = 0; i < 3; i++) {
  var sum = i;
}
console.log(i); // 3
console.log(sum); // 2
```

上述的示例代码中，首先 `if` 条件判断语句为 `false`，`if` 内部的代码永远不会执行,但是从结果中我们可以看到第一句打印的语句并不会报错，`name` 变量还是被声明了。

而在后面的循环结构中，我们在 `for` 循环条件语句中声明了一个 `i` 变量，在循环体内部声明了 `sum` 变量，可是当 `sum` 循环结束后，`i` 变量依然存在，变成了全局的变量。

`sum` 同样也变成了全局的变量，这种所谓的`变量提升`会消耗一部分无用内存，并对之后的代码编写产生额外的风险。
