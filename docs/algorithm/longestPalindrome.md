---
title: 最长回文子串
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode5：最长回文子串

- 2022.02.11

[最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)给你一个字符串 s，找到 s 中最长的回文子串。

- 示例 1：

  ```
  输入：s = "babad"
  输出："bab"
  解释："aba" 同样是符合题意的答案。
  ```

- 示例 2：

  ```
  输入：s = "cbbd"
  输出："bb"
  ```

- 提示：

  - 1 <= s.length <= 1000
  - s 仅由数字和英文字母组成

## 暴力解法

列举所有的子串，判断是否为回文串，保存最长的回文串。

### javascript

```js
/**
 * 时间复杂度：两层 for 循环 O(n²），for 循环里边判断是否为回文 O(n），所以时间复杂度为 O(n³）。
 * 空间复杂度：O(1），常数个变量。
 **/
const isPalindromic = (s) => {
  let length = s.length;
  for (let i = 0; i < length / 2; i++) {
    if (s[i] != s[length - i - 1]) {
      return false;
    }
  }
  return true;
};

var longestPalindrome = function (s) {
  let ans = '';
  let max = 0;
  let length = s.length;
  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j <= length; j++) {
      let substr = s.substring(i, j);
      if (isPalindromic(substr) && substr.length > max) {
        ans = s.substring(i, j);
        max = Math.max(max, ans.length);
      }
    }
  }

  return ans;
};
```

## 动态规划

### javascript

```js

```
