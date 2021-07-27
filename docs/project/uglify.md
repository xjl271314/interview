---
title: uglify.js
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 前端代码是如何进行压缩的?

- 2021.07.19

在日益变大的前端项目中，代码压缩是必不可少的环节，那么如何压缩代码体积？

## 去除多余字符: 空格，换行及注释

例如下面的两数求和的代码，代码在没被压缩前是`63 Byte`的大小。

```js
// 对两个数求和
function sum(a, b) {
  return a + b;
}
```

![sum.js](https://img-blog.csdnimg.cn/20210719185735910.png)

一般来说`中文`会占用更大的空间，多余的`空白字符`会占用大量的体积，如`空格`，`换行符`，另外`注释`也会占用文件体积。当我们把所有的空白符合注释都去掉之后，代码体积会得到减少。

我们试着去掉多余字符之后，文件大小已经变为 `29 Byte`。 压缩后代码如下:

```bash
function sum(a,b){return a+b}
```

![sum 压缩后](https://img-blog.csdnimg.cn/20210719190250727.png)

替换掉多余字符后会有什么问题产生呢？

**有，比如多行代码压缩到一行时要注意行尾分号。**该问题的解决就会用到之前学过的 `ast`。

## 压缩变量名：变量名，函数名及属性名

```js
function sum(first, second) {
  return first + second;
}
```

如以上 `first` 与 `second` 在函数的作用域中，在`作用域外`不会引用它，此时可以让它们的变量名称更短。但是如果这是一个 `module` 中，`sum` 这个函数也不会被导出呢？那可以把这个函数名也缩短。

```js
// 压缩: 缩短变量名
function sum(x, y) {
  return x + y;
}

// 再压缩: 去除空余字符
function s(x, y) {
  return x + y;
}
```

在这个示例中，当完成`代码压缩 (compress)`时，代码的`混淆 (mangle)`也捎带完成。 但此时缩短变量的命名也需要 `AST` 支持，不至于在作用域中造成命名冲突。

## 采用更简单的表达：合并声明以及布尔值简化

```bash
// 压缩前
const a = 3;
const b = 4;

// 压缩后
const a = 3,b = 4;

// 压缩前
!b && !c && !d && !e;

// 压缩后
!(b || c || d || e);
```

上述压缩的方式都会使用到 AST，代码的压缩过程大致如下所示，`code -> AST -> (transform)一颗更小的AST -> code`，这与 `babel` 和 `eslint` 的流程一模一样。

![Babel AST转化](https://img-blog.csdnimg.cn/2021071918511488.jpeg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 使用 uglify.js

上述提供了几种压缩的思路，其实在前端项目中[uglify.js](https://github.com/mishoo/UglifyJS)都已经帮我们处理好了。

`webpack` 中内置的代码压缩插件就是使用了它，它的工作流程大致如下：

```js
// 原始代码
const code = `const a = 3;`;

// 通过 UglifyJS 把代码解析为 AST
const ast = UglifyJS.parse(code);
ast.figure_out_scope();

// 转化为一颗更小的 AST 树
compressor = UglifyJS.Compressor();
ast = ast.transform(compressor);

// 再把 AST 转化为代码
code = ast.print_to_string();
```

我们执行下 `uglifyjs sum.js -m -o sum.min.js`，再来看看上面的实例:

```js
// 压缩前

// 对两个数求和
function sum(a, b) {
  return a + b;
}

// 压缩后
function sum(n, u) {
  return n + u;
}
```

其中官方提供的语法是:

> uglifyjs [input files] [options]

其中常用的参数列表如下:

| 参数名称      | 描述                                                                                                                                                              |
| :------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --source-map  | 配置 source-map 相关的属性                                                                                                                                        |
| -o,--output   | 指定输出文件，默认情况下为命令行                                                                                                                                  |
| -b,--beautify | 美化代码格式的参数                                                                                                                                                |
| -m,--mangle   | 改变变量名称（ex：在一些例如 YUI Compressor 压缩完的代码后你可以看到)a,b,c,d,e,f 之类的变量，加了-m 参数，uglifyjs 也可以做到，默认情况下，是不会改变变量名称的） |
| -r,--reserved | 保留的变量名称，不需要被-m 参数改变变量名的                                                                                                                       |
| -c,--compress | 这是让 uglifyjs 进行代码压缩的参数。可以在-c 后边添加 一些具体的参数来控制压缩的特性，下文中会具体介绍。                                                          |
| --comments    | 用来控制注释的代码                                                                                                                                                |
| --keep-fnames | 不要混淆、干掉的函数的名字。当代码依赖 `Function.prototype.name` 时有用。                                                                                         |
