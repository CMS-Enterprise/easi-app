import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { IT_GOV_EMAIL } from 'constants/externalUrls';
import { ITGovFeedbackStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { TaskListItemDateInfo } from 'types/taskList';

const GovTaskFeedbackFromInitialReview = ({
  id,
  itGovTaskStatuses,
  governanceRequestFeedbacks,
  governanceRequestFeedbackCompletedAt
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'feedbackFromInitialReview';
  const { t } = useTranslation('itGov');

  // Completed date
  let dateInfo: TaskListItemDateInfo;
  if (
    itGovTaskStatuses.feedbackFromInitialReviewStatus ===
      ITGovFeedbackStatus.COMPLETED &&
    governanceRequestFeedbackCompletedAt
  )
    dateInfo = {
      label: 'completed',
      value: governanceRequestFeedbackCompletedAt
    };

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
            {/* TODO: EASI-3088 - update feedback link */}
            <UswdsReactLink to={`/governance-task-list/${id}/feedback`}>
              {t(`button.viewFeedback`)}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskFeedbackFromInitialReview;
