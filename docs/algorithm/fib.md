---
title: 斐波那契数
nav:
  title: 算法
  path: /write
  order: 0
group:
  title: 简单
  path: /write/project/easy
---

# LeetCode 509：斐波那契数

- 2021.09.26

[斐波那契数](https://leetcode-cn.com/problems/fibonacci-number/)，通常用 `F(n)` 表示，形成的序列称为 `斐波那契数列` 。该数列由 `0` 和 `1` 开始，后面的每一项数字都是前面两项数字的和。也就是：

```desc
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
```

给你 n ，请计算 F(n) 。

- 示例 1：

```
输入：2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1
```

- 示例 2：

```
输入：3
输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2
```

- 示例 3：

```
输入：4
输出：3
解释：F(4) = F(3) + F(2) = 2 + 1 = 3
```

- 提示：`0 <= n <= 30`

## 解法一: 暴力递归

根据题意我们可以在当 n 小于 1 的时候直接返回该值，其余的场景可以根据题意进行递归运算。

### javascript

> `运行时间 88 ms 内存消耗 37.6 MB`。

```js
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  if (n <= 1) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
};
```

## 解法二: 动态规划

![示意图](https://assets.leetcode-cn.com/solution-static/509/509_fig1.gif)

### javascript

> `运行时间 72 ms 内存消耗 37.6 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  斐波那契数的边界条件是 F(0)=0 和 F(1)=1。当 n>1 时，每一项的和都等于前两项的和。
 *  也就是 F(n) = F(n−1) + F(n−2)
 *  根据状态转移方程和边界条件，可以得到时间复杂度和空间复杂度都是 O(n) 的实现。
 *  由于 F(n) 只和 F(n-1)与 F(n-2)有关，因此可以使用`「滚动数组思想」`把空间复杂度优化成 O(1)。
 *  时间复杂度：O(n)，空间复杂度：O(1)。
 *  ----------------------------------------------------------------
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  if (n <= 1) {
    return n;
  }
  let prev = 0,
    next = 0,
    sum = 1;
  // n = 2; prev = 0; next = 1; sum = 1;
  // n = 3; prev = 1; next = 1; sum = 2;
  // n = 4; prev = 1; next = 2; sum = 3;
  // n = 5; prev = 2; next = 3; sum = 5;
  for (let i = 2; i <= n; i++) {
    prev = next;
    next = sum;
    sum = prev + next;
  }
  return sum;
};
```

## 解法三: 矩阵快速幂

上述方法的时间复杂度是 `O(n)`。使用矩阵快速幂的方法可以降低时间复杂度。

![矩阵快速幂](https://img-blog.csdnimg.cn/7f4029d6d9e24e41932814964d9f4cd0.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

因此只要我们能快速计算矩阵 M 的 n 次幂，就可以得到 F(n) 的值。如果直接求取 M^n，时间复杂度是 O(n)，可以定义矩阵乘法，然后用快速幂算法来加速这里 M^n 的求取。

### javascript

> `运行时间 60 ms 内存消耗 37.4 MB`。

```js
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  if (n < 2) {
    return n;
  }
  const q = [
    [1, 1],
    [1, 0],
  ];
  const res = pow(q, n - 1);
  return res[0][0];
};

const multiply = (a, b) => {
  const c = [
    [0, 0],
    [0, 0],
  ];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j];
    }
  }
  return c;
};

const pow = (a, n) => {
  let ret = [
    [1, 0],
    [0, 1],
  ];
  while (n > 0) {
    if ((n & 1) === 1) {
      ret = multiply(ret, a);
    }
    n >>= 1;
    a = multiply(a, a);
  }
  return ret;
};
```
