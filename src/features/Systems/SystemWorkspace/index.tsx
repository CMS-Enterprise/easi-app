import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';
import NotFound from 'features/Miscellaneous/NotFound';
import {
  useGetCedarSystemQuery,
  useGetSystemWorkspaceAtoQuery,
  useGetSystemWorkspaceQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import getAtoStatus from 'components/AtoStatus/getAtoStatus';
import BookmarkButton from 'components/BookmarkButton';
import Breadcrumbs from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import TLCTag from 'components/TLCTag';
import { RoleTypeName } from 'types/systemProfile';
import linkCedarSystemIdQueryString from 'utils/linkCedarSystemIdQueryString';

import AtoCard from './components/AtoCard';
import HelpLinks from './components/HelpLinks';
import RequestsCard from './components/RequestsCard';
import SpacesCard from './components/SpacesCard';
import TeamCard from './components/TeamCard';

const hasUnauthorizedAtoError = (error?: ApolloError) => {
  return (
    error?.graphQLErrors.some(({ message }) => {
      const lowerCaseMessage = message.toLowerCase();
      return (
        lowerCaseMessage.includes('unauthorized') ||
        lowerCaseMessage.includes('not authorized')
      );
    }) === true
  );
};

export const SystemWorkspace = () => {
  const flags = useFlags();
  const { t } = useTranslation('systemWorkspace');
  const history = useHistory();

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { loading, error, data } = useGetSystemWorkspaceQuery({
    variables: {
      cedarSystemId: systemId
    }
  });

  const cedarSystem = data?.cedarSystemWorkspace?.cedarSystem;
  const workspaceUnavailable =
    !loading && (error || !data?.cedarSystemWorkspace || !cedarSystem);

  const { data: fallbackProfileData, loading: fallbackProfileLoading } =
    useGetCedarSystemQuery({
      variables: {
        id: systemId
      },
      skip: !workspaceUnavailable
    });

  const viewerCanAccessProfile = cedarSystem?.viewerCanAccessProfile === true;

  const {
    data: atoData,
    error: atoError,
    loading: atoLoading
  } = useGetSystemWorkspaceAtoQuery({
    variables: {
      cedarSystemId: systemId
    },
    errorPolicy: 'all',
    skip: !viewerCanAccessProfile
  });

  const ato = atoData?.cedarAuthorityToOperate?.[0];
  const atoUnavailable =
    !viewerCanAccessProfile || hasUnauthorizedAtoError(atoError);
  const atoStatus =
    atoLoading || atoUnavailable || atoError
      ? undefined
      : getAtoStatus(ato?.dateAuthorizationMemoExpires, ato?.oaStatus);

  const { isso } = useMemo(
    () => ({
      isso: data?.cedarSystemWorkspace?.roles?.length
        ? data.cedarSystemWorkspace.roles?.find(
            role => role.roleTypeName === RoleTypeName.ISSO
          )
        : undefined
    }),
    [data]
  );

  /** The `linkSearchQuery` is used on starting new request links throughout workspace */
  const linkSearchQuery = linkCedarSystemIdQueryString(systemId);

  if (systemId.startsWith('{') && systemId.endsWith('}')) {
    return (
      <Redirect to={`/systems/${systemId.slice(1, systemId.length - 1)}`} />
    );
  }

  if (loading || fallbackProfileLoading) {
    return <PageLoading />;
  }

  if (workspaceUnavailable) {
    if (fallbackProfileData?.cedarSystem) {
      return <Redirect to={`/systems/${systemId}`} />;
    }

    return <NotFound />;
  }

  const workspaceData = data!.cedarSystemWorkspace!;
  const workspaceSystem = workspaceData.cedarSystem!;
  const { isBookmarked } = workspaceSystem;
  const workspacePrimaryAction = viewerCanAccessProfile
    ? {
        label: t('systemProfile:editSystemProfile.heading'),
        path: `/systems/${systemId}/edit`
      }
    : {
        label: t('spaces.team.manage'),
        path: `/systems/${systemId}/edit/team?workspace`
      };

  // Redirect to system profile if not a team member for the system
  if (flags.systemWorkspace && !workspaceData.isMySystem) {
    return <Redirect to={`/systems/${systemId}`} />;
  }

  return (
    <MainContent>
      <GridContainer>
        <Breadcrumbs
          items={[
            { text: t('breadcrumbs.home'), url: '/' },
            { text: t('header') }
          ]}
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
        <Grid className="display-flex flex-align-stretch margin-bottom-4">
          <CardGroup>
            <SpacesCard
              header={t('spaces.systemProfile.header')}
              description={t('spaces.systemProfile.description')}
              footer={
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => history.push(workspacePrimaryAction.path)}
                  >
                    {workspacePrimaryAction.label}
                  </Button>
                  {viewerCanAccessProfile && (
                    <Button
                      type="button"
                      outline
                      onClick={() => history.push(`/systems/${systemId}/home`)}
                    >
                      {t('spaces.systemProfile.linktext')}
                    </Button>
                  )}
                </ButtonGroup>
              }
            />

            <AtoCard
              atoLoading={viewerCanAccessProfile && atoLoading}
              atoStatus={atoStatus}
              atoUnavailable={atoUnavailable}
              oaStatus={ato?.oaStatus}
              dateAuthorizationMemoExpires={ato?.dateAuthorizationMemoExpires}
              isso={isso}
            />

            {flags.systemWorkspaceRequestsCard && (
              <RequestsCard
                systemId={systemId}
                trbCount={workspaceSystem.linkedTrbRequests.length}
                itgovCount={workspaceSystem.linkedSystemIntakes.length}
                linkSearchQuery={linkSearchQuery}
              />
            )}
          </CardGroup>
        </Grid>
      </GridContainer>

      {flags.systemWorkspaceTeam && (
        <div className="bg-base-lightest padding-top-6 padding-bottom-10">
          <GridContainer>
            <CardGroup>
              <TeamCard roles={workspaceData.roles || []} />
            </CardGroup>
          </GridContainer>
        </div>
      )}
    </MainContent>
  );
};

export default SystemWorkspace;
