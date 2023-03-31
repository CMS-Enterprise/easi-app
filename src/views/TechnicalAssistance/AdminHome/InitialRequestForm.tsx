import React from 'react';
import { useTranslation } from 'react-i18next';

import PageLoading from 'components/PageLoading';
import TaskStatusTag from 'components/shared/TaskStatusTag';
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

const InitialRequestForm = ({
  trbRequestId,
  requesterString,
  submissionDate
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, error, loading } = useCacheQuery<
    GetTrbRequest,
    GetTrbRequestVariables
  >(GetTrbRequestQuery, {
    variables: { id: trbRequestId }
  });

  const request: TrbRequest | undefined = data?.trbRequest;

  return (
    <div
      className="trb-admin-home__initial-request-form"
      data-testid="trb-admin-home__initial-request-form"
      id={`trbAdminInitialRequestForm-${trbRequestId}`}
    >
      {loading && <PageLoading />}
      {error && <NotFoundPartial />}
      {request && (
        <>
          <h1 className="margin-top-0 margin-bottom-1 line-height-heading-2">
            {t('adminHome.subnav.initialRequestForm')}
          </h1>

          <div className="display-flex flex-align-center line-height-body-5">
            <TaskStatusTag status={request.taskStatuses.formStatus} />
            {request.taskStatuses.formStatus === TRBFormStatus.COMPLETED && (
              <div className="text-base margin-left-05">
                {t('adminHome.byNameOnDate', {
                  name: requesterString,
                  date: submissionDate
                })}
              </div>
            )}
          </div>

          <SubmittedRequest
            request={request}
            showSectionHeadingDescription
            canRemoveDocument={false}
          />
        </>
      )}
    </div>
  );
};

export default InitialRequestForm;
