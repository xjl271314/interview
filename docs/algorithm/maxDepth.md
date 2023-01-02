---
title: 二叉树的最大深度
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 104：二叉树的最大深度

- 2022.11.27

[二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

说明: 叶子节点是指没有子节点的节点。

- 示例：

  给定二叉树 [3,9,20,null,null,15,7]，

  ```js
   3
  / \
  9  20
  /  \
  15  7
  ```

  返回它的最大深度 3 。

## 自顶向下 BFS+层序遍历

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
 * @return {number}
 */
var maxDepth = function (root) {
  if (!root) return 0;
  const queue = [root];
  let deep = 0;
  while (queue.length) {
    const n = queue.length;
    deep += 1;
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }

  return deep;
};
```

## 自底向上后序遍历

一棵树的最大深度为「其左子树的最大深度」和「其右子树的最大深度」两者中的较大值，再加一（根节点本身）。

```js
var maxDepth = function (root) {
  if (!root) return 0;

  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
};
```
