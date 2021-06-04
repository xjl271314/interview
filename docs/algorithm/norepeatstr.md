---
title: 无重复字符的最长子串
nav:
  title: 算法
  path: /write
  order: 0
group:
  title: 算法相关试题
  path: /write/project
---

# LeetCode:无重复字符的最长子串(难度:中等)

- 2021.06.03

给定一个字符串，请你找出其中不含有重复字符的 `最长子串` 的长度。

- 示例 1:

```
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

- 示例 2:

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

- 示例 3:

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

- 示例 4:

```
输入: s = ""
输出: 0
```

- 提示：

```
0 <= s.length <= 5 * 104
s 由英文字母、数字、符号和空格组成
```

## 解法一: 滑动窗口

### javascript

> `运行时间 116 ms 内存消耗 42.1 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  假设我们的输入是abcabcbb:
 *  以 (a)bcabcbb 开始的最长字符串为 (abc)abcbb;
 *  以 a(b)cabcbb 开始的最长字符串为 a(bca)bcbb;
 *  以 ab(c)abcbb 开始的最长字符串为 ab(cab)cbb;
 *  以 abc(a)bcbb 开始的最长字符串为 abc(abc)bb;
 *  以 abca(b)cbb 开始的最长字符串为 abca(bc)bb;
 *  以 abcab(c)bb 开始的最长字符串为 abcab(cb)b;
 *  以 abcabc(b)b 开始的最长字符串为 abcabc(b)b;
 *  以 abcabcb(b) 开始的最长字符串为 abcabcb(b)。
 *  如果我们依次递增地枚举子串的起始位置，那么子串的结束位置也是递增的。
 *  假设我们选择字符串中的第 k 个字符作为起始位置，并且得到了不包含重复字符的最长子串的结束位置为 rk。
 *  那么当我们选择第 k+1 个字符作为起始位置时，首先从 k+1 到 rk的字符显然是不重复的。
 *  并且由于少了原本的第 k 个字符，我们可以尝试继续增大 rk,直到右侧出现了重复字符为止。
 *
 *  这样一来，我们就可以使用「滑动窗口」来解决这个问题了：
 *
 *    1.我们使用两个指针表示字符串中的某个子串（或窗口）的左右边界，其中左指针代表着上文中「枚举子串的起始位置」，而右指针即为上文中的 rk;
 *
 *    2.在每一步的操作中，我们会将左指针向右移动一格，表示 我们开始枚举下一个字符作为起始位置.
 *      然后我们可以不断地向右移动右指针，但需要保证这两个指针对应的子串中没有重复的字符。
 *      在移动结束后，这个子串就对应着 以左指针开始的，不包含重复字符的最长子串。我们记录下这个子串的长度；
 *
 *    3.在枚举结束后，我们找到的最长的子串的长度即为答案。
 *
 *  在上面的流程中，我们还需要使用一种数据结构来判断 是否有重复的字符。
 *  常用的数据结构为哈希集合（即 Python 中的 set, JavaScript 中的 Set）。
 *  时间复杂度：O(N)，空间复杂度：O(∣Σ∣)，其中 Σ 表示字符集（即字符串中可以出现的字符），∣Σ∣ 表示字符集的大小。
 *  ----------------------------------------------------------------
 *  @param {string} s
 *  @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  // 哈希集合，记录每个字符是否出现过
  const occ = new Set();
  const n = s.length;
  // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动
  let rk = -1,
    ans = 0;
  for (let i = 0; i < n; ++i) {
    if (i != 0) {
      // 左指针向右移动一格，移除一个字符
      occ.delete(s.charAt(i - 1));
    }
    while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
      // 不断地移动右指针
      occ.add(s.charAt(rk + 1));
      ++rk;
    }
    // 第 i 到 rk 个字符是一个极长的无重复字符子串
    ans = Math.max(ans, rk - i + 1);
  }
  return ans;
};
```

### 使用数组代替哈希表

> `运行时间 124 ms 内存消耗 43 MB`。

```js
// 采用数组的方式替代
var lengthOfLongestSubstring = function (s) {
  if (s == '') {
    return 0;
  }
  const len = s.length;
  let str = s[0];
  let max = 1;
  for (let i = 0; i < len; i++) {
    const currentIndex = str.indexOf(s[i]);
    if (currentIndex != -1) {
      str = str.slice(currentIndex + 1);
    }
    str += s[i];
    max = Math.max(max, str.length);
  }
```

### python3

> `运行时间 64 ms 内存消耗 15.1 MB`。

```python
def lengthOfLongestSubstring(self, s: str) -> int:
    k, res, c_dict = -1, 0, {}
    for i, c in enumerate(s):
        if c in c_dict and c_dict[c] > k:  # 字符c在字典中 且 上次出现的下标大于当前长度的起始下标
            k = c_dict[c]
            c_dict[c] = i
        else:
            c_dict[c] = i
            res = max(res, i-k)
    return res
```
