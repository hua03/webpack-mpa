const path = require('path')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // context: path.resolve(__dirname, '../'),
  entry: [
    './src/js/index.js',
    "./src/_scss/main.scss"
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [{
        test: /\.html$/,
        exclude: /node_modules/,
        use: [{loader: 'html-loader',options: { minimize: false}}]
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {loader: "css-loader",options: {minimize: true}},
            {loader: "postcss-loader"},
            {loader: "sass-loader"}
          ]
        })
      },{
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{loader: "babel-loader?cacheDirectory",options: {presets: ["env"]}}]
      },{
        test: /\.(png|jpe?g|svg|gif)$/i,
        use: [
          {loader: 'url-loader',options: {name: "./images/[name].[ext]",limit: 100}}, 
          {loader: "img-loader"}
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new ExtractTextPlugin({
      filename: "./css/main.css"
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: Infinity,
    // }),
    // new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
}


if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new cleanWebpackPlugin(['dist']),
    new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          },
          sourceMap: true
    }),
  ]);
} else {
  module.exports.devtool = 'eval';
  // 热加载需要添加的入口
  module.exports.entry = (module.exports.entry || []).concat([
    'webpack/hot/dev-server',
    // 'webpack-dev-server/client?http://0.0.0.0:8080',
  ]);
  // 热加载服务器配置
  module.exports.devServer = {
    // 监听的文件夹
    contentBase: './dist',
    // inline: true,
    // progress: true,
    // hot: true,
    compress: true,
    open: true,
    host: '0.0.0.0',
    port: 8080,
    // noInfo: true,
  }
}
