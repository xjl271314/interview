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

### 协议

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
