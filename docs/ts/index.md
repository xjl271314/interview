---
title: 知识手册
nav:
  title: typescript
  path: /typescript
group:
  title: typescript
  path: /typescript/project
---

# 知识文档

- 2021.11.05

## 基础知识

这里使用的 `TypeScript` 版本为 3.x

### 安装

```ts
npm install typescript -g

yarn global add typescript
```

使用全局安装的好处就是可以在任何地方使用 `tsc` 命令,如我们常见的初始化一个`tsconfig.json` 只需要 `tsc --init` 即可。

### 强类型语言与弱类型语言

- 强类型语言:

> 不允许改变变量的类型,除非进行强制类型转换。例如: Java、C++、Python;

```java
class C {
    public static void main(String[] args){
        int x = 1;
        boolean y = true;
        x = y; // Error: incompatible types: boolean can not covert to int;

        char z = 'a';
        x = z; // 强制类型转化: 97 会将a的ACSII码转化为整形 赋值给x

        System.out.println(x);
    }
}
```

- 弱类型语言:

> 变量可以被赋值不同的类型。例如: JavaScript;

```ts
let a = 1;
let b = 'hello';
let c = true;

a = b; // hello
a = c; // true
```

### 静态类型语言与动态类型语言

- 静态类型语言

> 在编译阶段确定所有变量的类型。例如: C++;

```c++
class C {
    public:
        int x;
        int y;
}

int add(C a,C b){
    return a.x + b.y;
}
```

- 动态类型语言

> 在程序执行阶段确定所有变量的类型。例如 JavaScript、PHP

```ts
function add(x, y) {
  return x + y;
}

add(1, 2); // 3
add(1, '2'); // 12
```

## 基本变量类型

`Typescript` 基本变量类型在原有的`javascript`类型上记性了扩展。

### Boolean

最基本的数据类型就是简单的`true/false`值，在`JavaScript`和`TypeScript`里叫做`boolean`（其它语言中也一样）。

```ts
let isDone: boolean = false;
```

### Number

`TypeScript` 里的所有数字也都是浮点数，类型是 `number`。 除了支持`十进制`和`十六进制`字面量，`TypeScript`还支持 `ECMAScript 2015` 中引入的 `二进制` 和 `八进制`字面量。

```ts
let decLiteral: number = 6; // 10进制
let hexLiteral: number = 0xf00d; // 16进制
let binaryLiteral: number = 0b1010; // 2进制
let octalLiteral: number = 0o744; // 8进制
```

### String

我们使用 `string` 表示文本数据类型。 和 `JavaScript` 一样，可以使用`双引号（"）`或`单引号（'）`表示字符串。

```ts
let name: string = 'bob';
name = 'smith';
```

我们还可以使用**模版字符串**，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（ \`），并且以`${ expr }`这种形式嵌入表达式。

```ts
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello， my name is ${name}. I'll be ${
  age + 1
} years old next month.`;
```

### Array

`TypeScript`像 `JavaScript`一样可以操作数组元素。 有两种方式可以定义数组。

- 第一种，可以在元素类型后面接上 `[]`，表示由此类型元素组成的一个数组：

  ```ts
  let list: number[] = [1, 2, 3];
  let list2: string[] = ['1', '2', '3'];
  ```

- 第二种方式是使用数组泛型，`Array<元素类型>`：

  ```ts
  let list: Array<number> = [1, 2, 3];
  // 当数组中既有string也有number
  let list2: Array<number | string> = [1, '2', 3];
  ```

### Object

`object` 表示非原始类型，也就是除 `number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。

使用 `object` 类型，就可以更好的表示像 `Object.create` 这样的 API。例如：

```ts
declare function create(o: object | null): void;

create({ prop: 0 });
create(null);

create(42); // Error
create('string'); // Error
create(false); // Error
create(undefined); // Error

let obj: { x: number; y: number } = { x: 1, y: 2 };
obj.x = 3;
```

### 函数

```ts
let compute: (x: number, y: number) => number;
compute = (a, b) => a + b;
```

### Symbol

自`ECMAScript 2015`起，`symbol`成为了一种新的原生类型，就像`number`和`string`一样。

`symbol`类型的值是通过`Symbol`构造函数创建的。

```ts
let sym1: symbol = Symbol();

let sym2 = Symbol('key'); // 可选的字符串key
```

### Null 和 Undefined

`TypeScript`里，`undefined`和 `null` 两者各自有自己的类型分别叫做 `undefined` 和 `null`。 和 `void` 相似，它们的本身的类型用处不是很大：

```ts
// Not much else we can assign to these variables!
let un: undefined = undefined;
let nu: null = null;
let y: undefined = '1'; // Error

// 如果想使用 `null` 和 `undefined` 可以互相声明，需要在`tsconfig.json`中开启 "strictNullChecks": false,
un = null; // OK
```

### void

当我们使用一个没有任何返回的函数, 就可以使用 `void`。

```ts
function watchUser(): void {
  console.log('this is a void function');
}

const watchUser = (): void => {
  console.log('this is a void function');
};
```

声明一个 `void` 类型的变量没有什么大用，因为你只能为它赋予 `undefined` 和 `null`：

```ts
let unusable: void = undefined;
```

### any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any` 类型来标记这些变量：

但是在我们知道变量的类型的时候，不推荐使用 any 来进行标记，如果都使用 `any`，那么就失去了使用`TypeScript`的意义。

```ts
let notSure: any = 4;
notSure = 'maybe a string instead'; // OK
notSure = false; // OK
```

### never

> `never`类型表示的是那些永不存在的值的类型。

例如， `never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

**一般很少使用, 场景: `函数抛出错误` 或 `死循环时使用` never**

```ts
// 返回never的函数必须存在无法到达的终点
function error(message): never {
  throw new Error(message);
}

// 推断返回值为never类型
function fail() {
  return error('something faild!');
}

// 返回never的函数必须存在无法到达的终点
function infiniteLoop(): never {
  while (true) {
    // do something
  }
}
```

### 元组

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 `string` 和 `number` 类型的元组。

```ts
// declare a tuple type
let x: [string, number];

// Initialize it correct
x = ['hello', 3];

// Initialize it incorrectly
x = [1, 'hello'];
```

- 当访问一个已知索引的元素，会得到正确的类型：

  ```ts
  x[0].substr(1); // OK 'ello'

  x[1].substr(1); // Error, 'number' does not have 'substr'
  ```

- 当添加一个越界的元素，会使用**联合类型**替代：

  ```ts
  // error TS2322: Type '3' is not assignable to type 'undefined'.
  // error TS2493: Tuple type '[string, number]' of length '2' has no element at index '3'.
  x[3] = 'world';

  // 添加正常 但是仍然不能访问
  x.push(1);

  // error TS2532: Object is possibly 'undefined'.
  // error TS2493: Tuple type '[string, number]' of length '2' has no element at index '5'.
  console.log(x[5].toString());

  // error TS2322: Type 'true' is not assignable to type 'undefined'.
  // error TS2493: Tuple type '[string, number]' of length '2' has no element at index '6'.
  x[6] = true;
  ```

- 可以给该元祖添加新元素, 但不能 “越界” 访问

  ```ts
  let tuple: [number, string] = [1, '2'];
  tuple.push('3'); // [1, '2', '3'];
  tuple[3]; // Tuple type '[number, string]' of length '2' has no element at index '3'.
  ```

## 枚举

`enum`类型是一组有名字的常量集合，是对 `JavaScript` 标准数据类型的一个补充。 使用枚举我们可以定义一些带名字的常量, 可以清晰地表达意图或创建一组有区别的用例。 `TypeScript`支持`数字`的和基于`字符串`的枚举。

其中枚举成员的值是`只读(readonly)`的定义了之后不能进行修改。

### 数字枚举

- 若无默认值, 默认从 0 开始, 依次递增。既可以使用数字索引也可以使用对象索引 内部通过'反向映射'的原理实现:

  ```ts
  enum Role {
    Repoeter,
    Developer,
    Maintainer,
    Owner,
    Guest,
  }

  console.log(Role);

  /*
      {
      '0': 'Repoeter',
      '1': 'Developer',
      '2': 'Maintainer',
      '3': 'Owner',
      '4': 'Guest',
      Repoeter: 0,
      Developer: 1,
      Maintainer: 2,
      Owner: 3,
      Guest: 4
      }
      */
  ```

- 当我们给数字枚举指定初始值, 会从初始值依次递增:

  ```ts
  // 自定义枚举初始值
  enum Role2 {
    Repoeter = 1,
    Developer,
    Maintainer,
    Owner,
    Guest,
  }

  /*
      {
      '1': 'Repoeter',
      '2': 'Developer',
      '3': 'Maintainer',
      '4': 'Owner',
      '5': 'Guest',
      Repoeter: 1,
      Developer: 2,
      Maintainer: 3,
      Owner: 4,
      Guest: 5
      }
      */
  ```

- ts 数字枚举内部实现的原理:

  ```ts
  enum Direction {
    Up = 10,
    Down,
    Left,
    Right,
  }
  // js
  (function (Direction) {
    Direction[(Direction['Up'] = 10)] = 'Up';
    Direction[(Direction['Down'] = 11)] = 'Down';
    Direction[(Direction['Left'] = 12)] = 'Left';
    Direction[(Direction['Right'] = 13)] = 'Right';
  })(Direction || (Direction = {}));
  ```

  1. 首先将`key`和`value`值进行对应 => `Direction["Up"] = 10`;
  2. 接着将上一步的值作为`key`，将枚举中设定的`key`作为`value => Direction[Direction["Up"] = 10] = "Up"`;

### 字符串枚举

字符串枚举的概念很简单，但是有细微的 运行时的差别。 在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

```ts
enum Status {
  Success = '成功!',
  Fail = '失败',
}

