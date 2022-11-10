---
title: 手写实现一个mini版的脚手架
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写实现一个 mini 版的脚手架

- 2022.11.08

脚手架是开发中经常会使用的工具，比如`vue-cli`、`create-react-app`等，这些脚手架可以通过简单的命令，快速去搭建项目，让我们更专注于项目的开发。

## 实现

### 1. 初始化项目

新建文件夹`cli-demo`，执行`npm init -y` [项目地址](https://github.com/xjl271314/cli-demo)

![npm init -y](https://img-blog.csdnimg.cn/f5c0e1850cb140e18aea576b595e86b7.png)

### 2. 配置脚手架入口文件

1. 创建`bin目录`，该目录下创建`www.js`

   ```js
   #! /usr/bin/env node  // 这行的意思是使用node来执行此文件

   console.log('link 成功!');
   ```

2. `package.json`中配置入口文件的路径

   ```js
   {
       "name": "cli-demo",
       "version": "1.0.0",
       "description": "",
     + "bin": "./bin/www.js", // 手动添加入口文件为 ./bin/www.js
       "scripts": {
           "test": "echo \"Error: no test specified\" && exit 1"
       },
       ...
   }
   ```

3. 项目目录结构

   ```js
   cli-demo
   ├─ bin
   │  └─ www.js
   └─ package.json
   ```

### 3. npm link 到全局

在控制台输入`npm link`。

![npm link](https://img-blog.csdnimg.cn/575f0f962370448195438b49ec71955d.png)

测试连通性，控制台输入`cli-demo`

![cli-demo](https://img-blog.csdnimg.cn/a5d0c34f58ad4a3390e58bf9df99d472.png)

### 4. 安装脚手架所需的工具

一次性安装所需的工具

```js
npm install commander inquirer download-git-repo util ora fs-extra axios
```

| 工具名称            | 作用                                                                            |
| :------------------ | :------------------------------------------------------------------------------ |
| `commander`         | 自定义命令行工具                                                                |
| `inquirer`          | 命令行交互工具                                                                  |
| `download-git-repo` | 从`git`上下载项目模板工具                                                       |
| `util`              | `download-git-repo`不支持异步调用，需要使用`util`插件的`util.promisify`进行转换 |
| `ora`               | 命令行 `loading` 动效                                                           |
| `fs-extra`          | 提供文件操作方法                                                                |
| `axios`             | 发送接口，请求`git`上的模板列表                                                 |

### 5. commander 自定义命令行工具

`commander.js` 是自定义命令行工具

这里用来创建`create` 命令，用户可以通过输入 `cli-demo creat appName` 来创建项目

修改 `www.js`

```js
#! /usr/bin/env node
const program = require('commander');
program
  // 创建create 命令，用户可以通过 my-cli creat appName 来创建项目
  .command('create <app-name>')
  // 命名的描述
  .description('create a new project')
  // create命令的选项
  .option('-f, --force', 'overwrite target if it exist')
  .action((name, options) => {
    // 执行'./create.js'，传入项目名称和 用户选项
    require('./create')(name, options);
  });
program.parse();
```

### 6. inquirer 命令行交互工具

`inquirer.js` 命令行交互工具，用来询问用户的操作，让用户输入指定的信息，或给出对应的选项让用户选择。

此处`inquirer`的运用场景有 2 个：

- 场景 1：当用户要创建的项目目录已存在时，提示用户是否要覆盖 or 取消
- 场景 2：让用户输入项目的`author`作者和项目`description`描述

### 7. 创建 create.js

`bin/create.js`

```js
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Generator = require('./generator');

module.exports = async function (name, options) {
  // process.cwd获取当前的工作目录
  const cwd = process.cwd();
  // path.join拼接 要创建项目的目录
  const targetAir = path.join(cwd, name);

  // 如果该目录已存在
  if (fs.existsSync(targetAir)) {
    // 强制删除
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      // 通过inquirer：询问用户是否确定要覆盖 or 取消
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target already exists',
          choices: [
            {
              name: 'overwrite',
              value: 'overwrite',
            },
            {
              name: 'cancel',
              value: false,
            },
          ],
        },
      ]);
      if (!action) {
        return;
      } else {
        // 删除文件夹
        await fs.remove(targetAir);
      }
    }
  }

  const args = require('./ask');

  // 通过inquirer，让用户输入的项目内容：作者和描述
  const ask = await inquirer.prompt(args);
  // 创建项目
  const generator = new Generator(name, targetAir, ask);
  generator.create();
};
```

### 8. 创建 ask.js

配置 ask 选项，让用户输入作者和项目描述

`bin/create.js`

```js
// 配置ask 选项
module.exports = [
  {
    type: 'input',
    name: 'author',
    message: 'author?',
  },
  {
    type: 'input',
    name: 'description',
    message: 'description?',
  },
];
```

### 9. 创建 generator.js

`generator.js`的工作流程:

1. 通过接口获取 git 上的模板目录
2. 通过`inquirer`让用户选择需要下载的项目
3. 使用`download-git-repo`下载用户选择的项目模板
4. 将用户创建时，将项目名称、作者名字、描述写入到项目模板的`package.json`文件中

`bin/generator.js`

```js
const path = require('path');
const fs = require('fs-extra');
// 引入ora工具：命令行loading 动效
const ora = require('ora');
const inquirer = require('inquirer');
// 引入download-git-repo工具
const downloadGitRepo = require('download-git-repo');
// download-git-repo 默认不支持异步调用，需要使用util插件的util.promisify 进行转换
const util = require('util');
// 获取git项目列表
const { getRepolist } = require('./http');

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  // 下载开始
  spinner.start();

  try {
    const result = await fn(...args);
    // 下载成功
    spinner.succeed();
    return result;
  } catch (e) {
    // 下载失败
    spinner.fail('Request failed ……');
  }
}

// 创建项目类
class Generator {
  // name 项目名称
  // target 创建项目的路径
  // 用户输入的 作者和项目描述 信息
  constructor(name, target, ask) {
    this.name = name;
    this.target = target;
    this.ask = ask;
    // download-git-repo 默认不支持异步调用，需要使用util插件的util.promisify 进行转换
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }
  async getRepo() {
    // 获取git仓库的项目列表
    const repolist = await wrapLoading(getRepolist, 'waiting fetch template');
    if (!repolist) return;

    const repos = repolist.map((item) => item.name);

    // 通过inquirer 让用户选择要下载的项目模板
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template',
    });

    return repo;
  }

  // 下载用户选择的项目模板
  async download(repo, tag) {
    const requestUrl = `yuan-cli/${repo}`;
    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl,
      path.resolve(process.cwd(), this.target),
    );
  }

  // 文件入口，在create.js中 执行generator.create();
  async create() {
    const repo = await this.getRepo();
    console.log('用户选择了', repo);

    // 下载用户选择的项目模板
    await this.download(repo);

    // 下载完成后，获取项目里的package.json
    // 将用户创建项目的填写的信息（项目名称、作者名字、描述），写入到package.json中
    let targetPath = path.resolve(process.cwd(), this.target);

    let jsonPath = path.join(targetPath, 'package.json');

    if (fs.existsSync(jsonPath)) {
      // 读取已下载模板中package.json的内容
      const data = fs.readFileSync(jsonPath).toString();
      let json = JSON.parse(data);
      json.name = this.name;
      // 让用户输入的内容 替换到 package.json中对应的字段
      Object.keys(this.ask).forEach((item) => {
        json[item] = this.ask[item];
      });

      //修改项目文件夹中 package.json 文件
      fs.writeFileSync(jsonPath, JSON.stringify(json, null, '\t'), 'utf-8');
    }
  }
}

module.exports = Generator;
```

### 10. 创建 http.js

用来发送接口，获取 git 上的模板列表

`bin/http.js`

```js
// 引入axios
const axios = require('axios');

axios.interceptors.response.use((res) => {
  return res.data;
});

// 获取git上的项目列表
async function getRepolist() {
  return axios.get('https://api.github.com/orgs/yuan-cli/repos');
}

module.exports = {
  getRepolist,
};
```

## 最终目录结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/aad89949643c4fb99aee8b2f533be391.png)
