---
title: 手写trim
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 手写一下 trim 方法?

- 2021.09.26

## 正则匹配

> `\s`匹配一个空白字符，包括空格、制表符、换页符和换行符。
> `\S`匹配一个非空白字符。。

### 首尾匹配

看似不怎么样实际执行效率非常快。

```js
function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

const str1 = ' aabb ';
const str2 = '112233 ';
const str3 = ' 11 22 ';

trim(str1); // aabb
trim(str2); // 112233
trim(str3); // 11 22
```

### 假设有一个空白

和上述方法类似，加了假设至少存在一个空白符。

```js
function trim(str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}
```

### 或条件简写

针对正则进行了优化。

```js
function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}
```

### 非捕获性分组

```js
function trim(str) {
  str = str.match(/\S+(?:\s+\S+)*/);
  return str ? str[0] : '';
}
```

### 惰性匹配

```js
function trim(str) {
  return str.replace(/^\s*([\S\s]*?)\s*$/, '$1');
}
```

## 字符串截取

### 正则搜索截取

```js
// Math.max(str.search(/\S/), 0) 如果找不到返回一个0，就是从0开始截取
// str.search(/\S\s*$/) 返回最后一个在空白符结尾前面的字符串位置
// substring(start, end) 从开始到结尾进行截取
function trim(str) {
  return str.substring(Math.max(str.search(/\S/), 0), str.search(/\S\s*$/) + 1);
}
```

### 查询包含截取

```js
function trim(str) {
  const whitespace =
    ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';

  for (let i = 0, len = str.length; i < len; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }

  for (i = str.length - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
```
