import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import GetTrbRequestQuery from 'gql/legacyGQL/GetTrbRequestQuery';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'gql/legacyGQL/types/GetTrbRequest';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import useCacheQuery from 'hooks/useCacheQuery';
import { TRBFormStatus, TRBRequestStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';

import SubmittedRequest from '../RequestForm/SubmittedRequest';

import TrbAdminWrapper from './components/TrbAdminWrapper';

const InitialRequestForm = ({
  trbRequest,
  requesterString,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { id } = trbRequest;

  const { data, error, loading } = useCacheQuery<
    GetTrbRequest,
    GetTrbRequestVariables
  >(GetTrbRequestQuery, {
    variables: { id }
  });

  const request: TrbRequest | undefined = data?.trbRequest;

  return (
    <TrbAdminWrapper
      activePage="initial-request-form"
      trbRequestId={id}
      title={t('adminHome.initialRequestForm')}
      noteCount={trbRequest.adminNotes.length}
      renderBottom
      disableStep={
        trbRequest.status === TRBRequestStatus.READY_FOR_CONSULT ||
        trbRequest.status === TRBRequestStatus.CONSULT_COMPLETE ||
        trbRequest.status === TRBRequestStatus.DRAFT_GUIDANCE_LETTER ||
        trbRequest.status === TRBRequestStatus.GUIDANCE_LETTER_IN_REVIEW
      }
      statusTagProps={{
        status: trbRequest.taskStatuses.formStatus || TRBFormStatus.IN_PROGRESS,
        name: requesterString || '',
        date: request?.form.submittedAt || ''
      }}
      adminActionProps={{
        status: trbRequest.status,
        state: trbRequest.state,
        assignLeadModalTrbRequestIdRef,
        assignLeadModalRef
      }}
    >
      {loading && <PageLoading />}
      {error && <NotFoundPartial />}

      {/* Alert for  initial request form still in draft */}
      {request &&
        request.taskStatuses.formStatus !== TRBFormStatus.COMPLETED && (
          <Alert type="info" slim>
            {t('adminHome.requestInDraftAlt')}
          </Alert>
        )}

      {request && (
        <>
          <SubmittedRequest
            request={request}
            showSectionHeadingDescription
            canRemoveDocument={false}
          />
        </>
      )}
    </TrbAdminWrapper>
  );
};

export default InitialRequestForm;
