---
title: Loader And Plugin
nav:
  title: webpack
  path: /webpack
  order: 0
group:
  title: webpack相关试题
  path: /webpack/project
---

# webpack 有哪些常见的 loader?你用过哪些 loader,有哪些常见的 Plugin？你用过哪些 Plugin？loader 和 plugin 之间有啥区别?

- 2021.06.01

## Loader:

> `loader` 的本质就是一个`函数`，将那些 `webpack` 不能直接理解的 `JavaScript 文件`、`CSS 文件`等转化成 `webpack `可以识别的文件。

`Loader` 在 `module.rules` 中配置，作为模块的解析规则，类型为`数组`。每一项都是一个 `Object`，内部包含了 `test(类型文件)`、`loader`、`options (参数)`等属性。

### 在 webpack 的配置中 loader 有两个属性：

1. `test 属性`：用于标识出应该被对应的 `loader` 进行转换的某个或某些文件，其书写格式是一个正则表达式。

2. `use 属性`：表示对应匹配出的文件需要使用的 `loader`，其中 `loader` 是一个数组，使用的顺序为`从右往左`。

## webpack 中常见的 loader:

- `file-loader`：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)。

- `url-loader`：与 `file-loader` 类似，区别是用户可以设置一个`阈值`，大于阈值会交给 `file-loader` 处理，小于阈值时返回文件 `base64` 形式编码 (用于处理图片和字体)。

- `source-map-loader`：加载额外的 `Source Map` 文件，以方便断点调试。

- `image-loader`：加载并且压缩图片文件。

- `babel-loader`：把 `ES6`代码 转换成 `ES5`。

- `postcss-loader`：扩展 `CSS` 语法，使用下一代 `CSS`，可以配合 `autoprefixer` 插件自动补齐 `CSS3 前缀`。

- `sass-loader`：将`SCSS/SASS`代码转换成`CSS`。

- `less-loader`：将`Less`代码转换成`CSS`。

- `css-loader`：加载 `CSS`，支持模块化、压缩、文件导入等特性。

- `style-loader`：把 `CSS` 代码注入到 `JavaScript` 中，通过 `DOM` 操作去加载 `CSS`。

- `eslint-loader`：通过 `ESLint` 检查 `JavaScript` 代码。

- `cache-loader`: 可以在一些性能开销较大的 `Loader` 之前添加，目的是将结果缓存到磁盘里。

- `thread-loader`:可以配置`webpack`进行多进程的打包`js`和`css`。

## Plugin：

> loader 被用于转换某些类型的模块，而 Plugin 就是插件，基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

`Plugin` 在 `plugins` 中单独配置，类型为数组，每一项是一个 `Plugin` 的实例，需要手动通过`new Plugin(options)`进行，参数都通过构造函数传入。

## webpack 中常见的 Plugin：

- `commons-chunk-plugin`：主要是用来提取第三方库和公共模块，避免首屏加载的 `bundle` 文件或者按需加载的 `bundle` 文件体积过大，从而导致加载时间过长，是一把优化项目的利器。

  ```jsx
  /**
   * inline: true
   */
  import React from 'react';
  import { Info } from 'interview';

  const txt = '`webpack4` 之后推荐使用 `splitChunks` 替代该方法。';

  export default () => <Info type="info" txt={txt} />;
  ```

- `clean-webpack-plugin`: 常用于打包正式环境报之前进行目录清理。

- `speed-measure-webpack-plugin`: 可以看到每个 `Loader` 和 `Plugin` 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)。

- `mini-css-extract-plugin`: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代`extract-text-webpack-plugin`)。

- `terser-webpack-plugin`：用于替代`uglifyjs-webpack-plugin`(`uglifyjs`不支持 es6 语法)支持压缩 ES6 (Webpack4)，可配置多进程进行压缩。

- `webpack-parallel-uglify-plugin`: 多进程执行代码压缩，提升构建速度。

- `webpack-bundle-analyzer`：可视化 `Webpack` 输出文件的体积 (业务组件、依赖第三方模块)。

