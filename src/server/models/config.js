const datastore = require("nedb-promise");
const config = require("../config.js");
const mkdirp = require("mkdirp");
const path = require("path");

let dataDir = path.join(config.get('configPath'), '/data/');
mkdirp.sync(dataDir);


let db = new datastore(path.join(dataDir, '/config.db'));
db.loadDatabase();

const model = {

  getValue: async (key) => {

    const res = await db.find({
      key: key
    });
    if(res.length == 0) {
      return {};
    }
    return {
      key: res[0].key,
      value: res[0].value
    };
  },

  get: async (key, defVal) => {
    return (await model.getValue(key)).value || defVal;
  },
  updateValue: async (key, value) => {
    // console.log(key);
    let found = await db.find({key: key});

    // console.log('found', found);
    if(found.length == 0) {
      return {
        success: false,
        status: 404,
        data: {
          error_message: 'Cannot find key',
          error_code: 'ENOTFOUND'
        }
      };
    }

    await db.update({
      key: key
    }, {
      key: key,
      value: value
    });

    return {
      status: 200,
      success: true,
      data: {}
    }

  },
  /*
   Inserts a value to database. Return complex object for API
   */
  insertValue: async (key, value) => {
    let doc = {
      key: key,
      value: value
    };
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

  }
}
module.exports = model;
