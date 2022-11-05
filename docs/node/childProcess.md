---
title: child_process
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: Node相关
  path: /project/node
---

# child_process

- 2022.11.04

Node 提供了 `child_process` 模块来创建子进程。

熟悉`shell`脚本的同学，可以用它来完成很多有意思的事情，比如文件压缩、增量部署等：

举个简单的例子：

```js
const spawn = require('child_process').spawn;
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

## 创建子进程的方式

下面列出来的都是异步创建子进程的方式，每一种方式都有对应的同步版本。

`.exec()`、`.execFile()`、`.fork()`底层都是通过`.spawn()`实现的。

`.exec()`、`execFile()`额外提供了回调，当子进程停止的时候执行。

### 1. child_process.exec

> child_process.exec(command[, options][, callback])

创建一个 shell，然后在 shell 里执行命令。执行完成后，将`stdout`、`stderr`作为参数传入回调方法。

```js
var exec = require('child_process').exec;

// 成功的例子
exec('ls -al', function (error, stdout, stderr) {
  if (error) {
    console.error('error: ' + error);
    return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + typeof stderr);
});

// 失败的例子
exec('ls hello.txt', function (error, stdout, stderr) {
  if (error) {
    console.error('error: ' + error);
    return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
});
```

| 属性         | 描述                                                                                               |
| :----------- | :------------------------------------------------------------------------------------------------- |
| `cwd`        | 当前工作路径。                                                                                     |
| `env`        | 环境变量。                                                                                         |
| `encoding`   | 编码，默认是 utf8。                                                                                |
| `shell`      | 用来执行命令的 shell，unix 上默认是`/bin/sh`，windows 上默认是`cmd.exe`。                          |
| `timeout`    | 默认是 0。                                                                                         |
| `killSignal` | 默认是`SIGTERM`。                                                                                  |
| `uid`        | 执行进程的 uid。                                                                                   |
| `gid`        | 执行进程的 gid。                                                                                   |
| `maxBuffer`  | 标准输出、错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死。默认是 200\*1024 |

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '1.如果`timeout`大于0，那么，当子进程运行超过`timeout`毫秒，那么，就会给进程发送`killSignal`指定的信号（比如`SIGTERM`）。\n\n2.如果运行没有出错，那么`error`为`null`。如果运行出错，那么，`error.code`就是退出代码（exist code），`error.signal`会被设置成终止进程的信号。（比如`CTRL+C`时发送的`SIGINT`）';

export default () => <Info txt={txt} />;
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt = '\n传入的命令，如果是用户输入的，有可能产生类似sql注入的风险:';

export default () => <Info type="warning" txt={txt} />;
```

```js
exec('ls hello.txt; rm -rf *', function (error, stdout, stderr) {
  if (error) {
    console.error('error: ' + error);
    // return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
});
```

## 2. child_process.execFile

> child_process.execFile(file[, args][, options][, callback])

- file： 可执行文件的名字，或者路径。

跟`.exec()`类似，不同点在于，没有创建一个新的`shell`。至少有两点影响:

1. 比`child_process.exec()`效率高一些。
2. 一些操作，比如 I/O 重定向，文件 glob 等不支持.

```js
var child_process = require('child_process');

child_process.execFile('node', ['--version'], function (error, stdout, stderr) {
  if (error) {
    throw error;
  }
  console.log(stdout);
});

child_process.execFile(
  '/Users/a/.nvm/versions/node/v6.1.0/bin/node',
  ['--version'],
  function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
    console.log(stdout);
  },
);
```

`execFile()`内部最终还是通过`spawn()`实现的， 如果没有设置 `{shell: '/bin/bash'}`，那么 `spawn()` 内部对命令的解析会有所不同，`execFile('ls -al .')` 会直接报错。

```js
var child_process = require('child_process');
var execFile = child_process.execFile;
var exec = child_process.exec;

exec('ls -al .', function (error, stdout, stderr) {
  if (error) {
    throw error;
  }
  console.log(stdout);
});

execFile('ls -al .', { shell: '/bin/bash' }, function (error, stdout, stderr) {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

## 3. child_process.fork

> child_process.fork(modulePath[, args][, options])

- modulePath：子进程运行的模块。

| 属性       | 描述                                                                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `execPath` | 用来创建子进程的可执行文件，默认是`/usr/local/bin/node`。也就是说，你可通过`execPath`来指定具体的 node 可执行文件路径。（比如多个 node 版本） |
| `execArgv` | 传给可执行文件的字符串参数列表。默认是`process.execArgv`，跟父进程保持一致。                                                                  |
| `silent`   | 默认是`false`，即子进程的`stdio`从父进程继承。如果是`true`，则直接`pipe`向子进程的`child.stdin`、`child.stdout`等。                           |
| `stdio`    | 如果声明了 stdio，则会覆盖 silent 选项的设置。                                                                                                |

```js
// parent.js
var child_process = require('child_process');

// 例子一：会打印出 output from the child
// 默认情况，silent 为 false，子进程的 stdout 等
// 从父进程继承
child_process.fork('./child.js', {
  silent: false,
});

// 例子二：不会打印出 output from the silent child
// silent 为 true，子进程的 stdout 等
// pipe 向父进程
child_process.fork('./silentChild.js', {
  silent: true,
});

// 例子三：打印出 output from another silent child
var child = child_process.fork('./anotherSilentChild.js', {
  silent: true,
});

child.stdout.setEncoding('utf8');
child.stdout.on('data', function (data) {
  console.log(data);
});

// child.js
console.log('output from the child');

// silentChild.js
console.log('output from the silent child');

// anotherSilentChild.js
console.log('output from another silent child');
```

## 4. child_process.spawn

> child_process.spawn(command[, args][, options])

- command：要执行的命令

options 参数说明：

| 属性       | 描述                                                     |
| :--------- | :------------------------------------------------------- |
| `argv0`    | 在 uninx、windows 上表现不一样.                          |
| `stdio`    | 子进程的 stdio.                                          |
| `detached` | 让子进程独立于父进程之外运行。同样在不同平台上表现有差异 |
| `shell`    | 如果是 true，在 shell 里运行程序。默认是 false。         |

```js
var spawn = require('child_process').spawn;
var ls = spawn('ls', ['-al']);

ls.stdout.on('data', function (data) {
  console.log('data from child: ' + data);
});

ls.stderr.on('data', function (data) {
  console.log('error from child: ' + data);
});

ls.on('close', function (code) {
  console.log('child exists with code: ' + code);
});
```
