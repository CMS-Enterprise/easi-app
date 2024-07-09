import React, { createContext } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';

import PageLoading from 'components/PageLoading';
import useAuth from 'hooks/useAuth';
import RequestOverview from 'views/GovernanceReviewTeam/RequestOverview';
import NotFound from 'views/NotFound';
import RequestLinkForm from 'views/RequestLinkForm';

import { ReviewerKey } from './subNavItems';

export const IsGrbViewContext = createContext<boolean>(false);

const GovernanceReviewTeam = () => {
  const { user } = useAuth();

  const params = useParams<{
    reviewerType: ReviewerKey;
    id: string;
  }>();

  const isGrbReviewer = !!user?.isGrbReviewer(params.id);
  const isGrtReviewer = !!user?.isGrtReviewer();

  const reviewerType: ReviewerKey = isGrtReviewer
    ? 'governance-review-team'
    : 'governance-review-board';

  if (user) {
    if (isGrtReviewer || isGrbReviewer) {
      return (
        <IsGrbViewContext.Provider value={!isGrtReviewer}>
          <Switch>
            {isGrtReviewer && (
              /* Defining outside parent route to trigger parent rerender/refetch after mutation */
              <Route path="/governance-review-team/:id/additional-information/link">
                <RequestLinkForm requestType="itgov" fromAdmin />
              </Route>
            )}

            <Route
              path={`/:reviewerType(${reviewerType})/:systemId/:activePage/:subPage?`}
              exact
              component={RequestOverview}
            />

            <Route path="*" component={NotFound} />
          </Switch>
        </IsGrbViewContext.Provider>
      );
    }

    return <NotFound />;
  }

  return <PageLoading />;
};

export default GovernanceReviewTeam;
