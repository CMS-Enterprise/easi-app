import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Grid } from '@trussworks/react-uswds';
import { useUpdateTRBRequestFormStatusMutation } from 'gql/generated/graphql';

import Pager from './Pager';
import SubmittedRequest from './SubmittedRequest';
import WhatHappensNext from './WhatHappensNext';
import { FormStepComponentProps, StepSubmit } from '.';

function Check({
  request,
  stepUrl,
  taskListUrl,
  setStepSubmit,
  setIsStepSubmitting
}: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [update, { loading }] = useUpdateTRBRequestFormStatusMutation();

  const submitNoop: StepSubmit = async callback => {
    callback?.();
  };

  useEffect(() => {
    setStepSubmit(() => submitNoop);
  }, [setStepSubmit]);

  useEffect(() => {
    setIsStepSubmitting(loading);
  }, [setIsStepSubmitting, loading]);

  return (
    <>
      <SubmittedRequest
        request={request}
        showEditSectionLinks
        showRequestHeaderInfo
      />

      <Grid row gap>
        <Grid
          tablet={{ col: 12 }}
          desktop={{ col: 6 }}
          className="margin-top-2 margin-bottom-4"
        >
          <WhatHappensNext />
        </Grid>
      </Grid>

      <Pager
        back={{
          disabled: loading,
          onClick: () => {
            history.push(stepUrl.back);
          }
        }}
        next={{
          disabled: loading,
          onClick: () => {
            const doneUrl = `/trb/requests/${request.id}/done`;
            update({
              variables: { trbRequestId: request.id, isSubmitted: true }
            })
              .then(() => {
                history.push(doneUrl, { success: true });
              })
              .catch(() => {
                history.push(doneUrl, { success: false });
              });
          },
          text: t('check.submit')
        }}
        saveExitDisabled={loading}
        taskListUrl={taskListUrl}
        submit={submitNoop}
      />
    </>
  );
}

export default Check;
