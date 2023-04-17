import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';

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

import ReviewAdviceLetter from './components/ReviewAdviceLetter';
import TrbAdminWrapper from './components/TrbAdminWrapper';

import './AdviceLetter.scss';

const AdviceLetter = ({
  trbRequest,
  assignLeadModalTrbRequestIdRef,
  assignLeadModalRef
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { id } = trbRequest;

  // TRB request query
  const { data, loading } = useCacheQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: { id }
  });

  const { adviceLetter, taskStatuses } = data?.trbRequest || {};

  const adviceLetterStatus = taskStatuses?.adviceLetterStatus;

  const author = adviceLetter?.author;

  // Page loading
  if (loading) return <PageLoading />;

  return (
    <TrbAdminWrapper
      activePage="advice"
      trbRequestId={id}
      title={t('adminHome.adviceLetter')}
      description={t('adviceLetter.introText')}
      disableStep={
        taskStatuses?.adviceLetterStatus ===
        TRBAdviceLetterStatus.CANNOT_START_YET
      }
      statusTagProps={{
        status:
          taskStatuses?.adviceLetterStatus ||
          TRBAdviceLetterStatus.CANNOT_START_YET,
        name: author?.commonName!,
        date: adviceLetter?.modifiedAt || adviceLetter?.createdAt || ''
      }}
      noteCount={trbRequest.adminNotes.length}
      adminActionProps={{
        status: trbRequest.status,
        state: trbRequest.state,
        assignLeadModalTrbRequestIdRef,
        assignLeadModalRef
      }}
    >
      {
        // If advice letter status is CANNOT_START_YET, show alert message
        adviceLetterStatus === 'CANNOT_START_YET' ? (
          <Alert type="info" slim>
            {t('adviceLetter.noAdviceLetter')}
          </Alert>
        ) : (
          /* Advice letter content */
          <PDFExport
            title={t('adminHome.adviceLetter')}
            filename={`Advice letter for ${data?.trbRequest?.name}`}
            label={t('adviceLetter.downloadAsPdf')}
            linkPosition="top"
            disabled={!adviceLetter}
          >
            {adviceLetter && <ReviewAdviceLetter adviceLetter={adviceLetter} />}
          </PDFExport>
        )
      }
    </TrbAdminWrapper>
  );
};

export default AdviceLetter;
