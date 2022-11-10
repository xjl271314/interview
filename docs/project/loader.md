---
title: Loader、Plugins
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Loader 与 Plugin

- 2021.06.01

## Loader

`Loader` 的本质就是一个`函数`，将那些 `webpack` 不能直接理解的 `JavaScript 文件`、`CSS 文件`等转化成 `webpack`可以识别的`js`文件。

`Loader` 在 `module.rules` 中配置，作为模块的解析规则，类型为`数组`。每一项都是一个 `Object`，内部包含了 `test(类型文件)`、`loader`、`options (参数)`等属性。

### loader 的配置

1. `test 属性`：用于标识出应该被对应的 `loader` 进行转换的某个或某些文件，其书写格式是一个正则表达式。

2. `use 属性`：表示对应匹配出的文件需要使用的 `loader`，其中 `loader` 是一个数组，使用的顺序为`从右往左`。

### 常见的 loader

| lader               | 描述                                                                                                                                  |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------ |
| `file-loader`       | 把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)。                                                    |
| `url-loader`        | 与 `file-loader` 类似，通过设置`阈值`，大于阈值会交给 `file-loader` 处理，小于阈值时返回文件 `base64` 形式编码 (用于处理图片和字体)。 |
| `source-map-loader` | 加载额外的 `Source Map` 文件，以方便断点调试。                                                                                        |
| `image-loader`      | 加载并压缩图片文件。                                                                                                                  |
| `babel-loader`      | 把 `ES6`代码 转换成 `ES5`。                                                                                                           |
| `postcss-loader`    | 扩展 `CSS` 语法，使用下一代 `CSS`，可以配合 `autoprefixer` 插件自动补齐 `CSS3 前缀`。                                                 |
| `sass-loader`       | 将`SCSS/SASS`代码转换成`CSS`。                                                                                                        |
| `less-loader`       | 将`Less`代码转换成`CSS`。                                                                                                             |
| `css-loader`        | 加载 `CSS`，支持模块化、压缩、文件导入等特性。                                                                                        |
| `style-loader`      | 把 `CSS` 代码注入到 `JavaScript` 中，通过 `DOM` 操作去加载 `CSS`。                                                                    |
| `eslint-loader`     | 通过 `ESLint` 检查 `JavaScript` 代码。                                                                                                |
| `cache-loader`      | 可以在一些性能开销较大的 `Loader` 之前添加，目的是将结果缓存到磁盘里。                                                                |
| `thread-loader`     | 可以配置`webpack`进行多进程的打包`js`和`css`。                                                                                        |

### 自定义 loader

`loader` 就是一个 `node` 模块，在 `webpack` 的定义中，`loader` 导出一个函数，`loader` 会在转换源模块（resource）的时候调用该函数。在这个函数内部，我们可以通过传入 `this` 上下文给 `Loader API` 来使用它们。

把 webpack 想像成一个工厂，loader 就是一个个身怀绝技的流水线工人，有的会处理 svg，有的会压缩 css 或者图片，有的会处理 less，有的会将 es6 转换为 es5。

- 简单的 style-loader

  ```js
  // 作用：将css内容，通过style标签插入到页面中
  // source为要处理的css源文件
  function loader(source) {
    let style = `
          let style = document.createElement('style');
          style.setAttribute("type", "text/css"); 
          style.innerHTML = ${source};
          document.head.appendChild(style)`;
    return style;
  }
  module.exports = loader;
  ```

