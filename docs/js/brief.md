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

## 14.为什么 17 之前每个页面都需要 import React from 'react';?

`JSX`在编译时会被`Babel`编译为`React.createElement`方法。

如果不显示声明的话，在运行时该模块内就会报未定义变量 `React`的错误。

## 15.跨域请求如何携带 cookie?

1. 前端请求时在`request对象`中配置`withCredentials: true`；
2. 服务端在`response`的`header`中配置`Access-Control-Allow-Origin, http://xxx:${port}`;
3. 服务端在`response`的`header`中配置`"Access-Control-Allow-Credentials", "true"`。

## 16. javascript 有哪些数据类型?

### 基本数据类型

1. `undefined`
2. `null`
3. `number`
4. `string`
5. `boolean`
6. `symbol`(ES6 中加入的变量类型)
7. `bigInt`(ES10 中加入的变量类型)

### 引用数据类型

1. object

### 值的存储

- 基本数据类型的值是存储在`栈`中的简单数据。
- 引用数据类型是存储在`堆(内存)`中的对象。

与其他语言不同，`JavaScript`不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。

- 当复制保存着对象的某个变量时，操作的是`对象的引用`。

- 但在为对象添加属性时，操作的是`实际的对象`。

## 17. 装箱和拆箱是什么?

- 装箱转换：把`基本类型`转换为对应的`包装类型`。
- 拆箱操作：把`引用类型`转换为`基本类型`。

### 自动装箱和拆箱

`原始类型`是不能扩展属性和方法，那么我们是如何使用`原始类型`调用方法的呢？

**每当我们操作一个基础类型时，后台就会自动创建一个包装类型的对象，从而让我们能够调用一些方法和属性，例如下面的代码**：

```js
const name = 'Linda';
const name2 = name.substring(2);
```

上述代码的执行过程:

1. 创建一个 `String` 的包装类型实例.
2. 在实例上调用 `substring` 方法.
3. 销毁实例.

也就是说，我们使用`基本类型调用方法`，就会自动进行 `装箱` 和 `拆箱` 操作，相同的，我们使用 `Number` 和 `Boolean` 类型时，也会发生这个过程。

## 18. valueOf 和 toString 有什区别?

- 引用类型转换为 `Number` 类型，先调用 `valueOf`，再调用 `toString`。
- 引用类型转换为 `String` 类型，先调用 `toString`，再调用 `valueOf`。

若 `valueOf` 和 `toString` 都不存在，或者没有返回基本类型，则抛出 `TypeError` 异常。

## 19. parseInt 与 parseFloat

### parseInt

`parseInt` 会忽略字符串前面的空格，直至找到第一个**非空格字符**。如果第一个字符不是`数字字符`或者`负号`，`parseInt()` 就会返回 `NaN`，也就是说，用 `parseInt()` 转换空字符串会返回 `NaN`。

```js
parseInt(''); //NaN
Number(''); //0
```

如果第一个字符是数字字符，`parseInt()` 会继续解析第二个字符，直到解析完所有后续字符或者遇到了一个非数字字符。

```js
var num1 = parseInt('1234blue'); // 1234
var num2 = parseInt(''); // NaN
var num4 = parseInt(22.5); // 22
var num3 = parseInt('0xA'); // 10（十六进制数）
var num5 = parseInt('070'); // 56（八进制数）
var num6 = parseInt('70'); // 70（十进制数）
```

### parseFloat

与 `parseInt()` 函数类似，`parseFloat()` 也是从第一个字符开始解析每个字符。而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止，但其只能解析十进制值，因此它没有用第二个参数指定基数的用法。

```js
var num1 = parseFloat('1234blue'); // 1234 （整数）
var num2 = parseFloat('0xA'); // 0 在parseInt中的返回值是10
var num3 = parseFloat('22.5'); // 22.5
var num4 = parseFloat('22.34.5'); // 22.34
var num5 = parseFloat('0908.5'); // 908.5
var num6 = parseFloat('3.125e7'); // 31250000
```

## 20. toString() 和 String() 有什么区别?

### 共同

两者都是用于将其他类型转化为字符串类型。

