import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [require.resolve('../lib')],
  svgSpritePath: 'assets/svg',
});
    