- 简单的 px2rem 函数

  ```js
  // jsx-px2rem-loader.js
  import regRules from "./reg";
  import _ from "lodash"; // lodash是一个js工具库，特别方便建议各位去了解一下

  module.exports = function(source) {
  // webpack中默认是开启loader缓存的(可以使用this.cacheable关掉缓存)。
  if (this.cacheable) {
      this.cacheable();
  }
  let backUp = source;

  // style={{marginRight: '1px'}} => style={{marginRight: '0.01rem'}}
  if (regRules.pxReg.test(backUp)) {
      backUp = backUp.replace(regRules.pxReg, (px) => {
      let val = px.replace(regRules.numReg, (num) => {
          return num / 100;
      });
      val = val.replace(/px$/, "rem");
      return val;
      });
  }

  // marginRight: 1 => marginRight: '0.01rem'
  _.each(regRules.styleReg, (reg, styleName) => {
      if (reg.test(backUp)) {
      backUp = backUp.replace(reg, (val) => {
          return val.replace(regRules.numReg, (num) => {
          return `"${num / 100}rem"`;
          });
      });
      }
  });

  // img标签 width: 1 => style={{width: '0.01rem'}}
  _.each(regRules.imgReg, (reg, styleName) => {
      if (reg.test(backUp)) {
      backUp = backUp.replace(reg, (val) => {
          let style = "";
          val.replace(regRules.numReg, (num) => {
          style = `${num / 100}rem`;
          });
          return `style={{${styleName}:"${style}"}}`;
      });
      }
  });

  return backUp;
  };

  // reg.js
  // 匹配jsx中的px 如 1px
  const pxReg = /\b(\d+(\.\d+)?)px\b/g;

  // 匹配jsx中 缩写形式的style 如：marginRight: 1
  const styleReg = {
      marginTop: /\bmarginTop(?:\s+):(?:\s+)?(\d+)/g,
      marginRight: /\bmarginRight(?:\s+)?:(?:\s+)?(\d+)/g,
      marginBottom: /\bmarginBottom(?:\s+)?:(?:\s+)?(\d+)/g,
      marginLeft: /\bmarginLeft(?:\s+)?:(?:\s+)?(\d+)/g,
      fontSize: /\bfontSize(?:\s+)?:(?:\s+)?(\d+)/g,
      paddingTop: /\bpaddingTop(?:\s+)?:(?:\s+)?(\d+)/g,
      paddingRight: /\bpaddingRight(?:\s+)?:(?:\s+)?(\d+)/g,
      paddingBottom: /\bpaddingBottom(?:\s+)?:(?:\s+)?(\d+)/g,
      paddingLeft: /\bpaddingLeft(?:\s+)?:(?:\s+)?(\d+)/g,
  };

  // 匹配img 中的行内样式 width: '20'
  const imgReg = {
      height: /\bheight(?:\s+)?=(?:\s+)?(\'||\")?(\d+)?=(\'||\")?/g,
      width: /\bwidth(?:\s+)?=(?:\s+)?(\'||\")?(\d+)?=(\'||\")?/g,
  };

  // 匹配数字
  const numReg = /(\d+)/g;

  export default {
      pxReg,
      styleReg,
      imgReg,
      numReg,
  };

  // config.js
  import path from 'path'

  ...

  chainWebpack(config){
      config.module
      .rule('jsx-px2rem-loader')
      .test(/\.js$/)
      .exclude
      .add([path.resolve('../src/pages/.umi'), path.resolve('node_modules')])
      .end()
      .use('../loader/jsx-px2rem-loader')
      .loader(path.join(__dirname, '../loader/jsx-px2rem-loader'));
  }
  ```

## Plugin

Plugin 是插件，基于事件流框架 `Tapable(底层是利用发布订阅模式)`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

`Plugin` 在 `plugins` 中单独配置，类型为数组，每一项是一个 `Plugin` 的实例，需要手动通过`new Plugin(options)`进行，参数都通过构造函数传入。

## 常见的 Plugin

