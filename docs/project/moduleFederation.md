---
title: Webpack5 模块联邦
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Webpack5 模块联邦

- 2022.11.08

`webpack5 模块联邦(Module Federation)` 让 `Webpack` 达到了线上 `Runtime` 的效果，让代码直接在项目间利用 CDN 直接共享，不再需要本地安装 `Npm` 包、构建再发布了！

用于前端的微服务化。

我们知道 `Webpack` 可以通过 `DLL` 或者 `Externals` 做代码共享时 `Common Chunk`，但不同应用和项目间这个任务就变得困难了，我们几乎无法在项目之间做到按需热插拔。

比如`项目A`和`项目B`，公用`项目C`组件，以往这种情况，可以将 C 组件发布到 npm 上，然后 A 和 B 再具体引入。当 C 组件发生变化后，需要重新发布到 npm 上，A 和 B 也需要重新下载安装。

使用模块联邦后，可以在远程模块的`Webpack`配置中，将 C 组件模块暴露出去，项目 A 和项目 B 就可以远程进行依赖引用。当 C 组件发生变化后，A 和 B 无需重新引用。

模块联邦利用`webpack5`内置的`ModuleFederationPlugin`插件，实现了项目中间相互引用的按需热插拔。

## ModuleFederationPlugin

| 重要参数  | 描述                                                                                                         |
| :-------- | :----------------------------------------------------------------------------------------------------------- |
| `name`    | 当前应用名称，需要全局唯一                                                                                   |
| `remotes` | 可以将其他项目的 name 映射到当前项目中                                                                       |
| `exposes` | 表示导出的模块，只有在此申明的模块才可以作为远程依赖被使用                                                   |
| `shared`  | 是非常重要的参数，制定了这个参数，可以让远程加载的模块对应依赖，改为使用本地项目的依赖，如 React 或 ReactDOM |

配置示例:

```js
new ModuleFederationPlugin({
     name: "app_1",
     library: { type: "var", name: "app_1" },
     filename: "remoteEntry.js",
     remotes: {
        app_02: 'app_02',
        app_03: 'app_03',
     },
     exposes: {
        antd: './src/antd',
        button: './src/button',
     },
     shared: ['react', 'react-dom'],
}),
```

上面我们设置了 `remotes: { app_02: 'app_02', app_03: 'app_03', }`，在代码中就可以直接利用以下的方式从对方应用调用模块:

```js
import { Button } from 'app_02/antd';
```

正是因为 `antd` 在 `exposes` 被导出，我们因此可以使用 `[name]/[exposes_name]` 这个模块，这个模块对于被引用应用来说是一个本地模块。
