import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';

import RequestRepository from 'components/RequestRepository';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import RequestOverview from 'views/GovernanceReviewTeam/RequestOverview';
import NotFound from 'views/NotFound';

const GovernanceReviewTeam = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  const RenderPage = () => (
    <Switch>
      <SecureRoute
        path="/governance-review-team/all"
        render={() => (
          <div className="grid-container">
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
    if (user.isGrtReviewer(userGroups)) {
      return <RenderPage />;
    }
    return <NotFound />;
  }

  return <p>Loading...</p>;
};

export default GovernanceReviewTeam;
