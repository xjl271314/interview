---
title: 爬楼梯
nav:
  title: 编程题
  path: /writing
group:
  title: 简单
  path: /writing/project/easy
  order: 2
---

# LeetCode 70：爬楼梯

- 2022.04.08

[爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)。

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？

- 示例 1：

  ```js
  输入：n = 2
  输出：2
  解释：有两种方法可以爬到楼顶。
  1. 1 阶 + 1 阶
  2. 2 阶
  ```

- 示例 2：

  ```js
  输入：n = 3
  输出：3
  解释：有三种方法可以爬到楼顶。
  1. 1 阶 + 1 阶 + 1 阶
  2. 1 阶 + 2 阶
  3. 2 阶 + 1 阶
  ```

- 提示：
  - 1 <= n <= 45

## 动态规划

我们用 `f(x)` 表示爬到第 `x` 级台阶的方案数，考虑最后一步可能跨了一级台阶，也可能跨了两级台阶，所以我们可以列出如下式子：

`f(x)=f(x−1)+f(x−2)`

它意味着爬到第 `x` 级台阶的方案数是爬到第 `x−1` 级台阶的方案数和爬到第 `x−2` 级台阶的方案数的和。

因为每次只能爬 `1` 级或 `2` 级，所以 `f(x)` 只能从 `f(x - 1)` 和 `f(x - 2)` 转移过来，而这里要统计方案总数，我们就需要对这两项的贡献求和。

以上是动态规划的转移方程，下面我们来讨论边界条件。我们是从第 `0` 级开始爬的，所以从第 `0` 级爬到第 `0` 级我们可以看作只有一种方案，即 `f(0) = 1`，从第 `0` 级到第 `1` 级也只有一种方案，即爬一级，`f(1) = 1`。

这两个作为边界条件就可以继续向后推导出第 n 级的正确结果。

根据转移方程得到 `f(2) = 2`，`f(3) = 3`，`f(4) = 5`，……，我们把这些情况都枚举出来，发现计算的结果是正确的。

我们不难通过转移方程和边界条件给出一个时间复杂度和空间复杂度都是 `O(n)`的实现，但是由于这里的 `f(x)`只和 `f(x−1)` 与 `f(x−2)` 有关，所以我们可以用`滚动数组思想`把空间复杂度优化成 O(1)。

![滚动数组思想](https://assets.leetcode-cn.com/solution-static/70/70_fig1.gif)

### javascript

- 执行用时：48 ms, 在所有 JavaScript 提交中击败了 98.92%的用户
- 内存消耗：40.7 MB, 在所有 JavaScript 提交中击败了 65.16%的用户

```js
/**
 * @param {number} n
 * @return {number}
 * 时间复杂度：循环执行 n 次，每次花费常数的时间代价，故渐进时间复杂度为 O(n)。
 * 空间复杂度：这里只用了常数个变量作为辅助空间，故渐进空间复杂度为 O(1)。
 */
var climbStairs = function (n) {
  let p = 0,
    q = 0,
    r = 1;
  for (let i = 1; i <= n; i++) {
    p = q;
    q = r;
    r = p + q;
  }
  return r;
};
```

或者是:

```js
var climbStairs = function (n) {
  const dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
```

## 数学--通项公式

我们已经讨论了 `f(n)` 是齐次线性递推，根据递推方程 `f(n) = f(n - 1) + f(n - 2)`，我们可以写出这样的特征方程：

![通项公式](https://img-blog.csdnimg.cn/ecfdc10a939a4688bc42819c7bbde4de.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

```js
var climbStairs = function (n) {
  const sqrt5 = Math.sqrt(5);
  const fibn =
    Math.pow((1 + sqrt5) / 2, n + 1) - Math.pow((1 - sqrt5) / 2, n + 1);
  return Math.round(fibn / sqrt5);
};
```
