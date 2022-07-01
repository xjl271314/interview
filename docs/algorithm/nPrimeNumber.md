---
title: 获取N以内的所有素数
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode204：计算质数

- 2022.06.23

[计算质数](https://leetcode.cn/problems/count-primes/)给定整数 n ，返回 所有小于非负整数 n 的质数的数量 。

- 示例 1:

  ```js
  输入：n = 10
  输出：4
  解释：小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。
  ```

- 示例 2:

  ```js
  输入：n = 0
  输出：0
  ```

- 示例 3:

  ```js
  输入：n = 1
  输出：0
  ```

- 提示：
  - 0 <= n <= 5 \* 106

## 基本实现

通过遍历和判断一个数是否是素质进行组合。

- 时间复杂度：O(n$\sqrt{n}$)，因为判断单个素数时间复杂度是 $\sqrt{n}$
- 空间复杂度：O(1)

### javascript

- 执行用时：3564 ms, 在所有 JavaScript 提交中击败了 9.85% 的用户
- 内存消耗：41 MB, 在所有 JavaScript 提交中击败了 92.54% 的用户

```js
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function (n) {
  if (n == 1) return 0;
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (isPrimeNumber(i)) {
      count++;
    }
  }

  return count;
};

function isPrimeNumber(num) {
  const end = Math.sqrt(num);
  for (let i = 2; i <= end; i++) {
    if (num % i == 0) return false;
  }
  return true;
}
```

## 使用改进查找质数的基本实现

### javascript

- 执行用时：1340 ms, 在所有 JavaScript 提交中击败了 16.32% 的用户
- 内存消耗：41.4 MB, 在所有 JavaScript 提交中击败了 88.23% 的用户

```js
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function (n) {
  if (n == 1) return 0;
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (isPrimeNumber(i)) {
      count++;
    }
  }

  return count;
};

function isPrimeNumber(n) {
  if (n == 2 || n == 3) return true;
  // 不在6的倍数的2侧的肯定不是
  if (n % 6 != 1 && n % 6 != 5) {
    return false;
  }
  const end = Math.sqrt(n);
  for (let i = 5; i <= end; i += 6) {
    if (n % i == 0 || n % (i + 2) == 0) return false;
  }
  return true;
}
```

## 埃氏筛

这是一个古老的筛素数的方法。方法如下：

1. 初始化长度 `O(n)` 的标记数组，表示这个数组是否为质数。数组初始化所有的数都是质数.

2. 从 2 开始将当前数字的倍数全都标记为合数。标记到 $\sqrt{n}$ 时停止即可。具体可以看来自维基百科的动画：

   ![埃氏筛](https://pic.leetcode-cn.com/1606932458-HgVOnW-Sieve_of_Eratosthenes_animation.gif)

   **注意: 每次找当前素数 x 的倍数时，是从 $x^2$ 开始的。因为如果 `x > 2`，那么 `2∗x` 肯定被素数 2 给过滤了，最小未被过滤的肯定是 $x^2$ 。**

### javascript

- 执行用时：312 ms, 在所有 JavaScript 提交中击败了 76.14% 的用户
- 内存消耗：80.5 MB, 在所有 JavaScript 提交中击败了 65.61% 的用户

```js
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function (n) {
  // 初始化长度为n的质数数组
  const isPrim = new Array(n).fill(true);
  // 从 2 开始枚举到 sqrt(n)。
  for (let i = 2; i < Math.sqrt(n); i++) {
    // 如果当前是素数
    if (isPrim[i]) {
      // 就把从 i 开始，i 的所有倍数都设置为 false。
      for (let j = i * i; j < n; j += i) {
        isPrim[j] = false;
      }
    }
  }

  // 计数
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (isPrim[i]) {
      count++;
    }
  }

  return count;
};
```
