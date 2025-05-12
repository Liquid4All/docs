module.exports = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-packagejson',
    'prettier-plugin-sql',
  ],
  printWidth: 100,
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,

  // import order
  importOrder: ['^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  overrides: [
    {
      files: '*.sql',
      options: {
        language: 'postgresql',
        parser: 'sql',
      },
    },
  ],
};
