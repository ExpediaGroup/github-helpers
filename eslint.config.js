import typescriptEslint from 'typescript-eslint';

export default [
  ...typescriptEslint.configs.recommended,
  {
    ignores: ['dist']
  }
];
