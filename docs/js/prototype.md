---
title: 原型链
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 说说 javascript 中的原型链吧?

- 2021.06.03

> `JavaScript` 中没有`类`的概念，主要通过`原型链`来实现`继承`。通常情况下，`继承`意味着复制操作，然而 `JavaScript` 默认并不会复制对象的属性，相反，`JavaScript` 只是在两个对象之间创建一个`关联（原型对象指针）`，这样，一个对象就可以通过`委托`访问另一个对象的`属性`和`函数`，所以与其叫`继承`，`委托`的说法反而更准确些。

## 原型

> 当我们 `new` 了一个新的对象实例，明明什么都没有做，就直接可以访问 `toString` 、`valueOf` 等原生方法。那么这些方法是从哪里来的呢？答案就是`原型`。

![原型](https://img-blog.csdnimg.cn/20210507145818391.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

在控制台打印一个空对象时，我们可以看到，有很多方法，已经“初始化”挂载在内置的 `__proto__` 对象上了。

这个内置的 `__proto__` 是一个`指向原型对象的指针`，它会在创建一个新的`引用类型对象`时（显示或者隐式）自动创建，并挂载到新实例上。

当我们尝试访问实例对象上的某一属性或者方法时，如果实例对象上有该属性或者方法时，就返回实例属性或者方法。

如果没有，就去 `__proto__` 指向的原型对象上查找对应的属性或者方法。这就是为什么我们尝试访问`空对象`的 `toString` 和 `valueOf` 等方法依旧能访问到的原因，`JavaScript` 正式以这种方式为基础来实现继承的。

## 构造函数

如果说实例的 `__proto__` 只是一个`指向原型对象的指针`，那就说明在此之前`原型对象`就已经创建了，那么`原型对象`是什么时候被创建的呢？这就要引入`构造函数`的概念。

其实构造函数也就只是一个普通的函数而已，如果这个函数可以使用 `new` 关键字来创建它的实例对象，那么我们就把这种函数称为`构造函数`。

```js
// 普通函数
function person() {}

// 构造函数，函数首字母通常大写
function Person() {}
const person = new Person();
```

在这个例子中，`Person` 就是一个构造函数，我们使用 `new` 创建了一个实例对象 `person`。

**`原型对象`正是在`构造函数被声明时一同创建的`。构造函数被申明时，原型对象也一同完成创建，然后挂载到构造函数的 `prototype` 属性上：**

![原型对象](https://img-blog.csdnimg.cn/20210507150631983.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`原型对象`被创建时，会自动生成一个 `constructor` 属性，指向`创建它的构造函数`。这样它俩的关系就被紧密地关联起来了。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '细心的话，你可能会发现，原型对象也有自己的 `__proto__` ，这也不奇怪，毕竟万物皆对象嘛\n\n原型对象的 `__proto__` 指向的是 `Object.prototype`。\n\n那么 `Object.prototype.__proto__` 存不存在呢？其实是不存在的，打印的话会发现是 `null` 。这也证明了 `Object` 是 `JavaScript` 中数据类型的起源。';

export default () => <Info type="info" title="" txt={txt} />;
```

我们可以用一张图来表示这个关系：

![关系图](https://img-blog.csdnimg.cn/20210507150826444.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 原型链

> 说完了原型，就可以来说说原型链了，如果理解了原型机制，原型链就很好解释了。其实上面一张图上，那条被 `__proto__` 链接起来的链式关系，就称为`原型链`。

## 原型链的作用：

原型链如此的重要的原因就在于它决定了 `JavaScript` 中继承的实现方式。当我们访问一个属性时，查找机制如下：

- 访问对象实例属性，有则返回，没有就通过 `__proto__` 去它的原型对象查找。
- 原型对象找到即返回，找不到，继续通过原型对象的 `__proto__` 查找。
- 一层一层一直找到 `Object.prototype` ，如果找到目标属性即返回，找不到就返回 `undefined`，不会再往下找，因为在往下找 `__proto__` 就是 `null` 了。

通过上面的解释，对于构造函数生成的实例，我们应该能了解它的原型对象了。`JavaScript` 中万物皆对象，那么构造函数肯定也是个对象，是对象就有 `__proto__ `，那么构造函数的 `__proto__` 是什么？

![构造函数的proto](https://img-blog.csdnimg.cn/20210507151326305.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt = '这里需要注意的是: `Function.__proto__ === Function.prototype`。';

export default () => <Info type="warning" title="" txt={txt} />;
```

![示例](https://img-blog.csdnimg.cn/20210507160818895.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

至于为什么 `Function.__proto__` 等于 `Function.prototype` 有这么几种说法：

1. 为了保持与其他函数保持一致。
2. 为了说明一种关系，比如证明所有的函数都是 `Function` 的实例。
3. 函数都是可以调用 `call`、`bind` 这些内置 `API` 的，这么写可以很好的保证函数实例能够使用这些 API。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '<strong>关于原型、原型链和构造函数有几点需要注意：</strong>\n\n1. `__proto__` 是非标准属性，如果要访问一个对象的原型，建议使用 `ES6` 新增的 `Reflect.getPrototypeOf` 或者 `Object.getPrototypeOf()` 方法，而不是直接 `obj.__proto__`，因为非标准属性意味着未来可能直接会修改或者移除该属性。同理，当改变一个对象的原型时，最好也使用 `ES6` 提供的 `Reflect.setPrototypeOf` 或 `Object.setPrototypeOf`。\n\n2. 函数都会有 `prototype` ，除了 `Function.prototype.bind()` 之外。\n\n3. 对象都会有 `__proto__` ，除了 `Object.prototype` 之外（其实它也是有的，只不过是 `null`）。\n\n4. 所有函数都由 `Function` 创建而来，也就是说他们的 `__proto__` 都等于 `Function.prototype`。\n\n5. `Function.prototype` 等于 `Function.__proto__` 。';

export default () => <Info type="warning" title="" txt={txt} />;
```

```js
let target = {};
let newProto = {};
Reflect.getPrototypeOf(target) === newProto; // false
Reflect.setPrototypeOf(target, newProto);
Reflect.getPrototypeOf(target) === newProto; // true
```

## 原型污染

> 原型污染是指：攻击者通过某种手段修改 `JavaScript` 对象的原型。

举个例子,如果我们把 `Object.prototype.toString` 改成这样：

```js
Object.prototype.toString = function () {
  alert('Hello World');
};
let obj = {};
obj.toString();
```

那么当我们运行这段代码的时候浏览器就会弹出一个 `alert`，对象原生的 `toString` 方法被改写了，所有对象当调用 `toString` 时都会受到影响。

你可能会说，怎么可能有人傻到在源码里写这种代码，这不是搬起石头砸自己的脚么？没错，没人会在源码里这么写，但是攻击者可能会通过表单或者修改请求内容等方式使用原型污染发起攻击，来看下面一种情况：

```js
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const isObject = (obj) => obj && obj.constructor && obj.constructor === Object;

function merge(a, b) {
  for (var attr in b) {
    if (isObject(a[attr]) && isObject(b[attr])) {
      merge(a[attr], b[attr]);
    } else {
      a[attr] = b[attr];
    }
  }
  return a;
}

function clone(a) {
  return merge({}, a);
}

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const admin = {};

// App
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'views')));
app.post('/signup', (req, res) => {
  var body = JSON.parse(JSON.stringify(req.body));
  var copybody = clone(body);
  if (copybody.name) {
    res.cookie('name', copybody.name).json({
      done: 'cookie set',
    });
  } else {
    res.json({
      error: 'cookie not set',
    });
  }
});
app.get('/getFlag', (req, res) => {
  var аdmin = JSON.parse(JSON.stringify(req.cookies));
  if (admin.аdmin == 1) {
    res.send('hackim19{}');
  } else {
    res.send('You are not authorized');
  }
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
```

如果服务器中有上述的代码片段，攻击者只要将 `cookie` 设置成`{__proto__: {admin: 1}}` 就能完成系统的侵入。

## 原型污染的解决方案

在看原型污染的解决方案之前，我们可以看下 `lodash` 团队之前解决原型污染问题的手法：

![](https://img-blog.csdnimg.cn/20210507162314817.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![](https://img-blog.csdnimg.cn/20210507162314817.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

代码很简单，只要是碰到有 `constructor` 或者 `__proto__` 这样的敏感词汇，就直接退出执行了。这当然是一种防止原型污染的有效手段，当然我们还有其他手段：

- 使用 `Object.create(null)`， 方法创建一个原型为 `null` 的新对象，这样无论对 原型做怎样的扩展都不会生效：

```js
const obj = Object.create(null);
obj.__proto__ = { hack: '污染原型的属性' };
console.log(obj); // => {}
console.log(obj.hack); // => undefined
```

- 使用 `Object.freeze(obj)` 冻结指定对象，使之不能被修改属性，成为不可扩展对象：

```js
Object.freeze(Object.prototype);

Object.prototype.toString = 'evil';

console.log(Object.prototype.toString);
// => ƒ toString() { [native code] }
```

- 建立 `JSON schema` ，在解析用户输入内容时，通过 `JSON schema` 过滤敏感键名。

- 规避不安全的递归性合并。这一点类似 `lodash` 修复手段，完善了合并操作的安全性，对敏感键名跳过处理。
