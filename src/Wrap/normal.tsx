import React, { useState } from 'react';
import { Select, Space } from 'antd';
import styles from './index.less';

const attrs = ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'inherit'];
const { Option } = Select;

export default () => {
  const [space, setSpace] = useState('nowrap');
  return (
    <div className={styles.cssWrapNormalPage}>
      <p style={{ whiteSpace: space }}>
        考虑一下我是一段很长的文本，内容很长内容
        很长内容很长内容很长内容很长内容很长内容很长很长内容很长很长内容很长很长内容很长很长内容很长很长内容很长，我想要自己进行换行，
        我需要怎么去做?{' '}
      </p>
      <div className={styles.option}>
        <Space size="middle">
          选择white-space:
          <Select
            defaultValue="nowrap"
            style={{ width: 120 }}
            onChange={(e) => setSpace(e)}
          >
            {attrs.map((item) => (
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
