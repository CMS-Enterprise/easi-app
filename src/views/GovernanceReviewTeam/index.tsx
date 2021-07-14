import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
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

  if (isUserSet) {
    if (user.isGrtReviewer(userGroups, flags)) {
      return (
        <Switch>
          <Route
            key="grt-request-list"
            path="/governance-review-team/all"
            render={() => (
              // Changed GRT table from grid-container to just slight margins. This is take up
              // entire screen to better fit the more expansive data in the table.
              <div className="padding-x-4">
                <RequestRepository />
              </div>
            )}
          />
          <Route
            key="grt-overview"
            path="/governance-review-team/:systemId/:activePage"
            component={RequestOverview}
          />
          <Route key="not-found" path="*" component={NotFound} />
        </Switch>
      );
    }
    return <NotFound />;
  }

  return <p>Loading...</p>;
};

export default GovernanceReviewTeam;
