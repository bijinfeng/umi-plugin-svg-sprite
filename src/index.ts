// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { resolve, join, relative, sep } from 'path';
import { utils } from 'umi';
import { readFileSync } from 'fs';

const { Mustache, winPath } = utils;

export default function(api: IApi) {
  api.logger.info('use plugin');

  const defaultPath = 'src/assets/svg';
  // 配置插件参数
  api.describe({
    key: 'svgSpritePath',
    config: {
      default: defaultPath,
      schema(joi) {
        return joi.string();
      },
    },
  });
  const includePath = api.userConfig.svgSpritePath || defaultPath;
  const absolutePath = join(api.paths.absSrcPath!, includePath);

  // 修改svg loader配置
  api.chainWebpack(config => {
    const svgRule = config.module.rule('svg');

    svgRule.exclude.add(absolutePath).end();

    config.module
      .rule('svg-sprite')
      .test(/\.(svg)(\?.*)?$/)
      .include.add(absolutePath)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      });

    return config;
  });

  // 生成临时文件
  api.onGenerateFiles({
    fn() {
      // loadSvg.ts
      const loadSvgTpl = readFileSync(join(__dirname, 'loadSvg.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-svg-sprite/loadSvg.ts',
        content: Mustache.render(loadSvgTpl, {
          path: winPath(absolutePath),
        }),
      });

      // icon component
      api.writeTmpFile({
        path: 'plugin-svg-sprite/icon.tsx',
        content: `
          import React from "react";
          export default props => {
            return React.createElement(require("${winPath(join(__dirname, './icon/index.js'))}").default, {...props});
          }
        `
      })
    },
    stage: -1,
  });

  // 在入口文件里import生成的临时文件loadSvg.ts
  api.addEntryImports(() => {
    return {
      source: join(api.paths.absTmpPath!, 'plugin-svg-sprite/loadSvg.ts'),
    }
  });

  api.addUmiExports(() => [
    {
      source: join(api.paths.absTmpPath!, 'plugin-svg-sprite/icon.tsx'),
      specifiers: [{ local: 'default', exported: 'CustomizeIcon' }],
    }
  ]);
}
