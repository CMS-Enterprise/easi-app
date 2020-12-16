import React, { useEffect, useState } from 'react';
import { OktaContext } from '@okta/okta-react';

const storageKey = 'dev-user-config';

const initialAuthState = {
  isAuthenticated: false,
  isPending: false,
  name: '',
  euaId: '',
  groups: [] as string[]
};

type ParentComponentProps = {
  children: React.ReactNode;
};

const DevSecurity = ({ children }: ParentComponentProps) => {
  const getStateFromLocalStorage = () => {
    if (window.localStorage[storageKey]) {
      const state = JSON.parse(window.localStorage[storageKey]);
      return {
        isPending: false,
        name: `User ${state.euaId}`,
        isAuthenticated: true,
        euaId: state.euaId,
        groups: state.jobCodes
      };
    }
    return initialAuthState;
  };

  const [authState, setAuthState] = useState(getStateFromLocalStorage);

  const authService = {
    login: () => {},
    logout: () => {
      window.localStorage.removeItem(storageKey);
      window.location.href = '/';
    },
    getUser: () => {
      return Promise.resolve({ name: authState.name });
    },
    getTokenManager: () => {
      return {
        off: () => {},
        on: () => {},
        renew: () => {}
      };
    }
  };

  useEffect(() => {
    setAuthState(getStateFromLocalStorage);
  }, []);

  return (
    <OktaContext.Provider value={{ authService, authState }}>
      {children}
    </OktaContext.Provider>
  );
};

export default DevSecurity;
