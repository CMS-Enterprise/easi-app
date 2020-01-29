import React, { useEffect, useState } from 'react';
import { withAuth } from '@okta/okta-react';
import axios from 'axios';

import useAuth from 'hooks/useAuth';
import Header from 'components/Header';

type HomeProps = {
  auth: any;
};

const Home = ({ auth }: HomeProps) => {
  const [isAuthenticated] = useAuth(auth);
  const [name, setName] = useState('');
  const getEmailAddress = async (): Promise<void> => {
    const accessToken = await auth.getAccessToken();
    await axios
      .get('http://localhost:8080', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => {
        return res.data;
      })
      .then(data => {
        setName(data.SystemOwners[0]);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  // Notably, we need deps to be nil if we'd like to use this hook to
  // effectively be ComponentDidMount

  useEffect(() => {
    getEmailAddress();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Header />
      <div className="grid-container">
        <h1>Home</h1>
        <h3>{`A user is ${isAuthenticated ? '' : 'NOT'} authenticated`}</h3>
        <h3>Here is an email address fetched from the server</h3>
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default withAuth(Home);
