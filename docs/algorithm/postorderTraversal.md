---
title: 二叉树的后序遍历
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 145：二叉树的后序遍历

- 2022.11.27

[二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)给定一个二叉树的根节点 root ，返回 它的 后序 遍历 。

中序遍历指的是从`左叶子-右叶子-根节点`的这种`深度优先`的遍历方式。

- 示例 1：

  ![](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

  ```js
  输入：root = [1,null,2,3]
  输出：[3,2,1]
  ```

- 示例 2：

  ```js
  输入：root = []
  输出：[]
  ```

- 示例 3：

  ```js
  输入：root = [1]
  输出：[1]
  ```

- 提示：
  - 两棵树上的节点数目都在范围 $[0, 100]$ 内
  - $-100$ <= Node.val <= $100$

## 递归

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
var postorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  postorderTraversal(root.left, res);
  postorderTraversal(root.right, res);
  res.push(root.val);

  return res;
};
```

## 迭代

```js
var postorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  const stack = [root];
  let cur;
  while (stack.length) {
    cur = stack.pop();
    res.unshift(cur.val);
    cur.left && stack.push(cur.left);
    cur.right && stack.push(cur.right);
  }
  return res;
};
```
