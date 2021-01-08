import React, { useEffect, useState } from 'react';
import { AuthTransaction, OktaAuth } from '@okta/okta-auth-js';
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
  const oktaAuth = new OktaAuth({
    // to appease the OktaAuth constructor
    issuer: 'https://fakewebsite.pqr',
    tokenManager: {
      autoRenew: false
    }
  });
  oktaAuth.signInWithCredentials = (): Promise<AuthTransaction> => {
    console.log('setting auth state');
    setAuthState(getStateFromLocalStorage);
    return new Promise(() => {});
  };
  oktaAuth.signOut = (): Promise<void> => {
    console.log('signing out');
    window.localStorage.removeItem(storageKey);
    window.location.href = '/';
    return new Promise(() => {});
  };
  oktaAuth.getUser = () => {
    return Promise.resolve({ name: authState.name, sub: '' });
  };
  oktaAuth.tokenManager.off = () => {};
  oktaAuth.tokenManager.on = () => {};

  useEffect(() => {
    setAuthState(getStateFromLocalStorage);
  }, []);

  return (
    <OktaContext.Provider
      value={{ oktaAuth, authState, _onAuthRequired: () => {} }}
    >
      {children}
    </OktaContext.Provider>
  );
};

export default DevSecurity;
