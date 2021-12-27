---
title: MutationObserver 与 IntersectionObserver
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: MutationObserver 与 IntersectionObserver
  path: /javascript/project
---

# MutationObserver 与 IntersectionObserver

- 2021.12.27

## MutationObserver

### 定义

> `MutationObserver` 接口提供了监视对 `DOM` 树所做更改的能力，当 DOM 对象树发生任何变动时，`MutationObserver` 会得到通知。它被设计为旧的 `Mutation Events` 功能的替代品，该功能是 `DOM3 Events` 规范的一部分。

### 支持情况

> 目前已经被广泛支持。

![MutationObserver支持情况](https://img-blog.csdnimg.cn/d34d4083b2e7417eb90fcc7d30cd7d49.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### 所属类别

`MutationObserver` 属于 `微任务`，同时也是一个`异步任务`。

### 执行逻辑

1. 先执行监听的微任务队列；
2. 执行完微任务队列之后就把所监听的记录封装成一个数组来处理；
3. 然后返回处理结果。

### 参数说明

- MutationObserver 对象方法说明:

  | 参数名                   | 参数描述                                                                                                              |
  | :----------------------- | :-------------------------------------------------------------------------------------------------------------------- |
  | disconnect()             | 阻止 `MutationObserver` 实例继续接收的通知，直到再次调用其`observe()`方法，该观察者对象包含的回调函数都不会再被调用。 |
  | observe(target, options) | 接受两个参数，一个是`监听的对象（target）`，一个是`观察的选项(options)`。化。                                         |
  | takeRecords()            | 清空监听的队列，并返回结果。                                                                                          |

- options 可选参数如下:

  | 参数名                | 参数类型        | 参数描述                                                                                              |
  | :-------------------- | :-------------- | :---------------------------------------------------------------------------------------------------- |
  | childList             | `boolean`       | 设置 true，表示观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化 |
  | attributes            | `boolean`       | 设置 true，表示观察目标属性的改变                                                                     |
  | characterData         | `boolean`       | 设置 true，表示观察目标数据的改变                                                                     |
  | subtree               | `boolean`       | 设置为 true，监听目标以及其后代的变化。                                                               |
  | attributeOldValue     | `boolean`       | 默认为 true，表示需要记录改变前的目标属性值，设置了 attributeOldValue 可以省略 attributes 设置        |
  | characterDataOldValue | `boolean`       | 默认为 true，表示需要记录改变之前的目标数据，设置了 characterDataOldValue 可以省略 characterData 设置 |
  | attributeFilter       | `Array<string>` | 不需要监听的属性列表（此属性填入过滤的属性列表）。                                                    |

### 使用示例

```js
/**
 * @params {function(mutations, observer)} callback 一个用于处理的回调函数
 * @params {sequence<MutationRecord>} mutations 节点变化记录列表
 * @params {object} observer 构造 MutationObserver 对象。
 * @return MutationObserver 对象
 **/

// 选择一个需要观察的节点
const targetNode = document.getElementById('root');

// 设置observer的配置选项
const config = { attributes: true, childList: true, subtree: true };

// 当节点发生变化时的需要执行的函数
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type == 'childList') {
      console.log('A child node has been added or removed.');
    } else if (mutation.type == 'attributes') {
      console.log('The ' + mutation.attributeName + ' attribute was modified.');
    }
  }
};

// 创建一个observer示例并与回调函数相关联
const observer = new MutationObserver(callback);

//使用配置文件对目标节点进行观测
observer.observe(targetNode, config);

// 停止观测
observer.disconnect();
```

### MutationObserver 注意事项

1. 它等待所有脚本任务完成后才会运行，即采用异步方式
2. 它把 DOM 变动记录封装成一个数组进行处理，而不是一条条地个别处理 DOM 变动。
3. 它既可以观察发生在 DOM 节点的所有变动，也可以观察某一类变动
4. 当 DOM 发生变动会触发 `MutationObserver` 事件。但是，它与`事件`有一个本质不同：**事件是同步触发，也就是说 DOM 发生变动立刻会触发相应的事件；MutationObserver 则是异步触发，DOM 发生变动以后，并不会马上触发，而是要等到当前所有 DOM 操作都结束后才触发**。

   举例来说，如果在文档中连续插入 1000 个段落（p 元素），会连续触发 1000 个插入事件，执行每个事件的回调函数，这很可能造成浏览器的卡顿；而 MutationObserver 完全不同，只在 1000 个段落都插入结束后才会触发，而且只触发一次，这样较少了 DOM 的频繁变动，大大有利于性能。

### MutationObserver 业务场景

1. 使用`MutationObserver`来开发一个编辑器，实现撤销、重做等功能。

## IntersectionObserver

在早期网页开发时，常常需要了解某个元素是否进入了`视窗（viewport）`。

传统的实现方法是，监听到 `scroll` 事件后，调用目标元素的 `getBoundingClientRect()` 方法，得到它对应于视口左上角的坐标，再判断是否在视口之内。这种方法的缺点是，由于 `scroll` 事件密集发生，计算量很大，容易造成性能问题。

### 定义

> `IntersectionObserver接口`(从属于`Intersection Observer API`)为开发者提供了一种可以`异步监听`目标元素与其祖先或`视窗(viewport)`交叉状态的手段。祖先元素与`视窗(viewport)`被称为根(root)。

### 支持情况

> 大范围内都已经支持

![在这里插入图片描述](https://img-blog.csdnimg.cn/b876428015604ca6913662a6101e5735.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### 所属类别

`IntersectionObserver` 属于 `微任务`，同时也是一个`异步任务`。相比于 `getBoundingClientRect`，它的优点是不会引起`重绘回流`。

### 参数说明

- IntersectionObserver 构造函数说明:

  | 参数名   | 参数描述                                                                                                                                            |
  | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
  | callback | 回调函数，当元素的可见性变化时，就会触发 callback 函数。callback 函数会触发两次，元素进入视窗（开始可见时）和元素离开视窗（开始不可见时）都会触发。 |
  | options  | 配置对象                                                                                                                                            |

- callback 函数的参数（`entries`）是一个数组，每个成员都是一个 `IntersectionObserverEntry` 对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，entries 数组就会有两个成员:

  | 参数名             | 参数描述                                                                                                                                 |
  | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
  | time               | 可见性发生变化的时间，是一个高精度时间戳，单位为毫秒                                                                                     |
  | target             | 被观察的目标元素，是一个 DOM 节点对象                                                                                                    |
  | isIntersecting     | 目标是否可见                                                                                                                             |
  | rootBounds         | 根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素，就是当前视窗的矩形信息（即直接相对于视口滚动），则返回 null |
  | boundingClientRect | 目标元素的矩形区域的信息                                                                                                                 |
  | intersectionRect   | 目标元素与视口（或根元素）的交叉区域的信息                                                                                               |
  | intersectionRatio  | 目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于 0                             |

- options 说明如下:

  | 参数名     | 参数描述                                                                                                     |
  | :--------- | :----------------------------------------------------------------------------------------------------------- |
  | root       | 用于观察的根元素，默认是浏览器的视口，也可以指定具体元素，指定元素的时候用于观察的元素必须是指定元素的子元素 |
  | threshold  | 用来指定交叉比例，决定什么时候触发回调函数，是一个数组，默认是[0]。                                          |
  | rootMargin | 用来扩大或者缩小视窗的的大小，使用 css 的定义方法，10px 10px 30px 20px 表示 top、right、bottom 和 left 的值  |

- IntersectionObserver 对象方法如下:

  | 参数名            | 参数描述             |
  | :---------------- | :------------------- |
  | observe()         | 开始监听指定元素     |
  | disconnect()      | 关闭监听器           |
  | unobserve(target) | 停止对目标元素的监听 |

### 使用示例

```js
const callback = () => {};

const options = {
  root: document.querySelector('.box'),
  threshold: [0, 0.5, 1],
  rootMargin: '30px 100px 20px',
};

const io = new IntersectionObserver(callback, options);

// 开始观察
io.observe(document.getElementById('example'));

// 停止观察
io.unobserve(element);

// 关闭观察器
io.disconnect();

// 如果要观察多个节点，就要多次调用这个方法。
io.observe(elementA);
io.observe(elementB);
```

### 业务场景

1. 使用`IntersectionObserver`实现图片懒加载

   ```js
   const imgs = document.querySelectorAll('img[data-src]');

   const config = {
     rootMargin: '0px',
     threshold: 0,
   };

   let observer = new IntersectionObserver((entries, self) => {
     entries.forEach((entry) => {
       if (entry.isIntersecting) {
         let img = entry.target;
         let src = img.dataset.src;
         if (src) {
           img.src = src;
           img.removeAttribute('data-src');
         }
         // 解除观察
         self.unobserve(entry.target);
       }
     });
   }, config);

   imgs.forEach((image) => {
     observer.observe(image);
   });
   ```

### 注意事项

`IntersectionObserver()` 的实现和 `requestIdleCallback()` API 一致,即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。