// js
var Status;
(function (Status) {
  Status['Success'] = '\u6210\u529F!';
  Status['Fail'] = '\u5931\u8D25';
})(Status || (Status = {}));
```

对比数字枚举, 少了 `反向映射`, 就是普通的赋值. 只有 `key` 和 `value`. **不可以通过 `value` 索引 `key` 值**.

所有字符串的枚举, 只要有一个是字符串, 所有的成员都得赋值:

```ts
enum Status {
  Success = '成功!',
  Fail, // Error 需要进行赋值操作
}
```

### 异构枚举

我们可以混用`字符串枚举`和`数字枚举` , 但是不建议使用:

```ts
enum Answer {
  N,
  Y = 'yes',
}

/*
{
    '0': 'N',
    N: 0,
    Y: 'yes'
}
*/
```

虽然上述代码并不会保错，但是我们不推荐这样去使用，这样的做法不符合枚举的规范，除非你真的想利用`javascript`运行时的行为。

### 枚举成员

```ts
// 枚举成员是只读的，不可以进行修改
enum Status {
  Success = '成功!',
  Fail = '失败',
}

Status.Fail = 'error'; // 报错 只读属性

enum Char {
  // const member
  a,
  b = Char.a,
  c = 1 + 3,
  // computed member 执行阶段
  d = Math.random(),
  e = '123'.length,
  // computed member后的成员必须要赋予初始值
  f = 4,
}

// 常量枚举 会在编辑阶段被移除 当我们不需要一个对象仅需要对象的值的时候使用
const enum Month {
  Jan = 1,
  Feb,
  Mar,
  Apr = Month.Mar + 1,
}

// [ 1, 2, 3 ]
const month = [Month.Jan, Month.Feb, Month.Mar];

// 枚举类型
enum E {
  a,
  b,
}
enum F {
  a = 0,
  b = 1,
}
enum G {
  a = 'apple',
  b = 'banana',
}

let e: E = 3;
let f: F = 3;
// console.log(e === f) error

let e1: E.a = 3;
let e2: E.b = 3;
let e3: E.a = 3;
// console.log(e1 === e2) error
// console.log(e1 === e3) true

let g1: G = G.a;
let g2: G.a = G.a;
```

## 接口

`TypeScript` 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做`鸭式辨型法`或`结构性子类型化`。 在`TypeScript`里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

这个概念怎么去理解呢?

比如说有一只鸟，人们认为它长得像鸭子，叫声也像鸭子，于是把这只鸟定义为了一只鸭子。一个实际一点的例子就是处理后端返回数据的时候:

```ts
// 定义一个List接口
interface List {
  readonly id: number;
  name: string;
  age?: number;
}

// 定义返回的数据
interface Result {
  data: List[];
}

function render(result: Result) {
  result.data.forEach((value) => {
    console.log(value.id, value.name);
    if (value.age) {
      console.log(value.age);
    }
    // value.id++
  });
}

// 这里data中多返回了一个未定义的sex字段 但是ts编译也正常通过
let result = {
  data: [
    { id: 1, name: 'A', sex: 'male' },
    { id: 2, name: 'B', age: 10 },
  ],
};

render(result);
```

### 对象接口的基本属性

接口里的属性不全都是必需的。可以有`普通属性`，`可选属性`及`只读属性`等。

```ts
interface User {
  readonly id: number; // 只读属性 不可修改
  name?: string; // 可以有, 可以没有
  gender: string; // 一定要有
  eat(): void; // 也可以声明一个函数
}

// example
let p1: User = {
  id: 1,
  gender: 'man',
};

//Error: Cannot assign to 'id' because it is a constant or a read-only property.
p1.id = 2;

//Error: Property 'gender' is missing in type
let p2: User = {
  id: 2,
};
```

### 对象接口声明方式

这个 `type` 可以是普通的类型, 也可以是一个 `interface` 接口, 大概有以下三种使用方式. 如下:

```ts
interface List {
  data: string;
}

// 声明一个对象
let obj: List = { data: 'msg' };

// 函数声明参数, 返回值
function a(x: List): List {
  return x;
}

// 类实现接口, 类似于 java 语言, 在接口描述一个方法，在类里实现它
// 这种方式一般很少使用, 不过可以了解一下
class Crazy implements List {
  constructor() {}
  data: string;
}
```

日常使用我们经常会有一些嵌套对象, 比如拿到后台接口的格式是这样子的.

```ts
let res = {
  subject: 'math',
  detail: [
    {
      id: 1,
      data: '数学',
    },
  ],
};
```

我们可以用下面的方式来定义:

```ts
interface List {
  id: number;
  data: string;
}
interface LearnList {
  subject: string;
  detail: List[];
}
let res: LearnList = {
  subject: 'math',
  detail: [
    {
      id: 1,
      data: '数学',
    },
  ],
};
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n如果作为函数参数声明的话, 会有一个有意思的地方. 我们直接传值的话, 会有报错提示. 那如何解决这个报错提示?';

export default () => <Info type="warning" txt={txt} />;
```

```ts
function transformData(data: LearnList) {
  return data;
}

transformData({
  subject: 'math',
  xxx: 'sss', // Error, 多了一个属性
  detail: [
    {
      id: 1,
      data: '数学',
    },
  ],
});
```

解决方法:

1. 将值赋值给一个对象.

```ts
const cache = {
  subject: 'math',
  xxx: 'sss',
  detail: [
    {
      id: 1,
      data: '数学',
    },
  ],
};

transformData(cache); // OK
```

2. 使用类型断言

类型断言使用起来非常方便，我们可以直接到传的参数后面调用 `as LearnList`, 告诉编辑器, 我们明确知道这个对象是 `LearnList` 的,请绕过这个检查.

```ts
transformData({
  subject: 'math',
  xxx: 'sss',
  detail: [
    {
      id: 1,
      data: '数学',
    },
  ],
} as LearnList); // OK

// 这种方式也是可以的 但是更推荐上述方法 该方式在React中会产生歧义
transformData(<LearnList>{
  subject: 'math',
  xxx: 'sss',
  detail: [
    {
      id: 1,
      data: '数学',
    },
  ],
}); // OK
```

### 可索引类型接口

从上面的问题看出, 在原有的对象声明中多一个属性就报错了. 有些场景我们可能对入参的参数比较灵活, 除了我们规定的一些参数, 不确定还会传其他什么参数进来的时候, 可以使用 `可索引类型接口`。

```ts
interface List {
  id: number;
  data: string;
}

interface LearnList {
  subject: string;
  detail: List[];
  [x: string]: any; // 可以用任意的string类型去索引声明的对象, 值是any类型
}

transformData({
  subject: 'math',
  xxx: 'sss',
  detail: [
    {
      id: 1,
      data: '数学',
    },
  ],
}); // OK
```

可索引类型接口使用场景:

1. 用字符串索引的接口

   ```ts
   interface StringArray {
     [x: string]: string; // 表示可以用任意字符串去索引 对象, 得到一个字符串的值
   }
   ```

2. 用数字索引的接口

   ```ts
   interface StringArray {
     [x: number]: string; // 用任意的 number 去索引对象, 都会得到一个 string 类型. 其实就是我们的数组了
   }
   ```

3. 混用 2 种索引

   ```ts
   interface StringArray {
     [x: string]: string;
     [z: number]: string;
   }

   // 既可以用字符串索引也可以用数字索引
   let x: StringArray = {
     1: '2323',
     '2': '23423',
   };
   ```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n不管是`数字索引`还是`字符串索引`，下面的索引值类型，必须是上面索引的子类型. 因为我们已经规定了任意的索引得到的值都是 `string` , 此时任何一个成员的值变成 `number` 都会报错.';

export default () => <Info type="warning" txt={txt} />;
```

