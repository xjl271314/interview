---
title: 手写实现mini版webpack
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# mini 版 webpack

- 2022.11.07

## 创建 minipack.js

```js
const fs = require('fs');
const path = require('path');

// babylon解析js语法，生产AST 语法树
// ast将js代码转化为一种JSON数据结构
const babylon = require('babylon');
// babel-traverse是一个对ast进行遍历的工具, 对ast进行替换
const traverse = require('babel-traverse').default;
// 将es6 es7 等高级的语法转化为es5的语法
const { transformFromAst } = require('babel-core');

// 每一个js文件，对应一个id
let ID = 0;

// filename参数为文件路径, 读取内容并提取它的依赖关系
function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');

  // 获取该文件对应的ast 抽象语法树
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });

  // dependencies保存所依赖的模块的相对路径
  const dependencies = [];

  // 通过查找import节点，找到该文件的依赖关系
  // 因为项目中我们都是通过import 引入其他文件的，找到了import的节点，就找到了这个文件引用了哪些文件
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      // 查找import节点
      dependencies.push(node.source.value);
    },
  });

  // 通过递增计数器，为此模块分配唯一标识符，用于缓存已经解析过的文件
  const id = ID++;
  // 该`presets`选项是一组规则，告诉`babel`如何传输我们的代码
  // 用`babel-preset-env`将代码转换为浏览器可以运行的东西.
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });

  // 返回此模块的相关信息
  return {
    id, // 文件id（唯一）
    filename,
    dependencies,
    code,
  };
}

// 提取每一个依赖文件的依赖关系，不断循环找到对应这个项目的依赖图
function createGraph(entry) {
  // 得到入口文件的依赖关系
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.mapping = {};
    // 获取这个模块所在的目录
    const dirname = path.dirname(asset.filename);
    asset.dependencies.forEach((relativePath) => {
      // 通过将相对路径与父资源目录的路径连接,将相对路径转变为绝对路径
      // 每个文件的绝对路径是固定、唯一的
      const absolutePath = path.join(dirname, relativePath);
      // 递归解析其中所引入的其他资源
      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;
      // 将`child`推入队列, 通过递归实现了这样它的依赖关系解析
      queue.push(child);
    });
  }
  // queue这就是最终的依赖关系图谱
  return queue;
}

// 自定义实现了require 方法，找到导出变量的引用逻辑
function bundle(graph) {
  let modules = '';
  graph.forEach((mod) => {
    modules += `${mod.id}: [
            function (require, module, exports) { ${mod.code} },
            ${JSON.strinngify(mod.mapping)},
        ],`;
  });

  const result = `
        (function(modules) {
            function require(id) {
                const [fn, mapping] = modules[id];
                function localRequire(name) {
                    return require(mapping[name]);
                }
                const module = { exports: {} };
                fn(localRequire, module, module.exports);
                return module.exports;
            }
            require(0);
        })({${modules}})
    `;

  return result;
}

// 项目入口文件
const graph = createGraph('./example/entry.js');
const result = bundle(graph);

// 创建dist目录，将打包的内容写入main.js
fs.mkdir('dist', (err) => {
  if (!err) {
    fs.writeFile('dist/main.js', result, (err1) => {
      if (!err1) console.log('打包成功!');
    });
  }
});
```

## mini 版的 webpack 打包流程

1. 从入口文件开始解析
2. 查找入口文件引入了哪些 js 文件，找到依赖关系
3. 递归遍历引入的其他 js，生成最终的依赖关系图谱
4. 同时将 ES6 语法转化成 ES5
5. 最终生成一个可以在浏览器加载执行的 js 文件

## 创建测试目录 example

在目录下创建以下 4 个文件:

1. 创建入口文件 entry.js

```js
import message from './message.js';
// 将message的内容显示到页面中
let p = document.createElement('p');
p.innerHTML = message;
document.body.appendChild(p);
```

2. 创建 message.js

```js
import { name } from './name.js';
export default `hello ${name}!`;
```

3. 创建 name.js

```js
export const name = 'Webpack';
```

4. 创建 index.html

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body>
  <!-- 引入打包后的main.js -->
  <script src="./dist/main.js"></script></body>
