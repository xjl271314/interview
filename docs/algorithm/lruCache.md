---
title: LRU缓存
nav:
  title: 编程题
  path: /writing
group:
  title: 中等
  path: /writing/project/middle
  order: 2
---

# LeetCode146：LRU 缓存

- 2022.01.26

[LRU 缓存](https://leetcode-cn.com/problems/lru-cache/)请你设计并实现一个满足`LRU (Least Recently Used 最近最少使用)` 缓存约束的数据结构。

实现 `LRUCache` 类：

- `LRUCache(int capacity)` 以 正整数 作为容量 `capacity` 初始化 LRU 缓存
- `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 -1 。
- `void put(int key, int value)`  如果关键字  `key` 已经存在，则变更其数据值  `value` ；如果不存在，则向缓存中插入该组  `key-value` 。如果插入操作导致关键字数量超过  `capacity` ，则应该 逐出 最久未使用的关键字。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。

- 示例:

```
LRUCache cache = new LRUCache(2);

cache.put(1, 1); // 缓存是 {1=1}
cache.put(2, 2); // 缓存是 {1=1, 2=2}
cache.get(1);    // 返回 1
cache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
cache.get(2);    // 返回 -1 (未找到)
cache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
cache.get(1);    // 返回 -1 (未找到)
cache.get(3);    // 返回 3
cache.get(4);    // 返回 4
```

- 提示：
  - 1 <= capacity <= 3000
  - 0 <= key <= 10000
  - 0 <= value <= 105
  - 最多调用 2 \* 105 次 get 和 put

## 使用 Map + 迭代器

思路:

1. 维护一个堆栈，最近访问的在最底层，最近最少访问的在最上层。Map 刚好满足这么一个数据结构。
2. 当堆栈满了，有新的元素进栈时，将最上层的元素出栈，将新元素放到栈尾。
3. 当访问已经存在于堆栈的中的老元素，将老元素放到堆栈的最后一位，其他元素往前补位。

### javascript

```js
/**
 * LRUCache类
 * @param {number} capacity
 */
const LRUCache = function (capacity) {
  // 维护一个堆栈来进行缓存，最近使用的在最后面，最久没使用的在第一个
  this.cacheMap = new Map();
  this.capacity = capacity;
};

/**
 * get方法
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  if (this.cacheMap.has(key)) {
    // 有命中，更改该值在堆栈中的顺序
    let temp = this.cacheMap.get(key);
    this.cacheMap.delete(key);
    this.cacheMap.set(key, temp);
    return temp;
  }
  return -1;
};

/**
 * put方法
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  if (this.cacheMap.has(key)) {
    // 命中，改变顺序即可
    this.cacheMap.delete(key);
    this.cacheMap.set(key, value);
  } else {
    // 没命中
    if (this.cacheMap.size >= this.capacity) {
      // 堆栈已满，清除第一个数据
      // map的keys函数返回一个迭代器，然后用一次next就能获取第一个元素
      let firstKey = this.cacheMap.keys().next().value;
      this.cacheMap.delete(firstKey);
      this.cacheMap.set(key, value);
    } else {
      // 堆栈未满，存数据
      this.cacheMap.set(key, value);
    }
  }
};
```

## 使用哈希表 + 双向链表

思路:

- 当数据被访问的话，其所在的位置需要更新，移动到顶部
- 在写入数据的时候:
  - 之前存在 key，那么就更新改 key 对应的 value，并更新其位置
  - 之前不存在 key 则写入，当写入时如果满了，就删除调最久没有使用的条目。

**选择什么数据结构？**

- O(1)的快速查找，就哈希表了。
- 光靠哈希表可以吗？
  - 哈希表是无序的，无法知道里面的键值对哪些最近访问过，哪些很久没访问。
- 快速删除，谁合适?
  - 数组？元素的插入/移动/删除都是 O(n)。不行。
  - 单向链表？删除节点需要访问前驱节点，只能花 O(n) 从前遍历查找。不行。
  - 双向链表，节点有前驱指针，删除/移动节点都是纯纯的指针变动，都是 O(1)。

**双向链表、哈希表，各自的角色**

- 双向链表的节点：存 key 和 对应的数据值。
- 哈希表的存在意义：快速访问【存储于双向链表】的数据，不是它自己存数据
  - key：双向链表中存的 key
  - value：链表结点的引用。

### javascript

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

### python3

```python
class LRUCache(collections.OrderedDict):

    def __init__(self, capacity: int):
        super().__init__()
        self.capacity = capacity


    def get(self, key: int) -> int:
        if key not in self:
            return -1
        self.move_to_end(key)
        return self[key]

    def put(self, key: int, value: int) -> None:
        if key in self:
            self.move_to_end(key)
        self[key] = value
        if len(self) > self.capacity:
            self.popitem(last=False)
```
