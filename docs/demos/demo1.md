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

## 15. Generators 是什么?

`Generator`是 ES6 出现的一种生成器，允许我们在函数执行过程中暂停、并在将来某一时刻恢复执行，这一特性改变了以往函数必须执行完成才返回的特点。

```js
function* fn() {
  yield 1;
  yield 2;
  yield 3;
}
const iter = fn();
iter.next(); // {value:1，done:false}
iter.next(); // {value:2，done:false}
iter.next(); // {value:3，done:false}
iter.next(); // {value:undefined，done:true}
```

与普通函数相比二者有如下区别:

- 普通函数使用 `function` 声明，生成器函数用 `function*`声明
- 普通函数使用 `return` 返回值，生成器函数使用 `yield` 返回值
- 普通函数是 `run to completion` 模式，即普通函数开始执行后，会一直执行到该函数所有语句完成，在此期间别的代码语句是不会被执行的；生成器函数是 `run-pause-run` 模式，即生成器函数可以在函数运行中被暂停一次或多次，并且在后面再恢复执行，在暂停期间允许其他代码语句被执行。

## 16. js 中的垃圾回收机制是怎么样的?

`JavaScript` 具有自动垃圾收集机制，也就是说，执行环境会负责管理代码执行过程中使用的内存。

最常用的垃圾收集方式是`标记清除`。

js 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。

然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。

最后，垃圾收集器完成内存清除工作，销毁那些带标记的值并回收它们所占用的内存空间。

### 市面上的 js 引擎有哪些？

- SpiderMonkey
- Google V8
- JavaScriptCore

## 17.js 中内存泄露的场景有哪些？如何避免?

1. 全局变量的无意使用。

   - 对应解决方案是使用 let 创建块级作用域的变量。

2. 被遗忘的计时器

   - 在组件的卸载等生命周期清空对应的计时器。

3. 被遗忘的 DOM 事件监听

   - 针对添加在 window 以及 dom 元素上的事件，在页面卸载的时候及时清除

4. 被中断的网络请求

   - 例如在 React 组件挂载的网络请求，在页面卸载的时候进行取消，且不能进行 setState 操作

5. 被遗忘的 Set 成员

   - Set 集合中添加的值对象置为 `null` 并不会销毁，需要使用`set.delete(value)` 或者是 `weakSet` 来解决。

6. 被闭包所包裹的变量
   - 闭包中的引用造成外部置为 null 时并不会释放内存，尽量减少闭包的使用。

关于详细的内存泄露排查的方式，可以借助类似 `Chrome浏览器` 的 `Performance` 功能来查看。

启动服务后进行相对应的操作后，点击 stop 按钮结束录制，会生成这段时间内的操作记录，包含了各项数据的情况。

选中`JS Heap`，下面展现出来的一条`蓝线`，就是代表了这段记录过程中，JS 堆内存信息的变化情况。

**如果这条蓝线一直成上升趋势，那大概率就是内存泄漏了。**

另外借助 `Memory` 工具能够更精确地定位内存使用情况。

通过连续操作后对比前后生成的快照信息，注意这个 `#Delta` ，如果是正值，就代表新生成的内存多，释放的内存少。其中的闭包项，如果是正值，就说明存在内存泄漏。

## 18. js 中的数据类型?

- 基本类型
  - number
  - string
  - boolean
  - null
  - undefined
  - symbol
  - bigInt
- 引用类型
  - object

### 为什么区分原始类型和引用类型?

`原始类型`的数据在`ECMAScript`标准中，它们被定义为`primitive values`，即原始值，代表值本身是不可被改变的。

以`字符串`为例，我们在调用操作字符串的方法时，没有任何方法是可以直接改变字符串的:

```js
var str = 'Hello ';
str.slice(1); // ello
str.substr(1); // ello
str.trim(1); // Hello
str.toLowerCase(1); // hello
str[0] = 1;
console.log(str); // Hello
```

上述的操作都会产生一个新的字符串，而当我们用运算符去操作的时候，会对`str`产生修改。

- 基本类型是存储在栈中的简单数据。
- 引用类型是存储在堆内存中的对象，通过栈中的地址进行索引。

### 栈内存和堆内存有什么区别?

- 栈内存
  - 存储的值大小固定
  - 空间较小
  - 可以直接操作其保存的变量，运行效率高
  - 由系统自动分配存储空间
- 堆内存
  - 存储的值大小不定，可动态调整
  - 空间较大，运行效率低
  - 无法直接操作其内部存储，使用引用地址读取
  - 通过代码进行分配空间

### 变量类型如何检测?

- 基础类型 除了 `null` 之外 可以用 `typeof`。
- 引用类型 使用 `instanceof`。
- 详细的类型可以使用 `Object.prototype.toString.call()` 来检测。

### 两个存储的值相同的对象进行比较返回的结果是什么?

```js
const obj1 = {
  name: 'Jack',
};
const obj2 = {
  name: 'Jack',
};
console.log(obj1 === obj2); // false
```

对于引用类型 `obj1`、`obj2` 我们知道他们在栈中存储了一个指向堆中数据的指针，两个数据的值虽然是一样的，但是在栈中存储的指针的地址是不一致的，所以两者并不相等。

### 装箱和拆箱是什么?

- `装箱转换`：把基本类型转换为对应的包装类型。
- `拆箱操作`：把引用类型转换为基本类型。

当我们使用`基本类型`调用方法，就会自动进行 `装箱` 和 `拆箱` 操作。

```js
const name = 'Linda';
const name2 = name.substring(2);
```

上述代码的执行过程:

1. 创建一个 `String` 的包装类型实例.
2. 在实例上调用 `substring` 方法.
3. 销毁实例.

从 `引用类型` 到 `基本类型` 转换(拆箱)的过程中，会遵循 `ECMAScript` 规范规定的 `toPrimitive` 原则，一般会调用引用类型的 `valueOf` 和 `toString` 方法，我们也可以直接重写 `toPeimitive` 方法。

这个特性非常的重要，一般转换成不同类型的值遵循的原则不同，例如：

- 引用类型转换为 `Number` 类型，先调用 `valueOf`，再调用 `toString`。
- 引用类型转换为 `String` 类型，先调用 `toString`，再调用 `valueOf`。

若 `valueOf` 和 `toString` 都不存在，或者没有返回基本类型，则抛出 `TypeError` 异常。

```js
const obj = {
  valueOf: () => {
    console.log('valueOf');
    return 123;
  },
  toString: () => {
    console.log('toString');
    return 'Linda';
  },
};

console.log(obj - 1); // valueOf 122
console.log(`Hello ${obj}`); // toString  Hello Linda
```

### parseInt()、parseFloat() 函数怎么处理?

- parseInt

  它会忽略字符串前面的空格，直至找到第一个`非空格字符`。如果第一个字符不是数字字符或者负号，`parseInt()` 就会返回 `NaN`，也就是说，用 `parseInt()` 转换空字符串会返回 `NaN`。

- parseFloat

  `parseFloat()` 也是从第一个字符开始解析每个字符。而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止。

  字符串中的第一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略。

### +、-运算符规则

- `+`运算符规则

  - 当一侧为 `String` 类型，被识别为字符串拼接，并会优先将另一侧转换为`字符串类型`。
  - 当一侧为 `Number` 类型，另一侧为 `原始类型`，则将原始类型转换为 `Number类型`。
  - 当一侧为 `Number` 类型，另一侧为 `引用类型`，将 `引用类型` 和 `Number 类型`转换成`字符串`后拼接。

  ```js
  123 + '123'; // '123123' （规则1）
  '011' + 100; // '011100' （规则1）
  123 + null; // 123      （规则2）
  123 + undefined; // NaN （规则2）
  123 + Symbol(0); // Uncaught TypeError: Cannot convert a Symbol value to a number  （规则2）
  123 + BigInt(0); // Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions （规则2）
  123 + {}; // 123[object Object]  （规则3）

  const a = () => {};
  123 + a; // '123() => {}'   （规则3）
  123 + a(); // NaN 由于a()返回了undefined     （规则2）
  ```

- `-`运算符规则

  - 如果执行减法运算的两个操作数中有字符串类型，且其中的字符串可以转化为数字，则会将其转化为数字之后再进行运算。
  - 如果其中有字符串且不能转化为数字，则计算结果为 `NaN`。

  ```js
  '10' - 5; // 5      （规则1）
  '10' - '3'; // 7    （规则1）
  's' - 3; // NaN     （规则2）
  '10' - 'a'; // NaN  （规则2）

  const a = {
    valueOf: () => 11,
    toString: () => '1',
  };

  10 - a; // -1 走了a的valueOf方式   （规则1）
  ```

- `>`、`<` 比较运算符的规则

  - 如果两个变量都是 `Number类型` 的话，就按照值大小进行比较。
  - 如果其中一个变量是 `Number类型` ，另一个变量是 `String类型` 的话，会将 `String类型` 的变量尝试转化为`Number类型` 后进行比较。
  - 如果两个变量都是 `String类型` 的话，会通过逐位(从左往右)进行`ASCII码大小`的比较，如果前面位的 ASCII 码值较大则不进行后续比较直接返回 true。
  - 如果一个变量是 `Object类型`，另外一个是 `Number类型`的话，会尝试根据`toPrimitive法则`将对象的 `valueOf` 返回值与 `Number类型` 的值进行比较。
  - 如果一个变量是 `Object类型`，另外一个是 `String类型` 的话，会尝试根据`toPrimitive法则`先将对象的 `valueOf` 返回值与 `Number(String类型)` 的值进行比较，这时候就是两个 `Number类型` 数字大小的比较，如果对象没有 `valueOf` 方法的话会再次尝试使用 `toString()` 方法进行比较，这个时候就是两个 `String类型` 的值比较 ASCII 码大小。
  - 如果一个变量是 `Array类型`，另外一个是 `Number类型` 的话，这时候的比较又比较有意思了，不论 `Number` 大小返回都是 false 。
  - 如果一个变量是 `Array类型`，另外一个是 `String类型` 的话，这时候的比较又很有意思了，实际上走的还是规则 3 的 ASCII 码大小比较。
  - 如果一个变量是 `null`，另一个是 `Number类型`的话，走的实际是规则 1，将 `null` 转化为 `Number(null)` 即 0 之后与 `Number类型` 的值进行比较。
  - 如果一个变量是 `null`，另一个是 `String类型` 的话，走的实际是规则 2，将 `null` 转化为 `Number(null)` 即 0 之后与 `Number(String类型)` 的值进行大小比较。
  - 如果一个变量是 `null`，另一个不是 `Number类型` 或者 `String类型` 的话统一返回值都是 null < 该类型的值--> false，null > 该类型的值--> false.
  - 如果其中一个变量是 `undefined` 那么返回值都是 `false`。

- `==` 相等运算符规则

  - 布尔值比较运算前会被转换成数值，true 转化为 1，false 转化为 0；
  - 描述数字的字符串与数字进行比较前会被转化成数字。
  - 对象和字符串进行比较前，会将对象转换成字符串'[object object]'
  - null 值和 undefined 值进行相等比较，结果返回为 true。
  - NaN 与 NaN 比较返回都是 false。

- `===` 全等运算符规则
  - 全等运算符除了满足相等运算的条件上还需要加上类型相同的判断。

### 原始类型和引用类型如何比较?

当 `原始类型` 和 `引用类型` 做比较时，对象类型会依照 `toPrimitive` 规则转换为`原始类型`:

```js
'[object Object]' == {}; // true
'1,2,3' == [1, 2, 3]; // true
[] == ![]; // true
([null] == false[undefined]) == // true
```

## 19. json 格式用过吧？都有哪些方法?

`json`是一种轻量级的文本格式，在 js 中主要有 `JSON.stringify` 和 `JSON.parse` 两个方法。

