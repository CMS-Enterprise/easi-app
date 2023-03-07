import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Alert, Grid } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import LinkCard, { LinkRequestType } from 'components/LinkCard';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequestRepository from 'components/RequestRepository';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import List from 'views/Accessibility/AccessibilityRequest/List';
import Table from 'views/MyRequests/Table';

import WelcomeText from './WelcomeText';

const Home = () => {
  const { t } = useTranslation();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);
  const flags = useFlags();

  const { message } = useMessage();

  const requestTypes: Record<LinkRequestType, any> = t('home:actions', {
    returnObjects: true
  });

  const renderView = () => {
    if (isUserSet) {
      if (user.isGrtReviewer(userGroups, flags)) {
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

      if (user.isAccessibilityTeam(userGroups, flags)) {
        return <List />;
      }

      if (user.isBasicUser(userGroups, flags)) {
        return (
          <div className="grid-container">
            {message && (
              <div className="grid-container margin-top-6">
                <Alert type="success" slim role="alert">
                  {message}
                </Alert>
              </div>
            )}
            <div className="tablet:grid-col-12">
              <PageHeading className="margin-bottom-0">
                {t('home:title')}
              </PageHeading>
              <p className="line-height-body-5 font-body-lg text-light margin-bottom-5 margin-top-1">
                {t('home:subtitle')}
              </p>
              <hr className="margin-bottom-4" aria-hidden />
              <h2 className="margin-bottom-2">{t('home:actionTitle')}</h2>
              <Grid row gap={2}>
                {[
                  { ITGov: requestTypes.ITGov },
                  { TRB: requestTypes.TRB },
                  { 508: requestTypes[508] }
                ].map(requestType => (
                  <Grid tablet={{ col: 4 }} key={Object.keys(requestType)[0]}>
                    <LinkCard
                      type={Object.keys(requestType)[0] as LinkRequestType}
                    />
                  </Grid>
                ))}
              </Grid>

              <h3 className="margin-top-4">
                {t('home:requestsTable.heading')}
              </h3>
            </div>
            <div className="tablet:grid-col-12">
              <Table defaultPageSize={10} />
            </div>
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
