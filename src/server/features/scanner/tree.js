const walkSync = require("walk-sync");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const config = require("../../config");

const dataDir = path.join(config.get('configPath'), '/fs/');
mkdirp.sync(dataDir);

const getFolderEntries = module.exports.getFolderEntries = (path) => {
   return walkSync.entries(path)
}

const getCachedEntries = module.exports.getCachedEntries = (id) => {
  let file = path.join(dataDir, `fstree-${id}.json`);
  return new Promise((resolve, reject) => {
    fs.exists(file, (exists) => {
      if (!exists) {
        return resolve([]);
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          resolve(JSON.parse(data).entries);
        } catch (err) {
          reject(err);
        }
      });
    })
  });
}

const writeCachedEntries = module.exports.writeCachedEntries = (id, entries) => {
  let file = path.join(dataDir, `fstree-${id}.json`);
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify({entries}), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
