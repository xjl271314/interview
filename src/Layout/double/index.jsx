import React from 'react';

import './index.less';

export default () => {
  return (
    <div className="layout-double">
      <div id="header">header</div>
      <div id="container" class="column">
        <div id="center">center</div>
      </div>
      <div id="left" class="column">
        left
      </div>
      <div id="right" class="column">
        right
      </div>
      <div id="footer">footer</div>
    </div>
  );
};
