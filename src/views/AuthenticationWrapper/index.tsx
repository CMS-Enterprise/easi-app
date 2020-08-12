import React from 'react';
import { useHistory } from 'react-router-dom';
import { Security } from '@okta/okta-react';

type AuthenticationWrapperProps = {
  children: React.ReactNode;
};

const AuthenticationWrapper = ({ children }: AuthenticationWrapperProps) => {
  const history = useHistory();

  const handleAuthRequiredRedirect = () => {
    history.push('/signin');
  };

  return (
    <Security
      issuer={process.env.REACT_APP_OKTA_ISSUER}
      clientId={process.env.REACT_APP_OKTA_CLIENT_ID}
      redirectUri={process.env.REACT_APP_OKTA_REDIRECT_URI}
      onAuthRequired={handleAuthRequiredRedirect}
      responseType={['code']}
      pkce
    >
      {children}
    </Security>
  );
};

export default AuthenticationWrapper;
