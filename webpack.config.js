/*
 * @Author: wjs 
 * @Date: 2019-03-29 07:52:46 
 * @Last Modified by: wjs
 * @Last Modified time: 2019-04-03 11:01:01
 */


var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// 环境变量, dev, (test), online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// webpack config
var config = {
    /* 
     * 【新增】：新增mode参数，webpack4中要指定模式，可以放在配置文件这里，也可以放在启动命令里，如--mode production
     */
    mode: 'dev' === WEBPACK_ENV ? 'development' : 'production',

    entry: {
        'app': ['./src/index.jsx']
    },
    externals: {
        '$': 'window.jQuery',
        'jquery': 'window.jQuery'
    },
    // path && publickPath
    output: {
        path: __dirname + '/dist/',
        publicPath: WEBPACK_ENV === 'online' ? '//s.marinatedegg.top:81/admin-fe/dist/' : '/dist/',
        filename: 'js/[name].js'
    },
    resolve: {
        alias: {
            node_modules: path.join(__dirname, '/node_modules'),
            lib: path.join(__dirname, '/src/lib'),
            util: path.join(__dirname, '/src/util'),
            component: path.join(__dirname, '/src/component'),
            service: path.join(__dirname, '/src/service'),
            page: path.join(__dirname, '/src/page'),
        }
    },
   
    module: {
        // noParse: [],
        rules: [
            /* 
             * 【改动】：css样式的加载方式变化
             */
            // css文件的处理
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            /* 
             * 【改动】：图片文件的加载方式变化，并和字体文件分开处理
             */
            // 图片的配置
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        /* 
                         * 【改动】：图片小于2kb的按base64打包
                         */
                        limit: 2048,
                        name: 'resource/[name].[ext]'
                    }
                }]
            },
            /* 
             * 【改动】：字体文件的加载方式变化
             */
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'resource/[name].[ext]'
                    }
                }]
            },

            {
                test: /\.string$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeAttributeQuotes: false
                    }
                }
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: "babel-loader",
                    // 上面的设置告诉npm本项目将使用babel，
                    //并且使用bable-preset-env规则进行转码，即实现对ES2015+语法进行转码。 
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", "@babel/preset-env"]
                    }
                }],
            },
        ]
    },
    /* 
     * 【新增】：webpack4里面移除了commonChunksPulgin插件，放在了config.optimization里面
     */
    optimization: {//优化项
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",//独立通用模块js
                    chunks: "all",
                    minChunks: 2
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({//js压缩打包
                cache: true,//缓冲
                parallel: true, //并发打包,一次打包多个
                sourceMap:true,//源码调试
            }),
            new OptimizeCSSAssetsPlugin()//优化css为压缩格式
        ]
    },

    plugins: [
        // 提出公共部分 
        /* new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'js/base.js'
        }), */

        // 单独处理css
        new ExtractTextPlugin('css/[name].css'),
        // html 加载
        new HtmlWebpackPlugin({
            filename: 'view/index.html',
            title: 'MMall 后台管理系统',
            template: './src/index.html',
            favicon: './favicon.ico',
            inject: true,
            hash: true,
            chunks: ['vendors', 'app'],
            chunksSortMode: 'dependency',
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
    ],
    devServer: {
        port: 8086,
        proxy: {
            '/manage': {
                target: 'http://admintest.happymmall.com',
                changeOrigin: true
            },
            '/user/logout.do': {
                target: 'http://admintest.happymmall.com',
                changeOrigin: true
            }
        }
    },
    performance: {
        hints: "warning", // 枚举
        maxAssetSize: 30000000, // 整数类型（以字节为单位）
        maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
        // 提供资源文件名的断言函数
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        
        }
    }
    
};


module.exports = config;



