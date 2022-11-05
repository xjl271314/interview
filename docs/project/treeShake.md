---
title: tree-shaking
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 谈谈你对 tree-shaking 的理解?

- 2021.06.01

> `tree shaking` 首先是由 `rollup` 的作者提出的基于 `DCE（dead code elimination）`的一个实现。在我们项目中，一个模块里可能有很多个方法,只要其中的某个方法使用到了,则整个文件都会被打包到 `bundle` 中去。`tree shaking` 就是只把用到的方法打入到 `bundle`，没用到的方法会在 `uglify` 阶段(uglify 不能跨文件进行消除)被擦除掉，从而减小了包的体积。

其中,`死码消除（Dead code elimination）`是一种编译器原理中编译最优化技术，编译器可以判断出某些代码根本不影响输出，然后消除这些代码。

`webpack` 默认支持`tree shaking`, 在 `.barbelrc` 里面设置 `modules: false` 即可。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '这里需要注意的是 `webpack4` 之后在 `mode:production` 的情况下默认开启。必须是 `ES6` 的语法, `CJS` 的方式不支持,且其中编写的方法不能有副作用，否则就会失效。';

export default () => <Info type="warning" txt={txt} />;
```

## 为什么需要使用 tree-shaking?

`javascript` 绝大多数情况需要通过网络进行加载，然后执行，通过 `tree-shaking` 我们可以减少页面的加载时间，将无用的代码删除，减少 `js` 包的大小，从而减少用户等待的时间，使用户不因为漫长的等待而离开。

## tree shaking 实现的原理？

`tree shaking` 是基于 `ES6` 的 `module` 模块的。由于 `ES6`模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，奠定了 `tree shaking` 的实现基础。

**关于 `ES6 module` 的特性，大概有如下几点：**

1. 只能作为模块顶层的语句出现,只在文件的顶层,不能在代码中动态导入。
2. `import` 的模块名只能是字符串常量。
3. `import binding`  是  `immutable`永久性的。
4. ES6 模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析。
5. 代码擦除是在 `uglify` 阶段删除无用代码。

## 扩展：什么是静态分析?

所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6 之前的模块化，比如我们可以动态`require`一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

## 扩展：上述描述到如果模块是不纯,那么 tree shaking 检测就会失效，如何优化这部分的功能呢?

比如说类似 `IIFE` 函数中存在着闭包，只要代码不是纯的代码，该代码就不会被 `tree-shaking` 摇树优化掉。

这里我们这里可以配合使用另外一个插件 `webpack-deep-scope-plugin`。主要用于填充 `webpack` 自身 `Tree-shaking` 的不足，通过`作用域分析`来消除无用的代码。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '此方案在`webpack4`中可以结合起来使用，在`webpack5`中有更优的解决方案。';

export default () => <Info type="warning" txt={txt} />;
```

## 扩展: rollup 打包和 webpack 打包的区别

1. rollup 只处理函数和顶层的 import/export 变量，不能把没用到的类的方法消除掉。
2. javascript 动态语言的特性使得静态分析比较困难

使用到的例子[源码](https://github.com/xjl271314/tree-shaking-demo/tree/master)

- 源代码

```js
// index.js
import { a, b, Person } from './utils';

function App() {
  a();
  console.log('App');
}

App();

// utils.js
export function a() {
  console.log('a');
}

export function b() {
  console.log('b');
}

export class Person {
  get() {
    return 'jack';
  }
}
```

- 经过 rollup.js 编译后

```js
'use strict';
function e(e, n) {
  for (var o = 0; o < n.length; o++) {
    var t = n[o];
    (t.enumerable = t.enumerable || !1),
      (t.configurable = !0),
      'value' in t && (t.writable = !0),
      Object.defineProperty(e, t.key, t);
  }
}
!(function () {
  function n() {
    !(function (e, n) {
      if (!(e instanceof n))
        throw new TypeError('Cannot call a class as a function');
    })(this, n);
  }
  var o, t, a;
  (o = n),
    (t = [
      {
        key: 'get',
        value: function () {
          return 'jack';
        },
      },
    ]) && e(o.prototype, t),
    a && e(o, a);
})(),
  console.log('a'),
  console.log('App');
```

我们可以看到在 `index.js` 中并没有导入 `Person 类`,但是`tree-shaking`后还是保留了该类的定义。

- 使用 webpack 进行打包(版本 4.44.2)

```js
(this['webpackJsonptree-shaking-demo'] =
  this['webpackJsonptree-shaking-demo'] || []).push([
  [0],
  [
    function (e, o, s) {
      'use strict';
      s.r(o);
      console.log('a'), console.log('App');
    },
  ],
  [[0, 1]],
]);
```

经过 `webpack` 打包后的代码把未使用的代码都 `shaking` 掉了。

## 扩展：closure compiler

`google`的产品 `Closure Compiler`是`java`写的，虽然效果很赞，但比较难以应用到项目中，迁移成本较大。

## 扩展：在 webpack5 中如何去做 tree shaking?

- 通过 `package.json` 的 `sideEffects` 属性，来实现这种方式。

  ```json
  {
    "name": "your-project",
    "sideEffects": false // "side effect(副作用)" 的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。
  }
  ```

  如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 `false`，来告知 `webpack` 它可以安全地删除未用到的 `export`。

  如果你的代码确实有一些副作用，可以改为提供一个数组：

  ```json
  {
    "name": "your-project",
    "sideEffects": ["./src/some-side-effectful-file.js"]
  }
  ```

  ```jsx
  /**
   * inline: true
   */
  import React from 'react';
  import { Info } from 'interview';

  const txt =
    '注意，所有导入文件都会受到 `tree shaking` 的影响。这意味着，如果在项目中使用类似 `css-loader` 并 `import` 一个 CSS 文件，则需要将其添加到 `side effect` 列表中，以免在生产模式中无意中将它删除：';

  export default () => <Info type="warning" txt={txt} />;
  ```

  ```json
  {
    "name": "your-project",
    "sideEffects": ["./src/some-side-effectful-file.js", "*.css"]
  }
  ```

- sideEffects 和 usedExports

  `sideEffects` 和 `usedExports`（更多被认为是 `tree shaking`）是两种不同的优化方式。

  - `sideEffects` 更为有效 是因为它允许跳过整个模块/文件和整个文件子树。
  - `usedExports` 依赖于 `terser` 去检测语句中的副作用。它是一个 `JavaScript` 任务而且没有像 `sideEffects` 一样简单直接。而且它不能跳转子树/依赖，由于细则中说副作用需要被评估。

  尽管导出函数能运作如常，但 React 框架的高阶函数（HOC）在这种情况下是会出问题的。

  **那么如何处理这种情况?**

  我们可以通过 `/*#__PURE__*/` 注释来帮忙 `terser`。

  ```js
  var Button$1 = /*#__PURE__*/ withAppProvider()(Button);
  ```

  这会使得这段代码被过滤，但仍然会有一些引入的问题，需要对其进行评估，因为它们产生了副作用。

  为了解决这个问题，我们需要在 `package.json` 中添加 `sideEffects` 属性。

  它类似于 `/*#__PURE__*/` 但是作用于模块的层面，而不是代码语句的层面。它表示：

  如果被标记为无副作用的模块没有被直接导出使用，打包工具会跳过进行模块的副作用分析评估。”。
