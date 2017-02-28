module.exports = {
    context: __dirname,
    entry: "./foo.js",
    output: {
        filename: "bundle.js",
        path: "/"
    },
    module: {
        rules: [{
            test: /\.(svg|html)$/,
            use: {
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            }
        }]
    }
};
