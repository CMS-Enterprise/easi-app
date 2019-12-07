import React from 'react';
import { withAuth } from '@okta/okta-react';

import useAuth from 'hooks/useAuth';
import Header from 'components/Header';

type HomeProps = {
  auth: any;
};

type HomeState = {
  name: string;
};

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      name: 'Isaac'
    };
  }

  componentDidMount(): void {
    this.getEmailAddress();
  }

  async getEmailAddress() {
    const { auth } = this.props;
    const accessToken = await auth.getAccessToken();
    /* eslint-disable no-console */
    const response = await fetch('http://localhost:8080', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ name: data.SystemOwners[0] });
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
    console.log(response);
  }

  render() {
    const { auth } = this.props;
    const { name } = this.state;
    const authenticated = auth.isAuthenticated();
    return (
      <div>
        <h1>Home</h1>
        <h3>{`A user is ${authenticated ? '' : 'NOT'} authenticated`}</h3>
        <h3>Here is an email address fetched from the server</h3>
        <h3>{name}</h3>
      </div>
    );
  }
}

export default withAuth(Home);
