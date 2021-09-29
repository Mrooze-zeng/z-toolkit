const CreatePackagesExportsPlugin = require("./webpack/create-packages-exports-plugin");
const DisableEslintCheckPlugin = require("./webpack/disable-eslint-check-plugin");
const VueUsePackagesLoader = require("./webpack/vue-use-packages-loader");
const VueUsePackagesPlugin = require("./webpack/vue-use-packages-plugin");

module.exports.webpack = {
  CreatePackagesExportsPlugin,
  DisableEslintCheckPlugin,
  VueUsePackagesLoader,
  VueUsePackagesPlugin,
};
