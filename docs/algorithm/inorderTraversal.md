---
title: 二叉树的中序遍历
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 94：二叉树的中序遍历

- 2022.11.27

[二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。

中序遍历指的是从`左叶子-根节点-右叶子`的这种`深度优先`的遍历方式。

- 示例 1：

  ![](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

  ```js
  输入：root = [1,null,2,3]
  输出：[1,3,2]
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

- 示例 4：

  ![](https://assets.leetcode.com/uploads/2020/09/15/inorder_5.jpg)

  ```js
  输入：root = [1,2]
  输出：[1,2]
  ```

- 示例 5：

  ![](https://assets.leetcode.com/uploads/2020/09/15/inorder_4.jpg)

  ```js
  输入：root = [1,null,2]
  输出：[1,2]
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
var preorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  preorderTraversal(root.left, res);
  res.push(root.val);
  preorderTraversal(root.right, res);

  return res;
};
```

## 迭代

思路：

1. 先一直往左，找到左节点为空
2. 弹出左节点，一直往右找

```js
var inorderTraversal = function (root, res = []) {
  if (!root) return res;
  const stack = [];
  let node = root;
  while (stack.length || node) {
    if (node) {
      stack.push(node);
      node = node.left;
    } else {
      node = stack.pop();
      res.push(node.val);
      node = node.right;
    }
  }
  return res;
};
```
