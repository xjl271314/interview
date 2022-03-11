---
title: setTimeout与XMLHttpRequest实现原理
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 事件循环中的 setTimeout 与 XMLHttpRequest

- 2022.02.17

## setTimeout

`setTimeout` 方法，从事开发的同学想必都不会陌生，它就是一个定时器，用来指定某个函数在多少毫秒之后执行。它会返回一个整数，表示定时器的编号，同时你还可以通过该编号来取消这个定时器。下面的示例代码就演示了定时器最基础的使用方式：

```js
function fn() {
  console.log(1);
}
var timerID = setTimeout(fn, 200);
```

通过 `setTimeout` 指定在 `200` 毫秒之后调用 `fn` 函数，并输出`1`。

通过[事件循环 Event Loop](/javascript/project/eventloop)章节我们已经知道了`setTimeout`属于`异步任务中的宏任务`。

要执行一段异步任务，需要先将任务添加到消息队列中。不过通过定时器设置回调函数有点特别，它们需要在指定的时间间隔内被调用，但消息队列中的任务是按照顺序执行的，所以为了保证回调函数能在指定时间内执行，不能将定时器的回调函数直接添加到消息队列中。

在 Chrome 中除了正常使用的消息队列之外，还有另外一个消息队列，这个队列中维护了需要延迟执行的任务列表，包括了`定时器`和 `Chromium` 内部一些需要延迟执行的任务。所以当通过 JavaScript 创建一个定时器时，渲染进程会将该定时器的回调任务添加到延迟队列中。

源码中延迟执行队列的定义如下所示：

```js
DelayedIncomingQueue delayed_incoming_queue;
```

当通过 JavaScript 调用 setTimeout 设置回调函数的时候，渲染进程将会创建一个回调任务，包含了回调函数 fn、当前发起时间、延迟执行时间，其模拟代码如下所示：

```js
struct DelayTask{
  int64 id；
  CallBackFunction cbf;
  int start_time;
  int delay_time;
};
DelayTask timerTask;
timerTask.cbf = fn;
timerTask.start_time = getCurrentTime(); // 获取当前时间
timerTask.delay_time = 200;// 设置延迟执行时间
```

创建好回调任务之后，再将该任务添加到延迟执行队列中，代码如下所示：

```js
delayed_incoming_queue.push(timerTask)；
```

现在通过定时器发起的任务就被保存到延迟队列中了，那接下来我们再来看看`消息循环系统`是怎么触发延迟队列的。

```js
void ProcessTimerTask(){
  // 从 delayed_incoming_queue 中取出已经到期的定时器任务
  // 依次执行这些任务
}

TaskQueue task_queue；
void ProcessTask();
bool keep_running = true;
void MainTherad(){
  for(;;){
    // 执行消息队列中的任务
    Task task = task_queue.takeTask();
    ProcessTask(task);

    // 执行延迟队列中的任务
    ProcessDelayTask()

    if(!keep_running) // 如果设置了退出标志，那么直接退出线程循环
        break;
  }
}
```

从上面代码可以看出来，我们添加了一个`ProcessDelayTask 函数`，该函数是专门用来处理延迟执行任务的。这里我们要重点关注它的执行时机，在上段代码中，处理完消息队列中的一个任务之后，就开始执行 `ProcessDelayTask` 函数。`ProcessDelayTask` 函数会根据发起时间和延迟时间计算出到期的任务，然后依次执行这些到期的任务。等到期的任务执行完成之后，再继续下一个循环过程。通过这样的方式，一个完整的定时器就实现了。

设置一个定时器，`JavaScript` 引擎会返回一个定时器的 ID。那通常情况下，当一个定时器的任务还没有被执行的时候，也是可以取消的，具体方法是调用`clearTimeout` 函数，并传入需要取消的定时器的 ID。如下面代码所示：

```js
clearTimeout(timer_id);
```

**其实浏览器内部实现取消定时器的操作也是非常简单的，就是直接从 `delayed_incoming_queue` 延迟队列中，通过 ID 查找到对应的任务，然后再将其从队列中删除掉就可以了。**

### 注意事项

1. 如果当前任务执行时间过久，会影延迟到期定时器任务的执行

   ```js
   function bar() {
     console.log('bar');
   }
   function foo() {
     setTimeout(bar, 0);
     for (let i = 0; i < 5000; i++) {
       let i = 1 + 2 + 3 + 4;
       console.log(i);
     }
   }
   foo();
   ```

   上述代码会在 5000 次循环后再执行`setTimeout`的逻辑，虽然设置了 0，但是需要等待循环完成后执行，假设循环了 500ms，那么`setTimeout`的延迟实际是 500ms。

2. 如果 `setTimeout` 存在嵌套调用，那么系统会设置最短时间间隔为 `4` 毫秒

   ```js
   function cb() {
     setTimeout(cb, 0);
   }
   setTimeout(cb, 0);
   ```

   在 Chrome 中，定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于 4 毫秒，那么浏览器会将每次调用的时间间隔设置为 4 毫秒。下面是 Chromium 实现 4 毫秒延迟的代码：

   ```c
   static const int kMaxTimerNestingLevel = 5;

   // Chromium uses a minimum timer interval of 4ms. We'd like to go
   // lower; however, there are poorly coded websites out there which do
   // create CPU-spinning loops.  Using 4ms prevents the CPU from
   // spinning too busily and provides a balance between CPU spinning and
   // the smallest possible interval timer.
   static constexpr base::TimeDelta kMinimumInterval = base::TimeDelta::FromMilliseconds(4);

   base::TimeDelta interval_milliseconds =
     std::max(base::TimeDelta::FromMilliseconds(1), interval);

   if (interval_milliseconds < kMinimumInterval &&
       nesting_level_ >= kMaxTimerNestingLevel)
       interval_milliseconds = kMinimumInterval;

   if (single_shot)
       StartOneShot(interval_milliseconds, FROM_HERE);
   else
       StartRepeating(interval_milliseconds, FROM_HERE);
   ```

   所以，一些实时性较高的需求就不太适合使用 `setTimeout` 了，比如你用 `setTimeout` 来实现 `JavaScript` 动画就不是一个很好的主意。

3. 未激活的页面，setTimeout 执行最小间隔是 1000 毫秒

   如果标签不是当前的激活标签，那么定时器最小的时间间隔是 1000 毫秒，目的是为了优化后台页面的加载损耗以及降低耗电量。

4. 延时执行时间有最大值

   `Chrome`、`Safari`、`Firefox` 都是以 32 个 bit 来存储延时值的，32bit 最大只能存放的数字是 `2147483647` 毫秒，这就意味着，如果 `setTimeout` 设置的延迟值大于 `2147483647` 毫秒（大约 24.8 天）时就会溢出，这导致定时器会被立即执行。运行下面这段代码：

   ```js
   function showMsg() {
     console.log('立即执行了');
   }
   var timerID = setTimeout(showMsg, 2147483648); // 会被理解调用执行
   ```

   运行后可以看到，这段代码是立即被执行的。但如果将延时值修改为小于 2147483647 毫秒的某个值，那么执行时就没有问题了。

## XMLHttpRequest

![在这里插入图片描述](https://img-blog.csdnimg.cn/b7f7bf6512a84d138bb690da119377ba.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)
