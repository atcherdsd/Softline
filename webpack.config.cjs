const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext][query]',
    },
    resolve: {
        extensions: ['.js'],
    },
    devServer: {
        port: 3000,
        open: true,
        hot: false,
        liveReload: true,
        historyApiFallback: true
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            favicon: './src/assets/favicon.ico'
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(__dirname, 'dist/assets'),
                noErrorOnMissing: true
            },
            { 
                from: path.resolve(__dirname, 'src/_redirects'), 
                to: path.resolve(__dirname, 'dist/'), 
                noErrorOnMissing: true 
            }],
        }),
        new ESLintPlugin({
            extensions: ['js'],
            overrideConfigFile: path.resolve(__dirname, 'eslint.config.mjs'),
        }),
        ...(isDevMode
            ? []
            : [new MiniCssExtractPlugin({ 
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css'
            })])
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                namedExport: false,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                            },
                        },
                    },
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif|ico|mp4)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    experiments: {
        topLevelAwait: true,
    },
};
