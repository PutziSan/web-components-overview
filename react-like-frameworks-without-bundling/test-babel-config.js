const bluebird = require("bluebird");
const dynamicImportSyntaxPlugin = require("@babel/plugin-syntax-dynamic-import")
  .default;
const jsxSyntax = require("@babel/plugin-syntax-jsx").default;

const transformFile = bluebird.promisify(require("@babel/core").transformFile);

const path = require("path");

const customPlugin = require("./new-babel-plugin");

const realPlugin = require("./babel-plugin/new-babel-plugin-ts.js");

transformFile(path.join(__dirname, "src", "index.js"), {
  babelrc: false,
  configFile: false,
  plugins: [jsxSyntax, dynamicImportSyntaxPlugin, realPlugin]
});
