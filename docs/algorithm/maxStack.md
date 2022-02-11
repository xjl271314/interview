---
title: 最大栈
nav:
  title: 编程题
  path: /writing
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode716：最大栈

- 2022.02.09

[最大栈](https://leetcode-cn.com/problems/max-stack/)设计一个最大栈数据结构，既支持栈操作，又支持查找栈中最大元素。

实现 `MaxStack` 类：

- MaxStack()  初始化栈对象
- void push(int x)  将元素 x 压入栈中。
- int pop()  移除栈顶元素并返回这个元素。
- int top()  返回栈顶元素，无需移除。
- int peekMax()  检索并返回栈中最大元素，无需移除。
- int popMax()  检索并返回栈中最大元素，并将其移除。如果有多个最大元素，只要移除 最靠近栈顶 的那个。

- 示例：

  ```js
    输入
    ["MaxStack", "push", "push", "push", "top", "popMax", "top", "peekMax", "pop", "top"]
    [[], [5], [1], [5], [], [], [], [], [], []]
    输出
    [null, null, null, null, 5, 5, 1, 5, 1, 5]

    解释
    MaxStack stk = new MaxStack();
    stk.push(5);   // [5] - 5 既是栈顶元素，也是最大元素
    stk.push(1);   // [5, 1] - 栈顶元素是 1，最大元素是 5
    stk.push(5);   // [5, 1, 5] - 5 既是栈顶元素，也是最大元素
    stk.top();     // 返回 5，[5, 1, 5] - 栈没有改变
    stk.popMax();  // 返回 5，[5, 1] - 栈发生改变，栈顶元素不再是最大元素
    stk.top();     // 返回 1，[5, 1] - 栈没有改变
    stk.peekMax(); // 返回 5，[5, 1] - 栈没有改变
    stk.pop();     // 返回 1，[5] - 此操作后，5 既是栈顶元素，也是最大元素
    stk.top();     // 返回 5，[5] - 栈没有改变
  ```

- 提示：
  - -10^7 <= x <= 10^7
  - 最多调用  10^4  次  push、pop、top、peekMax  和  popMax
  - 调用  pop、top、peekMax  或  popMax  时，栈中 至少存在一个元素

进阶：试着设计解决方案：调用 top 方法的时间复杂度为 O(1) ，调用其他方法的时间复杂度为 O(logn) 。

## 双栈

### javascript

```js
var MaxStack = function () {
  this.stack = [];
  this.maxStack = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MaxStack.prototype.push = function (x) {
  if (
    this.maxStack.length == 0 ||
    x > this.maxStack[this.maxStack.length - 1]
  ) {
    this.maxStack.push(x);
  } // 当前最大的压进栈
  else {
    this.maxStack.push(this.maxStack[this.maxStack.length - 1]);
  }
  this.stack.push(x);
};

/**
 * @return {number}
 */
MaxStack.prototype.pop = function () {
  this.maxStack.pop(); //同步
  return this.stack.pop();
};

/**
 * @return {number}
 */
MaxStack.prototype.top = function () {
  return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MaxStack.prototype.peekMax = function () {
  return this.maxStack[this.maxStack.length - 1];
};

/**
 * @return {number}
 */
MaxStack.prototype.popMax = function () {
  let max = this.peekMax();
  const st = [];
  while (this.top !== max) {
    st.push(this.pop());
  }
  this.pop();
  while (st.length != 0) {
    this.push(st.pop());
  }
  return max;
};
```

## 单栈

### javascript

> reduce((a, b) => Math.max(a, b))

```js
/**
 * initialize your data structure here.
 */
var MaxStack = function () {
  this.list = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MaxStack.prototype.push = function (x) {
  this.list.push(x);
};

/**
 * @return {number}
 */
MaxStack.prototype.pop = function () {
  return this.list.pop();
};

/**
 * @return {number}
 */
MaxStack.prototype.top = function () {
  return this.list[this.list.length - 1];
};

/**
 * @return {number}
 */
MaxStack.prototype.peekMax = function () {
  return this.list.reduce((a, b) => Math.max(a, b));
};

/**
 * @return {number}
 */
MaxStack.prototype.popMax = function () {
  let max = this.peekMax();
  for (let i = this.list.length - 1; i >= 0; i--) {
    if (max === this.list[i]) {
      this.list.splice(i, 1);
      return max;
    }
  }
};
```
