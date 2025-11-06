import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import {
  GetTRBGuidanceLetterDocument,
  TRBGuidanceLetterStatus,
  useDeleteTRBGuidanceLetterInsightMutation,
  useRequestReviewForTRBGuidanceLetterMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Divider from 'components/Divider';
import { StepComponentProps } from 'types/technicalAssistance';

import Pager from '../../../Requester/RequestForm/Pager';
import ReviewGuidanceLetter from '../../_components/ReviewGuidanceLetter';

const InternalReview = ({
  trbRequestId,
  guidanceLetter,
  guidanceLetterStatus,
  setIsStepSubmitting,
  stepsCompleted,
  setStepsCompleted
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [requestReview, { loading: isSubmitting }] =
    useRequestReviewForTRBGuidanceLetterMutation({
      variables: {
        id: guidanceLetter.id
      }
    });

  const [remove] = useDeleteTRBGuidanceLetterInsightMutation({
    refetchQueries: [
      {
        query: GetTRBGuidanceLetterDocument,
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
        insightActions={{
          edit: insight =>
            history.push(`/trb/${trbRequestId}/guidance/insights/form`, {
              insight: {
                ...insight,
                links: insight.links.map(link => ({ link }))
              }
            }),
          remove: insight => {
            remove({ variables: { id: insight.id } });
          }
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
            requestReview().then(() =>
              history.push(`/trb/${trbRequestId}/guidance`)
            );
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
