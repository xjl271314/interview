---
title: 函数柯里化(curring)
nav:
  title: javascript
  path: /javascript
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 函数柯里化?

- 2021.06.08

## 定义

> `柯里化（currying）`，是一种把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

## 原理

我们从最简单的一个例子出发:

```js
function add(a, b) {
  return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2); // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2); // 3
```

我们来实现第一版的 `curry`函数:

```js
// 第一版
var curry = function (fn) {
  var args = [].slice.call(arguments, 1);
  return function () {
    var newArgs = args.concat([].slice.call(arguments));
    return fn.apply(this, newArgs);
  };
};
```

我们可以使用该函数改写上述的方法:

```js
function add(a, b) {
  return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry(); // 3
// 或者
var addCurry = curry(add, 1);
addCurry(2); // 3
// 或者
var addCurry = curry(add);
addCurry(1, 2); // 3
```

已经有`柯里化`的感觉了，但是还没有达到要求，不过我们可以把这个函数用作辅助函数，帮助我们写真正的 `curry` 函数。我们来进行第二版的改进:

```js
// 第二版
function sub_curry(fn) {
  var args = [].slice.call(arguments, 1);
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
}

function curry(fn, length = fn.length) {
  var slice = Array.prototype.slice;

  return function () {
    if (arguments.length < length) {
      var combined = [fn].concat(slice.call(arguments));
      return curry(sub_curry.apply(this, combined), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  };
}
```

我们验证下这个函数：

```js
var fn = curry(function (a, b, c) {
  return [a, b, c];
});

fn('a', 'b', 'c'); // ["a", "b", "c"]
fn('a', 'b')('c'); // ["a", "b", "c"]
fn('a')('b')('c'); // ["a", "b", "c"]
fn('a')('b', 'c'); // ["a", "b", "c"]
```

效果已经满足了上述我们的预期，但是该方法的理解比较困难。

```js
function curry(fn, args) {
  var length = fn.length;

  args = args || [];

  return function () {
    var _args = args.slice(0),
      arg,
      i;

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];

      _args.push(arg);
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args);
    } else {
      return fn.apply(this, _args);
    }
  };
}

var fn = curry(function (a, b, c) {
  console.log([a, b, c]);
});

fn('a', 'b', 'c'); // ["a", "b", "c"]
fn('a', 'b')('c'); // ["a", "b", "c"]
fn('a')('b')('c'); // ["a", "b", "c"]
fn('a')('b', 'c'); // ["a", "b", "c"]
```

`curry` 函数写到这里其实已经很完善了，但是注意这个函数的传参顺序必须是从左到右，根据形参的顺序依次传入，如果我不想根据这个顺序传呢？

我们可以创建一个占位符，比如这样：

```js
var fn = curry(function (a, b, c) {
  console.log([a, b, c]);
});

fn('a', _, 'c')('b'); // ["a", "b", "c"]
```

因此，我们来实现第三版的代码:

```js
// 第三版
function curry(fn, args, holes) {
  length = fn.length;

  args = args || [];

  holes = holes || [];

  return function () {
    var _args = args.slice(0),
      _holes = holes.slice(0),
      argsLen = args.length,
      holesLen = holes.length,
      arg,
      i,
      index = 0;

    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
      if (arg === _ && holesLen) {
        index++;
        if (index > holesLen) {
          _args.push(arg);
          _holes.push(argsLen - 1 + index - holesLen);
        }
      }
      // 处理类似 fn(1)(_) 这种情况
      else if (arg === _) {
        _args.push(arg);
        _holes.push(argsLen + i);
      }
      // 处理类似 fn(_, 2)(1) 这种情况
      else if (holesLen) {
        // fn(_, 2)(_, 3)
        if (index >= holesLen) {
          _args.push(arg);
        }
        // fn(_, 2)(1) 用参数 1 替换占位符
        else {
          _args.splice(_holes[index], 1, arg);
          _holes.splice(index, 1);
        }
      } else {
        _args.push(arg);
      }
    }
    if (_holes.length || _args.length < length) {
      return curry.call(this, fn, _args, _holes);
    } else {
      return fn.apply(this, _args);
    }
  };
}

var _ = {};

var fn = curry(function (a, b, c, d, e) {
  console.log([a, b, c, d, e]);
});

// 验证 输出全部都是 [1, 2, 3, 4, 5]
fn(1, 2, 3, 4, 5);
fn(_, 2, 3, 4, 5)(1);
fn(1, _, 3, 4, 5)(2);
fn(1, _, 3)(_, 4)(2)(5);
fn(1, _, _, 4)(_, 3)(2)(5);
fn(_, 2)(_, _, 4)(1)(3)(5);
```

这里再展示一个极简版:

```js
var curry = (fn) =>
  (judge = (...args) =>
    args.length === fn.length ? fn(...args) : (arg) => judge(...args, arg));
```
