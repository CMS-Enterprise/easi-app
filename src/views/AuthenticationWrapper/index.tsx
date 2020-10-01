import React from 'react';
import { useHistory } from 'react-router-dom';
import { Security } from '@okta/okta-react';

type ParentCompoentProps = {
  children: React.ReactNode;
};

const DevSecurity = ({ children }: ParentCompoentProps) => {
  return <>{children}</>;
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
