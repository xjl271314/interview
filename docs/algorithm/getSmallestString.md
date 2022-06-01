---
title: 具有给定数值的最小字符串
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode 1663：具有给定数值的最小字符串

- 2022.04.08

[具有给定数值的最小字符串](https://leetcode-cn.com/problems/smallest-string-with-a-given-numeric-value/)。

小写字符的数值是它在字母表中的位置（从 1 开始），因此 `a` 的数值为 1 ，`b` 的数值为 2 ，`c` 的数值为 3 ，以此类推。

字符串由若干小写字符组成，字符串的数值 为各字符的数值之和。例如，字符串 `abe` 的数值等于 `1 + 2 + 5 = 8` 。

给你两个整数 `n` 和 `k` 。返回 长度 等于 `n` 且 数值 等于 `k` 的字典序`最小`的字符串。

**注意，如果字符串 x 在字典排序中位于 y 之前，就认为 x 字典序比 y 小，有以下两种情况：**

- x 是 y 的一个前缀；
- 如果 i 是 `x[i] != y[i]` 的第一个位置，且 `x[i]` 在字母表中的位置比 `y[i]` 靠前。

- 示例 1：

  ```js
  输入：n = 3, k = 27
  输出："aay"
  解释：字符串的数值为 1 + 1 + 25 = 27，它是数值满足要求且长度等于 3 字典序最小的字符串。
  ```

- 示例 2：

  ```js
  输入：n = 5, k = 73
  输出："aaszz"
  ```

- 提示：

  - 1 <= n <= 10^5
  - n <= k <= 26 \* n

## 贪心

每个位置全部填充 a，保证位数，再从最后一位向前推：

1. 先定义一个长度为 n 的数组，给每一位上都填充上字符 a；
2. k - n 就是每一位都是 a 的时候还差多少；
3. 从最后一位（即 n-1）开始，从后往前来分余下的 k - n；
4. 由于 n <= k <= 26 \* n 所以每位上的范围都在 [a, z]这个区间。

### javascript

```js
/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
var getSmallestString = function (n, k) {
  // 每位先填充a
  let res = new Array(n).fill('a');
  // 构造剩余的位数和位索引
  let remain = k - n,
    i = n - 1;

  // 当有剩余的时候循环
  while (remain) {
    // 当前位无法填充满的时候，需要向前填充
    if (remain > 25) {
      remain -= 25;
      res[i] = 'z';
      i--;
    } // 当前位可以填充完
    else {
      // 97 是字符串a的ASCII码对应的编码
      res[i] = String.fromCharCode(97 + remain);
      remain = 0;
    }
  }

  return res.join('');
};
```
