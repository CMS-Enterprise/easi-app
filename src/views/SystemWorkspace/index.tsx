import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, CardGroup, Grid } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import BookmarkButton from 'components/BookmarkButton';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { getAtoStatus } from 'components/shared/AtoStatus';
import SystemProfileModal from 'components/SystemProfileModal';
import TLCTag from 'components/TLCTag';
import GetSystemWorkspaceQuery from 'queries/GetSystemWorkspaceQuery';
import {
  GetSystemWorkspace,
  GetSystemWorkspaceVariables
} from 'queries/types/GetSystemWorkspace';
import { RoleTypeName } from 'types/systemProfile';
import linkCedarSystemIdQueryString from 'utils/linkCedarSystemIdQueryString';
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

import AtoCard from './components/AtoCard';
import HelpLinks from './components/HelpLinks';
import RequestsCard from './components/RequestsCard';
import SpacesCard from './components/SpacesCard';
import TeamCard from './components/TeamCard';

export const SystemWorkspace = () => {
  const flags = useFlags();
  const { t } = useTranslation('systemWorkspace');

  const [isSystemProfileOpen, toggleSystemProfile] = useState<boolean>(false);

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { loading, error, data } = useQuery<
    GetSystemWorkspace,
    GetSystemWorkspaceVariables
  >(GetSystemWorkspaceQuery, {
    variables: {
      cedarSystemId: systemId
    }
  });

  const cedarSystem = data?.cedarSystemDetails?.cedarSystem;
  const ato = data?.cedarAuthorityToOperate[0];
  const atoStatus = getAtoStatus(ato?.dateAuthorizationMemoExpires);

  const isso = data?.cedarSystemDetails?.roles.length
    ? data.cedarSystemDetails.roles.find(
        role => role.roleTypeName === RoleTypeName.ISSO
      )
    : undefined;

  /** The `linkSearchQuery` is used on starting new request links throughout workspace */
  const linkSearchQuery = linkCedarSystemIdQueryString(systemId);

  if (loading) {
    return <PageLoading />;
  }

  if (error || !data || !data.cedarSystemDetails || !cedarSystem) {
    return <NotFound />;
  }

  const { isBookmarked } = data.cedarSystemDetails.cedarSystem;

  // Redirect to system profile if not a team member for the system
  if (flags.systemWorkspace && !data.cedarSystemDetails.isMySystem) {
    return <Redirect to={`/systems/${systemId}`} />;
  }

  return (
    <MainContent className="grid-container margin-bottom-8">
      <Breadcrumbs
        items={[
          { text: t('breadcrumbs.home'), url: '/' },
          { text: t('header') }
        ]}
      />
      <SystemProfileModal
        id={systemId}
        isOpen={isSystemProfileOpen}
        closeModal={() => toggleSystemProfile(false)}
      />
      <div className="display-flex flex-align-start flex-justify margin-top-5">
        <div>
          <PageHeading className="margin-bottom-1 margin-top-0">
            {t('header')}
          </PageHeading>

          <p className="margin-y-1 text-body-lg">
            {t('subheader', {
              systemName: cedarSystem?.name
            })}
          </p>

          <div className="display-flex margin-top-neg-1">
            <p className="text-bold margin-right-2">{t('tlcPhase')}</p>

            <TLCTag tlcPhase={ato?.tlcPhase} />
          </div>
        </div>

        <BookmarkButton
          id={systemId}
          isBookmarked={isBookmarked}
          className="bg-primary-lighter"
        />
      </div>
      <HelpLinks
        classname="margin-top-3 margin-bottom-5"
        linkSearchQuery={linkSearchQuery}
      />
      <h2>{t('spaces.header')}</h2>
      <Grid className="display-flex flex-align-stretch">
        <CardGroup>
          <SpacesCard
            header={t('spaces.systemProfile.header')}
            description={t('spaces.systemProfile.description')}
            footer={
              <Button
                type="button"
                outline
                onClick={() => toggleSystemProfile(true)}
              >
                {t('spaces.systemProfile.linktext')}
              </Button>
            }
          />

          <AtoCard
            status={atoStatus}
            dateAuthorizationMemoExpires={ato?.dateAuthorizationMemoExpires}
            isso={isso}
          />

          {flags.systemWorkspaceRequestsCard && (
            <RequestsCard
              systemId={systemId}
              trbCount={cedarSystem.linkedTrbRequests.length}
              itgovCount={cedarSystem.linkedSystemIntakes.length}
              linkSearchQuery={linkSearchQuery}
            />
          )}
        </CardGroup>
      </Grid>
      {flags.systemWorkspaceTeam && (
        <TeamCard roles={data.cedarSystemDetails.roles} />
      )}
    </MainContent>
  );
};

export default SystemWorkspace;
