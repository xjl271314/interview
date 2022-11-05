---
title: 沙箱(SandBox)
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 沙箱(SandBox)

- 2022.10.31

## 什么是沙箱

> 沙箱(Sandbox)，就是让你的程序跑在一个隔离的环境下，不对外界的其他程序造成影响。

例如 Chrome 浏览器打开的每个页面就是一个沙箱，保证彼此独立互不影响。

## js 中沙箱的使用场景

1. 执行 JSONP 请求回来的字符串时或引入不知名第三方 JS 库时，可能需要创造一个沙箱来执行这些代码

2. Vue 模板表达式的计算是运行在一个沙盒之中的，在模板字符串中的表达式只能获取部分全局对象

## 如何实现一个 JS 沙箱?

1. 使用 with 来改变代码的执行上下文。
2. 使用 with + proxy (检测传入的对象是否包含使用到的变量以解决单个 with 仍会查找原型链的问题)。
3. 使用天然的优质沙箱 iframe， 并把 iframe.contentWindow 作为当前沙箱执行的全局对象。
