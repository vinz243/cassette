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

export const Artist = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'artist',
    fields: ['name', 'genre'],
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
    legacySupport(state)
  );
}

export const findOne = findOneFactory(Artist);

export const findOrCreate = findOrCreateFactory(Artist);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(Artist, 'artist');
