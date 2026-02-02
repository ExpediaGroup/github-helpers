import typescriptEslint from 'typescript-eslint';

export default [
  ...typescriptEslint.configs.recommended,
  {
    ignores: ['dist']
  },
  {
    files: ['test/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
