const presetDir = "vue-cli-presets/vue2-component-repo-preset.git/generator";

const path = require("path");
const os = require("os");
const fs = require("fs");
const ejs = require("ejs");
const { warn } = require("@vue/cli-shared-utils/lib/logger");
const crypto = require("crypto");

const tplDir = path.resolve(os.tmpdir(), presetDir);

const remotePreset =
  "direct:https://github.com/Mrooze-zeng/vue2-component-repo-preset.git";

const loadRemotePreset = require("@vue/cli/lib/util/loadRemotePreset");

const calculateMd5 = function (buffer = "") {
  const hash = crypto.createHash("md5");
  hash.update(buffer, "utf-8");
  return hash.digest("hex");
};

const replaceFile = function (tpls = {}, source = "", projectName = "") {
  for (const file in tpls) {
    if (file.startsWith(".") && !file.startsWith(".github")) {
      continue;
    }
    const target = path.resolve(process.cwd(), file);
    const sourceBuf = fs.readFileSync(path.resolve(source, tpls[file]));
    let sourceMd5 = calculateMd5(sourceBuf);
    let targetMd5 = "";

    if (fs.existsSync(target)) {
      targetMd5 = calculateMd5(fs.readFileSync(target));
    }

    if (sourceMd5 != targetMd5) {
      fs.writeFileSync(
        target,
        ejs.render(sourceBuf.toString(), { projectName: projectName }),
      );

      warn(`替换 ${file}`);
    }
  }
};

const getTpls = async function (optons) {
  const globby = await import("globby");
  const baseDir = path.resolve(tplDir, "./template");

  let _files = await globby.globby(["**/*"], {
    cwd: baseDir,
    dot: true,
  });
  let source = {};

  let isExist = fs.existsSync(path.resolve(process.cwd(), ".github"));

  if (!isExist) {
    _files = _files.filter((f) => f != ".github/workflows/deploy.yml");
  }

  _files.forEach((f) => {
    source[f] = `template/${f}`;
  });
  return source;
};

const service = {
  name: "updateTpl",
  options: {
    description: "更新当前模版",
    usage: "vue-cli-service updateTpl",
  },
  action: async function (api) {
    const tpls = await getTpls();
    const projectName = api.service.pkg.name || "";
    let presetDir;
    const { plugins } = await loadRemotePreset(remotePreset, true);
    for (const plugin in plugins) {
      if (
        plugin.includes("vue-cli-presets/vue2-component-repo-preset.git") &&
        plugins[plugin]._isPreset
      ) {
        presetDir = path.resolve(plugin, "generator");
      }
    }
    replaceFile(tpls, presetDir, projectName);
  },
};

module.exports = function (api, options) {
  api.registerCommand(service.name, service.options, function (...args) {
    return service.action.call(null, api, ...args);
  });
};
