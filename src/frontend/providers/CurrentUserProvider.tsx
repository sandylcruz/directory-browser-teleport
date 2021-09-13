import * as React from 'react';
import { useContext, useState } from 'react';

import type { User } from '../../types';

interface CurrentUserContextValue {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const CurrentUserContext = React.createContext<CurrentUserContextValue>({
  currentUser: null,
  setCurrentUser: () => {
    return;
  },
});

const CurrentUserProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const user = window.currentUser || null;

    if (window.currentUser) {
      delete window.currentUser;
    }

    return user;
  });

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = (): CurrentUserContextValue =>
  useContext(CurrentUserContext);

export default CurrentUserProvider;
