---
title: 不同路径
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode62：不同路径

- 2022.06.23

[不同路径](https://leetcode.cn/problems/unique-paths/)

一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

- 示例 1:

  ![示例1](https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png)

  ```js
  输入：m = 3, n = 7
  输出：28
  ```

- 示例 2:

  ```js
  输入：m = 3, n = 2
  输出：3
  解释：
  从左上角开始，总共有 3 条路径可以到达右下角。
  1. 向右 -> 向下 -> 向下
  2. 向下 -> 向下 -> 向右
  3. 向下 -> 向右 -> 向下
  ```

- 示例 3:

  ```js
  输入：m = 7, n = 3
  输出：28
  ```

- 示例 4:

  ```js
  输入：m = 3, n = 3
  输出：6
  ```

- 提示：
  - 1 <= m, n <= 100
  - 题目数据保证答案小于等于 $2 * 10^9$

## 动态规划

我们用 `f(i, j)` 表示从左上角走到 `(i, j)` 的路径数量，其中 `i` 和 `j` 的范围分别是 `[0, m)` 和 `[0, n)`。

由于我们每一步只能从向下或者向右移动一步，因此要想走到 `(i, j)`，如果向下走一步，那么会从 `(i-1, j)` 走过来；如果向右走一步，那么会从 `(i, j-1)` 走过来。因此我们可以写出动态规划转移方程：

```js
f(i,j) = f(i−1,j) + f(i,j−1)
```

需要注意的是，如果 `i=0`，那么 `f(i-1,j)` 并不是一个满足要求的状态，我们需要忽略这一项；同理，如果 `j=0`，那么 `f(i,j-1)` 并不是一个满足要求的状态，我们需要忽略这一项。

初始条件为 `f(0,0)=1`，即从左上角走到左上角有一种方法。

最终的答案即为 `f(m-1,n-1)`。

### javascript

- 执行用时：56 ms, 在所有 JavaScript 提交中击败了 87.59% 的用户
- 内存消耗：41.3 MB, 在所有 JavaScript 提交中击败了 31.95% 的用户

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 * 时间复杂度：O(mn)。
 * 空间复杂度：O(mn)，即为存储所有状态需要的空间。
 */
var uniquePaths = function (m, n) {
  const f = new Array(m).fill(0).map(() => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    f[i][0] = 1;
  }
  for (let j = 0; j < n; j++) {
    f[0][j] = 1;
  }
  // 排除了从0行到j列 以及 从0列i行
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      f[i][j] = f[i - 1][j] + f[i][j - 1];
    }
  }
  return f[m - 1][n - 1];
};
```

## 组合数学

从左上角到右下角的过程中，我们需要移动 `m+n-2` 次，其中有 `m-1`次向下移动，`n-1` 次向右移动。因此路径的总数，就等于从 `m+n-2` 次移动中选择 `m-1` 次向下移动的方案数，即组合数：

$C_{m+n−2}^{m−1}$ = $(\frac{m+n−2}{m−1}) = \frac{(m+n−2)(m+n−3)⋯n}{(m−1)!} = \frac{(m+n−2)!}{(m−1)!(n−1)!}$

因此我们直接计算出这个组合数即可。计算的方法有很多种：

**补充排列组合计算公式:**

- $A_n^m = {n * (n-1) . (n-m+1)} = \frac{n!}{(n-m)!}$

- $C_n^m = P(n,m)/P(m,m) = \frac{n!}{m!(n-m)!}$

- $C_n^1 = A_n^1 = n$

例如：

- $A_4^2 = \frac{4!}{2!} = \frac{4*3*2*1}{2*1} = 12$
- $C_4^2 = \frac{4!}{2!*2!} = \frac{4*3*2*1}{2*1*2*1} = 6$

### javascript

- 执行用时：52 ms, 在所有 JavaScript 提交中击败了 96.00% 的用户
- 内存消耗：40.9 MB, 在所有 JavaScript 提交中击败了 80.44% 的用户

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 * 时间复杂度：O(m)。由于我们交换行列的值并不会对答案产生影响，因此我们总可以通过交换 m 和 n 使得 nm≤n，这样空间复杂度降低至 O(min(m,n))。
 * 空间复杂度：O(1)。
 */
var uniquePaths = function (m, n) {
  let ans = 1;
  for (let x = n, y = 1; y < m; ++x, ++y) {
    ans = Math.floor((ans * x) / y);
  }
  return ans;
};
```
