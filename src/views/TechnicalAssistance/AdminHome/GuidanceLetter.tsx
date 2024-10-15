import React from 'react';
import { useTranslation } from 'react-i18next';

import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import useCacheQuery from 'hooks/useCacheQuery';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBGuidanceLetterStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';

import ReviewAdviceLetter from './components/ReviewAdviceLetter';
import TrbAdminWrapper from './components/TrbAdminWrapper';

const GuidanceLetter = ({
  trbRequest,
  requesterString,
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
      activePage="guidance"
      trbRequestId={id}
      title={t('adminHome.guidanceLetter')}
      description={t('guidanceLetter.introText')}
      disableStep={
        taskStatuses?.adviceLetterStatus ===
        TRBGuidanceLetterStatus.CANNOT_START_YET
      }
      statusTagProps={{
        status:
          taskStatuses?.adviceLetterStatus ||
          TRBGuidanceLetterStatus.CANNOT_START_YET,
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
      pdfExportProps={
        adviceLetter
          ? {
              label: t('guidanceLetter.downloadAsPdf'),
              filename: `guidance letter ${id}.pdf`,
              title: t('guidanceLetterForm.heading')
            }
          : undefined
      }
    >
      {
        // If guidance letter status is CANNOT_START_YET, show alert message
        adviceLetterStatus === 'CANNOT_START_YET' ? (
          <Alert type="info" slim>
            {t('guidanceLetter.alerts.info')}
          </Alert>
        ) : (
          <>
            {data && adviceLetter && (
              <ReviewAdviceLetter
                adviceLetter={adviceLetter}
                trbRequestId={trbRequest.id}
                trbRequest={data.trbRequest}
                requesterString={requesterString || ''}
                editable={false}
                className="margin-top-6"
              />
            )}
          </>
        )
      }
    </TrbAdminWrapper>
  );
};

export default GuidanceLetter;
