# 加油 💪 努力奋斗!

<!-- ```jsx
/**
 * inline: true
 */
import React from 'react';
import moment from 'moment';

const today = moment();
const deadline = moment('2022-10-31');

const countDown = moment(deadline).diff(today, 'days');

export default () => {
  return <h2>毕业倒计时: {countDown} 天</h2>;
};
``` -->

## 2023.1.6

- iphoneSE 横屏下阿拉伯文的换行

![](https://pic4.58cdn.com.cn/nowater/webim/big/n_v289ef9d2076f94c06b5fa68963c7c5edb.png)

商量过后先按照往左延申的方式去处理。

改动点:

1. 仅在阿拉伯情况下处理 UI 展示问题
2. 宽度设置为了 1.08rem

- 全局的 copy-right 组件开发
- 历史遗留的问题处理
