---
title: 合并K个升序链表
nav:
  title: 编程题
  path: /writing
group:
  title: 困难
  path: /writing/project/difficult
  order: 3
---

# LeetCode23：合并 K 个升序链表

- 2022.02.08

[合并 K 个升序链表](https://leetcode-cn.com/problems/merge-k-sorted-lists/)给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。

- 示例 1：

  ```
  输入：lists = [[1,4,5],[1,3,4],[2,6]]
  输出：[1,1,2,3,4,4,5,6]
  解释：链表数组如下：
  [
  1->4->5,
  1->3->4,
  2->6
  ]
  将它们合并到一个有序链表中得到。
  1->1->2->3->4->4->5->6
  ```

- 示例 2：

  ```
  输入：lists = []
  输出：[]
  ```

- 示例 3：

  ```
  输入：lists = [[]]
  输出：[]
  ```

- 提示：
  - k == lists.length
  - 0 <= k <= 10^4
  - 0 <= lists[i].length <= 500
  - -10^4 <= lists[i][j] <= 10^4
  - lists[i] 按 升序 排列
  - lists[i].length 的总和不超过 10^4

## 哈希表

利用哈希表先将相同 val 的节点连起来，再对连接后的链表排序，从小到大将不同 val 链表连起来，返回最小 val 链表的头结点即可。

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
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
  let map = new Map();
  // 先将所有的链表元素构造到一个Map中
  lists.forEach((head) => {
    while (head) {
      if (map.has(head.val)) {
        let temp = map.get(head.val);
        // temp里面存着的是一个链表的节点()
        temp[1].next = head;
        temp[1] = temp[1].next;
        head = head.next;
      } else {
        map.set(head.val, [head, head]);
        head = head.next;
      }
    }
  });
  let newLists = [...map];
  if (!newLists.length) return null;
  newLists.sort((a, b) => a[0] - b[0]);
  newLists.reduce((a, b) => {
    a[1][1].next = b[1][0];
    return b;
  });
  return newLists[0][1][0];
};

// 或者是如下的代码
var mergeKLists = function (lists) {
  const list = [];
  for (let i = 0; i < lists.length; i++) {
    let node = lists[i];
    while (node) {
      list.push(node.val);
      node = node.next;
    }
  }
  list.sort((a, b) => a - b);
  const res = new ListNode();
  let now = res;
  for (let i = 0; i < list.length; i++) {
    now.next = new ListNode(list[i]);
    now = now.next;
  }

  return res.next;
};
```

## 优先级队列

> 时间复杂度：O(n\*log(k))，n 是所有链表中元素的总和，k 是链表个数。

### python3

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeKLists(self, lists: List[ListNode]) -> ListNode:
        import heapq
        dummy = ListNode(0)
        p = dummy
        head = []
        for i in range(len(lists)):
            if lists[i] :
                heapq.heappush(head, (lists[i].val, i))
                lists[i] = lists[i].next
        while head:
            val, idx = heapq.heappop(head)
            p.next = ListNode(val)
            p = p.next
            if lists[idx]:
                heapq.heappush(head, (lists[idx].val, idx))
                lists[idx] = lists[idx].next
        return dummy.next
```

## 分治

- 输入的 k 个排序链表，可以分成两部分，前 k/2 个链表和后 k/2 个链表
- 如果将这前 k/2 个链表和后 k/2 个链表分别合并成两个排序的链表，再将两个排序的链表合并，那么所有链表都合并了
- 下面代码中递归调用栈的深度为 O(logn)，所以空间复杂度为 O(logn)
- 因为使用的是归并排序的思路，所以它的时间复杂度为 O(nlogn)

### javascript

```js
// 自顶而下归并 先分在合
var mergeKLists = function (lists) {
  // 当是空数据的时候
  if (!lists.length) return null;

  // 合并两个排序链表
  const merge = (head1, head2) => {
    let dummy = new ListNode(0);
    let cur = dummy;
    while (head1 && head2) {
      if (head1.val < head2.val) {
        cur.next = head1;
        head1 = head1.next;
      } else {
        cur.next = head2;
        head2 = head2.next;
      }
      cur = cur.next;
    }

    // 如果后面还有的剩余的话就把剩余的接上
    cur.next = head1 == null ? head2 : head1;

    return dummy.next;
  };

  const mergeLists = (lists, start, end) => {
    // 如果仅有一个节点
    if (start + 1 == end) {
      return lists[start];
    }
    // 输入的K个排序链表，可以分为2部分，前k/2个链表和后k/2个链表
    // 如果将这前k/2个链表和后k/2个链表分别合并成2个排序的链表
    // 再将两个排序的链表合并，那么所有链表都合并了
    // 有序链表中
    let mid = (start + end) >> 1;
    let head1 = mergeLists(lists, start, mid);
    let head2 = mergeLists(lists, mid, end);
    return merge(head1, head2);
  };
  return mergeLists(lists, 0, lists.length);
};

// 自底而上合并
var mergeKLists = function (lists) {
  if (lists.length <= 1) return lists[0] || null;
  const newLists = [];
  // 自底而上归并，第一次归并大小为2的链表，第二次归并大小4的链表...
  for (let i = 0; i < lists.length; i += 2) {
    newLists.push(merge(lists[i], lists[i + 1] || null));
  }

  return mergeKLists(newLists);
};

const merge = (list1, list2) => {
  const dummy = new ListNode(0);
  let cur = dummy;

  while (list1 && list2) {
    if (list1.val < list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }

  // 如果后面还有的剩余的话就把剩余的接上
  cur.next = list1 == null ? list2 : list1;

  return dummy.next;
};
```

### python3

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeKLists(self, lists: List[ListNode]) -> ListNode:
        if not lists:return
        n = len(lists)
        return self.merge(lists, 0, n-1)

    def merge(self,lists, left, right):
        if left == right:
            return lists[left]
        mid = left + (right - left) // 2
        l1 = self.merge(lists, left, mid)
        l2 = self.merge(lists, mid+1, right)
        return self.mergeTwoLists(l1, l2)

    def mergeTwoLists(self,l1, l2):
        if not l1:return l2
        if not l2:return l1
        if l1.val < l2.val:
            l1.next = self.mergeTwoLists(l1.next, l2)
            return l1
        else:
            l2.next = self.mergeTwoLists(l1, l2.next)
            return l2
```
