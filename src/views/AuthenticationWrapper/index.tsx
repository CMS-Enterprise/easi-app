import React from 'react';
import { useHistory } from 'react-router-dom';
import { Security } from '@okta/okta-react';

import { isLocalEnvironment } from 'utils/local';

import DevSecurity from './DevSecurity';

type ParentComponentProps = {
  children: React.ReactNode;
};

const AuthenticationWrapper = ({ children }: ParentComponentProps) => {
  const history = useHistory();

  const handleAuthRequiredRedirect = () => {
    history.push('/signin');
  };
  return isLocalEnvironment() ? (
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
