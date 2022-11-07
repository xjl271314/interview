---
title: 执行栈
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javaScript 代码执行上下文

- 2022.02.16

## 栈

栈是一种`后进先出`的数据结构。

![请添加图片描述](https://img-blog.csdnimg.cn/d202017e32394e7c836fb9906fb52f24.png)

## JavaScript 的调用栈

`JavaScript引擎`正是利用栈的这种结构来管理执行上下文的。在执行上下文创建好后，JavaScript 引擎会将执行上下文压入栈中，通常把这种用来管理执行上下文的栈称为`执行上下文栈`，又称`调用栈`。

我们通过一个示例来了解栈的执行顺序:

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

上述代码中 `sum` 方法调用了 `add` 函数，我们看看调用栈的变化情况。

- 第一步，创建全局上下文，并将其压入栈底。如下图所示:

    <img src="https://img-blog.csdnimg.cn/2a0ac515125744fa94a72ac4d1b01fa0.png" width="400px" />

  `变量a`、`函数add` 和 `sum` 都保存到了全局上下文的变量环境对象中。

  全局执行上下文压入到调用栈后，JavaScript 引擎便开始执行全局代码了。首先会执行`a=1`的赋值操作，执行该语句会将全局上下文变量环境中`a`的值设置为 1。

    <img src="https://img-blog.csdnimg.cn/46482b14172647d186fbfaa156e6478f.png" width="500px" />

- 第二步是调用`sum函数`。当调用该函数时，`JavaScript引擎`会编译该函数，并为其创建一个执行上下文，最后将该函数的执行上下文压入栈中，如下图所示：

    <img src="https://img-blog.csdnimg.cn/3d3c55d782d8448b883cb44e0419c10a.png" width="400px" />

  `sum函数`的执行上下文创建好之后，便进入了函数代码的执行阶段了，这里先执行的是`b=2`的赋值操作，执行语句会将`sum函数`执行上下文中的`b`由`undefined`变成了`2`。

- 第三步，当执行到`add函数`调用语句时，同样会为其创建执行上下文，并将其压入调用栈，如下图所示：

    <img src="https://img-blog.csdnimg.cn/e900b9b8832943729b5209f7a2cc5864.png" width="400px" />

  当`add函数`返回时，该函数的执行上下文就会从栈顶弹出，并将`result`的值设置为`add函数`的返回值，也就是`7`。如下图所示：

    <img src="https://img-blog.csdnimg.cn/14bb4889433949c39e511cc112697019.png" width="400px" />

  紧接着`sum`执行最后一个相加操作后并返回，`sum函数`的执行上下文也会从栈顶部弹出，此时调用栈中就只剩下全局上下文了。最终如下图所示：

    <img src="https://img-blog.csdnimg.cn/3d8b9ac5ef8846be893142692bece1d2.png" width="400px" />

至此，整个`JavaScript`流程执行结束了。

## 在开发中，如何利用好调用栈

### 1. 如何利用浏览器查看调用栈的信息

当你执行一段复杂的代码时，你可能很难从代码文件中分析其调用关系，这时候你可以在你想要查看的函数中加入断点，然后当执行到该函数时，就可以查看该函数的调用栈了。

我们继续使用上述代码，然后打开`开发者工具`，点击`Source标签`，选择`JavaScript代码`的页面，然后在第 13 行加上断点，并刷新页面。我们可以看到执行到`add函数`时，执行流程就暂停了，这时可以通过右边`call stack`来查看当前的调用栈的情况，如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f912b7dae8804daf81936335c31c8a16.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

从图中可以看出，右边的`call stack`下面显示出来了函数的调用关系：栈的最底部是`anonymous`，也就是全局的函数入口；中间是`sum`函数；顶部是`add函数`。这就清晰地反映了函数的调用关系，所以在分析复杂结构代码，或者检查 Bug 时，调用栈都是非常有用的。

除了通过断点来查看调用栈，我们还可以使用`console.trace()`来输出当前的函数调用关系，比如在示例代码中的`add函数`里面加上了`console.trace()`，我们就可以看到控制台输出的结果，如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ea9046c0e98469b8cdac26bc4414762.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_9,color_FFFFFF,t_70,g_se,x_16)
