---
title: 两数相加
nav:
  title: 算法
  path: /write
  order: 0
group:
  title: 算法相关试题
  path: /write/project
---

# LeetCode:两数相加(难度:中等)

- 2021.06.02

给你两个`非空`的`链表`，表示两个非负的整数。它们每位数字都是按照`逆序`的方式存储的，并且每个节点只能存储`一位`数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以`0`开头。

- 示例 1：

![示例1](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/01/02/addtwonumber1.jpg)

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

- 示例 2：

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

- 示例 3：

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

提示：

```
1. 每个链表中的节点数在范围 [1, 100] 内
2. 0 <= Node.val <= 9
3. 题目数据保证列表表示的数字不含前导零
```

## 解法一: 补全较短的数组，两数相加考虑进位

### javascript

> `运行时间 152 ms 内存消耗 42.8 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  由于两个数组的长度可能是不一样长的，因此我们可以把较短的末尾补0使其两个数组长度一致。
 *  然后对任意数组进行遍历，从末尾开始两两相加，需要考虑进位。
 *  时间复杂度：O(n^2)。
 *  ----------------------------------------------------------------
 *  @param {ListNode} l1
 *  @param {ListNode} l2
 *  @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let head = null,
    tail = null;
  let carry = 0;

  while (l1 || l2) {
    const n1 = l1 ? l1.val : 0;
    const n2 = l2 ? l2.val : 0;
    const sum = n1 + n2 + carry;
    if (!head) {
      head = tail = new ListNode(sum % 10);
    } else {
      tail.next = new ListNode(sum % 10);
      tail = tail.next;
    }
    carry = Math.floor(sum / 10);
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }
  if (carry > 0) {
    tail.next = new ListNode(carry);
  }
  return head;
};
```

### golang

> `运行时间 16 ms 内存消耗 4.4 MB`。

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	h := l1
	z := 0
	x := h
	for !(l1 == nil && l2 == nil) {
		a := 0
		b := 0
		if l1 != nil {
			a = l1.Val
		}
		if l2 != nil {
			b = l2.Val
		}
		x.Val = (a + b + z) % 10
		z = (a + b + z) / 10
		if (l2 == nil || l1 == nil) && z == 0 {
			break
		}
		if x.Next == nil && l2 != nil {
			l1 = nil
			x.Next = l2.Next
		}
		if x.Next == nil && z != 0 {
			x.Next = &ListNode{Val: z}
			break
		}
		if l1 != nil {
			l1 = l1.Next
		}
		if l2 != nil {
			l2 = l2.Next
		}
		x = x.Next
	}
	return h
}
```
