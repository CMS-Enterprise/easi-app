import React from 'react';
import { useSelector } from 'react-redux';
import { SecureRoute } from '@okta/okta-react';

import RequestRepository from 'components/RequestRepository';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import RequestOverview from 'views/GovernanceReviewTeam/requestOverview';
import NotFound from 'views/NotFound';

const GovernanceReviewTeam = () => {
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  const RenderPage = () => (
    <>
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
        render={() => <RequestOverview />}
      />
    </>
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
