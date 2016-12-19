const path = require('path');

module.exports = {
    entry: "./public/src/main.js",
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: "bundle.js",
        publicPath: ''
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};