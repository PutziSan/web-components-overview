/* eslint-disable import/no-extraneous-dependencies */
const typescriptPreset = require("@babel/preset-typescript").default;
const classPropertiesPlugin = require("@babel/plugin-proposal-class-properties")
  .default;
const objectSpreadTransformation = require("@babel/plugin-proposal-object-rest-spread")
  .default;
const dynamicImportSyntaxPlugin = require("@babel/plugin-syntax-dynamic-import")
  .default;
const transformReactJsx = require('@babel/plugin-transform-react-jsx').default;
const dynamicImportForNodePlugin = require("babel-plugin-dynamic-import-node");
const moduleResolver = require("babel-plugin-module-resolver").default;

module.exports = api => {
  api.cache(() => process.env.NODE_ENV);

  const isDev = process.env.NODE_ENV === "development";
  const isTest = process.env.NODE_ENV === "test";
  const isProd = process.env.NODE_ENV === "production";

  return {
    presets: [
      typescriptPreset
    ].filter(Boolean),
    plugins: [
      [classPropertiesPlugin, { loose: true }],
      [objectSpreadTransformation, { useBuiltIns: true }],
      isTest ? dynamicImportForNodePlugin : dynamicImportSyntaxPlugin,
      [moduleResolver, { alias: { react: "preact" } }],
      transformReactJsx, // do not set pragme cause moduleResolver sets React to the preact-package
    ].filter(Boolean)
  };
};
