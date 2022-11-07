---
title: AST抽象语法树
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 描述下什么是 AST?

- 2021.07.13

> `AST（Abstract Syntax Tree)`，是源代码的抽象语法结构的树状表现形式。树上的每个节点都表示源代码中的一种结构。之所以说语法是「抽象」的，是因为这里的语法并不会表示出真实语法中出现的每个细节。

这样可能还比较抽象，来看个简单的示例：

![AST示例](https://img-blog.csdnimg.cn/20210713195721436.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上图只展示了部分 AST，实际上每个节点会有更多的信息，这里有一个[在线的 AST 转换网址](https://astexplorer.net/)。

## AST 转换工具

- jscodeshift

[jscodeshift](https://github.com/facebook/jscodeshift) 是基于 `recast` 封装的一个库，相比于 `recast` 不友好的 `api` 设计，`jscodeshift` 将其封装并暴露出对 js 开发者来说更为友好的 api，让我们在操作修改 `AST` 的时候更加方便。

## AST 类型大全

- @babel/types

这是一本 `AST` 类型词典，如果我们想要生成一些新的代码，也就是要生成一些新的节点，按照语法规则，你必须将你要添加的节点类型按照规范传入，比如 `const`  的类型就为 `type: VariableDeclaration` ，当然了， `type`  只是一个节点的一个属性而已，还有其他的，你都可以在这里面查阅到。

下面是常用的节点类型含义对照表，更多的类型大家可以查阅这里 [@babel/types](https://babeljs.io/docs/en/babel-types)

| 类型名称            | 中文译名      | 描述                                                  |
| :------------------ | :------------ | ----------------------------------------------------- |
| Program             | 程序主体      | 整段代码的主体                                        |
| VariableDeclaration | 变量声明      | 声明变量，比如 let const var                          |
| FunctionDeclaration | 函数声明      | 声明函数，比如 function                               |
| ExpressionStatement | 表达式语句    | 通常为调用一个函数，比如 console.log(1)               |
| BlockStatement      | 块语句        | 包裹在 {} 内的语句，比如 if (true) { console.log(1) } |
| BreakStatement      | 中断语句      | 通常指 break                                          |
| ContinueStatement   | 持续语句      | 通常指 continue                                       |
| ReturnStatement     | 返回语句      | 通常指 return                                         |
| SwitchStatement     | Switch 语句   | 通常指 switch                                         |
| IfStatement         | If 控制流语句 | 通常指 if (true) {} else {}                           |
| Identifier          | 标识符        | 标识，比如声明变量语句中 const a = 1 中的 a           |
| ArrayExpression     | 数组表达式    | 通常指一个数组，比如 [1, 2, 3]                        |
| StringLiteral       | 字符型字面量  | 通常指字符串类型的字面量，比如 const a = '1' 中的 '1' |
| NumericLiteral      | 数字型字面量  | 通常指数字类型的字面量，比如 const a = 1 中的 1       |
| ImportDeclaration   | 引入声明      | 声明引入，比如 import                                 |

## AST 节点的增删改查

这里使用`jscodeshift`的 api 进行一个树的增删改查来简单地了解下使用方式。

### 开发环境安装

```js
// 第一步：创建一个项目文件夹
mkdir ast-demo
cd ast-demo

// 第二步：项目初始化
npm init -y

// 第三步：安装 jscodeshift
npm install jscodeshift --save

// 第四步：新建 4  个 js 文件，分别对应增删该查。
touch create.js delete.js update.js find.js
```

执行示例时，可以打开 [AST Explorer](https://astexplorer.net/) ，把要转换的 `value` 都复制进来看看它的树结构，以便更好地理解。

### 查找节点

```js
// find.js

const jf = require('jscodeshift');
// yarn add colors -D
const colors = require('colors');
const value = `
import React from 'react';
import { Button } from 'antd';
`;

const root = jf(value);
root
  .find(jf.ImportDeclaration, { source: { value: 'antd' } })
  .forEach((path) => {
    console.log(colors.green(path.node.source.value)); // antd
  });
```

![find.js](https://img-blog.csdnimg.cn/20210714165809358.png)

在此说明一下，上面代码中定义的 `value` 字符串就是我们要操作的文本内容，实际应用中我们一般都是读取文件，然后做处理。

### 修改节点

```js
// update.js

const jf = require('jscodeshift');
const colors = require('colors');

const value = `
import React from 'react';
import { Button, Input } from 'antd';
`;

const root = jf(value);
root
  .find(jf.ImportDeclaration, { source: { value: 'antd' } })
  .forEach((path) => {
    const { specifiers } = path.node;
    specifiers.forEach((spec) => {
      if (spec.imported.name === 'Button') {
        spec.imported.name = 'Select';
      }
    });
  });

console.log(colors.red(root.toSource()));
```

![update.js](https://img-blog.csdnimg.cn/20210714165946499.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上面的代码目的是将从 `antd` 引入的 `Button` 改为 `Input` ，为了很精确地定位在这一行，我们先通过 `ImportDeclaration` 和`条件参数`去找到，在向内找到 `Button` 这个节点，简单的判断之后就可以做修改了。

最后一行我们执行了 `toSource()` ，该方法就是将 `AST` 转回为我们的`源码`。

### 增加节点

```js
const jf = require('jscodeshift');
const colors = require('colors');

const value = `
import React from 'react';
import { Button, Input } from 'antd';
`;

const root = jf(value);
root
  .find(jf.ImportDeclaration, { source: { value: 'antd' } })
  .forEach((path) => {
    const { specifiers } = path.node;
    specifiers.push(jf.importSpecifier(jf.identifier('Select')));
  });

console.log(colors.green(root.toSource()));
```

![create.js](https://img-blog.csdnimg.cn/2021071417355339.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上面代码首先仍然是找到 `antd` 那行，然后在 `specifiers` 这个数组的最后一位添加一个新的节点，表现在转换后的 `js` 代码上就是，新增了一个 `Select` 的引入。

### 删除节点

```js
const jf = require('jscodeshift');
const colors = require('colors');

const value = `
import React from 'react';
import { Button, Input } from 'antd';
`;

const root = jf(value);
root
  .find(jf.ImportDeclaration, { source: { value: 'antd' } })
  .forEach((path) => {
    jf(path).replaceWith('');
  });

console.log(colors.red(root.toSource()));
```

上述代码删除引入 `antd` 一整行代码。

## 实战演练

这里我们以一个替换所有文件中的引用的`import './styles.css';` 全部转化为以`.scss`为后缀的方式做一个简单的示例,[示例的完整代码]()。

该示例会简单的使用到[commander](https://github.com/tj/commander.js)，运用它可以简化我们的 nodejs 命令接口。

### 环境搭建

这里类似上方步骤简要搭建：

```bash
# 创建项目目录
mkdir project
cd project

# 初始化
npm init -y

# 安装依赖包
npm i commander globby jscodeshift --save

# 创建入口文件
mkdir src
cd src
touch index.js
```

现在目录如下：

```js
|-- project
    |-- node_modules
    |-- src
    |-- index.js
    |-- package.json
```

接下来在 `package.json` 中找个位置加入以下代码：

```json
{
  "main": "src/index.js",
  "bin": {
    "tscss": "src/index.js"
  },
  "files": ["src"]
}
```

其中 `bin` 字段很重要，在其他开发者下载了你这个包之后，人家在 `tscss xxxxxx` 时就会以 `node` 执行后面配置的文件，即 `src/index.js` ，当然，我们的 `index.js` 还要在最顶部加上这行代码：

```js
#! /usr/bin/env node
```

这句代码解决了不同的用户 `node` 路径不同的问题，可以让系统动态的去查找 `node` 来执行你的脚本文件。

### 使用 commander

在 `index.js` 中加入以下代码：

```js
const { program } = require('commander');

program.version('0.0.1').option('-o, --out <path>', 'output root path');

program.on('--help', () => {
  console.log(`
  You can add the following commands to npm scripts:
 ------------------------------------------------------
  "compile": "tscss -o dist"
 ------------------------------------------------------
`);
});

program.parse(process.argv);

const { out } = program.opts();
console.log(out);

if (!out) {
  throw new Error('--out must be specified');
}
```

接下来在项目根目录下，执行以下控制台命令：

```js
node src/index.js -o dist
```

控制台打印了 `dist` ，是的，就是 `-o dist` 的作用，简单介绍下 `version` 和 `option` 。

- version

  作用：定义命令程序的版本号；
  用法示例：.version('0.0.1', '-v, --version') ；
  参数解析：

  - 第一个参数，版本号 <必须>；
  - 第二个参数，自定义标志 <可省略>，默认为 -V 和 --version。

- option

  作用：用于定义命令选项；
  用法示例：.option('-n, --name ', 'edit your name', 'vortesnail')；
  参数解析：

  - 第一个参数，自定义标志 <必须>，分为长短标识，中间用逗号、竖线或者空格分割；
    （标志后面可跟参数，可以用 <> 或者 [] 修饰，前者意为必须参数，后者意为可选参数）
  - 第二个参数，选项描述 <省略不报错>，在使用 --help 命令时显示标志描述；
  - 第三个参数，选项参数默认值，可选。

因此我们还可以试试这两个命令：

```js
node src/index.js --version
node src/index.js --help
```

### 读取 dist 下 js 文件

`dist` 目录是假定我们要去做样式文件后缀名替换的文件根目录，现在需要使用 `globby` 工具自动读取该目录下的所有 `js` 文件路径，在顶部需要引入两个函数：

```js
const { resolve } = require('path');
const { sync } = require('globby');
```

然后在下面继续追加代码：

```js
const outRoot = resolve(process.cwd(), out);

console.log(`tsccss --out ${outRoot}`);

// Read output files
const files = sync(`${outRoot}/**/!(*.d).{ts,tsx,js,jsx}`, {
  dot: true,
}).map((x) => resolve(x));
console.log(files);
```

`files` 即 `dist` 目录下所有 `js` 文件路径，我们可以在该目录下新建几个任意的 `js` 文件，再执行下 `node src/index.js -o dist` ，看看控制台是不是正确打印出了这些文件的绝对路径。

![demo](https://img-blog.csdnimg.cn/20210714200418107.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 编写替换方法

有了前面的增删改查的铺垫，其实现在这一步已经很简单了，思路就是：

1. 找到所有类型为 `ImportDeclaration` 的节点；
2. 运用正则判断该节点的 `source.value` 是否以 `.css`结尾；
3. 若正则匹配到了，我们就运用正则的一些用法将其后缀替换为 `.scss` 。

我们在`index.js` 中引入 `jscodeshift`，并追加以下代码:

```js
const jscodeshift = require('jscodeshift');

function transToSCSS(str) {
  const jf = jscodeshift;
  const root = jf(str);
  root.find(jf.ImportDeclaration).forEach((path) => {
    let value = '';
    if (path && path.node && path.node.source) {
      value = path.node.source.value;
    }
    const regex = /(styl|scss|css|less)('|"|`)?$/i;
    if (value && regex.test(value.toString())) {
      path.node.source.value = value
        .toString()
        .replace(regex, (_res, $1, $2) => ($2 ? `scss${$2}` : 'scss'));
    }
  });

  return root.toSource();
}
```

### 读写文件

拿到文件路径 `files` 后，需要 `node` 原生模块 `fs` 来帮助我们读写文件，这部分代码很简单。

> 思路就是：读 `js` 文件，将文件内容转换为 `AST` 做节点值替换，再转为 `js` 代码，最后写回该文件。

我们在 `index.js` 中追加如下代码:

```js
const { readFileSync, writeFileSync } = require('fs');

const filesLen = files.length;
for (let i = 0; i < filesLen; i += 1) {
  const file = files[i];
  const content = readFileSync(file, 'utf-8');
  const resContent = transToSCSS(content);
  writeFileSync(file, resContent, 'utf8');
}
```

然后我们去`dist` 目录下的 `index1.js` 、 `index2.js` 文件中，随便输入以下内容，以便查看效果：

```js
import 'style.scss';
import 'style.less';
import 'style.css';
```

然后最后一次执行我们的命令：

```js
node src/index.js -o dist
```
