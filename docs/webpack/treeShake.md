---
title: tree-shaking
nav:
  title: webpack
  path: /webpack
  order: 0
group:
  title: webpack相关试题
  path: /webpack/project
---

# 谈谈你对 tree-shaking 的理解?

- 2021.06.01

> `tree shaking` 首先是由 `rollup` 的作者提出的基于 `DCE（dead code elimination）`的一个实现。在我们项目中，一个模块里可能有很多个方法,只要其中的某个方法使用到了,则整个文件都会被打包到 `bundle` 中去。`tree shaking` 就是只把用到的方法打入到 `bundle` , 没用到的方法会在 `uglify` 阶段被擦除掉,从而减小了包的体积。

其中,`死码消除（Dead code elimination）`是一种编译器原理中编译最优化技术，它的用途是移除对程序运行结果没有任何影响的代码。

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

通过 `tree-shaking` 我们可以减少页面的加载时间，将无用的代码删除，减少 `js` 包的大小，从而减少用户等待的时间，使用户不因为漫长的等待而离开。

## tree shaking 实现的原理？

`tree shaking` 是基于 `ES6` 的 `module` 模块的。由于 `ES6` 的模块特性，奠定了 `tree shaking` 的实现基础。

**关于 `ES6 module` 的特性，大概有如下几点：**

1. 只能作为模块顶层的语句出现,只在文件的顶层,不能在代码中动态导入。
2. `import` 的模块名只能是字符串常量。
3. `import binding`  是  `immutable`永久性的。
4. 代码擦除是在 `uglify` 阶段删除无用代码。

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
