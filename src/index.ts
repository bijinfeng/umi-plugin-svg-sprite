// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { join } from 'path';
import { utils } from 'umi';
import { readFileSync } from 'fs';

const { Mustache, winPath } = utils;

export default function(api: IApi) {
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
  api.onGenerateFiles(() => {
    // loadSvg.ts
    const loadSvgTpl = readFileSync(join(__dirname, 'loadSvg.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'plugin-svg-sprite/loadSvg.ts',
      content: Mustache.render(loadSvgTpl, {
        path: winPath(absolutePath),
      }),
    });

    // icon component
    const iconTpl = readFileSync(join(__dirname, 'icon.tsx.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'plugin-svg-sprite/icon.tsx',
      content: Mustache.render(iconTpl, {}),
    });

    // icon component style
    const iconStyleTpl = readFileSync(join(__dirname, 'icon.less.tpl'), 'utf-8');
    api.writeTmpFile({
      path: 'plugin-svg-sprite/icon.less',
      content: Mustache.render(iconStyleTpl, {}),
    });
  });

  // 在入口文件里import生成的临时文件loadSvg.ts
  api.addEntryImports(() => ({
    source: join(api.paths.absTmpPath!, 'plugin-svg-sprite/loadSvg.ts'),
  }));

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: '../plugin-svg-sprite/icon',
    }
  ]);
}
