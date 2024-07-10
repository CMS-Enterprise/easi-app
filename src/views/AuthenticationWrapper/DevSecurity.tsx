import React, { useEffect, useState } from 'react';
import {
  AuthnTransaction,
  CustomUserClaims,
  OktaAuth,
  UserClaims
} from '@okta/okta-auth-js';
import { OktaContext } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';

const initialAuthState = {
  isAuthenticated: false,
  name: '',
  euaId: '',
  groups: [] as string[]
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
  oktaAuth.signInWithCredentials = (): Promise<AuthnTransaction> => {
    setAuthState(getStateFromLocalStorage);
    return new Promise(() => {});
  };
  oktaAuth.signOut = (): Promise<boolean> => {
    window.localStorage.removeItem(localAuthStorageKey);
    window.location.href = '/';
    return Promise.resolve(true);
  };
  oktaAuth.getUser = <T extends CustomUserClaims>(): Promise<UserClaims<T>> => {
    const mockUser: UserClaims = {
      name: authState.name,
      sub: '',
      euaId: authState.euaId,
      groups: authState.groups
    };

    return Promise.resolve(mockUser as UserClaims<T>);
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
