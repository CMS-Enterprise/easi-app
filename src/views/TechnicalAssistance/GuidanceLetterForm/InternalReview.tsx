import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import {
  DeleteTrbRecommendationQuery,
  GetTrbGuidanceLetterQuery,
  RequestReviewForTRBGuidanceLetterQuery
} from 'queries/TrbGuidanceLetterQueries';
import {
  DeleteTRBRecommendation,
  DeleteTRBRecommendationVariables
} from 'queries/types/DeleteTRBRecommendation';
import {
  RequestReviewForTRBGuidanceLetter,
  RequestReviewForTRBGuidanceLetterVariables
} from 'queries/types/RequestReviewForTRBGuidanceLetter';
import { TRBGuidanceLetterStatus } from 'types/graphql-global-types';
import { StepComponentProps } from 'types/technicalAssistance';

import ReviewGuidanceLetter from '../AdminHome/components/ReviewGuidanceLetter';
import Pager from '../RequestForm/Pager';

const InternalReview = ({
  trbRequestId,
  guidanceLetter,
  guidanceLetterStatus,
  setFormAlert,
  setIsStepSubmitting,
  stepsCompleted,
  setStepsCompleted
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [requestReview, { loading: isSubmitting }] = useMutation<
    RequestReviewForTRBGuidanceLetter,
    RequestReviewForTRBGuidanceLetterVariables
  >(RequestReviewForTRBGuidanceLetterQuery, {
    variables: {
      id: guidanceLetter.id
    }
  });

  const [remove] = useMutation<
    DeleteTRBRecommendation,
    DeleteTRBRecommendationVariables
  >(DeleteTrbRecommendationQuery, {
    refetchQueries: [
      {
        query: GetTrbGuidanceLetterQuery,
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
    <div id="trbGuidanceInternalReview">
      {/* Internal Review */}
      <ReviewGuidanceLetter
        trbRequestId={trbRequestId}
        guidanceLetter={guidanceLetter}
        className="margin-top-5 margin-bottom-4"
        recommendationActions={{
          setReorderError: error =>
            setFormAlert(error ? { type: 'error', message: error } : null),
          edit: recommendation =>
            history.push(`/trb/${trbRequestId}/guidance/insights/form`, {
              recommendation: {
                ...recommendation,
                links: recommendation.links.map(link => ({ link }))
              }
            }),
          remove: recommendation =>
            remove({ variables: { id: recommendation.id } }).catch(() =>
              setFormAlert({
                type: 'error',
                message: t('guidanceLetterForm.error', {
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
          onClick: () =>
            history.push(`/trb/${trbRequestId}/guidance/next-steps`)
        }}
        next={{
          text: t(
            `guidanceLetterForm.${
              guidanceLetterStatus === TRBGuidanceLetterStatus.IN_PROGRESS
                ? 'requestInternalReview'
                : 'requestAnotherInternalReview'
            }`
          ),
          disabled: isSubmitting,
          onClick: () => {
            requestReview()
              .then(() => history.push(`/trb/${trbRequestId}/guidance`))
              .catch(error => {
                if (error instanceof ApolloError) {
                  setFormAlert({
                    type: 'error',
                    message: t('guidanceLetterForm.error', {
                      action: 'submitting',
                      type: 'guidance letter for internal review'
                    })
                  });
                }
              });
          }
        }}
        buttons={[
          <Trans i18nKey="technicalAssistance:guidanceLetterForm.progressToNextStep">
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
                history.push(`/trb/${trbRequestId}/guidance/review`);
              }}
            >
              button
            </Button>
          </Trans>
        ]}
        taskListUrl={`/trb/${trbRequestId}/guidance`}
        saveExitText={t('guidanceLetterForm.returnToRequest')}
        submitDisabled
        border={false}
      />
    </div>
  );
};

export default InternalReview;
