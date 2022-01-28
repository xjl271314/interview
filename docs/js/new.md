---
title: new操作符
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javaScript 中的 new 操作符是什么?

- 2021.06.04

## 定义

一句话介绍 new:

> `new` 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。

这句话也许有点难懂，我们在模拟 `new` 之前，先看看 `new` 实现了哪些功能。

```js
// Person类
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.habit = 'Games';
}

// 因为缺乏锻炼的缘故，身体强度让人担忧
Person.prototype.strength = 60;

Person.prototype.sayYourName = function () {
  console.log('I am ' + this.name);
};

var person = new Person('Kevin', '18');

console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength); // 60

person.sayYourName(); // I am Kevin
```

从这个例子中，我们可以看到，实例 `person` 可以：

1. 访问到 `Person` 构造函数里的属性.
2. 访问到 `Person.prototype` 中的属性.

接下来，我们可以尝试着模拟一下 `new` 的实现过程。

## 初步实现

首先，由于`new`是一个关键字，我们不能像`bind`方法那样直接去修改，我们需要新建一个方法。

其次，因为 `new` 的结果是一个新对象，所以在模拟实现的时候，我们也要建立一个新对象。

我们假设这个对象叫 `obj`，因为 `obj` 会具有 `Person` 构造函数里的属性，想想经典继承的例子，我们可以使用 `Person.apply(obj, arguments)`来给 `obj` 添加新的属性。

```js
// 第一版代码
function objectFactory() {
  const obj = new Object();
  // 删除并拿到arguments的第一项
  const Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  Constructor.apply(obj, arguments);

  return obj;
}
```

在这一版中，我们：

- 用 `new Object()` 的方式新建了一个对象 `obj`;
- 取出第一个参数，就是我们要传入的构造函数。此外因为 `shift` 会修改原数组，所以 `arguments` 会被去除第一个参数;
- 将 `obj` 的原型指向`构造函数`，这样 `obj` 就可以访问到构造函数原型中的属性;
- 使用 `apply` 改变构造函数 `this` 的指向到新建的对象，这样 `obj` 就可以访问到构造函数中的属性;
- 返回 `obj`;

## 考虑返回值

接下来我们再来看一种情况，假如构造函数有返回值，举个例子：

```js
function Person(name, age) {
  this.strength = 60;
  this.age = age;

  return {
    name: name,
    habit: 'Games',
  };
}

var person = new Person('Kevin', '18');

console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength); // undefined
console.log(person.age); // undefined
```

在这个例子中，构造函数返回了一个对象，在实例 `person` 中只能访问返回的对象中的属性。

而且还要注意一点，在这里我们是返回了一个`对象`，假如我们只是返回一个`基本类型`的值呢？

```js
function Person(name, age) {
  this.strength = 60;
  this.age = age;

  return 'handsome boy';
}

var person = new Person('Kevin', '18');

console.log(person.name); // undefined
console.log(person.habit); // undefined
console.log(person.strength); // 60
console.log(person.age); // 18
```

结果完全颠倒过来，这次尽管有返回值，但是相当于没有返回值进行处理。

所以我们还需要判断返回的值是不是一个`对象`，如果是一个`对象`，我们就返回这个`对象`，如果没有，我们该返回什么就返回什么。

## 最终版

```js
function objectFactory() {
  var obj = Object.create(null),
    Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  var ret = Constructor.apply(obj, arguments);

  return typeof ret === 'object' ? ret : obj;
}
```

## 总结

> new 操作符的执行流程可以总结如下:

1. 创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。
