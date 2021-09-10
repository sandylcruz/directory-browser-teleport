import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useCurrentUser } from '../providers/CurrentUserProvider';

interface AuthRouteProps {
  component: React.ComponentType;
  path: string;
}

const AuthRoute = React.memo<AuthRouteProps>(({ component, path }) => {
  const { currentUser } = useCurrentUser();

  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return <Route path={path} component={component} />;
});

export default AuthRoute;
