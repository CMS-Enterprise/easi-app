import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import {
  DeleteTrbRecommendationQuery,
  GetTrbAdviceLetterQuery,
  RequestReviewForTRBAdviceLetterQuery
} from 'queries/TrbAdviceLetterQueries';
import {
  DeleteTRBRecommendation,
  DeleteTRBRecommendationVariables
} from 'queries/types/DeleteTRBRecommendation';
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
  setIsStepSubmitting,
  stepsCompleted,
  setStepsCompleted
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [requestReview, { loading: isSubmitting }] = useMutation<
    RequestReviewForTRBAdviceLetter,
    RequestReviewForTRBAdviceLetterVariables
  >(RequestReviewForTRBAdviceLetterQuery, {
    variables: {
      id: adviceLetter.id
    }
  });

  const [remove] = useMutation<
    DeleteTRBRecommendation,
    DeleteTRBRecommendationVariables
  >(DeleteTrbRecommendationQuery, {
    refetchQueries: [
      {
        query: GetTrbAdviceLetterQuery,
        variables: {
          id: trbRequestId
        }
      }
    ]
  });

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <div id="trbAdviceInternalReview">
      {/* Internal Review */}
      <ReviewAdviceLetter
        trbRequestId={trbRequestId}
        adviceLetter={adviceLetter}
        className="margin-top-5 margin-bottom-4"
        recommendationActions={{
          setReorderError: error =>
            setFormAlert(error ? { type: 'error', message: error } : null),
          edit: recommendation =>
            history.push(`/trb/${trbRequestId}/advice/recommendations/form`, {
              recommendation: {
                ...recommendation,
                links: recommendation.links.map(link => ({ link }))
              }
            }),
          remove: recommendation =>
            remove({ variables: { id: recommendation.id } }).catch(() =>
              setFormAlert({
                type: 'error',
                message: t('adviceLetterForm.error', {
                  action: 'removing',
                  type: 'recommendation'
                })
              })
            )
        }}
        showSectionEditLinks
      />

      <Divider />

      {/* Internal review needed alert */}
      <Alert
        type="warning"
        heading={t('guidanceLetterForm.internalReviewNeeded.heading')}
        className="margin-top-4 margin-bottom-5"
      >
        {t('guidanceLetterForm.internalReviewNeeded.text')}
      </Alert>

      {/* Form pager buttons */}
      <Pager
        back={{
          outline: true,
          onClick: () => history.push(`/trb/${trbRequestId}/advice/next-steps`)
        }}
        next={{
          text: t(
            `adviceLetterForm.${
              adviceLetterStatus === TRBAdviceLetterStatus.IN_PROGRESS
                ? 'requestInternalReview'
                : 'requestAnotherInternalReview'
            }`
          ),
          disabled: isSubmitting,
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
        buttons={[
          <Trans i18nKey="technicalAssistance:adviceLetterForm.progressToNextStep">
            one
            <Button
              type="button"
              unstyled
              onClick={() => {
                if (
                  setStepsCompleted &&
                  stepsCompleted &&
                  !stepsCompleted?.includes('internal-review')
                ) {
                  setStepsCompleted([...stepsCompleted, 'internal-review']);
                }
                history.push(`/trb/${trbRequestId}/advice/review`);
              }}
            >
              button
            </Button>
          </Trans>
        ]}
        taskListUrl={`/trb/${trbRequestId}/advice`}
        saveExitText={t('guidanceLetterForm.returnToRequest')}
        submitDisabled
        border={false}
      />
    </div>
  );
};

export default InternalReview;
