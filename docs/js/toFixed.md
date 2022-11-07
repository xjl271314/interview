---
title: toFixed运算
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# toFixed 运算精度不准问题

- 2022.01.14

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n网上可能流传着 `toFixed`是采用`银行家算法`进行计算的，实际上并不是这样的。';

export default () => <Info type="warning" txt={txt} />;
```

## 银行家算法

> 这是一种 `四舍六入五考虑，五后非零就进一，五后为零看奇偶，五前为偶应舍去，五前为奇要进一`的算法。

具体的来说就是：

- 当舍去位的数值 `≤4` 时直接舍去
- 当舍去位的数值 `≥6` 时需要进一
- 当舍去位的数值 `=5` 时，需要进行前后数值的判断
  - 当 5 后面`有非零数字`时，舍 5 入 1(例如 1.000051 ---> 1.00006)
  - 当 5 后面`无有效数字`时，需要根据前面的数进行判断
    - 5 前面的数是`偶数`的话，直接舍去
    - 5 前面的数是`奇数`的话，舍 5 进 1

例如下面的几个示例:

```js
(3.123454).toFixed(5); // 3.12345 满足预期
(3.123456).toFixed(5); // 3.12346 满足预期
(3.123455).toFixed(5); // 3.12345 不满足银行家算法(舍去为5，后无有效数字，前面是奇数，舍5进1)预期 测试环境Chrome 版本 97.0.4692.71
(3.123465).toFixed(5); // 3.12346 不满足银行家算法(舍去为5，后无有效数字，前面是偶数，舍去)预期 测试环境Chrome 版本 97.0.4692.71
(3.1234551).toFixed(5); // 3.12346 满足预期，满足银行家算法(舍去为5，后有非零数字，舍5入1) 测试环境Chrome 版本 97.0.4692.71
```

那么究竟是按照什么方式去处理的呢?

## ECMAScript 官方标准

**Number.prototype.toFixed(fractionDigits)**

> `toFixed`方法返回了一个包含此 `Nmber` 值的`字符串`，内部采用了`十进制`定点表示法表示，小数点后有指定 `fractionDigits` 位数的小数，如果该参数未传的话，默认会使用 `0`，即保留整数。

具体会按照下列的步骤执行:

1. 将当前的 number 值赋值给变量 x。
2. 执行 ReturnIfAbrupt(x) 方法，检验参数的类型
   - 如果参数是一个 abrupt completion(break，continue，return or throw)类型， 那么返回该参数。
   - 如果参数是一个 Completion Record，那么将使用该参数。
3. 定义一个方法 f 执行 ToInteger(fractionDigits)。这时如果未指定小数位数会将其赋值为 0.
   1. 执行 toNumber(number)方法
   2. 执行 ReturnIfAbrupt(number)
   3. 如果 number is NaN, return +0.
   4. If number is +0, −0, +∞, or −∞, return number.
   5. 返回 floor(abs(number)).
4. 执行 ReturnIfAbrupt(f) 方法，检验参数的类型
5. 如果 f<0 或者 f > 20，抛出一个 RangeError 错误 ❌。(实际上允许实现扩展 f<0 或者 f > 20 时的行为。在这种情况下不一定会抛出异常。)
6. 如果变量 x 是 NaN, 则返回 NaN。
7. 定义 s 为空字符串
8. 如果 x < 0 的话
   1. 将 s 赋值 为 `-`(负号)
   2. 将 x 赋值为 -x
9. 如果 x ≥ 10<sup>21</sup>，定义变量 m 为 ToString(x).
10. 否则的话 x < 10<sup>21</sup>
    a. 设 n 为一个整数，其中 n ÷ 10<sup>f</sup> – x 的精确数学值尽可能的接近于 0。如果有两个这样的 n 的话，则选择较大的 n。
    b. 如果 n = 0，则让 m 为 String 类型的 0。否则，让 m 是由 n 的十进制表示的数字组成的字符串(按顺序排列，没有前导 0)
    c. 如果 f ≠ 0：
    1. 定义一个 k 为 m 中的元素数
    2. 如果 k ≤ f：
       1. 设 z 是由代码单元 0x0030 的 f+1–k 次出现组成的字符串
       2. 设 m 是字符串 z 和 m 的串联。
       3. 令 k = f + 1.
    3. 设 a 为 m 的前 k - f 个元素，设 b 为 m 的其余 f 个元素。
    4. 设 m 是三个字符串 `a`, `.`, `b`串联的结果。
11. 返回字符串 s 和 m 的结果。

12. (1000000000000000128).toString() returns "1000000000000000100", while(1000000000000000128).toFixed(0) returns "1000000000000000128".

按照上面的执行方式，我们来试验一下:

```js
(2.55).toFixed(1) = 2.5;
```

首先 x 为 2.55，小于 `10`<sup>21</sup>，f 为 1，要使 n ÷ 10<sup>f</sup> – x 的精确数学值尽可能的接近于 0，取 n 为 25 和 26.

```js
25 / 10 - 2.55; // -0.04999999999999982
26 / 10 - 2.55; // 0.050000000000000266
```

因此最接近的为 25，此时 m 为 25，k 为 2， k-f 为 1，故 a 为 2，b 为 5，所以结果是 2.5。

[官方原文](https://262.ecma-international.org/6.0/#sec-number.prototype.tofixed)

## 解决方案

### Math.round

**该方法采用`传统的四舍五入`方案，存在一定局限性(仅适用于正数的格式化，无法处理负数，处理 1.335.toFixed(2)也存在问题)**

- 自定义方法

  ```js
  function toFixed(number, count) {
    if (count > 20 || count < 0) {
      throw new RangeError('toFixed() count argument must be between 0 and 20');
    }

    if (typeof number !== 'number') {
      throw new Error('传入的第一个参数类型必须为number');
    }
    // 默认参数为0
    if (isNaN(count) || count === null) {
      count = 0;
    }
    // 传统四舍五入
    let result = String(
      Math.round(Math.pow(10, count) * number) / Math.pow(10, count),
    );

    // 假设是整数
    if (result.indexOf('.') == -1) {
      if (count != 0) {
        result += '.';
        result += new Array(count + 1).join('0');
      }
    } else {
      let arr = result.split('.');
      if (arr[1].length < count) {
        arr[1] += new Array(count - arr[1].length + 1).join('0');
      }
      result = arr.join('.');
    }
    return result;
  }
  ```

- 重写原型方法

  ```js
  Number.prototype.toFixed = function (count) {
    'use strict';
    if (count > 20 || count < 0) {
      throw new RangeError('toFixed() count argument must be between 0 and 20');
    }
    if (typeof this !== 'number') {
      throw new Error('toFixed的参数类型必须为number');
    }
    // 默认参数为0
    if (isNaN(count) || count === null) {
      count = 0;
    }
    // 传统四舍五入
    let result = String(
      Math.round(Math.pow(10, count) * this) / Math.pow(10, count),
    );

    // 假设是整数
    if (result.indexOf('.') == -1) {
      if (count != 0) {
        result += '.';
        result += new Array(count + 1).join('0');
      }
    } else {
      let arr = result.split('.');
      if (arr[1].length < count) {
        arr[1] += new Array(count - arr[1].length + 1).join('0');
      }
      result = arr.join('.');
    }
    return result;
  };
  ```

### 自定义方法

按照数学中的四舍五入法通过截取字符串进行判断是进一还是舍去。

- 自定义方法

  ```js
  function toFixed(number, count) {
    if (count > 20 || count < 0) {
      throw new RangeError('toFixed() count argument must be between 0 and 20');
    }

    if (typeof number !== 'number') {
      throw new Error('传入的第一个参数类型必须为number');
    }
    // 默认参数为0
    if (isNaN(count) || count === null) {
      count = 0;
    }
    // 判断是正数还是负数
    let flag = 0;
    number = number.toString();
    if (number[0] == '-') {
      flag = 1;
      number = number.slice(1);
    }
    // 判断是否有小数点
    if (number.indexOf('.') > -1) {
      let interger = number.split('.')[0];
      let decimal = number.split('.')[1];
      // 判断小数位数与保留位数的差异位数
      // 不满足的情况下在末尾添0
      if (decimal.length <= count) {
        decimal += new Array(count - decimal.length).fill('0').join('');
        // 不满足的情况下 可以直接return格式化后的数值
        return `${flag ? '-' : ''}${interger}.${decimal}`;
      }
      // 这里处理 25.667.toFixed(2)等场景
      // digit为需要四舍五入的那位
      let digit = decimal[count];
      if (digit >= 5) {
        // 区分 （1.2).toFixed(0)等1位小数场景
        if (count > 0) {
          decimal =
            decimal.slice(0, count - 1) + (Number(decimal[count - 1]) + 1);
        } else {
          interger = Number(interger) + 1;
          decimal = '';
        }
      } else {
        if (count > 0) {
          decimal = decimal.slice(0, count);
        } else {
          decimal = '';
        }
      }
      return `${flag ? '-' : ''}${interger}${
        decimal != '' ? `.${decimal}` : ''
      }`;
    } // 不包含小数点，直接在末尾补0即可
    else {
      return (
        `${flag ? '-' : ''}${number}${count ? '.' : ''}` +
        new Array(count).fill('0').join('')
      );
    }
  }
  ```
