---
title: 二叉树的右视图
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode 199：二叉树的右视图

- 2022.11.27

给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

- 示例 1：

  ![](https://assets.leetcode.com/uploads/2021/02/14/tree.jpg)

  ```js
  输入: [1, 2, 3, null, 5, null, 4];
  输出: [1, 3, 4];
  ```

- 示例 2：

  ```js
  输入: [];
  输出: [];
  ```

- 提示：
  - 两棵树上的节点数目都在范围 $[0, 100]$ 内
  - $-100$ <= Node.val <= $100$

## 逐层遍历，分层后返回每层的最后一个元素

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
var rightSideView = function (root) {
  if (!root) return [];
  const queue = [root];
  const res = [];
  while (queue.length) {
    const n = queue.length;
    let tmp = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      tmp.push(node.val);
    }
    res.push(tmp[tmp.length - 1]);
  }
  return res;
};
```