### JSON.stringify 的参数有哪些？分别是什么？哪些数据格式可以使用该方法?

`JSON.stringify(value[, replacer[, space]])`.

- value 必传 表示待处理的值，包括除了 BigInt 外的所有数据类型。
- replacer 可选 用于转换结果的函数或者数组
  - 当是函数，每个元素都会经过该函数的处理
  - 当是数组，只处理在数组中出现的 key
  - 当是 null 或者不提供都会转换
- space 可选 用于美化的空白字符串
  - 如果参数是个数字，它代表有多少的空格；上限为 10。
  - 该值若小于 1，则意味着没有空格；
  - 如果该参数为字符串（当字符串长度超过 10 个字母，取其前 10 个字母），该字符串将被作为空格；
  - 如果该参数没有提供（或者为 null），将没有空格。

### 如何修改一个对象的 JSON.stringify() 结果?

重写对象的`toJSON`方法可以覆盖默认的返回值。

```js
const obj = {
  key: 1,
  toJSON: function () {
    return 'hello world';
  },
};

JSON.stringify(obj); // '"hello world"'
```

## 20.如何异步去加载 script 脚本?

我们可以在 `script标签` 中使用 `async` 和 `deffer` 属性进行脚本的异步加载。

- 当使用 `async(异步) 模式` 去加载的时候，脚本会和页面的元素同时进行加载，加载的方式是开启了新的线程进行加载。
  - 下载的时候可以进行页面的其他操作，下载完成后就会停止解析并执行，但是并不能保证执行的顺序。
  - 脚本的加载可能在 `DOMContentLoaded` 事件之前执行，也可能在 `DOMContentLoaded` 事件之后执行，这取决于 DOM 内容的多少。
- 当使用 `defef(异步) 模式` 去加载的时候，设置了 `defer` 的 `script` 标签，则会按照顺序执行所有的 script，且脚本会在文档渲染完毕后，`DOMContentLoaded事件`调用前执行。

## 21. CSS 如何去做模块化?

CSS 中模块化主要是 2 种方式：

1. 使用 CSS Module 配合打包进行处理
2. 使用 CSS in Js 进行处理

