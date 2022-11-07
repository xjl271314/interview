---
title: CSS中的文本换行
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# 如何实现文本自动换行?

- 2021.07.12

## white-space

> `white-space` 用于处理元素中的空白符，默认情况下属性是`normal`。

`white-space`完整的属性列表如下:

| 属性     | 描述                                                                                                                     |
| :------- | :----------------------------------------------------------------------------------------------------------------------- |
| normal   | 默认属性。**`空白会被浏览器忽略`**，自适应容器边界进行换行。                                                             |
| nowrap   | **`文本不会换行`**，直到文本结束或者遭遇`<br>`标签对象才换行。常配合`overflow`属性进行内容隐藏。                         |
| pre      | **`文本不会换行，空白会被浏览器保留`**。其行为方式类似 `HTML` 中的`<pre>`标签。可以不再写`<pre>`也能达到保留空格的效果。 |
| pre-wrap | **`保留空格换行`**，直到文本结束或者遭遇`<br>`标签对象或者自适应容器边界进行换行。                                       |
| pre-line | **`合并空格换行`**，直到文本结束或者遭遇`<br>`标签对象或者自适应容器边界进行换行。                                       |
| inherit  | **`继承父元素的属性`**。                                                                                                 |

```jsx
import React from 'react';
import { CSSWrapNormal } from 'interview';

export default () => <CSSWrapNormal />;
```

上述代码我们使用了`white-space: nowrap`让文本不进行换行。

## word-break

> `word-break` 主要针对的是字母单词的文本，对中文使用意义不大。

`word-break`完整的属性列表如下:

| 属性      | 描述                                                          |
| :-------- | :------------------------------------------------------------ |
| normal    | 默认属性。使用浏览器默认的换行规则                            |
| beak-all  | 比较暴力，允许在单词内换行                                    |
| beak-word | 会先另起一行，如果还是排不下才会从单词中间截断(不是 CSS 标准) |
| keep-all  | 只能在半角空格或连字符处换行                                  |

```jsx
import React from 'react';
import { CSSWrapBreak } from 'interview';

export default () => <CSSWrapBreak />;
```

## word-wrap

> `word-wrap` 主要用于对长单词进行截断换行，现已更名为`overflow-wrap`，主要是针对`word-break:break-word;`未纳入标准，其作用与其相似。

`word-wrap`完整的属性列表如下:

| 属性      | 描述                                |
| :-------- | :---------------------------------- |
| normal    | 默认属性。只在允许的断字点换行      |
| beak-word | 允许在长单词或 URL 地址内部截断换行 |

```jsx
import React from 'react';
import { CSSWrapBreakWrap } from 'interview';

export default () => <CSSWrapBreakWrap />;
```

## line-break

> `line-break`用来处理如何断开（break lines）带有标点符号的中文、日文或韩文（CJK）文本的行。

`line-break`完整的属性列表如下:

| 属性     | 描述                                                                                |
| :------- | :---------------------------------------------------------------------------------- |
| auto     | 默认属性。使用浏览器默认的断行规则分解文本。                                        |
| loose    | 使用尽可能松散（least restrictive）的断行规则分解文本。一般用于短行的情况，如报纸。 |
| normal   | 使用最一般（common）的断行规则分解文本。                                            |
| strict   | 使用最严格（stringent）的断行原则分解文本。                                         |
| anywhere | 允许在任意地方换行。                                                                |

```jsx
import React from 'react';
import { CSSLineBreak } from 'interview';

export default () => <CSSLineBreak />;
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '由于该技术的规格不稳定，请查看各种浏览器的兼容性表格以供使用。另外请注意，随着规范的变化，实验技术的语法和行为在未来版本的浏览器中可能会发生变化。';

export default () => <Info type="warning" txt={txt} />;
```

![line-break](https://img-blog.csdnimg.cn/20210713152551134.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 总结

- 针对所有的元素

```css
div {
  /* 或者根据自己保留空格的情况 */
  white-sapce: normal;
  word-wrap: break-word;
}
```

- 针对元素在边界强换行拆分单词

```css
div {
  /* 或者根据自己保留空格的情况 */
  white-sapce: normal;
  word-break: break-all;
  line-break: anywhere;
}
```