```ts
interface StringArray {
  [x: string]: string;
  [z: number]: string;
  y: 22; // Error : Property 'y' of type '22' is not assignable to string index type 'string'
}

interface StringArray {
  [x: string]: string;
  [z: number]: number; // Error 因为 string 不兼容 number
}

interface StringArray {
  [x: string]: any;
  [z: number]: number; // OK any 兼容 number
}
```

### 函数类型接口

```ts
let add: (x: number, y: number) => number;

interface Add {
  (x: number, y: number): number;
}

// 使用类型别名
type Add = (x: number, y: number) => number;

let sum: Add = (a, b) => a + b;
```

- 混合类型接口

  ```ts
  interface Lib {
    (): void;
    version: string;
    doSomething(): void;
  }

  function getLib() {
    let lib: Lib = (() => {}) as Lib;
    lib.version = '1.0';
    lib.doSomething = () => {};

    return lib;
  }

  let lib1 = getLib();
  lib1();
  lib1.doSomething();

  let lib2 = getLib();
  ```

## 函数

和 `JavaScript`一样，`TypeScript`函数也可以创建`具名函数`和`匿名函数`。 我们可以随意选择适合应用程序的方式，不论是定义一系列 API 函数还是只使用一次的函数。

```ts
// Named function
function add(x, y) {
  return x + y;
}

// Anonymous function
let myAdd = function (x, y) {
  return x + y;
};
```

### 函数声明方式

`TypeScript`能够根据返回语句自动推断出返回值类型，因此我们通常省略返回值类型声明。

1. 直接声明函数参数, 直接在参数后面声明类型即可。

   ```ts
   // 不申明函数返回值类型
   function add(x: number, y: number) {
     return x + y;
   }

   // 申明函数返回值类型
   function add(x: number, y: number): number {
     return x + y;
   }
   ```

   **除了直接在变量后面跟上类型，我们还可以通过以下方式:**

   - 通过变量来定义函数类型

     ```ts
     // 经测试该方式行不通 测试版本3.7.4
     let add2: (x: number, y: number) => number;
     ```

   - 通过别名来定义函数类型

     ```ts
     type add3 = (x: number, y: number) => number;
     ```

   - 通过接口来定义函数类型

     ```ts
     interface add4 {
       (x: number, y: number): number;
     }
     ```

   - 调用方式如下:

     ```ts
     let addFn: add3 = (a, b) => {
       return a + b;
     };
     ```

2. 使用解构赋值的方式声明函数，进而减少赋值。

   ```ts
   function add({ x, y }: { x: number; y: number }) {
     return x + y;
   }
   add({ x: 2, y: 3 });
   ```

### 函数的可选参数

在`Javascript`中当一个函数接收多个参数的时候，假如只传入一个参数并不会报错，但是在`TypeScript`中会报错。

```ts
function add(x: number, y: number) {
  return x + y;
}

// js中
add(1); // NaN ==> 1 + undefined

// ts中
add(1); // error TS2554: Expected 2 arguments, but got 1.
```

因此在 TS 中如果一个函数可以接收一个，或者 2 个参数这个时候我们可以使用`可选参数`的方式。

```ts
function add5(x: number, y?: number) {
  return y ? x + y : x;
}

// add5(1) ==> 1

// Error A required parameter cannot follow an optional parameter.
function add6(x?: number, y: number) {
  return x + y;
}
```

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n当我们使用函数可选参数的时候，<strong>可选参数必须位于所有必选参数的后面，也就是作为最后一个参数。</strong>';

export default () => <Info type="warning" txt={txt} />;
```

### 函数的默认参数

在 js 中我们可以在声明函数的时候提供默认值，在 ts 中也可以使用`函数默认值`，不过需要注意以下不同之处。

```ts
function add7(x: number, y = 0, z: number, q = 1) {
  return x + y + z + q;
}
```

- ts 中当我们想要使用默认参数的时候需要传入 undefined、null

  ```ts
  add7(0, undefined, 2); // 0 + 0 + 2 + 1 ===> 3
  add7(0, null, 2); // 0 + 0 + 2 + 1 ===> 3
  ```

### 函数的剩余参数

在 js 中我们知道 ES6 提供了剩余参数的解构方式，在 ts 中同样适用。

```ts
function add(...rest: number[]) {
  return rest.reduce((pre, cur) => pre + cur);
}

add7(1, 2, 3, 4, 5); // 15
```

### 函数的重载

> 函数重载是指某个函数有多个功能但是他接收的参数类型一般不同，为了实现类似的功能而定义名称相同的函数。

```ts
function add8(...rest: number[]): number;
function add8(...rest: string[]): string;

function add8(...rest: any[]) {
  let first = rest[0];
  if (typeof first === 'number') {
    return rest.reduce((pre, cur) => pre + cur);
  }
  if (typeof first === 'string') {
    return rest.join('');
  }
}

console.log(add8(1, 2));
console.log(add8('a', 'b', 'c'));
```

## 类

### 基本实现

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    // 这里的定义必须赋值初始值
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}
let greeter = new Greeter('world');
```

**`类的成员属性`都是实例属性，`类的成员方法`都是“原型”方法。**

### 类的继承

```ts
class Dog {
  constructor(name: string) {
    this.name = name;
  }
  name: string = 'dog';
  run() {}
}

class Husky extends Dog {
  constructor(name: string, color: string) {
    // super关键字用于访问和调用一个对象的父对象上的函数。
    super(name);
    this.color = color;
  }
  color: string = 'yellow';
}
```

### 成员修饰符

- public 公共可访问(可在任意地方调用)
- private 私有属性
- protected 保护属性(仅可在子类中调用)

```ts
class Father {
  constructor() {}

  public greet() {
    return 'Hello';
  }

  private hello() {
    return 'ee';
  }

  protected hi() {
    return 'ee';
  }
}

class children extends Father {
  constructor() {
    super();
  }

  test() {
    this.hello(); // 报错: 是私有成员, 不可在类外部调用
    this.hi(); // 可调用
  }
}

new children().greet(); // OK Hello

new children().hello(); // 报错: 是私有成员, 不可在类外部调用

new children().hi(); // 报错: 只能在子类中调用
```

### 只读属性

使用`readonly`可以将变量声明为只读，声明的时候必须初始化。

```ts
class Dog {
  constructor(name: string) {
    this.name = name;
  }
  name: string = '灰灰';
  readonly type: string = 'dog';
}

const dog = new Dog('阿奇');
console.log(dog.name);

// error TS2540: Cannot assign to 'type' because it is a read-only property.
dog.type = 'cat';
```

### 静态属性

`static`静态属性不需要 new 实例化就可以直接调用或访问。且子类可以继承。

```ts
class Greeter {
  constructor() {}
  static config: string = '33';
}
Greeter.config; // 33

class Helloer extends Greeter {
  constructor() {
    super();
  }
}

Helloer.config; // 33
```

### 存取器

`TypeScript`支持通过 `getters/setters` 来截取对象成员的访问。能够帮助我们有效的控制对对象成员的访问。

```ts
class Greeter {
  constructor(message: string) {
    this.greeting = message;
  }
  greeting: string;
  get hello() {
    return this.greeting;
  }
  set hi(x) {
    this.greeting = x;
  }
}
const x = new Greeter('eeee');
x.hi('22');
x.hello = '2'; // 报错, 不能修改
```

实际上就是使用 `getters/setters` 来截取对对象成员的访问。解析出来的源码如下:

```js
var Greeter = /** @class */ (function () {
  function Greeter(message) {
    this.greeting = message;
  }
  Object.defineProperty(Greeter.prototype, 'hello', {
    get: function () {
      return this.greeting;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(Greeter.prototype, 'hi', {
    set: function (x) {
      this.greeting = x;
    },
    enumerable: true,
    configurable: true,
  });
  return Greeter;
})();
```

### 抽象类

> 抽象类只能被继承不能被实例化，采用 `abstract` 关键字进行声明。

