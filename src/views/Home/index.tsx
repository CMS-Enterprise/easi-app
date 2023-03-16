import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Alert, Grid } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import LinkCard, { LinkRequestType } from 'components/LinkCard';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequestRepository from 'components/RequestRepository';
import useMessage from 'hooks/useMessage';
import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import {
  GetCedarSystemBookmarks,
  GetCedarSystemBookmarks_cedarSystemBookmarks as CedarSystemBookmark
} from 'queries/types/GetCedarSystemBookmarks';
import {
  GetCedarSystems,
  GetCedarSystems_cedarSystems as CedarSystem
} from 'queries/types/GetCedarSystems';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import List from 'views/Accessibility/AccessibilityRequest/List';
import Table from 'views/MyRequests/Table';
import SystemsListTable from 'views/SystemList/Table';
import TrbAdminTeamHome from 'views/TechnicalAssistance/TrbAdminTeamHome';

import WelcomeText from './WelcomeText';

const Home = () => {
  const { t } = useTranslation();
  const { groups, isUserSet } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();

  const { message } = useMessage();

  const requestTypes: Record<LinkRequestType, any> = t('home:actions', {
    returnObjects: true
  });

  const { loading: loadingSystems, data: systems } = useQuery<GetCedarSystems>(
    GetCedarSystemsQuery,
    {
      skip: !user.isBasicUser(groups, flags)
    }
  );

  const {
    loading: loadingBookmarks,
    data: systemsBookmarks,
    refetch: refetchBookmarks
  } = useQuery<GetCedarSystemBookmarks>(GetCedarSystemBookmarksQuery, {
    skip: !user.isBasicUser(groups, flags)
  });

  const systemsTableData = (systems?.cedarSystems ?? []) as CedarSystem[];
  const bookmarks: CedarSystemBookmark[] =
    systemsBookmarks?.cedarSystemBookmarks ?? [];

  const renderView = () => {
    if (isUserSet) {
      if (user.isGrtReviewer(groups, flags)) {
        return (
          // Changed GRT table from grid-container to just slight margins. This is take up
          // entire screen to better fit the more expansive data in the table.
          <div>
            {message && (
              <div className="grid-container margin-top-6">
                <Alert type="success" slim role="alert">
                  {message}
                </Alert>
              </div>
            )}
            <RequestRepository />
          </div>
        );
      }

      if (user.isAccessibilityTeam(groups, flags)) {
        return <List />;
      }

      if (user.isTrbAdmin(groups, flags)) {
        return (
          <MainContent className="technical-assistance margin-bottom-5 desktop:margin-bottom-10">
            <TrbAdminTeamHome />
          </MainContent>
        );
      }

      if (user.isBasicUser(groups, flags)) {
        return (
          <div className="grid-container">
            {message && (
              <div className="grid-container margin-top-6">
                <Alert type="success" slim role="alert">
                  {message}
                </Alert>
              </div>
            )}
            <Grid tablet={{ col: 12 }}>
              <PageHeading className="margin-bottom-0">
                {t('home:title')}
              </PageHeading>

              <p className="line-height-body-5 font-body-lg text-light margin-bottom-5 margin-top-1">
                {t('home:subtitle')}
              </p>

              <hr className="margin-bottom-3" aria-hidden />

              <h2 className="margin-top-2 margin-bottom-1">
                {t('home:actionTitle')}
              </h2>

              <Grid row gap={2}>
                {[
                  { ITGov: requestTypes.ITGov },
                  { TRB: requestTypes.TRB },
                  { 508: requestTypes[508] }
                ].map(requestType => (
                  <Grid tablet={{ col: 4 }} key={Object.keys(requestType)[0]}>
                    <LinkCard
                      className="margin-top-1"
                      type={Object.keys(requestType)[0] as LinkRequestType}
                    />
                  </Grid>
                ))}
              </Grid>

              <h3 className="margin-top-4">
                {t('home:requestsTable.heading')}
              </h3>
            </Grid>

            <Grid tablet={{ col: 12 }}>
              <Table defaultPageSize={10} />
            </Grid>

            <hr className="margin-bottom-3 margin-top-4" aria-hidden />

            <Grid tablet={{ col: 12 }} className="margin-bottom-6">
              <h2 className="margin-bottom-0 margin-top-4">
                {t('systemProfile:systemTable.title')}
              </h2>

              <p className="margin-bottom-5">
                {t('systemProfile:systemTable.subtitle')}
              </p>

              {loadingSystems || loadingBookmarks ? (
                <PageLoading />
              ) : (
                <SystemsListTable
                  systems={systemsTableData}
                  savedBookmarks={bookmarks}
                  refetchBookmarks={refetchBookmarks}
                />
              )}
            </Grid>
          </div>
        );
      }
    }
    return (
      <div className="grid-container">
        <WelcomeText />
      </div>
    );
  };

  return <MainContent className="margin-bottom-5">{renderView()}</MainContent>;
};

export default withRouter(Home);
