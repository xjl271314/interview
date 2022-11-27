---
title: 字节抖音直播团队1面
nav:
  title: 模拟试题
  path: /demos
  order: 0
group:
  title: 技术部分
  path: /demos/technology
---

# 字节抖音直播团队 1 面

- 2022.11.23

## 1.先做个自我介绍把？

好的。

面试官你好，我叫许将龙，今年 28 岁，浙江台州人，计算机相关专业毕业，从事前端相关的工作已经有 6 年。

自工作以来，主要深耕于 PC、H5、公众号、小程序、Hybrid 等方向，业务范围主要囊括了电商、金融、直播、拍卖行等场景。

个人基础知识扎实，擅长以 React 为主的相关技术栈。

之前是担任公司业务线内前端团队的 Leader，负责主站核心业务--直播和拍卖行相关的业务开发、团队资源统筹、项目管理以及成员带教相关的工作。期间也带领团队完成了多次核心业务指标贡献，辅导了 4 位成员的转正和晋升工作。

此外我也是一个擅长总结和归纳的人，除了定期在团队内外组件技术分享外，闲暇的时间我也沉淀了上百篇的技术博客。

最后，我是一个外向、乐观、自律的人，擅长与人沟通，学习能力强，能够快速的融入到团队中来。

## 2. 如何判断变量类型？

基础类型等使用`typeof`进行判断，包括

- Number
- String
- Boolean
- undefined
- Symbol
- BigInt
- function

## 3. 为什么可以使用 typeof 判断这些类型？Object 不可以么？

因为 js 在底层存储变量的时候，会在变量机器码的低位 1-3 位存储其类型信息:

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

但是对于 `undefined` 和 `null` 来说，这两个值的信息存储是有点特殊的。

- null：所有机器码均为 0。
- undefined：用 −2^30 整数来表示。

所以，`typeof` 在判断 `null` 的时候就出现问题了，由于 `null` 的所有机器码均为 `0`，因此不能和对象做区分。

## 4. typeof NaN 的返回值是什么？

返回值是`number`。

因为 IEEE-754 标准，64 位浮点数，当指数位全为 1，表示非数字(NaN Not a Number)，诸如 0 除以 0 的结果。

## 5. 那判断对象可以使用什么方式呢？

- 如果要判断变量是否是另外一个对象的实例的话，可以使用`instanceof`。
- 如果要判断变量的类型，通常的使用方式都是使用`Object.prototype.toString.call()`。

## 6. 为什么要使用 call，直接调用对象的方法不可以吗？

不可以。因为对象可能自身重写了`toString`方法。

## 7. 为什么基础类型例如 string 也能像对象那样调用 slice、indexOf 等方法？

因为 js 在`基础类型`调用这些方法的时候，会自动的去执行一个`装箱`的操作，把`基本类型`转化成一个`包装类型`。

然后在生成的这个实例上去调用该方法，如果该实例上不存在该方法，那么就会报错。

调用结束之后呢，会自动的进行一个`拆箱`的操作。

**也就是说，我们使用基本类型调用方法，就会自动进行 `装箱` 和 `拆箱` 操作，相同的，我们使用 `Number` 和 `Boolean` 类型时，也会发生这个过程。**

## 8.原型和原型链是什么？

在早期 js 中没有`类`的概念，主要是使用`原型链`的方式来实现继承，主要是通过一个`指向原型对象的指针`来实现。

比如说，我们声明了最简单的一个对象`{}`，可以在控制台看到有下面的一些属性：

