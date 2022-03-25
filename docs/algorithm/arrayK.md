---
title: 数组中的第K个最大元素
nav:
  title: 编程题
  path: /writing
group:
  title: 排序算法
  path: /writing/project/sort
---

# LeetCode 215： 数组中的第 K 个最大元素

- 2022.03.23

[数组中的第 K 个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。

- 示例 1：

  ```js
  输入: [3,2,1,5,6,4] 和 k = 2
  输出: 5
  ```

- 示例 2：

  ```js
  输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
  输出: 4
  ```

- 提示：
  - 1 <= k <= nums.length <= 10^4
  - -10^4 <= nums[i] <= 10^4

## 冒泡排序

基于优化版的标志位冒泡排序。

- 执行用时：172 ms, 在所有 JavaScript 提交中击败了 8.32% 的用户
- 内存消耗：41.3 MB, 在所有 JavaScript 提交中击败了 65.03% 的用户

### javascript

```js
var findKthLargest = function (nums, k) {
  let i = nums.length - 1;
  while (i) {
    let pos = 0;
    for (let j = 0; j < i; j++) {
      const condition = nums[j] < nums[j + 1];

      if (condition) {
        pos = j;
        let temp = nums[j + 1];
        nums[j + 1] = nums[j];
        nums[j] = temp;
      }
    }
    i = pos;
  }
  return nums[k - 1];
};
```

## 快速排序

通过`快速排序`的分区`partition`，找到第 K 个最大元素。

每进行一次`快速排序`的 `partition` 操作，就能找到这次我们选中的基准值排序之后的正确位置。

如果它的位置刚好是排序之后第 `K` 个最大元素的位置，即 `len - k`，我们直接得到了答案；

因为进行 `partition` 操作之后，位于基准值之前的元素都要小于基准值，位于基准值之后的元素都要大于等于基准值。

- 如果它的位置小于排序之后第 K 个最大元素的位置，我们就去它之后寻找第 K 个最大元素；
- 如果它的位置大于排序之后第 K 个最大元素的位置，我们就去它之前寻找第 K 个最大元素；

### javascript

- 执行用时：104 ms, 在所有 JavaScript 提交中击败了 21.15% 的用户
- 内存消耗：41.4 MB, 在所有 JavaScript 提交中击败了 65.03% 的用户

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  const len = nums.length;
  let left = 0,
    right = len - 1;
  const targetIndex = len - k;

  while (left < right) {
    const index = partition(nums, left, right);
    if (index == targetIndex) {
      return nums[index];
    } else if (index < targetIndex) {
      left = index + 1;
    } else {
      right = index - 1;
    }
  }

  return nums[left];
};

