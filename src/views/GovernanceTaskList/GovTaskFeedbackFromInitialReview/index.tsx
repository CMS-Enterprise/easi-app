import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { ITGovFeedbackStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntake } from 'types/itGov';

const GovTaskFeedbackFromInitialReview = ({
  itGovTaskStatuses,
  governanceRequestFeedbacks
}: ItGovTaskSystemIntake) => {
  const stepKey = 'feedbackFromInitialReview';
  const { t } = useTranslation('itGov');

  const hasFeedback = governanceRequestFeedbacks.length > 0;

  const showReviewInfo =
    itGovTaskStatuses.feedbackFromInitialReviewStatus ===
      ITGovFeedbackStatus.CANT_START ||
    itGovTaskStatuses.feedbackFromInitialReviewStatus ===
      ITGovFeedbackStatus.IN_REVIEW;

  const showNoFeedbackInfo =
    itGovTaskStatuses.feedbackFromInitialReviewStatus ===
      ITGovFeedbackStatus.COMPLETED && !hasFeedback;

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={itGovTaskStatuses.feedbackFromInitialReviewStatus}
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
            />
          </Alert>
        )}

        {/* Link to view feedback */}
        {hasFeedback && (
          <div className="margin-top-2">
            <UswdsReactLink to="./">{t(`button.viewFeedback`)}</UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskFeedbackFromInitialReview;
