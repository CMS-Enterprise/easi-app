import React from 'react';
import { useDispatch } from 'react-redux';
import { useOktaAuth } from '@okta/okta-react';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import { updateLastRenewAt } from 'reducers/authReducer';

const Login = () => {
  const { authService }: { authService: any } = useOktaAuth();
  const dispatch = useDispatch();

  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        <OktaSignInWidget
          onSuccess={response => {
            authService.getTokenManager().then((tokenManager: any) => {
              tokenManager.add('idToken', response.token.idToken);
              tokenManager.add('accessToken', response.token.accessToken);
              dispatch(updateLastRenewAt);
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
