// eslint-disable-next-line functional/immutable-data,import/no-commonjs
module.exports = plop => {
  plop.setHelper('spaceSeparatedCase', helper => helper.split('-').join(' '));

  plop.setGenerator('helper', {
    description: 'new github helper',
    prompts: [
      {
        type: 'input',
        name: 'helper',
        message: 'New helper name (e.g. my-new-helper):'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter a detailed description of what the helper does and how it can be used:'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/helpers/{{ helper }}.ts',
        templateFile: 'templates/helper.hbs'
      },
      {
        type: 'add',
        path: 'test/helpers/{{ helper }}.test.ts',
        templateFile: 'templates/test.hbs'
      },
      {
        type: 'add',
        path: '.github/workflows/{{ helper }}.yml',
        templateFile: 'templates/workflow.hbs'
      },
      {
        type: 'modify',
        path: 'README.md',
        pattern: /Each of the following helpers are defined in a file of the same name in `src\/helpers`:/g,
        templateFile: 'templates/docs.hbs'
      }
    ]
  });
};
