---
title: BOM
nav:
  title: html
  path: /html
group:
  title: html、浏览器相关试题
  path: /html/project
---

# 什么是 BOM ?

- 2022.04.26

## 定义

BOM 是各个浏览器厂商针对 DOM 标准实现的用来获取或设置浏览器的属性、行为的一个对象。

包含了以下的对象:

- window：BOM 中最顶层对象
- screen：屏幕对象
- location： 地址栏对象
- history：历史记录对象
- navigator： 导航对象
- document： 文档对象
- frames：框架集

## window

BOM 的核心对象是 `window`，它表示浏览器的一个实例。

在浏览器中，`window`对象有双重角色，它既是通过 `JavaScript`访问浏览器窗口的一个接口，又是 `ECMAScript` 规定的 `Global` 对象。

### 全局作用域

**全局变量不能通过 `delete` 操作符删除，而直接在 `window` 对象上的定义的属性可以**。

```js
var age = 29;
window.color = 'red';

//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 false
delete window.age;

//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 true
delete window.color; //returns true

window.age; // 29
window.color; // undefined
```

### 导航和打开窗口

使用 `window.open()` 方法既可以导航到一个特定的 `url`，也可以打开一个新的浏览器窗口。

```js
window.open(url, name, features, replace);
```

## location 对象

`location` 是最有用的 BOM 对象之一，它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。

假设我们有如下一个 url: `http://localhost:8000/#/user/login?a=1&b=2`

|   属性   | 例子                                       | 描述                                                         |
| :------: | :----------------------------------------- | :----------------------------------------------------------- |
|  origin  | http://localhost:8000                      | 返回主机等信息                                               |
| protocol | http                                       | 返回当前地址的协议类型 `http` 、 `https`                     |
|   host   | localhost:8000                             | 返回当前的域名及端口号                                       |
| hostname | localhost                                  | 返回当前的域名                                               |
|   port   | 8000                                       | 返回当前地址的端口号                                         |
| pathname | /                                          | 返回当前页面所在目录路径                                     |
|  search  | ""                                         | 返回当前地址所带的参数如果没有返回空字符串                   |
|   hash   | #/user/login?a=1&b=2                       | 返回当前地址所包含的 hash 值，如果没有 hash 值则返回空字符串 |
|   href   | http://localhost:8000/#/user/login?a=1&b=2 | 返回当前地址的完整 url                                       |

### 位置操作

```js
window.location = url;
window.location.href = url;
window.location.assign(url);
window.location.replace(url); // 无法返回上个页面
window.location.reload(); // 重新加载（有可能从缓存中加载）
window.location.reload(true); // 重新加载（从服务器重新加载）
```
