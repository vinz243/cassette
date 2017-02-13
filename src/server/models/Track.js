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

export const Track = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'track',
    fields: ['name', 'album', 'artist', 'duration', 'trackNumber'],
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
  );
}

export const findOne = findOneFactory(Track);
export const findOrCreate = findOrCreateFactory(Track);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(Track, 'track');
