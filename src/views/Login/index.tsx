import React from 'react';
import { useOktaAuth } from '@okta/okta-react';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';

const Login = () => {
  const { authService }: { authService: any } = useOktaAuth();

  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        <OktaSignInWidget
          onSuccess={response => {
            authService.getTokenManager().then((tokenManager: any) => {
              tokenManager.add('idToken', response);
              tokenManager.add('accessToken', response);
            });
          }}
          onError={() => {
            console.log('error');
          }}
        />
      </MainContent>
    </div>
  );
};

export default Login;
