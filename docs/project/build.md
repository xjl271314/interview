---
title: webpack打包流程
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 简单描述下 Webpack(5.x) 构建流程?

- 2021.07.21

在了解 webpack 构建流程之前先来回顾下相关的核心知识

## 入口(entry)

> 指 `webpack` 应该使用哪个模块，来作为构建其内部依赖图的开始。`Webpack` 执行构建的第一步将从`入口`开始，搜寻及递归解析出所有入口依赖的模块。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '`webpack`中默认值是 `./src/index.js`，但我们可以通过在 `webpack configuration` 中配置 `entry` 属性，来指定一个（或多个）不同的入口起点。';

export default () => <Info txt={txt} />;
```

```js
// 最简单的单入口文件
module.exports = {
  entry: './path/to/my/entry/file.js',
};

// entry 属性的单个入口语法，是下面的简写：
const config = {
  entry: {
    main: './path/to/my/entry/file.js',
  },
};
module.exports = config;
```

## 输出(output)

> `output` 属性告诉 `webpack` 在哪里输出它所创建的 `bundles`，以及如何命名这些文件，默认值为 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。我们可以通过在配置中指定一个 output 字段，来配置这些处理过程：

```js
// 简单的单入口 单出口配置
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
  },
};
```

## 模块转化(loaders)

> `webpack` 只能理解 `JavaScript` 和 `JSON` 文件，这是 `webpack` 开箱可用的自带能力。使用`loader`可以让 `webpack` 能够去处理那些非 `JavaScript` 文件。`loader` 可以将所有类型的文件转换为 `webpack` 能够处理的有效模块，然后我们就可以利用 `webpack` 的打包能力，对它们进行处理。

本质上，`webpack loader` 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

**在 `webpack` 的配置中 `loader` 有两个目标：**

- `test` 属性，用于标识出应该被对应的 `loader` 进行转换的某个或某些文件。

- `use` 属性，表示进行转换时，应该使用哪个 `loader`。

**另外`thread-loader`可以配置 `webpack` 进行多进程的打包 `js` 和 `css`。**

```js
// 简单的loader配置
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      {
        test: /\.js$/, //匹配所有的js文件
        exclude: /node_modules/, //除了node_modules以外
      },
      // 配置css loaders 假如在index.js中引入css 会被转化成commonjs对象
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // styles-loader 将css转化成style 插入到head中
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      // url-loader可以处理一些图片大小转base64的功能   limit的单位是B(字节)
      {
        test: /\.png|jpg|jpeg|gif$/,
        use: [(loader: 'url-loader'), (options: { limit: 10240 })],
      },
    ],
  },
};

module.exports = config;
```

### loader 的特性

- `loader` 支持`链式传递`。能够对资源使用`流水线(pipeline)`。一组链式的 `loader` 将按照相反的顺序执行。`loader` 链中的第一个 `loader` 返回值给下一个 `loader`。在最后一个 `loader`，返回 `webpack` 所预期的 `JavaScript`。

- `loader` 可以是`同步`的，也可以是`异步`的。

- `loader` 运行在 `Node.js` 中，并且能够执行任何可能的操作。

- `loader` 接收查询参数。用于对 `loader` 传递配置。

- `loader` 也能够使用 `options` 对象进行配置。

- 除了使用 `package.json` 常见的 `main` 属性，还可以将普通的 `npm` 模块导出为 `loader`，做法是在 `package.json` 里定义一个 `loader` 字段。

- `插件(plugin)`可以为 `loader` 带来更多特性。

- `loader` 能够产生额外的任意文件。

## 插件(plugin)

> `loader` 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

要使用一个插件，我们只需要 `require()` 它，然后把它添加到 `plugins` 数组中。多数插件可以通过`选项(option)`自定义。我们也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 `new`操作符来创建它的一个实例。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};

module.exports = config;
```

## 模式(mode)

