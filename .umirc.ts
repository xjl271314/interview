import { defineConfig } from 'dumi';
import path from 'path';

const { resolve } = path;

export default defineConfig({
  title: '题库指南',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
    null,
    {
      title: 'dumi',
      path: 'https://github.com/umijs/dumi',
    },
  ],
  devServer: {
    port: 7777,
    host: 'localhost',
  },
  define: {
    PLATFORM: 'web',
  },
  resolve: {
    previewLangs: ['jsx', 'tsx'],
  },
  theme: {
    '@primary-color': '#42b983',
    '@info-background-color': '#f3f5f7',
    '@info-border-color': '#42b983',
    '@info-text-color': '#999',
    '@warning-background-color': 'rgba(255,229,100,.3)',
    '@warning-border-color': '#e7c000',
    '@warning-text-color': '#6b5900',
    '@error-background-color': '#FFF',
    '@error-border-color': '#FF4B2B',
    '@error-text-color': '#FF4B2B',
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  alias: {
    app: resolve(__dirname, 'src/'),
  },
  links: [],
  scripts: [
    // {
    //   content: require(path.join(__dirname, '/plugin.js')),
    // },
  ],
});
