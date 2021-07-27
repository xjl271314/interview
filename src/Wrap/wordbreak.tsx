import React, { useState } from 'react';
import { Select, Space } from 'antd';
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

const { Option } = Select;

export default () => {
  const [whiteSpace, setSpace] = useState('normal');
  const [wordBreak, setBreak] = useState('normal');

  return (
    <div className={styles.cssWrapNormalPage}>
      <p style={{ whiteSpace: whiteSpace, wordBreak: wordBreak }}>
        考虑一下我是一段很长的文本，内容很长内容
        很长内容很长内容很长内容很长内容很长内容很长很长内容很长很长内容很长很长内容很长很长内容很长很长内容很长，我想要自己进行换行，
        我需要怎么去做?{' '}
      </p>
      <p style={{ whiteSpace: whiteSpace, wordBreak: wordBreak }}>
        From foundational science to new and novel research, discover our large
        collection of Physical Sciences and Engineering publications, covering a
        range of disciplines, from the theoretical to the applied.
      </p>
      <div className={styles.option}>
        <Space size="middle">
          选择white-space:
          <Select
            defaultValue="normal"
            style={{ width: 120 }}
            onChange={(e) => setSpace(e)}
          >
            {sapceAttrs.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
          选择word-break:
          <Select
            defaultValue="normal"
            style={{ width: 120 }}
            onChange={(e) => setBreak(e)}
          >
            {breakAttrs.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Space>
      </div>
    </div>
  );
};
