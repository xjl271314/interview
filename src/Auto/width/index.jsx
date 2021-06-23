import React from 'react';

import './index.less';

export default () => {
  return (
    <div className="width-auto-page">
      <div className="block-width-auto">
        我是一个块级div元素，width:auto会撑满整行
      </div>
      <span className="inline-width-auto">
        我是一个内联span元素，width: auto呈现出包裹性，即由子元素的宽度决定。
      </span>

      <div className="block-width-auto-with-margin">
        我是一个块级div元素，我带有固定margin:20px
        50px,width:auto会撑满整行除去margin的空间
      </div>
    </div>
  );
};
