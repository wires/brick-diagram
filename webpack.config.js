const path = require('path')

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: path.join(__dirname, 'app.js'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: "bundle.js",
        library: 'App',
        libraryTarget: 'var',
    }
}
