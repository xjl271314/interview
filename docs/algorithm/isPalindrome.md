---
title: 回文数
nav:
  title: 编程题
  path: /writing
group:
  title: 简单
  path: /writing/project/easy
  order: 2
---

# LeetCode 9：回文数

- 2022.04.18

给你一个整数 `x` ，如果 `x` 是一个回文整数，返回 `true`；否则，返回 `false`。

**回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数**。

例如，`121` 是回文，而 `123` 不是。

- 示例 1：

  ```js
  输入：x = 121
  输出：true
  ```

- 示例 2：

  ```js
  输入：x = -121
  输出：false
  解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
  ```

- 示例 3：

  ```js
  输入：x = 10
  输出：false
  解释：从右向左读, 为 01 。因此它不是一个回文数。
  ```

- 提示：

  - -2^31 <= x <= 2^31 - 1

- 进阶：你能不将整数转为字符串来解决这个问题吗？

## 迭代+首尾比较

### javascript

- 执行用时：156 ms, 在所有 JavaScript 提交中击败了 49.39% 的用户
- 内存消耗：49.2 MB, 在所有 JavaScript 提交中击败了 62.31% 的用户

```js
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  if (x < 0) {
    return false;
  }

  x = x.toString();

  for (let i = 0, j = x.length - 1; i < j; i++, j--) {
    if (x[i] !== x[j]) return false;
  }

  return true;
};
```

## 直接全反转

既然是回文数，转化为数组后再反转回来的话应该是相等的。

### javascript

- 执行用时：132 ms, 在所有 JavaScript 提交中击败了 92.79% 的用户
- 内存消耗：50.3 MB, 在所有 JavaScript 提交中击败了 12.71% 的用户

```js
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  // 这里可以加 x === 0，x % 10 === 0 的判断
  if (x < 0) {
    return false;
  }

  x = x.toString();

  let y = x.split('').reverse().join('');

  return x === y;
};
```

## 迭代 + 数组 + 半数反转

- 执行用时：144 ms, 在所有 JavaScript 提交中击败了 74.88% 的用户
- 内存消耗：49.9 MB, 在所有 JavaScript 提交中击败了 39.89% 的用户

### javascript

```js
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  if (x < 0) {
    return false;
  }

  x = x.toString();

  // 判断长度是奇数还是偶数
  const len = x.length;
  const mid = Math.floor(x.length / 2);

  // 当长度是偶数的时候直接使用mid 否则mid+1
  const next = len % 2 === 0 ? mid : mid + 1;

  return (
    x.slice(0, mid).split('').join('') ===
    x.slice(next).split('').reverse().join('')
  );
};
```

## Number 类型的半数反转

首先，我们应该处理一些临界情况。所有`负数`都不可能是回文，例如：`-123` 不是回文，因为 `-` 不等于 3。

所以我们可以对所有`负数`返回 `false`。

除了 `0` 以外，所有`个位`是 `0` 的数字不可能是回文，因为最高位不等于 `0`。所以我们可以对所有大于 0 且个位是 0 的数字返回 `false`。

对于数字 `1221`，如果执行 `1221 % 10`，我们将得到最后一位数字 `1`，要得到倒数第二位数字，我们可以先通过除以 `10` 把最后一位数字从 `1221` 中移除，`1221 / 10 = 122`，再求出上一步结果除以 `10` 的余数，`122 % 10 = 2`，就可以得到倒数第二位数字。

如果我们把最后一位数字乘以 `10`，再加上倒数第二位数字，`1 * 10 + 2 = 12`，就得到了我们想要的反转后的数字。如果继续这个过程，我们将得到更多位数的反转数字。

由于整个过程我们不断将原始数字除以 `10`，然后给反转后的数字乘上 `10`，所以，当原始数字小于或等于反转后的数字时，就意味着我们已经处理了一半位数的数字了。

![Number类型的半数反转](https://assets.leetcode-cn.com/solution-static/9/9_fig1.png)

### javascript

- 执行用时：140 ms, 在所有 JavaScript 提交中击败了 82.17% 的用户
- 内存消耗：48.6 MB, 在所有 JavaScript 提交中击败了 81.39% 的用户

```js
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  if (x === 0) return true;

  if (x < 0 || x % 10 === 0) {
    return false;
  }
  // 反转的数字
  let reversedNumber = 0;

  while (x > reversedNumber) {
    reversedNumber = (x % 10) + reversedNumber * 10;
    x = Math.floor(x / 10);
  }

  // 当数字长度为奇数时，我们可以通过 reversedNumber/10 去除处于中位的数字。
  // 例如，当输入为 12321 时，在 while 循环的末尾我们可以得到 x = 12，reversedNumber = 123，
  // 由于处于中位的数字不影响回文（它总是与自己相等），所以我们可以简单地将其去除。
  return x === reversedNumber || x === Math.floor(reversedNumber / 10);
};
```
