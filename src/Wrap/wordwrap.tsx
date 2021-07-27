import React, { useState } from 'react';
import { Select, Space, Tag } from 'antd';
import styles from './index.less';

const sapceAttrs = [
  'normal',
  'nowrap',
  'pre',
  'pre-wrap',
  'pre-line',
  'inherit',
];

const breakAttrs = ['normal', 'break-all', 'break-word', 'keep-all'];

const wrapAttrs = ['normal', 'break-word'];

const { Option } = Select;

export default () => {
  const [whiteSpace, setSpace] = useState('normal');
  const [wordBreak, setBreak] = useState('normal');
  const [wordWrap, setWrap] = useState('normal');

  return (
    <div className={styles.cssWrapNormalPage}>
      <Space direction="vertical" size="middle">
        <p style={{ whiteSpace: whiteSpace, wordBreak: 'break-all' }}>
          From tomorrow on,
          langlanglanglanglanglanglanglanglanglanglanglanglanglanglanglanglanglang
          I will be a happy person; Grooming, chopping, and traveling all over
          the world. From tomorrow on, I will care foodstuff and vegetables, I
          have a house,towards the sea, with spring flowers blossoming.
        </p>
        <Tag color="magenta">white-space: normal; wordBreak: break-all;</Tag>
        <p style={{ whiteSpace: whiteSpace, wordWrap: 'breal-word' }}>
          From tomorrow on,
          langlanglanglanglanglanglanglanglanglanglanglanglanglanglanglanglanglang
          I will be a happy person; Grooming, chopping, and traveling all over
          the world. From tomorrow on, I will care foodstuff and vegetables, I
          have a house,towards the sea, with spring flowers blossoming.
        </p>
        <Tag color="green">
          white-space: normal; word-wrap(overflow-wrap): break-word;
        </Tag>
      </Space>
    </div>
  );
};
