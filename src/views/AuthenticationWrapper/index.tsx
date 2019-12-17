import React from 'react';
import { Security } from '@okta/okta-react';

// This can do anything. It doesn't have to redirect
// It can be a pop up modal, alert message, etc.
function onAuthRequired({ history }: any): void {
  history.push('/login');
}

type AuthenticationWrapperProps = {
  children: React.ReactNode;
};

const AuthenticationWrapper = ({ children }: AuthenticationWrapperProps) => {
  return (
    <Security
      issuer={process.env.REACT_APP_OKTA_ISSUER}
      clientId={process.env.REACT_APP_OKTA_CLIENT_ID}
      redirectUri={process.env.REACT_APP_OKTA_REDIRECT_URI}
      onAuthRequired={onAuthRequired}
      responseType={['code']}
      pkce
    >
      {children}
    </Security>
  );
};

export default AuthenticationWrapper;
