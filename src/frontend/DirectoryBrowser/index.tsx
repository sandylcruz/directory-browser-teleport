import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Directory from './Directory';

const DirectoryBrowser = React.memo(() => (
  <Switch>
    <Route path="/" component={Directory} />
    <Route path="/folders" component={Directory} />
  </Switch>
));

export default DirectoryBrowser;
