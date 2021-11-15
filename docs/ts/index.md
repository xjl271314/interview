---
title: TypeScript
nav:
  title: typescript
  path: /typescript
group:
  title: typescript相关试题
  path: /typescript/project
---

# TypeScript 应用

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
