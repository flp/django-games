// require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,
    entry: {
        lobby: './assets/js/lobby/index',
        ttt: './assets/js/games/ttt_index',
        reversi: './assets/js/games/reversi_index',
        chess: './assets/js/games/chess_index',
    },

    output: {
        path: path.resolve('./assets/bundles/'),
        filename: '[name]-[hash].js',
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react']
                }
            }
        ]
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx']
    }
}
