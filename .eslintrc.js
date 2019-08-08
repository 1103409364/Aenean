module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'space-before-function-paren': 0, function 之前的空格 0 表示不加
    // 'indent': 0 缩进校验 0为不校验
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
