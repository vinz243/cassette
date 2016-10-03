import datastore from 'nedb-promise';
import conf from '../../../config.js';
import mkdirp from 'mkdirp';

mkdirp.sync(conf.rootDir + '/data/')

console.log('  Using dir ' + conf.rootDir);
let db = new datastore(conf.rootDir + '/data/config.db');
db.loadDatabase();


const model = {

  getValue: async (key) => {
    const res = await db.find({key: key});
    return {
      key: res[0].key,
      value: res[0].value
    };
  },

  get: async (key, defVal) => {
    return (await model.get(key)).value || defVal;
  },

  /*
   Inserts a value to database. Return complex object for API
   */
  insertValue: async (key, value) => {
    let doc = {
      key: key,
      value: value
    };
    try {
      if((await db.find({key: key})).length > 0) {
        return {
          success: false,
          status: 400,
          data: {
            error_message: 'A config entry already exists with this key',
            error_code: 'EDUPENTRY'
          }
        };
      }
      await db.insert(doc);
      return {
        status: 201,
        success: true,
        data: {}
      }
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        success: false,
        data: {
          error_code: 'EINTERNAL',
          error_message: 'Internal error. Try again later'
        }
      }
    }

  }
}
export default model;
