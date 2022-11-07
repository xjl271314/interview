---
title: CSS中的样式隔离
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# CSS 中的样式隔离

- 2022.02.14

## CSS 的原生问题

### 1. 无作用域样式污染

原生的 CSS 有一个被大家诟病的问题就是没有`本地作用域`，所有声明的样式都是`全局的（global styles）`。

换句话来说页面上任意元素只要匹配上某个选择器的规则，这个规则就会被应用上，而且规则和规则之间可以`叠加作用（cascading）`。

由于这个问题的存在，我们在日常开发中(SPA 应用)会遇到以下这些问题：

- 很难为选择器起名字：为了避免和页面上其他元素的样式发生冲突，我们在起选择器名的时候一定要深思熟虑，起的名字一定不能太普通。

  举个例子，假如你为页面上某个作为标题的 DOM 节点定义一个叫做`.title`的样式名，这个类名很大概率已经或者将会和页面上的其他选择器发生冲突，所以你不得不手动为这个类名添加一些前缀，例如`.home-page-title`来避免这个问题。

- 团队多人合作困难：当多个人一起开发同一个项目的时候，特别是多个分支同时开发的时候，大家各自取的选择器名字可能有会冲突，可是在本地独立开发的时候这个问题几乎发现不了。当大家的代码合并到同一个分支的时候，一些样式的问题就会随之出现。

### 2. 无用的 CSS 样式堆积

进行过大型 Web 项目开发的同学应该都有经历过这个情景：在开发新的功能或者进行代码重构的时候，由于 HTML 代码和 CSS 样式之间没有显式的一一对应关系，我们很难辨认出项目中哪些 CSS 样式代码是有用的哪些是无用的，这就导致了我们不敢轻易删除代码中可能是无用的样式。

这样随着时间的推移，项目中的 CSS 样式只会增加而不会减少`(append-only stylesheets）`。无用的样式代码堆积会导致以下这些问题：

- 项目变得越来越重量级：加载到浏览器的 CSS 样式会越来越多，会造成一定的性能影响。

- 开发成本越来越高：开发者发现他们很难理解项目中的样式代码，甚至可能被大量的样式代码吓到，这就导致了开发效率的降低以及一些奇奇怪怪的样式问题的出现。

### 3. 基于状态的样式定义

对于 SPA 应用来说，特别是一些交互复杂的页面，页面的样式通常要根据组件的状态变化而发生变化。

最常用的方式是通过不同的状态定义不同的`className`类名，这种方案代码看起来十分冗余和繁琐，通常需要同时改动`js`代码和`css`代码。

## 解决方案

### BEM 规范化命名

> BEM 是 Block Element Modifier(块-元素-修饰符)的缩写，这种命名方法让 CSS 便于统一团队开发规范和方便维护。

例如我们有一个商品列表，现在需要对该列表下的一个按钮进行样式处理:

```html
<ul>
  <li>
    <p>文案</p>
    <button>按钮</button>
  </li>
  ...
</ul>

<style>
  /* 早期的做法 假设存在多个ul>li>button的话又要进行修改*/
  ul > li > button {
    ...;
  }
  /* BEM的做法 */
  .goodsList_item_btn {
    ...;
  }
</style>
```

社区里面对 BEM 命名的褒贬不一，但是对其的思想基本上还是认同的，所以可以用它的思想，不一定要用它的命名方式。

#### 应用场景

BEM 思想通常用于`组件库`，业务代码中结合`less`等预处理器。

#### 优缺点分析

- 优点

  1. 人为严格遵守 BEM 规范，可以解决无作用域样式污染问题。
  2. 可读性好，一目了然是那个 dom 节点，对于无用 css 删除，删除了相应 dom 节点后，对应的 css 也能比较放心的删除，不会影响到其他元素样式。

- 缺点
  1. 命名太长(还是的想每个模块取啥名字)，至于体积增大，gzip 可忽略。

### CSS modules

> css-modules 将 css 代码模块化，可以避免本模块样式被污染，并且可以很方便的复用 css 代码。

`CSS Modules`既不是官方标准，也不是浏览器的特性，而是在构建步骤（例如使用 Webpack，记住 css-loader）中对 CSS 类名和选择器限定作用域的一种方式（类似于命名空间）。

依赖`webpack css-loader`，配置如下，现在 webpack 已经默认开启 CSS modules 功能了。

```js
{
    test: /.css$/,
    loader: "style-loader!css-loader?modules"
}
```

将`CSS`文件`style.css`引入为`style`对象后，通过`style.title`的方式使用`title class`：