```ts
abstract class Animal {
  eat() {
    console.log('eat');
  }

  // 定义一个抽象方法 用于子类自定义实现 在运行时绑定
  abstract sleep(): void;
}

// error TS2511: Cannot create an instance of an abstract class.
let animal = new Animal();

class Dog extends Animal {
  constructor(name: string) {
    super();
    this.name = name;
  }
  name: string;
  run() {}
  sleep() {
    console.log('趴着睡');
  }
}

let dog = new Dog('阿奇');
dog.eat(); // eat
```

### 多态

```ts
class Cat extends Animal {
  sleep() {
    console.log('蜷缩着睡');
  }
}

let cat = new Cat();

let animals: Animal[] = [dog, cat];
animals.forEach((element) => {
  element.sleep(); // 趴着睡,蜷缩着睡
});
```

### 链式调用

```ts
class WorkFlow {
  step1() {
    return this;
  }
  step2() {
    return this;
  }
  step3() {
    return 'done';
  }
}

let job1 = new WorkFlow().step1().step2().step3();
console.log(job1); // done

class MyFlow extends WorkFlow {
  next() {
    return this;
  }
}

// 实现继承的链式调用时this也是多态
let job2 = new MyFlow().step1().next().step2().next().step3();
console.log(job2); // done
```

## 类与接口的关系

### 接口的实现

这一块其实是相对于 `javascript` 而言, 引入了 `java` 的一些属性. 比如 `implements` 这一块在实际项目中其实很少用到.

1. 接口只能描述类的公共部分，不能描述私有成员

   ```ts
   interface Point {
     x: number;
     draw(): void;
   }

   class Draw implements Point {
     constructor() {}

     // Error Class 'Draw' incorrectly implements interface 'Point'. Property 'x' is private in type 'Draw' but not in type 'Point'.
     private x: number;
     draw() {}
   }
   ```

2. 类实现接口时，必须实现接口中所有的属性

   ```ts
   interface Point {
     x: number;
     draw(): void;
   }

   class Draw implements Point {
     constructor() {}
     x: number;

     // 如果这行不见了,就会报错
     // Error TS2420: Class 'Draw' incorrectly implements interface 'Point'.
     // Property 'draw' is missing in type 'Draw' but required in type 'Point'.
     draw() {}
     color: string; // 类中增加新的属性是可以的
   }
   ```

3. 接口无法约束类的构造函数

   ```ts
   interface Point {
     x: number;
     draw(): void;
     new (x: number): void; // Error. 不用写这个
   }

   class Draw implements Point {
     constructor(x: number) {
       this.x = x;
     }
     x: number;
     draw() {}
   }
   ```

### 接口继承接口

```ts
interface Point {
  x: number;
}

// 如需继承一个接口直接extends
interface Draw extends Point {
  y: number;
}

interface Shape {
  draw(): void;
}

// 继承多个接口的时候用逗号隔开，同样的他可以被反复extends
interface Human extends Draw, Shape {}

// 必须具有继承接口的所有属性
let peen: Human = {
  x: 1,
  y: 1,
  draw: () => {},
};
```

### 接口继承类

```ts
class Auto {
  state = 1;
  // private state2 = 0
}

interface AutoInterface extends Auto {}

class C implements AutoInterface {
  state = 1;
}

class Bus extends Auto implements AutoInterface {}
```

## 泛型

- 2021.11.23

我们先来看一个`log`函数--->接收一个字符串类型，返回该字符串。

```ts
function log(value: string): string {
  console.log(value);

  return value;
}
```

如何实现接收`字符串`也接收`字符串数组`?

1. 通过函数重载

   ```ts
   function log(value: string): string;
   function log(value: string[]): string[];
   function log(value: any) {
     console.log(value);

     return value;
   }
   ```

2. 通过联合类型

   ```ts
   function log(value: string | string[]): string | string[] {
     console.log(value);

     return value;
   }
   ```

使用联合类型确实能够解决问题，但是假如需要接收任意参数类型呢？难道一个个去罗列。

这个时候我们想到了`any`类型。

3. 使用 `any` 类型进行接收

   ```ts
   function log(value: any) {
     console.log(value);

     return value;
   }
   ```

使用 `any` 类型确实能够解决问题，但是这就违背了 ts 的约束原则，这就引出了`泛型`的概念。

> 泛型：不预先确定的数据类型，具体的类型在使用的时候才能确定。

1.  直接在函数上使用泛型

    ```ts
    function log<T>(value: T): T {
      console.log(value);

      return value;
    }

    // 给定调用类型
    log<string[]>(['a', 'b']);

    // a使用类型推断
    log(['a', 'b']);
    ```

2.  使用函数别名来定义

    ```ts
    type Log = <T>(value: T) => T;

    let myLog: Log = log;
    ```

3.  使用接口

    ```ts
    interface Log {
      <T>(value: T): T;
    }

    let myLog: Log = log;
    ```

上述的方式仅仅只约束了一个函数，我们也可以把泛型放到接口后面来约束所有的属性。

```ts
interfaceLog Log<T>{
    (value: T): T
}

// 使用该方式在使用的时候需要指定类型
let myLog : Log<number> = log
myLog(1);

// 上述接口还可以使用默认类型
interface Log<T: string> {
    (value: T): T
}
let myLog : Log = log;
myLog('1');
```

### 泛型类与泛型约束

- 泛型不能运用于函数的静态成员。

```ts
// ❌错误示范 error TS2302: Static members cannot reference class type parameters.
class Log<T> {
  static run(value: T) {
    console.log(value);

    return value;
  }
}

// ✅正确示范
class Log<T> {
  run(value: T) {
    console.log(value);

    return value;
  }
}

// 指定类型
let log = new Log<number>();
log.run(1);

// 类型推断
let log = new Log();
log.run('1');
log.run({ a: 1 });
```

### 类型约束

```ts
// error TS2339: Property 'length' does not exist on type 'T'.
function log<T>(value: T): T {
  console.log(value, value.length);

  return value;
}
```

当我们类型推断一个变量的属性值时，如果没有给定约束就会报错，我们可以使用`接口`来约束类型。

```ts
interface Length {
  length: number;
}

function log<T extends Length>(value: T): T {
  console.log(value, value.length);

  return value;
}

// T继承了Length接口，受到了Length接口的约束，这样只会输入的参数必须由length属性
log([]);
log('1');
log({ length: 2 });
```

### 泛型的好处

1. 函数和类可以支持多种类型，增加程序的可扩展性
2. 不必写多条函数重载，联合类型声明，增强代码的可读性
3. 灵活控制类型之间的约束

## 类型检查机制

- 2021.11.24

> 类型检查机制指的是 TypeScript 编译器在做类型检查时，所秉承的一些原则，以及表现出的一些行为。可以帮助我们辅助开发，提高开发效率。

检查机制主要包含下面几块内容：

- 类型推断
- 类型兼容性
- 类型保护

### 类型推断

> 类型推断指的是有时候我们不需要指定变量的类型(常用于推断函数的返回值类型)，TypeScript 可以根据某些规则自动的为其推断出一个类型。

- 基础类型的类型推断

  ```ts
  let a = 1; // 类型推断a是一个number

  // error TS2322: Type '"1"' is not assignable to type 'number'.
  a = '1';

  let b = [1]; // 类型推断b是一个 number[]

  // error TS2322: Type 'string' is not assignable to type 'number'.
  b = ['2'];

  // 函数fun被推断返回类型是number
  let fun = (a = 1) => a + 1; // 类型推断函数的参数a为number类型，根据默认值来推断
  ```

- 最佳通用类型的类型推断

  当一个变量中包含了多个类型的时候，ts 就会尽可能的推断出一个最佳通用的类型

  ```ts
  let arr = [1, '2', null]; // 最佳通用类型推断为 (number | string | null) []

  // 这里的number和null是不兼容的 如果要兼容需要关闭"strictNullChecks"配置项
  // 这个时候会推断为(number | string) []
  ```

- 上下文类型推断

  通常发生在事件处理中，从左到右进行推断。

  ```ts
  // event 会被推断为 KeyboardEvent vscode上请自行添加类型
  window.onkeydown = (event: KeyboardEvent) => {
    console.log(event); // 这里会提示event下的属性
  };
  ```

  在我们明确对象的类型的时候可以使用类型断言

  ```ts
  // error TS2339: Property 'bar' does not exist on type '{}'.
  let foo = {};
  foo.bar = 1;

  // 使用类型断言
  interface Foo {
    bar: number;
  }
  let foo = {} as Foo;
  // 这个时候不会报错 但是foo并没有按照接口的规范给定一个bar属性，合理的方式是使用类型约束
  // 使用类型断言的时候需要关注上下文的环境
  // 这个时候如果不给bar的初始化就会报错
  // error TS2741: Property 'bar' is missing in type '{}' but required in type 'Foo'.
  let foo: Foo = {
    bar: 1,
  };
  ```

