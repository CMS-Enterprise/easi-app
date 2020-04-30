import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { withAuth } from '@okta/okta-react';

import useAuth from 'hooks/useAuth';
import Header from 'components/Header';
import Button from 'components/shared/Button';
import { fetchSystemIntakes } from 'types/routines';

type HomeProps = {
  auth: any;
};

const Home = ({ auth }: HomeProps) => {
  const [isAuthenticated] = useAuth(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSystemIntakes());
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Welcome to EASi</h1>
        <p>
          You can use EASi to go through the set of steps needed for Lifecycle
          ID approval by the Governance Review Board (GRB).
        </p>

        {isAuthenticated ? (
          <Button type="button">Start now</Button>
        ) : (
          <Button type="button">Sign in to start</Button>
        )}
      </div>
    </div>
  );
};

export default withAuth(Home);
