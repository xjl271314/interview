import React from 'react';

import './index.less';

export default () => {
  return (
    <div className="layout-glass">
      <div id="header">header</div>
      <div id="container">
        <div id="center" class="column">
          center
        </div>
        <div id="left" class="column">
          left
        </div>
        <div id="right" class="column">
          right
        </div>
      </div>
      <div id="footer">footer</div>
    </div>
  );
};