### 类型兼容性

> 当一个类型 Y 可以被赋值给另外一个类型 X 的时候，我们可以说 类型 X 兼容类型 Y。

```ts
/**
 * X兼容Y: X(目标类型) = Y(源类型)
 *
 **/

let s: string = 'a';
// 当开启strictNullChecks配置项的时候，报错：不能将类型“null”分配给类型“string”。
// 当关闭strictNullChecks配置项的时候，不报错
s = null;
```

这个时候我们可以说 `string` 类型是兼容 `null` 类型的，也就是 `null` 是字符型的子类型。

- 接口兼容性

  ```ts
  interface X {
    a: any;
    b: any;
  }

  interface Y {
    a: any;
    b: any;
    c: any;
  }

  let x: X = {
    a: 1,
    b: 2,
  };

  let y: Y = {
    a: 1,
    b: 2,
    c: 3,
  };

  // 这个时候x是可以被赋值为y的 但是 y不可以被赋值为x
  // 因为接口Y包含了接口X的所有属性定义，X是Y的子集 (简单来说接口之间相互兼容的时候 成员少的会兼容成员多的)
  let x = y; // OK
  let y = x; // error TS2741: Property 'c' is missing in type 'X' but required in type 'Y'.
  ```

- 函数的兼容性

  函数是否兼容也常发生于函数之间的赋值。

  ```ts
  type Handler = (a: number, b: number) => void;

  function hof(handler: Handler) {
    return handler;
  }
  ```

  - 参数个数不一致的场景

    ```ts
    let handler1 = (a: number) => {};
    // OK
    hof(handler1);

    let handler2 = (a: number, b: number, c: number) => {};
    // error TS2345: Argument of type '(a: number, b: number, c: number) => void' is not assignable to parameter of type 'Handler'.
    hof(handler2);
    ```

  - 可选参数和剩余参数的场景

    ```ts
    let a = (p1: number, p2: number) => {};
    let b = (p1?: number, p2?: number) => {};
    let c = (...args: number[]) => {};

    // 固定参数是可以兼容可选参数和剩余参数的
    a = b; // OK
    a = c; // OK

    // 可选参数是不兼容固定参数和剩余参数的，我们可以将strictFunctionTypes配置项关闭来解决函数兼容问题。

    // 不能将类型“(p1: number, p2: number) => void”分配给类型“(p1?: number | undefined, p2?: number | undefined) => void”。
    b = a;

    // 不能将类型“(...args: number[]) => void”分配给类型“(p1?: number | undefined, p2?: number | undefined) => void”。
    b = c;

    // 剩余参数可以兼容固定参数和可选参数
    c = a; // OK
    c = b; // OK
    ```

  - 参数类型不一致的场景

    ```ts
    // 基础类型
    let handler3 = (a: string) => {};
    // 类型“(a: string) => void”的参数不能赋给类型“Handler”的参数。参数“a”和“a” 的类型不兼容。不能将类型“number”分配给类型“string”。
    hof(handle3);

    // 对象类型
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    interface Point2D {
      x: number;
      y: number;
    }

    let p3d = (point: Point3D) => {};
    let p2d = (point: Point2D) => {};

    p3d = p2d; // 3d 兼容2d OK

    // 不能将类型“(point: Point3D) => void”分配给类型“(point: Point2D) => void”。
    // 参数“point”和“point” 的类型不兼容。类型 "Point2D" 中缺少属性 "z"，但类型 "Point3D" 中需要该属性。
    p2d = p3d;

    // 这里总结就是参数多的兼容参数少的，我们依旧可以将strictFunctionTypes配置项关闭来解决兼容问题
    ```

  - 返回值类型不一致的场景

    目标函数的返回值类型必须与原函数相同或者是原函数的子类型

    ```ts
    let f = () => ({ name: 'aa' });
    let g = () => ({ name: 'bb', age: 24 });

    f = g; // OK  f是g的子类型

    // 不能将类型“() => { name: string; }”分配给类型“() => { name: string; age: number; }”。
    // 类型 "{ name: string; }" 中缺少属性 "age"，但类型 "{ name: string; age: number; }" 中需要该属性。
    g = f;
    ```

- 枚举的兼容性

  数字和枚举可以相互兼容，枚举与枚举间不兼容

  ```ts
  enum Fruit {
    Apple,
    Banana,
  }
  enum Color {
    Red,
    Yellow,
  }

  let fruit: Fruit.Apple = 3;
  // OK
  let no: number = Fruit.Apple;

  // error TS2322: Type 'Fruit.Apple' is not assignable to type 'Color.Red'.
  let color: Color.Red = Fruit.Apple;
  ```

- 类兼容性

  在比较两个类是否兼容的时候，类中的静态成员和构造函数是不参与比较的。

  ```ts
  class A {
    constructor(p: number, q: number) {}
    id: number = 1;
  }

  class B {
    static s = 1;
    constructor(p: number) {}
    id: number = 2;
  }

  let aa = new A(1, 2);
  let bb = new B(1);
  // OK
  aa = bb;
  ```

  如果类中含有私有成员是不能兼容的。

  ```ts
  class A {
    constructor(p: number, q: number) {}
    id: number = 1;
    private name: string = '';
  }

  class B {
    static s = 1;
    constructor(p: number) {}
    id: number = 2;
    private name: string = '';
  }

  let aa = new A(1, 2);
  let bb = new B(1);

  // 不能将类型“B”分配给类型“A”。类型具有私有属性“name”的单独声明。
  aa = bb;

  // 不能将类型“A”分配给类型“B”。类型具有私有属性“name”的单独声明。
  bb = aa;

  // 父类和子类是兼容的
  class C extends A {}
  let cc = new C(1, 3);

  aa = cc;
  cc = aa;
  ```

- 泛型的兼容性

  ```ts
  interface Empty<T> {}

  let obj1: Empty<number> = {};
  let obj2: Empty<string> = {};

  // 此时类型兼容是由于泛型接口中没有成员属性
  obj1 = obj2;
  obj2 = obj1;

  interface Empty<T> {
    value: T;
  }

  let obj1: Empty<number> = { value: 1 };
  let obj2: Empty<string> = { value: '1' };

  // 此时类型就不兼容了 不能将类型“Empty<string>”分配给类型“Empty<number>”。
  obj1 = obj2;
  // 不能将类型“Empty<number>”分配给类型“Empty<string>”。
  obj2 = obj1;
  ```

- 泛型函数的兼容性

  如果两个泛型函数的定义相同且没有指定类型的时候是可以兼容的。

  ```ts
  let log1 = <T>(x: T): T => {
    console.log('x');

    return x;
  };

  let log2 = <U>(y: U): U => {
    console.log('y');

    return y;
  };

  // OK
  log1 = log2;
  ```

#### 兼容性总结

- 结构之间兼容：成员少的兼容成员多的
- 函数之间兼容：参数多的兼容参数少的

### 类型保护

- 2021.11.29

> 类型保护就是 TypeScript 能够在特定的区块中保证变量属于某种确定的类型。我们可以在此区块中放心的引用此类型的属性或者调用此类型的方法。

先看一个例子:

```ts
enum Type {
  Strong,
  Week,
}

class Java {
  helloJava() {
    console.log('Hello Java');
  }
}

class JavaScript {
  helloJavaScript() {
    console.log('Hello JavaScript');
  }
}

function getLanguage(type: Type) {
  let lang = type === Type.Strong ? new Java() : new JavaScript();
  // Error: 类型“Java | JavaScript”上不存在属性“helloJava”。类型“JavaScript”上不存在属性“helloJava”。
  if (lang.helloJava) {
    // Error: 类型“Java | JavaScript”上不存在属性“helloJava”。类型“JavaScript”上不存在属性“helloJava”。
    lang.helloJava();
  } else {
    // Error: 类型“Java | JavaScript”上不存在属性“helloJavaScript” 类型“Java”上不存在属性“helloJavaScript”。
    lang.helloJavaScript();
  }
}
```

上述代码会报错，通过之前的知识我们可以尝试使用`类型断言`来解决问题，但是需要在每处使用到的地方都进行断言，这显然不是我们想要的结果。