> `webpack` 内置了三个不同的模式(development、production、none ),通过选择 设置 mode 参数，我们可以启用相应模式下的 webpack 内置的优化。

### development

该模式下，将侧重于功能调试和优化开发体验，会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`. 为模块和 `chunk`启用有效的名，包含如下内容：

1. 浏览器调试工具
2. 开发阶段的详细错误日志和提示
3. 快速和优化的增量构建机制

### production

该模式下，将侧重于模块体积优化和线上部署，会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`。

为`模块`和 `chunk` 启用`确定性`的混淆名称，`FlagDependencyUsagePlugin`，`FlagIncludedChunksPlugin`，`ModuleConcatenationPlugin`，`NoEmitOnErrorsPlugin` 和 `TerserPlugin`，包含如下内容：

1. 开启所有的优化代码
2. 更小的 `bundle` 大小
3. 去除掉只在开发阶段运行的代码
4. `Scope hoisting` 和 `Tree-shaking`
5. 自动启用 `uglifyjs` 对代码进行压缩

#### FlagDependencyUsagePlugin

- 触发时机：`compilation.hooks.optimizeDependencies`
- 功能：标记模块导出中被使用的导出，存在 `module.usedExports` 里。用于 `Tree shaking`。
- 对应配置项：`optimization.usedExports:true`

#### FlagIncludedChunksPlugin

- 触发时机：`compilation.hooks.optimizeChunkId`
- 功能：给每个 `chunk` 添加了 `ids`，用于判断避免加载不必要的 `chunk`

#### ModuleConcatenationPlugin

- 触发时机：`compilation.hooks.optimizeChunkModules`
- 功能：使用 `esm` 语法可以`作用域提升(Scope Hoisting)`或预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度
- 对应配置项：`optimization.concatenateModules:true`

#### NoEmitOnErrorsPlugin

- 触发时机：`compiler.hooks.shouldEmit`，`compilation.hooks.shouldRecord`
- 功能：如果在 `compilation` 编译时有 `error`，则不执行 `Record` 相关的钩子，并且抛错和不编译资源

#### TerserPlugin

- 触发时机：`template.hooks.hashForChunk`，`compilation.hooks.optimizeChunkAssets`
- 功能：
  - 在 `template.hooks.hashForChunk` 钩子即在 `chunks` 生成 `hash` 阶段会把压缩相关的信息也打入到里面
  - 在 `compilation.hooks.optimizeChunkAssets` 钩子触发资源压缩事件
- 对应配置项：
  - `optimization.minimize` 是否开启压缩
  - `optimization.minimizer` 定制 Terser

### none

该模式下，不使用任何默认优化选项。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt = '如果没有设置，`webpack` 会给 `mode` 的默认值设置为 `production`。';

export default () => <Info type="warning" txt={txt} />;
```

## 浏览器兼容性(browser compatibility)

- `webpack` 支持所有符合 ES5 标准 的浏览器（不支持 IE8 及以下版本）。webpack 的 `import()` 和 `require.ensure()` 需要 `Promise`。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要 提前加载 `polyfill`。

- `webpack 5` 运行于 `Node.js v10.13.0+` 的版本。

## 启动流程详解

执行脚本

```js
webpack entry.js bundle.js
```

当我们执行上述代码时底层操作系统会去命令行工具进入 `node_modules/.bin` 目录查找是否存在 `webpack.sh(mac)` 或者 `webpack.cmd(windows)`文件,如果存在就执行,不存在就抛出错误。

所以 `webpack` 命令实际执行的是 `node_modules/webpack/bin/webpack.js`。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '我们输入的其他命令其实也是首先在`node_modules/.bin`下进行对应文件的查找。';

export default () => <Info txt={txt} />;
```

当执行命令后我们进入了`webpack.js`。

