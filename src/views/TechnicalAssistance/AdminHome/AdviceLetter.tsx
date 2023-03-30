import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Grid } from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import PDFExport from 'components/PDFExport';
import useCacheQuery from 'hooks/useCacheQuery';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';

import AdminAction from './components/AdminAction';
import AdminTaskStatusTag from './components/AdminTaskStatusTag';
import NoteBox from './components/NoteBox';
import ReviewAdviceLetter from './components/ReviewAdviceLetter';

import './AdviceLetter.scss';

const AdviceLetter = ({ trbRequestId, noteCount }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  // TRB request query
  const { data, loading } = useCacheQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: { id: trbRequestId }
  });

  const { adviceLetter, taskStatuses } = data?.trbRequest || {};

  const adviceLetterStatus = taskStatuses?.adviceLetterStatus;

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
            status={
              adviceLetterStatus || TRBAdviceLetterStatus.CANNOT_START_YET
            }
            name={author?.commonName!}
            date={adviceLetter?.modifiedAt || adviceLetter?.createdAt || ''}
            className="margin-bottom-205"
          />
        </Grid>
        <Grid tablet={{ col: 4 }}>
          <NoteBox trbRequestId={trbRequestId} noteCount={noteCount} />
        </Grid>
      </Grid>

      {
        // If advice letter status is CANNOT_START_YET, show alert message
        adviceLetterStatus === 'CANNOT_START_YET' ? (
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
            disabled={!adviceLetter}
          >
            <AdminAction
              trbRequestId={trbRequestId}
              className="margin-top-3 margin-bottom-5"
            />
            {adviceLetter && <ReviewAdviceLetter adviceLetter={adviceLetter} />}
          </PDFExport>
        )
      }
    </div>
  );
};

export default AdviceLetter;
