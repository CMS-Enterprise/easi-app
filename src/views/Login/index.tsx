import React from 'react';
import Header from 'components/Header';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';

const Login = () => {
  return (
    <div>
      <Header />
      <OktaSignInWidget
        onSuccess={() => {}}
        onError={() => {
          console.log('error');
        }}
      />
    </div>
  );
};

export default Login;
