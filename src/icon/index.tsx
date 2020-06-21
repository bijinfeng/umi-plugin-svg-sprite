import React from 'react';
import './index.less';
import { CustomizeIconProps } from '../types/index.d';

export default React.memo((props: CustomizeIconProps) => {
  const { name, className = '', style = {}, onClick } = props;

  return (
    <svg className={`customize-icon ${className}`} style={style} onClick={onClick}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
});
