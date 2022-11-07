---
title: 内存泄露
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 说说 javascript 的内存泄露?

- 2021.06.25

## 定义

> `内存泄漏`指由于疏忽或错误造成程序未能释放已经不再使用的内存。内存泄漏并非指内存在物理上的消失，而是应用程序分配某段内存后，由于设计错误，导致在释放该段内存之前就失去了对该段内存的控制，从而造成了内存的浪费。

无用的内存还在占用，得不到释放和归还。比较严重时，无用的内存会持续递增，从而导致整个系统卡顿，甚至崩溃。

## js 中的内存泄露

我们知道在 js 中存在垃圾回收机制,会自动回收无用的内存。目前采用的方式大多数都是`标记清除`的方式。但在某些场景下变量并没有离开当前执行环境不会触发自动回收。

- ### 全局变量的无意创建

```js
function foo() {
  b = 2;
  console.log(b);
}

foo(); // 2

console.log(b); // 2
```

开发者的本意是想将变量作为局部变量使用，然而忘记写 `var` 导致变量被泄露到全局中。

- ### 被遗忘的计时器

无用的计时器忘记清理是新手最容易犯的错误之一。

```js
import React from 'react';

export default class App extends React.Component {
  componentDidMount() {
    this.timer = setInterval(function () {
      // 轮询获取数据
      fetch(...);
    }, 2000);
  }
}
```

上面的组件销毁的时候，`setInterval` 还是在运行的，里面涉及到的内存都是没法回收的（浏览器会认为这是必须的内存，不是垃圾内存），需要在组件销毁的时候清除计时器。

```js
import React from 'react';

export default class App extends React.Component {
  componentDidMount() {
    this.timer = setInterval(function () {
      // 轮询获取数据
      fetch(...);
    }, 2000);
  }

  componentWillUnMount(){
      clearInterval(this.timer);
      this.timer = null;
  }
}
```

- ### 被遗忘的 DOM 事件监听

无用的事件监听器忘记清理是也是我们容易犯的错误之一。

```js
import React from 'react';

export default class App extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', () => {
      // 这里做一些操作
    });
  }
}
```

上面的组件销毁的时候，`resize` 事件还是在监听中，里面涉及到的内存都是没法回收的（浏览器会认为这是必须的内存，不是垃圾内存），需要在组件销毁的时候移除相关的事件。

```js
import React from 'react';

export default class App extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.doSomeThing);
  }

  doSomeThing = () => {
    // 这里做一些操作
  };

  componentWillUnMount() {
    window.removeEventListener('resize', this.doSomeThing);
  }
}
```

- ### 被遗忘的 ES6 Set 成员

```js
let map = new Set();
let value = { test: 22 };
map.add(value);

value = null;
```

需要改成这样，才没内存泄漏：

```js
let map = new Set();
let value = { test: 22 };
map.add(value);

map.delete(value);
value = null;
```

有个更便捷的方式，使用 `WeakSet`，`WeakSet` 的成员是弱引用，内存回收不会考虑到这个引用是否存在。

```js
let map = new WeakSet();
let value = { test: 22 };
map.add(value);

value = null;
```

- ### 被遗忘的 ES6 Map 键名

```js
let map = new Map();
let key = new Array(5 * 1024 * 1024);
map.set(key, 1);
key = null;
```

这里和上述的 `Set` 类似，我们也有两种处理方式:

```js
// 方式一
let map = new Map();
let key = new Array(5 * 1024 * 1024);
map.set(key, 1);

map.delete(key);
key = null;

// 方式二
let map = new WeakMap();
let key = new Array(5 * 1024 * 1024);
map.set(key, 1);

key = null;
```

## 内存泄露排查方式

我们借助谷歌的开发者工具， Chrome 浏览器，F12 打开开发者工具来看看如何排查。

### Performance

![Performance1](https://img-blog.csdnimg.cn/20210507140002773.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![Performance2](https://img-blog.csdnimg.cn/2021050714004084.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

点击这个按钮启动记录，然后切换到网页进行操作，录制完成后点击 `stop` 按钮，开发者工具会从录制时刻开始记录当前应用的各项数据情况。

![Performance3](https://img-blog.csdnimg.cn/2021050714012452.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

选中`JS Heap`，下面展现出来的一条蓝线，就是代表了这段记录过程中，JS 堆内存信息的变化情况。

有大佬说，根据这条蓝线就可以判断是否存在内存泄漏的情况：**如果这条蓝线一直成上升趋势，那基本就是内存泄漏了**。其实我觉得这么讲有失偏颇，JS 堆内存占用率上升并不一定就是内存泄漏，只能说明有很多未被释放的内存而已，至于这些内存是否真的在使用，还是说确实是内存泄漏，还需要进一步排查。

![Performance4](https://img-blog.csdnimg.cn/20210507140222654.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**memory**

借助开发者工具的 Memory 选项，可以更精确地定位内存使用情况。

![memory1](https://img-blog.csdnimg.cn/20210507140313678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory2](https://img-blog.csdnimg.cn/20210507140336990.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

当生成了第一个快照的时候，开发者工具窗口已经显示了很详细的内存占用情况。

**字段说明:**

|      字段       | 描述                                                           |
| :-------------: | :------------------------------------------------------------- |
|  `Constructor`  | 占用内存的资源类型                                             |
|   `Distance`    | 当前对象到根的引用层级距离                                     |
| `Shallow Size`  | 对象所占内存（不包含内部引用的其它对象所占的内存）(单位：字节) |
| `Retained Size` | 对象所占总内存（包含内部引用的其它对象所占的内存）(单位：字节) |

将每项展开可以查看更详细的数据信息。

我们再次切回网页，继续操作几次，然后再次生成一个快照。

![memory3](https://img-blog.csdnimg.cn/20210507140701423.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory4](https://img-blog.csdnimg.cn/20210507140719316.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory5](https://img-blog.csdnimg.cn/20210507140739301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

这边需要特别注意这个 `#Delta` ，如果是正值，就代表新生成的内存多，释放的内存少。其中的闭包项，如果是正值，就说明存在内存泄漏。

![memory6](https://img-blog.csdnimg.cn/20210507140819194.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

下面我们到代码里找一个内存泄漏的问题：

![memory7](https://img-blog.csdnimg.cn/20210507141448924.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory8](https://img-blog.csdnimg.cn/20210507141509447.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
