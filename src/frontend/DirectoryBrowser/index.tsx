import * as React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import Directory from './Directory';

const DirectoryBrowser: React.FC = () => (
  <Switch>
    <Route path="/folders/:directoryPath*" component={Directory} />
    <Redirect to="/folders" />
  </Switch>
);

export default DirectoryBrowser;
