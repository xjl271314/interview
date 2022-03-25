---
title: 排序算法基础知识
nav:
  title: 编程题
  path: /writing
group:
  title: 排序算法
  path: /writing/project/sort
  order: 0
---

# 排序算法基础知识

- 2022.03.23

## 概述

排序算法是一类非常经典的算法，说来简单，说难也难。刚学编程时大家都爱用冒泡排序，随后接触到选择排序、插入排序等，历史上还有昙花一现的`希尔排序`，公司面试时也经常会问到快速排序等等，小小的排序算法，融入了无数程序大牛的心血。

在不同领域，排序算法的实现各有千秋。总体来看，排序算法大致可分为十类：

- 选泡插：选择排序、冒泡排序、插入排序
- 快归希堆：快速排序、归并排序、希尔排序、堆排序
- 桶计基：桶排序、计数排序、基数排序

V8 引擎 sort 函数只给出了两种排序 `InsertionSort` 和 `QuickSort`，数量小于 10 的数组使用 `InsertionSort`，比 10 大的数组则使用 `QuickSort`。

## 冒泡排序

冒泡排序是入门级的算法，但也有一些有趣的玩法：

### 动图演示

![动图演示](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/30/f427727489dff5fcb0debdd69b478ecf~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 基本实现

比较相邻的元素，一边比较一边向后两两交换，将最大值 / 最小值冒泡到最后一位；

```js
function bubbleSort(arr, order = 'asc') {
  console.time('基本实现冒泡排序耗时');
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      const condition =
        order == 'desc' ? arr[j] < arr[j + 1] : arr[j] > arr[j + 1];

      if (condition) {
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  console.timeEnd('基本实现冒泡排序耗时');
  return arr;
}
```

### 最后交换位 pos

设置一标志性变量 `pos`，用于记录每趟排序中最后一次进行交换的位置。由于 `pos` 位置之后的记录均已交换到位，故在进行下一趟排序时只要扫描到 `pos` 位置即可。

```js
function bubbleSort(arr, order = 'asc') {
  console.time('记录最后交换位pos冒泡排序耗时');
  let i = arr.length - 1;
  while (i) {
    let pos = 0;
    for (let j = 0; j < i; j++) {
      const condition =
        order == 'desc' ? arr[j] < arr[j + 1] : arr[j] > arr[j + 1];

      if (condition) {
        pos = j;
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
    i = pos;
  }
  console.timeEnd('记录最后交换位pos冒泡排序耗时');
  return arr;
}
```

### 正向、反向冒泡

在每趟排序中进行正向和反向两遍冒泡的方法一次可以得到两个最终值(最大者和最小者) , 从而使排序趟数几乎减少了一半。

```js
function bubbleSort(arr, order = 'asc') {
  console.time('正向、反向冒泡冒泡排序耗时');
  let low = 0;
  let high = arr.length - 1;
  let temp, j;

  while (low < high) {
    for (j = low; j < high; j++) {
      const condition =
        order == 'desc' ? arr[j] < arr[j + 1] : arr[j] > arr[j + 1];

      if (condition) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    high--;
    for (j = high; j > low; j--) {
      const condition =
        order == 'desc' ? arr[j] > arr[j - 1] : arr[j] < arr[j - 1];

      if (condition) {
        let temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;
      }
    }
    low++;
  }
  console.timeEnd('正向、反向冒泡冒泡排序耗时');
  return arr;
}
```

### 交换的技巧

一般来说，交换数组中两个数字的函数如下：

```js
let temp = arr[j + 1];
arr[j + 1] = arr[j];
arr[j] = temp;
```

但在大厂面试中，有一道非常经典的数字交换题目：**如何在不引入第三个中间变量的情况下，完成两个数字的交换**。

这里可以用到一个数学上的技巧：

```js
arr[j + 1] = arr[j + 1] + arr[j];
arr[j] = arr[j + 1] - arr[j];
arr[j + 1] = arr[j + 1] - arr[j];
```

除了这种`先加后减`的写法，还有一种`先减后加`的写法：

```js
arr[j + 1] = arr[j] - arr[j + 1];
arr[j] = arr[j] - arr[j + 1];
arr[j + 1] = arr[j + 1] + arr[j];
```

但这两种方式都可能导致`数字越界`，更好的方案是通过`位运算`完成数字交换：

```js
arr[i] = arr[i] ^ arr[j];
arr[j] = arr[j] ^ arr[i];
arr[i] = arr[i] ^ arr[j];
```

## 选择排序

选择排序算是表现最稳定的排序算法之一，因为无论什么数据进去都是`O(n²)`的时间复杂度。

选择排序的思想是：**双重循环遍历数组，每经过一轮比较，找到最小(大)元素的下标，将其交换至首位，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。**

### 动图演示

![选择排序动图演示](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/138a44298f3693e3fdd1722235e72f0f~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 基础实现

```js
function selectionSort(arr, order = 'asc') {
  const len = arr.length;
  let pos = 0;
  console.time('选择排序耗时');
  for (let i = 0; i < len - 1; i++) {
    pos = i;
    for (let j = i + 1; j < len; j++) {
      let condition = order == 'desc' ? arr[pos] < arr[j] : arr[pos] > arr[j];
      if (condition) {
        // 记录最小值的下标
        pos = j;
      }
    }
    [arr[pos], arr[i]] = [arr[i], arr[pos]];
  }
  console.timeEnd('选择排序耗时');
  return arr;
}
```

### 二元选择排序

使用二元选择排序，每轮选择时记录最小值和最大值，可以把数组需要遍历的范围缩小一倍。

```js
function selectionSort(arr, order = 'asc') {
  const len = arr.length;
  let minIndex, maxIndex, temp;
  console.time('二元选择排序耗时');
  for (let i = 0; i < len / 2; i++) {
    minIndex = i;
    maxIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        // 记录最小值的下标
        minIndex = j;
      }
      if (arr[maxIndex] < arr[j]) {
        // 记录最小值的下标
        maxIndex = j;
      }
    }
    // 如果 minIndex 和 maxIndex 都相等，那么他们必定都等于 i，且后面的所有数字都与 arr[i] 相等，此时已经排序完成
    if (minIndex == maxIndex) break;
    // 将最小元素交换至首位
    temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
    // 如果最大值的下标刚好是 i，由于 arr[i] 和 arr[minIndex] 已经交换了，所以这里要更新 maxIndex 的值。
    if (maxIndex == i) maxIndex = minIndex;
    // 将最大元素交换至末尾
    let lastIndex = arr.length - 1 - i;
    temp = arr[lastIndex];
    arr[lastIndex] = arr[maxIndex];
    arr[maxIndex] = temp;
  }
  console.timeEnd('二元选择排序耗时');
  return arr;
}
```

我们使用 `minIndex` 记录最小值的下标，`maxIndex` 记录最大值的下标。每次遍历后，将最小值交换到首位，最大值交换到末尾，就完成了排序。

由于每一轮遍历可以排好两个数字，所以最外层的遍历只需遍历一半即可。

## 插入排序

插入排序的思想非常简单，生活中有一个很常见的场景：在打扑克牌时，我们一边抓牌一边给扑克牌排序，每次摸一张牌，就将它插入手上已有的牌中合适的位置，逐渐完成整个排序。

一般来说，插入排序都采用`in-place`在数组上实现。具体算法描述如下：

1. 从第一个元素开始，该元素可以认为已经被排序；
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描；
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置；
4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置；
5. 将新元素插入到该位置后；
6. 重复步骤 2~5。

### 动图演示

![插入排序](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/f0e1e3b7f95c3888ab2791b6abbfae41~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 基础实现

```js
function insertSort(arr, order = 'asc') {
  const len = arr.length;
  console.time('插入排序耗时：');
  for (let i = 1; i < len; i++) {
    const temp = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }

  console.timeEnd('插入排序耗时：');
  return arr;
}
```

## 希尔排序

1959 年 77 月，美国辛辛那提大学的数学系博士 Donald Shell 在 《ACM 通讯》上发表了希尔排序算法，成为首批将时间复杂度降到 `O(n^2)`以下的算法之一。虽然原始的希尔排序最坏时间复杂度仍然是 `O(n^2)`，但经过优化的希尔排序可以达到 `O(n^{1.3})`甚至 `O(n^{7/6})`。

`希尔排序`本质上是对`插入排序`的一种优化，它利用了`插入排序`的简单，又克服了`插入排序`每次只交换相邻两个元素的缺点。它的基本思想是：

- 将待排序数组按照一定的间隔分为多个子数组，每组分别进行插入排序。这里按照间隔分组指的不是取连续的一段数组，而是每跳跃一定间隔取一个值组成一组。
- 逐渐缩小间隔进行下一轮排序。
- 最后一轮时，取间隔为 1，也就相当于直接使用插入排序。但这时经过前面的「宏观调控」，数组已经基本有序了，所以此时的插入排序只需进行少量交换便可完成。

### 动图演示

对数组 `[84, 83, 88, 87, 61, 50, 70, 60, 80, 99]` 进行希尔排序的过程如下：

- 第一遍（5 间隔排序）：按照间隔 5 分割子数组，共分成五组，分别是 `[84, 50], [83, 70], [88, 60], [87, 80], [61, 99]`。对它们进行插入排序，排序后它们分别变成： `[50, 84], [70, 83], [60, 88], [80, 87], [61, 99]`，此时整个数组变成 `[50, 70, 60, 80, 61, 84, 83, 88, 87, 99]`。

- 第二遍（2 间隔排序）：按照间隔 2 分割子数组，共分成两组，分别是 `[50, 60, 61, 83, 87], [70, 80, 84, 88, 99]`。对他们进行插入排序，排序后它们分别变成： `[50, 60, 61, 83, 87]`, `[70, 80, 84, 88, 99]`，此时整个数组变成 `[50, 70, 60, 80, 61, 84, 83, 88, 87, 99]`。

  **这里有一个非常重要的性质：当我们完成 2 间隔排序后，这个数组仍然是保持 5 间隔有序的。也就是说，更小间隔的排序没有把上一步的结果变坏。**

- 第三遍（1 间隔排序，等于直接插入排序）：按照间隔 1 分割子数组，分成一组，也就是整个数组。对其进行插入排序，经过前两遍排序，数组已经基本有序了，所以这一步只需经过少量交换即可完成排序。排序后数组变成 `[50, 60, 61, 70, 80, 83, 84, 87, 88, 99]`，整个排序完成。

  ![希尔排序](https://pic.leetcode-cn.com/1643081683-ORhiPp-%E5%B8%8C%E5%B0%94%E6%8E%92%E5%BA%8F.gif)

  其中，每一遍排序的间隔在希尔排序中被称之为增量，所有的增量组成的序列称之为增量序列，也就是本例中的 `[5, 2, 1]`。

  增量依次递减，最后一个增量必须为 1，所以`希尔排序`又被称之为`「缩小增量排序」`。要是以专业术语来描述希尔排序，可以分为以下两个步骤：

  ![希尔排序](https://img-blog.csdnimg.cn/ba7c022e8be54129a6777e82ab7a3cc4.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### 代码实现

```js
function shellSort(arr, order = 'asc') {
  const len = arr.length;
  console.time('希尔排序耗时:');
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let groupStartIndex = 0; groupStartIndex < gap; groupStartIndex++) {
      // 内部使用插入排序
      for (
        let currentIndex = groupStartIndex + gap;
        currentIndex < len;
        currentIndex += gap
      ) {
        let temp = arr[currentIndex];
        let preIndex = currentIndex - gap;
        // 条件排序
        while (
          order == 'desc'
            ? preIndex >= groupStartIndex && temp > arr[preIndex]
            : preIndex >= groupStartIndex && temp < arr[preIndex]
        ) {
          arr[preIndex + gap] = arr[preIndex];
          preIndex -= gap;
        }
        arr[preIndex + gap] = temp;
      }
    }
  }
  console.timeEnd('希尔排序耗时:');
  return arr;
}
```

## 归并排序

`归并排序`是建立在归并操作上的一种有效的排序算法。该算法是采用`分治法（Divide and Conquer）`的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为`2-路归并`。

1. 采用`二分法`把长度为 n 的输入序列分成两个长度为 n/2 的子序列；
2. 对这两个子序列分别采用归并排序；
3. 将两个排序好的子序列合并成一个最终的排序序列。

### 动图演示

![归并排序](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/33d105e7e7e9c60221c445f5684ccfb6~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 代码实现

```js
function mergeSort(arr, order = 'asc') {
  const len = arr.length;
  // 如果是单个数组直接返回
  if (len < 2) {
    return arr;
  }
  // 二分法分组
  let middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle);

  return merge(mergeSort(left), mergeSort(right), order);
}

function merge(left, right, order) {
  const result = [];
  console.time('归并排序耗时');
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  while (left.length) {
    result.push(left.shift());
  }

  while (right.length) {
    result.push(right.shift());
  }

  console.timeEnd('归并排序耗时');
  return result;
}
```

## 快速排序

快速排序算法由 `C. A. R. Hoare` 在 1960 年提出。它的时间复杂度也是 `O(nlogn)`，但它在时间复杂度为 `O(nlogn)` 级的几种排序算法中，大多数情况下效率更高，所以快速排序的应用非常广泛。

快速排序算法的基本思想是：

1. 从数组中取出一个数，称之为基数（pivot）
2. 遍历数组，将比基数大的数字放到它的右边，比基数小的数字放到它的左边。遍历完成后，数组被分成了左右两个区域
3. 将左右两个区域视为两个数组，重复前两个步骤，直到排序完成

事实上，快速排序的每一次遍历，都将基数摆到了最终位置上。第一轮遍历排好 1 个基数，第二轮遍历排好 2 个基数（每个区域一个基数，但如果某个区域为空，则此轮只能排好一个基数），第三轮遍历排好 4 个基数（同理，最差的情况下，只能排好一个基数），以此类推。总遍历次数为 `logn～n` 次，每轮遍历的时间复杂度为 `O(n)`，所以很容易分析出快速排序的时间复杂度为 `O(nlogn) ～ O(n^2)`，平均时间复杂度为 `O(nlogn)`。

### 动图演示

![快速排序动图演示](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/dd9dc195a7331351671fe9ac4f7d5aa4~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 基数的选择

基数的选择没有固定标准，随意选择区间内任何一个数字做基数都可以。通常来讲有三种选择方式：

1. 选择第一个元素作为基数
2. 选择最后一个元素作为基数
3. 选择区间内一个随机元素作为基数

### 左右两指针

1. 创建 2 个指针，一个指向头，一个指向尾，再确定一个基准数。

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/7bd3d82899234475a7debda3346fba43.png)

2. 开始第一次的递归处理，尾指针先从右往左扫，扫到第一个小于（注意是小于，而不是小于等于哦）基准数的位置停住，这时候头指针再从左往右扫，扫到第一个大于基准数的位置停住，这时候是下面的图示状态：

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/18127fa8a53a408c87493f8ab9dab0a0.png)

   **注意：这里如果基准数选则数组的第一个数，应该尾指针先从右往左侧扫，若基准数选取为数组最后一个数，应是头指针从左向往右扫）**

   交换两个指针所指的数，成为了下面的状态：

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/6677e063e540404b9f1c415462d12f45.png)

3. 两个数交换完毕，右指针此时指的是`arr[2] = 3`, 左指针指着`arr[1] = 1`；交换完毕后右指针继续从当前位置往左扫，扫到 1 的时候发现和左指针相遇了，那么这个时候就结束左右指针的扫描，左右指针同时指着`arr[1] = 1`，即：

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/81ac965ae287428d8caa55953a4bba0a.png)

   此时退出循环扫描的过程，交换基准数与左右指针同时所指的数的位置，以基准数`arr[0] = 2`, 指针指的是`arr[1] = 1`; 交换过后就变成了：

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/2510f69975cd496ea19ad4c266e41fcb.png)

   这时候就发现基准数已经出现在了它排完序后应该在的位置（排完序后是[1,2,3,5,6,4]，2 出现在了第 2 位）,比这个基准数小的数组出现在了它的左边（[1]出现在了 2 的左边），比基准数大的出现在了它的右边（[3,5,6,4]出现在了 2 的右边）。

4. 之后的过程就是对左右数组的分别递归处理。

   ```js
   var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
   function quickSort(arr, left, right) {
     // 递归的跳出边界，当某个区域只剩下一个数字的时候就不需要排序了，实际上当某个区域只剩下0个数字的时候也需要退出递归函数。
     // 当 middle == left || middle == right 的时候，就会出现某个区域剩余数字为0。
     // 在递归之前，先判断此区域剩余数字是否为 0 个或者 1 个，当数字至少为 2 个时，才执行这个区域的快速排序。
     // 因为我们知道 middle >= left && middle <= right 必然成立，所以判断剩余区域的数字为 0 个或者 1 个也就是指 left 或 right 与 middle 相等或相差 1。
     // 此时条件转化为 left == right || left == right + 1，其他的情况下 left 都小于 right。
     // 此时继续简化为 left >= right
     if (left >= right) {
       return;
     }
     // 构造左右两个指针
     let l = left,
       r = right;
     // 选取第一个数为基数
     let pivot = arr[left];

     // 左右指针相遇的时候退出扫描循环
     while (l < r) {
       // 右指针从右向左扫描，碰到第一个小于基准数的时候停住
       while (l < r && arr[r] >= pivot) {
         r--;
       }
       // 左指针从左向右扫描，碰到第一个大于基准数的时候停住
       while (l < r && arr[l] <= pivot) {
         l++;
       }
       // 交换左右指针所停位置的数
       [arr[l], arr[r]] = [arr[r], arr[l]];
     }

     // 最后交换基准数与指针相遇位置的数
     [arr[left], arr[l]] = [arr[l], arr[left]];

     quickSort(arr, left, l - 1);
     quickSort(arr, l + 1, right);
   }
   console.time('左右2指针快速排序耗时');
   quickSort(arr, 0, arr.length - 1);
   console.timeEnd('左右2指针快速排序耗时');
   ```

## 堆排序

数组、链表都是一维的数据结构，相对来说比较容易理解，而`堆`是二维的数据结构，对抽象思维的要求更高，所以许多程序员「谈堆色变」。但堆又是数据结构进阶必经的一步，我们不妨静下心来，将其梳理清楚。

堆：符合以下两个条件之一的完全二叉树：

- 根节点的值 ≥ 子节点的值，这样的堆被称之为最大堆，或`大顶堆`；
- 根节点的值 ≤ 子节点的值，这样的堆被称之为最小堆，或`小顶堆`。

堆排序过程如下：

- 用数列构建出一个大顶堆，取出堆顶的数字；
- 调整剩余的数字，构建出新的大顶堆，再次取出堆顶的数字；
- 循环往复，完成整个排序。

整体的思路就是这么简单，我们需要解决的问题有两个：

1. 如何用数列构建出一个大顶堆；
2. 取出堆顶的数字后，如何将剩余的数字调整成新的大顶堆。

### 构建大顶堆 & 调整堆

构建大顶堆有两种方式：

- 方案一：从 0 开始，将每个数字依次插入堆中，一边插入，一边调整堆的结构，使其满足大顶堆的要求；
- 方案二：将整个数列的初始状态视作一棵完全二叉树，自底向上调整树的结构，使其满足大顶堆的要求。

实际运用中方案二更为常见：

![初始化](https://assets.leetcode-cn.com/solution-static/912_fig2.gif)

![交换元素](https://assets.leetcode-cn.com/solution-static/912_fig3.gif)

在介绍堆排序具体实现之前，我们先要了解`完全二叉树`的几个性质。将根节点的下标视为 0，则完全二叉树有如下性质：

- 对于完全二叉树中的第 `i` 个数，它的左子节点下标：`left = 2i + 1`;
- 对于完全二叉树中的第 `i` 个数，它的右子节点下标：`right = left + 1`;
- 对于有 `n` 个元素的完全二叉树`(n≥2)`，它的最后一个非叶子结点的下标：`n/2 - 1`;

### 代码实现

```js
function heapSort(arr) {
  console.time('大顶堆排序耗时');
  // 构建初始大顶堆
  buildMaxHeap(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    // 将最大值交换到数组最后
    swap(arr, 0, i);
    // 调整剩余数组，使其满足大顶堆
    maxHeapify(arr, 0, i);
  }
  console.timeEnd('大顶堆排序耗时');

  return arr;
}

// 构建大顶堆
function buildMaxHeap(arr) {
  // 从最后一个非叶子节点开始调整大顶堆，最后一个非叶子节点的下标就是 arr.length / 2 - 1
  // 这里可以优化为位运算 (arr.length >> 1) - 1
  for (let i = Math.floor(arr.length / 2 - 1); i >= 0; i--) {
    maxHeapify(arr, i, arr.length);
  }
}

// 调整大顶堆，第三个参数表示剩余未排序的数字的数量，也就是剩余堆的大小
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

## 计数排序

`计数排序`是一种时间复杂度为 `O(n)` 的排序算法。

**计数排序并不是把计数数组的下标直接作为结果输出，而是通过计数的结果，计算出每个元素在排序完成后的位置，然后将元素赋值到对应位置。**

举个例子，班上有 10 名同学：他们的考试成绩分别是：`7, 8, 9, 7, 6, 7, 6, 8, 6, 6`他们需要按照成绩从低到高坐到 `0～9` 共 10 个位置上。

用计数排序完成这一过程需要以下几步：

- 第一步仍然是计数，统计出：4 名同学考了 6 分，3 名同学考了 7 分，2 名同学考了 8 分，1 名同学考了 9 分；
- 然后从头遍历数组：第一名同学考了 7 分，共有 4 个人比他分数低，所以第一名同学坐在 4 号位置（也就是第 5 个位置）；
- 第二名同学考了 8 分，共有 7 个人（4 + 3）比他分数低，所以第二名同学坐在 7 号位置；
- 第三名同学考了 9 分，共有 9 个人（4 + 3 + 2）比他分数低，所以第三名同学坐在 9 号位置；
- 第四名同学考了 7 分，共有 4 个人比他分数低，并且之前已经有一名考了 7 分的同学坐在了 4 号位置，所以第四名同学坐在 5 号位置。
- ...依次完成整个排序

### 动图演示

![计数排序](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/30/001a78daaa82eae890e54dc91c6a35d1~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

### 基础实现

```js
function countSort(arr) {
  const len = arr.length;
  let result = [],
    temp = [],
    min = (max = arr[0]);
  console.time('计数排序耗时');
  for (let i = 0; i < len; i++) {
    min = min <= arr[i] ? min : arr[i];
    max = max >= arr[i] ? max : arr[i];
    // 往临时数组里面存该值出现的次数
    temp[arr[i]] = temp[arr[i]] ? temp[arr[i]] + 1 : 1;
  }

  for (let j = min; j < max; j++) {
    temp[j + 1] = (temp[j + 1] || 0) + (temp[j] || 0);
  }
  // 从后往前排
  for (let k = len - 1; k >= 0; k--) {
    result[temp[arr[k]] - 1] = arr[k];
    temp[arr[k]]--;
  }

  console.timeEnd('计数排序耗时');
  return result;
}
```

## 桶排序

桶排序是`计数排序`的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。

桶排序的思想是：

- 将区间划分为 n 个相同大小的子区间，每个子区间称为一个桶
- 遍历数组，将每个数字装入桶中
- 对每个桶内的数字单独排序，这里需要采用其他排序算法，如插入、归并、快排等
- 最后按照顺序将所有桶内的数字合并起来

桶排序在实际工作中的应用较少，不仅因为它需要借助于其他排序算法，还因为桶排序算法基于一个假设：**所有输入数据都服从均匀分布，也就是说输入数据应该尽可能地均匀分布在每个桶中**。只有这个假设成立时，桶排序运行效率才比较高。

在最差的情况下，所有数据都会被装入同一个桶中，此时桶排序算法只会徒增一轮遍历。

算法描述和实现:

- 设置一个定量的数组当作空桶；
- 遍历输入数据，并且把数据一个一个放到对应的桶里去；
- 对每个不是空的桶进行排序；
- 从不是空的桶里把排好序的数据拼接起来。

### 代码实现

```js
function bucketSort(arr, num) {
  const len = arr.length;
  if (len <= 1) return arr;
  let buckets = [],
    result = [],
    min = (max = arr[0]),
    regex = '/^[1-9]+[0-9]*$/',
    space,
    n = 0;
  // 兼容num
  num = num || (num > 1 && regex.test(num) ? num : 10);
  console.time('桶排序耗时');
  for (let i = 1; i < len; i++) {
    min = min <= arr[i] ? min : arr[i];
    max = max >= arr[i] ? max : arr[i];
  }
  space = (max - min + 1) / num;
  for (let j = 0; j < len; j++) {
    let index = Math.floor((arr[j] - min) / space);
    // 非空桶
    if (buckets[index]) {
      let k = buckets[index].length - 1;
      while (k >= 0 && buckets[index][k] > arr[j]) {
        buckets[index][k + 1] = buckets[index][k];
        k--;
      }
      buckets[index][k + 1] = arr[j];
    } else {
      // 初始化空桶
      buckets[index] = [];
      buckets[index].push(arr[j]);
    }
  }

  while (n < num) {
    result = result.concat(buckets[n]);
    n++;
  }

  console.timeEnd('桶排序耗时');
  return result;
}
```

## 基数排序

比如我们对 999, 997, 866, 666 这四个数字进行基数排序，过程如下：

- 先看第一位基数：66 比 88 小，88 比 99 小，所以 666 是最小的数字，866 是第二小的数字，暂时无法确定两个以 99 开头的数字的大小关系
- 再比较 99 开头的两个数字，看他们第二位基数：99 和 99 相等，暂时无法确定他们的大小关系
- 再比较 99 开头的两个数字，看他们的第三位基数：7 比 9 小，所以 997 小于 99

基数排序有两种实现方式。本例属于「最高位优先法」，简称 `MSD (Most significant digital)`，思路是从最高位开始，依次对基数进行排序。

与之对应的是`「最低位优先法」`，简称 `LSD (Least significant digital)`。思路是从最低位开始，依次对基数进行排序。使用 LSD 必须保证对基数进行排序的过程是稳定的。

### 动图演示

简单起见，我们先只考虑对非负整数排序的情况。

![基数排序](<https://pic.leetcode-cn.com/1618984043-EyABAp-%E5%9F%BA%E6%95%B0%E7%AE%97%E6%B3%95%20(1).gif>)

基数排序可以分为以下三个步骤：

- 找出数组中最大的数字的位数 maxDigitLength
- 获取数组中每个数字的基数
- 遍历 maxDigitLength 轮数组，每轮按照基数对其进行排序

### LSD 代码实现

```js
function radixSort(arr, max) {
  let mod = 10;
  let dev = 1;
  let counter = [];
  console.time('基数排序耗时');
  for (let i = 0; i < max; i++, dev *= 10, mod *= 10) {
    for (let j = 0; j < arr.length; j++) {
      let bucket = parseInt((arr[j] % mod) / dev);
      if (counter[bucket] == null) {
        counter[bucket] = [];
      }
      counter[bucket].push(arr[j]);
    }
    let pos = 0;
    for (let j = 0; j < counter.length; j++) {
      let value = null;
      if (counter[j] != null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value;
        }
      }
    }
  }
  console.timeEnd('基数排序耗时');
  return arr;
}
```

## 排序算法图片总结

![排序算法图片总结](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/4abde1748817d7f35f2bf8b6a058aa40~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
