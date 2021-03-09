import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import Accessibility from 'views/Accessibility';
import AccessibilityStatement from 'views/AccessibilityStatement';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import BusinessCase from 'views/BusinessCase';
import Cookies from 'views/Cookies';
import DocumentPrototype from 'views/DocumentPrototype';
import FlagsWrapper from 'views/FlagsWrapper';
import GovernanceOverview from 'views/GovernanceOverview';
import GovernanceReviewTeam from 'views/GovernanceReviewTeam';
import GovernanceTaskList from 'views/GovernanceTaskList';
import RequestDecision from 'views/GovernanceTaskList/RequestDecision';
import Home from 'views/Home';
import Login from 'views/Login';
import NotFound from 'views/NotFound';
import PrepareForGRB from 'views/PrepareForGRB';
import PrepareForGRT from 'views/PrepareForGRT';
import PrivacyPolicy from 'views/PrivacyPolicy';
import RequestTypeForm from 'views/RequestTypeForm';
import Sandbox from 'views/Sandbox';
import SystemIntake from 'views/SystemIntake';
import TermsAndConditions from 'views/TermsAndConditions';
import TimeOutWrapper from 'views/TimeOutWrapper';
import UserInfoWrapper from 'views/UserInfoWrapper';

import './index.scss';

const AppRoutes = () => {
  const flags = useFlags();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  return (
    <Switch>
      <Route path="/508" component={Accessibility} />

      <Route path="/" exact component={Home} />
      <Redirect exact from="/login" to="/signin" />
      <Route path="/signin" exact component={Login} />
      <Route path="/governance-overview" exact component={GovernanceOverview} />

      {flags.sandbox && <Route path="/sandbox" exact component={Sandbox} />}
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/prepare-for-grt"
        render={({ component }: any) => component()}
        component={PrepareForGRT}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/prepare-for-grb"
        render={({ component }: any) => component()}
        component={PrepareForGRB}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/request-decision"
        render={({ component }: any) => component()}
        component={RequestDecision}
      />
      <SecureRoute
        path="/governance-task-list/:systemId"
        exact
        render={({ component }: any) => component()}
        component={GovernanceTaskList}
      />
      {flags.fileUploads && (
        <SecureRoute
          exact
          path="/document-prototype"
          render={() => <DocumentPrototype />}
        />
      )}
      {isUserSet && user.isGrtReviewer(userGroups) && (
        <SecureRoute
          path="/governance-review-team/:systemId/:activePage"
          render={() => <GovernanceReviewTeam />}
        />
      )}
      <SecureRoute
        exact
        path="/system/request-type"
        render={({ component }: any) => component()}
        component={RequestTypeForm}
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
      <Redirect
        exact
        from="/business/:businessCaseId"
        to="/business/:businessCaseId/general-request-info"
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
  );
};

const App = () => {
  const handleSkipNav = () => {
    const mainContent = document.getElementById('main-content')!;
    if (mainContent) {
      mainContent.focus();
    }
  };

  return (
    <FlagsWrapper>
      <div className="usa-overlay" />
      <button type="button" className="skipnav" onClick={handleSkipNav}>
        Skip to main content
      </button>
      <BrowserRouter>
        <AuthenticationWrapper>
          <UserInfoWrapper>
            <TimeOutWrapper>
              <AppRoutes />
            </TimeOutWrapper>
          </UserInfoWrapper>
        </AuthenticationWrapper>
      </BrowserRouter>
    </FlagsWrapper>
  );
};

export default App;