```js
#!/usr/bin/env node

// @ts-ignore 正常执行的返回值
process.exitCode = 0;

/**
 * 运行某个命令之后返回一个promise
 * @param {string} command process to run
 * @param {string[]} args commandline arguments
 * @returns {Promise<void>} promise
 */
const runCommand = (command, args) => {
  // node.js [child_process](http://nodejs.cn/api/child_process.html)
  const cp = require('child_process');
  return new Promise((resolve, reject) => {
    // [child_process.spawn] http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options
    const executedCommand = cp.spawn(command, args, {
      stdio: 'inherit', // <Array> | <string> 子进程的标准输入输出配置（参见 options.stdio）。
      shell: true, //  <boolean> | <string> 如果是 true，则在 shell 内运行 command。 在 Unix 上使用 '/bin/sh'，在 Windows 上使用
    });

    executedCommand.on('error', (error) => {
      reject(error);
    });

    executedCommand.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

/**
 * 判断某个包是否安装
 * @param {string} packageName name of the package
 * @returns {boolean} is the package installed?
 */
const isInstalled = (packageName) => {
  try {
    // 该方法会将相对路径拼接生成一个绝对路径，并自动检验该路径是否存在对应文件，查询模块文件名时并不会加载该模块。
    require.resolve(packageName);

    return true;
  } catch (err) {
    return false;
  }
};

/**
 * webpack可用的CLI:webpack-cli 和 webpack-command
 * @typedef {Object} CliOption
 * @property {string} name display name
 * @property {string} package npm package name
 * @property {string} binName name of the executable file
 * @property {string} alias shortcut for choice
 * @property {boolean} installed currently installed?
 * @property {boolean} recommended is recommended
 * @property {string} url homepage
 * @property {string} description description
 */

/** @type {CliOption[]} */
const CLIs = [
  {
    name: 'webpack-cli',
    package: 'webpack-cli',
    binName: 'webpack-cli',
    alias: 'cli',
    installed: isInstalled('webpack-cli'),
    recommended: true,
    url: 'https://github.com/webpack/webpack-cli',
    description: 'The original webpack full-featured CLI.',
  },
  {
    name: 'webpack-command',
    package: 'webpack-command',
    binName: 'webpack-command',
    alias: 'command',
    installed: isInstalled('webpack-command'),
    recommended: false,
    url: 'https://github.com/webpack-contrib/webpack-command',
    description: 'A lightweight, opinionated webpack CLI.',
  },
];
// 判断两个CLI是否安装了
const installedClis = CLIs.filter((cli) => cli.installed);
// 根据安装的CLI数量进行处理
if (installedClis.length === 0) {
  const path = require('path');
  const fs = require('fs');
  // readline 模块提供了一个接口，用于一次一行地读取可读流（例如 process.stdin）中的数据。
  const readLine = require('readline');

  let notify =
    'One CLI for webpack must be installed. These are recommended choices, delivered as separate packages:';

  for (const item of CLIs) {
    if (item.recommended) {
      notify += `\n - ${item.name} (${item.url})\n   ${item.description}`;
    }
  }

  console.error(notify);

  // 以同步的方法检测目录是否存在 如果目录存在 返回 true ，如果目录不存在 返回false
  const isYarn = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));

  const packageManager = isYarn ? 'yarn' : 'npm';
  const installOptions = [isYarn ? 'add' : 'install', '-D'];

  console.error(
    `We will use "${packageManager}" to install the CLI via "${packageManager} ${installOptions.join(
      ' ',
    )}".`,
  );

  const question = `Do you want to install 'webpack-cli' (yes/no): `;

  const questionInterface = readLine.createInterface({
    input: process.stdin,
    output: process.stderr,
  });

  /**
   * rl.question(query[, options], callback)
   * rl.question() 方法通过将 query 写入 output 来显示它，并等待用户在 input 上提供输入，然后调用 callback 函数将提供的输入作为第一个参数传入。
   * @param query <string> 要写入 output 的语句或询问，前置于提示符。
   * @param options <Object>
   *    - signal <AbortSignal> Optionally allows the question() to be canceled using an AbortController.
   * @param callback <Function> 回调函数，调用时传入用户的输入以响应 query。
   **/
  questionInterface.question(question, (answer) => {
    questionInterface.close();

    const normalizedAnswer = answer.toLowerCase().startsWith('y');

    if (!normalizedAnswer) {
      console.error(
        "You need to install 'webpack-cli' to use webpack via CLI.\n" +
          'You can also install the CLI manually.',
      );
      process.exitCode = 1;

      return;
    }

    const packageName = 'webpack-cli';

    console.log(
      `Installing '${packageName}' (running '${packageManager} ${installOptions.join(
        ' ',
      )} ${packageName}')...`,
    );

    runCommand(packageManager, installOptions.concat(packageName))
      .then(() => {
        require(packageName); //eslint-disable-line
      })
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
  });
} else if (installedClis.length === 1) {
  const path = require('path');
  const pkgPath = require.resolve(`${installedClis[0].package}/package.json`);
  // eslint-disable-next-line node/no-missing-require
  const pkg = require(pkgPath);
  // eslint-disable-next-line node/no-missing-require
  require(path.resolve(
    path.dirname(pkgPath),
    pkg.bin[installedClis[0].binName],
  ));
} else {
  console.warn(
    `You have installed ${installedClis
      .map((item) => item.name)
      .join(
        ' and ',
      )} together. To work with the "webpack" command you need only one CLI package, please remove one of them or use them directly via their binary.`,
  );

  // @ts-ignore
  process.exitCode = 1;
}
```

简单来分析上上述的流程，首先定义了一个执行成功的返回值`process.exitCode = 0;`。

然后文件中定义了几个方法`runCommand`、`isInstalled`。

`webpack` 启动后最终找到 `webpack-cli(webpack-command)`这个 `npm` 包,并且执行 `CLI` 命令。

```js
#!/usr/bin/env node