function partition(nums, start, end) {
  const pivot = nums[start];
  while (start < end) {
    while (start < end && nums[end] >= pivot) {
      end--;
    }
    nums[start] = nums[end];
    while (start < end && nums[start] < pivot) {
      start++;
    }
    nums[end] = nums[start];
  }
  nums[start] = pivot;

  return start;
}
```

## 堆排序

堆排序是利用 `堆` 这种 数据结构 而设计的一种排序算法，它是一种选择排序，最坏 、最好、平均时间复杂度均为 `O(nlogn)`，它是不稳定排序。

顺序存储二叉树:

- 第 n 个元素的 左子节点 为 2\*n+1
- 第 n 个元素的 右子节点 为 2\*n+2
- 第 n 个元素的 父节点 为 (n-1)/2
- 最后一个非叶子节点为 Math.floor(arr.length/2)-1

堆是具有以下性质的完全二叉树：

- 大顶堆：每个节点的值都 大于或等于 其左右孩子节点的值

  注：没有要求左右值的大小关系

- 小顶堆：每个节点的值都 小于或等于 其左右孩子节点的值

### 大顶堆举例

![大顶堆举例](https://pic.leetcode-cn.com/1624163681-hJGivE-image.png)

对堆中的节点按层进行编号，映射到数组中如下图:

![大顶堆映射](https://pic.leetcode-cn.com/1624163693-HYBERK-image.png)

大顶堆特点：`arr[i] >= arr[2*i+1] && arr[i] >= arr[2*i+2]`，`i` 对应第几个节点，`i` 从 `0` 开始编号。

### 小顶堆举例

![小顶堆举例](https://pic.leetcode-cn.com/1624163701-hqAboA-image.png)

小顶堆特点：`arr[i] <= arr[2*i+1] && arr[i] <= arr[2*i+2]`，i 对应第几个节点，i 从 0 开始。

排序说明:

- 升序：一般采用大顶堆
- 降序：一般采用小顶堆

### 堆排序步骤图解

对数组 `[4,6,8,5,9]` 进行堆排序，将数组升序排序。

#### 步骤一：构造初始堆

1. 给定无序序列结构 如下:

   ![1](https://pic.leetcode-cn.com/1624163715-VXPhZJ-image.png)

   将给定无序序列构造成一个大顶堆。

2. 此时从最后一个非叶子节点开始调整，从左到右，从上到下进行调整。

   叶节点不用调整，第一个非叶子节点 `arr.length/2-1 = 5/2-1 = 1` ，也就是 元素为 `6` 的节点。

   比较时：先让 `5` 与 `9` 比较，得到最大的那个，再和 `6` 比较，发现 `9` 大于 `6`，则调整他们的位置。

   ![2](https://pic.leetcode-cn.com/1624163724-QCfxWl-image.png)

3. 找到第二个非叶子节点 4，由于 [4,9,8] 中，9 元素最大，则 4 和 9 进行交换

   ![3](https://pic.leetcode-cn.com/1624163737-nWDnEx-image.png)

4. 此时，交换导致了子根 [4,5,6] 结构混乱，将其继续调整。[4,5,6] 中 6 最大，将 4 与 6 进行调整。

   ![4](https://pic.leetcode-cn.com/1624163748-vVZNTN-image.png)

   此时，就将一个无序序列构造成了一个大顶堆。

#### 步骤二：将堆顶元素与末尾元素进行交换

将堆顶元素与末尾元素进行交换，使其末尾元素最大。然后继续调整，再将堆顶元素与末尾元素交换，得到第二大元素。如此反复进行交换、重建、交换。

1. 将堆顶元素 9 和末尾元素 4 进行交换

   ![1](https://pic.leetcode-cn.com/1624163757-rooMsP-image.png)

2. 重新调整结构，使其继续满足堆定义

   ![2](https://pic.leetcode-cn.com/1624163766-WsYato-image.png)

3. 再将堆顶元素 8 与末尾元素 5 进行交换，得到第二大元素 8

   ![3](https://pic.leetcode-cn.com/1624163783-IhXOJT-image.png)

4. 后续过程，继续进行调整、交换，如此反复进行，最终使得整个序列有序

   ![4](https://pic.leetcode-cn.com/1624163793-fGUBxG-image.png)

### 思路总结

1. 将无序序列构建成一个堆，根据升序降序需求选择大顶堆
2. 将堆顶元素与末尾元素交换，将最大元素「沉」到数组末端
3. 重新调整结构，使其满足堆定义，然后继续交换堆顶与当前末尾元素，反复执行调整、交换步骤，直到整个序列有序。

### 步骤

1. 第一步构建初始堆：是自底向上构建，从最后一个非叶子节点开始。
2. 第二步就是下沉操作让尾部元素与堆顶元素交换，最大值被放在数组末尾，并且缩小数组的 length，不参与后面大顶堆的调整。
3. 第三步就是调整：是从上到下，从左到右,因为堆顶元素下沉到末尾了，要重新调整这颗大顶堆

### javascript

- 执行用时：72 ms, 在所有 JavaScript 提交中击败了 69.89% 的用户
- 内存消耗：41.3 MB, 在所有 JavaScript 提交中击败了 68.86% 的用户

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
// 整个流程就是上浮下沉
var findKthLargest = function (nums, k) {
  // 首先构建大顶堆
  buildMaxHeap(nums);
  for (let i = nums.length - 1; i > 0; i--) {
    // 交换最大值到最后
    swap(nums, 0, i);
    // 调整剩余数组，使其满足大顶堆
    maxHeapify(nums, 0, i);
  }

  return nums[nums.length - k];
};

function buildMaxHeap(arr) {
  // 从最后一个非叶子节点开始构建，最后一个非叶子节点的下标是 arr.length / 2 - 1;
  for (let i = Math.floor(arr.length / 2 - 1); i >= 0; i--) {
    maxHeapify(arr, i, arr.length);
  }
}

function maxHeapify(arr, i, heapSize) {
  // 左子节点下标
  let l = 2 * i + 1;
  // 右子节点下标
  let r = l + 1;
  // 记录根节点、左子树节点、右子树节点中的最大值下标
  let largest = i;
  // 与左子树节点比较
  if (l < heapSize && arr[l] > arr[largest]) {
    largest = l;
  }
  // 与右子树节点比较
  if (r < heapSize && arr[r] > arr[largest]) {
    largest = r;
  }
  if (largest != i) {
    // 将最大值交换位根节点
    swap(arr, i, largest);
    // 再次调整交换数字后的大顶堆
    maxHeapify(arr, largest, heapSize);
  }
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
```
