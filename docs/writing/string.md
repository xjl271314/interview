---
title: 字符串相关
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 字符串工具

- 2021.11.04

## unicode 相关方法

### charAt()

> charAt(index) 返回在指定位置的字符。

| 参数名 | 是否必填 | 参数描述       |
| :----- | :------: | :------------- |
| index  |   必填   | 索引下标位置。 |

```js
var str = 'HELLO WORLD';
var n = str.charAt(2); // L
```

### charCodeAt()

> charCodeAt(index) 返回指定索引位置字符的 Unicode 值，如果没有的话会返回 NaN。

| 参数名 | 是否必填 | 参数描述       |
| :----- | :------: | :------------- |
| index  |   必填   | 索引下标位置。 |

```js
var str = 'HELLO WORLD';
var n = str.charCodeAt(0); // 72
var nu = str.charCodeAt(-1); // NaN
```

### fromCharCode()

> String.fromCharCode(n1, n2, ..., nX) 接受一个或多个指定的 Unicode 值，然后返回一个字符串。

```js
var n = String.fromCharCode(72, 69, 76, 76, 79); // HELLO

var n1 = String.fromCharCode(65); // A
```

### fromCodePoint()

> ES6 提供了 `String.fromCodePoint()`方法，可以识别大于`0xFFFF`的字符，弥补了`String.fromCharCode()`方法的不足。

```js
String.fromCodePoint(0x20bb7);
// "𠮷"
```

## 字符串拼接

### concat()

> string.concat(string1, string2, ..., stringX) 连接两个或多个字符串。

```js
var str1 = 'Hello ';
var str2 = 'world!';
var n = str1.concat(str2); // Hello world!
```

### padStart()

> string.padStart(maxLength, value) 用于在字符串开头补全指定字符串,字符串总长度不超过 maxLength

| 参数名    | 是否必填 | 参数描述                     |
| :-------- | :------: | :--------------------------- |
| maxLength |   必填   | 索引下标位置。               |
| value     |   可选   | 填充的字符串，如果不填为空格 |

```js
'x'.padStart(5, 'ab'); // 'ababx'
'x'.padStart(4, 'ab'); // 'abax'
'x'.padStart(4); // '   x'
```

### padEnd()

> string.padEnd(maxLength, value) 用于在字符串末尾补全指定字符串

| 参数名    | 是否必填 | 参数描述                     |
| :-------- | :------: | :--------------------------- |
| maxLength |   必填   | 索引下标位置。               |
| value     |   可选   | 填充的字符串，如果不填为空格 |

```js
'x'.padEnd(5, 'ab'); // 'xabab'
'x'.padEnd(4, 'ab'); // 'xaba'

'x'.padEnd(4); // 'x   '
```

## 字符串判断

### startsWith()

> string.startsWith(searchvalue, start)

| 参数名      | 是否必填 | 参数描述                   |
| :---------- | :------: | :------------------------- |
| searchvalue |   必填   | 待搜索的子字符串。         |
| start       |    否    | 查找的开始位置，默认为 0。 |

```js
let str = 'a.jpg';
str.startsWith('a'); // true
str.startsWith('jpg'); // false
str.startsWith('a', 1); // false 相当于 str = str.slice(1);
```

### endsWith()

> string.endsWith(searchvalue, length)

| 参数名      | 是否必填 | 参数描述                                                 |
| :---------- | :------: | :------------------------------------------------------- |
| searchvalue |   必填   | 待搜索的子字符串。                                       |
| length      |    否    | 设置字符串的长度。默认值为原始字符串长度 string.length。 |

```js
let str = 'a.jpg';
str.endsWith('jpg'); // true
str.endsWith('png'); // false
str.endsWith('a', 1); // true 相当于 str = str.slice(0,1);
```

### includes()

> str.includes(searchValue, start) 返回是否找到了参数字符串的布尔值。

| 参数名      | 是否必填 | 参数描述                   |
| :---------- | :------: | :------------------------- |
| searchvalue |   必填   | 待搜索的子字符串。         |
| start       |    否    | 查找的开始位置，默认为 0。 |

```js
const str = 'Hello world!';

str.includes('o'); // true
```

## 字符串检索

### indexOf()

> string.indexOf(searchvalue,start) 返回某个指定的字符串值在字符串中首次出现的位置。

| 参数名      | 是否必填 | 参数描述                                                                                                                       |
| :---------- | :------: | :----------------------------------------------------------------------------------------------------------------------------- |
| searchvalue |   必填   | 待搜索的子字符串。                                                                                                             |
| start       |    否    | 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 `0` 到 `length - 1`。如省略该参数，则将从字符串的首字符开始检索。 |

```js
var str = 'Hello world, welcome to the universe.';
var n = str.indexOf('welcome'); // 13

var str2 = 'abba';
str2.indexOf('a'); // 0
```

### includes()

> string.includes(searchvalue, start) 用于判断字符串是否包含指定的子字符串。

| 参数名      | 是否必填 | 参数描述                                 |
| :---------- | :------: | :--------------------------------------- |
| searchvalue |   必填   | 待搜索的子字符串。                       |
| start       |    否    | 可选。设置从那个位置开始查找，默认为 0。 |

