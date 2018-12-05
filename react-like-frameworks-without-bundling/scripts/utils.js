const path = require("path");

const hashToFilepath = {};

function getUniqueFileHash(hash, filepath) {
  let start = 0;
  let check = hash.substr(start, 8);
  let abort = false;

  const len = hash.length;

  while (hashToFilepath[check] && !abort) {
    if (hashToFilepath[check] === filepath) {
      break;
    }

    start = start + 8;

    if (start + 8 > len) {
      abort = true;
    } else {
      check = hash.substr(start, 8);
    }
  }

  if (abort) {
    let counter = 0;
    check = hash.substr(0, 8);

    while (hashToFilepath[`${check}_${counter}`]) {
      counter++;
    }

    check = `${check}_${counter}`;
  }

  hashToFilepath[check] = filepath;

  return check;
}

module.exports = {
  getUniqueFileHash,
  paths: {
    root: path.resolve(__dirname, '..'),
    build: path.resolve(__dirname, '..', 'build'),
    polymerDefaultTemp: path.resolve(__dirname, '..', 'build', 'default'),
  }
};

