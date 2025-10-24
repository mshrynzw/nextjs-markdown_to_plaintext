/** @type {import("prettier").Config} */
module.exports = {
  // ESLintと一致する基本設定
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  endOfLine: 'lf',
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  overrides: [
    {
      files: '*.{ts,tsx,js,jsx}',
      options: {
        singleQuote: true,
        jsxSingleQuote: true,
      },
    },
  ],
};
