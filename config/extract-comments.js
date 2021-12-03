#!/usr/bin/env node

const babel = require("@babel/core");
const path = require("path");
const fs = require("fs");

class ExtractComments {
  constructor(options = { entry: "index.js", reg: /@readme/gim }) {
    this.options = options;
    this.commentsStore = new Map();
  }
  readAsAst(filename = "") {
    const { ast } = babel.transformFileSync(
      path.resolve(process.cwd(), filename),
      {
        configFile: false,
        ast: true,
        plugins: [this.getFileImported.bind(this)],
      },
    );
    ast.comments.length && this.filterComments(filename, ast.comments);
    return ast;
  }
  filterComments(filename = "", comments = []) {
    comments.forEach((c) => {
      if (this.options.reg.test(c.value)) {
        this.commentsStore.set(
          filename,
          (this.commentsStore.has(filename)
            ? this.commentsStore.get(filename)
            : "") +
            c.value.replace(this.options.reg, "").replace(/^\s*\*/gm, ""),
        );
      }
    });
  }
  getFileImported() {
    const self = this;
    return {
      visitor: {
        CallExpression(p, state) {
          if (
            p.node.callee.name === "require" &&
            p.node.arguments[0] &&
            p.node.arguments[0].value
          ) {
            const filename = p.node.arguments[0].value;
            const [isExist, filenameWithExt] = self.checkExist(filename);
            isExist && self.readAsAst(filenameWithExt);
          }
        },
      },
    };
  }
  checkIsRelativePath(filename = "") {
    return filename.startsWith("./") && !path.extname(filename).trim();
  }
  checkExist(filename = "") {
    filename = this.checkIsRelativePath(filename) ? filename + ".js" : filename;
    return [fs.existsSync(path.resolve(process.cwd(), filename)), filename];
  }
  createReadme() {
    let content = "";
    this.readAsAst(this.options.entry);
    for (let [filename, comment] of this.commentsStore) {
      const { name } = path.parse(filename);
      content += `## ${name} \n ${comment}\n`;
    }
    fs.writeFileSync(
      path.resolve(process.cwd(), "_readme.md"),
      content.replace(/^\s*/gm, ""),
    );
  }
}

const extractComment = new ExtractComments();

extractComment.createReadme();
