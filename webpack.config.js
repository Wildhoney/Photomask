var path = require('path');

module.exports = {
    entry: './src/core.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'photomask.js',
        library: 'Photomask',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            }
        ]
    }
};
