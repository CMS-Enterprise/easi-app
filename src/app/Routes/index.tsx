import React, { useEffect, useLayoutEffect } from 'react';
import ReactGA from 'react-ga4';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation
} from 'react-router-dom';
import { LoginCallback, SecureRoute } from '@okta/okta-react';
import { GovBanner } from '@trussworks/react-uswds';
import Help from 'features/Help';
import Home from 'features/Home';
import MyRequests from 'features/Home/MyRequests';
import GovernanceReviewTeam from 'features/ITGovernance/GovernanceReviewTeam';
import BusinessCase from 'features/ITGovernance/Requester/BusinessCase';
import GovernanceOverview from 'features/ITGovernance/Requester/GovernanceOverview';
import MakingARequest from 'features/ITGovernance/Requester/MakingARequest';
import PrepareForGRB from 'features/ITGovernance/Requester/PrepareForGRB';
import PrepareForGRT from 'features/ITGovernance/Requester/PrepareForGRT';
import SystemIntake from 'features/ITGovernance/Requester/SystemIntake';
import GovernanceTaskList from 'features/ITGovernance/Requester/TaskList';
import GovernanceFeedback from 'features/ITGovernance/Requester/TaskList/Feedback';
import LcidInfo from 'features/ITGovernance/Requester/TaskList/LcidInfo';
import RequestDecision from 'features/ITGovernance/Requester/TaskList/RequestDecision';
import Login from 'features/Login';
import AccessibilityStatement from 'features/Miscellaneous/AccessibilityStatement';
import Cookies from 'features/Miscellaneous/Cookies';
import Navigation from 'features/Miscellaneous/Navigation';
import NotFound from 'features/Miscellaneous/NotFound';
import PrivacyPolicy from 'features/Miscellaneous/PrivacyPolicy';
import TermsAndConditions from 'features/Miscellaneous/TermsAndConditions';
import UserInfo from 'features/Miscellaneous/User';
import RequestLinkForm from 'features/RequestLinking/RequestLinkForm';
import RequestTypeForm from 'features/RequestLinking/RequestTypeForm';
import SystemList from 'features/Systems';
import SystemProfile from 'features/Systems/SystemProfile';
import SystemWorkspace from 'features/Systems/SystemWorkspace';
import SystemWorkspaceRequests from 'features/Systems/SystemWorkspace/SystemWorkspaceRequests';
import TechnicalAssistance from 'features/TechnicalReviewBoard';
import { useFlags } from 'launchdarkly-react-client-sdk';
import AuthenticationWrapper from 'wrappers/AuthenticationWrapper';
import FlagsWrapper from 'wrappers/FlagsWrapper';
import TableStateWrapper from 'wrappers/TableStateWrapper';
import TimeOutWrapper from 'wrappers/TimeOutWrapper';
import UserInfoWrapper from 'wrappers/UserInfoWrapper';

import Footer from 'components/Footer';
import Header from 'components/Header';
import PageWrapper from 'components/PageWrapper';
import { MessageProvider } from 'hooks/useMessage';

import shouldScroll from '../../utils/scrollConfig';

const AppRoutes = () => {
  const location = useLocation();
  const flags = useFlags();

  // Track GA Pages
  useEffect(() => {
    if (location.pathname) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }
  }, [location.pathname]);

  // Scroll to top
  useLayoutEffect(() => {
    if (shouldScroll(location.pathname)) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <Switch>
      {/* General Routes */}
      <Route path="/" exact component={Home} />
      <Redirect exact from="/login" to="/signin" />
      <Route path="/signin" exact component={Login} />
      <SecureRoute path="/user-diagnostics" component={UserInfo} />
      <SecureRoute path="/my-requests" component={MyRequests} />

      {/* GRT/GRB Routes */}
      <Redirect from="/governance-review-team/*" to="/it-governance/*" />
      <SecureRoute path="/it-governance/:id" component={GovernanceReviewTeam} />

      {/* Requester / Business Owner Routes */}
      <SecureRoute path="/system/making-a-request" component={MakingARequest} />
      <SecureRoute
        exact
        path="/system/request-type/:systemId?"
        component={RequestTypeForm}
      />
      <SecureRoute exact path="/system/link/:id?">
        <RequestLinkForm requestType="itgov" />
      </SecureRoute>
      <SecureRoute
        path="/governance-overview/:systemId?"
        component={GovernanceOverview}
      />
      <SecureRoute
        path="/governance-task-list/:systemId"
        exact
        component={GovernanceTaskList}
      />
      <SecureRoute
        path="/governance-task-list/:systemId/feedback"
        exact
        component={GovernanceFeedback}
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
        path="/governance-task-list/:systemId/request-decision"
        component={RequestDecision}
      />
      <SecureRoute
        exact
        path="/governance-task-list/:systemId/lcid-info"
        component={LcidInfo}
      />

      <Redirect
        exact
        from="/system/:systemId"
        to="/system/:systemId/contact-details"
      />
      <SecureRoute
        path="/system/:systemId/:formPage/:subPage?"
        component={SystemIntake}
      />

      <SecureRoute exact path="/systems" component={SystemList} />

      {flags.systemWorkspace ? (
        [
          <SecureRoute
            key="workspace"
            exact
            path="/systems/:systemId/workspace"
            component={SystemWorkspace}
          />,
          <SecureRoute
            key="workspace-requests"
            exact
            path="/systems/:systemId/workspace/requests"
            component={SystemWorkspaceRequests}
          />
        ]
      ) : (
        <Redirect
          exact
          from="/systems/:systemId/workspace"
          to="/systems/:systemId"
        />
      )}

      <SecureRoute path="/systems/:systemId" exact component={SystemProfile} />

      <SecureRoute
        path="/systems/:systemId/:subinfo/:edit(edit)?/:action(team-member)?/:top(top)?"
        exact
        component={SystemProfile}
      />

      <Redirect
        exact
        from="/business/:businessCaseId"
        to="/business/:businessCaseId/general-request-info"
      />
      <SecureRoute
        path="/business/:businessCaseId/:formPage"
        component={BusinessCase}
      />

      <SecureRoute path="/trb" component={TechnicalAssistance} />

      <SecureRoute path="/help" component={Help} />

      {/* Static Page Routes  */}
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

      <Route path="/implicit/callback" component={LoginCallback} />

      {/* 404 */}
      <SecureRoute path="*" component={NotFound} />
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
    <>
      <div className="usa-overlay" />
      <button type="button" className="skipnav" onClick={handleSkipNav}>
        Skip to main content
      </button>
      <BrowserRouter>
        <AuthenticationWrapper>
          <MessageProvider>
            <FlagsWrapper>
              <UserInfoWrapper>
                <TimeOutWrapper>
                  <TableStateWrapper>
                    <PageWrapper>
                      <GovBanner />
                      <Header />
                      <Navigation>
                        <AppRoutes />
                      </Navigation>
                      <Footer />
                    </PageWrapper>
                  </TableStateWrapper>
                </TimeOutWrapper>
              </UserInfoWrapper>
            </FlagsWrapper>
          </MessageProvider>
        </AuthenticationWrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
