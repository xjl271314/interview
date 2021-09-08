/**
 * 自定义实现的类似VuePress效果的:::tip效果
 * 目前 dumi 中插件开发的功能暂时有问题 只能使用此方式兼容
 */
import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './index.less';

/**
 * 工具方法，可以将输入的string中用[]括起来的内容转化为html
 * @param str 输入的string
 * @returns html格式文本
 */
const formatBackQuote = (str) => {
  return str
    .replace(/\'(.+)'/g, `<code className="${styles.blockquote}">$1</code>`)
    .replace(/\`(.*?)\`/g, `<em className="${styles.em}">$1</em>`);
};

/**
 * @param {object} title optional 显示的标题
 * @param {object} txt required 需要渲染的信息
 */
export default ({ type = 'info', title = '', txt }) => {
  const showTitle = useMemo(() => {
    if (!title && type === 'info') {
      return '提示';
    }
    if (!title && type === 'warning') {
      return '警告⚠️';
    }

    if (!title && type === 'error') {
      return '错误❌';
    }
  }, [title, type]);

  return (
    <div className={classNames(styles.components_info, styles[type])}>
      <h2>{showTitle}</h2>
      <pre dangerouslySetInnerHTML={{ __html: formatBackQuote(txt) }} />
    </div>
  );
};
