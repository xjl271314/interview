---
title: MVC、MVP、MVVM
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 设计框架 MVC、MVP、MVVM

- 2022.11.01

## MVC

MVC，全称 Model（模型）-View（视图）-Controller（控制器），这是一种开发模式，他的好处是可以将界面和业务逻辑分离。

![MVC](https://img-blog.csdnimg.cn/5620e2b8a98f49f8a62e43b537713d6c.webp)

- `Model（模型）`，是程序的主体部分，主要包含业务数据和业务逻辑。在模型层，还会涉及到用户发布的服务，在服务中会根据不同的业务需求，更新业务模型中的数据。

- `View(视图）`，是程序呈现给用户的部分，是用户和程序交互的接口，用户会根据具体的业务需求，在 View 视图层输入自己特定的业务数据，并通过界面的事件交互，将对应的输入参数提交给后台控制器进行处理。

- `Controller（控制器）`，Controller 是用来处理用户输入数据，以及更新业务模型的部分。控制器中接收了用户与界面交互时传递过来的数据，并根据数据业务逻辑来执行服务的调用和更新业务模型的数据和状态。

MVC 模式的关键是实现了`视图`和`模型`的分离。这是如何实现的呢？

**MVC 模式通过建立一个`发布/订阅”（publish-subscribe）`的机制来分离`视图`和`模型`。**

`发布－订阅（publish-subscribe）机制`的目标是发布者，它发出通知时并不需知道谁是它的观察者。可以有任意数目的观察者订阅并接收通知。

MVC 模式最重要的是用到了`Observer（观察者模式）`，正是观察者模式实现了发布－订阅（publish-subscribe）机制，实现了视图和模型的分离。

### MVC 三者之间的联系

- View 传送指令到 Controller
- Controller 完成业务逻辑后，要求 Model 改变状态
- Model 将新的数据发送到 View，用户得到反馈
- 所有通信都是单向的。View 和 Model 之间的通信是通过 Controller 来作为桥梁的，也就是说 View 和 Model 并不是直接通信；
- 需要服务器端配合，JavaScript 可以在前端修改服务器渲染后的数据，所有通信都是单向的，提交一次反馈一次，通信一次相互制约。

### MVC 的优点

- 耦合性低；
- 重用性高；
- 部署快；
- 可维护性高；
- 有利于软件工程化管理。

### MVC 的缺点

- 不适合小型中等规模的应用程序；
- 增加了系统结果和实现的复杂性；
- View 和 Model 之间不匹配，用户界面和流程要考虑易用性，用户体验优化同时考虑业务流程的精确和无错。
- Controler 和 Model 之间界线不清，什么样的逻辑是界面逻辑，什么样的逻辑是业务逻辑，很难定义清楚。没有明确的定义；
- View 的变化不能完全由 Model 控制，即 Observer 模式不足以支持复杂的用户交互。这其实要求 VC 之间要有依赖。牵一发而动全身，数据，显示不分离，Controller，Model 联系过于紧密。

## MVP

MVP 是单词`Model View Presenter`的首字母的缩写，分别表示`数据层`、`视图层`、`发布层`，它是 MVC 架构的一种演变。

作为一种新的模式，**MVP 与 MVC 有着一个重大的区别：在 MVP 中 View 并不直接使用 Model，它们之间的通信是通过 Presenter (MVC 中的 Controller)来进行的，所有的交互都发生在 Presenter 内部，而在 MVC 中 View 会直接从 Model 中读取数据而不是通过 Controller。**

![MVP](https://img-blog.csdnimg.cn/7cecaf50095942ab83e3a7c07176a775.png)

### MVP 的特点

- MVP 分离了 view 和 model 层，Presenter 层充当了桥梁的角色，View 层只负责更新界面即可，这里的 View 我们要明白只是一个 viewinterface，它是视图的接口，这样我们在做单元测试的时候可以非常方便编写 Presenter 层代码。
- View 非常薄，不部署任何业务逻辑，称为”被动视图”（Passive View），即没有任何主动性，而 Presenter 非常厚，所有逻辑都部署在那里。
- Presenter 与具体的 View 是没有直接关联的，而是通过定义好的接口进行交互，从而使得在变更 View 时候可以保持 Presenter 的不变，这样就可以重用。不仅如此，还可以编写测试用的 View，模拟用户的各种操作，从而实现对 Presenter 的测试–从而不需要使用自动化的测试工具。

### MVP 的优点

- 模型与视图完全分离，我们可以修改视图而不影响模型；
- 可以更高效地使用模型，因为所有的交互都发生在一个地方——Presenter 内部；
- 我们可以将一个 Presenter 用于多个视图，而不需要改变 Presenter 的逻辑。这个特性非常的有用，因为视图的变化总是比模型的变化频繁；
- 如果我们把逻辑放在 Presenter 中，那么我们就可以脱离用户接口来测试这些逻辑（单元测试）。

### MVP 的缺点

- 视图和 Presenter 的交互会过于频繁，使得他们的联系过于紧密。也就是说，一旦视图变更了，presenter 也要变更。

## MVVM

MVVM（Model–View–Viewmodel）有助于将图形用户界面的开发与业务逻辑的开发分离开，这是通过标记语言或 GUI 代码实现的。

MVVM 的视图模型是一个值转换器， 这意味着视图模型负责从模型中暴露（转换）数据对象，以便轻松管理和呈现对象。在这方面，视图模型比视图做得更多，并且处理大部分视图的显示逻辑。 视图模型可以实现中介者模式，组织对视图所支持的用例集的后端逻辑的访问。

- M(odel)层：模型，定义数据结构。
- C(ontroller)层：实现业务逻辑，数据的增删改查。在 MVVM 模式中一般把 C 层算在 M 层中，（只有在理想的双向绑定模式下，Controller 才会完全的消失。）
- ViewModel 层：顾名思义是视图 View 的模型、映射和显示逻辑（如 if for 等，非业务逻辑），另外绑定器也在此层。ViewModel 是基于视图开发的一套模型，如果你的应用是给盲人用的，那么也可以开发一套基于 Audio 的模型 AudioModel。
- V(iew)层：将 ViewModel 通过特定的 GUI 展示出来，并在 GUI 控件上绑定视图交互事件，V(iew)一般由 MVVM 框架自动生成在浏览器中。

在 MVVM 架构下，`View` 和 `Model` 之间其实并没有直接的联系，而是通过`ViewModel`进行交互，`Model` 和 `ViewModel` 之间的交互是双向的， 因此`View` 数据的变化会同步到`Model`中，而`Model` 数据的变化也会立即反应到`View` 上。

`ViewModel` 通过双向数据绑定把 View 层和 Model 层连接了起来，ViewModel 里面包含 DOM Listeners 和 Data Bindings，DOM Listeners 和 Data Bindings 是实现双向绑定的关键。DOM Listeners 监听页面所有 View 层 DOM 元素的变化，当发生变化，Model 层的数据随之变化；Data Bindings 监听 Model 层的数据，当数据发生变化，View 层的 DOM 元素随之变化。

![MVVM](https://img-blog.csdnimg.cn/f90606935dca4d8ba3e2381d0ceff9cd.png)

### MVVM 模式的优点

- 低耦合。View 可以独立于 Model 变化和修改，一个 ViewModel 可以绑定到不同的 View 上，当 View 变化的时候 Model 可以不变，当 Model 变化的时候 View 也可以不变。
- 可重用性。可以把一些视图的逻辑放在 ViewModel 里面，让很多 View 重用这段视图逻辑。
- 独立开发。开发人员可以专注与业务逻辑和数据的开发(ViewModel)。设计人员可以专注于界面(View)的设计。
- 可测试性。可以针对 ViewModel 来对界面(View)进行测试。

### MVVM 的缺点

- 学习成本高。
- DEBUG 困难

## 实现简单版的 Vue 框架的 MVVM

实现流程

1. 定义`observe`函数，利用`Proxy`把 data 中的属性变成响应式的，同时给每一个属性添加一个 dep 对象（用来存储对应的 watcher 观察者）
2. 定义`compile` 函数，模板编译，遍历 DOM，遇到 `mustache`（双大括号{{}})形式的文本，则替换成 data.key 对应的值，同时将该 dom 节点添加到对应 key 值的 dep 对象中
3. 当 data 的数据变化时，调用 dep 对象的 update 方法，更新所有观察者中的 dom 节点

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>vue的MVVM简单实现</title>
  </head>
  <body>
    <div id="app">
      <p>姓名: <span>{{name}}</span></p>
      <p>年龄: <span>{{age}}</span></p>
    </div>
    <script>
      window.onload = function () {
        // new一个vue实例
        let vue = new Vue(
           {
             el: '#app',
             data: {
                 name: '加载中', age: '18'
               }
             }
          )
        // 2s后更新页面的信息
        setTimeout(() => {
          // 修改vue中$data的name和age属性
          vue.$data.name = '小明';
          vue.$data.age = 20;
        }, 2000)
      }
      class Vue {
        constructor(options) {
          this.options = options
          this.$data = options.data
          this.observe(options.data)
          this.compile(document.querySelector(options.el))
        }

        isObject(target) {
            if (typeof target === 'object' && target !== null) {
                return this.observe(target);
            } else {
                return target;
            }
        }

        // 监听data中属性的变化
        observe(data) {
          Object.keys(data).forEach(key => {
            // 给data中的每一个属性添加一个dep对象（该对象用来存储对应的watcher观察者）
            let observer = new Dep()
            // 利用闭包 获取和设置属性的时候，操作的都是value
            let value = data[key]
            Object.defineProperty(data, key, {
              get() {
                // 观察者对象添加对应的dom节点
                Dep.target && observer.add(Dep.target)
                return value
              },
              set(newValue) {
                value = newValue
                // 属性值变化时，更新观察者中所有节点
                observer.update(newValue)
              }
            })
          })
            // return new Proxy(target, {
            //     get(target, key, receiver) {
            //         let result = Reflect.get(target, key);
            //         // 递归获取对象多层嵌套的情况，如pro.info.type（递归监听，保证每一层返回都是proxy对象）
            //         return this.isObject(result);
            //     },
            //     set(target, key, value, receiver) {
            //         if (key !== 'length') {
            //             // 解决对数组修改，重复更新视图的问题
            //             console.log('更新视图');
            //         }
            //         return Reflect.set(target, key, value, receiver);
            //     }
            // });
        },
        compile(dom) {
          dom.childNodes.forEach(child => {
            // nodeType 为3时为文本节点，并且该节点的内容包含`mustache`（双大括号{{}})
            if(child.nodeType === 3 && /\{\{(.*)\}\}/.test(child.textContent)) {
              // RegExp.$1是正则表达式匹配的第一个字符串，这里对应的就是data中的key值
              let key = RegExp.$1.trim()
              // 将该节点添加到对应的观察者对象中，在下面的的this.options.data[key]中触发对应的get方法
              Dep.target = child
              // 将{{key}} 替换成data中对应的值
              child.textContent = child.textContent.replace(`{{${key}}}`, this.options.data[key])
              Dep.target = null
            }
            // 递归遍历子节点
            if(child.childNodes.length) {
              this.compile(child)
            }
          })
        }
      }

      // dep对象存储所有的观察者
      class Dep {
        constructor() {
          this.watcherList = []
        }
        // 添加watcher
        add(node) {
          this.watcherList.push(node)
        }
        // 更新watcher
        update(value) {
          this.watcherList.forEach(node => {
            node.textContent= value
          })
        }
      }
    </script>
  </body>
</html>
```
