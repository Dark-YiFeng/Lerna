module.exports = {
  extends: ['alloy', 'alloy/react'],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    // myGlobal: false
    AMap: true,
    AMapUI: true,
  },
  rules: {
    // 自定义你的规则
    // 只将内置Error对象的实例传递给reject()为了Promises中的用户定义错误的函数是一种很好的做法,这里关闭掉
    'prefer-promise-reject-errors': 'off',
    // https://cloud.tencent.com/developer/section/1135734,函数里面改变参数的值 暂时放开
    'no-param-reassign': 'off',
    // https://cloud.tencent.com/developer/section/1135705 this开放
    'no-invalid-this': 'off',
    // https://cloud.tencent.com/developer/section/1135641 函数入参个数从3改成4
    'max-params': ['error', 4],
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unsafe.md
    'react/no-unsafe': 'off',
    'react/no-deprecated': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
