module.exports = {
  // @readme hello world
  CreatePackagesExportsPlugin: require("./webpack/create-packages-exports-plugin"),
  DisableEslintCheckPlugin: require("./webpack/disable-eslint-check-plugin"),
  VueUsePackagesLoader: require("./webpack/vue-use-packages-loader"),
  VueUsePackagesPlugin: require("./webpack/vue-use-packages-plugin"),
  ExtractReadmePlugin: require("./webpack/extract-readme-plugin"),
  SplitPackagePlugin: require("./webpack/split-package-plugin"),
  createPackage: require("./vue-services/createPackage"),
  fetchPackage: require("./vue-services/fetchPackage"),
  updateTemplate: require("./vue-services/updateTemplate"),
};
