// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';
// import alias from 'rollup-plugin-alias';

// const path = require('path');

export default {
  // 增加支持的扩展后缀
  nodeResolveOpts: {
    extensions: ['.mjs', '.js', '.json', '.node', 'jsx'],
  },
  // 打包esm 使用rollup
  esm: 'babel',
  // 打包cjs 使用rollup
  cjs: 'babel',
  // rollup插件
  // extraRollupPlugins: [
  //   // 扩展支持node自身库
  //   globals(),
  //   builtins(),
  //   // 设置别名
  //   alias({
  //     resolve: ['.jsx', '.js'],
  //     entries: [
  //       { find: '@', replacement: path.resolve(__dirname, 'src') },
  //       {
  //         find: '@components',
  //         replacement: path.resolve(__dirname, 'src/components'),
  //       },
  //       { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
  //       {
  //         find: '@constants',
  //         replacement: path.resolve(__dirname, 'src/constants'),
  //       },
  //     ],
  //   }),
  // ],
  // 减少代码量，把 helper 方法提取到 @babel/runtime 里。
  runtimeHelpers: true,
  // 按需加载antd
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
