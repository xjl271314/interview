---
title: 继承
nav:
  title: 前端基础
  path: /base
  order: 0
group:
  title: javascript相关试题
  path: /javascript/project
---

# 说说 javascript 中的继承吧?

- 2021.06.03

许多 OO 语言都支持两种继承方式：`接口继承`和`实现继承`。

`接口继承`只继承方法签名，而`实现继承`则继承实际的方法。

由于函数没有签名，在 `ECMAScript` 中无法实现`接口继承`。`ECMAScript` 只支持`实现继承`，而且其`实现继承`主要是依靠`原型链`来实现的。

## 1.原型链继承

> 其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。

每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。

那么，假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？

显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓`原型链`的基本概念。

```js
// parent
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function () {
  return this.property;
};
// children
function SubType() {
  this.subproperty = false;
}

SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function () {
  return this.subproperty;
};

var instance = new SubType();
alert(instance.getSuperValue()); // true
alert(instance.getSubValue()); // false
alert(instance instanceof SuperType); // true
alert(instance.constructor); // SuperType
```

实际上，不是 `SubType` 的原型的 `constructor` 属性被重写了，而是 `SubType` 的原型指向了另一个对象——`SuperType` 的原型，而这个原型对象的 `constructor` 属性指向的是 `SuperType`。

![原型链继承](https://img-blog.csdnimg.cn/20200116111540525.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

事实上，前面例子中展示的原型链还少一环。我们知道，所有`引用类型`默认都继承了 `Object`，而这个继承也是通过`原型链`实现的。

大家要记住，所有`函数`的默认原型都是 `Object` 的实例，因此默认原型都会包含一个`内部指针`，指向 `Object.prototype`。这也正是所有自定义类型都会继承 `toString()`、`valueOf()`等默认方法的根本原因。所以，我们说上面例子展示的原型链中还应该包括另外一个继承层次。

![原型链继承](https://img-blog.csdnimg.cn/20200116112221793.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

还有一点需要注意，即在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样做就会重写原型链，如下面的例子所示:

```js
function SuperType() {
  this.property = true;
}
SuperType.prototype.getSuperValue = function () {
  return this.property;
};
function SubType() {
  this.subproperty = false;
}
//继承了 SuperType
SubType.prototype = new SuperType();
//使用字面量添加新方法，会导致上一行代码无效
SubType.prototype = {
  getSubValue: function () {
    return this.subproperty;
  },
  someOtherMethod: function () {
    return false;
  },
};
var instance = new SubType();
alert(instance.getSuperValue()); //error!
```

#### 原型链虽然很强大，可以用它来实现继承，但它也存在一些问题。

1. 最主要的问题来自包含`引用类型值`的原型。想必大家还记得，我们前面介绍过包含引用类型值的原型属性会被所有实例共享。

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green'];
}
function SubType() {}
// 继承了 SuperType
SubType.prototype = new SuperType();
var instance1 = new SubType();
instance1.colors.push('black');
alert(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors); //"red,blue,green,black"
```

2. 原型链的第二个问题是：`在创建子类型的实例时，不能向超类的构造函数中传递参数`。

实际上应该说是没有办法在不影响所有对象实例的情况下，给超类的构造函数传递参数。有鉴于此，再加上前面刚刚讨论过的由于原型中包含引用类型值所带来的问题，实践中很少会单独使用原型链继承。

## 2.借用构造函数继承

> 这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型的构造函数。

别忘了，`函数`只不过是在特定环境中执行代码的对象，因此通过使用 `apply()`和 `call()`方法也可以在（将来）新创建的对象上执行`构造函数`，如下所示：

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green'];
}
function SubType() {
  // 继承了 SuperType
  SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push('black');
alert(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors); //"red,blue,green"
```

这样一来，就会在新 `SubType` 对象上执行 `SuperType()`函数中定义的所有对象初始化代码。结果，`SubType` 的每个实例就都会具有自己的 `colors` 属性的副本了。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '通过借用构造函数的方式,我们解决了通过`原型链继承`的2大问题。\n\n1.避免了引用类型的属性被所有实例共享\n\n2.可以在 `Child` 中向 `Parent` 传参。';

export default () => <Info type="info" title="" txt={txt} />;
```

```js
function SuperType(name) {
  this.name = name;
}
function SubType() {
  // 继承了 SuperType，同时还传递了参数
  SuperType.call(this, 'Nicholas');
  // 实例属性
  this.age = 29;
}
var instance = new SubType();
alert(instance.name); //"Nicholas";
alert(instance.age); //29
```

但是该种方式也存在一个致命的缺点，**方法都在构造函数中定义，每次创建实例都会创建一遍方法**,无法保证函数的复用性。

而且，在`超类型`的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用`构造函数模式`。考虑到这些问题，借用构造函数的技术也是很少单独使用的。

## 3.组合继承

针对上述遇到的问题,又推动了一种新的继承方式诞生，叫做`组合继承`。

> `组合继承（combination inheritance）`，有时候也叫做`伪经典继承`，指的是将`原型链`和`借用构造函数`的技术组合到一块，从而发挥二者之长的一种继承模式。其背后的思路是`使用原型链`实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。

这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。直接来看一个例子:

```js
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

SuperType.prototype.sayName = function () {
  alert(this.name);
};

function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name);
  this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  alert(this.age);
};

