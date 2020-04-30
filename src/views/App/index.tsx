import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import Home from 'views/Home';
import Login from 'views/Login';
import BusinessCase from 'views/BusinessCase';
import GRTSystemIntakeReview from 'views/GRTSystemIntakeReview';
import GrtBusinessCaseReview from 'views/GrtBusinessCaseReview';
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
              <SecureRoute path="/system/new" component={SystemIntake} />
              <SecureRoute
                path="/system/:systemId/grt-review"
                component={GRTSystemIntakeReview}
              />
              {/* <SecureRoute
                path="/system/all"
                exact
                component={SystemProfiles}
              /> */}
              {/* <SecureRoute
                path="/system/:profileId"
                component={SystemProfile}
              /> */}
              <SecureRoute
                path="/business/:businessCaseId/grt-review"
                component={GrtBusinessCaseReview}
              />
              <SecureRoute path="/business/new" component={BusinessCase} />
              <Route path="/implicit/callback" component={ImplicitCallback} />
            </Switch>
          </AuthenticationWrapper>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
