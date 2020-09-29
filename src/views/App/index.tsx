import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';
import { FlagProvider, useFlags } from 'contexts/flagContext';

import AccessibilityStatement from 'views/AccessibilityStatement';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import BusinessCase from 'views/BusinessCase';
import Cookies from 'views/Cookies';
import GovernanceOverview from 'views/GovernanceOverview';
import GovernanceReviewTeam from 'views/GovernanceReviewTeam';
import GovernanceTaskList from 'views/GovernanceTaskList';
import GrtBusinessCaseReview from 'views/GrtBusinessCaseReview';
import GrtSystemIntakeReview from 'views/GrtSystemIntakeReview';
import Home from 'views/Home';
import Login from 'views/Login';
import NotFound from 'views/NotFound';
import PrepareForGRB from 'views/PrepareForGRB';
import PrepareForGRT from 'views/PrepareForGRT';
import PrivacyPolicy from 'views/PrivacyPolicy';
import Sandbox from 'views/Sandbox';
import SystemIntake from 'views/SystemIntake';
import TermsAndConditions from 'views/TermsAndConditions';
import TimeOutWrapper from 'views/TimeOutWrapper';

import './index.scss';

type MainState = {};

type MainProps = {};

// eslint-disable-next-line react/prefer-stateless-function
const App = () => {
  const handleSkipNav = () => {
    const mainContent = document.getElementById('main-content')!;
    if (mainContent) {
      mainContent.focus();
    }
  };

  const flags = useFlags();

  return (
    <>
      <FlagProvider>
        <div className="usa-overlay" />
        <button type="button" className="skipnav" onClick={handleSkipNav}>
          Skip to main content
        </button>
        <BrowserRouter>
          <AuthenticationWrapper>
            <TimeOutWrapper>
              <Switch>
                <Route path="/" exact component={Home} />
                <Redirect exact from="/login" to="/signin" />
                <Route path="/signin" exact component={Login} />
                <Route
                  path="/governance-overview"
                  exact
                  component={GovernanceOverview}
                />

                {flags.sandbox && (
                  <Route path="/sandbox" exact component={Sandbox} />
                )}

                {flags.taskListLite && (
                  <SecureRoute
                    path="/governance-task-list/:systemId"
                    exact
                    component={GovernanceTaskList}
                  />
                )}

                <SecureRoute
                  path="/governance-review-team/:systemId/:activePage"
                  component={GovernanceReviewTeam}
                />
                <SecureRoute
                  exact
                  path="/governance-task-list/:systemId/prepare-for-grt"
                  component={PrepareForGRT}
                />
                <SecureRoute
                  exact
                  path="/governance-task-list/:systemId/prepare-for-grb"
                  component={PrepareForGRB}
                />
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

                <Route path="/privacy-policy" exact component={PrivacyPolicy} />
                <Route path="/cookies" exact component={Cookies} />
                <Route
                  path="/accessibility-statement"
                  exact
                  component={AccessibilityStatement}
                />
                <Route
                  exact
                  path="/terms-and-conditions"
                  component={TermsAndConditions}
                />
                <Route path="*" component={NotFound} />
              </Switch>
            </TimeOutWrapper>
          </AuthenticationWrapper>
        </BrowserRouter>
      </FlagProvider>
    </>
  );
};

export default App;
