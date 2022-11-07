---
title: 如何提高webpack的构建速度？
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 如何提高 webpack 的构建速度？

- 2021.06.01

- `TerserPlugin` 启动缓存 `cache` 以及启动并行压缩 `parallel`, 使用 `cache-loader` 或者 `hard-source-webpack-plugin`。

- 配置 `loader` 的搜索范围 `include` 或者 `exclude`, `noParse` 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 `import`、`require`、`define` 等模块化语句), 合理使用 `alias`。

- 基于 `NamedModulesPlugin` 处理速度快(前者会用模块的文件路径作为模块名，后者会对路径进行 md5 处理)，`HashedModuleIdsPlugin `打包体积小，`optimization` 的 `moduleIds`，测试环境设置为 `named`，生产环境设置为 `hashed` 。

- 配置 `HardSourceWebpackPlugin`：

  ```js
      mode: 'production',
      optimization: {
          modulesIds: 'hashed',
      }
  ```

- 配置 `DllPlugin` 减少基础模块编译次数，当需要导入的模块存在于某个 `dll` 中时，这个模块不再被打包，而是去 `dll` 中获取 构建速度效果测量是通过 `speed-measure-webpack-plugin`。
