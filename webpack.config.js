const keysTransformer = require('ts-transformer-keys/transformer').default;

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader', // or 'awesome-typescript-loader'
        options: {
          // make sure not to set `transpileOnly: true` here, otherwise it will not work
          getCustomTransformers: program => ({
            before: [
              keysTransformer(program)
            ]
          })
        }
      }
    ]
  }
};
