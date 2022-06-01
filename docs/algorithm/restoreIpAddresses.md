---
title: 复原 IP 地址
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode 93： 复原 IP 地址

- 2022.03.28

[复原 IP 地址](https://leetcode-cn.com/problems/restore-ip-addresses/)有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。

- 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。

给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入  '.' 来形成。你 不能   重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。

- 示例 1：

  ```js
  输入：s = "25525511135"
  输出：["255.255.11.135","255.255.111.35"]
  ```

- 示例 2：

  ```js
  输入：s = "0000"
  输出：["0.0.0.0"]
  ```

- 示例 3：

  ```js
  输入：s = "101023"
  输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
  ```

- 提示：
  - 1 <= s.length <= 20
  - 仅由数字组成

## 思路

- 以 "25525511135" 为例，第一步时我们有几种选择？
  - 选 "2" 作为第一个片段
  - 选 "25" 作为第一个片段
  - 选 "255" 作为第一个片段
- 能切三种不同的长度，切第二个片段时，又面临三种选择。
- 这会向下分支，形成一棵树，我们用 DFS 去遍历所有选择，必要时提前回溯。
  - 因为某一步的选择可能是错的，得不到正确的结果，不要往下做了。撤销最后一个选择，回到选择前的状态，去试另一个选择。

### javascript

- 执行用时：60 ms, 在所有 JavaScript 提交中击败了 91.80% 的用户
- 内存消耗：41.5 MB, 在所有 JavaScript 提交中击败了 60.59% 的用户

```js
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  const res = [],
    temp = [];

  function backtracking(i) {
    const len = temp.length;
    // IP只有4段
    if (len > 4) return;
    // 如果刚好4段 并且耗尽了所有的字符
    if (len == 4 && i == s.length) {
      res.push(temp.join('.'));
      return;
    }
    for (let j = i; j < s.length; j++) {
      const str = s.substr(i, j - i + 1);
      // 段位如果大于255了不合法
      if (str.length > 3 || +str > 255) break;
      // 段位以0为开头的数字不合法
      if (str.length > 1 && str[0] == '0') break;
      temp.push(str);
      backtracking(j + 1);
      temp.pop();
    }
  }

  backtracking(0);
  return res;
};
```
