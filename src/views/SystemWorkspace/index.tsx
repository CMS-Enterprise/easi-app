import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button, CardGroup, Grid } from '@trussworks/react-uswds';

import BookmarkTag from 'components/BookmarkTag';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import SystemProfileModal from 'components/SystemProfileModal';
import TLCTag from 'components/TLCTag';
import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetSystemWorkspaceQuery from 'queries/GetSystemWorkspaceQuery';
import { GetCedarSystemBookmarks } from 'queries/types/GetCedarSystemBookmarks';
import {
  GetSystemWorkspace,
  GetSystemWorkspaceVariables
} from 'queries/types/GetSystemWorkspace';
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

import AtoCard from './components/AtoCard';
import HelpLinks from './components/HelpLinks';
import SpacesCard from './components/SpacesCard';

export const SystemWorkspace = () => {
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

  const {
    data: bookmark,
    refetch: refetchBookmarks
  } = useQuery<GetCedarSystemBookmarks>(GetCedarSystemBookmarksQuery);

  const isBookmarked = !!bookmark?.cedarSystemBookmarks.find(
    mark => mark.cedarSystemId === systemId
  );

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <NotFound />;
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

      <div className="display-flex flex-align-center flex-justify margin-top-5">
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

        <BookmarkTag
          systemID={systemId}
          isBookmarked={isBookmarked}
          refetchBookmarks={refetchBookmarks}
          className="flex-align-self-start"
        />
      </div>

      <HelpLinks classname="margin-top-3 margin-bottom-5" />

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

          <AtoCard />
        </CardGroup>
      </Grid>
    </MainContent>
  );
};

export default SystemWorkspace;
