---
title: 合并两个有序链表
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 21： 合并两个有序链表

- 2022.01.25

[合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)将两个升序链表合并为一个新的 `升序` 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

- 示例 1：

  ![示例1](https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg)

  ```js
  输入：l1 = [1,2,4], l2 = [1,3,4]
  输出：[1,1,2,3,4,4]
  ```

- 示例 2：

  ```js
  输入：l1 = [], l2 = []
  输出：[]
  ```

- 示例 3：

  ```js
  输入：l1 = [], l2 = [0]
  输出：[0]
  ```

- 提示：
  - 两个链表的节点数目范围是 [0, 50]
  - -100 <= Node.val <= 100
  - l1 和 l2 均按 非递减顺序 排列

## 递归

### javascript

> `运行时间 64 ms 内存消耗 43.4 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  这道题可以使用递归实现，新链表也不需要构造新节点，我们下面列举递归三个要素
 *  终止条件：两条链表分别名为 l1 和 l2，当 l1 为空或 l2 为空时结束
 *  返回值：每一层调用都返回排序好的链表头
 *  本级递归内容：如果 l1 的 val 值更小，则将 l1.next 与排序好的链表头相接，l2 同理
 *  O(m+n)，m 为 l1的长度，n 为 l2 的长度
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} l1
 *  @param {ListNode} l2
 *  @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) {
    return l2;
  }
  if (l2 === null) {
    return l1;
  }
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};
```

### python3

```python
class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        if l1 is None:
            return l2
        elif l2 is None:
            return l1
        elif l1.val < l2.val:
            l1.next = self.mergeTwoLists(l1.next, l2)
            return l1
        else:
            l2.next = self.mergeTwoLists(l1, l2.next)
            return l2
```
