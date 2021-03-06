// Karma configuration
// Generated on Thu Nov 15 2018 20:47:40 GMT+0100 (CET)
const path = require('path')
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "test/**/*.ts" }
    ],

    // list of files / patterns to exclude
    exclude: [
    ],
	  webpack: {
		  // Tell Webpack which file kicks off our app.
		  entry: path.resolve(__dirname, 'test/index.ts'),
		  output: {
			  path: path.resolve(__dirname, 'test/build')
		  },
		  resolve: {
			  modules: [
				  path.resolve(__dirname,  'node_modules'),
				  path.resolve(__dirname, '../../../node_modules'),

			  ],
			  extensions: ['.ts', '.js']
		  },
		  mode: 'development',
		  devtool: 'eval',
		  module: {
			  rules: [
				  {
					  test: /\.js$/,
					  use: 'babel-loader'
				  },
				  {
					  test: /\.ts$/,
					  use: 'ts-loader',
				  },
			  ]
		  },
	  },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "test/index.ts": ['webpack'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox', // required to run without privileges in docker
        ]
      }
    },
  })
}
