---
title: 买卖股票的最佳时机 III
nav:
  title: 编程题
  path: /writing
group:
  title: 困难
  path: /writing/project/difficult
---

# LeetCode 123：买卖股票的最佳时机 III

- 2022.06.28

[买卖股票的最佳时机 III](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/)

给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔 交易。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

- 示例 1：

  ```js
  输入：prices = [3,3,5,0,0,3,1,4]
  输出：6
  解释：在第 4 天（股票价格 = 0）的时候买入，在第 6 天（股票价格 = 3）的时候卖出，这笔交易所能获得利润 = 3-0 = 3 。
  随后，在第 7 天（股票价格 = 1）的时候买入，在第 8 天 （股票价格 = 4）的时候卖出，这笔交易所能获得利润 = 4-1 = 3 。
  ```

- 示例 2：

  ```js
  输入：prices = [1,2,3,4,5]
  输出：4
  解释：在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
  注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。
  因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
  ```

- 示例 3：

  ```js
  输入：prices = [7,6,4,3,1]
  输出：0
  解释：在这个情况下, 没有交易完成, 所以最大利润为 0。
  ```

- 提示：
  - $1 <= prices.length <= 10^5$
  - $0 <= prices[i] <= 10^5$

## 动态规划

由于我们最多可以完成两笔交易，因此在任意一天结束之后，我们会处于以下五个状态中的一种：

- 未进行过任何操作；
- 只进行过一次买操作；
- 进行了一次买操作和一次卖操作，即完成了一笔交易；
- 在完成了一笔交易的前提下，进行了第二次买操作；
- 完成了全部两笔交易。

由于第一个状态的利润显然为 0，因此我们可以不用将其记录。

对于剩下的四个状态，我们分别将它们的最大利润记为 $\textit{buy}_1$，$\textit{sell}_1$
，$\textit{buy}_2$以及 $\textit{sell}_2$。

我们使用

- dp[i][k][0] 表示在第 i 天 通过 k 次交易，手上没有股票
- dp[i][k][1] 表示在第 i 天 通过 k 次交易，手上持有股票

得到如下的状态转移方程:

- dp[i][k][0] = Math.max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i])
- dp[i][k][1] = Math.max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i])

k 对结果有影响 不能舍去，只能对 k 进行循环

```js
for (let i = 0; i < n; i++) {
  for (let k = maxK; k >= 1; k--) {
    dp[i][k][0] = Math.max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
    dp[i][k][1] = Math.max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
  }
}

//k=2，直接写出循环的结果
dp[i][2][0] = Math.max(dp[i - 1][2][0], dp[i - 1][2][1] + prices[i])
dp[i][2][1] = Math.max(dp[i - 1][2][1], dp[i - 1][1][0] - prices[i])

dp[i][1][0] = Math.max(dp[i - 1][1][0], dp[i - 1][1][1] + prices[i])
dp[i][1][1] = Math.max(dp[i - 1][1][1], dp[i - 1][0][0] - prices[i])
            = Math.max(dp[i - 1][1][1], -prices[i])// k=0时 没有交易次数，dp[i - 1][0][0] = 0

//去掉i这一维度
dp[2][0] = Math.max(dp[2][0], dp[2][1] + prices[i])
dp[2][1] = Math.max(dp[2][1], dp[1][0] - prices[i])

dp[1][0] = Math.max(dp[1][0], dp[1][1] + prices[i])
dp[1][1] = Math.max(dp[1][1], dp[0][0] - prices[i])
            = Math.max(dp[1][1], -prices[i])// k=0时 没有交易次数，dp[i - 1][0][0] = 0

```

### javascript

- 时间复杂度：O(n)，其中 n 是数组 $\textit{prices}$的长度。
- 空间复杂度：O(1)。
- 执行用时：84 ms, 在所有 JavaScript 提交中击败了 80.99% 的用户
- 内存消耗：50.6 MB, 在所有 JavaScript 提交中击败了 79.53% 的用户

```js
var maxProfit = function (prices) {
  const n = prices.length;
  let buy1 = -prices[0],
    buy2 = -prices[0];
  let sell1 = 0,
    sell2 = 0;
  for (let i = 1; i < n; i++) {
    buy1 = Math.max(buy1, -prices[i]);
    sell1 = Math.max(sell1, buy1 + prices[i]);
    buy2 = Math.max(buy2, sell1 - prices[i]);
    sell2 = Math.max(sell2, buy2 + prices[i]);
  }
  return sell2;
};
```