### 区别

- `Number`、`Boolean`、`Object` 和 `String` 类型都有 `toString()`方法。但 `null` 和 `undefined` 值没有这个方法。

- `Number类型`调用 `toString()` 方法时，可以传递一个参数：**输出数值的基数**。

  ```js
  var num = 10;
  alert(num.toString()); // "10"
  alert(num.toString(2)); // "1010"
  alert(num.toString(8)); // "12"
  alert(num.toString(10)); // "10"
  alert(num.toString(16)); // "a"
  ```

- `String()`函数遵循下列转换规则：

  - 如果值有 `toString()`方法，则调用该方法（没有参数）并返回相应的结果；
  - 如果值是`null`，则返回`"null"`；
  - 如果值是`undefined`，则返回`"undefined"`。

  ```js
  var value1 = 10;
  var value2 = true;
  var value3 = null;
  var value4;
  alert(String(value1)); // "10"
  alert(String(value2)); // "true"
  alert(String(value3)); // "null"
  alert(String(value4)); // "undefined"
  ```

## 21. `Object` 的每个实例都有哪些方法和属性?

- `constructor`：保存着用于创建当前对象的函数。对于`const obj = new Object();`而言，就是`Object()`。
- `hasOwnProperty(propertyName)`：用于检查给定的属性在当前对象实例中（而不是在实例的原型中)是否存在。 其中，作为参数的属性`propertyName`必须以**字符串**形式指定（例如：`obj.hasOwnProperty("name")`)。

- `isPrototypeOf(object)`：用于检查传入的对象是否是传入对象的原型。

- `propertyIsEnumerable(propertyName)`：用于检查给定的属性是否能够使用`for-in`语句来枚举。与 `hasOwnProperty()`方法一样，作为参数的属性名必须以**字符串**形式指定。

- `toLocaleString()`：返回对象的字符串表示，该字符串与执行环境的地区对应。

- `toString()`：返回对象的字符串表示。

- `valueOf()`：返回对象的字符串、数值或布尔值表示。通常与`toString()`方法的返回值相同。

由于在 `ECMAScript` 中 `Object` 是所有对象的基础，因此所有对象都具有这些基本的属性和方法。

## 22. 控制语句的 Completion Record 机制

js 中表示一个语句执行完成之后的结果，它有 3 个字段:

- `type`: 表示完成的类型，有`break`、`continue`、`return`、`throw`和 `normal` 几种类型。

- `value`: 表示语句的返回值，如果语句没有返回值，则是 empty。

- `target`: 表示语句的目标，通常是一个 javascript 标签。

`Javascript`正是依靠语句的`Completion Record`类型才可以在语句的复杂嵌套结构中，实现各种控制。

