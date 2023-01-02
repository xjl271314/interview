---
title: 对称二叉树
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 101：对称二叉树

- 2022.11.27

[对称二叉树](https://leetcode.cn/problems/symmetric-tree/)给你一个二叉树的根节点 root ， 检查它是否轴对称。

- 示例 1：

  ![](https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg)

  ```js
  输入：root = [1,2,2,3,4,4,3]
  输出：true
  ```

- 示例 2：

  ![](https://assets.leetcode.com/uploads/2021/02/19/symtree2.jpg)

  ```js
  输入：root = [1,2,2,null,3,null,3]
  输出：false
  ```

- 提示：

  - 两棵树上的节点数目都在范围 $[1, 1000]$ 内
  - $-100$ <= Node.val <= $100$

- 进阶：你可以运用递归和迭代两种方法解决这个问题吗？

## 递归

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
 * @return {boolean}
 */
var isSymmetric = function (root) {
  let left = root.left;
  let right = root.right;

  const compare = (left, right) => {
    if (!left && !right) {
      return true;
    }

    if (!left || !right || left.val != right.val) {
      return false;
    }
    let _left = compare(left.left, right.right);
    let _right = compare(left.right, right.left);

    return _left && _right;
  };

  return compare(left, right);
};
```

## 迭代

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
 * @return {boolean}
 */
var isSymmetric = function (root) {
  const queue = [root.left, root.right];
  while (queue.length) {
    const left = queue.shift();
    const right = queue.shift();
    if (left == null && right == null) {
      continue;
    } else if (left == null || right == null || left.val != right.val) {
      return false;
    }
    queue.push(left.left);
    queue.push(right.right);
    queue.push(left.right);
    queue.push(right.left);
  }

  return true;
};
```
