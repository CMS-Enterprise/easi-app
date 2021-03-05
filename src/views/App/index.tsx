import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';
import Create from 'views/Accessibility/AccessibiltyRequest/Create';
import AccessibilityRequestsDocumentsNew from 'views/Accessibility/AccessibiltyRequest/Documents/New';
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
import TestDate from 'views/TestDate';
import TimeOutWrapper from 'views/TimeOutWrapper';
import UserInfoWrapper from 'views/UserInfoWrapper';

import './index.scss';

const AppRoutes = () => {
  const flags = useFlags();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const is508User =
    isUserSet &&
    (user.isAccessibilityAdmin(userGroups) ||
      user.isAccessibilityTester(userGroups));

  const isGrtReviewer = isUserSet && user.isGrtReviewer(userGroups);
  return (
    <Switch>
      {/* General App Routes */}
      <Route path="/" exact component={Home} />
      <Redirect exact from="/login" to="/signin" />
      <Route path="/signin" exact component={Login} />
      <Route path="/implicit/callback" component={LoginCallback} />

      {/* 508 Process Pages */}
      {is508User && (
        <>
          <SecureRoute path="/508/requests/new" exact component={Create} />
          <SecureRoute
            path="/508/requests/:accessibilityRequestId/documents/new"
            component={AccessibilityRequestsDocumentsNew}
          />
          <SecureRoute
            path="/508/requests/:accessibilityRequestId/test-date"
            render={() => <TestDate />}
          />
          <SecureRoute
            path="/508/requests/:accessibilityRequestId"
            render={() => <AccessibilityRequestDetailPage />}
          />
        </>
      )}

      {/* GRT/GRB Process Pages */}
      <Route path="/governance-overview" exact component={GovernanceOverview} />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/prepare-for-grb"
        render={() => <PrepareForGRB />}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/prepare-for-grt"
        render={() => <PrepareForGRT />}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/request-decision"
        render={() => <RequestDecision />}
      />
      <SecureRoute
        exact
        path="/system/request-type"
        render={() => <RequestTypeForm />}
      />
      <Redirect
        exact
        from="/system/:systemId"
        to="/system/:systemId/contact-details"
      />
      <SecureRoute
        path="/system/:systemId/:formPage"
        render={() => <SystemIntake />}
      />
      <Redirect
        exact
        from="/business/:businessCaseId"
        to="/business/:businessCaseId/general-request-info"
      />
      <SecureRoute
        path="/business/:businessCaseId/:formPage"
        render={() => <BusinessCase />}
      />
      <SecureRoute
        path="/governance-task-list/:systemId"
        exact
        render={() => <GovernanceTaskList />}
      />
      {isGrtReviewer && (
        <SecureRoute
          path="/governance-review-team/:systemId/:activePage"
          render={() => <GovernanceReviewTeam />}
        />
      )}

      {/* Static Pages */}
      <Route path="/privacy-policy" exact render={() => <PrivacyPolicy />} />
      <Route path="/cookies" exact render={() => <Cookies />} />
      <Route
        path="/accessibility-statement"
        exact
        render={() => <AccessibilityStatement />}
      />
      <Route
        exact
        path="/terms-and-conditions"
        render={() => <TermsAndConditions />}
      />

      {/* Misc Pages */}
      {flags.sandbox && (
        <Route path="/sandbox" exact render={() => <Sandbox />} />
      )}

      {flags.fileUploads && (
        <SecureRoute
          exact
          path="/document-prototype"
          render={() => <DocumentPrototype />}
        />
      )}

      {/* 404 Page */}
      <Route path="*" render={() => <NotFound />} />
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
