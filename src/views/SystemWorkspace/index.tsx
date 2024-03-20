/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, SummaryBox } from '@trussworks/react-uswds';

import BookmarkTag from 'components/BookmarkTag';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert, { AlertText } from 'components/shared/Alert';
import { ErrorAlert } from 'components/shared/ErrorAlert';
import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetSystemWorkspaceQuery from 'queries/GetSystemWorkspaceQuery';
import {
  GetCedarSystemBookmarks,
  GetCedarSystemBookmarks_cedarSystemBookmarks as CedarSystemBookmark
} from 'queries/types/GetCedarSystemBookmarks';
import {
  GetSystemWorkspace,
  GetSystemWorkspaceVariables
} from 'queries/types/GetSystemWorkspace';

export const SystemWorkspace = () => {
  const { t } = useTranslation('systemWorkspace');

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

  const systemData = data?.cedarSystemDetails?.cedarSystem;

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

  return (
    <MainContent className="grid-container margin-bottom-5">
      <Grid>
        <div className="display-flex flex-align-center flex-justify">
          <div>
            <PageHeading className="margin-bottom-1">{t('header')}</PageHeading>
            <p className="margin-top-1">
              {t('subheader', {
                systemName: systemData?.name
              })}
            </p>
          </div>

          <BookmarkTag
            systemID={systemId}
            isBookmarked={isBookmarked}
            refetchBookmarks={refetchBookmarks}
          />
        </div>
      </Grid>
    </MainContent>
  );
};

export default SystemWorkspace;
