import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Alert, Grid } from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import PDFExport from 'components/PDFExport';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';

import AdminAction from './components/AdminAction';
import AdminTaskStatusTag from './components/AdminTaskStatusTag';
import RequestNotes from './components/RequestNotes';
import ReviewAdviceLetter from './components/ReviewAdviceLetter';

import './AdviceLetter.scss';

const AdviceLetter = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  // TRB request query
  const { data, loading } = useQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: { id: trbRequestId }
  });

  const { adviceLetter, taskStatuses } = data?.trbRequest || {};

  /**
   * Advice letter status
   *
   * Defaults to `CANNOT_START_YET` to fix issue where query returns undefined if no advice letter is present
   */
  const adviceLetterStatus =
    taskStatuses?.adviceLetterStatus || TRBAdviceLetterStatus.CANNOT_START_YET;

  const author = adviceLetter?.author;

  // Page loading
  if (loading) return <PageLoading />;

  return (
    <div
      className="trb-admin-home__advice"
      data-testid="trb-admin-home__advice"
      id={`trbAdminAdviceLetter-${trbRequestId}`}
    >
      <Grid row gap="lg">
        <Grid tablet={{ col: 8 }}>
          <h1 className="margin-top-0 margin-bottom-05">
            {t('adminHome.subnav.adviceLetter')}
          </h1>
          <p className="margin-y-0 line-height-body-5 font-body-md">
            {t('adviceLetter.introText')}
          </p>

          {/* Status tag */}
          <AdminTaskStatusTag
            status={adviceLetterStatus}
            name={author?.commonName!}
            date={adviceLetter?.modifiedAt || adviceLetter?.createdAt || ''}
            className="margin-bottom-205"
          />
        </Grid>
        <Grid tablet={{ col: 4 }}>
          <RequestNotes trbRequestId={trbRequestId} />
        </Grid>
      </Grid>

      {
        // If no advice letter, show alert message
        !adviceLetter ? (
          <Alert type="info" slim>
            {t('adviceLetter.noAdviceLetter')}
          </Alert>
        ) : (
          /* Advice letter content */
          <PDFExport
            title={t('adminHome.subnav.adviceLetter')}
            filename={`Advice letter for ${data?.trbRequest?.name}`}
            label={t('adviceLetter.downloadAsPdf')}
            linkPosition="top"
          >
            <AdminAction className="margin-top-3 margin-bottom-5" />
            <ReviewAdviceLetter adviceLetter={adviceLetter} />
          </PDFExport>
        )
      }
    </div>
  );
};

export default AdviceLetter;
