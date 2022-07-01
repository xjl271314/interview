---
title: 三角形最小路径和
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode120：三角形最小路径和

- 2022.06.27

[三角形最小路径和](https://leetcode.cn/problems/triangle/)

给定一个三角形 `triangle` ，找出自顶向下的最小路径和。

每一步只能移动到下一行中相邻的结点上。相邻的结点 在这里指的是 `下标` 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。也就是说，如果正位于当前行的下标 `i` ，那么下一步可以移动到下一行的下标 `i` 或 `i + 1` 。

- 示例 1:

  ```js
  输入：triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
  输出：11
  解释：如下面简图所示：
     2
    3 4
   6 5 7
  4 1 8 3
  自顶向下的最小路径和为 11（即，2 + 3 + 5 + 1 = 11）。
  ```

- 示例 2:

  ```js
  输入：triangle = [[-10]]
  输出：-10
  ```

- 提示：
  - $1 <= triangle.length <= 200$
  - $triangle[0].length == 1$
  - $triangle[i].length == triangle[i - 1].length + 1$
  - $-10^4 <= triangle[i][j] <= 10^4$

## 动态规划

我们用 `f[i][j]` 表示从三角形顶部走到位置 `(i, j)` 的最小路径和。这里的位置 `(i, j)` 指的是三角形中第 i 行第 j 列（均从 0 开始编号）的位置。

由于每一步只能移动到下一行「相邻的节点」上，因此要想走到位置 `(i, j)`，上一步就只能在位置 `(i - 1, j - 1)` 或者位置 `(i - 1, j)`。我们在这两个位置中选择一个路径和较小的来进行转移，状态转移方程为：

$f[i][j] = min(f[i−1][j−1], f[i−1][j]) + c[i][j]$

其中 $c[i][j]$ 表示位置 `(i, j)` 对应的元素值。

注意第 i 行有 i+1 个元素，它们对应的 j 的范围为 `[0, i]`。当 `j=0` 或 `j=i` 时，上述状态转移方程中有一些项是没有意义的。例如当 `j=0` 时，`f[i-1][j-1]`没有意义，因此状态转移方程为：

$f[i][0] = f[i−1][0] + c[i][0]$

即当我们在第 i 行的最左侧时，我们只能从第 `i−1` 行的最左侧移动过来。当 `j=i` 时，`f[i-1][j]` 没有意义，因此状态转移方程为：

$f[i][i] = f[i−1][i−1] + c[i][i]$

即当我们在第 i 行的最右侧时，我们只能从第 i−1 行的最右侧移动过来。

最终的答案即为 `f[n-1][0]` 到 `f[n-1][n-1]` 中的最小值，其中 n 是三角形的行数。

### 自底向上遍历

从三角形最后一层开始向上遍历，每个数字的最小路径和是它下面两个数字中的较小者加上它本身。

- 执行用时：68 ms, 在所有 JavaScript 提交中击败了 53.61% 的用户
- 内存消耗：41.1 MB, 在所有 JavaScript 提交中击败了 96.51% 的用户
- 时间复杂度$O(n^2)$
- 空间复杂度$O(n)$

```js
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function (triangle) {
  let n = triangle.length;
  const dp = new Array(n);

  for (let i = 0; i < n; i++) {
    dp[i] = new Array(triangle[i].length);
  }

  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j < triangle[i].length; j++) {
      if (i == n - 1) {
        dp[i][j] = triangle[i][j];
      } else {
        dp[i][j] = Math.min(dp[i + 1][j], dp[i + 1][j + 1]) + triangle[i][j];
      }
    }
  }

  return dp[0][0];
};
```

### 动态转移数组

- 执行用时：60 ms, 在所有 JavaScript 提交中击败了 88.40% 的用户
- 内存消耗：41.8 MB, 在所有 JavaScript 提交中击败了 49.23% 的用户
- 时间复杂度$O(n^2)$
- 空间复杂度$O(1)$

```js
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function (triangle) {
  let n = triangle.length;
  let i = n - 1;

  while (i--) {
    for (let j = 0; j < i + 1; j++) {
      triangle[i][j] += Math.min(triangle[i + 1][j], triangle[i + 1][j + 1]);
    }
  }
  return triangle[0][0];
};
```
