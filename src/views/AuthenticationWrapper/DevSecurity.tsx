import React, { useEffect, useState } from 'react';
import { AuthState, AuthTransaction, OktaAuth } from '@okta/okta-auth-js';
import { OktaContext } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';

const initialAuthState = {
  isAuthenticated: false
};

type ParentComponentProps = {
  children: React.ReactNode;
};

const DevSecurity = ({ children }: ParentComponentProps) => {
  const getStateFromLocalStorage = () => {
    if (window.localStorage[localAuthStorageKey]) {
      const state = JSON.parse(window.localStorage[localAuthStorageKey]);
      return {
        name: `User ${state.euaId}`,
        isAuthenticated: true,
        accessToken: {
          tokenType: '',
          userinfoUrl: '',
          expiresAt: Number.MIN_SAFE_INTEGER,
          accessToken: '',
          authorizeUrl: '',
          scopes: [],
          claims: {
            groups: state.jobCodes,
            sub: state.euaId
          }
        },
        idToken: {
          claims: {
            name: 'A Person',
            preferedUsername: state.euaId,
            sub: '0123456789abcde'
          }
        }
      };
    }
    return initialAuthState;
  };

  const [authState, setAuthState] = useState<AuthState>(
    getStateFromLocalStorage
  );
  const oktaAuth = new OktaAuth({
    // to appease the OktaAuth constructor
    issuer: 'https://fakewebsite.pqr',
    tokenManager: {
      autoRenew: false
    }
  });
  oktaAuth.signInWithCredentials = (): Promise<AuthTransaction> => {
    setAuthState(getStateFromLocalStorage);
    return new Promise(() => {});
  };
  oktaAuth.signOut = (): Promise<void> => {
    window.localStorage.removeItem(localAuthStorageKey);
    window.location.href = '/';
    return new Promise(() => {});
  };
  oktaAuth.getUser = () => {
    return Promise.resolve({
      name: authState.idToken?.claims?.name || '',
      sub: authState.accessToken?.claims?.sub || ''
    });
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
