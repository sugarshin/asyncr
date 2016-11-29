const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')

const PORT = process.env.PORT || 8080
const production = process.env.NODE_ENV === 'production'

const baseHtmlWebpackPluginConfig = { template: 'example/templates/index.pug' }
if (production) {
  baseHtmlWebpackPluginConfig.minify = { collapseWhitespace: true }
}
const htmlWebpackPluginConfigIndex = Object.assign({}, baseHtmlWebpackPluginConfig, {
  title: `${pkg.name} | ${pkg.description}`,
  body: `<h1>Top</h1>
<p>This is a top</p>
<ul>
  <li><a href="/page1.html" data-asyncr='{"a":"1","b":"2"}'>Page 1</a></li>
</ul>`,
})
const htmlWebpackPluginConfigPage1 = Object.assign({}, baseHtmlWebpackPluginConfig, {
  filename: 'page1.html',
  title: `Page 1 | ${pkg.name} | ${pkg.description}`,
  body: `<h1>Page 1</h1>
<p>This is a page 1</p>
<ul>
  <li><a href="/" data-asyncr="TOP">Top</a></li>
</ul>`,
});

const entry = [
  'whatwg-fetch',
  'babel-polyfill',
  './example/index.js',
]

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new HtmlWebpackPlugin(htmlWebpackPluginConfigIndex),
  new HtmlWebpackPlugin(htmlWebpackPluginConfigPage1),
]

if (production) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, screw_ie8: true } })
  )
} else {
  entry.unshift(
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server'
  )
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = {
  plugins,
  entry,
  cache: !production,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { minimize: true } }],
      },
      { test: /\.pug$/, loader: 'pug-loader' },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './example',
    hot: true,
    publicPath: '/',
    host: '0.0.0.0',
    port: PORT,
  },
}
