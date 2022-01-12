---
title: 两数之和
nav:
  title: 编程题
  path: /writing
group:
  title: 简单
  path: /writing/project/easy
  order: 1
---

# LeetCode:两数之和(难度:简单)

- 2021.06.02

给定一个整数数组 `nums`  和一个整数目标值 `target`，请你在该数组中找出`和`为目标值 target`的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

- 示例 1：

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

- 示例 2：

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

- 示例 3：

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

## 解法一: 双层遍历,构造剩余数组

### javascript

> `运行时间 220 ms 内存消耗 42.7 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  题意是肯定会返回2个数组成的一个数组,且数组中同一个元素不可以使用两遍。
 *  因此我们将数组拆分为两个,进行双重的遍历,每次遍历的时候去检查剩余数组中是否存在值与当前值
 *  相加结果为target,由于剩余数组是从原始数组中剔除当前值之后的数组,返回的值需要使用index+1+j
 *  此方法思路较简单,但是双重遍历加构造数组,时间复杂度：O(n^2)。
 *  ----------------------------------------------------------------
 *  @param {number[]} nums
 *  @param {number} target
 *  @return {number[]}
 */

var twoSum = function (nums, target) {
  let arr = [];
  nums.map((item, index) => {
    const rest = nums.slice(index + 1);
    const j = rest.findIndex((newItem) => item + newItem == target);
    if (j > -1) {
      arr = [index, index + j + 1];
    }
  });
  return arr;
};
```

## 解法二: 双层遍历,优化差值查找

### javascript

> `运行时间 108 ms 内存消耗 38.4 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  上述的方法我们构造了双层遍历，并且每次都生成了一个新的剩余数组。
 *  我们是否可以把生成剩余数组的代码优化，取出当前的值和剩余所需的值进行相减
 *  时间复杂度：O(N^2)，其中 N 是数组中的元素数量。最坏情况下数组中任意两个数都要被匹配一次。空间复杂度：O(1)。
 *  ----------------------------------------------------------------
 *  @param {number[]} nums
 *  @param {number} target
 *  @return {number[]}
 */
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    const left = target - nums[i];
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] === left) {
        return [i, j];
      }
    }
  }
};
```

### python3

> `运行时间 3956 ms 内存消耗 15 MB`。

```python
def twoSUm(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i+1, n):
            if nums[i] + nums[j] == target:
                return [i, j]

```

## 解法三: 使用 Hash 表

### javascript

> `运行时间 84 ms 内存消耗 39.8 MB`。

```js
/**  ----------------------------------------------------------------
 *  解题思路:
 *  上述方法时间复杂度较高的原因是寻找 target - x 的时间复杂度过高。
 *  因此，我们需要一种更优秀的方法，能够快速寻找数组中是否存在目标元素。如果存在，我们需要找出它的索引。
 *  使用哈希表，可以将寻找 target - x 的时间复杂度降低到从 O(N)降低到 O(1)。
 *  这样我们创建一个哈希表，对于每一个 x，我们首先查询哈希表中是否存在 target - x，
 *  然后将 x 插入到哈希表中，即可保证不会让 x 和自己匹配。
 *  时间复杂度：O(N)，其中 N 是数组中的元素数量。对于每一个元素 x，我们可以 O(1)地寻找 target - x。
 *  空间复杂度：O(N)，其中 N 是数组中的元素数量。主要为哈希表的开销。
 *  ----------------------------------------------------------------
 *  @param {number[]} nums
 *  @param {number} target
 *  @return {number[]}
 */
var twoSum = function (nums, target) {
  let len = nums.length;
  // 创建 MAP
  const MAP = new Map();
  // 由于第一个元素在它之前一定没有元素与之匹配，所以先存入哈希表
  MAP.set(nums[0], 0);
  for (let i = 1; i < len; i++) {
    // 提取共用
    let other = target - nums[i];
    // 判断是否符合条件，返回对应的下标
    if (MAP.get(other) !== undefined) return [MAP.get(other), i];
    // 不符合的存入hash表
    MAP.set(nums[i], i);
  }
};
```

### python3

> `运行时间 44 ms 内存消耗 15.8 MB`。

```python
def twoSum(nums, target):
    hash_table = dict()
    for i, num in enumerate(nums):
        if target - num in hash_table:
            return [hash_table[target - num], i]
        hash_table[nums[i]] = i
    return []
```
