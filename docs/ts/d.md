---
title: 声明拓展
nav:
  title: 工程化
  path: /project
  order: 3
group:
  title: typescript
  path: /typescript/project
---

# ts 声明拓展

- 2024.01.16

## TypeScript 模块解析规则

TS 中的加载策略分为两种方式，分别为`相对路径`和`绝对路径`两种方式。

### 相对路径

`TypeScript` 将 `TypeScript` 源文件扩展名`（.ts、.tsx和.d.ts）`覆盖在 `Node` 的解析逻辑上。

同时`TypeScript` 还将使用`package.json`named 中的一个字段 types 来镜像目的"main"- 编译器将使用它来查找“主”定义文件以进行查阅。

比如这样一段代码:

```ts
// 假设当前执行路径为 /root/src/module a

import { b } from './moduleb';
```

此时，TS 对于 `./moduleb` 的加载方式其实是和 `node` 的模块加载机制比较类似：

- 首先寻找 `/root/src/moduleb.ts` 是否存在，如果存在使用该文件。
- 其次寻找 `/root/src/moduleb.tsx` 是否存在，如果存在使用该文件。
- 其次寻找 `/root/src/moduleb.d.ts` 是否存在，如果存在使用该文件。
- 其次寻找 `/root/src/moduleB/package.json`，如果 `package.json` 中指定了一个`types`属性的话那么会返回该文件。
- 如果上述仍然没有找到，之后会查找 `/root/src/moduleB/index.ts`。
- 如果上述仍然没有找到，之后会查找 `/root/src/moduleB/index.tsx`。
- 如果上述仍然没有找到，之后会查找 `/root/src/moduleB/index.d.ts`。

Ts 在寻找文件路径时，在某些条件下是会按照目录去查找 `.d.ts` 的。

### 非相对导入

在了解了相对路径的加载方式之后，我们来看看关于所谓的非相对导入是 TS 是如何解析的。

比如下面这段代码：

```ts
// 假设当前文件所在路径为 /root/src/modulea

import { b } from 'moduleb';
```

typescript 针对于非相对导入的 moduleb 会按照以下路径去当前路径的 `node_modules` 中去查找，如果上述仍然未找到。

- `/root/src/node_modules/moduleB.ts`
- `/root/src/node_modules/moduleB.tsx`
- `/root/src/node_modules/moduleB.d.ts`
- `/root/src/node_modules/moduleB/package.json（如果它指定了一个types属性）`
- `/- root/src/node_modules/@types/moduleB.d.ts`
- `/root/src/node_modules/moduleB/index.ts`
- `/root/src/node_modules/moduleB/index.tsx`
- `/root/src/node_modules/moduleB/index.d.ts`

此时，TS 仍然会按照 `node` 的模块解析规则，继续向上进行目录查找，比如又会进入上层目录 `/root/node_modules/moduleb.ts ...`进行查找，直到查找到顶层 `node_modules` 也就是最后一个查找的路径为 `/node_modules/moduleB/index.d.ts` 如果未找到则会抛出异常 `can't find module 'moduleb'`。

> 上述查找规则是基于 `tsconfig.json` 中指定的 `moduleResolution:node`，当然还有 `classic` 不过 `classic` 规则是 TS 为了兼容老旧版本，现代代码中基本可以忽略这个模块查找规则。

## 解析 \*.d.ts 声明

上边我们聊了聊 TS 中对于加载两种不同模块的方式，可是日常开发中，经常有这样一种场景。

比如，在 TS 项目中我们需要引入一些后缀为 png 的图片资源，那么此时 TS 是无法识别此模块的。

![png](https://pic3.58cdn.com.cn/nowater/webim/big/n_v2daf09a43a0a14541be70d3592e068486.png)

解决方法也非常简单，通常我们会在项目的根目录中也就是和 `tsconfig.json` 平级的`global.d.ts`中添加对应的声明文件 image 图片等对应声明：

```ts
declare module '*.png' {
  const src: string;
  export default src;
}
```

可以看到，通过定义声明文件的方式解决了我们的问题。

可是，你有思考过按照上边的 `typescript` 对于模块的加载方式，它是怎么加载到我们声明的 `global.d.ts` 的吗？

这是一个有意思的问题，按照上边我们提到的模块加载机制要么按照相对模块机制查找，要么按照对应的 node 模块解析机制进行查找。

怎么会查找到定义在项目目录中的 `global.d.ts` 呢？

本质上我们引入任何模块时，加载机制无非就是我们上边提到的两种加载方式。

不过，这里有一个细小的点即是 ts 编译器会处理 `tsconfig.json` 的 `file`、`include`、`exclude` 对应目录下的所有 `.d.ts` 文件：

简单来说，ts 编译器首先会根据 `tsconfig.json` 中的上述三个字段来加载项目内的 `d.ts` 全局模块声明文件，自然由于 '.png' 文件会命中全局加载的 `global.d.ts` 中的 声明的 `module` 所以会找到对应的文件。

> include 在未指定 file 配置下默认为 \*\*，表示 tsc 解析的目录为当前 tsconfig.json 所在的项目文件夹。

## 全局变量

- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象
- interface 和 type 声明全局类型

上述罗列了 6 中全局声明的语句，我们可以通过 `declare` 关键字结合对应的类型，从而在任意 `.d.ts` 中进行全局类型的声明。

比如我们以 namespace 举例：

假设我们的业务代码中存在一个全局的模块对象 MyLib，它拥有一个名为 makeGreeting 的方法以及一个 numberOfGreetings 数字类型属性。

当我们想在 TS 文件中使用该 global 对象时：

![](https://pic1.58cdn.com.cn/nowater/webim/big/n_v2a06005710beb434cb7521b4d541947b7.png)

TS 会告诉我们找不到 myLib。

原因其实非常简单，typescript 文件中本质上是对于我们的代码进行静态类型检查。当我们使用一个没有类型定义的全局变量时，TS 会明确告知找不到该模块。

当然，我们可以选择在该文件内部对于该模块进行定义并且进行导出，Like this:

```ts
export namespace myLib {
  export let makeGreeting: (string: string) => void;
  export let numberOfGreetings: number;
}

let result = myLib.makeGreeting('hello, world');
console.log('The computed greeting is:' + result);
let count = myLib.numberOfGreetings;
```

上述的代码的确在模块文件内部定义了一个 myLib 的命名空间，在该文件中我们的确可以正常的使用 myLib。

可是，在别的模块文件中我们如果仍要使用 myLib 的话，也就意味着我们需要手动再次 import 该 namespace。

这显然是不合理的，所以 TS 为我们提供了全局的文件声明 .d.ts 来解决这个问题。

**我们可以通过在 ts 的编译范围内声明 [name].d.ts 来定义全局的对象的命名空间。 比如：**

![](https://pic2.58cdn.com.cn/nowater/webim/big/n_v205e7da3ca2824917a6f545e9be92b7d0.png)

可以看到上图的右边，此时当我们使用 myLib 时， TS 可以正确的识别到他是 myLib 的命名空间 。

> 如果你的 [name].d.ts 不生效，那么仔细检查你的 tsconfig.json -> include 设置～

虽然说随着 ES6 的普及，ts 文件中的 namespcae 已经逐渐被淘汰掉了。

但是在类型声明文件中使用 declare namespace xxx 声明类似全局对象仍然是非常实用的方法。
