import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';
import AccessibilityTestingStepsOverview from 'views/Accessibility/AccessibilityTestingStepsOverview';
import Create from 'views/Accessibility/AccessibiltyRequest/Create';
import AccessibilityRequestsDocumentsNew from 'views/Accessibility/AccessibiltyRequest/Documents/New';
import List from 'views/Accessibility/AccessibiltyRequest/List';
import NotFoundPartial from 'views/NotFound/NotFoundPartial';
import NewTestDateView from 'views/TestDate/NewTestDate';
import UpdateTestDateView from 'views/TestDate/UpdateTestDate';

const NewRequest = (
  <SecureRoute
    key="create-508-request"
    path="/508/requests/new"
    exact
    component={Create}
  />
);
const AllRequests = (
  <SecureRoute
    key="list-508-requests"
    path="/508/requests/all"
    exact
    component={List}
  />
);

const AccessibilityTestingOverview = (
  <SecureRoute
    key="508-request-testing-overview"
    path="/508/requests/steps-involved"
    exact
    component={AccessibilityTestingStepsOverview}
  />
);

const NewDocument = (
  <SecureRoute
    key="upload-508-document"
    path="/508/requests/:accessibilityRequestId/documents/new"
    component={AccessibilityRequestsDocumentsNew}
  />
);
const UpdateTestDate = (
  <SecureRoute
    key="update-508-test-date"
    path="/508/requests/:accessibilityRequestId/test-date/:testDateId"
    component={UpdateTestDateView}
  />
);
const NewTestDate = (
  <SecureRoute
    key="new-508-test-date"
    path="/508/requests/:accessibilityRequestId/test-date"
    component={NewTestDateView}
  />
);

const RequestDetails = (
  <SecureRoute
    key="508-request-detail"
    path="/508/requests/:accessibilityRequestId"
    component={AccessibilityRequestDetailPage}
  />
);

const NotFound = () => (
  <div className="grid-container">
    <NotFoundPartial />
  </div>
);

const Default = <Route path="*" key="508-not-found" component={NotFound} />;

const PageTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">
        <Switch>{children}</Switch>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

const Accessibility = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  if (isUserSet) {
    if (user.isAccessibilityTeam(userGroups, flags)) {
      return (
        <PageTemplate>
          {[
            NewRequest,
            AllRequests,
            AccessibilityTestingOverview,
            NewDocument,
            UpdateTestDate,
            NewTestDate,
            RequestDetails,
            Default
          ]}
        </PageTemplate>
      );
    }
    return (
      <PageTemplate>
        {[
          NewRequest,
          AccessibilityTestingOverview,
          NewDocument,
          RequestDetails,
          Default
        ]}
      </PageTemplate>
    );
  }

  return <p>Loading...</p>;
};

export default Accessibility;
