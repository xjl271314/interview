---
title: 分割回文串
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode 131： 分割回文串

- 2022.03.28

[分割回文串](https://leetcode-cn.com/problems/palindrome-partitioning/)给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是 `回文串` 。返回 `s` 所有可能的分割方案。

`回文串` 是正着读和反着读都一样的字符串。

- 示例 1：

  ```js
  输入：s = "aab"
  输出：[["a","a","b"],["aa","b"]]
  ```

- 示例 2：

  ```js
  输入：s = "a"
  输出：[["a"]]
  ```

- 提示：

  ```js
  1 <= s.length <= 16
  s 仅由小写英文字母组成
  ```

本题涉及到两个关键问题：

1. 切割问题，有不同的切割方式
2. 判断回文

这种题目，想用`for`循环暴力解法，可能都不那么容易写出来，所以要换一种方式，那就是`回溯`。

回溯究竟是如何切割字符串呢？

其实切割问题类似组合问题。

例如对于字符串`abcdef`：

- 组合问题：选取一个 a 之后，在 bcdef 中再去选取第二个，选取 b 之后在 cdef 中在选组第三个.....。
- 切割问题：切割一个 a 之后，在 bcdef 中再去切割第二段，切割 b 之后在 cdef 中在切割第三段.....。

所以切割问题，也可以抽象为一棵树形结构，如图：

![示例](https://code-thinking.cdn.bcebos.com/pics/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.jpg)

递归用来纵向遍历，for 循环用来横向遍历，切割线（就是图中的红线）切割到字符串的结尾位置，说明找到了一个切割方法。

**判断回文子串**

判断一个字符串是否是回文，可以使用双指针法，一个指针从前向后，一个指针从后先前，如果前后指针所指向的元素是相等的，就是回文字符串了。

```js
function isPalindrome(str) {
  for (let i = 0, j = str.length - 1; i < j; i++, j--) {
    if ((s[i] = s[j])) {
      return false;
    }
  }

  return true;
}
```

## 回溯 + 回文

我们用指针 start 试着去切，切出一个回文串，基于新的 start，继续往下切，直到 start 越界。

每次基于当前的 start，可以选择不同的 i，切出 start 到 i 的子串，我们枚举出这些选项 i：

- 切出的子串满足回文，将它加入部分解 temp 数组，并继续往下切（递归）
- 切出的子串不是回文，跳过该选择，不落入递归，继续下一轮迭代

![回溯 + 回文](https://pic.leetcode-cn.com/1615074249-jcNHLL-image.png)

**为什么要回溯？**

因为不是找到一个合法的部分解就完事，要找齐所有的合法的部分解。

下面两种情况，是结束当前递归的两种情形：

1. 指针越界了，没有可以切分的子串了，递归到这一步，说明一直在切出回文串，现在生成了一个合法的部分解，return
2. 走完了当前递归的 for 循环，考察了基于当前 start 的所有的切分可能，当前递归自然地结束

它们都代表，当前作出的选择，所进入的递归，结束了，该分支的搜索结束了，该去搜另一分支了

所以当前递归结束后，要将当前的选择撤销，回到选择前的状态，去考察另一个选择，即进入下一轮迭代，尝试另一种切分的可能。

这样才能在解的空间树中，把路走全了，搜出所有的合法部分解。

### javascript

- 执行用时：228 ms, 在所有 JavaScript 提交中击败了 50.54% 的用户
- 内存消耗：60 MB, 在所有 JavaScript 提交中击败了 92.41% 的用户

```js
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function (s) {
  const res = [],
    temp = [],
    len = s.length;

  function backtracking(i) {
    if (i >= len) {
      res.push([...temp]);
      return;
    }
    for (let j = i; j < len; j++) {
      if (!isPalindrome(s, i, j)) continue;
      temp.push(s.substr(i, j - i + 1));
      backtracking(j + 1);
      temp.pop();
    }
  }

  backtracking(0);

  return res;
};

function isPalindrome(s, l, r) {
  for (let i = l, j = r; i < j; i++, j--) {
    if (s[i] !== s[j]) {
      return false;
    }
  }
  return true;
}
```
