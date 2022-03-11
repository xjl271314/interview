import React from 'react';
import styles from './index.less';

export default function () {
  return (
    <main className={styles.main}>
      <section>
        <h1>has选择器命中h1</h1>
      </section>
      <section>
        <p>未命中的文本</p>
      </section>
      <section>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </section>
    </main>
  );
}
