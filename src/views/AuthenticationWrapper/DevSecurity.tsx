import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const [authState, setAuthState] = useState(initialAuthState);
  const history = useHistory();

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
    if (window.localStorage[storageKey]) {
      const state = JSON.parse(window.localStorage[storageKey]);
      setAuthState(as => {
        return {
          ...as,
          name: `User ${state.euaId}`,
          isAuthenticated: true,
          euaId: state.euaId,
          groups: Object.keys(state.jobCodes).filter(key => state.jobCodes[key])
        };
      });
      history.push('/signin');
    }
  }, []);

  return (
    <OktaContext.Provider value={{ authService, authState }}>
      {children}
    </OktaContext.Provider>
  );
};

export default DevSecurity;
