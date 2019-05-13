const webpack = require('webpack');
const env = require('./env');

const MiniCSS = require('mini-css-extract-plugin');
const Clean = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const definePlugin = new webpack.DefinePlugin({
    __DEVELOPMENT__: JSON.stringify(env.__DEVELOPMENT__),
    __DEBUG__:       JSON.stringify(env.__DEBUG__),
    __BUILD__:       JSON.stringify(env.__BUILD__),
    __VERSION__:     JSON.stringify(env.__VERSION__),
});

const cleanPluginTmp = new Clean(['.tmp'], {
    root: process.cwd()
});

const miniPluginCSS = new MiniCSS('assets/css/app.bundle.css');

const occurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

const providePluginJquery = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
});

const cssLint = new StyleLintPlugin({
    configFile: '.stylelintrc.yml',
    files: '**/*.scss',
    failOnError: false,
    quiet: false,
    syntax: 'scss',
});

let sitePlugins = [
    definePlugin,
    cleanPluginTmp,
    miniPluginCSS,
    occurrenceOrderPlugin,
    providePluginJquery,
    cssLint,
];

if (env.__BUILD__) {
    const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
    });

    const compressionPluginGzip = new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|json|ico|svg|eot|otf|ttf|woff)$/,
    });

    sitePlugins = [...sitePlugins, uglifyJsPlugin, compressionPluginGzip];
}

module.exports = {
    sitePlugins,
};
