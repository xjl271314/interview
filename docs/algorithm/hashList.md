---
title: 设计哈希集合
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode 705：设计哈希集合

- 2022.02.09

[设计哈希集合](https://leetcode-cn.com/problems/design-hashset/)不使用任何内建的哈希表库设计一个哈希集合（HashSet）。

实现 `MyHashSet` 类：

- void add(key) 向哈希集合中插入值 key 。
- bool contains(key) 返回哈希集合中是否存在这个值 key 。
- void remove(key) 将给定值 key 从哈希集合中删除。如果哈希集合中没有这个值，什么也不做。

- 示例:

  ```
  输入：

  ["MyHashSet", "add", "add", "contains", "contains", "add", "contains", "remove", "contains"]
  [[], [1], [2], [1], [3], [2], [2], [2], [2]]
  输出：
  [null, null, null, true, false, null, true, null, false]

  解释：
  MyHashSet myHashSet = new MyHashSet();
  myHashSet.add(1);      // set = [1]
  myHashSet.add(2);      // set = [1, 2]
  myHashSet.contains(1); // 返回 True
  myHashSet.contains(3); // 返回 False ，（未找到）
  myHashSet.add(2);      // set = [1, 2]
  myHashSet.contains(2); // 返回 True
  myHashSet.remove(2);   // set = [1]
  myHashSet.contains(2); // 返回 False ，（已移除）
  ```

- 提示：
  - 0 <= key <= 10^6
  - 最多调用 10^4 次 add、remove 和 contains

## 基础解法

为了实现哈希集合这一数据结构，有以下几个关键问题需要解决：

- 哈希函数：能够将集合中任意可能的元素映射到一个固定范围的整数值，并将该元素存储到整数值对应的地址上。

- 冲突处理：由于不同元素可能映射到相同的整数值，因此需要在整数值出现「冲突」时，需要进行冲突处理。总的来说，有以下几种策略解决冲突：

  - `链地址法`：为每个哈希值维护一个链表，并将具有相同哈希值的元素都放入这一链表当中。
  - `开放地址法`：当发现哈希值 h 处产生冲突时，根据某种策略，从 h 出发找到下一个不冲突的位置。例如，一种最简单的策略是，不断地检查 h+1,h+2,h+3… 这些整数对应的位置。
  - `再哈希法`：当发现哈希冲突后，使用另一个哈希函数产生一个新的地址。

- 扩容：当哈希表元素过多时，冲突的概率将越来越大，而在哈希表中查询一个元素的效率也会越来越低。因此，需要开辟一块更大的空间，来缓解哈希表中发生的冲突。

### javascript

- 使用 Set 结构来处理，能通过检测但不是好的方案

  ```js
  var MyHashSet = function () {
    this.list = new Set();
  };

  /**
   * @param {number} key
   * @return {void}
   */
  MyHashSet.prototype.add = function (key) {
    this.list.add(key);
  };

  /**
   * @param {number} key
   * @return {void}
   */
  MyHashSet.prototype.remove = function (key) {
    this.list.delete(key);
  };

  /**
   * @param {number} key
   * @return {boolean}
   */
  MyHashSet.prototype.contains = function (key) {
    return this.list.has(key);
  };
  ```

- 构造完整的 hash 集合

  ```js
  // 时间复杂度 O(1) 空间复杂度 O(n)
  var MyHashSet = function () {
    this.list = [];
  };

  /**
   * @param {number} key
   * @return {void}
   */
  MyHashSet.prototype.add = function (key) {
    this.list[key] = 1;
  };

  /**
   * @param {number} key
   * @return {void}
   */
  MyHashSet.prototype.remove = function (key) {
    this.list[key] = 0;
  };

  /**
   * @param {number} key
   * @return {boolean}
   */
  MyHashSet.prototype.contains = function (key) {
    return !!this.list[key];
  };
  ```
