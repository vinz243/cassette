import datastore from 'nedb-promise';
import conf from '../../../config';
import mkdirp from 'mkdirp';


mkdirp(conf.baseDir + '/data/')
const db = new datastore(config.baseDir + '/data/config.db');

const config = {
  get: async (key) => {
    const res = await db.find({key: key});
    return {
      key: res[0].key,
      value: res[0].value
    };
  },
  getValue: async (key, defVal) => {
    return config.get(key).value || defVal;
  },
  insert: async (key, value) => {
    doc = {
      key: key,
      value: value
    };
    return db.insert(doc);
  }
}
