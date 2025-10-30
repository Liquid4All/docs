const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'only-warn'],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    'node_modules/',
    'dist/',
    'coverage/',
    'storybook-static/',
    '_pagefind/',
  ],
  rules: {
    'no-unused-vars': 'off',
    'import/no-cycle': 'error',
    'no-empty-pattern': 'off',
    curly: 'error',
    'eol-last': ['error', 'always'],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@docusaurus/', '^@theme/', '^@theme-original/', '^@site/'],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/tests/**/*.ts',
          '**/tests/**/*.tsx',
          '**/__tests__/**/*.ts',
          '**/__tests__/**/*.tsx',
          '**/__integrationTests__/**/*.ts',
          '**/__integrationTests__/**/*.tsx',
          '**/stories/**/*.ts',
          '**/stories/**/*.tsx',
          '**/__stories__/**/*.tsx',
          '**/__stories__/**/*.ts',
          '**/scripts/**/*.ts',
        ],
        optionalDependencies: false,
        peerDependencies: true,
      },
    ],
    '@next/next/no-img-element': 'off',
  },
};
