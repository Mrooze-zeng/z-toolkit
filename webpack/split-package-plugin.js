const fastDeepEqual = require("fast-deep-equal");
const CreatePackagesExportsPlugin = require("./create-packages-exports-plugin");

module.exports = class SplitPackage {
  currentEntry = {};
  newEntries = {};
  constructor() {
    this.createNewEntries();
  }
  createNewEntries() {
    const s = new CreatePackagesExportsPlugin();
    for (const [name] of s.readDir()) {
      this.newEntries[name] = `./packages/${name}`;
    }
  }
  apply(compiler) {
    compiler.hooks.entryOption.tap(this.constructor.name, (context, entry) => {
      if (!fastDeepEqual(entry, this.currentEntry)) {
        compiler.options.entry = {
          ...entry,
          ...this.newEntries,
        };
        this.currentEntry = compiler.options.entry;
        compiler.hooks.entryOption.call(context, compiler.options.entry);
      }
    });
  }
};
