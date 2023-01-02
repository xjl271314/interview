---
title: 二叉树的层序遍历
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode 102：二叉树的层序遍历

- 2022.11.27

给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。

- 示例 1：

  ![](https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg)

  ```js
  输入：root = [3,9,20,null,null,15,7]
  输出：[[3],[9,20],[15,7]]
  ```

- 示例 2：

  ```js
  输入：root = [1]
  输出：[[1]]
  ```

- 示例 3：

  ```js
  输入：root = []
  输出：[]
  ```

- 提示：
  - 两棵树上的节点数目都在范围 $[0, 2000]$ 内
  - $-1000$ <= Node.val <= $1000$

## 深度优先 BFS 加分层

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
 * @return {number[][]}
 */
var levelOrder = function (root, res = []) {
  if (root == null) return res;
  const queue = [root];
  while (queue.length) {
    const n = queue.length;
    const tmp = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      tmp.push(node.val);
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    res.push([...tmp]);
  }

  return res;
};
```
