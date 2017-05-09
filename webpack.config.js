var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Html = require("html-webpack-plugin")

module.exports = {
  entry: [
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
      }
    ]
  },
  plugins: [
    new Html(),
    new ExtractTextPlugin("app.css")
  ]
}