```ts
...

function getLanguage(type: Type){
    let lang = type === Type.Strong ? new Java() : new JavaScript();

    if((lang as Java).helloJava){
        (lang as Java).helloJava()
    }
    else{
        (lang as JavaScript).helloJavaScript();
    }
}
```

这个时候我们就可以使用类型保护机制来解决问题。

1. 使用 `instanceof` 判断是否是某个对象的实例

   ```ts
   ...

   function getLanguage(type: Type){
       let lang = type === Type.Strong ? new Java() : new JavaScript();

       if(lang instanceof Java){
           lang.helloJava()
       }
       else{
           lang.helloJavaScript();
       }
   }
   ```

2. 使用 `in` 判断某个属性是否属于某个对象，需要对象内有唯一区别的属性

   ```ts
   ...

   class Java {
       helloJava() {
           console.log('Hello Java')
       },
       java: any
   }

   class JavaScript {
       helloJavaScript() {
           console.log('Hello JavaScript')
       },
       JavaScript: any
   }

   function getLanguage(type: Type){
       let lang = type === Type.Strong ? new Java() : new JavaScript();

       if('java' in lang){
           lang.helloJava()
       }
       else{
           lang.helloJavaScript();
       }
   }
   ```

3. 使用 `typeof` 判断基本变量类型

   ```ts
   ...

   function getLanguage(type: Type, x: number | string){
       let lang = type === Type.Strong ? new Java() : new JavaScript();

       if(typeof x === 'string'){
           x.length;
       }
       else{
           x.toFixed(2);
       }
   }
   ```

4. 使用自定义方法 类型位词的方式

   ```ts
   ...

   function isJava(lang: Java | JavaScript): lang is Java {
       return (lang as Java).helloJava !== undefined)
   }

   function getLanguage(type: Type, x: number | string){
       let lang = type === Type.Strong ? new Java() : new JavaScript();

       if(isJava(lang)){
           lang.helloJava()
       }
       else{
           lang.helloJavaScript();
       }
   }
   ```

## 高级类型

> 高级类型指 ts 为了应对复杂开发场景而做出的一些高级特性。

### 交叉类型与联合类型

- 交叉类型：指的是将多个类型合并成一个类型，新的类型将具有所有类型的特性(实际上指取所有类型的并集)

  ```ts
  interface DogInterface {
    run(): void;
  }
  interface CatInterface {
    jump(): void;
  }
  // 交叉类型使用 & 来连接
  let pet: DogInterface & CatInterface = {
    run() {},
    jump() {},
  };
  ```

- 联合类型：申明的类型并不确定可以是多个类型中的一个。

  ```ts
  let a: number | string = 'a';
  let b: 'a' | 'b' | 'c';
  let c: 1 | 2 | 3;

  class Dog implements DogInterface {
    run() {}
    eat() {}
  }

  class Cat implements CatInterface {
    jump() {}
    eat() {}
  }

  enum Master {
    Boy,
    Girl,
  }

  function getPet(master: Master) {
    let pet = master === Master.Boy ? new Dog() : new Cat();
    // pet.run()
    // pet.jump()
    pet.eat();
    return pet;
  }
  ```

  使用两个类型的共同属性创建类型保护区块:

  ```ts
  interface Square {
    kind: 'square';
    size: number;
  }
  interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number;
  }

  type Shape = Square | Rectangle;

  function area(s: Shape) {
    switch (s.kind) {
      case 'square':
        return s.size * s.size;
      case 'rectangle':
        return s.height * s.width;
      default:
        return ((e: never) => {
          throw new Error(e);
        })(s);
    }
  }
  ```

  使用 `never` 约束异常场景

  ```ts
  interface Square {
    kind: 'square';
    size: number;
  }

  interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number;
  }

  interface Circle {
    kind: 'circle';
    radius: number;
  }

  type Shape = Square | Rectangle | Circle;

  function area(s: Shape) {
    switch (s.kind) {
      case 'square':
        return s.size * s.size;
      case 'rectangle':
        return s.height * s.width;
      case 'circle':
        return Math.PI * s.radius ** 2;
      default:
        return ((e: never) => {
          throw new Error(e);
        })(s);
    }
  }
  ```

### 索引类型

实现对对象的约束查询。

```ts
let obj = {
  a: 1,
  b: 2,
  c: 3,
};

function getValues(obj: any, keys: string[]) {
  return keys.map((key) => obj[key]);
}

// [1, 2]
console.log(getValues(obj, ['a', 'b']));

// [undefined, undefined]
console.log(getValues(obj, ['c', 'd']));
```

上述的例子当我们去访问对象里面不存在的属性的时候，ts 并不会给我们返回报错，如何约束访问的变量呢？这个时候就需要`索引类型`。

- `keyof T`

```ts
interface Obj {
  a: number;
  b: string;
}

//
let key: keyof Obj;
```

- T[K]

```ts
// 此时value是一个number类型
let value: Obj['a'];
```

- T extends U

```ts
function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map((key) => obj[key]);
}

// [1, 2]
console.log(getValues(obj, ['a', 'b']));

// throw new Error(e); 不能将类型 d 分配给类型 a | b | c。
console.log(getValues(obj, ['c', 'd']));
```

### 映射类型

将原有的类型映射成新的一种类型。

