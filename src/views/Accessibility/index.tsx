import React from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Route, SecureRoute } from '@okta/okta-react';

import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';
import Create from 'views/Accessibility/AccessibiltyRequest/Create';
import AccessibilityRequestsDocumentsNew from 'views/Accessibility/AccessibiltyRequest/Documents/New';
import NotFound from 'views/NotFound';
import TestDate from 'views/TestDate';

const Accessibility = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  const RenderPage = () => (
    <Switch>
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
  );

  if (isUserSet) {
    if (user.isAccessibilityTeam(userGroups)) {
      return <RenderPage />;
    }
    return <NotFound />;
  }

  return <p>Loading...</p>;
};

export default Accessibility;
