---
title: Javascript设计模式
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Javascript 设计模式

- 2022.06.14

## 单例模式

![单例模式](https://img-blog.csdnimg.cn/20200525172611159.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
(function () {
  // 养鱼游戏
  let fish = null;

  function catchFish() {
    // 如果鱼存在，则直接返回
    if (fish) {
      return {
        fish,
        water: function () {
          let water = this.finish.getAttribute('weight');
          this.fish.setAttribute('weight', ++water);
        },
      };
    } else {
      // 如果鱼不存在，则获取鱼再返回
      fish = document.querySelector('#fish');
      return {
        fish,
        water: function () {
          let water = this.fish.getAttribute('weight');
          this.fish.setAttribute('weight', ++water);
        },
      };
    }
  }
  // 每隔3小时喂一次水
  setInterval(() => {
    catchFish().water();
  }, 3 * 60 * 60 * 1000);
})();
```

## 构造器模式

![构造器模式](https://img-blog.csdnimg.cn/20200525173955703.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
function Tools() {
  if (!(this instanceof Tools)) {
    return new Tools();
  }
  this.name = 'js工具库';
  // 获取dom的方法
  this.getEl = function (elem) {
    return document.querySelector(elem);
  };
  // 判断是否是数组
  this.isArray = function (arr) {
    return Array.isArray(arr);
  };
  // 其他通用方法...
}
```

## 建造者模式

![建造者模式](https://img-blog.csdnimg.cn/20200525174349829.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
// canvas绘制图形验证码
(function () {
  function Gcode(el, option) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.option = option;
    this.init();
  }
  Gcode.prototype = {
    constructor: Gcode,
    init: function () {
      if (this.el.getContext) {
        isSupportCanvas = true;
        var ctx = this.el.getContext('2d'),
          // 设置画布宽高
          cw = (this.el.width = this.option.width || 200),
          ch = (this.el.height = this.option.height || 40),
          textLen = this.option.textLen || 4,
          lineNum = this.option.lineNum || 4;
        var text = this.randomText(textLen);

        this.onClick(ctx, textLen, lineNum, cw, ch);
        this.drawLine(ctx, lineNum, cw, ch);
        this.drawText(ctx, text, ch);
      }
    },
    onClick: function (ctx, textLen, lineNum, cw, ch) {
      var _ = this;
      this.el.addEventListener(
        'click',
        function () {
          text = _.randomText(textLen);
          _.drawLine(ctx, lineNum, cw, ch);
          _.drawText(ctx, text, ch);
        },
        false,
      );
    },
    // 画干扰线
    drawLine: function (ctx, lineNum, maxW, maxH) {
      ctx.clearRect(0, 0, maxW, maxH);
      for (var i = 0; i < lineNum; i++) {
        var dx1 = Math.random() * maxW,
          dy1 = Math.random() * maxH,
          dx2 = Math.random() * maxW,
          dy2 = Math.random() * maxH;
        ctx.strokeStyle =
          'rgb(' +
          255 * Math.random() +
          ',' +
          255 * Math.random() +
          ',' +
          255 * Math.random() +
          ')';
        ctx.beginPath();
        ctx.moveTo(dx1, dy1);
        ctx.lineTo(dx2, dy2);
        ctx.stroke();
      }
    },
    // 画文字
    drawText: function (ctx, text, maxH) {
      var len = text.length;
      for (var i = 0; i < len; i++) {
        var dx = 30 * Math.random() + 30 * i,
          dy = Math.random() * 5 + maxH / 2;
        ctx.fillStyle =
          'rgb(' +
          255 * Math.random() +
          ',' +
          255 * Math.random() +
          ',' +
          255 * Math.random() +
          ')';
        ctx.font = '30px Helvetica';
        ctx.textBaseline = 'middle';
        ctx.fillText(text[i], dx, dy);
      }
    },
    // 生成指定个数的随机文字
    randomText: function (len) {
      var source = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
      ];
      var result = [];
      var sourceLen = source.length;
      for (var i = 0; i < len; i++) {
        var text = this.generateUniqueText(source, result, sourceLen);
        result.push(text);
      }
      return result.join('');
    },
    // 生成唯一文字
    generateUniqueText: function (source, hasList, limit) {
      var text = source[Math.floor(Math.random() * limit)];
      if (hasList.indexOf(text) > -1) {
        return this.generateUniqueText(source, hasList, limit);
      } else {
        return text;
      }
    },
  };
  new Gcode('#canvas_code', {
    lineNum: 6,
  });
})();
// 调用
new Gcode('#canvas_code', {
  lineNum: 6,
});
```

## 代理模式

![代理模式](https://img-blog.csdnimg.cn/20200525174911465.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
// 缓存代理
function sum(a, b) {
  return a + b;
}
let proxySum = (function () {
  let cache = {};
  return function () {
    let args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }

    cache[args] = sum.apply(this, arguments);
    return cache[args];
  };
})();
```

## 外观模式

![外观模式](https://img-blog.csdnimg.cn/20200525175240145.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
function on(type, fn) {
  // 对于支持dom2级事件处理程序
  if (document.addEventListener) {
    dom.addEventListener(type, fn, false);
  } else if (dom.attachEvent) {
    // 对于IE9一下的ie浏览器
    dom.attachEvent('on' + type, fn);
  } else {
    dom['on' + type] = fn;
  }
}
```

## 观察者模式

![观察者模式](https://img-blog.csdnimg.cn/20200525180105905.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
class EventEmitter (){
    constructor(){
        this.maxListener = 20;
        this.observes = {};
    }

    on(name, fn){
        if(this.observes[name]){
            this.observes[name].push(fn);
            return this;
        }

        this.observes[name] = [fn];
        return this;
    }

    emit(name, ...args){
        this.observes[name].forEach(fn=> fn(...args));
        return this;
    }
}

const eventEmitter = new EventEmitter();

eventEmitter.on('hello',message => console.log('hello', message)));

eventEmitter.emit('world');// hello world
```

## 策略模式

![策略模式](https://img-blog.csdnimg.cn/20200525181616903.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
const obj = {
  A: (num) => num * 4,
  B: (num) => num * 6,
  C: (num) => num * 8,
};

const getSum = function (type, num) {
  return obj[type](num);
};
```

## 迭代器模式

![迭代器模式](https://img-blog.csdnimg.cn/20200525182236852.png?x-oss-process=image,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
function _each(el, fn = (v, k, el) => {}) {
  // 判断数据类型
  function checkType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
  }

  // 数组或者字符串
  if (['Array', 'String'].indexOf(checkType(el)) > -1) {
    for (let i = 0, len = el.length; i < len; i++) {
      fn(el[i], i, el);
    }
  } else if (checkType(el) === 'Object') {
    for (let key in el) {
      fn(el[key], key, el);
    }
  }
}
```
