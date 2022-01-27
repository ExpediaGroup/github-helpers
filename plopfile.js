module.exports = plop => {
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'controller name please'
    }],
    actions: [{
      type: 'add',
      path: 'src/{{name}}.js',
      templateFile: 'plop-templates/controller.hbs'
    }]
  });
};
