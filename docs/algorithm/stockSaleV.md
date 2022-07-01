---
title: 买卖股票的最佳时机V(含交易冷冻期)
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode 309： 买卖股票的最佳时机 V(含交易冷冻期)

- 2022.06.27

[买卖股票的最佳时机 V(含交易冷冻期)](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

给定一个数组 `prices` ，它的第 i 个元素 `prices[i]` 表示一支给定股票第 i 天的价格。

在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。

卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。

返回 你能获得的 最大 利润 。

- 示例 1：

  ```js
  输入: prices = [1, 2, 3, 0, 2];
  输出: 3;
  解释: 对应的交易状态为: [买入, 卖出, 冷冻期, 买入, 卖出];
  ```

- 示例 2：

  ```js
  输入: prices = [1];
  输出: 0;
  ```

- 提示：
  - 1 <= prices.length <= 5000
  - 0 <= prices[i] <= 1000

## 动态规划

### javascript

- 执行用时：60 ms, 在所有 JavaScript 提交中击败了 86.22% 的用户
- 内存消耗：40.9 MB, 在所有 JavaScript 提交中击败了 97.95% 的用户

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let n = prices.length;
  let buy = -prices[0]; //手中有股票
  let sell = 0; //没有股票
  let profit_freeze = 0;
  for (let i = 1; i < n; i++) {
    let temp = sell;
    sell = Math.max(sell, buy + prices[i]);
    buy = Math.max(buy, profit_freeze - prices[i]);
    profit_freeze = temp;
  }
  return sell;
};
```
