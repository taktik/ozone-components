/* webpack.config.js */
const webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlIncluderWebpackPlugin = require('html-includer-webpack-plugin').default;
var Clean = require('clean-webpack-plugin');
var path = require('path');
const setupServerMockup = require('./elements/serverMockup');

const modulePath = 'elements'; //'taktik_components/ozone-video-player/';//
module.exports = {
    // Tell Webpack which file kicks off our app.
    entry: {
        "index": path.resolve(__dirname, modulePath, 'index.js'),
},
    // Tell Weback to output our bundle to ./dist/bundle.js
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    // Tell Webpack which directories to look in to resolve import statements.
    // Normally Webpack will look in node_modules by default but since we’re overriding
    // the property we’ll need to tell it to look there in addition to the
    // bower_components folder.
    resolve: {
        alias: {
            Clappr: 'ozone-video-player/vendor/clappr',
            clappr: 'ozone-video-player/vendor/clappr',
            "../../marked/lib/marked.js": 'marked/lib/marked.js',
            //"polymer/polymer.html": "polymer/polymer-element.html",
            "../../../shadycss/apply-shim.html": "@webcomponents/shadycss/apply-shim.html",
            "../../../shadycss/custom-style-interface.html": "@webcomponents/shadycss/custom-style-interface.html",
//            "hls.js": "hls.js/src/hls.js"
        },
        modules: [
            path.resolve(__dirname, 'node_modules/@polymer'),
            path.resolve(__dirname, 'taktik_components'),
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '../../../node_modules'),
            path.resolve(__dirname, 'bower_components'),

        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.html', '*']
    },
    // These rules tell Webpack how to process different module types.cd ..
    // Remember, *everything* is a module in Webpack. That includes
    // CSS, and (thanks to our loader) HTML.
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    { loader: 'babel-loader' },
                    { loader: 'polymer-webpack-loader',
                        options: {
                            ignoreLinks: /\.\.\/polymer\/polymer\.html$/,
                        } }
                ]
            },
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.(png|woff|eot|swf|cur|ttf)/,
                loader: 'url-loader',
                options: {
                    limit: 1,
                    publicPath: '<%=baseUrl%>/'
                }
            },
            {
                test: /\.svg/, loader: 'svg-inline-loader'
            },
            /* ********** */
        ]
    },
    plugins: [
        // This plugin will generate an index.html file for us that can be used
        // by the Webpack dev server. We can give it a template file (written in EJS)
        // and it will handle injecting our bundle for us.
        new HtmlWebpackPlugin({
            inject: false,
            template: path.resolve(__dirname, modulePath, 'index.ejs'),
            chunks: ['index']
        }),
        // This plugin will copy files over to ‘./dist’ without transforming them.
        // That's important because the custom-elements-es5-adapter.js MUST
        // remain in ES2015. We’ll talk about this a bit later :)
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'bower_components/webcomponentsjs/*.js'),
            to: 'bower_components/webcomponentsjs/[name].[ext]'
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'config/conf.ozone.json'),
            to: 'conf.ozone.json'
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../../../lerna.json'),
            to: 'lerna.json',
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../../../demo/version_history.txt'),
            to: 'version_history.txt',
        }]),
        new CopyWebpackPlugin([{
            from: '../../ozone-*/*/doc/**',
            to: 'packages/[1]/[2]/[3]',
            test: /(ozone-.*)\/(.*)\/doc\/(.*)$/,
        }]),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./node_modules/clappr/package.json').version),
            PLAIN_HTML5_ONLY: false
        }),
        new Clean(['dist']),
    ],
    mode: "development",
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        overlay: true,
        port: 9000,
        https: true,
        setup: setupServerMockup,
    }
};
