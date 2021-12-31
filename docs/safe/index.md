---
title: 前端安全性
nav:
  title: 前端安全
  path: /safe
  order: 0
group:
  title: 前端安全
  path: /safe/project
---

# 前端安全性

- 2021.12.29

## 原型污染

> 指攻击者通过某种手段修改 JavaScript 对象的原型（prototype）。

例如以`Lodash`的安全漏洞为例，攻击者可以通过 `Lodash` 的一些函数覆盖或污染应用程序。例如：通过 `Lodash` 库中的函数 `defaultsDeep` 可以修改 `Object.prototype` 的属性。

```js
const mergeFn = require('lodash').defaultsDeep;
const payload = '{"constructor": {"prototype": {"a0": true}}}';

function check() {
  mergeFn({}, JSON.parse(payload));
  if ({}[`a0`] == true) {
    console.log(`Vulnerable to Prototype Pollution via ${payload}`);
  }
}

check();
```

举个实际的例子：

```js
import _ from 'lodash';

// 接收2个参数，将来源对象(第二个参数的对象)的可枚举属性添加到目标对象(第一个参数的对象)所有为undefined的值上
_.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } })

// 输出
{ 'a': { 'b': 2, 'c': 3 } }

// 隐患的操作
const payload = '{"constructor": {"prototype": {"toString": true}}}';

_.defaultsDeep({}, JSON.parse(payload));
```

如此一来，就触发了原型污染。对应上例，`Object.prototype.toString` 就会非常不安全了。

### 解决方案

- `lodash`发版的解决方案：

  ![解决方案](https://img-blog.csdnimg.cn/6f3b711e1b034ab6a057b1d2759c919a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

- 使用 `Object.freeze` 冻结 `Object.prototype`

  > `Object.freeze()` 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。

  ```js
  Object.freeze(Object.prototype);

  Object.prototype.toString = 'evil'

  consoel.log(Object.prototype.toString)
  ƒ toString() { [native code] }
  ```

- 建立 JSON schema

  在解析用户输入内容时，通过 `JSON schema` 过滤敏感键名。

- 使用无原型对象

  在创建对象时，不采用字面量方式，而是使用 `Object.create(null)`：

  > Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的**proto**

  `Object.create(null)` 的返回值不会链接到 `Object.prototype`：

  ```js
  let foo = Object.create(null);
  console.log(foo.__proto__);
  // undefined
  ```

- 采用新的 Map 数据类型，代替 Object 类型

## npm 官方的支持

基于早期的一个调查结果，`npm@6` 增加了一项重大更新：`npm audit` 命令。

`npm audit` 命令会递归地分析依赖关系树以识别不安全的依赖，如果你在项目中使用了具有已知安全问题的依赖，就收到警告通知。该命令会在你**更新或者安装了新的依赖包后自动运行**。

`npm` 官方专门维护了一个[漏洞列表](https://github.com/advisories)，当开发者或者专业的安全团队发现某个依赖包存在安全问题后就会上报给 `npm` 官方，然后官方会通知该项目开发者进行修复，修复完成后 `npm` 会把漏洞详细的描述信息、解决方案发布出来.

![在这里插入图片描述](https://img-blog.csdnimg.cn/f8fe69350af04464a57bffc8b0ad1d70.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

`npm aduit` 主要做的就是**把需要检查的依赖信息发送给一个官方检查接口, 该结构会在历史上报的漏洞数据库中判断当前依赖信息是否含有漏洞，然后生成一个包含包名称、漏洞严重性、简介、路径等的漏洞报告反馈给开发者**。

比如我们现在直接安装一个具有安全漏洞的 `lodash@4.17.4` 版本，安装完成后会提醒你刚刚增加的依赖中含有一些漏洞。

![漏洞](https://img-blog.csdnimg.cn/5e22af6a365c497a9946c22ac9b0823c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

执行 `npm audit` 我们可以看到漏洞详情，这个版本的 `lodash` 存在 3 个高危安全漏洞，我们来具体看一个：

![npm audit](https://img-blog.csdnimg.cn/7ca174d82c564d328c07b85529adaef9.png)

- `High`: 表安全漏洞等级
- `Package`: 存在漏洞的包名称
- `Dependency of`: 当前工程直接依赖的包名称
- `Path`: 漏洞完整依赖路径
- `More info`: 漏洞详情

**这里需要注意，并不只是直接依赖的包具有漏洞才会收到提醒，而是只要是你的依赖树中某一个节点依赖依赖了具有漏洞的包你就会收到提醒，来看看下面的例子：**

项目中并非直接依赖了 `lodash` ，而是 `@commitlint/cli` 依赖的 `@commitlint/load` 中依赖了 `lodash` 就会算作一个漏洞，所以一些庞大的迭代周期很长的项目含有几万个安全漏洞也是很正常的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2e9fe40085094afa8d6e63fef58fb5b3.png)

漏洞的详情[地址](https://github.com/advisories/GHSA-jf85-cpcp-j695)
