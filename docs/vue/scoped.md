---
title: css scoped
nav:
  title: Vue
  path: /vue
  order: 0
group:
  title: vue2
  path: /vue/2.0
---

# Vue css scoped

- 2022.11.01

```html
// 页面上 “属性选择器”这几个字显示红色
<div data-v-hash class="test-attr">属性选择器</div>
<style>
  /* 该标签有个data-v-hash的属性，只不过该属性为空，依然可以使用属性选择器 */
  .test-attr[data-v-hash] {
    color: red;
  }
</style>
<script>
  // 通过js判断是否存在 data-v-hash 属性
  console.log(
    document.querySelector('.test-attr').getAttribute('data-v-hash') === '',
  ); // true
</script>
```

1. 编译时，会给每个 vue 文件生成一个唯一的 id，会将此 id 添加到当前文件中所有 html 的标签上

   如`<div class="demo"></div>`会被编译成`<div class="demo" data-v-27e4e96e></div>`

2. 编译`style`标签时，会将`css选择器`改造成属性选择器，如`.demo{color: red;}`会被编译成`.demo[data-v-27e4e96e]{color: red;}`