```js
import style from './style.css';

export default () => {
  return (
    <p className={style.title}>
      I am KaSong.
    </p>
  );
};

// 对应的css
.title {
  color: red;
}

// 打包工具会将style.title编译为带哈希的字符串
<h1 class="_3zyde4l1yATCOkgn-DBWEL">
  Hello World
</h1>

// 同时style.css也会编译：
._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}
```

这样，就产生了独一无二的`class`，解决了`CSS`模块化的问题。

使用了 `CSS Modules` 后，就相当于给每个 `class` 名外加加了一个 `:local`，以此来实现样式的局部化，如果你想切换到全局模式，使用对应的 `:global`。

`:local` 与 `:global` 的区别是 `CSS Modules` 只会对 `:local` 块的 `class` 样式做 `localIdentName` 规则处理，`:global` 的样式编译后不变.

```css
.title {
  color: red;
}

:global(.title) {
  color: green;
}
```

#### 优缺点分析

- 优点:

  1. 能 100%解决 css 无作用域样式污染问题
  2. 学习成本低：API 简洁到几乎零学习成本

- 缺点:

  1. 写法没有传统开发流畅，每个文件都需要引入`styles`，如果你不想频繁的输入 `styles.**`，可以试一下 [react-css-modules](gajus/react-css-modules)，它通过高阶函数的形式来避免重复输入 `styles.**`

     ```js
     import React from 'react';
     import CSSModules from 'react-css-modules';
     import styles from './table.css';

     class Table extends React.Component {
       render() {
         return (
           <div styleName="table">
             <div styleName="row">
               <div styleName="cell">A0</div>
               <div styleName="cell">B0</div>
             </div>
           </div>
         );
       }
     }

     export default CSSModules(Table, styles);
     ```

  2. 没有变量，通常要结合预处理器
  3. 代码可读性差，hash 值不方便 debug

不过在实际项目中一般都会配合 CSS 预处理器进行处理比如 Less、Sass。

### CSS in JS

> `CSS in JS`是 2014 年推出的一种设计模式，它的核心思想是把 CSS 直接写到各自组件中，也就是说用 JS 去写 CSS，而不是单独的样式文件里。

`CSS-in-JS`不是一种很新的技术，它当初的出现是因为一些`component-based`的 Web 框架（例如 React，Vue）的逐渐流行，使得开发者也想将组件的 CSS 样式也一块封装到组件中去以解决原生 CSS 写法的一系列问题。

`CSS-in-JS`在`React社区`的热度是最高的，这是因为 React 本身不会管用户怎么去为组件定义样式的问题，而 Vue 和 Angular 都有属于框架自己的一套定义样式的方案。

例如下面的代码:

```js
const style = {
  color: 'red',
  fontSize: '46px',
};

const clickHandler = () => alert('hi');

ReactDOM.render(
  <h1 style={style} onclick={clickHandler}>
    Hello, world!
  </h1>,
  document.getElementById('example'),
);
```

上面代码在一个文件里面，封装了结构、样式和逻辑，完全违背了`关注点分离`的原则。

但是，这`有利于组件的隔离`。每个组件包含了所有需要用到的代码，不依赖外部，组件之间没有耦合，很方便复用。所以，随着 React 的走红和组件模式深入人心，这种`关注点混合`的新写法逐渐成为主流。

实现了 CSS-in-JS 的库有很多，虽然每个库解决的问题都差不多，可是它们的实现方法和语法却大相径庭。

从实现方法上区分大体分为两种：

