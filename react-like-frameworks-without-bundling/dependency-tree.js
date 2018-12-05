const dependencyTree = require("dependency-tree");
const slash = require("slash");
const crypto = require("crypto");
const bluebird = require("bluebird");
const moduleResolver = require("babel-plugin-module-resolver").default;

const path = require("path");

const glob = bluebird.promisify(require("glob"));
const transformFile = bluebird.promisify(require("@babel/core").transformFile);
const readFile = bluebird.promisify(require("fs").readFile);

const config = {
  filename: path.join(__dirname, "build/default/.dev-src/index.js"),
  directory: path.join(__dirname, "build/default"),
};

const tree = dependencyTree(config);

console.log(tree);

// const list = dependencyTree.toList(config);

// console.log(list);

const res = {};

function recursiveTreeBla(obj, basePath) {
  const res = {};

  for (const key in obj) {
    const newKey = slash(path.relative(path.dirname(basePath), key));
    res[newKey] = {
      path: key,
      children: recursiveTreeBla(obj[key], key)
    };
  }

  return res;
}

console.log(recursiveTreeBla(tree, config.directory));
console.log(stuff());
