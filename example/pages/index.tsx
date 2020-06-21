import React from 'react';
import styles from './index.css';
import { CustomizeIcon } from 'umi';

export default () => (
  <div className={styles.normal}>
    Hello Umi!

    <CustomizeIcon name="500" />
  </div>
);
