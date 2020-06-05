import React from 'react';
import Header from 'components/Header';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';

const Login = () => {
  const { authService }: { authService: any } = useOktaAuth();

  return (
    <div>
      <Header />
      <main
        id="main-content"
        role="main"
        className="grid-container"
        tabIndex={-1}
      >
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
      </main>
    </div>
  );
};

export default Login;
