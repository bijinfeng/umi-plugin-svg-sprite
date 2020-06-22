# umi-plugin-svg-sprite

umi 集成 svg-sprite-loader，并提供一个 icon 组件。

## Install

```bash
# or yarn
$ npm i umi-plugin-svg-sprite
```

## Usage

Configure in `.umirc.js`,

```js
export default {
  svgSpritePath: 'assets/svg',
};
```

将 SVG 图标放入`svgSpritePath`配置的文件夹中，从 umi 中导入插件提供的自定义组件。

```
import { CustomizeIcon } from 'umi';

export default () => (
  <CustomizeIcon name="close" />
)

```

## Options

| 参数      | 说明           | 类型                   | 默认值 |
| --------- | -------------- | ---------------------- | ------ |
| name      | 图标的文件名   | string                 |
| className | 自定义样式类名 | string                 |
| style     | 自定义样式对象 | CSSProperties          |
| onClick   | 点击时回调函数 | Function(event: Event) |

## LICENSE

MIT
