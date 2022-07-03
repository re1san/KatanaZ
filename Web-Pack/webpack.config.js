const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    mode: "production",
    entry: {
        Bundle: path.resolve(__dirname, "Src/index.js")
    },
    output: {
        path: path.resolve(__dirname, "Dist"),
        filename: "[name][contenthash].js",
        clean: true, // Removess the previous Bundle[Hash]
        assetModuleFilename: '[name][ext]'
    },
    // devtool: "source-map",
    // Live Reloading => On Updating something creates new 'Dist' 
    devServer: {
        static: {
            directory: path.resolve(__dirname, "Dist")
        },
        port: 3000,
        open: true, // When we 'npm run dev' Browser opens automatically
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource"
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "KatanaZ",
            filename: "index.html",
            template: "Src/zTemplate.html"
        }),
        // new BundleAnalyzerPlugin(),
    ]
}