![控制语句](https://img-blog.csdnimg.cn/20201109135343908.jpg?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

## 23. length 属性

- 函数的 length：表示函数希望接收多少个参数。

  ```js
  function a(x, y) {}
  a.length; // 2
  ```

- 数组的 length：表示数组的长度，可以通过修改长度来控制数组的长度。

  ```js
  const arr = [1, 2, 3];
  arr.length = 0;
  console.log(arr); // []
  ```

- 字符串的 length：表示字符串的长度。

  ```js
  const str = '123';
  str.length = 0;
  console.log(str); // '123' 并不能修改，是个只读属性
  ```

## 24. 数据属性和访问器属性

### 数据属性

数据属性包含一个数据值的位置。在这个位置可以读取和写入值。数据属性有 4 个描述其行为的特性：

- `Configurable`: 表示能否通过`delete`删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。直接在对象上定义的属性，它们的这个特性默认值为 true。

- `Enumerable`: 表示能否通过 `for-in` 循环返回属性。直接在对象上定义的属性，它们的这个特性默认值为 `true`。

- `Writable`: 表示能否修改属性的值。直接在对象上定义的属性，它们的这个特性默认值为 `true`。

- `Value`: 包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 `undefined`。

要修改属性默认的特性，可以使用`Object.defineProperty()`方法。

```js
// 接收三个参数：属性所在的对象、属性的名字和一个描述符对象。
var person = {};
Object.defineProperty(person, 'name', {
  writable: false,
  value: 'Nicholas',
});
alert(person.name); // "Nicholas"
person.name = 'Greg';
alert(person.name); // "Nicholas"
```

### 访问器属性

访问器属性不包含数据值；它们包含一对儿 `getter` 和 `setter` 函数。

- `Configurable`：表示能否通过 `delete` 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为`true`。

- `Enumerable`：表示能否通过 `for-in` 循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为`true`。

- `Get`：在读取属性时调用的函数。默认值为`undefined`。

- `Set`：在写入属性时调用的函数。默认值为`undefined`。

访问器属性不能直接定义，必须使用 `Object.defineProperty()`来定义。

```js
var book = {
  _year: 2004,
  edition: 1,
};
Object.defineProperty(book, 'year', {
  get: function () {
    return this._year;
  },
  set: function (newValue) {
    if (newValue > 2004) {
      this._year = newValue;
      this.edition += newValue - 2004;
    }
  },
});
book.year = 2005;
alert(book.edition); //2
```

## 25. for 循环方法详解

### for ... in ...

在使用 `for-in` 循环时，返回的是所有能够通过对象访问的、可枚举的（enumerated）属性，其中既包括存在于`实例中的属性`，也包括存在于`原型中的属性`。原型中不可枚举属性（即将 Enumerable 标记为 false 的属性）的实例属性也会在`for-in`循环中返回。

### Object.keys()

要取得对象上所有`可枚举的实例属性`，可以使用`Object.keys()`方法。这个方法接收一个对象作为参数，返回一个包含所有可枚举属性的`字符串数组`。

### Object.getOwnPropertyNames()

如果你想要得到所有实例属性(包含了 `constructor` )，无论它是否可枚举，都可以使 `Object.getOwnPropertyNames()` 方法。

```js
function Person() {}

Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
  alert(this.name);
};

var keys = Object.keys(Person.prototype);
alert(keys); // "name,age,job,sayName"

var p1 = new Person();
p1.name = 'Rob';
p1.age = 31;
var p1keys = Object.keys(p1);
alert(p1keys); // "name,age"

var keys = Object.getOwnPropertyNames(Person.prototype);
alert(keys); // "constructor,name,age,job,sayName"
```

## 26. 为什么说 setTimeout 有个最小 4ms 的延迟?

我们先来看一下`html standard10-13`描述中的定义:

```js
10. If timeout is less than 0, then set timeout to 0.
11. If nesting level is greater than 5, and timeout is less than 4, then set timeout to 4.
12. Increment nesting level by one.
13. Let task's timer nesting level be nesting level.
```

从上面的规范可以看出来：

- 如果设置的 timeout 小于 0，则设置为 0。
- 如果嵌套的层级超过了 5 层，并且 timeout 小于 4ms，则设置 timeout 为 4ms。

看似我们已经找到了问题的原因，但是各大浏览器的厂商实际上并没有按照标准的规范进行设定。

在这里我们只展示 `chromium` 的 `source code`，其他 `webkit` 或 `Firefox` 自行下载查看，在 `chromium` 的 `blink` 目录下，有一个 叫做 `DOMTimer.cpp` 的文件，`online` 地址，这里也是用来设置计时器延时的地方：

```c
static const int maxIntervalForUserGestureForwarding = 1000; // One second matches Gecko.
static const int maxTimerNestingLevel = 5;
static const double oneMillisecond = 0.001;
// Chromium uses a minimum timer interval of 4ms. We'd like to go
// lower; however, there are poorly coded websites out there which do
// create CPU-spinning loops.  Using 4ms prevents the CPU from
// spinning too busily and provides a balance between CPU spinning and
// the smallest possible interval timer.
static const double minimumInterval = 0.004;

double intervalMilliseconds = std::max(oneMillisecond, interval * oneMillisecond);
if (intervalMilliseconds < minimumInterval && m_nestingLevel >= maxTimerNestingLevel)
    intervalMilliseconds = minimumInterval;
```

代码逻辑很清晰，设置了三个常量：

- maxTimerNestingLevel = 5。也就是 HTML standard 当中提到的嵌套层级。

- minimumInterval = 0.004。也就是 HTML standard 当中说的最小延迟。

在第二段代码中我们会看到，首先会在 延迟时间 和 `1ms` 之间取一个最大值。换句话说，在不满足嵌套层级的情况下，最小延迟时间设置为 `1ms`。

在 `chromium` 的注释中，解释了为什么要设置 `minimumInterval = 4ms`。简单来讲，本身 `chromium `团队想要设置更低的延迟时间（其实他们期望达到亚毫秒级别），但是由于某些网站（比如纽约时报的网站）对 `setTimeout` 这种计时器不良的使用，设置延迟过低会导致 `CPU-spinning`，因此 `chromium` 做了些 `benchmark` 测试，选定了 `4ms` 作为其 `minimumInterval`。

到这里为止，从浏览器厂商角度和 `HTML standard` 规范角度都解释了 `4ms` 的来源和其更加精确的定义，但是究竟是 `HTML standard` 先做出的设定，还是 `Chromium` 这种浏览器厂商先做出的设定。了解先后顺序的意义在于了解其背后历史，规范和厂商是如何相互促进与制衡的。

`4ms`的出现是后来市场反馈`1ms`的`timer`导致 `CPU Spining`等原因，从`1ms`提升到`4ms`之后大部分机器上都不再产生此现象。以致在后续的浏览器厂商的采用了`4ms`的设定。随后`HTML standard`才进行了相关规范的设定。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n不同浏览器的最低时延会不一致，比如 `chrome` 的最低时延是 `1ms`。而如果 `timer` 嵌套层级很多，那么最低时延是 `4ms`。具体嵌套层级的阈值不同浏览器也不一致，HTML Standard 当中是 >5，chrome 当中是 >=5。';

export default () => <Info title="总结" txt={txt} />;
```

## 27. 如何优雅的处理 async 的错误?

[原文地址](https://xjl271314.github.io/docs/javascript/asyncCatch.html)

```js
function asyncPromise(promise) {
  if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
    return new Promise((res, rej) => {
      rej(new Error('参数必须是 promise'));
    }).catch((err) => {
      return [err, null];
    });
  }

  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      return [err, null];
    });
}

