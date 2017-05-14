var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractSass = new ExtractTextPlugin({
  filename: "app.css",
  disable: process.env.NODE_ENV === "development"
});

var Html = require("html-webpack-plugin")

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    './src/index.js'
  ],
  output: {
    path: __dirname + "/build",
    filename: "app.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],

          fallback: "style-loader"
        })
      }
    ]
  },
  plugins: [
    new Html(),
    extractSass
  ]
}