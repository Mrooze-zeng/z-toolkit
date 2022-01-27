module.exports = class InjectHeadScriptPlugin {
  constructor({ scripts = [] } = {}) {
    this.scriptsSource = scripts;
  }
  createScript(s = "") {
    return {
      tagName: "script",
      closeTag: true,
      attributes: {
        type: "text/javascript",
        src: s,
      },
    };
  }
  appendAsset(compilation, data, cb) {
    data.head = data.head.concat(this.scriptsSource.map(this.createScript));
    cb(null, data);
  }
  apply(compiler) {
    compiler.hooks.make.tap(this.constructor.name, (compilation) => {
      if (
        compilation.hooks &&
        compilation.hooks.htmlWebpackPluginAlterAssetTags
      ) {
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
          this.constructor.name,
          (data, cb) => {
            this.appendAsset(compilation, data, cb);
          },
        );
      } else {
        compiler.plugin("compilation", (compilation) => {
          compilation.plugin(
            "html-webpack-plugin-alter-asset-tags",
            (data, cb) => {
              this.appendAsset(compilation, data, cb);
            },
          );
        });
      }
    });
  }
};
