import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import NotFound from 'features/Miscellaneous/NotFound';
import RequestLinkForm from 'features/RequestLinking/RequestLinkForm';
import { useGetSystemIntakeGRBReviewQuery } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import PageLoading from 'components/PageLoading';
import user from 'utils/user';

import DecisionRecord from './GRBReview/DecisionRecord';
import GRBReviewerForm from './GRBReview/GRBReviewerForm';
import GRBReviewForm from './GRBReview/GRBReviewForm';
import RequestOverview from './RequestOverview/RequestOverview';

const GovernanceReviewTeam = () => {
  const { groups, euaId, isUserSet } = useSelector(
    (state: AppState) => state.auth
  );

  const history = useHistory();

  const flags = useFlags();

  const { id } = useParams<{
    id: string;
  }>();

  const { data, loading } = useGetSystemIntakeGRBReviewQuery({
    variables: {
      id
    }
  });

  const grbReview = useMemo(() => {
    return data?.systemIntake;
  }, [data?.systemIntake]);

  const { grbVotingInformation } = grbReview || {};

  const { grbReviewers } = grbVotingInformation || {};

  /** Check if current user is set as GRB reviewer */
  const isGrbReviewer: boolean = useMemo(() => {
    return (grbReviewers || []).some(
      reviewer => reviewer.userAccount.username === euaId
    );
  }, [grbReviewers, euaId]);

  const isITGovAdmin = user.isITGovAdmin(groups, flags);

  const isFromGRBSetup = history.location.search === '?from-grb-setup';

  if (isUserSet && !loading) {
    if (!grbReview) {
      return <NotFound />;
    }

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

            {flags?.grbReviewTab && (
              <Route
                path="/it-governance/:systemId/grb-review/:step(review-type|presentation|documents|participants)"
                exact
              >
                <GRBReviewForm grbReview={grbReview} loading={loading} />
              </Route>
            )}

            {flags?.grbReviewTab && (
              <Route
                path="/it-governance/:systemId/grb-review/decision-record"
                exact
              >
                <DecisionRecord
                  systemIntakeId={grbReview.id}
                  grbReviewers={grbReview.grbVotingInformation.grbReviewers}
                />
              </Route>
            )}

            <Route
              path="/it-governance/:systemId/grb-review/:action(add|edit)"
              exact
            >
              <GRBReviewerForm
                isFromGRBSetup={isFromGRBSetup}
                initialGRBReviewers={
                  grbReview.grbVotingInformation?.grbReviewers
                }
                grbReviewStartedAt={grbReview.grbReviewStartedAt}
              />
            </Route>

            <Route path="/it-governance/:systemId/:activePage/:subPage?" exact>
              <RequestOverview />
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
