import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SecureRoute, LoginCallback } from '@okta/okta-react';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import Home from 'views/Home';
import Login from 'views/Login';
import BusinessCase from 'views/BusinessCase';
import GRTSystemIntakeReview from 'views/GRTSystemIntakeReview';
import SystemIntake from 'views/SystemIntake';
import Sandbox from 'views/Sandbox';

import './index.scss';

type MainState = {};

type MainProps = {};

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<MainProps, MainState> {
  render() {
    return (
      <div>
        <div className="usa-overlay" />
        <BrowserRouter>
          <AuthenticationWrapper>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" exact component={Login} />
              <Route path="/sandbox" exact component={Sandbox} />
              {/* Subroutes should precede any parent routes or they will not be
              callable */}
              <SecureRoute path="/system/new" exact component={SystemIntake} />
              <SecureRoute
                path="/system/:systemId/grt-review"
                component={GRTSystemIntakeReview}
              />
              <SecureRoute path="/system/:systemId" component={SystemIntake} />
              {/* <SecureRoute
                path="/system/all"
                exact
                component={SystemProfiles}
              /> */}
              {/* <SecureRoute
                path="/system/:profileId"
                component={SystemProfile}
              /> */}
              <SecureRoute path="/business/new" component={BusinessCase} />
              <Route path="/implicit/callback" component={LoginCallback} />
            </Switch>
          </AuthenticationWrapper>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
