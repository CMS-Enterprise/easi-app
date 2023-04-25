import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';

import Divider from 'components/shared/Divider';
import { RequestReviewForTRBAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {} from 'queries/types/GetTrbAdviceLetter';
import {
  RequestReviewForTRBAdviceLetter,
  RequestReviewForTRBAdviceLetterVariables
} from 'queries/types/RequestReviewForTRBAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { StepComponentProps } from 'types/technicalAssistance';

import ReviewAdviceLetter from '../AdminHome/components/ReviewAdviceLetter';
import Pager from '../RequestForm/Pager';

const InternalReview = ({
  trbRequestId,
  adviceLetter,
  adviceLetterStatus,
  setFormAlert,
  setStepSubmit,
  setIsStepSubmitting
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [requestReview, { loading: isSubmitting }] = useMutation<
    RequestReviewForTRBAdviceLetter,
    RequestReviewForTRBAdviceLetterVariables
  >(RequestReviewForTRBAdviceLetterQuery, {
    variables: {
      id: trbRequestId
    }
  });

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <div id="trbAdviceInternalReview">
      {/* Internal Review */}
      <ReviewAdviceLetter
        adviceLetter={adviceLetter}
        className="margin-top-5 margin-bottom-4"
        showEditLinks
      />

      <Divider />

      {
        /* Internal review needed alert */
        (adviceLetterStatus === TRBAdviceLetterStatus.IN_PROGRESS ||
          adviceLetterStatus === TRBAdviceLetterStatus.READY_FOR_REVIEW) && (
          <Alert
            type="warning"
            heading={t('adviceLetterForm.internalReviewNeeded.heading')}
            className="margin-top-4 margin-bottom-5"
          >
            {t('adviceLetterForm.internalReviewNeeded.text')}
          </Alert>
        )
      }

      {/* Form pager buttons */}
      <Pager
        back={{
          outline: true,
          onClick: () => history.push(`/trb/${trbRequestId}/advice/next-steps`)
        }}
        next={{
          text: 'Request internal review',
          disabled:
            isSubmitting ||
            adviceLetterStatus !== TRBAdviceLetterStatus.IN_PROGRESS,
          onClick: () => {
            requestReview()
              .then(() => history.push(`/trb/${trbRequestId}/advice`))
              .catch(error => {
                if (error instanceof ApolloError) {
                  setFormAlert({
                    type: 'error',
                    message: t('adviceLetterForm.error', {
                      action: 'submitting',
                      type: 'advice letter for internal review'
                    })
                  });
                }
              });
          }
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </div>
  );
};

export default InternalReview;
