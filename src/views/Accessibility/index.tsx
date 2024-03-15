import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import MainContent from 'components/MainContent';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import NotFoundPartial from 'views/NotFound/NotFoundPartial';
import NewTestDateView from 'views/TestDate/NewTestDate';
import UpdateTestDateView from 'views/TestDate/UpdateTestDate';

import Create from './AccessibilityRequest/Create';
import AccessibilityRequestsDocumentsNew from './AccessibilityRequest/Documents/New';
import List from './AccessibilityRequest/List';
import RequestCedarSystem from './AccessibilityRequest/RequestCedarSystem';
import AccessibilityRequestDetailPage from './AccessibilityRequestDetailPage';
import AccessibilityTestingStepsOverview from './AccessibilityTestingStepsOverview';
import ChangeRequestStatus from './ChangeRequestStatus';
import MakingARequest from './MakingARequest';
import TestingTemplates from './TestingTemplates';

const NewRequest = (
  <Route
    key="create-508-request"
    path="/508/requests/new"
    exact
    component={Create}
  />
);

const AllRequests = (
  <Route
    key="list-508-requests"
    path="/508/requests/all"
    exact
    component={List}
  />
);

const AccessibilityTestingOverview = (
  <Route
    key="508-request-testing-overview"
    path="/508/testing-overview"
    exact
    component={AccessibilityTestingStepsOverview}
  />
);

const MakingANewRequest = (
  <Route
    key="making-a-508-request"
    path="/508/making-a-request"
    exact
    component={MakingARequest}
  />
);

const AccessibilityTestingTemplates = (
  <Route
    key="508-testing-templates"
    path="/508/templates"
    exact
    component={TestingTemplates}
  />
);

const NewDocument = (
  <Route
    key="upload-508-document"
    path="/508/requests/:accessibilityRequestId/documents/new"
    component={AccessibilityRequestsDocumentsNew}
  />
);
const UpdateTestDate = (
  <Route
    key="update-508-test-date"
    path="/508/requests/:accessibilityRequestId/test-date/:testDateId"
    component={UpdateTestDateView}
  />
);
const NewTestDate = (
  <Route
    key="new-508-test-date"
    path="/508/requests/:accessibilityRequestId/test-date"
    component={NewTestDateView}
  />
);

const RequestStatusChange = (
  <Route
    key="change-508-request-status"
    path="/508/requests/:accessibilityRequestId/change-status"
    component={ChangeRequestStatus}
  />
);

const DocumentsRedirect = (
  <Redirect
    key="508-request-documents-redirect"
    exact
    from="/508/requests/:accessibilityRequestId"
    to="/508/requests/:accessibilityRequestId/documents"
  />
);

const RequestDetails = (
  <Route
    exact
    key="508-request-detail"
    path={[
      '/508/requests/:accessibilityRequestId/documents',
      '/508/requests/:accessibilityRequestId/notes'
    ]}
    component={AccessibilityRequestDetailPage}
  />
);

const UpdateRequestCedarSystem = (
  <Route
    exact
    key="508-request-cedar-system-link"
    path="/508/requests/:accessibilityRequestId/cedar-system"
    component={RequestCedarSystem}
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
    <MainContent className="margin-bottom-5">
      <Switch>{children}</Switch>
    </MainContent>
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
            MakingANewRequest,
            RequestStatusChange,
            AccessibilityTestingTemplates,
            NewDocument,
            UpdateTestDate,
            NewTestDate,
            DocumentsRedirect,
            RequestDetails,
            UpdateRequestCedarSystem,
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
          MakingANewRequest,
          AccessibilityTestingTemplates,
          NewDocument,
          DocumentsRedirect,
          RequestDetails,
          UpdateRequestCedarSystem,
          Default
        ]}
      </PageTemplate>
    );
  }

  return <p>Loading...</p>;
};

export default Accessibility;
