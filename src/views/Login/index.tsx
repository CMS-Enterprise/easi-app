import React from 'react';
import { withAuth } from '@okta/okta-react';
import OktaSignInWidget from 'components/shared/OktaSignInWidget';
import useAuth from 'hooks/useAuth';

type LoginProps = {
  auth: any;
};
const Login: React.FC<LoginProps> = ({ auth }: LoginProps) => {
  const [isAuthenticated, user] = useAuth(auth);
  console.log('isAuthenticated', isAuthenticated);
  console.log('user', user);
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

export default withAuth(Login);
