const { warn, done } = require("@vue/cli-shared-utils/lib/logger");
const path = require("path");
const fs = require("fs");
const CreatePackagesExports = require("../webpack/create-packages-exports-plugin");

const tpl = (name = "", componentName = "") => `
<template>
  <div class="${name}"></div>
</template>

<script>
export default {
  name: "${componentName}",
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.${name} {
}
</style>
`;

const service = {
  name: "createPackage",
  options: {
    description: "新生成一个package",
    usage: "vue-cli-service createPackage --name [name]",
  },
  action: function ({ name }) {
    if (typeof name === "string" && name) {
      const target = path.resolve(process.cwd(), `packages/${name}/src`);
      let isExist = fs.existsSync(target);
      console.log(target, process.cwd());
      if (isExist) {
        return warn(`${name} 这个package已经存在!`);
      }
      fs.mkdirSync(target, { recursive: true });
      const createPackagesExports = new CreatePackagesExports();
      fs.writeFileSync(
        `${target}/index.vue`,
        createPackagesExports.formatCode(
          tpl(name, createPackagesExports.parserComponentName(name)),
          { parser: "vue" },
        ),
      );
      createPackagesExports.run();
      done(`新建${name} package`);
      return;
    }
    warn("error");
  },
};

module.exports = function (api, options) {
  api.registerCommand(service.name, service.options, service.action);
};
