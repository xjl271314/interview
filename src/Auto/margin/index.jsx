import React from 'react';

import './index.less';

export default () => {
  return (
    <div className="margin-auto-page">
      <div className="block-margin-right-auto">
        我是一个块级div元素，左侧margin:100px,右侧auto
      </div>
      <div className="inline-block-margin-right-auto">
        我是一个行内块级div元素，左侧margin:100px,右侧auto
      </div>
      <br />
      <span className="inline-margin-right-auto">
        我是一个行内span元素，左侧margin:100px,右侧auto
      </span>
      <br />
      <div className="block-margin-auto">
        我是一个行内块级div元素，宽度500px，左侧、右侧margin:auto
      </div>
    </div>
  );
};
