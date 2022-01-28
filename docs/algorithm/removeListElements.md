---
title: 移除链表元素
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 206：反转链表

- 2022.01.25

[移除链表元素](https://leetcode-cn.com/problems/remove-linked-list-elements/)给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回新的头节点 。

- 示例 1：

  ![移除链表元素](https://assets.leetcode.com/uploads/2021/03/06/removelinked-list.jpg)

  ```
  输入：head = [1,2,6,3,4,5,6], val = 6
  输出：[1,2,3,4,5]
  ```

- 示例 2：

  ```
  输入：head = [], val = 1
  输出：[]
  ```

- 示例 3：

  ```
  输入：head = [7,7,7,7], val = 7
  输出：[]
  ```

- 提示：
  - 列表中的节点数目在范围 [0, 104] 内
  - 1 <= Node.val <= 50
  - 0 <= val <= 50

## 递归

链表的定义具有递归的性质，因此链表题目常可以用`递归`的方法求解。这道题要求删除链表中所有节点值等于特定值的节点，可以用递归实现。

对于给定的链表，首先对除了头节点 `head` 以外的节点进行删除操作，然后判断 `head` 的节点值是否等于给定的 `val`。

如果 `head` 的节点值等于 `val`，则 `head` 需要被删除，因此删除操作后的头节点为 `head.next`；

如果 `head` 的节点值不等于 `val`，则 `head` 保留，因此删除操作后的头节点还是 `head`。

上述过程是一个递归的过程。

### javascript

> `运行时间 80 ms 内存消耗 42.9 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  如上描述
 *  时间复杂度：O(n)，其中 n 是链表的长度。递归过程中需要遍历链表一次。
 *  空间复杂度：O(n)，其中 n 是链表的长度。空间复杂度主要取决于递归调用栈，最多不会超过 n 层。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
var removeElements = function (head, val) {
  if (head === null) {
    return head;
  }
  head.next = removeElements(head.next, val);
  // 只需要考虑当前节点是否等于val值，如果当前节点等于val值，则返回当前节点的下一个节点，否则返回当前节点
  return head.val === val ? head.next : head;
};
```

## 迭代

我们也可以用迭代的方法删除链表中所有节点值等于特定值的节点。

用 `curr` 表示当前节点。如果 `curr` 的下一个节点不为空且下一个节点的节点值等于给定的 `val`，则需要删除下一个节点。

删除下一个节点可以通过以下做法实现：

```
curr.next = curr.next.next;
```

如果 `curr` 的下一个节点的节点值不等于给定的 `val`，则保留下一个节点，将 `curr` 移动到下一个节点即可。

当 `curr` 的下一个节点为空时，链表遍历结束，此时所有节点值等于 `val` 的节点都被删除。

具体实现方面，由于链表的头节点 `head` 有可能需要被删除，因此创建哑节点 `dummyHead`，令 `dummyHead.next = head`，初始化 `curr = dummyHead`，然后遍历链表进行删除操作。最终返回 `dummyHead.next` 即为删除操作后的头节点。

### javascript

> `运行时间 80 ms 内存消耗 42.4 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  时间复杂度：O(n)，其中 n 是链表的长度。递归过程中需要遍历链表一次。
 *  空间复杂度：O(1)
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
var removeElements = function (head, val) {
  let dummyHead = new ListNode();
  dummyHead.next = head;
  let curr = dummyHead;
  while (curr.next) {
    if (curr.next.val === val) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }

  return dummyHead.next;
};
```

### python3

```python
class Solution:
    def removeElements(self, head: ListNode, val: int) -> ListNode:

        dummy = ListNode(0,head)
        dummy.next = head
        curr = dummy

        while curr.next:
            if curr.next.val == val:
                curr.next = curr.next.next
            else:
                curr = curr.next

        return dummy.next
```
