import React from 'react';

import './index.less';

export default () => {
  return (
    <div className="height-auto-page">
      <div className="block-height-auto">
        我是一个块级div元素，height:auto呈现出包裹性，会根据子元素的高度撑开。
      </div>
      <span className="inline-height-auto">
        我是一个内联span元素，height: auto呈现出包裹性，即由子元素的高度决定。
      </span>
      <div className="block-height-auto-children">
        <p>父元素设置height: auto会导致子元素height: 50%百分比失效。</p>
      </div>
      <div className="block-height-normal-children">
        <p>父元素设置height: 100px,子元素height: 50%百分比正常。</p>
      </div>
    </div>
  );
};
