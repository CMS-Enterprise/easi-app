/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  CardGroup,
  Grid,
  Link as UswdsLink,
  SummaryBox
} from '@trussworks/react-uswds';

import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import PageWrapper from 'components/PageWrapper';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import SectionWrapper from 'components/shared/SectionWrapper';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import {
  GetCedarSystems,
  GetCedarSystems_cedarSystems as CedarSystem
} from 'queries/types/GetCedarSystems';
import { mockBookmarkInfo } from 'views/Sandbox/mockSystemData'; // TODO - replace mockSystemInfo/mockBookmarkInfo with dynamic data fetched from backend and CEDAR

import Table from './Table';
import { filterBookmarks } from './util';

import './index.scss';

export const SystemList = () => {
  const { t } = useTranslation('systemProfile');

  // TODO: query parameters and caching
  const { loading, error, data } = useQuery<GetCedarSystems>(
    GetCedarSystemsQuery
  );

  const systemsTableData = data?.cedarSystems
    ? (data.cedarSystems as CedarSystem[])
    : ([] as CedarSystem[]);

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <SectionWrapper borderBottom>
          <PageHeading className="margin-bottom-1">
            {t('systemProfile:header')}
          </PageHeading>
          <p>{t('systemProfile:subHeader')}</p>
          <SummaryBox heading="" className="easi-request__container">
            <p>{t('systemProfile:newRequest.info')}</p>
            <UswdsLink
              asCustom={Link}
              to="/system/request-type"
              className="easi-request__button-link"
            >
              {t('systemProfile:newRequest.button')}
            </UswdsLink>
          </SummaryBox>
        </SectionWrapper>

        {loading ? (
          <PageLoading />
        ) : (
          <>
            <PageHeading className="margin-bottom-0">
              {t('systemProfile:bookmark.header')}
            </PageHeading>

            <p className="margin-bottom-3">
              {t('systemProfile:bookmark.subtitle')}
            </p>

            {/* TODO: standardize/format error messages from CEDAR - either on FE or BE */}
            {error && (
              <ErrorAlert heading="System error">
                <ErrorAlertMessage
                  message={t('systemProfile:gql.fail')}
                  errorKey="system"
                />
              </ErrorAlert>
            )}

            {/* TEMPORARY mockSystemInfo/mockBookmarkInfo data until we get live data from CEDAR as well as backend storage per EASi-1470 */}
            {mockBookmarkInfo.length === 0 ? (
              <Grid tablet={{ col: 12 }} className="margin-bottom-5">
                <Alert type="info" className="padding-1">
                  <h3 className="margin-0">
                    {t('systemProfile:noBookmark.header')}
                  </h3>
                  <div>
                    <span className="margin-0">
                      {t('systemProfile:noBookmark.text1')}
                    </span>
                    <BookmarkCardIcon size="sm" color="black" />
                    <span className="margin-0">
                      {t('systemProfile:noBookmark.text2')}
                    </span>
                  </div>
                </Alert>
              </Grid>
            ) : (
              <CardGroup className="margin-bottom-3">
                {filterBookmarks(systemsTableData, mockBookmarkInfo)}
              </CardGroup>
            )}

            <Table
              systems={systemsTableData}
              savedBookmarks={mockBookmarkInfo}
            />
          </>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemList;
