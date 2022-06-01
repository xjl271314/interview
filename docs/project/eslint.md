---
title: eslint
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# eslint 的使用

- 2022.04.14

## 为什么要使用 eslint?

使用`eslint`的目的是保证代码的一致性和避免一些语法层面的错误。

## 如何使用 eslint

### 安装

```js
// 全局安装
npm i eslint -g
// 项目安装
npm i eslint
```

### 初始化配置

安装完成后在项目终端执行 `npx eslint --init`，具体的配置可以按照提示选择，也可以在后期重新定义。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8d9069d9dfb44800b33b5c8a9bce8d69.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

按照上面的配置信息安装完成后，会在项目的根目录生成一个`.eslintrc.js`文件，打开的配置如下:

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {},
};
```

### 示例

配置完成后，我们编写一个测试的页面`test.js`，并编写以下代码:

![在这里插入图片描述](https://img-blog.csdnimg.cn/afce9f7539a74972a943ef0eb9fb89d9.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

这里我们执行`eslint`命令的时候可以得到具体的错误信息，但是在开发过程中并不会提示。

### vscode 下 eslint 的配置

以`vscode为`例，我们需要下载安装对应的插件

![在这里插入图片描述](https://img-blog.csdnimg.cn/8501325d9cf04213aefc474e97b74181.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

安装完成后，开启 eslint 后可以进行开发时的提示:

![在这里插入图片描述](https://img-blog.csdnimg.cn/d1410cb4eb544975a9347367dbef92b5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

**注意：这里以`eslint V7.x`为例，`V8`的场景存在部分 API 的废弃**。

如果需要在保存文件的时候去自动的矫正，可以在`settings.json`中增加如下配置:

```json
"editor.formatOnType": true,
"editor.formatOnSave": true,
"eslint.codeAction.showDocumentation": {
    "enable": true
},
+ "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
},
"eslint.validate": ["javascript", "javascriptreact", "html", "vue"]
```

自动矫正完之后可以解决大部分的校验。

![在这里插入图片描述](https://img-blog.csdnimg.cn/93f3432605bc44b88857de5136f52460.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### npm 包

有`vscode`插件，那么还装`eslint`的`npm`包吗？

要装。虽然`vscode`插件也可以单独配置格式，但是如果项目中有`.eslintrc.js`文件，那么`eslint`插件会优先执行`.eslintrc.js`文件的配置。

并且不是每个人都会装`eslint`的`vscode`插件。此时`eslint`的`npm`包就作为一个保障，并且里面的`.eslintrc.js`配置就作为标准配置。

## eslint 配置示例说明
