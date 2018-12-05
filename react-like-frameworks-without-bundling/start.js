const bluebird = require("bluebird");
const chokidar = require("chokidar");

const transformFile = bluebird.promisify(require("@babel/core").transformFile);
const mkdirp = bluebird.promisify(require("mkdirp"));
const writeFile = bluebird.promisify(require("fs").writeFile);
const copyFile = bluebird.promisify(require("fs").copyFile);

const path = require("path");

const srcPath = path.join(__dirname, "src");
const devSrcPath = path.join(__dirname, ".dev-src");

const babelExts = [".js", ".jsx", ".ts", ".tsx"];

function processFile(filePath) {
  const ext = path.extname(filePath);

  const relativePath = path.relative(srcPath, filePath);
  const baseName = path.basename(filePath, ext);

  const newDir = path.dirname(path.join(devSrcPath, relativePath));

  if (babelExts.every(checkExt => checkExt !== ext)) {
    return mkdirp(newDir).then(() => {
      console.log(`copy to ${path.join(newDir, `${baseName}${ext}`)}`);
      return copyFile(filePath, path.join(newDir, `${baseName}${ext}`));
    });
  }

  return Promise.all([
    transformFile(filePath, {
      cwd: __dirname,
      configFile: path.join(__dirname, "custom.babel.config.js")
    }),
    mkdirp(newDir)
  ])
    .then(([{ code }]) => code)
    .then(code => {
      return process.env.NODE_ENV === "production" ? terser.minify(code) : code;
    })
    .then(code => {
      return writeFile(path.join(newDir, `${baseName}.js`), code);
    });
}

chokidar
  .watch(srcPath)
  .on("add", processFile)
  .on("change", processFile)
  .on("unlink", path => console.log(`File ${path} has been removed`));
