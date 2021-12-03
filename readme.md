# z-toolkit-v1

## vue-services

- createPackage
- fetchPackage
- updateTemplate

## webpack

- create-packages-exports-plugin

options:

```javascript
targetFolder = String; // default path.join(process.cwd(), "packages/")
packageToExport = Array; // default []
reg = RegExp; // default /index\.js$/
prettierOptions = Config; // default {}
```

- disable-eslint-check-plugin

options:

```javascript
words: String; // default "/* eslint-disable */\n",
regExp: RegExp; // default /\.js$/
```

- extract-readme-plugin

options

```javascript
reg: RegExp; // default /@readme/gim,
packageNameReg: RegExp; // default  /\/packages\/([\w|-]+)\/src$/i,
```

- split-package-plugin

options

```javascript
Null;
```

- vue-use-packages-loader
  options

```javascript
Null;
```

- vue-use-packages-plugin
  options

```javascript
target: String; //default ""
placeholder: String; //default "/* use-package-loader-inject */"
prettierOptions: Object; //default {}
```
