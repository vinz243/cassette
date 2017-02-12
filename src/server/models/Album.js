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


export const Album = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'album',
    fields: ['name', 'year', 'artist'],
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
    manyToOne(state, 'artist')
  );
}


export const findOne = findOneFactory(Album);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(Album, 'album');
