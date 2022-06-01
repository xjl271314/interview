---
title: 反转字符串
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 344：反转字符串

- 2022.04.11

[反转字符串](https://leetcode-cn.com/problems/reverse-string/)编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。

不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 `O(1)` 的额外空间解决这一问题。

- 示例 1：

  ```js
  输入：s = ["h","e","l","l","o"]
  输出：["o","l","l","e","h"]
  ```

- 示例 2：

  ```js
  输入：s = ["H","a","n","n","a","h"]
  输出：["h","a","n","n","a","H"]
  ```

- 提示：
  - 1 <= s.length <= 10^5
  - s[i] 都是 ASCII 码表中的可打印字符

## 二分循环

思路是直接从左到右变量，遍历的结束位置为数组的中间值，然后反转对应下标的元素即可。

### javascript

- 执行用时：92 ms, 在所有 JavaScript 提交中击败了 54.67% 的用户
- 内存消耗：48.4 MB, 在所有 JavaScript 提交中击败了 7.33% 的用户

```js
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
  const len = s.length;
  const mod2 = len % 2 == 0;
  const mid = mod2 ? len / 2 - 1 : parseInt(len / 2);
  if (len > 1) {
    for (let i = 0; i <= mid; i++) {
      let temp = s[len - i - 1];
      s[len - i - 1] = s[i];
      s[i] = temp;
    }
  }

  return s;
};
```

## 双指针法

我们也可以使用双指针一个指向起点，一个指向数组末尾，当左指针小于右指针的时候不断的进行交换。

### javascript

- 执行用时：76 ms, 在所有 JavaScript 提交中击败了 96.77% 的用户
- 内存消耗：48.2 MB, 在所有 JavaScript 提交中击败了 17.23% 的用户

```js
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
  const len = s.length;
  for (let left = 0, right = len - 1; left < right; ++left, --right) {
    [s[left], s[right]] = [s[right], s[left]];
  }
};
```