- readonly

  ```ts
  interface Obj1 {
    a: string;
    b: number;
    c: boolean;
  }

  type ReadonlyObj = Readonly<Obj1>;

  // 内部实现原理
  type Readonly<T> = {
    readonly [P in keyof T]: T[P];
  };
  ```

  ![ReadonlyObj](https://img-blog.csdnimg.cn/65b4457323e24bd1957f658159c583ad.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_11,color_FFFFFF,t_70,g_se,x_16)

- partial

  ```ts
  // 将内部属性都变成可选
  type PartialObj = Partial<Obj>;

  // 内部实现原理
  type Partial<T> = {
    [P in keyof T]?: T[P];
  };
  ```

  ![PartialObj](https://img-blog.csdnimg.cn/a003829b7b734eafae0c7a51a441004d.png)

- Pick

  ```ts
  // 将部分属性挑选出来
  type PickObj = Pick<Obj, 'a' | 'b'>;

  // 内部实现原理
  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  ```

  ![PickObj](https://img-blog.csdnimg.cn/32ef468c1ec7419086e89f142c13efb2.png)

- Record

  ```ts
  // 创建一个新的属性类型，新的属性是已知属性类型
  type RecordObj = Record<'x' | 'y', Obj>;

  // 内部实现原理
  type Record<K extends keyof any, T> = {
    [P in K]: T;
  };
  ```

  ![RecordObj](https://img-blog.csdnimg.cn/bc402cafccc148abb0415737dc52dc16.png)

### 条件类型

```ts
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object';

type T1 = TypeName<string>; // string
type T2 = TypeName<string[]>; // object

// (A | B) extends U ? X : Y
// (A extends U ? X : Y) | (B extends U ? X : Y)
type T3 = TypeName<string | string[]>; // string | object

// 其实官方已经实现了 Exclude<T, U> 与之相反的是 Extract<T, U>
type Diff<T, U> = T extends U ? never : T;

type T4 = Diff<'a' | 'b' | 'c', 'a' | 'e'>; // b, c
// Diff<'a', 'a' | 'e'> | Diff<'b', 'a' | 'e'> | Diff<'c', 'a' | 'e'>
// nerver | b | c
// b | c

// 官方实现方法叫 NonNullable<T>
type NotNull<T> = Diff<T, undefined | null>;
type T5 = NotNull<string | number>; // string | number

// Extract<T, U> 从类型T中抽取出可以赋值给U的类型
type T6 = Extract<'a', 'a' | 'e'>; // 'a'

// ReturnType<T>
type T7 = ReturnType<() => string>; // string

// 内部实现原理
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

## 项目工程实践

### ES6 与 CommonJS 模块

tsconfig 文件解读

```json
{
    ...
    "target": "es5",  // 设置需要编译出来的javascript是什么版本
    "module": "commonjs", // 要把我们的代码编译成什么模块的系统
}
```

### ts 命名空间

```ts
// a.ts
namespace Shape {
  // pi只在该命名空间下可访问
  const pi = Math.PI;
  export function cricle(r: number) {
    return pi * r ** 2;
  }
}

// b.ts 这个是一个引用的语法
/// <reference path="a.ts" />
namespace Shape {
  export function square(x: number) {
    return x * x;
  }
}

console.log(Shape.cricle(2));
console.log(Shape.square(2));

// 给变量起了个别名
import cricle = Shape.cricle;
console.log(cricle(2));
```

不要在一个模块中使用命名空间，命名空间最好在全局的环境中使用。

编译后的代码:

```ts
// a.js
var Shape;
(function (Shape) {
  var pi = Math.PI;
  function cricle(r) {
    return pi * Math.pow(r, 2);
  }
  Shape.cricle = cricle;
})(Shape || (Shape = {}));

// b.js
/// <reference path="a.ts" />
// 上述是一个引用的语法
var Shape;
(function (Shape) {
  function square(x) {
    return x * x;
  }
  Shape.square = square;
})(Shape || (Shape = {}));
console.log(Shape.cricle(2));
console.log(Shape.square(2));
var cricle = Shape.cricle;
console.log(cricle(2));
```

### 声明合并

> 指的是编辑器会把程序中多个相同的声明合并成一个。

- 接口的声明合并

  ```ts
  interface A {
    x: number;
  }

  interface B {
    y: number;
  }

  // 这个时候a需要具备x、y两个属性
  let a: A = {
    x: 1,
    y: 2,
  };
  ```

  **如果说两个同名接口中声明了同一个属性，且两个属性的类型不一致的时候，这个时候会发生错误**:

  ```ts
  interface A {
      x: number;
  + y: string
  }

  interface B {
      y: number
  }

  // 这个时候a需要具备x、y两个属性
  let a: A = {
      x: 1,
      y: 2
  }
  ```

  ![同名接口不同属性类型](https://img-blog.csdnimg.cn/20982dae79cb48ae894f3ac2ef5ec827.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

  **对于函数成员，每个函数都会生成一个新的函数重载，函数列表中的顺序会以后声明的排在前面**:

  ```ts
  interface A {
      x: number;
      foo: (bar : number): number // 在函数声明列表中排3位
      foo: (bar: 'a'): number
  }

  interface B {
      y: number;
      foo: (bar : string): string; // 在函数声明列表中排1位
      foo: (bar : number[]): number[]; // 在函数声明列表中排2位
  }

  let a: A = {
      x: 1,
      y: 1,
      foo(bar: any){
          return bar
      }
  }
  ```

  **如果函数声明是字面量的话会被提升到顶端**:

  ```ts
  interface A {
      x: number;
      foo: (bar : number): number; // 在函数声明列表中排5位
      foo: (bar: 'a'): number // 在函数声明列表中排2位
  }

  interface B {
      y: number;
      foo: (bar : string): string; // 在函数声明列表中排3位
      foo: (bar : number[]): number[]; // 在函数声明列表中排4位
      foo: (bar: 'b'): number; // 在函数声明列表中排1位
  }

  let a: A = {
      x: 1,
      y: 1,
      foo(bar: any){
          return bar
      }
  }
  ```

- 命名空间的合并

  **命名空间中导出(export)的函数和变量不能重复声明**:

  ```ts
  // a.ts
  namespace Shape {
    // Error: 无法重新声明块范围变量“pi”。
    export const pi = Math.PI;
    export function cricle(r: number) {
      return pi * r ** 2;
    }
    // Error: 函数实现重复。
    export function square(x: number) {
      return x * x;
    }
  }

  // b.ts
  /// <reference path="a.ts" />
  namespace Shape {
    // Error: 无法重新声明块范围变量“pi”。
    export const pi = Math.PI;
    // Error: 函数实现重复。
    export function square(x: number) {
      return x * x;
    }
  }

  console.log(Shape.cricle(2));
  console.log(Shape.square(2));

  import cricle = Shape.cricle;
  console.log(cricle(2));
  ```

  **命名空间和函数的合并，命名空间需要放置在函数后面**:

  ```ts
  function Lib() {}

  namespace Lib {
    export let version = '1.0';
  }

  // f Lib () {}, 1.0
  // 命名空间可以扩展
  console.log(Lib, Lib.version);
  ```

  **命名空间和类的合并，命名空间需要放置在类后面**:

  ```ts
  class C {}

  namespace C {
    export let state = 1;
  }

  // 1
  console.log(C.state);
  ```

  **命名空间和枚举的合并**:

  ```ts
  enum Color {
    Red,
    Yellow,
    Bule,
  }

  namespace Color {
    export function mix() {
      console.log('mix');
    }
  }

  // mix
  console.log(Color.mix());
  ```

### 编写声明文件

当我们在 ts 项目中去引用一个非 ts 编写的外部类库的时候需要为其编写相对应的声明文件。

例如我们引用了`jquery`:

![引用jquery](https://img-blog.csdnimg.cn/3eddd621118e439fbcbd7e48bdfb3f1e.png)

这个时候我们需要先确定该类库的类型，社区是否提供了解决方案(@types/packageName)，可以去[npm 官网](<https://www.npmjs.com/search>?)进行搜索。

通过搜索发现社区已经提供了相应的解决方案

![jquery搜索](https://img-blog.csdnimg.cn/3b55a33950e4420f91a54e983c511de5.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

因此，我们只需要安装对应的包即可解决依赖声明问题。

```js
yarn add @types/jquery
```

如果社区没有提供现有的解决方案的时候，就需要我们自己去沟通社区或者自己编写声明文件。

- 全局声明函数的修改

  ```js
  // global-lib.js
  function globalLib(options) {
    console.log(options);
  }

  globalLib.version = '1.0.0';

  globalLib.doSomething = function () {
    console.log('globalLib do something');
  };
  ```

  ![globalLib](https://img-blog.csdnimg.cn/0eae5d5fb2c745029e23028f278b8085.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_13,color_FFFFFF,t_70,g_se,x_16)

  例如解决上述一个 js 文件声明问题，我们需要在同层级的地方创建一个 `global-lib.d.ts` 的声明文件。

  ```ts
  declare function globalLib(options: globalLib.Options): void;

  declare namespace globalLib {
    const version: string;
    function doSomething(): void;
    // 接口可以放在命名空间下 也可以全局暴露出去
    interface Options {
      [key: string]: any;
    }
  }
  ```

- 解决模块文件声明

  ```js
  const version = '1.0.0';

  function doSomething() {
    console.log('moduleLib do something');
  }

  function moduleLib(options) {
    console.log(options);
  }

  moduleLib.version = version;
  moduleLib.doSomething = doSomething;

  module.exports = moduleLib;
  ```

  然后我们去引用这个模块。

  ```js
  import moduleLib from './module-lib';
  ```

  ![module-lib](https://img-blog.csdnimg.cn/db2c3c9546cb4a7b814c4b682baab8f4.png)

  ```ts
  declare function moduleLib(options: Options): void;

  interface Options {
    [key: string]: any;
  }

  declare namespace moduleLib {
    const version: string;

    function doSomething(): void;
  }

  export = moduleLib;
  ```

- 解决 umd 库文件声明

  ```js
  // umd-lib.js
  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
    } else {
      root.umdLib = factory();
    }
  })(this, function () {
    return {
      version: '1.0.0',
      doSomething() {
        console.log('umdLib do something');
      },
    };
  });
  ```

  ![umd](https://img-blog.csdnimg.cn/4e8ad54dc73845ffa53b87d3af192dfe.png)

  ```ts
  declare namespace umdLib {
    const version: string;

    function doSomething(): void;
  }

  // 专为umd库设计的语句 不可缺少
  export as namespace umdLib;

  export = umdLib;
  ```

  `umd`编写的类库可以通过全局的方式，需要去 `tsconfig.json` 中开启 `allowUmdGlobalAccess`选项。

- 为插件类库添加自定义方法

  例如给 `moment` 插件添加一个 `myFunction` 的方法。

  ```ts
  import m from 'moment';

  m.myFunction = () => {};
  ```

  ![myFunction](https://img-blog.csdnimg.cn/34d286c10ee34c47b37dd827a8ba6928.png)

  我们需要声明这个模块

  ```ts
  import m from 'moment';

  + declare module 'moment' {
  +   export function myFunction(): void;
  + }

  m.myFunction = () => {}
  ```

- 为全局插件添加自定义方法

  ```js
  // globalLib.js
  function globalLib(options) {
    console.log(options);
  }

  globalLib.version = '1.0.0';

  globalLib.doSomething = function () {
    console.log('globalLib do something');
  };

  // 其他引用文件
  globalLib.doAnyting = () => {};
  ```

  ![globalLib.doAnyting](https://img-blog.csdnimg.cn/320a2ee905924f9a9df92158ebb69385.png)

  这个时候我们可以通过全局声明的方式来解决。

  ```ts
  // 全局插件
  + declare global {
  +    namespace globalLib {
  +        function doAnyting(): void
  +    }
  + }

  globalLib.doAnyting = () => {} // OK
  ```

## tsconfig.json 详解

```json
{
  "files": [
      "src/index.ts", // files设置需要编译的文件，如果不填默认为所有*.ts、*.d.ts、*.tsx文件。
  ],
  "include": [
      "src", // 编译src下所有的*.ts、*.d.ts、*.tsx文件。如改成src/* 仅会编译src下的一级目录文件
  ], // 设置编译器需要编译的文件或者目录
  "exclude": [
      "src/lib"
  ],// 设置编译需要剔除的文件，默认已经剔除了node_modules下的文件
  "extends": [
      // 使用extends可以将基础的ts配置抽离成tsconfig.base.json的基础配置文件
  ],
  "compileOnSave": false, // 在保存文件的时候是否自动编译(需要根据编辑器提供，例如vscode并不支持)
  "compilerOptions": {
      "incremental": true,                // 增量编译，二次编译的时候增加编译速度(提速约50%)
      "tsBuildInfoFile": "./buildFile",   // 增量编译文件的存储位置(自定义增量信息的编译名称)
      "diagnostics": true,                // 打印诊断信息(可以看到编译的信息)
      "target": "es5",           // 目标语言的版本
      "module": "commonjs",      // 生成代码的模块标准
      "outFile": "./app.js",     // 将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中

      "lib": [],                 // TS 需要引用的库，即声明文件，es5 默认 "dom", "es5", "scripthost"
                                 // 例如我们想使用Array.flat方法需要添加 "lib": ["es2019.array"]

      "allowJs": true,           // 允许编译 JS 文件（js、jsx）
      "checkJs": true,           // 允许在 JS 文件中报错，通常与 allowJS 一起使用

      "outDir": "./out",         // 指定输出目录
      "rootDir": "./",           // 指定输入文件目录（用于输出）例如 ./ 的输出会包含src目录  ./src 会把src文件内的输出，少了一层目录

      "declaration": true,         // 生成声明文件(开启的时候会在编译的时候自动生成每个文件对应的.d.ts声明文件)
      "declarationDir": "./d",     // 声明文件的路径(声明文件会被放置在d目录下)
      "emitDeclarationOnly": true, // 只生成声明文件(不会生成编译后的js文件)
      "sourceMap": true,           // 把 ts 文件编辑成js文件的时候，同时生成对应的 map 文件
      "inlineSourceMap": true,     // 生成目标文件的 inline sourceMap(包含在生成的文件之中)
      "declarationMap": true,      // 生成声明文件的 sourceMap
      "typeRoots": [],             // 声明文件目录(编译器查找声明文件的位置)，默认 node_modules/@types
      "types": [],                 // 指定需要加载的声明文件包

      "removeComments": true,    // 删除注释

      "noEmit": true,            // 不输出文件(啥也不输出)
      "noEmitOnError": true,     // 发生错误时不输出文件
      "noEmitHelpers": true,     // 不生成 helper 函数，需额外安装 ts-helpers
      "importHelpers": true,     // 通过 tslib 引入 helper 函数，文件必须是模块

      "downlevelIteration": true,    // 降级遍历器的实现（es3/5）降级的时候一般是通过helper函数来实现

      "strict": true,                        // 开启所有严格的类型检查(开启后默认下面的选项也会开启)
      "alwaysStrict": false,                 // 在代码中注入 "use strict";
      "noImplicitAny": false,                // 不允许隐式的 any 类型
      "strictNullChecks": false,             // 不允许把 null、undefined 赋值给其他类型变量
      "strictFunctionTypes": false           // 不允许函数参数双向协变
      "strictPropertyInitialization": false, // 类的实例属性必须初始化
      "strictBindCallApply": false,          // 严格的 bind/call/apply 检查(关闭后不会检查这几个方法的参数类型)
      "noImplicitThis": false,               // 不允许 this 有隐式的 any 类型

      "noUnusedLocals": true,                // 检查只声明，未使用的局部变量(只会提示错误)
      "noUnusedParameters": true,            // 检查未使用的函数参数
      "noFallthroughCasesInSwitch": true,    // 防止 switch 语句贯穿
      "noImplicitReturns": true,             // 每个分支都要有返回值

      "esModuleInterop": true,               // 允许 export = 导出，由import from 导入
      "allowUmdGlobalAccess": true,          // 允许在模块中访问 UMD 全局变量
      "moduleResolution": "node",            // 模块解析策略(classic)
      "baseUrl": "./",                       // 解析非相对模块的基地址
      "paths": {                             // 路径映射，相对于 baseUrl
         "jquery": ["node_modules/jquery/dist/jquery.slim.min.js"]
      },
      "rootDirs": ["src", "out"],            // 将多个目录放在一个虚拟目录下，用于运行时

      "listEmittedFiles": true,        // 打印输出的文件
      "listFiles": true,               // 打印编译的文件（包括引用的声明文件）
  }
}
```

### moduleResolution 解析策略

- classic 解析策略

  ![classic解析策略](https://img-blog.csdnimg.cn/bce4814e968d445d9f224dbbb656f7b0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

- node 解析策略

  ![node解析策略](https://img-blog.csdnimg.cn/6f7eb5f01c884a32a1aebf5b28503516.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

## 工程引用

- 2021.12.02

这是 ts3.0 之后的一个新特性，比如当我们一个项目里面有客户端又有服务端的代码，还有一些公共的方法及公共的测试代码。依赖单个配置文件不能满足我们的需求(把客户端和服务端代码分开构建，公共测试代码编译到 dist 目录下)，这个时候就可以使用工程引用。

```
--src
----client
------src
--------businessA
--------businessB
----server
------src
--------businessA
--------businessB
----test
package.json
tsconfig.json
```

**使用工程引用:**

```
--src
----client
------src
--------businessA
--------businessB
------tsconfig.json
----server
------src
--------businessA
--------businessB
------tsconfig.json
----test
package.json
tsconfig.json
```

- 其中外层的 `tsconfig.json` 配置文件示例:

  ```json
  {
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "strict": true,
      "composite": true, // 作为基类可引用，可以增量编译
      "declaration": true
    }
  }
  ```

- client 下的 `tsconfig.json` 配置文件示例:

  ```json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "outDir": "../../dist/client"
    },
    "references": [
      // 依赖工程
      {
        "path": "../common"
      }
    ]
  }
  ```

- 构建命令

  ```npm
  tsc -b src/server --verbose // -b 是build  --verbose是输出日志
  ```

## ts-loader

`ts-loader`内部走的是`tsc`命令，可以访问到`tsconfig.json`。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false, // 只进行语言转化不进行类型校验 ，开启的时候不会进行错误检查
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/tpl/index.html',
    }),
  ],
};
```

