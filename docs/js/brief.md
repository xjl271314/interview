---
title: 经典问答
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 常见的经典问题

- 2022.03.11

## 1. JavaScript 是如何运行的？

JS 代码->解析成 AST (期间伴随词法分析、语法分析)->生成字节码（V8）->生成机器码（编译器）

## 2. JavaScript 中的数组和函数在内存中是如何存储的？

- 数组，主要是以连续内存形式存储的`FixedArray`、以哈希表形式存储的`HashTable`。
- 函数属于引用数据类型，存储在堆中，在栈内存中只是存了一个地址来表示对堆内存中的引用。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

## 3. ES6 Modules 相对于 CommonJS 的优势是什么？

- `CommonJS`和`ES6 Module`都可以对引入的对象进行赋值，即对对象内部属性的值进行改变；
- `CommonJS` 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。即`ES6 Module`只存只读，不能改变其值，具体点就是指针指向不能变；
- `CommonJS` 模块是运行时加载，ES6 模块是编译时输出接口。
- `CommonJS` 模块的`require()`是`同步加载`模块，ES6 模块的`import`命令是`异步加载`，有一个独立的模块依赖的解析阶段。
- `import` 的接口是 `read-only（只读状态）`，不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部指针指向，可以对 `CommonJS` 对重新赋值（改变指针指向），但是对 `ES6 Module` 赋值会编译报错。

优势:

`CommonJS` 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 `ES6 Modules`不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

## 4. 编译器一般由哪几个阶段组成？数据类型检查一般在什么阶段进行？

编译器一般由 4 个阶段工作完成：

- Parse 阶段：V8 引擎负责将 JS 代码转换成 AST（抽象语法树）；
- Ignition 阶段：解释器将 AST 转换为字节码，解析执行字节码也会为下一个阶段优化编译提供需要的信息；
- TurboFan 阶段：编译器利用上个阶段收集的信息，将字节码优化为可以执行的机器码；
- Orinoco 阶段：垃圾回收阶段，将程序中不再使用的内存空间进行回收。

**数据类型检查一般在 `Parse` 阶段之前 就进行了，因为在生成 AST 之前 就要进行语法分析，提取出句子的结构。**

广义来说输入一般是程序的源码，输出一般是`语法树（syntax tree，也叫parse tree等）`或`抽象语法树（abstract syntax tree，AST）`。

进一步剥开来，广义的解析器里一般会有`扫描器（scanner，也叫tokenizer或者lexical analyzer，词法分析器）`，以及`狭义的解析器（parser，也叫syntax analyzer，语法分析器）`。

扫描器的输入一般是文本，经过词法分析，输出是将文本切割为单词的流。

狭义的解析器输入是单词的流，经过语法分析，输出是语法树或者精简过的 AST。

## 5. JavaScript 中的 const 数组可以进行 push 操作吗？为什么？

可以，也可以进行`splice()`操作。

const 声明创建一个值的只读引用。但这并不意味着它所持有的值是不可变的，只是变量标识符不能重新分配。例如，在引用内容是对象的情况下，这意味着可以改变对象的内容（例如，其参数）。

## 6. Object.defineProperty 和 ES6 的 Proxy 有什么区别？

### Proxy

- `Proxy`可以直接监听整个对象而非属性。
- `Proxy`可以直接监听数组的变化。
- `Proxy`有 13 中拦截方法，如`ownKeys`、`deleteProperty`、`has` 等是 `Object.defineProperty` 不具备的。
- `Proxy`返回的是一个新对象，我们可以只操作新的对象达到目的，而`Object.defineProperty`只能遍历对象属性直接修改;
- Proxy 做为新标准将受到浏览器产商重点持续的性能优化,也就是传说中的新标准的性能红利。

### Object.defineProperty

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平。

缺点:

- `Object.defineProperty` 只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历。
- `Object.defineProperty`不能监听数组。是通过重写数据的那 7 个可以改变数据的方法来对数组进行监听的。
- `Object.defineProperty` 也不能对 `es6` 新产生的 `Map`,`Set` 这些数据结构做出监听。
- `Object.defineProperty`也不能监听新增和删除操作，通过 `Vue.set()`和 `Vue.delete`来实现响应式的。

## 7. TypeScript 中同名的 interface 或者同名的 interface 和 class 可以合并吗？

同名`interface`接口会自动合并，`interface`同名的`class`也会自动聚合。 但`type`不能自动聚合，因为`type`声明不能重名。

## 8. 谈谈你对 SourceMap 的了解？

`sourceMap`就是一个信息文件，里面储存着打包前的位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。有了它，出错的时候，浏览器控制台将直接显示原始代码出错的位置，而不是转换后的代码，点击出错信息将直接跳转到原始代码位置。方便定位和解决问题。

## 9. 如何调试 Node.js 代码？在浏览器中如何调试 Node.js 代码？

- 在服务端用 inspect 模式运行 nodejs

```js
node --inspect-brk=0.0.0.0:8080 index.js
```

