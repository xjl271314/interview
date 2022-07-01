---
title: 买卖股票的最佳时机 II
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode 122： 买卖股票的最佳时机 II

- 2022.06.27

[买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)

给定一个数组 `prices` ，它的第 i 个元素 `prices[i]` 表示一支给定股票第 i 天的价格。

在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。

返回 你能获得的 最大 利润 。

- 示例 1：

  ```js
  输入：prices = [7,1,5,3,6,4]
  输出：7
  解释：在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6 - 3 = 3 。
  总利润为 4 + 3 = 7 。
  ```

- 示例 2：

  ```js
  输入：prices = [1,2,3,4,5]
  输出：4
  解释：在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。总利润为 4 。
  ```

- 示例 3：

  ```js
  输入：prices = [7,6,4,3,1]
  输出：0
  解释：在这种情况下, 交易无法获得正利润，所以不参与交易可以获得最大利润，最大利润为 0 。
  ```

- 提示：
  - $1 <= prices.length <= 3 * 10^4$
  - $0 <= prices[i] <= 10^4$

## 暴力解法

由于不限制交易次数，在每一天，就可以根据当前是否持有股票选择相应的操作。「暴力搜索」在树形问题里也叫「回溯搜索」、「回溯法」。

![暴力解法](https://img-blog.csdnimg.cn/a6a5529597574fd98c1409b42fca2986.png)

执行结果超时

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let profit = 0;
  for (let i = 0; i < prices.length; ) {
    // 买入的时机
    if (prices[i] > prices[i + 1]) {
      i++;
      continue;
    }
    for (let j = i + 1; j < prices.length; ) {
      if (prices[j] < prices[j + 1] && j < prices.length - 1) {
        j++;
        continue;
      }
      profit += prices[j] - prices[i];
      i = j + 1;
      break;
    }
  }

  return profit;
};
```

## 动态规划

### 第 1 步：定义状态

状态 `dp[i][j]` 定义为到下标为 i 的这一天，持股状态为 j 时，我们手上拥有的最大现金数。

注意：限定持股状态为 j 是为了方便推导状态转移方程，这样的做法满足 无后效性。

其中：

- 第一维 i 表示下标为 i 的那一天（ 具有前缀性质，即考虑了之前天数的交易 ）
- 第二维 j 表示下标为 i 的那一天是持有股票，还是持有现金。这里 0 表示持有现金（cash），1 表示持有股票（stock）。

### 第 2 步：思考状态转移方程

- 状态从持有现金（cash）开始，到最后一天我们关心的状态依然是持有现金（cash）；
- 每一天状态可以转移，也可以不动。状态转移用下图表示：

![状态转移方程](https://pic.leetcode-cn.com/041a4d01398359409ecc69dacc13a44d179dd1a2a9f43b1def80e9a6acceee55-image.png)

说明：

- 由于不限制交易次数，除了最后一天，每一天的状态可能不变化，也可能转移；
- 写代码的时候，可以不用对最后一天单独处理，输出最后一天，状态为 0 的时候的值即可。

### 第 3 步：确定初始值

起始的时候：

- 如果什么都不做，dp[0][0] = 0；
- 如果持有股票，当前拥有的现金数是当天股价的相反数，即 dp[0][1] = -prices[i]；

### 第 4 步：确定输出值

终止的时候，上面也分析了，输出 `dp[len - 1][0]`，因为一定有 `dp[len - 1][0] > dp[len - 1][1]`。

- 执行用时：72 ms, 在所有 JavaScript 提交中击败了 20.74% 的用户
- 内存消耗：43.8 MB, 在所有 JavaScript 提交中击败了 9.08% 的用户
- 时间复杂度：O(N)，这里 N 表示股价数组的长度；
- 空间复杂度：O(N)，虽然是二维数组，但是第二维是常数，与问题规模无关。

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  const n = prices.length;
  if (n < 2) {
    return 0;
  }
  // 0：持有现金
  // 1：持有股票
  // 状态转移：0 → 1 → 0 → 1 → 0 → 1 → 0
  const dp = new Array(n).fill(0).map(() => new Array(2).fill(0));
  dp[0][0] = 0;
  dp[0][1] = -prices[0];

  for (let i = 1; i < n; i++) {
    // 这两行调换顺序也是可以的
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
  }

  return dp[n - 1][0];
};
```

## 贪心

贪心算法的直觉：由于不限制交易次数，只要今天股价比昨天高，就交易。

这道题 「贪心」 的地方在于，对于 「今天的股价 - 昨天的股价」，得到的结果有 3 种可能：① 正数，② 0，③ 负数。贪心算法的决策是： 只加正数 。

- 执行用时：56 ms, 在所有 JavaScript 提交中击败了 91.88% 的用户
- 内存消耗：41.7 MB, 在所有 JavaScript 提交中击败了 27.30% 的用户
- 时间复杂度：$O(n)$，其中 n 为数组的长度。我们只需要遍历一次数组即可。
- 空间复杂度：$O(1)$。只需要常数空间存放若干变量。

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let profit = 0;
  let n = prices.length;
  for (let i = 1; i < n; ++i) {
    profit += Math.max(0, prices[i] - prices[i - 1]);
  }

  return profit;
};
```
