---
title: DOM事件模型
nav:
  title: 前端基础
  path: /base
group:
  title: html、浏览器相关试题
  path: /html/project
---

# 说说 DOM 中的事件模型?

- 2021.06.23

## 监听函数

浏览器的事件模型，就是通过`监听函数（listener）`对事件做出反应。事件发生后，浏览器监听到了这个事件，就会执行对应的监听函数。这是`事件驱动编程模式（event-driven）`的主要编程方式。

在 `DOM` 中，事件就是文档或浏览器窗口中发生的一些特定的交互瞬间。

## 事件流

> 事件流描述的是从页面中接收事件的顺序。

事件流主要包括两种形式: `事件冒泡`和`事件捕获`。

- ### 事件冒泡

> 事件开始时由最具体的元素（文档中嵌套层次最深的那个节点）接收，然后逐级向上传播到较为不具体的节点（document）。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Event Bubbling Example</title>
  </head>

  <body>
    <div id="myDiv">Click Me</div>
  </body>
</html>
```

例如我们单击了页面中的`<div>`元素，那么这个`click`事件会按照如下顺序传播：

![事件冒泡](https://img-blog.csdnimg.cn/20200118145640940.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- ### 事件捕获

> 事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。**事件捕获的用意在于在事件到达预定目标之前捕获它**。

![事件捕获](https://img-blog.csdnimg.cn/20200118145806967.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 捕获与冒泡

我们都知道`捕获过程是从外向内`，`冒泡过程是从内向外`,那么为什么需要`事件捕获和冒泡`呢?

这里引用一个故事:

我们现代的 UI 系统，都源自 `WIMP 系统`。`WIMP` 即 `Window Icon Menu Pointer` 四个要素，它最初由施乐公司研发，后来被微软和苹果两家公司应用在了自己的操作系统上。

`WIMP` 是由 `Alan Kay` 主导设计的，这位巨匠，同时也是面向对象之父和 `Smalltalk` 语言之父。

乔布斯曾经受邀参观施乐，他见到当时的 `WIMP` 界面，认为非常惊艳，不久后就领导苹果研究了新一代`麦金塔系统`。

后来，在某次当面对话中，乔布斯指责比尔盖茨抄袭了 WIMP 的设计，盖茨淡定地回答：“史蒂夫，我觉得应该用另一种方式看待这个问题。这就像我们有个叫施乐的有钱邻居，当我闯进去想偷走电视时，却发现你已经这么干了。”

但是不论如何，苹果和微软的数十代操作系统，极大地发展了这个体系，才有了我们今天的 UI 界面。

回归到之前的问题上。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '实际上点击事件来自触摸屏或者鼠标，鼠标点击并没有位置信息，但是一般操作系统会根据位移的累积计算出来，跟触摸屏一样，提供一个坐标给浏览器。\n\n那么，把这个坐标转换为具体的元素上事件的过程，就是捕获过程了。而冒泡过程，则是符合人类理解逻辑的：当你按电视机开关时，你也按到了电视机。\n\n<strong>所以我们可以认为，捕获是计算机处理事件的逻辑，而冒泡是人类处理事件的逻辑。</strong>';

export default () => <Info type="info" txt={txt} />;
```

我们来看个例子：

```html
<body>
  <input id="i" />
</body>

<script>
  document.body.addEventListener(
    'mousedown',
    () => {
      console.log('key1');
    },
    true,
  );

  document.getElementById('i').addEventListener(
    'mousedown',
    () => {
      console.log('key2');
    },
    true,
  );

  document.body.addEventListener(
    'mousedown',
    () => {
      console.log('key11');
    },
    false,
  );

  document.getElementById('i').addEventListener(
    'mousedown',
    () => {
      console.log('key22');
    },
    false,
  );

  // key1 key2 key22 key11
</script>
```

