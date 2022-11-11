---
title: CSS前沿技术
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# CSS 前沿特性

- 2022.02.18

## CSS 现代伪类选择器

<img src="https://img-blog.csdnimg.cn/0e5547791da5460693af460f90986dda.png" width="400px" />

### :is 与 :where

```jsx
/**
 * inline: true
 */
import React from 'react';
import { CSSWhere } from 'interview';

export default () => <CSSWhere />;
```

```js
import React from 'react';
import styles from './index.less';

export default function () {
  return (
    <main className={styles.main}>
      <p className={styles.p}>文本</p>
    </main>
  );
}

.main .p {
  color: green;
}

:is(.main) .p {
  color: purple;
}

:where(.main) .p {
  color: red;
}
```

上述代码后，最终 `<p>`标签的颜色为`purple`;

原因是虽然两者都是针对同个元素的样式声明，但是 `:where()`的优先级总是为 0，`:is()`的优先级是由选择器中优先级最高的选择器决定，简单的理解就是:

```css
/* 只计算.p的权重，where条件内的不计算权重 */
:where(.main) .p {
  ...;
}

/* 计算 .main .p的权重 */
:is(.main) .p {
  ...;
}
```

### :not 与 :has

目前(2021-06-11) `Igalia 公司`正在为 `Chrome` 实现该选择器，其团队成员 `Brian Kardell` 新发表的[《Can I :has()》](https://bkardell.com/blog/canihas.html)文章中对 `:has()` 选择器进行了详细的阐述。 ​

```jsx
import React from 'react';
import { CSSHas } from 'interview';

export default () => <CSSHas />;
```

### :empty 与 :blank

`:empty` 和 `:blank` 两个伪类选择器可以帮助我们避免在针对元素写了一套 ui 之后，但是元素的数据为空的场景。

这两个选择器都很有用： ​

- 给空元素添加样式
- 创建空的状态

```html
<!-- 空元素 -->
<div class="error"></div>
<div class="error"><!-- 注释 --></div>

<!-- 非空元素 -->
<div class="error"></div>
<!-- 中间有一个空格符 -->
<div class="error"></div>
<!-- 断行 -->
<div class="error">
  <!-- 注释 -->
</div>
<!-- 注释断行排列 -->
<div class="error"><span></span></div>
```

`:empty` 和 `:blank` 相比，`:empty` 只能选中没有子元素的元素。子元素只可以是元素节点或文本（包括空格）。注释或处理指令都不会产生影响。 ​

`:blank` 要比 `:empty` 灵活地多，只要该元素中无任何子元素都能被识别。不过 W3C 规范对该伪类选择器的定义更趋向于作用到表单控件中，比如用户没有在 `input` 或 `textarea` 中输入内容时，提交表单能被识别到。有点类似于表单验证的功能。 ​

```jsx
import React from 'react';
import { CSSEmpty } from 'interview';

export default () => <CSSEmpty />;
```
