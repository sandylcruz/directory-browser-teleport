import * as React from 'react';
import { useLayoutEffect } from 'react';
import { useHistory, Route } from 'react-router-dom';

import { useCurrentUser } from '../providers/CurrentUserProvider';

interface AuthRouteProps {
  component: React.ComponentType;
  path: string;
}

const AuthRoute = React.memo<AuthRouteProps>(({ component, path }) => {
  const { currentUser } = useCurrentUser();
  const history = useHistory();

  useLayoutEffect(() => {
    if (currentUser === null) {
      history.push('/login');
    }
  }, [currentUser, history]);

  return <Route path={path} component={component} />;
});

export default AuthRoute;
