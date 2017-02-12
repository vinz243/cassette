import {
  assignFunctions,
  defaultFunctions,
  manyToOne,
  legacySupport,
  updateable,
  createable,
  databaseLoader,
  publicProps,
  findOneFactory,
  findFactory
} from './Model';

export const Track = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'track',
    fields: ['name', 'path', 'album', 'artist', 'duration'],
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
    legacySupport(state),
    manyToOne(state, 'album'),
    manyToOne(state, 'artist'),
  );
}

export const findOne = findOneFactory(Track);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(Track, 'track');