async function task() {
  const [err1, res1] = await asyncPromise(fetch1());

  if (err1) {
    return 'fetch1 error' + err1;
  }

  const [err2, res2] = await asyncPromise(fetch2(res1));

  if (err2) {
    return 'fetch2 error' + err2;
  }

  return res2;
}
```

## 28. 空值合并运算符(??)如何执行？

我们将值既不是 `null` 也不是 `undefined` 的表达式称为`已定义的（defined）`。

执行逻辑是**如果第一个参数不是 `null`、`undefined`，则 `??` 返回第一个参数。否则，返回第二个参数。**

等价于:

```js
result = a !== null && a !== undefined ? a : b;
```

另外需要注意的是:

- `??` 运算符的优先级非常低，仅略高于 `?` 和 `=`，因此在表达式中使用它时请考虑添加`括号`。
- 如果没有明确添加括号，不能将其与 `||` 或 `&&` 一起使用。

## 29. Chrome 常用控制台调试技巧

[掘金文章地址](https://juejin.cn/post/7085135692568723492#heading-10)

## 30. React Hooks 中防抖、节流函数为什么不生效?

我们先来看下 demo:

```jsx
import React, { useState } from 'react';
import { Button, Space } from 'antd';

// 防抖立即执行版
function debounce(fn, delay = 1000) {
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
    }, delay);

    callNow && fn.apply(context, args);
  };
}

// 节流
function throttle(fn, delay = 1000) {
  let previous = 0;
  return function () {
    let context = this;
    let args = arguments;
    let now = Date.now();
    if (now - previous > delay) {
      fn.apply(context, args);
      previous = now;
    }
  };
}

const [state, setState] = useState({
  normalTxt: 0,
  debounceTxt: 0,
  throttleTxt: 0,
});

const normalClick = () => {
  setState((prevState) => ({
    ...prevState,
    normalTxt: Date.now(),
  }));
};

