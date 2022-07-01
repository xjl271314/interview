---
title: 乘积最大子数组
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode152：乘积最大子数组

- 2022.06.27

[乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/)

给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 `32-位` 整数。

**子数组** 是数组的连续子序列。

- 示例 1:

  ```js
  输入: nums = [2,3,-2,4]
  输出: 6
  解释: 子数组 [2,3] 有最大乘积 6。
  ```

- 示例 2:

  ```js
  输入: nums = [-2,0,-1]
  输出: 0
  解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
  ```

- 提示：
  - $1 <= nums.length <= 2 * 10^4$
  - $-10 <= nums[i] <= 10$
  - nums 的任何前缀或后缀的乘积都 保证 是一个 `32-位` 整数

## 动态规划

- 遍历数组时计算当前最大值，不断更新
- 令 $imax$ 为当前最大值，则当前最大值为 $imax = max(imax * nums[i], nums[i])$
- 由于存在负数，那么会导致最大的变最小的，最小的变最大的。因此还需要维护当前最小值 $imin$ ，$imin = min(imin * nums[i], nums[i])$

### javascript

- 执行用时：68 ms, 在所有 JavaScript 提交中击败了 57.66% 的用户
- 内存消耗：41.5 MB, 在所有 JavaScript 提交中击败了 65.46% 的用户
- 时间复杂度：$O(n)$
- 空间复杂度：$O(1)$

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  let max = nums[0],
    min = nums[0],
    ans = nums[0];
  for (let i = 1; i < nums.length; i++) {
    let tmp1 = max,
      tmp2 = min;
    max = Math.max(tmp1 * nums[i], Math.max(nums[i], tmp2 * nums[i]));
    min = Math.min(tmp2 * nums[i], Math.min(nums[i], tmp1 * nums[i]));

    ans = Math.max(max, ans);
  }

  return ans;
};
```
