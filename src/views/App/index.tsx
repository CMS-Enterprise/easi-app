import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Home from 'views/Home';
import Login from 'views/Login';
import SuperSecret from 'views/SuperSecret';
import './index.scss';

type MainState = {
  name: string;
};

type MainProps = {};

// This can do anything. It doesn't have to redirect
// It can be a pop up modal, alert message, etc.
function onAuthRequired({ history }: any): void {
  history.push('/login');
}

class App extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      name: 'Isaac'
    };
  }

  componentDidMount(): void {
    fetch('http://localhost:8080')
      .then(res => res.json())
      .then(data => {
        this.setState({ name: data.SystemOwners[0] });
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
  }

  render() {
    const { name } = this.state;
    console.log(name);
    return (
      <div>
        <BrowserRouter>
          <Security
            issuer={`${process.env.REACT_APP_OKTA_ISSUER}/oauth2/default`}
            clientId={process.env.REACT_APP_OKTA_CLIENT_ID}
            redirectUri={process.env.REACT_APP_OKTA_REDIRECT_URI}
            onAuthRequired={onAuthRequired}
            responseType={['code']}
            pkce
          >
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <SecureRoute path="/protected" exact component={SuperSecret} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </Security>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
