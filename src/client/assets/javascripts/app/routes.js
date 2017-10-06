import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import AppView from 'features/app/AppView';
import {default as LibraryView,
        ArtistsView,
        AlbumsView} from 'features/library/components/LibraryView';
import StoreView from 'features/store/components/StoreView';
import SettingsView from 'features/settings/components/SettingsView';
import ConfigurationView from 'features/configuration/components/ConfigurationView';
import LandingPage from 'features/land/components/LandingPage';
import NotFoundView from 'components/NotFound';

export default (
  <Route path="/">
    <IndexRoute component={LandingPage} />
    <Route path="/configure" component={ConfigurationView} />
    <Route path="/app" component={AppView}>
      <Route path="/app/library" component={ArtistsView} />
      <Route path="/app/library/artists" component={ArtistsView} />
      <Route path="/app/library/artists/:id/albums" component={AlbumsView} />
      <Route path="/app/library/artists/:id/tracks" component={LibraryView} />
      <Route path="/app/library/albums" component={AlbumsView} />
      <Route path="/app/library/albums/:albumId/tracks" component={LibraryView} />
      <Route path="/app/library/tracks" component={LibraryView} />
      <Route path="/app/store" component={StoreView}  />
      <Route path="/app/settings" component={SettingsView}  />
    </Route>
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
