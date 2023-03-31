import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import TaskStatusTag from 'components/shared/TaskStatusTag';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTRBAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';
import { TRBFormStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { NotFoundPartial } from 'views/NotFound';

import SubmittedRequest from '../RequestForm/SubmittedRequest';

import NoteBox from './components/NoteBox';

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

  const { data: notes } = useCacheQuery<
    GetTrbAdminNotes,
    GetTrbAdminNotesVariables
  >(GetTRBAdminNotesQuery, {
    variables: {
      id: trbRequestId
    }
  });

  return (
    <Grid
      row
      gap="lg"
      className="trb-admin-home__initial-request-form"
      data-testid="trb-admin-home__initial-request-form"
      id={`trbAdminInitialRequestForm-${trbRequestId}`}
    >
      <Grid tablet={{ col: 8 }}>
        <h1 className="margin-top-0 margin-bottom-1 line-height-heading-2">
          {t('adminHome.subnav.initialRequestForm')}
        </h1>

        {!loading && request && (
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
        )}
      </Grid>
      <Grid tablet={{ col: 4 }}>
        <NoteBox
          trbRequestId={trbRequestId}
          noteCount={notes?.trbRequest.adminNotes.length || 0}
        />
      </Grid>

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
    </Grid>
  );
};

export default InitialRequestForm;
