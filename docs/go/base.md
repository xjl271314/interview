---
title: Golang基础
nav:
  title: Golang基础
  path: /golang
  order: 0
group:
  title: Golang相关
  path: /golang/base
---

2024.09.24

# package 分包

在 Go 语言中，每个 .go 文件的顶部都需要声明一个 package 语句。这个语句指定了该文件属于哪个包（package）。Go 语言中的包类似于其他编程语言中的库或模块，它是一组相关 Go 源代码文件的集合，这些文件被编译在一起。

当你看到 package main 这样的声明时，这意味着当前的 Go 文件是属于 main 包的一部分。main 包在 Go 语言中有特殊的意义，因为它是可执行程序的入口点。如果你想要编写一个可以独立运行的 Go 程序，那么必须有一个名为 main 的包，并且在这个包中需要有一个 main 函数，它是程序启动时首先被执行的函数。

例如，一个最简单的 Go 程序可能如下所示：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

- 第一行 `package main` 声明了这个文件属于 `main` 包。
- `import "fmt"` 导入了 `fmt` 包，这样就可以使用其中的打印功能。
- `func main()` 定义了主函数，当程序运行时，这里的内容会被执行。

# 包的导入

Go 语言中的包是以目录结构组织的，每个目录都包含一个 `go.mod` 文件。`go.mod` 文件用于描述包的依赖关系，它包含了包的名字、版本号和其他信息。

当我们导入一个包时，Go 编译器会自动下载该包的源代码并将其编译成二进制文件。然后，它将二进制文件和 `go.mod` 文件一起存储在本地磁盘上。

```go
// 导入单个包
import "fmt"

// 导入多个包
import (
    "fmt"
    "os"
)

// 带别名的导入
import str "strings"

// 导入包的所有内容
// 点导入（dot import）允许你在不使用包名前缀的情况下直接访问 strings 包中的函数和变量。这种方式虽然可以使代码看起来更简洁，但通常不推荐使用，因为它可能会导致命名冲突。
import . "strings"

HasPrefix("abc", "a") // true
```

# 包导入的 init 执行顺序

在 Go 语言中，`init` 函数是一种特殊的函数，它用于执行包的初始化操作。每个包可以包含任意数量的 `init` 函数，并且这些函数会在程序运行时自动调用。如果你在一个包中定义了 `init` 函数，那么当该包被导入时，其 `init` 函数会被执行。

当你有多个包，并且这些包和主程序都定义了 `init` 函数时，Go 语言对 `init` 函数的执行顺序有明确的规定：

导入顺序：首先，init 函数按照它们所在的包被导入的顺序来执行。也就是说，如果包 A 导入了包 B，则包 B 的 init 函数会在包 A 的 init 函数之前执行。

包内顺序：在同一个包内，init 函数按照它们在源文件中的出现顺序来执行。如果一个包中有多个 .go 文件，每个文件中都可以有 init 函数，那么这些 init 函数会按照文件名的字典顺序依次执行。

主程序的 init 函数：最后，在所有导入的包的 init 函数执行完毕之后，才会执行主程序（即 package main）中的 init 函数。然后才是主程序的 main 函数。

举个例子，假设你有以下结构：

package main
main.go (包含 init 和 main 函数)
package a
a.go (包含 init 函数)
package b
b.go (包含 init 函数)
并且 main.go 中导入了 a 包，而 a 包又导入了 b 包。那么 init 函数的执行顺序将是：

b 包中的 init 函数（因为 a 包导入了 b 包）
a 包中的 init 函数
main 包中的 init 函数
main 包中的 main 函数
这个顺序确保了在使用某个包的功能之前，该包已经被正确地初始化。这也是为什么你可以依赖 init 函数来设置一些全局变量或执行一些必要的初始化工作。
