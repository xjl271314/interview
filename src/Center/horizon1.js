import { Space } from 'antd';
import React from 'react';
import styles from './index.less';

export default function () {
  return (
    <ul className={styles.ul}>
      <Space direction="vertical">
        <li>
          <p>一行文字，居中展示</p>
        </li>

        <li>
          <p>这里是比较长的两行文字，这里是比较长的两行文字，居左展示</p>
        </li>
      </Space>
    </ul>
  );
}
