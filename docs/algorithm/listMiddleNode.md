---
title: 链表的中间结点
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 876：链表的中间结点

- 2022.01.25

[链表的中间结点](https://leetcode-cn.com/problems/middle-of-the-linked-list/)给定一个头结点为 head 的非空单链表，返回链表的中间结点。如果有两个中间结点，则返回第二个中间结点。

- 示例 1：

  ```
  输入：[1,2,3,4,5]
  输出：此列表中的结点 3 (序列化形式：[3,4,5])
  返回的结点值为 3 。 (测评系统对该结点序列化表述是 [3,4,5])。
  注意，我们返回了一个 ListNode 类型的对象 ans，这样：
  ans.val = 3, ans.next.val = 4, ans.next.next.val = 5, 以及 ans.next.next.next = NULL.
  ```

- 示例 2：

  ```
  输入：[1,2,3,4,5,6]
  输出：此列表中的结点 4 (序列化形式：[4,5,6])
  由于该列表有两个中间结点，值分别为 3 和 4，我们返回第二个结点。
  ```

- 提示：
  - 给定链表的结点数介于 1 和 100 之间。

## 快慢指针法

### javascript

> `运行时间 68 ms 内存消耗 41.1 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  slow 一次走一步，fast 一次走两步。那么当 fast 到达链表的末尾时，slow 必然位于中间。
 *  时间复杂度：O(n)，其中 n 指的是链表的节点数。
 *  空间复杂度：O(1)，只需要常数空间存放 slow 和 fast 两个指针。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
const middleNode = (head) => {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
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
    def middleNode(self, head: ListNode) -> ListNode:
        slow = head
        fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow
```

## 使用一维数组

链表的缺点在于不能通过下标访问对应的元素。因此我们可以考虑对链表进行遍历，同时将遍历到的元素依次放入数组 A 中。如果我们遍历到了 N 个元素，那么链表以及数组的长度也为 N，对应的中间节点即为 A[N/2]。

### javascript

> `运行时间 56 ms 内存消耗 41.1 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  时间复杂度：O(n)，其中 n 指的是链表的节点数。
 *  空间复杂度：O(n)，数组 arr 使用的空间。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
const middleNode = (head) => {
  let arr = [head];
  while (arr[arr.length - 1].next !== null) {
    arr.push(arr[arr.length - 1].next);
  }
  return arr[Math.trunc(arr.length / 2)];
};
```

## 单指针法

我们可以对方法一进行空间优化，省去数组 arr。

我们可以对链表进行两次遍历。第一次遍历时，我们统计链表中的元素个数 N；第二次遍历时，我们遍历到第 N/2 个元素（链表的首节点为第 0 个元素）时，将该元素返回即可。

### javascript

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  时间复杂度：O(n)，其中 n 指的是链表的节点数。
 *  空间复杂度：O(1)，只需要常数空间存放变量和指针。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
const middleNode = (head) => {
  let n = 0,
    cur = head;
  while (cur != null) {
    ++n;
    cur = cur.next;
  }
  let k = 0;
  cur = head;
  while (k < Math.trunc(n / 2)) {
    ++k;
    cur = cur.next;
  }
  return cur;
};
```
