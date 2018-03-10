require('babel-polyfill');

var path = require('path');
var webpack = require('webpack');
var ExtractCSS = require("mini-css-extract-plugin");
var Modernizr = require('modernizr-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var embedFileSize = 250;

const definePlugin = new webpack.DefinePlugin({
    __DEVELOPMENT__: JSON.stringify(JSON.parse(process.env.BUILD_DEVELOPMENT || false)),
    __DEBUG__:       JSON.stringify(JSON.parse(process.env.BUILD_DEBUG || false)),
    __PRODUCTION__:  JSON.stringify(JSON.parse(process.env.BUILD_PRODUCTION || false))
});

let babelPlugins = {
    'babelrc': false,
    'presets': [['es2015', { 'modules': false }], 'stage-0'],
    'plugins': [
        ['resolver', { 'resolveDirs': ['data', 'source'] }],
        ['transform-runtime', {
            "polyfill": true,
            "regenerator": true
        }]

    ]
};

const cssLoaders = [
    {
        loader: 'css-loader',
        query: {
            sourceMap: true,
            sourceComments: true,
            importLoaders: 1,
            localIdentName: '[path]-[name]--[local]__[hash:base64:5]'
        }
    },
    {
        loader: 'postcss-loader'
    },
    // {
    //     loader: 'resolve-url-loader',
    //     query: {
    //         sourceMap: true,
    //         silent: true,
    //         root: process.cwd()
    //     }
    // },
    // {
    //     loader: 'sass-loader',
    //     query: {
    //         sourceMap: true,
    //         sourceMapContents: true,
    //         includePaths: [path.resolve(__dirname, './node_modules')]
    //     }
    // }
];

module.exports = {
    devtool: 'source-map',
    entry: {
        all: [path.resolve(__dirname, './source/assets/js/all.js')],
        style: [path.resolve(__dirname, './source/assets/css/style.css')],
    },
    output: {
        path: path.resolve(__dirname + '/.tmp/dist'),
        filename: 'assets/js/[name].bundle.js',
    },
    module: {
        rules: [
            { 
                test: require.resolve('jquery'), 
                use: {
                    loader: 'expose-loader',
                    options: '$'
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules|\.tmp/,
                use: {
                    loader: 'babel-loader',
                    query: babelPlugins
                },
            },
            { 
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.css$/,
                use: [
                    ExtractCSS.loader,
                    'css-loader'
                ]
            },

            {
                test: /\.svg/,
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=image/svg+xml'
            },
            { 
                test: /\.png$/,
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=image/png'
            },
            { 
                test: /\.jpg/,
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=image/jpeg'
            },
            { 
                test: /\.gif/,
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=image/gif'
            },
            { 
                test: /\.[ot]tf(\?\S*)?$/, 
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=application/octet-stream' + '&name=fonts/[name].[ext]' 
            },
            { 
                test: /\.eot(\?\S*)?$/, 
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=application/vnd.ms-fontobject' + '&name=fonts/[name].[ext]' 
            },
            { 
                test: /\.woff(\?\S*)?$/, 
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=application/font-woff' + '&name=fonts/[name].[ext]' 
            },
            { 
                test: /\.woff2(\?\S*)?$/, 
                use: 'url-loader?limit=' + embedFileSize + '&mimetype=application/font-woff2' + '&name=fonts/[name].[ext]' 
            }
        ]
    },
    plugins: [
        definePlugin,
        new Modernizr(),
        new Clean(['.tmp']),
        new ExtractCSS(),
        // new ExtractCSS('assets/css/style.css'),
        // new ExtractCSS({
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
    ],
    resolveLoader: {
        modules: [
            path.resolve('/source/assets/js'), 
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.css', '.json']
    },
    // resolve all relative paths from the project root folder
    context: path.resolve(__dirname, '.')
}