/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 */

const { NON_COMPILATION_ARGS } = require('./utils/constants');

(function () {
  // wrap in IIFE to be able to use return

  const importLocal = require('import-local');
  // Prefer the local installation of webpack-cli
  if (importLocal(__filename)) {
    return;
  }

  require('v8-compile-cache');

  const ErrorHelpers = require('./utils/errorHelpers');

  const NON_COMPILATION_CMD = process.argv.find((arg) => {
    if (arg === 'serve') {
      global.process.argv = global.process.argv.filter((a) => a !== 'serve');
      process.argv = global.process.argv;
    }
    return NON_COMPILATION_ARGS.find((a) => a === arg);
  });

  if (NON_COMPILATION_CMD) {
    return require('./utils/prompt-command')(
      NON_COMPILATION_CMD,
      ...process.argv,
    );
  }

  const yargs = require('yargs').usage(`webpack-cli ${
    require('../package.json').version
  }

Usage: webpack-cli [options]
       webpack-cli [options] --entry <entry> --output <output>
       webpack-cli [options] <entries...> --output <output>
       webpack-cli <command> [options]

For more information, see https://webpack.js.org/api/cli/.`);

  require('./config/config-yargs')(yargs);

  // yargs will terminate the process early when the user uses help or version.
  // This causes large help outputs to be cut short (https://github.com/nodejs/node/wiki/API-changes-between-v0.10-and-v4#process).
  // To prevent this we use the yargs.parse API and exit the process normally
  yargs.parse(process.argv.slice(2), (err, argv, output) => {
    Error.stackTraceLimit = 30;

    // arguments validation failed
    if (err && output) {
      console.error(output);
      process.exitCode = 1;
      return;
    }

    // help or version info
    if (output) {
      console.log(output);
      return;
    }

    if (argv.verbose) {
      argv['display'] = 'verbose';
    }

    let options;
    try {
      options = require('./utils/convert-argv')(argv);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        const moduleName = err.message.split("'")[1];
        let instructions = '';
        let errorMessage = '';

        if (moduleName === 'webpack') {
          errorMessage = `\n${moduleName} not installed`;
          instructions = `Install webpack to start bundling: \u001b[32m\n  $ npm install --save-dev ${moduleName}\n`;

          if (
            process.env.npm_execpath !== undefined &&
            process.env.npm_execpath.includes('yarn')
          ) {
            instructions = `Install webpack to start bundling: \u001b[32m\n $ yarn add ${moduleName} --dev\n`;
          }
          Error.stackTraceLimit = 1;
          console.error(`${errorMessage}\n\n${instructions}`);
          process.exitCode = 1;
          return;
        }
      }

      if (err.name !== 'ValidationError') {
        throw err;
      }

      const stack = ErrorHelpers.cleanUpWebpackOptions(err.stack, err.message);
      const message = err.message + '\n' + stack;

      if (argv.color) {
        console.error(`\u001b[1m\u001b[31m${message}\u001b[39m\u001b[22m`);
      } else {
        console.error(message);
      }

      process.exitCode = 1;
      return;
    }

    /**
     * When --silent flag is present, an object with a no-op write method is
     * used in place of process.stout
     */
    const stdout = argv.silent ? { write: () => {} } : process.stdout;

    function ifArg(name, fn, init) {
      if (Array.isArray(argv[name])) {
        if (init) init();
        argv[name].forEach(fn);
      } else if (typeof argv[name] !== 'undefined') {
        if (init) init();
        fn(argv[name], -1);
      }
    }

    function processOptions(options) {
      // process Promise
      if (typeof options.then === 'function') {
        options.then(processOptions).catch(function (err) {
          console.error(err.stack || err);
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        });
        return;
      }

      const firstOptions = [].concat(options)[0];
      const statsPresetToOptions = require('webpack').Stats.presetToOptions;

      let outputOptions = options.stats;
      if (
        typeof outputOptions === 'boolean' ||
        typeof outputOptions === 'string'
      ) {
        outputOptions = statsPresetToOptions(outputOptions);
      } else if (!outputOptions) {
        outputOptions = {};
      }

      ifArg('display', function (preset) {
        outputOptions = statsPresetToOptions(preset);
      });

      outputOptions = Object.create(outputOptions);
      if (Array.isArray(options) && !outputOptions.children) {
        outputOptions.children = options.map((o) => o.stats);
      }
      if (typeof outputOptions.context === 'undefined')
        outputOptions.context = firstOptions.context;

      ifArg('env', function (value) {
        if (outputOptions.env) {
          outputOptions._env = value;
        }
      });

      ifArg('json', function (bool) {
        if (bool) {
          outputOptions.json = bool;
          outputOptions.modules = bool;
        }
      });

      if (typeof outputOptions.colors === 'undefined')
        outputOptions.colors = require('supports-color').stdout;

      ifArg('sort-modules-by', function (value) {
        outputOptions.modulesSort = value;
      });

      ifArg('sort-chunks-by', function (value) {
        outputOptions.chunksSort = value;
      });

      ifArg('sort-assets-by', function (value) {
        outputOptions.assetsSort = value;
      });

      ifArg('display-exclude', function (value) {
        outputOptions.exclude = value;
      });

      if (!outputOptions.json) {
        if (typeof outputOptions.cached === 'undefined')
          outputOptions.cached = false;
        if (typeof outputOptions.cachedAssets === 'undefined')
          outputOptions.cachedAssets = false;

        ifArg('display-chunks', function (bool) {
          if (bool) {
            outputOptions.modules = false;
            outputOptions.chunks = true;
            outputOptions.chunkModules = true;
          }
        });

        ifArg('display-entrypoints', function (bool) {
          outputOptions.entrypoints = bool;
        });

        ifArg('display-reasons', function (bool) {
          if (bool) outputOptions.reasons = true;
        });

        ifArg('display-depth', function (bool) {
          if (bool) outputOptions.depth = true;
        });

        ifArg('display-used-exports', function (bool) {
          if (bool) outputOptions.usedExports = true;
        });

        ifArg('display-provided-exports', function (bool) {
          if (bool) outputOptions.providedExports = true;
        });

        ifArg('display-optimization-bailout', function (bool) {
          if (bool) outputOptions.optimizationBailout = bool;
        });

        ifArg('display-error-details', function (bool) {
          if (bool) outputOptions.errorDetails = true;
        });

        ifArg('display-origins', function (bool) {
          if (bool) outputOptions.chunkOrigins = true;
        });

        ifArg('display-max-modules', function (value) {
          outputOptions.maxModules = +value;
        });

        ifArg('display-cached', function (bool) {
          if (bool) outputOptions.cached = true;
        });

        ifArg('display-cached-assets', function (bool) {
          if (bool) outputOptions.cachedAssets = true;
        });

        if (!outputOptions.exclude)
          outputOptions.exclude = [
            'node_modules',
            'bower_components',
            'components',
          ];

        if (argv['display-modules']) {
          outputOptions.maxModules = Infinity;
          outputOptions.exclude = undefined;
          outputOptions.modules = true;
        }
      }

      ifArg('hide-modules', function (bool) {
        if (bool) {
          outputOptions.modules = false;
          outputOptions.chunkModules = false;
        }
      });

      ifArg('info-verbosity', function (value) {
        outputOptions.infoVerbosity = value;
      });

      ifArg('build-delimiter', function (value) {
        outputOptions.buildDelimiter = value;
      });

      const webpack = require('webpack');

      let lastHash = null;
      let compiler;
      try {
        compiler = webpack(options);
      } catch (err) {
        if (err.name === 'WebpackOptionsValidationError') {
          if (argv.color)
            console.error(
              `\u001b[1m\u001b[31m${err.message}\u001b[39m\u001b[22m`,
            );
          else console.error(err.message);
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        }

        throw err;
      }
      // 加载进度条
      if (argv.progress) {
        const ProgressPlugin = require('webpack').ProgressPlugin;
        new ProgressPlugin({
          profile: argv.profile,
        }).apply(compiler);
      }
      if (outputOptions.infoVerbosity === 'verbose') {
        if (argv.w) {
          compiler.hooks.watchRun.tap('WebpackInfo', (compilation) => {
            const compilationName = compilation.name ? compilation.name : '';
            console.error('\nCompilation ' + compilationName + ' starting…\n');
          });
        } else {
          compiler.hooks.beforeRun.tap('WebpackInfo', (compilation) => {
            const compilationName = compilation.name ? compilation.name : '';
            console.error('\nCompilation ' + compilationName + ' starting…\n');
          });
        }
        compiler.hooks.done.tap('WebpackInfo', (compilation) => {
          const compilationName = compilation.name ? compilation.name : '';
          console.error('\nCompilation ' + compilationName + ' finished\n');
        });
      }

      function compilerCallback(err, stats) {
        if (!options.watch || err) {
          // Do not keep cache anymore
          compiler.purgeInputFileSystem();
        }
        if (err) {
          lastHash = null;
          console.error(err.stack || err);
          if (err.details) console.error(err.details);
          process.exitCode = 1;
          return;
        }
        if (outputOptions.json) {
          stdout.write(
            JSON.stringify(stats.toJson(outputOptions), null, 2) + '\n',
          );
        } else if (stats.hash !== lastHash) {
          lastHash = stats.hash;
          if (stats.compilation && stats.compilation.errors.length !== 0) {
            const errors = stats.compilation.errors;
            if (errors[0].name === 'EntryModuleNotFoundError') {
              console.error(
                '\n\u001b[1m\u001b[31mInsufficient number of arguments or no entry found.',
              );
              console.error(
                "\u001b[1m\u001b[31mAlternatively, run 'webpack(-cli) --help' for usage info.\u001b[39m\u001b[22m\n",
              );
            }
          }
          const statsString = stats.toString(outputOptions);
          const delimiter = outputOptions.buildDelimiter
            ? `${outputOptions.buildDelimiter}\n`
            : '';
          if (statsString) stdout.write(`${statsString}\n${delimiter}`);
        }
        if (!options.watch && stats.hasErrors()) {
          process.exitCode = 2;
        }
      }
      if (firstOptions.watch || options.watch) {
        const watchOptions =
          firstOptions.watchOptions ||
          options.watchOptions ||
          firstOptions.watch ||
          options.watch ||
          {};
        if (watchOptions.stdin) {
          process.stdin.on('end', function (_) {
            process.exit(); // eslint-disable-line
          });
          process.stdin.resume();
        }
        compiler.watch(watchOptions, compilerCallback);
        if (outputOptions.infoVerbosity !== 'none')
          console.error('\nwebpack is watching the files…\n');
      } else {
        compiler.run((err, stats) => {
          if (compiler.close) {
            compiler.close((err2) => {
              compilerCallback(err || err2, stats);
            });
          } else {
            compilerCallback(err, stats);
          }
        });
      }
    }
    processOptions(options);
  });
})();
```

## 执行流程分析

webpack 的执行流程用图来表示大致上是这么一个流程:

![webpack-执行流程图](https://img-blog.csdnimg.cn/968e6be3a07541d9822e8f8148ee8bc2.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`Webpack` 的运行流程是一个`串行`的过程，从启动到结束会依次执行以下流程：

1. 将命令行参数与 `webpack 配置文件` 合并、解析得到`参数对象 Options`。

2. 将参数对象 `Options` 传给 `webpack` 执行得到 `Compiler` 对象。初始化后 (compiler 对象中)：包含挂在我们的插件执行 执行 `complie.hooks.done.tap('MYPLUGIN name",()=>{});`

3. 执行 `Compiler` 的 `run`方法开始编译。每次执行 `run` 编译都会生成一个 `Compilation` 对象。

4. 触发 `Compiler` 的 `make`方法分析入口文件，调用 `compilation` 的 `addEntry` 递归遍历所有的入口文件。 调用 `compilation` 的 `buildModule` 方法创建主模块对象。

5. 生成入口文件 `AST(抽象语法树)`，通过 `AST` 分析和递归加载依赖模块。

6. 所有模块分析完成后，执行 `compilation` 的 `seal` 方法对每个 `chunk` 进行整理、优化、封装。

7. 最后执行 `Compiler` 的 `emitAssets` 方法把生成的文件输出到 `output` 的目录中。

## compiler 与 compilation

- ### compiler

> `Compiler` 对象包含了当前运行 `Webpack` 的完整配置，这个对象在启动 `Webpack` 时被实例化，包含了 `entry`、`output`、`loaders`、`plugins` 等配置，`Compiler` 类继承了 `Tapable`，使用 `Tapable` 实现了`事件发布订阅处理`的插件架构，当在 `webpack` 环境中应用一个插件时，插件将收到此 `compiler` 对象的引用。可以使用 `compiler` 来访问 `webpack` 的主环境。

```js
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      /** @type {SyncBailHook<Compilation>} */
      shouldEmit: new SyncBailHook(["compilation"]),
      /** @type {AsyncSeriesHook<Stats>} */
      done: new AsyncSeriesHook(["stats"]),
      /** @type {AsyncSeriesHook<>} */
      additionalPass: new AsyncSeriesHook([]),
      /** @type {AsyncSeriesHook<Compiler>} */
      ......
    };
    ......
}
```

由于 `Compier` 继承了 `Tapable`, 并且在实例上绑定了一个 `hook` 对象， 使得 `Compier` 的实例 `compier` 可以像这样使用:

```js
compiler.hooks.compile.tapAsync('afterCompile', (compilation, callback) => {
  console.log('This is an example plugin!');
  console.log(
    'Here’s the `compilation` object which represents a single build of assets:',
    compilation,
  );

  // 使用 webpack 提供的 plugin API 操作构建结果
  compilation.addModule(/* ... */);

  callback();
});
```

#### compier 重要的事件钩子

| 事件钩子      | 触发时机                                            | 参数        | 类型              |
| :------------ | :-------------------------------------------------- | :---------- | :---------------- |
| entry-option  | 初始化 option                                       | -           | SyncBailHook      |
| run           | 开始编译                                            | compiler    | AsyncSeriesHook   |
| compile       | 真正开始的编译，在创建 compilation 对象之前         | compilation | SyncHook          |
| compilation   | 生成好了 compilation 对象，可以操作这个对象啦       | compilation | SyncHook          |
| make          | 从 entry 开始递归分析依赖，准备对每个模块进行 build | compilation | AsyncParallelHook |
| after-compile | 编译 build 过程结束                                 | compilation | AsyncSeriesHook   |
| emit          | 在将内存中 assets 内容写到磁盘文件夹之前            | compilation | AsyncSeriesHook   |
| after-emit    | 在将内存中 assets 内容写到磁盘文件夹之后            | compilation | AsyncSeriesHook   |
| done          | 完成所有的编译过程                                  | stats       | AsyncSeriesHook   |
| failed        | 编译失败的时候                                      | error       | SyncHook          |

- ### compilation

> `compilation` 对象代表了一次资源版本构建，当执行`compiler.run` 后首先会触发 `compile` ，这一步会构建出 `compilation 对象`，`compilation` 的职责就是构建`模块`和 `Chunk`，并利用插件优化构建过程。。当运行 `webpack` 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 `compilation`，从而生成一组新的`编译资源`。一个 `compilation` 对象表现了当前的`模块资源`、`编译生成资源`、`变化的文件`、以及`被跟踪依赖的状态信息`。`compilation` 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

```js
class Compilation extends Tapable {
  /**
   * Creates an instance of Compilation.
   * @param {Compiler} compiler the compiler which created the compilation
   */
  constructor(compiler) {
    super();
    this.hooks = {
      /** @type {SyncHook<Module>} */
      buildModule: new SyncHook(['module']),
      /** @type {SyncHook<Module>} */
      rebuildModule: new SyncHook(['module']),
      /** @type {SyncHook<Module, Error>} */
      failedModule: new SyncHook(['module', 'error']),
      /** @type {SyncHook<Module>} */
      succeedModule: new SyncHook(['module']),

      /** @type {SyncHook<Dependency, string>} */
      addEntry: new SyncHook(['entry', 'name']),
      /** @type {SyncHook<Dependency, string, Error>} */
    };
  }
}
```

#### compilation 重要的事件钩子

| 事件钩子              | 触发时机                                                                 | 参数                 | 类型            |
| :-------------------- | :----------------------------------------------------------------------- | :------------------- | :-------------- |
| normal-module-loader  | 普通模块 loader，真正（一个接一个地）加载模块图(graph)中所有模块的函数。 | loaderContext module | SyncHook        |
| seal                  | 编译(compilation)停止接收新模块时触发。                                  | -                    | SyncHook        |
| optimize              | 优化阶段开始时触发。                                                     | -                    | SyncHook        |
| optimize-modules      | 模块的优化                                                               | modules              | SyncBailHook    |
| optimize-chunks       | 优化 chunk                                                               | chunks               | SyncBailHook    |
| additional-assets     | 为编译(compilation)创建附加资源(asset)。                                 | -                    | AsyncSeriesHook |
| optimize-chunk-assets | 优化所有 chunk 资源(asset)。                                             | chunks               | AsyncSeriesHook |
| optimize-assets       | 优化存储在 compilation.assets 中的所有资源(asset)                        | assets               | AsyncSeriesHook |
