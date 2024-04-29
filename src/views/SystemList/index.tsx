/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Button,
  CardGroup,
  Grid,
  IconBookmark,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert, { AlertText } from 'components/shared/Alert';
import { ErrorAlert } from 'components/shared/ErrorAlert';
import SectionWrapper from 'components/shared/SectionWrapper';
import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import {
  GetCedarSystemBookmarks,
  GetCedarSystemBookmarks_cedarSystemBookmarks as CedarSystemBookmark
} from 'queries/types/GetCedarSystemBookmarks';
import { GetCedarSystems } from 'queries/types/GetCedarSystems';

import Table, { SystemTableType } from './Table';
import filterBookmarks from './util';

import './index.scss';

export const SystemList = () => {
  const { t } = useTranslation('systemProfile');

  const location = useLocation();
  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  const tableType = params.get('table-type') as SystemTableType;

  const systemsRef = useRef<null | HTMLDivElement>(null);

  const {
    loading: loadingSystems,
    error: error1,
    data: data1
  } = useQuery<GetCedarSystems>(GetCedarSystemsQuery);

  const {
    loading: loadingBookmarks,
    error: error2,
    data: data2,
    refetch: refetchBookmarks
  } = useQuery<GetCedarSystemBookmarks>(GetCedarSystemBookmarksQuery);

  const systemsTableData = data1?.cedarSystems ?? [];
  const bookmarks: CedarSystemBookmark[] = data2?.cedarSystemBookmarks ?? [];

  useEffect(() => {
    if (
      (tableType === 'my-systems' || tableType === 'bookmarked-systems') &&
      (!loadingBookmarks || data1?.cedarSystems) &&
      (!loadingSystems || data2?.cedarSystemBookmarks)
    ) {
      systemsRef?.current?.scrollIntoView({
        block: 'start'
      });
    }
  }, [
    tableType,
    loadingBookmarks,
    loadingSystems,
    data1?.cedarSystems,
    data2?.cedarSystemBookmarks
  ]);

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

        <SummaryBox heading="" className="easi-request__container">
          <p>{t('systemProfile:newRequest.info')}</p>

          <UswdsReactLink
            to="/system/request-type"
            className="easi-request__button-link"
          >
            {t('systemProfile:newRequest.button')}
          </UswdsReactLink>
        </SummaryBox>
      </SectionWrapper>

      {(loadingSystems || loadingBookmarks) && !data1?.cedarSystems ? (
        <PageLoading />
      ) : (
        <>
          <h2 className="margin-bottom-0">
            {t('systemProfile:bookmark.header')}
          </h2>

          <p className="margin-bottom-3">
            {t('systemProfile:bookmark.subtitle')}
          </p>

          {loadingBookmarks ? (
            <PageLoading />
          ) : (
            <SectionWrapper borderBottom className="margin-bottom-3">
              {bookmarks.length === 0 ? (
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
                      <IconBookmark />
                      <span className="margin-0">
                        {t('systemProfile:noBookmark.text2')}
                      </span>
                    </span>
                  </Alert>
                </Grid>
              ) : (
                <CardGroup className="margin-bottom-3">
                  {filterBookmarks(
                    systemsTableData,
                    bookmarks,
                    refetchBookmarks
                  )}
                </CardGroup>
              )}
            </SectionWrapper>
          )}

          <h2 className="margin-bottom-2">
            {t('systemProfile:systemTable.title')}
          </h2>

          <Trans
            i18nKey="systemProfile:systemTable.subtitle"
            components={{
              icon: <IconBookmark className="text-bookmark-icon" />
            }}
          />

          {error1 || error2 ? (
            <ErrorAlert heading="System error">
              <AlertText>
                <span>{t('systemProfile:gql.fail')}</span>
              </AlertText>
            </ErrorAlert>
          ) : (
            <div ref={systemsRef}>
              <Table
                systems={systemsTableData}
                savedBookmarks={bookmarks}
                refetchBookmarks={refetchBookmarks}
              />
            </div>
          )}
        </>
      )}
    </MainContent>
  );
};

export default SystemList;
