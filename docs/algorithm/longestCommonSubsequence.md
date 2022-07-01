---
title: 最长公共子序列
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode1143：最长公共子序列

- 2022.06.24

[最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长 `公共子序列` 的长度。如果不存在 `公共子序列` ，返回 `0` 。

一个字符串的 `子序列` 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

- 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。

两个字符串的 `公共子序列` 是这两个字符串所共同拥有的子序列。

- 示例 1:

  ```js
  输入：text1 = "abcde", text2 = "ace"
  输出：3
  解释：最长公共子序列是 "ace" ，它的长度为 3 。
  ```

- 示例 2:

  ```js
  输入：text1 = "abc", text2 = "abc"
  输出：3
  解释：最长公共子序列是 "abc" ，它的长度为 3 。
  ```

- 示例 3:

  ```js
  输入：text1 = "abc", text2 = "def"
  输出：0
  解释：两个字符串没有公共子序列，返回 0 。
  ```

- 提示：
  - 1 <= text1.length, text2.length <= 1000
  - text1 和 text2 仅由小写英文字符组成。

## 动态规划

最长公共子序列问题是典型的二维动态规划问题。

### 解题思路

- 首先，区分两个概念：子序列可以是不连续的；子数组（子字符串）需要是连续的；
- 另外，动态规划也是有套路的：
  - 单个数组或者字符串要用动态规划时，可以把动态规划 `dp[i]` 定义为 `nums[0:i]` 中想要求的结果；
  - 当两个数组或者字符串要用动态规划时，可以把动态规划定义成两维的 `dp[i][j]` ，其含义是在 `A[0:i]` 与 `B[0:j]`  之间匹配得到的想要的结果。

### 1. 状态定义

比如对于本题而言，可以定义 `dp[i][j]` 表示 `text1[0:i-1]` 和 `text2[0:j-1]` 的最长公共子序列。

**注：`text1[0:i-1]` 表示的是 `text1` 的 第 `0` 个元素到第 `i - 1` 个元素，两端都包含**

之所以 `dp[i][j]`  的定义不是 `text1[0:i]` 和 `text2[0:j]` ，是为了方便当 `i = 0` 或者 `j = 0` 的时候，`dp[i][j]`表示的为空字符串和另外一个字符串的匹配，这样 `dp[i][j]`  可以初始化为 `0`.

### 2. 状态转移方程

知道状态定义之后，我们开始写状态转移方程。

- 当 `text1[i - 1]` == `text2[j - 1]` 时，说明两个子字符串的最后一位相等，所以最长公共子序列又增加了 `1`，所以 `dp[i][j] = dp[i - 1][j - 1] + 1`；

  - 举个例子，比如对于 `ac` 和 `bc` 而言，他们的最长公共子序列的长度等于 `a`  和 `b`  的最长公共子序列长度 `0` + 1 = 1。

- 当 `text1[i - 1] != text2[j - 1]`  时，说明两个子字符串的最后一位不相等，那么此时的状态 `dp[i][j]` 应该是 `dp[i - 1][j]` 和 `dp[i][j - 1]` 的最大值。
  - 举个例子，比如对于 `ace`  和 `bc`  而言，他们的最长公共子序列的长度等于 `① ace` 和 `b` 的最长公共子序列长度`0` 与 `② ac` 和 `bc`  的最长公共子序列长度`1` 的最大值，即 `1`。

综上状态转移方程为：

![状态转移方程](https://img-blog.csdnimg.cn/31a395f45dee43eea1bd6e8df6a7ed5b.png)

最终计算得到 `dp[m][n]` 即为 `text1`和 `text2` 的最长公共子序列的长度。

### javascript

- 执行用时：96 ms, 在所有 JavaScript 提交中击败了 41.62% 的用户
- 内存消耗：56.1 MB, 在所有 JavaScript 提交中击败了 28.99% 的用户

```js
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
  const m = text1.length,
    n = text2.length;
  const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    const c1 = text1[i - 1];
    for (let j = 1; j <= n; j++) {
      const c2 = text2[j - 1];
      if (c1 == c2) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
};
```
