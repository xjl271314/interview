---
title: 完全平方数
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode279：完全平方数

- 2022.06.23

[完全平方数](https://leetcode.cn/problems/perfect-squares/)

给你一个整数 `n` ，返回 `和为 n` 的`完全平方数`的最少数量 。

`完全平方数` 是一个`整数`，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。

- 示例 1:

  ```js
  输入：n = 12
  输出：3
  解释：12 = 4 + 4 + 4
  ```

- 示例 2:

  ```js
  输入：n = 13
  输出：2
  解释：13 = 4 + 9
  ```

- 提示：
  - $1 <= n <= 10^4$

## 动态规划

- 首先初始化长度为 `n+1` 的数组 `dp`，每个位置都为 `0`。

- 如果 `n` 为 0，则结果为 0

- 对数组进行遍历，下标为 `i`，每次都将当前数字先更新为最大的结果，即 `dp[i]=i`，比如 `i=4`，最坏结果为 `4=1+1+1+1` 即为 `4` 个数字。

- `dp[i]` 表示 i 的完全平方和的最少数量，`dp[i - j * j] + 1`表示减去一个完全平方数`j`的完全平方之后的数量加 1 就等于`dp[i]`，只要在`dp[i]`, `dp[i - j * j] + 1`中寻找一个较小的就是最后`dp[i]`的值。

- 动态转移方程为：`dp[i] = Min(dp[i], dp[i - j * j] + 1)`，i 表示当前数字，`j*j` 表示平方数

### javascript

- 执行用时：216 ms, 在所有 JavaScript 提交中击败了 34.90% 的用户
- 内存消耗：42.7 MB, 在所有 JavaScript 提交中击败了 92.77% 的用户

```js
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    // 最坏的情况 都是由1组成
    dp[i] = i;
    for (let j = 1; i - j * j >= 0; j++) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }

  return dp[n];
};
```

## 数学-四平方和定理(了解)

四平方和定理证明了任意一个正整数都可以被表示为至多四个正整数的平方和。这给出了本题的答案的上界。

同时四平方和定理包含了一个更强的结论：

- **当且仅当 $n\neq4^K \times(8m + 7)$时，n 可以被表示为至多三个正整数的平方和。**

- 因此，当 $n=4^K \times(8m + 7)$ 时，n 只能被表示为四个正整数的平方和。此时我们可以直接返回 4。

- 当 $n\neq4^K \times(8m + 7)$时，我们需要判断到底多少个完全平方数能够表示 n，我们知道答案只会是 1,2,3 中的一个：
  - 答案为 1 时，则必有 n 为完全平方数，这很好判断；
  - 答案为 2 时，则有 $n=a^2+b^2$，我们只需要枚举所有的$a(1\leq a \leq \sqrt{n})$，判断 $n-a^2$ 是否为完全平方数即可；
  - 答案为 3 时，我们很难在一个优秀的时间复杂度内解决它，但我们只需要检查答案为 1 或 2 的两种情况，即可利用排除法确定答案。

### javascript

- 执行用时：80 ms, 在所有 JavaScript 提交中击败了 96.41% 的用户
- 内存消耗：41.8 MB, 在所有 JavaScript 提交中击败了 96.63% 的用户

```js
/**
 * @param {number} n
 * @return {number}
 * 时间复杂度：$O(\sqrt{n})，其中 n 为给定的正整数。最坏情况下答案为 3，我们需要运行所有的判断，而判断答案是否为 1 的时间复杂度为 O(1)，判断答案是否为 4 的时间复杂度为 O(logn)，剩余判断为 O(\sqrt n)，因此总时间复杂度为 O(\log n + \sqrt n) = O(\sqrt n)。
 * 空间复杂度：O(1)。我们只需要常数的空间保存若干变量。
 */
var numSquares = function (n) {
  if (isPerfectSquare(n)) {
    return 1;
  }
  if (checkAnswer4(n)) {
    return 4;
  }
  for (let i = 1; i * i <= n; i++) {
    let j = n - i * i;
    if (isPerfectSquare(j)) {
      return 2;
    }
  }
  return 3;
};

// 判断是否为完全平方数
const isPerfectSquare = (x) => {
  const y = Math.floor(Math.sqrt(x));
  return y * y == x;
};

// 判断是否能表示为 4^k*(8m+7)
const checkAnswer4 = (x) => {
  while (x % 4 == 0) {
    x /= 4;
  }
  return x % 8 == 7;
};
```
