---
title: Vite介绍和原理解析
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Vite

- 2022.03.09

## 前言

该部分摘自[Vite 官方文档](https://cn.vitejs.dev/guide/why.html#the-problems)

### 为什么选 Vite？

- #### 现实问题

  在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：**使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件**。

  时过境迁，我们见证了诸如 `webpack`、`Rollup` 和 `Parcel` 等工具的变迁，它们极大地改善了前端开发者的开发体验。

  然而，当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。包含数千个模块的大型项目相当普遍。

  我们开始遇到性能瓶颈 —— 使用 JavaScript 开发的工具通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用 HMR，文件修改后的效果也需要几秒钟才能在浏览器中反映出来。如此循环往复，迟钝的反馈会极大地影响开发者的开发效率和幸福感。

  **Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写。**

- #### 缓慢的服务器启动

  当冷启动开发服务器时，基于打包器的方式启动必须优先抓取并构建你的整个应用，然后才能提供服务。

  Vite 通过在一开始将应用中的模块区分为 `依赖` 和 `源码` 两类，改进了开发服务器启动时间。

  - `依赖` 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会存在多种模块化格式（例如 ESM 或者 CommonJS）。

    Vite 将会使用 [esbuild](https://esbuild.github.io/) [预构建依赖](https://cn.vitejs.dev/guide/dep-pre-bundling.html)。Esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

  - `源码` 通常包含一些并非直接是 `JavaScript` 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。

    Vite 以 [原生 ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：`Vite` 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

- #### 缓慢的更新

  基于打包器启动时，重建整个包的效率很低。原因显而易见：因为这样更新速度会随着应用体积增长而直线下降。

  一些打包器的开发服务器将构建内容存入内存，这样它们只需要在文件更改时使模块图的一部分失活，但它也仍需要整个重新构建并重载页面。这样代价很高，并且重新加载页面会消除应用的当前状态，所以打包器支持了`动态模块热重载（HMR）`：允许一个模块 **热替换** 它自己，而不会影响页面其余部分。这大大改进了开发体验 —— 然而，在实践中我们发现，即使采用了 HMR 模式，其热更新速度也会随着应用规模的增长而显著下降。

  在 Vite 中，`HMR` 是在原生 `ESM` 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新。

  Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：`源码模块`的请求会根据 `304 Not Modified` 进行`协商缓存`，而`依赖模块`请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行`强缓存`，因此一旦被缓存它们将不需要再次请求。

## 简介

`Vite`号称是 **下一代的前端开发和构建工具** ，目前已经在前端社区里逐步开始流行起来了。它采用了全新的`unbundle`思想来提升整体的前端开发体验。比起传统的`webpack`构建，在性能速度上都有了质的提高。

`Vite`名字来源于法语, 意思为`rapid`，`quickly`。正好反映了其核心卖点—— **快速** 。在整体功能上实现了类似于预配置的`webpack`加`dev server`的功能， 用于提高前端项目的整体构建速度。

根据测试，服务器启动速度和 HMR 基本上都可以达到毫秒级别。

## 使用方法

vite 的使用方式十分简单，目前官方提供了脚手架来快速启动一个新项目:

```bash
npm init @vitejs/app

// yarn
yarn create @vitejs/app
```

接着就会进入交互式模式，让你选择对应的模板，输入项目名等操作。

![在这里插入图片描述](https://img-blog.csdnimg.cn/0a26666036c849ed963a351b84e2d6e6.png?x-oss-process=image,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeGpsMjcxMzE0,size_18,color_FFFFFF,t_70,g_se,x_16)

如果需要手动指定模板和项目名，可以使用如下命令:

```bash
npm init @vitejs/app my-vite-demo --template react
```

这里指定的所有相关项目模板都可以在 [vitejs 仓库](https://github.com/vitejs/awesome-vite#templates)中找到。 项目启动后，就可以直接使用如下命令进行启动和预览了。

```bash
# 安装依赖
yarn install

# 开发环境下使用
yarn dev

# 打包
yarn run build
# 用来预览打包后的效果
yarn run serve
```

## 插件机制

vite 主要使用插件进行扩展功能，可以看到上述最简单的初始化项目启动后，在其配置文件`vite.config.ts` 文件下，有如下代码：

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

这里的模板中引用了 `react`插件，需要实现其他额外功能的时候，都可以借助其插件机制进行扩展。这些第三方模块也可以在[vitejs 仓库](https://github.com/vitejs/awesome-vite#templates)中找到。 同时，由于`vite`插件扩展了`rollup`的接口，所以要实现一个自己的`vite`插件跟写`rollup`插件是类似的。此处，可以参考 [插件 API | Vite 官方中文文档](https://cn.vitejs.dev/guide/api-plugin.html) 。

## 实现流程

1. 通过`koa`开启一个服务，获取请求的静态文件内容
2. 通过`es-module-lexer` 解析 `ast` 拿到`import`的内容
3. 判断 `import` 导入模块是否为`三方模块`，是的话，返回`node_module`下的模块， 如 `import vue` 返回 `import './@modules/vue'`
4. 如果是`.vue`文件，`vite` 拦截对应的请求，读取`.vue`文件内容进行编译，通过 `compileTemplate` 编译模板，将 `template` 转化为 `render函数`
5. 通过 `babel parse`对 `js` 进行编译，最终返回编译后的`js`文件

## 工作原理

Vite 是如何实现超快速的开发体验的呢？

我们都知道，传统打包构建工具，在服务器启动之前，需要从入口文件完整解析构建整个应用。因此，有大量的时间都花在了依赖生成，构建编译上。

![Bundle based dev server](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9301bff8140046ddaa3221a42d8ee2bf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

而 vite 主要遵循的是使用`ESM(Es modules模块)`的规范来执行代码，由于现代浏览器基本上都支持了 ESM 规范，所以**在开发阶段并不需要将代码打包编译成 es5 模块即可在浏览器上运行**。

我们只需要从入口文件出发， 在遇到对应的 `import` 语句时，将对应的模块加载到浏览器中就可以了。因此，这种不需要打包的特性，也是`vite`的速度能够如此快速的原因。

![Native ESM based dev server](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdd41182ac21413dae16800f1e24cdda~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

同时`ts/jsx`等文件的转译工作也会借助了`esbuild`来提升速度。 `Vite`在内部实现上，会启动一个`dev server`， 并接受独立模块的 HTTP 请求，并让浏览器自身去解析和处理模块加载。

以官方提供的 demo 为例，可以看到运行后，在访问对应页面的时候，不是加载一整个的`bundle.js`文件，而是按模块去加载。

![vue示例](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4164f6569154e5d9bda666b900f9d46~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

从代码实现上，在允许 `yarn dev` 命令后，Vite 就会启动一个`dev server`，然后加载各种中间件，进而监听对应的前端访问请求。[github](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/cli.ts#L80)

```js
const { createServer } = await import('./server')
try {
  const server = await createServer({
    root,
    base: options.base,
    mode: options.mode,
    configFile: options.config,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
    server: cleanOptions(options) as ServerOptions
  })
  await server.listen()
} catch (e) {
  createLogger(options.logLevel).error(
    chalk.red(`error when starting dev server:\n${e.stack}`)
  )
  process.exit(1)
}
```

同时，会在开发环境中注入`Vite`自身的`client`[客户端代码](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/indexHtml.ts#L141)，用于监听`HMR`等处理。

### 裸模块重写

由于目前`ESM`不支持类似 `import React from react` 这样的裸模块加载（[import maps 提案](https://github.com/WICG/import-maps)可解决这个问题，但还未实现，所以需要对模块加载地址进行重写操作。

将其转换成类似于 `import React from "/ @modules/react"` 这种形式。

提案大致是这样描述的:

```js
import moment from "moment";
import { partition } from "lodash";

// 推荐浏览器支持
<script type="importmap">
{
  "imports": {
    "moment": "/node_modules/moment/src/moment.js",
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
</script>
```

实现原理上主要通过 `es-module-lexer` 和 `magic-string` 两个包进行替换，比起 AST 语义解析和转换，在性能上更有优势。

### Es-module-lexer

虽然 js 代码的`词法分析`通常都使用`babel`, `acorn`等工具，但是针对`ESM`文件来说，使用[es-module-lexer](https://github.com/guybedford/es-module-lexer)库在性能上能够有很大的提升，其压缩后的体积只有 4kb，而且根据官方给出的例子 720kb 的 Angular1 库经过`acorn`解析要超过 100ms，而使用`es-module-lexer`库只需要 5ms, 在性能上提升了将近**20**倍。

- #### Magic-string

  vite 中使用了大量这个库做一些字符串的替换工作，从而避免操作 AST，[完整代码参考](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importAnalysis.ts#L155)。

  整体思路大致如下:

  ```js
  import { init, parse as parseImports, ImportSpecifier } from 'es-module-lexer'

  // 借助es-module-lexer来分析import语句
  imports = parseImports(source)[0]

  // 接着在依赖分析及路径重写过程中利用magic-string来替换源码。
  let s: MagicString | undefined
  const str = () => s || (s = new MagicString(source))

  // 省略部分代码
  for (let index = 0; index < imports.length; index++) {
    const {
        s: start,
        e: end,
        ss: expStart,
        se: expEnd,
        d: dynamicIndex,
        n: specifier
    } = imports[index]

    ...

    // 解析代码
    const { imports, importsString, exp, endIndex, base, pattern } =
        await transformImportGlob(
            source,
            start,
            importer,
            index,
            root,
            normalizeUrl
    );
    str().prepend(importsString)
    str().overwrite(expStart, endIndex, exp)
    imports.forEach((url) => importedUrls.add(url.replace(base, '/')))
    if (!(importerModule.file! in server._globImporters)) {
        server._globImporters[importerModule.file!] = {
            module: importerModule,
            importGlobs: []
            }
        }
        server._globImporters[importerModule.file!].importGlobs.push({
            base,
            pattern
        })
    }

    // 最终返回处理过的代码
    if (s) {
        return s.toString()
    } else {
        return source
    }
  ```

- #### 自定义区块处理

  这个功能是通过在模块后面链接 ?type= 的参数来区分不同区块。然后针对每个区块单独进行处理。

  ![自定义区块处理](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a55ddb29acf411b842c24477a2e6048~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

  根据不同的区块类型，在`transform`的时候会使用不同的插件进行编译。 下面以`json`文件为例，在处理 `xxx.json` 为结尾的文件的时候，首先`json`插件会匹配模块的`id`名是否是`json`。接着再进行转译工作。

  ```js
  // Custom json filter for vite
  const jsonExtRE = /\.json($|\?)(?!commonjs-proxy)/;

  export function jsonPlugin(
    options: JsonOptions = {},
    isBuild: boolean,
  ): Plugin {
    return {
      name: 'vite:json',

      transform(json, id) {
        if (!jsonExtRE.test(id)) return null;
        if (SPECIAL_QUERY_RE.test(id)) return null;

        try {
          if (options.stringify) {
            if (isBuild) {
              return {
                code: `export default JSON.parse(${JSON.stringify(
                  JSON.stringify(JSON.parse(json)),
                )})`,
                map: { mappings: '' },
              };
            } else {
              return `export default JSON.parse(${JSON.stringify(json)})`;
            }
          }

          const parsed = JSON.parse(json);
          return {
            code: dataToEsm(parsed, {
              preferConst: true,
              namedExports: options.namedExports,
            }),
            map: { mappings: '' },
          };
        } catch (e) {
          const errorMessageList = /[\d]+/.exec(e.message);
          const position =
            errorMessageList && parseInt(errorMessageList[0], 10);
          const msg = position
            ? `, invalid JSON syntax found at line ${position}`
            : `.`;
          this.error(`Failed to parse JSON file` + msg, e.idx);
        }
      },
    };
  }
  ```

### HMR

热更新是前端开发体验中很重要的一环，Vite 中主要依赖以下几个步骤来实现 HMR 的功能：

1. 在重写模块地址的时候，记录`模块依赖链 importMaps` 。 这样在后续更新的时候，可以知道哪些文件需要被热更新。

   ![模块依赖链 importMaps1](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c2759cf7e1a45f186c3be7d95fd2f07~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

2. 代码中可以使用 `import.meta.hot` 接口来标记**HMR Boundary**。

   ![模块依赖链 importMaps2](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbbd2e04a2b2442ea1fd260161b2355f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

3. 接着，当文件更新的时候，会沿着之前记录下 `imoprtMaps` 链式结构找到对应的**HMR Boundary**， 再从此处重新加载对应更新的模块。

   ![模块依赖链 importMaps3](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6da18cf30024c85a81fec400569d99c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

   ![模块依赖链 importMaps4](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80431aef5d454423aa494c2022d8ea65~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

4. 如果没有遇到对应的`boundary`, 则整个应用重新刷新。

   ![模块依赖链 importMaps5](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df73c540bd9c4143ae4e7ec3f64333cf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

   使用方法如下：

   ```js
   import foo from './foo.js';

   foo();

   if (import.meta.hot) {
     import.meta.hot.accept('./foo.js', (newFoo) => {
       newFoo.foo();
     });
   }
   ```

- [客户端逻辑](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importAnalysis.ts#L399)

  ```js
  // record for HMR import chain analysis
  // make sure to normalize away base
  importedUrls.add(url.replace(base, '/'))

  if (hasHMR && !ssr) {
  debugHmr(
      `${
      isSelfAccepting
          ? `[self-accepts]`
          : acceptedUrls.size
          ? `[accepts-deps]`
          : `[detected api usage]`
      } ${prettyImporter}`
  )
  // 在用户业务代码中注入Vite客户端代码
  str().prepend(
      `import { createHotContext as __vite__createHotContext } from "${clientPublicPath}";` +
      `import.meta.hot = __vite__createHotContext(${JSON.stringify(
          importerModule.url
      )});`
  )
  }

  case 'update':
      notifyListeners('vite:beforeUpdate', payload)
      // 发生错误的时候，重新加载整个页面
      if (isFirstUpdate && hasErrorOverlay()) {
          window.location.reload()
          return
      } else {
          clearErrorOverlay()
          isFirstUpdate = false
      }

      payload.updates.forEach((update) => {
          if (update.type === 'js-update') {
          // js更新逻辑， 会进入一个缓存队列，批量更新，从而保证更新顺序
          queueUpdate(fetchUpdate(update))
          } else {
          // css更新逻辑， 检测到更新的时候，直接替换对应模块的链接，重新发起请求
          let { path, timestamp } = update
          path = path.replace(/\?.*/, '')

          const el = (
              [].slice.call(
              document.querySelectorAll(`link`)
              ) as HTMLLinkElement[]
          ).find((e) => e.href.includes(path))
          if (el) {
              const newPath = `${path}${
              path.includes('?') ? '&' : '?'
              }t=${timestamp}`
              el.href = new URL(newPath, el.href).href
          }
          console.log(`[vite] css hot updated: ${path}`)
          }
      })
      break
  break
  ```

- [服务端处理 HMR 模块更新逻辑](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/hmr.ts#L42)

  ```js
  export async function handleHMRUpdate(
      file: string,
      server: ViteDevServer
  ): Promise<any> {
  const { ws, config, moduleGraph } = server
  const shortFile = getShortName(file, config.root)

  const isConfig = file === config.configFile
  const isConfigDependency = config.configFileDependencies.some(
      (name) => file === path.resolve(name)
  )
  const isEnv = config.inlineConfig.envFile !== false && file.endsWith('.env')
  if (isConfig || isConfigDependency || isEnv) {
      // 重启server
      await restartServer(server)
      return
  }

  // (dev only) the client itself cannot be hot updated.
  if (file.startsWith(normalizedClientDir)) {
      ws.send({
      type: 'full-reload',
      path: '*'
      })
      return
  }

  const mods = moduleGraph.getModulesByFile(file)

  // check if any plugin wants to perform custom HMR handling
  const timestamp = Date.now()
  const hmrContext: HmrContext = {
      file,
      timestamp,
      modules: mods ? [...mods] : [],
      read: () => readModifiedFile(file),
      server
  }

  for (const plugin of config.plugins) {
      if (plugin.handleHotUpdate) {
      const filteredModules = await plugin.handleHotUpdate(hmrContext)
      if (filteredModules) {
          hmrContext.modules = filteredModules
      }
      }
  }

  if (!hmrContext.modules.length) {
      // html file cannot be hot updated
      if (file.endsWith('.html')) {
      [config.logger.info](http://config.logger.info/)(chalk.green(`page reload `) + chalk.dim(shortFile), {
          clear: true,
          timestamp: true
      })
      ws.send({
          type: 'full-reload',
          path: config.server.middlewareMode
          ? '*'
          : '/' + normalizePath(path.relative(config.root, file))
      })
      } else {
      // loaded but not in the module graph, probably not js
      debugHmr(`[no modules matched] ${chalk.dim(shortFile)}`)
      }
      return
  }

  updateModules(shortFile, hmrContext.modules, timestamp, server)
  }

  function updateModules(
  file: string,
  modules: ModuleNode[],
  timestamp: number,
  { config, ws }: ViteDevServer
  ) {
  const updates: Update[] = []
  const invalidatedModules = new Set<ModuleNode>()
  let needFullReload = false

  for (const mod of modules) {
      invalidate(mod, timestamp, invalidatedModules)
      if (needFullReload) {
      continue
      }

      const boundaries = new Set<{
      boundary: ModuleNode
      acceptedVia: ModuleNode
      }>()

      // 向上传递更新，直到遇到边界
      const hasDeadEnd = propagateUpdate(mod, timestamp, boundaries)
      if (hasDeadEnd) {
      needFullReload = true
      continue
      }

      updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
          type: `${boundary.type}-update` as Update['type'],
          timestamp,
          path: boundary.url,
          acceptedPath: acceptedVia.url
      }))
      )
  }

  if (needFullReload) {
      // 重刷页面
  } else {
  // 相ws客户端发送更新事件， Websocket 监听模块更新, 并且做对应的处理。
      ws.send({
      type: 'update',
      updates
      })
  }
  }
  ```

  ![原理图](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb12aee7b333442dbde7a9315c39e236~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### 优化策略

由于 vite 打包是让浏览器一个个模块去加载的，因此，就很容易存在 http 请求的瀑布流问题（浏览器并发一次最多 6 个请求）。此次，vite 内部为了解决这个问题，主要采取了 3 个方案。

1. `预打包`，确保每个依赖只对应一个请求/文件。比如[lodash](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/optimizer/esbuildDepPlugin.ts#L73) 。

2. `代码分割code split`。可以借助`rollup`内置的 `manualChunks` 来实现。

3. `Etag 304`状态码，让浏览器在重复加载的时候直接使用浏览器缓存。

   ```js
   // check if we can return 304 early
   const ifNoneMatch = req.headers['if-none-match'];
   if (
     ifNoneMatch &&
     (await moduleGraph.getModuleByUrl(url))?.transformResult?.etag ===
       ifNoneMatch
   ) {
     isDebug && debugCache(`[304] ${prettifyUrl(url, root)}`);
     res.statusCode = 304;
     return res.end();
   }
   ```

### esbuild

`Vite` 中很多地方都是用了 `ESbuild`，比如:

- 转译`ts`类型的配置文件
- 请求 `ts`、`jsx`、`tsx` 文件时，将其编译成`js`文件
- 自动搜寻预编译模块列表
- 预编译模块

#### ESbuild 为什么快

1. js 是单线程串行，`ESbuild` 是新开一个进程，然后`多线程并行`，充分发挥多核优势。生成最终文件和生成 `source maps` 全部并行化。

2. Go 可直接编译成机器码，肯定要比 JIT 快

3. 对构建流程进行了优化，充分利用 CPU 资源

#### ESbuild 缺点

1. ESbuild 不能很好的支持 `es6+ 转 es5`；[参考 JavaScript 注意事项](https://esbuild.github.io/content-types/#javascript-caveats)。为了保证 ESbuild 的编译效率，**ESbuild 没有提供 AST 的操作能力**。所以一些通过 AST 处理代码的 `babel-plugin` 没有很好的方法过渡到 `ESbuild` 中。比如`babel-plugin-import`。

2. 构建应用的重要功能仍然还在持续开发中 —— 特别是`代码分割`和 `CSS处理`方面

3. ESbuild 社区 和 webpack 社区 相比差距有点大

#### 怎么判断 ESbuild 能否在当前项目中使用

1. 没有使用一些自定义的 babel-plugin (如 babel-plugin-import)

2. 不需要兼容一些低版本浏览器（ESbuild 只能将代码转成 es6）

比如 `Vite`，开发环境中的预构建、文件编译使用的是 `ESbuild`，而生产环境使用的是 `Rollup`。这是因为 `ESbuild` 一些针对构建应用的重要功能仍然还在持续开发中 —— 特别是`代码分割`和 `CSS处理`方面。就目前来说，`Rollup` 在应用打包方面, 更加成熟和灵活。

#### esbuild 的使用

ESbuild 有`命令行` ，`js 调用`， `go 调用`三种使用方式。

- 命令行

  ```bash
  # 入口文件 esbuild index.js
  # --outfile 输出文件
  # --define:TEST=12 环境变量
  # --format=cjs 编译后的模块规范
  # --bundle 将第三方库打包到一起
  # --platform=[node/browser] 指定编译后的运行环境
  # --target=esnext
  # --loader:.png=dataurl 将 png 转换成base64的形式，需要与 --bundle 一起使用
  ```

- JavaScript 方式

  ESbuild 抛出 3 个 API，分别是:

  1. transform API
  2. build API
  3. service

- ##### transform API

  `transform/transformSync` 对单个字符串进行操作，不需要访问文件系统。非常适合在没有文件系统的环境中使用或作为另一个工具链的一部分，它提供了两个参数：

  ```js
  transformSync(str: string, options?: Config): Result
  transform(str: string, options?: Config): Promise<Result>
  ```

  1. str：字符串（必填），指需要转化的代码
  2. ptions：配置项（可选），指转化需要的选项

  `Config` 具体配置参考[官网](https://esbuild.github.io/api/#transform-api)，这里只说常用配置:

  ```python
  interface Config {
      define: object # 关键词替换
      format: string # js 输出规范（iife/cjs/esm）
      loader: string | object # transform API 只能使用 string
      minify: boolean # 压缩代码，包含删除空格、重命名变量、修改语法使语法更简练

      # 通过以下方式单独配置，上述功能
      minifyWhitespace: boolean # 删除空格
      minifyIdentifiers: boolean # 重命名变量
      minifySyntax: boolean # 修改语法使语法更简练
      sourcemap: boolean | string
      target: string[] # 设置目标环境，默认是 esnext（使用最新 es 特性）
  }
  ```

  返回值：

  - 同步方法（transformSync）返回一个对象
  - 异步方法（transform）返回值为 Promise 对象

    ```ts
    interface Result {
        warnings: string[] # 警告信息
        code: string # 编译后的代码
        map: string # source map
    }
    ```

    示例:

    ```ts
    require('esbuild').transformSync('let x: number = 1', {
      loader: 'ts',
    });
    //   =>
    //   {
    //     code: 'let x = 1;\n',
    //     map: '',
    //     warnings: []
    //   }
    ```

- ##### build API

  `Build API`调用对文件系统中的一个或多个文件进行操作。这使得文件可以相互引用，并被编译在一起（需要设置`bundle: true`）

  ```js
  buildSync(options?: Config): Result
  build(options?: Config): Promise<Result>
  ```

  - options：配置项（可选），指转化需要的选项

    `Config` 具体配置参考[官网](https://esbuild.github.io/api/#build-api)，这里只罗列常用配置:

    ```python
    interface Config {
        bundle: boolean # 将所有源码打包到一起
        entryPoints: string[] | object # 入口文件，通过对象方式可以指定输出后文件名，和 webpack 类似
        outdir: string # 输出文件夹，不能和 outfile 同时使用；多入口文件使用 outdir
        outfile: string # 输出的文件名，，不能和 outdir 同时使用；单入口文件使用 outfile
        outbase: string # 每个入口文件构建到不同目录时使用
        define: object # define = {K: V}  在解析代码的时候用V替换K
        platform: string # 指定输出环境，默认为 browser 还有一个值是 node，
        format: string # js 输出规范（iife/cjs/esm），如果 platform 为 browser，默认为 iife；如果 platform 为 node，默认为 cjs
        splitting: boolean # 代码分割(当前仅限 esm模式)
        loader: string | object # transform API 只能使用 string
        minify: boolean # 压缩代码，包含删除空格、重命名变量、修改语法使语法更简练

        # 通过以下方式单独配置，上述功能
        minifyWhitespace: boolean # 删除空格
        minifyIdentifiers: boolean # 重命名变量
        minifySyntax: boolean # 修改语法使语法更简练
        sourcemap: boolean | string
        target: string[] # 设置目标环境，默认是 esnext（使用最新 es 特性）
        jsxFactory: string # 指定调用每个jsx元素的函数
        jsxFragment: string # 指定聚合一个子元素列表的函数
        assetNames: string # 静态资源输出的文件名称（默认是名字加上hash）
        chunkNames: string # 代码分割后输出的文件名称
        entryNames: string # 入口文件名称
        treeShaking: string # 默认开启，如果设置 'ignore-annotations'，则忽略 /* @__PURE__ */ 和 package.json 的 sideEffects 属性
        tsconfig: string # 指定 tsconfig 文件
        publicPath: string # 指定静态文件的cdn，比如 https://www.example.com/v1 （对设置loader为file 的静态文件生效）
        write: boolean # 默认 false，对于cli和js API，默认是写入文件系统中，设置为 true 后，写入内存缓冲区
        inject: string[] # 将数组中的文件导入到所有输出文件中
        metafile: boolean # 生成依赖图
    }
    ```

    build 返回值是一个 Promise 对象:

    ```python
    interface BuildResult {
        warnings: Message[]
        outputFiles?: OutputFile[] # 只有在 write 为 false 时，才会输出，它是一个 Uint8Array
    }
    ```

    示例:

    ```js
    require('esbuild')
      .build({
        entryPoints: ['index.js'],
        bundle: true,
        metafile: true,
        format: 'esm',
        outdir: 'dist',
        plugins: [],
      })
      .then((res) => {
        console.log(res);
      });
    ```

### esbuild 常用配置

- outbase

  ```js
  outbase: string;
  ```

  多入口文件在不同目录时，那么相对于`outbase`目录，目录结构将被复制到输出目录中。

  ```js
  require('esbuild').buildSync({
    entryPoints: ['src/pages/home/index.ts', 'src/pages/about/index.ts'],
    bundle: true,
    outdir: 'out',
    outbase: 'src',
  });
  ```

  上面代码中，有两个入口文件分别是`src/home/index.ts`、`src/about/index.ts`；并设置`outbase为src`，即相对于 src 目录打包；打包后文件分别在`out/home/index.ts`、`out/about/index.ts`。

- bundle

  仅支持 build API。

  ```js
  bundle: boolean;
  ```

  如果是 true，将依赖项内联到文件本身中。 此过程是递归的，因此依赖项的依赖项也将被合并，默认情况下，ESbuild 不会捆绑输入文件，即为 false。对于动态的模块名不会合并而是和源码保持一致，如下：

  ```js
  // Static imports (will be bundled by esbuild)
  import 'pkg';
  import('pkg');
  require('pkg');

  // Dynamic imports (will not be bundled by esbuild)
  import(`pkg/${foo}`);
  require(`pkg/${foo}`);
  ['pkg'].map(require);
  ```

  如果有多个入口文件，则会创建多个单独的文件，并合并依赖项。

- sourcemap

  ```js
  sourcemap: boolean | string;
  ```

  - `true`：生成`.js.map`并且生成的文件添加`//# sourceMappingURL=`
  - `false`：不使用 `sourcemap`
  - `external`：生成`.js.map`，生成的文件不添加`//# sourceMappingURL=`
  - `inline`：不生成`.js.map`，`source map` 信息内联到文件中
  - `both`：`inline` + `external`模式。生成`.js.map`，但是生成的文件信息不添加`//# sourceMappingURL=`

- define

  关键词替换

  ```js
  let js = 'DEBUG && require("hooks")';
  require('esbuild').transformSync(js, {
    define: { DEBUG: 'true' },
  });
  // {
  //   code: 'require("hooks");\n',
  //   map: '',
  //   warnings: []
  // }

  require('esbuild').transformSync('id, str', {
    define: { id: 'text', str: '"text"' },
  });
  //   {
  //     code: 'text, "text";\n',
  //     map: '',
  //     warnings: []
  //   }
  ```

  双引号包含字符串，说明编译后的代码会被替换成字符串，而没有双引号包含编译后被替换成关键词。

- loader

  ```js
  loader: string | object;
  // 可选值有：'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'json' | 'text' | 'base64' | 'file' | 'dataurl' | 'binary'
  ```

  示例:

  ```js
  // build API 使用文件系统，需要根据后缀名去使用对应loader
  require('esbuild').buildSync({
    loader: {
      '.png': 'dataurl',
      '.svg': 'text',
    },
  });
  // transform API 不实用文件系统，不需要使用后缀名。只能使用一个 loader，因为 transform API 只操作一个字符串
  let ts = 'let x: number = 1';
  require('esbuild').transformSync(ts, {
    loader: 'ts',
  });
  ```

- jsxFactory&jsxFragment

  - jsxFactory：指定调用每个 jsx 元素的函数
  - jsxFragment：Fragments 可以让你聚合一个子元素列表，并且不在 DOM 中增加额外节点

    ```js
    require('esbuild').transformSync('<div/>', {
      jsxFactory: 'h', //默认为 React.CreateElement,可自定义, 如果你想使用 Vue 的 jsx 写法, 将该值换成为 Vue.CreateElement
      loader: 'jsx', // 将 loader 设置为 jsx 可以编译 jsx 代码
    });

    // 同上，默认为 React.Fragment , 可换成对应的 Vue.Fragment。
    require('esbuild').transformSync('<>x</>', {
      jsxFragment: 'Fragment',
      loader: 'jsx',
    });
    ```

    如果是 tsx 文件，可以通过在`tsconfig`中添加这个来为`TypeScript`配置 JSX。ESbuild 会自动拾取它，而不需要配置。

    ```json
    {
      "compilerOptions": {
        "jsxFragmentFactory": "Fragment",
        "jsxFactory": "h"
      }
    }
    ```

- assetNames

  如果静态资源的 loader 设置的是 file，则可以通过次属性重新定义静态资源的位置和名称。

  ```js
  require('esbuild').buildSync({
    entryPoints: ['app.js'],
    assetNames: 'assets/[name]-[hash]',
    loader: { '.png': 'file' }, // 必须
    bundle: true,
    outdir: 'out',
  });
  ```

  如果代码引入了 3.png，则打包后图片的位置是 out/assets/3-hash 值.png

  提供了 3 个占位符:

  - [name]：文件名
  - [dir]：从包含静态文件的目录到 outbase 目录的相对路径
  - [hash]：hash 值，根据内容生成的 hash 值

- chunkNames

  控制在启用代码分割时自动生成的共享代码块的文件名。

  ```js
  require('esbuild').buildSync({
    entryPoints: ['app.js'],
    chunkNames: 'chunks/[name]-[hash]',
    bundle: true,
    outdir: 'out',
    splitting: true, // 必须
    format: 'esm', // 必须
  });
  ```

  有两个占位符:

  - [name]：文件名
  - [hash]：hash 值，根据内容生成的 hash 值

  **注意：不需要包含后缀名。此属性只能修改代码分割输出的文件名称，而不能修改入口文件名称。**

  测试发现如果两个入口文件引用了同一张图片，配置`代码分割`和`assetNames`的话，会打包出一个 js 文件和一个图片文件，图片文件放在了`assetNames`对应的目录下，而 js 文件放在了`chunkNames`对应的目录下，这个 js 文件内部导出了这个图片文件，如下:

  ```js
  // 3.jpg
  var __default = '../assets/3-FCRZLGZY.jpg';

  export { __default };
  ```

- entryNames

  指定入口文件的位置和名称。

  ```js
  require('esbuild').buildSync({
    entryPoints: ['src/main-app/app.js'],
    entryNames: '[dir]/[name]-[hash]',
    outbase: 'src',
    bundle: true,
    outdir: 'out',
  });
  ```

  提供了 3 个占位符:

  - [name]：文件名
  - [dir]：从包含静态文件的目录到 outbase 目录的相对路径
  - [hash]：hash 值，根据内容生成的 hash 值

- metafile
  对打包到一起的文件生成依赖图，存放在下述的`res.metafile`中。

  - 如果配置项 bundle 为 false，生成的依赖图只包含入口文件和入口文件中的引入文件
  - 如果配置项 bundle 为 true，打包到一起的文件都会包含在依赖图中，如下:

  ```js
  require('esbuild')
    .build({
      entryPoints: ['index.js'],
      bundle: true, // 设置为 true
      metafile: true,
      format: 'esm',
      outdir: 'dist',
    })
    .then((res) => {
      console.log(res);
    });

  /*
  metafile: {
  "inputs": {
    "b.js": { "bytes": 18, "imports": [] },
    "a.js": {
      "bytes": 54,
      "imports": [{ "path": "b.js", "kind": "import-statement" }]
    },
    "index2.js": {
      "bytes": 146,
      "imports": [{ "path": "a.js", "kind": "dynamic-import" }] //index.js 中导入的文件
    }
  },
  "outputs": {
  "dist/index2.js": {
  "imports": [],
  "exports": [],
  "entryPoint": "index2.js",
  "inputs": {
  "b.js": { "bytesInOutput": 78 },
  "a.js": { "bytesInOutput": 193 },
  "index2.js": { "bytesInOutput": 184 }
  },
  "bytes": 1017
  }
  }
  }
  */
  ```

  如果某个文件引入了第三方库，生成的`res.metafile`也会包含第三方库的地址，Vite 中实现了一个插件，目的是不将第三方库打包到 bundle 中，依然通过引入的方式加载

  ```js
  const externalizeDep = {
    name: 'externalize-deps',
    setup(build) {
      // 如果返回值为 undefined，则会调用下一个 onResolve 注册的回调，反之不会继续向  下执行
      build.onResolve({ filter: /.*/ }, (args) => {
        const id = args.path;
        // 如果是外部模块
        if (id[0] !== '.' && !path.isAbsolute(id)) {
          return {
            external: true, // 将此设置为 true，将该模块标记为第三方模块，这意味着  它将不会包含在包中，而是在运行时被导入
          };
        }
      });
    },
  };
  ```

### esbuild 插件

#### 如何写插件

一个 `ESbuild` 插件是一个包含`name`和`setup`函数的对象。

```js
export default {
  name: 'env',
  setup(build) {},
};
```

- name：插件名称
- setup 函数：每次 build API 调用时都会运行一次
- build 中包含一些钩子函数

```python
onStart # 开始时触发
onResolve # 遇到导入路径时运行，拦截导入路径
onLoad # 解析完成之后触发
onEnd # 打包完成之后触发
```

##### onResolve

在 ESbuild 构建的每个模块的每个导入路径上运行。`onResolve`注册的回调可以定制 ESbuild 如何进行路径解析。

```ts
type Cb = (args: OnResolveArgs) => OnResolveResult;

type onResolve = ({}: OnResolveOptions, cb: Cb) => {};
```

`onResolve`注册回调函数时，需要传入匹配参数和一个回调，并且回调需要返回`OnResolveResult`类型的对象。

```ts
interface OnResolveOptions {
  filter: RegExp;
  namespace?: string;
}
```

- `filter`：必须，每个回调都必须提供一个过滤器，它是一个正则表达式。 当路径与此过滤器不匹配时，将跳过当前回调。
- `namespace`：可选，在 filter 匹配的前提下，模块命名空间也相同，则触发回调。可通过上一个 onResolve 钩子函数返回，默认是 flie。

回调函数接收的参数:

```ts
interface OnResolveArgs {
  path: string; # 导入文件路径，和代码中导入路径一致
  importer: string; # 绝对路径，该文件在哪个文件里被导入的
  namespace: string; # 导入文件的命名空间 默认值 'file'
  resolveDir: string; # 绝对路径，该文件在哪个目录下被导入
  kind: ResolveKind; # 导入方式
  pluginData: any; # 上一个插件传递的属性
}

type ResolveKind =
  | 'entry-point' # 入口文件
  | 'import-statement' # ESM 导入
  | 'require-call'
  | 'dynamic-import' # 动态导入 import ('')
  | 'require-resolve'
  | 'import-rule' # css @import 导入
  | 'url-token'
```

回调函数返回值:

如果返回值为`undefined`，则会调用下一个`onResolve`注册的回调，反之不会继续向下执行。

```ts
interface OnResolveResult {
  errors?: Message[];
  external?: boolean; # 将此设置为 true，将该模块标记为外部模块，这意味着它将不会包含在包中，而是在运行时被导入
  namespace?: string; # 文件命名空间，默认为 'file'，表示 esbuild 会走默认处理
  path?: string; # 插件解析后的文件路径
  pluginData?: any; # 传递给下一个插件的数据
  pluginName?: string;
  warnings?: Message[];
  watchDirs?: string[];
  watchFiles?: string[];
}

interface Message {
  text: string;
  location: Location | null;
  detail: any; // The original error from a JavaScript plugin, if applicable
}

interface Location {
  file: string;
  namespace: string;
  line: number; // 1-based
  column: number; // 0-based, in bytes
  length: number; // in bytes
  lineText: string;
}
```

示例:

```js
const externalizeDep = {
  name: 'externalize-deps',
  setup(build) {
    // 如果返回值为 undefined，则会调用下一个onResolve注册的回调，反之不会继续向下执行
    build.onResolve({ filter: /.*/ }, (args) => {
      console.log(args);
      const id = args.path;
      // 如果是外部模块
      if (id[0] !== '.' && !path.isAbsolute(id)) {
        return {
          external: true, // 将此设置为 true，将该模块标记为第三方模块，这意味着它将不会包含在包中，而是在运行时被导入
        };
      }
    });
  },
};
```

##### onLoad

非外部文件加载完成后会触发 onLoad 注册的回调函数。

```ts
type Cb = (args: OnLoadArgs) => OnLoadResult;
type onLoad = ({}: OnLoadOptions, cb: Cb) => {};

// 参数， onResolve 相同
interface OnLoadOptions {
  filter: RegExp;
  namespace?: string;
}
// 回调中传入的参数
interface OnLoadArgs {
  path: string; // 被加载文件的绝对路径
  namespace: string; // 被加载文件的命名空间
  pluginData: any; // 上一个插件返回的数据
}
// 回调返回值
interface OnLoadResult {
  contents?: string | Uint8Array; // 指定模块的内容。 如果设置了此项，则不会为此解析路径运行更多加载回调。 如果未设置，esbuild 将继续运行在当前回调之后注册的加载回调。 然后，如果内容仍未设置，如果解析的路径的命名空间为 'file'，esbuild 将默认从文件系统加载内容
  errors?: Message[];
  loader?: Loader; // 设置该模块的loader，默认为 'js'
  pluginData?: any;
  pluginName?: string;
  resolveDir?: string; // 将此模块中的导入路径解析为文件系统上的真实路径时要使用的文件系统目录。对于'file'命名空间中的模块，该值默认为模块路径的目录部分。 否则这个值默认为空，除非插件提供一个。 如果插件不提供，esbuild 的默认行为将不会解析此模块中的任何导入。 此目录将传递给在此模块中未解析的导入路径上运行的任何解析回调。
  warnings?: Message[];
  watchDirs?: string[];
  watchFiles?: string[];
}
```

示例:

假设如果通过 cdn 引入 lodash 的 add 方法，打包时将`lodash`中的代码加到 `bundle` 中:

```js
import add from 'https://unpkg.com/lodash-es@4.17.15/add.js';

console.log(add(1, 1));
```

插件实现:

```js
const axios = require('axios');
const httpUrl = {
  name: 'httpurl',
  setup(build) {
    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      return {
        path: args.path,
        namespace: 'http-url',
      };
    });
    build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args) => {
      return {
        path: new URL(args.path, args.importer).toString(),
        namespace: 'http-url',
      };
    });
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      const res = await axios.get(args.path);
      return {
        contents: res.data,
      };
    });
  },
};

require('esbuild').build({
  entryPoints: ['index.js'],
  outdir: 'dist',
  bundle: true,
  format: 'esm',
  plugins: [httpUrl],
});
```

vite 中手写的插件，将 js、ts 代码中的`import.meta.url`、`__dirname`、`__filename`转换成绝对路径输出:

```js
const replaceImportMeta = {
  name: 'replace-import-meta',
  setup(build) {
    build.onLoad({ filter: /\.[jt]s$/ }, async (args) => {
      const contents = await fs.promises.readFile(args.path, 'utf8');
      return {
        loader: args.path.endsWith('.ts') ? 'ts' : 'js',
        contents: contents
          .replace(
            /\bimport\.meta\.url\b/g,
            JSON.stringify(`file://${args.path}`),
          )
          .replace(/\b__dirname\b/g, JSON.stringify(path.dirname(args.path)))
          .replace(/\b__filename\b/g, JSON.stringify(args.path)),
      };
    });
  },
};
```
