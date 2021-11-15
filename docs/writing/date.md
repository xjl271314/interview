---
title: 日期函数相关
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 日期函数

- 2021.11.03

## UTC 和 GMT 及 北京时间的关系

- `GMT` 即`「格林威治标准时间」(Greenwich Mean Time，简称G.M.T.)`，指位于英国伦敦郊区的皇家格林威治天文台的标准时间，因为本初子午线被定义为通过那里的经线。然而由于地球的不规则自转，导致 GMT 时间有误差，因此目前已不被当作标准时间使用。

- `UTC` 是最主要的世界时间标准，是经过平均太阳时(以格林威治时间 GMT 为准)、地轴运动修正后的新时标以及以「秒」为单位的国际原子时所综合精算而成的时间。UTC 比 GMT 来得更加精准。其误差值必须保持在 0.9 秒以内，若大于 0.9 秒则由位于巴黎的国际地球自转事务中央局发布闰秒，使 UTC 与地球自转周期一致。不过日常使用中，GMT 与 UTC 的功能与精确度是没有差别的，我们默认两者是相等的。

- `北京时间`：因为时区的问题北京时间和 UTC 时间有这样的关系 `北京时间 = UTC + 8`。

## Date 来源

> `ECMAScript` 中的 `Date` 类型是在早期 `Java` 中的 `java.util.Date` 类基础上构建的。为此 `Date` 类型使用自 `UTC ( Coordinated Universal Time, 国际协调时间)1970年1月1日午夜(零时)`开始经过的毫秒数来保存日期。在使用这种数据存储格式的条件下，`Date()`类型保存的日期能够精确到 1970 年 1 月 1 日之前或之后的 100 000 000 年。

**因此我们经常定义的`Date()` 返回的是从 UTC 时间 1970 年 1 月 1 日午夜至指定时间经过的毫秒数的大小。是一个 13 位数的数字，和 unix 时间戳相差 1000 倍。**

## Date 使用

### toString()

在调用 `Date` 构造函数而不传递参数的情况下，新创建的对象自动获取当前日期和时间。如果想要根据指定的日期和时间创建对象，必须传入该日期的毫秒数。

```jsx
/**
 * inline: true
 */
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>{date.toString()}</h1>
      <Button onClick={() => setDate(new Date())}>刷新当前时间</Button>
    </div>
  );
};

export default App;
```

### Date.parse() 与 Date.UTC()

这两个函数会根据我们传入的参数来自动计算出毫秒数的大小。

- Date.parse()

> 接受一个表示日期的字符串参数，然后尝试根据这个字符串返回相应的毫秒数，如果传入的字符串不能表示将日期则返回`NaN`。

```js
Date.parse('11-1, 2021');
Date.parse('11 1, 2021'); // 1635696000000
```

- Date.UTC()

> 它的参数分别是年份，基于 0 的月份(0 到 11)，日(1 到 31)，小时(0 到 23)，分钟，秒以及毫秒数。这些参数里边只有前两个参数是必需的，如果没有提供日值，则默认日值为 1，其余参数未指定则默认为 0。

```js
Date.UTC(2021, 10, 1); // 1635724800000
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  'UTC 日期指的是在没有时区偏差的情况下(将日期转换为GMT时间)的日期值。\n\n`Date.parse()` 方法是基于本地时区建立的，而 `Date.UTC()` 方法是基于无时区偏差建立的。\n\n所以如果我们对两个方法传入相同的时间，我们会发现 `Date.parse()` 方法得到的毫秒数相对于 `Date.UTC()` 方法得到的毫秒数会多`八个小时`的毫秒数(这里的本地时区指的是北京时间)。';

export default () => <Info type="warning" txt={txt} />;
```

### Date.now()

> `Date.now()` 会返回当前日期的时间戳。

```jsx
/**
 * inline: true
 */
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(Date.now());

  return (
    <div>
      <h1>当前时间戳：{date.toString()}</h1>
      <Button onClick={() => setDate(Date.now())}>获取当前时间戳</Button>
    </div>
  );
};

export default App;
```

## 日期格式化

### toLocalString()

> 按照浏览器设置的时区对应格式返回日期和时间。时间格式中会包含 AM 和 PM，但不会包含时区信息，具体的格式会因浏览器而异。

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>toLocaleString：{date.toLocaleString()}</h1>
      <Button onClick={() => setDate(new Date())}>获取当前时间戳</Button>
    </div>
  );
};

export default App;
```

### toDateString()

> 以特定的格式显示星期几、月、日和年；

```jsx
import React, { useState } from 'react';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>toDateString：{date.toDateString()}</h1>
    </div>
  );
};

export default App;
```

### toTimeString()

> 以特定的格式显示时、分、秒和时区；

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>toTimeString：{date.toTimeString()}</h1>
      <Button onClick={() => setDate(new Date())}>获取当前时间戳</Button>
    </div>
  );
};

export default App;
```

### toLocaleDateString()

> 以特定于地区的格式显示星期几、月、日和年；

```jsx
import React, { useState } from 'react';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>toLocaleDateString：{date.toLocaleDateString()}</h1>
    </div>
  );
};

export default App;
```

### toLocaleTimeString()

> 以特定于地区实现的格式显示时、分、秒；

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>toLocaleTimeString：{date.toLocaleTimeString()}</h1>
      <Button onClick={() => setDate(new Date())}>获取当前时间戳</Button>
    </div>
  );
};

