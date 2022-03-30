/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  env: {
    'vue/setup-compiler-macros': true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['*.vue', '*.config.js'],
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
};
