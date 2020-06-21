import * as React from 'react';

declare module '*.less';

declare module 'umi' {
  export const CustomizeIcon: React.FC<CustomizeIconProps>
}

export interface CustomizeIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}
