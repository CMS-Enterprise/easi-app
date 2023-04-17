import React from 'react';
import { useTranslation } from 'react-i18next';

import PageLoading from 'components/PageLoading';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';
import { TRBFormStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { NotFoundPartial } from 'views/NotFound';

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
      disableStep={
        trbRequest.taskStatuses.formStatus === TRBFormStatus.IN_PROGRESS
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
