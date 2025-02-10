import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { IT_GOV_EMAIL } from 'constants/externalUrls';
import {
  GovernanceRequestFeedbackTargetForm,
  ITGovFeedbackStatus
} from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { TaskListItemDateInfo } from 'types/taskList';

const GovTaskFeedbackFromInitialReview = ({
  id,
  itGovTaskStatuses: { feedbackFromInitialReviewStatus },
  state,
  governanceRequestFeedbacks,
  governanceRequestFeedbackCompletedAt
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'feedbackFromInitialReview';
  const { t } = useTranslation('itGov');

  // Completed date
  let dateInfo: TaskListItemDateInfo;
  if (
    feedbackFromInitialReviewStatus === ITGovFeedbackStatus.COMPLETED &&
    governanceRequestFeedbackCompletedAt
  )
    dateInfo = {
      label: 'completed',
      value: governanceRequestFeedbackCompletedAt
    };

  const hasFeedback = useMemo(() => {
    // If initial feedback step has not been started, return false
    if (feedbackFromInitialReviewStatus === ITGovFeedbackStatus.CANT_START)
      return false;

    // Return true if request has feedback on Intake Request
    return !!governanceRequestFeedbacks.find(
      ({ targetForm }) =>
        targetForm === GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST
    );
  }, [governanceRequestFeedbacks, feedbackFromInitialReviewStatus]);

  const showReviewInfo =
    feedbackFromInitialReviewStatus === ITGovFeedbackStatus.CANT_START ||
    feedbackFromInitialReviewStatus === ITGovFeedbackStatus.IN_REVIEW;

  const showNoFeedbackInfo =
    feedbackFromInitialReviewStatus === ITGovFeedbackStatus.COMPLETED &&
    !hasFeedback;

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={feedbackFromInitialReviewStatus}
      state={state}
      statusDateInfo={dateInfo}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Info alert about review or no feedback */}
        {(showReviewInfo || showNoFeedbackInfo) && (
          <Alert slim type="info">
            <Trans
              i18nKey={`itGov:taskList.step.${stepKey}.${
                showReviewInfo ? 'reviewInfo' : 'noFeedbackInfo'
              }`}
              components={{
                a: <Link href={`mailto:${IT_GOV_EMAIL}`}> </Link>,
                email: IT_GOV_EMAIL
              }}
            />
          </Alert>
        )}

        {/* Link to view feedback */}
        {hasFeedback && (
          <div className="margin-top-2">
            <UswdsReactLink to={`/governance-task-list/${id}/feedback`}>
              {t('button.viewRequestedEdits')}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskFeedbackFromInitialReview;
