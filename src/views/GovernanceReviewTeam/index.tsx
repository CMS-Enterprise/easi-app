import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, useParams } from 'react-router-dom';
import { useGetSystemIntakeGRBReviewQuery } from 'gql/gen/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageLoading from 'components/PageLoading';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import RequestOverview from 'views/GovernanceReviewTeam/RequestOverview';
import NotFound from 'views/NotFound';
import RequestLinkForm from 'views/RequestLinkForm';

import ITGovAdminContext from './ITGovAdminContext';

const GovernanceReviewTeam = () => {
  const { groups, euaId, isUserSet } = useSelector(
    (state: AppState) => state.auth
  );

  const flags = useFlags();

  const { id } = useParams<{
    id: string;
  }>();

  const { data, loading } = useGetSystemIntakeGRBReviewQuery({
    variables: {
      id
    }
  });

  const { grbReviewers, grbReviewStartedAt } = data?.systemIntake || {};

  /** Check if current user is set as GRB reviewer */
  const isGrbReviewer: boolean = useMemo(() => {
    return (grbReviewers || []).some(
      reviewer => reviewer.userAccount.username === euaId
    );
  }, [grbReviewers, euaId]);

  const isITGovAdmin = user.isITGovAdmin(groups, flags);

  if (isUserSet && !loading) {
    // Only show admin section if user is either IT Gov admin or GRB reviewer
    if (isITGovAdmin || isGrbReviewer) {
      return (
        <ITGovAdminContext.Provider value={isITGovAdmin}>
          <Switch>
            {isITGovAdmin && (
              /* Defining outside parent route to trigger parent rerender/refetch after mutation */
              <Route path="/it-governance/:id/additional-information/link">
                <RequestLinkForm requestType="itgov" fromAdmin />
              </Route>
            )}

            <Route
              // reviewerType differentiates between GRT and GRB views for admin pages
              path="/it-governance/:systemId/:activePage/:subPage?"
              exact
            >
              <RequestOverview
                grbReviewers={grbReviewers || []}
                grbReviewStartedAt={grbReviewStartedAt}
              />
            </Route>

            <Route path="*" component={NotFound} />
          </Switch>
        </ITGovAdminContext.Provider>
      );
    }

    return <NotFound />;
  }

  return <PageLoading />;
};

export default GovernanceReviewTeam;
