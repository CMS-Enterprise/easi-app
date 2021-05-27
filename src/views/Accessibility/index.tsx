import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { Link } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import Create from 'views/Accessibility/AccessibilityRequest/Create';
import AccessibilityRequestsDocumentsNew from 'views/Accessibility/AccessibilityRequest/Documents/New';
import List from 'views/Accessibility/AccessibilityRequest/List';
import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';
import AccessibilityTestingStepsOverview from 'views/Accessibility/AccessibilityTestingStepsOverview';
import TestingTemplates from 'views/Accessibility/TestingTemplates';
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
    path="/508/testing-overview"
    exact
    component={AccessibilityTestingStepsOverview}
  />
);

const AccessibilityTestingTemplates = (
  <SecureRoute
    key="508-testing-templates"
    path="/508/templates"
    exact
    component={TestingTemplates}
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

const ReportProblemLinkArea = ({ url }: { url: string }) => {
  const { t } = useTranslation('accessibility');
  return (
    <div className="width-full report-problem-link-area">
      <div className="grid-container">
        <div className="grid-row padding-bottom-2">
          <div className="grid-col-3">
            <Link href={url} target="_blank" rel="noopener noreferrer">
              {t('reportProblem')}
            </Link>
          </div>
          <div className="grid-col-9" />
        </div>
      </div>
    </div>
  );
};

const A11yTeamPageTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">
        <Switch>{children}</Switch>
      </MainContent>
      <ReportProblemLinkArea url="https://docs.google.com/forms/d/e/1FAIpQLSfRJIddKkcffFWXB4AVG_ibYgShu1t-HcKuXov06mZDDxwjLw/viewform" />
      <Footer />
    </PageWrapper>
  );
};

const PageTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">
        <Switch>{children}</Switch>
      </MainContent>
      <ReportProblemLinkArea url="https://www.surveymonkey.com/r/GCYMVY8" />
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
        <A11yTeamPageTemplate>
          {[
            NewRequest,
            AllRequests,
            AccessibilityTestingOverview,
            AccessibilityTestingTemplates,
            NewDocument,
            UpdateTestDate,
            NewTestDate,
            RequestDetails,
            Default
          ]}
        </A11yTeamPageTemplate>
      );
    }
    return (
      <PageTemplate>
        {[
          NewRequest,
          AccessibilityTestingOverview,
          AccessibilityTestingTemplates,
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