var instance1 = new SubType('Nicholas', 29);
instance1.colors.push('black');
alert(instance1.colors); // "red,blue,green,black"
instance1.sayName(); // "Nicholas";
instance1.sayAge(); // 29
var instance2 = new SubType('Greg', 27);
alert(instance2.colors); // "red,blue,green"
instance2.sayName(); // "Greg";
instance2.sayAge(); // 27
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为`JavaScript`中最常用的继承模式。';

export default () => <Info type="info" title="" txt={txt} />;
```

## 4.原型式继承

> 这种方法并没有使用严格意义上的构造函数。他的想法是`借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型`。

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

在 `object()`函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。从本质上讲，`object()`对传入其中的对象执行了一次`浅复制`。来看下面的例子:

```js
var person = {
  name: 'Nicholas',
  friends: ['Shelby', 'court', 'Van'],
};

var anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');

var yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Barbie');

alert(person.friends); // "Shelby,Court,Van,Rob,Barbie"
```

在后来`Object.create()`方法规范化了`原型式继承`。

这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。在传入一个参数的情况下，`Object.create()`与 `object()`方法的行为相同。

## 5.寄生式继承

> 寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```js
function createAnother(original) {
  var clone = Object.create(original);
  clone.sayHi = function () {
    alert('Hi');
  };
  return clone;
}
```

在这个例子中，`createAnother()`函数接收了一个参数，也就是将要作为新对象基础的对象。然后，把这个`对象（original）`传递给 `object()`函数，将返回的结果赋值给 `clone`。再为 `clone` 对象添加一个新方法 `sayHi()`，最后返回 `clone` 对象。可以像下面这样来使用 `createAnother()`函数：

```js
var person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // "hi"
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '寄生式继承缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。';

export default () => <Info type="info" title="" txt={txt} />;
```

## 6.寄生组合式继承

前面说过，`组合继承`是 `JavaScript` 最常用的继承模式；不过，它也有自己的不足。

组合继承最大的问题就是无论什么情况下，都会调用两次超类型构造函数：

- 一次是在创建子类型原型的时候，

- 另一次是在子类型构造函数内部。

没错，子类型最终会包含超类型对象的全部实例属性，但我们不得不在调用子类型构造函数时重写这些属性。

> 所谓寄生组合式继承，即通过借用`构造函数`来继承属性，通过`原型链`的混成形式来继承方法。

其背后的基本思路是：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用`寄生式继承`来继承超类型的原型，然后再将结果指定给子类型的原型。

```js
function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype); //创建对象
  prototype.constructor = subType; // 增强对象
  subType.prototype = prototype; // 指定对象
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function () {
  alert(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function () {
  alert(this.age);
};
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '这个例子的高效率体现在它只调用了一次 `SuperType` 构造函数，并且因此避免了在 `SubType.prototype` 上面创建不必要的、多余的属性。\n\n与此同时，原型链还能保持不变；因此，还能够正常使用 `instanceof` 和 `isPrototypeOf()`。开发人员普遍认为`寄生组合式继承`是`引用类型`最理想的继承范式。';

export default () => <Info type="info" title="" txt={txt} />;
```
