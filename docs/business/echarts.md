---
title: echarts常用示例
nav:
  title: business
  path: /business
group:
  title: 常用业务插件指南
  path: /business/extra/project
---

# echarts

- 2022.05.02

## 折线图

```jsx
import React, { useEffect, useRef, useState } from 'react';

import * as echarts from 'echarts';
import { Space, Button } from 'antd';

function LineDemo() {
  const [currentOption, setCurrentOption] = useState(null);
  const $ref = useRef();

  const baseOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
      },
    ],
  };

  const doubleyX = ['5月1日', '5月2日', '5月3日', '5月4日', '5月5日'];
  const rankList = [300, 100, 50, 20, 14];
  const indexList = [34000, 28000, 40000, 51450, 57898];

  // 获取指定要划分的区间
  const getInterval = (data) => {
    let max = Math.ceil(1.1 * Math.max.apply(null, data));
    let min = Math.floor(0.9 * Math.min.apply(null, data));

    const maxMod = Math.pow(10, String(max).length - 1);
    const minMod = Math.pow(10, String(min).length - 1);

    // max向上取整
    max = Math.ceil(max / maxMod) * maxMod;
    min = Math.floor(min / minMod) * minMod;

    const num = 5;
    // 兼容都是0的规则
    if (max == 0) {
      return {
        max: num * 20,
        min: 0,
        interval: 20,
      };
    }
    const distance = parseInt(((max - min) / num).toString(), 10);
    return {
      max: num * distance + min + num,
      min: min,
      interval: distance,
    };
  };

  const doubleYOption = {
    // 配置提示的样式
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#FFFFFF',
      textStyle: {
        color: '#040A23',
        fontSize: 12,
      },
      axisPointer: {
        crossStyle: {
          color: '#999',
        },
      },
      // 自定义tooltip
      formatter: function (params) {
        const date = params[0].axisValue;
        let rank, index;
        for (let item of params) {
          if (item.seriesName == '排名') {
            rank = item.value;
          } else if (item.seriesName == '指数') {
            index = item.value;
          }
        }
        let str = `<div>${date}<div>`;

        if (+rank >= 0) {
          str += `<div style="color: #656979;"}>排名：<span style="color: #ca0e2d;">
                            ${rank}</span><div>`;
        }

        if (+index >= 0) {
          str += `<div style="color: #656979;">指数：<span style="color: #9e7d58;">${index}</span><div>`;
        }

        return str;
      },
    },
    // 基础容器信息都在这配置
    grid: {
      containLabel: true,
      left: '20px',
      top: '40px',
      right: '20px', // 防止x轴最右端label显示不全
      bottom: '40px',
    },
    xAxis: [
      {
        type: 'category',
        data: doubleyX,
        boundaryGap: false,
        axisTick: {
          // 坐标轴刻度相关设置。
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#9AA0B1',
            opacity: 0.3,
          },
        },
        axisLabel: {
          show: true,
          fontSize: 11, //更改坐标轴文字大小
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        show: true,
        inverse: true,
        name: '排名',
        nameLocation: 'start',
        min: 1,
        max: Math.ceil(1.5 * Math.max.apply(null, rankList)),
        axisLabel: {
          show: false,
          fontSize: 11,
        },
        alignTicks: true,
        // 坐标轴显示相关设置
        axisLine: {
          show: false,
          lineStyle: {
            color: '#CA0E2D',
          },
        },
        // 坐标轴刻度相关设置。
        axisTick: {
          show: false,
        },
        nameTextStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
        },
      },
      {
        type: 'value',
        name: '指数',
        min: getInterval(indexList).min,
        max: getInterval(indexList).max,
        interval: getInterval(indexList).interval,
        axisLabel: {
          show: true,
          fontSize: 11,
        },
        // 在多个 y 轴为数值轴的时候，可以开启该配置项自动对齐刻度。
        alignTicks: true,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#9E7D58',
          },
        },
        nameTextStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
        },
        // 坐标轴刻度相关设置。
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E1E5EC',
            opacity: 0.8,
            width: 1,
          },
        },
      },
    ],
    series: [
      {
        name: '排名',
        type: 'line',
        itemStyle: {
          normal: {
            color: '#CA0E2D',
          },
        },
        showSymbol: rankList.length == 1,
        animation: false, // hover 不变大
        data: rankList,
        areaStyle: {
          origin: 'end',
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(202, 14, 45, 1)',
            },
            {
              offset: 1,
              color: 'rgba(202, 14, 45, 0)',
            },
          ]),
        },
        yAxisIndex: '0',
      },
      {
        itemStyle: {
          normal: {
            color: '#9E7D58',
          },
        },
        name: '指数',
        type: 'line',
        showSymbol: indexList.length == 1,
        animation: false, // hover 不变大
        data: indexList,
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(158, 125, 88, 1)',
            },
            {
              offset: 1,
              color: 'rgba(158, 125, 88, 0)',
            },
          ]),
        },
        yAxisIndex: '1',
      },
    ],
    legend: {
      data: ['排名', '指数'],
      orient: 'horizontal',
      bottom: 8,
      itemGap: 48,
      itemWidth: 17,
      itemHeight: 4,
      textStyle: {
        color: '#656979',
        height: 14,
        lineHeight: 14,
      },
      // 这里可以设置默认选中哪个
      selected: {
        排名: true,
        指数: true,
      },
      // 开启此参数可控制图例可选择交互
      selectedMode: true,
      icon: 'rect',
    },
  };

  useEffect(() => {
    if ($ref.current && currentOption) {
      const chartDom = $ref.current;
      const myChart = echarts.init(chartDom);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(currentOption);
    }
  }, [$ref, currentOption]);

  const handleData = (type) => () => {
    if (type == 'base') {
      setCurrentOption(baseOption);
    } else if (type === 'doubleY') {
      setCurrentOption(doubleYOption);
    }
  };

  return (
    <div>
      <h2> 折线图示例 </h2>
      <Space>
        <Button onClick={handleData('base')}>显示基础示例</Button>
        <Button onClick={handleData('doubleY')}>显示双Y轴自定义轴距示例</Button>
      </Space>
      <div ref={$ref} style={{ height: 400 }}></div>
    </div>
  );
}

export default () => <LineDemo />;
```
