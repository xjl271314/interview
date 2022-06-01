---
title: CSS单位与移动端适配
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# CSS 中的单位与移动端适配

- 2022.04.13

## 移动端适配方案

### 传统 rem

```js
!(function () {
  var $html = document.querySelector('html');
  function setRem() {
    var clientWidth = $html.clientWidth || window.screen.width;
    $html.style.fontSize = clientWidth / 7.5 + 'px';
    var div = document.createElement('div');
    div.style.width = '7.5rem';
    document.body.appendChild(div);
    $html.style.fontSize =
      (parseFloat($html.style.fontSize) * clientWidth) / div.clientWidth + 'px';
    document.body.removeChild(div);
  }
  var b = null;
  window.addEventListener(
    'resize',
    function () {
      clearTimeout(b);
      b = setTimeout(setRem, 300);
    },
    !1,
  );
  setRem();
})(window);
```

书写的时候将 UI 设计稿中的 px 转化为 rem 进行书写。

### 自动 px2rem

```js
const {
  addPostcssPlugins,
} = require("customize-cra");

addPostcssPlugins([require('postcss-px2rem')({ remUnit: 75 / 2 })]), // px转换成rem

// 早期版本
module.exports ={
  ...,
  {
    loader: 'px2rem-loader',
      options: {
        remUnit: 75,// 1rem = 75px  750设计稿
        remPrecision: 8 ,// px转rem小数点位数
      }
  },
}
```

### vw

该方案采用 `postcss-px-to-viewport-8-plugin` 插件。

```js
yarn add -D postcss-px-to-viewport-8-plugin
```

安装完成后在 `postcss.config.js`中添加如下配置:

```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px', // 需要转换的单位，默认为"px"
      viewportWidth: 750, // 设计稿的视口宽度
      unitPrecision: 5, // 单位转换后保留的精度
      propList: ['*', '!font-size'], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
      viewportUnit: 'vw', // 希望使用的视口单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
      // 下面配置表示类名中含有'keep-px'都不会被转换
      selectorBlackList: ['keep-px]'],
      minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
      mediaQuery: false, // 媒体查询里的单位是否需要转换单位
      replace: true, //  是否直接更换属性值，而不添加备用属性
      exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
      include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
      landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
      landscapeUnit: 'vw', // 横屏时使用的单位
      landscapeWidth: 1338, // 横屏时使用的视口宽度
    },
  },
};
```

需要注意的是：`postcss-px-to-viewport` 对`内联css样式`，`外联css样式`，`内嵌css样式`有效，对`js动态css`无效。 所以要动态改变 css 展示效果的话，要使用静态的 class 定义变化样式，通过 js 改变 dom 元素的 class 实现样式变化。
