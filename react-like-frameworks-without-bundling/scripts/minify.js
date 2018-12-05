const bluebird = require("bluebird");
const terser = require("terser");
const dependencyTree = require("dependency-tree");
const slash = require("slash");

const rewriteImport = require("babel-plugin-import-redirect").default;
const dynamicImportSyntaxPlugin = require("@babel/plugin-syntax-dynamic-import")
  .default;

const path = require("path");
const crypto = require("crypto");

const { getUniqueFileHash, paths } = require("./utils");

const transformFile = bluebird.promisify(require("@babel/core").transformFile);
const readFile = bluebird.promisify(require("fs").readFile);
const writeFile = bluebird.promisify(require("fs").writeFile);
const glob = bluebird.promisify(require("glob"));

const outputPath = path.join(paths.build, "js");

require("mkdirp").sync(outputPath);

function minify(code) {
  const { code: minCode, error } = terser.minify(code);

  if (error) {
    throw new Error(error);
  }

  return minCode;
}

const filepathToHash = {};

function md5base64(str) {
  return crypto
    .createHash("md5")
    .update(str)
    .digest("base64")
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '%');
}

async function generateHash(filePath) {
  const normalizedFilepath = path.resolve(filePath);
  const code = await readFile(normalizedFilepath, "utf8");

  if (!filepathToHash[normalizedFilepath]) {
    filepathToHash[normalizedFilepath] =
      getUniqueFileHash(md5base64(code), normalizedFilepath) + ".js";
  }

  return filepathToHash[normalizedFilepath];
}

function toRelModulePath(relModuleFilePath) {
  const res = slash(relModuleFilePath);

  if (res.charAt(0) !== '.') {
    return `./${res}`;
  }

  return res;
}

function calcModulePathsToChildModuleMap() {
  const res = {};

  const doIt = (recursiveObj, baseModule) => {
    const modulePath = path.resolve(baseModule);

    if (res[modulePath]) {
      return;
    }

    res[modulePath] = [];

    for (const key in recursiveObj) {
      const relModule = toRelModulePath(path.relative(path.dirname(modulePath), key));
      res[modulePath].push({ relModule, path: path.resolve(key) });

      doIt(recursiveObj[key], key);
    }
  };

  const config = {
    filename: path.join(paths.polymerDefaultTemp, ".dev-src/index.js"),
    directory: path.join(paths.polymerDefaultTemp)
  };

  doIt(dependencyTree(config)[config.filename], config.filename);

  return res;
}

function getAliasMap(childModules) {
  const res = {};

  childModules.forEach(({ relModule, path }) => {
    res[relModule] = `/js/${filepathToHash[path]}`;
  });

  return res;
}

async function step() {
  const files = await glob(path.join(paths.polymerDefaultTemp, "**/*.js"), {
    dot: true
  });

  await Promise.all(files.map(generateHash));

  const modulePathsToChildModuleMap = calcModulePathsToChildModuleMap();

  await Promise.all(
    files.map(async filepath => {
      const normalizedPath = path.resolve(filepath);

      console.log(normalizedPath);
      console.log(modulePathsToChildModuleMap[normalizedPath])
      console.log(getAliasMap(modulePathsToChildModuleMap[normalizedPath]))

      const { code } = await transformFile(normalizedPath, {
        configFile: false,
        babelrc: false,
        plugins: [
          dynamicImportSyntaxPlugin,
          [
            rewriteImport,
            // use https://github.com/jean-smaug/babel-plugin-search-and-replace#readme
            { root: paths.build, redirect: getAliasMap(modulePathsToChildModuleMap[normalizedPath]) }
          ]
        ]
      });

      const minCode = await minify(code);

      console.log(`write ${filepath}`);

      return writeFile(
        path.join(outputPath, filepathToHash[normalizedPath]),
        minCode
      );
    })
  );
}

step();
