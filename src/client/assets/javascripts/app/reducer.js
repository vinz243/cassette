import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import toolbar, { NAME as toolbarName} from 'features/toolbar';

import library, {NAME as libraryName} from 'features/library';
console.log(toolbarName);
export default combineReducers({
  routing,
  [toolbarName]: toolbar,
  [libraryName]: library
});