export default App;
```

### toUTCString()

> 以特定于实现的格式完整的 UTC 日期。

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>toUTCString：{date.toUTCString()}</h1>
      <Button onClick={() => setDate(new Date())}>获取当前时间戳</Button>
    </div>
  );
};

export default App;
```

## 日期类方法

### getTime()

> 返回表示日期的毫秒数；与 `valueOf()` 方法返回的值相同。

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1>{date.getTime()}</h1>
      <Button onClick={() => setDate(new Date())}>获取当前时间戳</Button>
    </div>
  );
};

export default App;
```

### setTime(毫秒)

> 以毫秒数设置日期，会改变整个日期。

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [isSet, setIsSet] = useState(false);

  const handleSetTime = () => {
    const newDate = new Date();
    const time = newDate.getTime() - 60 * 1000;

    newDate.setTime(time);

    setDate(newDate);
    setIsSet(true);
  };
  return (
    <div>
      <h1>{date.toString()}</h1>
      {!isSet && <Button onClick={handleSetTime}>将时间戳倒退1分钟</Button>}
    </div>
  );
};

export default App;
```

### getFullYear()

> 取得 4 位数的年份（如 2021）

### setFullYear(年)

> 设置日期的年份。传入的年份值必须是 4 位数字

### getMonth()

> 返回日期中的月份，其中 0 表示一月，11 表示十二月

### setMonth(月)

> 设置日期的月份。传入的月份值必须大于 0，超过 11 则增加年份

### getDate()

> 返回日期月份中的天数（1 到 31）

### setDate(日)

> 设置日期月份中的天数。如果传入的值超过了该月中应有的天数，则增加月份

### getDay()

> 返回日期中星期的星期几（其中 0 表示星期日，6 表示星期六）

### getHours()

> 返回日期中的小时数（0 到 23）

### setHours(时)

> 设置日期中的小时数。传入的值超过了 23 则增加月份中的天数

### getMinutes()

> 返回日期中的分钟数（0 到 59）

### setMinutes(分)

> 设置日期中的分钟数。传入的值超过 59 则增加小时数

### getSeconds()

> 返回日期中的秒数（0 到 59）

### setSeconds(秒)

> 设置日期中的秒数。传入的值超过了 59 会增加分钟数

### getMilliseconds()

> 返回日期中的毫秒数

### setMilliseconds(毫秒)

> 设置日期中的毫秒数

### getTimezoneOffset()

> 返回本地时间与 UTC 时间相差的分钟数。例如，美国东部标准时间返回 300。

## 时间戳获取

### 使用 Date.now()

> 使用 `Date.now()` 只能获取当前时间的毫秒数。

### 使用 Date.parse()

> 使用 `Date.parse()` 可以获取指定时间的毫秒数。

### 使用 Date.UTC()

> 使用 `Date.UTC()` 获取指定时间的毫秒数。

### 使用 + new Date()

> 使用操作符 `+` 获取 `Date` 对象表示日期的毫秒数

### 使用 valueOf()

> 使用 `valueOf()` 获取 Date 对象表示日期的毫秒数

### 使用 getTime()

> 使用 `getTime()` 获取 Date 对象表示日期的毫秒数

## 扩展功能

### 将时间戳转化为指定格式的日期

```js
function numParse(num) {
  if (!isNaN(num) && Number(num) < 10) {
    return '0' + num;
  }

  return num;
}

function formatDate(format = 'Y-m-d h:i:s', timestamp = Date.now()) {
  // 判断是否是13位时间戳 如果是10位的转化为13位
  if (Number(timestamp).length === 10) {
    timestamp *= 1000;
  }

  const d = new Date();

  const formatType = {
    // Year
    Y() {
      return d.getFullYear();
    },
    m() {
      return numParse(d.getMonth() + 1);
    },
    d() {
      return numParse(d.getDate());
    },
    h() {
      return numParse(d.getHours());
    },
    i() {
      return numParse(d.getMinutes());
    },
    s() {
      return numParse(d.getSeconds());
    },
    M() {
      return d.getMonth() + 1;
    },
    D() {
      return d.getDate();
    },
    H() {
      return d.getHours();
    },
    I() {
      return d.getMinutes();
    },
    S() {
      return d.getSeconds();
    },
  };

  for (const key in formatType) {
    format = format.replace(key, formatType[key]);
  }

  return format;
}
```

### 从 Date 对象里获取当前时间

```js
const getColonTimeFromDate = (date) => date.toTimeString().slice(0, 8);

getColonTimeFromDate(new Date()); // "08:38:00"
```

### 计算两个时间戳之间差的天数

```js
const getDaysDiffBetweenDates = (date1, date2) =>
  Math.ceil(Math.abs(new Date(date1) - new Date(date2))) / (1000 * 3600 * 24);

getDaysDiffBetweenDates('2019-01-13', '2019-01-15'); // 2
```

### 查找指定日期位于一年中的第几天

```js
/**
 * @param date { timeStamp | Date } 传入的时间戳或者 Date对象 默认值为new Date()
 **/
const getDayOfYear = (date = new Date()) => {
  if (date instanceof Date) {
    return Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 3600 * 24),
    );
  } else if (typeof date === 'number' && !isNaN(date)) {
    let d;
    switch (date.toString().length) {
      case 10:
        d = new Date(date * 1000);
        break;

      case 13:
        d = new Date(date);
      default:
        break;
    }
    if (d) {
      return Math.floor(
        (d - new Date(d.getFullYear(), 0, 0)) / (1000 * 3600 * 24),
      );
    } else {
      throw Error('param error: date must be one of [Date, timeStamp]');
    }
  }
};
```