```js
var str = 'Hello world, welcome to the Runoob。';
var n = str.includes('world'); // true

var str2 = 'aabbcc';
str2.includes('a', 2); // false
```

### lastIndexOf()

> string.lastIndexOf(searchvalue,start) 返回一个指定的字符串值最后出现的位置。

| 参数名      | 是否必填 | 参数描述                                                                           |
| :---------- | :------: | :--------------------------------------------------------------------------------- |
| searchvalue |   必填   | 待搜索的子字符串。                                                                 |
| start       |    否    | 可选。设置从那个位置开始查找，如省略该参数，则将从字符串的最后一个字符处开始检索。 |

```js
var str = 'I am from runoob，welcome to runoob site.';
str.lastIndexOf('runoob'); // 28

var str2 = 'aaabbbbcccaaa';
str2.lastIndexOf('c', 3); // -1
```

### match()

> string.match(regexp) 在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。

| 参数名 | 是否必填 | 参数描述                 |
| :----- | :------: | :----------------------- |
| regexp |   必填   | 匹配规则的 RegExp 对象。 |

```js
var str = 'The rain in SPAIN stays mainly in the plain';
str.match(/ain/g); // ain,ain,ain

function is_weixn() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}
```

### matchAll()

> string.matchAll(regexp) 与 match 相同，差异在于默认就是`/g(全局匹配)`。

| 参数名 | 是否必填 | 参数描述                 |
| :----- | :------: | :----------------------- |
| regexp |   必填   | 匹配规则的 RegExp 对象。 |

### search()

> string.search(searchvalue) 检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。

| 参数名      | 是否必填 | 参数描述                     |
| :---------- | :------: | :--------------------------- |
| searchvalue |   必填   | 查找的字符串或者正则表达式。 |

```js
var str = 'Mr. Blue has a blue house';
str.search('blue');
```

## 字符串修改

### repeat()

> string.repeat(count) 将字符串复制指定次数。

| 参数名 | 是否必填 | 参数描述         |
| :----- | :------: | :--------------- |
| count  |   必填   | 需要复制的次数。 |

```js
var str = 'aabb';
str.repeat(2); // aabbaabb
```

### replace()

> string.replace(searchvalue,newvalue) 使用指定字符替换搜索字符，或使用正则表达式匹配后进行替换。

| 参数名      | 是否必填 | 参数描述                     |
| :---------- | :------: | :--------------------------- |
| searchvalue |   必填   | 待搜索的字符串或 RegExp 对象 |
| newvalue    |   必填   | 进行替换的值                 |

replace 函数的第二个参数 newvalue 比较特殊，它有一下几个特殊字符串：

- $$ 直接量符号(就是当做'$$'字符用)
- $& 与正则相匹配的字符串
- $` 匹配字符串左边的字符
- $’ 匹配字符串右边的字符
- `$1,$2,$,3,…,$n` 匹配结果中对应的分组匹配结果

想要消除$的影响可以写成函数的返回值，函数具有一下几个参数：

- 第一个参数：匹配到的字符串
- 中间的参数：如果正则使用了分组匹配就为多个否则无此参数
- 倒数第二个参数：匹配字符串的对应索引位置
- 最后一个参数：原始字符串

```js
var str = 'hello world!';
str.replace('hello', 'Hello'); // Hello world!

/**
 * 千分位格式化数字
 *
 * @param  {Number|String} number 数字
 * @param  {Number} decimals >=0 小数位数; <0 不新增只保留原小数,并且不保留最后一个0
 * @returns {String}
 */
const formatNumber = (number, decimals = 2) => {
  const num = Number.parseFloat(number);
  const bit = Math.max(0, Math.min(decimals, 2)); // 小数位数最多二位；
  const ret = num.toFixed(bit);

  return ret.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
};
```

### replaceAll()

> replaceAll(regexp|substr, newSubstr|function) 使用指定字符串或者正则替换所有匹配到的子字符串。ES12 中出现的方法。

| 参数名              | 是否必填 | 参数描述                                   |
| :------------------ | :------: | :----------------------------------------- |
| regexp、substr      |   必填   | 规定子字符串或要替换的模式的 RegExp 对象。 |
| newSubstr、function |   必填   | 替换文本或生成替换文本的函数               |

```js
const fruits = '🍎+🍐+🍓+';
const fruitsWithBanana = fruits.replaceAll('+', '🍌');
console.log(fruitsWithBanana); //🍎🍌🍐🍌🍓🍌
```

### trim()

> trim() 删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。

```js
const fruits = ' a11223\t';
fruits.trim(); // a11223
```

### trimStart()

> trimStart() ES2019 新增，用于消除字符串首部的空格，返回新字符串，不会修改原始字符串。

```js
const s = '  abc  ';

s.trim(); // "abc"
s.trimStart(); // "abc  "
```

### trimEnd()

> trimEnd() ES2019 新增，用于消除字符串末尾的空格，返回新字符串，不会修改原始字符串。

```js
const s = '  abc  ';

