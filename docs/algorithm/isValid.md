---
title: 有效的括号
nav:
  title: 编程题
  path: /writing
group:
  title: 简单
  path: /writing/project/easy
  order: 2
---

# LeetCode 20：有效的括号

- 2022.04.13

[有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)。

给定一个只包括 `(`，`)`，`{`，`}`，`[`，`]`  的字符串 s ，判断字符串是否有效。

有效字符串需满足：

- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。

- 示例 1：

  ```js
  输入：s = "()"
  输出：true
  ```

- 示例 2：

  ```js
  输入：s = "()[]{}"
  输出：true
  ```

- 示例 3：

  ```js
  输入：s = "(]"
  输出：false
  ```

- 示例 4：

  ```js
  输入：s = "([)]"
  输出：false
  ```

- 示例 5：

  ```js
  输入：s = "{[]}"
  输出：true
  ```

- 提示:

  - 1 <= s.length <= 10^4
  - s 仅由括号 '()[]{}' 组成

## 暴力解法

### javascript

- 执行用时：84 ms, 在所有 JavaScript 提交中击败了 11.36%的用户
- 内存消耗：46.6 MB, 在所有 JavaScript 提交中击败了 7.02%的用户

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  while (true) {
    let len = s.length;
    // 将字符串按照匹配对，挨个替换为''
    s = s.replace('{}', '').replace('[]', '').replace('()', '');
    // 有两种情况s.length会等于len
    // 1. s匹配完了，变成了空字符串
    // 2. s无法继续匹配，导致其长度和一开始的len一样，比如({],一开始len是3，匹配完还是3，说明不用继续匹配了，结果就是false
    if (s.length === len) {
      return len === 0;
    }
  }
};
```

## 栈

### javascript

- 执行用时：48 ms, 在所有 JavaScript 提交中击败了 99.44%的用户
- 内存消耗：42.4 MB, 在所有 JavaScript 提交中击败了 13.49%的用户

```js
/**
 * @param {string} s
 * @return {boolean}
 * 时间复杂度为 O(n)
 * 空间复杂度为 O(1)
 */
var isValid = function (s) {
  const stack = [];

  for (let i = 0; i < s.length; i++) {
    if (['(', '{', '['].includes(s[i])) {
      stack.unshift(s[i]);
    } else if (['()', '{}', '[]'].includes(stack[0] + s[i])) {
      stack.shift();
    } else {
      return false;
    }
  }

  return stack.length == 0;
};
```
