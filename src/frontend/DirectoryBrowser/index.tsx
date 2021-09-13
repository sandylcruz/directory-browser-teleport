import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import AllDirectories from './AllDirectories';
import Directory from './Directory';

const DirectoryBrowser = React.memo(() => (
  <Switch>
    <Route path="/" exact component={AllDirectories} />
    <Route path="/folders/:id" component={Directory} />
  </Switch>
));

export default DirectoryBrowser;
