import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import PageLoading from 'components/PageLoading';
import TaskStatusTag from 'components/shared/TaskStatusTag';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { NotFoundPartial } from 'views/NotFound';

import SubmittedRequest from '../RequestForm/SubmittedRequest';

const InitialRequestForm = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, error, loading } = useQuery<
    GetTrbRequest,
    GetTrbRequestVariables
  >(GetTrbRequestQuery, {
    variables: { id: trbRequestId }
  });

  const request: TrbRequest | undefined = data?.trbRequest;

  return (
    <>
      {loading && <PageLoading />}
      {error && <NotFoundPartial />}
      {request && (
        <div
          className="trb-admin-home__initial-request-form"
          data-testid="trb-admin-home__initial-request-form"
          id={`trbAdminInitialRequestForm-${trbRequestId}`}
        >
          <h1 className="margin-y-0">
            {t('adminHome.subnav.initialRequestForm')}
          </h1>

          <TaskStatusTag status={request.taskStatuses.formStatus} />
          <SubmittedRequest request={request} showSectionHeadingDescription />
        </div>
      )}
    </>
  );
};

export default InitialRequestForm;
