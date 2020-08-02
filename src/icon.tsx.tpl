import React, { FC, memo } from 'react';
import './icon.less';

export interface CustomizeIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export const CustomizeIcon: FC<CustomizeIconProps> = memo((props) => {
  const { name, className = '', style = {}, onClick } = props;

  return (
    <svg className={`customize-icon ${className}`} style={style} onClick={onClick}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
});
