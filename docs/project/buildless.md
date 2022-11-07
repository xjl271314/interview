---
title: 如何优化webpack打包的体积？
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# 如何优化 webpack 打包的体积？

- 2021.06.01

1. 使用 `TerserPlugin` 进行分 `js` 代码的压缩,使用 `mini-css-extract-plugin` 对 `CSS`进行压缩,`HtmlWebpackPlugin` 对 `html` 进行压缩，折叠空白区域，移除注释等配置。

2. 对小图片处理：`url-loader`,`file-loader`，对大图片进行压缩 `image-webpack-loader`。

3. `HashedModuleIdsPlugin` 打包体积小 `optimization` 设置 `moduleIds: 'hashed'`。

4. `webpack4` 下,`import()`模块按需加载,打包按需切割模块，减少包体积，加快首页请求速度因为项目功能越加越多，打包后的体积越来越大，导致首页展示的时候速度比较慢，因为要等压缩的 js 的包加载完毕。

5. 使用 `DllPlugin` 提取公共包，优化打包体积，`DllReferencePlugin`。
