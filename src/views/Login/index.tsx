import React from 'react';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';

const Login = () => {
  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        <OktaSignInWidget onSuccess={() => {}} onError={() => {}} />
      </MainContent>
    </div>
  );
};

export default Login;
