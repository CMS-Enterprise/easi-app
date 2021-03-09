import React from 'react';
import { Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';

import AccessibilityRequestDetailPage from 'views/Accessibility/AccessibilityRequestDetailPage';
import Create from 'views/Accessibility/AccessibiltyRequest/Create';
import AccessibilityRequestsDocumentsNew from 'views/Accessibility/AccessibiltyRequest/Documents/New';
import TestDate from 'views/TestDate';

const Accessibility = () => {
  return (
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
    </Switch>
  );
};

export default Accessibility;
