---
title: Antd Design Charts
nav:
  title: 工程化
  path: /project
  order: 2
group:
  title: 前端工程化相关试题
  path: /project/project
---

# Antd Design Charts

[文档地址](https://charts.ant.design/zh/docs/manual/getting-started)

## Line

```tsx
import React from 'react';
import { Line } from '@ant-design/charts';

const Page: React.FC = () => {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config = {
    data,
    height: 400,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  return <Line {...config} />;
};
export default Page;
```

```tsx
import * as monaco from 'monaco-editor';
import React, { useRef, useEffect } from 'react';

const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorIns = monaco.editor.create(editorRef.current, {
        language: 'sql',
        value,
        folding: true,
        theme: 'vs',
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        minimap: {
          enabled: withMiniMap,
        },
        formatOnPaste: true,
        renderValidationDecorations: 'on',
      });
    }
  }, [editorRef]);
  return <div ref={editorRef}></div>;
};

export default CodeEditor;
```
