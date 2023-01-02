---
title: 反思模拟题
nav:
  title: 模拟试题
  path: /demos
  order: 0
group:
  title: 技术部分
  path: /demos/technology
---

# 主观题和业务描述

准备方向以业务核心，思考业务中的价值以及管理方面上的困难，如何去落实。

## 2.笔试题

实现 xml 到 json 的数据转换。

```js
var xml = `
    <list>
        <item key="1">11</item>
        <item key="2">22</item>
        <item key="3">33</item>
        <group id="group1">
            <item id="item1">group-item1</item>
            <item id="item2">group-item2</item>
        </group>
    </list>
`;

function str2Dom(str) {
  if (typeof str != 'string') throw new Error('str must be a string');

  let result = {};
  /* 定义返回的对象 */
  // let result = {  //解析成功返回的对象(标签名，属性集合对象{属性名：属性值...}，子元素数组[{},{...])
  //   meta: '',
  //   xml: {}
  // };
  /* 去除所有换行和前后空格*/
  str = str.replaceAll('\n', '');
  str = str.trim();
  // 针对真实的xml文件提取首行声明——<?xml version="1.0" encoding="ISO-8859-1"?>
  // for(let i = 0, len = str.length; i < len; ++i){
  //   if(str[i] == '>'){
  //     result.meta = str.slice(0, i + 1);
  //     str = str.slice(i + 1);
  //     break;
  //   }
  // }
  // str = str.trim();
  /* 找出可以分割的点 */
  let subList = [], //切割点下标集合
    leftCount = 0, // 左括号个数
    rightCount = 0; // 右括号个数
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] == '>') {
      rightCount++;
      subList.push(i + 1);
    } else if (str[i] == '<') {
      leftCount++;
      subList.push(i);
    }
  }
  console.log(
    'subList',
    subList,
    'leftCount',
    leftCount,
    'rightCount',
    rightCount,
  );
  /* 执行分割 */
  let elementList = [],
    tagList = [];
  for (let i = 0, len = subList.length; i < len; i++) {
    elementList.push(str.slice(subList[i], subList[i + 1]));
  }
  // 过滤掉所有纯空格元素
  elementList = elementList.filter((item) => !/^\s*$/g.test(item));
  console.log('elementList:', elementList);

  // 提取tagName
  function getTagName(str) {
    str = str.trim();
    if (str[1] == '/') {
      return str.slice(2, str.length - 1);
    }

    return str.slice(1, str.indexOf(' '));
  }

  // 判断括号开闭是否正确
  function isErrorContext(elementList, leftCount, rightCount) {
    // 两者相等肯定正确
    // if(leftCount == rightCount){
    //     return false;
    // }
    // 报错的标签名
    let element = null,
      type = null,
      error = null;
    // 否则遍历元素
    for (let i = 0; i < elementList.length; i++) {
      let current = elementList[i].trim();
      if (!/^\<|\>$/.test(current)) {
        continue;
      }
      const start = current[0],
        end = current[current.length - 1];
      element = getTagName(current);
      if (start != '<') {
        type = 'start';
        error = element;
        console.log('error', error);
      } else if (end != '>') {
        type = 'closing';
      } else {
        tagList.push(element);
      }

      console.log('element', element, 'tagList', tagList);
    }
    // 如果type不为null，那么说明标签不正确
    if (error) {
      return {
        tagName: error,
        txt: `missing ${type} parenthesis`,
      };
    }
    return false;
  }
  // 检查标签是否符合开闭规则
  const err = isErrorContext(elementList, leftCount, rightCount);
  if (err) {
    throw Error(`${err.tagName}：${err.txt}`);
  }
  // 检查标签层级顺序是否正确
  function isErrorLevel(tagList) {
    const stack = [];
    tagList.forEach((item, i) => {
      console.log(stack, item, i, stack[stack.length - 1]);
      if (!stack.includes(item)) {
        console.log('入栈');
        stack.push(item);
      } else if (stack[stack.length - 1] == item) {
        console.log('出栈');
        stack.pop();
      }
    });

    return stack.length != 0;
  }
  const levelErr = isErrorLevel(tagList);
  if (levelErr) {
    throw Error('标签层级不正确');
  }
  // 构造标签
  console.log('检验都正确', elementList);
  function getElementAttr(element) {
    const matchArr = /(?:\\w+)\\s*(?:=[^{,},<,>]+)/.match(element);
  }
}

str2Dom(xml);
```

```

```