**在一个事件发生时，捕获过程跟冒泡过程总是先后发生，跟你是否监听毫无关联。**

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '在我们实际监听事件时，我建议这样使用冒泡和捕获机制：默认使用冒泡模式，当开发组件时，遇到需要父元素控制子元素的行为，可以使用捕获机制。';

export default () => <Info type="info" txt={txt} />;
```

理解了冒泡和捕获的过程，我们再看监听事件的 API，就非常容易理解了。

## document.addEventListener(event, function, useCapture)

> 该方法用于将事件处理程序附加到文档。

其中参数说明如下:

- `event`：事件名称
- `function`：事件处理函数
- `useCapture`：采用事件捕获还是事件冒泡(默认是 false，代表使用事件冒泡)。

**事件处理函数不一定是函数，也可以是个 `JavaScript` 具有 `handleEvent` 方法的对象，看下例子：**

```js
var o = {
  handleEvent: (event) => console.log(event),
};
document.body.addEventListener('keydown', o, false);
```

**第三个参数不一定是 bool 值，也可以是个对象，它提供了更多选项。**

- `once`：只执行一次。
- `passive`：承诺此事件监听不会调用 `preventDefault`，这有助于性能。
- `useCapture`：采用捕获（否则冒泡）。

实际使用，在现代浏览器中，还可以不传第三个参数，我建议默认不传第三个参数，因为冒泡是符合正常的人类心智模型的，大部分业务开发者不需要关心捕获过程。除非你是组件或者库的使用者，那就总是需要关心冒泡和捕获了。

## 自定义事件

除了来自输入设备的事件，还可以`自定义事件`，实际上事件也是一种非常好的代码架构，但是 `DOM API` 中的事件并不能用于普通对象，所以很遗憾，我们只能在 `DOM` 元素上使用自定义事件。

那么如何进行自对应事件呢?

代码示例如下（来自 MDN）：

```js
var evt = new Event('look', { bubbles: true, cancelable: false });
document.dispatchEvent(evt);
```

这里我们使用 `Event 构造器`来创造了一个新的事件，然后调用 `dispatchEvent` 来在特定元素上触发。

我们可以给这个 `Event` 添加自定义属性、方法。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '注意，这里旧的自定义事件方法（使用 `document.createEvent` 和 `initEvent`）已经被废弃。';

export default () => <Info type="warning" txt={txt} />;
```

## DOM 事件流

`DOM2 级`事件规定的事件流包括三个阶段：`事件捕获阶段`、`处于目标阶段`和`事件冒泡阶段`。

1. 首先发生的是事件捕获，为截获事件提供了机会。
2. 然后是实际的目标接收到事件。
3. 最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