![原型](https://img-blog.csdnimg.cn/20210507145818391.png?x-oss-process=imag,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

很多方法已经挂载在了一个内置的`__proto__`属性上了。

这个`__proto__`就是`指向原型对象的指针`。

当我们去创建一个新的`引用类型对象`时（显示或者隐式）自动创建，并挂载到新实例上。

当我们尝试访问`实例对象`上的某一属性或者方法时，如果`实例对象上`有该属性或者方法时，就返回实例属性或者方法。

如果没有，就去 `__proto__` 指向的`原型对象`上查找对应的属性或者方法。

要说到`原型链`的话还的引入一个`构造函数`的概念。

**那什么是构造函数？**

其实和普通函数区别不大，主要差异是：

1. 函数以大写字母开头。
2. 函数可以通过 new 关键字被实例化。

`原型对象`是在`构造函数`被声明时一同创建的，然后挂载到`构造函数`的 `prototype` 属性上：

```js
// 构造函数，函数首字母通常大写
function Person() {}
const person = new Person();
```

![构造函数](https://img-blog.csdnimg.cn/20210507150631983.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`原型对象`被创建时，会自动生成一个 `constructor` 属性，指向创建它的`构造函数`。

我们可以用一张图来表示这个关系：

![原型链](https://img-blog.csdnimg.cn/20210507150826444.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上面这个被`__proto__`链起来的这个图就是原型链。

## 9. 那么下面这段代码的执行结果是什么？

```js
class Foo {}
const f1 = new Foo();

Foo.prototype.constructor === Foo; // true
f1.__proto__ === Foo.prototype; // true

Object.prototype.__proto__ === null; // true
Foo.prototype.__proto__ === Object.prototype; // true

Object.__proto__ === Function.prototype; // true
Foo.__proto__ === Function.prototype; // true
Function.__proto__ === Function.prototype; // true
String.__proto__ === Function.prototype; // true
Number.__proto__ === Function.prototype; // true
Array.__proto__ === Function.prototype; // true
BigInt.__proto__ === Function.prototype; // true
Symbol.__proto__ === Function.prototype; // true
```

这里可以总结得到所有包装类型的`__proto__`属性都和`Function.prototype`相等，因为所有函数都由 Function 创建而来。

## 10. 为什么 Function.**proto** === Function.prototype 呢？

主要有以下这么几种说法：

1. 为了与其他函数保持一致。
2. 为了说明一种关系，比如证明所有的函数都是 `Function` 的实例。
3. 函数都是可以调用 `call`、`bind` 这些内置 API 的，这么写可以很好的保证函数实例能够使用这些 API。

## 11.原型污染是什么？

主要指攻击者通过某种手段修改 JavaScript 对象的原型，比如说把对象的`toString`方法改掉。

## 12. 那么如何去避免原型污染？

1. 使用 `Object.create(null)`， 方法创建一个原型为 `null` 的新对象，这样无论对原型做怎样的扩展都不会生效：

   ```js
   const obj = Object.create(null);
   obj.__proto__ = { hack: '污染原型的属性' };
   console.log(obj); // => {}
   console.log(obj.hack); // => undefined
   ```

2. 使用 `Object.freeze(obj)` 冻结指定对象，使之不能被修改属性，成为不可扩展对象：

   ```js
   Object.freeze(Object.prototype);

   Object.prototype.toString = 'evil';

   console.log(Object.prototype.toString); // => ƒ toString() { [native code] }
   ```

3. 建立 `JSON schema` ，在解析用户输入内容时，通过 `JSON schema` 过滤敏感键名。

## 13. 如何自己去实现一个 instanceof

```js
function instanceof(obj, target) {
  // 获取取右表达式的 prototype 值
  let targetProto = target.prototype;
  // 获取左边表达式的__proto__
  let objProto = obj.__proto;

  while(true){
      if(objProto == null) {
          return false;
      }
      if(objProto == targetProto){
          return true
      }
      objProto = objProto.__proto__;
  }
}
```

## 14. js 中的执行上下文是什么？

一段 js 在执行的时候，都是在对应的执行上下文中进行的，按照不同的环境主要分为 3 类。

1. 全局上下文

这是默认或者说是最基础的执行上下文，一个程序中只会存在一个全局上下文，它在整个 javascript 脚本的生命周期内都会存在于执行堆栈的最底部不会被栈弹出销毁。

2. 函数上下文

每当一个函数被调用时，都会创建一个新的函数执行上下文（不管这个函数是不是被重复调用的）。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。

3. eval 上下文

执行在 `eval` 函数内部的代码也会有它属于自己的执行上下文。

## 15. 执行栈又是什么？

对应 js 来说，执行栈其实是一种`LIFO`的一个调用栈。

当 js 引擎第一次碰到 js 脚本的时候，会创建一个全局的执行上下文并压入到栈底。

每当遇到一个函数调用的时候会将当前函数压入到栈顶，等待执行完成后再出栈。

以下面的代码为例：

```js
var a = 1;
function add(x, y) {
  return x + y;
}
function sum(x, y) {
  var b = 2;
  let result = add(x, y);

  return a + b + result;
}
sum(3, 4);
```

1. 第一步，创建全局上下文，并将其压入栈底。如下图所示：

   <img src="https://img-blog.csdnimg.cn/2a0ac515125744fa94a72ac4d1b01fa0.png"  width="40%" />

   `变量a`、`函数add` 和 `sum` 都保存到了全局上下文的变量环境对象中。

   全局执行上下文压入到调用栈后，JavaScript 引擎便开始执行全局代码了。首先会执行`a=1`的赋值操作，执行该语句会将全局上下文变量环境中 a 的值设置为 1。

   <img src="https://img-blog.csdnimg.cn/46482b14172647d186fbfaa156e6478f.png" width="40%"/>

2. 第二步是调用 sum 函数。

   当调用该函数时，JavaScript 引擎会编译该函数，并为其创建一个执行上下文，最后将该函数的执行上下文压入栈中，如下图所示：

   <img src="https://img-blog.csdnimg.cn/3d3c55d782d8448b883cb44e0419c10a.png" width="40%"/>

   `sum函数`的执行上下文创建好之后，便进入了函数代码的执行阶段了，这里先执行的是`b=2`的赋值操作，执行语句会将`sum函数`执行上下文中的 b 由`undefined`变成了 2。

3. 第三步，当执行到 add 函数。

   调用语句时，同样会为其创建执行上下文，并将其压入调用栈，如下图所示：

   <img src="https://img-blog.csdnimg.cn/e900b9b8832943729b5209f7a2cc5864.png" width="40%"/>

   当 add 函数返回时，该函数的执行上下文就会从栈顶弹出，并将 result 的值设置为 add 函数的返回值，也就是 7。如下图所示：

   <img src="https://img-blog.csdnimg.cn/14bb4889433949c39e511cc112697019.png" width="40%"/>

   紧接着 sum 执行最后一个相加操作后并返回，sum 函数的执行上下文也会从栈顶部弹出，此时调用栈中就只剩下全局上下文了。最终如下图所示：

   <img src="https://img-blog.csdnimg.cn/3d8b9ac5ef8846be893142692bece1d2.png" width="40%"/>

至此，整个 JavaScript 流程执行结束了。

## 16. 实际运用中如何去查看调用栈信息呢？

**实际运用中大多数都是通过`Chrome控制台`的`Source标签`，在需要的地方进行断点调试。**

我们继续使用上述代码，然后打开开发者工具，点击`Source标签`，选择`JavaScript`代码的页面，然后在第 13 行加上断点，并刷新页面。

我们可以看到执行到`add`函数时，执行流程就暂停了，这时可以通过右边`call stack`来查看当前的调用栈的情况，如下图：

![call stack](https://img-blog.csdnimg.cn/f912b7dae8804daf81936335c31c8a16.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

从图中可以看出，右边的`call stack`下面显示出来了函数的调用关系：

- 栈的最底部是`anonymous`，也就是全局的函数入口；
- 中间是 sum 函数；
- 顶部是 add 函数。

这就清晰地反映了函数的调用关系，所以在分析复杂结构代码，或者检查 Bug 时，调用栈都是非常有用的。

除了通过断点来查看调用栈，我们还可以使用`console.trace()`来输出当前的函数调用关系。

比如在示例代码中的`add`函数里面加上了`console.trace()`，我们就可以看到控制台输出的结果，如下图：

![](https://img-blog.csdnimg.cn/4ea9046c0e98469b8cdac26bc4414762.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_9,color_FFFFFF,t_70,g_se,x_16)

## 17. js 是单线程语言，那么他是如何处理我们的任务的？

被设计为单线程语言主要是因为 js 是用于处理网页中的各类交互。

**这里的单线程指的是单个脚本只能在一个线程上运行，而不是说 JavaScript 引擎只有一个线程。**

但是单线程的语言也存在着一个问题，在处理任务的时候是一个接一个排队处理的，假设有一个耗时巨大的任务需要执行，这个时候浏览器就会一直被这个任务占用资源，其他的操作就得不到响应了。

所以需要一套额外的任务执行机制来处理这种场景。

因此，也诞生了 `Event Loop`。

我们知道当一段 js 代码被执行的时候，会生成一个当前环境下的执行上下文(包括了执行环节、作用域)，用于存放当前环境中的变量，当这个上下文生成后会被推入到执行栈。一旦完成执行，这个上下文就会被弹出，里面的相关变量也会被销毁，等待下一次 gc 后删除。

这个执行栈我们可以理解为主线程任务的`同步执行环境`。

在同步的执行环节外，还存在着一个`Task`任务队列用于管理各种异步场景(比如说接口请求等)。

所有的异步操作都会被塞到这个任务队列中，当这些异步任务执行完成后会通知主线程，是通过事件回调的方式，这也是`Event Loop`名字的来源。

而`Event Loop`刚好是处于这两者之间，它会以一个固定的时间间隔来轮询，每当主线程空闲的时候，就会去任务队列中查找是否有异步任务，如果有的话就将其塞入主线程去执行，执行完成后弹出上下文环境。

当主线程再次空闲的时候，继续这个操作，直到所有任务执行完成。

这个时候就解决了事件的交互机制，但是这个时候的交互还存在问题，事件并没有区分优先级，只是按照到来的先后顺序去执行，因此需要一套插队机制来保证高优先级的任务先执行。

因此我们将异步任务又进行了划分，划分成了`宏任务`和`微任务`两大块。

同一次事件循环中，`微任务`永远在`宏任务`之前执行。

至此一个完整的`Event Loop`就形成了。

总结来说，可以说 `Event Loop` 是通过设计 `Loop机制` 和 `异步任务队列`来解决主线程执行阻塞问题，并且设计了一套 `Micro Task`插队机制的事件交互机制。

## 18.你提到了 宏任务 和 微任务，那么有哪些宏任务和微任务呢?

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

## 19. node 中的事件循环机制有去了解么？和浏览器侧有什么不同？

首先 `Node.js` 也是单线程的，对比浏览器 `Node.js`中多了 2 个任务类型。

1. setImmediate(宏任务)
2. process.nextTick(微任务)

`setImmediate` 设计在 `poll` 阶段完成时执行，即 `check` 阶段；

`process.nextTick`独立于 `Event Loop` 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 `nextTick` 队列，就会清空队列中的所有回调函数，并且优先于其他 `microtask` 执行。

node 事件循环机制分为 6 个阶段，它们会按照顺序反复运行：

```js
┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

每个阶段都有一个要执行的回调 FIFO 队列。 尽管每个阶段都有其自己的特殊方式，但是通常，当事件循环进入给定阶段时，它将执行该阶段特定的任何操作，然后在该阶段的队列中执行回调，直到队列耗尽或执行回调的最大数量为止。 当队列已为空或达到回调限制时，事件循环将移至下一个阶段，依此类推。

从上图中，大致看出 node 中的事件循环的顺序：

外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段（按照该顺序反复运行）…

- `timers 阶段`：这个阶段执行 timer（setTimeout、setInterval）的回调。
- `I/O callbacks 阶段`：处理一些上一轮循环中的少数未执行的 I/O 回调。
- `idle, prepare 阶段`：仅 node 内部使用。
- `poll 阶段`：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里。
- `check 阶段`：执行 setImmediate() 的回调。
- `close callbacks 阶段`：执行 socket 的 close 事件回调。

## 20. Processs.nextTick(fn)中的 fn 在 Node.js11 版本前后有是什么区别？

- 在 `Node.js 11 之前`，会在每个阶段的末尾集中执行（俗称队尾执行）
- 在 `Node.js 11 之后`，会在每个阶段的任务间隙执行（俗称插队执行）但不会插同为 `nextTick` 的队。

```js
setTimeout(() => {
  console.log('timeout1');
});
setTimeout(() => {
  console.log('timeout2');
  process.nextTick(() => {
    console.log('nextTick1');
    process.nextTick(() => {
      console.log('nextTick2');
    });
  });
});
setTimeout(() => {
  console.log('timeout3');
});
setTimeout(() => {
  console.log('timeout4');
});

// 在Node.js11之后 timeout1-->timeout2-->nextTick1-->nextTick2-->timeout3-->timeout4

// 在Node.js11之前 timeout1-->timeout2-->timeout3-->timeout4-->nextTick1-->nextTick2
```

## 21. 如何在浏览器侧模拟 Node.js 的 Processs.nextTick？

可以使用`window.queueMicrotask(fn)来实现`。

```js
setTimeout(() => {
  console.log('timeout1');
});
setTimeout(() => {
  console.log('timeout2');
  window.queueMicrotask(() => {
    console.log('queueMicrotask1');
    window.queueMicrotask(() => {
      console.log('queueMicrotask2');
    });
  });
});
setTimeout(() => {
  console.log('timeout3');
});
setTimeout(() => {
  console.log('timeout4');
});
```

## 22. Promise.resolve().then(fn)中的 fn 在何时执行？

这要看 `Promise` 源码是如何实现的。

- 如果是使用 `process.nextTick(fn)` 实现的，所以直接参考 `nextTick`。
- 如果是`PromiseA+的规范`，那么是采用`setTimeout`来模拟的。

## 23. 能说一说从输入 url 到页面渲染主要有哪些流程？

1. 处理 url，组装协议，拼接成一个完整的请求。
2. 网络进程发起 url 请求。
   - 进行缓存的检查，如果本地缓存了该请求所需的资源，会直接返回该资源。
   - 如果没有缓存的话会向服务器发起一个 http 请求：
     - 进行 DNS 的解析，获取 ip 和端口
     - 利用 ip 地址和服务器建立 tcp 连接
     - 构建请求头信息
     - 发送请求头
     - 服务器响应后，网络进程接收响应头和响应信息，并解析响应内容
   - 网络进程解析响应流程：
     - 检查状态码，如果是 301/302，则需要重定向，从 `Location` 自动中读取地址，如果是 200，则继续处理请求。
     - 200 响应处理：检查响应类型 `Content-Type`，如果是字节流类型，则将该请求提交给下载管理器，该导航流程结束，不再进行后续的渲染，如果是 html 则通知浏览器进程准备渲染进程准备进行渲染。
   - 准备渲染进程：
     - 浏览器进程检查当前 url 是否和之前打开的渲染进程根域名是否相同，如果相同，则复用原来的进程，如果不同，则开启新的渲染进程。
   - 传输数据、更新状态
     - 渲染进程准备好后，浏览器向渲染进程发起“提交文档”的消息，渲染进程接收到消息和网络进程建立传输数据的“管道”。
     - 渲染进程接收完数据后，向浏览器发送“确认提交”.
     - 浏览器进程接收到确认消息后更新浏览器界面状态：安全、地址栏 url、前进后退的历史状态、更新 web 页面.
3. 解析 HTML 构建 DOM 树
4. 在遇到 CSS 的时候，如果是内部的 css 会直接进行解析，如果说是外部的 css 资源会一边下载一边解析，**DOM 的解析和 CSS 的加载和解析是异步的互相不影响，也就是说 CSS 并不会阻塞 DOM 的解析**。
5. 如果遇到了 JS，会停止当前 DOM 的构建，把权利交给 JS 引擎，一直等到该 script 的加载并执行后，才继续往下解析。
6. 样式的计算，等到所有的 DOM 树构建完成，且对应的 CSSROM 树构建完成之后，才会开始合成用于渲染的 render 树。**因此 CSS 的加载会影响 DOM 的渲染。**
7. 根据生成的 render 树，进行布局(Layout)，期间会触发回流。
8. 进行 render 树的绘制(Paint)。
9. 将绘制生成的位图发给 GPU 进行合成。
10. 注册对应的事件处理函数。

## 24. CSS 会阻塞 JS 的执行吗？

会的。

```html
<html>
  <head>
    <!-- 假设css的加载会花3s -->
    <link rel="stylesheet" href="./style.css?sleep=3000" />
    <script src="./index.js"></script>
  </head>
  <body>
    <p>hello world</p>
  </body>
</html>
```

我们从`head`开始解析，首先遇到`link`标签，去加载 css（加载需要 3s），此时浏览器不会停下来，会继续往下解析，然后遇到`script`标签，开始加载 js，js 很快就加载完了，但是 js 不会马上执行，因为它会等到上面的 css 资源加载完成之后再开始执行。从而导致了下面的 p 标签一直没有得到解析。**因为 js 是会阻塞 DOM 的解析的，浏览器会等到 js 执行了才会继续往下解析 DOM。**

因此流程大致是这样：

**`css和js可以同时去加载`—>`css加载很慢，即使js已经加载完了也会等到css加载完了才开始执行`—>`js一直不执行所以阻塞了DOM的解析`**

## 25. 为什么 js 明明都加载完了，还要等 css 加载完才开始执行呢？

可以这样理解，浏览器并不知道 js 中的代码会干些什么，js 可以去改动 DOM，也可以获取/改变 css 样式。

js 要获取正确的样式就必须等 css 加载完才去执行。

**另外的话，虽然浏览器解析 DOM 时，是一行一行向下解析，但是它会预先加载具有引用标记的外部资源（例如带有 src 标记的 script、link 标签），而在解析到此标签时，则无需再去加载，直接运行，以此提高运行效率。**

因此将这些资源部署到 CDN 上也可以加速资源的解析。

## 26. 上面说到了 DOM 解析，那么什么是 DOM？

DOM 是 `Document Object Model（文档对象模型）`的缩写，提供了对 HTML 文档结构化的表述。

在`渲染引擎`中，DOM 有三个层面的作用：

1. 从页面的视角来看，DOM 是生成页面的基础数据结构。
2. 从 JavaScript 脚本视角来看，DOM 提供给 JavaScript 脚本操作的接口，通过这套接口，JavaScript 可以对 DOM 结构进行访问，从而改变文档的结构、样式和内容。
3. 从安全视角来看，DOM 是一道安全防护线，一些不安全的内容在 DOM 解析阶段就被拒之门外了。

**简言之，DOM 是表述 HTML 的内部数据结构，它会将 Web 页面和 JavaScript 脚本连接起来，并过滤一些不安全的内容。**

## 27. DOM 树是如何生成的?

在`渲染引擎`内部，有一个叫 `HTML 解析器（HTMLParser）`的模块，它的职责就是负责将 `HTML` 字节流转换为 `DOM` 结构。

**其中 HTML 解析器并不是等整个文档加载完成之后再解析的，而是网络进程加载了多少数据，HTML 解析器便解析多少数据。**

当网络进程接收到响应头之后，会根据响应头中的 `content-type` 字段来判断文件的类型，比如 `content-type` 的值是`text/html`，那么浏览器就会判断这是一个 `HTML` 类型的文件，然后为该请求选择或者创建一个渲染进程。

渲染进程准备好之后，网络进程和渲染进程之间会建立一个共享数据的管道，网络进程接收到数据后就往这个管道里面放，而渲染进程则从管道的另外一端不断地读取数据，并同时将读取的数据“喂”给 HTML 解析器。

我们可以把这个管道想象成一个“水管”，`网络进程`接收到的字节流像水一样倒进这个“水管”，而“水管”的另外一端是渲染进程的 `HTML 解析器`，它会动态接收字节流，并将其解析为 DOM。

**具体的流程我们可以参考下图**：

![字节流转化过程](https://img-blog.csdnimg.cn/20210623223339187.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- 第一个阶段，通过`分词器`将字节流转换为 `Token`:

  V8 引擎 编译 `JavaScript` 过程中的第一步是做`词法分析`，将 `JavaScript` 先分解为一个个 `Token`。解析 `HTML` 也是一样的，需要通过`分词器`先将`字节流`转换为一个个 `Token`，分为 `Tag Token` 和`文本 Token`。

  ![生成token示意图](https://img-blog.csdnimg.cn/20210623223635122.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

  由图可以看出，`Tag Token` 又分 `StartTag` 和 `EndTag`，比如蓝色部分是`StartTag`，红色部分是`EndTag`，而文本对应中间的绿色模块。

- 后续的第二个和第三个阶段是同步进行的，需要将 `Token` 解析为 `DOM` 节点，并将 `DOM` 节点添加到 `DOM` 树中:

  `HTML 解析器`维护了一个 `Token 栈结构`，该 `Token 栈`主要用来计算节点之间的父子关系，在第一个阶段中生成的 `Token` 会被按照顺序压到这个栈中。具体的处理规则如下所示：

  - 如果压入到栈中的是 `StartTag Token`，`HTML 解析器`会为该 `Token` 创建一个 `DOM` 节点，然后将该节点加入到 `DOM 树`中，它的父节点就是栈中相邻的那个元素生成的节点。

  - 如果分词器解析出来是`文本 Token`，那么会生成一个`文本节点`，然后将该节点加入到 `DOM 树`中，`文本 Token` 是不需要压入到栈中，它的父节点就是当前`栈顶 Token` 所对应的 `DOM 节点`。

  - 如果分词器解析出来的是 `EndTag 标签`，比如是 `EndTag div`，`HTML 解析器`会查看 `Token 栈顶`的元素是否是 `StarTag div`，如果是，就将 `StartTag div` 从栈中弹出，表示该 `div` 元素解析完成。

  通过分词器产生的新 `Token` 就这样不停地`压栈`和`出栈`，整个解析过程就这样一直持续下去，直到`分词器`将所有字节流分词完成。

## 28.根据页面渲染的流程，能说一说你在项目中做了哪些的优化？

- 首先是资源请求方面：

  1. 对 CSS 资源进行合并，多个请求合并成一个，尽量不使用`@import`语法，采用`dns-prefetch`对需要加载的外部 CSS 文件进行 DNS 预解析操作，采用`Preconnect`进行预连接。
  2. 静态资源例如图片等走 CDN，并根据业务场景进行裁剪，压缩图片的质量，采用`webp`的格式代替 PNG。
  3. 减少请求数量，合并 js 请求和部分的接口请求，对于埋点脚本、上报脚本等采用`async`或者`defer`异步的方式去加载。
  4. 路由懒加载，仅加载页面所涉及到的路由。
  5. 部分通用型图标走`font-size`矢量图标库，减少不要的图片请求。
  6. CSS 放置在`<head>`中，js 放置在`<body>`标签之后。
  7. webview、图片、音视频资源的预加载以及采用骨架屏。

- 另外是资源压缩方面：

  1. 接口请求的返回数据走 gzip 压缩。
  2. 某些常用的功能，比如说日期格式化等简单的方法走自定义实现，不去引用`moment.js`等库。
  3. 打包走`tree-shaking`删除无用代码，配置`externals`将通用代码通过 CDN 引入，通过使用`webpack-bundle-analyzer`等插件删除或修改代码，生成 bundle 的时候通过`uglifyjs`进行压缩。
  4. 通用型 CSS 样式走全局样式，业务型样式走`CSS-Module`，通用型 js 方法也是如此。
  5. 合理命名样式名，减少 CSS 选择器的层级，合理使用 CSS 权重，避免过多的`!important`。
  6. 合理使用 CSS 的属性继承。
  7. 合理组织组件层级和架构，尽量做到可扩展性较强。

- 缓存方面：

  1. 主要使用强缓存，部分业务走前端本地缓存，加速渲染。
  2. 某些功能采用`server-worker`进行缓存。

- 运行时优化：
  1. 减少业务回流，使用切换样式名的方式代替某些 DOM 节点变更，采用 transform 代替 left 等偏移计算。
  2. 针对某些复杂型的计算放入到 web worker 中去执行，计算完成后通知主线程。
  3. 基本采用 flex 布局来实现页面布局，对于某些动画等元素尽量采用`absolute`定位的方式去加速渲染，因为合成层的位图，会交由 GPU 合成，比 CPU 处理要快。
  4. 采用`requestAnimationFrame`避免强制同步布局，避免过多的 Long Task，将一些不重要的方法放入到`requestIdleCallback`中来。
  5. 代码的合理拆分，实现遍历的时候使用恰当的方式。
  6. 对一些用户的操作做一些防抖和截流。
  7. 对于列表和图片采用懒加载的方式。

## 29. 上面提到了脚本的异步加载，主要有哪些方式，各自有什么区别？

主要有 `async` 和 `defer` 两种模式。

- async

  该模式下脚本会和页面的元素同时进行加载，加载的方式是开启了新的线程进行加载。

  当脚本加载完成的时候就会停止解析立即执行，多个脚本的情况下，不能保证前后的执行顺序。

  脚本的加载可能在 `DOMContentLoaded` 事件之前执行，也可能在 `DOMContentLoaded` 事件之后执行，这取决于 DOM 内容的多少。

- defer

  该模式下会在文档渲染完毕后`DOMContentLoaded`事件调用前执行按照顺序执行相对应的脚本。

## 30. 上面提到了 DOMContentLoaded 这个事件和 onLoad 事件有什么区别？

两者的触发时机不同。

- DOMContentLoaded 是在 HTML 被解析完成的时候触发的。
- onLoad 是在页面的所有资源(html、css、js、图片等)加载完成后才触发的。

## 31. 有哪些工作可以用来做性能优化？

平时的话主要是通过下面这么几个工具：

1. 首先呢直观的感受页面的加载时长等，自己看 Chrome 中 NetWork，查看是否有不必要的加载，某些资源是否比较大，请求是否比较耗时。具体的请求流程可以查看`waterfall`来分析，主要包含了以下几块内容：
   ![waterfall](https://img-blog.csdnimg.cn/f1636fef5e4c4e45a954c32cb0af816d.png)

   其中蓝色块是下载时间，绿色

2. 运用 performanceAPI 和自带的 performance 工具进行性能分析。
   - FP：`First Paint` 文档中任意元素首次渲染时间，`window.performance.getEntriesByType('paint')`取第一个 paint 的时间
   - FCP:`First Contentful Paint` 第一次有内容的渲染，白屏时间，代表浏览器第一次向屏幕绘制 “内容”。`window.performance.getEntriesByType('paint’)`，取第二个 paint 的时间。
   - `window.performance.timing`包含了网页本身加载的完整数据。
     - navigationStart：在用户代理完成提示卸载上一个文档后立即返回时间。
     - unloadEventStart。
     - domainLookupStart、domainLookupEnd。
     - connectStart、connectEnd。
     - requestStart、responseStart、responseEnd。
     - domInteractive、loadEventStart、loadEventEnd。
   - performance 工具
     - Loading: 加载时间
     - Scripting: js 计算时间
     - Rendering: 渲染时间
     - Painting: 绘制时间
     - Other: 其他时间
     - Idle: 浏览器闲置时间
3. 整体的一些优化走 Lighthouse 工具做检测，看其提供了哪些优化指标。
   - Opportunities 建议列表
     - Remove unused JavaScript
     - Preload key requests
     - Remove unused CSS
     - Serve images in next-gen formats
   - Diagnostics
     - A long cache lifetime can speed up repeat visits to your page
     - Avoid enormous network payloads
     - Reduce JavaScript execution time
4. 有的时候会去使用 Memory 工具分享页面的内存使用情况。

## 32. HTTP 的版本有去做了解么？

- HTTP 0.9
  十分简单，仅支持 GET 请求，不支持设置请求头。
- HTTP 1.0
  1. 在请求中加入了 HTTP 版本号，如：GET /baidu/index.html HTTP/1.0
  2. HTTP 开始有 header 了，不管是 request 还是 response 都有 header 了。
  3. 增加了 HTTP Status Code 标识相关的状态码。
  4. 丰富了 Content-Type 可以传输其它的文件了。
  5. 可通过开启 Connection： keep-alive 来指定使用 TCP 长连接
- HTTP 1.1
  1. 可以设置 Connection： keep-alive 来让 HTTP 重用 TCP 链接，重用 TCP 链接可以省了每次请求都要在广域网上进行的 TCP 的三次握手的巨大开销。这是所谓的“HTTP 长链接” 或是 “请求响应式的 HTTP 持久链接”。
  2. 支持 pipeline 网络传输，只要第一个请求发出去了，不必等其回来，就可以发第二个请求出去，可以减少整体的响应时间
  3. 支持 Chunked Responses ，也就是说，在 Response 的时候，不必说明 Content-Length 这样，客户端就不能断连接，直到收到服务端的 EOF 标识。这种技术又叫 “服务端 Push 模型”，或是 “服务端 Push 式的 HTTP 持久链接”。
  4. 增加了 cache control 机制。
  5. 协议头注增加了 Language, Encoding, Type 等头，让客户端可以跟服务器端进行更多的协商。
  6. 正式加入了一个很重要的头—— HOST 这样的话，服务器就知道你要请求哪个网站了。因为可以有多个域名解析到同一个 IP 上，要区分用户是请求的哪个域名，就需要在 HTTP 的协议中加入域名的信息，而不是被 DNS 转换过的 IP 信息。
  7. 正式加入了 OPTIONS 方法，其主要用于 CORS – Cross Origin Resource Sharing 应用。
- HTTP 2.0
  1. 传输的数据格式由文本改成了二进制帧。
  2. 所有数据以帧的方式进行传输，因此同一个连接中发送的多个请求不再需要按照顺序进行返回处理，可以达到并行的数据传输，移除了 HTTP/1.1 中的串行请求。
  3. 压缩头信息进行传输数据量的优化。HTTP1.x 的请求头带有大量信息，而且每次都要重复发送，HTTP2.0 使用 encoder 来减少需要传输的请求头大小，通讯双方各自缓存一份 header fields 表，既避免了重复的传输，又减小了传输信息的大小。其中使用的是 HPACK 算法。
  4. 新增了 server push（服务端推送） 的概念，服务端可以主动发起一些数据推送。比如，服务端在接收到浏览器发来的 HTML 请求的同时，可以主动推送相关的资源文件（js/css）给客户端，并行发送，提高网页的传输和渲染效率。
  5. 采用了信道(多路)复用，使 TCP 连接支持并发请求，即多个请求可同时在一个连接上并行执行。
  6. 需要在 HTTPS 的基础上使用。
- HTTP 3.0
  1. 使用 UDP 代替 TCP 作为底层协议，解决队头阻塞问题。
  2. 基于 Google 的 QUIC 协议进行传输控制，解决丢包重传等问题。
  3. 自定义传输控制 ID
  4. 自定义的拥塞控制，基于 QUIC 使用 CUBIC、BBR 算法。
  5. 基于 QUIC 实现前向安全和前向纠错。

## 34. 上面提到了对头阻塞，什么是队头阻塞？

主要是指 TCP 的队头阻塞。

因为当数据包超时确认或者丢失，会等待重传，因此会阻塞当前窗口向右滑动，造成阻塞。

这也是 `HTTP 3.0` 抛弃了 `TCP` 采用 `UDP` 作为最底层的协议。

## 35. TCP 的三次握手

## 业务中有没有对直播流做一些加密

嗯，业务中上行流的推送主要依赖的是腾讯云和七牛云的服务，前端本身是没有对视频流做一些加密的，不过本身的业务是有针对某些身份的用户开放一些隐私直播间的。

另外一些登陆用户是通过一套 userSig 来加密的。

## 遇到过流卡顿么？有哪些原因会造成流卡顿？

1. 主播手机性能较差，推流侧生成的视频帧率太低。一般的话 FPS 达到每秒 15 帧以上。
2. 上传的阻塞，主播侧网络不好，上传速度较慢。
3. 用户侧的网络情况不佳，带宽不够，下载速度慢。

## 怎么去优化这些问题呢？

- 帧率太低的话：
  1. 推荐主播使用性能较好的手机，不要过多的去开启其他应用，以免占用 CPU。
  2. 在较佳的网络环境进行直播，根据自身的情况选择合适的推流分辨率。
- 上传阻塞的话：
  1. 给予主播侧提示，自行关注网络情况。
- 播放端的话：
  1. 根据用户的网络情况去拉取适配当前带宽的流。
  2. 如果是使用 HSL 流，合理的减小每个切片的大小。

## HSL 的延时较大有做什么对应的解决方案么？

有的，主要是做了以下的一些处理。

1. 在公众号内部通过引导到微信小程序端来提供更流畅低延时的直播。
2. 在 PC 以及其他浏览器上优先使用 FLV 格式的直播，兜底使用 HSL 流。
3. 对 TS 文件大小进行压缩，每个 TS 文件切割成 4s 左右。
4. 在浏览器上尝试使用 WebRTC 流进行播放。

## 如何去做的判断网络环境。

- 通过`navigator.onLine`判断联网，断网也是通过监听事件。
- chrome 下可以使用`navigator.connection.type`。
- 微信环境内可以依赖`WeixinJSBridge`来检测。

## 在做播放器的时候有没有碰到一些坑呢？

1. 比如说同层播放问题，需要使用`x5-video-player-type="h5-page"`。
2. 自动播放问题，在 ios 微信上可以，需要在`WeixinJSBridge`redy 后播放，一些 PC 上通过设置后可以。巡检系统采用静音的自动播放，其他会尝试自动播放失败的话会显示对应的播放按钮。
3. 局域播放，本身在 ios 下会自动全屏，需要配置`webkit-playsinline playsinline`属性。
4. ios 只支持 m3u8 流，安卓部分机型支持 flv，PC 上也是这样。

## React 中的 useState 是如何实现的？

首先是 Fiber 架构是一种双缓存树的结构，里面有一个`current树`和`workInProgress树`。

在`workInProgress树`中有个`memoizedState`属性，里面以链表的形式存放着 hooks 的相关信息。

另外还有个`updateQueue`，每个 hooks 初始化都会创建一个 hook 对象，然后将 hook 的 memoizedState 保存当前 effect hook 信息。

## Hooks 的初始化和更新流程是怎么样的？

- 初始化总结：
  - 每个 hooks 依次执行，产生一个 hook 对象，并形成链表结构绑定在 workInProgress 的 memoizedState 属性上，hooks 中的状态绑定在当前 hooks 对象的 memoizedState 属性上。
  - 对于 effect 副作用钩子，会绑定在 workInProgress.updateQueue 上，等到 commit 阶段，DOM 树构建完成，再执行每个 effect 副作用钩子。

## React 15 和 16 有什么区别

相较于 React15，React16 中新增了`Scheduler（调度器）`。

## React 18 有什么新的特性

1. 自动批量更新(Automatic batching)
2. startTransition
3. New Suspense SSR Architecture

新 API：

1. useSyncExternalStore
2. useInsertionEffect
3. useId
4. useDeferredValue

## 手写实现 debounce

```js
function debounce(fn, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(context, ...args);
    });
  };
}

function debounce(fn, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    let callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    });
    callNow && fn.apply(context, ...args);
  };
}
```

## 手写实现数组去重

```js
const uniqueArr = (arr) => [...new Set(arr)];
```

## 手写实现函数柯里化

```js
const curry = (fn) =>
  (judge = (...args) =>
    args.length === fn.length ? fn(...args) : (arg) => judge(...args, arg));
```

## 手写实现数组扁平化

```js
const flat = (arr, dep = Infinity) => {
  if (dep == Infinity) {
    return [].concat(...arr.map((v) => (Array.isArray(v) ? flat(v) : v)));
  }
  if (dep === 1) {
    return arr.reduce((a, v) => a.concat(v), []);
  }
  return arr.reduce(
    (a, v) => a.concat(Array.isArray(v) ? flat(v, dep - 1) : v),
    [],
  );
};
// 栈的思想
const flat = (arr) => {
  const result = [];
  // 将数组元素拷贝至栈
  const stack = [...arr];
  // 如果栈不为空，则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop();
    if (Array.isArray(val)) {
      // 如果是数组再次入栈，并且展开一层
      stack.push(...val);
    } else {
      // 这里如果是空位的话，继续continue
      if (val === undefined) {
        continue;
      }
      result.unshift(val);
    }
  }

  return result;
};
```

## 算法：两数之和

OK

- 双层遍历 findIndex 找差值。
- 双层遍历直接找差值
- 使用 hash 表

## 算法：回文链表

- 双指针法构造值数组，首位比较
- 快慢指针法，翻转链表，查询中点

## 算法：爬楼梯

- 动态规划

## 算法：合并两个有序列表

- 递归

## 算法：环形链表

- 哈希表，没有访问过则存节点，访问过则有环。
- 快慢指针，如果快指针一直没有交叉那么无环。

## 算法：删除列表中的节点

- 节点下移

## 算法：删除链表中的重复元素

- 单次遍历，节点下移
- 递归

## 算法：斐波那契数

- 递归
- 动态规划版爬楼梯

## 算法：设计 Hash 集合

- 可以使用 Set 结构来模拟

## 算法：相交链表

- 使用 hash 集合，先将一个链表存起来，存完之后进行遍历，查找另外一个链表中的元素是否在这个 hash 中出现过。

## 算法：回文数

- 迭代+首尾比较
- 直接反转进行比较

## 算法：有效的括号

- 暴力解法，直接将所有的括号都替换成空，判断返回的长度
- 栈+哈希表

## 算法：链表的中间节点

- 快慢指针
- 链表转一维数组

## 算法：反转字符串

不能使用额外的数组空间。

- 二分循环，遍历到数组的中间值，然后反转对应下标的元素
- 双指针法

## 算法：两数相加

- 补全短的数组，相加的时候考虑进位
