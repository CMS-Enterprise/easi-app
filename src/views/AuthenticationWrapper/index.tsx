import React, { ReactEventHandler, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Security, OktaContext } from '@okta/okta-react';
import { string } from 'yup';

type ParentCompoentProps = {
  children: React.ReactNode;
};

const initialAuthState = {
  isAuthenticated: false,
  isPending: false,
  getTokenManager: () => {
    return {
      off: () => {},
      on: () => {},
      renew: () => {}
    };
  },
  logout: (path: string) => {}
};

const DevSecurity = ({ children }: ParentCompoentProps) => {
  useEffect(() => {}, []);
  const [authService] = useState({
    login: () => {}
  });
  const [authState, setAuthState] = useState(initialAuthState);

  const handleSubmit: ReactEventHandler = event => {
    event.preventDefault();
    setAuthState({
      ...authState,
      isAuthenticated: true
    });
  };
  return authState.isAuthenticated ? (
    <OktaContext.Provider value={{ authService, authState }}>
      {children}
    </OktaContext.Provider>
  ) : (
    <form onSubmit={handleSubmit}>
      <p>Please login to continue</p>
      <input type="text" maxLength={5} minLength={5} required />
      <button type="submit">Login</button>
    </form>
  );
};

const AuthenticationWrapper = ({ children }: ParentCompoentProps) => {
  const history = useHistory();

  const handleAuthRequiredRedirect = () => {
    history.push('/signin');
  };

  const devMode = true;

  return devMode ? (
    <DevSecurity>{children}</DevSecurity>
  ) : (
    <Security
      issuer={process.env.REACT_APP_OKTA_ISSUER}
      clientId={process.env.REACT_APP_OKTA_CLIENT_ID}
      redirectUri={process.env.REACT_APP_OKTA_REDIRECT_URI}
      onAuthRequired={handleAuthRequiredRedirect}
      responseType={['code']}
      tokenManager={{
        expireEarlySeconds: 0,
        autoRenew: false
      }}
      pkce
    >
      {children}
    </Security>
  );
};

export default AuthenticationWrapper;
