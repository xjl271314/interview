---
title: npm run 执行流程
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# npm 脚本执行流程

- 2022.03.31

## npm 脚本

在 `package.json` 中经常会配置对应的执行脚本

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

那么当我们执行 `npm run build` 时它是如何去执行的？

## 为什么需要 npm scripts?

比如以 `npm run dist` 为例，为什么我们执行的是 `npm run dist` 而不是`antd-tools run dist`？

1. 首先，使用脚本配置常用命令的话执行起来比较简洁。
2. 其次，主要是操作系统中并没有对应的指令。

**那为什么使用 `npm run dist` 这个命令就可以执行呢?**

我们再使用 `npm i` 命令安装对应的依赖包的时候，npm 在帮我们安装包到`node_modules`的同时，会在 `node_modules/.bin` 目录中创建好该包对应的几个可执行文件。

当执行对应命令的时候，会将当前项目的`node_modules`目录下的`.bin`目录添加到`PATH`中。而`PATH`环境变量的作用是指定命令的搜索路径。

而这个 `.bin` 目录，不是任何一个 `npm包`，而是存放着一个个安装包对应软链接的目录，已 `acorn` 文件为例，打开可以发现文件顶部写着 `#!/bin/sh` 代表这个是一个脚本。

因此当我们调用`npm run script` 时，`npm`会先在当前项目中的`node_modules/.bin/`目录下找该命令，如果找到就执行软链接的原文件，如果找不到则会在`/usr/local/bin/`目录下找该命令。

![acorn](https://img-blog.csdnimg.cn/e5a2fa7521554d50aa808d4be03d8baf.png)

**那么`.bin`目录下的文件从哪里来?它又是怎么知道这条软连接是执行哪里的呢?**

这里可以参考 [npm 官方文档地址 bin 的描述](https://docs.npmjs.com/cli/v8/configuring-npm/package-json/#bin)

![在这里插入图片描述](https://img-blog.csdnimg.cn/819b92aba57b4faea8c1ae12e45e8fee.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/4a71c32cbcc6453884ad0467fdafabd4.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)