| plugin                           | 描述                                                                                                                                                                                                         |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commons-chunk-plugin`           | 主要是用来提取第三方库和公共模块，避免首屏加载的 `bundle` 文件或者按需加载的 `bundle` 文件体积过大，从而导致加载时间过长，是一把优化项目的利器。<br/><br/>`webpack4` 之后推荐使用 `splitChunks` 替代该方法。 |
| `clean-webpack-plugin`           | 常用于打包正式环境报之前进行目录清理。                                                                                                                                                                       |
| `speed-measure-webpack-plugin`   | 可以看到每个 `Loader` 和 `Plugin` 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)。                                                                                                                      |
| `mini-css-extract-plugin`        | 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代`extract-text-webpack-plugin`)。                                                                                                                         |
| `terser-webpack-plugin`          | 用于替代`uglifyjs-webpack-plugin`(`uglifyjs`不支持 es6 语法)支持压缩 ES6 (Webpack4)，可配置多进程进行压缩。                                                                                                  |
| `webpack-parallel-uglify-plugin` | 多进程执行代码压缩，提升构建速度。                                                                                                                                                                           |
| `webpack-bundle-analyzer`        | 可视化 `Webpack` 输出文件的体积 (业务组件、依赖第三方模块)。                                                                                                                                                 |
| `html-webpack-externals-plugin`  | 将不怎么需要更新的第三方库脱离`webpack`打包，不被打入`bundle`中，从而减少打包时间，但又不影响运用第三方库的方式，例如 `import` 方式等。                                                                      |
| `DllPlugin`                      | 用于分包处理,用于在单独的 `webpack` 配置中创建一个 `dll-only-bundle`。 此插件会生成一个名为 `manifest.json` 的文件，这个文件是用于让 `DllReferencePlugin` 能够映射到相应的依赖上。                           |
| `DllReferencePlugin`             | 此插件配置在 `webpack` 的主配置文件中，此插件会把 `dll-only-bundles` 引用到需要的预编译的依赖中。                                                                                                            |

## 自定义 plugin

`plugin` 的本质是一个`类`。这个类必须实现的方法就是 `apply`。所以，一个基础的 `plugin` 如下：

```js
class MyPlugin {
  // 插件的名称
  apply(complier) {
    // 必须实现的apply方法
    compiler.hooks.done.tap('My Plugin', (stats) => {
      // 触发的hooks
      // do something
      console.log('打包已完成');
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

## compiler 和 compilation

- `compiler`：在初始化 `compiler` 对象之后，通过调用插件实例的 `apply` 方法，作为其参数传入。这个对象包含了 `webpack` 环境的所有的配置信息，比如 `options`，`loaders`，`plugins` 等。这个对象会在 `webpack` 被启动的时候进行实例化，`全局且唯一`的。

- `compilation`：这个对象会作为 `plugin` 内置事件回调函数的参数。包含了`当前的模块资源`，`编译生成的资源`，`变化的文件`等信息。如果我们运行在开发模式，每当检测到一个文件的变化，就会生成一个新的 `compilation` 对象。

  ```jsx
  /**
   * inline: true
   */
  import React from 'react';
  import { Info } from 'interview';

  const txt =
    '\n`compiler` 代表了 `webpack` 从启动到关闭的整个生命周期，而 `compilation` 仅仅代表了一次新的编译。';

  export default () => <Info type="info" txt={txt} />;
  ```

这里有的时候我们会碰到`Script error`的错误。造成这些错误的基本原因是`当这些从第三方加载的JavaScript脚本执行出错，因为违背了同源策略, 为了保证用户信息不被泄露，错误信息不会显示出来，取而代之只会返回一个Script error。`

解决的方法需要有两个基本的条件。

- 一是跨域脚本的服务器必须通过 `Access-Controll-Allow-Origin` 头信息允许当前域名可以获取错误信息，

- 二是当前域名的 `script` 标签也必须指明 `src` 属性指定的地址是支持跨域的地址，也就是 `crossorigin` 属性。

## compiler 常用钩子

| 钩子           | 类型              | 调用时机                                                             |
| :------------- | :---------------- | :------------------------------------------------------------------- |
| `run`          | AsyncSeriesHook   | 在编译器开始读取记录前执行                                           |
| `compile`      | SyncHook          | 在一个新的 compilation 创建之前执行                                  |
| `compilation`  | SyncHook          | 在一次 compilation 创建后执行插件                                    |
| `make`         | AsyncParallelHook | 完成一次编译之前执行                                                 |
| `emit`         | AsyncSeriesHook   | 在生成文件到 output 目录之前执行，回调参数： compilation             |
| `afterEmit`    | AsyncSeriesHook   | 在生成文件到 output 目录之后执行                                     |
| `assetEmitted` | AsyncSeriesHook   | 生成文件的时候执行，提供访问产出文件信息的入口，回调参数：file，info |
| `done`         | AsyncSeriesHook   | 一次编译完成后执行，回调参数：stats                                  |
