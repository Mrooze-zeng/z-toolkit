const fastDeepEqual = require("fast-deep-equal");
const path = require("path");
const CreatePackagesExportsPlugin = require("./create-packages-exports-plugin");
const pkg = require(path.resolve(process.cwd(), "package.json"));

module.exports = class SplitPackage {
  currentEntry = {};
  newEntries = {};
  constructor() {
    this.createNewEntries();
  }
  createNewEntries() {
    const s = new CreatePackagesExportsPlugin();
    for (const [name] of s.readDir()) {
      if (this.getPackageToExport().includes(name)) {
        this.newEntries[name] = `./packages/${name}`;
      }
    }
  }
  getPackageToExport(packageToExport = []) {
    return packageToExport.concat(pkg.packageToExport || []);
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
