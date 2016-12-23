module.exports = {
   entry: {
      ui: './playground-app/main.tsx'
   },
   output: {
      filename: './dist/[name].js'
   },
   resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
   },
   module: {
      loaders: [
         // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
         { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
   },
   devtool: 'source-map',
   "exclude": [
      "node_modules",
      "public",
      "server",
      "app-state"
   ],
   externals: getExternals()
};


function getExternals() {
   const modules = [
      'events',
      'electron',
      'winston',
      'mocha',
      'spectron',

      // Socket.io related.
      'socket.io',
      'bufferutil',
      'utf-8-validate',
      'socket.io-client/package',

      'superagent',

      // phantomjs related.
      'system',
      'webpage',
      'phantomjs-prebuilt',

      'fs'
   ];

   var externals = {};

   modules.forEach(function(m) {
      externals[m] = 'require("' + m + '")'
   });

   return externals;
}