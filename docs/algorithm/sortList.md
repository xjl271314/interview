---
title: 排序链表
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode148：排序链表

- 2022.01.27

[排序链表](https://leetcode-cn.com/problems/sort-list/)给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。

- 示例 1：

  ![示例1](https://assets.leetcode.com/uploads/2020/09/14/sort_list_1.jpg)

  ```
  输入：head = [4,2,1,3]
  输出：[1,2,3,4]
  ```

- 示例 2：

  ![示例2](https://assets.leetcode.com/uploads/2020/09/14/sort_list_2.jpg)

  ```
  输入：head = [-1,5,3,4,0]
  输出：[-1,0,3,4,5]
  ```

- 示例 3：

  ```
  输入：head = []
  输出：[]
  ```

- 提示：
  - 链表中节点的数目在范围 [0, 5 * 10^4] 内
  - -10^5 <= Node.val <= 10^5

进阶：你可以在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序吗？

## 归并排序(自顶向下)

题目的进阶问题要求达到 `O(nlogn)` 的时间复杂度和 `O(1)` 的空间复杂度，时间复杂度是 `O(nlogn)` 的排序算法包括`归并排序`、`堆排序`和`快速排序`（快速排序的最差时间复杂度是 `O(n^2)`，其中最适合链表的排序算法是`归并排序`。

归并排序基于分治算法。最容易想到的实现方式是`自顶向下的递归实现`，考虑到递归调用的栈空间，自顶向下归并排序的空间复杂度是 `O(logn)`。如果要达到 `O(1)`的空间复杂度，则需要使用`自底向上`的实现方式。

- 对数组做归并排序的空间复杂度为 `O(n)`，分别由新开辟数组`O(n)`和递归函数调用`O(logn)`组成，而根据链表特性：

  - 数组额外空间：链表可以通过修改引用来更改节点顺序，无需像数组一样开辟额外空间；
  - 递归额外空间：递归调用函数将带来 O(logn)的空间复杂度，因此若希望达到 O(1)空间复杂度，则不能使用递归。

- 分割 cut 环节： 找到当前链表中点，并从中点将链表断开（以便在下次递归 cut 时，链表片段拥有正确边界）；

  - 我们使用 fast,slow 快慢双指针法，奇数个节点找到中点，偶数个节点找到中心左边的节点。
  - 找到中点 slow 后，执行 slow.next = None 将链表切断。
  - 递归分割时，输入当前链表左端点 head 和中心节点 slow 的下一个节点 tmp(因为链表是从 slow 切断的)。
  - cut 递归终止条件： 当 head.next == None 时，说明只有一个节点了，直接返回此节点。

- 合并 merge 环节： 将两个排序链表合并，转化为一个排序链表。
  - 双指针法合并，建立辅助 ListNode h 作为头部。
  - 设置两指针 left, right 分别指向两链表头部，比较两指针处节点值大小，由小到大加入合并链表头部，指针交替前进，直至添加完两个链表。
  - 返回辅助 ListNode h 作为头部的下个节点 h.next。
  - 时间复杂度 O(l + r)，l, r 分别代表两个链表长度。

![分析流程](https://pic.leetcode-cn.com/c1d5347aa56648afdec22372ee0ed13cf4c25347bd2bb9727b09327ce04360c2-Picture1.png)

对链表自顶向下归并排序的过程如下。

1. 找到链表的中点，以中点为分界，将链表拆分成两个子链表。寻找链表的中点可以使用快慢指针的做法，快指针每次移动 2 步，慢指针每次移动 1 步，当快指针到达链表末尾时，慢指针指向的链表节点即为链表的中点。
2. 对两个子链表分别排序。
3. 将两个排序后的子链表合并，得到完整的排序后的链表。可以使用「21. 合并两个有序链表」的做法，将两个有序的子链表进行合并。

上述过程可以通过递归实现。递归的终止条件是链表的节点个数小于或等于 1，即当链表为空或者链表只包含 1 个节点时，不需要对链表进行拆分和排序。

### javascript

> `运行时间 112 ms 内存消耗 55.8 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  时间复杂度：时间复杂度：O(nlogn)，其中 n 是链表的长度。
 *  空间复杂度：O(logn)，其中 n 是链表的长度。空间复杂度主要取决于递归调用的栈空间。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
const merge = (head1, head2) => {
  const dummyHead = new ListNode(0); // 创建一个虚拟节点
  let temp = dummyHead,
    temp1 = head1,
    temp2 = head2;
  while (temp1 != null && temp2 != null) {
    if (temp1.val <= temp2.val) {
      temp.next = temp1;
      temp1 = temp1.next;
    } else {
      temp.next = temp2;
      temp2 = temp2.next;
    }
    temp = temp.next;
  }

  if (temp1 != null) {
    temp.next = temp1;
  } else if (temp2 != null) {
    temp.next = temp2;
  }

  return dummyHead.next;
};

const toSortList = (head, tail) => {
  if (head === null) {
    return head;
  }
  if (head.next === tail) {
    head.next = null;

    return head;
  }

  let slow = head,
    fast = head;
  while (fast !== tail) {
    slow = slow.next;
    fast = fast.next;
    if (fast !== tail) {
      fast = fast.next;
    }
  }

  const mid = slow;
  return merge(toSortList(head, mid), toSortList(mid, tail));
};

const sortList = (head) => {
  return toSortList(head, null);
};
```

## 归并排序(自底向上)

使用自底向上的方法实现归并排序，则可以达到 O(1) 的空间复杂度。

首先求得链表的长度 `length`，然后将链表拆分成子链表进行合并。

具体做法如下。

1. 用 `subLength` 表示每次需要排序的子链表的长度，初始时 `subLength=1`。
2. 每次将链表拆分成若干个长度为 `subLength` 的子链表（最后一个子链表的长度可以小于 `subLength`），按照每两个子链表一组进行合并，合并后即可得到若干个长度为 `subLength×2` 的有序子链表（最后一个子链表的长度可以小于 `subLength×2`）。合并两个子链表仍然使用「21. 合并两个有序链表」的做法。
3. 将 `subLength` 的值加倍，重复第 2 步，对更长的有序子链表进行合并操作，直到有序子链表的长度大于或等于 `length`，整个链表排序完毕。

如何保证每次合并之后得到的子链表都是有序的呢？可以通过数学归纳法证明。

1. 初始时 `subLength=1`，每个长度为 `1` 的子链表都是有序的。
2. 如果每个长度为 `subLength` 的子链表已经有序，合并两个长度为 `subLength` 的有序子链表，得到长度为 `subLength×2` 的子链表，一定也是有序的。
3. 当最后一个子链表的长度小于 `subLength` 时，该子链表也是有序的，合并两个有序子链表之后得到的子链表一定也是有序的。

因此可以保证最后得到的链表是有序的。

![分析流程](https://pic.leetcode-cn.com/8c47e58b6247676f3ef14e617a4686bc258cc573e36fcf67c1b0712fa7ed1699-Picture2.png)

### javascript

> `运行时间 116 ms 内存消耗 55.8 MB`。

```js
const merge = (head1, head2) => {
  let dummyHead = new ListNode(0);
  let temp = dummyHead,
    temp1 = head1,
    temp2 = head2;
  while (temp1 !== null && temp2 !== null) {
    if (temp1.val <= temp2.val) {
      temp.next = temp1;
      temp1 = temp1.next;
    } else {
      temp.next = temp2;
      temp2 = temp2.next;
    }
    temp = temp.next;
  }
  if (temp1 !== null) {
    temp.next = temp1;
  } else if (temp2 !== null) {
    temp.next = temp2;
  }

  return dummyHead.next;
};

const sortList = (head) => {
  if (head === null) {
    return head;
  }
  let length = 0;
  let node = head;

  while (node !== null) {
    length++;
    node = node.next;
  }

  const dummyHead = new ListNode(0, head);
  for (let subLength = 1; subLength < length; subLength <<= 1) {
    let prev = dummyHead,
      curr = dummyHead.next;
    while (curr !== null) {
      let head1 = curr;
      for (let i = 1; i < subLength && curr.next !== null; i++) {
        curr = curr.next;
      }
      let head2 = curr.next;
      curr.next = null;
      curr = head2;
      for (
        let i = 1;
        i < subLength && curr !== null && curr.next !== null;
        i++
      ) {
        curr = curr.next;
      }
      let next = null;
      if (curr !== null) {
        next = curr.next;
        curr.next = null;
      }
      const merged = merge(head1, head2);
      prev.next = merged;
      while (prev.next !== null) {
        prev = prev.next;
      }
      curr = next;
    }
  }
  return dummyHead.next;
};
```
