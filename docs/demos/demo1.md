---
title: 模拟试题1
nav:
  title: 模拟试题
  path: /demos
  order: 0
---

- 2022.07.11

## 1. apply 与 call

### 你能说说 js 中 call 和 apply 有什么区别吗?

首先 `call` 和 `apply` 两个方法都是用来改变函数运行时`this`指向问题。

其中 `call` 方法接收一个新的 `this`，以及一一罗列出来的各个参数。

而 `apply` 方法接收一个新的 `this`，以及一个参数数组(或者是 arguments 对象)。

使用这两个方法来扩充作用域的好处是我们的函数和对象可以不存在任何的耦合关系。

```js
// apply
function sum(num1, num2) {
  return num1 + num2;
}

function callSum1(num1, num2) {
  return sum.apply(this, arguments);
}

function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2]);
}

alert(callSum1(10, 20)); // 30
alert(callSum2(10, 10)); // 20

// call
function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}

callSum(20, 30); // 50
```

### 那么你能够自己手写实现 apply 和 call 两个方法吗?

```js
// apply
Function.prototype.apply = function (context = window) {
  context.fn = this;
  // arguments[0]是this
  const args = arguments[1] || [];

  const res = context.fn(...args);

  delete context.fn;

  return res;
};

// call
Function.prototype.call = function (context = window) {
  context.fn = this;
  const args = [...arguments].slice(1);

  const res = context.fn(...args);

  delete context.fn;

  return res;
};
```

## 2.你能说说 js 中的事件执行机制么(Event Loop)?

首先，我们知道 js 是一门单线程的语言，为什么是单线程在于其主要用于处理网页中的交互逻辑，如果被设计成一门多线程的语言，那么就要处理各种互斥的逻辑。

这里的单线程指的是单个脚本只能在一个线程上运行，而不是说 JavaScript 引擎只有一个线程。

但是`单线程`的语言也存在着一个问题，在处理任务的时候是一个接一个排队处理的，假设有一个耗时巨大的任务需要执行，这个时候浏览器就会一直被这个任务占用资源，其他的操作就得不到响应了。

所以需要一套额外的任务执行机制来处理这种场景。

因此，也诞生了 `Event Loop`。

另外，我们知道当一段 js 代码被执行的时候，会生成一个当前环境下的执行上下文(包括了执行环节、作用域)，用于存放当前环境中的变量，当这个上下文生成后会被推入到执行栈。一旦完成执行，这个上下文就会被弹出，里面的相关变量也会被销毁，等待下一次 gc 后删除。

这个执行栈我们可以理解为主线程任务的同步执行环境。

在同步的执行环节外，还存在着一个`Task`任务队列用于管理各种异步场景(比如说接口请求等)。

所有的异步操作都会被塞到这个任务队列中，当这些异步任务执行完成后会通知主线程，是通过事件回调的方式，这也是`Event Loop`名字的来源。

而`Event Loop`刚好是处于这两者之间，它会以一个固定的时间间隔来轮询，每当主线程空闲的时候，就会去任务队列中查找是否有异步任务，如果有的话就将其塞入主线程去执行，执行完成后弹出上下文环境。

当主线程再次空闲的时候，继续这个操作，直到所有任务执行完成。

这个时候就解决了事件的交互机制，但是这个时候的交互还存在问题，事件并没有区分优先级，只是按照到来的先后顺序去执行，因此需要一套插队机制来保证高优先级的任务先执行。

因此我们将异步任务又进行了划分，划分成了`宏任务`和`微任务`两大块。

同一次事件循环中，`微任务`永远在`宏任务`之前执行。

至此一个完整的`Event Loop`就形成了。

总结来说，可以说 `Event Loop` 是通过设计 `Loop机制` 和 `异步任务队列`来解决主线程执行阻塞问题，并且设计了一套 `Micro Task`插队机制的事件交互机制。

### 你提到了 宏任务 和 微任务，那么有哪些宏任务和微任务呢?

- 宏任务
  - 整体代码的 script 标签
  - setTimeout
  - setInterval
  - requestAnimationFrame(执行时机晚于 setTimeout)
  - requestIdleCallback(执行时机晚于 setTimeout)
  - UI 的渲染
  - I/O(按钮点击、文件上传等)
  - postMessage
  - MessageChannel
