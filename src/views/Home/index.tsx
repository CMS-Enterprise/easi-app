import React from 'react';
import { withAuth } from '@okta/okta-react';
import NavBar from 'components/shared/NavBar';
import useAuth from 'hooks/useAuth';

type HomeProps = {
  auth: any;
};

const Home = ({ auth }: HomeProps) => {
  const [isAuthenticated] = useAuth(auth);
  const handleLogout = () => {
    auth.logout('/');
  };

  return (
    <div>
      <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <h1>Home</h1>
      <h3>{`A user is ${isAuthenticated ? '' : 'NOT'} authenticated`}</h3>
    </div>
  );
};

export default withAuth(Home);
