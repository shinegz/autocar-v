const path = require("path");
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const {
    override,
    addDecoratorsLegacy,
    disableEsLint,
    addWebpackModuleRule,
    addWebpackResolve,
    addWebpackPlugin
  } = require("customize-cra");
  
module.exports = {
    webpack: override(
      // enable legacy decorators babel plugin
      addDecoratorsLegacy(),
      // disable eslint in webpack
      disableEsLint(),
      addWebpackModuleRule({
        test: /\.ya?ml$/,
        use: [
          { loader: "json-loader" },
          { loader: "yaml-loader" }
        ],
        // 在模块中直接导入yaml文件，得到yaml文件所对应的plain JavaScript object
      }),
       // 从模块中能够导入webWorker
      addWebpackModuleRule({
        test: /\.worker\.(c|m)?js$/i, 
        use: [{
            loader: 'worker-loader',
        },{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        }
        // 模块中使用了es6特性，需要使用babel-loader
        ]
      }),
      // addWebpackModuleRule({
      //   test: require.resolve("three/examples/js/controls/OrbitControls.js"),
      //   use: ["imports-loader?THREE=three"]
      // }),
      addWebpackResolve({
        // Files with the following extensions here can be "import"
        // without the extension.
        //
        // Needs ".json" and ".scss" for Grommet.
        extensions: [".worker.js",
                     ".jsx", ".js",
                     ".json",
                     ".scss", ".css",
                     ".png", ".svg"],
        alias: {
            store: path.resolve(__dirname, "src/store"),
            styles: path.resolve(__dirname, "src/styles"),
            components: path.resolve(__dirname, "src/components"),
            utils: path.resolve(__dirname, "src/utils"),
            renderer: path.resolve(__dirname, "src/renderer"),
            assets: path.resolve(__dirname, "src/assets"),
            proto_bundle: path.resolve(__dirname, "src/proto_bundle"),
            fonts: path.resolve(__dirname, "src/fonts")
        }
      }),
      // addWebpackPlugin(new CopyWebpackPlugin(
      //   {
      //       from: '../node_modules/three/examples/fonts',
      //       to: 'fonts',
      //   }
      // ))
    )
};