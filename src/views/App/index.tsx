import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';

import AuthenticationWrapper from 'views/AuthenticationWrapper';
import BusinessCase from 'views/BusinessCase';
import GovernanceOverview from 'views/GovernanceOverview';
import GovernanceTaskList from 'views/GovernanceTaskList';
import GrtBusinessCaseReview from 'views/GrtBusinessCaseReview';
import GrtSystemIntakeReview from 'views/GrtSystemIntakeReview';
import Home from 'views/Home';
import Login from 'views/Login';
import Sandbox from 'views/Sandbox';
import SystemIntake from 'views/SystemIntake';
import TimeOutWrapper from 'views/TimeOutWrapper';
import PrivacyPolicy from 'views/PrivacyPolicy/index';
import Cookies from 'views/Cookies/index';
import AccessibilityStatement from 'views/AccessibilityStatement';

import './index.scss';

type MainState = {};

type MainProps = {};

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<MainProps, MainState> {
  handleSkipNav = () => {
    const mainContent = document.getElementById('main-content')!;
    if (mainContent) {
      mainContent.focus();
    }
  };

  render() {
    return (
      <div>
        <div className="usa-overlay" />
        <button type="button" className="skipnav" onClick={this.handleSkipNav}>
          Skip to main content
        </button>
        <BrowserRouter>
          <AuthenticationWrapper>
            <TimeOutWrapper>
              <Switch>
                <Route path="/" exact component={Home} />
                <Redirect exact from="/login" to="/signin" />
                <Route path="/signin" exact component={Login} />
                {process.env.NODE_ENV === 'development' && (
                  <Route path="/sandbox" exact component={Sandbox} />
                )}
                <Route
                  path="/governance-overview"
                  exact
                  component={GovernanceOverview}
                />
                <Route
                  path="/privacy-policy"
                  exact
                  component={PrivacyPolicy}
                />
                <Route
                  path="/cookies"
                  exact
                  component={Cookies}
                />
                <Route
                  path="/accessibility-statement"
                  exact
                  component={AccessibilityStatement}
                />
                {['local', 'dev', 'impl'].includes(
                  process.env.REACT_APP_APP_ENV || ''
                ) && (
                  <SecureRoute
                    path="/governance-task-list/:systemId"
                    exact
                    component={GovernanceTaskList}
                  />
                )}
                <SecureRoute
                  exact
                  path="/system/:systemId/grt-review"
                  render={({ component }: any) => component()}
                  component={GrtSystemIntakeReview}
                />
                <Redirect
                  exact
                  from="/system/:systemId"
                  to="/system/:systemId/contact-details"
                />
                <SecureRoute
                  path="/system/:systemId/:formPage"
                  render={({ component }: any) => component()}
                  component={SystemIntake}
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
                <Redirect
                  exact
                  from="/business/:businessCaseId"
                  to="/business/:businessCaseId/general-project-info"
                />
                <SecureRoute
                  path="/business/:businessCaseId/:formPage"
                  render={({ component }: any) => component()}
                  component={BusinessCase}
                />
                <Route path="/implicit/callback" component={LoginCallback} />
              </Switch>
            </TimeOutWrapper>
          </AuthenticationWrapper>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
