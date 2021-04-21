import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { Alert } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import useConfirmationText from 'hooks/useConfirmationText';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';
import Create from 'views/Accessibility/AccessibiltyRequest/Create';
import AccessibilityRequestsDocumentsNew from 'views/Accessibility/AccessibiltyRequest/Documents/New';
import List from 'views/Accessibility/AccessibiltyRequest/List';
import NotFound from 'views/NotFound';
import TestDate from 'views/TestDate';

const Accessibility = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  const { t } = useTranslation('accessibility');
  const confirmationText = useConfirmationText();

  const RenderPage = () => (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">
        <SecondaryNav>
          <NavLink to="/">{t('tabs.accessibilityRequests')}</NavLink>
        </SecondaryNav>
        <div className="grid-container">
          {confirmationText && (
            <Alert className="margin-top-4" type="success" role="alert">
              {confirmationText}
            </Alert>
          )}
          <Switch>
            <SecureRoute path="/508/requests/all" exact component={List} />
            <SecureRoute path="/508/requests/new" exact component={Create} />
            <SecureRoute
              path="/508/requests/:accessibilityRequestId/documents/new"
              component={AccessibilityRequestsDocumentsNew}
            />
            <SecureRoute
              path="/508/requests/:accessibilityRequestId/test-date"
              component={TestDate}
            />
            <SecureRoute
              path="/508/requests/:accessibilityRequestId"
              component={AccessibilityRequestDetailPage}
            />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );

  if (isUserSet) {
    if (user.isAccessibilityTeam(userGroups, flags)) {
      return <RenderPage />;
    }
    return <NotFound />;
  }

  return <p>Loading...</p>;
};

export default Accessibility;
