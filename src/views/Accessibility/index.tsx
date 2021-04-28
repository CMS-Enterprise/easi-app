import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';
import Create from 'views/Accessibility/AccessibiltyRequest/Create';
import AccessibilityRequestsDocumentsNew from 'views/Accessibility/AccessibiltyRequest/Documents/New';
import List from 'views/Accessibility/AccessibiltyRequest/List';
import NotFoundPartial from 'views/NotFound/NotFoundPartial';
import NewTestDateView from 'views/TestDate/NewTestDate';
import UpdateTestDateView from 'views/TestDate/UpdateTestDate';

const Accessibility = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  const { t } = useTranslation('accessibility');

  const NewRequest = (
    <SecureRoute path="/508/requests/new" exact component={Create} />
  );
  const AllRequests = (
    <SecureRoute path="/508/requests/all" exact component={List} />
  );
  const NewDocument = (
    <SecureRoute
      path="/508/requests/:accessibilityRequestId/documents/new"
      component={AccessibilityRequestsDocumentsNew}
    />
  );
  const UpdateTestDate = (
    <SecureRoute
      path="/508/requests/:accessibilityRequestId/test-date/:testDateId"
      component={UpdateTestDateView}
    />
  );
  const NewTestDate = (
    <SecureRoute
      path="/508/requests/:accessibilityRequestId/test-date"
      component={NewTestDateView}
    />
  );
  const RequestDetails = (
    <SecureRoute
      path="/508/requests/:accessibilityRequestId"
      component={AccessibilityRequestDetailPage}
    />
  );
  const Default = <Route path="*" component={NotFoundPartial} />;

  const PageTemplate = ({ children }: { children: any }) => (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">
        <SecondaryNav>
          <NavLink to="/">{t('tabs.accessibilityRequests')}</NavLink>
        </SecondaryNav>
        <div className="grid-container">
          <Switch>{children}</Switch>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );

  if (isUserSet) {
    if (user.isAccessibilityTeam(userGroups, flags)) {
      return (
        <PageTemplate>
          {[
            NewRequest,
            AllRequests,
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
        {[NewRequest, NewDocument, RequestDetails, Default]}
      </PageTemplate>
    );
  }

  return <p>Loading...</p>;
};

export default Accessibility;
