---
title: 飞猪前端笔试
nav:
  title: 模拟试题
  path: /demos
  order: 0
group:
  title: 技术部分
  path: /demos/technology
---

# 飞猪前端笔试

## 1.回文链表

```js
// 双指针法
const isPalindrome = (head) => {
  const arr = [];
  while (head != null) {
    arr.push(head.val);
    head = head.next;
  }
  for (let i = 0, j = arr.length - 1; i < j; i++, j--) {
    if (arr[i] != arr[j]) {
      return false;
    }
  }

  return true;
};

// 快慢指针法
const reverseList = function (head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
};

// 使用快慢指针查找中间节点
const endOfFirstHalf = (head) => {
  let slow = head,
    fast = head;
  while (fast.next && fast.next.next) {
    fast = fast.next.next;
    slow = slow.next;
  }

  return slow;
};

const isPalindrome = (head) => {
  if (head === null) return true;

  // 找到前半部分链表的尾节点并反转后半部分链表
  const firstHalfEnd = endOfFirstHalf(head);
  const secondHalfStart = reverseList(firstHalfEnd.next);

  // 判断是否回文
  let p1 = head;
  let p2 = secondHalfStart;
  let result = true;
  while (result && p2 !== null) {
    if (p1.val !== p2.val) result = false;
    p1 = p1.next;
    p2 = p2.next;
  }

  // 还原链表并返回结果
  firstHalfEnd.next = reverseList(secondHalfStart);

  return result;
};
```

## 2.爬楼梯

```js
var climbStairs = function (n) {
  let p = 0,
    q = 0,
    r = 1;
  for (let i = 1; i <= n; i++) {
    p = q;
    q = r;
    r = p + q;
  }
  return r;
};

var climbStairs = function (n) {
  const dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
```

## 3.无重复字符的最大子串

```js
var lengthOfLongestSubstring = function (s) {
  if (!s.length) return 0;
  const len = s.length;
  let str = s[0],
    max = 1;
  for (let i = 0; i < len; i++) {
    const curr = s[i];
    const currIndex = str.indexOf(curr);
    // 已经出现过
    if (currIndex != -1) {
      str = str.slice(currIndex + 1);
    }
    str += curr;
    max = Math.max(max, str.length);
  }

  return max;
};
```

## 4.合并两个有序链表

```js
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) {
    return l2;
  }
  if (l2 === null) {
    return l1;
  }
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};
```

## 5.反转字符串

```js
var reverseString = function (s) {
  const len = s.length;
  for (let left = 0, right = len - 1; left < right; ++left, --right) {
    [s[left], s[right]] = [s[right], s[left]];
  }
};
```

## 6.两数之和

```js
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    const left = target - nums[i];
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] === left) {
        return [i, j];
      }
    }
  }
};
```

## 7.有效的括号字符串

```js
var checkValidString = function (s) {
  const len = s.length;
  let minCount = 0,
    maxCount = 0;
  for (let i = 0; i < len; i++) {
    if (s[i] == '(') {
      minCount++;
      maxCount++;
    } else if (s[i] == ')') {
      minCount = Math.max(minCount - 1, 0);
      maxCount--;
      if (maxCount < 0) {
        return false;
      }
    } else {
      minCount = Math.max(minCount - 1, 0);
      maxCount++;
    }
  }

  return minCount === 0;
};
```

## 8.二叉树的遍历

```js
// 前序
var preorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  res.push(root.val);
  preorderTraversal(root.left, res);
  preorderTraversal(root.right, res);
  return res;
};

var preorderTraversal = function (root, res = []) {
  if (root == null) return res;
  const stack = [];
  stack.push(root);
  while (stack.length) {
    const node = stack.pop();
    res.push(node.val);
    if (node.right) {
      stack.push(node.right);
    }
    if (node.left) {
      stack.push(node.left);
    }
  }

  return res;
};

// 中序
var inorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  inorderTraversal(root.left, res);
  res.push(root.val);
  inorderTraversal(root.right, res);

  return res;
};

var inorderTraversal = function (root, res = []) {
  if (!root) return res;
  const stack = [];
  let node = root;
  while (stack.length || node) {
    if (node) {
      stack.push(node);
      node = node.left;
    } else {
      node = stack.pop();
      res.push(node.val);
      node = node.right;
    }
  }
  return res;
};

// 后序
var postorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  postorderTraversal(root.left, res);
  postorderTraversal(root.right, res);
  res.push(root.val);

  return res;
};

var postorderTraversal = function (root, res = []) {
  if (root == null) {
    return res;
  }
  const stack = [root];
  let cur;
  while (stack.length) {
    cur = stack.pop();
    res.unshift(cur.val);
    cur.left && stack.push(cur.left);
    cur.right && stack.push(cur.right);
  }
  return res;
};
```

