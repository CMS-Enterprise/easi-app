import React from 'react';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';

const Login = () => {
  return (
    <div>
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
