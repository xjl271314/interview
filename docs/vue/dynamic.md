---
title: vue3动态表单
nav:
  title: 前端框架
  path: /frontend
  order: 0
group:
  title: vue3
  path: /vue/3.0
---

# vue3 动态表单

- 2023.04.06

## 动态表单所有配置项

- src/components/from
- src/components/DataDialog.vue
- src/components/DataTableForm.vue

## 如何根据父元素是否传了 solt 来控制子组件的 slot 渲染?

```js
import { useSlots } from "vue";

// 默认的solt
<template v-if="useSlots().default">

</templat>

<template  v-else>
</template>

// 具名的slot header
<template v-if="useSlots().header">

</templat>

<template  v-else>
</template>
```
