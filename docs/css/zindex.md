---
title: CSS层叠上下文
nav:
  title: 前端基础
  path: /base
group:
  title: css相关试题
  path: /css/project
---

# 如何理解 CSS 的层叠上下文?

- 2021.06.22

层叠顺序，英文称作 `stackingorder`，表示元素发生层叠时有着特定的垂直显示顺序。

![CSS层叠上下文](https://image-static.segmentfault.com/234/200/2342007824-39e3db9150537194_fix732)

当我们书写 HTML 的时候，默认的情况下发生重叠时后面出现的元素会覆盖在之前的元素之上。

```html
<body>
  <header class="site-header"></header>
  <main class="site-content"></main>
  <footer class="site-footer"></footer>
</body>
```

如果它们的位置相互重叠的话，footer 将会层叠在 main 内容区域之上，main 将会层叠在 header 之上。

## 作用范围

`z-index`只作用于定位元素。

只有当该元素的 `position` 值为 `absolute`、`relative` 或 `fixed` 时，`z-index`才会产生影响。
