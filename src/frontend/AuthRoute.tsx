import * as React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import type { LocationDescriptorObject } from 'history';

import { useCurrentUser } from './providers/CurrentUserProvider';
import type { LocationState } from './types';

interface AuthRouteProps {
  component: React.ComponentType;
  exact?: boolean;
  path: string;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ component, exact, path }) => {
  const { currentUser } = useCurrentUser();
  const location = useLocation();

  const to: LocationDescriptorObject<LocationState> = {
    pathname: '/login',
    state: {
      referrer: location.pathname,
    },
  };

  if (currentUser === null) {
    return <Redirect to={to} />;
  }

  return <Route path={path} component={component} exact={exact} />;
};

export default AuthRoute;