- 微任务
  - MutaionObserver
  - IntersectionObserver
  - Promise.then()

### 你有去了解过 node.js 下的 Event Loop 么？和浏览器端的有什么区别?

首先 `Node.js` 也是单线程的，对比浏览器 `Node.js`中多了 2 个任务类型。

1. setImmediate(宏任务)
2. process.nextTick(微任务)

其中 `setImmediate` 是在一次`Event Loop`执行完毕后调用。

在一个主进程中同时注册了`setImmediate` 和 `setTimeout`的话执行顺序并不一定。

但是假设两个任务都在同一个宏任务中，那么必然是`setImmediate`先执行完成。

关于`process.nextTick`，我们可以将其理解为类似`Promise`的微任务实现，在代码执行的过程中可以随时插入`nextTick`，并且会保证在下一个宏任务开始之前所执行。一般用于处理一些事件绑定类回调操作。

另外，在 `Node.js` 中更加细化了`同步任务`和`异步任务`的优先级问题。

在 `Node.js` 中将宏任务队列拆成了五个优先级：`Timers`、`Pending`、`Poll`、`Check`、`Close`。

![任务优先级](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f16ec03bf614d5b9d01fe55b126758b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

- Timers Callback： 涉及到时间，肯定越早执行越准确，所以这个优先级最高很容易理解。
- Pending Callback：处理网络、IO 等异常时的回调，有的 linux 系统会等待发生错误的上报，所以得处理下。
- Poll Callback：处理 IO 的 data，网络的 connection，服务器主要处理的就是这个。
- Check Callback：执行 setImmediate 的回调，特点是刚执行完 IO 之后就能回调这个。
- Close Callback：关闭资源的回调，晚点执行影响也不到，优先级最低。

总的来说，在`Node.js(v11)`之前`Event Loop` 并不是浏览器那种一次执行一个宏任务，然后执行所有的微任务，而是执行完一定数量的 `Timers` 宏任务，再去执行所有微任务，然后再执行一定数量的 Pending 的宏任务，然后再去执行所有微任务，剩余的 `Poll`、`Check`、`Close` 的宏任务也是这样。

而在`Node.js(v11)`之后已经修改成为和浏览器一致，先执行一个宏任务，执行完成之后执行所有的微任务。

### 说说下面这段代码的执行结果

```js
const p1 = new Promise((resolve, reject) => {
  console.log('promise1');
  resolve();
})
  .then(() => {
    console.log('then11');
    new Promise((resolve, reject) => {
      console.log('promise2');
      resolve();
    })
      .then(() => {
        console.log('then21');
      })
      .then(() => {
        console.log('then23');
      });
  })
  .then(() => {
    console.log('then12');
  });

const p2 = new Promise((resolve, reject) => {
  console.log('promise3');
  resolve();
}).then(() => {
  console.log('then31');
});
// promise1 --> promise3 --> then11 --> promise2 --> then31 --> then21 --> then12 --> then23

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

/**
 * 1. script start // 同步任务
 * 2. async1 start // async1函数中的同步任务
 * 3. async2       // async1函数中遇到await先立即执行
 * 4. promise1     // 遇到promise 执行同步任务
 * 5. script end   // 执行外层同步任务
 * 6. async1 end   // 执行微任务中先注册的
 * 7. promise2     // 执行promise中的then 优先级大于setTimeout
 * 8. setTimeout   // 执行setTimeout函数
 * /
```

## 3. 说说 js 中的原型链?

`JavaScript` 中没有类的概念，主要通过原型链来实现继承。通常情况下，继承意味着复制操作，然而 `JavaScript` 默认并不会复制对象的属性，相反，`JavaScript` 只是在两个对象之间创建一个关联（原型对象指针），这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。

比如说当我们使用`new`关键字实例化了一个新的对象，构造函数中并没有传入任何参数，但是我们也能访问到`toString` 、`valueOf` 等原生方法。

这些方法都是从原型上继承过来的。

当我们去创建一个新的对象的时候，会生成一个`__proto__`属性，这是一个指向原型对象的指针。

当我们尝试访问实例对象上的某一属性或者方法时，如果实例对象上有该属性或者方法时，就返回实例属性或者方法。

如果没有，就去 `__proto__` 指向的原型对象上查找对应的属性或者方法。

这就是为什么我们尝试访问空对象的 `toString` 和 `valueOf` 等方法依旧能访问到的原因，JavaScript 正式以这种方式为基础来实现继承的。

### 上面说到了 原型对象 那么什么是原型对象？原型对象是什么时候被创建的呢?

**`原型对象`是在`构造函数`被声明的时候一同创建出来的，然后挂载到构造函数的 `prototype` 属性上：**

![原型对象](https://img-blog.csdnimg.cn/20210507150631983.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`原型对象`被创建时，会自动生成一个 `constructor` 属性，指向创建它的构造函数。这样它俩的关系就被紧密地关联起来了。

`原型对象`的 `__proto__` 指向的是 `Object.prototype`。

那么 `Object.prototype.__proto__` 存不存在呢？其实是不存在的，打印的话会发现是 `null` 。这也证明了 `Object` 是 `JavaScript` 中数据类型的起源。

用一张图来说明的话就是下面这样:

![关系图](https://img-blog.csdnimg.cn/20210507150826444.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 构造函数的 **proto** 指向的是什么?

![构造函数的proto](https://img-blog.csdnimg.cn/20210507151326305.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### Function.**proto** 等于 Function.prototype 有这么几种说法

1. 为了保持与其他函数保持一致。
2. 为了说明一种关系，比如证明所有的函数都是 Function 的实例。
3. 函数都是可以调用 call、bind 这些内置 API 的，这么写可以很好的保证函数实例能够使用这些 API。

### 什么是原型污染？如何避免原型污染?

原型污染是指：攻击者通过某种手段修改 `JavaScript` 对象的原型。

比如我们把 `Object.prototype.toString` 改成这样：

```js
Object.prototype.toString = function () {
  alert('Hello World');
};
let obj = {};
obj.toString();
```

那么当我们运行这段代码的时候浏览器就会弹出一个 `alert`，对象原生的 `toString` 方法被改写了，所有对象当调用 `toString` 时都会受到影响。

攻击者可能会通过表单或者修改请求内容等方式使用原型污染发起攻击。

我们可以通过以下的一些手段来避免原型污染:

1. 碰到有 `constructor` 或者 `__proto__` 这样的敏感词汇，就直接退出执行了。

2. 使用 `Object.create(null)`， 方法创建一个原型为 `null` 的新对象，这样无论对 原型做怎样的扩展都不会生效。

3. 使用 `Object.freeze(obj)` 冻结指定对象，使之不能被修改属性，成为不可扩展对象。

4. 建立 `JSON schema`，在解析用户输入内容时，通过 `JSON schema` 过滤敏感键名。

## 4. 既然说到了原型链，能说下 js 中的继承么?

首先我们知道在 js 中是通过原型链来实现继承的。

### 1.原型链继承

原型链继承是最简单的继承方式之一，其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。

每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。

那么，假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？

显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。

```js
// parent
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function () {
  return this.property;
};

// children
function SubType() {
  this.subproperty = false;
}
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function () {
  return this.subproperty;
};

var instance = new SubType();
alert(instance.getSuperValue()); // true
alert(instance.getSubValue()); // false
alert(instance instanceof SuperType); // true
alert(instance.constructor); // SuperType
```

原型链继承存在的 2 个问题:

1. 引用类型值会被实例共享
2. 无法向父类的构造函数传值

### 2.借用构造函数继承

这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型的构造函数。

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green'];
}
function SubType() {
  // 继承了 SuperType
  SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push('black');
alert(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors); //"red,blue,green"
```

这样一来，就会在新 `SubType` 对象上执行 `SuperType()`函数中定义的所有对象初始化代码。结果，`SubType` 的每个实例就都会具有自己的 `colors` 属性的副本了。

借用构造函数实现继承的方式，解决了通过原型来继承的 2 大问题，也存在一个致命的缺点，方法都在构造函数中定义，每次创建实例都会创建一遍方法，无法保证函数的复用性。

而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。

### 3. 组合继承

`组合继承（combination inheritance）`，也叫做`伪经典继承`，指的是将`原型链`和`借用构造函数`的技术组合到一块，从而发挥二者之长的一种继承模式。其背后的思路是使用`原型链`实现对`原型属性`和`方法`的继承，而通过`借用构造函数`来实现对实例属性的继承。

```js
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  alert(this.name);
};

function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name);
  this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  alert(this.age);
};

var instance1 = new SubType('Nicholas', 29);
instance1.colors.push('black');
alert(instance1.colors); // "red,blue,green,black"
instance1.sayName(); // "Nicholas";
instance1.sayAge(); // 29
var instance2 = new SubType('Greg', 27);
alert(instance2.colors); // "red,blue,green"
instance2.sayName(); // "Greg";
instance2.sayAge(); // 27
```

### 4.原型式继承

这种方法并没有使用严格意义上的构造函数。他的想法是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

在后来`Object.create()`方法规范化了原型式继承。

### 5.寄生式继承

寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```js
function createAnother(original) {
  var clone = Object.create(original);
  clone.sayHi = function () {
    alert('Hi');
  };
  return clone;
}
```

### 6.寄生组合式继承

`寄生组合式继承`解决了`组合继承`在无论什么情况下，都会调用两次超类型构造函数的问题。

```js
function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype); //创建对象
  prototype.constructor = subType; // 增强对象
  subType.prototype = prototype; // 指定对象
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function () {
  alert(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function () {
  alert(this.age);
};
```

## 5.说一说闭包吧?

闭包是指一个绑定了执行环境的函数。(或者说是函数内部定义的函数，被返回了出去并在外部调用。)

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

### 闭包有哪些应用场景呢?

闭包的应用，大多数是在需要维护内部变量的场景下。

- 实现单例模式

单例模式是一种常见的设计模式，它保证了一个类只有一个实例。实现方法一般是先判断实例是否存在，如果存在就直接返回，否则就创建了再返回。单例模式的好处就是避免了重复实例化带来的内存开销：

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

- 模拟私有属性

在 ES13 之前，通过闭包来模拟私有属性

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

- 实现函数柯里化。

### 闭包存在着一些什么样的隐患?

**闭包最大的隐患就是在没有合理使用的情况下容易产生内存泄露**。

### 那么如何解决闭包的内存泄露问题呢?

1. 使用严格模式

```js
'use strict';

function foo() {
  b = 2;
}

foo(); // ReferenceError: b is not defined
```

2. 关注 DOM 生命周期，在销毁阶段记得解绑相关事件：

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

3. 优化代码结构和实现方式，避免过度使用闭包

## 6.你对 this 了解么？说说 this？

js 代码执行的时候会生成一个执行上下文和对应的 this，this 指向的是代码在执行的上下文。

### ES6 中的箭头函数中的 this 和普通函数的有什么区别?

1. this 指向

   - 普通函数中的 this 跟运行时的环境有关。
   - 箭头函数中的 this 在声明的时候就已经确定了 this 的指向。

2. 构造函数和参数

   - 箭头函数没有自己的`this`，也没有`arguments对象`,因此`call()`、`apply()`、`bind()`这些方法去改变 this 指向的方法对箭头函数也是无效的。
   - 箭头函数也不能当做构造函数使用。

## 7. 说说 js 中的 new 操作符？

new 运算符用于创建一个用户定义的对象类型的实例或具有构造函数的内置对象。

通过 new 操作符实例化出来的对象可以访问到父类中的属性和方法。

### new 操作符的执行过程是什么?

1. 首先创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

### 如何自己实现一个 new 操作符?

```js
function myNew() {
  const obj = Object.create(null);
  // Array.prototype.call(arguments)
  const Constructor = [].shift().call(arguments);

  obj.__proto__ = Constructor.prototype;

  const ret = Constructor.apply(obj, arguments);

  return typeof ret === 'object' ? ret : obj;
}
```

## 8.怎么理解 js 中的执行环境和作用域?

`执行环境`定义了变量或函数有权访问的其他数据，决定了它们各自的行为。

每个执行环境都有一个与之关联的`变量对象（variable object）`，环境中定义的所有`变量`和`函数`都保存在这个对象中。虽然我们编写的代码无法访问这个对象，但解析器在处理数据时会在后台使用它。

- 全局执行环境

一个程序中只会存在一个全局上下文，它在整个 `javascript` 脚本的生命周期内都会存在于执行堆栈的最底部不会被栈弹出销毁。全局上下文会生成一个全局对象（以浏览器环境为例，这个全局对象是 window），并且将 `this` 值绑定到这个全局对象上。

- 函数执行环境

每当一个函数被调用时，都会创建一个新的函数执行上下文（不管这个函数是不是被重复调用的）。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

- Eval 函数执行上下文

执行在 eval 函数内部的代码也会有它属于自己的执行上下文。

### 执行上下文

当 JavaScript 代码执行一段`可执行代码(executable code)`时，会创建对应的`执行上下文(execution context)`。

对于每个执行上下文，都有三个重要属性：

1. 变量对象(Variable Object，VO)
2. 作用域链(Scope chain)
3. this

变量对象构建的过程中会触发变量和函数的声明提升。

函数内部代码执行时，会先访问本地的变量对象去尝试获取变量，找不到的话就会攀爬作用域链层层寻找，找到目标变量则返回，找不到则 `undefined`。

### 作用域链

作用域链是由`多个执行上下文`的`变量对象`构成的`链表`。

作用域链的用途，是保证对执行环境有权访问的所有变量和函数的有序访问。

### 你了解过作用域链是如何创建和更新的么?

#### 函数的创建

我们知道函数的作用域在函数定义的时候就决定了。

是因为函数有一个内部属性 `[[scope]]`，当函数创建的时候，就会保存所有父变量对象到其中，我们可以理解 `[[scope]]` 就是所有父变量对象的层级链，**但是注意：`[[scope]]` 并不代表完整的作用域链！**

举个例子：

```js
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的`[[scope]]`为：

```js
foo[[scope]] = [globalContext.VO];

bar[[scope]] = [
  // Activive Object
  fooContext.AO,
  globalContext.VO,
];
```

#### 函数激活

当函数激活时，进入函数上下文，创建 `VO/AO` 后，就会将活动对象添加到作用链的前端。

这时候执行上下文的作用域链，我们命名为 Scope：

```js
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

### 如何延长作用域链?

我们可以在作用域链的前端临时增加一个变量对象，该变量对象会在代码执行后被移除。

1. try-catch 语句的 catch 块；
2. with 语句。

### 如何创建作用域链?

在 javascript 中，我们有几种创建 / 改变作用域的手段：

1. 定义函数，创建函数作用（推荐）：
2. 使用 let 和 const 创建块级作用域（推荐）：
3. try catch 创建作用域（不推荐）,err 仅存在于 catch 子句中：
4. 使用 eval “欺骗” 词法作用域（不推荐）：
5. 使用 with 欺骗词法作用域（不推荐）：

## 9. js 中的变量提升是个什么?

在 js 中当中当我们使用 var 去声明一个变量的时候，不论在声明前后使用都可以正常运行，这种现象就叫做`变量提升`。

## 10. 什么是 IIFE?

`IIFE(Imdiately Invoked Function Expression)`指的是一种立即执行函数的表达式。

使用 IIFE 可以立即执行一段函数，且函数内部的变量由于无法被外部访问到，在执行完成后就会销毁，释放内存。

### 如何创建 IIFE?

```js
// 方式1
(function(){
    ...
}())

// 方式2
(function(){

})()

// 由于括弧()和 JS 的&&，异或，逗号等操作符是在函数表达式和函数声明上消除歧义的，
// 所以一旦解析器知道其中一个已经是表达式了，其它的也都默认为表达式了。
0,
  (function () {
    /* code */
  })();

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

## 11. js 如何判断一个变量的类型以及如何判断一个对象是另一个对象的实例?

- 判断基本类型的情况下我们可以使用 typeof 来判断。
- 而使用 typeof 判断引用类型的时候返回的都是 object
- 我们使用 instanceof 判断一个对象是否是另外一个对象的实例

### typeof 的底层原理是如何实现的?

其实，js 在底层存储变量的时候，会在变量的机器码的低位 1-3 位存储其类型信息:

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

但是对于 `undefined` 和 `null` 来说，这两个值的信息存储是有点特殊的。

- null：所有机器码均为 0.
- undefined：用 −2^30 整数来表示.

所以，`typeof` 在判断 `null` 的时候就出现问题了，由于 `null` 的所有机器码均为 0，因此直接被当做了对象来看待。

### 那么 instanceof 是如何实现的呢?

其实我们知道判断一个对象是否是另外对象的实例是通过原型链来查找的，因此有了如下的结论:

```js
function _instanceof(obj, target) {
  // 获取取右表达式的 prototype 值
  let targetProto = target.prototype;

  // 获取左边表达式的__proto__
  let objProto = obj.__proto__;

  while (true) {
    if (objProto == null) {
      return false;
    }
    if (objProto == targetProto) {
      return true;
    }

    objProto = objProto.__proto__;
  }
}
```

其实 `instanceof` 主要的实现原理就是只要右边变量的 `prototype` 在左边变量的原型链上即可。

## 12. 手写实现一个 bind 方法

`bind()` 方法会创建一个新函数。当这个新函数被调用时，`bind()` 的第一个参数将作为它运行时的 `this`，之后的一序列参数将会在传递的实参前传入作为它的参数。

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

## 13. 你了解 js 中 Number 是如何存储的吗?

在`ECMAScript`中`Number` 类型是采用`IEEE754` 格式来表示`整数`和`浮点数值`。

所谓 `IEEE754` 标准，全称 `IEEE` 二进制浮点数算术标准，这个标准定义了表示浮点数的格式等内容。

在 `IEEE754` 中，规定了四种表示浮点数值的方式：`单精确度（32位`、`双精确度（64位）`、`延伸单精确度`、与`延伸双精确度`。

像 `ECMAScript` 采用的就是`双精确度`，也就是说，会用 `64` 位字节来储存一个浮点数。

其中具体格式如下:

- 1 符号位，0 表示正数，1 表示负数 (sign)
- 11 指数位（e）
- 52 尾数，小数部分（即有效数字）

在两数相加时，会先转换成二进制，`0.1` 和 `0.2` 转换成二进制的时候尾数会发生无限循环，然后进行`对阶运算`，JS 引擎对二进制进行截断，所以造成精度丢失。

**总结：精度丢失可能出现在进制转换和对阶运算中。**

## 14. 说说 promise

Promise 是 ES6 中出现的一个 API，很好的解决了早期的回调地域的问题。

### 那么 promise 总共有哪几种状态?

总共有 3 种状态，分别是:

- Pending
- Fulfilled
- Rejected

一但 `Promise` 被 `resolve` 或 `reject`，不能再迁移至其他任何状态（即状态 `immutable`）。

```js
new Promise((resolve, reject) => {
  resolve('success');
  // 无效
  reject('reject');
});
```

### promise 的执行过程大概是怎么样的?

1. 初始化 `Promise` 状态，进入`（pending）`.
2. 立即执行 `Promise` 中传入的 fn 函数，将 `Promise` 内部 `resolve`、`reject` 函数作为参数传递给 fn ，按事件机制时机处理.
3. 执行 `then(..)` 注册回调处理数组（then 方法可被同一个 promise 调用多次）
4. `Promise`里的关键是要保证，`then`方法传入的参数 `onFulfilled` 和 `onRejected`，必须在`then`方法被调用的那一轮事件循环之后的新执行栈中执行。

这里有一点需要注意，当我们在构造 `Promise` 的时候，构造函数内部的代码是立即执行的。

```js
new Promise((resolve, reject) => {
  console.log('new promise');
  resolve('success');
});
console.log('finish');
// new promise -> finish -> success
```

### 手写实现一个符合 PromiseA+规范的 promise

1. promise 需要支持构造函数形式
2. 需要实现 then 链式调用

```js
class _Promise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.callbacks = [];

    // 初始化构造函数
    executor(this.resolve, this.reject);
  }

  resolve = (value) => {
    // 只转化pending状态
    if (this.status == 'pending') {
      this.status = 'fulfilled';
      this.value = value;
      this.callbacks.forEach((fn) => {
        fn && fn(value);
      });
    }
  };

  reject = (value) => {
    // 只转化pending状态
    if (this.status == 'pending') {
      this.status = 'rejected';
      this.value = value;
      this.callbacks.forEach((fn) => {
        fn && fn(value);
      });
    }
  };
  // PromiseA+ 接收2个参数onFulfilled, onRejected
  then = (onFulfilled, onRejected) => {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    onRejected = typeof onRejected === 'function' ? onRejected : null;

    // 返回新的promise以实现链式调用
    const newPromise = (() => {
      return new _Promise((resolve, reject) => {
        const handle = () => {
          if (this.status === 'fulfilled') {
            // promiseA+规范使用setTimeout来模拟微任务 MDN上还有个queueMicrotask
            setTimeout(() => {
              const x = onFulfilled && onFulfilled(this.value);
              this.resolvePromise(newPromise, x, resolve, reject);
            }, 0);
          }

          if (this.status === 'rejected') {
            setTimeout(() => {
              if (onRejected) {
                const x = onRejected(this.value);
                this.resolvePromise(newPromise, x, resolve, reject);
              } else {
                reject(this.value);
              }
            }, 0);
          }
        };

        if (this.status === 'pending') {
          this.callbacks.push(handle);

          return;
        }

        handle();
      });
    })();

    return newPromise;
  };

  catch = (err) => {
    return this.then(null, err);
  };

  resolvePromise = (newPromise, x, resolve, reject) => {
    if (newPromise === x) {
      return this.reject(new TypeError('返回值不能为同一个Promise对象'));
    }
    // 如果返回值也是一个promise
    if (x instanceof _Promise) {
      x.then(resolve, reject);
    }
    // 如果 x 是对象或者函数执行 if 里面的逻辑
    if ((x && typeof x === 'object') || typeof x === 'function') {
      const { then } = x;
      if (typeof then === 'function') {
        let called = false;
        // 递归取对象里面的value
        then.call(
          x,
          (next) => {
            if (called) return;

            called = true;
            this.resolvePromise(newPromise, next, resolve, reject);
          },
          (err) => {
            if (called) return;

            called = true;
            reject(err);
          },
        );
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  };

  // 实现静态resolve方法
  static resolve = (value) => {
    if (value instanceof _Promise) {
      return value;
    }

    return new _Promise((resolve) => {
      resolve(value);
    });
  };

  // 实现静态reject方法
  static reject = (reason) => {
    return new _Promise((resolve, reject) => {
      reject(reason);
    });
  };

  // 实现finally
  // 不管是resolve还是reject最终都会执行finally的代码
  finally = (fn) => {
    return this.then(
      (value) => {
        return _Promise.resolve(fn()).then(() => value);
      },
      (err) => {
        return _Promise.resolve(fn()).then(() => {
          throw err;
        });
      },
    );
  };

  // 实现all方法
  // 等待所有方法执行完成后resolve
  static all = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const res = [];
    const len = arr.length;
    let count = 0;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          arr[i].then((value) => {
            res[i] = value;
            count++;
            if (count == len) {
              resolve(res);
            }
          }, reject);
        } else {
          count++;
          res[i] = arr[i];
          if (count === len) resolve(res);
        }
      }
    });
  };

  // 实现race
  // 当给定的promise中某一个完成后即resolve
  static race = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const len = arr.length;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          arr[i].then(resolve, reject);
        } else {
          resolve(arr[i]);
        }
      }
    });
  };

  // 实现allSellted方法
  // ES11出现，解决使用 Promise.all 的时候，如果其中某个任务出现异常(reject)，所有任务都会挂掉，Promise 直接进入 reject 状态。
  static allSellted = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const res = [];
    const len = arr.length;
    let count = 0;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          const process = (index, status, value) => {
            res[index] = { status, value };
            count++;
            if (count == len) {
              resolve(res);
            }
          };
          arr[i].then(
            (value) => {
              process(i, 'fullfilled', value);
            },
            (reason) => {
              process(i, 'rejected', reason);
            },
          );
        } else {
          count++;
          res[i] = {
            status: 'fulfilled',
            value: arr[i],
          };
          if (count === len) resolve(res);
        }
      }
    });
  };

  // 实现any
  // ES12中出现，类似Promise.race，只要给定的迭代中的任何一个 promise 成功，就采用第一个 promise 的值作为它的返回值，但与 Promise.race 的不同之处在于——它会等到所有 promise 都失败之后，才返回失败的值。
  static any = (arr) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('请传入一个数组');
    }

    const len = arr.length;
    let errorCount = 0;

    return new _Promise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (arr[i] instanceof _Promise) {
          arr[i].then(resolve, (err) => {
            errorCount++;
            if (errorCount === len) {
              reject('AggregateError: All promises were rejected');
            }
          });
        } else {
          resolve(arr[i]);
        }
      }
    });
  };
}
```
