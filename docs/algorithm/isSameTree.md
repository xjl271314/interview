---
title: 相同的树
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 100：相同的树

- 2022.11.25

[相同的树](https://leetcode.cn/problems/same-tree/)给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。

如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。

- 示例 1：

  ![](https://assets.leetcode.com/uploads/2020/12/20/ex1.jpg)

  ```js
  输入：p = [1,2,3], q = [1,2,3]
  输出：true
  ```

- 示例 2：

  ![](https://assets.leetcode.com/uploads/2020/12/20/ex2.jpg)

  ```js
  输入：p = [1,2], q = [1,null,2]
  输出：false
  ```

- 示例 3：

  ![](https://assets.leetcode.com/uploads/2020/12/20/ex3.jpg)

  ```js
  输入：p = [1,2,1], q = [1,1,2]
  输出：false
  ```

- 提示：
  - 两棵树上的节点数目都在范围 [0, 100] 内
  - $-10^4$ <= Node.val <= $10^4$

## 深度优先遍历

- 终止条件与返回值：
  - 当两棵树的当前节点都为 null 时返回 true
  - 当其中一个为 null 另一个不为 null 时返回 false
  - 当两个都不为空但是值不相等时，返回 false
- 当满足终止条件时进行返回，不满足时分别判断左子树和右子树是否相同，其中要注意代码中的短路效应。
- 时间复杂度：$O(n)$，n 为树的节点个数

### javascript

- 执行用时：68 ms, 在所有 JavaScript 提交中击败了 19.19% 的用户
- 内存消耗：41.3 MB, 在所有 JavaScript 提交中击败了 78.48% 的用户

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function (p, q) {
  if (!p || !q) return p == q;
  if (p.val != q.val) return false;

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};
```

## 迭代

主要思路是将节点存到数组中来。

### javascript

- 执行用时：60 ms, 在所有 JavaScript 提交中击败了 67.26%的用户
- 内存消耗：41.3 MB, 在所有 JavaScript 提交中击败了 61.96% 的用户

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function (p, q) {
  if (p == null && q == null) return true;
  let left = [p],
    right = [q];

  while (left.length) {
    p = left.shift();
    q = right.shift();
    // 先判断根节点
    if (!compare(p, q)) return false;
    // 需要判断两个节点的左子节点和右子节点是否相同再继续向下走
    // 防止出现[1,2]和[1,null,2]判断出错的情况
    if (!compare(p.left, q.left)) return false;
    p.left && left.push(p.left);
    q.left && right.push(q.left);
    if (!compare(p.right, q.right)) return false;
    p.right && left.push(p.right);
    q.right && right.push(q.right);
  }

  return true;
};

function compare(p, q) {
  if (!p || !q) return p == q;
  if (p.val != q.val) return false;

  return true;
}
```
