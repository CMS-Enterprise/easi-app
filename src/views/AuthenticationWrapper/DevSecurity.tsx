import React, { useEffect, useState } from 'react';
import { AuthTransaction, OktaAuth } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';

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

  const oktaAuth2 = new OktaAuth({});
  oktaAuth2.signInWithCredentials = (): Promise<AuthTransaction> => {
    setAuthState(getStateFromLocalStorage);
    return new Promise(() => {});
  };
  oktaAuth2.signOut = (): Promise<void> => {
    window.localStorage.removeItem(storageKey);
    window.location.href = '/';
    return new Promise(() => {});
  };
  oktaAuth2.getUser = () => {
    return Promise.resolve({ name: authState.name, sub: '' });
  };

  useEffect(() => {
    setAuthState(getStateFromLocalStorage);
  }, []);

  return <Security oktaAuth={oktaAuth2}>{children}</Security>;
};

export default DevSecurity;
