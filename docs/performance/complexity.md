---
title: 前端代码复杂度
nav:
  title: 前端代码复杂度
  path: /performance
  order: 0
group:
  title: 前端性能优化相关试题
  path: /performance/project
---

# 前端代码复杂度

- 2021.12.29

## 圈复杂度

圈复杂度 在 1976 年由 Thomas J. McCabe, Sr. 提出。

### 定义

> `圈复杂度 (Cyclomatic complexity)` 是一种代码复杂度的衡量标准，也称为条件复杂度或循环复杂度，它可以用来衡量一个模块判定结构的复杂程度，数量上表现为独立现行路径条数，也可理解为覆盖所有的可能情况最少使用的测试用例数。简称 `CC` 。其符号为 `VG` 或是 `M`。

圈复杂度大说明程序代码的判断逻辑复杂，可能质量低且难于测试和维护。程序的可能错误和高的圈复杂度有着很大关系。

### 衡量标准

代码复杂度低，代码不一定好，但代码复杂度高，代码一定不好。

| 圈复杂度 | 代码状况     | 可测性 | 维护成本 |
| :------- | :----------- | :----- | :------- |
| 1 - 10   | 清晰、结构化 | 高     | 低       |
| 10 - 20  | 复杂         | 中     | 中       |
| 20 - 30  | 非常复杂     | 低     | 高       |
| >30      | 不可读       | 不可测 | 非常高   |

### 计算方式

#### 1. 控制流程图

控制流程图，是一个过程或程序的抽象表现，是用在编译器中的一个抽象数据结构，由编译器内部维护，代表了一个程序执行过程中会遍历到的所有路径。它用图的形式表示一个过程内所有基本块执行的可能流向, 也能反映一个过程的实时执行过程。

这里是一些常见的控制流程：

