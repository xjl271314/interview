---
title: Gulp
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Gulp

- 2022.11.08

`gulp` 是基于 `node` 流 实现的前端自动化开发的工具。

## 小程序编译例子

```js
const { src, dest, series, parallel, watch } = require('gulp');
const path = require('path');
const fs = require('fs');

/**
 * xml编译
 */
function wxml() {
  return src(filePath.xmlPath)
    .pipe(miniWxml())
    .pipe(changed(DIST, { extension: '.wxml' }))
    .pipe(rename({ extname: '.wxml' }))
    .pipe(dest(DIST));
}

/**
 * less编译
 */
function wxss() {
  return src(filePath.lessPath, { base: 'src/' })
    .pipe(changed(DIST, { extension: '.wxss' }))
    .pipe(
      base64({
        extensions: ['svg', 'png', 'jpg', 'gif'],
        maxImageSize: 1024 * 1024 * 1024 * 1024,
        exclude: [/^(http|https)/],
      }),
    )
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(plumber(onError))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(dest(DIST));
}

/**
 * js编译
 */
function js() {
  return src(filePath.configPath, { base: 'src/', allowEmpty: true })
    .pipe(plumber(onError))
    .pipe(rename({ basename: 'config' }))
    .pipe(
      babel({
        plugins: [
          require('./vcontrol.js')({
            version: process.env.XCX_VERSION || argv.xv,
            xcxv: argv.xcxv,
          }),
        ],
      }),
    )
    .pipe(src(filePath.jsPath))
    .pipe(plumber(onError))
    .pipe(changed(DIST))
    .pipe(babel())
    .pipe(alias(aliasConfig))
    .pipe(dest(DIST));
}
```

## 组件库中的运用

以 `elementUI`为例，打开`packages/theme-chalk/gulpfile.js`。

该文件的作用是将 scss 文件编译为 css 文件。

```js
'use strict';

// 引入gulp
// series创建任务列表，
// src创建一个流，读取文件
// dest 创建一个对象写入到文件系统的流
const { series, src, dest } = require('gulp');
// gulp-dart-sass编译scss文件
const sass = require('gulp-dart-sass');
// gulp-autoprefixer 给css样式添加前缀
const autoprefixer = require('gulp-autoprefixer');
// gulp-cssmin 压缩css
const cssmin = require('gulp-cssmin');

// 处理src目录下的所有scss文件，转化为css文件
function compile() {
  return (
    src('./src/*.scss')
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(
        // 给css样式添加前缀
        autoprefixer({
          overrideBrowserslist: ['ie > 9', 'last 2 versions'],
          cascade: false,
        }),
      )
      // 压缩css
      .pipe(cssmin())
      // 将编译好的css 输出到lib目录下
      .pipe(dest('./lib'))
  );
}

// 将src/fonts文件的字体文件 copy到 /lib/fonts目录下
function copyfont() {
  return src('./src/fonts/**').pipe(cssmin()).pipe(dest('./lib/fonts'));
}

// series创建任务列表
exports.build = series(compile, copyfont);
```

## 一键换肤功能

总体流程：

1. 使用`css var()`定义颜色变量
2. 创建主题`theme.css`文件，存储所有的颜色变量
3. 使用`gulp`将`theme.css`合并到`base.css`中，解决按需引入的情况
4. 使用`gulp`将`index.css`与`base.css`合并，解决全局引入的情况

### 1.创建基础颜色变量 theme.css 文件

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52a9c3cab0544603b4a7e5bf9ceb2c20~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

### 2.修改 packages/theme-chalk/src/common/var.scss 文件

将该文件的中定义的`scss`变量，替换成`var()`变量

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f5f561727524921b52a52b181a6fbb0~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

### 3.修改后的 packages/theme-chalk/gulpfile.js

```js
'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');

function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['ie > 9', 'last 2 versions'],
        cascade: false,
      }),
    )
    .pipe(cssmin())
    .pipe(dest('./lib'));
}

// 将 theme.css 和 lib/base.css合并成 最终的 base.css
function compile1() {
  return src(['./src/theme.css', './lib/base.css'])
    .pipe(concat('base.css'))
    .pipe(dest('./lib'));
}

// 将 base.css、 index.css 合并成 最终的 index.css
function compile2() {
  return src(['./lib/base.css', './lib/index.css'])
    .pipe(concat('index.css'))
    .pipe(dest('./lib'));
}

function copyfont() {
  return src('./src/fonts/**').pipe(cssmin()).pipe(dest('./lib/fonts'));
}

exports.build = series(compile, compile1, compile2, copyfont);
```
