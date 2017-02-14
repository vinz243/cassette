import child_process from 'child_process';
import chalk from 'chalk';
import {findById as findLibraryById} from './Library';
import {
  assignFunctions,
  defaultFunctions,
  manyToOne,
  legacySupport,
  updateable,
  createable,
  removeable,
  databaseLoader,
  publicProps,
  findOneFactory,
  findFactory,
  findOrCreateFactory
} from './Model';
import {
  mainStory
} from 'storyboard';

// track.data.trackNumber = (t.trackNumber + '').match(/^\d+/)[0] - 0;
export const processResult = async(res) => {
  if (res.status === 'done') {

  }
}

export const Scan = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'scan',
    fields: ['statusCode', 'statusMessage'],
    functions: {},
    populated: {},
    props
  };
  return assignFunctions(
    state.functions,
    defaultFunctions(state),
    updateable(state),
    createable(state),
    databaseLoader(state),
    publicProps(state),
    legacySupport(state)
  );
}

export const findOne = findOneFactory(Scan);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(Scan, 'scan');
