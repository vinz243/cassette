import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import toolbar, { NAME as toolbarName} from 'features/toolbar';
import sidebar, {NAME as sidebarName} from 'features/sidebar';
import library, {NAME as libraryName} from 'features/library';

export default combineReducers({
  routing,
  [toolbarName]: toolbar,
  [libraryName]: library,
  [sidebarName]: sidebar
});
