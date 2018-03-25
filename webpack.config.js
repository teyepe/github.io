require('babel-polyfill');

var path = require('path');
var webpack = require('webpack');
var ExtractCSS = require('mini-css-extract-plugin');
var Modernizr = require('modernizr-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var embedFileSize = 250;

const definePlugin = new webpack.DefinePlugin({
    __DEVELOPMENT__: JSON.stringify(JSON.parse(process.env.BUILD_DEVELOPMENT || false)),
    __DEBUG__:       JSON.stringify(JSON.parse(process.env.BUILD_DEBUG || false)),
    __PRODUCTION__:  JSON.stringify(JSON.parse(process.env.BUILD_PRODUCTION || false))
});

const devServerEntry = [
    'webpack-hot-middleware/client?path=https://localhost:4567/__webpack_hmr&timeout=2000&overlay=false', // WebpackDevServer host and port
    'webpack/hot/only-dev-server' // "only" prevents reload on syntax errors
];

let babelPlugins = {
    'babelrc': false,
    'presets': [['es2015', { 'modules': false }], 'stage-0'],
    'plugins': [
        ['resolver', { 'resolveDirs': ['data', 'source'] }],
        ['transform-runtime', {
            'polyfill': true,
            'regenerator': true
        }]

    ]
};

module.exports = {
    devtool: 'source-map',
    entry: {
        app: [
            './source/assets/js/all.js',
            './source/assets/css/style.scss',
        ].concat(devServerEntry),
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
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, 'source/assets/css')
                ],
                // use: [                    
                //     ExtractCSS.loader,
                //     'css-loader'
                // ]
                use: [
                    ExtractCSS.loader,
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
                        loader: 'postcss-loader',
                        query: {
                            sourceMap: 'inline'
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        query: {
                            sourceMap: true,
                            silent: true,
                            root: process.cwd()
                        }
                    },
                    {
                        loader: 'sass-loader',
                        query: {
                            sourceMap: true,
                            sourceMapContents: true,
                            includePaths: [path.resolve(__dirname, './node_modules')],
                            precision: 8,
                            data: '$ENV: ' + 'DEVELOP' + ';'
                        }
                    }],
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
        // new ExtractCSS(),
        // new ExtractCSS('assets/css/style.css'),
        new ExtractCSS({
            fallback: 'style-loader',
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
    ],
    // resolve: {
    //     alias: ['node_modules']
    // },
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

console.log('----------pipa', path.resolve(__dirname, 'source/assets/css'));
