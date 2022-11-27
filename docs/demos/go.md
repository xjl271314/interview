---
title: 网易模拟面试题go部分
nav:
  title: 模拟试题
  path: /demos
  order: 0
group:
  title: 技术部分
  path: /demos/technology
---

# 网易模拟面试题 go 部分

- 2022.11.9

## go 快速入门

### 安装

[下载地址](https://golang.google.cn/dl/)

### 测试是否安装成功

```bash
go version // go version go1.19.3 darwin/amd64

which go // /usr/local/go/bin/go
```

### go 文件夹下有什么？

- src 用于存放代码
- bin 编译生成的可执行程序
- pkg 编译时生成的对象文件

在 `gomod` 模式下可以不将代码放在 src 目录下。

### 最简单的 go 示例

```go
package main // 表示此文件属于main这个包

import "fmt" // 和js类似，多个包就多次import

func main(){ // 一个文件必须有main函数否则会报错
  fmt.Println("hello world") // 语句声明不需要分号结尾除非有多个语句或者声明出现在同一行
}
// go run hello.go
```

### 安装 VsCode Go 扩展失败如何处理？

先修改`GOPROXY`再安装扩展包，否则由于网络问题会无法安装。

```bash
// 修改go proxy 打开控制台执行后重新安装
go env -w GOPROXY=https://goproxy.cn,direct
```

### run 命令 和 build 命令

- `go build` 之后会生成对应的可执行文件
- `go run` 会运行某段代码，相当于运行了以下的三个步骤
  1. 先执行`go build`，生成可执行文件
  2. 执行可执行文件
  3. 删除该可执行文件

### 常用命令列表

|    命令     | 描述                                                     |
| :---------: | :------------------------------------------------------- |
|  `build `   | 编译包和依赖                                             |
|  `clean `   | 删除编译的可执行文件                                     |
|   `doc `    | 显示包或者符号的文档                                     |
|   `env `    | 打印 Go 相关的一些环境变量信息                           |
|   `bug `    | 启动错误日志报告                                         |
|   `fix `    | 运行 go tool fix                                         |
|   `fmt `    | 自动代码格式化                                           |
| `generate ` | 从 processing source 生成 go 文件                        |
|   `get `    | 下载并安装包和依赖，例如 go get github.com/astaxie/beego |
| `install `  | 编译并安装包依赖，安装在项目目录下，可在其他地方直接执行 |
|   `list `   | 列出所有的包                                             |
|   `run `    | 编译并运行 go 程序                                       |
|   `test `   | 运行测试                                                 |
|   `tool `   | 运行 go 提供的工具                                       |
| `version `  | 显示 go 的版本                                           |
|   `vet `    | 运行 go tool vet                                         |

### 交叉编译

- Windows 下编译 Mac 平台 64 位可执行程序

  ```bash
  SET CGO_ENABLED=0 // 禁用CGO，使用了CGO的代码是不支持跨平台编译的
  SET GOOS=darwin   // 目标平台是mac
  SET GOARCH=amd64  // 目标处理器架构是amd64
  ```

- Windows 下编译 linux 平台 64 位可执行程序

  ```bash
  SET CGO_ENABLED=0
  SET GOOS=linux
  SET GOARCH=amd64
  ```

- Mac 下编译 Windows 和 Linux 平台 64 位可执行程序

  ```bash
  CGO_ENABLED=0 GOOS=linux GOARCH=amd64
  CGO_ENABLED=0 GOOS=windows GOARCH=amd64
  ```

### 变量的定义和赋值

- `=`是赋值变量。
- `:=`是定义变量。

```go
package main

import "fmt"

func main() {
  var name string
  var age int

  fmt.Println(name) // ''
  fmt.Println(age)  // 0

  age = 1
  gender:='男'

  fmt.Println(age) 		// 1
  fmt.Println(gender)   // 30007

  // 声明多个变量
  var n1, n2 int
  var (
	  n3 int
	  n4 int
  )
  // 可以声明不同类型的变量
  var (
	  n5, n6 int
	  s1 string
  )

  // 单行代码的赋值
  n5, n6, s1 = 10, 20, "aa"

  // 在函数内部声明的变量必须要使用，否则会报错
  fmt.Println(n1, n2, n3, n4, n5, n6, s1)
}
```

### 变量的初始化

```go
package main

import "fmt"

func main() {
	// 先定义再赋值
	var n1 int
	n1 = 10

	fmt.Println(n1)

	// 边定义边赋值
	var n2 int = 20
	fmt.Println(n2)

	// 使用类型推导
	var n3 = 30
	fmt.Println(n3)

	// 简短式命名
	n4 := 40
	fmt.Println(n4)

	// 批量初始化同类型的变量
	var n5, n6 int = 50, 60
	fmt.Println(n5, n6)

	// 批量初始化不同类型的变量
	var (
		n7 = 70 	// n7 int = 70
		s1 = 'a'	// s1 string = 'a'
	)
	fmt.Println(n7, s1)

	// 批量简短式声明
	// 简短式只能在函数内部使用
	n8, n9 := 80, 90
	n10, s2 := 100, 'b'
	fmt.Println(n8, n9, n10, s2)
}
```

### 常量的声明和赋值

```go
package main

import "fmt"

func main() {
	// 常量不能使用简短式声明
	const n1, n2 = 10, 20
	fmt.Println(n1, n2)

	// 当声明的简写的时候表示常量和上方的是一致的
	const (
		n3 = 30
		n4
		n5
	)
	fmt.Println(n3, n4, n5)

	// iota常量计数器
	// 在常量中出现的时候，iota将会被置为0
	// const中每新增一行，常量iota将会加1
	const (
		n6 = iota
		n7 = 70
		n8 = 80
		n9 = iota
	)

	fmt.Println(n6, n7, n8, n9) // 0 70 80 3
}package main

import "fmt"

func main() {
	// 常量不能使用简短式声明
	const n1, n2 = 10, 20
	fmt.Println(n1, n2)

	// 当声明的简写的时候表示常量和上方的是一致的
	const (
		n3 = 30
		n4
		n5
	)
	fmt.Println(n3, n4, n5)

	// iota常量计数器
	// 在常量中出现的时候，iota将会被置为0
	// const中每新增一行，常量iota将会加1
	const (
		n6 = iota
		n7 = 70
		n8 = 80
		n9 = iota
	)

	fmt.Println(n6, n7, n8, n9) // 0 70 80 3
}
```

### 关键字

- break
- default
- func
- interface
- select
- case
- defer
- go
- map
- struct
- chan
- else
- goto
- package
- switch
- const
- fallthrough
- if
- range
- type
- continue
- for
- import
- return
- var

### 基本数据类型

- 数字、字符串、布尔

#### 数字类型

- 整型
- 浮点类型
- 复数

不同类型之间不能够进行运算。

#### 整型

- 长度区分：int、int8、int16、int32、int64
- 无符号整型：unit、unit8、unit16、unit32、unit64
- 操作系统不一样的时候 unit 和 int 表示的长度不一样

```go
package main

import (
	"fmt"
	"math"
)

func main(){
	var n1 int8 = 10
	var n2 int16 = 10
	var n3 int32 = 10
	var n4 int64 = 10

	fmt.Println(n1, n2, n3, n4)
	// 输出其类型
	// int8 int16 int32 int64
	fmt.Printf("%T %T %T %T\n", n1, n2, n3, n4)

	// 不同类型之间运算需要转化 20
	fmt.Println(n1 + int8(n2))

	// int型在不同类型的机器上表现不一样
	// 64位  int ——> int64
	// 32为  int ——> int32

	// 浮点数类型主要说是 float32 和 float64 两类
	// 默认情况下说是float64
	// 打印浮点数的时候需要配合使用%f
	f1 := 0.32
	fmt.Printf("%T\n", f1) 	// float64
	fmt.Printf("%f\n", f1)	// 0.320000

	// 使用math包下的常量
	fmt.Println(math.MaxFloat32)
	fmt.Println(math.MaxFloat64)

	// 复数主要有complex64 和 complex128两种
	var c1 complex64 = 3 + 5i
	var c2 complex128 = 5 + 3i
	fmt.Printf("c1:%v, type:%T\n", c1, c1) 	// 3 + 5i, complex64
	fmt.Printf("c2:%v, type:%T\n", c2, c2) 	// 5 + 3i, complex128

	// 布尔值只能好似常量true或者是false
	// 0值为false
	// 不能参与数字运算，也不能与其他类型相互转换
	fmt.Println(1 == 1)	// true
	fmt.Println(1 == 2)	// false

	// 定义字符串的时候单个字符可以用单引号，否则都用双引号
	// 但是单引号下输出的ASCII码
	s0 := 'a'
	s1 := "a"
	s2 := "aa"
	fmt.Println(s0, s1, s2)

	// 字符串要换行可以使用\n或者是用js的模板字符串反引号 ``
	s3 := "aa\nbb"
	fmt.Println(s3)
	s4 := `cc
	dd`
	fmt.Println(s4)

	// 在模板字符串里面的转义字符是无效的会被当作字符串来处理
	s5 := `ee\nff`
	fmt.Println(s5) // ee\nff
}
```

### 数据类型转换

```go
package main

import (
	"fmt"
)

func main(){
	// go中和python3是类似的没有js中的隐式转换，都是需要显式的去转换
	// 强制转换只能在两个类型之间支持的时候可以转换，比如int8转int16，但是string和int就转不了
	n1 := 10
	// s1 := "a"
	// r1 := int(s1) + n1
	// fmt.Println(r1) // cannot convert s1 (variable of type string) to type int
	var n2 int16 = 20
	fmt.Println(int(n2) + n1) // 30

	// 浮点数转整型的时候小数点后面的会被丢弃
	c1 := 33.33
	fmt.Println(int(c1) + n1) // 43
}
```

### 格式化输出和输入

```go
package main

import (
	"fmt"
)

func main(){
	// 格式化输出主要涉及Print、Println、Printf三个函数
	// print：直接输出内容
	// println：输出内容结尾加换行
	// printf：自定义输出 第一个参数是字符串，第二个参数是表达式
	// 其中%v代表值的默认格式，%T代表值的类型，%%代表百分号,%b代表2进制，
	// %d代表10进制，%o代表8进制，%x代表16进制，%c代表对应的unicode码。
	c1 := 3.14
	fmt.Printf("%v %T %%\n",c1, c1, c1)	// 3.14 float64 !(EXTRA float64=3.14)

	// 浮点数还可以使用 .df的形式来控制小数精度 使用df来控制宽度
	c2 := 3.1415926
	fmt.Printf("%.2f\n", c2) // 3.14
	fmt.Printf("%6f\n", c2) // 3.141593

	// 格式化输入的主要涉及Scan、Scanln、Scanf
	// Scan：扫描用户输入的数据，将以空白符分隔的数据分别存入指定的参数，换行符默认好似空白符
	// 返回成功扫描的数据个数和遇到的错误，遇到错误的时候就不会在接受输入
	var n1 int
	var s1 string

	// fmt.Scan(&n1, &s1) // 使用取地址符
	// fmt.Println(n1, s1)

	// 输入正确的时候 err的返回值是<nil>
	// n, err := fmt.Scan(&n1, &s1)
	// Scanln：类似Scan比较常用遇到换行符的时候就停止了
	// 如果要正确的输出可以中间使用空格
	// 假设输入了10 和 "aa"由于输了10之后回车所以结果为：
	// n1: 10  s1: ""
	fmt.Scanln(&n1, &s1)
	fmt.Printf("n1: %v, s1: %s\n", n1, s1)

	// Scanf：根据formt的格式去读取，必须按照约定的格式
	// 这时候输入也必须是n1: 10这种格式
	fmt.Scanf("n1: %v")
	fmt.Printf("n1: %v\n", n1)
}
```

### 运算符

```go
package main

import (
	"fmt"
)

func main(){
	// 主要包含了算术运算符、关系运算符、逻辑运算符、赋值运算符、位运算符等

	// 算术运算符
	// +、-、*、/、%和js的一毛一样
	n1, n2 := 10, 20
	// 20、-10、200、0、10
	fmt.Printf("n1+n2, n1-n2, n1*n2, n1/n2, n1%n2", n1+n2, n1-n2, n1*n2, n1/n2, n1%n2)

	// 关系运算符
	// ==、!=、<、>、<=、>=
	// 区别在于不同的类型不能进行比较，其他都和js一致
	// false、true、true、false、true、false
	fmt.Printf("n1==n2, n1!=n2, n1<n2, n1>n2, n1<=n2, n1>=n2", n1==n2, n1!=n2, n1<n2, n1>n2, n1<=n2, n1>=n2)

	// 逻辑运算符
	// &&、||、! 和js的是一毛一样


	// 赋值运算符
	// =、+=、-=、*=、/=、%= 也和js的是一毛一样

	// 位运算符
	// &(与运算，都为真才为真)、｜(或运算，一个为真则为真)、^（异或）、《（左移）、》（右移）
	// 都和js是一毛一样的

	// 取地址运算符&，这个是go特有的一个运算符
	// 其中要获取对应的值的时候需要使用*p
	a := 1
	p := &a // 取址&
	fmt.Println(a==*p) // true
	fmt.Printf("p: %v", *p) // 1
}
```

### 字符串的常用操作

```go
package main

import (
	"fmt"
	"unicode/utf8"
	"strings"
)

func main(){
	s1 := "我是一个字符串"
	// 获取字符串的长度
	// len(str) 统计的是字节的个数 名称和python3的一致，但是python3中统计出来是字符的长度7
	// 原因是因为go是采用utf-8编码
	fmt.Println(len(s1)) // 21
	// 获取正确的长度
	fmt.Println(utf8.RuneCountInString(s1)) // 7

	// 拼接字符串
	a := "a"
	b := "b"
	// 用+运算符
	c := a + b
	fmt.Println("c:", c) // abs

	// 字符串大小写转换
	s2 := "hello"
	// 使用strings.ToUpper(str)
	fmt.Println("s2:Upper", strings.ToUpper(s2)) // HELLO
	// 使用strings.Title(str)首字母大写
	fmt.Println("s2:Title", strings.Title(s2)) // Hello
	s3 := "HELLO"
	// 使用strings.ToLower(str)转小写
	fmt.Println("s3:Lower", strings.ToLower(s3)) // hello

	// 判断字符串是否以固定的格式开头
	// 类似js的startsWith 和 endsWith
	fmt.Println("s3:startsWith-H", strings.HasPrefix(s3, "H")) // true
	fmt.Println("s3:endsWith-O", strings.HasSuffix(s3, "O")) // true

	// 判断字符串是否包含某个字串
	// 使用strings.contains实现类似indexOf和in以及includes的效果
	fmt.Println("s3:contains-LLO", strings.Contains(s3, "LLO")) // true

	// 判断字串出现的位置
	// 使用Index判断实现at、indexOf的效果
	fmt.Println("s3:Index-LLO", strings.Index(s3, "LLO")) // 2
	// 使用LastIndex可以返回最后一次出现的位置
	fmt.Println("s3:LastIndex-L", strings.LastIndex(s3, "L")) // 3

	// 去除字符串首尾的指定字符
	s4 := "aad bb dcc"
	fmt.Println("s4:trim", strings.Trim(s4, "ac")) // d bb d
	// 去除左侧的用strings.TrimLeft
	// 去除右侧的用strings.TrimRight
}
```

### 程序休眠以及日期 time

```go
package main

import (
	"fmt"
	"time"
)

func main(){
	n1 := 10
	fmt.Println("休息2s后会输出n1")
	// 方法名称与python3一致 就是多了个单位
	time.Sleep(2 * time.Second)
	fmt.Println("n1: value", n1)
	// 休息1分钟
	// time.Sleep(time.Minute)
	// time.Sleep(60 * time.Second)

	// 获取当前的时间戳
	fmt.Println("now:", time.Now())
	// 获取当前的时间戳
	fmt.Println("nowTime:", time.Now().Unix())
	// 获取当前的年月日
	fmt.Println("year:", time.Now().Year())
	fmt.Println("month:", time.Now().Month())
	fmt.Println("month:int", int(time.Now().Month()))
	fmt.Println("date:", time.Now().Day())
}
```

### 流程控制 if、switch、for、goto

```go
package main

import "fmt"

func main() {
	// 分支控制 if-else、switch(case)
	// if和else和js说是相同的 不同于python3的elif
	// 测试下来if 带括号的条件也是可以的 可以按照js的习惯来写
	// 需要注意的是else需要和if后的花括号在同一行 否则会报错
	n1 := 10
	if n1 > 5 {
		fmt.Printf("n1: %v > 5\n", n1)
	} else{
		fmt.Printf("n1: %v <= 5\n", n1)
	}
	// 高级写法 先赋值再比较
	if age := 20;age > 18 {
        fmt.Println("已成年")
	}
	// swicth-case的用法也是一样的
	// 多了一个fallthrough可以进行穿透
	switch {
		case n1 > 5:
			fmt.Printf("n1: %v > 5\n", n1)
		default:
			fmt.Printf("n1: %v <= 5\n", n1)
	}

	// 循环 for
	// for 变量初始; 条件; 自增/自减 {
	// 	// 循环体代码
	// }

	// 这里的i是块级作用域，仅在函数内部有效
	for i := 0; i < 5;i++{
		fmt.Println("i:", i)
	}

	// 简写第一部分的变量初始化赋值
	// 简写后for循环的第一个分号是不可以省略的
	 j := 3;
	 for ; j > 0; j-- {
		fmt.Println("j:", j)
	 }

	// 简写第三部分
	k := 2;
	// 等同于 for ; k >0; k--
	for k > 0 {
		fmt.Println("k:", k)
		k--
	}

	// break 和 continue的使用方式和js一致
	m := 5;
	for ; m > 0; m-- {
		if m < 3 {
			break
		}
		fmt.Println("m:", m)	// 5 4 3
	}

	n := 5;
	for ; n > 0; n-- {
		if n > 3 {
			continue
		}
		fmt.Println("n:", n)	// 3 2 1
	}

	// 计算1到10内所有奇数的和
	sum := 0
	for i:= 1; i<10;i++{
		if i & 1 == 1 {
			sum += i
		}
		continue
	}

	fmt.Println("计算1到10内所有奇数的和:", sum)

	// 无条件跳转 goto
	// goto label  直接跳转到label处
	// label statement 此处定义了一个名为label的标签及该标签下希望执行的代码
	s1 := "aa"
	fmt.Println("s1:", s1)
	s2 := "bb"
	fmt.Println("s2:", s2)
	goto add
	// 此时这段代码不会执行
	// goto add jumps over declaration of s3 at ./flow.go:91:5
	// s3 := "cc"
	// fmt.Println("s3:", s3)
	add:
		r := s1 + s2
		fmt.Println("s1+s2:", r)
	// 注意事项：
	// goto语句与标签之间不能声明变量否则会出错
	// goto容易造成死循环
}
```

### 伪随机数和真随机数

```go
package main

// import 别名 真实包名 可以重命名
import (
	"fmt"
	"math/rand"
	"time"
	"math/big"
	"strconv"
	crypto "crypto/rand"
)

func main() {
	// 伪随机数和真随机数
	// 伪随机数使用的包是math/rand
	// 真随机数使用的是crypto/rand

	// 伪随机数：生成的数字是确定的，不论在什么机器、什么时间只要执行的代码是一样的
	// 那么生成的随机数就是一样的
	// go中使用seed作为随机种子，只要seed固定，每次随机数产生的顺序就是固定的
	// 可以改变随机种子，从而获取不同的随机顺序得到不同的随机数
	// 推荐使用时间戳作为随机种子，time.Now
	rand.Seed(2) // 随机种子，默认为1
	for i:=0; i < 5; i++ {
		fmt.Println("5个0~100的伪随机数：", rand.Intn(100))
	}
	// 5个0~100的伪随机数： 86
	// 5个0~100的伪随机数： 86
	// 5个0~100的伪随机数： 92
	// 5个0~100的伪随机数： 40
	// 5个0~100的伪随机数： 4
	// 使用时间戳做种子
	rand.Seed(time.Now().Unix()) // 随机种子，默认为1
	for i:=0; i < 5; i++ {
		fmt.Println("时间戳下5个0~100的伪随机数：", rand.Intn(100))
	}
	// 时间戳下5个0~100的伪随机数： 23
	// 时间戳下5个0~100的伪随机数： 57
	// 时间戳下5个0~100的伪随机数： 78
	// 时间戳下5个0~100的伪随机数： 25
	// 时间戳下5个0~100的伪随机数： 22

	// 真随机数：每次生成的都是真随机数，只不过生成的时候对机器的性能消耗高一点
	for i:=0; i<5;i++{
		n, _ := crypto.Int(crypto.Reader, big.NewInt(100))
		fmt.Println("0到100真随机数：", n.Int64())
	}
	// 练习：生成4位随机验证码
	var captcha string = ""
	rand.Seed(time.Now().Unix())
	for i:= 0; i < 4;i++ {
		// strconv.Itoa接收一个int将其转化为string
		captcha += strconv.Itoa(rand.Intn(10))
	}
	fmt.Println("您的验证码是：", captcha)

}
```