![控制流程图](https://img-blog.csdnimg.cn/4b78efec7bf949239d5ae478fa9c58f1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 2. 节点判定法

有一个简单的计算方法，圈复杂度实际上就是等于判定节点的数量再加上 1。向上面提到的：`if else` 、`switch case` 、 `for循环`、`三元运算符`等等，都属于一个判定节点，例如下面的代码：

```js
function testComplexity(*param*) {
    let result = 1;
    if (param > 0) {
        result--;
    }
    for (let i = 0; i < 10; i++) {
        result += Math.random();
    }
    switch (parseInt(result)) {
        case 1:
            result += 20;
            break;
        case 2:
            result += 30;
            break;
        default:
            result += 10;
            break;
    }
    return result > 20 ? result : result;
}
```

上面的代码中一共有 1 个`if`语句，一个`for`循环，两个`case`语句，一个三元运算符,所以代码复杂度为 `4+1+1=6`。

另外，需要注意的是 `||` 和 `&&` 语句也会被算作一个判定节点，例如下面代码的代码复杂为`3`：

```js
function testComplexity(*param*) {
    let result = 1;
    if (param > 0 && param < 10) {
        result--;
    }
    return result;
}
```

#### 3. 点边计算法

```js
/**
 * E：控制流图中边的数量
 * N：控制流图中的节点数量
 * P：独立组件的数目
**/
M = E − N + 2P
```

`边`和`节点`都是数据结构图中最基本的概念：

```jsx
/**
 * inline: true
 */
import React from 'react';

export default () => {
  return (
    <img
      src="https://img-blog.csdnimg.cn/dcd95bda26dc45febf7b33b11cf4d4cb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_10,color_FFFFFF,t_70,g_se,x_16"
      style={{ width: 300 }}
    />
  );
};
```

`P`代表图中独立组件的数目，独立组件是什么意思呢？来看看下面两个图，左侧为`连通图`，右侧为`非连通图`：

- 连通图：对于图中任意两个顶点都是连通的

![连通图](https://img-blog.csdnimg.cn/daffc09267fa4354a6b960f9bc2b1808.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

一个连通图即为图中的一个独立组件，所以左侧图中独立组件的数目为 1，右侧则有两个独立组件。

对于我们的代码转化而来的控制流程图，正常情况下所有节点都应该是连通的，除非你在某些节点之前执行了 return，显然这样的代码是错误的。所以每个程序流程图的独立组件的数目都为 1，所以上面的公式还可以简化为 `M = E − N + 2` 。

### 度量工具

- CodeMetrics

  一款`VSCode`插件，用于度量 TS、JS 代码圈复杂度。

- ESLint

  `eslint`也可以配置关于圈复杂度的规则，我们将开启 `rules` 中的 `complexity` 规则，并将圈复杂度大于 0 的代码的 `rule severity` 设置为 `warn` 或 `error` 。

  ```js
  // 设置为警告⚠️ 当前每个函数的最高圈复杂度为10，否则 eslint 将给出警告提示。
  rules: {
      complexity: [
          'warn',
          {
          max: 10
          }
      ],
  }
  // 设置为错误❌ 当前每个函数的最高圈复杂度为15，否则 eslint 将给出错误提示。
  rules: {
      complexity: [
          'error',
          {
          max: 15
          }
      ],
  }
  ```

  这样 `eslint` 就会自动检测出所有函数的代码复杂度，并输出一个类似下面的 `message`。

  ```js
  Method 'testFunc' has a complexity of 12. Maximum allowed is 10
  Async function has a complexity of 16. Maximum allowed is 15.
  ...
  ```

- conard cc

  一款开源的[代码圈复杂度检测工具](https://github.com/ConardLi/awesome-cli)，可以生成当前项目下代码圈复杂度报告。

### 降低的方法

我们可以通过一些代码重构手段来降低代码的圈复杂度。

#### 1.抽象配置，条件语句常量化

- 重构前

  ```js
  // 圈复杂度4
  const handleStatus = (status) => {
    let code = 0;
    if (status == 1) {
      code = 1;
    } else if (status == 2) {
      code = 2;
    } else if (status == 3) {
      code = 3;
    }

    return code;
  };
  ```

- 重构后

  ```js
  // 圈复杂度2
  const handleStatus = (status) => {
    const STATUS = {
      1: 1,
      2: 2,
      3: 3,
    };

    return STATUS[status] || 0;
  };
  ```

#### 2. 函数提炼与拆分，单一职责（推荐）

既然是降低一个模块（函数）圈复杂度，那么对于复杂度极高的函数，首先需要进行就是功能的提炼与函数拆分，每个函数职责要单一。

- 重构前

  ```js
  // 圈复杂度3
  function add(x, y) {
    if (x > y) {
      return x + y;
    } else if (x < y) {
      return y - x;
    } else {
      return 0;
    }
  }
  ```

- 重构后

  ```js
  // 圈复杂度3
  function add(x, y) {
    return x + y;
  }

  function decrease(x, y) {
    return y - x;
  }

  function calcluate(x, y) {
    if (x > y) {
      return add(x, y);
    } else if (x < y) {
      return decrease(x, y);
    }
    return 0;
  }
  ```

上述的代码虽然圈复杂度没有降低，但是可读性比较之前强了很多，万一函数内部有其他逻辑也可以只去修改对应方法。

#### 3. 使用 break 和 return 代替控制标记

我们经常会使用一个控制标记来标示当前程序运行到某一状态，很多场景下，使用 `break` 和 `return` 可以代替这些标记并降低代码复杂度。

- 重构前

  ```js
  const handleValudators = validators => {
      let isValidate = true;
      for(let i = 0; i< validators.length; i++){
          const validator = validators[i];
          if(isValidate){
              if(!validator()){
                  isValidate = false;
                  showErrorMsg();
              }
          }
      }
      // commit
      if(isValidate){
          ...
      }
  }

  ```

- 重构后

  ```js
  const handleValudators = validators => {
      for(let i = 0; i< validators.length; i++){
          const validator = validators[i];
          if(!validator()){
              showErrorMsg();
              break;
          }
      }
      // commit
      ...
  }

  ```

#### 4. 简化条件判断

- 重构前

  ```js
  const isPassed = (x, y, z) => {
    if (x > 0 && y > 0 && z > 0) {
      return true;
    }
    // 逻辑合并
    else if ((x && y) || (x && z)) {
      return true;
    }

    return false;
  };
  ```

- 重构后

  ```js
  const isPassed = (x, y, z) => {
    if (x || y || z) {
      return true;
    } else if (x && (y || c)) {
      return true;
    }

    return false;
  };
  ```

### eslint 详细使用

我们可以借助 `eslint` 的 `CLIEngine` ，在本地使用自定义的 `eslint` 规则扫描代码，并获取扫描结果输出。

初始化 `CLIEngine`:

```js
const eslint = require('eslint');

const { CLIEngine } = eslint;

const cli = new CLIEngine({
  parserOptions: {
    ecmaVersion: 2018, // 具体的版本配置可以查看https://cn.eslint.org/docs/user-guide/configuring#specifying-parser-options
  },
  rules: {
    complexity: ['error', { max: 0 }],
  },
});
```

使用 `executeOnFiles` 对指定文件进行扫描，并获取结果，过滤出所有 `complexity` 的 `message` 信息。

```js
const reports = cli.executeOnFiles(['.']).results;

for (let i = 0; i < reports.length; i++) {
  const { messages } = reports[i];
  for (let j = 0; j < messages.length; j++) {
    const { message, ruleId } = messages[j];
    if (ruleId === 'complexity') {
      console.log(message);
    }
  }
}
```

通过 `eslint` 的检测结果将有用的信息提取出来，先测试几个不同类型的函数，看看 `eslint` 的检测结果：

```js
function func1() {
  console.log(1);
}

const func2 = () => {
  console.log(2);
};

class TestClass {
  func3() {
    console.log(3);
  }
}

async function func4() {
  console.log(1);
}
```

执行结果：

```js
Function 'func1' has a complexity of 1. Maximum allowed is 0.
Arrow function has a complexity of 1. Maximum allowed is 0.
Method 'func3' has a complexity of 1. Maximum allowed is 0.
Async function 'func4' has a complexity of 1. Maximum allowed is 0.
```

可以发现，函数类型不同外复杂度都是相同的。

其中函数的类型：

- Function ：普通函数
- Arrow function ： 箭头函数
- Method ： 类方法
- Async function ： 异步函数

截取方法类型：

```js
const REG_FUNC_TYPE = /^(Method |Async function |Arrow function |Function )/g;

function getFunctionType(message) {
  let hasFuncType = REG_FUNC_TYPE.test(message);
  return hasFuncType && RegExp.$1;
}
```

将有用的部分提取出来：

```js
const MESSAGE_PREFIX = 'Maximum allowed is 1.';
const MESSAGE_SUFFIX = 'has a complexity of ';

function getMain(message) {
  return message.replace(MESSAGE_PREFIX, '').replace(MESSAGE_SUFFIX, '');
}
```

提取方法名称：

```js
function getFunctionName(message) {
  const main = getMain(message);
  let test = /'([a-zA-Z0-9_$]+)'/g.test(main);
  return test ? RegExp.$1 : '*';
}
```

截取代码复杂度：

```js
function getComplexity(message) {
  const main = getMain(message);
  /(\d+)\./g.test(main);
  return +RegExp.$1;
}
```

除了 `message` ，还有其他的有用信息：

- 函数位置：获取 messages 中的 line 、column 即函数的行、列位置
- 当前文件名称：reports 结果中可以获取当前扫描文件的绝对路径 filePath ，通过下面的操作获取真实文件名：

  ```js
  filePath.replace(process.cwd(), '').trim();
  ```

### 功能插件化

将代码复杂度检测封装成基础包，根据自定义配置输出检测数据，供其他应用调用。

上面的展示了使用 `eslint` 获取代码复杂度的思路，下面我们要把它封装为一个通用的工具，考虑到工具可能在不同场景下使用，例如：网页版的分析报告、cli 版的命令行工具，我们把通用的能力抽象出来以 npm 包 的形式供其他应用使用。

在计算项目代码复杂度之前，我们首先要具备一项基础能力，代码扫描，即我们要知道我们要对项目里的哪些文件做分析，首先 `eslint` 是具备这样的能力的，我们也可以直接用 `glob` 来遍历文件。

但是他们都有一个缺点，就是 `ignore` 规则是不同的，这对于用户来讲是有一定学习成本的，因此我可以手动封装代码扫描，使用通用的 `npm ignore` 规则，这样代码扫描就可以直接使用 `.gitignore`这样的配置文件。另外，代码扫描作为代码分析的基础能力，其他代码分析也是可以公用的。

- 基础能力
  - 代码扫描能力
  - 复杂度检测能力
  - ...
- 应用
  - 命令行工具
  - 代码分析报告
  - ...

完整功能模块参见[原文](http://www.conardli.top/blog/article/%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F-%E5%9C%88%E5%A4%8D%E6%9D%82%E5%BA%A6%E5%8E%9F%E7%90%86%E5%92%8C%E5%AE%9E%E8%B7%B5.html#%E5%8F%82%E8%80%83)
