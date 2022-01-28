---
title: 反转链表
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

[反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

- 示例 1：

  ![反转链表2](https://assets.leetcode.com/uploads/2021/02/19/rev1ex1.jpg)

  ```
  输入：head = [1,2,3,4,5]
  输出：[5,4,3,2,1]
  ```

- 示例 2：

  ![反转链表2](https://assets.leetcode.com/uploads/2021/02/19/rev1ex2.jpg)

  ```
  输入：head = [1,2]
  输出：[2,1]
  ```

- 示例 3：

  ```
  输入：head = []
  输出：[]
  ```

- 提示：
  - 链表中节点的数目范围是 [0, 5000]
  - -5000 <= Node.val <= 5000

**进阶：链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？**

## 迭代

### javascript

> `运行时间 52 ms 内存消耗 42.8 MB`。

```js
/**  ----------------------------------------------------------------
 *  迭代解题思路:
 *  假设链表为 1-->2-->3，我们想将其改成 3-->2-->1
 *  在遍历链表时，将当前节点的 next 指针改为指向前一个节点。
 *  由于节点没有引用其前一个节点，因此必须事先存储其前一个节点。
 *  在更改引用之前，还需要存储后一个节点。最后返回新的头引用。
 *  时间复杂度：O(n)，其中 n 是链表的长度。需要遍历链表一次。
 *  空间复杂度：O(1)。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
var reverseList = function (head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};
```

## 递归

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  以链表1->2->3->4->5举例:
 *  若从节点4到节点5已经被反转1->2->3<-4<-5，我们正处于节点3，我们希望节点4的下一个节点指向节点3
 *  所以 n3.next.next = n3
 *  时间复杂度：O(n)，其中 n 是链表的长度。需要对链表的每个节点进行反转操作。
 *  空间复杂度：O(n)，其中 n 是链表的长度。空间复杂度主要取决于递归调用的栈空间，最多为 n 层。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */

var reverseList = function (head) {
  if (head == null || head.next == null) {
    return head;
  }
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
};
```
