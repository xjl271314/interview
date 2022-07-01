---
title: 买卖股票的最佳时机 IV
nav:
  title: 编程题
  path: /writing
group:
  title: 困难
  path: /writing/project/difficult
---

# LeetCode 188：买卖股票的最佳时机 IV

- 2022.06.30

[买卖股票的最佳时机 IV](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)

给定一个整数数组 prices ，它的第 i 个元素 `prices[i]` 是一支给定的股票在第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

- 示例 1：

  ```js
  输入：k = 2, prices = [2,4,1]
  输出：2
  解释：在第 1 天 (股票价格 = 2) 的时候买入，在第 2 天 (股票价格 = 4) 的时候卖出，这笔交易所能获得利润 = 4-2 = 2 。
  ```

- 示例 2：

  ```js
  输入：k = 2, prices = [3,2,6,5,0,3]
  输出：7
  解释：在第 2 天 (股票价格 = 2) 的时候买入，在第 3 天 (股票价格 = 6) 的时候卖出, 这笔交易所能获得利润 = 6-2 = 4 。
     随后，在第 5 天 (股票价格 = 0) 的时候买入，在第 6 天 (股票价格 = 3) 的时候卖出, 这笔交易所能获得利润 = 3-0 = 3 。
  ```

- 提示:
  - 0 <= k <= 100
  - 0 <= prices.length <= 1000
  - 0 <= prices[i] <= 1000

## 动态规划

### javascript

- 执行用时：72 ms, 在所有 JavaScript 提交中击败了 69.16% 的用户
- 内存消耗：44 MB, 在所有 JavaScript 提交中击败了 42.36% 的用户

```js
const maxProfit = function (k, prices) {
  let n = prices.length;
  let profit = new Array(k);
  // 初始化k次交易买入卖出的利润
  for (let j = 0; j <= k; j++) {
    profit[j] = {
      buy: -prices[0], //表示有股票
      sell: 0, //表示没有股票
    };
  }
  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= k; j++) {
      //交易k次，所以直接在加一层k循环就可以
      profit[j] = {
        sell: Math.max(profit[j].sell, profit[j].buy + prices[i]),
        buy: Math.max(profit[j].buy, profit[j - 1].sell - prices[i]),
      };
    }
  }
  return profit[k].sell; //返回第k次清空手中的股票之后的最大利润
};
```