- 唯一 CSS 选择器，代表库：[styled-components](https://github.com/styled-components/styled-components)
- 内联样式（Unique Selector VS Inline Styles）

#### styled-components 示例

Styled-components 是 CSS in JS 最热门的一个库了，到目前为止 github 的 star 数已经超过了 36k。

通过 styled-components，可以使用 ES6 的`标签模板字符串语法（Tagged Templates）`为需要 `styled` 的 `Component` 定义一系列 CSS 属性。

当该组件的 JS 代码被解析执行的时候，`styled-components`会动态生成一个`CSS`选择器，并把对应的 CSS 样式通过`style`标签的形式插入到`head`标签里面。动态生成的 CSS 选择器会有一小段哈希值来保证全局唯一性来避免样式发生冲突。

[CSS-in-JS Playground](https://www.cssinjsplayground.com/)是一个可以快速尝试不同 CSS-in-JS 实现的网站，上面有一个简单的用 styled-components 实现表单的例子：

![示例](https://img-blog.csdnimg.cn/1cac896256c74ae8802a5af0b853ef32.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

从上面的例子可以看出，`styled-components` 不需要你为需要设置样式的 DOM 节点设置一个样式名，使用完标签模板字符串定义后你会得到一个 `styled` 好的 `Component`，直接在 JSX 中使用这个 `Component` 就可以了。

#### Radium 示例

`Radium` 和 `styled-components` 的最大区别是它生成的是`标签内联样式（inline styles）`。

由于标签内联样式在处理诸如`media query`以及`:hover`，`:focus`，`:active`等和浏览器状态相关的样式的时候非常不方便，所以`radium`为这些样式封装了一些标准的接口以及抽象。

`radium` 在[CSS-in-JS Playground](https://www.cssinjsplayground.com/?activeModule=index&library=radium)的例子：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b1d607f19e71460d91ada3224fa65afd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

从上面的例子可以看出 `radium` 定义样式的语法和 `styled-components` 有很大的区别，它要求你使用 `style`属性为 DOM 添加相应的样式。

直接在标签内生成内联样式，内联样式相比于 CSS 选择器的方法有以下的优点： 自带局部样式作用域的效果，无需额外的操作。

#### CSS-in-JS 优缺点分析

- 优点

  - 没有无作用域问题样式污染问题

    通过唯一 CSS 选择器或者行内样式解决

  - 没有无用的 CSS 样式堆积问题

    `CSS-in-JS`会把样式和组件绑定在一起，当这个组件要被删除掉的时候，直接把这些代码删除掉就好了，不用担心删掉的样式代码会对项目的其他组件样式产生影响。而且由于 CSS 是写在 JavaScript 里面的，我们还可以利用 JS 显式的变量定义，模块引用等语言特性来追踪样式的使用情况，这大大方便了我们对样式代码的更改或者重构。

  - 更好的基于状态的样式定义

    `CSS-in-JS`会直接将`CSS`样式写在`JS`文件里面，所以样式复用以及逻辑判断都十分方便。

- 缺点

  - 一定的学习成本

  - 代码可读性差

    大多数 CSS-in-JS 实现会通过生成唯一的 CSS 选择器来达到 CSS 局部作用域的效果。这些自动生成的选择器会大大降低代码的可读性，给开发人员 debug 造成一定的影响。

  - 运行时消耗

    由于大多数的 CSS-in-JS 的库都是在动态生成 CSS 的。这会有两方面的影响。首先你发送到客户端的代码会包括使用到的 CSS-in-JS 运行时（runtime）代码，这些代码一般都不是很小，例如 styled-components 的 runtime 大小是 12.42kB min + gzip，如果你希望你首屏加载的代码很小，你得考虑这个问题。

    其次大多数 CSS-in-JS 实现都是在客户端动态生成 CSS 的，这就意味着会有一定的性能代价。不同的 CSS-in-JS 实现由于具体的实现细节不一样，所以它们的性能也会有很大的区别。

  - 不能结合成熟的 CSS 预处理器（或后处理器）`Sass/Less/PostCSS`，`:hover` 和 `:active` 伪类处理起来复杂。

### 预处理器

CSS 预处理器是一个能让你通过预处理器自己独有的语法的程序

市面上有很多 CSS 预处理器可供选择，且绝大多数 CSS 预处理器会增加一些原生 CSS 不具备的特性，例如:

- 代码混合
- 嵌套选择器
- 继承选择器

这些特性让 CSS 的结构更加具有可读性且易于维护。

我们常见的预处理器：

- Sass
- LESS
- Stylus
- PostCSS

#### 预处理器优缺点分析

- 优点
  - 利用嵌套，人为严格遵守嵌套首类名不一致，可以解决无作用域样式污染问题
  - 可读性好，一目了然是那个 dom 节点，对于无用 css 删除，删除了相应 dom 节点后，对应的 css 也能比较放心的删除，不会影响到其他元素样式
- 缺点
  - 需要借助相关的编译工具处理

### Shadow DOM

`Web components` 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，`Shadow DOM` 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。

可以使用 `Element.attachShadow()` 方法来将一个 `shadow root` 附加到任何一个元素上。它接受一个配置对象作为参数，该对象有一个 `mode` 属性，值可以是 `open` 或者 `closed`：

```js
let shadow = elementRef.attachShadow({ mode: 'open' });
let shadow = elementRef.attachShadow({ mode: 'closed' });
```

`open` 表示可以通过页面内的 `JavaScript` 方法来获取 `Shadow DOM`，例如使用 `Element.shadowRoot` 属性：

```js
let myShadowDom = myCustomElem.shadowRoot;
```

如果你将一个 `Shadow root` 附加到一个 `Custom element` 上，并且将 `mode` 设置为 `closed`，那么就不可以从外部获取 `Shadow DOM` 了——`myCustomElem.shadowRoot` 将会返回 `null`。浏览器中的某些内置元素就是如此，例如`<video>`，包含了不可访问的 Shadow DOM。
