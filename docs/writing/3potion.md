---
title: 字符串千分位分割
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 字符串千分位分割

- 2022.04.18

千位分隔符格式的规则是数字的整数部分每三位一组，以`,`分节。小数部分不分节 。这是个在日常开发中非常场常见的需求

## 正则表达式法

```js
function digit3parsed(n, spread = ',') {
  const regxep = /\d(?=(?:\d{3})+\b)/g;
  // 处理 0 和 NaN
  if (!n || Number.isNaN(n)) return 0;

  // 拆分成整数部分和小数部分
  const intN = parseInt(n).toString();
  const floatN = n.toString().split('.')[1] || '';

  // 小数尾数
  const decimal = floatN ? '.' + floatN : '';

  // 整数部分替换 + 小数尾数
  return `${intN.replace(regxep, `$&${spread}`)}${decimal}`;
}
```

## 迭代法

```js
function digit3parsed(n, spread = ',') {
  // 处理 0 和 NaN
  if (!n || Number.isNaN(n)) return 0;

  // 拆分成整数部分和小数部分
  const intN = parseInt(n).toString();
  const floatN = n.toString().split('.')[1] || '';

  // 小数尾数
  const decimal = floatN ? '.' + floatN : '';

  const arrN = intN.split('').reverse();
  const res = [];
  for (let i = 0; i < arrN.length; i++) {
    if (i && i % 3 === 0) {
      res.push(spread);
    }
    res.push(arrN[i]);
  }

  return res.reverse().join('') + decimal;
}
```