s.trim(); // "abc"
s.trimEnd(); // "  abc"
```

## 字符串提取

### slice()

> slice(start, end) 方法可提取字符串的某个部分，并以新的字符串返回被提取的部分。

| 参数名 | 是否必填 | 参数描述                                                                   |
| :----- | :------: | :------------------------------------------------------------------------- |
| start  |   必填   | 截取的子串的起始下标，第一个字符位置为 0。如果为负数，则从尾部开始截取。   |
| end    |   可选   | 截取的子串的终止坐标，如果不传则默认到结尾。如果为负数，则从尾部开始截取。 |

```js
const str = '112233';
const str2 = str.slice(2); // 2233 str并不会改变
```

### split()

> string.split(separator,limit) 用于把一个字符串分割成字符串数组。

| 参数名    | 是否必填 | 参数描述                                               |
| :-------- | :------: | :----------------------------------------------------- |
| separator |   可选   | 字符串或正则表达式，从该参数指定的地方分割。           |
| limit     |   可选   | 默认整个字符串。如果设置了长度则返回数组数不大于该长度 |

```js
const fruits = '🍎+🍐+🍓+';
fruits.split(); // ['🍎+🍐+🍓+']
fruits.split('+'); // ['🍎', '🍐', '🍓', '']
fruits.split('+', 2); // ['🍎', '🍐']
```

## 字符串截取

### substr()

> substr(from, length) 从指定下标开始截取指定长度的字符

| 参数名 | 是否必填 | 参数描述                                     |
| :----- | :------: | :------------------------------------------- |
| from   |   必填   | 字符串起始的位置                             |
| length |   可选   | 默认整个字符串。如果设置了长度则返回指定长度 |

```js
var str = 'Hello world!';
str.substr(6); // world!
```

### substring()

> substring(from, to) 返回从指定起始位置到结尾位置(不包含)的子串

| 参数名 | 是否必填 | 参数描述                         |
| :----- | :------: | :------------------------------- |
| from   |   必填   | 字符串起始的位置                 |
| to     |   可选   | 字符串终止的位置，默认是到结尾。 |

```js
var str = 'Hello world!';
str.substring(6); // world!
str.substring(0, 5); // Hello
```

## 大小写转换

### toLowerCase()

> string.toLowerCase() 将字符串所有字母转化为小写。

```js
const str = 'ABCD';
str.toLowerCase(); // abcd
```

### toUpperCase()

> string.toUpperCase() 将字符串所有字母转化为大写。

```js
const str = 'abcd';
str.toUpperCase(); // ABCD
```

## 原始值获取

### valueOf()

> string.valueOf() 返回某个字符串对象的原始值

```js
const str = '112233';
str.valueOf(); // 112233
```

### toString()

> string.toString() 返回某个字符串对象的原始值

## 扩展功能

### 生成随机的 id

```js
// 接收一个长度
const RandomId = (len) => Math.random().toString(36).substr(3, len);

RandomId(); // 'rvojoba0dd'
RandomId(6); // 'zdgqm9'
```

### 生成随机颜色值

```js
const RandomColor = () =>
  '#' +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, '0');
const color = RandomColor(); // '#f1a296'
```

### 操作 URL 查询参数

```js
const params = new URLSearchParams(location.search.replace(/\?/gi, '')); // location.search = "?name=young&sex=male"
params.has('young'); // true
params.get('sex'); // "male"
```

### 字符串首字母转成大写

```js
const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('');

capitalize('fooBar'); // 'FooBar'
capitalize('fooBar', true); // 'FooBar'
```

### 每个单词首字母转换成大写字母

```js
const capitalizeEveryWord = (str) =>
  str.replace(/\b[a-z]/g, (char) => char.toUpperCase());

capitalizeEveryWord('hello world!'); // 'Hello World!'
```

## 字符串遍历接口

ES6 为字符串添加了 `for ... of`循环遍历。在之前字符串一般使用`for`循环进行遍历，这与`for`循环最大的区别就是可以识别大于**0xFFFF**的码点。

```js
const str = '🍎🍌🍓🌰';

// 为什么是8呢？unicode16编码导致，Where ECMAScript operations interpret String values, each element is interpreted as a single UTF-16 code unit.
const len = str.length; // 8

// 使用 for 循环打印字符串，字符串会按照 JS 理解的每个“元素”遍历，辅助平面的字符将会被识别成两个“元素”，于是出现“乱码”。
for (let i = 0; i < len; i++) {
  console.log(str[i]); // � � � � � � � �
}

// for...of循环可以正常输出
for (const char of str) {
  console.log(char); // 🍎 🍌 🍓 🌰
}
```

**如何获得上述代码 `length` 正确的长度呢?**

- 使用扩展运算符

```js
const str = '🍎🍌🍓🌰';
[...str].length; // 4
```

## 模板字符串

```js
function fn() {
  return 'Hello World';
}

`foo ${fn()} bar`;
// foo Hello World bar
```

如果大括号中的值不是字符串，将按照一般的规则转为字符串。比如，大括号中是一个对象，将默认调用对象的`toString`方法。