- 打开 chrome 浏览器 地址栏输入`chrome://inspect`,在弹出的界面中输入`ip:port`即可调试。

## 10. 什么是事件代理（事件委托） 有什么好处?

事件委托的原理：不给每个子节点单独设置事件监听器，而是设置在其父节点上，然后利用冒泡原理设置每个子节点。

优点：

- 减少内存消耗和 dom 操作，提高性能。

  在 JavaScript 中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能，因为需要不断的操作 dom,那么引起浏览器重绘和回流的可能也就越多，页面交互的事件也就变的越长，这也就是为什么要减少 dom 操作的原因。每一个事件处理函数，都是一个对象，多一个事件处理函数，内存中就会被多占用一部分空间。如果要用事件委托，就会将所有的操作放到 js 程序里面，只对它的父级进行操作，与 dom 的操作就只需要交互一次，这样就能大大的减少与 dom 的交互次数，提高性能；

- 动态绑定事件。

  因为事件绑定在父级元素 所以新增的元素也能触发同样的事件。

## 11. apply call bind 区别?

- 三者都可以改变函数的 `this` 对象指向。
- 三者第一个参数都是 `this` 要指向的对象，如果如果没有这个参数或参数为 `undefined` 或 `null`，则默认指向全局 `window`。
- 三者都可以传参，但是 `apply` 是数组，而 `call` 是参数列表，且 `apply` 和 `call` 是一次性传入参数，而 `bind` 可以分为多次传入。
- `bind` 是返回绑定 `this` 之后的函数，便于稍后调用；`apply` 、`call` 则是立即执行 。
- `bind()`会返回一个新的函数，如果这个返回的新的函数作为构造函数创建一个新的对象，那么此时 `this` 不再指向传入- 给 `bind` 的第一个参数，而是指向用 `new` 创建的实例。

## 12. Vue2 中的响应式和 Vue3 中的有什么区别?

### Vue2

1. Vue2 里的响应式其实有点像是一个半完全体，对于对象上新增的属性无能为力，对于数组则需要拦截它的原型方法来实现响应式。

   这种时候，Vue 提供了一个 api：`this.$set`，来使得新增的属性也拥有响应式的效果。

2. Vue2 的响应式是基于`Object.defineProperty`进行拦截的。

### Vue3

1. Vue3 的响应式是通过 Proxy 来进行拦截的。

   Vue2 中，对于给定的 `data`，如 `{ count: 1 }`，是需要根据具体的 `key` 也就是 `count`，去对「修改 data.count 」 和 「读取 data.count」进行拦截，也就是:

   ```js
   Object.defineProperty(data, 'count', {
     get() {},
     set() {},
   });
   ```

   必须预先知道要拦截的 key 是什么，这也就是**为什么 Vue2 里对于对象上的新增属性无能为力。**

   而 Vue3 所使用的 Proxy，则是这样拦截的：

   ```js
   new Proxy(data, {
     get(key) {},
     set(key, value) {},
   });
   ```

   可以看到，根本不需要关心具体的 key，它去拦截的是 「修改 data 上的任意 key」 和 「读取 data 上的任意 key」。

   所以，不管是已有的 key 还是新增的 key，都逃不过它的魔爪。

## 13. escape、encodeURI、encodeURIComponent 区别？

### escape()

通常用于对字符串编码，不适用于对 URL 编码。

除了 ASCII 字母、数字和特定的符号外，对传进来的字符串全部进行转义编码，因此如果想对 URL 编码，最好不要使用此方法。

escape 不会编码的字符有 69 个：`* + - . / @ _ 0-9 a-z A-Z`。

当然如果没有必要，不要使用 escape。

### encodeURI()

`encodeURI()`不会进行编码的字符有 `82` 个 ：`; , / ? : @ & = + $ - _ . ! ~ * ' ( ) # 0-9 a-z A-Z`

使用`encodeURI()`编码后的结果是除了空格之外的其他字符都原封不动，只有空格被替换成了`%20`，`encodeURI`主要用于直接赋值给地址栏。

### encodeURIComponent()

`encodeURIComponent`:不会进行编码的字符有 71 个：`! ' ( ) * - . _ ~ 0-9 a-z A-Z`;

`encodeURIComponent` 比 `encodeURI` 编码的范围更大，如 `encodeURIComponent` 会把 `http://` 编码成 `http%3A%2F%2F` 而 `encodeURI` 不解码维持 `http://`。

`encodeURIComponent()` 方法在编码单个 `URIComponent`（指请求参数）应当是最常用的，它可以将参数中的中文、特殊字符进行转义，而不会影响整个 URL

### 如何选择和使用三个函数?

- 如果只是编码字符串，和 URL 没有关系，才可以用 escape。（但它已经被废弃，尽量避免使用，应用 encodeURI 或 encodeURIComponent）;
- 如果需要编码整个 URL，然后需要使用这个 URL，那么用 encodeURI;
- 如果需要编码 URL 中的参数的时候，那么 encodeURIComponent 是最好方法。
