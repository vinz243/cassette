import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import AppView from 'features/app/AppView';
import NotFoundView from 'components/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={AppView} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
