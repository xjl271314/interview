---
title: 代码执行顺序
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# javaScript 代码执行顺序

- 2022.02.16

## 引文

这里有这么一段代码，我们来看下执行结果:

```js
showMsg();
console.log(msg);
var msg = '极客时间';
function showMsg() {
  console.log('函数showMsg被执行');
}
```

首先我们都知道 `JavaScript` 是按顺序执行的。若按照这个逻辑来理解的话，那么：

- 当执行到第 1 行的时候，由于函数`showMsg`还没有定义，所以执行应该会报错；
- 同样执行第 2 行的时候，由于变量`msg`函数也未定义，所以同样也会报错；

然而实际的执行结果是:

![执行结果](https://img-blog.csdnimg.cn/a8ccfac5b0074ebb8a187efeaef95c0d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

我们知道造成这个结果的原因是因为存在`变量提升`的功能，使用 `var` 和 `函数声明` 的方式可以形成变量提升。

但是假设我们使用了未定义的变量或者函数，代码的执行结果是什么?

```js
console.log(msg);
showMsg();
function showMsg() {
  console.log('函数showMsg被执行');
}
```

上述代码中，我们把 `msg` 的定义给删除了，现在的执行结果是:

![执行结果](https://img-blog.csdnimg.cn/7b626ec495bb414d8460fe4c87db0534.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

从上面两段代码的执行结果来看，我们可以得出如下结论。

1. 执行过程中，若使用了未声明的变量，那么 JavaScript 执行会报错，此时后面的代码不会继续执行。
2. 执行过程中，如果使用 `var` 和 `函数声明` 的方式可以形成变量提升。

## 代码执行顺序

实际上一段 JavaScript 代码在执行之前需要被`JavaScript引擎`编译，编译完成之后，才会进入执行阶段。大致流程如下：

**一段 JavaScript 代码 ----> 编译阶段 ----> 执行阶段**

### 编译阶段

编译阶段和变量提升存在什么关系呢？

我们引用上述的代码，将其分割成 2 个部分:

- 第一部分：变量提升部分的代码。

  ```js
  var msg = undefined;
  function showMsg() {
    console.log('函数showMsg被执行');
  }
  ```

- 第二部分：执行部分的代码。

  ```js
  showMsg();
  console.log(msg);
  msg = '极客时间';
  ```

![js编译流程](https://img-blog.csdnimg.cn/919eb773296643d8959385c50a002f26.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

上述的代码在 js 引擎解析的时候会先进行编译操作，编译完成后会生成 2 部分的内容：`执行上下文` 和 `可执行代码`。

执行上下文是 JavaScript 执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的诸如 this、变量、对象以及函数等。

在执行上下文中存在一个`变量环境的对象（Viriable Environment）`，该对象中保存了变量提升的内容，比如上面代码中的变量`msg`和`函数showMsg`，都保存在该对象中。

我们可以简单的把变量环境对象看成如下的结构:

```js
VariableEnvironment:
    msg -> undefined,
    showMsg ->function : {console.log('函数showMsg被执行')}
```

了解完变量环境对象结构后，我们再分析下如何生成变量环境对象。

```js
showMsg();
console.log(msg);
var msg = '极客时间';
function showMsg() {
  console.log('函数showMsg被执行');
}
```

- 第 1 行和第 2 行，由于这两行代码不是声明操作，所以 JavaScript 引擎不会做任何处理；
- 第 3 行，由于这行是经过 var 声明的，因此 JavaScript 引擎将在环境对象中创建一个名为 msg 的属性，并使用 undefined 对其初始化；
- 第 4 行，JavaScript 引擎发现了一个通过 function 定义的函数，所以它将函数定义存储到`堆(HEAP）`中，并在环境对象中创建一个 showMsg 的属性，然后将该属性值指向堆中函数的位置。

### 执行阶段

当开始执行的时候，还是按照顺序一行一行地执行。

- 当执行到 showMsg 函数时，JavaScript 引擎便开始在变量环境对象中查找该函数，由于变量环境对象中存在该函数的引用，所以 JavaScript 引擎便开始执行该函数，并输出`函数showMsg被执行`结果。
- 接下来打印`msg`信息，JavaScript 引擎继续在变量环境对象中查找该对象，由于变量环境存在 msg 变量，并且其值为 undefined，所以这时候就输出 undefined。
- 接下来执行第 3 行，把“极客时间”赋给 msg 变量，赋值后变量环境中的 msg 属性值改变为“极客时间”，变量环境如下所示：

```js
VariableEnvironment:
     msg -> "极客时间",
     showMsg ->function : {console.log('函数showMsg被执行')}
```

以上就是一段代码的编译和执行流程。实际上，编译阶段和执行阶段都是非常复杂的，包括了`词法分析`、`语法解析`、`代码优化`、`代码生成`等过程。

## 引申

### 代码中出现相同的变量或者函数怎么办？

```js
function showMsg() {
  console.log(1);
}

showMsg();

function showMsg() {
  console.log(2);
}

showMsg();
```

我们来分析下上述代码的完整执行流程：

- 首先是编译阶段。遇到了第一个 showMsg 函数，会将该函数体存放到变量环境中。接下来是第二个 showMsg 函数，继续存放至变量环境中，但是变量环境中已经存在一个 showMsg 函数了，此时，第二个 showMsg 函数会将第一个 showMsg 函数覆盖掉。这样变量环境中就只存在第二个 showMsg 函数了。
- 接下来是执行阶段。先执行第一个 showMsg 函数，但由于是从变量环境中查找 showMsg 函数，而变量环境中只保存了第二个 showMsg 函数，所以最终调用的是第二个函数，打印的内容是`2`。第二次执行 showMsg 函数也是走同样的流程，所以输出的结果也是`2`;

**因此一段代码如果定义了两个相同名字的函数，那么最终生效的是最后一个函数。**

引申思考:

```js
showMsg();

var showMsg = function () {
  console.log(2);
};

function showMsg() {
  console.log(1);
}

showMsg();
```

- 编译阶段

```js
var showMsg;
function showMsg() {
  console.log(1);
}
```

- 执行阶段

```js
showMsg(); // 1
showMsg = function () {
  console.log(2);
};
showMsg(); // 2
```

### 多个 script 标签执行顺序的问题

假设我们的 html 文件中有多个`script`标签。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>demo</title>
    <script type="text/javascript">
      console.log(a);
    </script>
  </head>
  <body>
    <script type="text/javascript">
      console.log(1);
    </script>
    <div class="app">我是网页的内容</div>
  </body>
</html>
```

- 上述代码中首先执行了`console.log(a)`然后产生了一个错误。
- 接着执行了`console.log(1)`输出了 1，并且页面也成功渲染了内容。

  ![示例](https://img-blog.csdnimg.cn/5c3e9129a7664aef8bf5690d6f33fdb7.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)
