---
title: 接雨水
nav:
  title: 算法
  path: /write
  order: 0
group:
  title: 困难
  path: /write/project/difficult
---

# LeetCode 42：接雨水

- 2021.09.28

[接雨水](https://leetcode-cn.com/problems/trapping-rain-water/)，给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

- 示例 1：

![示例1](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/10/22/rainwatertrap.png)

```desc
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。
```

- 示例 2：

```desc
输入：height = [4,2,0,3,2,5]
输出：9
```

- 提示：
  - n == height.length
  - 1 <= n <= 2 \* 10^4
  - 0 <= height[i] <= 10^5

## 暴力解法

根据题意我们可以直观的思考得到，一个柱子能接的雨水量等于左右两个柱子高度的最小值减去中间柱子本身的高度，也就是假设左侧柱子为 p，中间为 m，右侧为 n。

```js
water(m) = Math.max(Math.min(p,n) - m , 0);
```

因此我们可以得到下面的思路:

1. 初始化 `let total = 0;`表示返回的可以接收雨水的总量
2. 遍历数组变量为 i:

   1. 初始化 `let dl，dr = 0`;
   2. 从当前元素位置向左侧遍历，变量为 j，计算左侧能够接雨水的最大值并进行更新。

      ```js
      dl = Math.max(dl, height[j]);
      ```

   3. 从当前元素位置向右侧遍历，变量为 j，计算右侧能够接雨水的最大值并进行更新。

      ```js
      dr = Math.max(dr, height[j]);
      ```

   4. 将左右两侧计算结果中的较小值与当前元素进行相减，得到当前位置可接收的雨水量，并进行累加。因为该位置上能够储水的量跟左侧最大和右侧最大中较小的有关。(短板)

      ```js
      total += Math.min(dl, dr) - height[i];
      ```

### javascript

> `运行时间 284 ms 内存消耗 39.8 MB`。

```js
/**
 * 时间复杂度： O(n^2)。数组中的每个元素都需要向左向右扫描。
 * 空间复杂度 O(1)的额外空间。
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  // 初始化
  let total = 0,
    len = height.length;

  if (len < 3) return 0;

  for (let i = 1; i < len - 1; i++) {
    let dl = 0,
      dr = 0;
    for (let j = i; j >= 0; j--) {
      dl = Math.max(dl, height[j]);
    }
    for (let j = i; j < len; j++) {
      dr = Math.max(dr, height[j]);
    }

    total += Math.min(dl, dr) - height[i];
  }
  return total;
};
```

### python3

```python
def trap(self, height):
    total = 0
    # range(start, end, step=1)
    for i in range(1, len(height)-1):
        left_max = 0
        right_max = 0
        for j in range(i, -1, -1):
            left_max = max(left_max, height[j])
        for j in range(i, len(height), 1):
            right_max = max(right_max, height[j])
        total += min(left_max, right_max) - height[i]
    return total
```

## 动态规划

在暴力解法的过程中我们为了寻找到左右两侧的最大值使用了双重的循环，我们是否可以通过预先计算每个位置的左侧、右侧最大值并存储下来。

![图示](https://pic.leetcode-cn.com/53ab7a66023039ed4dce42b709b4997d2ba0089077912d39a0b31d3572a55d0b-trapping_rain_water.png)

因此可以得到下面的思路:

1. 初始化 `let total = 0;`表示返回的可以接收雨水的总量

2. 找到数组中从下标 i 到最左端最高的条形块高度 `left_max`。

3. 找到数组中从下标 i 到最右端最高的条形块高度 `right_max`。

4. 扫描数组 `height` 并累加 `min(left_max[i],right_max[i]) - height[i]到 total` 上。

### javascript

> `运行时间 76 ms 内存消耗 40.6 MB`。

```js
/**
 * 时间复杂度： O(n)。存储最大高度数组，需要两次遍历，每次 O(n) 。
 * 空间复杂度 O(n)。最终使用存储的数据更新total ，O(n)。
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  // 初始化
  let total = 0,
    len = height.length;

  if (len < 3) return 0;

  let left_max = [],
    right_max = [];
  left_max[0] = height[0];

  for (let i = 1; i < len; i++) {
    left_max[i] = Math.max(height[i], left_max[i - 1]);
  }

  right_max[len - 1] = height[len - 1];
  for (let i = len - 2; i > 0; i--) {
    right_max[i] = Math.max(height[i], right_max[i + 1]);
  }

  for (let i = 1; i < len - 1; i++) {
    total += Math.min(left_max[i], right_max[i]) - height[i];
  }

  return total;
};
```

## 单调栈

> `单调栈`是指栈中的元素都是递增(递减)的，如果某个元素不满足该条件，那么就不断的将这些元素从栈顶中出栈，直到所有的元素都满足条件为止。

为什么这道题可以使用单调栈呢?

**因为只有产生凹陷的地方才能存储雨水**, 那么高度一定是先减后增, 所以当我们遍历到**增**这个位置的时候, 前面减的地方(凹陷处)一定会存储雨水, 所以我们就将凹陷处出栈, 来计算它所能存储的雨水量.

用算法思想来表述就是:

单调栈是按照行方向来计算雨水, 从左到右遍历数组, 遍历到下标 `i` 时, 如果栈内至少有两个元素, 记栈顶元素为`top`, `top` 的下面一个元素是 `left`, 则一定有`height[left]≥height[top]`。如果`height[i]>height[top]`, 则得到一个可以接雨水的区域.

![单调栈](https://pic.leetcode-cn.com/1632216903-nShBcj-file_1632216903602)

那么是递增单调还是递减单调呢?

**栈底的顺序应该是从小到大(递增)的顺序**, 因为一旦发现添加的柱子高度大于栈头元素了，此时就出现凹槽了，栈头元素就是凹槽底部的柱子，栈头第二个元素就是凹槽左边的柱子，而添加的元素就是凹槽右边的柱子。

![](https://pic.leetcode-cn.com/1632216903-MTxIdf-file_1632216903638)

当我们遇到相同的元素，需要更新栈内下标，就是将栈里元素（旧下标）弹出，将新元素（新下标）加入栈中。

例如 5 5 1 3 这种情况。如果添加第二个 5 的时候就应该将第一个 5 的下标弹出，把第二个 5 添加到栈中。

因为我们要求宽度的时候 如果遇到相同高度的柱子，需要使用最右边的柱子来计算宽度。

![](https://pic.leetcode-cn.com/1632216903-qolgSh-file_1632216903685)

最后栈里面需要存放什么呢?

我们实际上是通过 `长 * 宽` 来计算雨水面积的，长就是通过柱子的高度来计算，宽是通过柱子之间的下标来计算。

所以我们只需要在栈中存着下标，计算的时候用下标对应的柱子高度即可。

因此我们可以得到下面的思路:

1. 首先定义一个单调栈 `let stack = [];`，并将下标为 0 的元素入栈。 `stack.push(height[0]);`。

2. 然后开始从下标 1 开始遍历所有的柱子

   - 如果当前遍历的元素（柱子）高度小于栈顶元素的高度，就把这个元素加入栈中，因为栈里本来就要保持从小到大的顺序（从栈头到栈底）。

   - 如果当前遍历的元素（柱子）高度等于栈顶元素的高度，要跟更新栈顶元素，因为遇到相相同高度的柱子，需要使用最右边的柱子来计算宽度。
   -

   ```js
   for (let i = 1; i < height.length; i++) {
     if (height[i] < height[stack.length - 1]) {
       stack.push(i);
     }

     if (height[i] == height[stack.length - 1]) {
       // 例如 5 5 1 7 这种情况
       st.pop();
       st.push(i);
     }
   }
   ```

   - 如果当前遍历的元素（柱子）高度大于栈顶元素的高度，此时就出现凹槽了，如图所示：

   ![凹槽](https://pic.leetcode-cn.com/1632216903-MTxIdf-file_1632216903638)

   取栈顶元素，将栈顶元素弹出，这个就是凹槽的底部，也就是中间位置，下标记为 mid，对应的高度为 height[mid]（就是图中的高度 1）。

   此时的栈顶元素就是凹槽的左边位置，下标为 stack.length - 1，对应的高度为 height[stack.length - 1]（就是图中的高度 2）。

   当前遍历的元素 i，就是凹槽右边的位置，下标为 i，对应的高度为 height[i]（就是图中的高度 3）。

   此时我们可以发现**其实就是栈顶和栈顶的下一个元素以及要入栈的三个元素来接水！**

   因此雨水的高度是`min(凹槽左边高度, 凹槽右边高度) - 凹槽底部高度`：

   ```js
   let h = min(height[stack.length - 1], height[i]) - height[mid];
   ```

   雨水的宽度是`凹槽右边的下标 - 凹槽左边的下标 - 1（因为只求中间宽度）`：

   ```js
   let w = i - (stack.length - 1) - 1;
   ```

   当前凹槽雨水的体积就是：`h * w`。

   ```js
   while (stack.length && height[i] > height[satck.length - 1]) {
     // 注意这里是while，持续跟新栈顶元素
     let mid = satck.length - 1;
     stack.pop();
     if (stack.length) {
       let h = min(height[satck.length - 1], height[i]) - height[mid];
       let w = i - (stack.length - 1) - 1; // 注意减一，只求中间宽度
       sum += h * w;
     }
   }
   ```

### javascript

> `运行时间 76 ms 内存消耗 39.6 MB`。

```js
/**
 * 时间复杂度： O(n)。
 * 空间复杂度 O(n)。最终使用存储的数据更新total ，O(n)。
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  // 初始化
  let index = 0,
    total = 0,
    len = height.length;

  if (len < 3) return 0;

  let stack = [];

  for (let i = 0; i < len; i++) {
    while (stack.length && height[i] > height[stack[stack.length - 1]]) {
      // 新栈顶元素
      const top = stack.pop();
      if (!stack.length) {
        break;
      }

      const left = stack[stack.length - 1];
      let w = i - left - 1; // 注意减一，只求中间宽度
      let h = Math.min(height[left], height[i]) - height[top];

      total += h * w;
    }
    stack.push(i);
  }

  return total;
};
```

## 双指针

从动态规范的思想我们可以了解到，当该位置`left_max[i] > right_max[i]`的时候，积水的高度将由右侧的`right_max[i]`来决定，同理当`right_max[i] > left_max[i]`的时候，积水的高度将由`left_max[i]`来决定。

因此我们可以得出如果一端有更高的柱子，积水的高度依赖于当前方向的高度，当我们发现另一侧的柱子高度不是最高的时候，我们则从相反的方向进行遍历。

![双指针](https://img-blog.csdnimg.cn/1ebc7e6484674b1aa82ae2e61237747a.png)

### javascript

> `运行时间 348 ms 内存消耗 39.8 MB`。

```js
/**
 * 时间复杂度： O(n^2)。
 * 空间复杂度 O(1)。
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  // 初始化
  let index = 0,
    total = 0,
    len = height.length;

  if (len < 3) return 0;

  // 第一个柱子和最后一个柱子不接雨水
  for (let i = 1; i < len - 1; i++) {
    let left_max = height[i];
    let right_max = height[i];

    for (let j = i + 1; j < len; j++) {
      if (height[j] > right_max) {
        right_max = height[j];
      }
    }
    for (let j = i - 1; j >= 0; j--) {
      if (height[j] > left_max) {
        left_max = height[j];
      }
    }
    let h = Math.min(left_max, right_max) - height[i];
    if (h > 0) {
      total += h;
    }
  }

  return total;
};
```
