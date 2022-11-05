---
title: 服务端渲染
nav:
  title: React
  path: /react
  order: 0
group:
  title: react相关试题
  path: /react/project
---

# 服务端渲染

- 2022.11.02

## `Next.js`预渲染模式。

`Next.js`支持`SSR`、`SSG`、`ISR`三种模式，默认是`SSG`。

## SSR 模式

需要将 `Next.js` 应用程序部署到服务器，开启服务端渲染。

**整个流程：**

用户访问页面 → 如果该页面配置了 `getServerSideProps` 函数 → 调用 `getServerSideProps` 函数 → 用接口的数据渲染出完整的页面返回给用户。

```js
// 定义页面
function Page({ data }) {
  // Render data...
}

// 如果该页面配置了 getServerSideProps函数，调用该函数
export async function getServerSideProps() {
  // 请求接口拿到对应的数据
  const res = await fetch(`https://.../data`);
  const data = await res.json();

  // 将数据渲染到页面中
  return { props: { data } };
}

// 导出整个页面
export default Page;
```

## SSG 模式

SSG 模式：项目在打包时，从接口中请求数据，然后用数据构建出完整的 html 页面，最后把打包好的静态页面，直接放到服务器上即可。

`Next.js` 允许你从同一文件 `export`（导出） 一个名为 `getStaticProps` 的 `async`（异步） 函数。该函数在构建时被调用，并允许你在预渲染时将获取的数据作为 `props` 参数传递给页面。

```js
// 定义Blog页面
function Blog({ posts }) {
  // Render posts...
}

// getStaticProps函数，在构建时被调用
export async function getStaticProps() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  // 通过返回 { props: { posts } } 对象，Blog 组件
  // 在构建时将接收到 `posts` 参数
  return {
    props: {
      posts,
    },
  };
}

// 导出Blog页面
export default Blog;
```

## ISR 模式

创建具有 动态路由 的页面，用于海量生成。

`Next.js`允许在应用运行时再重新生成每个页面 HTML，而不需要重新构建整个应用。这样即使有海量页面，也能使用上 `SSG` 的特性。一般来说，使用 `ISR` 需要 `getStaticPaths` 和 `getStaticProps` 同时配合使用。

```js
// 定义博文页面
function Blog({ post }) {
  // Render post...
}

// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  // 据博文列表生成所有需要预渲染的路径
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: false };
}

// 在构建时也会被调用
export async function getStaticProps({ params }) {
  // params 包含此片博文的 `id` 信息。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  // 通过 props 参数向页面传递博文的数据
  return { props: { post } };
}

export default Blog;
```
