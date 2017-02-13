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

export const Library = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'library',
    fields: ['name', 'path'],
    functions: {},
    populated: {},
    props
  };
  return assignFunctions(
    state.functions,
    defaultFunctions(state),
    updateable(state),
    removeable(state),
    createable(state),
    databaseLoader(state),
    publicProps(state),
    legacySupport(state)
  );
}

export const findOne = findOneFactory(Library);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(Library, 'lîbrary');