## 9. 二叉树的最大深度

```js
var maxDepth = function (root) {
  if (!root) return 0;
  const queue = [root];
  let deep = 0;
  while (queue.length) {
    const n = queue.length;
    deep += 1;
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }

  return deep;
};
```

## 10. LRU 缓存

```js
// 定义 ListNode 节点
class ListNode {
    constructor() {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

// 定义LRUCache
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;               // LRUCache的容量
        this.hash = {};                         // 哈希表
        this.count = 0;                         // 缓存数目
        this.dummyHead = new ListNode();        // 虚拟头节点
        this.dummyTail = new ListNode();        // 虚拟尾节点
        this.dummyHead.next = this.dummyTail;   // 将虚拟头节点指向尾节点
        this.dummyTail.next = this.dummyHead;   // 将虚拟尾节点指向头节点形成相连
    }
}

// 设计 dummyHead 和 dummyTail 的意义
// 虚拟头尾节点，只是为了让对真实头尾节点的操作，和对其他节点的操作一致，方便快速访问头尾节点。

// 实现get方法
get() {
    let node = this.hash[key];      // 从哈希表中，获取对应的节点
    if (node == null) return -1;    // 如果节点不存在，返回-1
    this.moveToHead(node);          // 被读取了，该节点移动到链表头部

    return node.value;              // 返回节点值
}

// moveToHead方法实现
moveToHead(node) {
    this.removeFromList(node);      // 先从链表中删除
    this.addToHead(node)            // 再加到链表的头部
}

// removeFromList
removeFromList(node) {
    let tmp1 = node.prev;           // 暂存它的后继节点
    let tmp2 = node.next;           // 暂存它的前驱节点
    temp1.next = tmp2;              // 前驱节点的next指向后继节点
    temp2.prev = temp1;             // 后继节点的prev指向前驱节点
}

// addToHead 插入到虚拟头结点和真实头结点之间
addToHead(node) {
    node.prev = this.dummyHead;     // node的prev指针，指向虚拟头结点
    node.next = this.dummyHead.next;// node的next指针，指向原来的真实头结点
    this.dummyHead.next.prev = node;// 原来的真实头结点的prev，指向node
    this.dummyHead.next = node;     // 虚拟头结点的next，指向node
}

// put 方法实现
// 写入新数据，要先检查容量，看看是否要删“老家伙”，然后创建新的节点，添加到链表头部(最不优先被淘汰)，哈希表也更新一下。
// 写入已有的数据，则更新数据值，刷新节点的位置。
put(key, value) {
    let node = this.hash[key]                   // 获取链表中的node
    if (node == null){                          // 不存在于链表，是新数据
        if (this.count == this.capacity) {      // 容量已满
            this.removeLRUItem();               // 删除最远一次使用的数据
        }
        let newNode = new ListNode(key, value); // 创建新的节点
        this.hash[key] = newNode;               // 存入哈希表
        this.addToHead(newNode);                // 将节点添加到链表头部
        this.count ++;                          // 缓存数目+1
    }
    else{                                       // 已经存在于链表，老数据
        node.value = value;                     // 更新value
        this.moveToHead(node);                  // 将节点移到链表头部
    }
}

// removeLRUItem
removeLRUItem() {
    let tail = this.popTail();                  // 将它从链表尾部删除
    delete this.hash[tail.key];                 // 哈希表中也将它删除
    this.count --;                              // 缓存数目-1
}

// popTail
popTail() {
    let tail = this.dummyTail.prev;             // 通过虚拟尾节点找到它
    this.removeFromList(tail);                  // 删除该真实尾节点

    return tail;                                // 返回被删除的节点
}
```

## 11. 二叉树的右视图

