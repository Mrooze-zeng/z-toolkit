const { RawSource } = require("webpack-sources");

module.exports = class ExtractReadmePlugin {
  constructor(
    options = {
      reg: /@readme/gim,
      packageNameReg: /\/packages\/([\w|-]+)\/src$/i,
    },
  ) {
    this.options = options;
    this.allExtractedComments = new Map();
  }
  apply(compiler) {
    const pluginName = this.constructor.name;
    compiler.hooks.compilation.tap(
      pluginName,
      (compilation, { normalModuleFactory }) => {
        normalModuleFactory.hooks.parser
          .for("javascript/auto")
          .tap(pluginName, (parser) => {
            parser.hooks.program.tap(pluginName, (ast, comments) => {
              comments.forEach((comment) => {
                if (this.options.reg.test(comment.value)) {
                  const packageName = this.getPackageName(
                    parser.state.current.context,
                  );
                  packageName &&
                    (compilation.assets[`${packageName}.md`] = new RawSource(
                      this.getExtractComments(packageName, comment.value),
                    ));
                }
              });
            });
          });
      },
    );
  }
  getPackageName(path = "") {
    const match = path.match(this.options.packageNameReg);
    return (match && match[1]) || "";
  }
  getExtractComments(packageName = "", comment = "") {
    this.allExtractedComments.set(
      packageName,
      (this.allExtractedComments.has(packageName)
        ? this.allExtractedComments.get(packageName)
        : "") + comment.replace(this.options.reg, "").replace(/^ ?\*/gm, ""),
    );
    return this.allExtractedComments.get(packageName) || "";
  }
};