![事件流](https://img-blog.csdnimg.cn/20200118155006628.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

在 DOM 事件流中，实际的目标（`<div>`元素）在捕获阶段不会接收到事件。

这意味着在`捕获阶段`，事件从 `document` 到`<html>`再到`<body>`后就停止了。

下一个阶段是`处于目标`阶段，于是事件在`<div>`上发生，并在事件处理中被看成冒泡阶段的一部分。然后，冒泡阶段发生，事件又传播回文档。

## DOM 事件处理程序

DOM 事件处理程序就是我们上述的`监听函数`的概念。诸如 `click`、`load` 和 `mouseover`，都是事件的名字。而响应某个事件的函数就叫做事件处理程序（或事件侦听器）。

在 DOM 事件处理程序中包含了多种类别。

- ### HTML 中的 on 属性

> HTML 语言允许在元素的属性中，直接定义某些事件的监听代码。

```html
<body onload="doSomething()">
  <div onclick="console.log('触发事件')"></div>
</body>
```

例如我们在上述代码中为 `body 元素`的加载事件，`div 元素`的点击事件绑定了方法。当事件发生的时候就会触发相应的方法。

元素的事件监听属性，都是 `on` 加上事件名，比如 `onload` 就是 `on + load`，表示 `load` 事件的监听代码。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt = '注意，这些属性的值是将会执行的代码，而不是一个函数。';

export default () => <Info type="warning" txt={txt} />;
```

```html
<!-- 正确 -->
<body onload="doSomething()"></body>

<!-- 错误 -->
<body onload="doSomething"></body>
```

一旦指定的事件发生，`on-属性`的值是原样传入 `JavaScript 引擎`执行。因此如果要执行函数，不要忘记加上一对圆括号。

使用这个方法指定的监听代码，只会在`冒泡阶段`触发。

```html
<div onclick="console.log(2)">
  <button onclick="console.log(1)">点击</button>
</div>
```

上面代码中，`<button>`是`<div>`的子元素。`<button>`的 click 事件，也会触发`<div>`的 click 事件。由于 `on-属性`的监听代码，只在冒泡阶段触发，所以点击结果是先输出 1，再输出 2，即事件从子元素开始冒泡到父元素。

直接设置 `on-属性`，与通过元素节点的 `setAttribute` 方法设置 `on-属性`，效果是一样的。

```js
el.setAttribute('onclick', 'doSomething()');
// 等同于
// <Element onclick="doSomething()">
```

- ### DOM0 级事件处理程序

> 通过 `JavaScript` 指定事件处理程序的传统方式，就是将一个函数赋值给一个事件处理程序属性。

```js
var btn = document.getElementById('myBtn');
btn.onclick = function () {
  alert('Clicked');
};
```

在此，我们通过文档对象取得了一个按钮的引用，然后为它指定了 `onclick` 事件处理程序。但要注意，在这些代码运行以前不会指定事件处理程序，因此如果这些代码在页面中位于按钮后面，就有可能在一段时间内怎么单击都没有反应。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '使用`DOM0级`方法指定的事件处理程序被认为是元素的方法。因此，这时候的事件处理程序是在元素的作用域中运行；换句话说，程序中的 `this` 引用当前元素。';

export default () => <Info type="warning" txt={txt} />;
```

来看一个例子:

```js
var btn = document.getElementById('myBtn');
btn.onclick = function () {
  alert(this.id); // "myBtn"
};
```

`DOM0 级`添加的事件处理程序会在事件流的`冒泡阶段`被处理。

也可以删除通过 DOM0 级方法指定的事件处理程序，只要像下面这样将事件处理程序属性的值设置为 `null` 即可：

```js
btn.onclick = null; // 删除事件处理程序
```

将事件处理程序设置为 `null` 之后，再单击按钮将不会有任何动作发生。

### DOM2 级事件处理程序

> `DOM2 级事件`定义了两个方法，用于处理指定和删除事件处理程序的操作：`addEventListener()`和 `removeEventListener()`。

所有 DOM 节点中都包含这两个方法，并且它们都接受 3 个参数：

```js
/**
 * eventName
 * handler
 * capture | bind
 */
var btn = document.getElementById('myBtn');
btn.addEventListener(
  'click',
  function () {
    alert(this.id);
  },
  false,
);
```

上面的代码为一个按钮添加了 `onclick` 事件处理程序，而且该事件会在`冒泡阶段`被触发。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '与 DOM0级方法一样，这里添加的事件处理程序也是在其依附的元素的作用域中运行。\n\n使用DOM2 级方法添加事件处理程序的主要好处是可以添加多个事件处理程序。';

export default () => <Info type="info" txt={txt} />;
```

```js
var btn = document.getElementById('myBtn');
btn.addEventListener(
  'click',
  function () {
    alert(this.id);
  },
  false,
);

btn.addEventListener(
  'click',
  function () {
    alert('Hello world!');
  },
  false,
);
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '通过 `addEventListener()`添加的事件处理程序只能使用 `removeEventListener()`来移除；移除时传入的参数与添加处理程序时使用的参数相同。\n\n这也意味着通过 `addEventListener()`添加的`匿名函数`将无法移除，如下面的例子所示:';

export default () => <Info type="warning" txt={txt} />;
```

```js
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function(){
    alert(this.id);
}
// 这里省略了其他代码
btn.removeEventListener("click", function(){ // 没有用！
    alert(this.id);
}, false);
```

### IE 事件处理程序

`IE` 实现了与 `DOM` 中类似的两个方法：`attachEvent()`和 `detachEvent()`。这两个方法接受相同的两个参数：`事件处理程序名称`与`事件处理程序函数`。

由于 `IE8` 及更早版本只支持事件冒泡，所以通过 `attachEvent()`添加的事件处理程序都会被添加到冒泡阶段。

```js
var btn = document.getElementById('myBtn');
btn.attachEvent('onclick', function () {
  alert('Clicked');
});
```

**注意，`attachEvent()`的第一个参数是`onclick`，而非 `DOM` 的 `addEventListener()`方法中的`click`。**

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '在 `IE` 中使用 `attachEvent()`与使用 `DOM0 级方法`的主要区别在于事件处理程序的作用域。\n\n在使用 DOM0 级方法的情况下，事件处理程序会在其所属元素的作用域内运行；在使用 `attachEvent()`方法的情况下，事件处理程序会在全局作用域中运行，因此 `this` 等于 `window`。\n\n不过，与 DOM方法不同的是，这些事件处理程序不是以添加它们的顺序执行，而是以相反的顺序被触发。';

export default () => <Info type="info" txt={txt} />;
```

## 事件对象

在触发 `DOM` 上的某个事件时，会产生一个事件对象 `event`，这个对象中包含着所有与事件有关的信息。包括导致事件的元素、事件的类型以及其他与特定事件相关的信息。

兼容 DOM 的浏览器会将一个 `event` 对象传入到`事件处理程序`中。无论指定事件处理程序时使用什么方法（DOM0 级 或 DOM2 级），都会传入 `event` 对象。

```js
var btn = document.getElementById('myBtn');
btn.onclick = function (event) {
  alert(event.type); // "click"
};
btn.addEventListener(
  'click',
  function (event) {
    alert(event.type); // "click"
  },
  false,
);
```

event 对象包含与创建它的特定事件有关的属性和方法。触发的事件类型不一样，可用的属性和方法也不一样。不过，所有事件都会有下表列出的成员。

![event1](https://img-blog.csdnimg.cn/20200118162558216.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![event2](https://img-blog.csdnimg.cn/20200118162609475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### target 与 currentTarget

在事件处理程序内部，对象 `this` 始终等于 `currentTarget` 的值，而 `target` 则只包含事件的`实际目标`。

- 如果直接将事件处理程序指定给了目标元素，则 `this`、`currentTarget` 和 `target` 包含相同的值。

```js
var btn = document.getElementById('myBtn');
btn.onclick = function (event) {
  alert(event.currentTarget === this); // true
  alert(event.target === this); // true
};
```

- 如果事件处理程序存在于按钮的父节点中（例如 document.body），那么这些值是不相同的。

```js
document.body.onclick = function (event) {
  alert(event.currentTarget === document.body); // true
  alert(this === document.body); // true
  alert(event.target === document.getElementById('myBtn')); // true
};
```

当单击这个例子中的按钮时，`this` 和 `currentTarget` 都等于 `document.body`，因为事件处理程序是注册到这个元素上的。然而，`target` 元素却等于按钮元素，因为它是 `click` 事件真正的目标。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '因此简单的理解就是`currentTarget`保存着事件的`真实注册者`，`target`保存着`事件触发的目标`。';

export default () => <Info type="info" txt={txt} />;
```

### 阻止默认事件与阻止冒泡

要阻止特定事件的默认行为，可以使用 `preventDefault()`方法。另外，`stopPropagation()`方法用于立即停止事件在 `DOM` 层次中的传播，即取消进一步的事件捕获或冒泡。

### 获取事件流阶段

**事件对象的 `eventPhase` 属性，可以用来确定事件当前正位于事件流的哪个阶段。**

- 如果是在捕获阶段调用的事件处理程序，那么 `eventPhase` 等于 1；
- 如果事件处理程序处于目标对象上，则 `eventPhase` 等于 2；
- 如果是在冒泡阶段调用的事件处理程序，`eventPhase` 等于 3。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '这里要注意的是，尽管`处于目标`发生在冒泡阶段，但 `eventPhase` 仍然一直等于 2。';

export default () => <Info type="warning" txt={txt} />;
```

```js
var btn = document.getElementById('myBtn');
btn.onclick = function (event) {
  alert(event.eventPhase); // 2
};
document.body.addEventListener(
  'click',
  function (event) {
    alert(event.eventPhase); // 1
  },
  true,
);
document.body.onclick = function (event) {
  alert(event.eventPhase); // 3
};

// 1————>2————>3
```

## 事件类型

Web 浏览器中可能发生的事件有很多类型。如前所述，不同的事件类型具有不同的信息，而`DOM3 级事件`规定了以下几类事件。

- `UI（User Interface，用户界面）事件`，当用户与页面上的元素交互时触发；
- `焦点事件`，当元素获得或失去焦点时触发；
- `鼠标事件`，当用户通过鼠标在页面上执行操作时触发；
- `滚轮事件`，当使用鼠标滚轮（或类似设备）时触发；
- `文本事件`，当在文档中输入文本时触发；
- `键盘事件`，当用户通过键盘在页面上执行操作时触发；
- `合成事件`，当为 IME（Input Method Editor，输入法编辑器）输入字符时触发；
- `变动（mutation）事件`，当底层 DOM 结构发生变化时触发。

### UI 事件

- `load`：当页面完全加载后在 `window 上面触发`，当所有框架都加载完毕时在框架集上面触发,当图像加载完毕时在`<img>`元素上面触发，或者当嵌入的内容加载完毕时在`<object>`元素上面触发。

- `unload`：当页面完全卸载后在 `window` 上面触发，当所有框架都卸载后在框架集上面触发，或者当嵌入的内容卸载完毕后在`<object>`元素上面触发。**只要用户从一个页面切换到另一个页面，就会发生 `unload`事件**。

- `abort`：在用户停止下载过程时，如果嵌入的内容没有加载完，则在`<object>`元素上面触发。

- `error`：当发生 `JavaScript` 错误时在 `window` 上面触发，当无法加载图像时在`<img>`元素上面触发，当无法加载嵌入内容时在`<object>`元素上面触发，或者当有一或多个框架无法加载时在框架集上面触发。

- `select`：当用户选择文本框（`<input>`或`<texterea>`）中的一或多个字符时触发。

- `resize`：当窗口或框架的大小变化时在 `window`或框架上面触发。

- `scroll`：当用户滚动带滚动条的元素中的内容时，在该元素上面触发。`<body>`元素中包含所加载页面的滚动条。

### 键盘事件

![键盘事件表1](https://img-blog.csdnimg.cn/20200118170047850.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![键盘事件表2](https://img-blog.csdnimg.cn/20200118170127834.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### hashchange 事件

`HTML5` 新增了 `hashchange` 事件，以便在 `URL` 的参数列表（及 URL 中“#”号后面的所有字符串）发生变化时通知开发人员。

```js
EventUtil.addHandler(window, 'hashchange', function (event) {
  alert('Current hash: ' + location.hash);
  alert('Old URL: ' + event.oldURL + '\n' + New URL: ' + event.newURL);
});
```

### orientationchange 事件

苹果公司为移动 `Safari` 中添加了 `orientationchange` 事件，以便开发人员能够确定用户何时将设备由横向查看模式切换为纵向查看模式。

移动 `Safari` 的 `window.orientation`属性中可能包含 如下值：

- 0 表示肖像模式，
- 90 表示向左旋转的横向模式（“主屏幕”按钮在右侧），
- -90 表示向右旋转的横向模式（“主屏幕”按钮在左侧）。
- 180 表示 iPhone 头朝下；

![iphoneOrienttation](https://img-blog.csdnimg.cn/20200118171048812.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### deviceorientation 事件

`deviceorientation` 事件的意图是告诉开发人员设备在空间中朝向哪儿，而不是如何移动。

### 触摸事件

- `touchstart`：当手指触摸屏幕时触发；即使已经有一个手指放在了屏幕上也会触发。
- `touchmove`：当手指在屏幕上滑动时连续地触发。在这个事件发生期间，调用`preventDefault()`可以阻止滚动。
- `touchend`：当手指从屏幕上移开时触发。
- `touchcancel`：当系统停止跟踪触摸时触发。

上面这几个事件都会冒泡，也都可以取消。虽然这些触摸事件没有在 `DOM` 规范中定义，但它们却是以兼容 DOM 的方式实现的。

除了常见的 `DOM` 属性外，触摸事件还包含下列三个用于跟踪触摸的属性。

- `touches`：表示当前跟踪的触摸操作的 `Touch` 对象的数组。
- `targetTouchs`：特定于事件目标的 `Touch` 对象的数组。
- `changeTouches`：表示自上次触摸以来发生了什么改变的 `Touch` 对象的数组。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '<strong style="color:#333">在触摸屏幕上的元素时，这些事件（包括鼠标事件）发生的顺序如下：</strong>\n\n1. `touchstart`\n\n2. `mouseover`\n\n3. `mousemove`（一次）\n\n4. `mousedown`\n\n5. `mouseup`\n\n6. `click`\n\n7. `touchend`';

export default () => <Info type="info" txt={txt} />;
```

### 手势事件

iOS 2.0 中的 `Safari` 还引入了一组手势事件。当两个手指触摸屏幕时就会产生手势，手势通常会改变显示项的大小，或者旋转显示项。有三个手势事件，分别介绍如下：

- `gesturestart`：当一个手指已经按在屏幕上而另一个手指又触摸屏幕时触发。
- `gesturechange`：当触摸屏幕的任何一个手指的位置发生变化时触发。
- `gestureend`：当任何一个手指从屏幕上面移开时触发。

只有两个手指都触摸到事件的接收容器时才会触发这些事件。在一个元素上设置事件处理程序，意味着两个手指必须同时位于该元素的范围之内，才能触发手势事件（这个元素就是目标）。

由于这些`事件冒泡`，所以将事件处理程序放在文档上也可以处理所有手势事件。此时，事件的目标就是两个手指都位于其范围内的那个元素。

触摸事件和手势事件之间存在某种关系。当一个手指放在屏幕上时，会触发 `touchstart` 事件。如果另一个手指又放在了屏幕上，则会先触发 `gesturestart` 事件，随后触发基于该手指的 `touchstart`事件。如果一个或两个手指在屏幕上滑动，将会触发 `gesturechange` 事件。但只要有一个手指移开，就会触发 `gestureend` 事件，紧接着又会触发基于该手指的 `touchend` 事件。

## 事件委托

> 对`事件处理程序过多`问题的解决方案就是`事件委托`。事件委托利用了`事件冒泡`，只指定一个事件处理程序，就可以管理某一类型的所有事件。

在使用事件时，需要考虑如下一些内存与性能方面的问题。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '<strong style="color:#333">在使用事件时，需要考虑如下一些内存与性能方面的问题：</strong>\n\n1. 有必要限制一个页面中事件处理程序的数量，数量太多会导致占用大量内存，而且也会让用户感觉页面反应不够灵敏。\n\n2. 建立在事件冒泡机制之上的`事件委托`技术，可以有效地减少事件处理程序的数量。\n\n3. 建议在浏览器卸载页面之前移除页面中的所有事件处理程序。';

export default () => <Info type="warning" txt={txt} />;
```
