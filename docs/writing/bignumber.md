---
title: 大数运算
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 大数运算

- 2021.10.14

在 `Javascript` 中最大的安全数字是 `Math.pow(2,53)`-->(9007199254740992)，一旦数字超过这个值，JS 将会丢失精度，发生截断，等于 JS 能支持的最大数字。

例如如下的示例:

![大数运算](https://img-blog.csdnimg.cn/034eb234069d4bd897cb0544cf353353.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

## 大数加法

我们假设有两个数 `const num1 = Math.pow(2,53); const num2 = 10000000000000001;`，进行加法运算。

```js
const num1 = Math.pow(2, 53); //  9007199254740992
const num2 = 10000000000000001;

// 理论上
const sum = num1 + num2; // 19007199254740993
// 实际上
const sum2 = num1 + num2; // 19007199254740990
```

按照预期的计算结果最后一位应该是个 3，但是控制台输出的结果末位是 0，那么如何解决大数相加的问题？

**答案是转成字符串进行运算。**

```js
const num1 = Math.pow(2, 53).toString(); // '9007199254740992'
const num2 = '10000000000000001';

function add(num1, num2) {
  // 由于num1和num2位数不相等先将两个变量长度对齐
  const maxLength = Math.max(num1.length, num2.length);

  const a = num1.padStart(maxLength, 0);
  const b = num2.padStart(maxLength, 0);

  // 定义加法过程中需要用到的变量
  let t = 0;
  let f = 0; //"进位"
  let sum = '';

  // 从末尾开始逐位相加
  for (let i = maxLength - 1; i >= 0; i--) {
    t = parseInt(a[i]) + parseInt(b[i]) + f;
    f = Math.floor(t / 10);
    sum = (t % 10) + sum;
  }

  if (f == 1) {
    sum = '1' + sum;
  }
  return sum; // 19007199254740993
}
```