const debounceClick = debounce(() => {
  setState((prevState) => ({
    ...prevState,
    debounceTxt: Date.now(),
  }));
});

const throttleClick = throttle(() => {
  setState((prevState) => ({
    ...prevState,
    throttleTxt: Date.now(),
  }));
});

const App = () => {
  return (
    <div>
      <p>我是普通函数的执行结果{state.normalTxt}</p>
      <p>我是防抖函数的执行结果{state.debounceTxt}</p>
      <p>我是节流函数的执行结果{state.throttleTxt}</p>
      <Space>
        <Button onClick={normalClick}>我没有加防抖节流</Button>
        <Button onClick={debounceClick}>我加了防抖，1秒的限制</Button>
        <Button onClick={throttleClick}>我加了节流，1秒的限制</Button>
      </Space>
    </div>
  );
};
export default () => <App />;
```

上述的代码中点击事件虽然都加了防抖和节流函数，但是实际上并没有起作用。

**这是因为函数式组件每次渲染结束后，内部的变量都会被释放，重新渲染时所有的变量都会被重新初始化，产生的结果就是每一次都注册和执行了 `setTimeout` 函数。**

**要想要得到正确的结果，必须以某种方式存储那些会被删除的变量和方法的引用。这里就可以使用`useCallback` 和 `useRef`来实现。**

```jsx
import React, { useState, useCallback } from 'react';
import { Button, Space } from 'antd';

// 防抖立即执行版
function debounce(fn, delay = 1000) {
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
    }, delay);

    callNow && fn.apply(context, args);
  };
}

// 节流
function throttle(fn, delay = 1000) {
  let previous = 0;
  return function () {
    let context = this;
    let args = arguments;
    let now = Date.now();
    if (now - previous > delay) {
      fn.apply(context, args);
      previous = now;
    }
  };
}

const [state, setState] = useState({
  normalTxt: 0,
  debounceTxt: 0,
  throttleTxt: 0,
});

const normalClick = () => {
  setState((prevState) => ({
    ...prevState,
    normalTxt: Date.now(),
  }));
};

const debounceClick = useCallback(
  debounce(() => {
    setState((prevState) => ({
      ...prevState,
      debounceTxt: Date.now(),
    }));
  }),
  [],
);

const throttleClick = useCallback(
  throttle(() => {
    setState((prevState) => ({
      ...prevState,
      throttleTxt: Date.now(),
    }));
  }),
  [],
);

const App = () => {
  return (
    <div>
      <p>我是普通函数的执行结果{state.normalTxt}</p>
      <p>我是防抖函数的执行结果{state.debounceTxt}</p>
      <p>我是节流函数的执行结果{state.throttleTxt}</p>
      <Space>
        <Button onClick={normalClick}>我没有加防抖节流</Button>
        <Button onClick={debounceClick}>我加了防抖，1秒的限制，执行正常</Button>
        <Button onClick={throttleClick}>我加了节流，1秒的限制，执行正常</Button>
      </Space>
    </div>
  );
};
export default () => <App />;
```

Hooks 版实现

```js
// 防抖
export function useDebounce(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep);
}

// 节流
export function useThrottle(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(
    function () {
      current.fn = fn;
    },
    [fn],
  );
  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn.call(this, ...args);
    }
  }, dep);
}
```

## 31. webpack 的动态 import 实现的原理是什么?

首先`import()`其实是个语法糖，他的本质是`promise`，执行后返回一个`Promise对象`，我们可以在`.then()`里面拿到真正引用的模块。

其次经过 webpack 打包的文件会在`window`下生成一个`webpackJsonp`数组，入口文件会执行`__webpack_require__(index.js)`来引用相对应的文件，入口文件内部会执行`__webpack_require__.e(0)`来拉取异步代码，而我们动态 import 的代码实际上是通过动态创建`script`脚本(类似于 JSONP)的方式被添加到`webpackJsonp`这个数组中在真正使用的地方去`resolve`出来的。

**简单的来说就是通过`动态创建script脚本`并在需要使用的地方执行`Promise`中`.then()`来实现的。**
