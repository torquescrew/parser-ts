module.exports = {
  entry: {
    fsc: './src/main.ts',
    test: './test/test.ts',
    lispTests: './test/lisp/test.ts'
  },
  target: 'node',
  output: {
    filename: './dist/[name].js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};