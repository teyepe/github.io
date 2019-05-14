require('babel-polyfill');

const path = require('path');
const MiniCSS = require('mini-css-extract-plugin');
const { sitePlugins } = require('./config/plugins');
var embedFileSize = 1000;

const babelLoader = {
    test: /.*\.js$/,
    exclude: /(node_modules|\.tmp|vendor)/,
    loader: 'babel-loader',
};

const siteConfig = {

    entry: {
        app: [
            './source/assets/css/style.scss',
            './source/assets/js/app.js',
        ],
        vendor: [
            'babel-polyfill',
            'jquery',
        ],
    },

    resolve: {
        modules: [
            path.join(__dirname, 'source', 'assets', 'js'),
            'node_modules',
        ],
        alias: {
            modernizr$: path.resolve(__dirname, '.modernizrrc')
        },
    },

    output: {
        path: `${__dirname}/.tmp/dist`,
        filename: 'assets/js/[name].bundle.js',
        hotUpdateChunkFilename: '[id].[contenthash].hot-update.js',
        hotUpdateMainFilename: '[contenthash].hot-update.json',
        publicPath: process.env.NODE_ENV === 'production' ? '../../' : '../',
    },

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        port: 4567,
    },

    module: {
        rules: [
            babelLoader,
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$',
                }],
            },
            {
                test: /\.modernizrrc.js$/,
                use: [ 'modernizr-loader' ]
            },
            {
                test: /\.modernizrrc(\.json)?$/,
                use: [ 'modernizr-loader', 'json-loader' ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                include: [
                    path.resolve(__dirname, 'source/assets/css'),
                    path.resolve(__dirname, 'node_modules')
                ],
                use: [
                    MiniCSS.loader,
                    {
                        loader: 'css-loader',
                        query: {
                            sourceMap: true,
                            sourceComments: true,
                            importLoaders: 1,
                            localIdentName: '[path]-[name]--[local]__[hash:base64:5]',
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
                    }
                ],
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
                test: /\.(woff|woff2|eot|ttf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/type/[name].[ext]'
                        }
                    },
                ]
            }
        ],
    },

    node: {
        console: true,
    },

    plugins: sitePlugins,
};
module.exports = [siteConfig];
