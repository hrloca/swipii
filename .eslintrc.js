module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'prettier', 'import'],
  rules: {
    'no-unused-vars': 'off',
    'react/prop-types': ['off'],
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  globals: {
    JSX: true,
  },
}
