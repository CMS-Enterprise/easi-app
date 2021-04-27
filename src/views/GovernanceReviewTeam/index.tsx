import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import RequestRepository from 'components/RequestRepository';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import RequestOverview from 'views/GovernanceReviewTeam/RequestOverview';
import NotFound from 'views/NotFound';

const GovernanceReviewTeam = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  const RenderPage = () => (
    <Switch>
      <SecureRoute
        path="/governance-review-team/all"
        render={() => (
          // Changed GRT table from grid-container to just slight margins. This is take up
          // entire screen to better fit the more expansive data in the table.
          // NOTE: not sure this is ever used (deprecated for Home/index.tsx ?)
          <div className="padding-x-4">
            <RequestRepository />
          </div>
        )}
      />
      <SecureRoute
        path="/governance-review-team/:systemId/:activePage"
        component={RequestOverview}
      />
      <Route path="*" component={NotFound} />
    </Switch>
  );

  if (isUserSet) {
    if (user.isGrtReviewer(userGroups, flags)) {
      return <RenderPage />;
    }
    return <NotFound />;
  }

  return <p>Loading...</p>;
};

export default GovernanceReviewTeam;