```js
var rightSideView = function (root) {
  if (!root) return [];
  const queue = [root];
  const res = [];
  while (queue.length) {
    const n = queue.length;
    let tmp = [];
    for (let i = 0; i < n; i++) {
      const node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      tmp.push(node.val);
    }
    res.push(tmp[tmp.length - 1]);
  }
  return res;
};
```

## 12.复原 IP 地址

```js
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  const res = [],
    temp = [];

  function backtracking(i) {
    const len = temp.length;
    // IP只有4段
    if (len > 4) return;
    // 如果刚好4段 并且耗尽了所有的字符
    if (len == 4 && i == s.length) {
      res.push(temp.join('.'));
      return;
    }
    for (let j = i; j < s.length; j++) {
      const str = s.substr(i, j - i + 1);
      // 段位如果大于255了不合法
      if (str.length > 3 || +str > 255) break;
      // 段位以0为开头的数字不合法
      if (str.length > 1 && str[0] == '0') break;
      temp.push(str);
      backtracking(j + 1);
      temp.pop();
    }
  }

  backtracking(0);
  return res;
};
```

## 13.字符串千分位

```js
function digit3parsed(n, spread = ',') {
  const regxep = /\d(?=(?:\d{3})+\b)/g;
  // 处理 0 和 NaN
  if (!n || Number.isNaN(n)) return 0;

  // 拆分成整数部分和小数部分
  const intN = parseInt(n).toString();
  const floatN = n.toString().split('.')[1] || '';

  // 小数尾数
  const decimal = floatN ? '.' + floatN : '';

  // 整数部分替换 + 小数尾数
  return `${intN.replace(regxep, `$&${spread}`)}${decimal}`;
}
```

## 14. bind、apply 和 call

```js
Function.prototype.bind = function (context, ...args) {
  // 当上下文不存在的时候将其指向window
  if (context == null || context == undefined) {
    context = window;
  }
  // 创建一个唯一的key值用于保存方法
  let fnKey = Symbol('bind');
  context[fnKey] = this;
  // 保存外部this
  let self = this;
  // 创建返回方法
  let fn = function (...innerArgs) {
    // 若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，
    // 则不绑定传入的 this，而是将 this 指向实例化出来的对象。
    // 此时由于new操作符作用，this 指向 fn 实例对象，而fn 又继承自传入的 self 根据原型链知识可得出以下结论：
    // this.__proto__ === fn.prototype   // true
    // this.__proto__.__proto__ === fn.prototype.__proto__ === self.prototype;
    if (this instanceof self) {
      // 此时this指向指向fn的实例  这时候不需要改变this指向
      this[fnKey] = self;
      // 这里使用es6的方法让bind支持参数合并
      this[fnKey](...[...args, ...innerArgs]);
      // 删除
      delete this[fnKey];
    } else {
      // 如果只是作为普通函数调用，改变this指向为传入的context
      context[fnKey](...[...args, ...innerArgs]);
      // 删除中间变量
      delete context[fnKey];
    }
  };
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 用 Object.create 实现继承
  if (self.prototype) {
    fn.prototype = Object.create(self.prototype);
  }

  return fn;
};

Function.prototype.apply = function (context = window) {
  context.fn = this;
  // 第一个参数为this apply第二个参数为数组
  const args = arguments[1] || [];
  const res = context.fn(...args);

  delete context.fn;

  return res;
};

Function.prototype.call = function (context = window) {
  context.fn = this;
  // 第一个参数为this
  const args = [...arguments].slice(1);
  const res = context.fn(...args);

  delete context.fn;

  return res;
};
```

## 15. 实现 compose

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

## 16. 实现 add

```js
const curry = (fn, ...args) =>
  // 函数的参数个数可以直接通过函数的.length属性来访问
  args.length >= fn.length // 这个判断很关键！！！
    ? // 传入的参数大于等于原始函数fn的参数个数，则直接执行该函数
      fn(...args)
    : /**
       * 传入的参数小于原始函数fn的参数个数时
       * 则继续对当前函数进行柯里化，返回一个接受所有参数（当前参数和剩余参数） 的函数
       */
      (..._args) => curry(fn, ...args, ..._args);

function add1(x, y, z) {
  return x + y + z;
}
const add = curry(add1);
console.log(add(1, 2, 3));
```

