---
title: 判断一个数是否为素数
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 判断一个数是否为素数

- 2022.06.23

## 定义

约数只有 1 和本身的整数称为质数，或称素数。

## 实现

### 定义法

如果这个数小于等于 1 那么返回 false，否则从 2 开始遍历到这个数，如果用这个数去除以 i 等于 0 的结果只有 1 个的话 那么就是素数。

```js
// 时间复杂度O(n) 空间复杂度O(1)
function isPrimeNumber(n) {
  if (n <= 1) return false;
  let count = 0;
  for (let i = 2; i <= n; i++) {
    if (n % i == 0) count++;
  }

  return count == 1;
}
```

### 定义法改进

当一个数 n 为质数的时候其中的一个约数为 1 另一个数大约 sqrt(n)，如果存在一个约数从 2 开始小于 sqrt(n)则不是质数。

- 2 是质数 其中 约数为 1 和 2
- 3 是质数 其中约数为 1 和 3
- 5 是质数 其中约数为 1 和 5
- 8 不是质数 其中约数为 1 2 4 8
- ...

```js
12 = 2 × 6
12 = 3 × 4
12 = Math.sqrt(12) × Math.sqrt(12)
12 = 4 × 3
12 = 6 × 2
```

```js
// 时间复杂度O(sqrt(n)) 空间复杂度O(1)
function isPrimeNumber(n) {
  if (!n || n <= 1) return false;
  const end = Math.sqrt(n);
  for (let i = 2; i <= end; i++) {
    if (n % i == 0) return false;
  }
  return true;
}
```

### 特殊法

一个关于质数分布的规律：大于等于 5 的质数一定和 6 的倍数相邻。例如 5 和 7，11 和 13,17 和 19 等等；

令`x≥1`，将大于等于 5 的自然数表示如下：

······ 6x-1，6x，6x+1，6x+2，6x+3，6x+4，6x+5，6(x+1），6(x+1)+1 ······

不在 6 的倍数两侧，即 6x 两侧的数为 6x+2，6x+3，6x+4，由于 2(3x+1)，3(2x+1)，2(3x+2)，所以它们一定不是素数，再除去 6x 本身，显然，素数要出现只可能出现在 6x 的相邻两侧。

此时判断质数可以 6 个为单元快进，即将循环中 i++步长加大为 6，加快判断速度，原因是，假如要判定的数为 n，则 n 必定是 6x-1 或 6x+1 的形式，对于循环中 6i-1，6i，6i+1,6i+2，6i+3，6i+4，其中如果 n 能被 6i，6i+2，6i+4 整除，则 n 至少得是一个偶数，但是 6x-1 或 6x+1 的形式明显是一个奇数，故不成立；

另外，如果 n 能被 6i+3 整除，则 n 至少能被 3 整除，但是 6x 能被 3 整除，故 6x-1 或 6x+1（即 n）不可能被 3 整除，故不成立。综上，循环中只需要考虑 6i-1 和 6i+1 的情况，即循环的步长可以定为 6，每次判断循环变量 k 和 k+2 的情况即可，理论上讲整体速度应该会是方法（2）的 3 倍。代码如下：

```js
function isPrimeNumber(n) {
  if (!n || n <= 1) return false;
  if (n == 2 || n == 3) return true;
  // 不在6的倍数的2侧的肯定不是
  if (n % 6 != 1 && n % 6 != 5) {
    return false;
  }
  const end = Math.sqrt(n);
  for (let i = 5; i <= end; i += 6) {
    if (n % i == 0 || n % (i + 2) == 0) return false;
  }
  return true;
}
```
