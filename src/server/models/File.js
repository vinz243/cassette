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
  findFactory
} from './Model';

export const File = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'file',
    fields: [
      'size',
      'path',
      'album',
      'track',
      'format',
      'artist',
      'bitrate',
      'duration',
    ],
    functions: {},
    populated: {},
    props
  };
  return assignFunctions(
    state.functions,
    defaultFunctions(state),
    updateable(state),
    createable(state),
    removeable(state),
    databaseLoader(state),
    publicProps(state),
    legacySupport(state),
    manyToOne(state, 'album'),
    manyToOne(state, 'artist'),
    manyToOne(state, 'track'),
  );
}

export const findOne = findOneFactory(File);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(File, 'file');