- `html-webpack-externals-plugin`：将不怎么需要更新的第三方库脱离`webpack`打包，不被打入`bundle`中，从而减少打包时间，但又不影响运用第三方库的方式，例如 `import` 方式等。

- `DllPlugin`：用于分包处理,用于在单独的 `webpack` 配置中创建一个 `dll-only-bundle`。 此插件会生成一个名为 `manifest.json` 的文件，这个文件是用于让 `DllReferencePlugin` 能够映射到相应的依赖上。

- `DllReferencePlugin`：此插件配置在 `webpack` 的主配置文件中，此插件会把 `dll-only-bundles` 引用到需要的预编译的依赖中。

## 编写 loader 或 plugin 的思路：

### Loader:

`loader` 就是一个 `node` 模块，在 `webpack` 的定义中，`loader` 导出一个函数，`loader` 会在转换源模块（resource）的时候调用该函数。在这个函数内部，我们可以通过传入 `this` 上下文给 `Loader API` 来使用它们。

把 webpack 想像成一个工厂，loader 就是一个个身怀绝技的流水线工人，有的会处理 svg，有的会压缩 css 或者图片，有的会处理 less，有的会将 es6 转换为 es5。

这里自己写过一个[px2rem](https://xjl271314.github.io/docs/project/webpack.html#%E5%8A%A8%E6%89%8B%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA-loader-%E4%B9%8B%E7%AE%80%E6%98%93%E7%9A%84jsx-px2rem)的 Loader。

### Plugin:

`plugin` 的本质是一个`类`。这个类必须实现的方法就是 `apply`。所以，一个基础的 `plugin` 如下：

```js
class MyPlugin {
  // 插件的名称
  apply(complier) {
    // 必须实现的apply方法
    compiler.hooks.done.tap('My Plugin', (stats) => {
      // 触发的hooks
      // do something
    });
  }
}

module.exports = MyPlugin;

// 插件的使用

plugins: [new MyPlugin()];
```

`webpack` 在启动之后，在读取配置的过程中会先执行`new MyPlugin(options)`操作，初始化一个`MyPlugin`实例对象。在初始化 `compiler` 对象之后，会调用上述实例对象的 `apply` 方法并将 `compiler` 对象传入。

这样我们就可以在插件实例的 `apply` 方法中，通过 `compiler` 对象来监听 `webpack` 生命周期中广播出来的事件。

在事件中，我们也可以通过 `compiler` 对象来操作 `webpack` 的输出。

#### 在 `webpack` 的 `plugin` 运行的过程中存在两个非常重要的对象：`compiler`和`compilation`。

- `compiler`：在初始化 `compiler` 对象之后，通过调用插件实例的 `apply` 方法，作为其参数传入。这个对象包含了 `webpack` 环境的所有的配置信息，比如 `options`，`loaders`，`plugins` 等。这个对象会在 `webpack` 被启动的时候进行实例化，`全局且唯一`的。

- `compilation`：这个对象会作为 `plugin` 内置事件回调函数的参数。包含了`当前的模块资源`，`编译生成的资源`，`变化的文件`等信息。如果我们运行在开发模式，每当检测到一个文件的变化，就会生成一个新的 `compilation` 对象。

  ```jsx
  /**
   * inline: true
   */
  import React from 'react';
  import { Info } from 'interview';

  const txt =
    '所以，`compiler` 代表了 `webpack` 从启动到关闭的整个生命周期，而 `compilation` 仅仅代表了一次新的编译。';

  export default () => <Info type="info" txt={txt} />;
  ```

这里有的时候我们会碰到`Script error`的错误。造成这些错误的基本原因是`当这些从第三方加载的JavaScript脚本执行出错，因为违背了同源策略, 为了保证用户信息不被泄露，错误信息不会显示出来，取而代之只会返回一个Script error。`

解决的方法需要有两个基本的条件。

- 一是跨域脚本的服务器必须通过 `Access-Controll-Allow-Origin` 头信息允许当前域名可以获取错误信息，

- 二是当前域名的 `script` 标签也必须指明 `src` 属性指定的地址是支持跨域的地址，也就是 `crossorigin` 属性。