![CSS模块化](https://img-blog.csdnimg.cn/20210622103142657.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 22. CSS 中常用的性能优化手段有哪些?

1. 避免使用`@import`

   外部的 `css` 文件中使用 `@import` 会使得页面在加载时增加额外的延迟。

   我们知道通过 `link` 和 `@import` 都可以去加载 `css`，但是两者存在以下一些区别:

   - `link` 是 `XHTML` 标签，除了加载 `CSS` 外，还可以定义 `RSS` 等其他事务；`@import` 属于 `CSS` 范畴，只能加载 `CSS`。
   - `link` 引用 `CSS` 时，在页面载入时同时加载；`@import` 需要页面网页完全载入以后加载。所以会出现一开始没有 `css` 样式，闪烁一下出现样式后的页面(网速慢的情况下)。
   - 另外，多个 `@import` 会导致下载顺序紊乱，在 IE 中，`@import` 会引发资源文件的下载顺序被打乱，即排列在 `@import` 后面的 `js` 文件优先于 `@import` 下载，并且打乱甚至破坏 `@import` 自身的并行下载。

2. 尽量减少页面重排、重绘

   - 重排

     - 浏览器为了重新渲染部分或整个页面，重新计算页面元素位置和几何结构。
     - 浏览器根据定义好的样式来计算，并将元素放到该出现的位置上。
     - 页面上任何一个节点触发来 reflow，会导致他的子节点和祖先节点重新渲染。

     **有以下几种情况会触发页面重排(reflow):**

     1. 改变窗口的大小
     2. 改变文字的大小
     3. 添加、删除样式表
     4. 内容的改变——输入框输入内容
     5. 伪类的激活
     6. 操作 class 属性
     7. 脚本操作 dom、js 改变 css 类
     8. 计算 offsetWidth 和 offsetHeight
     9. 设置 style 属性
     10. 改变元素的内外边距

     **常见重排元素:**

     1. 大小有关的 `width`,`height`,`padding`,`margin`,`border-width`,`border`,`min-height`。

     2. 布局有关的 `display`,`top`,`position`,`float`,`left`,`right`,`bottom`。

     3. 字体有关的 `font-size`,`text-align`,`font-weight`,`font-family`,`line-height`,`white-space`,`vertical-align`。

     4. 隐藏有关的 `overflow`,`overflow-x`,`overflow-y`。

     **减少 reflow 对性能的影响的建议:**

     1. 不要一条条的修改 `dom` 的样式，预先定义好 `class`，然后修改 `dom` 的 `classname`。
     2. 不要修改影响范围较大的 `dom`。
     3. 为动画元素使用`绝对定位`。
     4. 不要 `table` 布局，因为一个很小的改动会造成整个 `table` 重新布局。
     5. 避免设置大量的 `style` 属性，通过设置 `style` 属性改变节点样式的话，每一次设置都会触发一次 `reflow`，所以最好使用 `class` 属性。
     6. 如果 css 里面有计算表达式，每次都会重新计算一遍，触发一次 `reflow`。

   - 重绘

     - 当一个元素的外观被改变，但是布局没有改变的情况
     - 当元素改变的时候，不影响元素在页面中的位置，浏览器仅仅会用新的样式重绘此元素

     **常见的重绘元素:**

     1. 颜色： `color`,`background`。
     2. 边框样式： `border-style`,`outline-color`,`outline`,`outline-style`,`border-radius`,`box-shadow`,`outline-width`。
     3. 背景有关： `background`,`backgound-image`,`background-position`,`background-repeat`,`background-size`。
     4. 动画相关: `transofrm`。

     CSS 的最终表现分为以下四步：`Recalculate Style -> Layout -> Paint Setup and Paint -> Composite Layers`。

     大致是 `查找并计算样式 -> 排布 -> 绘制 -> 组合层`。

     由于 `transform` 是位于 `Composite Layers 层`，而 `width`、`left`、`margin` 等则是位于 `Layout`层，在 `Layout` 层发生的改变必定导致 `Paint Setup and Paint -> Composite Layers`，所以相对而言使用 `transform` 实现的动画效果肯定比 `left` 这些更加流畅。

     而且就算抛开这一角度，在另一方面浏览器也会针对 `transform` 等开启 `GPU` 加速。

3. 使用文件压缩

   通过将写好的 css 进行打包压缩，可以减少很多的体积，提高加载速度。

4. 去除无用 CSS

   - 去除空规则：`｛｝`。空规则的产生原因一般来说是为了预留样式。去除这些空规则无疑能减少 css 文档体积。

   - 重复使用的样式进行公共 CSS 的提取。

5. 正确的使用选择器

   css 选择器的匹配是`从右向左`进行的，这一策略导致来不同种类的选择器之间的性能也存在差异。

   - `减少使用后代选择器`：选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分），当使用后代选择器的时候，浏览器会遍历所有子元素来确定是否是指定的元素等等。

   - `避免使用通配规则`：如`*{}`计算次数惊人！只对需要用到的元素进行选择。

   - `避免使用ID选择器`：如果规则拥有 `ID选择器` 作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹配它们了）。但是实际中尽量不要使用`ID选择器`，因为其权重较高。

   - `减少对可继承属性的书写`：了解哪些属性是可以通过继承而来的，然后避免对这些属性重复指定规则。

   - `避免过深的嵌套选择器`：选择器的合理层级不要超过三层。

6. 优化 CSS 书写

   - 属性值为 `0` 时，不加单位。

   - 属性值为浮动小数 `0.**`，可以省略小数点之前的 0。

   - 标准化各种浏览器前缀：带浏览器前缀的在前。标准属性在后。

   - 正确使用 `display` 的属性，由于 `display` 的作用，某些样式组合会无效，徒增样式体积的同时也影响解析性能。

   - 不滥用 `web` 字体。对于中文网站来说 `WebFonts` 可能很陌生，国外却很流行。`webfonts` 通常体积庞大，而且一些浏览器在下载 `webFonts` 时会阻塞页面渲染损伤性能。

## 23. hash 路由模式和 history 路由模式有什么区别？

### hash 模式

`hash` 模式我们应该不陌生，比如在用超链接制作锚点跳转的时候，就会发现，`url` 后面跟了`#id`，`hash` 值就是 `url` 中从`#号`开始到结束的部分。

在使用 `hash` 模式的时候还需要注意以下几个点:

1. `hash`也称为`散列值`或者`锚点`，本身是用来做页面跳转定位的。如 `http://localhost/index.html#abc`，这里的`#abc`就是 `hash`；

2. `hash` 值是不会随请求发送到服务器端的，所以改变 `hash`，不会重新加载页面；

3. 监听 `window` 的 `hashchange` 事件，当散列值改变时，可以通过 `location.hash` 来获取和设置 `hash`值；

4. `location.hash` 值的变化会直接反应到浏览器地址栏；

```js
class Router {
  constructor() {
    this.routers = []; // 存放我们的路由配置
  }

  add(route, callback) {
    this.routers.push({
      path: route,
      render: callback,
    });
  }

  listen(callback) {
    window.onhashchange = this.hashChange(callback);
    this.hashChange(callback)(); // 首次进入页面的时候不会触发hashchange，因此单独调用一下
  }

  hashChange(callback) {
    let self = this;
    return function () {
      let hash = location.hash;

      for (let i = 0; i < self.routers.length; i++) {
        let route = self.routers[i];
        if (hash === route.path) {
          callback(route.render());
          return;
        }
      }
    };
  }
}

let router = new Router();

router.add('#index', () => {
  return '<h1>这是首页内容</h1>';
});

router.add('#news', () => {
  return '<h1>这是新闻内容</h1>';
});

router.add('#user', () => {
  return '<h1>这是个人中心内容</h1>';
});

router.listen((renderHtml) => {
  let app = document.getElementById('app');
  app.innerHTML = renderHtml;
});
```

### history 模式

`history` 模式基于 `window.history` 对象的方法，它表示当前窗口的浏览历史。当发生改变时，只会改变页面的路径，不会刷新页面。

`History` 对象保存了当前窗口访问过的所有页面网址。通过 `history.length` 可以得出当前窗口一共访问过几个网址。

浏览器工具栏的前进和后退按钮，其实就是对 `History` 对象进行操作。

- 属性

  History 对象主要有两个属性。

  1. History.length：当前窗口访问过的网址数量（包括当前网页）
  2. History.state：History 堆栈最上层的状态值

  ```js
  // 当前窗口访问过多少个网页
  history.length; // 1

  // History 对象的当前状态
  // 通常是 undefined，即未设置
  history.state; // undefined
  ```

- 方法

  History 对象主要有以下几个方法:

  1. History.back()
  2. History.forward()
  3. History.go()

  这三个方法都是用来控制页面在历史记录间跳转。

- History.back()

  回退到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效果。

- History.forward()

  前进到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效果。

- History.go()

  接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为 0，相当于刷新当前页面。

  ```js
  history.back();
  history.forward();
  history.go(1); //相当于history.forward()
  history.go(-1); //相当于history.back()
  history.go(0); // 刷新当前页面
  ```

在 `HTML5` 中，`window.history` 对象得到了扩展，新增的 `API` 包括：

- history.pushState(data[,title][,url]);

- history.replaceState(data[,title][,url]);

- history.state;

- window.onpopstate;

#### history.pushState(data[,title][,url])

向历史记录中追加一条记录。`pushState()` 方法不会触发页面刷新，只是导致 `History` 对象发生变化，地址栏会有变化。

该方法接受三个参数，依次为：

- `data`：是一个对象，通过 `pushState` 方法可以将该对象内容传递到新页面中。如果不需要这个对象，此处可以填 `null`。

- `title`：指标题，几乎没有浏览器支持该参数，传一个空字符串比较安全。

- `url`：新的网址，必须与当前页面处在同一个域。不指定的话则为当前的路径，如果设置了一个跨域网址，则会报错。

```js
var data = { foo: 'bar' };
history.pushState(data, '', '2.html');
console.log(history.state); // {foo: "bar"}
```

#### history.replaceState()

替换当前页在历史记录中的信息，用法与 `pushState()` 方法一样。

```js
history.pushState({ page: 1 }, '', '?page=1');
// URL 显示为 http://example.com/example.html?page=1

history.pushState({ page: 2 }, '', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({ page: 3 }, '', '?page=3');
// URL 显示为 http://example.com/example.html?page=3

history.back();
// URL 显示为 http://example.com/example.html?page=1

history.back();
// URL 显示为 http://example.com/example.html

history.go(2);
// URL 显示为 http://example.com/example.html?page=3
```

#### history.state

我们可以通过该属性，得到当前页的 `state` 信息。

#### window.onpopstate 事件

每当 `history` 对象出现变化时，就会触发 `popstate` 事件。

- 仅仅调用 `pushState()` 方法或 `replaceState()` 方法 ，并不会触发该事件;
- 只有当用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用 `history.back()`、`history.forward()`、`history.go()`方法时才会触发。
- 另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。
- 页面第一次加载的时候，浏览器不会触发 `popstate` 事件。

在使用的时候，监听函数中可传入一个 `event` 对象，`event.state` 即为通过 `pushState()` 或 `replaceState()` 方法传入的 `data` 参数:

```js
window.addEventListener('popstate', function (e) {
  // e.state 相当于 history.state
  console.log('state: ' + JSON.stringify(e.state));
  console.log(history.state);
});
```

`history` 模式原理可以这样理解，首先我们要改造我们的超链接，给每个超链接增加 `onclick` 方法，阻止默认的超链接跳转，改用 `history.pushState` 或 `history.replaceState` 来更改浏览器中的 `url`，并修改页面内容。

由于通过 `history` 的 `api` 调整，并不会向后端发起请求，所以也就达到了前端路由的目的。

如果用户使用浏览器的前进后退按钮，则会触发 `window.onpopstate` 事件，监听页面根据路由地址修改页面内容。

```js
class Router {
  constructor() {
    this.routers = [];
    this.renderCallback = null;
  }

  add(route, callback) {
    this.routers.push({
      path: route,
      render: callback,
    });
  }

  pushState(path, data = {}) {
    window.history.pushState(data, '', path);
    this.renderHtml(path);
  }

  listen(callback) {
    this.renderCallback = callback;
    this.changeA();
    window.onpopstate = () => this.renderHtml(this.getCurrentPath());
    this.renderHtml(this.getCurrentPath());
  }

  changeA() {
    document.addEventListener('click', (e) => {
      if (e.target.nodeName === 'A') {
        e.preventDefault();
        let path = e.target.getAttribute('href');
        this.pushState(path);
      }
    });
  }

  getCurrentPath() {
    return location.pathname;
  }

  renderHtml(path) {
    for (let i = 0; i < this.routers.length; i++) {
      let route = this.routers[i];
      if (path === route.path) {
        this.renderCallback(route.render());
        return;
      }
    }
  }
}

let router = new Router();

router.add('/index', () => {
  return '<h1>这是首页内容</h1>';
});

router.add('/news', () => {
  return '<h1>这是新闻内容</h1>';
});

router.add('/user', () => {
  return '<h1>这是个人中心内容</h1>';
});

router.listen((renderHtml) => {
  let app = document.getElementById('app');
  app.innerHTML = renderHtml;
});
```

### 两者之间的区别

1. hash 模式不够优雅，链接上会带#，history 模式较优雅。
2. pushState 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改#后面的部分，故只可设置与当前同文档的 URL。
3. pushState 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发记录添加到栈中。
4. pushState 通过 stateObject 可以添加任意类型的数据到记录中；而 hash 只可添加短字符串。
5. pushState 可额外设置 title 属性供后续使用。
6. hash 兼容 IE8 以上，history 兼容 IE10 以上。
7. history 模式需要后端配合将所有访问都指向 index.html，否则用户刷新页面，会导致 404 错误。

## 24. 什么是 DOM？

DOM 是 `Document Object Model`（文档对象模型）的缩写。

提供了对 HTML 文档结构化的表述。在`渲染引擎`中，DOM 有三个层面的作用:

1. 从页面的视角来看，DOM 是生成页面的基础数据结构。
2. 从 JavaScript 脚本视角来看，DOM 提供给 JavaScript 脚本操作的接口，通过这套接口，JavaScript 可以对 DOM 结构进行访问，从而改变文档的结构、样式和内容。
3. 从安全视角来看，DOM 是一道安全防护线，一些不安全的内容在 DOM 解析阶段就被拒之门外了。

**简言之，DOM 是表述 HTML 的内部数据结构，它会将 Web 页面和 JavaScript 脚本连接起来，并过滤一些不安全的内容。**

### DOM 树如何生成？

在`渲染引擎`内部，有一个叫 `HTML 解析器（HTMLParser）`的模块，它的职责就是负责将 `HTML` 字节流转换为 `DOM` 结构。

**其中 HTML 解析器并不是等整个文档加载完成之后再解析的，而是网络进程加载了多少数据，HTML 解析器便解析多少数据。**

当网络进程接收到响应头之后，会根据响应头中的 `content-type` 字段来判断文件的类型，比如 `content-type` 的值是`text/html`，那么浏览器就会判断这是一个 `HTML` 类型的文件，然后为该请求选择或者创建一个渲染进程。

渲染进程准备好之后，网络进程和渲染进程之间会建立一个共享数据的管道，网络进程接收到数据后就往这个管道里面放，而渲染进程则从管道的另外一端不断地读取数据，并同时将读取的数据“喂”给 HTML 解析器。

我们可以把这个管道想象成一个“水管”，网络进程接收到的字节流像水一样倒进这个“水管”，而“水管”的另外一端是渲染进程的 HTML 解析器，它会动态接收字节流，并将其解析为 DOM。

#### 具体的流程我们可以参考下图

![字节流转化过程](https://img-blog.csdnimg.cn/20210623223339187.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- 第一个阶段，通过`分词器`将字节流转换为 `Token`:

  V8 引擎 编译 `JavaScript` 过程中的第一步是做`词法分析`，将 `JavaScript` 先分解为一个个 `Token`。解析 `HTML` 也是一样的，需要通过`分词器`先将`字节流`转换为一个个 `Token`，分为 `Tag Token` 和`文本 Token`。

  上述 HTML 代码通过词法分析生成的 Token 如下所示：

  ![生成token示意图](https://img-blog.csdnimg.cn/20210623223635122.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

  由图可以看出，`Tag Token` 又分 `StartTag` 和 `EndTag`，比如蓝色部分是`StartTag`，红色部分是`EndTag`，而文本对应中间的绿色模块。

- 后续的第二个和第三个阶段是同步进行的，需要将 `Token` 解析为 `DOM` 节点，并将 `DOM` 节点添加到 `DOM` 树中:

  `HTML 解析器`维护了一个 `Token 栈结构`，该 `Token 栈`主要用来计算节点之间的父子关系，在第一个阶段中生成的 `Token` 会被按照顺序压到这个栈中。具体的处理规则如下所示：

  - 如果压入到栈中的是 `StartTag Token`，`HTML 解析器`会为该 `Token` 创建一个 `DOM` 节点，然后将该节点加入到 `DOM 树`中，它的父节点就是栈中相邻的那个元素生成的节点。

  - 如果分词器解析出来是`文本 Token`，那么会生成一个`文本节点`，然后将该节点加入到 `DOM 树`中，`文本 Token` 是不需要压入到栈中，它的父节点就是当前`栈顶 Token` 所对应的 `DOM 节点`。

  - 如果分词器解析出来的是 `EndTag 标签`，比如是 `EndTag div`，`HTML 解析器`会查看 `Token 栈顶`的元素是否是 `StarTag div`，如果是，就将 `StartTag div` 从栈中弹出，表示该 `div` 元素解析完成。

    通过分词器产生的新 `Token` 就这样不停地`压栈`和`出栈`，整个解析过程就这样一直持续下去，直到分词器将所有字节流分词完成。

### JavaScript 是如何影响 DOM 生成的？

假设有下面这段代码:

```html
<html>
  <body>
    <div>1</div>
    <script>
      let div1 = document.getElementsByTagName('div')[0];
      div1.innerText = 'hello';
    </script>
    <div>test</div>
  </body>
</html>
```

在两段 div 中间插入了一段 `JavaScript` 脚本，这段脚本的解析过程就有点不一样了。

`script` 标签之前，所有的解析流程还是和之前介绍的一样，但是解析到 `script` 标签时，渲染引擎判断这是一段脚本，此时 `HTML` 解析器就会暂停 `DOM` 的解析，因为接下来的 `JavaScript` 可能要修改当前已经生成的 `DOM` 结构。

这时候 HTML 解析器暂停工作，`JavaScript` 引擎介入，并执行 `script` 标签中的这段脚本，因为这段 `JavaScript` 脚本修改了 DOM 中第一个 div 中的内容，所以执行这段脚本之后，div 节点内容已经修改为 `hello` 了。

脚本执行完成之后，HTML 解析器恢复解析过程，继续解析后续的内容，直至生成最终的 DOM。

另外，如果 `JavaScript` 文件中没有操作 DOM 相关代码，就可以将该 `JavaScript` 脚本设置为`异步加载`，通过 `async` 或 `defer` 来标记代码，使用方式如下所示：

```js
<script async type="text/javascript" src='foo.js'></script>

<script defer type="text/javascript" src='foo.js'></script>
```

`async` 和 `defer` 虽然都是`异步`的，不过还有一些差异，使用 `async` 标志的脚本文件一旦加载完成，会`立即执行`；而使用了 `defer` 标记的脚本文件，需要在 `DOMContentLoaded 事件`之前执行。

额外说明一下，`渲染引擎`还有一个安全检查模块叫 `XSSAuditor`，是用来检测词法安全的。在`分词器`解析出来 `Token` 之后，它会检测这些模块是否安全，比如是否引用了`外部脚本`，是否符合 CSP 规范，是否存在跨站点请求等。如果出现不符合规范的内容，`XSSAuditor` 会对该脚本或者下载任务进行拦截。

## 25. 说一说浏览器缓存?

浏览器的缓存机制也就是我们说的 HTTP 缓存机制，其机制是根据 HTTP 报文的缓存标识进行的。

浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识。

浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中。

### 强缓存和协商缓存是什么?

浏览器中的缓存主要分为`强缓存`和`协商缓存`。

1. 浏览器进行资源请求时，会判断 `responese header` 是否命中强缓存，如果命中，直接从本地读取缓存，不会发送请求到服务器。

2. 如果未命中强缓存，会发送请求到服务器，判断`协商缓存`是否命中，如果命中的话，服务器会将请求返回(304),但是不会返回资源，告诉浏览器直接从本地读取缓存。如果不命中，服务器会直接返回资源。

**对于前端浏览器环境来说，缓存读取位置是由先后顺序的，顺序分别是（由上到下寻找，找到即返回；找不到则继续）。**

1. Service Worker

   `Service Worker` 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

   - 浏览器优先查找。
   - 持久存储。
   - 可以更加灵活地控制存储的内容，可以选择缓存哪些文件、定义缓存文件的路由匹配规则等。
   - 可以从 Chrome 的 F12 中，`Application` -> `Cache Storage` 查看。

2. Memory Cache

   `memory cache` 是内存中的缓存存储。

   - 读取速度快。
   - 存储空间较小。
   - 存储时间短，当浏览器的 tab 页被关闭，内存资源即被释放。
   - 如果明确指定了 `Cache-Control` 为 `no-store`，浏览器则不会使用 `memory-cache`。

3. Disk Cache

   `Disk Cache` 是硬盘中的缓存存储。

   - 读取速度慢于 `Memory Cache` ，快于网络请求。
   - 存储空间较大。
   - 持久存储。
   - `Disk Cache` 严格依照 `HTTP` 头信息中的字段来判断资源是否可缓存、是否要认证等。

   经常听到的`强缓存`，`协商缓存`，以及 `Cache-Control` 等，归于此类。

4. 网络请求

   如果一个请求的资源文件均未命中上述缓存策略，那么就会发起网络请求。浏览器拿到资源后，会把这个新资源加入缓存。

### Cache-Control 有哪些类型?

`HTTP/1.1` 定义的 `Cache-Control` 头用来区分对缓存机制的支持情况， 请求头和响应头都支持这个属性。通过它提供的不同的值来定义缓存策略。需要注意的是，数据变化频率很快的场景并不适合开启 `Cache-Control`。

以下是 `Cache-Control` 常用字段的解释:

| 字段             | 说明                                                                                                                                                                                                       |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| public           | 公共缓存：表示该响应可以被任何中间人（比如中间代理、CDN 等）缓存。                                                                                                                                         |
| private          | 私有缓存：表示该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中。                                                                                                         |
| max-age          | （单位/秒）设置缓存的过期时间，过期需要重新请求，否则就读取本地缓存，并不实际发送请求                                                                                                                      |
| s-maxage         | （单位/秒）覆盖 `max-age`，作用一样，只在代理服务器中生效                                                                                                                                                  |
| max-stale        | （单位/秒）表示即使缓存过期，也使用这个过期缓存                                                                                                                                                            |
| no-store         | 禁止进行缓存                                                                                                                                                                                               |
| no-transform     | 不得对资源进行转换或压缩等操作，`Content-Encoding`、`Content-Range`、`Content-Type` 等 `HTTP` 头不能由代理修改（有时候资源比较大的情况下，代理服务器可能会自行做压缩处理，这个指令就是为了防止这种情况）。 |
| no-cache         | 强制确认缓存：即每次使用本地缓存之前，需要请求服务器，查看缓存是否失效，若未过期（注：实际就是返回 304），则缓存才使用本地缓存副本。                                                                       |
| must-revalidate  | 缓存验证确认：意味着缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用                                                                                                             |
| proxy-revalidate | 与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。                                                                                                                          |

### 总结

`强缓存`优先于`协商缓存`进行，若 `强缓存(Expires 和 Cache-Control)` 生效则直接使用缓存，若不生效则进行`协商缓存(Last-Modified / If-Modified-Since 和 Etag / If-None-Match)`。

`协商缓存`由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回 `304`，继续使用缓存，主要过程总结如下：

![缓存总结](https://img-blog.csdnimg.cn/20210624171731113.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 26. 说说从输入网址到页面展现的整个过程？

整体的流程图，大致如下所示:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210625093347702.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

整体的步骤总结如下:

1. 首先，用户从浏览器进程里输入请求信息；
2. 然后，网络进程发起 URL 请求；
3. 服务器响应 URL 请求之后，浏览器进程就又要开始准备渲染进程了；
4. 渲染进程准备好之后，需要先向渲染进程提交页面数据，我们称之为提交文档阶段；
5. 渲染进程接收完文档信息之后，便开始解析页面和加载子资源，完成页面的渲染。

详细的步骤如下:

### 1. 处理用户输入

当我们在地址栏中输入一个查询关键字时，地址栏会判断输入的关键字是`搜索内容`，还是`请求的URL`。

- 如果是`搜索内容`，地址栏会使用浏览器默认的`搜索引擎`，来合成新的带搜索关键字的 URL。
- 如果判断输入内容符合 URL 规则，比如输入的是 `baidu.com`，那么地址栏会根据规则，把这段内容加上协议，合成为完整的 URL，如 `https://www.baidu.com`。

### 2. 开始导航

按下回车后，`UI thread` 将关键词搜索对应的 `URL` 或输入的 `URL` 交给`网络线程 Network thread`(它们的通信是通过 IPC 进行的)，此时 `UI 线程`使 `Tab` 前的图标展示为`加载中`状态，然后`网络进程`进行一系列诸如 `DNS` 寻址，建立 `TLS` 连接等操作进行资源请求，如果收到服务器的 `301` 重定向响应，它就会告知 `UI 线程`进行重定向然后它会再次发起一个新的网络请求。

这里详细展开的话大致如下:

1. 首先，网络进程会查找本地缓存是否缓存了该资源。如果有缓存资源，那么直接返回资源给浏览器进程；如果在缓存中没有查找到资源，那么直接进入网络请求流程。(这里的流程就涉及到之前的浏览器强缓存和协商缓存)。

2. 请求前的第一步是要进行 DNS 解析，以获取请求域名的服务器 IP 地址。如果请求协议是 HTTPS，那么还需要建立 TLS 连接。

3. 接下来就是利用 IP 地址和服务器建立 TCP 连接。连接建立之后，浏览器端会构建请求行、请求头等信息，并把和该域名相关的 Cookie 等数据附加到请求头中，然后向服务器发送构建的请求信息。

### 3. 处理响应结果

服务器接收到请求信息后，会根据请求信息生成响应数据（包括`响应行`、`响应头`和`响应体`等信息），并发给`网络进程`。等`网络进程`接收了`响应行`和`响应头`之后，就开始解析响应头的内容了。

在接收到服务器返回的响应头后，网络进程开始解析响应头，如果发现返回的状态码是 `301` 或者 `302`，那么说明服务器需要浏览器重定向到其他 URL。这时网络进程会从响应头的 `Location` 字段里面读取`重定向的地址`，然后再发起新的 `HTTP` 或者 `HTTPS` 请求，一切又重头开始了。

在处理了跳转信息之后，我们继续导航流程的分析。URL 请求的数据类型，有时候是一个下载类型，有时候是正常的 HTML 页面，那么浏览器是如何区分它们呢？

答案是 `Content-Type`。`Content-Type` 是 `HTTP` 头中一个非常重要的字段， 它告诉浏览器服务器返回的响应体数据是什么类型，然后浏览器会根据 `Content-Type` 的值来决定如何显示响应体的内容。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '需要注意的是，如果服务器配置`Content-Type`不正确，比如将`text/html`类型配置成`application/octet-stream`类型，那么浏览器可能会曲解文件内容，比如会将一个本来是用来展示的页面，变成了一个下载文件。\n\n所以，不同`Content-Type`的后续处理流程也截然不同。如果`Content-Type`字段的值被浏览器判断为下载类型，那么该请求会被提交给浏览器的`下载管理器`，同时该URL请求的导航流程就此结束。但如果是`HTML`，那么浏览器则会继续进行导航流程。';

export default () => <Info type="warning" txt={txt} />;
```

与此同时，浏览器会进行 `Safe Browsing 安全检查`，如果域名或者请求内容匹配到已知的恶意站点，`network thread`会展示一个警告页。除此之外，`网络线程`还会做 `CORB（Cross Origin Read Blocking）`检查来确定那些敏感的跨站数据不会被发送至渲染进程。

### 4.准备渲染进程

各种检查完毕以后，`network thread` 确信浏览器可以导航到请求网页，`network thread` 会通知 `UI thread` 数据已经准备好，`UI thread` 会查找到一个 `renderer process(渲染进程)` 进行网页的渲染。

Chrome 的页面渲染是运行在渲染进程中的，默认情况下，Chrome 会为每个页面分配一个渲染进程，也就是说，每打开一个新页面就会配套创建一个新的渲染进程。但是，也有一些例外，在某些情况下，浏览器会让多个页面直接运行在同一个渲染进程中。

渲染进程准备好之后，还不能立即进入文档解析状态，因为此时的文档数据还在网络进程中，并没有提交给渲染进程，所以下一步就进入了提交文档。

### 5. 提交文档阶段

这里的`文档`是指 `URL 请求的响应体数据`。

到了这一步，数据和渲染进程都准备好了，`Browser Process` 会向 `Renderer Process` 发送 `IPC` 消息来确认导航，此时，浏览器进程将准备好的数据发送给渲染进程，渲染进程接收到数据之后，又发送 IPC 消息给浏览器进程，告诉浏览器进程导航已经提交了，页面开始加载。

浏览器进程在收到`确认提交`的消息后，会更新浏览器界面状态，包括了`安全状态（地址前面的小锁）`、`地址栏的 URL`、`前进后退的历史状态(访问历史列表（history tab）)`，并更新 Web 页面。我们可以通过前进后退来切换该页面。

### 6. 正式渲染阶段

当导航提交完成后，`渲染进程`开始加载资源及渲染页面，当页面渲染完成后（页面及内部的 `iframe` 都触发了 `onload` 事件），会向浏览器进程发送 `IPC` 消息，告知浏览器进程，这个时候 `UI thread` 会停止展示 `tab` 中的加载中图标。

至此，一个完整的页面就生成了。

接下来阐述渲染阶段完成的事情。

渲染进程负责 tab 内的所有事情，核心目的就是将 `HTML/CSS/JS` 代码，转化为用户可进行交互的 `web` 页面。

渲染进程中，主要包含下面线程：

- 一个主线程（main thread）
- 多个工作线程（work thread）
- 一个合成器线程（compositor thread）
- 多个光栅化线程（raster thread）

#### 6.1 构建 DOM

渲染进程接受到导航的确认信息后，开始接受来自浏览器进程的数据，这个时候，主线程会解析数据转化为 `DOM（Document Object Model）`对象。

#### 6.2 子资源加载

在构建 `DOM` 的过程中，会解析到`图片`、`CSS`、`JavaScript` 脚本等资源，这些资源是需要从网络或者缓存中获取的，主线程在构建 `DOM` 过程中如果遇到了这些资源，逐一发起请求去获取，而为了提升效率，浏览器也会运行`预加载扫描（preload scanner）`程序。

如果 `HTML` 中存在 `img`、`link` 等标签，`预加载扫描程序`会把这些请求传递给 `Browser Process` 的 `network thread` 进行资源下载。

#### 6.3 JavaScript 的下载与执行

构建 DOM 过程中，如果遇到`<script>`标签，渲染引擎会停止对 `HTML` 的解析，而去加载执行 `JS` 代码，原因在于 JS 代码可能会改变 DOM 的结构（比如执行 `document.write()`等 API）。

不过开发者其实也有多种方式来告知浏览器应对如何应对某个资源，比如说如果在`<script>`标签上添加了 `async` 或 `defer`等属性，浏览器会异步的加载和执行 JS 代码，而不会阻塞渲染。

#### 6.4 样式计算 - Style calculation

DOM 树只是我们页面的结构，我们要知道页面长什么样子，我们还需要知道 DOM 的每一个节点的样式。主线程在解析页面时，遇到`<style>`标签或者`<link>`标签的 `CSS 资源`，会加载 CSS 代码，根据 CSS 代码确定每个 DOM 节点的`计算样式（computed style）`。

计算样式是主线程根据 `CSS 样式选择器（CSS selectors）`计算出的每个 DOM 元素应该具备的具体样式，**需要注意的是即使你的页面没有设置任何自定义的样式，浏览器也会提供其默认的样式**。

#### 6.5 布局 - Layout

DOM 树和计算样式完成后，我们还需要知道每一个节点在页面上的位置，`布局（Layout）`其实就是找到所有元素的几何关系的过程。

主线程会遍历 DOM 及相关元素的计算样式，构建出包含每个元素的页面坐标信息及盒子模型大小的布局树`（Render Tree）`，遍历过程中，会跳过隐藏的元素`（display: none）`，另外，伪元素虽然在 DOM 上不可见，但是在布局树上是可见的。

#### 6.6 绘制 - Paint

布局 `layout` 之后，我们知道了不同元素的结构，样式，几何关系，我们要绘制出一个页面，我们要需要知道每个元素的绘制先后顺序，在绘制阶段，主线程会遍历`布局树（layout tree）`，生成一系列的`绘画记录（paint records）`。绘画记录可以看做是记录各元素绘制先后顺序的笔记。

#### 6.7 合成 - Compositing

文档结构、元素的样式、元素的几何关系、绘画顺序，这些信息我们都有了，这个时候如果要绘制一个页面，我们需要做的是把这些信息转化为显示器中的像素，这个转化的过程，叫做`光栅化（rasterizing）`。

#### 6.8 进行事件的处理

当页面渲染完毕以后，TAB 内已经显示出了可交互的 WEB 页面，用户可以进行移动鼠标、点击页面等操作了。

#### 6.9 渲染进程中合成器线程接收事件

`合成器线程`可以独立于`主线程`之外通过已`光栅化`的层创建组合帧，例如`页面滚动`，如果没有对页面滚动绑定相关的事件，`合成器线程`可以独立于主线程创建组合帧，如果页面绑定了页面滚动事件，合成器线程会等待主线程进行事件处理后才会创建组合帧。

#### 6.10 查找事件的目标对象（event target）

当`合成器线程`接收到事件信息，判定到事件发生不在非快速滚动区域后，合成器线程会向`主线程`发送这个时间信息，主线程获取到事件信息的第一件事就是通过`命中测试（hit test）`去找到事件的目标对象。

具体的`命中测试流程`是遍历在绘制阶段生成的`绘画记录（paint records）`来找到包含了事件发生坐标上的元素对象。

### 总结

浏览器的多进程架构，根据不同的功能划分了不同的进程，进程内根据不同的使命划分了不同的线程。

1. 用户输入 url 并回车
2. 浏览器进程检查 url，组装协议，构成完整的 url
3. 浏览器进程通过进程间通信（IPC）把 url 请求发送给网络进程
4. 网络进程接收到 url 请求后检查本地缓存是否缓存了该请求资源，如果有则将该资源返回给浏览器进程
   - **如果没有，网络进程向 web 服务器发起 http 请求（网络请求），请求流程如下：**
     - 进行 DNS 解析，获取服务器 ip 地址，端口
     - 利用 ip 地址和服务器建立 tcp 连接
     - 构建请求头信息
     - 发送请求头信息
     - 服务器响应后，网络进程接收响应头和响应信息，并解析响应内容
   - **网络进程解析响应流程：**
     - 检查状态码，如果是 301/302，则需要重定向，从 Location 自动中读取地址，重新进行第 4 步 ，如果是 200，则继续处理请求。
     - 200 响应处理：检查响应类型 Content-Type，如果是字节流类型，则将该请求提交给下载管理器，该导航流程结束，不再进行后续的渲染，如果是 html 则通知浏览器进程准备渲染进程准备进行渲染。
   - **准备渲染进程：**
     - 浏览器进程检查当前 url 是否和之前打开的渲染进程根域名是否相同，如果相同，则复用原来的进程，如果不同，则开启新的渲染进程
   - **传输数据、更新状态：**
     - 渲染进程准备好后，浏览器向渲染进程发起“提交文档”的消息，渲染进程接收到消息和网络进程建立传输数据的“管道”
     - 渲染进程接收完数据后，向浏览器发送“确认提交”
     - 浏览器进程接收到确认消息后更新浏览器界面状态：安全、地址栏 url、前进后退的历史状态、更新 web 页面
5. 构建 DOM 树
6. 子资源加载
7. JavaScript 的下载与执行
8. 样式计算 - Style calculation
9. 布局 - Layout
10. 绘制 - Paint
11. 合成 - Compositing
12. 注册事件处理

## 27. 你在你的项目中做过哪些性能优化?

主要从以下几个角度来描述:

### 缓存

1. 通过 localStorage、sessionStorage、indexedDB 等缓存具体一定时效性的数据。

   比如，针对日榜，周榜等更新数据频率固定的列表数据可以考虑放入到本地存储中。

2. 浏览器自身通过内存缓存(Memory Cache)

   一些图片资源等可以走这个缓存。

3. Cache API

   例如使用 Service Worker 拦截请求。

   ```js
   // sw.js
   self.addEventListener('fetch', function (e) {
     // 如果有cache则直接返回，否则通过fetch请求
     e.respondWith(
       caches
         .match(e.request)
         .then(function (cache) {
           return cache || fetch(e.request);
         })
         .catch(function (err) {
           console.log(err);
           return fetch(e.request);
         }),
     );
   });
   ```

4. 走 HTTP 缓存

5. Push Cache

   Push Cache 其实是 HTTP/2 的 Push 功能所带来的。

### 请求

1. 避免多余的重定向。

   该使用 301 的场景就用 301，需要 302 的就用 302。

2. DNS 的预解析

   比如我们要加载另外一个网站下的 CSS 样式表就可以通过 dns-prefetch 去预解析 IP。

   ```html
   <link rel="dns-prefetch" href="//yourwebsite.com" />
   ```

3. 使用 Preconnect 预先建立连接

   建立连接不仅需要 DNS 查询，还需要进行 TCP 协议握手，有些还会有 TLS/SSL 协议，这些都会导致连接的耗时。

   使用 Preconnect 可以帮助我们告诉浏览器：“我有一些资源会用到某个源（origin），你可以帮我预先建立连接。”

   大致流程如下:

   - 首先，解析 Preconnect 的 url；
   - 其次，根据当前 link 元素中的属性进行 cors 的设置；
   - 然后，默认先将 credential 设为 true，如果 cors 为 Anonymous 并且存在跨域，则将 credential 置为 false；
   - 最后，进行连接。

   ```html
   <link rel="preconnect" href="//sample.com" />
   <!-- 设置cors -->
   <link rel="preconnect" href="//sample.com" crossorigin />
   ```

4. 使用 CDN

   对于静态资源，我们可以考虑通过 CDN 来降低时延。

   对于使用 CDN 的资源，DNS 解析会将 CDN 资源的域名解析到 CDN 服务的负载均衡器上，负载均衡器可以通过请求的信息获取用户对应的地理区域，从而通过负载均衡算法，在背后的诸多服务器中，综合选择一台地理位置近、负载低的机器来提供服务。例如为北京联通用户解析北京的服务器 IP。这样，用户在之后访问 CDN 资源时都是访问北京服务器，距离近，速度快。

5. BFF 聚合

   BFF 非常合适做的一件事就是后端服务的聚合。

   如果你有一个两个接口服务：第一个服务是先获取产品信息，再根据产品信息中的上架时间通过第二个服务获取该时间后的产品列表。

   这个业务逻辑如果放在前端（浏览器）处理将会串行发送两个请求。假设每个请求 200ms，那么就需要等待 400ms。

   如果引入 NodeJS，这一层可以放在 NodeJS 中实现。NodeJS 部署的位置一般离其他后端服务“更近”，例如同一个局域网。这类服务间的请求耗时显然更低，可能只需要 200(浏览器) + 30(NodeJS) \* 2 = 260ms。

   此外，如果一个业务需要在前端并发三、四个请求来获取完整数据，那么放在 NodeJS 的 BFF 层也是一个不错的选择。

### 页面解析与处理

1. CSS 放置于 head 中，js 放置于 body 之后。

   根据标准规范，在 JavaScript 中可以访问 DOM。因此当遇到 JavaScript 后会阻塞 DOM 的解析。于此同时，为避免 CSS 与 JavaScript 之间的竞态，CSSOM 的构建会阻塞 JavaScript 的脚本执行。

   **总结来说就是: JavaScript 会阻塞 DOM 构建，而 CSSOM 的构建又会阻塞 JavaScript 的执行。**

   这就是为什么在优化的最佳实践中，我们基本都推荐把 `CSS` 样式表放在 `<head>` 之中（即页面的头部），把 `JavaScript` 脚本放在 `<body>` 的最后（即页面的尾部）。

2. 使用 defer 和 async

   某些不影响主流程的脚本可以使用 defer 和 async 进行异步加载。

3. 页面文档压缩

   例如使用 uglify 压缩 HTML 内容，使用 gzip 对文本进行压缩。

### javascript 优化

1. 代码拆分（code split）与按需加载

   - code split 一般是配合打包工具去做，比如 webpack。

     在日常使用时，最常见的方式就是通过 `dynamic import` 来告诉 `webpack` 去做代码拆分。`webpack` 编译时会进行语法分析，之后遇到 `dynamic import` 就会认为这个模块是需要动态加载的。相应的，其子资源也会被如此处理（除非被其他非动态模块也引用了）。

     在 webpack 中使用代码拆分最常见的一个场景是基于路由的代码拆分。目前很多前端应用都在使用 SPA（单页面应用）形式，或者 SPA 与 MPA（多页面应用）的结合体，这就会涉及到前端路由。而页面间的业务差异也让基于路由的代码拆分成为一个最佳实践。

   - 按需加载一般是某些场景下去动态加载一些脚本等资源。

     ```js
     document.getElementById('btn').addEventListener('click', (e) => {
       // 在这里加载 chat 组件相关资源 chat.js
       const script = document.createElement('script');
       script.src = '/static/js/chat.js';
       document.getElementsByTagName('head')[0].appendChild(script);
     });
     ```

2. 代码压缩

   JavaScript 代码压缩比较常见的做法就是使用 `UglifyJS` 做源码级别的压缩。它会通过将变量替换为短命名、去掉多余的换行符等方式，在尽量不改变源码逻辑的情况下，做到代码体积的压缩。

   在 webpack 的 `production` 模式下是默认开启的；

3. 相应数据进行 gzip

   一般服务器都会内置相应模块来进行 gzip 处理，不需要我们单独编写压缩算法模块。例如在 Nginx 中就包含了 `ngx_http_gzip_module` 模块，通过简单的配置就可以开启。

4. Tree Shaking

   通过打包工具内部将模块中未使用到的代码进行删除。

5. 优化 polyfill 的使用

   例如使用 `Differential Serving` 的技术，通过浏览器原生模块化 API 来尽量避免加载无用 `polyfill`。

   ```js
   <script type="module" src="main.mjs"></script>
   <script nomodule src="legacy.js"></script>
   ```

   这样，在能够处理 module 属性的浏览器（具有很多新特性）上就只需加载 main.mjs（不包含 polyfill），而在老式浏览器下，则会加载 legacy.js（包含 polyfill）。

6. 通过 webpack-bundle-analyzer 分析报体积减少不必要的代码。

7. 避免 Long Task

8. 将基础库代码打包合并

   比如 webpack 中常用的将 React、Redux 这些基础库单独打包出一个文件。

### CSS 优化

1. 关键 CSS

   例如使用骨架屏来生成一个不包含实际功能的静态页面，将必要的脚本、样式、甚至图片（base64）资源都内联到其中，当用户访问时直接先返回该页面，就可以很快让用户看到页面结果，之后在异步渐进加载预渲染，就会让用户感觉“很快”。

2. CSS 的按需加载

3. 合并 CSS 文件

4. 慎用 @import

   使用`@import` 语法来加载外部的样式文件把请求变得串行化。

5. 压缩 CSS

   例如使用 clean-css 进行压缩。

6. 简化选择器

   - 不使用过长的后代(指各类)选择器
   - 不使用过长的层级嵌套(一般不超过 5 级)
   - 可以使用 BEM 的方式来命名选择器

7. 合理使用布局方式

   例如能用 flex 实现就不去考虑 float、postion 定位等方式。

### 图片优化

1. 合理进行图片资源的压缩

   - 使用前通过压缩工具进行压缩
   - 使用时通过 CDN 服务商提供的压缩 API 进行压缩
   - 使用 webp 等方式进行压缩
   - 使用 SVG 替代某些矢量图
   - 使用 video 代替某些 gif
   - 使用渐进式 JPEG

2. 使用 CDN 进行加速

3. 某些场景选择雪碧图

4. 使用 font 库代替某些图标

5. 图片的懒加载

   - 特别是长列表的商品图片懒加载。
   - 通过 CSS 的 background-url 进行懒加载，在使用到的时候去请求图片。

### 运行时优化

1. 避免强制同步布局

   首先你需要知道的是，显示器有一个自己的刷新频率，例如每秒 60 次（60 FPS）。这就意味着，每过 16.6ms，浏览器就会将截止上次刷新后的元素变动应用到屏幕上。

   ![渲染管线](https://alienzhou.com/projects/fe-performance-journey/assets/img/pipeline.dc48e4bd.jpg)

   在渲染管线中，有一步叫做 Layout，也就是布局。它会计算元素的大小、位置信息，而且一处的改动几乎会影响到整个文档页面。所以 Layout 的消耗是非常巨大的。

   比如下面这段代码:

   ```js
   var $ele = document.getElementById('main');
   var height = $ele.offsetHeight;
   ```

   上述代码获取了元素的 offsetHeight 值，浏览器此时会使用上一次渲染后的缓存值进行返回，所以浏览器消耗并不大。

   而有一些 JavaScript 操作会导致浏览器需要提前执行布局操作，这种操作就被称为`强制同步布局`。我们把上面的代码改成如下所示：

   ```js
   var $ele = document.getElementById('main');
   $ele.classList.remove('large');
   var height = $ele.offsetHeight;
   ```

   由于我们在修改元素的 className 后又立刻获取了它的高度，为了保证高度值正确，浏览器会立即进行布局，然而我们的本意可能并非如此 —— 也许 large 并不会影响高度，也许我们只是想获取上一帧的结果……

   针对这种目的，下面的写法会更合适，同时可以避免强制同步布局。

   ```js
   var $ele = document.getElementById('main');
   var height = $ele.offsetHeight;
   $ele.classList.remove('large');
   ```

   从这个例子可以看到，我们很可能一不小心就触发了强制同步布局。除了上例中的 offsetHeight，还有许多会触发[强制同步布局](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)的属性。而 [CSS Triggers](https://csstriggers.com/) 这个网站在 Layout 之外，列出了各个浏览器中会触发 Paint 和 Composite 的 CSS 属性。

2. 尝试使用 RAF 避免强制同步布局

   将某些操作放在`requestAnimationFrame`中。

3. 批量化操作

   比如 React 内部的 setState 就是一个批量 batch 的过程。

4. 使用 Virtual List 来优化长列表

5. 使用 requestIdleCallback 来对不重要的长任务进行分解

6. 善用 Composite

   元素布局可能会影响到整个页面，那么自然我们就会想，是否能尽可能减少影响的范围呢？在某些情况下是可以的。例如下面这两个元素：

   ```html
   .main { height: 200px; width: 200px; background: black; } .fixed { position:
   fixed; top: 20px; left: 20px; transform: translateZ(0); width: 100px; height:
   100px; background: red; }

   <div class="main"></div>
   <div class="fixed"></div>
   ```

   浏览器会将其处理为两个渲染层，其中 .fixed 元素由于设置了 3D transform，所以会从普通的渲染层提升至合成层，拥有独立的 GraphicsLayers。当合成层更新时，浏览器会将布局调整限制在该层中，做到尽可能小的布局变动。

   总得来说，合成层在性能优化上的优点在于：

   1. 合成层的位图，会交由 GPU 合成，比 CPU 处理要快；
   2. 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层；
   3. 对于 transform 和 opacity 效果，不会触发 layout 和 paint。

7. 采用 throttle 和 debounce 对事件进行优化

### 预加载技术

1. 使用 Prefetch 进行资源的预获取
2. 使用 Prerender 进行预获取与执行
3. 使用 Preload 进行预获取并将结果放置于内存中
4. 基于 `new Image`的图片预加载
5. 基于 `preload` 对视频进行预加载

## 28.尾调用与尾递归是什么?

### 尾调用

指某个函数的最后一步是调用另一个函数。

```js
function fn(x) {
  return fn2(x);
}
```

我们知道，函数调用会在内存形成一个`调用记录`，又称`调用帧（call frame）`，保存调用位置和内部变量等信息。如果在函数 A 的内部调用函数 B，那么在 A 的调用记录上方，还会形成一个 B 的调用记录。等到 B 运行结束，将结果返回到 A，B 的调用记录才会消失。如果函数 B 内部还调用函数 C，那就还有一个 C 的调用记录栈，以此类推。所有的调用记录，就形成一个`调用栈（call stack）`。

### 尾调用优化

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用记录，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了。

```js
function fn() {
  let a = 1;
  let b = 2;
  return add(a + b);
}
fn();

// 等同于
function fn() {
  return add(3);
}
fn();

// 等同于
add(3);
```

即只保留内层函数的调用记录。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。

### 尾递归

函数调用自身，称为`递归`。如果`尾调用`自身，就称为`尾递归`。

`递归`非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生`栈溢出（stack overflow）`。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生`栈溢出`错误。

```js
// 优化前
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
factorial(5); // 120 空间复杂度O(n)

// 尾递归优化
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
factorial(5, 1); // 120 空间复杂度O(1)
```

## 29. React 为什么要换成 Fiber 的架构?

`React Fiber` 中其实是基于`requestIdleCallback`实现的，我们先来看看之前的 `Stack` 算法。

在 `React16` 之前的版本比对更新 `VirtualDOM` 的过程是采用`循环加递归`实现的。

这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，知道整棵 `Virtual DOM`树比对更新完成之后主线程才能被释放，`主线程`才能执行其他任务。

这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿，非常的影响用户体验。

**核心问题归纳起来就是： 递归无法中断，执行重任务耗时长。JavaScript 又是单线程，无法同时执行其他任务，导致任务延迟页面卡顿，用户体验差。**

#### Fiber 解决方案:

- **1. 利用浏览器空闲时间执行任务，拒绝长时间占用主线程**

  使用 `requestIdleCallback` 利用浏览器空闲时间，`virtual DOM` 的比对不会占用主线程，如果有高优先级的任务要执行就会暂时中止 `Virtual DOM` 比对的过程，先去执行`高优先级`的任务，`高优先级`任务执行完成之后，继续执行 `Virtual DOM` 比对的任务，这样的话就不会出现页面卡顿的现象了。

- **2. 放弃递归只采用循环，因为循环可以被中断**

  由于`递归`需要一层一层进入，一层一层退出，这个过程不能间断，如果要实现 `Virtual DOM` 比对任务可以被终止，就必须放弃`递归`，采用`循环`来完成 `Virtual DOM` 比对的过程，因为`循环`是可以终止的。只要将循环的终止时的条件保存下来，下一次任务再次开启的时候，循环就可以在前一次循环终止的时刻继续往后执行。

- **3. 任务拆分, 将任务拆分成一个个小任务**

  拆分成一个个小任务，任务的单元就比较小，这样的话即使任务没有执行完就被终止了，重新执行任务的代价就会小很多，所以我们要做任务的拆分，将一个个大的任务拆分成一个个小任务执行。是怎么进行拆分的呢？以前我们将整个一个 `Virtual DOM` 的比对看成一个任务，现在我们将树中每一个节点的比对看成一个任务，这样一个大的任务就拆分成一个个小任务了。

## 30. 一个帧 frame 里面包含了那些阶段?

![frame帧](https://img-blog.csdnimg.cn/20210705203725389.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

每一帧包含了以下的一些内容:

1. 用户的交互
   1. blocking input events 阻塞渲染的事件(touch、wheel)
   2. non-blocking input events 非阻塞渲染的事件(click、keypress)
2. js 脚本的执行时间

3. 每一帧的事件

   1. window.resize
   2. scroll
   3. mediaquery changed
   4. animation events

4. rAF

   1. requestAnimationFrame-callbacks
   2. IntersectionObserver-callbacks

5. Layout 布局

   1. ReClac Styles
   2. Update Layout
   3. ResizeObserver-callbacks

6. 绘制生成位图
   1. Compositing Update
   2. Paint Invalidation
   3. Record

假如某一帧里面要执行的任务不多，在不到 `16ms（1000/60)`的时间内就完成了上述任务的话，那么这一帧就会有一定的空闲时间，这段时间就恰好可以用来执行 `requestIdleCallback` 的回调。

## 31. 简单说说你理解的模块化?

首先，模块化是将一个复杂的程序依据一定的规则(规范)封装成几个块(文件)，并进行组合，块的内部数据与实现是私有的，只是向外部暴露一些接口(方法)与外部其它模块通信。

通过使用模块化的方式，我们可以：

1. 避免命名冲突(减少命名空间污染)
2. 更好的分离, 按需加载
3. 更高复用性
4. 高可维护性

### 都有哪些模块化的方案？

1. IIFE 使用自执行函数来编写模块化，特点：在一个单独的函数作用域中执行代码，避免变量冲突。
2. AMD 使用 `requireJS` 来编写模块化，特点：依赖必须提前声明好。
3. CMD 使用 `seaJS` 来编写模块化，特点：支持动态引入依赖文件。
4. CommonJS `nodejs` 中自带的模块化。
5. UMD：兼容 AMD，CommonJS 模块化语法。
6. ES Modules： ES6 引入的模块化，支持 import 来引入另一个 js 。

### 能详细说下 CommonJS 么?

好的，`CommonJS`主要运行于服务端，比如`Node.js`。

该规范指出一个单独的文件就是一个模块，比如在`Node.js`中每个文件就是一个模块，有自己的作用域。每个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

他有如下的一些特点:

1. 采用`同步加载模块`，加载的文件资源大多数在本地服务器，所以执行速度或时间没问题。但是在浏览器端，限于网络原因，更合理的方案是使用`异步加载`。

2. 所有代码都运行在模块作用域，不会污染全局作用域。

3. 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。

4. 模块加载的顺序，按照其在代码中出现的顺序。

基本使用

```js
// 导出模块
module.exports = value;

exports.xxx = value;

// 导入模块
// 如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径
require(xxx);
```

### CommonJS 暴露的模块到底是什么?

`CommonJS` 规范规定，每个模块内部，`module` 变量代表当前模块。这个变量是一个对象，它的 `exports` 属性（即 `module.exports`）是对外的接口。加载某个模块，其实是加载该模块的 `module.exports` 属性。

`require` 命令用于加载模块文件。

**`require` 命令的基本功能是，读取并执行一个 JavaScript 文件，然后返回该模块的 `exports` 对象。如果没有发现指定模块，会报错。**

### ES Module 是什么?

`ES Module` 是 `JavaScript` 官方的标准化模块系统，同时兼容在 `node` 环境下运行。

模块的导入导出，通过 `import` 和 `export` 来确定。

可以和 `Commonjs` 模块混合使用。

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
  return a + b;
};
export { basicNum, add };

/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
  ele.textContent = add(99 + basicNum);
}
```

### CommonJS 与 ES Module 之前有什么区别?

**`CommonJS` 模块输出的是一个`值的拷贝`，`ES6 模块`输出的是`值的引用`。**

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
// main.js
var mod = require('./lib');

console.log(mod.counter); // 3

mod.incCounter();

console.log(mod.counter); // 3
```

上面代码说明，`lib.js` 模块加载以后，它的内部变化就影响不到输出的 `mod.counter` 了。这是因为 `mod.counter` 是一个原始类型的值，会被缓存。除非写成一个`函数`，才能得到内部变动后的值。

```js
// 修改后的lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter;
  },
  incCounter: incCounter,
};
```

JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

## 32. AST 是什么，有去了解过么?

`AST（Abstract Syntax Tree)`，是源代码的抽象语法结构的树状表现形式。树上的每个节点都表示源代码中的一种结构。之所以说语法是「抽象」的，是因为这里的语法并不会表示出真实语法中出现的每个细节。

### 说一说场景的 AST 类型有哪些?

| 类型名称            | 中文译名      | 描述                                                  |
| :------------------ | :------------ | ----------------------------------------------------- |
| Program             | 程序主体      | 整段代码的主体                                        |
| ImportDeclaration   | 引入声明      | 声明引入，比如 import                                 |
| VariableDeclaration | 变量声明      | 声明变量，比如 let const var                          |
| FunctionDeclaration | 函数声明      | 声明函数，比如 function                               |
| ExpressionStatement | 表达式语句    | 通常为调用一个函数，比如 console.log(1)               |
| BlockStatement      | 块语句        | 包裹在 {} 内的语句，比如 if (true) { console.log(1) } |
| BreakStatement      | 中断语句      | 通常指 break                                          |
| ContinueStatement   | 持续语句      | 通常指 continue                                       |
| ReturnStatement     | 返回语句      | 通常指 return                                         |
| SwitchStatement     | Switch 语句   | 通常指 switch                                         |
| IfStatement         | If 控制流语句 | 通常指 if (true) {} else {}                           |
| Identifier          | 标识符        | 标识，比如声明变量语句中 const a = 1 中的 a           |
| ArrayExpression     | 数组表达式    | 通常指一个数组，比如 [1, 2, 3]                        |
| StringLiteral       | 字符型字面量  | 通常指字符串类型的字面量，比如 const a = '1' 中的 '1' |
| NumericLiteral      | 数字型字面量  | 通常指数字类型的字面量，比如 const a = 1 中的 1       |

## 33. Babel

### Babel 的解析过程是什么?

`Babel` 的三个主要处理步骤分别是：`解析（parse`）----> `转换（transform）` -----> `生成(generate）`。

### 解析是通过什么去解析的?解析的具体流程是什么?解析后的产物是什么?

利用`@babel/parser`将代码解析成 AST。

这个步骤分为两个阶段：`词法分析（Lexical Analysis）`和 `语法分析（Syntactic Analysis）`。

- 词法分析：将代码(字符串)分割为 `token` 流，即语法单元成的数组。
- 语法分析：分析 `token` 流(上面生成的数组)并生成 `AST` 转换。

转换步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。

最终（经过一系列转换之后）的 AST 转换成`字符串形式`的代码，同时还会创建`源码映射（source maps）`。

代码生成其实很简单：`深度优先`遍历整个 AST，然后构建可以表示转换后代码的字符串。

## 34. webpack

### webpack 的启动流程是怎么样的?

比如当我们去执行下面这段脚本

```js
webpack entry.js bundle.js
```

底层操作系统会去命令行工具进入 `node_modules/.bin` 目录查找是否存在 `webpack.sh(mac)` 或者 `webpack.cmd(windows)`文件,如果存在就执行,不存在就抛出错误。

**所以 `webpack` 命令实际执行的是 `node_modules/webpack/bin/webpack.js`。**

执行`webpack.js`之后，首先定义了正常执行的返回值`process.exitCode = 0;`，定义了`runCommand`以及`isInstalled`等方法，检查是否安装了`webpack-cli`或者`webpack-command`这个包，没有找到的话进行提示安装，找到了的话执行对应包内的 CLI 命令。

### webpack 的构建流程是什么样的?

1. 将命令行参数与 `webpack配置文件(webpack.config.js)`· 合并、解析得到参数对象 `Options`，用于激活`webpack`的加载项和插件。

2. 进行`webpack`的初始化:

   1. 将参数对象 `Options` 传给 `webpack` 执行得到 `compiler` 对象。
   2. `WebpackOptionsApply`首先会初始化几个基础插件，然后把`options`中对应的选项进行`require`。
   3. 初始化`compiler`的上下文。`loader`和`file`的输入输出环境。

3. 执行`compiler`对象的`run()`方法开始编译

   1. 该方法是编译的入口。
   2. `compiler`具体分成了 2 个对象：
      1. Compiler：存放输入输出相关配置信息和编译器`Parse`对象。
      2. Watching：监听文件变化的一些处理方法。

4. 触发`compile()`方法

   1. 执行`run`方法会触发`compile`方法，从而开始构建`options`中的模块。
   2. 生成`Compilation`对象。
      1. 该对象负责组织整个编译过程，包含了每个构建环节对应的方法。
      2. 对象内部保留了对`compile`对象的引用，并且存放了所有的`modules`、`chunks`、生成的`assets`以及最终用来生成 js 的`template`。
      3. 需要注意的是每次执行`run`方法都会生成一个新的`Compilation`对象。

5. 触发 `Compiler` 的 `make` 方法分析入口文件

   1. 调用 `compilation` 的 `addEntry` 递归遍历所有的入口文件。
   2. 调用 `compilation` 的 `buildModule` 方法创建主模块对象。

6. 生成入口文件 AST(抽象语法树)，通过 AST 分析和递归加载依赖模块。

   1. 解析入口 js 文件(也就是在`webpack.config.js`中定义的`entry`字段)，通过对应的工厂方法创建模块，保存到`compliation对象`上(这里使用单例模式保证同样的模块只有一个实例)。
   2. 对 module 进行 build。包括调用 loader 处理源文件使用`acorn`生成 AST 并且遍历 AST，遇到`require`等依赖时，创建依赖`Dependency`加入依赖数组。
   3. module 已经 build 完毕，此时开始处理依赖的 module。
   4. 异步的对 module 进行 build，如果依赖中仍有依赖，则循环处理其依赖。

7. 所有模块分析完成后，执行 `compilation` 的 `seal` 方法对每个 `chunk` 进行整理、优化、封装。

   1. 通过调用`seal`方法进行封装，逐次对每个 module 和 chunk 进行整理生成编译后的源码合并、拆分，每个 chunk 对应一个入口文件。
   2. 开始处理最后生成的 js。

8. 进行 emit 提交

   1. 所有的`module`、`chunk`仍然保存的是通过一个个`require()`聚合起来的代码，需要通过`Template`产生最后带有`__webpack__require()`格式的代码。
   2. 这里有两个`Template`
      1. `MainTemplate`：处理入口文件的 module
      2. `ChunkTemplate`：处理那些非首屏需要异步加载的 module
   3. 这个阶段插件有最后的机会修改`assets`.

9. after emit 提交

   1. 这里完成了输出，生成了不同的`dependencyTemplates`，如`Commonjs`、`AMD`...
   2. 生成好的 js 会保存在`compliation.assets`中。

10. 最后执行 `Compiler` 的 `emitAssets` 方法把生成的文件输出到 `output` 的目录中。

![完整大图](https://img-blog.csdnimg.cn/968e6be3a07541d9822e8f8148ee8bc2.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### compiler 与 compilation 是什么？有什么区别?

- compiler

  - `Compiler` 对象包含了当前运行 `Webpack` 的完整配置，这个对象在启动 `Webpack` 时被实例化，包含了 `entry`、`output`、`loaders`、`plugins` 等配置。

  - `Compiler类`继承了 `Tapable`，使用 `Tapable` 实现了事件发布订阅处理的插件架构，当在 `webpack` 环境中应用一个插件时，插件将收到此 `compiler` 对象的引用。可以使用 `compiler` 来访问 `webpack` 的主环境。

  compier 重要的事件钩子

  | 事件钩子      | 触发时机                                            | 参数        | 类型              |
  | :------------ | :-------------------------------------------------- | :---------- | :---------------- |
  | entry-option  | 初始化 option                                       | -           | SyncBailHook      |
  | run           | 开始编译                                            | compiler    | AsyncSeriesHook   |
  | compile       | 真正开始的编译，在创建 compilation 对象之前         | compilation | SyncHook          |
  | compilation   | 生成好了 compilation 对象，可以操作这个对象啦       | compilation | SyncHook          |
  | make          | 从 entry 开始递归分析依赖，准备对每个模块进行 build | compilation | AsyncParallelHook |
  | after-compile | 编译 build 过程结束                                 | compilation | AsyncSeriesHook   |
  | emit          | 在将内存中 assets 内容写到磁盘文件夹之前            | compilation | AsyncSeriesHook   |
  | after-emit    | 在将内存中 assets 内容写到磁盘文件夹之后            | compilation | AsyncSeriesHook   |
  | done          | 完成所有的编译过程                                  | stats       | AsyncSeriesHook   |
  | failed        | 编译失败的时候                                      | error       | SyncHook          |

- compilation

  - `compilation` 对象代表了一次资源版本构建，当执行`compiler.run` 后首先会触发 `compile`，这一步会构建出 `compilation` 对象，`compilation` 的职责就是构建`模块`和 `Chunk`，并利用插件优化构建过程。

  - 当运行 `webpack` 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 `compilation`，从而生成一组新的编译资源。

  - 一个 `compilation` 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。`compilation` 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

## 35.webpack 的插件 Plugin 和 Loader 接触过吗?

### webpack 的插件机制是什么?

`webpack` 的本质是一种基于事件流的编程范例,通过集成一系列的插件运行。其中核心对象 `Complier`、`Complation`都是继承于`Tapable`。

`Tapable` 是一个类似于`nodejs` 的`EventEmitter` 的库, 主要是控制钩子函数的发布与订阅。当然，`tapable`提供的`hook`机制比较全面，分为`同步`和`异步`两个大类(异步中又区分`异步并行`和`异步串行`)，而根据事件执行的终止条件的不同，由衍生出 `Bail/Waterfall/Loop` 类型。

```js
const {
  Tapable,
  SyncHook, // 同步钩子
  SyncBailHook, // 同步熔断钩子 当函数有任何返回值,则在当前执行函数停止
  SyncWaterfallHook, // 同步流水钩子
  SyncLoopHook, // 同步循环钩子
  AsyncParallelHook, // 异步并发钩子
  AsyncParallelBailHook, // 异步并发熔断钩子 当函数有任何返回值,则在当前执行函数停止
  AsyncSeriesHook, // 异步串行钩子
  AsyncSeriesBailHook, // 异步串行熔断钩子 当函数有任何返回值,则在当前执行函数停止
  AsyncSeriesWaterfallHook, // 异步串行流水钩子
} = require('tapable');
```

### Tapable 的钩子绑定是如何执行的?

- Async
  - 绑定: tapAsync、tapPromise、tap
  - 执行: callAsync、promise
- Sync
  - 绑定:tap
  - 执行:call

### Loader 是什么?

`loader` 的本质就是一个函数，将那些 `webpack` 不能直接理解的 `JavaScript` 文件、`CSS 文件`等转化成 `webpack`可以识别的文件。

`Loader` 在 `module.rules` 中配置，作为模块的解析规则，类型为`数组`。每一项都是一个 `Object`，内部包含了 `test(类型文件)`、`loader`、`options` (参数)等属性。

### Loader 有哪两个属性?

1. `test 属性`：用于标识出应该被对应的 loader 进行转换的某个或某些文件，其书写格式是一个正则表达式。

2. `use 属性`：表示对应匹配出的文件需要使用的 loader，其中 loader 是一个数组，使用的顺序为从右往左。

### 常见的 loader 都有哪些?

- `file-loader`：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)。
- `url-loader`：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (用于处理图片和字体)。
- `source-map-loader`：加载额外的 Source Map 文件，以方便断点调试。
- `image-loader`：加载并且压缩图片文件。
- `babel-loader`：把 ES6 代码 转换成 ES5。
- `postcss-loader`：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀。
- `sass-loader`：将 SCSS/SASS 代码转换成 CSS。
- `less-loader`：将 Less 代码转换成 CSS。
- `css-loader`：加载 CSS，支持模块化、压缩、文件导入等特性。
- `style-loader`：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
- `eslint-loader`：通过 ESLint 检查 JavaScript 代码。
- `cache-loader`: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里。
- `thread-loader`:可以配置 webpack 进行多进程的打包 js 和 css。

### 有没有写过 Loader 或者说如何去编写一个 Loader?

`loader` 就是一个 `node` 模块，在 `webpack` 的定义中，`loader` 导出一个函数，`loader` 会在转换源模块（resource）的时候调用该函数。在这个函数内部，我们可以通过传入 `this` 上下文给 `Loader API` 来使用它们。

```js
module.exports = function(source) {
  // webpack中默认是开启loader缓存的(可以使用this.cacheable关掉缓存)。
  if (this.cacheable) {
    this.cacheable();
  }

  let backUp = source
  // 比如source进行replace
  ...

  return backUp;
}
```

### 什么是 Plugin？

`Plugin`是插件，基于事件流框架 `Tapable`，插件可以扩展 `Webpack` 的功能，在 `Webpack` 运行的生命周期中会广播出许多事件，`Plugin` 可以监听这些事件，在合适的时机通过 `Webpack` 提供的 `API` 改变输出结果。

`Plugin` 在 `plugins` 中单独配置，类型为`数组`，每一项是一个 `Plugin` 的实例，需要手动通过`new Plugin(options)`进行，参数都通过构造函数传入。

### 常见的 plugin 有哪些?

- `clean-webpack-plugin`: 常用于打包正式环境报之前进行目录清理。
- `speed-measure-webpack-plugin`: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)。
- `mini-css-extract-plugin`: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代 extract-text-webpack-plugin)。
- `terser-webpack-plugin`：用于替代`uglifyjs-webpack-plugin`(uglifyjs 不支持 es6 语法)支持压缩 ES6 (Webpack4)，可配置多进程进行压缩。
- `webpack-parallel-uglify-plugin`: 多进程执行代码压缩，提升构建速度。
- `webpack-bundle-analyzer`：可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)。
- `html-webpack-externals-plugin`：将不怎么需要更新的第三方库脱离 webpack 打包，不被打入 bundle 中，从而减少打包时间，但又不影响运用第三方库的方式，例如 `import` 方式等。
- `DllPlugin`：用于分包处理,用于在单独的 webpack 配置中创建一个 `dll-only-bundle`。 此插件会生成一个名为 `manifest.json` 的文件，这个文件是用于让 `DllReferencePlugin` 能够映射到相应的依赖上。
- `DllReferencePlugin`：此插件配置在 webpack 的主配置文件中，此插件会把 `dll-only-bundles` 引用到需要的预编译的依赖中。

### 如何去编写一个 plugin

plugin 的本质是一个类。这个类必须实现的方法就是 `apply`。所以，一个基础的 `plugin` 如下：

```js
class MyPlugin {
  // 插件的名称
  apply(complier) {
    // 必须实现的apply方法
    compiler.hooks.done.tap('My Plugin', (stats) => {
      // 触发的hooks
      // do something
    });
  }
}

module.exports = MyPlugin;

// 插件的使用

plugins: [new MyPlugin()];
```

## 36. npm install 的原理

### npm3 做了什么处理?

`npm 3.x`版本之后做了较大的更新，将早期的`嵌套结构`改为`扁平结构`：

1. 安装模块时，不管其是直接依赖还是子依赖的依赖，优先将其安装在 node_modules 根目录。
2. 当安装到相同模块时，判断已安装的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的`node_modules`下安装该模块。

### npm5 解决了什么问题?

`npm3`的模式下，假设我们不同子包中依赖了某个包的不同版本，在安装解析的时候又是按照`package.json`的依赖顺序依次解析的，`package.json` 通常只会锁定大版本，这意味着在某些依赖包小版本更新后，同样可能造成依赖结构的改动，依赖结构的不确定性可能会给程序带来不可预知的问题。

为了彻底解决遗留下来的问题，在 `npm 5.x`版本新增了 `package-lock.json`文件，安装方式上还是采用`扁平化`的方式。

`package-lock.json` 的作用是锁定依赖结构，即只要你目录下有 `package-lock.json` 文件，那么你每次执行 `npm install` 后生成的 `node_modules` 目录结构一定是完全相同的。

### npm 的缓存

在执行 `npm install` 或 `npm update`命令下载依赖后，除了将依赖包安装在`node_modules` 目录下外，还会在本地的缓存目录缓存一份。

通过 `npm config get cache` 命令可以查询到：在 `Linux` 或 `Mac` 默认是用户主目录下的 `.npm/_cacache` 目录。

![npm cache](https://img-blog.csdnimg.cn/285a52d341e24ce3a07935b9fc00555f.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

在这个目录下又存在两个目录：`_cacache`、`content-v2`、`index-v5`等目录，`content-v2` 目录用于存储 `tar` 包的缓存，而 `index-v5` 目录用于存储 `tar` 包的 `hash`。

`npm` 在执行安装时，可以根据 `package-lock.json` 中存储的 `integrity`、`version`、`name` 生成一个唯一的 `key` 对应到 `index-v5` 目录下的缓存记录，从而找到 `tar` 包的 `hash`，然后根据 `hash` 再去找缓存的 `tar` 包直接使用。

### npm 的执行流程

1. 检查 config

`npm` 执行会先读取 `npm config` 和 `npmrc` .

`npmrc` 的优先级是: `项目级 .npmrc文件 > 用户级 .npmrc文件 > 全局 .npmrc文件 > npm 内置 .npmrc文件`

2. 检查 lock 文件

- 无 lock 文件：
  - 从 npm 远程仓库获取包信息
  - 根据 `package.json` 构建依赖树，构建过程：
    - 构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 `node_modules` 根目录。
    - 当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 `node_modules` 下放置该模块。
    - 注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包
  - 在缓存中依次查找依赖树中的每个包：
    - 不存在缓存：
      - 从 npm 远程仓库下载包
      - 校验包的完整性
      - 校验不通过：
        - 重新下载
      - 校验通过：
        - 将下载的包复制到 `npm` 缓存目录
        - 将下载的包按照依赖结构解压到 `node_modules`
    - 存在缓存：将缓存按照依赖结构解压到 `node_modules`
  - 将包解压到 `node_modules`
  - 生成对应的 `lock` 文件
- 存在 lock 文件：
  - 检查 `package.json` 中的依赖版本是否和 `package-lock.json` 中的依赖有冲突。
    - 如果没有冲突，直接跳过获取包信息、构建依赖树过程，开始在缓存中查找包信息，后续过程与上面相同。

在我们实际的项目开发中，使用 npm 作为团队的最佳实践: **同一个项目团队,应该保持 npm 版本的一致性**。

### 什么是 yarn，yarn 解决了什么问题?

`yarn` 是在 2016 年发布的，那时 `npm` 还处于 `V3` 时期，那时候还没有 `package-lock.json` 文件，就像上面我们提到的：不稳定性、安装速度慢等缺点经常会受到广大开发者吐槽。此时，`yarn` 诞生。

解决的问题:

- 确定性：通过 `yarn.lock` 等机制,即使是不同的安装顺序,相同的依赖关系在任何的环境和容器中,都可以以相同的方式安装。
- 采用模块扁平化的安装模式：采用的是 `npm v3` 的扁平结构来管理依赖。
- 网络性能更好: `yarn`采用了请求排队的理念，类似于并发池连接，能够更好的利用网络资源;同时也引入了一种安装失败的重试机制。
- 采用缓存机制,实现了离线模式。

### yarn.lock 和 package-lock.json 有什么区别?

`yarn.lock` 和 `package-lock.json` 文件还是比较类似的，他们的区别主要是：

1. `package-lock.json` 使用的是 `json` 格式，`yarn.lock` 使用的是一种自定义格式。
2. `yarn.lock` 中子依赖的版本号不是固定的，意味着单独又一个 `yarn.lock` 确定不了 `node_modules` 目录结构，还需要和 `package.json` 文件进行配合。而 `package-lock.json` 只需要一个文件即可确定。

### yarn 安装机制

Yarn 的安装大致分为 5 个步骤:

1. 检测(checking)
2. 解析包(Resolving Packages)
3. 获取包(Fetching)
4. 链接包(Linking Packages)
5. 构建包(Building Packages)

### yarn 缓存策略

`yarn` 默认使用 `prefer-online` 模式，即优先使用`网络数据，如果网络数据请求失败，再去请求缓存数据。

### 团队实践

1. 不要轻易删除锁文件`lockfiles`，这会导致原本的依赖出现版本更新，可能会导致项目崩了。直接 `npm install` 即可，不好使可以手动重新安装或更新报错的具体依赖，当然有些包需要特定的`node`版本，也需要对应改`node`版本。

2. 所有依赖装`dependencies` 和 `devDependencies` 得看项目，如果是前端 `spa` 应用或者一次性的 `ssg` 项目可以这样做，但是如果是开后端或者`ssr`以及开库给别人用就需要特别注意到底是通用环境下的依赖`dependencies`还是仅生产环境下的依赖`devDependencies`。

3. `yarn` 和 `npm` 混用在部分特别依赖包管理器的项目中是有问题的，例如`antfu`的`vitesse`需要通过包的锁文件去判断具体用到那个包管理器，然后用这个包管理器去自动安装具体的图标集依赖。当然除此之外还有两个包管理器的网络机制以及缓存机制和下载后的依赖分布也不同，如果特别依赖这些的项目也需要注意一下。推荐统一一个包管理器。

4. 需要上传`lockfiles`文件到仓库中，因为这个文件主要用来`锁默认`的依赖版本，最好让别人的依赖和自己的依赖保持统一，这样的错误率最小。

## 37. 为什么 react 推行函数式组件？

1. 函数组件不需要声明类，可以避免大量的譬如 extends 或者 constructor 这样的代码
2. 函数组件不需要处理 this 指向的问题
3. 函数组件更贴近于函数式编程，更加贴近 react 的原则。使用函数式编程，灵活度更高，更好的代码复用
4. 随着 Hooks 功能的强大，更推动了函数式组件 + Hooks 这对组合的发展

## 38. 如何做 SEO？服务端渲染都有哪几种方式?

传统的 spa 应用，都属于`CSR (Client Side Rendering)客户端渲染`。

主要问题:

1. 白屏时间过长：在 JS bundle 返回之前，假如 bundle 体积过大或者网络条件不好的情况下，页面一直是空白的，用户体验不友好.

2. SEO 不友好：搜索引擎访问页面时，只会看 HTML 中的内容，默认是不会执行 JS，所以抓取不到页面的具体内容

**服务器端渲染的多种模式**

1. SSR (Server Side Rendering)， 即服务端渲染

   服务端直接实时同构渲染当前用户访问的页面，返回的 HTML 包含页面具体内容，提高用户的体验.

   - 适用于：页面动态内容，SEO 的诉求、要求首屏时间快的场景.

   - 缺点：SSR 需要较高的服务器运维成本、切换页面时较慢，每次切换页面都需要服务端新生成页面.

2. SSG (Static Site Generation)，是指在应用编译构建时预先渲染页面，并生成静态的 HTML.

   把生成的 HTML 静态资源部署到服务器后，浏览器不仅首次能请求到带页面内容的 HTML ，而且不需要服务器实时渲染和响应，大大节约了服务器运维成本和资源.

   - 适用于：页面内容由后端获取，但变化不频繁，满足 SEO 的诉求、要求首屏时间快的场景，SSG 打包好的是静态页面，和普通页面部署一样。

3. ISR (Incremental Static Regeneration)，创建需要增量静态再生的页面

   创建具有动态路由的页面（增量静态再生），允许在应用运行时再重新生成每个页面 HTML，而不需要重新构建整个应用，这样即使有海量页面（比如博客、商品介绍页等场景），也能使用上 SSG 的特性。

   在 Nextjs 中，使用 ISR 需要`getStaticPaths` 和 `getStaticProps` 同时配合使用。