## 17.实现 Array.flat

```js
function flat(arr, depth = 1) {
  if (depth === Infinity) {
    return [].concat(...arr.map((v) => (Array.isArray(v) ? flat(v) : v)));
  }
  if (depth === 1) {
    return arr.reduce((a, v) => a.concat(v), []);
  }
  return arr.reduce(
    (a, v) => a.concat(Array.isArray(v) ? flat(v, depth - 1) : v),
    [],
  );
}

function flat(arr) {
  const result = [];
  // 将数组元素拷贝至栈
  const stack = [...arr];
  // 如果栈不为空，则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop();
    if (Array.isArray(val)) {
      // 如果是数组再次入栈，并且展开一层
      stack.push(...val);
    } else {
      // 这里如果是空位的话，继续continue
      if (val === undefined) {
        continue;
      }
      result.unshift(val);
    }
  }

  return result;
}
```

## 18. instanceof

```js
function _instanceof (target, origin) {
    while(target) {
        if(target.__proto__ === origin.prototype) {
            return true;
        }

        target = = target.__proto__;
    }

    return false;
}
```

## 19.实现 map

```js
Array.prototype.map = function (fn, context = []) {
  let result = [];
  let arr = this;
  for (let i = 0; i < arr.length; i++) {
    const currentValue = arr[i];
    // this currentValue index arr
    result.push(fn.call(context, currentValue, i, arr));
  }

  console.log('for');

  return result;
};
```

## 20.实现深拷贝

```js
function deepClone(target, map = new WeakMap()) {
  if (typeof target === 'object') {
    let cloneTarget = target.constructor === Array ? [] : {};
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

## 21.实现 new

```js
function myNew() {
  let obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  let ret = Constructor.apply(obj, arguments);

  // ret || obj 这里这么写考虑了构造函数显式返回 null 的情况
  return typeof ret === 'object' ? ret || obj : obj;
}
```

## 22.实现节流和防抖

```js
// 非立即执行版的意思是触发事件后函数不会立即执行，而是在 n 秒后执行
// 如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
function debounce(func, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// 立即执行版的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果
function debounce(func, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    let callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    if (callNow) func.apply(context, args);
  };
}
// 节流时间戳版
function throttle(func, delay) {
  let previous = 0;
  return function () {
    let now = Date.now();
    let context = this;
    let args = arguments;
    if (now - previous > delay) {
      func.apply(context, args);
      previous = now;
    }
  };
}

// 节流定时器版
function throttle(func, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, delay);
    }
  };
}
```

## 23.获取 url 上的参数

```js
/**
 * 将参数中的null undefined转化为空
 * @param {String} el
 */
export function transferDefectParams(el) {
  return ['null', 'undefined'].includes(el) ? '' : el;
}

/**
 * 正则表示法
 * 思路:通过正则表达式获取url上的参数 然后通过数组reduce追加到对象中
 *
 * @param {string} url 需要获取的url地址默认为当前地址
 */
export function getUrlParameters(url = window.location.href) {
  /**
   * match返回字符串中匹配结果的数组,匹配不到返回null
   * [^?=&]+ 匹配除了?=&之外的字符 仅匹配一次
   * Array.reduce(callBack(prev,cur,index,array), initialValue)
   * Array.slice(start,[end]) 返回start-end的元素
   */
  const params = url.match(/([^?=&]+)=([^&]*)/g);
  if (params) {
    return params.reduce(
      (a, v) => (
        (a[v.slice(0, v.indexOf('='))] = transferDefectParams(
          v.slice(v.indexOf('=') + 1),
        )),
        a
      ),
      {},
    );
  }
  return {};
}

/**
 * 字符串分割法
 * 思路: 使用split截取字符串为数字 然后调用reduce方法
 * @param {string} url url地址
 */
export function getUrlParameters(url = window.location.href) {
  const search = url.split('?')[1]; // window.location.search
  if (search) {
    const params = search.split('&');
    if (params) {
      return params.reduce(
        (a, v) => (
          (a[v.slice(0, v.indexOf('='))] = transferDefectParams(
            v.slice(v.indexOf('=') + 1),
          )),
          a
        ),
        {},
      );
    }
    return {};
  }
  return {};
}
```
