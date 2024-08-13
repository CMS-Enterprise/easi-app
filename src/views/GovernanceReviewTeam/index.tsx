import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, useParams } from 'react-router-dom';
import { useGetSystemIntakeGRBReviewersQuery } from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import RequestOverview from 'views/GovernanceReviewTeam/RequestOverview';
import NotFound from 'views/NotFound';
import RequestLinkForm from 'views/RequestLinkForm';

import IsGrbViewContext from './IsGrbViewContext';
import { ReviewerKey } from './subNavItems';

const GovernanceReviewTeam = () => {
  const { groups, euaId, isUserSet } = useSelector(
    (state: AppState) => state.auth
  );

  const flags = useFlags();

  const { id } = useParams<{
    id: string;
  }>();

  const { data, loading } = useGetSystemIntakeGRBReviewersQuery({
    variables: {
      id
    }
  });

  const grbReviewers = data?.systemIntake?.grbReviewers;

  /** Check if current user is set as GRB reviewer */
  const isGrbReviewer: boolean = useMemo(() => {
    return (grbReviewers || []).some(
      reviewer => reviewer.userAccount.username === euaId
    );
  }, [grbReviewers, euaId]);

  const isITGovAdmin = user.isITGovAdmin(groups, flags);

  const reviewerType: ReviewerKey = isITGovAdmin
    ? 'governance-review-team'
    : 'governance-review-board';

  if (isUserSet && !loading) {
    if (isITGovAdmin || isGrbReviewer) {
      return (
        <IsGrbViewContext.Provider
          // Only show GRB view if user is GRB reviewer without GOVTEAM job code
          value={!isITGovAdmin}
        >
          <Switch>
            {isITGovAdmin && (
              /* Defining outside parent route to trigger parent rerender/refetch after mutation */
              <Route path="/governance-review-team/:id/additional-information/link">
                <RequestLinkForm requestType="itgov" fromAdmin />
              </Route>
            )}

            <Route
              // reviewerType differentiates between GRT and GRB views for admin pages
              path={`/:reviewerType(${reviewerType})/:systemId/:activePage/:subPage?`}
              exact
            >
              <RequestOverview grbReviewers={grbReviewers || []} />
            </Route>

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
