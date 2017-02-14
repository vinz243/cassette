import walkSync from 'walk-sync';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import config from '../../config';

const dataDir = path.join(config.get('configPath'), '/fs/');
mkdirp.sync(dataDir);

export const getFolderEntries = (path) => {
   return walkSync.entries(path)
}

export const getCachedEntries = (id) => {
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

export const writeCachedEntries = (id, entries) => {
  let file = path.join(dataDir, `fstree-${id}.json`);
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify({entries}), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
