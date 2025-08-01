/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  CardGroup,
  Grid,
  Icon,
  SummaryBox,
  SummaryBoxContent
} from '@trussworks/react-uswds';
import { useGetCedarSystemsQuery } from 'gql/generated/graphql';

import Alert, { AlertText } from 'components/Alert';
import BookmarkCard from 'components/BookmarkCard';
import { ErrorAlert } from 'components/ErrorAlert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import SectionWrapper from 'components/SectionWrapper';
import { mapCedarStatusToIcon } from 'types/iconStatus';

import Table from './SystemsTable';

import './index.scss';

export const SystemList = () => {
  const { t } = useTranslation('systemProfile');

  const systemsRef = useRef<null | HTMLDivElement>(null);

  const {
    loading: loadingSystems,
    error: error1,
    data: data1
  } = useGetCedarSystemsQuery();

  const systemsTableData = data1?.cedarSystems ?? [];

  const bookmarkedSystems = systemsTableData.filter(
    system => system.isBookmarked
  );

  return (
    <MainContent className="grid-container margin-bottom-5">
      <SectionWrapper borderBottom>
        <PageHeading className="margin-bottom-1">
          {t('systemProfile:header')}
        </PageHeading>

        <p>{t('systemProfile:subHeader')}</p>

        <Button
          type="button"
          className="margin-bottom-2"
          unstyled
          onClick={() =>
            systemsRef?.current?.scrollIntoView({
              block: 'start'
            })
          }
        >
          {t('systemProfile:systemTable.jumpToSystems')}
        </Button>

        <SummaryBox className="easi-request__container">
          <SummaryBoxContent>
            <p>{t('systemProfile:newRequest.info')}</p>

            <UswdsReactLink
              to="/system/request-type"
              className="easi-request__button-link"
            >
              {t('systemProfile:newRequest.button')}
            </UswdsReactLink>
          </SummaryBoxContent>
        </SummaryBox>
      </SectionWrapper>

      {loadingSystems && !data1?.cedarSystems ? (
        <PageLoading />
      ) : (
        <>
          <h2 className="margin-bottom-0">
            {t('systemProfile:bookmark.header')}
          </h2>

          <p className="margin-bottom-3">
            {t('systemProfile:bookmark.subtitle')}
          </p>

          <SectionWrapper
            borderBottom
            className="margin-bottom-3"
            id="systemBookmarks"
          >
            {bookmarkedSystems.length === 0 ? (
              <Grid tablet={{ col: 12 }} className="margin-bottom-5">
                <Alert
                  type="info"
                  className="padding-1"
                  heading={t('systemProfile:noBookmark.header')}
                >
                  <span className="display-flex flex-align-center">
                    <span className="margin-0">
                      {t('systemProfile:noBookmark.text1')}
                    </span>
                    <Icon.Bookmark aria-hidden />
                    <span className="margin-0">
                      {t('systemProfile:noBookmark.text2')}
                    </span>
                  </span>
                </Alert>
              </Grid>
            ) : (
              <CardGroup className="margin-bottom-3">
                {bookmarkedSystems.map(system => (
                  <BookmarkCard
                    type="systemProfile"
                    key={system.id}
                    statusIcon={mapCedarStatusToIcon(system.status)}
                    {...system}
                  />
                ))}
              </CardGroup>
            )}
          </SectionWrapper>

          <SectionWrapper id="systemsTable">
            <h2 className="margin-bottom-2">
              {t('systemProfile:systemTable.title')}
            </h2>

            <Trans
              i18nKey="systemProfile:systemTable.subtitle"
              components={{
                icon: (
                  <Icon.Bookmark aria-hidden className="text-bookmark-icon" />
                )
              }}
            />

            {error1 ? (
              <ErrorAlert heading="System error">
                <AlertText>
                  <span>{t('systemProfile:gql.fail')}</span>
                </AlertText>
              </ErrorAlert>
            ) : (
              <div ref={systemsRef}>
                <Table systems={systemsTableData} />
              </div>
            )}
          </SectionWrapper>
        </>
      )}
    </MainContent>
  );
};

export default SystemList;
