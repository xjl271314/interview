---
title: package.json
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# package.json 详解

- 2021.11.01

## package.json

`package.json` 包含以下常用内容，完整内容可以查看[官网](https://docs.npmjs.com/cli/v7/configuring-npm/package-json/)

![package.json](https://img-blog.csdnimg.cn/653bb6560a814f629ed1467b89a97a9e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### 必备属性

`package.json` 中有非常多的属性，其中必须填写的只有两个：`name` 和 `version` ，这两个属性组成一个 `npm` 模块的唯一标识。

### 查看包是否被占用

> 我们可以执行 `npm view packageName` 查看包是否被占用，并可以查看它的一些基本信息。

- 当罗列返回包相关信息的时候，表示该包已经被占用。

  ![包占用](https://img-blog.csdnimg.cn/49528471b3a840e987ff2d2e051ba175.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

- 当返回 404 的时候表示可以发布该 `name` 的包。

  ![包可用](https://img-blog.csdnimg.cn/b3f6550cd42e4eddb101722a51761211.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### 基本描述

```json
{
  "description": "An enterprise-class UI design language and React components implementation",
  "keywords": [
    "ant",
    "component",
    "components",
    "design",
    "framework",
    "frontend",
    "react",
    "react-component",
    "ui"
  ]
}
```

- `description`：用于添加模块的的描述信息，方便别人了解你的模块。

- `keywords`：用于给你的模块添加关键字。

另外他们的还有一个非常重要的作用，就是利于`模块检索`。当我们使用 `npm search` 检索模块时，会根据`description` 和 `keywords` 进行匹配。

良好的 `description` 和 `keywords` 有利于模块获得更多更精准的曝光。

![npm search](https://img-blog.csdnimg.cn/28ef9c6cfd7947b28f2df7f72e8ba2f7.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### 开发人员

描述开发人员的字段有两个：`author` 和 `contributors`。

- `author` 指包的主要作者，一个 `author` 对应一个人。
- `contributors` 指贡献者信息，一个 `contributors` 对应多个贡献者，值为`数组`，对人的描述可以是一个字符串，也可以是下面的结构：

```json
{
  "name": "Richard Davey",
  "email": "rich@photonstorm.com",
  "url": "http://www.photonstorm.com"
}
```

### 地址

```json
{
  "homepage": "http://ant.design/",
  "bugs": {
    "url": "https://github.com/ant-design/ant-design/issues"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ant-design/ant-design"
  }
}
```

- `homepage`： 用于指定该模块的主页。

- `repository`： 用于指定模块的代码仓库。

### 协议 license

```json
{
  "license": "MIT"
}
```

`license` 字段用于指定软件的开源协议，开源协议里面详尽表述了其他人获得你代码后拥有的权利，可以对你的的代码进行何种操作，何种操作又是被禁止的。同一款协议有很多变种，协议太宽松会导致作者丧失对作品的很多权利，太严格又不便于使用者使用及作品的传播，所以开源作者要考虑自己对作品想保留哪些权利，放开哪些限制。

### 程序入口

```json
{
  "main": "lib/index.js"
}
```

`main` 属性可以指定程序的主入口文件，例如，上面 `antd` 指定的模块入口 `lib/index.js` ，当我们在代码用引入 `antd` 时：`import { notification } from 'antd';` 实际上引入的就是 `lib/index.js` 中暴露出去的模块。

### 脚本配置

```json
{
  "scripts": {
    "test": "jest --config .jest.js --no-cache",
    "dist": "antd-tools run dist",
    "compile": "antd-tools run compile",
    "build": "npm run compile && npm run dist"
  }
}
```

`scripts` 用于配置一些脚本命令的缩写，各个脚本可以互相组合使用，这些脚本可以覆盖整个项目的生命周期，配置后可使用 `npm run command` 进行调用。如果是 `npm` 关键字，则可以直接调用。

例如，上面的配置制定了以下几个命令：`npm run test`、`npm run dist`、`npm run compile`、`npm run build`。

### config

`config` 字段用于配置脚本中使用的环境变量，例如下面的配置，可以在脚本中使用`process.env.npm_package_config_port`进行获取。

```json
{
  "config": { "port": "8080" }
}
```

## package-lock.json

当我们执行 `npm install` 的时候会生成一份本地的 `package-lock.json` 文件，用来记录实际安装的 `npm` 包的来源和版本。

实际开发中，经常会因为各种依赖不一致而产生奇怪的问题，或者在某些场景下，我们不希望依赖被更新，因此建议在开发中使用 `package-lock.json`。

锁定依赖版本意味着在我们不手动执行更新的情况下，每次安装依赖都会安装固定版本。保证整个团队使用版本号一致的依赖。

每次安装固定版本，无需计算依赖版本范围，大部分场景下能大大加速依赖安装时间。

> 使用 `package-lock.json` 要确保 `npm` 的版本在 `5.6` 以上，因为在 `5.0 - 5.6` 中间，对 `package-lock.json` 的处理逻辑进行过几次更新，`5.6`版本后处理逻辑逐渐稳定。

## dependencies 与 devDependencies

- `dependencies` 声明生产环境所需要的依赖。
- `devDependencies` 声明开发环境所需要的依赖。

**tips**

1. 安装依赖时使用不同的参数，依赖增加到的位置不同：

| dependencies  | devDependencies                       |
| :------------ | :------------------------------------ |
| `npm i xx`    | `npm i xx --save-dev`                 |
| `yarn add xx` | `yarn add xx --dev`、`yarn add xx -D` |

2. 执行 `npm i(yarn)` 时会安装 `dependencies` 和 `devDependencies` 里面的所有依赖。

3. 既然已经在 `package.json` 中声明了依赖，为什么还需要 `package-lock.json`？

   - `package.json` 里只是声明了部分包的版本，并不是所有包。
   - 我们除了需要固定大的依赖包版本，还需要固定依赖的依赖。

4. 安装包版本前的符号含义：

   ```json
   version: a.b.c
   ```

   - a：主要版本；
   - b：次要版本；
   - c：补丁版本；

     | 版本   | 含义                       | 说明                                             |
     | :----- | :------------------------- | :----------------------------------------------- |
     | 1.0.0  | 1.0.0                      | 精确匹配版本，将安装 1.0.0 的版本                |
     | ^1.5.0 | 1.5.0 <= version < 2.0.0   | 使用大于等于该版本但小于主要版本的可安装版本     |
     | ^0.1.1 | 0.1.1 <= version < 0.2.0   | 使用大于等于该版本但小于次要版本的可安装版本     |
     | ~1.5.1 | 1.5.1 <= version < 1.6.0   | 仅使用大于等于该版本，但小于次要版本的可安装版本 |
     | ~1.0.0 | 1.0.0 <= version < 2.0.0   | 没有指定次要版本，允许更新次要版本               |
     | =1.0.0 | 1.0.0 <= version           | 小于等于当前版本                                 |
     | 1.x    | 1.0.0 <= version < 2.0.0   | 使用大于等于该版本，但小于主要版本的可安装版本   |
     | 16.3.x | 16.3.0 <= version < 16.4.0 | 使用大于等于该版本，但小于次要版本的可安装版本   |
     | latest | 获取最新版本               | 使用最新版本的可安装版本                         |

## peerDependencies

`peerDependencies` 用于指定你正在开发的模块所依赖的版本以及用户安装的依赖包版本的兼容性。

在我们进行一些插件开发的时候会经常用到，比如 `antd-design` 的开发依赖于 `react`、`react-dom`，`html-webpack-plugin` 的开发依赖于 `webpack`等。

```json
"peerDependencies": {
    "react": ">=16.0.0",
    "react-dom": ">=16.0.0"
}
```

### 实际例子

假设现在有一个 `helloWorld` 工程,已经在其 `package.json` 的 `dependencies` 中声明了 `packageA`，有两个插件 `plugin1` 和 `plugin2` 他们也依赖 `packageA`，如果在插件中使用 `dependencies` 而不是 `peerDependencies` 来声明 `packageA`，那么 `$ npm install` 安装完 `plugin1` 和 `plugin2` 之后的依赖图是这样的：

```category
├── helloWorld
│   └── node_modules
│       ├── packageA
│       ├── plugin1
│       │   └── nodule_modules
│       │       └── packageA
│       ├── plugin2
│       │   └── nodule_modules
│       │       └── packageA
```

从上面的依赖图可以看出，`helloWorld` 本身已经安装了一次`packageA`，但是由于在
`plugin1` 和 `plugin2` 中的 `dependencies` 也声明了 `packageA`，所以最后 `packageA` 会被安装三次，有两次安装是冗余的。

**而使用 `peerDependency` 就可以避免类似的核心依赖库被重复下载的问题。**

如果在 `plugin1` 和 `plugin2` 的 `package.json` 中使用 `peerDependency` 来声明核心依赖库，例如：

```json
// plugin1/package.json
{
  "peerDependencies": {
    "packageA": "1.0.1"
  }
}


// plugin2/package.json
{
  "peerDependencies": {
    "packageA": "1.0.1"
  }
}

// 在主系统中声明一下 packageA: helloWorld/package.json
{
  "dependencies": {
    "packageA": "1.0.1"
  }
}
```

此时在主系统中执行 `$ npm install` 生成的依赖图就是这样的：

```category
├── helloWorld
│   └── node_modules
│       ├── packageA
│       ├── plugin1
│       └── plugin2
```

可以看到这时候生成的依赖图是扁平的，`packageA` 也只会被安装一次。

总结一下有如下特点：

- 插件正确运行的前提是，核心依赖库必须先下载安装，不能脱离核心依赖库而被单独依赖并引用；
  - 如果用户显式依赖了核心库，则可以忽略各插件的 `peerDependency` 声明；
  - 如果用户没有显式依赖核心库，则按照插件 `peerDependencies` 中声明的版本将库安装到项目根目录中；
  - 当用户依赖的版本、各插件依赖的版本之间不相互兼容，会报错让用户自行修复；
- 插件入口 api 的设计必须要符合核心依赖库的规范；
- 插件的核心逻辑运行在依赖库的调用中；
- 在项目实践中，同一插件体系下，核心依赖库版本最好是相同的；

### 总结

假设我们的主项目和插件都依赖 `react` 和 `react-dom`。

- 首先在主系统的 `package.json` 中的 `dependencies` 声明下 `react` 和 `react-dom` 的版本：

  ```json
  // 主项目的package.json
  {
    "dependencies": {
      "react": "^16.13.1",
      "react-dom": "^16.13.1"
    }
  }
  ```

- 接着在组件库的 `package.json` 中的 `peerDependencies` 声明 `react` 和 `react-dom` 的版本：

  ```json
  {
    "peerDependencies": {
      "react": ">=16.12.0",
      "react-dom": ">=16.12.0"
    }
  }
  ```

这样在主系统中执行 `$ npm install` 之后，主系统和组件库就能共用主系统的 `node_module` 中安装的 `react` 和 `react-dom` 了。

## optionalDependencies

某些场景下，依赖包可能不是强依赖的，这个依赖包的功能可有可无，当这个依赖包无法被获取到时，你希望 `npm install` 继续运行，而不会导致失败，你可以将这个依赖放到 `optionalDependencies` 中。

这是一个包名到版本或 url 的映射，就像依赖对象一样。不同的是，构建失败不会导致安装失败。

```js
try {
  var foo = require('foo');
  var fooVersion = require('foo/package.json').version;
} catch (er) {
  foo = null;
}
if (notGoodFooVersion(fooVersion)) {
  foo = null;
}
// .. then later in your program ..
if (foo) {
  foo.doFooThings();
}
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n需要注意的是 `optionalDependencies` 中的配置将会覆盖掉 `dependencies` 所以只需在一个地方进行配置即可。\n\n另外，在引用 `optionalDependencies` 中安装的依赖时，一定要做好异常处理，否则在模块获取不到时会导致报错。';

export default () => <Info type="warning" txt={txt} />;
```

## bundledDependencies

和以上几个不同，`bundledDependencies` 的值是一个`数组`，数组里可以指定一些模块，这些模块将在这个包发布时被一起打包。

```json
"bundledDependencies": ["package1" , "package2"]
```

比如我们配置如下:

```json
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundledDependencies": ["renderized", "super-streams"]
}
```

当我们使用 `npm pack`命令进行打包的时候，生成的`tgz`文件包含了 `renderized` 和 `super-streams`两个包，当我们去执行 `npm install awesome-web-framework-1.0.0.tgz`包的时候这两个包也同时会被安装。

这里我们没有指定版本是因为版本的信息已经包含在`version`字段中了。

## 发布配置

### preferGlobal

如果你的 `node.js` 模块主要用于安装到全局的命令行工具，那么该值设置为 `true` ，当用户将该模块安装到本地时，将得到一个警告 ⚠️。这个配置并不会阻止用户安装，而是会提示用户防止错误使用而引发一些问题。

### private

如果将 `private` 属性设置为 `true`，npm 将拒绝发布它，这是为了防止一个私有模块被无意间发布出去。

### publishConfig

```json
"publishConfig": {
    "registry": "https://registry.npmjs.org/"
}
```

发布模块时更详细的配置，例如你可以配置只发布某个 `tag`、配置发布到的私有 `npm` 源。更详细的配置可以参考 [npm-config](https://docs.npmjs.com/cli/v8/using-npm/config)

### os

假如你开发了一个模块，只能跑在 `darwin` 系统下，你需要保证 `windows` 用户不会安装到你的模块，从而避免发生不必要的错误。

使用 `os` 属性可以帮助你完成以上的需求，你可以指定你的模块只能被安装在某些系统下，或者指定一个不能安装的系统黑名单：

```json
"os" : [ "darwin", "linux" ]
"os" : [ "!win32" ]
```

### cpu

和上面的 `os` 类似，我们可以用 `cpu` 属性更精准的限制用户安装环境：

```json
"cpu" : [ "x64", "ia32" ]
"cpu" : [ "!arm", "!mips" ]
```

在 `node` 环境下可以使用 `process.arch` 来判断 `cpu` 架构。
