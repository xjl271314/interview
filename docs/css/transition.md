---
title: transition 和 animation 的区别?
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# 说说 transition 和 animation 的区别??

- 2021.06.22

## transition

> transition: property duration timing-function delay;

`transition` 关注的是 `CSSproperty` 的变化，`property` 值和时间的关系是一个`三次贝塞尔曲线`。

### 属性定义及使用说明:

| 值                           | 描述                                                                            |
| :--------------------------- | :------------------------------------------------------------------------------ |
| `transition-property`        | 指定 CSS 属性的 name，transition 效果: 大小,位置,扭曲等                         |
| `transition-duration`        | 规定完成过渡效果需要花费的时间（以秒或毫秒计）。 默认值是 0，意味着不会有效果。 |
| `transition-timing-function` | 指定 transition 效果的转速曲线                                                  |
| `transition-delay`           | 定义 transition 效果开始的时候                                                  |

### transition-property

- `none`: 没有属性获得过渡效果。
- `all`: 所有属性的变化都获得过渡效果。
- `property`: 特定属性变化获得过渡效果,如: `width`, `height`,`opacity` 等。

### transition-timing-function

> transition-timing-function: linear | ease | ease-in | ease-out | ease-in-out | cubic-bezier(n,n,n,n);

- `linear`: 规定以相同速度开始至结束的过渡效果（等于 `cubic-bezier(0,0,1,1)`）;
- `ease`: 规定慢速开始，然后变快，然后慢速结束的过渡效果（`cubic-bezier(0.25,0.1,0.25,1)`）;
- `ease-in`: 规定以慢速开始的过渡效果（等于 `cubic-bezier(0.42,0,1,1)`）;
- `ease-out`: 规定以慢速结束的过渡效果（等于 `cubic-bezier(0,0,0.58,1)`）;
- `ease-in-out`: 规定以慢速开始和结束的过渡效果（等于 `cubic-bezier(0.42,0,0.58,1)`）
- `cubic-bezier(n,n,n,n)`: 在 `cubic-bezier` 函数中定义自己的值。可能的值是 0 至 1 之间的数值

## animation

> animation: name duration timing-function delay iteration-count direction fill-mode play-state;

`animation` 作用于`元素本身`而不是样式属性，可以使用`关键帧`的概念，应该说可以实现更自由的动画效果。

| 值                          | 描述                                                                                   |
| :-------------------------- | :------------------------------------------------------------------------------------- |
| `animation-name`            | 指定要绑定到选择器的关键帧的名称                                                       |
| `animation-duration`        | 规动画指定需要多少秒或毫秒完成                                                         |
| `animation-timing-function` | 设置动画将如何完成一个周期                                                             |
| `animation-delay`           | 设置动画在启动前的延迟间隔                                                             |
| `animation-iteration-count` | 定义动画的播放次数                                                                     |
| `animation-direction`       | 指定是否应该轮流反向播放动画                                                           |
| `animation-fill-mode`       | 规定当动画不播放时（当动画完成时，或当动画有一个延迟未开始播放时），要应用到元素的样式 |
| `animation-play-state`      | 指定动画是否正在运行或已暂停                                                           |
| `initial`                   | 设置属性为其默认值                                                                     |
| `inherit`                   | 从父元素继承属性                                                                       |

其中 `animation-name` 指向的是`@keyframes` 定义的动画.

### `@keyframes`

> @keyframes animationname {keyframes-selector {css-styles;}}

| 值                   | 描述                                                                                        |
| :------------------- | :------------------------------------------------------------------------------------------ |
| `animationname`      | 必需, 定义动画的名称                                                                        |
| `keyframes-selector` | 必需, 定义动画的多个中间态 <br/> <br/> 合法值: `0-100%`、`from(和0%相同)`、`to(和100%相同)` |
| `css-styles`         | 必需, 定义动画的名称                                                                        |

## 总结

1. `transition` 一般是定义单个或多个 `css` 属性发生变化时的过渡动画,比如 `width`,`opacity` 等.当定义的 `css` 属性发生变化的时候才会执行过渡动画,`animation` 动画一旦定义,就会在页面加载完成后自动执行.

2. `transition` 定义的动画触发一次执行一次,想要再次执行想要再次触发`animation` 定义的动画可以指定播放次数或者无限循环播放`transition:` 需要用户操作,执行次数固定.

3. `transition` 定义的动画只有两个状态,开始态和结束态,`animation` 可以定义多个动画中间态,且可以控制多个复杂动画的有序执行.
