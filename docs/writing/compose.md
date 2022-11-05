---
title: 手写实现compose
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# compose

- 2022.10.31

在函数式编程当中有一个很重要的概念就是`函数组合`，实际上就是把处理数据的函数像管道一样连接起来，然后让数据穿过管道得到最终的结果。

将一系列函数，通过`compose`函数组合起来，像管道一样连接起来，比如`函数结合[f, g, h ]`，通过`compose`最终达到这样的效果： `f(g(h()))`。

```js
function compose(fns = []) {
  if (fns.length == 0) {
    console.error('fn must be a function array');
    return;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  const initial = fns.shift();

  return function (...args) {
    return fns.reduce(
      (prev, cur) => {
        return prev.then((res) => {
          return cur.call(null, res);
        });
      },
      // Promise.resolve可以将非promise实例转为promise实例（一种兼容处理）
      Promise.resolve(initial.apply(null, args)),
    );
  };
}
```