上述配置我们使用了 `options: { transpileOnly: false }`，开启该配置后将不会进行错误检查，但提高了编译速度，即代码中有错误也会被正常编译。

如果我们想开启该配置，又想去校验类型检查，可以使用 `webpack` 插件----> `fork-ts-checker-webpack-plugin`。

```ts
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // 只进行语言转化不进行类型校验 ，开启的时候不会进行错误检查
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/tpl/index.html',
    }),
    new TsCheckerWebpackPlugin(),
  ],
};
```

## awesome-typescript-loader

除了使用`ts-loader`之外，官方还提供了一个`awesome-typescript-loader`.

与 `ts-loader` 的主要区别：

1. 更适合与 `Babel` 继承，使用 `Babel` 的转义和缓存。

2. 不需要安装额外的插件，就可以把类型检查放到独立的进程中进行。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              transpileOnly: true, // 只进行语言转化不进行类型校验 ，开启的时候不会进行错误检查
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/tpl/index.html',
    }),
    new CheckerPlugin(),
  ],
};
```

但是在使用 `CheckerPlugin()`的时候，编译检查错误有遗漏(比如， `let a:string = 1;`可以正常编译通过)，推荐还是使用额外插件的形式。

## Babel7 与 typescript

`Babel`可以编译`ts`文件，但是无法做类型检查。

**注意事项:**

1. Babel 无法编译 ts 命名空间

   ```ts
   namespace N {
     export const n = 1;
   }
   ```

2. 类型断言

   ```ts
   class A {
     a: number = 1;
   }

   let s = {} as A;
   s.a = 2;
   ```

3. 常量枚举

   ```ts
   const enum E {
     A,
   }
   ```

4. 默认导出

   ```ts
   export = s;
   ```
