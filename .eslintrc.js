module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    indent: [
      'warn',
      2,
    ],
    'one-var': [
      'off',
      'never',
    ],
    camelcase: [
      'off',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'no-return-await': [
      'warn',
    ],
    'no-unused-vars': [
      'warn',
    ],
    'brace-style': [
      0,
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
  },
}