</html>
```

5. 执行打包脚本，dist 目录下生成 main.js

```js
node minipack.js
```

6. 浏览器打开 index.html

页面上显示`hello Webpack!`。

[mini-webpack 的 github 源码地址](https://github.com/xy-sea/blog/tree/dev/mini-webpack)

## 分析打包生成的文件

**文件内容**

1. 文件里是一个立即执行函数
2. 该函数接收的参数是一个对象，该对象有 3 个属性
   - 0 代表 entry.js;
   - 1 代表 message.js;
   - 2 代表 name.js

```js
// 文件里是一个立即执行函数
(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];
    function localRequire(name) {
      // ⬅️ 第四步 跳转到这里 此时mapping[name] = 1，继续执行require(1)
      // ⬅️ 第六步 又跳转到这里 此时mapping[name] = 2，继续执行require(2)
      return require(mapping[name]);
    }
    // 创建module对象
    const module = { exports: {} };
    // ⬅️ 第二步 执行fn
    fn(localRequire, module, module.exports);

    return module.exports;
  }
  // ⬅️ 第一步 执行require(0)
  require(0);
})({
  // 立即执行函数的参数是一个对象，该对象有3个属性
  // 0 代表entry.js;
  // 1 代表message.js
  // 2 代表name.js
  0: [
    function (require, module, exports) {
      'use strict';
      // ⬅️ 第三步 跳转到这里 继续执行require('./message.js')
      var _message = require('./message.js');
      // ⬅️ 第九步 跳到这里 此时_message为 {default: 'hello Webpack!'}
      var _message2 = _interopRequireDefault(_message);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var p = document.createElement('p');
      // ⬅️ 最后一步 将_message2.default: 'hello Webpack!'写到p标签中
      p.innerHTML = _message2.default;
      document.body.appendChild(p);
    },
    { './message.js': 1 },
  ],
  1: [
    function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      // ⬅️ 第五步 跳转到这里 继续执行require('./name.js')
      var _name = require('./name.js');
      // ⬅️ 第八步 跳到这里 此时_name为{name: 'Webpack'}, 在exports对象上设置default属性，值为'hello Webpack!'
      exports.default = 'hello ' + _name.name + '!';
    },
    { './name.js': 2 },
  ],
  2: [
    function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      // ⬅️ 第七步 跳到这里 在传入的exports对象上添加name属性，值为'Webpack'
      var name = (exports.name = 'Webpack');
    },
    {},
  ],
});
```

## 分析文件的执行过程

1. 整体大致分为 10 步，第一步从`require(0)`开始执行，调用内置的自定义`require`函数，跳转到第二步，执行 fn 函数.

2. 执行第三步`require('./message.js')`，继续跳转到第四步 `require(mapping['./message.js'])`, 最终转化为`require(1)`.

3. 继续执行`require(1)`，获取`modules[1]`，也就是执行`message.js`的内容.

4. 第五步`require('./name.js')`，最终转化为`require(2)`，执行`name.js`的内容.

5. 通过递归调用，将代码中导出的属性，放到`exports`对象中，一层层导出到最外层.

6. 最终通过`_message2.default`获取导出的值，页面显示`hello Webpack!`.

## 总结:Webpack 的打包流程

1. `webpack`从项目的`entry入口文件`开始递归分析，调用所有配置的 `loader` 对模块进行编译

   因为`webpack`默认只能识别`js`代码，所以如`css文件`、`.vue结尾`的文件，必须要通过对应的`loader`解析成`js`代码后，`webpack`才能识别。

2. 利用`babel(babylon)`将 js 代码转化为`ast`抽象语法树，然后通过`babel-traverse`对`ast`进行遍历.

3. 遍历的目的找到文件的`import`引用节点

   因为现在我们引入文件都是通过`import`的方式引入，所以找到了`import`节点，就找到了文件的依赖关系

4. 同时每个模块生成一个`唯一的id`，并将解析过的模块缓存起来，如果其他地方也引入该模块，就无需重新解析，最后根据依赖关系生成依赖图谱。

5. 递归遍历所有依赖图谱的模块，组装成一个个包含多个模块的 `Chunk(块)`。

6. 最后将生成的文件输出到 `output` 的目录中。
