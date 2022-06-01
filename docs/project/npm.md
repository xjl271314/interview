---
title: npm install原理
nav:
  title: 工程化
  path: /project
  order: 0
group:
  title: 前端工程化相关试题
  path: /project/project
---

# npm install

- 2021.11.01

`npm install` 的流程大致如下:

![npm install](https://img-blog.csdnimg.cn/22f52d7be2c948eab5c36079be153303.png?x-oss-process=image,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

## 前言

当我们去执行 `npm install`的时候，对应的包都会被安装到 `node_modules` 目录下。在早期的 `npm`版本中，安装的时候出来方式比较简单粗暴，以递归的形式，严格按照 `package.json` 结构以及子依赖包的 `package.json` 结构将依赖安装到他们各自的 `node_modules` 中。直到有子依赖包不在依赖其他模块。

### <npm 3.x

这种方式安装比较清晰，但也存在以下一些问题:

- 比如出现多个包重复安装的问题:

  ```category
  ├── helloWorld
  │   └── node_modules
  │       ├── packageA
  │       ├── plugin1
  │       │   └── nodule_modules
  │       │       └── packageA
  │       ├── plugin2
  │       │   └── nodule_modules
  │       │       └── packageA
  ```

- 依赖层级较深时，嵌套层级严重，在 `Windows` 系统中，文件路径最大长度为 260 个字符，嵌套层级过深可能导致不可预知的问题。

  ```category
  ├── helloWorld
  │   └── node_modules
  │       ├── packageA
  │       ├── plugin1
  │       │   └── nodule_modules
  │       │       └── package1
  │       │         └── nodule_modules
  │       │           |── package2
  │       │             └── nodule_modules
  │       │               |── package3
  ```

### npm 3.x

**为了解决上述的问题，在 `npm 3.x`版本之后做了较大的更新，将早期的`嵌套结构`改为`扁平结构`：**

1. 安装模块时，不管其是直接依赖还是子依赖的依赖，优先将其安装在`node_modules`根目录。

2. 当安装到相同模块时，判断已安装的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的`node_modules`下安装该模块。

**对应的，如果我们在项目代码中引用了一个模块，模块查找流程如下：**

1. 在当前模块路径下搜索

2. 在当前模块 `node_modules` 路径下搜素

3. 在上级模块的 `node_modules` 路径下搜索

4. 直到搜索到全局路径中的 `node_modules`

### npm 5.x

但是这种模式也为完全解决问题，假设我们不同子包中依赖了某个包的不同版本，在安装解析的时候又是按照`package.json`的依赖顺序依次解析的，`package.json` 通常只会锁定大版本，这意味着在某些依赖包小版本更新后，同样可能造成依赖结构的改动，依赖结构的不确定性可能会给程序带来不可预知的问题。

为了彻底解决遗留下来的问题，在 `npm 5.x`版本新增了 `package-lock.json`文件，安装方式上还是采用扁平化的方式。

`package-lock.json` 的作用是`锁定依赖结构`，即只要你目录下有 `package-lock.json` 文件，那么你每次执行 `npm install` 后生成的 `node_modules` 目录结构一定是完全相同的。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n这里需要注意的是并不是所有的子依赖都有 `dependencies` 属性，只有子依赖的依赖和当前已安装在根目录的  `node_modules` 中的依赖冲突之后，才会有这个属性。';

export default () => <Info type="warning" txt={txt} />;
```

例如:

![在这里插入图片描述](https://img-blog.csdnimg.cn/bad6906b53e1498298e1e3dbe3d645a3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

### 缓存

在执行 `npm install` 或 `npm update`命令下载依赖后，除了将依赖包安装在`node_modules` 目录下外，还会在本地的缓存目录缓存一份。

通过 `npm config get cache` 命令可以查询到：在 `Linux` 或 `Mac` 默认是用户主目录下的 `.npm/_cacache` 目录。

![在这里插入图片描述](https://img-blog.csdnimg.cn/285a52d341e24ce3a07935b9fc00555f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

在这个目录下又存在两个目录：`_cacache`、`content-v2`、`index-v5`等目录，`content-v2` 目录用于存储 `tar`包的缓存，而`index-v5`目录用于存储`tar`包的 `hash`。

npm 在执行安装时，可以根据 `package-lock.json` 中存储的 `integrity`、`version`、`name` 生成一个唯一的 `key` 对应到 `index-v5` 目录下的缓存记录，从而找到 `tar` 包的 `hash`，然后根据 `hash` 再去找缓存的 `tar` 包直接使用。

我们可以找一个包在缓存目录下搜索测试一下，在 `index-v5` 搜索一下包路径：

```bash
grep "http://npm.wpt.la/@ant-design%2fcolors/-/colors-6.0.0.tgz" -r index-v5
```

npm 提供了几个命令来管理缓存数据：

- `npm cache add`：官方解释说这个命令主要是 `npm` 内部使用，但是也可以用来手动给一个指定的 `package` 添加缓存。
  - `npm cache add <tarball-url>`
  - `npm cache add <pkg>@<ver>`
  - `npm cache add <tarball>`
  - `npm cache add <folder>`
- `npm cache clean`：删除缓存目录下的所有数据，为了保证缓存数据的完整性，需要加上 `--force` 参数。
- `npm cache verify`：验证缓存数据的有效性和完整性，清理垃圾数据。

基于缓存数据，npm 提供了离线安装模式，分别有以下几种：

- `--prefer-offline`：优先使用缓存数据，如果没有匹配的缓存数据，则从远程仓库下载。
- `--prefer-online`：优先使用网络数据，如果网络数据请求失败，再去请求缓存数据，这种模式可以及时获取最新的模块。
- `--offline`：不请求网络，直接使用缓存数据，一旦缓存数据不存在，则安装失败。

```jsx
/**
 * inline: true
 */
import React from 'react';
import { Info } from 'interview';

const txt =
  '\n这里需要注意的是, 这里的缓存策略是在 `npm v5` 开始的，那么在 v5之前呢，每个缓存模块是在我们之前提到的 `~./npmrc` 文件中以模块名的格式直接存储的。';

export default () => <Info type="warning" txt={txt} />;
```

### 文件完整性

在下载依赖包之前，我们一般就能拿到 `npm` 对该依赖包计算的 `hash` 值，例如我们执行 `npm info` 命令，紧跟 `tarball(下载链接)` 的就是 `shasum(hash)` 。

用户下载依赖包到本地后，需要确定在下载过程中没有出现错误，所以在下载完成之后需要在本地在计算一次文件的 `hash` 值，如果两个 `hash` 值是相同的，则确保下载的依赖是完整的，如果不同，则进行重新下载。

## npm 执行流程

### 1. 检查 config

`npm` 执行会先读取 `npm config` 和 `npmrc` .

`npmrc` 的优先级是: `项目级 .npmrc文件 > 用户级 .npmrc文件 > 全局 .npmrc文件 > npm 内置 .npmrc文件`

### 2. 检查 lock 文件

- 无 lock 文件：
  - 从 npm 远程仓库获取包信息
  - 根据 `package.json` 构建依赖树，构建过程：
    - 构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 `node_modules` 根目录。
    - 当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 `node_modules` 下放置该模块。
    - 注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包
  - 在缓存中依次查找依赖树中的每个包：
    - 不存在缓存：
      - 从 npm 远程仓库下载包
      - 校验包的完整性
      - 校验不通过：
        - 重新下载
      - 校验通过：
        - 将下载的包复制到 `npm` 缓存目录
        - 将下载的包按照依赖结构解压到 `node_modules`
    - 存在缓存：将缓存按照依赖结构解压到 `node_modules`
  - 将包解压到 `node_modules`
  - 生成对应的 `lock` 文件
- 存在 lock 文件：
  - 检查 `package.json` 中的依赖版本是否和 `package-lock.json` 中的依赖有冲突。
    - 如果没有冲突，直接跳过获取包信息、构建依赖树过程，开始在缓存中查找包信息，后续过程与上面相同。

在我们实际的项目开发中，使用 npm 作为团队的最佳实践: **同一个项目团队,应该保持 npm 版本的一致性**。

## yarn

`yarn` 是在 2016 年发布的，那时 `npm` 还处于 `V3` 时期，那时候还没有 `package-lock.json` 文件，就像上面我们提到的：不稳定性、安装速度慢等缺点经常会受到广大开发者吐槽。此时，`yarn` 诞生。

### 解决的问题

- 确定性：通过`yarn.lock`等机制,即使是不同的安装顺序,相同的依赖关系在任何的环境和容器中,都可以以相同的方式安装。

- 采用模块扁平化的安装模式：采用的是 `npm v3` 的扁平结构来管理依赖。

- 网络性能更好: `yarn`采用了请求排队的理念，类似于并发池连接，能够更好的利用网络资源;同时也引入了一种安装失败的重试机制。

- 采用缓存机制,实现了离线模式。

### yarn.lock 文件

我们看看 `yarn.lock` 的结构：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d4b97e61038445b2918bde457648c169.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_20,color_FFFFFF,t_70,g_se,x_16)

`yarn.lock` 和 `package-lock.json` 文件还是比较类似的，还有一些区别就是：

1. `package-lock.json` 使用的是 `json` 格式，`yarn.lock` 使用的是一种自定义格式。

2. `yarn.lock` 中子依赖的版本号不是固定的，意味着单独又一个 `yarn.lock` 确定不了 `node_modules` 目录结构，还需要和 `package.json` 文件进行配合。而 `package-lock.json` 只需要一个文件即可确定。

### yarn 安装机制

简单来说, Yarn 的安装大致分为 5 个步骤:

`检测(checking) ---> 解析包(Resolving Packages) ---> 获取包(Fetching) ---> 链接包(Linking Packages) ---> 构建包(Building Packages)`

#### 1. 检测包

这一步，最主要的目的就是检测我们的项目中是否存在`npm`相关的文件,比如`package-lock.json`等;如果有，就会有相关的提示用户注意：这些文件可能会存在冲突。在这一步骤中 也会检测系统 OS, CPU 等信息。

#### 2. 解析包

这一步会解析依赖树中的每一个包的信息:

首先获取到首层依赖: 也就是我们当前所处的项目中的`package.json`定义的`dependencies`、`devDependencies`、`optionalDependencies`的内容。

紧接着会采用`遍历首层依赖`的方式来获取包的依赖信息，以及递归查找每个依赖下嵌套依赖的版本信息，并将解析过的包和正在进行解析包呢用`Set`数据结构进行存储，这样就可以保证同一版本范围内的包不会进行重复的解析。

#### 3. 获取包

这一步首先我们会检查缓存中是否有当前依赖的包，同时将缓存中不存在的包下载到缓存的目录中。

**如何去判断缓存中有当前的依赖包呢？**

在`yarn`中会根据 `cacheFolder + slug + node_modules + pkg.name` 生成一个路径;判断系统中是否存在该 path,如果存在证明已经有缓存,不用重新下载。这个 path 也就是依赖包缓存的具体路径。

对于没有命中的缓存包，在 `yarn` 中存在一个 `Fetch队列`，按照具体的规则进行网络请求。

- 如果下载的包是一个`file`协议，或者是相对路径，就说明指向一个本地目录，此时会调用`Fetch From Local`从离线缓存中获取包;

- 否则调用 `Fetch From External` 获取包，最终获取的结果使用 `fs.createWriteStream` 写入到缓存目录。

#### 4. 链接包

我们上一步已经把依赖放到了缓存目录，那么下一步，我们应该要做什么事情呢？是不是应该把项目中的依赖复制到`node_modules`目录下呢？

没错，只不过此时需要遵循一个`扁平化`的原则。复制依赖之前, `yarn`会先解析 `peerDepdencies`，如果找不到符合要求的`peerDepdencies`的包,会有 `warning`提示，并最终拷贝依赖到项目中。

如果依赖包中存在二进制包需要进行编译，那么会在这一步进行。

#### 5. 构建包

最后构建完成。

### yarn 缓存策略

`yarn` 的缓策略看起来和 `npm v5` 之前的很像，每个缓存的模块被存放在独立的文件夹，文件夹名称包含了模块名称、版本号等信息。使用命令 `yarn cache dir` 可以查看缓存数据的目录：

`yarn` 默认使用 `prefer-online` 模式，即优先使用网络数据，如果网络数据请求失败，再去请求缓存数据。

## 团队实践

1. 不要轻易删除锁文件`lockfiles`，这会导致原本的依赖出现版本更新，可能会导致项目崩了。直接 `npm install` 即可，不好使可以手动重新安装或更新报错的具体依赖，当然有些包需要特定的`node`版本，也需要对应改`node`版本。

2. 所有依赖装`dependencies` 和 `devDependencies` 得看项目，如果是前端 `spa` 应用 或者一次性的 `ssg` 项目可以这样做，但是如果是开后端或者`ssr`以及开库给别人用就需要特别注意到底是通用环境下的依赖`dependencies`还是仅生产环境下的依赖`devDependencies`。

3. `yarn` 和 `npm` 混用在部分特别依赖包管理器的项目中是有问题的，例如`antfu`的`vitesse`需要通过包的锁文件去判断具体用到那个包管理器，然后用这个包管理器去自动安装具体的图标集依赖。当然除此之外还有两个包管理器的网络机制以及缓存机制和下载后的依赖分布也不同，如果特别依赖这些的项目也需要注意一下。推荐统一一个包管理器。

4. 需要上传`lockfiles`文件到仓库中，因为这个文件主要用来`锁默认`的依赖版本，最好让别人的依赖和自己的依赖保持统一，这样的错误率最小。
