import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import AppView from 'features/app/AppView';
import LibraryView from 'features/library/components/LibraryView';
import StoreView from 'features/store/components/StoreView';
import NotFoundView from 'components/NotFound';

export default (
  <Route path="/">
    <Route path="/app" component={AppView}>
      <Route path="/app/library" component={LibraryView} />
      <Route path="/app/store" component={StoreView}  />
    </Route>
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
