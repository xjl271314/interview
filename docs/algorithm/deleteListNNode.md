---
title: 删除链表的倒数第 N 个结点
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode19：删除链表的倒数第 N 个结点

- 2022.02.09

[删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

- 示例 1：

  ![示例1](https://assets.leetcode.com/uploads/2020/10/03/remove_ex1.jpg)

  ```
  输入：head = [1,2,3,4,5], n = 2
  输出：[1,2,3,5]
  ```

- 示例 2：

  ```
  输入：head = [1], n = 1
  输出：[]
  ```

- 示例 3：

  ```
  输入：head = [1,2], n = 1
  输出：[1]
  ```

- 提示：

  - 链表中结点的数目为 sz
  - 1 <= sz <= 30
  - 0 <= Node.val <= 100
  - 1 <= n <= sz

题解

在对链表进行操作时，一种常用的技巧是添加一个`哑节点（dummy node）`，它的 `next` 指针指向链表的头节点。这样一来，我们就不需要对头节点进行特殊的判断了。

例如，在本题中，如果我们要删除节点 y，我们需要知道节点 y 的前驱节点 x，并将 x 的指针指向 y 的后继节点。但由于头节点不存在前驱节点，因此我们需要在删除头节点时进行特殊判断。但如果我们添加了哑节点，那么头节点的前驱节点就是哑节点本身，此时我们就只需要考虑通用的情况即可。

## 计算链表长度

一种容易想到的方法是，我们首先从头节点开始对链表进行一次遍历，得到链表的长度 L。随后我们再从头节点开始对链表进行一次遍历，当遍历到第 `L-n+1`个节点时，它就是我们需要删除的节点。

为了与题目中的 n 保持一致，节点的编号从 1 开始，头节点为编号 1 的节点。

为了方便删除操作，我们可以从哑节点开始遍历 `L-n+1` 个节点。当遍历到第 `L-n+1` 个节点时，它的下一个节点就是我们需要删除的节点，这样我们只需要修改一次指针，就能完成删除操作。

![说明](https://assets.leetcode-cn.com/solution-static/19/p1.png)

### javascript

> `运行时间 64 ms 内存消耗 41.6 MB`。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 * 时间复杂度：O(L)，其中 L 是链表的长度。
 * 空间复杂度：O(1)。
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  const getLength = () => {
    let length = 0;
    while (head) {
      length += 1;
      head = head.next;
    }

    return length;
  };

  // 构造虚拟头节点
  let dummy = new ListNode(0, head);
  let cur = dummy;
  const length = getLength();
  // 从头节点开始到要删除的节点前都是指向下一个节点
  for (let i = 1; i < length - n + 1; i++) {
    cur = cur.next;
  }
  // 后面的节点指向后一个节点即可
  cur.next = cur.next.next;

  return dummy.next;
};
```

### python3

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        def getLength(head: ListNode) -> int:
            length = 0
            while head:
                length += 1
                head = head.next
            return length

        dummy = ListNode(0, head)
        length = getLength(head)
        cur = dummy
        for i in range(1, length - n + 1):
            cur = cur.next
        cur.next = cur.next.next

        return dummy.next
```

## 双指针

我们也可以在不预处理出链表的长度，以及使用常数空间的前提下解决本题。

由于我们需要找到倒数第 `n` 个节点，因此我们可以使用两个指针 `first` 和 `second` 同时对链表进行遍历，并且 `first` 比 `second` 超前 `n` 个节点。当 `first` 遍历到链表的末尾时，`second` 就恰好处于倒数第 `n` 个节点。

具体地，初始时 `first` 和 `second` 均指向头节点。我们首先使用 `first` 对链表进行遍历，遍历的次数为 `n`。此时，`first` 和 `second` 之间间隔了 `n-1` 个节点，即 `first` 比 `second` 超前了 `n` 个节点。

在这之后，我们同时使用 `first` 和 `second` 对链表进行遍历。当 `first` 遍历到链表的末尾（即 `first` 为空指针）时，`second` 恰好指向倒数第 `n` 个节点。

### javascript

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  let dummy = new ListNode(0, head);
  let first = head,
    second = dummy;
  for (let i = 0; i < n; i++) {
    first = first.next;
  }
  while (first) {
    first = first.next;
    second = second.next;
  }

  second.next = second.next.next;

  return dummy.next;
};
```
