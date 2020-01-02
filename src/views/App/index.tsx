import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import UsGovBanner from 'components/UsGovBanner';
import Home from 'views/Home';
import Login from 'views/Login';
import SuperSecret from 'views/SuperSecret';
import SystemProfile from 'views/SystemProfile';
import SystemProfiles from 'views/SystemProfiles';

import './index.scss';

type MainState = {
  name: string;
};

type MainProps = {};

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
      <div className="easi-app">
        <div className="usa-overlay" />
        <UsGovBanner />
        <BrowserRouter>
          <AuthenticationWrapper>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" exact component={Login} />
              <SecureRoute path="/protected" exact component={SuperSecret} />
              <SecureRoute
                path="/system/all"
                exact
                component={SystemProfiles}
              />
              <SecureRoute
                path="/system/:profileId"
                component={SystemProfile}
              />
              <Route path="/implicit/callback" component={ImplicitCallback} />
            </Switch>
          </AuthenticationWrapper>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
