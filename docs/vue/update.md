---
title: Vue异步更新原理
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: vue2
  path: /vue/2.0
---

# Vue 异步更新原理

- 2022.11.01

**Vue 的数据频繁变化，但为什么 dom 只会更新一次？**

1. Vue 数据发生变化之后，不会立即更新 dom，而是异步更新的。
2. 侦听到数据变化，Vue 将开启一个队列，并缓存在同一事件循环中发生的所有数据变更。
3. 如果同一个 watcher 被多次触发，只会被推入到队列中一次，可以避免重复修改相同的 dom，这种去除重复数据，对于避免不必要的计算和 DOM 操作是非常重要的。
4. 同步任务执行完毕，开始执行异步 watcher 队列的任务，一次性更新 DOM。

```js
// 定义watcher类
class Watcher {
  update() {
    // 放到watcher队列中，异步更新
    queueWatcher(this);
  }
  // 触发更新
  run() {
    this.get();
  }
}

// 队列中添加watcher
function queueWatcher(watcher) {
  const id = watcher.id;
  // 先判断watcher是否存在 去掉重复的watcher
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if (!pending) {
      pending = true;
      // 使用异步更新watcher
      nextTick(flushSchedulerQueue);
    }
  }
}

let queue = []; // 定义watcher队列
let has = {}; // 使用对象来保存id，进行去重操作
let pending = false; // 如果异步队列正在执行，将不会再次执行

// 执行watcher队列的任务
function flushSchedulerQueue() {
  queue.forEach((watcher) => {
    watcher.run();
    if (watcher.options.render) {
      // 在更新之后执行对应的回调: 这里是updated钩子函数
      watcher.cb();
    }
  });
  // 执行完成后清空队列 重置pending状态
  queue = [];
  has = {};
  pending = false;
}
```
