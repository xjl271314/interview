---
title: 二叉树的前序遍历
nav:
  title: 编程题
  path: /writing
group:
  title: 简单
  path: /writing/project/easy
  order: 2
---

# LeetCode 144：二叉树的前序遍历

- 2022.11.25

[二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)给你二叉树的根节点  root ，返回它节点值的   前序   遍历。

前序遍历指的是从`根节点-左叶子-右叶子`的这种`深度优先`的遍历方式。

-  示例  1：

![](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

`js 输入：root = [1,null,2,3] 输出：[1,2,3] `

-  示例  2：

`js 输入：root = [] 输出：[] `

-  示例  3：

`js 输入：root = [1] 输出：[1] `

-  示例  4：

![](https://assets.leetcode.com/uploads/2020/09/15/inorder_5.jpg)

`js 输入：root = [1,2] 输出：[1,2] `

-  示例  5：

![](https://assets.leetcode.com/uploads/2020/09/15/inorder_4.jpg)

`js 输入：root = [1,null,2] 输出：[1,2] `

-  提示：
  -  两棵树上的节点数目都在范围  $[0, 100]$  内
  - $-100$ <= Node.val <= $100$

##  递归

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  res.push(root.val);
  preorderTraversal(root.left, res);
  preorderTraversal(root.right, res);
  return res;
};
```

##  迭代

思路：

1. 二叉树为空啥也不做；
2. 结点不为空，访问并入栈，如果存在右结点先入栈，如果存在左结点也入栈。
3. 当栈为空的时候结束遍历。

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
 * @param {TreeNode} root
 * @return {number[]}
 */

var preorderTraversal = function (root, res = []) {
  if (root == null) return res;
  const stack = [];
  stack.push(root);
  while (stack.length) {
    const node = stack.pop();
    res.push(node.val);
    if (node.right) {
      stack.push(node.right);
    }
    if (node.left) {
      stack.push(node.left);
    }
  }

  return res;
};
```
