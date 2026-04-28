// const { FlatCompat } = require('@eslint/eslintrc')
// const js = require('@eslint/js')
// const ts = require('@typescript-eslint/eslint-plugin')
// const parser = require('@typescript-eslint/parser')
// const prettier = require('eslint-plugin-prettier')
// const unusedImports = require('eslint-plugin-unused-imports')

// // This helper provides compatibility with your existing ESLint configuration (.eslintrc)
// const compat = new FlatCompat({
//   baseDirectory: __dirname // This helps with relative paths
// })

// module.exports = [
//   js.configs.recommended,
//   {
//     files: ['**/*.ts', '**/*.tsx'],
//     languageOptions: {
//       ecmaVersion: 2021,
//       sourceType: 'module',
//       parser: parser
//     },
//     plugins: {
//       '@typescript-eslint': ts,
//       prettier: prettier,
//       'unused-imports': unusedImports
//     },
//     rules: {
//       'no-unused-vars': 'off', // Disable base rule to replace with unused-imports
//       '@typescript-eslint/no-unused-vars': 'off', // Disable the similar TS-specific rule
//       'unused-imports/no-unused-imports': 'error', // Remove unused imports automatically
//       'unused-imports/no-unused-vars': [
//         'warn',
//         {
//           vars: 'all',
//           varsIgnorePattern: '^_',
//           args: 'after-used',
//           argsIgnorePattern: '^_'
//         }
//       ],
//       'prettier/prettier': 'error'
//     }
//   },
//   // This restore some older .eslintrc types of settings
//   ...compat.extends('plugin:@typescript-eslint/recommended'),
//   ...compat.extends('plugin:prettier/recommended')
// ]
