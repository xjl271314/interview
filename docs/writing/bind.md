---
title: 手写实现bind
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写 bind

- 2022.03.14

## 定义

> `bind()`方法会创建一个新函数，称为`绑定函数`，当调用这个绑定函数时，绑定函数会以创建它时传入 `bind()`方法的第一个参数作为 `this`，传入 `bind()` 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

直白一点，`bind`方法是创建一个函数，然后可以在需要调用的时候再执行函数，**并非是立即执行函数**；而`call`，`apply`是在改变了上下文中的`this`指向后并立即执行函数。

`bind` 接收的参数类型与 `call` 是一样的，给它传递的是一组用逗号分隔的参数列表。

## 实现

```js
Function.prototype.bind = function (context, ...args) {
  // 当上下文不存在的时候将其指向window
  if (context == null || context == undefined) {
    context = window;
  }
  // 创建一个唯一的key值用于保存方法
  let fnKey = Symbol('bind');
  context[fnKey] = this;
  // 保存外部this
  let self = this;
  // 创建返回方法
  let fn = function (...innerArgs) {
    // 若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，
    // 则不绑定传入的 this，而是将 this 指向实例化出来的对象。
    // 此时由于new操作符作用，this 指向 fn 实例对象，而fn 又继承自传入的 self 根据原型链知识可得出以下结论：
    // this.__proto__ === fn.prototype   // true
    // this.__proto__.__proto__ === fn.prototype.__proto__ === self.prototype;
    if (this instanceof self) {
      // 此时this指向指向fn的实例  这时候不需要改变this指向
      this[fnKey] = self;
      // 这里使用es6的方法让bind支持参数合并
      this[fnKey](...[...args, ...innerArgs]);
      // 删除
      delete this[fnKey];
    } else {
      // 如果只是作为普通函数调用，改变this指向为传入的context
      context[fnKey](...[...args, ...innerArgs]);
      // 删除中间变量
      delete context[fnKey];
    }
  };
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 用 Object.create 实现继承
  if (self.prototype) {
    fn.prototype = Object.create(self.prototype);
  }

  return fn;
};
```

测试例子:

```js
function Person(name, age) {
  console.log(name); // '我是参数传进来的name'
  console.log(age); // '我是参数传进来的age'
}

// 构造函数原型的方法
Person.prototype.say = function () {
  console.log('say');
};

// 定义对象
const obj = {
  objName: 'my name is jack',
  objAge: 'I’m 6 years old',
};

// 普通函数
function normalFn(name, age) {
  console.log(name); //'我是参数传进来的name'
  console.log(age); //'我是参数传进来的age'
  console.log(this.objName); // 'my name is jack',
  console.log(this.objAge); // 'I’m 6 years old',
}

// 先测试作为构造函数调用
let bindFun = Person.bind(obj, '我是参数传进来的name');
let a = new bindFun('我是参数传进来的age');
a.say(); // 'say'

// 再测试作为普通函数调用
let bindFun = normalFn.bind(obj, '我是参数传进来的name');
bindFun('我是参数传进来的age');
```
