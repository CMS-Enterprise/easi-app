import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetTRBGuidanceLetterQuery } from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { TRBGuidanceLetterStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';

import ReviewGuidanceLetter from './components/ReviewGuidanceLetter';
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
  const { data, loading } = useGetTRBGuidanceLetterQuery({
    variables: { id }
  });

  const { guidanceLetter, taskStatuses } = data?.trbRequest || {};

  const guidanceLetterStatus = taskStatuses?.guidanceLetterStatus;

  const author = guidanceLetter?.author;

  // Page loading
  if (loading) return <PageLoading />;

  return (
    <TrbAdminWrapper
      activePage="guidance"
      trbRequestId={id}
      title={t('adminHome.guidanceLetter')}
      description={t('guidanceLetter.introText')}
      disableStep={
        taskStatuses?.guidanceLetterStatus ===
        TRBGuidanceLetterStatus.CANNOT_START_YET
      }
      statusTagProps={{
        status:
          taskStatuses?.guidanceLetterStatus ||
          TRBGuidanceLetterStatus.CANNOT_START_YET,
        name: author?.commonName!,
        date: guidanceLetter?.modifiedAt || guidanceLetter?.createdAt || ''
      }}
      noteCount={trbRequest.adminNotes.length}
      adminActionProps={{
        status: trbRequest.status,
        state: trbRequest.state,
        assignLeadModalTrbRequestIdRef,
        assignLeadModalRef
      }}
      pdfExportProps={
        guidanceLetter
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
        guidanceLetterStatus === 'CANNOT_START_YET' ? (
          <Alert type="info" slim>
            {t('guidanceLetter.alerts.info')}
          </Alert>
        ) : (
          <>
            {data && guidanceLetter && (
              <ReviewGuidanceLetter
                guidanceLetter={guidanceLetter}
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
