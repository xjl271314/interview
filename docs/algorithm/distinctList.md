---
title: 删除排序链表中的重复元素
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 83：删除排序链表中的重复元素

- 2022.01.25

[删除排序链表中的重复元素](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/)给定一个已排序的链表的头`head`， 删除所有重复的元素，使每个元素只出现一次 。返回 已排序的链表 。

- 示例 1：

  ![示例1](https://assets.leetcode.com/uploads/2021/01/04/list1.jpg)

  ```
  输入：head = [1,1,2]
  输出：[1,2]
  ```

- 示例 2：

  ![示例2](https://assets.leetcode.com/uploads/2021/01/04/list2.jpg)

  ```
  输入：head = [1,1,2,3,3]
  输出：[1,2,3]
  ```

- 提示：
  - 链表中节点数目在范围 [0, 300] 内
  - -100 <= Node.val <= 100
  - 题目数据保证链表已经按升序 排列

## 一次遍历

由于给定的链表是排好序的，因此重复的元素在链表中出现的位置是连续的，因此我们只需要对链表进行一次遍历，就可以删除重复的元素。

具体地，我们将指针 `cur` 指向链表的头节点，随后开始对链表进行遍历。如果当前 `cur` 与 `cur.next` 对应的元素相同，那么我们就将 `cur.next` 从链表中移除；否则说明链表中已经不存在其它与 `cur` 对应的元素相同的节点，因此可以将 `cur` 指向 `cur.next`。

细节

当我们遍历到链表的最后一个节点时，`cur.next` 为空节点，如果不加以判断，访问 `cur.next` 对应的元素会产生运行错误。因此我们只需要遍历到链表的最后一个节点，而不需要遍历完整个链表。

### javascript

> `运行时间 76 ms 内存消耗 40.1 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
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
const deleteDuplicates = (head) => {
  if (head == null) return head;

  let cur = head;
  while (cur.next) {
    if (cur.val == cur.next.val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }

  return head;
};
```

### python3

> `运行时间 44 ms 内存消耗 15.1 MB`。

```python
class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        if head == None:
            return head

        cur = head
        while cur.next:
            if cur.val == cur.next.val:
                cur.next = cur.next.next
            else:
                cur = cur.next

        return head

```

## 递归

### javascript

```js
const deleteDuplicates = (head) => {
  if (head == null || head.next == null) return head;

  head.next = deleteDuplicates(head.next);

  if (head.val == head.next.val) {
    head.next = head.next.next;
  }

  return head;
};
```

### python3

```python
class Solution:
    def deleteDuplicates(self, head) -> ListNode:
        if not head or not head.next:
            return head

        head.next = self.deleteDuplicates(head.next)

        if head.val == head.next.val:
            head.next = head.next.next

        return head
```
