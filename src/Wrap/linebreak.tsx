import React, { useState } from 'react';
import { Select, Space } from 'antd';
import styles from './index.less';

const breakAttrs = ['auto', 'loose', 'normal', 'strict', 'anywhere'];

const { Option } = Select;

export default () => {
  const [lineBreak, setLineBreak] = useState('none');

  return (
    <div className={styles.cssWrapNormalPage}>
      <p style={{ whiteSpace: 'normal', lineBreak: lineBreak }}>
        考虑一下我是一段很长的文本，内容很长内容
        很长内容很长内容很长内容很长内容很长内容很长很长内容很长很长内容很长很长内容很长很长内容很长很长内容很长，我想要自己进行换行，
        我需要怎么去做?{' '}
      </p>
      <p style={{ whiteSpace: 'normal', lineBreak: lineBreak }}>
        From foundational science to new and novel research, discover our large
        collection of Physical Sciences and Engineering publications, covering a
        range of disciplines, from the theoretical to the applied.
      </p>
      <div className={styles.option}>
        <Space size="middle">
          选择line-break:
          <Select
            defaultValue="auto"
            style={{ width: 120 }}
            onChange={(e) => setLineBreak(e)}
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
