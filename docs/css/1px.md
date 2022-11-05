---
title: 移动端实现1px
nav:
  title: css
  path: /css
group:
  title: css相关试题
  path: /css/project
---

# 移动端实现 1px

- 2022.10.31

## device-pixel-ratio 设备像素比 和 resolution 分辨率 来区分的不同设备像素比

- 如果设备像素比为 1，伪类不缩放
- 如果设备像素比为 2，伪类缩放为 0.5
- 如果设备像素比为 3，伪类缩放为 0.33

```scss
// 使用scss语法实现
@mixin side-parse($color, $border: 1px, $side: all, $radius: 0, $style: solid) {
  @if ($side == all) {
    border: $border $style $color;
  } @else {
    border-#{$side}: $border $style $color;
  }
}

@mixin border-s1px(
  $color,
  $border: 1px,
  $side: all,
  $radius: 0,
  $style: solid,
  $radius: 0
) {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    border-radius: $radius;
    @include side-parse($color, $border, $side, $radius, $style);
    box-sizing: border-box;
    transform-origin: 0 0; // 默认值为50% 50%
    @media (max-device-pixel-ratio: 1.49),
      (max-resolution: 143dpi),
      (max-resolution: 1.49dppx) {
      width: 100%;
      height: 100%;
      border-radius: $radius;
    }
    @media (min-device-pixel-ratio: 1.5) and (max-device-pixel-ratio: 2.49),
      (min-resolution: 144dpi) and (max-resolution: 239dpi),
      (min-resolution: 1.5dppx) and (max-resolution: 2.49dppx) {
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      border-radius: $radius * 2;
    }
    @media (min-device-pixel-ratio: 2.5),
      (min-resolution: 240dpi),
      (min-resolution: 2.5dppx) {
      width: 300%;
      height: 300%;
      transform: scale(0.333);
      border-radius: $radius * 3;
    }
  }
}
```

## 伪类 + scale 缩放 来实现 1px 效果（包括圆角功能）
