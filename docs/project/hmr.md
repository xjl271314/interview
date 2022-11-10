---
title: webpack热更新原理
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# webpack 热更新原理

- 2021.06.01

`Webpack热更新`又称`热替换（Hot Module Replacement）`，缩写为 `HMR`。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

主要是通过`websocket`实现，建立`本地服务`和`浏览器`的双向通信。当代码变化，重新编译后，通知浏览器请求更新的模块，替换原有的模块。

![原理图](https://img-blog.csdnimg.cn/20210601220809990.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

1. 通过`webpack-dev-server`开启`server`服务，本地`server`启动之后，再去启动`websocket`服务，建立`本地服务`和`浏览器`的双向通信。

2. `webpack`每次编译后，会生成一个`Hash`值，`Hash`代表每一次编译的标识。本次输出的`Hash`值会编译新生成的文件标识，被作为下次热更新的标识。

3. `webpack`监听文件变化（主要是通过文件的生成时间判断是否有变化），当文件变化后，重新编译。

4. 编译结束后，通知浏览器请求变化的资源，同时将新生成的 hash 值传给浏览器，用于下次热更新使用。

5. 浏览器拿到更新后的模块后，用新模块替换掉旧的模块，从而实现了局部刷新。

## 补充:编译构建过程

项目启动后，进行构建打包，控制台会输出构建过程，并生成一个本地构建得到的 Hash 值.

在我们每次修改代码保存后，控制台会输出 `Compiling构建过程`，触发新的编译。

![编译过程](https://img-blog.csdnimg.cn/666e7ae0a98c48eea7ef469dc2fd8fee.png)

编译完成后会生成本地构建新的 Hash 值以及一个新的 json 文件和 js 文件。

![新的json、js文件](https://img-blog.csdnimg.cn/184c839224184b899ffb8badb36f5b93.png)

- 首先看 json 文件，返回的结果中，h 代表本次新生成的 Hash 值，用于下次文件热更新请求的前缀。c 表示当前要热更新的文件对应模块。
- 再看下生成的 js 文件，那就是本次修改的代码，重新编译打包后的。

比如我们只是修改了`hmr.md`这个文件

![文件](https://img-blog.csdnimg.cn/7484d8e3a6bf4fa6aceae8298369b87a.png)

## 源码对应的构件图

[参考文章地址](https://juejin.cn/post/6844904008432222215)

![源码](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/1/16ec13499800dfce~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)
