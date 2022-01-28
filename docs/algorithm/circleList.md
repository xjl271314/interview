---
title: 回文链表
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 234： 回文链表

- 2022.01.26

[回文链表](https://leetcode-cn.com/problems/palindrome-linked-list/)给你一个单链表的头节点 `head` ，请你判断该链表是否为`回文链表`。如果是，返回 `true` ；否则，返回 `false` 。

- 示例 1：

  ![示例1](https://assets.leetcode.com/uploads/2021/03/03/pal1linked-list.jpg)

  ```
  输入：head = [1,2,2,1]
  输出：true
  ```

- 示例 2：

  ![示例2](https://assets.leetcode.com/uploads/2021/03/03/pal2linked-list.jpg)

  ```
  输入：head = [1,2]
  输出：false
  ```

- 提示：
  - 链表中节点数目在范围[1, 105] 内
  - 0 <= Node.val <= 9

**进阶：你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？**

## 双指针法

有两种常用的列表实现，分别为`数组列表`和`链表`。如果我们想在列表中存储值，它们是如何实现的呢？

- 数组列表底层是使用数组存储值，我们可以通过索引在 O(1) 的时间访问列表任何位置的值，这是由基于`内存寻址`的方式。

- 链表存储的是称为节点的对象，每个节点保存一个值和指向下一个节点的指针。访问某个特定索引的节点需要 O(n)的时间，因为要通过指针获取到下一个位置的节点。

1. 确定数组列表是否回文很简单，我们可以使用`双指针法`来比较两端的元素，并向中间移动。

   一个指针从起点向中间移动，另一个指针从终点向中间移动。

   这需要 O(n)的时间，因为访问每个元素的时间是 O(1)，而有 n 个元素要访问。

2. 然而同样的方法在链表上操作并不简单，因为不论是正向访问还是反向访问都不是 O(1)。

   而将链表的值复制到数组列表中是 O(n)，因此最简单的方法就是将链表的值复制到数组列表中，再使用双指针法判断。

算法:

一共为两个步骤：

1. 复制链表值到数组列表中。
2. 使用双指针法判断是否为回文。

第一步，我们需要遍历链表将值复制到数组列表中。我们用 `currentNode` 指向当前节点。每次迭代向数组添加 `currentNode.val`，并更新 `currentNode = currentNode.next`，当 `currentNode = null` 时停止循环。

执行第二步的最佳方法取决于你使用的语言。

在 Python 中，很容易构造一个列表的反向副本，也很容易比较两个列表。而在其他语言中，就没有那么简单。

因此最好使用`双指针法`来检查是否为回文。

我们在起点放置一个指针，在结尾放置一个指针，每一次迭代判断两个指针指向的元素是否相同，若不同，返回 `false`；相同则将两个指针向内移动，并继续判断，直到两个指针相遇。

在编码的过程中，注意我们比较的是节点值的大小，而不是节点本身。正确的比较方式是：`node_1.val == node_2.val`，而 `node_1 == node_2` 是错误的。

### javascript

> `运行时间 160 ms 内存消耗 64 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  如上描述
 *  时间复杂度：O(n)，其中 n 指的是链表的元素个数。
 *     第一步： 遍历链表并将值复制到数组中，O(n)。
 *     第二步：双指针判断是否为回文，执行了 O(n/2) 次的判断，即 O(n)。
 *     总的时间复杂度：O(2n) = O(n)。
 *  空间复杂度：O(n)，其中 n 指的是链表的元素个数，我们使用了一个数组列表存放链表的元素值。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
const isPalindrome = (head) => {
    const arr = [];
    while (head !== null) {
        arr.push(head.val);
        head = head.next;
    }
    for (let i = 0; j = arr.length - 1; i < j; ++i, --j) {
        if (arr[i] !== arr[j]) {
            return false;
        }
    }

    return true;
}
```

### python3

```python
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        arr = []
        current_node = head
        while current_node is not None:
            arr.append(current_node.val)
            current_node = current_node.next
        return arr == arr[::-1]
```

## 快慢指针

整个流程可以分为以下五个步骤：

1. 找到前半部分链表的尾节点。
2. 反转后半部分链表。
3. 判断是否回文。
4. 恢复链表。
5. 返回结果。

执行步骤一，我们可以计算链表节点的数量，然后遍历链表找到前半部分的尾节点。

我们也可以使用快慢指针在一次遍历中找到：慢指针一次走一步，快指针一次走两步，快慢指针同时出发。当快指针移动到链表的末尾时，慢指针恰好到链表的中间。通过慢指针将链表分为两部分。

若链表有奇数个节点，则中间的节点应该看作是前半部分。

步骤二可以使用「206. 反转链表」问题中的解决方法来反转链表的后半部分。

步骤三比较两个部分的值，当后半部分到达末尾则比较完成，可以忽略计数情况中的中间节点。

步骤四与步骤二使用的函数相同，再反转一次恢复链表本身。

### javascript

> `运行时间 168 ms 内存消耗 64.4 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  避免使用 O(n) 额外空间的方法就是改变输入。
 *  我们可以将链表的后半部分反转（修改链表结构），然后将前半部分和后半部分进行比较。
 *  比较完成后我们应该将链表恢复原样。
 *  虽然不需要恢复也能通过测试用例，但是使用该函数的人通常不希望链表结构被更改。
 *  该方法虽然可以将空间复杂度降到 O(1)，但是在并发环境下，该方法也有缺点。
 *  在并发环境下，函数运行时需要锁定其他线程或进程对链表的访问，因为在函数执行过程中链表会被修改。
 *  时间复杂度：O(n)，其中 n 指的是链表的大小。
 *  空间复杂度：O(1)，我们只会修改原本链表中节点的指向，而在堆栈上的堆栈帧不超过 O(1)。
 *  ----------------------------------------------------------------
 *  Definition for singly-linked list.
 *  function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 *  }
 *  @param {ListNode} head
 *  @return {ListNode}
 */
const reverseList = function (head) {
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

// 使用快慢指针查找中间节点
const endOfFirstHalf = (head) => {
  let fast = head;
  let slow = head;
  while (fast.next !== null && fast.next.next !== null) {
    fast = fast.next.next;
    slow = slow.next;
  }

  return slow;
};

const isPalindrome = (head) => {
  if (head === null) return true;

  // 找到前半部分链表的尾节点并反转后半部分链表
  const firstHalfEnd = endOfFirstHalf(head);
  const secondHalfStart = reverseList(firstHalfEnd.next);

  // 判断是否回文
  let p1 = head;
  let p2 = secondHalfStart;
  let result = true;
  while (result && p2 !== null) {
    if (p1.val !== p2.val) result = false;
    p1 = p1.next;
    p2 = p2.next;
  }

  // 还原链表并返回结果
  firstHalfEnd.next = reverseList(secondHalfStart);

  return result;
};
```

### python3

```python
class Solution:

    def isPalindrome(self, head: ListNode) -> bool:
        if head is None:
            return True

        # 找到前半部分链表的尾节点并反转后半部分链表
        first_half_end = self.end_of_first_half(head)
        second_half_start = self.reverse_list(first_half_end.next)

        # 判断是否回文
        result = True
        first_position = head
        second_position = second_half_start
        while result and second_position is not None:
            if first_position.val != second_position.val:
                result = False
            first_position = first_position.next
            second_position = second_position.next

        # 还原链表并返回结果
        first_half_end.next = self.reverse_list(second_half_start)
        return result

    def end_of_first_half(self, head):
        fast = head
        slow = head
        while fast.next is not None and fast.next.next is not None:
            fast = fast.next.next
            slow = slow.next
        return slow

    def reverse_list(self, head):
        previous = None
        current = head
        while current is not None:
            next_node = current.next
            current.next = previous
            previous = current
            current = next_node
        return previous
```
