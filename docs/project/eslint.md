---
title: eslint
nav:
  title: 工程化
  path: /project
  order: 2
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

## eslint 配置说明

```js
// 0表示不不处理，1表示警告，2表示错误并退出
"rules" : {
  // 定义对象的set存取器属性时，强制定义get
  "accessor-pairs": 2,
  // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
  "array-bracket-spacing": [2, "never"],
  // 在块级作用域外访问块内定义的变量是否报错提示
  "block-scoped-var": 0,
  // if while function 后面的{必须与if在同一行，java风格。
  "brace-style": [2, "1tbs", { "allowSingleLine": true }],
  // 双峰驼命名格式
  "camelcase": 2,
  // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
  // always-multiline：多行模式必须带逗号，单行模式不能带逗号
  "comma-dangle": [2, "always"],
  // 控制逗号前后的空格
  "comma-spacing": [2, { "before": false, "after": true }],
  // 控制逗号在行尾出现还是在行首出现
  // http://eslint.org/docs/rules/comma-style
  "comma-style": [2, "last"],
  // 圈复杂度
  "complexity": [2, 9],
  // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
  "computed-property-spacing": [2, "never"],
  // 强制方法必须返回值，TypeScript强类型，不配置
  "consistent-return": 0,
  // 用于指统一在回调函数中指向this的变量名，箭头函数中的this已经可以指向外层调用者，应该没卵用了
  // e.g [0,"that"] 指定只能 var that = this. that不能指向其他任何值，this也不能赋值给that以外的其他值
  "consistent-this": 0,
  // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示
  "constructor-super": 0,
  // 强制object.key 中 . 的位置，参数:
  // property，'.'号应与属性在同一行
  // object, '.' 号应与对象名在同一行
  "dot-location": [2, "property"],
  // 强制使用.号取属性
  //    参数： allowKeywords：true 使用保留字做属性名时，只能使用.方式取属性
  //                          false 使用保留字做属性名时, 只能使用[]方式取属性 e.g [2, {"allowKeywords": false}]
  //           allowPattern:  当属性名匹配提供的正则表达式时，允许使用[]方式取值,否则只能用.号取值 e.g [2, {"allowPattern": "^[a-z]+(_[a-z]+)+$"}]
  "dot-notation": [2, {"allowKeywords": true}],
  // 文件末尾强制换行
  "eol-last": 2,
  // 使用 === 替代 ==
  "eqeqeq": [2, "allow-null"],
  // 方法表达式是否需要命名
  "func-names": 0,
  // 方法定义风格，参数：
  //    declaration: 强制使用方法声明的方式，function f(){} e.g [2, "declaration"]
  //    expression：强制使用方法表达式的方式，var f = function() {}  e.g [2, "expression"]
  //    allowArrowFunctions: declaration风格中允许箭头函数。 e.g [2, "declaration", { "allowArrowFunctions": true }]
  "func-style": 0,
  "no-alert": 0,//禁止使用alert confirm prompt
  "no-array-constructor": 2,//禁止使用数组构造器
  "no-bitwise": 0,//禁止使用按位运算符
  "no-caller": 1,//禁止使用arguments.caller或arguments.callee
  "no-catch-shadow": 2,//禁止catch子句参数与外部作用域变量同名
  "no-class-assign": 2,//禁止给类赋值
  "no-cond-assign": 2,//禁止在条件表达式中使用赋值语句
  "no-console": 2,//禁止使用console
  "no-const-assign": 2,//禁止修改const声明的变量
  "no-constant-condition": 2,//禁止在条件中使用常量表达式 if(true) if(1)
  "no-continue": 0,//禁止使用continue
  "no-control-regex": 2,//禁止在正则表达式中使用控制字符
  "no-debugger": 2,//禁止使用debugger
  "no-delete-var": 2,//不能对var声明的变量使用delete操作符
  "no-div-regex": 1,//不能使用看起来像除法的正则表达式/=foo/
  "no-dupe-keys": 2,//在创建对象字面量时不允许键重复 {a:1,a:1}
  "no-dupe-args": 2,//函数参数不能重复
  "no-duplicate-case": 2,//switch中的case标签不能重复
  "no-else-return": 2,//如果if语句里面有return,后面不能跟else语句
  "no-empty": 2,//块语句中的内容不能为空
  "no-empty-character-class": 2,//正则表达式中的[]内容不能为空
  "no-empty-label": 2,//禁止使用空label
  "no-eq-null": 2,//禁止对null使用==或!=运算符
  "no-eval": 1,//禁止使用eval
  "no-ex-assign": 2,//禁止给catch语句中的异常参数赋值
  "no-extend-native": 2,//禁止扩展native对象
  "no-extra-bind": 2,//禁止不必要的函数绑定
  "no-extra-boolean-cast": 2,//禁止不必要的bool转换
  "no-extra-parens": 2,//禁止非必要的括号
  "no-extra-semi": 2,//禁止多余的冒号
  "no-fallthrough": 1,//禁止switch穿透
  "no-floating-decimal": 2,//禁止省略浮点数中的0 .5 3.
  "no-func-assign": 2,//禁止重复的函数声明
  "no-implicit-coercion": 1,//禁止隐式转换
  "no-implied-eval": 2,//禁止使用隐式eval
  "no-inline-comments": 0,//禁止行内备注
  "no-inner-declarations": [2, "functions"],//禁止在块语句中使用声明（变量或函数）
  "no-invalid-regexp": 2,//禁止无效的正则表达式
  "no-invalid-this": 2,//禁止无效的this，只能用在构造器，类，对象字面量
  "no-irregular-whitespace": 2,//不能有不规则的空格
  "no-iterator": 2,//禁止使用__iterator__ 属性
  "no-label-var": 2,//label名不能与var声明的变量名相同
  "no-labels": 2,//禁止标签声明
  "no-lone-blocks": 2,//禁止不必要的嵌套块
  "no-lonely-if": 2,//禁止else语句内只有if语句
  "no-loop-func": 1,//禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
  "no-mixed-requires": [0, false],//声明时不能混用声明类型
  "no-mixed-spaces-and-tabs": [2, false],//禁止混用tab和空格
  "linebreak-style": [0, "windows"],//换行风格
  "no-multi-spaces": 1,//不能用多余的空格
  "no-multi-str": 2,//字符串不能用\换行
  "no-multiple-empty-lines": [1, {"max": 2}],//空行最多不能超过2行
  "no-native-reassign": 2,//不能重写native对象
  "no-negated-in-lhs": 2,//in 操作符的左边不能有!
  "no-nested-ternary": 0,//禁止使用嵌套的三目运算
  "no-new": 1,//禁止在使用new构造一个实例后不赋值
  "no-new-func": 1,//禁止使用new Function
  "no-new-object": 2,//禁止使用new Object()
  "no-new-require": 2,//禁止使用new require
  "no-new-wrappers": 2,//禁止使用new创建包装实例，new String new Boolean new Number
  "no-obj-calls": 2,//不能调用内置的全局对象，比如Math() JSON()
  "no-octal": 2,//禁止使用八进制数字
  "no-octal-escape": 2,//禁止使用八进制转义序列
  "no-param-reassign": 2,//禁止给参数重新赋值
  "no-path-concat": 0,//node中不能使用__dirname或__filename做路径拼接
  "no-plusplus": 0,//禁止使用++，--
  "no-process-env": 0,//禁止使用process.env
  "no-var": 0,//禁用var，用let和const代替
  "no-warning-comments": [1, { "terms": ["todo", "fixme", "xxx"], "location": "start" }],//不能有警告备注
  "no-with": 2,//禁用with
  "array-bracket-spacing": [2, "never"],//是否允许非空数组里面有多余的空格
  "arrow-parens": 0,//箭头函数用小括号括起来
  "arrow-spacing": 0,//=>的前/后括号
  "accessor-pairs": 0,//在对象中使用getter/setter
  "block-scoped-var": 0,//块语句中使用var
  "brace-style": [1, "1tbs"],//大括号风格
  "callback-return": 1,//避免多次调用回调什么的
}
```

## eslint 配置示例说明

```js
// .eslintrc.js
module.exports = {
  // eslint:recommended是eslint本身推荐的一些规范
  extends: ['eslint:recommended'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'double'],
    'simple-import-sort/sort': [
      2,
      {
        groups: [
          // node 内置模块
          [
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ],
          // vue 和不为 @ 以及 . 开头的
          ['^vue', '^[^@\\.]'],
          // webpack 声明的 alias
          ['^(@packages|@wpd|@shared|@facejs)(/.*|$)'],
          // webpack 声明的 alias
          ['^(views|modules|components|less_base|@/)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // 父级依赖
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // 相对依赖
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // 配置依赖
          ['^.+\\.(config)$'],
          // Style imports.
          ['^.+\\.(css|scss|less)$'],
        ],
      },
    ],
  },
};
```

## vscode 设置 tab 锁进为 4 个空格

打开设置————修改 tab size 缩紧

![](https://img-blog.csdnimg.cn/8a6ad60562bd4be89ef04bff4546dafc.png)
