---
title: 手写实现队列
nav:
  title: 编程题
  path: /writing
  order: 0
group:
  title: 编程题
  path: /writing/project
---

# 使用 js 实现队列 queue

- 2022.06.14

## 前言

### 定义

- 队列是一种 `先入先出（FIFO 数据结构)`。第一个入队的元素（FI）是第一个出队（FO）的。

- 队列有 2 个指针：`头指针` 和 `尾指针`。队列中的最早排队的项目是在头部，而最新排队的项目在队列尾部。

![队列](https://img-blog.csdnimg.cn/20210508180800851.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 操作

队列主要操作主要是：

- 入队

  ```js
  queue.enqueue(8);
  ```

- 出队

  ```js
  queue.dequeue();
  ```

- 检视操作(读取队列的开头，而不会更改队列。)

  ```js
  queue.peek();
  ```

- 队列长度

  ```js
  queue.length;
  ```

### 时间复杂度

对于所有队列操作（入队，出队，检视和长度）重要的是，所有这些操作必须在固定时间内执行 O(1)。

## 实现

```js
class Queue {
  constructor() {
    this.queueList = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  get length() {
    return this.tailIndex - this.headIndex;
  }

  enqueue(item) {
    this.queueList[this.tailIndex] = item;
    this.tailIndex++;
  }

  dequeue() {
    if (this.tailIndex - this.headIndex > 0) {
      const item = this.queueList[this.headIndex];
      delete this.queueList[this.headIndex];

      this.headIndex++;

      return item;
    }

    throw new Error('queue is empty!');
  }
  peek() {
    if (this.tailIndex - this.headIndex > 0) {
      return this.queueList[this.headIndex];
    }

    return null;
  }
}
// demo
const queue = new Queue();

queue.enqueue(7);
queue.enqueue(2);
queue.enqueue(6);
queue.enqueue(4);

queue.dequeue(); // => 7

queue.peek(); // => 2

queue.length; // => 3
```
