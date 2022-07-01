---
title: 买卖股票的最佳时机
nav:
  title: 编程题
  path: /writing
group:
  title: 简单
  path: /writing/project/easy
  order: 2
---

# LeetCode 121： 买卖股票的最佳时机

- 2022.06.27

[买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

![在这里插入图片描述](https://img-blog.csdnimg.cn/61701d0abfa145af8f2a2c0cbad9b1bd.png)

限制条件

- 先买入才能卖出
- 不能同时参加多笔交易，再次买入时，需要先卖出
- k >= 0 才能进行交易，否则没有交易次数

定义操作

- 买入
- 卖出
- 不操作

定义状态

- i: 天数
- k: 交易次数，每次交易包含买入和卖出，这里我们只在买入的时候需要将 k - 1
- 0: 不持有股票
- 1: 持有股票

最终的最大收益是`dp[n - 1][k][0]`而不是`dp[n - 1][k][1]`，因为最后一天卖出肯定比持有收益更高。

给定一个数组 `prices` ，它的第 i 个元素 `prices[i]` 表示一支给定股票第 i 天的价格。

你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。

- 示例 1：

  ```js
  输入：[7,1,5,3,6,4]
  输出：5
  解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
  ```

- 示例 2：

  ```js
  输入：prices = [7,6,4,3,1]
  输出：0
  解释：在这种情况下, 没有交易完成, 所以最大利润为 0。
  ```

- 提示：
  - $1 <= prices.length <= 10^5$
  - $0 <= prices[i] <= 10^4$

## 暴力解法-寻找剩余最大值

定义最大利润为 0，计算出每天的买入，卖出的利润差，并进行赋值。

该算法实际执行下来超时。

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let profit = 0;
  for (let i = 0; i < prices.length; i++) {
    let buyPrice = prices[i];
    let salePrice = Math.max.apply(null, prices.slice(i + 1));
    let toadyProfit = salePrice - buyPrice;

    profit = Math.max(profit, toadyProfit);
  }

  return profit;
};
```

## 暴力解法-计算每次最大值

该方式与上述方式类似，只是使用了两次循环。

实际执行下来也是超时。

- 时间复杂度：$O(n^2)$ 循环运行 $\dfrac{n (n-1)}{2}$次。
- 空间复杂度：$O(1)$。只使用了常数个变量。

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let profit = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      let todayProfit = prices[j] - prices[i];
      if (todayProfit > profit) {
        profit = todayProfit;
      }
    }
  }

  return profit;
};
```

## 动态规划

限定交易次数为 1 之后

```js
//第i天不持有 由 第i-1天不持有然后不操作 和 第i-1天持有然后卖出 两种情况的最大值转移过来
dp[i][1][0] = Math.max(dp[i - 1][1][0], dp[i - 1][1][1] + prices[i])
//第i天持有 由 第i-1天持有然后不操作 和 第i-1天不持有然后买入 两种情况的最大值转移过来
dp[i][1][1] = Math.max(dp[i - 1][1][1], dp[i - 1][0][0] - prices[i])
            = Math.max(dp[i - 1][1][1], -prices[i]) // k=0时 没有交易次数，dp[i - 1][0][0] = 0
```

k 是固定值 1，不影响结果，所以可以不用管，简化之后如下

```js
dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
```

因此得到如下的代码

```js
//时间复杂度O(n) 空间复杂度O(n)，dp数组第二维是常数
var maxProfit = function (prices) {
  let n = prices.length;
  let dp = Array.from(new Array(n), () => new Array(2));
  dp[0][0] = 0; //第0天不持有
  dp[0][1] = -prices[0]; //第0天持有
  for (let i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i - 1][1], -prices[i]);
  }
  return dp[n - 1][0];
};
```

状态压缩，`dp[i]` 只和 `dp[i - 1]` 有关，去掉一维

```js
// 时间复杂度O(n) 空间复杂度O(1)
var maxProfit = function (prices) {
  let n = prices.length;
  let dp = Array.from(new Array(n), () => new Array(2));
  dp[0] = 0;
  dp[1] = -prices[0];
  for (let i = 1; i < n; i++) {
    dp[0] = Math.max(dp[0], dp[1] + prices[i]);
    dp[1] = Math.max(dp[1], -prices[i]);
  }
  return dp[0];
};
```

语义化之后:

```js
var maxProfit = function (prices) {
  let n = prices.length;
  let sell = 0;
  let buy = -prices[0];
  for (let i = 1; i < n; i++) {
    sell = Math.max(sell, buy + prices[i]);
    buy = Math.max(buy, -prices[i]);
  }
  return sell;
};
```

实际上在我们买卖股票的时候都会思考，假如我今天买的时候是历史最低价就好了，然后在将来的第 i 天卖出能够收获最大利益。

假如计划在第 i 天卖出股票，那么最大利润的差值一定是在`[0, i-1]` 之间选最低点买入；所以遍历数组，依次求每个卖出时机的的最大差值，再从中取最大值。

$dp[i] = min(d[i-1], prices[i])$

- 执行用时：80 ms, 在所有 JavaScript 提交中击败了 67.47%的用户
- 内存消耗：50.6 MB, 在所有 JavaScript 提交中击败了 75.22% 的用户
- 时间复杂度：$O(n)$，只需要遍历一次。
- 空间复杂度：$O(1)$，只使用了常数个变量。

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let profit = 0,
    minBuyerPrice = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minBuyerPrice) {
      minBuyerPrice = prices[i];
    } else if (prices[i] - minBuyerPrice > profit) {
      profit = prices[i] - minBuyerPrice;
    }
  }

  return profit;
};
```
