/* webpack.config.js */

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var path = require('path');
console.log(path.resolve(__dirname))
const plugins = [
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, 'bower_components/webcomponentsjs/*.js'),
        to: 'bower_components/webcomponentsjs/[name].[ext]'
    }]),
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, 'bower_components/web-component-tester/*.js'),
        to: 'bower_components/web-component-tester/[name].[ext]'
    }]),
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, 'config/conf.ozone.json'),
        to: 'conf.ozone.json'
    }]),
    new Clean(['test/build']),
];


module.exports = {
    // Tell Webpack which file kicks off our app.
    entry: path.resolve(__dirname, 'test/ozone-api-item_test.js'),
    // Tell Weback to output our bundle to ./dist/bundle.js
    output: {
        filename: '[name]_test.js',
        path: path.resolve(__dirname, 'test/build')
    },
    // Tell Webpack which directories to look in to resolve import statements.
    // Normally Webpack will look in node_modules by default but since we’re overriding
    // the property we’ll need to tell it to look there in addition to the
    // bower_components folder.
    resolve: {
        modules: [
            path.resolve(__dirname,  'bower_components'),
            path.resolve(__dirname,  'node_modules'),
            path.resolve(__dirname,  '../../../node_modules'),

        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.html']
    },
    externals: {
        'sinon': 'sinon',
    },
    // These rules tell Webpack how to process different module types.cd ..
    // Remember, *everything* is a module in Webpack. That includes
    // CSS, and (thanks to our loader) HTML.
    module: {
        rules: [
            {
                // If you see a file that ends in .html, send it to these loaders.
                test: /\.html$/,
                // This is an example of chained loaders in Webpack.
                // Chained loaders run last to first. So it will run
                // polymer-webpack-loader, and hand the output to
                // babel-loader. This let's us transpile JS in our `<script>` elements.
                use: [
                    { loader: 'babel-loader' },
                    { loader: 'polymer-webpack-loader' }
                ]
            },
            {
                // If you see a file that ends in .js, just send it to the babel-loader.
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ]
    },
    mode: 'development',
    plugins: plugins,
    devServer: {
    contentBase: path.join(__dirname),
        compress: true,
        overlay: true,
        port: 9000,
},
};
